/**
 * Worker API para web-educativa
 * 
 * Endpoints disponibles:
 * - GET /api/health → Verifica que el Worker y la BD funcionan
 */

export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  APP_NAME: string;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      if (path === '/api/health' && request.method === 'GET') {
        const dbTest = await env.DB.prepare('SELECT 1 as ok').first();

        return new Response(
          JSON.stringify({
            status: 'ok',
            worker: 'web-educativa-api',
            environment: env.ENVIRONMENT,
            app: env.APP_NAME,
            database: dbTest ? 'connected' : 'error',
            timestamp: new Date().toISOString(),
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      if (path === '/api' && request.method === 'GET') {
        return new Response(
          JSON.stringify({
            name: 'web-educativa-api',
            version: '1.0.0',
            endpoints: ['/api/health'],
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Not Found', path }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: 'Internal Server Error',
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  },
};
