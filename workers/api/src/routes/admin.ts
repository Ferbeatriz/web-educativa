/**
 * Endpoints del panel de administración:
 * - POST /api/admin/login   → Verifica contraseña maestra, crea cookie
 * - POST /api/admin/logout  → Elimina la cookie
 * - GET  /api/admin/me      → Verifica si hay sesión admin activa
 */

import { verifyPassword } from '../lib/crypto';
import {
  crearCookieAdmin,
  verificarCookieAdmin,
  extraerCookieAdmin,
  headerSetCookieAdmin,
  headerDeleteCookieAdmin,
} from '../lib/admin-sesion';

export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  APP_NAME: string;
  ADMIN_PASSWORD_HASH: string;
  ADMIN_SESSION_SECRET: string;
}

/**
 * POST /api/admin/login
 * Body: { password }
 */
export async function handleAdminLogin(
  request: Request,
  env: Env
): Promise<Response> {
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Body inválido' }, 400);
  }

  const { password } = body;

  if (!password) {
    return jsonResponse(
      { ok: false, error: 'Contraseña requerida' },
      400
    );
  }

  if (password.length > 500) {
    return jsonResponse(
      { ok: false, error: 'Contraseña incorrecta' },
      401
    );
  }

  // Verificar contra el hash guardado en secret
  const valida = await verifyPassword(password, env.ADMIN_PASSWORD_HASH);

  if (!valida) {
    return jsonResponse(
      { ok: false, error: 'Contraseña incorrecta' },
      401
    );
  }

  // Crear cookie firmada
  const cookie = await crearCookieAdmin(env.ADMIN_SESSION_SECRET);

  return new Response(
    JSON.stringify({ ok: true, mensaje: 'Sesión iniciada' }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': headerSetCookieAdmin(cookie),
        'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
        'Access-Control-Allow-Credentials': 'true',
      },
    }
  );
}

/**
 * POST /api/admin/logout
 */
export async function handleAdminLogout(
  request: Request
): Promise<Response> {
  return new Response(
    JSON.stringify({ ok: true, mensaje: 'Sesión cerrada' }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': headerDeleteCookieAdmin(),
        'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
        'Access-Control-Allow-Credentials': 'true',
      },
    }
  );
}

/**
 * GET /api/admin/me
 */
export async function handleAdminMe(
  request: Request,
  env: Env
): Promise<Response> {
  const cookie = extraerCookieAdmin(request);

  if (!cookie) {
    return jsonResponse({ ok: false, error: 'Sin sesión' }, 401);
  }

  const valida = await verificarCookieAdmin(cookie, env.ADMIN_SESSION_SECRET);

  if (!valida) {
    return jsonResponse({ ok: false, error: 'Sesión inválida o expirada' }, 401);
  }

  return jsonResponse({
    ok: true,
    admin: true,
    mensaje: 'Sesión admin activa',
  });
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
