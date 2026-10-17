/**
 * Endpoints de progreso:
 * - POST /api/progreso/completar      → Marca una lección como completada
 * - GET  /api/progreso/resumen        → Resumen (XP, nivel, lecciones)
 * - GET  /api/progreso/leccion/:id    → ¿Completó esta lección?
 * - GET  /api/progreso/completo       → Todas las lecciones completadas
 * - GET  /api/progreso/racha          → Racha de días consecutivos
 * - GET  /api/progreso/logros         → Estado de los logros
 * - GET  /api/progreso/por-materia    → Progreso agregado por materia
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
} from '../lib/db';
import {
  notificarAdminLeccionCompletada,
  type EnvNotificacionAdmin,
} from '../lib/email';

export interface Env extends EnvNotificacionAdmin {
  DB: D1Database;
  ENVIRONMENT: string;
  APP_NAME: string;
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

/**
 * Middleware: obtiene la alumna logueada del token.
 */
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

  // Racha actual: solo cuenta si el último día es hoy o ayer.
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

  // Racha máxima histórica.
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

  const hace30 = new Date(Date.now() - 30 * 86400000)
    .toISOString()
    .slice(0, 10);
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

/**
 * POST /api/progreso/completar
 * Body: { leccion_id, materia_id }
 * Además del progreso, dispara una notificación por email al admin
 * y verifica si se desbloquearon logros.
 */
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
    return jsonResponse(
      { ok: false, error: 'leccion_id y materia_id son obligatorios' },
      400
    );
  }

  if (leccion_id.length > 100 || materia_id.length > 50) {
    return jsonResponse(
      { ok: false, error: 'IDs demasiado largos' },
      400
    );
  }

  const resultado = await marcarLeccionCompletada(
    env.DB,
    alumna.id,
    leccion_id,
    materia_id
  );

  const resumen = await getResumenProgreso(env.DB, alumna.id);
  const nivel = calcularNivel(resumen.xp_total);

  // 🏅 Verificar logros (solo si fue una lección nueva)
  let logrosDesbloqueados: string[] = [];
  if (resultado.insertado) {
    logrosDesbloqueados = await verificarLogros(env, alumna.id);
  }

  // 🔔 Notificación por email al admin
  // Solo se envía si es una lección nueva (no repetida).
  // Usamos ctx.waitUntil para que Cloudflare no corte la promesa.
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
        .then((res) => {
          console.log('[notif] Resultado:', JSON.stringify(res));
        })
        .catch((err) => {
          console.error('[notif] Error:', err);
        })
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

/**
 * GET /api/progreso/resumen
 */
export async function handleResumenProgreso(
  request: Request,
  env: Env
): Promise<Response> {
  const alumna = await getAlumnaAutenticada(request, env);
  if (!alumna) {
    return jsonResponse({ ok: false, error: 'No autorizado' }, 401);
  }

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

/**
 * GET /api/progreso/completo
 */
export async function handleProgresoCompleto(
  request: Request,
  env: Env
): Promise<Response> {
  const alumna = await getAlumnaAutenticada(request, env);
  if (!alumna) {
    return jsonResponse({ ok: false, error: 'No autorizado' }, 401);
  }

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

/**
 * GET /api/progreso/leccion/:id
 */
export async function handleEstadoLeccion(
  request: Request,
  env: Env,
  leccionId: string
): Promise<Response> {
  const alumna = await getAlumnaAutenticada(request, env);
  if (!alumna) {
    return jsonResponse({ ok: false, error: 'No autorizado' }, 401);
  }

  const completada = await leccionCompletada(env.DB, alumna.id, leccionId);

  return jsonResponse({
    ok: true,
    leccion_id: leccionId,
    completada,
  });
}

/**
 * GET /api/progreso/racha
 */
export async function handleRacha(
  request: Request,
  env: Env
): Promise<Response> {
  const alumna = await getAlumnaAutenticada(request, env);
  if (!alumna) {
    return jsonResponse({ ok: false, error: 'No autorizado' }, 401);
  }

  const dias = await getDiasActivos(env.DB, alumna.id);
  const racha = calcularRacha(dias);

  return jsonResponse({ ok: true, racha });
}

/**
 * GET /api/progreso/logros
 */
export async function handleLogros(
  request: Request,
  env: Env
): Promise<Response> {
  const alumna = await getAlumnaAutenticada(request, env);
  if (!alumna) {
    return jsonResponse({ ok: false, error: 'No autorizado' }, 401);
  }

  const desbloqueados = await getLogrosDesbloqueados(env.DB, alumna.id);
  const mapa = new Map(desbloqueados.map((d) => [d.logro_id, d.desbloqueado_en]));

  const logros = LOGROS.map((l) => ({
    ...l,
    desbloqueado: mapa.has(l.id),
    desbloqueado_en: mapa.get(l.id) || null,
  }));

  return jsonResponse({ ok: true, logros });
}

/**
 * GET /api/progreso/por-materia
 */
export async function handleProgresoPorMateria(
  request: Request,
  env: Env
): Promise<Response> {
  const alumna = await getAlumnaAutenticada(request, env);
  if (!alumna) {
    return jsonResponse({ ok: false, error: 'No autorizado' }, 401);
  }

  const materias = await getLeccionesCompletadasPorMateria(env.DB, alumna.id);

  // Mapeamos para incluir el total de lecciones por materia
  // (Por ahora, el "total" lo dejamos fijo según lo que sabemos o
  // idealmente se lee de un catálogo, pero como no lo tenemos en D1, 
  // el frontend lo leerá desde su JSON).
  
  return jsonResponse({ ok: true, materias });
}

// ============================================================
// Verificación de logros (interna)
// ============================================================

/**
 * Verifica y persiste logros. Se llama desde handleCompletarLeccion.
 * Devuelve los IDs de logros desbloqueados en esta llamada.
 */
async function verificarLogros(
  env: Env,
  alumna_id: number
): Promise<string[]> {
  const desbloqueadosAhora: string[] = [];

  // 1. primera_leccion
  const resumen = await getResumenProgreso(env.DB, alumna_id);
  if (resumen.lecciones_completadas >= 1) {
    const nuevo = await insertarLogroSiNoExiste(
      env.DB,
      alumna_id,
      'primera_leccion'
    );
    if (nuevo) desbloqueadosAhora.push('primera_leccion');
  }

  // 2. materia_completa
  // Heurística: 6 lecciones de la misma materia = completa.
  // TODO: cuando el Worker tenga acceso al catálogo, reemplazar.
  const porMateria = await getLeccionesCompletadasPorMateria(env.DB, alumna_id);
  const completa = porMateria.some((m) => m.completadas >= 6);
  if (completa) {
    const nuevo = await insertarLogroSiNoExiste(
      env.DB,
      alumna_id,
      'materia_completa'
    );
    if (nuevo) desbloqueadosAhora.push('materia_completa');
  }

  // 3. racha_7
  const dias = await getDiasActivos(env.DB, alumna_id);
  const racha = calcularRacha(dias);
  if (racha.racha_maxima >= 7) {
    const nuevo = await insertarLogroSiNoExiste(
      env.DB,
      alumna_id,
      'racha_7'
    );
    if (nuevo) desbloqueadosAhora.push('racha_7');
  }

  return desbloqueadosAhora;
}
