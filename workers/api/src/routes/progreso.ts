/**
 * Endpoints de progreso:
 * - POST /api/progreso/completar      → Marca una lección como completada
 * - GET  /api/progreso/resumen        → Resumen (XP, nivel, lecciones)
 * - GET  /api/progreso/leccion/:id    → ¿Completó esta lección?
 * - GET  /api/progreso/completo       → Todas las lecciones completadas
 * - GET  /api/progreso/racha          → Racha de días consecutivos
 * - GET  /api/progreso/logros         → Estado de los logros
 * - GET  /api/progreso/por-materia    → Progreso agregado por materia
 * - POST /api/progreso/registrar-respuesta → Registra una respuesta
 * - POST /api/progreso/actualizar-avance   → Calcula porcentaje y notifica
 */

import { hashToken } from '../lib/crypto';
import {
  getSesionByTokenHash,
  marcarLeccionCompletada,
  getResumenProgreso,
  getProgresoCompleto,
  leccionCompletada,
  getLogrosDesbloqueados,
  insertarLogroSiNoExiste,
  getLeccionesCompletadasPorMateria,
  getDiasActivos,
  registrarRespuesta,
  tieneConsentimiento,
  calcularPorcentajeCumplimiento,
  getRespuestasLeccion,
  contarDivisionesSinTutor,
  tieneLibroCompleto,
} from '../lib/db';
import {
  notificarAdminLeccionCompletada,
  notificarAdminAvance,
  type EnvNotificacionAdmin,
} from '../lib/email';

export interface Env extends EnvNotificacionAdmin {
  DB: D1Database;
  ENVIRONMENT: string;
  APP_NAME: string;
  INTENTOS_SALT: string;
}

// ============================================================
// Sistema de niveles
// ============================================================

interface Nivel {
  numero: number;
  nombre: string;
  emoji: string;
  xp_minimo: number;
  xp_siguiente: number;
}

const NIVELES: Nivel[] = [
  { numero: 1, nombre: 'Aprendiz',    emoji: '🥚', xp_minimo: 0,    xp_siguiente: 100 },
  { numero: 2, nombre: 'Curiosa',     emoji: '🐣', xp_minimo: 100,  xp_siguiente: 250 },
  { numero: 3, nombre: 'Exploradora', emoji: '🦉', xp_minimo: 250,  xp_siguiente: 500 },
  { numero: 4, nombre: 'Aventurera',  emoji: '🗺️', xp_minimo: 500,  xp_siguiente: 1000 },
  { numero: 5, nombre: 'Sabia',       emoji: '📚', xp_minimo: 1000, xp_siguiente: 2000 },
  { numero: 6, nombre: 'Maestra',     emoji: '👑', xp_minimo: 2000, xp_siguiente: 999999 },
];

function calcularNivel(xp: number) {
  let actual = NIVELES[0];
  for (const nivel of NIVELES) {
    if (xp >= nivel.xp_minimo) actual = nivel;
    else break;
  }
  const xpEnNivel = xp - actual.xp_minimo;
  const xpParaSiguiente = actual.xp_siguiente - actual.xp_minimo;
  const porcentaje = Math.min(100, Math.round((xpEnNivel / xpParaSiguiente) * 100));

  return {
    numero: actual.numero,
    nombre: actual.nombre,
    emoji: actual.emoji,
    xp_total: xp,
    xp_en_nivel: xpEnNivel,
    xp_para_siguiente: xpParaSiguiente,
    xp_siguiente_total: actual.xp_siguiente,
    porcentaje,
    es_maximo: actual.numero === NIVELES.length,
  };
}

// ============================================================
// Helpers
// ============================================================

function extraerToken(request: Request): string | null {
  const auth = request.headers.get('Authorization');
  if (!auth) return null;
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1] || null;
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

async function getAlumnaAutenticada(
  request: Request,
  env: Env
): Promise<{ id: number; nombre: string; usuario: string } | null> {
  const token = extraerToken(request);
  if (!token) return null;

  const tokenHash = await hashToken(token);
  const sesion = await getSesionByTokenHash(env.DB, tokenHash);
  if (!sesion) return null;

  return {
    id: sesion.alumna_id,
    nombre: sesion.nombre,
    usuario: sesion.usuario,
  };
}

// ============================================================
// Catálogo de logros
// ============================================================

interface LogroCatalogo {
  id: string;
  emoji: string;
  titulo: string;
  descripcion: string;
}

const LOGROS: LogroCatalogo[] = [
  {
    id: 'primera_leccion',
    emoji: '🌱',
    titulo: 'Primera lección',
    descripcion: 'Completa tu primera lección.',
  },
  {
    id: 'materia_completa',
    emoji: '🏆',
    titulo: 'Materia completa',
    descripcion: 'Completa todas las lecciones de una materia.',
  },
  {
    id: 'racha_7',
    emoji: '🔥',
    titulo: 'Semana activa',
    descripcion: '7 días seguidos de actividad.',
  },
  {
    id: 'primera_division_sin_tutor',
    emoji: '➗',
    titulo: 'Primera división sola',
    descripcion: 'Resuelve tu primera división sin usar el tutor.',
  },
  {
    id: 'cinco_divisiones_sin_tutor',
    emoji: '🧮',
    titulo: 'Cinco divisiones solas',
    descripcion: 'Resuelve 5 divisiones sin usar el tutor.',
  },
  {
    id: 'diez_divisiones_sin_tutor',
    emoji: '🏅',
    titulo: 'Diez divisiones solas',
    descripcion: 'Resuelve 10 divisiones sin usar el tutor.',
  },
  {
    id: 'primer_libro_completo',
    emoji: '📖',
    titulo: 'Primer libro',
    descripcion: 'Termina tu primer libro del Club de Lectura.',
  },
];

// ============================================================
// Racha
// ============================================================

interface RachaCalculada {
  dias_consecutivos: number;
  racha_maxima: number;
  ultimo_dia_activo: string | null;
  activo_hoy: boolean;
  dias_activos_ultimos_30: number;
  dias_activos_totales: number;
}

function calcularRacha(dias: string[]): RachaCalculada {
  if (dias.length === 0) {
    return {
      dias_consecutivos: 0,
      racha_maxima: 0,
      ultimo_dia_activo: null,
      activo_hoy: false,
      dias_activos_ultimos_30: 0,
      dias_activos_totales: 0,
    };
  }

  const hoy = new Date().toISOString().slice(0, 10);
  const ayer = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  const set = new Set(dias);
  const diasDesc = [...dias].sort().reverse();
  const ultimoDia = diasDesc[0];

  let rachaActual = 0;
  if (ultimoDia === hoy || ultimoDia === ayer) {
    let cursor = new Date(ultimoDia + 'T00:00:00Z');
    while (true) {
      const iso = cursor.toISOString().slice(0, 10);
      if (set.has(iso)) {
        rachaActual++;
        cursor = new Date(cursor.getTime() - 86400000);
      } else {
        break;
      }
    }
  }

  const diasAsc = [...dias].sort();
  let rachaMaxima = 0;
  let actual = 0;
  let anterior: string | null = null;
  for (const dia of diasAsc) {
    if (anterior === null) {
      actual = 1;
    } else {
      const a = new Date(anterior + 'T00:00:00Z').getTime();
      const b = new Date(dia + 'T00:00:00Z').getTime();
      const diff = Math.round((b - a) / 86400000);
      actual = diff === 1 ? actual + 1 : 1;
    }
    if (actual > rachaMaxima) rachaMaxima = actual;
    anterior = dia;
  }

  const hace30 = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
  const diasActivos30 = dias.filter((d) => d >= hace30).length;

  return {
    dias_consecutivos: rachaActual,
    racha_maxima: rachaMaxima,
    ultimo_dia_activo: ultimoDia,
    activo_hoy: ultimoDia === hoy,
    dias_activos_ultimos_30: diasActivos30,
    dias_activos_totales: dias.length,
  };
}

// ============================================================
// Endpoints
// ============================================================

export async function handleCompletarLeccion(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const alumna = await getAlumnaAutenticada(request, env);
  if (!alumna) {
    return jsonResponse({ ok: false, error: 'No autorizado' }, 401);
  }

  let body: { leccion_id?: string; materia_id?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Body inválido' }, 400);
  }

  const { leccion_id, materia_id } = body;

  if (!leccion_id || !materia_id) {
    return jsonResponse({ ok: false, error: 'leccion_id y materia_id son obligatorios' }, 400);
  }

  if (leccion_id.length > 100 || materia_id.length > 50) {
    return jsonResponse({ ok: false, error: 'IDs demasiado largos' }, 400);
  }

  if (materia_id.startsWith('#') || !/^[a-z0-9-]+$/.test(materia_id)) {
    return jsonResponse({ ok: false, error: 'ID de materia inválido' }, 400);
  }

  const resultado = await marcarLeccionCompletada(env.DB, alumna.id, leccion_id, materia_id);
  const resumen = await getResumenProgreso(env.DB, alumna.id);
  const nivel = calcularNivel(resumen.xp_total);

  let logrosDesbloqueados: string[] = [];
  if (resultado.insertado) {
    logrosDesbloqueados = await verificarLogros(env, alumna.id);
  }

  if (resultado.insertado) {
    ctx.waitUntil(
      notificarAdminLeccionCompletada(env, {
        alumnaNombre: alumna.nombre,
        alumnaUsuario: alumna.usuario,
        leccionTitulo: leccion_id,
        materiaNombre: materia_id,
        xpGanados: resultado.xp_ganados,
        xpTotal: resumen.xp_total,
        nivelNombre: nivel.nombre,
        nivelEmoji: nivel.emoji,
        esNueva: true,
      })
        .then((res) => console.log('[notif] Resultado:', JSON.stringify(res)))
        .catch((err) => console.error('[notif] Error:', err))
    );
  } else {
    console.log('[notif] Lección ya completada, no se notifica.');
  }

  return jsonResponse({
    ok: true,
    nueva: resultado.insertado,
    xp_ganados: resultado.xp_ganados,
    logros_desbloqueados: logrosDesbloqueados,
    resumen: {
      xp_total: resumen.xp_total,
      lecciones_completadas: resumen.lecciones_completadas,
      materias_exploradas: resumen.materias_exploradas,
    },
    nivel,
  });
}

export async function handleResumenProgreso(
  request: Request,
  env: Env
): Promise<Response> {
  const alumna = await getAlumnaAutenticada(request, env);
  if (!alumna) return jsonResponse({ ok: false, error: 'No autorizado' }, 401);

  const resumen = await getResumenProgreso(env.DB, alumna.id);
  const nivel = calcularNivel(resumen.xp_total);

  return jsonResponse({
    ok: true,
    resumen: {
      xp_total: resumen.xp_total,
      lecciones_completadas: resumen.lecciones_completadas,
      materias_exploradas: resumen.materias_exploradas,
    },
    nivel,
  });
}

export async function handleProgresoCompleto(
  request: Request,
  env: Env
): Promise<Response> {
  const alumna = await getAlumnaAutenticada(request, env);
  if (!alumna) return jsonResponse({ ok: false, error: 'No autorizado' }, 401);

  const progreso = await getProgresoCompleto(env.DB, alumna.id);
  const resumen = await getResumenProgreso(env.DB, alumna.id);
  const nivel = calcularNivel(resumen.xp_total);

  return jsonResponse({
    ok: true,
    progreso,
    resumen: {
      xp_total: resumen.xp_total,
      lecciones_completadas: resumen.lecciones_completadas,
      materias_exploradas: resumen.materias_exploradas,
    },
    nivel,
  });
}

export async function handleEstadoLeccion(
  request: Request,
  env: Env,
  leccionId: string
): Promise<Response> {
  const alumna = await getAlumnaAutenticada(request, env);
  if (!alumna) return jsonResponse({ ok: false, error: 'No autorizado' }, 401);

  const completada = await leccionCompletada(env.DB, alumna.id, leccionId);

  return jsonResponse({ ok: true, leccion_id: leccionId, completada });
}

export async function handleRacha(
  request: Request,
  env: Env
): Promise<Response> {
  const alumna = await getAlumnaAutenticada(request, env);
  if (!alumna) return jsonResponse({ ok: false, error: 'No autorizado' }, 401);

  const dias = await getDiasActivos(env.DB, alumna.id);
  const racha = calcularRacha(dias);

  return jsonResponse({ ok: true, racha });
}

export async function handleLogros(
  request: Request,
  env: Env
): Promise<Response> {
  const alumna = await getAlumnaAutenticada(request, env);
  if (!alumna) return jsonResponse({ ok: false, error: 'No autorizado' }, 401);

  const desbloqueados = await getLogrosDesbloqueados(env.DB, alumna.id);
  const mapa = new Map(desbloqueados.map((d) => [d.logro_id, d.desbloqueado_en]));

  const logros = LOGROS.map((l) => ({
    ...l,
    desbloqueado: mapa.has(l.id),
    desbloqueado_en: mapa.get(l.id) || null,
  }));

  return jsonResponse({ ok: true, logros });
}

export async function handleProgresoPorMateria(
  request: Request,
  env: Env
): Promise<Response> {
  const alumna = await getAlumnaAutenticada(request, env);
  if (!alumna) return jsonResponse({ ok: false, error: 'No autorizado' }, 401);

  const materias = await getLeccionesCompletadasPorMateria(env.DB, alumna.id);
  return jsonResponse({ ok: true, materias });
}

// ============================================================
// Verificación de logros (interna)
// ============================================================

async function verificarLogros(
  env: Env,
  alumna_id: number
): Promise<string[]> {
  const desbloqueadosAhora: string[] = [];

  // 1. primera_leccion
  const resumen = await getResumenProgreso(env.DB, alumna_id);
  if (resumen.lecciones_completadas >= 1) {
    const nuevo = await insertarLogroSiNoExiste(env.DB, alumna_id, 'primera_leccion');
    if (nuevo) desbloqueadosAhora.push('primera_leccion');
  }

  // 2. materia_completa (heurística: 6 lecciones de la misma materia)
  const porMateria = await getLeccionesCompletadasPorMateria(env.DB, alumna_id);
  const completa = porMateria.some((m) => m.completadas >= 6);
  if (completa) {
    const nuevo = await insertarLogroSiNoExiste(env.DB, alumna_id, 'materia_completa');
    if (nuevo) desbloqueadosAhora.push('materia_completa');
  }

  // 3. racha_7
  const dias = await getDiasActivos(env.DB, alumna_id);
  const racha = calcularRacha(dias);
  if (racha.racha_maxima >= 7) {
    const nuevo = await insertarLogroSiNoExiste(env.DB, alumna_id, 'racha_7');
    if (nuevo) desbloqueadosAhora.push('racha_7');
  }

  // 4. divisiones sin tutor (necesitamos el alumna_hash)
  const encoder = new TextEncoder();
  const data = encoder.encode(`${alumna_id}${env.INTENTOS_SALT}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const alumna_hash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  const divisiones = await contarDivisionesSinTutor(env.DB, alumna_hash);
  
  if (divisiones >= 1) {
    const nuevo = await insertarLogroSiNoExiste(env.DB, alumna_id, 'primera_division_sin_tutor');
    if (nuevo) desbloqueadosAhora.push('primera_division_sin_tutor');
  }
  if (divisiones >= 5) {
    const nuevo = await insertarLogroSiNoExiste(env.DB, alumna_id, 'cinco_divisiones_sin_tutor');
    if (nuevo) desbloqueadosAhora.push('cinco_divisiones_sin_tutor');
  }
  if (divisiones >= 10) {
    const nuevo = await insertarLogroSiNoExiste(env.DB, alumna_id, 'diez_divisiones_sin_tutor');
    if (nuevo) desbloqueadosAhora.push('diez_divisiones_sin_tutor');
  }

  // 5. primer_libro_completo
  const libroCompleto = await tieneLibroCompleto(env.DB, alumna_id);
  if (libroCompleto) {
    const nuevo = await insertarLogroSiNoExiste(env.DB, alumna_id, 'primer_libro_completo');
    if (nuevo) desbloqueadosAhora.push('primer_libro_completo');
  }

  return desbloqueadosAhora;
}
// ============================================================
// Portafolio
// ============================================================

export async function handlePortafolio(
  request: Request,
  env: Env
): Promise<Response> {
  const alumna = await getAlumnaAutenticada(request, env);
  if (!alumna) return jsonResponse({ ok: false, error: 'No autorizado' }, 401);

  const db = env.DB;
  const resumen = await getResumenProgreso(db, alumna.id);
  const nivel = calcularNivel(resumen.xp_total);
  const logros = await getLogrosDesbloqueados(db, alumna.id);
  const materias = await getLeccionesCompletadasPorMateria(db, alumna.id);
  const diasActivos = await getDiasActivos(db, alumna.id);
  const racha = calcularRacha(diasActivos);
  const lecciones = await getProgresoCompleto(db, alumna.id);

  return jsonResponse({
    ok: true,
    portafolio: {
      alumna: { nombre: alumna.nombre, usuario: alumna.usuario },
      nivel: {
        numero: nivel.numero,
        nombre: nivel.nombre,
        emoji: nivel.emoji,
        xp_total: nivel.xp_total,
        xp_siguiente: nivel.xp_siguiente_total,
        porcentaje: nivel.porcentaje,
        es_maximo: nivel.es_maximo,
      },
      resumen: {
        lecciones_completadas: resumen.lecciones_completadas,
        materias_exploradas: resumen.materias_exploradas,
      },
      racha: {
        dias_consecutivos: racha.dias_consecutivos,
        racha_maxima: racha.racha_maxima,
        dias_activos_totales: racha.dias_activos_totales,
      },
      logros,
      materias,
      lecciones: lecciones.slice(0, 10),
    },
  });
}

// ============================================================
// NUEVO: Registro de respuestas (con privacidad)
// ============================================================

export async function handleRegistrarRespuesta(
  request: Request,
  env: Env
): Promise<Response> {
  const alumna = await getAlumnaAutenticada(request, env);
  if (!alumna) return jsonResponse({ ok: false, error: 'No autorizado' }, 401);

  const consentimiento = await tieneConsentimiento(env.DB, alumna.id);
  if (!consentimiento) {
    return jsonResponse(
      { ok: false, error: 'No hay consentimiento parental para registrar respuestas' },
      403
    );
  }

  let body: {
    leccion_id?: string;
    pregunta_id?: string;
    tipo?: 'multiple' | 'desarrollo' | 'vf';
    es_correcta?: boolean | null;
  };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Body inválido' }, 400);
  }

  const { leccion_id, pregunta_id, tipo, es_correcta } = body;

  if (!leccion_id || !pregunta_id || !tipo) {
    return jsonResponse(
      { ok: false, error: 'leccion_id, pregunta_id y tipo son obligatorios' },
      400
    );
  }

  if (!['multiple', 'desarrollo', 'vf'].includes(tipo)) {
    return jsonResponse({ ok: false, error: 'tipo inválido' }, 400);
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(`${alumna.id}${env.INTENTOS_SALT}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const alumna_hash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  const insertado = await registrarRespuesta(
    env.DB,
    alumna_hash,
    leccion_id,
    pregunta_id,
    tipo,
    es_correcta === undefined ? null : es_correcta
  );

  return jsonResponse({ ok: true, registrada: insertado, ya_existia: !insertado });
}

// GET /api/progreso/mis-respuestas/:leccion_id
export async function handleMisRespuestas(
  request: Request,
  env: Env,
  leccionId: string
): Promise<Response> {
  const alumna = await getAlumnaAutenticada(request, env);
  if (!alumna) return jsonResponse({ ok: false, error: 'No autorizado' }, 401);

  // Calcular hash (igual que en registrar-respuesta)
  const encoder = new TextEncoder();
  const data = encoder.encode(`${alumna.id}${env.INTENTOS_SALT}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const alumna_hash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  const respuestas = await getRespuestasLeccion(env.DB, alumna_hash, leccionId);

  // Agrupar por pregunta_id (por si hay duplicados de distintas sesiones)
  const agrupadas = new Map<string, typeof respuestas[0]>();
  for (const r of respuestas) {
    if (!agrupadas.has(r.pregunta_id)) {
      agrupadas.set(r.pregunta_id, r);
    }
  }

  return jsonResponse({
    ok: true,
    leccion_id: leccionId,
    total_respuestas: agrupadas.size,
    respuestas: Array.from(agrupadas.values()),
  });
}




// ============================================================
// NUEVO: Actualizar avance (porcentaje de cumplimiento + email)
// ============================================================

export async function handleActualizarAvance(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const alumna = await getAlumnaAutenticada(request, env);
  if (!alumna) return jsonResponse({ ok: false, error: 'No autorizado' }, 401);

  const consentimiento = await tieneConsentimiento(env.DB, alumna.id);
  if (!consentimiento) {
    return jsonResponse(
      { ok: false, error: 'No hay consentimiento parental para registrar avance' },
      403
    );
  }

  let body: {
    leccion_id?: string;
    materia_id?: string;
    total_preguntas?: number;
  };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Body inválido' }, 400);
  }

  const { leccion_id, materia_id, total_preguntas } = body;

  if (!leccion_id || !materia_id) {
    return jsonResponse(
      { ok: false, error: 'leccion_id y materia_id son obligatorios' },
      400
    );
  }

  if (!total_preguntas || total_preguntas <= 0) {
    return jsonResponse(
      { ok: false, error: 'total_preguntas es obligatorio y debe ser mayor a 0' },
      400
    );
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(`${alumna.id}${env.INTENTOS_SALT}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const alumna_hash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  const porcentaje = await calcularPorcentajeCumplimiento(
    env.DB,
    alumna_hash,
    leccion_id,
    total_preguntas
  );

  const respuestas = await getRespuestasLeccion(env.DB, alumna_hash, leccion_id);
  const correctas = respuestas.filter((r) => r.es_correcta === 1).length;
  const incorrectas = respuestas.filter((r) => r.es_correcta === 0).length;
  const desarrollo = respuestas.filter((r) => r.tipo === 'desarrollo').length;

  ctx.waitUntil(
    notificarAdminAvance(env, {
      alumnaNombre: alumna.nombre,
      alumnaUsuario: alumna.usuario,
      leccionTitulo: leccion_id,
      materiaNombre: materia_id,
      porcentaje,
      correctas,
      incorrectas,
      desarrollo,
      totalPreguntas: total_preguntas,
    })
      .then((res) => console.log('[notif] Resultado avance:', JSON.stringify(res)))
      .catch((err) => console.error('[notif] Error avance:', err))
  );

  return jsonResponse({
    ok: true,
    porcentaje,
    correctas,
    incorrectas,
    desarrollo,
    total_preguntas,
  });
}
