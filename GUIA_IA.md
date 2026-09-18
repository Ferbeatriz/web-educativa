# 🤖 GUÍA PARA IA — Proyecto web-educativa

> Este documento explica cómo generar contenido y código para esta plataforma.
> Está pensado para que CUALQUIER IA (DeepSeek, Claude, GPT, Ollama local)
> pueda retomar el proyecto sin contexto previo.

---

## 🎯 Contexto del proyecto

Plataforma educativa web para niñas de 9-12 años con contenido sobre:
- Lenguaje
- Matemáticas
- Historia y Geografía
- Inglés
- Ciencias

Stack: Astro 7 + Tailwind v4 + Cloudflare Pages.
Contenido generado con IA y guardado como JSON estructurado.

---

## 👤 Rol de la IA

Actuar como **profesor de enseñanza básica** con 20 años de experiencia.

**Tono**:
- Serio pero cercano (no "buena onda" forzado)
- Frases cortas (máximo 20 palabras)
- Explicar lo complejo de forma simple sin perder rigor
- Español de Chile
- Cero lenguaje infantil ("amiguitas", "genial", emojis excesivos)

**Público**: niñas de 9-12 años, educación básica, transición a media.

---

## 📋 Estructura de una lección normal

Cada lección consta de **4-6 bloques temáticos** + **1 trivia**.

### Bloques temáticos (cada uno ~350-400 palabras)

1. **Introducción** — Presenta el tema, activa curiosidad
2. **Desarrollo 1** — Primer aspecto clave
3. **Desarrollo 2** — Segundo aspecto clave
4. **Desarrollo 3** — Tercer aspecto clave
5. **Legado/Aplicación** — Conexión con el presente
6. **Resumen** — Tabla + cierre

### Trivia (10 preguntas)

- 4 opciones por pregunta (siempre 4, nunca 3 ni 5)
- `respuesta_correcta` es índice 0-3
- `explicacion` de 1-2 oraciones
- Distractores plausibles (no absurdos)
- Variedad: comprensión, aplicación, reconocimiento

---

## 📝 Formato del contenido (markdown)

Dentro de los strings del JSON, el contenido usa **markdown**:

```markdown
# Título principal con emoji

## Sección con emoji

Párrafo normal.

**Negrita** para conceptos clave.

- Lista con viñetas
- Segundo elemento

1. Lista numerada
2. Segundo elemento

> **Idea fuerza**: frase destacada

| Columna 1 | Columna 2 |
|-----------|-----------|
| dato 1    | dato 2    |
```

**IMPORTANTE**:
- Los `#`, `##` sí van dentro del string JSON (se renderizan con `marked`)
- Usar `\n` para saltos de línea dentro del string
- Los emojis al inicio de títulos son bienvenidos (🎯, 📖, 💡, etc.)

---

## 📦 Estructura del JSON de lección normal

```json
{
  "id": "slug-en-kebab-case",
  "titulo": "Título con Emoji 🎯",
  "categoria": "Nombre de la materia o submódulo",
  "emoji": "🎯",
  "progreso_puntos": 150,
  "contenido_modulos": [
    "Primer bloque en markdown...",
    "Segundo bloque...",
    "Tercer bloque...",
    "Cuarto bloque...",
    "Quinto bloque...",
    "Sexto bloque con tabla y cierre..."
  ],
  "trivia": [
    {
      "pregunta": "...",
      "opciones": ["A", "B", "C", "D"],
      "respuesta_correcta": 1,
      "explicacion": "..."
    }
  ]
}
```

---

## 📁 Ubicación de los archivos

Cada lección se guarda en la carpeta correspondiente:

| Materia | Ubicación |
|---------|-----------|
| Matemáticas | `src/data/materias/matematicas/lecciones/<id>.json` |
| Ciencias | `src/data/materias/ciencias/lecciones/<id>.json` |
| Lenguaje | `src/data/materias/lenguaje/lecciones/<id>.json` |
| Inglés | `src/data/materias/ingles/lecciones/<id>.json` |
| Historia Universal | `src/data/materias/historia/submodulos/historia-universal/lecciones/<id>.json` |
| Historia Chile | `src/data/materias/historia/submodulos/historia-chile/lecciones/<id>.json` |
| Historia Precolombina | `src/data/materias/historia/submodulos/historia-precolombina/lecciones/<id>.json` |

---

## ✅ Cómo activar una lección nueva

Una vez creado el JSON, hay que **referenciarlo** en el `materia.json` o `submodulo.json` correspondiente:

### Para materias sin submódulos (Matemáticas, Ciencias, etc.)

Editar `src/data/materias/<materia>/materia.json` y agregar a `lecciones`:

```json
{
  "id": "slug-leccion",
  "titulo": "Título",
  "emoji": "🎯",
  "orden": 1,
  "nivel": "básico",
  "duracion_estimada_min": 15,
  "archivo": "lecciones/slug-leccion.json",
  "activa": true
}
```

### Para submódulos (Historia Universal, etc.)

Editar `src/data/materias/historia/submodulos/<submodulo>/submodulo.json` y agregar a `lecciones`:

```json
{
  "id": "slug-leccion",
  "titulo": "Título",
  "emoji": "🎯",
  "orden": 1,
  "nivel": "intermedio",
  "duracion_estimada_min": 20,
  "archivo": "lecciones/slug-leccion.json",
  "activa": true
}
```

**Nota**: si `"activa": false`, la lección no se muestra en la web aunque el JSON exista.

---

## 👁️ Curso Especial: El Ojo de Horus

Este es un **curso especial** dentro de Antiguo Egipto, diferente a las lecciones normales.

**Ubicación**: `src/data/materias/historia/submodulos/historia-universal/lecciones/antiguo-egipto/curso-especial/`

**Estructura de datos especial**:

- `curso.json` — info general + array de capítulos con `activo: true/false`
- `capitulo-XX.json` — contenido de cada capítulo

**Campos especiales** de un capítulo (diferentes a las lecciones normales):

- `numero` — número arábigo (1, 2, 3...)
- `numero_romano` — número romano (I, II, III...)
- `vocabulario[]` — array de `{ termino, definicion }`
- `linea_tiempo[]` — array de `{ fecha, evento }`
- `subtitulo` — subtítulo del capítulo

**Estructura del JSON de un capítulo**:

```json
{
  "id": "capitulo-XX",
  "numero": 1,
  "numero_romano": "I",
  "titulo": "Título del capítulo",
  "subtitulo": "Subtítulo",
  "emoji": "🔺",
  "progreso_puntos": 200,
  "contenido_modulos": ["bloque 1", "bloque 2", "..."],
  "vocabulario": [
    { "termino": "...", "definicion": "..." }
  ],
  "linea_tiempo": [
    { "fecha": "...", "evento": "..." }
  ],
  "trivia": [
    { "pregunta": "...", "opciones": ["A","B","C","D"], "respuesta_correcta": 1, "explicacion": "..." }
  ]
}
```

**Componentes y páginas especiales**:

- `src/components/CursoEspecial.astro` — portada con índice de capítulos
- `src/pages/curso/[curso]/index.astro` — portada del curso
- `src/pages/curso/[curso]/[capitulo].astro` — capítulo individual

**Cómo activar un capítulo nuevo**:

1. Crear el JSON del capítulo en `curso-especial/capitulo-XX.json`
2. En `curso.json`, cambiar `"activo": false` a `"activo": true` para ese capítulo
3. Reiniciar el servidor de Astro (`Ctrl+C` → `npm run dev`)

**Capítulos publicados**:

| # | Capítulo | Estado |
|---|----------|--------|
| I | La Escuela de Misterios | ✅ Publicado |
| II | La Esfinge | ✅ Publicado |
| III | La Escritura Sagrada | ✅ Publicado |
| IV | Los Templos de Giza y el Osirion | ✅ Publicado |
| V | La Flor de la Vida | ✅ Publicado |
| VI | Sakara | ✅ Publicado |
| VII | Los Templos de Egipto | ✅ Publicado |
| VIII | El Año Cósmico y el Zodíaco | ✅ Publicado |
| IX | Los Niveles de Conciencia | ✅ Publicado |
| X | Filae y el Principio Femenino | ✅ Publicado |

**CURSO COMPLETO: 10 de 10 capítulos publicados.**

**Transcripción completa del curso**: `ojohorus.txt` (en la raíz del proyecto).
Contiene las transcripciones de los 10 videos. Los cortes entre capítulos se
identifican por marcas de tiempo en silencios: `[102:00]`, `[152:50]`, etc.

---

## 🔍 Validación antes de publicar

**Siempre** validar el JSON antes de hacer commit:

```bash
cat <archivo>.json | python3 -m json.tool > /dev/null && echo "✓ VÁLIDO" || echo "✗ INVÁLIDO"
```

Si dice "INVÁLIDO", hay un error de sintaxis (coma extra, comilla mal cerrada, etc.).

---

## 🎓 Errores comunes a evitar

### En IA de modelos pequeños (llama3.2:3b)

- ❌ Confundir suma con multiplicación
- ❌ Repetir el mismo ejemplo dos veces
- ❌ Saltarse la estructura de encabezados
- ❌ Inventar datos históricos/científicos
- ❌ Mezclar idiomas

### En modelos grandes (Qwen 2.5 7B, Claude, GPT)

- ⚠️ Ser demasiado extenso (superar las 400 palabras por bloque)
- ⚠️ Usar lenguaje demasiado formal o académico
- ⚠️ Poner demasiados emojis
- ⚠️ Olvidar la sección "Idea fuerza"

### En general

- ❌ No verificar la respuesta correcta de las trivias
- ❌ Dejar emojis fuera del título
- ❌ No probar el JSON localmente antes de publicar

---

## 🔄 Flujo de trabajo recomendado

### Opción A: IA del chat genera todo (rápido)

1. Pedir a la IA (chat) que genere el JSON completo de una lección
2. Verificar contenido (búsqueda de errores)
3. Guardar en la ubicación correcta
4. Activar en `materia.json` o `submodulo.json`
5. `git add . && git commit && git push`

**Tiempo**: 15-20 minutos por lección.

### Opción B: Qwen local genera (independiente)

1. Pedir a Qwen bloque por bloque con prompts específicos
2. Validar cada bloque antes de continuar
3. Guardar en `.temporal/bloque-XX.md`
4. Al terminar, ensamblar el JSON
5. Guardar en la ubicación correcta
6. Activar y publicar

**Tiempo**: 40-60 minutos por lección (más lento, pero sin depender de internet).

---

## 🎯 Lecciones ya publicadas

| Materia | Lección | Archivo |
|---------|---------|---------|
| Matemáticas | Propiedades de la Multiplicación | `src/data/materias/matematicas/lecciones/propiedades-multiplicacion.json` |
| Historia Universal | Antigua Roma | `src/data/materias/historia/submodulos/historia-universal/lecciones/antigua-roma.json` |
| Historia Universal | Antigua Grecia | `src/data/materias/historia/submodulos/historia-universal/lecciones/antigua-grecia.json` |

---

## 🎨 Paleta de colores (referencia rápida)

- **Lenguaje**: rosa coral `#EC4899`
- **Matemáticas**: azul eléctrico `#3B82F6`
- **Historia**: ámbar dorado `#F59E0B`
- **Inglés**: turquesa `#14B8A6`
- **Ciencias**: verde lima `#84CC16`

---

---

## 💻 Curso Especial: Creadoras de Mundos Digitales

**Materia**: `programacion` (magenta `#D946EF`, emoji 💻)
**Ubicación**: `src/data/materias/programacion/cursos/creadoras-de-mundos/`
**Estructura**: igual a Ojo de Horus (curso.json + capitulo-XX.json)
**Público**: niñas de 9-12 años sin experiencia previa en programación
**Herramienta base**: Scratch (https://scratch.mit.edu)

**Campos adicionales en cada capítulo:**

- `actividades[]` — array de `{ titulo, descripcion, nivel }` con desafíos prácticos

**Estructura del JSON de un capítulo**:

```json
{
  "id": "capitulo-XX",
  "numero": 1,
  "numero_romano": "I",
  "titulo": "Título del capítulo",
  "subtitulo": "Subtítulo",
  "emoji": "🎉",
  "progreso_puntos": 200,
  "contenido_modulos": ["bloque 1", "bloque 2", "..."],
  "vocabulario": [
    { "termino": "...", "definicion": "..." }
  ],
  "actividades": [
    { "titulo": "...", "descripcion": "...", "nivel": "fácil" }
  ],
  "trivia": [
    { "pregunta": "...", "opciones": ["A","B","C","D"], "respuesta_correcta": 1, "explicacion": "..." }
  ]
}




Notas sobre el contenido:

Tono motivador y alentador (no solemne como Ojo de Horus)

Cero tecnicismos innecesarios

Ejemplos cotidianos para explicar conceptos

Cada capítulo incluye al menos 2-3 actividades prácticas

Enfatizar que el error es parte del aprendizaje (cultura maker)

Capítulos planificados:

#	Capítulo	Estado
I	¡Bienvenida, Programadora!	⏳ Pendiente
II	El Baile del Gato Naranja	⏳ Pendiente
III	Cazadoras de Errores	⏳ Pendiente
IV	Repite conmigo: ¡Bucles!	⏳ Pendiente
V	Toma de Decisiones	⏳ Pendiente
VI	Mi Primer Mini-Juego	⏳ Pendiente
VII	Historias Interactivas	⏳ Pendiente
VIII	IA: ¿Cómo Aprende una Computadora?	⏳ Pendiente
IX	Creadoras de Mundos	⏳ Pendiente
X	¡Gran Presentación!	⏳ Pendiente
🎨 Refactor de cursos multi-materia
Desde el 15 de septiembre de 2026, CursoEspecial.astro y las páginas [curso]/*.astro son dinámicas por materia.

Cómo funciona:

Detectan la materia por el path del curso

Mapean la materia a un color (definido en global.css como --color-<materia>-*)

Usan códigos HEX directos dentro del componente (no variables CSS dinámicas) para evitar problemas de Tailwind v4

El color se aplica a: portada, números de capítulo, links, vocabulario, línea de tiempo

Materias soportadas actualmente:

lenguaje, matematicas, historia, ingles, ciencias, programacion

Para agregar una nueva materia:

Agregar a src/data/materias.json

Agregar sus variables CSS en global.css (--color-<materia>-50..700)

Agregar el color HEX en el objeto colores de CursoEspecial.astro y [capitulo].astro

Agregar la materia a la lista materiasConocidas en [curso]/index.astro y [capitulo].astro


## Curso: El mundo espiritual de los Selk'nam
- Ubicación: src/data/materias/historia/submodulos/historia-chile/curso-especial/
- Materia: Historia de Chile
- Color propio: rojo tierra (#DC2626)
- 5 de 10 capítulos publicados (I a V)
- Fuente: Secciones 1-4 del Tomo I narradas por NotebookLM
- Material narrado pendiente: Secciones del Tomo II (Klóketen)





## 📞 Contacto del proyecto

**Autora**: Ferbeatriz
**GitHub**: https://github.com/Ferbeatriz/web-educativa
**Web**: https://web-educativa.pages.dev

---

**Fin de la guía.**
