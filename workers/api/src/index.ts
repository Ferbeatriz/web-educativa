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

import {
  handleListarClases,
  handleCrearClase,
  handleActualizarClase,
} from './routes/admin-clases';

import {
  handleListarAlumnas,
  handleCrearAlumna,
  handleResetearPassword,
  handleProgresoAlumna,
  handleActualizarAlumna,
} from './routes/admin-alumnas';

import { handleEstadisticas } from './routes/admin-estadisticas';
import { handleTestEmail } from './routes/admin-email';


import type { EnvEmail } from './lib/email';
type Env = EnvAuth & EnvAdmin & EnvEmail & { DB: D1Database; ENVIRONMENT: string; APP_NAME: string };

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
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
          version: '1.7.0',
          endpoints: [
            'GET    /api/health',
            'POST   /api/auth/login',
            'POST   /api/auth/logout',
            'GET    /api/auth/me',
            'GET    /api/auth/perfil',
            'POST   /api/progreso/completar',
            'GET    /api/progreso/resumen',
            'GET    /api/progreso/completo',
            'GET    /api/progreso/leccion/:id',
            'POST   /api/admin/login',
            'POST   /api/admin/logout',
            'GET    /api/admin/me',
            'POST   /api/admin/test-email',
            'GET    /api/admin/clases',
            'POST   /api/admin/clases',
            'PATCH  /api/admin/clases/:id',
            'GET    /api/admin/alumnas',
            'POST   /api/admin/alumnas',
            'POST   /api/admin/alumnas/:id/resetear-password',
            'GET    /api/admin/alumnas/:id/progreso',
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

      // ---------- Admin: auth ----------
      if (path === '/api/admin/login' && method === 'POST') {
        return await handleAdminLogin(request, env);
      }
      if (path === '/api/admin/logout' && method === 'POST') {
        return await handleAdminLogout(request, env);
      }
      if (path === '/api/admin/me' && method === 'GET') {
        return await handleAdminMe(request, env);
      }
      if (path === '/api/admin/estadisticas' && method === 'GET') {
        return await handleEstadisticas(request, env);
      }

      // ---------- Admin: email ----------
      if (path === '/api/admin/test-email' && method === 'POST') {
        return await handleTestEmail(request, env);
      }

      // ---------- Admin: clases ----------
      if (path === '/api/admin/clases' && method === 'GET') {
        return await handleListarClases(request, env);
      }
      if (path === '/api/admin/clases' && method === 'POST') {
        return await handleCrearClase(request, env);
      }

      const matchClase = path.match(/^\/api\/admin\/clases\/(\d+)$/);
      if (matchClase && method === 'PATCH') {
        return await handleActualizarClase(request, env, matchClase[1]);
      }

      // ---------- Admin: alumnas ----------
      if (path === '/api/admin/alumnas' && method === 'GET') {
        return await handleListarAlumnas(request, env);
      }
      if (path === '/api/admin/alumnas' && method === 'POST') {
        return await handleCrearAlumna(request, env);
      }

      const matchResetPass = path.match(
        /^\/api\/admin\/alumnas\/(\d+)\/resetear-password$/
      );
      if (matchResetPass && method === 'POST') {
        return await handleResetearPassword(request, env, matchResetPass[1]);
      }

      const matchProgAlumna = path.match(
        /^\/api\/admin\/alumnas\/(\d+)\/progreso$/
      );
      if (matchProgAlumna && method === 'GET') {
        return await handleProgresoAlumna(request, env, matchProgAlumna[1]);
      }

      const matchAlumna = path.match(/^\/api\/admin\/alumnas\/(\d+)$/);
      if (matchAlumna && method === 'PATCH') {
        return await handleActualizarAlumna(request, env, matchAlumna[1]);
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
