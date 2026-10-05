/**
 * Helper para enviar emails usando Resend.
 * En plan gratuito, solo se puede enviar a un correo verificado con el remitente de pruebas.
 * Cuando haya dominio propio, cambiar REMITENTE.
 */

const REMITENTE_PRUEBAS = 'onboarding@resend.dev';
const REMITENTE_PRODUCCION = 'hola@tudominio.cl'; // cambiar cuando se tenga dominio

export interface EnvEmail {
  RESEND_API_KEY: string;
  ADMIN_EMAIL: string;
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

// ============================================================
// Notificación al administrador
// ============================================================

export interface EnvNotificacionAdmin extends EnvEmail {
  ADMIN_EMAIL: string;
}

export interface DatosLeccionCompletada {
  alumnaNombre: string;
  alumnaUsuario: string;
  claseNombre?: string;
  leccionTitulo: string;
  leccionEmoji?: string;
  materiaNombre: string;
  materiaEmoji?: string;
  xpGanados: number;
  xpTotal: number;
  nivelNombre: string;
  nivelEmoji: string;
  esNueva: boolean;
}

/**
 * Envía un email al administrador cuando una alumna completa una lección.
 * Se llama desde el endpoint POST /api/progreso/completar.
 * Si no hay ADMIN_EMAIL configurado, no hace nada (silencioso).
 */
export async function notificarAdminLeccionCompletada(
  env: EnvNotificacionAdmin,
  datos: DatosLeccionCompletada
): Promise<ResultadoEnvio> {
  if (!env.ADMIN_EMAIL) {
    console.warn('[email] ADMIN_EMAIL no configurado, saltando notificación');
    return { ok: false, error: 'ADMIN_EMAIL no configurado' };
  }

  if (!datos.esNueva) {
    // Si la lección ya estaba completada, no notificar (evita spam)
    return { ok: true };
  }

  const asunto = `🌱 ${datos.alumnaNombre} completó "${datos.leccionTitulo}"`;
  const html = plantillaLeccionCompletada(datos);

  return enviarEmail(env, env.ADMIN_EMAIL, asunto, html);
}

/**
 * Plantilla HTML para el email de "lección completada".
 */
function plantillaLeccionCompletada(d: DatosLeccionCompletada): string {
  const claseTexto = d.claseNombre
    ? `<tr>
         <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Clase</td>
         <td style="padding: 8px 0; color: #1F2937; font-size: 14px; font-weight: 600; text-align: right;">${d.claseNombre}</td>
       </tr>`
    : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Lección completada</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background: #F8F9FA; padding: 40px 20px; margin: 0;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">

    <div style="text-align: center; margin-bottom: 24px;">
      <span style="font-size: 48px;">${d.leccionEmoji || '🎓'}</span>
    </div>

    <h1 style="color: #1F2937; font-size: 22px; margin: 0 0 8px 0; text-align: center;">
      ¡Lección completada!
    </h1>

    <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
      ${d.alumnaNombre} acaba de avanzar en su aprendizaje
    </p>

    <div style="background: #F9FAFB; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Alumna</td>
          <td style="padding: 8px 0; color: #1F2937; font-size: 14px; font-weight: 600; text-align: right;">${d.alumnaNombre}</td>
        </tr>
        ${claseTexto}
        <tr>
          <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Lección</td>
          <td style="padding: 8px 0; color: #1F2937; font-size: 14px; font-weight: 600; text-align: right;">${d.leccionEmoji || ''} ${d.leccionTitulo}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Materia</td>
          <td style="padding: 8px 0; color: #1F2937; font-size: 14px; font-weight: 600; text-align: right;">${d.materiaEmoji || ''} ${d.materiaNombre}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">XP ganado</td>
          <td style="padding: 8px 0; color: #10B981; font-size: 14px; font-weight: 700; text-align: right;">+${d.xpGanados} XP</td>
        </tr>
      </table>
    </div>

    <div style="background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); border-radius: 12px; padding: 20px; text-align: center; color: white;">
      <div style="font-size: 32px; margin-bottom: 4px;">${d.nivelEmoji}</div>
      <div style="font-size: 12px; opacity: 0.9; text-transform: uppercase; letter-spacing: 1px;">Nivel actual</div>
      <div style="font-size: 18px; font-weight: 700; margin-top: 4px;">${d.nivelNombre}</div>
      <div style="font-size: 13px; opacity: 0.9; margin-top: 8px;">${d.xpTotal} XP en total</div>
    </div>

    <p style="color: #9CA3AF; font-size: 12px; line-height: 1.6; margin: 24px 0 0 0; padding-top: 24px; border-top: 1px solid #E5E7EB; text-align: center;">
      Notificación automática de Web Educativa
    </p>

  </div>
</body>
</html>
  `.trim();
}
