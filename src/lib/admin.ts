/**
 * Helper del panel de administración.
 * Todas las llamadas al Worker sobre admin pasan por acá.
 * 
 * IMPORTANTE: usa cookies HttpOnly, no localStorage.
 * El navegador envía la cookie automáticamente con `credentials: 'include'`.
 */

const API_URL = 'https://web-educativa-api.ferbeatriz.workers.dev';

// ---------- Tipos ----------

export interface LoginAdminResponse {
  ok: boolean;
  mensaje?: string;
  error?: string;
}

export interface MeAdminResponse {
  ok: boolean;
  admin?: boolean;
  mensaje?: string;
  error?: string;
}

// ---------- Funciones ----------

/**
 * Login del admin.
 * Si es exitoso, el Worker devuelve una cookie HttpOnly que el navegador
 * guarda automáticamente.
 */
export async function loginAdmin(password: string): Promise<LoginAdminResponse> {
  try {
    const response = await fetch(`${API_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password }),
    });

    const data: LoginAdminResponse = await response.json();
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
 * El Worker borra la cookie.
 */
export async function logoutAdmin(): Promise<void> {
  try {
    await fetch(`${API_URL}/api/admin/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // Ignorar errores de red en logout
  }
}

/**
 * Verifica si hay una sesión admin activa.
 * Llama a /api/admin/me con la cookie.
 */
export async function verificarAdmin(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/admin/me`, {
      credentials: 'include',
    });

    if (!response.ok) return false;

    const data: MeAdminResponse = await response.json();
    return data.ok && data.admin === true;
  } catch {
    return false;
  }
}
