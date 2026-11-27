# 📊 ESTADO DEL PROYECTO — web-educativa

> Última actualización: 2026-11-06
> Commit de referencia: `4a1b606 `
> Worker en producción: `7ca9a592` (2026-10-12)
> Proyecto: Plataforma educativa interactiva para niñas de 9-12 años

---

## 🎯 Visión del proyecto

Plataforma web educativa modular con las siguientes características:

- **Público objetivo**: niñas de 9-12 años (preadolescentes)
- **Estética**: inspirada en Base44 (limpia, moderna, con panel modular)
- **Materias**: Lenguaje, Matemáticas, Historia, Inglés, Ciencias, Programación
- **Contenido**: generado con IA local (Ollama + Qwen 2.5 7B)
- **Interactividad**: trivias + progreso real + sistema de niveles + tutor paso a paso
- **Proyectos especiales**: Curso Ojo de Horus, Creadoras de Mundos Digitales, Selk'nam

---
---

## 🎯 Declaraciones de Intención y Enfoque Comercial (2026-11-16)

**Misión del Proyecto:**
Construir una plataforma de soluciones educativas que entregue acompañamiento interactivo y tecnológico a alumnas de educación básica, facilitando el aprendizaje autónomo y el refuerzo de contenidos alineados al MINEDUC.

**Visión de Mercado (Hacia dónde vamos):**
Dejar de ser solo una "web educativa" para convertirnos en un ecosistema de **soluciones educativas** dirigido a clientes corporativos (Colegios, SLEP, Corporaciones) y naturales (Apoderados). 

**Segmentos Objetivo (Declaración de Clientes Potenciales):**

1. **Alumnas (Usuarios Principales):** Niñas que buscan aprender de forma interactiva, usando IA y tecnología actualizada, dejando atrás el método tradicional de "leer y responder".
2. **Apoderados (Beneficiarios y Clientes Naturales):** Padres con poco tiempo (o separados/divorciados) que necesitan que la plataforma acompañe a sus hijas en el aprendizaje, entregándoles reportes automáticos y guías de ayuda, sin tener que sentarse a estudiar con ellas.
3. **Profesores (Usuarios de IA y Clientes Internos):** Docentes que desean tener más tiempo para sí mismos, evitando llevarse trabajo a la casa. La plataforma les entrega IA para generar material y automatizar la preparación de clases.
4. **Establecimientos (Clientes Corporativos/B2B):** Colegios, directores, rectores y jefes de UTP que buscan mejorar los puntajes SIMCE/PAES y necesitan un sistema robusto de reportes sobre el estado académico y conductual de sus alumnas.

**Enfoque Comercial:**
El objetivo a mediano plazo es postular a líneas de financiamiento (CORFO, Start-Up Chile, ANID) para escalar la plataforma, por lo que el proyecto debe transitar desde un MVP funcional hacia un modelo de negocio sostenible (SaaS educativo).




## ✅ Actualización 2026-11-26 (Cierre Fix Portafolio)

**Lo que se logró:**
- **Fix crítico:** Se agregó la llamada a `POST /api/progreso/completar` al final de `enviarRespuestasAlBackend` en `src/components/TriviaRotativa.astro`. Ahora las lecciones se marcan como completadas al presionar "Corregir respuestas", aparecen en el portafolio (`/mi-portafolio`) y otorgan los 50 XP correspondientes.
- **Manejo de errores:** Se agregó verificación de `resCompletar.ok` y logs en consola para diagnosticar fallos (401, 403, 500) sin romper la UI.
- **Idempotencia validada:** El backend (`handleCompletarLeccion`) ya manejaba correctamente el caso de lección repetida (`nueva: false`), por lo que no hay riesgo de XP duplicado si la alumna corrige varias veces.

**Pendientes para la próxima sesión:**
- Decidir si `handleCompletarLeccion` debe verificar `tieneConsentimiento()` (capa legal Ley 21.719).
- Revisar el panel del admin (`/admin/metricas`) para incluir las últimas 3 lecciones con porcentaje de cumplimiento.
- Iniciar la Semana 3 (Proyectos cortos) o el Mes 2 (Informe PDF para el apoderado).

**Commit de referencia:** (anotar el hash después de `git push`).


### 2026-11-25 (Cierre Semana 1)

- **Semana 1 (Gamificación suave):** 100% completada.
  - Logros por mérito: `primera_division_sin_tutor`, `cinco_divisiones_sin_tutor`, `diez_divisiones_sin_tutor`, `primer_libro_completo`.
  - Racha con contexto informativo en el portafolio ("Días activos seguidos. No se rompe si faltas.").
  - Detalle de respuestas por lección en el portafolio (agrupadas por pregunta, con resumen de correctas/incorrectas).
  - `materia_id` dinámico en `TriviaRotativa.astro`.
  - Totales de lecciones por materia corregidos (Lenguaje 9, Matemáticas 19).
  - `materia.json` limpio (sin duplicados de `orden`, campo `activo` consistente en todas las lecciones).
- **Próximos pasos:** Semana 3 (proyectos cortos) o Mes 2 (Informe PDF para el apoderado).

## ✅ Actualización 2026-11-24 (cierre de sesión)

**Lo que se logró:**
- **Nueva lección:** "Actividades: Área y Perímetro" (24 ejercicios fijos con SVG, figuras organizadas).
- **Nueva lección:** "Actividades: Textos Instructivos" (14 ejercicios, con opciones rotadas).
- **Logros por mérito:** Agregados `primera_division_sin_tutor`, `cinco_divisiones_sin_tutor`, `diez_divisiones_sin_tutor` y `primer_libro_completo`.
- **Portafolio:** Ahora muestra el detalle de respuestas por lección (agrupadas por pregunta, con resumen de correctas/incorrectas).
- **Racha:** Se agregó el texto informativo "Días activos seguidos. No se rompe si faltas." en el portafolio.
- **Mapa de progreso:** Se implementó el "X de Y" por materia (con totales hardcodeados en el frontend).
- **Fix:** Se corrigió la pregunta ambigua de textos instructivos y se rotaron las opciones para evitar que la respuesta correcta sea siempre la misma letra.
- **Fix crítico:** Se hizo dinámico el `materia_id` en `TriviaRotativa.astro` (ya no está hardcodeado como 'matematicas').
- **Pendiente inmediato:** El portafolio no muestra la lección `actividades-area-perimetro` porque no se ha marcado como completada en la tabla `progreso`. La solución es agregar una llamada a `POST /api/progreso/completar` al final de `enviarRespuestasAlBackend` en `TriviaRotativa.astro` (código proporcionado en el chat).

**Pendientes para la próxima sesión:**
- Agregar la llamada a `/api/progreso/completar` en `TriviaRotativa.astro` para que las lecciones aparezcan en el portafolio.
- Revisar el panel del admin (`/admin/metricas`) para incluir las últimas 3 lecciones con porcentaje de cumplimiento.
- Iniciar el Mes 2 (Informe PDF para el apoderado).

**Commit de referencia:** (anotar el hash después de `git push`).







## ✅ Actualización 2026-11-23 (cierre de sesión)

**Lo que se logró:**
- **Nueva lección:** "Actividades: Área y Perímetro" (24 ejercicios fijos con SVG, figuras organizadas).
- **Nueva lección:** "Actividades: Textos Instructivos" (14 ejercicios, con opciones rotadas).
- **Logros por mérito:** Agregados `primera_division_sin_tutor`, `cinco_divisiones_sin_tutor`, `diez_divisiones_sin_tutor` y `primer_libro_completo`.
- **Portafolio:** Ahora muestra el detalle de respuestas por lección (agrupadas por pregunta, con resumen de correctas/incorrectas).
- **Racha:** Se agregó el texto informativo "Días activos seguidos. No se rompe si faltas." en el portafolio.
- **Mapa de progreso:** Se implementó el "X de Y" por materia (con totales hardcodeados en el frontend).
- **Fix:** Se corrigió la pregunta ambigua de textos instructivos y se rotaron las opciones para evitar que la respuesta correcta sea siempre la misma letra.

**Pendientes para la próxima sesión:**
- Revisar el panel del admin (`/admin/metricas`) para incluir las últimas 3 lecciones con porcentaje de cumplimiento.
- Hacer dinámico el `materia_id` en `TriviaRotativa.astro` (actualmente hardcodeado como 'matematicas').
- Iniciar el Mes 2 (Informe PDF para el apoderado).

**Commit de referencia:** (93ce5e2..a6fbdbe).





- **Portafolio:** Funcional en `/mi-portafolio`. Muestra nivel, XP, racha, logros, progreso por materia y últimas lecciones completadas.
- **Tutor Docente:** Operativo con autoguardado en GitHub.
- **Música:** Metalófono virtual de 25 notas operativo.
- **Gamificación (Semana 1):** Logros (`primera_leccion`, `materia_completa`, `racha_7`) + Racha + Mapa de progreso por materia. Persistencia en tabla `logros_alumna`.
- **Figuras irregulares en Trivia:** `TriviaRotativa.astro` renderiza figuras en L y T con `generarGrid()`. Se agregaron los colores al `@theme` de `global.css`.
- **Laboratorio de Operaciones con Fracciones:** Operativo (modal flotante, suma/resta/multiplicación/división, explicación paso a paso).
- **Comprensión lectora:** "La cama mágica de Bartolo" actualizada a 40 preguntas (12 media, 16 difícil, 12 muy difícil), con respuestas correctas iteradas.
- **Sistema de métricas (nuevo):**
  - Tabla `respuestas_lecciones` creada (schema-08). Guarda respuestas con `alumna_hash` (privacidad, Ley 21.719).
  - Endpoints `POST /api/progreso/registrar-respuesta` y `POST /api/progreso/actualizar-avance` operativos en producción.
  - `TriviaRotativa.astro` envía las respuestas al backend al hacer clic en "Corregir respuestas".
  - Correo de avance llega al admin (`ferbeatriz@proton.me`) con el porcentaje de cumplimiento y detalle de respuestas.
  - Los IDs de las preguntas del banco de `introduccion-fracciones.json` fueron corregidos (ya no hay `pregunta_id: undefined`).
- **Semana 2 (Visualizaciones):** Completada (animación de división, simulador de sumas verticales, laboratorio de fracciones, figuras irregulares).
- **Próximos pasos:** Cerrar la Semana 1 (logros por mérito, racha informativa, mapa de progreso) o iniciar el Mes 2 (Informe PDF para el apoderado).

---

## 📊 Estado del roadmap (actualizado 2026-11-20)

| Mes | Semana | Foco | Estado |
|-----|--------|------|--------|
| 1 | 1 | Gamificación suave | 🚧 En curso (~80%) |
| 1 | 2 | Visualizaciones Matemáticas | ✅ Completada |
| 1 | 3 | Proyectos cortos | ⏳ No iniciada |
| 1 | 4 | Feedback emocional | ⏳ No iniciada |
| 2 | 5 | Informe PDF | ⏳ No iniciada |
| 2 | 6 | Página pública | ⏳ No iniciada |
| 2 | 7 | Vista "cómo ayudar" | ⏳ No iniciada |
| 2 | 8 | Perfil apoderado | ⏳ No iniciada |
| 3 | 9 | Análisis guiado Lenguaje | ⏳ No iniciada |
| 3 | 10 | Proyectos largos | ⏳ No iniciada |
| 3 | 11 | Portafolio | ✅ Completada (adelantada) |
| 3 | 12 | Demo institucional | ⏳ No iniciada |

---

## 🗄️ Base de datos (nuevas tablas)

| Tabla | Propósito |
|-------|-----------|
| `respuestas_lecciones` | Registro de respuestas por alumna (usa `alumna_hash`, no `alumna_id`) |
| `logros_alumna` | Logros desbloqueados (persistente, idempotente) |

---

## 🔐 Secrets del Worker (actualizado)

- `ADMIN_EMAIL`: `ferbeatriz@proton.me`
- `RESEND_API_KEY`: configurado
- `INTENTOS_SALT`: configurado
- `GROQ_API_KEY`: configurado
- `ADMIN_PASSWORD_HASH`: configurado
- `ADMIN_SESSION_SECRET`: configurado
- `GITHUB_TOKEN`: configurado

**Nota:** Resend en plan gratuito solo envía al correo con el que se registró. Los correos a veces tardan en aparecer en Proton (revisar spam/lista de permitidos).




## 🚨 ALERTAS PARA LA IA (LEER OBLIGATORIAMENTE)

1. **Monitoreo de memoria:** La IA debe indicar explícitamente cuando su ventana de contexto esté al **85% de uso**. En ese momento, debe:
   - Notificar a la usuaria: "He alcanzado el 85% de mi memoria. Es momento de generar respaldos."
   - Actualizar inmediatamente `ESTADO_PROYECTO.md` y `PROMPT_TRASPASO.md` con un resumen de la sesión.
   - Sugerir el commit correspondiente.

2. **Resumen de sesión:** Al cerrar una sesión (por cambio de tema, por fin de jornada, o por alerta de memoria), la IA debe generar un **resumen sucinto** de todo lo relevante realizado, para que la IA que retome el trabajo entienda el contexto sin necesidad de releer todo el chat.

---

## ✅ Estado actual (2026-11-19)

- **Portafolio:** Funcional en `/mi-portafolio`. Muestra nivel, XP, racha, logros, progreso por materia y últimas lecciones completadas.
- **Tutor Docente:** Operativo con autoguardado en GitHub.
- **Música:** Metalófono virtual de 25 notas operativo.
- **Gamificación (Semana 1):** Logros (`primera_leccion`, `materia_completa`, `racha_7`) + Racha + Mapa de progreso por materia. Persistencia en tabla `logros_alumna`.
- **Figuras irregulares en Trivia:** `TriviaRotativa.astro` ahora renderiza figuras en L y T con `generarGrid()`. Se agregaron los colores al `@theme` de `global.css`.
- **Laboratorio de Operaciones con Fracciones:** Operativo (modal flotante, suma/resta/multiplicación/división, explicación paso a paso).
- **Comprensión lectora:** "La cama mágica de Bartolo" actualizada a 40 preguntas (12 media, 16 difícil, 12 muy difícil), con respuestas correctas iteradas.
- **Semana 2 (Visualizaciones):** Completada (animación de división, simulador de sumas verticales, laboratorio de fracciones, figuras irregulares).
- **Próximos pasos:** Cerrar Semana 1 (logros por mérito, racha informativa, mapa de progreso) o iniciar Mes 2 (Informe PDF para apoderado).

---

## 📊 Estado del roadmap (actualizado 2026-11-19)

| Mes | Semana | Foco | Estado |
|-----|--------|------|--------|
| 1 | 1 | Gamificación suave | 🚧 En curso (~80%) |
| 1 | 2 | Visualizaciones Matemáticas | ✅ Completada |
| 1 | 3 | Proyectos cortos | ⏳ No iniciada |
| 1 | 4 | Feedback emocional | ⏳ No iniciada |
| 2 | 5 | Informe PDF | ⏳ No iniciada |
| 2 | 6 | Página pública | ⏳ No iniciada |
| 2 | 7 | Vista "cómo ayudar" | ⏳ No iniciada |
| 2 | 8 | Perfil apoderado | ⏳ No iniciada |
| 3 | 9 | Análisis guiado Lenguaje | ⏳ No iniciada |
| 3 | 10 | Proyectos largos | ⏳ No iniciada |
| 3 | 11 | Portafolio | ✅ Completada (adelantada) |
| 3 | 12 | Demo institucional | ⏳ No iniciada |


### 🧠 Principio de Diseño: Maestría sobre Adicción (No a la Tecnología de Enganche)

**Declaración:**
La plataforma rechaza explícitamente las estrategias de "enganche" o adicción tecnológica utilizadas por redes sociales como Instagram, TikTok o X (scroll infinito, recompensas variables, notificaciones intrusivas, rankings públicos, comparaciones sociales). 

**Nuestro Enfoque:**
Buscamos **seducir a través de la maestría y la agencia**, no de la dopamina barata. La experiencia de usuario está diseñada para que la niña sienta orgullo por su propio progreso, no ansiedad por la aprobación externa. 

**Directrices técnicas y de contenido:**
1. **Sin castigos por inactividad:** La racha es informativa, nunca punitiva. Si la niña no entra por una semana, no se le "rompe" la racha ni se le quita nada.
2. **Sin comparaciones públicas:** No existirán rankings entre compañeras ni marcadores de "quién tiene más XP que quién". El único espejo es el propio progreso (Portafolio personal).
3. **Recompensas por mérito:** Los logros y el XP se ganan exclusivamente por completar tareas de aprendizaje (ej. resolver una división, terminar una lección), no por abrir la plataforma o hacer clic en un botón.
4. **Sin notificaciones intrusivas:** No se enviarán alertas diseñadas para generar ansiedad o presión social (ej. "Tu amiga ya te superó"). Las notificaciones serán exclusivamente informativas (ej. "Tu informe de progreso está disponible").
5. **Diseño limpio y respetuoso:** La interfaz no busca "atrapar" a la niña con estímulos visuales excesivos. Busca ser un espacio de refugio y concentración, con una estética sobria, cálida y profesional.






## 🏗️ Stack técnico

| Componente | Tecnología | Versión |
|------------|------------|---------|
| Sistema Operativo | Linux Mint XFCE | - |
| Hardware | MSI CX61 2QF (i5, 16 GB RAM, sin GPU dedicada) | - |
| Runtime | Node.js | 22.x LTS |
| Package Manager | npm | 10.x |
| Framework | Astro | 7.3.2 |
| CSS | Tailwind CSS (vía @tailwindcss/vite) | 4.x |
| Backend | Cloudflare Workers | Wrangler 4.137+ |
| Base de datos | Cloudflare D1 (SQLite) | - |
| Autenticación | PBKDF2 (Web Crypto) + tokens en D1 | - |
| IA Local | Ollama + Qwen 2.5 7B + llama3.2:3b | - |
| Editor | VS Code + Continue | 1.137.0 |
| Control de versiones | Git + GitHub | - |
| Hosting frontend | Cloudflare Pages | - |
| Hosting backend | Cloudflare Workers | - |

---

## 🔗 URLs importantes

| Recurso | URL |
|---------|-----|
| Web pública | https://web-educativa.pages.dev |
| Panel admin | https://web-educativa.pages.dev/admin |
| Métricas docente | https://web-educativa.pages.dev/admin/metricas |
| Worker API | https://web-educativa-api.ferbeatriz.workers.dev |
| Repositorio GitHub | https://github.com/Ferbeatriz/web-educativa |
| Panel Cloudflare | https://dash.cloudflare.com/ → Workers & Pages |
| Servidor local | http://localhost:4321 |

---

## 🗄️ Base de datos D1 (Cloudflare)

**Database name**: `web-educativa-db`
**Database ID**: `dfe90365-c58f-4043-a79f-87dce0a5e313`
**Región**: ENAM (Eastern North America)

### Tablas

| Tabla | Propósito |
|-------|-----------|
| `clases` | Clases creadas por admin (nombre + código único) |
| `alumnas` | Alumnas registradas (nombre, usuario único, clase_id, ultimo_login) |
| `metodos_auth` | Métodos de autenticación (password con hash PBKDF2) |
| `sesiones` | Tokens de sesión de alumnas |
| `progreso` | Lecciones completadas por alumna (XP ganados) |
| `admin_sesiones` | Tokens de sesión del panel admin |
| `intentos_ejercicios` | Registro anónimo de intentos del motor de errores (alumna_hash, error_type, origen) |
| `mapa_identidad` | Mapa hash → alumna_id (para desanonimizar en el panel docente) |
| `consentimientos_tracking` | Consentimiento parental para tracking (Ley 21.719) |

### Secrets del Worker (Cloudflare)

- `ADMIN_PASSWORD_HASH`: hash PBKDF2 de la contraseña maestra.
- `ADMIN_SESSION_SECRET`: string aleatorio (reservado para firmas futuras).
- `INTENTOS_SALT`: salt para el hash de identidad de los intentos (en producción desde 2026-10-12).

---

## 📁 Estructura del proyecto
web-educativa/
├── ESTADO_PROYECTO.md ← Este archivo
├── GUIA_IA.md ← Manual técnico para IAs
├── PROMPT_TRASPASO.md ← Prompt para chat nuevo
├── ALINEACION_MINEDUC.md ← Referencia curricular obligatoria
├── MOTOR_TUTOR_ESPECIFICACION.md ← Especificación del motor + bitácoras
├── OA_MATEMATICA.md ← OA de Matemática 1° a 6°
├── OA_LENGUAJE.md ← OA de Lenguaje 1° a 6° + mapa de alineación
├── BITACORA_DIVISION_PROBLEMAS.md ← Bitácora del tutor de división
├── BITACORA_EJERCICIOS_GUIADOS.md ← Bitácora de ejercicios guiados
├── PROTOCOLO_NUEVA_COMPRENSION.md ← Cómo agregar libros al Club de Lectura
├── NOTIFICACIONES_PLAN.md ← Plan de notificaciones (pendiente)
├── TUTOR_PLAN.md ← Plan del tutor interactivo (mayormente implementado)
├── astro.config.mjs
├── wrangler.toml
├── package.json
├── public/
│ ├── favicon.ico
│ └── favicon.svg
├── workers/api/ ← Backend
│ ├── schema-01-nucleo.sql
│ ├── schema-02-progreso.sql
│ ├── schema-03-admin-sesiones.sql
│ ├── schema-04-intentos-ejercicios.sql
│ ├── schema-05-mapa-identidad.sql
│ ├── schema-06-consentimientos-tracking.sql
│ └── src/
│ ├── index.ts ← Router principal
│ ├── lib/
│ │ ├── crypto.ts ← PBKDF2 + tokens
│ │ ├── db.ts ← Helpers de BD
│ │ ├── admin-sesion.ts ← Sesiones admin
│ │ ├── passwords.ts ← Generador de contraseñas
│ │ ├── email.ts ← Helper de envío con Resend
│ │ └── intentos.ts ← Lógica del motor de errores
│ └── routes/
│ ├── auth.ts
│ ├── progreso.ts
│ ├── tutor.ts ← /api/tutor/registrar-intento
│ ├── admin.ts
│ ├── admin-clases.ts
│ ├── admin-alumnas.ts
│ ├── admin-estadisticas.ts
│ ├── admin-metricas.ts ← 4 endpoints de métricas
│ └── admin-email.ts ← /api/admin/test-email
└── src/ ← Frontend
├── layouts/Layout.astro
├── components/
│ ├── Header.astro
│ ├── Footer.astro
│ ├── MateriaCard.astro
│ ├── TriviaQuiz.astro
│ ├── TriviaRotativa.astro ← Sistema rotativo de trivia
│ ├── BarraProgresoLectura.astro
│ ├── BotonCompletar.astro
│ ├── comprension/
│ │ └── CuestionarioAleatorio.astro ← Club de Lectura
│ ├── ejercicios/
│ │ └── EjerciciosGuiados.astro ← Tipo ejercicios-guiados
│ └── tutor/
│ ├── ListaProblemas.astro
│ ├── ProblemaCard.astro
│ ├── TutorContextualizado.astro
│ └── TutorPasos.astro
├── scripts/
│ ├── seleccion-preguntas.js ← Rotación con localStorage
│ ├── problema-card.js ← Validación de problemas
│ ├── tutor-contextualizado.js ← Lógica del tutor
│ └── ejercicios-guiados.js ← Validación de ejercicios guiados
├── lib/
│ ├── auth.ts ← Auth alumnas
│ ├── progreso.ts ← Progreso alumnas
│ └── admin.ts ← Auth admin
├── pages/
│ ├── index.astro
│ ├── login.astro
│ ├── perfil.astro
│ ├── materia/[id].astro
│ ├── submodulo/[...slug].astro
│ ├── leccion/[...slug].astro ← 3 ramas: teoría, ejercicios, ejercicios-guiados
│ └── admin/
│ ├── login.astro
│ ├── index.astro
│ ├── clases.astro
│ ├── alumnas.astro
│ └── metricas.astro ← Panel docente
└── data/
└── materias/ ← Contenido JSON


---
## ✅ Estado actual 

### 2026-11-19
- **Portafolio de la Alumna:** Creada la página `/mi-portafolio`. Muestra nivel, XP, racha, logros, progreso por materia y últimas lecciones completadas.
- **Backend:** Nuevo endpoint `GET /api/progreso/portafolio` que consolida todos los datos de la alumna.
- **Fix crítico:** Se corrigió la URL de la API en `auth.ts` para que apunte siempre al Worker de producción y no al local (evitando el error 401 en el portafolio).
### 2026-11-18
- **Música:** Módulo de música renovado. Se eliminaron las lecciones antiguas y se creó un **Metalófono Virtual de 25 notas** (incluye notas naturales y sostenidos). El componente usa Web Audio API para sintetizar el sonido y es responsive.



### 2026-11-17
- **Matemáticas:** Se agregaron dos nuevas lecciones de práctica:
  - "Práctica: Área y Perímetro" (con ejercicios de conteo de cuadraditos y problemas de medidas).
  - "Sumas Verticales de Centenas" (10 ejercicios de cálculo puro, sin teoría).
- **Simulador:** Se creó el componente `SumadorVertical.astro` (flotante) que alinea dinámicamente sumas de hasta centenas de millón y muestra el resultado paso a paso.
- **Integración:** El simulador de sumas se activa en la lección de "Sumas Verticales" y los simuladores de área/perímetro se activan en la nueva lección de práctica.


(2026-11-06)

### 2026-11-14 (Cierre Curso Historia Universal)
- **Historia:** Se creó el curso especial "Viaje al Pasado" (5 capítulos) y se configuró su índice (`src/pages/curso/[curso]/index.astro`).
- **UI/UX:** Se agregó una línea de tiempo visual en el Capítulo 1 que marca "Antes del Año 1", el "Año 1" y el "Año Actual" (calculado dinámicamente con `new Date().getFullYear()` para no tener que actualizarlo nunca).
- **Fix:** Se corrigió el scope de la variable `anioActual` (estaba dentro de `getStaticPaths`, se movió al frontmatter general).

### Últimos avances (2026-11-06)

### 2026-11-14
- **Historia:** Se creó la lección "Mis Derechos y Deberes" (basada en el texto escolar de 3° básico). 
- **Estructura:** Se registró correctamente dentro del submódulo `historia-chile` (ruta: `src/data/materias/historia/submodulos/historia-chile/lecciones/`).
- **Contenido:** Teoría sobre derechos, deberes, respeto, empatía e inclusión. 8 preguntas de trivia.



### 2026-11-09
- **Club de Lectura:** Se implementó el sistema de pestañas (Trivia / Análisis Guiado) en la vista de los libros.
- **Tutor de Análisis:** El componente `TutorAnalisis.astro` es totalmente funcional. Muestra fragmentos de texto y pasos guiados con opciones mezcladas y feedback personalizado.
- **Trivia:** Se corrigió la inyección de datos para que `CuestionarioAleatorio.astro` lea la `configuracion` del `meta.json` y renderice las preguntas correctamente.
- **Base de Datos:** Creado el `banco-analisis.json` para "La cama mágica de Bartolo". Los archivos para Manú y El Lugar quedaron creados vacíos para futuras implementaciones.
- Se completó la sección de Fracciones en Matemáticas:
  - Nueva lección "Múltiplos y Equivalentes" (explicación del m.c.m y fracciones equivalentes).
  - Visualización de círculos (conic-gradient) en la teoría de suma y división.
  - Ampliación de preguntas en el banco de trivia (10 preguntas por lección).
- El "Laboratorio de Operaciones con Fracciones" ahora funciona como un modal flotante en todas las lecciones de fracciones.
- *Regla de trabajo:* A partir de hoy, se debe activar el protocolo de respaldo (Git + actualización de documentación) antes de cerrar cada sesión o cambiar de tema.


### 2026-11-10 (Tarde)
- **Matemáticas:** Completadas las lecciones de Perímetro (OA 21) y Área (OA 23).
- **Teoría Visual:** Se agregaron animaciones SVG (un punto que recorre el perímetro) y animaciones CSS (cuadraditos que llenan el área) en las lecciones. Las fórmulas ahora incluyen la nomenclatura de lados con letras (a, b).
- **Navegación:** Se corrigió el sistema de navegación en `materia/[id].astro` para que el botón "Atrás" del navegador mantenga al usuario en la categoría que estaba viendo (usando `history.pushState` y anclas `#grupo-...`).
- **Nombre de Categoría:** Se cambió el nombre técnico "medicion" por "Área y Perímetro" en la vista de categorías.



### 2026-11-10 (Tarde)
- **Matemáticas:** Completadas las lecciones de Perímetro (OA 21) y Área (OA 23).
- **Teoría Visual:** Se agregaron animaciones SVG (punto que recorre el perímetro) y animaciones CSS (cuadraditos que llenan el área) en las lecciones. Las fórmulas ahora incluyen la nomenclatura de lados con letras (a, b).
- **Navegación:** Se corrigió el sistema de navegación en `materia/[id].astro` para que el botón "Atrás" del navegador mantenga al usuario en la categoría que estaba viendo (usando `history.pushState` y anclas `#grupo-...`).
- **Categorías:** Se cambió el nombre técnico "medicion" por "Área y Perímetro" en la vista de categorías de Matemáticas.
- **Commit:** 2429007.

### 2026-11-10 (Noche)
- **Matemáticas (Geometría):** Módulo 100% terminado.
- **Nuevas Lecciones:** Se agregó la lección de "Desafíos de Área y Perímetro" con 10 problemas contextualizados (word problems) de la vida real.
- **Simuladores:** Los laboratorios de Perímetro (📏) y Área (🟦) ahora funcionan como botones flotantes (FAB) y ventanas modales. Se les asignaron IDs únicos para evitar conflictos cuando coexisten en la misma lección.
- **Interacción:** Los simuladores permiten ver las medidas dinámicamente en los lados de las figuras y actualizan la explicación matemática en tiempo real.
- **Commit de referencia:** (anotar el hash del commit que acabas de hacer).

### 2026-11-11 (Tutor Docente IA)
- **Tutor Docente:** Totalmente funcional en el panel de admin.
- **Backend:** Endpoint `POST /api/docente/chat` usando Groq (`openai/gpt-oss-20b`). La API Key está guardada como secreto en Cloudflare (`GROQ_API_KEY`).
- **Frontend:** Componente `TutorDocente.astro` con CSS puro (para no depender de Tailwind en el admin) y renderizado de Markdown usando la librería `marked`.
- **Prompt:** Se instruyó a la IA para no usar tablas y enfocarse en pedagogía chilena.


### Fases completadas

| Fase | Componente | Estado |
|------|------------|--------|
| **1** | Infraestructura Cloudflare (D1 + Worker) | ✅ |
| **2a** | Login alumnas (PBKDF2 + tokens en D1) | ✅ |
| **2b** | Página `/login` + header dinámico | ✅ |
| **2c** | Perfil + validación automática de sesión | ✅ |
| **2d** | Dashboard privado + búho 🦉 | ✅ |
| **3** | Progreso real (XP, niveles, anti-farmeo) | ✅ |
| **3b** | Barra de lectura + botón completar + hero dinámico | ✅ |
| **4a** | Panel admin (login con token en localStorage) | ✅ |
| **4b** | Gestión de clases + alumnas | ✅ |
| **4c** | Dashboard admin con estadísticas reales | ✅ |
| **5** | Motor de errores (tracking anónimo + 10 `error_type`) | ✅ 2026-10-12 |
| **6** | Panel docente `/admin/metricas` | ✅ 2026-10-12 |

### Sistema de niveles (implementado)

| Nivel | Nombre | XP requerido | Emoji |
|-------|--------|--------------|-------|
| 1 | Aprendiz | 0 - 99 | 🥚 |
| 2 | Curiosa | 100 - 249 | 🐣 |
| 3 | Exploradora | 250 - 499 | 🦉 |
| 4 | Aventurera | 500 - 999 | 🗺️ |
| 5 | Sabia | 1000 - 1999 | 📚 |
| 6 | Maestra | 2000+ | 👑 |

**XP por lección**: 50 XP (fijo). Repetir no da XP extra.

---

## 📚 Contenido actual

### Lecciones de Matemáticas (6)

| # | ID | Título | Tipo | Estado |
|---|-----|--------|------|--------|
| 1 | `propiedades-multiplicacion` | Propiedades de la Multiplicación | teoría | ✅ |
| 2 | `introduccion-division` | Introducción a la División | teoría + tutor | ✅ |
| 3 | `resta-con-reserva` | Resta con reserva | teoría | ✅ |
| 4 | `division-problemas` | Problemas de división | ejercicios | ✅ |
| 5 | `division-reparto-3basico` | Repartimos en partes iguales | ejercicios-guiados | ✅ |
| 6 | `division-repaso-3basico` | Repaso de división | ejercicios-guiados | ✅ |

### Lecciones de Lenguaje

| ID | Título | Tipo | Estado |
|----|--------|------|--------|
| `los-textos-narrativos` | Los textos narrativos | teoría + banco_trivia | ✅ |
| `cuento-fabula-leyenda` | Cuento, fábula y leyenda | teoría + banco_trivia | ✅ |
| `figuras-literarias` | Figuras literarias | teoría | ✅ |
| `la-rima` | La rima | teoría | ✅ |
| `los-textos-poeticos` | Los textos poéticos | teoría + banco_trivia | ✅ 2026-10-14 |

### Club de Lectura

| Libro | Bancos | Estado |
|-------|--------|--------|
| La historia de Manú | 50 + 25 + 12 preguntas | ✅ |
| El lugar más bonito del mundo | 30 + 15 + 10 preguntas | ✅ |

---

## ✅ Motor de errores (completado 2026-10-12)

| Tarea | Estado |
|-------|--------|
| Tabla `intentos_ejercicios` en D1 | ✅ |
| Tabla `mapa_identidad` (hash → alumna) | ✅ |
| Tabla `consentimientos_tracking` (Ley 21.719) | ✅ |
| Endpoint `/api/tutor/registrar-intento` en Worker | ✅ |
| Enviar intentos desde `problema-card.js` | ✅ |
| Enviar intentos desde `tutor-contextualizado.js` | ✅ |
| Etiquetar errores del tutor con `error_type` | ✅ |
| `INTENTOS_SALT` en producción | ✅ |
| Deploy del Worker (`2f19a8e8`) | ✅ |
| Prueba end-to-end en producción | ✅ |

**Taxonomía final de `error_type`** (10 tipos):
`cociente_incorrecto`, `resto_incorrecto`, `ambos_incorrectos`, `subestimacion`, `sobreestimacion`, `error_resta_intermedia`, `error_suma_total`, `error_calculo_mult`, `resto_mayor_divisor`, `error_conceptual`.

---

## ✅ Panel docente (completado 2026-10-12)

| Tarea | Estado |
|-------|--------|
| Endpoint `/api/admin/metricas/resumen` | ✅ |
| Endpoint `/api/admin/metricas/por-error` | ✅ |
| Endpoint `/api/admin/metricas/por-dia` | ✅ |
| Endpoint `/api/admin/metricas/por-alumna` | ✅ |
| Página `/admin/metricas` | ✅ |
| Desanonimizado vía `mapa_identidad` | ✅ |
| Filtros por fecha y origen | ✅ |
| Navegación desde dashboard admin | ✅ |

**Componentes**:
- `workers/api/src/routes/admin-metricas.ts` (4 endpoints).
- `src/pages/admin/metricas.astro` (panel completo).
- Tarjeta "Métricas detalladas" en `/admin` ahora es link activo.

**Datos mostrados**:
- Resumen: total intentos, tasa de acierto, alumnas con datos, días con actividad.
- Errores por tipo: distribución con barras proporcionales.
- Actividad por día: barritas verde (aciertos) / naranja (errores).
- Detalle por alumna: nombre, total, aciertos, errores, error más frecuente.

---

## ⏳ PENDIENTES (en orden de prioridad)

### 🥇 0. Roadmap de 3 meses (en curso)

Ver `ROADMAP_3_MESES.md`.

**Estado**: no iniciado. Próximo paso: Semana 1 (gamificación suave).

**Estructura**:
- **Mes 1**: hacerla entretenida (gamificación, visualizaciones, proyectos cortos, feedback emocional).
- **Mes 2**: hacerla útil para el apoderado (informe PDF, página pública, vista "cómo ayudar", perfil apoderado).
- **Mes 3**: profundizar y demostrar (análisis guiado en Lenguaje, proyectos largos, portafolio, demo institucional).

**Top 3 si el tiempo se acorta**: gamificación suave + racha · informe PDF · visualizaciones en Matemáticas.




### 🥇 1. Próximo contenido de Lenguaje (decisión pendiente)

Según `OA_LENGUAJE.md`, la cobertura de 3° básico es:

| Eje | Cobertura |
|-----|-----------|
| Lectura | 27% |
| Escritura | 0% |
| Comunicación oral | 0% |

**Opciones sobre la mesa**:
- **Opción B1**: Escritura OA 12-13 (escribir frecuentemente + narraciones). Encaja con el Club de Lectura.
- **Opción B2**: Lectura OA 6 (textos no literarios: noticias, cartas, biografías).

**Recomendación**: B1 por alto valor y bajo costo de generación.

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

Crear la clase "3° Básico D 2026" completa y probar el flujo end-to-end.

### 6. Más contenido

- Inglés: más lecciones.
- Ciencias, Historia: lecciones pendientes.
- Programación: Creadoras de Mundos (10 capítulos).
- Historia: Selk'nam (5 capítulos pendientes).
- `OA_CIENCIAS.md` (documento de referencia).

### 7. Validar `resta-52-menos-27.json`

Pendiente del motor de tutor (ver `MOTOR_TUTOR_ESPECIFICACION.md`).

### 8. Videos por capítulo

Embed de YouTube colapsable en cursos especiales. (Congelado por ahora.)

---

## 🎨 Paleta de colores

| Materia | Color | Hex |
|---------|-------|-----|
| Lenguaje | Rosa coral | `#EC4899` |
| Matemáticas | Azul eléctrico | `#3B82F6` |
| Historia y Geografía | Ámbar dorado | `#F59E0B` |
| Inglés | Turquesa | `#14B8A6` |
| Ciencias | Verde lima | `#84CC16` |
| Programación | Magenta | `#D946EF` |
| Marca principal | Morado eléctrico | `#8B5CF6` |
| Aciertos | Verde menta | `#10B981` |
| Errores | Coral | `#F97316` |
| Fondo | Gris claro | `#F8F9FA` |

---

## 📚 Convenciones de contenido

### Estructura de cada lección JSON

```json
{
  "id": "slug-en-kebab-case",
  "titulo": "Título con Emoji 🎯",
  "categoria": "Nombre de la materia",
  "emoji": "🎯",
  "progreso_puntos": 50,
  "contenido_modulos": ["bloque 1", "bloque 2"],
  "banco_trivia": [
    {
      "id": "t01",
      "dificultad": "media",
      "pregunta": "...",
      "opciones": ["A", "B", "C", "D"],
      "respuesta_correcta": 1,
      "explicacion": "..."
    }
  ]
}
```


Nota: toda trivia nueva debe usar banco_trivia (no trivia), para activar TriviaRotativa.

Estilo del profesor (ver PROMPT_PROFESOR.md)
Tono serio pero cercano, no infantil.

Frases cortas (máximo 20 palabras).

Ejemplos cotidianos.

Español de Chile.

Sin "amiga", "lista", "amiguitas".

🔄 Flujo de trabajo (OBLIGATORIO)
Publicación después de cada cambio
bash
cd ~/Escritorio/EstudioFernanda/web-educativa
git add .
git commit -m "Descripción breve del cambio"
git push
Formatos de mensaje de commit:

Nueva lección: Nueva lección: <título> (<materia>)

Nuevo capítulo: Nuevo capítulo: <título> (<curso>)

Actualización: Update: <descripción>

Fix: Fix: <descripción>

Fase: Fase X: <descripción>

📚 Documentación del proyecto
Archivo	Contenido
ESTADO_PROYECTO.md	Estado general + pendientes
GUIA_IA.md	Manual técnico completo
PROMPT_TRASPASO.md	Prompt para chat nuevo
ROADMAP_3_MESES.md | Plan de 3 meses: gamificación, apoderado, portafolio |
ALINEACION_MINEDUC.md	Referencia curricular obligatoria
MOTOR_TUTOR_ESPECIFICACION.md	Especificación del motor + bitácoras
OA_MATEMATICA.md	OA de Matemática 1° a 6°
OA_LENGUAJE.md	OA de Lenguaje 1° a 6° + mapa de alineación
BITACORA_DIVISION_PROBLEMAS.md	Bitácora del tutor de división
BITACORA_EJERCICIOS_GUIADOS.md	Bitácora de ejercicios guiados
PROTOCOLO_NUEVA_COMPRENSION.md	Cómo agregar libros al Club de Lectura
TUTOR_PLAN.md	Plan del tutor interactivo
NOTIFICACIONES_PLAN.md	Plan de notificaciones
💡 Notas para el próximo chat
Antes de empezar una nueva fase, consultar:

Este archivo (ESTADO_PROYECTO.md) para el estado general.

GUIA_IA.md para el manual técnico.

PROMPT_TRASPASO.md para el prompt de traspaso.

ALINEACION_MINEDUC.md para la referencia curricular.

NOTIFICACIONES_PLAN.md, TUTOR_PLAN.md o MOTOR_TUTOR_ESPECIFICACION.md según corresponda.

**Prioridad siguiente**: iniciar la Semana 1 del roadmap (gamificación suave). Ver `ROADMAP_3_MESES.md`.

Fin del estado del proyecto.





