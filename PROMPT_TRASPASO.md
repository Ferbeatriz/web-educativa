# 🔄 PROMPT DE TRASPASO — web-educativa

> Última actualización: 2026-10-15
> Commit de referencia: `45f90c1`
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

## 🚨 ALERTAS PARA LA IA (LEER OBLIGATORIAMENTE)

1. **Monitoreo de memoria:** La IA debe indicar explícitamente cuando su ventana de contexto esté al **85% de uso**. En ese momento, debe:
   - Notificar a la usuaria: "He alcanzado el 85% de mi memoria. Es momento de generar respaldos."
   - Actualizar inmediatamente `ESTADO_PROYECTO.md` y `PROMPT_TRASPASO.md` con un resumen de la sesión.
   - Sugerir el commit correspondiente.

2. **Resumen de sesión:** Al cerrar una sesión (por cambio de tema, por fin de jornada, o por alerta de memoria), la IA debe generar un **resumen sucinto** de todo lo relevante realizado, para que la IA que retome el trabajo entienda el contexto sin necesidad de releer todo el chat.

---
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

**Commit de referencia:** ( 93ce5e2..a6fbdbe).




## ✅ Actualización 2026-11-24 (cierre de sesión)

**Lo que se logró:**
- **Nueva lección:** "Actividades: Área y Perímetro" (24 ejercicios fijos con SVG, figuras organizadas).
- **Nueva lección:** "Actividades: Textos Instructivos" (14 ejercicios, con opciones rotadas).
- **Logros por mérito:** Agregados `primera_division_sin_tutor`, `cinco_divisiones_sin_tutor`, `diez_divisiones_sin_tutor` y `primer_libro_completo`.
- **Portafolio:** Ahora muestra el detalle de respuestas por lección (agrupadas por pregunta, con resumen de correctas/incorrectas).
- **Racha:** Se agregó el texto informativo "Días activos seguidos. No se rompe si faltas." en el portafolio.
- **Mapa de progreso:** Se implementó el "X de Y" por materia (con totales hardcodeados en el frontend).
- **Fix:** Se corrigió la pregunta ambigua de textos instructivos y se rotaron las opciones para evitar que la respuesta correcta sea siempre la misma letra.
- **Fix crítico:** Se hizo dinámico el `materia_id` en `TriviaRotativa.astro` (ya no está hardcodeado como 'matematicas'). Ahora el correo y las métricas reflejan la materia correcta.

**Pendientes para la próxima sesión:**
- Revisar el panel del admin (`/admin/metricas`) para incluir las últimas 3 lecciones con porcentaje de cumplimiento.
- Iniciar el Mes 2 (Informe PDF para el apoderado).

**Commit de referencia:** (anotar el hash después de `git push`).



## 📋 Resumen de la sesión del 2026-11-24

**Objetivo de la sesión:** Implementar el sistema de métricas, crear nuevas lecciones y corregir pendientes de gamificación.

**Lo que se logró:**
- Se creó la tabla `respuestas_lecciones` (schema-08) con `alumna_hash` para cumplir con la Ley 21.719.
- Se implementaron los endpoints `POST /api/progreso/registrar-respuesta`, `POST /api/progreso/actualizar-avance` y `GET /api/progreso/mis-respuestas/:leccion_id`.
- Se modificó `TriviaRotativa.astro` para que envíe las respuestas al backend y haga dinámico el `materia_id`.
- Se agregó la plantilla de email `notificarAdminAvance` en `lib/email.ts`.
- Se corrigió el JSON de `introduccion-fracciones.json` (faltaban los IDs).
- Se crearon dos lecciones nuevas: "Actividades: Textos Instructivos" (14 ejercicios) y "Actividades: Área y Perímetro" (24 ejercicios con SVG).
- Se agregaron logros por mérito: divisiones sin tutor (1, 5 y 10) y primer libro completo.
- Se mejoró el portafolio: muestra el detalle de respuestas por lección (agrupadas por pregunta, con resumen de correctas/incorrectas) y la racha con contexto informativo.
- Se implementó el mapa de progreso "X de Y" por materia.

**Archivos modificados:**
- `workers/api/schema-08-respuestas.sql` (nuevo)
- `workers/api/src/routes/progreso.ts` (nuevos endpoints y lógica de logros)
- `workers/api/src/lib/db.ts` (nuevas funciones)
- `workers/api/src/lib/email.ts` (nueva plantilla)
- `workers/api/src/index.ts` (nuevas rutas)
- `src/components/TriviaRotativa.astro` (envío de respuestas y `materia_id` dinámico)
- `src/pages/mi-portafolio.astro` (detalle de respuestas y racha con contexto)
- `src/pages/leccion/[...slug].astro` (pasa `materiaId` a `TriviaRotativa`)
- `src/data/materias/matematicas/lecciones/actividades-area-perimetro.json` (nuevo)
- `src/data/materias/lenguaje/lecciones/actividades-textos-instructivos.json` (nuevo)
- `src/data/materias/matematicas/materia.json` (registro de nueva lección)
- `src/data/materias/lenguaje/materia.json` (registro de nueva lección)

**Decisiones tomadas:**
- Se usó `alumna_hash` en lugar de `alumna_id` para las respuestas (privacidad).
- El correo de avance se envía siempre (sea que completó o no la lección), pero solo si hay consentimiento parental.
- Se eliminó `verificarLogros()` del frontend (el backend no tiene ese endpoint).
- Se hardcodearon los totales de lecciones por materia en el frontend (solución simple).
- El `materia_id` ahora es dinámico en `TriviaRotativa.astro` (viene de `materia.id`).

**Pendientes para la próxima sesión:**
- Agregar la llamada a `POST /api/progreso/completar` en `TriviaRotativa.astro` para que las lecciones aparezcan en el portafolio (el código está en el chat).
- Revisar el panel del admin (`/admin/metricas`) para incluir las últimas 3 lecciones con porcentaje de cumplimiento.
- Iniciar el Mes 2 (Informe PDF para el apoderado).

**Commit de referencia:** (anotar el hash después de `git push`).

## ✅ Actualización 2026-11-24 (cierre de sesión)

**Lo que se logró:**
- **Nueva lección:** "Actividades: Área y Perímetro" (24 ejercicios fijos con SVG, figuras organizadas).
- **Nueva lección:** "Actividades: Textos Instructivos" (14 ejercicios, con opciones rotadas).
- **Logros por mérito:** Agregados `primera_division_sin_tutor`, `cinco_divisiones_sin_tutor`, `diez_divisiones_sin_tutor` y `primer_libro_completo`.
- **Portafolio:** Ahora muestra el detalle de respuestas por lección (agrupadas por pregunta, con resumen de correctas/incorrectas).
- **Racha:** Se agregó el texto informativo "Días activos seguidos. No se rompe si faltas." en el portafolio.
- **Mapa de progreso:** Se implementó el "X de Y" por materia (con totales hardcodeados en el frontend).
- **Fix:** Se corrigió la pregunta ambigua de textos instructivos y se rotaron las opciones para evitar que la respuesta correcta sea siempre la misma letra.
- **Fix crítico:** Se hizo dinámico el `materia_id` en `TriviaRotativa.astro` (ya no está hardcodeado como 'matematicas'). Ahora el correo y las métricas reflejan la materia correcta.

**Pendientes para la próxima sesión:**
- Revisar el panel del admin (`/admin/metricas`) para incluir las últimas 3 lecciones con porcentaje de cumplimiento.
- Iniciar el Mes 2 (Informe PDF para el apoderado).

**Commit de referencia:** (anotar el hash después de `git push`).


**Objetivo de la sesión:** Implementar el sistema de métricas (registro de respuestas y notificaciones) y corregir pendientes de sesiones anteriores.

**Lo que se logró:**
- Se creó la tabla `respuestas_lecciones` (schema-08) con `alumna_hash` para cumplir con la Ley 21.719.
- Se implementaron los endpoints `POST /api/progreso/registrar-respuesta` y `POST /api/progreso/actualizar-avance` en el Worker.
- Se modificó `TriviaRotativa.astro` para que envíe las respuestas al backend al hacer clic en "Corregir respuestas".
- Se agregó la plantilla de email `notificarAdminAvance` en `lib/email.ts`.
- Se corrigió el JSON de `introduccion-fracciones.json` (faltaban los IDs de las preguntas).
- Se validó el flujo completo: frontend → backend → D1 → email → Proton.
- Se limpió la fila con `pregunta_id: undefined` en D1.

**Archivos modificados:**
- `workers/api/schema-08-respuestas.sql` (nuevo)
- `workers/api/src/routes/progreso.ts` (nuevos endpoints)
- `workers/api/src/lib/db.ts` (nuevas funciones)
- `workers/api/src/lib/email.ts` (nueva plantilla)
- `workers/api/src/index.ts` (nuevas rutas)
- `src/components/TriviaRotativa.astro` (envío de respuestas)
- `src/data/materias/matematicas/lecciones/introduccion-fracciones.json` (IDs agregados)
- `ESTADO_PROYECTO.md` y `PROMPT_TRASPASO.md` (este documento)

**Decisiones tomadas:**
- Se usó `alumna_hash` en lugar de `alumna_id` para las respuestas (privacidad).
- El correo de avance se envía **siempre** (sea que completó o no la lección), pero solo si hay consentimiento parental.
- El `materia_id` en `TriviaRotativa.astro` está hardcodeado como `'matematicas'`. Pendiente hacerlo dinámico en una próxima iteración.
- Se eliminó la fila con `pregunta_id: undefined` de la tabla `respuestas_lecciones`.

**Pendientes para la próxima sesión:**
- Cerrar la Semana 1: agregar logros por mérito (divisiones sin tutor, primer libro completo), dar contexto informativo a la racha en el portafolio, completar el mapa de progreso.
- Revisar el panel del admin (`/admin/metricas`) para incluir las últimas 3 lecciones con porcentaje de cumplimiento.
- Hacer dinámico el `materia_id` en `TriviaRotativa.astro`.
- Iniciar el Mes 2 (Informe PDF para el apoderado) si se decide saltar.

**Commit de referencia:** (anotar el hash después de `git push`).


## 🚨 ALERTAS PARA LA IA (LEER OBLIGATORIAMENTE)

1. **Monitoreo de memoria:** La IA debe indicar explícitamente cuando su ventana de contexto esté al **85% de uso**. En ese momento, debe:
   - Notificar a la usuaria: "He alcanzado el 85% de mi memoria. Es momento de generar respaldos."
   - Actualizar inmediatamente `ESTADO_PROYECTO.md` y `PROMPT_TRASPASO.md` con un resumen de la sesión.
   - Sugerir el commit correspondiente.

2. **Resumen de sesión:** Al cerrar una sesión (por cambio de tema, por fin de jornada, o por alerta de memoria), la IA debe generar un **resumen sucinto** de todo lo relevante realizado, para que la IA que retome el trabajo entienda el contexto sin necesidad de releer todo el chat.

---

## 📋 Resumen de la sesión del 2026-11-19

**Objetivo de la sesión:** Cerrar pendientes técnicos y avanzar en el roadmap.

**Lo que se logró:**
- Se diagnosticó y corrigió el renderizado de figuras irregulares (L, T) en `TriviaRotativa.astro`, usando una función `generarGrid()` que soporta marcadores `{{FIGURA:tipo:color}}` y `{{FIGURA:tipo}}`.
- Se verificó que el Laboratorio de Operaciones con Fracciones ya está operativo (modal flotante).
- Se confirmó que la animación de división y el simulador de sumas verticales ya están integrados (Semana 2 completada).
- Se actualizó el banco de comprensión de "La cama mágica de Bartolo" a 40 preguntas, iterando las respuestas correctas para evitar patrones.
- Se generó el commit con todos los cambios.

**Archivos modificados:**
- `src/components/TriviaRotativa.astro` (función `procesarFiguras` y `generarGrid`).
- `src/styles/global.css` (bloque `@theme` con colores para las figuras).
- `src/data/materias/lenguaje/lecturas/la-cama-magica-de-bartolo/banco-comprension.json` (40 preguntas).
- `ESTADO_PROYECTO.md` y `PROMPT_TRASPASO.md` (este documento).

**Decisiones tomadas:**
- Se descartó la Opción B (tabla en D1) para el mapa de progreso; se usará el frontend con los JSON de materia.
- Se eliminó `verificarLogros()` del frontend porque el backend no tiene ese endpoint (pendiente de confirmar en próxima sesión).
- Se acordó que la IA debe alertar al 85% de uso de memoria.

**Pendientes para la próxima sesión:**
- Cerrar la Semana 1 (logros por mérito, racha informativa, mapa de progreso).
- Confirmar si se elimina `verificarLogros()` del frontend.
- Iniciar el Mes 2 (Informe PDF para apoderado) si se decide saltar.

**Commit de referencia:** (anotar el hash después de `git push`).



## 🚨 DECLARACIÓN DE INTENCIONES (LEER OBLIGATORIAMENTE)

Este proyecto no es solo un repositorio de código; es un **producto comercial en preparación** con fines de financiamiento. 

**Visión:** Somos una plataforma de **soluciones educativas** que busca resolver los siguientes dolores:
- **Alumnas:** Quieren aprender de forma interactiva con IA.
- **Apoderados:** No tienen tiempo ni interés de estudiar con sus hijas (especialmente padres separados). Necesitan reportes y acompañamiento.
- **Profesores:** Quieren evitarse trabajo extra y tareas para la casa. Usan nuestra IA para planificar y crear material.
- **Colegios:** Buscan mejores puntajes SIMCE/PAES y reportes de estado académico para la dirección.

**Implicancia para la IA:** Toda nueva funcionalidad o lección que crees debe estar alineada con esta visión comercial. No se trata solo de "cumplir con el MINEDUC", sino de construir un producto deseable para los segmentos descritos.

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





## 📚 LECTURA OBLIGATORIA ANTES DE CUALQUIER ACCIÓN

- `ALINEACION_MINEDUC.md` → Referencia curricular obligatoria.
- `MOTOR_TUTOR_ESPECIFICACION.md` → Especificación del motor + bitácoras.
- `OA_MATEMATICA.md` → OA de Matemática 1° a 6°.
- `OA_LENGUAJE.md` → OA de Lenguaje 1° a 6° + mapa de alineación.
- `BITACORA_DIVISION_PROBLEMAS.md` → Estado de los ejercicios de división.
- `BITACORA_EJERCICIOS_GUIADOS.md` → Estado de los ejercicios guiados.
- `ROADMAP_3_MESES.md` → Plan de 3 meses (gamificación, apoderado, portafolio).
---


## Estado actual (2026-11-19)
- **Portafolio:** Funcional en `/mi-portafolio`. 
- **Tutor Docente:** Operativo con autoguardado en GitHub.
- **Música:** Metalófono virtual de 25 notas operativo.
- **Próximos pasos:** Postular a financiamiento (definir SpA y One-Pager) o seguir expandiendo lecciones.




## Estado actual (2026-11-18)
- **Música:** Metalófono virtual funcional. Pendiente agregar canciones (El Negro José, Estrellita) como lecciones si se desea.
- **Matemáticas:** Módulo completo con fracciones, geometría y práctica.
- **Historia:** Módulo completo con Historia de Chile y Universal.
- **Tutor Docente IA:** Funcional con autoguardado en GitHub.
- **Próximos pasos:** Iniciar el Mes 3 (Portafolio de la Alumna) o postular a fondos de financiamiento.


(2026-11-17)
- **Matemáticas:** Módulo de Geometría y Operaciones reforzado con práctica y simuladores. 
- **Tutor Docente:** Funcional con autoguardado en GitHub.
- **Pendientes:** Reparar audio del metalófono o iniciar el Portafolio de la Alumna (Mes 3).



(2026-11-10)
- **Matemáticas:** Eje de Números y Operaciones (básico) + Geometría/Medición (completado). Los módulos de Fracciones, Perímetro y Área están 100% operativos.
- **Lenguaje:** Comprensión lectora (Trivia + Análisis Guiado) funcionando en el Club de Lectura.
- **Música:** Metalófono virtual creado, pero con problemas de audio pendientes.
- **Próximos pasos sugeridos:** 
  1. Reparar el audio del Metalófono.
  2. Iniciar el eje de Escritura en Lenguaje (OA 12-22).
  3. Comenzar el Mes 3 del roadmap (Portafolio / Notificaciones).



- **Protocolo IA:** Cline ha fallado repetidamente en la edición de archivos (ignorando `.clinerules` y usando Python). Se recomienda encarecidamente que el usuario pegue el código manualmente y use la IA solo para generar el código.
## 🚨 Protocolo Obligatorio de Respaldo y Traspaso
**Regla de oro:** La IA a cargo NUNCA debe terminar una sesión de trabajo sin recordarle a la usuaria realizar los siguientes dos pasos. 
**Cuándo activar:** Al terminar un componente, al cambiar de materia, o cuando la conversación sea muy extensa.
**Pasos:**
1. **Git:** Recordar a la usuaria ejecutar `git add .`, `git commit`, `git push`.
2. **Documentación:** Generar la actualización de `ESTADO_PROYECTO.md` y `PROMPT_TRASPASO.md` con el resumen de avances.


## Estado actual (2026-11-14 - Cierre)
- **Historia:** Módulo completo con "Historia de Chile" (Derechos y Deberes) y "Historia Universal" (Mini curso Viaje al Pasado).
- **Tutor Docente IA:** Autoguardado en GitHub 100% funcional.
- **Próximos pasos prioritarios:** 
  1. Arreglar el audio del módulo de Música (Metalófono).
  2. Iniciar el Mes 3 del Roadmap (Portafolio de la Alumna / Notificaciones a apoderados).
## Estado actual (2026-11-14)
- **Historia:** Submódulo "Historia de Chile" con 2 lecciones (Comunidad e Instituciones + Derechos y Deberes).
- **Tutor Docente:** Autoguardado de lecciones en GitHub funcionando al 100%. El botón verde permite guardar los JSON generados por la IA directamente en el repositorio.
- **Próximos pasos:** Arreglar el audio del módulo de Música o iniciar el Mes 3 (Portafolio/Notificaciones).

- **Tutor Docente (IA):** Integrado y funcionando. Usa Groq. Para migrar a DeepSeek o Claude, solo se debe cambiar la URL, la API Key y el modelo en `workers/api/src/routes/docente.ts`.
- **Pendientes:** Reparar audio del Metalófono o avanzar con Escritura en Lenguaje.


### Últimas sesiones cerradas

- **2026-10-12**: Motor de errores en producción (Worker `7ca9a592`) + panel docente `/admin/metricas`.
- **2026-10-14**: `OA_LENGUAJE.md` creado + migración de `los-textos-poeticos` a `banco_trivia`.
- **2026-10-15**: `ROADMAP_3_MESES.md` creado. Comienza el roadmap de 3 meses.

### Próximo paso

**Iniciar la Semana 1 del Mes 1 del roadmap**: gamificación suave.

**Foco de la Semana 1**:
- Logros/insignias por mérito (no por actividad vacía).
- Racha diaria informativa (no punitiva).
- Mapa visual de progreso por materia.

**Principios**: ir de a poco, con profundidad. La ludicidad no puede
tapar el contenido. Ver `ROADMAP_3_MESES.md` para los principios
completos.

### Roadmap de 3 meses (resumen)

| Mes | Objetivo | Foco |
|-----|----------|------|
| 1 | Hacerla entretenida | Gamificación, visualizaciones, proyectos cortos, feedback emocional |
| 2 | Hacerla útil para el apoderado | Informe PDF, página pública, vista "cómo ayudar", perfil apoderado |
| 3 | Profundizar y demostrar | Análisis guiado en Lenguaje, proyectos largos, portafolio, demo institucional |

**Postergado, no descartado**: Ciencias, Historia, Inglés, notificaciones,
nuevas comprensiones de lectura (se pedirán cuando corresponda).

**Detalle completo**: `ROADMAP_3_MESES.md`.

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
| `ROADMAP_3_MESES.md` | Plan de 3 meses: gamificación, apoderado, portafolio |
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

