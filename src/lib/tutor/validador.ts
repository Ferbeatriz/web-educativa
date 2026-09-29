/**
 * Validador de pasos para el tutor interactivo.
 * Separado del componente para poder migrar la lógica al Worker
 * (o a un motor externo tipo Mathsteps) sin tocar la UI.
 */

export interface ErrorComun {
  [respuestaIncorrecta: string]: string;
}

export interface Paso {
  n: number;
  pregunta: string;
  tipo: 'si_no' | 'opciones';
  opciones: string[];
  respuesta_correcta: string;
  feedback_correcto: string;
  errores_comunes?: ErrorComun;
}

export interface Ejercicio {
  id: string;
  materia_id: string;
  tema: string;
  dificultad: string;
  titulo: string;
  emoji: string;
  contexto?: string;
  pasos: Paso[];
  cierre?: string;
}

export interface ResultadoValidacion {
  correcto: boolean;
  feedback: string;
  tipo_error?: string;
  siguiente_paso?: number;
  completo?: boolean;
}

export function validarPaso(
  ejercicio: Ejercicio,
  pasoActual: number,
  respuesta: string
): ResultadoValidacion {
  const paso = ejercicio.pasos[pasoActual - 1];

  if (!paso) {
    return {
      correcto: false,
      feedback: 'Paso no encontrado.',
      tipo_error: 'paso_invalido',
    };
  }

  const normalizar = (s: string) => s.trim().toLowerCase();
  const esCorrecto = normalizar(respuesta) === normalizar(paso.respuesta_correcta);

  if (esCorrecto) {
    const esUltimo = pasoActual >= ejercicio.pasos.length;
    return {
      correcto: true,
      feedback: paso.feedback_correcto,
      siguiente_paso: esUltimo ? undefined : pasoActual + 1,
      completo: esUltimo,
    };
  }

  let feedback = 'Esa no es la respuesta correcta. Inténtalo de nuevo.';
  let tipo_error = 'generico';

  if (paso.errores_comunes) {
    for (const clave in paso.errores_comunes) {
      if (normalizar(clave) === normalizar(respuesta)) {
        feedback = paso.errores_comunes[clave];
        tipo_error = `error_${clave.toLowerCase().replace(/\s+/g, '_')}`;
        break;
      }
    }
  }

  return { correcto: false, feedback, tipo_error };
}
