# 🎓 TUTOR INTERACTIVO — Plan de Implementación

> Estado: Planificado, no implementado
> Prioridad: Alta (siguiente fase)
> Fecha de diseño: 2026-09-28

---

## 🎯 Objetivo

Transformar las lecciones de "leer → responder trivia" a un formato **interactivo tipo tutor guiado por pasos**, inspirado en Synthesis Tutor.

**Características**:
- Presentación del problema con contexto visual.
- Guía paso a paso con feedback inmediato.
- Manejo de errores comunes con explicaciones específicas.
- Interacción por **botones/clic** (drag & drop en fase posterior).
- **NO usa voz** (solo touch/clic).
- Aplicable a **TODAS las materias** (empezando por división en Matemáticas).

---

## 📋 Decisiones clave

| Decisión | Elección |
|----------|----------|
| Interacción | Botones y opciones (fase 1), drag & drop (fase 4) |
| Entrada de voz | No |
| Alcance inicial | 1 lección modelo (división 37÷5) |
| Alcance final | Todas las lecciones de todas las materias |
| Integración con XP | Sí, misma recompensa (50 XP por lección completada) |
| Contenido | JSON (editable sin tocar código) |

---

## 🏗️ Arquitectura propuesta

### Backend (Workers + D1)

**Nueva tabla**: `tutor_ejercicios`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER | PK autoincremental |
| ejercicio_id | TEXT | Slug único (ej: "division-37-entre-5") |
| materia_id | TEXT | "matematicas" |
| tema | TEXT | "division" |
| dificultad | TEXT | "facil", "media", "dificil" |
| titulo | TEXT | Título del ejercicio |
| pasos | TEXT (JSON) | Array de pasos con validaciones |

**Estructura del campo `pasos`**:

```json
[
  {
    "n": 1,
    "pregunta": "¿Puedes dividir 3 entre 5?",
    "tipo": "si_no",
    "respuesta_correcta": "no",
    "feedback_correcto": "¡Exacto! 3 es más chico que 5.",
    "feedback_error": "En realidad 3 es más chico que 5."
  },
  {
    "n": 2,
    "pregunta": "¿Cuál es el múltiplo de 5 más cercano a 37 sin pasarse?",
    "tipo": "opciones",
    "opciones": ["5", "6", "7", "8", "9"],
    "respuesta_correcta": "7",
    "feedback_correcto": "¡Sí! 7 × 5 = 35.",
    "errores_comunes": {
      "8": "8 × 5 = 40. Te pasaste por 3.",
      "9": "9 × 5 = 45. Te pasaste por mucho."
    }
  }
]
Tipos de paso (fase 1):

si_no: 2 botones (Sí / No).

opciones: múltiples opciones.

numero: input numérico con validación.

Nuevo endpoint: POST /api/tutor/validar-paso

Request:

json
{
  "ejercicio_id": "division-37-entre-5",
  "paso_actual": 2,
  "respuesta": "8"
}
Response (correcto):

json
{
  "ok": true,
  "correcto": true,
  "siguiente_paso": 3
}
Response (incorrecto):

json
{
  "ok": true,
  "correcto": false,
  "tipo_error": "se_pasa",
  "feedback": "8 × 5 = 40. Te pasaste por 3. Prueba con un número más chico."
}
Frontend (Astro)
Nuevo componente: src/components/tutor/TutorPasos.astro

Funcionalidades:

Lee el ejercicio del backend.

Muestra el paso actual (título, pregunta, opciones).

Captura la respuesta (botones, input).

Llama al endpoint de validación.

Muestra feedback correcto/incorrecto.

Avanza cuando es correcto.

Al completar todos los pasos: marca lección como completada (+50 XP).

Nuevo layout de página: src/pages/tutor/[ejercicio].astro

Contenido (JSON)
Los ejercicios se guardan como archivos JSON en:

src/data/tutor/<materia>/<ejercicio-id>.json

Ejemplo: src/data/tutor/matematicas/division-37-entre-5.json

Ventaja: fácil de crear, versionable con Git.

🗺️ Roadmap por fases
🥇 Fase 1 — MVP con botones (1-2 sesiones)
Objetivo: validar el enfoque con UN ejercicio.

Entregables:

Tabla tutor_ejercicios en D1 (opcional, se puede leer desde JSON).

Endpoint POST /api/tutor/validar-paso.

Componente <TutorPasos />.

Página /tutor/division-37-entre-5.

1 ejercicio modelo funcional.

Tipos de paso soportados: si_no, opciones.

Ejemplo: "División con resto: 37 ÷ 5".

🥈 Fase 2 — Más tipos de paso + expansión (1 sesión)
Objetivo: cubrir más casos.

Añadir:

Tipo numero (input libre con validación numérica).

Tipo formula (con MathJax/KaTeX para fórmulas).

Feedback en capas (pista → explicación → respuesta).

Añadir: 5 ejercicios más de división.

🥉 Fase 3 — Integración con XP y progreso (1 sesión)
Objetivo: conectar el tutor con el sistema de progreso existente.

Añadir:

Al completar todos los pasos: POST /api/progreso/completar (marca lección y suma XP).

El tutor aparece como una "lección" más en la materia.

Barra de lectura funciona también.

🏅 Fase 4 — Manipuladores visuales (2-3 sesiones)
Objetivo: agregar drag & drop y visualizaciones.

Añadir:

Arrastrar bloques.

Línea numérica interactiva.

Animaciones.

Feedback visual rico.

🎨 Ejemplo de UX (Fase 1)
text
┌────────────────────────────────────────┐
│  🎓 Tutor · División con resto         │
├────────────────────────────────────────┤
│                                        │
│  Paso 2 de 4                           │
│  ▓▓▓▓▓▓▓▓░░░░░░░░░                     │
│                                        │
│  Estás dividiendo 37 ÷ 5               │
│                                        │
│  ¿Cuál es el múltiplo de 5 más         │
│  cercano a 37 sin pasarse?             │
│                                        │
│  [5]  [6]  [7]  [8]  [9]               │
│                                        │
└────────────────────────────────────────┘
Al hacer clic en "8":

text
┌────────────────────────────────────────┐
│  ❌ 8 × 5 = 40. Te pasaste por 3.      │
│                                        │
│  Prueba con un número más chico.       │
│                                        │
│  [Intentar de nuevo]                   │
└────────────────────────────────────────┘
Al hacer clic en "7":

text
┌────────────────────────────────────────┐
│  ✅ ¡Sí! 7 × 5 = 35.                   │
│                                        │
│  Ahora vamos al siguiente paso.        │
│                                        │
│  [Continuar]                           │
└────────────────────────────────────────┘
📊 Estimación de sesiones
Fase	Trabajo	Sesiones
1	MVP con 1 ejercicio	1-2
2	Más tipos + 5 ejercicios	1
3	Integración con XP	1
4	Manipuladores visuales	2-3
Total MVP+expansión		5-7 sesiones
🎯 Prioridad y siguiente paso
Próximo paso al abrir chat nuevo:

Leer este archivo completo.

Confirmar el enfoque por fases.

Empezar con la Fase 1: MVP con el ejercicio division-37-entre-5.

Alcance inicial: 1 ejercicio, 4 pasos, 2 tipos de paso (si_no, opciones).

Validación: probar con la autora y una niña real antes de expandir.

💡 Referencias (análisis previo)
El enfoque está basado en el análisis técnico previo que concluyó:

"La dificultad no está en la tecnología, sino en descomponer la división en nodos de paso que un niño de 8 años pueda operar con clics, y prejuzgar los errores comunes en cada nodo."

Herramientas mencionadas (ninguna imprescindible):

Mathsteps (fork de GrayCordell) — Para motores más complejos.

JSXGraph — Para manipuladores visuales (fase 4).

GIFT — Plataforma académica (no compatible con Workers).

Decisión: construir motor propio con lógica simple y clara. Más mantenible y controlado.

Fin del plan del tutor interactivo.
