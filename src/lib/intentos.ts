/**
 * Helper para registrar intentos del estudiante.
 *
 * Principios:
 *   - Falla silenciosa: si no hay token o el Worker no responde,
 *     NO rompe la experiencia del estudiante.
 *   - Los intentos se registran en el backend con hash anónimo.
 *   - Si no hay consentimiento parental, el backend no guarda pero
 *     devuelve ok:true para no romper el flujo.
 */

import { getToken } from './auth';

const API_URL =
  import.meta.env.PUBLIC_API_URL ||
  'https://web-educativa-api.ferbeatriz.workers.dev';

export type Origen = 'problema_card' | 'tutor';

export interface IntentoPayload {
  problema_id: string;
  paso_n: number | null;
  respuesta_dada: string;
  respuesta_correcta: string;
  error_type: string | null;
  origen: Origen;
}

export async function registrarIntento(
  payload: IntentoPayload
): Promise<boolean> {
  const token = getToken();
  if (!token) return false;

  try {
    const res = await fetch(`${API_URL}/api/tutor/registrar-intento`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}
