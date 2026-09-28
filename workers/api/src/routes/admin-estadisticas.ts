/**
 * Endpoint admin: estadísticas globales del sistema.
 */

import {
  hashTokenAdmin,
  verificarTokenAdmin,
  extraerTokenAdmin,
} from '../lib/admin-sesion';

export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  APP_NAME: string;
  ADMIN_PASSWORD_HASH: string;
  ADMIN_SESSION_SECRET: string;
}

async function requireAdmin(
  request: Request,
  env: Env
): Promise<Response | null> {
  const token = extraerTokenAdmin(request);
  if (!token) {
    return json({ ok: false, error: 'No autorizado' }, 401);
  }

  const tokenHash = await hashTokenAdmin(token);
  const valido = await verificarTokenAdmin(env.DB, tokenHash);

  if (!valido) {
    return json({ ok: false, error: 'Sesión inválida o expirada' }, 401);
  }

  return null;
}

/**
 * GET /api/admin/estadisticas
 * Devuelve contadores globales para el dashboard.
 */
export async function handleEstadisticas(
  request: Request,
  env: Env
): Promise<Response> {
  const auth = await requireAdmin(request, env);
  if (auth) return auth;

  const clases = await env.DB
    .prepare('SELECT COUNT(*) AS total, SUM(CASE WHEN activa = 1 THEN 1 ELSE 0 END) AS activas FROM clases')
    .first<{ total: number; activas: number }>();

  const alumnas = await env.DB
    .prepare('SELECT COUNT(*) AS total, SUM(CASE WHEN activa = 1 THEN 1 ELSE 0 END) AS activas FROM alumnas')
    .first<{ total: number; activas: number }>();

  const progreso = await env.DB
    .prepare(
      'SELECT COALESCE(SUM(xp_ganados), 0) AS xp_total, COUNT(*) AS lecciones_completadas FROM progreso'
    )
    .first<{ xp_total: number; lecciones_completadas: number }>();

  // Actividad reciente: alumnas activas en los últimos 7 días
  const activasRecientes = await env.DB
    .prepare(
      "SELECT COUNT(DISTINCT alumna_id) AS total FROM progreso WHERE completada_en >= datetime('now', '-7 days')"
    )
    .first<{ total: number }>();

  return json({
    ok: true,
    estadisticas: {
      clases: {
        total: clases?.total ?? 0,
        activas: clases?.activas ?? 0,
      },
      alumnas: {
        total: alumnas?.total ?? 0,
        activas: alumnas?.activas ?? 0,
      },
      progreso: {
        xp_total: progreso?.xp_total ?? 0,
        lecciones_completadas: progreso?.lecciones_completadas ?? 0,
      },
      actividad: {
        alumnas_activas_7dias: activasRecientes?.total ?? 0,
      },
    },
  });
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
