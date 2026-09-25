/**
 * Helpers para consultar la base de datos D1.
 * Todas las queries de auth viven acá.
 */

export interface Alumna {
  id: number;
  nombre: string;
  usuario: string;
  clase_id: number | null;
  activa: number;
  ultimo_login: string | null;
}

export interface MetodoAuth {
  id: number;
  alumna_id: number;
  tipo: string;
  credencial_hash: string;
  activo: number;
}

export interface Sesion {
  id: number;
  alumna_id: number;
  token_hash: string;
  expira_en: string;
}

/**
 * Busca una alumna por su usuario.
 */
export async function getAlumnaByUsuario(
  db: D1Database,
  usuario: string
): Promise<Alumna | null> {
  const result = await db
    .prepare('SELECT id, nombre, usuario, clase_id, activa, ultimo_login FROM alumnas WHERE usuario = ?')
    .bind(usuario)
    .first<Alumna>();
  return result ?? null;
}

/**
 * Busca el método de auth de tipo password de una alumna.
 */
export async function getMetodoPassword(
  db: D1Database,
  alumna_id: number
): Promise<MetodoAuth | null> {
  const result = await db
    .prepare(
      "SELECT id, alumna_id, tipo, credencial_hash, activo FROM metodos_auth WHERE alumna_id = ? AND tipo = 'password' AND activo = 1"
    )
    .bind(alumna_id)
    .first<MetodoAuth>();
  return result ?? null;
}

/**
 * Actualiza el último login de una alumna.
 */
export async function actualizarUltimoLogin(
  db: D1Database,
  alumna_id: number
): Promise<void> {
  await db
    .prepare("UPDATE alumnas SET ultimo_login = datetime('now') WHERE id = ?")
    .bind(alumna_id)
    .run();
}

/**
 * Crea una nueva sesión.
 */
export async function crearSesion(
  db: D1Database,
  alumna_id: number,
  token_hash: string,
  expira_en: string
): Promise<void> {
  await db
    .prepare(
      'INSERT INTO sesiones (alumna_id, token_hash, expira_en) VALUES (?, ?, ?)'
    )
    .bind(alumna_id, token_hash, expira_en)
    .run();
}

/**
 * Busca una sesión por el hash del token.
 */
export async function getSesionByTokenHash(
  db: D1Database,
  token_hash: string
): Promise<(Sesion & { nombre: string; usuario: string; ultimo_login: string | null }) | null> {
  const result = await db
    .prepare(
      `SELECT s.id, s.alumna_id, s.token_hash, s.expira_en, 
              a.nombre, a.usuario, a.ultimo_login
       FROM sesiones s
       JOIN alumnas a ON a.id = s.alumna_id
       WHERE s.token_hash = ? AND s.expira_en > datetime('now')`
    )
    .bind(token_hash)
    .first<Sesion & { nombre: string; usuario: string; ultimo_login: string | null }>();
  return result ?? null;
}

/**
 * Elimina una sesión (logout).
 */
export async function eliminarSesion(
  db: D1Database,
  token_hash: string
): Promise<void> {
  await db
    .prepare('DELETE FROM sesiones WHERE token_hash = ?')
    .bind(token_hash)
    .run();
}

/**
 * Limpia sesiones expiradas (mantenimiento).
 */
export async function limpiarSesionesExpiradas(db: D1Database): Promise<void> {
  await db
    .prepare("DELETE FROM sesiones WHERE expira_en <= datetime('now')")
    .run();
}

/**
 * Obtiene datos completos de la alumna incluyendo info de su clase.
 * Útil para la página de perfil.
 */
export async function getAlumnaCompleta(
  db: D1Database,
  alumna_id: number
): Promise<{
  id: number;
  nombre: string;
  usuario: string;
  activa: number;
  creada_en: string;
  ultimo_login: string | null;
  clase_nombre: string | null;
  clase_codigo: string | null;
} | null> {
  const result = await db
    .prepare(
      `SELECT a.id, a.nombre, a.usuario, a.activa, a.creada_en, a.ultimo_login,
              c.nombre AS clase_nombre, c.codigo AS clase_codigo
       FROM alumnas a
       LEFT JOIN clases c ON c.id = a.clase_id
       WHERE a.id = ?`
    )
    .bind(alumna_id)
    .first<{
      id: number;
      nombre: string;
      usuario: string;
      activa: number;
      creada_en: string;
      ultimo_login: string | null;
      clase_nombre: string | null;
      clase_codigo: string | null;
    }>();
  return result ?? null;
}
