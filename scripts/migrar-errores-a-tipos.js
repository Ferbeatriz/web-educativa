#!/usr/bin/env node

/**
 * Migra los errores_comunes de division-problemas.json
 * de string plano a objeto { mensaje, error_type }.
 *
 * Uso:
 *   node scripts/migrar-errores-a-tipos.js --dry-run
 *     → Solo analiza y genera scripts/reporte-clasificacion.json
 *     → NO modifica el JSON original
 *
 *   node scripts/migrar-errores-a-tipos.js --apply
 *     → Modifica division-problemas.json
 *     → Genera scripts/reporte-clasificacion-final.json
 *
 * Reglas de clasificación (en orden de prioridad, la primera que calza gana):
 *   1. error_resta_intermedia   → contiene resta "X − Y = Z, no W"
 *   2. resto_mayor_divisor      → contiene "no sobra", "se repartieron", "Todos/Todas/Toda", etc.
 *   3. error_suma_total         → contiene "hay que sumar", "más las/los",
 *                                 "X × Y = Z[, palabra] más W = V",
 *                                 o "X + Y = Z[, palabra], no W"
 *   4. subestimacion            → contiene "faltarían", "faltaría", "sobrarían", "sobraría"
 *   5. sobreestimacion          → contiene "solo hay" (case-insensitive)
 *   6. error_calculo_mult       → contiene "X × Y = Z[, palabra], no W" o "N × $M = $P"
 *   7. error_conceptual         → fallback
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// Configuración de rutas
// ============================================================

const JSON_PATH = path.resolve(
  __dirname,
  '../src/data/materias/matematicas/lecciones/division-problemas.json'
);

const REPORT_PATH = path.resolve(__dirname, 'reporte-clasificacion.json');
const REPORT_FINAL_PATH = path.resolve(__dirname, 'reporte-clasificacion-final.json');

// ============================================================
// Reglas de clasificación
// ============================================================

const REGLAS = [
  {
    tipo: 'error_resta_intermedia',
    // "248 − 24 = 224, no 234." o "248 - 24 = 224, no 234."
    test: (msg) => /[−-]\s*\d+\s*=\s*\d+.*\bno\b/i.test(msg),
  },
  {
    tipo: 'resto_mayor_divisor',
    test: (msg) => {
      const patrones = [
        'no sobra',
        'se repartieron',
        'se usaron',
        'se ordenaron',
        'se empacaron',
        'se plantaron',
        'se distribuyeron',
        'se guardaron',
        'se organizaron',
        'Todos',
        'Todas',
        'Toda',
      ];
      return patrones.some((p) => msg.includes(p));
    },
  },
  {
    tipo: 'error_suma_total',
    test: (msg) => {
      // Patrones textuales
      const patrones = ['hay que sumar', 'más las', 'más los'];
      if (patrones.some((p) => msg.includes(p))) return true;

      // "X × Y = Z, más W = V." (sin palabra intermedia)
      if (/\d+\s*×\s*\d+\s*=\s*\d+\s*,\s*más\s*\d+\s*=\s*\d+/i.test(msg)) {
        return true;
      }

      // "X + Y = Z, no W." (sin palabra intermedia)
      if (/\d+\s*\+\s*\d+\s*=\s*\d+\s*,\s*no\s*\d+/i.test(msg)) {
        return true;
      }

      // "X + Y = Z cajas, no W." (con palabra intermedia opcional)
      if (/\d+\s*\+\s*\d+\s*=\s*\d+\s*(\s+\w+)?\s*,\s*no\s*\d+/i.test(msg)) {
        return true;
      }

      return false;
    },
  },
  {
    tipo: 'subestimacion',
    test: (msg) =>
      msg.includes('faltarían') ||
      msg.includes('faltaría') ||
      msg.includes('sobrarían') ||
      msg.includes('sobraría'),
  },
  {
    tipo: 'sobreestimacion',
    // case-insensitive para capturar "Solo hay" y "solo hay"
    test: (msg) => /solo hay/i.test(msg),
  },
  {
    tipo: 'error_calculo_mult',
    test: (msg) => {
      // "2 × 5 = 10, no 8." (sin palabra intermedia)
      if (/\d+\s*×\s*\d+\s*=\s*\d+\s*,\s*no\s*\d+/i.test(msg)) {
        return true;
      }
      // "4 × 6 = 24 cajas, no 20." (con palabra intermedia opcional)
      if (/\d+\s*×\s*\d+\s*=\s*\d+\s*(\s+\w+)?\s*,\s*no\s*\d+/i.test(msg)) {
        return true;
      }
      // "140 × $1.500 = $210.000." (con dinero)
      if (/\d+\s*×\s*\$[\d.]+\s*=\s*\$[\d.]+/i.test(msg)) {
        return true;
      }
      return false;
    },
  },
];

/**
 * Clasifica un mensaje de error.
 * Devuelve el error_type según las reglas, o 'error_conceptual' si ninguna calza.
 */
function clasificarError(mensaje) {
  for (const regla of REGLAS) {
    if (regla.test(mensaje)) {
      return regla.tipo;
    }
  }
  return 'error_conceptual';
}

// ============================================================
// Lógica principal
// ============================================================

function analizarYClasificar(data) {
  const resultado = {
    total_errores: 0,
    por_tipo: {
      subestimacion: 0,
      sobreestimacion: 0,
      error_resta_intermedia: 0,
      resto_mayor_divisor: 0,
      error_suma_total: 0,
      error_calculo_mult: 0,
      error_conceptual: 0,
    },
    casos_ambiguos: [],
    detalle_por_problema: {},
  };

  const niveles = data.niveles;

  for (const nivelKey of ['media', 'dificil', 'muy_dificil']) {
    const nivel = niveles[nivelKey];
    if (!nivel || !nivel.problemas) continue;

    for (const problema of nivel.problemas) {
      const pasos = problema.tutor?.pasos || [];
      const detallesProblema = [];

      for (const paso of pasos) {
        const errores = paso.errores_comunes || {};
        for (const [opcion, valor] of Object.entries(errores)) {
          // Si ya está migrado (objeto), saltar
          if (typeof valor !== 'string') continue;

          const tipo = clasificarError(valor);
          resultado.total_errores++;
          resultado.por_tipo[tipo]++;

          detallesProblema.push({
            paso_n: paso.n,
            opcion,
            mensaje: valor,
            error_type_inferido: tipo,
          });

          if (tipo === 'error_conceptual') {
            resultado.casos_ambiguos.push({
              problema_id: problema.id,
              paso_n: paso.n,
              opcion,
              mensaje: valor,
              error_type_inferido: tipo,
            });
          }
        }
      }

      if (detallesProblema.length > 0) {
        resultado.detalle_por_problema[problema.id] = detallesProblema;
      }
    }
  }

  return resultado;
}

function aplicarMigracion(data) {
  const niveles = data.niveles;

  for (const nivelKey of ['media', 'dificil', 'muy_dificil']) {
    const nivel = niveles[nivelKey];
    if (!nivel || !nivel.problemas) continue;

    for (const problema of nivel.problemas) {
      const pasos = problema.tutor?.pasos || [];

      for (const paso of pasos) {
        const errores = paso.errores_comunes || {};
        const nuevosErrores = {};

        for (const [opcion, valor] of Object.entries(errores)) {
          if (typeof valor === 'string') {
            nuevosErrores[opcion] = {
              mensaje: valor,
              error_type: clasificarError(valor),
            };
          } else {
            // Ya migrado
            nuevosErrores[opcion] = valor;
          }
        }

        paso.errores_comunes = nuevosErrores;
      }
    }
  }

  return data;
}

// ============================================================
// CLI
// ============================================================

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const apply = args.includes('--apply');

  if (!dryRun && !apply) {
    console.error('❌ Debes indicar --dry-run o --apply');
    console.error('');
    console.error('  node scripts/migrar-errores-a-tipos.js --dry-run');
    console.error('  node scripts/migrar-errores-a-tipos.js --apply');
    process.exit(1);
  }

  if (dryRun && apply) {
    console.error('❌ No puedes usar --dry-run y --apply a la vez');
    process.exit(1);
  }

  if (!fs.existsSync(JSON_PATH)) {
    console.error(`❌ No se encontró el archivo: ${JSON_PATH}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(JSON_PATH, 'utf-8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error('❌ Error al parsear el JSON:', err.message);
    process.exit(1);
  }

  // --------------------------------------------
  // Modo --dry-run
  // --------------------------------------------
  if (dryRun) {
    console.log('🔍 Modo --dry-run: analizando sin modificar nada...\n');

    const reporte = analizarYClasificar(data);

    fs.writeFileSync(REPORT_PATH, JSON.stringify(reporte, null, 2), 'utf-8');

    console.log('📊 Reporte generado:');
    console.log(`   Total de errores analizados: ${reporte.total_errores}`);
    console.log('');
    console.log('   Distribución por tipo:');
    for (const [tipo, count] of Object.entries(reporte.por_tipo)) {
      const pct = reporte.total_errores > 0
        ? ((count / reporte.total_errores) * 100).toFixed(1)
        : '0.0';
      console.log(`   - ${tipo.padEnd(24)} ${String(count).padStart(4)} (${pct}%)`);
    }
    console.log('');
    console.log(`   Casos ambiguos (revisión manual): ${reporte.casos_ambiguos.length}`);
    console.log('');
    console.log(`✅ Reporte guardado en: ${REPORT_PATH}`);
    console.log('');
    console.log('👉 Revisa el reporte. Si todo está OK, corre:');
    console.log('   node scripts/migrar-errores-a-tipos.js --apply');
    return;
  }

  // --------------------------------------------
  // Modo --apply
  // --------------------------------------------
  if (apply) {
    console.log('✍️  Modo --apply: migrando errores_comunes...\n');

    const reportePrevio = analizarYClasificar(data);
    const dataMigrada = aplicarMigracion(data);

    // Validación: que el JSON migrado sea parseable
    const verificacion = JSON.parse(JSON.stringify(dataMigrada));

    // Verificar que no se perdió nada
    const reportePost = analizarYClasificar(verificacion);
    if (reportePost.total_errores !== 0) {
      console.error('❌ Algo salió mal: quedan errores sin migrar.');
      process.exit(1);
    }

    fs.writeFileSync(JSON_PATH, JSON.stringify(dataMigrada, null, 2), 'utf-8');

    fs.writeFileSync(
      REPORT_FINAL_PATH,
      JSON.stringify(reportePrevio, null, 2),
      'utf-8'
    );

    console.log('📊 Migración completada:');
    console.log(`   Total de errores migrados: ${reportePrevio.total_errores}`);
    console.log('');
    console.log('   Distribución por tipo:');
    for (const [tipo, count] of Object.entries(reportePrevio.por_tipo)) {
      const pct = reportePrevio.total_errores > 0
        ? ((count / reportePrevio.total_errores) * 100).toFixed(1)
        : '0.0';
      console.log(`   - ${tipo.padEnd(24)} ${String(count).padStart(4)} (${pct}%)`);
    }
    console.log('');
    console.log(`   Casos ambiguos (error_conceptual): ${reportePrevio.casos_ambiguos.length}`);
    console.log('');
    console.log(`✅ JSON migrado: ${JSON_PATH}`);
    console.log(`✅ Reporte final: ${REPORT_FINAL_PATH}`);
    console.log('');
    console.log('👉 Revisa el JSON migrado. Si todo está OK:');
    console.log('   git add . && git commit -m "migrar errores_comunes a objeto {mensaje, error_type}" && git push');
  }
}

main();