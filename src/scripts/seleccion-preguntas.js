/**
 * Sistema de selección aleatoria de preguntas con memoria.
 *
 * Características:
 * - Distribución por dificultad configurable (por defecto 30/40/30)
 * - Orden ascendente: medias → difíciles → muy difíciles
 * - Prioriza preguntas no vistas (usa localStorage)
 * - Cuando se ven todas, reinicia el ciclo automáticamente
 * - Reutilizable para cualquier libro del Club de Lectura
 *
 * Uso:
 *   import { seleccionarPreguntas, guardarVistas } from '../scripts/seleccion-preguntas.js';
 *
 *   const seleccion = seleccionarPreguntas(banco, 10, 'la-historia-de-manu', 'comprension');
 */

// ============================================================
// UTILIDADES BÁSICAS
// ============================================================

/**
 * Mezcla aleatoriamente un array (algoritmo Fisher-Yates).
 * No modifica el array original.
 */
export function mezclar(array) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/**
 * Verifica si localStorage está disponible (SSR safe).
 */
function tieneLocalStorage() {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch (e) {
    return false;
  }
}

// ============================================================
// PERSISTENCIA (localStorage)
// ============================================================

/**
 * Lee las preguntas que la niña ya vio.
 * Devuelve un array de IDs.
 */
export function leerVistas(libroId, tipo) {
  if (!tieneLocalStorage()) return [];
  const clave = `comprension-${libroId}-${tipo}-vistas`;
  try {
    const datos = localStorage.getItem(clave);
    return datos ? JSON.parse(datos) : [];
  } catch (e) {
    console.warn('Error leyendo localStorage:', e);
    return [];
  }
}

/**
 * Guarda los IDs de las preguntas que la niña acaba de ver.
 * Acumula con las anteriores (no las reemplaza).
 */
export function guardarVistas(libroId, tipo, ids) {
  if (!tieneLocalStorage()) return;
  const clave = `comprension-${libroId}-${tipo}-vistas`;
  try {
    const anteriores = leerVistas(libroId, tipo);
    const nuevas = [...new Set([...anteriores, ...ids])];
    localStorage.setItem(clave, JSON.stringify(nuevas));
  } catch (e) {
    console.warn('Error guardando en localStorage:', e);
  }
}

/**
 * Reinicia el progreso de un libro (borra todo lo visto).
 */
export function reiniciarProgreso(libroId) {
  if (!tieneLocalStorage()) return;
  ['comprension', 'desarrollo', 'relectura'].forEach(tipo => {
    const clave = `comprension-${libroId}-${tipo}-vistas`;
    localStorage.removeItem(clave);
  });
}

/**
 * Devuelve estadísticas del progreso.
 */
export function verProgreso(libroId, totalPreguntas, tipo) {
  const vistas = leerVistas(libroId, tipo);
  return {
    vistas: vistas.length,
    total: totalPreguntas,
    porcentaje: totalPreguntas > 0 ? Math.round((vistas.length / totalPreguntas) * 100) : 0,
    restantes: Math.max(0, totalPreguntas - vistas.length),
  };
}

// ============================================================
// SELECCIÓN POR DIFICULTAD
// ============================================================

/**
 * Distribución por defecto: 30% media, 40% dificil, 30% muy_dificil.
 */
const DISTRIBUCION_DEFAULT = {
  media: 0.30,
  dificil: 0.40,
  muy_dificil: 0.30,
};

/**
 * Calcula cuántas preguntas tomar de cada dificultad.
 * Ajusta para que la suma sea exactamente la cantidad pedida.
 */
function calcularCantidades(cantidad, distribucion = DISTRIBUCION_DEFAULT) {
  const nMedias = Math.round(cantidad * distribucion.media);
  const nMuyDificiles = Math.round(cantidad * distribucion.muy_dificil);
  const nDificiles = cantidad - nMedias - nMuyDificiles;
  return { nMedias, nDificiles, nMuyDificiles };
}

/**
 * Elige N elementos de un grupo, priorizando los no vistos.
 * Si no hay suficientes no vistos, completa con vistas.
 */
function elegirConPrioridad(grupo, cantidad, vistasIds) {
  if (cantidad <= 0) return [];
  if (grupo.length === 0) return [];

  const noVistas = grupo.filter(p => !vistasIds.includes(p.id));
  const vistas = grupo.filter(p => vistasIds.includes(p.id));

  // Mezclar ambos subgrupos
  const noVistasMezcladas = mezclar(noVistas);
  const vistasMezcladas = mezclar(vistas);

  // Tomar primero las no vistas, luego completar con las vistas
  const seleccion = [
    ...noVistasMezcladas.slice(0, cantidad),
    ...vistasMezcladas.slice(0, Math.max(0, cantidad - noVistasMezcladas.length)),
  ];

  return seleccion.slice(0, cantidad);
}

/**
 * Selecciona preguntas priorizando las no vistas y distribuyendo por dificultad.
 * Orden de presentación: medias → difíciles → muy difíciles.
 */
export function seleccionarPorDificultad(banco, cantidad, vistasIds, distribucion = DISTRIBUCION_DEFAULT) {
  // Separar por dificultad
  const medias = banco.filter(p => p.dificultad === 'media');
  const dificiles = banco.filter(p => p.dificultad === 'dificil');
  const muyDificiles = banco.filter(p => p.dificultad === 'muy_dificil');

  // Calcular cuántas de cada una
  const { nMedias, nDificiles, nMuyDificiles } = calcularCantidades(cantidad, distribucion);

  // Elegir de cada grupo
  const seleccionMedias = elegirConPrioridad(medias, nMedias, vistasIds);
  const seleccionDificiles = elegirConPrioridad(dificiles, nDificiles, vistasIds);
  const seleccionMuyDificiles = elegirConPrioridad(muyDificiles, nMuyDificiles, vistasIds);

  // Orden ascendente: primero las más fáciles, después las más difíciles
  return [
    ...seleccionMedias,
    ...seleccionDificiles,
    ...seleccionMuyDificiles,
  ];
}

// ============================================================
// FUNCIÓN PRINCIPAL
// ============================================================

/**
 * Función principal: selecciona preguntas del banco.
 *
 * @param {Array} banco - Array de preguntas (con campo `dificultad` e `id`)
 * @param {number} cantidad - Cuántas preguntas seleccionar
 * @param {string} libroId - ID del libro (para localStorage)
 * @param {string} tipo - 'comprension' | 'desarrollo' | 'relectura'
 * @param {Object} distribucion - Opcional: { media, dificil, muy_dificil }
 * @returns {Array} Preguntas seleccionadas, ordenadas de menor a mayor dificultad
 */
export function seleccionarPreguntas(banco, cantidad, libroId, tipo, distribucion = DISTRIBUCION_DEFAULT) {
  if (!banco || banco.length === 0) return [];

  // Si el banco es más pequeño que la cantidad pedida, devolver todo mezclado
  if (banco.length <= cantidad) {
    return mezclar(banco);
  }

  const vistas = leerVistas(libroId, tipo);

  // Verificar si ya vio todas las preguntas
  const totalVistas = vistas.length;
  const totalBanco = banco.length;

  if (totalVistas >= totalBanco) {
    // Ya vio todas: reiniciar ciclo automáticamente
    // (solo para este tipo, mantiene el resto intacto)
    console.log(`[${libroId}/${tipo}] Ciclo completo: reiniciando rotación.`);
    reiniciarProgresoPorTipo(libroId, tipo);
    // Ahora no hay vistas, todas son nuevas
    return seleccionarPorDificultad(banco, cantidad, [], distribucion);
  }

  return seleccionarPorDificultad(banco, cantidad, vistas, distribucion);
}

/**
 * Reinicia solo un tipo (comprensión, desarrollo o relectura).
 * Se usa internamente cuando se completa el ciclo.
 */
function reiniciarProgresoPorTipo(libroId, tipo) {
  if (!tieneLocalStorage()) return;
  const clave = `comprension-${libroId}-${tipo}-vistas`;
  localStorage.removeItem(clave);
}

// ============================================================
// AYUDAS PARA LA UI
// ============================================================

/**
 * Etiquetas legibles para las dificultades.
 */
export const ETIQUETAS_DIFICULTAD = {
  media: 'Media',
  dificil: 'Difícil',
  muy_dificil: 'Muy difícil',
};

/**
 * Colores para cada dificultad (Tailwind-friendly).
 */
export const COLORES_DIFICULTAD = {
  media: { bg: '#FEF3C7', texto: '#92400E', borde: '#FCD34D' },
  dificil: { bg: '#FED7AA', texto: '#9A3412', borde: '#FB923C' },
  muy_dificil: { bg: '#FECACA', texto: '#991B1B', borde: '#F87171' },
};

/**
 * Dado un array de preguntas seleccionadas, devuelve la cantidad por dificultad.
 */
export function contarPorDificultad(preguntas) {
  const conteo = { media: 0, dificil: 0, muy_dificil: 0 };
  preguntas.forEach(p => {
    if (conteo[p.dificultad] !== undefined) {
      conteo[p.dificultad]++;
    }
  });
  return conteo;
}
