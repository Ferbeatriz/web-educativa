#!/usr/bin/env node

/**
 * Migra los-textos-poeticos.json de formato viejo (trivia)
 * a formato nuevo (banco_trivia) con id, dificultad y tema.
 *
 * Uso:
 *   node scripts/migrar-poeticos-a-banco-trivia.js --dry-run
 *   node scripts/migrar-poeticos-a-banco-trivia.js --apply
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JSON_PATH = path.resolve(
  __dirname,
  '../src/data/materias/lenguaje/lecciones/los-textos-poeticos.json'
);

const REPORT_PATH = path.resolve(__dirname, 'reporte-migracion-poeticos.json');

// Asignaciones manuales (basadas en revisión del contenido)
const ASIGNACIONES = {
  0: { id: 'p01', tema: 'Estructura del poema', dificultad: 'media' },
  1: { id: 'p02', tema: 'Estructura del poema', dificultad: 'media' },
  2: { id: 'p03', tema: 'Rima', dificultad: 'media' },
  3: { id: 'p04', tema: 'Estructura del poema', dificultad: 'dificil' },
  4: { id: 'p05', tema: 'Verso y prosa', dificultad: 'dificil' },
  5: { id: 'p06', tema: 'Rima', dificultad: 'dificil' },
  6: { id: 'p07', tema: 'Rima', dificultad: 'dificil' },
  7: { id: 'p08', tema: 'Verso libre', dificultad: 'muy_dificil' },
  8: { id: 'p09', tema: 'Estructura del poema', dificultad: 'media' },
  9: { id: 'p10', tema: 'Función de la poesía', dificultad: 'muy_dificil' },
};

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const apply = args.includes('--apply');

  if (!dryRun && !apply) {
    console.error('❌ Debes indicar --dry-run o --apply');
    process.exit(1);
  }

  if (dryRun && apply) {
    console.error('❌ No puedes usar --dry-run y --apply a la vez');
    process.exit(1);
  }

  if (!fs.existsSync(JSON_PATH)) {
    console.error(`❌ No se encontró: ${JSON_PATH}`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));

  if (data.banco_trivia && data.banco_trivia.length > 0) {
    console.error('❌ Ya tiene banco_trivia. Nada que migrar.');
    process.exit(1);
  }

  if (!data.trivia || data.trivia.length === 0) {
    console.error('❌ No tiene trivia para migrar.');
    process.exit(1);
  }

  if (data.trivia.length !== 10) {
    console.error(`❌ Se esperaban 10 preguntas, hay ${data.trivia.length}.`);
    process.exit(1);
  }

  const bancoTrivia = data.trivia.map((pregunta, i) => {
    const asignacion = ASIGNACIONES[i];
    return {
      id: asignacion.id,
      dificultad: asignacion.dificultad,
      tema: asignacion.tema,
      pregunta: pregunta.pregunta,
      opciones: pregunta.opciones,
      respuesta_correcta: pregunta.respuesta_correcta,
      explicacion: pregunta.explicacion,
    };
  });

  const reporte = {
    total: bancoTrivia.length,
    por_dificultad: {
      media: bancoTrivia.filter(p => p.dificultad === 'media').length,
      dificil: bancoTrivia.filter(p => p.dificultad === 'dificil').length,
      muy_dificil: bancoTrivia.filter(p => p.dificultad === 'muy_dificil').length,
    },
    por_tema: {},
    banco_trivia: bancoTrivia,
  };

  for (const p of bancoTrivia) {
    reporte.por_tema[p.tema] = (reporte.por_tema[p.tema] || 0) + 1;
  }

  fs.writeFileSync(REPORT_PATH, JSON.stringify(reporte, null, 2), 'utf-8');

  if (dryRun) {
    console.log('🔍 Modo --dry-run');
    console.log(`   Total preguntas: ${reporte.total}`);
    console.log(`   Por dificultad: media=${reporte.por_dificultad.media}, dificil=${reporte.por_dificultad.dificil}, muy_dificil=${reporte.por_dificultad.muy_dificil}`);
    console.log(`   Por tema:`);
    for (const [tema, n] of Object.entries(reporte.por_tema)) {
      console.log(`     - ${tema}: ${n}`);
    }
    console.log(`   Reporte: ${REPORT_PATH}`);
    console.log('');
    console.log('👉 Si todo está OK, corre:');
    console.log('   node scripts/migrar-poeticos-a-banco-trivia.js --apply');
    return;
  }

  if (apply) {
    const dataMigrada = {
      ...data,
      banco_trivia: bancoTrivia,
    };
    delete dataMigrada.trivia;

    fs.writeFileSync(JSON_PATH, JSON.stringify(dataMigrada, null, 2), 'utf-8');

    console.log('✅ Migración completada');
    console.log(`   Total: ${reporte.total}`);
    console.log(`   Por dificultad: media=${reporte.por_dificultad.media}, dificil=${reporte.por_dificultad.dificil}, muy_dificil=${reporte.por_dificultad.muy_dificil}`);
    console.log(`   JSON migrado: ${JSON_PATH}`);
    console.log(`   Reporte: ${REPORT_PATH}`);
    console.log('');
    console.log('👉 Revisa el JSON y commitea:');
    console.log('   git add . && git commit -m "Fix: migrar los-textos-poeticos a banco_trivia (sistema rotativo)" && git push');
  }
}

main();
