# 🔄 PROMPT DE TRASPASO — web-educativa

> Última actualización: 2026-10-14
> Commit de referencia: `b87b88e`
> Copia este archivo al inicio de un chat nuevo para que la IA
> tenga todo el contexto necesario para continuar el proyecto.

---

## 👋 Saludo inicial sugerido

"Hola, vengo del proyecto web-educativa. Acabo de actualizar toda la documentación en este repositorio:

- `ESTADO_PROYECTO.md` → Estado general + pendientes
- `GUIA_IA.md` → Manual técnico completo
- `PROMPT_TRASPASO.md` → Este archivo
- `ALINEACION_MINEDUC.md` → Referencia curricular obligatoria (LEER PRIMERO)
- `MOTOR_TUTOR_ESPECIFICACION.md` → Especificación del motor + bitácoras
- `OA_MATEMATICA.md` → OA de Matemática 1° a 6°
- `OA_LENGUAJE.md` → OA de Lenguaje 1° a 6° + mapa de alineación
- `PROTOCOLO_NUEVA_COMPRENSION.md` → Cómo agregar libros al Club de Lectura
- `NOTIFICACIONES_PLAN.md` → Plan de notificaciones
- `TUTOR_PLAN.md` → Plan del tutor interactivo

Por favor, lee esos archivos primero y luego continuamos."

---

## 📚 LECTURA OBLIGATORIA ANTES DE CUALQUIER ACCIÓN

- `ALINEACION_MINEDUC.md` → Referencia curricular obligatoria.
- `MOTOR_TUTOR_ESPECIFICACION.md` → Especificación del motor + bitácoras.
- `OA_MATEMATICA.md` → OA de Matemática 1° a 6°.
- `OA_LENGUAJE.md` → OA de Lenguaje 1° a 6° + mapa de alineación.
- `BITACORA_DIVISION_PROBLEMAS.md` → Estado de los ejercicios de división.
- `BITACORA_EJERCICIOS_GUIADOS.md` → Estado de los ejercicios guiados.

---

## 🎯 Estado actual (commit `b87b88e`, 2026-10-14)

### Últimas sesiones cerradas

- **2026-10-12**: Motor de errores en producción (Worker `7ca9a592`) + panel docente `/admin/metricas`.
- **2026-10-14**: `OA_LENGUAJE.md` creado + migración de `los-textos-poeticos` a `banco_trivia`.

### Próximo paso

**Decisión pendiente** entre:
- **Opción B1**: próxima lección de Lenguaje en Escritura OA 12-13 (escribir frecuentemente + narraciones).
- **Opción B2**: próxima lección de Lenguaje en Lectura OA 6 (textos no literarios: noticias, cartas, biografías).

Recomendación: B1 (alto valor, encaja con el Club de Lectura, bajo costo de generación).

Otras opciones en `ESTADO_PROYECTO.md` → sección "Pendientes".

---

## 📊 Estado del proyecto

**Web pública**: https://web-educativa.pages.dev
**Panel admin**: https://web-educativa.pages.dev/admin
**Métricas docente**: https://web-educativa.pages.dev/admin/metricas
**Repo**: https://github.com/Ferbeatriz/web-educativa
**Worker**: `7ca9a592` (2026-10-12)
**Stack**: Astro 7 + Tailwind v4 + Cloudflare Pages + Cloudflare Workers + D1 + Resend (email)

---

## ✅ Fases completadas

### Infraestructura base
| # | Fase | Estado |
|---|------|--------|
| 1 | Infraestructura Cloudflare (D1 + Worker) | ✅ |
| 2 | Login alumnas + perfil + dashboard | ✅ |
| 3 | Progreso real (XP, niveles, anti-farmeo) | ✅ |
| 4 | Panel admin completo (clases, alumnas, stats) | ✅ |

### Tutor interactivo de división
| # | Fase | Estado |
|---|------|--------|
| 1 | Tutor interactivo MVP (37÷5, 4 pasos) | ✅ |
| 1.5 | Animación demostrativa con reparto por rondas | ✅ |
| 1.5b | Integración del tutor en "Introducción a la División" | ✅ |
| 3 | Motor de errores (10 `error_type`, tracking anónimo) | ✅ |
| 4 | Panel docente `/admin/metricas` | ✅ |

### Ejercicios guiados
| # | Fase | Estado |
|---|------|--------|
| 1 | Tipo de lección `ejercicios-guiados` | ✅ |
| 2 | Lección `division-reparto-3basico` (52 ejercicios, 5 rondas) | ✅ |
| 3 | Lección `division-repaso-3basico` (30 ejercicios, 5 rondas) | ✅ |

### Club de Lectura
| # | Fase | Estado |
|---|------|--------|
| 1 | Sistema rotativo (`CuestionarioAleatorio.astro`) | ✅ |
| 2 | Libro 1: La historia de Manú (50+25+12 preguntas) | ✅ |
| 3 | Libro 2: El lugar más bonito del mundo (30+15+10) | ✅ |

### Lenguaje
| # | Fase | Estado |
|---|------|--------|
| 1 | Lección: Los textos narrativos | ✅ |
| 2 | Lección: Cuento, fábula y leyenda | ✅ |
| 3 | Sistema `TriviaRotativa.astro` para lecciones | ✅ |
| 4 | Lección: Figuras literarias | ✅ |
| 5 | Lección: La rima | ✅ |
| 6 | Lección: Los textos poéticos (migrada a `banco_trivia`) | ✅ 2026-10-14 |

### Notificaciones
| # | Fase | Estado |
|---|------|--------|
| 1 | Infraestructura Resend + endpoint test | ✅ |
| 2 | Tabla apoderados + endpoints | ⏳ Pendiente |
| 3 | Informe mensual + Cron Trigger | ⏳ Pendiente |
| 4 | Notificaciones alumnas + resumen admin | ⏳ Pendiente |

---

## 📁 Estructura clave del proyecto

### Sistema rotativo (Club de Lectura)
src/
├── scripts/
│ └── seleccion-preguntas.js ← lógica de selección aleatoria
├── components/comprension/
│ └── CuestionarioAleatorio.astro ← componente del Club de Lectura
├── data/materias/lenguaje/lecturas/
│ ├── indice.json ← lista de libros activos
│ ├── la-historia-de-manu/
│ │ ├── meta.json
│ │ ├── banco-comprension.json
│ │ ├── banco-desarrollo.json
│ │ └── banco-relectura.json
│ └── el-lugar-mas-bonito-del-mundo/
│ ├── meta.json
│ ├── banco-comprension.json
│ ├── banco-desarrollo.json
│ └── banco-relectura.json
└── pages/lenguaje/
├── index.astro ← página del Club
└── comprension/[libro].astro ← detalle de cada libro

### Sistema rotativo (lecciones normales)
src/
├── components/
│ └── TriviaRotativa.astro ← trivia con rotación (lecciones)
├── pages/leccion/[...slug].astro ← detecta banco_trivia o trivia
└── data/materias/lenguaje/lecciones/
├── los-textos-narrativos.json
├── cuento-fabula-leyenda.json
└── los-textos-poeticos.json

### Motor de errores + panel docente
workers/api/src/
├── lib/
│ └── intentos.ts ← lógica del motor de errores
└── routes/
├── tutor.ts ← /api/tutor/registrar-intento
└── admin-metricas.ts ← 4 endpoints de métricas

src/pages/admin/
└── metricas.astro ← panel docente

### Ejercicios guiados
src/
├── components/ejercicios/
│ └── EjerciciosGuiados.astro
└── scripts/
└── ejercicios-guiados.js

### Tutor contextualizado
src/
├── components/tutor/
│ ├── ListaProblemas.astro
│ ├── ProblemaCard.astro
│ ├── TutorContextualizado.astro
│ └── TutorPasos.astro
└── scripts/
├── problema-card.js
└── tutor-contextualizado.js
### Notificaciones
workers/api/src/
├── lib/
│ └── email.ts ← helper de envío con Resend
└── routes/
└── admin-email.ts ← endpoint /api/admin/test-email


---

## 🔑 Decisiones tomadas en chats anteriores

| Decisión | Detalle |
|----------|---------|
| **Sistema rotativo universal** | Todo cuestionario / selección múltiple / V-F pasa por el sistema de rotación con localStorage |
| **Campo `banco_trivia`** | Nuevo campo en JSON de lecciones. Si existe, se usa `TriviaRotativa`. Si no, se usa `TriviaQuiz` fijo |
| **Distribución de dificultad** | 30% media / 40% difícil / 30% muy difícil (configurable por lección/libro) |
| **Glosario unificado** | Mismo formato en todas las materias (fondo beige, borde punteado, tipografía Georgia, 2 columnas) |
| **Sin imágenes en lecciones** | El contenido se sostiene con texto y tablas |
| **Comprensión ≠ Lección** | En Lenguaje, las lecciones normales y el Club de Lectura son dos secciones separadas |
| **Sin preguntas de desarrollo** | Solo opción múltiple (o V/F convertido a 4 opciones) |
| **Emails con Resend** | Opción B del plan original: servicio externo gratuito, se migrará a dominio propio cuando haya |
| **Automatización pendiente** | Los libros del Club de Lectura se podrían generar con un script local (Ollama o Claude API) en el futuro |
| **Motor de errores anónimo** | `intentos_ejercicios` guarda `alumna_hash`; la desanonimización se hace vía `mapa_identidad` |
| **Consentimiento parental** | `consentimientos_tracking` cumple con Ley 21.719 (datos de menores como categoría especial) |
| **Tutor no revela respuesta** | Al fallar, el tutor permite reintentar sin revelar la solución (esfuerzo productivo, OECD) |
| **Scripts externos, no inline** | Los scripts de tutor y problemas viven en `src/scripts/`, no inline en componentes Astro |

---

## ⏳ Pendientes por prioridad

### 🥇 1. Próximo contenido de Lenguaje (decisión pendiente)

Ver `OA_LENGUAJE.md` para el mapa de cobertura.

**Opciones**:
- **B1**: Escritura OA 12-13 (escribir frecuentemente + narraciones).
- **B2**: Lectura OA 6 (textos no literarios: noticias, cartas, biografías).

**Recomendación**: B1.

### 🥈 2. Notificaciones — Fase 2 (tabla apoderados)

Ver `NOTIFICACIONES_PLAN.md`.

**Lo que falta**:
- Tabla `apoderados` en D1.
- Endpoints CRUD para apoderados.
- Página `/admin/apoderados`.
- Documento de consentimiento (PDF imprimible).

### 🥉 3. Notificaciones — Fases 3 y 4

- Plantilla del informe mensual.
- Cron Trigger (1° de cada mes).
- Plantilla de nuevo contenido para alumnas.
- Plantilla de resumen semanal para admin.

### 4. Automatización de generación de comprensión lectora

Script local (`scripts/generar-comprension.js`) que use Ollama + Qwen 2.5 7B (o Claude API) para:
- Leer PDF del libro.
- Generar los 3 bancos de preguntas.
- Validar JSON.
- Guardar en la carpeta correspondiente.

**Objetivo**: no depender del chat para generar contenido.

### 5. Pruebas con alumnas reales

Crear la clase "3° Básico D 2026" completa.

### 6. Más contenido

- Inglés: más lecciones.
- Ciencias, Historia: lecciones pendientes.
- Programación: Creadoras de Mundos (10 capítulos).
- Historia: Selk'nam (5 capítulos).
- `OA_CIENCIAS.md` (documento de referencia).

### 7. Validar `resta-52-menos-27.json`

Pendiente del motor de tutor (ver `MOTOR_TUTOR_ESPECIFICACION.md`).

### 8. Videos por capítulo

Embed de YouTube colapsable en cursos especiales. (Congelado por ahora.)

---

## 📚 Documentación del proyecto

| Archivo | Contenido |
|---------|-----------|
| `ESTADO_PROYECTO.md` | Estado general + pendientes |
| `GUIA_IA.md` | Manual técnico completo |
| `PROMPT_TRASPASO.md` | Este archivo |
| `ALINEACION_MINEDUC.md` | Referencia curricular obligatoria |
| `MOTOR_TUTOR_ESPECIFICACION.md` | Especificación del motor + bitácoras |
| `OA_MATEMATICA.md` | OA de Matemática 1° a 6° |
| `OA_LENGUAJE.md` | OA de Lenguaje 1° a 6° + mapa de alineación |
| `BITACORA_DIVISION_PROBLEMAS.md` | Bitácora del tutor de división |
| `BITACORA_EJERCICIOS_GUIADOS.md` | Bitácora de ejercicios guiados |
| `PROTOCOLO_NUEVA_COMPRENSION.md` | Cómo agregar libros al Club de Lectura |
| `NOTIFICACIONES_PLAN.md` | Plan de notificaciones por email |
| `TUTOR_PLAN.md` | Plan del tutor interactivo |
| `PROMPT_PROFESOR.md` | Personalidad de la IA |

---

## 🎯 Cómo empezar el próximo chat

**Si vas a agregar una comprensión de lectura nueva**: lee `PROTOCOLO_NUEVA_COMPRENSION.md` y sigue ese protocolo.

**Si vas a agregar una lección nueva** (matemáticas, lenguaje, inglés, etc.): sigue el patrón de las lecciones existentes. Pide el `materia.json` de la materia + 1-2 lecciones de referencia.

**Si vas a trabajar en Lenguaje (Escritura OA 12-13 o Lectura OA 6)**: lee `OA_LENGUAJE.md` para el mapa de cobertura y las decisiones pendientes.

**Si vas a continuar con notificaciones**: lee `NOTIFICACIONES_PLAN.md` y este archivo, sección "Pendientes 2-3".

**Si vas a automatizar la generación de contenido**: sección "Pendientes 4".

**Si vas a expandir el tutor (resta, fracciones)**: lee `MOTOR_TUTOR_ESPECIFICACION.md`.

---

## 💡 Notas para la IA nueva

- **Tono**: profesor de enseñanza básica, serio pero cercano, español de Chile.
- **Publicación obligatoria**: siempre entregar comandos `git add . && git commit && git push` después de cada cambio.
- **Validación JSON**: siempre validar antes de commitear.
- **Rutas case-sensitive**: en Linux, `Glosario.astro` ≠ `glosario.astro`.
- **Fases cortas**: preferir cambios incrementales, no reescrituras masivas.
- **Sin lenguaje infantil**: nada de "amiguitas", "genial", etc.
- **No inventar datos**: si algo no está en el texto del libro, no lo usar. (Este error ocurrió antes con la "tía Eduvigis" en Manu.)
- **Sin preguntas de desarrollo**: solo opción múltiple o V/F convertido a opción múltiple.
- **Toda trivia nueva debe usar `banco_trivia`**, no `trivia`.
- **Motor de errores**: si agregas un ejercicio nuevo con tutor, etiqueta los errores con uno de los 10 `error_type` existentes.

---

**Fin del prompt de traspaso.**

