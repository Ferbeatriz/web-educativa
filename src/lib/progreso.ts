/**
 * Helper de progreso para el frontend.
 * Todas las llamadas al Worker sobre XP/lecciones pasan por acá.
 */

import { getToken } from './auth';

const API_URL = 'https://web-educativa-api.ferbeatriz.workers.dev';

export interface Nivel {
  numero: number;
  nombre: string;
  emoji: string;
  xp_total: number;
  xp_en_nivel: number;
  xp_para_siguiente: number;
  xp_siguiente_total: number;
  porcentaje: number;
  es_maximo: boolean;
}

export interface ResumenProgreso {
  xp_total: number;
  lecciones_completadas: number;
  materias_exploradas: number;
}

export interface ResumenResponse {
  ok: boolean;
  resumen?: ResumenProgreso;
  nivel?: Nivel;
  error?: string;
}

export interface CompletarResponse {
  ok: boolean;
  nueva?: boolean;
  xp_ganados?: number;
  resumen?: ResumenProgreso;
  nivel?: Nivel;
  error?: string;
}

export interface EstadoLeccionResponse {
  ok: boolean;
  leccion_id?: string;
  completada?: boolean;
  error?: string;
}

export async function getResumenProgreso(): Promise<ResumenResponse> {
  const token = getToken();
  if (!token) return { ok: false, error: 'No hay sesión activa' };

  try {
    const response = await fetch(`${API_URL}/api/progreso/resumen`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return await response.json();
  } catch {
    return { ok: false, error: 'Error de conexión' };
  }
}

export async function marcarLeccionCompletada(
  leccion_id: string,
  materia_id: string
): Promise<CompletarResponse> {
  const token = getToken();
  if (!token) return { ok: false, error: 'No hay sesión activa' };

  try {
    const response = await fetch(`${API_URL}/api/progreso/completar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ leccion_id, materia_id }),
    });
    return await response.json();
  } catch {
    return { ok: false, error: 'Error de conexión' };
  }
}

export async function getEstadoLeccion(
  leccion_id: string
): Promise<EstadoLeccionResponse> {
  const token = getToken();
  if (!token) return { ok: false, error: 'No hay sesión activa' };

  try {
    const response = await fetch(
      `${API_URL}/api/progreso/leccion/${encodeURIComponent(leccion_id)}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    return await response.json();
  } catch {
    return { ok: false, error: 'Error de conexión' };
  }
}

// ---------- Racha ----------

export interface Racha {
  dias_consecutivos: number;
  racha_maxima: number;
  ultimo_dia_activo: string | null;
  activo_hoy: boolean;
  dias_activos_ultimos_30: number;
  dias_activos_totales: number;
}

export interface RachaResponse {
  ok: boolean;
  racha?: Racha;
  error?: string;
}

export async function getRacha(): Promise<RachaResponse> {
  const token = getToken();
  if (!token) return { ok: false, error: 'No hay sesión activa' };

  try {
    const response = await fetch(`${API_URL}/api/progreso/racha`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return await response.json();
  } catch {
    return { ok: false, error: 'Error de conexión' };
  }
}

// ---------- Logros ----------

export interface Logro {
  id: string;
  emoji: string;
  titulo: string;
  descripcion: string;
  desbloqueado: boolean;
  desbloqueado_en: string | null;
}

export interface LogrosResponse {
  ok: boolean;
  logros?: Logro[];
  error?: string;
}

export async function getLogros(): Promise<LogrosResponse> {
  const token = getToken();
  if (!token) return { ok: false, error: 'No hay sesión activa' };

  try {
    const response = await fetch(`${API_URL}/api/progreso/logros`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return await response.json();
  } catch {
    return { ok: false, error: 'Error de conexión' };
  }
}

export async function verificarLogros(): Promise<{ ok: boolean; desbloqueados_ahora?: string[] }> {
  const token = getToken();
  if (!token) return { ok: false };

  try {
    const response = await fetch(`${API_URL}/api/progreso/logros/verificar`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return await response.json();
  } catch {
    return { ok: false };
  }
}

// ---------- Progreso por materia ----------

export interface MateriaProgreso {
  materia_id: string;
  completadas: number;
  total: number;
  ultima_completada_en: string | null;
  primera_completada_en: string | null;
}

export interface ProgresoPorMateriaResponse {
  ok: boolean;
  materias?: MateriaProgreso[];
  error?: string;
}

export async function getProgresoPorMateria(): Promise<ProgresoPorMateriaResponse> {
  const token = getToken();
  if (!token) return { ok: false, error: 'No hay sesión activa' };

  try {
    const response = await fetch(`${API_URL}/api/progreso/por-materia`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return await response.json();
  } catch {
    return { ok: false, error: 'Error de conexión' };
  }
}
