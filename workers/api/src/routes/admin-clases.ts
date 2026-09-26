/**
 * Endpoints admin para gestión de clases.
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

interface ClaseRow {
  id: number;
  nombre: string;
  codigo: string;
  activa: number;
  creada_en: string;
  total_alumnas: number;
}

/**
 * Middleware: verifica que la request venga de un admin autenticado.
 */
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
 * GET /api/admin/clases
 * Lista todas las clases con cantidad de alumnas.
 */
export async function handleListarClases(
  request: Request,
  env: Env
): Promise<Response> {
  const auth = await requireAdmin(request, env);
  if (auth) return auth;

  const result = await env.DB
    .prepare(
      `SELECT 
         c.id, c.nombre, c.codigo, c.activa, c.creada_en,
         COUNT(a.id) AS total_alumnas
       FROM clases c
       LEFT JOIN alumnas a ON a.clase_id = c.id
       GROUP BY c.id
       ORDER BY c.activa DESC, c.creada_en DESC`
    )
    .all<ClaseRow>();

  return json({
    ok: true,
    clases: result.results ?? [],
  });
}

/**
 * POST /api/admin/clases
 * Body: { nombre, codigo }
 */
export async function handleCrearClase(
  request: Request,
  env: Env
): Promise<Response> {
  const auth = await requireAdmin(request, env);
  if (auth) return auth;

  let body: { nombre?: string; codigo?: string };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Body inválido' }, 400);
  }

  const { nombre, codigo } = body;

  if (!nombre || !codigo) {
    return json(
      { ok: false, error: 'Nombre y código son obligatorios' },
      400
    );
  }

  const nombreLimpio = nombre.trim();
  const codigoLimpio = codigo.trim().toUpperCase();

  if (nombreLimpio.length < 3 || nombreLimpio.length > 100) {
    return json(
      { ok: false, error: 'El nombre debe tener entre 3 y 100 caracteres' },
      400
    );
  }

  if (!/^[A-Z0-9]{3,20}$/.test(codigoLimpio)) {
    return json(
      {
        ok: false,
        error: 'El código debe tener 3-20 caracteres (solo mayúsculas y números)',
      },
      400
    );
  }

  // Verificar que el código no exista
  const existente = await env.DB
    .prepare('SELECT id FROM clases WHERE codigo = ?')
    .bind(codigoLimpio)
    .first<{ id: number }>();

  if (existente) {
    return json(
      { ok: false, error: 'Ya existe una clase con ese código' },
      409
    );
  }

  const result = await env.DB
    .prepare('INSERT INTO clases (nombre, codigo) VALUES (?, ?)')
    .bind(nombreLimpio, codigoLimpio)
    .run();

  return json({
    ok: true,
    id: result.meta.last_row_id,
    mensaje: 'Clase creada',
  });
}

/**
 * PATCH /api/admin/clases/:id
 * Body: { activa: boolean }
 */
export async function handleActualizarClase(
  request: Request,
  env: Env,
  claseId: string
): Promise<Response> {
  const auth = await requireAdmin(request, env);
  if (auth) return auth;

  const id = parseInt(claseId, 10);
  if (isNaN(id)) {
    return json({ ok: false, error: 'ID inválido' }, 400);
  }

  let body: { activa?: boolean };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Body inválido' }, 400);
  }

  if (typeof body.activa !== 'boolean') {
    return json(
      { ok: false, error: 'activa debe ser true o false' },
      400
    );
  }

  const result = await env.DB
    .prepare('UPDATE clases SET activa = ? WHERE id = ?')
    .bind(body.activa ? 1 : 0, id)
    .run();

  if (result.meta.changes === 0) {
    return json({ ok: false, error: 'Clase no encontrada' }, 404);
  }

  return json({
    ok: true,
    mensaje: body.activa ? 'Clase activada' : 'Clase desactivada',
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
