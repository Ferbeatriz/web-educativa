/**
 * Endpoints de email del panel admin.
 * Solo /api/admin/test-email por ahora.
 */

import {
  extraerTokenAdmin,
  hashTokenAdmin,
  verificarTokenAdmin,
} from '../lib/admin-sesion';
import { enviarEmail, plantillaPrueba, type EnvEmail } from '../lib/email';

export interface Env extends EnvEmail {
  DB: D1Database;
}

interface BodyTestEmail {
  destinatario?: string;
}

export async function handleTestEmail(
  request: Request,
  env: Env
): Promise<Response> {
  // Verificar sesión admin
  const token = extraerTokenAdmin(request);
  if (!token) {
    return json({ ok: false, error: 'Falta token de autorización.' }, 401);
  }

  const tokenHash = await hashTokenAdmin(token);
  const esValido = await verificarTokenAdmin(env.DB, tokenHash);
  if (!esValido) {
    return json({ ok: false, error: 'Token inválido o expirado.' }, 401);
  }

  // Leer body
  let body: BodyTestEmail;
  try {
    body = (await request.json()) as BodyTestEmail;
  } catch {
    return json({ ok: false, error: 'Body inválido. Esperado JSON.' }, 400);
  }

  const destinatario = body.destinatario;
  if (!destinatario || !destinatario.includes('@')) {
    return json({ ok: false, error: 'Falta destinatario válido.' }, 400);
  }

  // Enviar email
  const resultado = await enviarEmail(
    env,
    destinatario,
    'Prueba de notificaciones — Web Educativa',
    plantillaPrueba()
  );

  if (!resultado.ok) {
    return json(
      { ok: false, error: resultado.error || 'Error desconocido al enviar.' },
      500
    );
  }

  return json({
    ok: true,
    id: resultado.id,
    mensaje: `Email enviado a ${destinatario}`,
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