/**
 * Motor común de informes.
 * Todos los informes (apoderado, profesor, dirección, plataforma) consumen
 * este módulo. Devuelve hechos educativos neutros, sin juicio académico ni de negocio.
 */

import {
  getResumenProgreso,
  getProgresoCompleto,
  getLogrosDesbloqueados,
  getResumenRespuestasPorRango,
} from './db';
import { hashAlumna } from './crypto';

// Interfaz para el entorno (ajusta según tu Env)
interface Env {
  DB: D1Database;
  INTENTOS_SALT: string;
}

export interface HechoAlumna {
  alumna: { nombre: string; usuario: string };
  periodo: { desde: string; hasta: string };
  resumen: { xp_total: number; nivel: { nombre: string; emoji: string } };
  lecciones: { leccion_id: string; materia_id: string; completada_en: string }[];
  logros: string[];
  area_de_mejora: {
    leccion_id: string;
    tasa_acierto: number;
    correctas: number;
    total: number;
  } | null;
  respuestas_detalle: {
    leccion_id: string;
    total: number;
    correctas: number;
    incorrectas: number;
  }[];
}

/**
 * Agrega el hecho educativo de una alumna en un rango de fechas.
 * Es la base para el informe del apoderado (y futuras capas).
 */
export async function agregarHechoAlumna(
  env: Env,
  alumna: { id: number; nombre: string; usuario: string },
  desde: string,
  hasta: string
): Promise<HechoAlumna> {
  const resumen = await getResumenProgreso(env.DB, alumna.id);
  const progresoCompleto = await getProgresoCompleto(env.DB, alumna.id);
  const logros = await getLogrosDesbloqueados(env.DB, alumna.id);

  // Filtrar por rango (comparación simple de strings ISO)
  const leccionesEnRango = progresoCompleto.filter(
    (p) => p.completada_en >= desde && p.completada_en <= hasta
  );

  // Análisis de respuestas (necesita el hash)
  const alumna_hash = await hashAlumna(alumna.id, env.INTENTOS_SALT);
  const respuestas = await getResumenRespuestasPorRango(
    env.DB,
    alumna_hash,
    desde,
    hasta
  );

  // Calcular área de mejora (la lección con menor tasa de acierto)
  let area_de_mejora = null;
  if (respuestas.length > 0) {
    let peor = respuestas[0];
    let peorTasa = 1;
    for (const r of respuestas) {
      const tasa = r.correctas / r.total;
      if (tasa < peorTasa) {
        peorTasa = tasa;
        peor = r;
      }
    }
    area_de_mejora = {
      leccion_id: peor.leccion_id,
      tasa_acierto: Math.round(peorTasa * 100),
      correctas: peor.correctas,
      total: peor.total,
    };
  }

  // Calcular nivel (asumiendo que existe calcularNivel)
  // Nota: importa calcularNivel desde progreso.ts o duplícalo aquí.
  const nivel = calcularNivelSimple(resumen.xp_total);

  return {
    alumna: { nombre: alumna.nombre, usuario: alumna.usuario },
    periodo: { desde, hasta },
    resumen: {
      xp_total: resumen.xp_total,
      nivel: { nombre: nivel.nombre, emoji: nivel.emoji },
    },
    lecciones: leccionesEnRango.map((p) => ({
      leccion_id: p.leccion_id,
      materia_id: p.materia_id,
      completada_en: p.completada_en,
    })),
    logros: logros.map((l) => l.logro_id),
    area_de_mejora,
    respuestas_detalle: respuestas.map((r) => ({
      leccion_id: r.leccion_id,
      total: r.total,
      correctas: r.correctas,
      incorrectas: r.total - r.correctas,
    })),
  };
}

// Helper para el nivel (si ya tienes calcularNivel exportado, úsalo)
function calcularNivelSimple(xp: number): { nombre: string; emoji: string } {
  if (xp >= 2000) return { nombre: 'Maestra', emoji: '👑' };
  if (xp >= 1000) return { nombre: 'Sabia', emoji: '📚' };
  if (xp >= 500) return { nombre: 'Aventurera', emoji: '🗺️' };
  if (xp >= 250) return { nombre: 'Exploradora', emoji: '🦉' };
  if (xp >= 100) return { nombre: 'Curiosa', emoji: '🐣' };
  return { nombre: 'Aprendiz', emoji: '🥚' };
}
