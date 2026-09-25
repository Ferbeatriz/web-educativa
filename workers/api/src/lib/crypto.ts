/**
 * Funciones de criptografía para el Worker.
 * Usa Web Crypto API (nativa, rápida, compatible con el plan free).
 */

const ITERATIONS = 100000;
const KEY_LENGTH = 32;
const HASH_ALGO = 'SHA-256';

/**
 * Convierte un ArrayBuffer a base64
 */
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convierte base64 a Uint8Array
 */
function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Genera un hash PBKDF2 de una contraseña.
 * Formato: pbkdf2$sha256$<iteraciones>$<salt_b64>$<hash_b64>
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const salt = crypto.getRandomValues(new Uint8Array(16));

  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: ITERATIONS,
      hash: HASH_ALGO,
    },
    baseKey,
    KEY_LENGTH * 8
  );

  const saltB64 = bufferToBase64(salt.buffer);
  const hashB64 = bufferToBase64(derivedBits);

  return `pbkdf2$sha256$${ITERATIONS}$${saltB64}$${hashB64}`;
}

/**
 * Verifica una contraseña contra un hash PBKDF2.
 * Devuelve true si coinciden, false si no.
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  try {
    const parts = storedHash.split('$');
    if (parts.length !== 5) return false;

    const [algo, hashName, iterStr, saltB64, expectedHashB64] = parts;
    if (algo !== 'pbkdf2') return false;

    const iterations = parseInt(iterStr, 10);
    const salt = base64ToBuffer(saltB64);

    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);

    const baseKey = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: iterations,
        hash: hashName.toUpperCase().replace('SHA', 'SHA-'),
      },
      baseKey,
      KEY_LENGTH * 8
    );

    const computedHashB64 = bufferToBase64(derivedBits);

    return timingSafeEqual(computedHashB64, expectedHashB64);
  } catch (err) {
    console.error('Error verifying password:', err);
    return false;
  }
}

/**
 * Comparación de strings en tiempo constante.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Genera un token de sesión aleatorio (32 bytes en base64url).
 */
export function generateSessionToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return bufferToBase64(bytes.buffer)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Genera el hash SHA-256 de un token (para guardar en BD).
 */
export async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return bufferToBase64(hashBuffer);
}
