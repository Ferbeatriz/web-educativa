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

// ============================================================
// LOGROS
// ============================================================

export interface LogroDesbloqueado {
  logro_id: string;
  desbloqueado_en: string;
}

/**
 * Devuelve todos los logros desbloqueados por una alumna.
 */
export async function getLogrosDesbloqueados(
  db: D1Database,
  alumna_id: number
): Promise<LogroDesbloqueado[]> {
  const result = await db
    .prepare(
      'SELECT logro_id, desbloqueado_en FROM logros_alumna WHERE alumna_id = ?'
    )
    .bind(alumna_id)
    .all<LogroDesbloqueado>();
  return result.results ?? [];
}

/**
 * Inserta un logro si no existe. Devuelve true si fue insertado nuevo.
 */
export async function insertarLogroSiNoExiste(
  db: D1Database,
  alumna_id: number,
  logro_id: string
): Promise<boolean> {
  const r = await db
    .prepare(
      'INSERT OR IGNORE INTO logros_alumna (alumna_id, logro_id) VALUES (?, ?)'
    )
    .bind(alumna_id, logro_id)
    .run();
  return (r.meta.changes ?? 0) > 0;
}

/**
 * Cuenta lecciones completadas por materia.
 */
export async function getLeccionesCompletadasPorMateria(
  db: D1Database,
  alumna_id: number
): Promise<{ materia_id: string; completadas: number; primera_completada_en: string; ultima_completada_en: string }[]> {
  const result = await db
    .prepare(
      `SELECT
         materia_id,
         COUNT(*) AS completadas,
         MIN(completada_en) AS primera_completada_en,
         MAX(completada_en) AS ultima_completada_en
       FROM progreso
       WHERE alumna_id = ?
       GROUP BY materia_id`
    )
    .bind(alumna_id)
    .all<{
      materia_id: string;
      completadas: number;
      primera_completada_en: string;
      ultima_completada_en: string;
    }>();
  return result.results ?? [];
}

/**
 * Devuelve los días únicos con al menos una lección completada,
 * ordenados ascendente. Formato: 'YYYY-MM-DD'.
 */
export async function getDiasActivos(
  db: D1Database,
  alumna_id: number
): Promise<string[]> {
  const result = await db
    .prepare(
      `SELECT DISTINCT DATE(completada_en) AS dia
       FROM progreso
       WHERE alumna_id = ?
       ORDER BY dia ASC`
    )
    .bind(alumna_id)
    .all<{ dia: string }>();
  return (result.results ?? []).map((r) => r.dia);
}

// ============================================================
// RESPUESTAS DE LECCIONES (con privacidad)
// ============================================================

export interface RespuestaItem {
  leccion_id: string;
  pregunta_id: string;
  tipo: string;
  respondida: number;
  es_correcta: number | null;
  respondida_en: string;
}

/**
 * Registra una respuesta de la alumna.
 * Usa alumna_hash, no alumna_id (privacidad).
 * Devuelve true si fue insertado nuevo.
 */
export async function registrarRespuesta(
  db: D1Database,
  alumna_hash: string,
  leccion_id: string,
  pregunta_id: string,
  tipo: 'multiple' | 'desarrollo' | 'vf',
  es_correcta: boolean | null
): Promise<boolean> {
  const existente = await db
    .prepare(
      'SELECT id FROM respuestas_lecciones WHERE alumna_hash = ? AND leccion_id = ? AND pregunta_id = ?'
    )
    .bind(alumna_hash, leccion_id, pregunta_id)
    .first<{ id: number }>();

  if (existente) {
    return false; // Ya estaba registrada (no duplicar)
  }

  await db
    .prepare(
      `INSERT INTO respuestas_lecciones 
       (alumna_hash, leccion_id, pregunta_id, tipo, respondida, es_correcta) 
       VALUES (?, ?, ?, ?, 1, ?)`
    )
    .bind(
      alumna_hash,
      leccion_id,
      pregunta_id,
      tipo,
      es_correcta === null ? null : es_correcta ? 1 : 0
    )
    .run();

  return true;
}

/**
 * Obtiene las respuestas de una alumna para una lección específica.
 * Usa alumna_hash (privacidad).
 */
export async function getRespuestasLeccion(
  db: D1Database,
  alumna_hash: string,
  leccion_id: string
): Promise<RespuestaItem[]> {
  const result = await db
    .prepare(
      `SELECT leccion_id, pregunta_id, tipo, respondida, es_correcta, respondida_en
       FROM respuestas_lecciones
       WHERE alumna_hash = ? AND leccion_id = ?
       ORDER BY respondida_en ASC`
    )
    .bind(alumna_hash, leccion_id)
    .all<RespuestaItem>();
  return result.results ?? [];
}

/**
 * Calcula el porcentaje de cumplimiento de una lección.
 * Necesita el total de preguntas (que viene del JSON de la lección).
 */
export async function calcularPorcentajeCumplimiento(
  db: D1Database,
  alumna_hash: string,
  leccion_id: string,
  total_preguntas: number
): Promise<number> {
  const result = await db
    .prepare(
      `SELECT COUNT(*) as respondidas
       FROM respuestas_lecciones
       WHERE alumna_hash = ? AND leccion_id = ? AND respondida = 1`
    )
    .bind(alumna_hash, leccion_id)
    .first<{ respondidas: number }>();

  const respondidas = result?.respondidas ?? 0;
  if (total_preguntas === 0) return 0;
  return Math.round((respondidas / total_preguntas) * 100);
}

/**
 * Obtiene las últimas N lecciones respondidas por una alumna.
 * Para el panel del admin (usa mapa_identidad para obtener el nombre).
 */
export async function getUltimasLeccionesPorAlumna(
  db: D1Database,
  alumna_hash: string,
  limite: number = 3
): Promise<{
  leccion_id: string;
  total_respuestas: number;
  correctas: number;
  incorrectas: number;
  desarrollo: number;
  ultima_respuesta: string;
}[]> {
  const result = await db
    .prepare(
      `SELECT
         leccion_id,
         COUNT(*) AS total_respuestas,
         SUM(CASE WHEN es_correcta = 1 THEN 1 ELSE 0 END) AS correctas,
         SUM(CASE WHEN es_correcta = 0 THEN 1 ELSE 0 END) AS incorrectas,
         SUM(CASE WHEN tipo = 'desarrollo' THEN 1 ELSE 0 END) AS desarrollo,
         MAX(respondida_en) AS ultima_respuesta
       FROM respuestas_lecciones
       WHERE alumna_hash = ?
       GROUP BY leccion_id
       ORDER BY ultima_respuesta DESC
       LIMIT ?`
    )
    .bind(alumna_hash, limite)
    .all<{
      leccion_id: string;
      total_respuestas: number;
      correctas: number;
      incorrectas: number;
      desarrollo: number;
      ultima_respuesta: string;
    }>();
  return result.results ?? [];
}

/**
 * Verifica si una alumna tiene consentimiento parental activo.
 */
export async function tieneConsentimiento(
  db: D1Database,
  alumna_id: number
): Promise<boolean> {
  const result = await db
    .prepare(
      'SELECT consentimiento_padre FROM consentimientos_tracking WHERE alumna_id = ? AND consentimiento_padre = 1'
    )
    .bind(alumna_id)
    .first<{ consentimiento_padre: number }>();
  return result !== null;
}

// ============================================================
// LOGROS POR MÉRITO (divisiones sin tutor, libro completo)
// ============================================================

/**
 * Cuenta los intentos de división acertados sin tutor (origen = 'problema_card').
 * Usa alumna_hash (privacidad).
 */
export async function contarDivisionesSinTutor(
  db: D1Database,
  alumna_hash: string
): Promise<number> {
  const result = await db
    .prepare(
      `SELECT COUNT(*) as total
       FROM intentos_ejercicios
       WHERE alumna_hash = ?
         AND origen = 'problema_card'
         AND error_type IS NULL
         AND paso_n IS NULL`
    )
    .bind(alumna_hash)
    .first<{ total: number }>();
  return result?.total ?? 0;
}

/**
 * Verifica si la alumna completó algún libro del Club de Lectura.
 * Los libros se identifican por tener un materia_id que NO es una materia estándar.
 */
export async function tieneLibroCompleto(
  db: D1Database,
  alumna_id: number
): Promise<boolean> {
  const MATERIAS_ESTANDAR = [
    'matematicas', 'lenguaje', 'historia', 'ingles', 'ciencias', 'programacion'
  ];
  const placeholders = MATERIAS_ESTANDAR.map(() => '?').join(',');
  const result = await db
    .prepare(
      `SELECT COUNT(*) as total
       FROM progreso
       WHERE alumna_id = ?
         AND materia_id NOT IN (${placeholders})`
    )
    .bind(alumna_id, ...MATERIAS_ESTANDAR)
    .first<{ total: number }>();
  return (result?.total ?? 0) > 0;
}

