-- ============================================================
-- ESQUEMA DE RESPUESTAS — web-educativa
-- Fase 5: Registro de respuestas de las alumnas (con privacidad)
-- Aplicar con: npx wrangler d1 execute web-educativa-db --file=workers/api/schema-08-respuestas.sql --remote
--
-- DISEÑO DE PRIVACIDAD (Ley 21.719):
--   - Las respuestas se guardan con alumna_hash (SHA-256 + salt), no con alumna_id.
--   - Si la base se filtra, las respuestas son anónimas.
--   - La relación hash → alumna_id vive en mapa_identidad (ya existente).
--   - Solo se registra si hay consentimiento parental activo.
-- ============================================================

CREATE TABLE IF NOT EXISTS respuestas_lecciones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alumna_hash TEXT NOT NULL,                -- SHA-256(alumna_id + salt), no el id
  leccion_id TEXT NOT NULL,                 -- ej: "introduccion-fracciones"
  pregunta_id TEXT NOT NULL,                -- ej: "in01" o "pregunta-desarrollo-3"
  tipo TEXT NOT NULL CHECK(tipo IN ('multiple', 'desarrollo', 'vf')), -- tipo de pregunta
  respondida INTEGER NOT NULL DEFAULT 0,    -- 0 = no respondió, 1 = sí respondió
  es_correcta INTEGER,                      -- 1 = correcta, 0 = incorrecta, NULL = desarrollo (no se evalúa automático)
  respondida_en TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_respuestas_hash ON respuestas_lecciones(alumna_hash);
CREATE INDEX IF NOT EXISTS idx_respuestas_leccion ON respuestas_lecciones(leccion_id);
CREATE INDEX IF NOT EXISTS idx_respuestas_hash_leccion ON respuestas_lecciones(alumna_hash, leccion_id);
CREATE INDEX IF NOT EXISTS idx_respuestas_tipo ON respuestas_lecciones(tipo);