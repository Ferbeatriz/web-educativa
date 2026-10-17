-- Tabla de logros desbloqueados por alumna.
-- Persistente: se inserta una vez y no se repite.
-- Idempotente: el INSERT usa OR IGNORE.

CREATE TABLE IF NOT EXISTS logros_alumna (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alumna_id INTEGER NOT NULL,
  logro_id TEXT NOT NULL,
  desbloqueado_en TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (alumna_id) REFERENCES alumnas(id),
  UNIQUE(alumna_id, logro_id)
);

CREATE INDEX IF NOT EXISTS idx_logros_alumna_alumna
  ON logros_alumna(alumna_id);

CREATE INDEX IF NOT EXISTS idx_logros_alumna_logro
  ON logros_alumna(logro_id);
