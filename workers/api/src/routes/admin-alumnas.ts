/**
 * Endpoints admin para gestión de alumnas.
 */

import {
  hashTokenAdmin,
  verificarTokenAdmin,
  extraerTokenAdmin,
} from '../lib/admin-sesion';
import { hashPassword } from '../lib/crypto';
import { generarPasswordAmigable } from '../lib/passwords';

export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  APP_NAME: string;
  ADMIN_PASSWORD_HASH: string;
  ADMIN_SESSION_SECRET: string;
}

interface AlumnaRow {
  id: number;
  nombre: string;
  usuario: string;
  clase_id: number | null;
  activa: number;
  ultimo_login: string | null;
  creada_en: string;
  clase_nombre: string | null;
  clase_codigo: string | null;
  xp_total: number;
  lecciones_completadas: number;
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
 * GET /api/admin/alumnas?clase_id=X
 * Lista alumnas con progreso resumido.
 */
export async function handleListarAlumnas(
  request: Request,
  env: Env
): Promise<Response> {
  const auth = await requireAdmin(request, env);
  if (auth) return auth;

  const url = new URL(request.url);
  const claseIdParam = url.searchParams.get('clase_id');

  let query = `
    SELECT 
      a.id, a.nombre, a.usuario, a.clase_id, a.activa, a.ultimo_login, a.creada_en,
      c.nombre AS clase_nombre, c.codigo AS clase_codigo,
      COALESCE(SUM(p.xp_ganados), 0) AS xp_total,
      COUNT(p.id) AS lecciones_completadas
    FROM alumnas a
    LEFT JOIN clases c ON c.id = a.clase_id
    LEFT JOIN progreso p ON p.alumna_id = a.id
  `;

  const params: number[] = [];

  if (claseIdParam) {
    const claseId = parseInt(claseIdParam, 10);
    if (!isNaN(claseId)) {
      query += ' WHERE a.clase_id = ?';
      params.push(claseId);
    }
  }

  query += `
    GROUP BY a.id
    ORDER BY a.activa DESC, a.nombre ASC
  `;

  const stmt = env.DB.prepare(query);
  const result = params.length > 0
    ? await stmt.bind(...params).all<AlumnaRow>()
    : await stmt.all<AlumnaRow>();

  return json({
    ok: true,
    alumnas: result.results ?? [],
  });
}

/**
 * POST /api/admin/alumnas
 * Body: { nombre, usuario, clase_id }
 * Genera contraseña automáticamente.
 */
export async function handleCrearAlumna(
  request: Request,
  env: Env
): Promise<Response> {
  const auth = await requireAdmin(request, env);
  if (auth) return auth;

  let body: { nombre?: string; usuario?: string; clase_id?: number };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Body inválido' }, 400);
  }

  const { nombre, usuario, clase_id } = body;

  if (!nombre || !usuario) {
    return json(
      { ok: false, error: 'Nombre y usuario son obligatorios' },
      400
    );
  }

  const nombreLimpio = nombre.trim();
  const usuarioLimpio = usuario.trim();

  if (nombreLimpio.length < 2 || nombreLimpio.length > 100) {
    return json(
      { ok: false, error: 'El nombre debe tener entre 2 y 100 caracteres' },
      400
    );
  }

  if (!/^[a-zA-Z0-9_-]{3,30}$/.test(usuarioLimpio)) {
    return json(
      {
        ok: false,
        error:
          'El usuario debe tener 3-30 caracteres (letras, números, guiones)',
      },
      400
    );
  }

  // Verificar que el usuario no exista
  const existente = await env.DB
    .prepare('SELECT id FROM alumnas WHERE usuario = ?')
    .bind(usuarioLimpio)
    .first<{ id: number }>();

  if (existente) {
    return json(
      { ok: false, error: 'Ya existe una alumna con ese usuario' },
      409
    );
  }

  // Verificar clase si se especificó
  if (clase_id) {
    const claseExiste = await env.DB
      .prepare('SELECT id FROM clases WHERE id = ?')
      .bind(clase_id)
      .first<{ id: number }>();

    if (!claseExiste) {
      return json({ ok: false, error: 'La clase no existe' }, 404);
    }
  }

  // Generar contraseña
  const password = generarPasswordAmigable();
  const passwordHash = await hashPassword(password);

  // Insertar alumna
  const insertAlumna = await env.DB
    .prepare(
      'INSERT INTO alumnas (nombre, usuario, clase_id) VALUES (?, ?, ?)'
    )
    .bind(nombreLimpio, usuarioLimpio, clase_id || null)
    .run();

  const alumnaId = insertAlumna.meta.last_row_id;

  // Insertar método de auth
  await env.DB
    .prepare(
      "INSERT INTO metodos_auth (alumna_id, tipo, credencial_hash) VALUES (?, 'password', ?)"
    )
    .bind(alumnaId, passwordHash)
    .run();

  return json({
    ok: true,
    alumna: {
      id: alumnaId,
      nombre: nombreLimpio,
      usuario: usuarioLimpio,
    },
    password_temporal: password,
    mensaje: 'Alumna creada. Guarda la contraseña, solo se muestra una vez.',
  });
}

/**
 * POST /api/admin/alumnas/:id/resetear-password
 * Genera nueva contraseña.
 */
export async function handleResetearPassword(
  request: Request,
  env: Env,
  alumnaId: string
): Promise<Response> {
  const auth = await requireAdmin(request, env);
  if (auth) return auth;

  const id = parseInt(alumnaId, 10);
  if (isNaN(id)) {
    return json({ ok: false, error: 'ID inválido' }, 400);
  }

  // Verificar que la alumna exista
  const alumna = await env.DB
    .prepare('SELECT id, nombre, usuario FROM alumnas WHERE id = ?')
    .bind(id)
    .first<{ id: number; nombre: string; usuario: string }>();

  if (!alumna) {
    return json({ ok: false, error: 'Alumna no encontrada' }, 404);
  }

  // Generar nueva contraseña
  const password = generarPasswordAmigable();
  const passwordHash = await hashPassword(password);

  // Actualizar el hash
  const update = await env.DB
    .prepare(
      "UPDATE metodos_auth SET credencial_hash = ? WHERE alumna_id = ? AND tipo = 'password'"
    )
    .bind(passwordHash, id)
    .run();

  if (update.meta.changes === 0) {
    return json(
      { ok: false, error: 'La alumna no tiene método de autenticación' },
      500
    );
  }

  // Invalidar todas las sesiones activas de esa alumna
  await env.DB
    .prepare('DELETE FROM sesiones WHERE alumna_id = ?')
    .bind(id)
    .run();

  return json({
    ok: true,
    alumna: {
      id: alumna.id,
      nombre: alumna.nombre,
      usuario: alumna.usuario,
    },
    password_temporal: password,
    mensaje:
      'Contraseña reseteada. Guarda la nueva contraseña, solo se muestra una vez.',
  });
}

/**
 * GET /api/admin/alumnas/:id/progreso
 * Ver progreso detallado de una alumna.
 */
export async function handleProgresoAlumna(
  request: Request,
  env: Env,
  alumnaId: string
): Promise<Response> {
  const auth = await requireAdmin(request, env);
  if (auth) return auth;

  const id = parseInt(alumnaId, 10);
  if (isNaN(id)) {
    return json({ ok: false, error: 'ID inválido' }, 400);
  }

  const alumna = await env.DB
    .prepare(
      `SELECT 
         a.id, a.nombre, a.usuario, a.ultimo_login, a.creada_en,
         c.nombre AS clase_nombre, c.codigo AS clase_codigo
       FROM alumnas a
       LEFT JOIN clases c ON c.id = a.clase_id
       WHERE a.id = ?`
    )
    .bind(id)
    .first<{
      id: number;
      nombre: string;
      usuario: string;
      ultimo_login: string | null;
      creada_en: string;
      clase_nombre: string | null;
      clase_codigo: string | null;
    }>();

  if (!alumna) {
    return json({ ok: false, error: 'Alumna no encontrada' }, 404);
  }

  const progreso = await env.DB
    .prepare(
      `SELECT leccion_id, materia_id, xp_ganados, completada_en
       FROM progreso
       WHERE alumna_id = ?
       ORDER BY completada_en DESC`
    )
    .bind(id)
    .all<{
      leccion_id: string;
      materia_id: string;
      xp_ganados: number;
      completada_en: string;
    }>();

  const resumen = await env.DB
    .prepare(
      `SELECT 
         COALESCE(SUM(xp_ganados), 0) AS xp_total,
         COUNT(*) AS lecciones_completadas,
         COUNT(DISTINCT materia_id) AS materias_exploradas
       FROM progreso
       WHERE alumna_id = ?`
    )
    .bind(id)
    .first<{
      xp_total: number;
      lecciones_completadas: number;
      materias_exploradas: number;
    }>();

  return json({
    ok: true,
    alumna,
    resumen: resumen || {
      xp_total: 0,
      lecciones_completadas: 0,
      materias_exploradas: 0,
    },
    progreso: progreso.results ?? [],
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
