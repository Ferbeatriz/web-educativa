/**
 * Helper del panel de administración.
 * Usa tokens en localStorage (mismo patrón que las alumnas).
 */

const API_URL = 'https://web-educativa-api.ferbeatriz.workers.dev';
const ADMIN_TOKEN_KEY = 'web_educativa_admin_token';

export interface LoginAdminResponse {
  ok: boolean;
  token?: string;
  expira_en?: string;
  mensaje?: string;
  error?: string;
}

export interface MeAdminResponse {
  ok: boolean;
  admin?: boolean;
  mensaje?: string;
  error?: string;
}

/**
 * Login del admin.
 * Guarda el token en localStorage si es exitoso.
 */
export async function loginAdmin(password: string): Promise<LoginAdminResponse> {
  try {
    const response = await fetch(`${API_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    const data: LoginAdminResponse = await response.json();

    if (data.ok && data.token) {
      localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
    }

    return data;
  } catch {
    return {
      ok: false,
      error: 'Error de conexión. Revisa tu internet e intenta de nuevo.',
    };
  }
}

/**
 * Logout del admin.
 */
export async function logoutAdmin(): Promise<void> {
  const token = getToken();

  if (token) {
    try {
      await fetch(`${API_URL}/api/admin/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
    } catch {
      // Ignorar errores
    }
  }

  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

/**
 * Obtiene el token admin guardado.
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

/**
 * Verifica si hay sesión admin activa.
 */
export async function verificarAdmin(): Promise<boolean> {
  const token = getToken();
  if (!token) return false;

  try {
    const response = await fetch(`${API_URL}/api/admin/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      // Token inválido: limpiar
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      return false;
    }

    const data: MeAdminResponse = await response.json();
    return data.ok && data.admin === true;
  } catch {
    return false;
  }
}
