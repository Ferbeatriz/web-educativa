/**
 * Endpoints de autenticación:
 * - POST /api/auth/login
 * - POST /api/auth/logout
 * - GET  /api/auth/me
 */

import {
  verifyPassword,
  generateSessionToken,
  hashToken,
} from '../lib/crypto';
import {
  getAlumnaByUsuario,
  getMetodoPassword,
  crearSesion,
  getSesionByTokenHash,
  eliminarSesion,
} from '../lib/db';

const SESION_DURACION_DIAS = 30;

export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  APP_NAME: string;
}

/**
 * POST /api/auth/login
 * Body: { usuario, password }
 */
export async function handleLogin(
  request: Request,
  env: Env
): Promise<Response> {
  let body: { usuario?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Body inválido' }, 400);
  }

  const { usuario, password } = body;

  if (!usuario || !password) {
    return jsonResponse(
      { ok: false, error: 'Usuario y contraseña son obligatorios' },
      400
    );
  }

  if (usuario.length > 50 || password.length > 200) {
    return jsonResponse(
      { ok: false, error: 'Usuario o contraseña incorrectos' },
      401
    );
  }

  // 1. Buscar la alumna
  const alumna = await getAlumnaByUsuario(env.DB, usuario);
  if (!alumna) {
    return jsonResponse(
      { ok: false, error: 'Usuario o contraseña incorrectos' },
      401
    );
  }

  if (alumna.activa !== 1) {
    return jsonResponse(
      { ok: false, error: 'Cuenta desactivada. Contacta a tu profesora.' },
      403
    );
  }

  // 2. Obtener el hash de la contraseña
  const metodo = await getMetodoPassword(env.DB, alumna.id);
  if (!metodo) {
    return jsonResponse(
      { ok: false, error: 'Usuario o contraseña incorrectos' },
      401
    );
  }

  // 3. Verificar contraseña
  const passwordOk = await verifyPassword(password, metodo.credencial_hash);
  if (!passwordOk) {
    return jsonResponse(
      { ok: false, error: 'Usuario o contraseña incorrectos' },
      401
    );
  }

  // 4. Generar token de sesión
  const token = generateSessionToken();
  const tokenHash = await hashToken(token);

  // 5. Calcular expiración
  const expira = new Date();
  expira.setDate(expira.getDate() + SESION_DURACION_DIAS);
  const expiraISO = expira.toISOString().replace('T', ' ').substring(0, 19);

  // 6. Guardar sesión
  await crearSesion(env.DB, alumna.id, tokenHash, expiraISO);

  // 7. Devolver token + info de la alumna
  return jsonResponse({
    ok: true,
    token,
    expira_en: expiraISO,
    alumna: {
      id: alumna.id,
      nombre: alumna.nombre,
      usuario: alumna.usuario,
    },
  });
}

/**
 * POST /api/auth/logout
 * Header: Authorization: Bearer <token>
 */
export async function handleLogout(
  request: Request,
  env: Env
): Promise<Response> {
  const token = extraerToken(request);
  if (!token) {
    return jsonResponse({ ok: false, error: 'No hay token' }, 400);
  }

  const tokenHash = await hashToken(token);
  await eliminarSesion(env.DB, tokenHash);

  return jsonResponse({ ok: true, mensaje: 'Sesión cerrada' });
}

/**
 * GET /api/auth/me
 * Header: Authorization: Bearer <token>
 */
export async function handleMe(
  request: Request,
  env: Env
): Promise<Response> {
  const token = extraerToken(request);
  if (!token) {
    return jsonResponse({ ok: false, error: 'No autorizado' }, 401);
  }

  const tokenHash = await hashToken(token);
  const sesion = await getSesionByTokenHash(env.DB, tokenHash);

  if (!sesion) {
    return jsonResponse(
      { ok: false, error: 'Sesión inválida o expirada' },
      401
    );
  }

  return jsonResponse({
    ok: true,
    alumna: {
      id: sesion.alumna_id,
      nombre: sesion.nombre,
      usuario: sesion.usuario,
    },
    expira_en: sesion.expira_en,
  });
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
