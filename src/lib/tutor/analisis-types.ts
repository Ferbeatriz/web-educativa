export interface ErrorComun {
  respuesta_incorrecta_1?: string;
  respuesta_incorrecta_2?: string;
  respuesta_incorrecta_3?: string;
}

export interface PasoAnalisis {
  n: number;
  pregunta: string;
  opciones: string[];
  respuesta_correcta: string;
  feedback_correcto: string;
  errores_comunes?: ErrorComun;
}

export interface Analisis {
  fragmento: string;
  pasos: PasoAnalisis[];
  revelacion: string;
}