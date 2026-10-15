# 🗺️ ROADMAP 3 MESES — web-educativa

> Última actualización: 2026-10-15
> Commit de referencia: `45f90c1`
> Estado global: **no iniciado**
> Documento vivo: se actualiza al cerrar cada semana.

---

## 🎯 Filosofía del roadmap

Este roadmap cubre **3 meses de trabajo** con un objetivo claro:
transformar la plataforma de "seria y correcta" a "seria, correcta
y entretenida", sin perder la alineación con los OA del MINEDUC.

### Principios rectores

1. **Foco en profundidad, no cobertura.**
   Mejor 2 materias excelentes (Matemáticas y Lenguaje) que 6 a medias.
   Ciencias, Historia e Inglés se postergan hasta que las 2 actuales
   estén maduras.

2. **Complemento de Google Classroom, no reemplazo.**
   Google da el aula. Nosotros damos el razonamiento.
   La plataforma no gestiona tareas, no comunica, no reemplaza al
   docente. Diagnostica el razonamiento paso a paso.

3. **Gamificación con mérito, no con actividad.**
   Los logros se ganan por aprender, no por abrir la plataforma o
   hacer clic. Ver sección "Principios de gamificación suave".

4. **Alineación MINEDUC intocable.**
   Toda funcionalidad nueva debe respetar los OA y OAT del MINEDUC
   (`ALINEACION_MINEDUC.md`). La ludicidad no puede tapar el contenido.

5. **Feedback real de la alumna como brújula.**
   Feedback actual de la alumna piloto (3° básico):
   - "Le falta más para ser entretenida".
   - "Me gustan las lecciones cortas con cuestionarios precisos".
   Ambas guían las decisiones de diseño del Mes 1.

---

## 🎮 Principios de gamificación suave

Definición operativa: **ir de a poco, pero con profundidad. Transformar
la experiencia de "seria y aburrida" a "seria y lúdica", sin perder
la esencia pedagógica.**

### Lo que SÍ es gamificación suave

- **Logros por mérito.** Se premia aprender: terminar una lección,
  resolver un problema sin tutor, leer un libro completo, mejorar en
  un tipo de error.
- **Racha diaria informativa.** Mide uso, no penaliza. Si la alumna
  completa todo en un día y no vuelve en una semana, no hay castigo.
  La racha se muestra, no se impone.
- **Mapa visual de progreso.** Orientación: al abrir una lección, la
  alumna ve cuánto le falta de esa materia. Es orientación, no
  gamificación vacía.
- **Feedback emocional sobrio.** Mensajes de la "profesora" adaptados
  al estado (racha larga = celebración, racha rota = ánimo). Sin
  infantilizar.

### Lo que NO es gamificación suave

- Puntos por hacer clic.
- Rankings entre compañeras (genera ansiedad a los 9-12 años).
- Rachas punitivas ("perdiste la racha, empieza de cero").
- Animaciones que no aportan al aprendizaje.
- Insignias por actividad vacía ("entraste 3 días seguidos").
- Monedas virtuales canjeables (complejidad innecesaria).
- Avatares coleccionables (fuera de alcance de los 3 meses).

### Consecuencias operativas

- Los logros se definen caso a caso y se aprueban solo si cumplen
  un criterio pedagógico.
- El número exacto de logros, cuánto vale cada uno, dónde se muestran
  y cómo se muestran → se decide al implementar cada funcionalidad.
- El roadmap no fija estos detalles. Solo fija el principio.

---

## 📅 MES 1 — "HACERLA ENTRETENIDA"

**Objetivo**: que la alumna quiera volver sin que el apoderado se lo pida.

**Criterio de éxito**: al final del mes, la alumna entra a la plataforma
por iniciativa propia al menos 3 veces por semana, sin recordatorio.

### Semana 1 — Gamificación suave (logros + racha + mapa)

- **Logros/insignias por mérito.** Ejemplos iniciales (a definir al
  implementar):
  - Primera lección completada.
  - Primer libro del Club de Lectura terminado.
  - Primera división resuelta sin activar el tutor.
  - 10 divisiones resueltas sin tutor.
  - Todas las lecciones de una materia completadas.
- **Racha diaria informativa.** Muestra días consecutivos de uso.
  No penaliza. No se rompe por ausencia.
- **Mapa visual de progreso por materia.** Al abrir una lección, la
  alumna ve cuánto le falta de esa materia.

### Semana 2 — Visualizaciones en Matemáticas

- Integrar `AnimacionDivision.astro` en los 20 problemas
  contextualizados (hoy solo está en el tutor 37÷5).
- Agregar línea numérica interactiva para suma/resta.

### Semana 3 — Proyectos cortos

- Mini-proyecto semanal que atraviesa 2-3 lecciones.
- Ejemplo: "Diseña la fiesta de cumpleaños" → matemáticas + lenguaje.

### Semana 4 — Feedback emocional

- Mensajes de la "profesora" adaptados al estado (racha rota = ánimo,
  racha larga = celebración).
- Animaciones sutiles al acertar.

---

## 📅 MES 2 — "HACERLA ÚTIL PARA EL APODERADO"

**Objetivo**: que el apoderado vea valor real, no solo estadísticas.

**Criterio de éxito**: al final del mes, el apoderado puede responder
"¿qué aprendió mi hija esta semana?" en menos de 1 minuto, usando la
plataforma.

### Semana 5 — Informe mensual en PDF

- Página `/apoderado/informe` que genera PDF con progreso, logros,
  áreas de mejora, descargable.

### Semana 6 — Página pública "¿qué aprende esta semana?"

- Página sin login que muestra la lección activa, OA MINEDUC asociado,
  y 3 tips para apoyar en casa.

### Semana 7 — Vista "cómo ayudar"

- Para cada OA donde la alumna tenga dificultad, mostrar una actividad
  concreta que el apoderado puede hacer en 10 minutos.

### Semana 8 — Perfil del apoderado

- Login ligero para apoderado (distinto del login de alumna), con vista
  de progreso de su hija.

---

## 📅 MES 3 — "PROFUNDIZAR Y DEMOSTRAR"

**Objetivo**: que lo construido sea demostrable a un colegio como piloto.

**Criterio de éxito**: al final del mes, existe un documento de 2
páginas que un colegio puede leer y decir "quiero probarlo".

### Semana 9 — Lenguaje con lectura activa

- **Análisis guiado** (tutor paso a paso aplicado a pasajes del libro).
  - Micro-tutor de 4-6 pasos por análisis.
  - 5-8 análisis por libro.
  - Tipos de error específicos: `lectura_literal`,
    `no_conecta_pasajes`, `no_infiere`, `no_interpreta_lenguaje_figurado`.
- Marcadores de texto y anotaciones al margen (si queda tiempo).
- Mapa de personajes en el Club de Lectura (si queda tiempo).

### Semana 10 — Proyectos largos

- Un proyecto de 2 semanas por materia, con entregable final que se
  guarda en portafolio.

### Semana 11 — Portafolio de la alumna

- Página `/mi-portafolio` con todo lo producido (textos, proyectos,
  logros, evolución).

### Semana 12 — Preparar demo institucional

- Documento de 2 páginas explicando alineación MINEDUC + privacidad
  (Ley 21.719) + resultados del piloto personal.

---

## 🏆 Top 3 prioridades si el tiempo se acorta

Si alguna semana no se puede completar, estas tres funcionalidades
tienen prioridad sobre el resto:

1. **Gamificación suave + racha diaria** (Semana 1).
2. **Informe mensual en PDF** (Semana 5).
3. **Visualizaciones en Matemáticas** (Semana 2).

Las demás son deseables, pero prescindibles si el tiempo no alcanza.

---

## 🚫 Lo que NO se hará en estos 3 meses

Aclaración: son postergaciones, no descartes definitivos. Se retomarán
cuando corresponda.

- **Nuevas comprensiones de lectura**: se agregarán cuando la autora
  las solicite, siguiendo `PROTOCOLO_NUEVA_COMPRENSION.md`.
- **Notificaciones por email**: requieren dominio propio (~$10 USD/año).
- **Ciencias, Historia, Inglés**: necesitan contenido + componentes
  nuevos.
- **Panel docente más complejo**: el actual es suficiente para uso
  personal.
- **Más lecciones de Matemáticas**: con 6 alcanza; el foco es mejorar
  las 6 que hay.
- **Rankings, monedas virtuales, avatares**: ver principios de
  gamificación suave.

---

## 🔑 Decisiones clave ya tomadas

| # | Decisión | Detalle |
|---|----------|---------|
| 1 | Foco en profundidad | 2 materias excelentes > 6 a medias |
| 2 | Complemento, no reemplazo | No competir con Classroom |
| 3 | Gamificación con mérito | No por actividad vacía |
| 4 | Racha informativa | No punitiva, no penaliza ausencia |
| 5 | Mapa de progreso en Semana 1 | No en Semana 2 |
| 6 | Análisis guiado en Lenguaje | Mes 3, Semana 9 |
| 7 | Feedback de la alumna como brújula | "Más entretenida" + "lecciones cortas" |
| 8 | Comprensiones: postergadas, no descartadas | Se piden cuando corresponda |

---

## 🤔 Decisiones aplazadas

Estas decisiones **no** se toman ahora. Se toman al implementar cada
funcionalidad.

- Cuántos logros hay en total.
- Cuánto XP vale cada logro.
- Dónde se muestran los logros (perfil, home, materia).
- Cómo se muestran los logros (badge, tarjeta, animación).
- Si la racha se muestra en home o en perfil.
- Si la racha tiene insignia por hitos (7 días, 30 días).
- Si el mapa visual reemplaza o complementa `BarraProgresoLectura`.
- Detalles de la línea numérica interactiva (rango, formato).
- Estructura de los mini-proyectos semanales.
- Todo lo del Mes 2 y Mes 3 que no esté en este documento.

---

## 📊 Estado por semana

| Mes | Semana | Foco | Estado |
|-----|--------|------|--------|
| 1 | 1 | Gamificación suave | ⏳ No iniciada |
| 1 | 2 | Visualizaciones Matemáticas | ⏳ No iniciada |
| 1 | 3 | Proyectos cortos | ⏳ No iniciada |
| 1 | 4 | Feedback emocional | ⏳ No iniciada |
| 2 | 5 | Informe PDF | ⏳ No iniciada |
| 2 | 6 | Página pública | ⏳ No iniciada |
| 2 | 7 | Vista "cómo ayudar" | ⏳ No iniciada |
| 2 | 8 | Perfil apoderado | ⏳ No iniciada |
| 3 | 9 | Análisis guiado Lenguaje | ⏳ No iniciada |
| 3 | 10 | Proyectos largos | ⏳ No iniciada |
| 3 | 11 | Portafolio | ⏳ No iniciada |
| 3 | 12 | Demo institucional | ⏳ No iniciada |

Estados posibles: ⏳ No iniciada · 🚧 En curso · ✅ Completada · ⏸️ Pausada

---

## 📚 Documentos relacionados

| Archivo | Relación con el roadmap |
|---------|--------------------------|
| `ESTADO_PROYECTO.md` | Estado general del proyecto |
| `PROMPT_TRASPASO.md` | Contexto para chats nuevos |
| `ALINEACION_MINEDUC.md` | Referencia curricular obligatoria |
| `OA_MATEMATICA.md` | OA de Matemática 1° a 6° |
| `OA_LENGUAJE.md` | OA de Lenguaje 1° a 6° + mapa de cobertura |
| `MOTOR_TUTOR_ESPECIFICACION.md` | Especificación del motor paso a paso |
| `PROTOCOLO_NUEVA_COMPRENSION.md` | Cómo agregar libros al Club de Lectura |
| `NOTIFICACIONES_PLAN.md` | Plan de notificaciones (fuera del roadmap actual) |

---

## 🔄 Cómo se actualiza este documento

- **Al cerrar cada semana**: cambiar el estado en la tabla de "Estado
  por semana" (⏳ → 🚧 → ✅).
- **Al empezar cada mes**: revisar que el objetivo y el criterio de
  éxito sigan vigentes.
- **Al detectar un desvío**: agregar una nota al pie del mes
  correspondiente explicando qué cambió y por qué.
- **Cada actualización**: cambiar la fecha del encabezado y commitear
  con `Update: roadmap 3 meses — <cambio>`.

---

**Fin del roadmap de 3 meses.**