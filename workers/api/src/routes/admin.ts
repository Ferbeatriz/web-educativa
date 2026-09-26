/**
 * Endpoints del panel de administración con tokens en D1.
 */

import { verifyPassword } from '../lib/crypto';
import {
  generarTokenAdmin,
  hashTokenAdmin,
  guardarTokenAdmin,
  verificarTokenAdmin,
  eliminarTokenAdmin,
  extraerTokenAdmin,
} from '../lib/admin-sesion';

export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  APP_NAME: string;
  ADMIN_PASSWORD_HASH: string;
  ADMIN_SESSION_SECRET: string;
}

export async function handleAdminLogin(
  request: Request,
  env: Env
): Promise<Response> {
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Body inválido' }, 400);
  }

  const { password } = body;

  if (!password) {
    return json({ ok: false, error: 'Contraseña requerida' }, 400);
  }

  if (password.length > 500) {
    return json({ ok: false, error: 'Contraseña incorrecta' }, 401);
  }

  const valida = await verifyPassword(password, env.ADMIN_PASSWORD_HASH);

  if (!valida) {
    return json({ ok: false, error: 'Contraseña incorrecta' }, 401);
  }

  // Generar token y guardarlo en D1
  const token = generarTokenAdmin();
  const tokenHash = await hashTokenAdmin(token);
  const expira_en = await guardarTokenAdmin(env.DB, tokenHash);

  return json({
    ok: true,
    token,
    expira_en,
    mensaje: 'Sesión iniciada',
  });
}

export async function handleAdminLogout(
  request: Request,
  env: Env
): Promise<Response> {
  const token = extraerTokenAdmin(request);
  if (token) {
    const tokenHash = await hashTokenAdmin(token);
    await eliminarTokenAdmin(env.DB, tokenHash);
  }

  return json({ ok: true, mensaje: 'Sesión cerrada' });
}

export async function handleAdminMe(
  request: Request,
  env: Env
): Promise<Response> {
  const token = extraerTokenAdmin(request);

  if (!token) {
    return json({ ok: false, error: 'Sin token' }, 401);
  }

  const tokenHash = await hashTokenAdmin(token);
  const valido = await verificarTokenAdmin(env.DB, tokenHash);

  if (!valido) {
    return json({ ok: false, error: 'Sesión inválida o expirada' }, 401);
  }

  return json({
    ok: true,
    admin: true,
    mensaje: 'Sesión admin activa',
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
