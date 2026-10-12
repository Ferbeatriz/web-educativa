/**
 * Endpoints admin: métricas del motor de errores.
 *
 * Rutas:
 *   GET /api/admin/metricas/resumen
 *   GET /api/admin/metricas/por-error
 *   GET /api/admin/metricas/por-dia
 *   GET /api/admin/metricas/por-alumna
 *
 * Todas aceptan query params opcionales:
 *   ?desde=YYYY-MM-DD&hasta=YYYY-MM-DD&origen=problema_card|tutor
 *
 * Privacidad: los intentos viven con alumna_hash. Este endpoint
 * desanonimiza vía JOIN con mapa_identidad + alumnas, porque el admin
 * ya está autenticado.
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

// ============================================================
// Helpers
// ============================================================

async function requireAdmin(
  request: Request,
  env: Env
): Promise<Response | null> {
  const token = extraerTokenAdmin(request);
  if (!token) return json({ ok: false, error: 'No autorizado' }, 401);

  const tokenHash = await hashTokenAdmin(token);
  const valido = await verificarTokenAdmin(env.DB, tokenHash);
  if (!valido) {
    return json({ ok: false, error: 'Sesión inválida o expirada' }, 401);
  }
  return null;
}

interface Filtros {
  desde: string | null;
  hasta: string | null;
  origen: string | null;
}

function parsearFiltros(url: URL): Filtros {
  const desde = url.searchParams.get('desde');
  const hasta = url.searchParams.get('hasta');
  const origen = url.searchParams.get('origen');

  // Validar formato de fecha (YYYY-MM-DD)
  const fechaValida = (s: string | null): string | null => {
    if (!s) return null;
    return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
  };

  // Validar origen
  const origenValido =
    origen === 'problema_card' || origen === 'tutor' ? origen : null;

  return {
    desde: fechaValida(desde),
    hasta: fechaValida(hasta),
    origen: origenValido,
  };
}

function construirWhere(filtros: Filtros): { where: string; bindings: any[] } {
  const condiciones: string[] = [];
  const bindings: any[] = [];

  if (filtros.desde) {
    condiciones.push('date(timestamp) >= date(?)');
    bindings.push(filtros.desde);
  }
  if (filtros.hasta) {
    condiciones.push('date(timestamp) <= date(?)');
    bindings.push(filtros.hasta);
  }
  if (filtros.origen) {
    condiciones.push('origen = ?');
    bindings.push(filtros.origen);
  }

  const where = condiciones.length > 0 ? 'WHERE ' + condiciones.join(' AND ') : '';
  return { where, bindings };
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

// ============================================================
// GET /api/admin/metricas/resumen
// ============================================================

export async function handleMetricasResumen(
  request: Request,
  env: Env
): Promise<Response> {
  const auth = await requireAdmin(request, env);
  if (auth) return auth;

  const url = new URL(request.url);
  const filtros = parsearFiltros(url);
  const { where, bindings } = construirWhere(filtros);

  const totales = await env.DB
    .prepare(
      `SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN error_type IS NULL THEN 1 ELSE 0 END) AS aciertos,
        SUM(CASE WHEN error_type IS NOT NULL THEN 1 ELSE 0 END) AS errores,
        COUNT(DISTINCT alumna_hash) AS alumnas_activas,
        COUNT(DISTINCT date(timestamp)) AS dias_con_actividad,
        MIN(timestamp) AS primer_intento,
        MAX(timestamp) AS ultimo_intento
      FROM intentos_ejercicios
      ${where}`
    )
    .bind(...bindings)
    .first<{
      total: number;
      aciertos: number;
      errores: number;
      alumnas_activas: number;
      dias_con_actividad: number;
      primer_intento: string | null;
      ultimo_intento: string | null;
    }>();

  const total = totales?.total ?? 0;
  const aciertos = totales?.aciertos ?? 0;
  const tasa = total > 0 ? Math.round((aciertos / total) * 1000) / 10 : 0;

  return json({
    ok: true,
    resumen: {
      total_intentos: total,
      total_aciertos: aciertos,
      total_errores: totales?.errores ?? 0,
      tasa_acierto: tasa,
      alumnas_activas: totales?.alumnas_activas ?? 0,
      dias_con_actividad: totales?.dias_con_actividad ?? 0,
      primer_intento: totales?.primer_intento,
      ultimo_intento: totales?.ultimo_intento,
    },
    filtros: {
      desde: filtros.desde,
      hasta: filtros.hasta,
      origen: filtros.origen,
    },
  });
}

// ============================================================
// GET /api/admin/metricas/por-error
// ============================================================

export async function handleMetricasPorError(
  request: Request,
  env: Env
): Promise<Response> {
  const auth = await requireAdmin(request, env);
  if (auth) return auth;

  const url = new URL(request.url);
  const filtros = parsearFiltros(url);
  const { where, bindings } = construirWhere(filtros);

  const rows = await env.DB
    .prepare(
      `SELECT 
        error_type,
        COUNT(*) AS total
      FROM intentos_ejercicios
      ${where ? where + ' AND ' : 'WHERE '} error_type IS NOT NULL
      GROUP BY error_type
      ORDER BY total DESC`
    )
    .bind(...bindings)
    .all<{ error_type: string; total: number }>();

  const items = rows.results || [];
  const totalErrores = items.reduce((acc, r) => acc + r.total, 0);

  return json({
    ok: true,
    total_errores: totalErrores,
    por_error: items.map((r) => ({
      error_type: r.error_type,
      total: r.total,
      porcentaje:
        totalErrores > 0 ? Math.round((r.total / totalErrores) * 1000) / 10 : 0,
    })),
    filtros: {
      desde: filtros.desde,
      hasta: filtros.hasta,
      origen: filtros.origen,
    },
  });
}

// ============================================================
// GET /api/admin/metricas/por-dia
// ============================================================

export async function handleMetricasPorDia(
  request: Request,
  env: Env
): Promise<Response> {
  const auth = await requireAdmin(request, env);
  if (auth) return auth;

  const url = new URL(request.url);
  const filtros = parsearFiltros(url);
  const { where, bindings } = construirWhere(filtros);

  const rows = await env.DB
    .prepare(
      `SELECT 
        date(timestamp) AS dia,
        COUNT(*) AS total,
        SUM(CASE WHEN error_type IS NULL THEN 1 ELSE 0 END) AS aciertos,
        SUM(CASE WHEN error_type IS NOT NULL THEN 1 ELSE 0 END) AS errores
      FROM intentos_ejercicios
      ${where}
      GROUP BY date(timestamp)
      ORDER BY dia ASC`
    )
    .bind(...bindings)
    .all<{
      dia: string;
      total: number;
      aciertos: number;
      errores: number;
    }>();

  return json({
    ok: true,
    por_dia: rows.results || [],
    filtros: {
      desde: filtros.desde,
      hasta: filtros.hasta,
      origen: filtros.origen,
    },
  });
}

// ============================================================
// GET /api/admin/metricas/por-alumna
// ============================================================

export async function handleMetricasPorAlumna(
  request: Request,
  env: Env
): Promise<Response> {
  const auth = await requireAdmin(request, env);
  if (auth) return auth;

  const url = new URL(request.url);
  const filtros = parsearFiltros(url);
  const { where, bindings } = construirWhere(filtros);

  // Subquery para encontrar el error más frecuente por alumna
  const rows = await env.DB
    .prepare(
      `SELECT 
        i.alumna_hash,
        a.id AS alumna_id,
        a.nombre AS alumna_nombre,
        COUNT(*) AS total,
        SUM(CASE WHEN i.error_type IS NULL THEN 1 ELSE 0 END) AS aciertos,
        SUM(CASE WHEN i.error_type IS NOT NULL THEN 1 ELSE 0 END) AS errores,
        MIN(i.timestamp) AS primer_intento,
        MAX(i.timestamp) AS ultimo_intento,
        (
          SELECT i2.error_type
          FROM intentos_ejercicios i2
          WHERE i2.alumna_hash = i.alumna_hash AND i2.error_type IS NOT NULL
          GROUP BY i2.error_type
          ORDER BY COUNT(*) DESC
          LIMIT 1
        ) AS error_mas_frecuente
      FROM intentos_ejercicios i
      LEFT JOIN mapa_identidad m ON i.alumna_hash = m.alumna_hash
      LEFT JOIN alumnas a ON m.alumna_id = a.id
      ${where}
      GROUP BY i.alumna_hash
      ORDER BY total DESC`
    )
    .bind(...bindings)
    .all<{
      alumna_hash: string;
      alumna_id: number | null;
      alumna_nombre: string | null;
      total: number;
      aciertos: number;
      errores: number;
      primer_intento: string;
      ultimo_intento: string;
      error_mas_frecuente: string | null;
    }>();

  const items = (rows.results || []).map((r) => ({
    alumna_hash: r.alumna_hash,
    alumna_id: r.alumna_id,
    nombre: r.alumna_nombre || '(anónima)',
    total: r.total,
    aciertos: r.aciertos,
    errores: r.errores,
    tasa_acierto:
      r.total > 0 ? Math.round((r.aciertos / r.total) * 1000) / 10 : 0,
    error_mas_frecuente: r.error_mas_frecuente,
    primer_intento: r.primer_intento,
    ultimo_intento: r.ultimo_intento,
  }));

  const huerfanos = items.filter((i) => i.alumna_id === null).length;

  return json({
    ok: true,
    por_alumna: items,
    alumnas_huerfanas: huerfanos,
    filtros: {
      desde: filtros.desde,
      hasta: filtros.hasta,
      origen: filtros.origen,
    },
  });
}