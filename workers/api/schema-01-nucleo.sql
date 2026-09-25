-- ============================================================
-- ESQUEMA NÚCLEO — web-educativa
-- Tanda 1: login (4 tablas)
-- Aplicar con: npx wrangler d1 execute web-educativa-db --file=workers/api/schema-01-nucleo.sql --remote
-- ============================================================

-- ------------------------------------------------------------
-- Tabla: clases
-- Cada clase que tú creas. Contiene un código único que compartes con las alumnas.
-- Ejemplo: "3 básico D 2026" con código "3BD2026"
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  codigo TEXT NOT NULL UNIQUE,
  activa INTEGER NOT NULL DEFAULT 1,
  creada_en TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ------------------------------------------------------------
-- Tabla: alumnas
-- Datos básicos de cada alumna. NO guarda contraseñas (eso va en metodos_auth).
-- Ejemplo: "Fernanda Salgado" con usuario "Fer01"
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS alumnas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  usuario TEXT NOT NULL UNIQUE,
  clase_id INTEGER,
  activa INTEGER NOT NULL DEFAULT 1,
  creada_en TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (clase_id) REFERENCES clases(id)
);

CREATE INDEX IF NOT EXISTS idx_alumnas_usuario ON alumnas(usuario);
CREATE INDEX IF NOT EXISTS idx_alumnas_clase ON alumnas(clase_id);

-- ------------------------------------------------------------
-- Tabla: metodos_auth
-- Métodos de autenticación. Diseñada para soportar múltiples métodos por alumna.
-- Ahora solo usamos 'password'. Futuro: 'magic_link', 'pin', 'avatar_pin'.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS metodos_auth (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alumna_id INTEGER NOT NULL,
  tipo TEXT NOT NULL,
  credencial_hash TEXT NOT NULL,
  activo INTEGER NOT NULL DEFAULT 1,
  creado_en TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (alumna_id) REFERENCES alumnas(id) ON DELETE CASCADE,
  UNIQUE (alumna_id, tipo)
);

CREATE INDEX IF NOT EXISTS idx_metodos_auth_alumna ON metodos_auth(alumna_id);

-- ------------------------------------------------------------
-- Tabla: sesiones
-- Tokens activos. Permite "recordar" a la alumna por 30 días sin reloguear.
-- Guardamos el hash del token, NO el token en claro.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sesiones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alumna_id INTEGER NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expira_en TEXT NOT NULL,
  creada_en TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (alumna_id) REFERENCES alumnas(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sesiones_token ON sesiones(token_hash);
CREATE INDEX IF NOT EXISTS idx_sesiones_alumna ON sesiones(alumna_id);

-- ------------------------------------------------------------
-- Datos de prueba
-- ------------------------------------------------------------

-- 1. Insertar la clase
INSERT INTO clases (nombre, codigo) VALUES ('3 básico D 2026', '3BD2026');

-- 2. Insertar la alumna (con el id de la clase recién creada)
INSERT INTO alumnas (nombre, usuario, clase_id)
VALUES ('Fernanda Salgado', 'Fer01', (SELECT id FROM clases WHERE codigo = '3BD2026'));

-- Nota: El password de Fer01 se insertará DESPUÉS con un hash bcrypt real.
-- Por ahora solo verificamos que la clase y la alumna existan.
