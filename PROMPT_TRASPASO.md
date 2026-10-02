# 🔄 PROMPT DE TRASPASO — web-educativa

> Última actualización: 2026-10-01
> Copia este archivo al inicio de un chat nuevo para que la IA
> tenga todo el contexto necesario para continuar el proyecto.

---

## 👋 Saludo inicial sugerido

"Hola, vengo del proyecto web-educativa. Acabo de actualizar toda la documentación en este repositorio:

- `ESTADO_PROYECTO.md` → Estado general + pendientes
- `GUIA_IA.md` → Manual técnico completo
- `PROMPT_TRASPASO.md` → Este archivo
- `PROTOCOLO_NUEVA_COMPRENSION.md` → Cómo agregar libros al Club de Lectura
- `TUTOR_PLAN.md` → Plan del tutor interactivo
- `NOTIFICACIONES_PLAN.md` → Plan de notificaciones

Por favor, lee esos archivos primero y luego continuamos."

---

## 📊 Estado del proyecto (2026-10-01)

**Web pública**: https://web-educativa.pages.dev
**Panel admin**: https://web-educativa.pages.dev/admin
**Repo**: https://github.com/Ferbeatriz/web-educativa
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

### Club de Lectura
| # | Fase | Estado |
|---|------|--------|
| 1 | Sistema rotativo (`CuestionarioAleatorio.astro`) | ✅ |
| 2 | Libro 1: La historia de Manú (50+25+12 preguntas) | ✅ |
| 3 | Libro 2: El lugar más bonito del mundo (30+15+10) | ✅ |

### Lenguaje
| # | Fase | Estado |
|---|------|--------|
| 1 | Lección: Los textos narrativos (25 preguntas) | ✅ |
| 2 | Lección: Cuento, fábula y leyenda (25 preguntas) | ✅ |
| 3 | Sistema `TriviaRotativa.astro` para lecciones | ✅ |

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
└── cuento-fabula-leyenda.json


### Notificaciones
workers/api/src/
├── lib/
│ └── email.ts ← helper de envío con Resend
└── routes/
└── admin-email.ts ← endpoint /api/admin/test-email


---

## 🔑 Decisiones tomadas en el chat anterior

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

---

## ⏳ Pendientes por prioridad

### 🥇 1. Notificaciones — Fase 2 (tabla apoderados)

Ver `NOTIFICACIONES_PLAN.md`.

**Lo que falta**:
- Tabla `apoderados` en D1.
- Endpoints CRUD para apoderados.
- Página `/admin/apoderados`.
- Documento de consentimiento (PDF imprimible).

### 🥈 2. Notificaciones — Fases 3 y 4

- Plantilla del informe mensual.
- Cron Trigger (1° de cada mes).
- Plantilla de nuevo contenido para alumnas.
- Plantilla de resumen semanal para admin.

### 🥉 3. Métricas detalladas del panel admin

Página `/admin/metricas` con:
- Lecciones más/menos completadas.
- Preguntas con más errores.
- Gráfico de actividad.
- Ranking de alumnas.

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

### 7. Videos por capítulo

Embed de YouTube colapsable en cursos especiales. (Congelado por ahora.)

---

## 📚 Documentación del proyecto

| Archivo | Contenido |
|---------|-----------|
| `ESTADO_PROYECTO.md` | Estado general + pendientes |
| `GUIA_IA.md` | Manual técnico completo |
| `PROMPT_TRASPASO.md` | Este archivo |
| `PROTOCOLO_NUEVA_COMPRENSION.md` | Cómo agregar libros al Club de Lectura |
| `NOTIFICACIONES_PLAN.md` | Plan de notificaciones por email |
| `TUTOR_PLAN.md` | Plan del tutor interactivo |
| `PROMPT_PROFESOR.md` | Personalidad de la IA |

---

## 🎯 Cómo empezar el próximo chat

**Si vas a agregar una comprensión de lectura nueva**: lee `PROTOCOLO_NUEVA_COMPRENSION.md` y sigue ese protocolo.

**Si vas a agregar una lección nueva** (matemáticas, lenguaje, inglés, etc.): sigue el patrón de las lecciones existentes. Pide el `materia.json` de la materia + 1-2 lecciones de referencia.

**Si vas a continuar con notificaciones**: lee `NOTIFICACIONES_PLAN.md` y este archivo, sección "Pendientes 1-2".

**Si vas a hacer métricas**: sección "Pendientes 3".

**Si vas a automatizar la generación de contenido**: sección "Pendientes 4".

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

---

**Fin del prompt de traspaso.**
