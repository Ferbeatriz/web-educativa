/**
 * Endpoints de progreso:
 * - POST /api/progreso/completar      → Marca una lección como completada
 * - GET  /api/progreso/resumen        → Resumen (XP, nivel, lecciones)
 * - GET  /api/progreso/leccion/:id    → ¿Completó esta lección?
 * - GET  /api/progreso/completo       → Todas las lecciones completadas
 */

import { hashToken } from '../lib/crypto';
import {
  getSesionByTokenHash,
  marcarLeccionCompletada,
  getResumenProgreso,
  getProgresoCompleto,
  leccionCompletada,
} from '../lib/db';

export interface Env {
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
 * Devuelve null si no hay sesión válida.
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
// Endpoints
// ============================================================

/**
 * POST /api/progreso/completar
 * Body: { leccion_id, materia_id }
 */
export async function handleCompletarLeccion(
  request: Request,
  env: Env
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

  // Devolver también el resumen actualizado
  const resumen = await getResumenProgreso(env.DB, alumna.id);
  const nivel = calcularNivel(resumen.xp_total);

  return jsonResponse({
    ok: true,
    nueva: resultado.insertado,
    xp_ganados: resultado.xp_ganados,
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
