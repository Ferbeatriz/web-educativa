/**
 * Worker API para web-educativa
 */

import {
  handleLogin,
  handleLogout,
  handleMe,
  handlePerfil,
  type Env as EnvAuth,
} from './routes/auth';

import {
  handleCompletarLeccion,
  handleResumenProgreso,
  handleProgresoCompleto,
  handleEstadoLeccion,
} from './routes/progreso';

import {
  handleAdminLogin,
  handleAdminLogout,
  handleAdminMe,
  type Env as EnvAdmin,
} from './routes/admin';

type Env = EnvAuth & EnvAdmin;

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    try {
      // ---------- Health ----------
      if (path === '/api/health' && method === 'GET') {
        const dbTest = await env.DB.prepare('SELECT 1 as ok').first();
        return json({
          status: 'ok',
          worker: 'web-educativa-api',
          environment: env.ENVIRONMENT,
          app: env.APP_NAME,
          database: dbTest ? 'connected' : 'error',
          timestamp: new Date().toISOString(),
        });
      }

      // ---------- Info ----------
      if (path === '/api' && method === 'GET') {
        return json({
          name: 'web-educativa-api',
          version: '1.4.0',
          endpoints: [
            'GET  /api/health',
            'POST /api/auth/login',
            'POST /api/auth/logout',
            'GET  /api/auth/me',
            'GET  /api/auth/perfil',
            'POST /api/progreso/completar',
            'GET  /api/progreso/resumen',
            'GET  /api/progreso/completo',
            'GET  /api/progreso/leccion/:id',
            'POST /api/admin/login',
            'POST /api/admin/logout',
            'GET  /api/admin/me',
          ],
        });
      }

      // ---------- Auth (alumnas) ----------
      if (path === '/api/auth/login' && method === 'POST') {
        return await handleLogin(request, env);
      }
      if (path === '/api/auth/logout' && method === 'POST') {
        return await handleLogout(request, env);
      }
      if (path === '/api/auth/me' && method === 'GET') {
        return await handleMe(request, env);
      }
      if (path === '/api/auth/perfil' && method === 'GET') {
        return await handlePerfil(request, env);
      }

      // ---------- Progreso ----------
      if (path === '/api/progreso/completar' && method === 'POST') {
        return await handleCompletarLeccion(request, env);
      }
      if (path === '/api/progreso/resumen' && method === 'GET') {
        return await handleResumenProgreso(request, env);
      }
      if (path === '/api/progreso/completo' && method === 'GET') {
        return await handleProgresoCompleto(request, env);
      }

      const matchLeccion = path.match(/^\/api\/progreso\/leccion\/([^\/]+)$/);
      if (matchLeccion && method === 'GET') {
        return await handleEstadoLeccion(request, env, matchLeccion[1]);
      }

      // ---------- Admin ----------
      if (path === '/api/admin/login' && method === 'POST') {
        return await handleAdminLogin(request, env);
      }
      if (path === '/api/admin/logout' && method === 'POST') {
        return await handleAdminLogout(request);
      }
      if (path === '/api/admin/me' && method === 'GET') {
        return await handleAdminMe(request, env);
      }

      // ---------- 404 ----------
      return json({ error: 'Not Found', path, method }, 404);
    } catch (error) {
      console.error('Worker error:', error);
      return json(
        {
          error: 'Internal Server Error',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        500
      );
    }
  },
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
