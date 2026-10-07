/**
 * Validador de pasos para el tutor interactivo.
 * Separado del componente para poder migrar la lógica al Worker
 * (o a un motor externo tipo Mathsteps) sin tocar la UI.
 */

export interface ErrorComun {
  [respuestaIncorrecta: string]: string;
}

export interface EscenarioGrupos {
  grupos: number;
  por_grupo: number;
  resultado: number;
  estado: 'falta' | 'correcto' | 'sobra';
  nota?: string;
}

export interface VisualGrupos {
  tipo: 'grupos';
  total: number;
  divisor: number;
  etiqueta_grupo?: string;
  emoji_bloque?: string;
  escenarios: Record<string, EscenarioGrupos>;
}

export interface EscenarioResto {
  resto: number;
  estado: 'correcto' | 'imposible';
  nota?: string;
}

export interface VisualResto {
  tipo: 'resto';
  total: number;
  en_cajas: number;
  emoji_bloque?: string;
  escenarios: Record<string, EscenarioResto>;
}

export interface PrestamoResta {
  columna: 'unidades' | 'decenas' | 'centenas';
  desde: number;
  hacia: number;
  nuevo_desde: number;
  nuevo_hacia: number;
}

export interface ParcialResta {
  unidades: number | null;
  decenas: number | null;
}

export interface EscenarioResta {
  minuendo: number;
  sustraendo: number;
  resultado: number;
  estado: 'correcto' | 'error';
  prestamo?: PrestamoResta;
  parcial?: ParcialResta;
  nota?: string;
}

export interface VisualResta {
  tipo: 'resta';
  minuendo: number;
  sustraendo: number;
  emoji_bloque?: string;
  escenarios: Record<string, EscenarioResta>;
}

export type Visual = VisualGrupos | VisualResto | VisualResta;

export interface Paso {
  n: number;
  pregunta: string;
  tipo: 'si_no' | 'opciones';
  opciones: string[];
  respuesta_correcta: string;
  feedback_correcto: string;
  errores_comunes?: ErrorComun;
  visual?: Visual;
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
  /** Escenario visual a mostrar, si el paso lo tiene definido. */
  visual_escenario?: EscenarioGrupos | EscenarioResto | EscenarioResta;
  /** Tipo de visual, para que la UI sepa qué componente usar. */
  visual_tipo?: 'grupos' | 'resto' | 'resta';
  /** Datos completos del visual (total, divisor, etc.). */
  visual_datos?: Visual;
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

  // Resolver el visual ANTES, porque aplica tanto a acierto como a error
  let visual_escenario: EscenarioGrupos | EscenarioResto | EscenarioResta | undefined;
  let visual_tipo: 'grupos' | 'resto' | 'resta' | undefined;
  if (paso.visual && paso.visual.escenarios) {
    const esc = paso.visual.escenarios[respuesta];
    if (esc) {
      visual_escenario = esc;
      visual_tipo = paso.visual.tipo;
    }
  }

  if (esCorrecto) {
    const esUltimo = pasoActual >= ejercicio.pasos.length;
    return {
      correcto: true,
      feedback: paso.feedback_correcto,
      siguiente_paso: esUltimo ? undefined : pasoActual + 1,
      completo: esUltimo,
      visual_escenario,
      visual_tipo,
      visual_datos: paso.visual,
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

  return {
    correcto: false,
    feedback,
    tipo_error,
    visual_escenario,
    visual_tipo,
    visual_datos: paso.visual,
  };
}