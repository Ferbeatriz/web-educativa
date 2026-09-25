-- ============================================================
-- ESQUEMA DE PROGRESO — web-educativa
-- Fase 3: Tracking de lecciones completadas
-- Aplicar con: npx wrangler d1 execute web-educativa-db --file=workers/api/schema-02-progreso.sql --remote
-- ============================================================

CREATE TABLE IF NOT EXISTS progreso (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alumna_id INTEGER NOT NULL,
  leccion_id TEXT NOT NULL,
  materia_id TEXT NOT NULL,
  xp_ganados INTEGER NOT NULL DEFAULT 50,
  completada_en TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (alumna_id) REFERENCES alumnas(id) ON DELETE CASCADE,
  UNIQUE (alumna_id, leccion_id)
);

CREATE INDEX IF NOT EXISTS idx_progreso_alumna ON progreso(alumna_id);
CREATE INDEX IF NOT EXISTS idx_progreso_leccion ON progreso(leccion_id);
CREATE INDEX IF NOT EXISTS idx_progreso_materia ON progreso(materia_id);
