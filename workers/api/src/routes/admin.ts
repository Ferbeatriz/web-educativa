/**
 * Endpoints del panel de administración.
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

function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('Origin') || '';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin',
  };
}

export async function handleAdminLogin(
  request: Request,
  env: Env
): Promise<Response> {
  const cors = corsHeaders(request);

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: 'Body inválido' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...cors } }
    );
  }

  const { password } = body;

  if (!password) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Contraseña requerida' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...cors } }
    );
  }

  if (password.length > 500) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Contraseña incorrecta' }),
      { status: 401, headers: { 'Content-Type': 'application/json', ...cors } }
    );
  }

  const valida = await verifyPassword(password, env.ADMIN_PASSWORD_HASH);

  if (!valida) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Contraseña incorrecta' }),
      { status: 401, headers: { 'Content-Type': 'application/json', ...cors } }
    );
  }

  const cookie = await crearCookieAdmin(env.ADMIN_SESSION_SECRET);

  return new Response(
    JSON.stringify({ ok: true, mensaje: 'Sesión iniciada' }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': headerSetCookieAdmin(cookie, request.headers.get('Origin')?.startsWith('https://') ?? true),
        ...cors,
      },
    }
  );
}

export async function handleAdminLogout(
  request: Request
): Promise<Response> {
  const cors = corsHeaders(request);

  return new Response(
    JSON.stringify({ ok: true, mensaje: 'Sesión cerrada' }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': headerDeleteCookieAdmin(request.headers.get('Origin')?.startsWith('https://') ?? true),
        ...cors,
      },
    }
  );
}

export async function handleAdminMe(
  request: Request,
  env: Env
): Promise<Response> {
  const cors = corsHeaders(request);
  const cookie = extraerCookieAdmin(request);

  if (!cookie) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Sin sesión' }),
      { status: 401, headers: { 'Content-Type': 'application/json', ...cors } }
    );
  }

  const valida = await verificarCookieAdmin(cookie, env.ADMIN_SESSION_SECRET);

  if (!valida) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Sesión inválida o expirada' }),
      { status: 401, headers: { 'Content-Type': 'application/json', ...cors } }
    );
  }

  return new Response(
    JSON.stringify({
      ok: true,
      admin: true,
      mensaje: 'Sesión admin activa',
    }),
    { status: 200, headers: { 'Content-Type': 'application/json', ...cors } }
  );
}
