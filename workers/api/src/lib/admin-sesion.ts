/**
 * Sesiones de administrador con tokens guardados en D1.
 * Similar al sistema de sesiones de alumnas.
 */

const DURACION_HORAS = 24;

/**
 * Genera un token de sesión admin aleatorio.
 */
export function generarTokenAdmin(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Genera el hash SHA-256 de un token (para guardar en BD).
 */
export async function hashTokenAdmin(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(hashBuffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Guarda un token admin en D1.
 * Retorna la fecha de expiración en ISO.
 */
export async function guardarTokenAdmin(
  db: D1Database,
  tokenHash: string
): Promise<string> {
  const expira = new Date();
  expira.setHours(expira.getHours() + DURACION_HORAS);
  const expiraISO = expira.toISOString().replace('T', ' ').substring(0, 19);

  await db
    .prepare(
      'INSERT INTO admin_sesiones (token_hash, expira_en) VALUES (?, ?)'
    )
    .bind(tokenHash, expiraISO)
    .run();

  return expiraISO;
}

/**
 * Verifica si un token admin es válido.
 */
export async function verificarTokenAdmin(
  db: D1Database,
  tokenHash: string
): Promise<boolean> {
  const result = await db
    .prepare(
      "SELECT id FROM admin_sesiones WHERE token_hash = ? AND expira_en > datetime('now')"
    )
    .bind(tokenHash)
    .first<{ id: number }>();

  return result !== null;
}

/**
 * Elimina un token admin (logout).
 */
export async function eliminarTokenAdmin(
  db: D1Database,
  tokenHash: string
): Promise<void> {
  await db
    .prepare('DELETE FROM admin_sesiones WHERE token_hash = ?')
    .bind(tokenHash)
    .run();
}

/**
 * Extrae el token del header Authorization.
 */
export function extraerTokenAdmin(request: Request): string | null {
  const auth = request.headers.get('Authorization');
  if (!auth) return null;
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1] || null;
}
