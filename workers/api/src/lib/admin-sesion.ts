/**
 * Sesiones de administrador con cookies firmadas.
 */

const DURACION_HORAS = 24;
const NOMBRE_COOKIE = 'admin_session';

function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBuffer(s: string): Uint8Array {
  const base64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function importarClaveHMAC(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function crearCookieAdmin(secret: string): Promise<string> {
  const payload = {
    admin: true,
    exp: Math.floor(Date.now() / 1000) + DURACION_HORAS * 3600,
  };
  const payloadJson = JSON.stringify(payload);
  const payloadB64 = btoa(payloadJson).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const key = await importarClaveHMAC(secret);
  const encoder = new TextEncoder();
  const firma = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadB64));
  const firmaB64 = bufferToBase64Url(firma);

  return `${payloadB64}.${firmaB64}`;
}

export async function verificarCookieAdmin(
  cookie: string,
  secret: string
): Promise<boolean> {
  try {
    const parts = cookie.split('.');
    if (parts.length !== 2) return false;

    const [payloadB64, firmaB64] = parts;

    const key = await importarClaveHMAC(secret);
    const encoder = new TextEncoder();
    const firmaValida = await crypto.subtle.verify(
      'HMAC',
      key,
      base64UrlToBuffer(firmaB64),
      encoder.encode(payloadB64)
    );

    if (!firmaValida) return false;

    const payloadJson = atob(
      payloadB64.replace(/-/g, '+').replace(/_/g, '/') +
        '='.repeat((4 - (payloadB64.length % 4)) % 4)
    );
    const payload = JSON.parse(payloadJson);

    if (!payload.admin) return false;
    if (payload.exp < Math.floor(Date.now() / 1000)) return false;

    return true;
  } catch {
    return false;
  }
}

export function extraerCookieAdmin(request: Request): string | null {
  const cookies = request.headers.get('Cookie');
  if (!cookies) return null;

  const parts = cookies.split(';').map((c) => c.trim());
  for (const part of parts) {
    const [name, ...valueParts] = part.split('=');
    if (name === NOMBRE_COOKIE) {
      return valueParts.join('=');
    }
  }
  return null;
}

/**
 * Genera el header Set-Cookie para establecer la sesión admin.
 * El flag Secure se activa solo si el origen es HTTPS.
 */
export function headerSetCookieAdmin(cookie: string, isSecure: boolean = true): string {
  const secure = isSecure ? '; Secure' : '';
  return `${NOMBRE_COOKIE}=${cookie}; Path=/; HttpOnly${secure}; SameSite=Lax; Max-Age=${DURACION_HORAS * 3600}`;
}

/**
 * Genera el header Set-Cookie para eliminar la sesión admin.
 */
export function headerDeleteCookieAdmin(isSecure: boolean = true): string {
  const secure = isSecure ? '; Secure' : '';
  return `${NOMBRE_COOKIE}=; Path=/; HttpOnly${secure}; SameSite=Lax; Max-Age=0`;
}
