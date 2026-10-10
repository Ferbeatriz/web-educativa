-- ============================================================
-- ESQUEMA DE INTENTOS — web-educativa
-- Fase 4: Motor de errores (tracking de razonamiento)
-- Aplicar con: npx wrangler d1 execute web-educativa-db --file=workers/api/schema-04-intentos.sql --remote
--
-- DISEÑO DE PRIVACIDAD (Ley 21.719):
--   - Los intentos se guardan con alumna_hash (SHA-256 + salt), no con alumna_id.
--   - Si la base se filtra, los intentos son anónimos.
--   - La relación hash → alumna_id vive en una tabla separada (mapa_identidad).
--   - El consentimiento parental se registra en consentimientos_tracking.
--   - Si no hay consentimiento, el endpoint NO guarda el intento.
-- ============================================================

-- ------------------------------------------------------------
-- Tabla: intentos_ejercicios
-- Registra cada intento del estudiante (problema-card + tutor).
-- Es ANÓNIMA: no guarda alumna_id, solo alumna_hash.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS intentos_ejercicios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alumna_hash TEXT NOT NULL,                -- SHA-256(alumna_id + salt), no el id
  problema_id TEXT NOT NULL,                -- ej: "div-prob-001"
  paso_n INTEGER,                           -- NULL si viene de problema-card
  respuesta_dada TEXT,                      -- qué escribió o eligió
  respuesta_correcta TEXT,                  -- qué se esperaba
  error_type TEXT,                          -- NULL si acertó; string si falló
  origen TEXT NOT NULL CHECK(origen IN ('problema_card', 'tutor')),
  timestamp TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_intentos_hash ON intentos_ejercicios(alumna_hash);
CREATE INDEX IF NOT EXISTS idx_intentos_problema ON intentos_ejercicios(problema_id);
CREATE INDEX IF NOT EXISTS idx_intentos_error ON intentos_ejercicios(error_type);
CREATE INDEX IF NOT EXISTS idx_intentos_timestamp ON intentos_ejercicios(timestamp);
CREATE INDEX IF NOT EXISTS idx_intentos_hash_problema ON intentos_ejercicios(alumna_hash, problema_id);

-- ------------------------------------------------------------
-- Tabla: mapa_identidad
-- Relaciona el hash anónimo con la alumna real.
-- Esta tabla es la única que permite desanonimizar.
-- Si la alumna ejerce su derecho ARCOP (borrado), se borra esta fila.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mapa_identidad (
  alumna_hash TEXT PRIMARY KEY,
  alumna_id INTEGER NOT NULL UNIQUE,
  creado_en TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (alumna_id) REFERENCES alumnas(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_mapa_alumna_id ON mapa_identidad(alumna_id);

-- ------------------------------------------------------------
-- Tabla: consentimientos_tracking
-- Registra si el apoderado firmó el consentimiento para tracking.
-- Sin consentimiento activo, el endpoint rechaza guardar intentos.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS consentimientos_tracking (
  alumna_id INTEGER PRIMARY KEY,
  consentimiento_padre INTEGER NOT NULL DEFAULT 0,  -- 0 = no, 1 = sí
  fecha_firma TEXT,
  version_documento TEXT,                            -- ej: "v1.0-2026"
  creado_en TEXT NOT NULL DEFAULT (datetime('now')),
  actualizado_en TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (alumna_id) REFERENCES alumnas(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_consentimiento_activo ON consentimientos_tracking(consentimiento_padre);
