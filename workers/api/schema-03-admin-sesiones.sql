-- ============================================================
-- Tabla: admin_sesiones
-- Almacena tokens de sesión del panel admin.
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_sesiones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token_hash TEXT NOT NULL UNIQUE,
  expira_en TEXT NOT NULL,
  creada_en TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_admin_sesiones_token ON admin_sesiones(token_hash);
CREATE INDEX IF NOT EXISTS idx_admin_sesiones_expira ON admin_sesiones(expira_en);
