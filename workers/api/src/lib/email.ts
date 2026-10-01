/**
 * Helper para enviar emails usando Resend.
 * En plan gratuito, solo se puede enviar a un correo verificado con el remitente de pruebas.
 * Cuando haya dominio propio, cambiar REMITENTE.
 */

const REMITENTE_PRUEBAS = 'onboarding@resend.dev';
const REMITENTE_PRODUCCION = 'hola@tudominio.cl'; // cambiar cuando se tenga dominio

export interface EnvEmail {
  RESEND_API_KEY: string;
}

export interface ResultadoEnvio {
  ok: boolean;
  id?: string;
  error?: string;
}

/**
 * Envía un email HTML usando Resend.
 */
export async function enviarEmail(
  env: EnvEmail,
  destinatario: string,
  asunto: string,
  html: string
): Promise<ResultadoEnvio> {
  if (!env.RESEND_API_KEY) {
    return { ok: false, error: 'Falta RESEND_API_KEY en el entorno.' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: REMITENTE_PRUEBAS,
        to: destinatario,
        subject: asunto,
        html,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[email] Resend error:', res.status, errorText);
      return { ok: false, error: `Resend ${res.status}: ${errorText}` };
    }

    const data = (await res.json()) as { id: string };
    return { ok: true, id: data.id };
  } catch (e) {
    console.error('[email] Fetch error:', e);
    return { ok: false, error: String(e) };
  }
}

/**
 * Plantilla HTML mínima para el email de prueba.
 * Cuando haya informes reales, se harán plantillas específicas.
 */
export function plantillaPrueba(): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Prueba de notificaciones</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background: #F8F9FA; padding: 40px 20px; margin: 0;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="font-size: 48px;">🦉</span>
    </div>
    <h1 style="color: #1F2937; font-size: 22px; margin: 0 0 16px 0; text-align: center;">
      ¡Prueba exitosa!
    </h1>
    <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
      Este es un correo de prueba desde <strong>Web Educativa</strong>. Si lo estás leyendo, significa que el sistema de notificaciones ya está funcionando.
    </p>
    <p style="color: #6B7280; font-size: 13px; line-height: 1.6; margin: 24px 0 0 0; padding-top: 24px; border-top: 1px solid #E5E7EB;">
      Enviado desde el Worker de web-educativa usando Resend.
    </p>
  </div>
</body>
</html>
  `.trim();
}