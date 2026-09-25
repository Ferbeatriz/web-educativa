/**
 * Worker API para web-educativa
 */

import {
  handleLogin,
  handleLogout,
  handleMe,
  handlePerfil,
  type Env,
} from './routes/auth';

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
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    try {
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

      if (path === '/api' && method === 'GET') {
        return json({
          name: 'web-educativa-api',
          version: '1.2.0',
          endpoints: [
            'GET  /api/health',
            'POST /api/auth/login',
            'POST /api/auth/logout',
            'GET  /api/auth/me',
            'GET  /api/auth/perfil',
          ],
        });
      }

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
