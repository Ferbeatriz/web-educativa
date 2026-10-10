/**
 * Endpoints del tutor de razonamiento:
 * - POST /api/tutor/registrar-intento → Registra un intento del estudiante
 *
 * Diseño de privacidad (Ley 21.719):
 *   - Los intentos se guardan con alumna_hash (SHA-256 + SALT), no con alumna_id.
 *   - La relación hash → alumna_id vive en mapa_identidad (protegida).
 *   - Si no hay consentimiento parental, devuelve ok:true pero NO guarda.
 *   - La experiencia del estudiante nunca se rompe por el tracking.
 */

import { hashToken } from '../lib/crypto';
import { getSesionByTokenHash } from '../lib/db';

export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  APP_NAME: string;
  INTENTOS_SALT: string;
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

async function getAlumnaAutenticada(
  request: Request,
  env: Env
): Promise<{ id: number; nombre: string; usuario: string } | null> {
  const token = extraerToken(request);
  if (!token) return null;

  const tokenHash = await hashToken(token);
  const sesion = await getSesionByTokenHash(env.DB, tokenHash);
  if (!sesion) return null;

  return {
    id: sesion.alumna_id,
    nombre: sesion.nombre,
    usuario: sesion.usuario,
  };
}

/**
 * Calcula el hash anónimo de la alumna.
 * Usa SHA-256(alumna_id + SALT).
 * El SALT viene de variable de entorno (INTENTOS_SALT).
 */
async function calcularAlumnaHash(alumnaId: number, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${alumnaId}:${salt}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifica si la alumna tiene consentimiento parental para tracking.
 */
async function tieneConsentimiento(
  db: D1Database,
  alumnaId: number
): Promise<boolean> {
  const row = await db
    .prepare(
      'SELECT consentimiento_padre FROM consentimientos_tracking WHERE alumna_id = ?'
    )
    .bind(alumnaId)
    .first<{ consentimiento_padre: number }>();

  return row?.consentimiento_padre === 1;
}

// ============================================================
// Tipos del payload
// ============================================================

interface IntentoBody {
  problema_id?: string;
  paso_n?: number | null;
  respuesta_dada?: string;
  respuesta_correcta?: string;
  error_type?: string | null;
  origen?: 'problema_card' | 'tutor';
}

const ORIGENES_VALIDOS = ['problema_card', 'tutor'];

// ============================================================
// Endpoints
// ============================================================

/**
 * POST /api/tutor/registrar-intento
 * Body: {
 *   problema_id: string,
 *   paso_n: number | null,
 *   respuesta_dada: string,
 *   respuesta_correcta: string,
 *   error_type: string | null,
 *   origen: 'problema_card' | 'tutor'
 * }
 *
 * Respuestas:
 *   200 { ok: true, guardado: true }   → intento registrado
 *   200 { ok: true, guardado: false }  → no había consentimiento, no se guardó
 *   200 { ok: true, guardado: false, razon: 'sin_consentimiento' }
 *   401 { ok: false, error: 'No autorizado' }
 *   400 { ok: false, error: '...' }
 */
export async function handleRegistrarIntento(
  request: Request,
  env: Env
): Promise<Response> {
  // 1. Autenticación
  const alumna = await getAlumnaAutenticada(request, env);
  if (!alumna) {
    return jsonResponse({ ok: false, error: 'No autorizado' }, 401);
  }

  // 2. Parseo del body
  let body: IntentoBody;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Body inválido' }, 400);
  }

  const {
    problema_id,
    paso_n,
    respuesta_dada,
    respuesta_correcta,
    error_type,
    origen,
  } = body;

  // 3. Validaciones básicas
  if (!problema_id || typeof problema_id !== 'string') {
    return jsonResponse({ ok: false, error: 'problema_id es obligatorio' }, 400);
  }
  if (problema_id.length > 100) {
    return jsonResponse({ ok: false, error: 'problema_id demasiado largo' }, 400);
  }
  if (!origen || !ORIGENES_VALIDOS.includes(origen)) {
    return jsonResponse({ ok: false, error: 'origen inválido' }, 400);
  }
  if (paso_n !== null && paso_n !== undefined && (typeof paso_n !== 'number' || paso_n < 1)) {
    return jsonResponse({ ok: false, error: 'paso_n inválido' }, 400);
  }

    // 4. Verificar consentimiento parental
  const consentimiento = await tieneConsentimiento(env.DB, alumna.id);

  if (!consentimiento) {
    return jsonResponse({
      ok: true,
      guardado: false,
      razon: 'sin_consentimiento',
    });
  }

  // 5. Calcular hash anónimo
  if (!env.INTENTOS_SALT) {
    console.error('[tutor] INTENTOS_SALT no configurado');
    return jsonResponse({
      ok: true,
      guardado: false,
      razon: 'error_configuracion',
    });
  }

  const alumnaHash = await calcularAlumnaHash(alumna.id, env.INTENTOS_SALT);

  // 6. Upsert en mapa_identidad (para poder desanonimizar si es necesario)
  await env.DB
    .prepare(
      'INSERT OR IGNORE INTO mapa_identidad (alumna_hash, alumna_id) VALUES (?, ?)'
    )
    .bind(alumnaHash, alumna.id)
    .run();

  // 7. Insertar el intento
  await env.DB
    .prepare(
      `INSERT INTO intentos_ejercicios 
       (alumna_hash, problema_id, paso_n, respuesta_dada, respuesta_correcta, error_type, origen)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      alumnaHash,
      problema_id,
      paso_n ?? null,
      respuesta_dada ?? null,
      respuesta_correcta ?? null,
      error_type ?? null,
      origen
    )
    .run();

  return jsonResponse({ ok: true, guardado: true });
}
