/**
 * Generador de contraseñas amigables para niñas.
 * Formato: <animal>-<color>-<numero>
 * Ejemplo: gato-azul-42, sol-feliz-7
 */

const ANIMALES = [
  'gato', 'perro', 'buho', 'leon', 'tigre', 'delfin', 'panda', 'zorro',
  'conejo', 'caballo', 'tortuga', 'mariposa', 'abeja', 'pinguino', 'ballena',
  'elefante', 'jirafa', 'mono', 'raton', 'ardilla', 'nutria', 'foca',
  'lobo', 'ciervo', 'pajaro', 'pulpo', 'estrella',
];

const ADJETIVOS = [
  'azul', 'rojo', 'verde', 'dorado', 'plateado', 'morado', 'rosado',
  'feliz', 'valiente', 'curioso', 'tranquilo', 'brillante', 'rapido',
  'suave', 'grande', 'pequeno', 'alegre', 'serio', 'tierno', 'fuerte',
];

/**
 * Genera una contraseña amigable aleatoria.
 * Formato: <animal>-<adjetivo>-<numero 10-99>
 */
export function generarPasswordAmigable(): string {
  const animal = ANIMALES[Math.floor(Math.random() * ANIMALES.length)];
  const adjetivo = ADJETIVOS[Math.floor(Math.random() * ADJETIVOS.length)];
  const numero = Math.floor(Math.random() * 90) + 10; // 10-99
  return `${animal}-${adjetivo}-${numero}`;
}
