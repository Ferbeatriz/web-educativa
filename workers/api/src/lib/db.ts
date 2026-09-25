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

// ============================================================
// PROGRESO
// ============================================================

export interface ProgresoItem {
  leccion_id: string;
  materia_id: string;
  xp_ganados: number;
  completada_en: string;
}

export interface ResumenProgreso {
  xp_total: number;
  lecciones_completadas: number;
  materias_exploradas: number;
}

/**
 * Marca una lección como completada.
 * Si ya estaba completada, no hace nada (gracias al UNIQUE constraint).
 * Devuelve true si fue insertado nuevo, false si ya existía.
 */
export async function marcarLeccionCompletada(
  db: D1Database,
  alumna_id: number,
  leccion_id: string,
  materia_id: string
): Promise<{ insertado: boolean; xp_ganados: number }> {
  // 1. Verificar si ya está completada
  const existente = await db
    .prepare('SELECT id FROM progreso WHERE alumna_id = ? AND leccion_id = ?')
    .bind(alumna_id, leccion_id)
    .first<{ id: number }>();

  if (existente) {
    return { insertado: false, xp_ganados: 0 };
  }

  // 2. Insertar el nuevo progreso (50 XP fijo)
  const XP_POR_LECCION = 50;
  await db
    .prepare(
      'INSERT INTO progreso (alumna_id, leccion_id, materia_id, xp_ganados) VALUES (?, ?, ?, ?)'
    )
    .bind(alumna_id, leccion_id, materia_id, XP_POR_LECCION)
    .run();

  return { insertado: true, xp_ganados: XP_POR_LECCION };
}

/**
 * Obtiene el resumen del progreso (XP total, lecciones completadas, materias exploradas).
 */
export async function getResumenProgreso(
  db: D1Database,
  alumna_id: number
): Promise<ResumenProgreso> {
  const result = await db
    .prepare(
      `SELECT 
         COALESCE(SUM(xp_ganados), 0) AS xp_total,
         COUNT(*) AS lecciones_completadas,
         COUNT(DISTINCT materia_id) AS materias_exploradas
       FROM progreso
       WHERE alumna_id = ?`
    )
    .bind(alumna_id)
    .first<ResumenProgreso>();

  return result ?? { xp_total: 0, lecciones_completadas: 0, materias_exploradas: 0 };
}

/**
 * Obtiene el progreso completo de una alumna (todas las lecciones completadas).
 */
export async function getProgresoCompleto(
  db: D1Database,
  alumna_id: number
): Promise<ProgresoItem[]> {
  const result = await db
    .prepare(
      `SELECT leccion_id, materia_id, xp_ganados, completada_en
       FROM progreso
       WHERE alumna_id = ?
       ORDER BY completada_en DESC`
    )
    .bind(alumna_id)
    .all<ProgresoItem>();

  return result.results ?? [];
}

/**
 * Verifica si una alumna ya completó una lección específica.
 */
export async function leccionCompletada(
  db: D1Database,
  alumna_id: number,
  leccion_id: string
): Promise<boolean> {
  const result = await db
    .prepare('SELECT id FROM progreso WHERE alumna_id = ? AND leccion_id = ?')
    .bind(alumna_id, leccion_id)
    .first<{ id: number }>();

  return result !== null;
}
