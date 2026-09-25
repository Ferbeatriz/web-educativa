/**
 * Helper de autenticación para el frontend.
 * Todas las llamadas al Worker pasan por acá.
 */

const API_URL = import.meta.env.PUBLIC_API_URL || 'https://web-educativa-api.ferbeatriz.workers.dev';
const TOKEN_KEY = 'web_educativa_token';
const ALUMNA_KEY = 'web_educativa_alumna';

// ---------- Tipos ----------
export interface Alumna {
  id: number;
  nombre: string;
  usuario: string;
}

interface LoginResponse {
  ok: boolean;
  token?: string;
  expira_en?: string;
  alumna?: Alumna;
  error?: string;
}

interface MeResponse {
  ok: boolean;
  alumna?: Alumna;
  expira_en?: string;
  error?: string;
}

// ---------- Funciones ----------

/**
 * Login: envía usuario + contraseña al Worker.
 * Si es exitoso, guarda el token y los datos de la alumna en localStorage.
 */
export async function login(usuario: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, password }),
    });

    const data: LoginResponse = await response.json();

    if (data.ok && data.token && data.alumna) {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(ALUMNA_KEY, JSON.stringify(data.alumna));
    }

    return data;
  } catch (err) {
    return {
      ok: false,
      error: 'Error de conexión. Revisa tu internet e intenta de nuevo.',
    };
  }
}

/**
 * Logout: avisa al Worker que cierre la sesión y limpia el localStorage.
 */
export async function logout(): Promise<void> {
  const token = getToken();

  if (token) {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
    } catch {
      // Ignorar errores de red en logout
    }
  }

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ALUMNA_KEY);
}

/**
 * Obtiene el token guardado en localStorage.
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Obtiene los datos de la alumna logueada (desde localStorage).
 */
export function getAlumna(): Alumna | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(ALUMNA_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Alumna;
  } catch {
    return null;
  }
}

/**
 * Verifica si hay una sesión activa (mirando localStorage).
 */
export function isLoggedIn(): boolean {
  return getToken() !== null;
}

/**
 * Consulta al Worker si el token sigue siendo válido.
 * Si no lo es, limpia la sesión local.
 */
export async function verificarSesion(): Promise<Alumna | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const data: MeResponse = await response.json();

    if (data.ok && data.alumna) {
      localStorage.setItem(ALUMNA_KEY, JSON.stringify(data.alumna));
      return data.alumna;
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(ALUMNA_KEY);
      return null;
    }
  } catch {
    return getAlumna();
  }
}
