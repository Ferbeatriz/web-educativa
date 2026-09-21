/**
 * Sistema de selección aleatoria de preguntas con memoria.
 * 
 * Uso:
 *   const seleccion = seleccionarPreguntas(banco, configuracion, libroId);
 * 
 * Guarda en localStorage qué preguntas ya vio la niña, para priorizar las nuevas.
 */

export function mezclar(array) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export function leerVistas(libroId, tipo) {
  if (typeof localStorage === 'undefined') return [];
  const clave = `comprension-${libroId}-${tipo}-vistas`;
  const datos = localStorage.getItem(clave);
  return datos ? JSON.parse(datos) : [];
}

export function guardarVistas(libroId, tipo, ids) {
  if (typeof localStorage === 'undefined') return;
  const clave = `comprension-${libroId}-${tipo}-vistas`;
  const anteriores = leerVistas(libroId, tipo);
  const nuevas = [...new Set([...anteriores, ...ids])];
  localStorage.setItem(clave, JSON.stringify(nuevas));
}

export function seleccionarPorDificultad(banco, cantidad, vistas) {
  // Separar por dificultad
  const medias = banco.filter(p => p.dificultad === 'media');
  const dificiles = banco.filter(p => p.dificultad === 'dificil');
  const muyDificiles = banco.filter(p => p.dificultad === 'muy_dificil');

  // Calcular cuántas de cada categoría
  const nMedias = Math.round(cantidad * 0.30);
  const nMuyDificiles = Math.round(cantidad * 0.30);
  const nDificiles = cantidad - nMedias - nMuyDificiles;

  // Función para elegir priorizando las no vistas
  const elegir = (grupo, n) => {
    const noVistas = grupo.filter(p => !vistas.includes(p.id));
    const vistas = grupo.filter(p => vistas.includes(p.id));

    let seleccion = [];
    if (noVistas.length >= n) {
      seleccion = mezclar(noVistas).slice(0, n);
    } else {
      seleccion = [
        ...mezclar(noVistas),
        ...mezclar(vistas).slice(0, n - noVistas.length)
      ];
    }
    return seleccion;
  };

  // Elegir según distribución
  const seleccionMedias = elegir(medias, nMedias);
  const seleccionDificiles = elegir(dificiles, nDificiles);
  const seleccionMuyDificiles = elegir(muyDificiles, nMuyDificiles);

  // Orden ascendente: medias → difíciles → muy difíciles
  return [
    ...seleccionMedias,
    ...seleccionDificiles,
    ...seleccionMuyDificiles
  ];
}

export function seleccionarPreguntas(banco, cantidad, libroId, tipo) {
  const vistas = leerVistas(libroId, tipo);
  const seleccion = seleccionarPorDificultad(banco, cantidad, vistas);
  return seleccion;
}

export function reiniciarProgreso(libroId) {
  if (typeof localStorage === 'undefined') return;
  ['comprension', 'desarrollo', 'relectura'].forEach(tipo => {
    localStorage.removeItem(`comprension-${libroId}-${tipo}-vistas`);
  });
}

export function verProgreso(libroId, banco, tipo) {
  const vistas = leerVistas(libroId, tipo);
  return {
    vistas: vistas.length,
    total: banco.length,
    porcentaje: Math.round((vistas.length / banco.length) * 100)
  };
}
