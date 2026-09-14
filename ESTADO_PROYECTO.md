# 📊 ESTADO DEL PROYECTO — web-educativa

> Última actualización: 2026-09-13
> Proyecto: Plataforma educativa interactiva para niñas de 9-12 años

---

## 🎯 Visión del proyecto

Plataforma web educativa modular con las siguientes características:

- **Público objetivo**: niñas de 9-12 años (preadolescentes)
- **Estética**: inspirada en Base44 (limpia, moderna, con panel modular)
- **Materias**: Lenguaje, Matemáticas, Historia y Geografía, Inglés, Ciencias
- **Contenido**: generado con IA local (Ollama + Qwen 2.5 7B)
- **Interactividad**: trivias de selección múltiple con feedback visual
- **Proyecto especial**: Curso "El Ojo de Horus" (en diseño)

---

## 🏗️ Stack técnico

| Componente | Tecnología | Versión |
|------------|------------|---------|
| Sistema Operativo | Linux Mint XFCE | - |
| Hardware | MSI CX61 2QF (i5, 16 GB RAM, sin GPU dedicada) | - |
| Runtime | Node.js | 22.x LTS |
| Package Manager | npm | 10.x |
| Framework | Astro | 7.3.2 |
| CSS | Tailwind CSS | 4.3.3 |
| IA Local | Ollama + Qwen 2.5 7B + llama3.2:3b | - |
| Editor | VS Code + Continue | 1.137.0 |
| Control de versiones | Git + GitHub | - |
| Hosting | Cloudflare Pages | - |

---

## 🔗 URLs importantes

| Recurso | URL |
|---------|-----|
| Web pública | https://web-educativa.pages.dev |
| Repositorio GitHub | https://github.com/Ferbeatriz/web-educativa |
| Panel Cloudflare | https://dash.cloudflare.com/ → Workers & Pages → web-educativa |
| Servidor local | http://localhost:4321 |
| Config Continue | `~/.continue/config.yaml` |

---

## 📁 Estructura del proyecto
web-educativa/
├── PROMPT_PROFESOR.md ← Personalidad de la IA
├── ESTADO_PROYECTO.md ← Este archivo
├── GUIA_IA.md ← Manual técnico para IAs
├── PROMPT_TRASPASO.md ← Prompt para chat nuevo
├── astro.config.mjs
├── package.json
├── package-lock.json
├── tsconfig.json
├── .gitignore
├── public/
│ ├── favicon.ico
│ └── favicon.svg
└── src/
├── styles/
│ └── global.css ← Paleta + estilos markdown
├── layouts/
│ └── Layout.astro ← Layout base
├── components/
│ ├── MateriaCard.astro ← Tarjeta de materia
│ └── TriviaQuiz.astro ← Trivia interactiva
├── pages/
│ ├── index.astro ← Dashboard 5 materias
│ ├── materia/[id].astro ← Vista de materia
│ ├── submodulo/[...slug].astro ← Vista de submódulo
│ └── leccion/[...slug].astro ← Vista de lección
└── data/
├── materias.json ← Índice general
└── materias/
├── lenguaje/
│ └── materia.json (vacío)
├── matematicas/
│ ├── materia.json ✅
│ └── lecciones/
│ └── propiedades-multiplicacion.json ✅
├── historia/
│ ├── materia.json ✅
│ └── submodulos/
│ ├── historia-universal/
│ │ ├── submodulo.json ✅
│ │ └── lecciones/
│ │ ├── antigua-roma.json ✅
│ │ ├── antigua-grecia.json ✅
│ │ └── antiguo-egipto/
│ │ ├── submodulo.json ✅
│ │ ├── lecciones/ (vacío)
│ │ └── curso-especial/ (vacío - Ojo de Horus)
│ ├── historia-chile/
│ │ └── submodulo.json (vacío)
│ └── historia-precolombina/
│ └── submodulo.json (vacío)
├── ingles/
│ └── materia.json (vacío)
└── ciencias/
└── materia.json (vacío)


---
## ✅ Estado actual

### Completado

| Elemento | Estado |
|----------|--------|
| Setup Astro + Tailwind v4 | ✅ |
| Paleta personalizada (5 materias) | ✅ |
| Dashboard con 5 materias | ✅ |
| Navegación jerárquica | ✅ |
| Renderizado de Markdown en lecciones | ✅ |
| Trivia interactiva (verde/coral) | ✅ |
| Deploy automático (git push → Cloudflare) | ✅ |
| Continue + Ollama configurado (Qwen 2.5 7B) | ✅ |
| Lección Matemáticas: Propiedades Multiplicación | ✅ Publicada |
| Lección Historia: Antigua Roma | ✅ Publicada |
| Lección Historia: Antigua Grecia | ✅ Publicada |
| **Curso Ojo de Horus: Portada + índice de 10 capítulos** | ✅ Publicada |
| **Ojo de Horus - Capítulo I: La Escuela de Misterios** | ✅ Publicado |
| **Ojo de Horus - Capítulo II: La Esfinge** | ✅ Publicado |
| **Ojo de Horus - Capítulo III: La Escritura Sagrada** | ✅ Publicado |
| Sistema de cursos especiales (componente + páginas) | ✅ |
| Documentación del proyecto (3 archivos .md) | ✅ |

### Pendiente (en orden de prioridad)

| Tarea | Prioridad |
|-------|-----------|
| Ojo de Horus - Capítulo IV: Templos de Giza y Osirion | Alta |
| Ojo de Horus - Capítulo V: La Flor de la Vida | Alta |
| Ojo de Horus - Capítulo VI: Sakara | Alta |
| Ojo de Horus - Capítulos VII, VIII, IX, X | Alta |
| Lección introductoria de Antiguo Egipto (para el submódulo) | Media |
| Historia de Chile (contenido) | Media |
| Historia Precolombina (contenido) | Media |
| Ciencias (contenido) | Media |
| Lenguaje (contenido) | Baja |
| Inglés (contenido) | Baja |
| Embed de video por capítulo (colapsable) | Baja |
| Sistema de progreso persistente (XP) | Baja |

### 🎬 Nueva funcionalidad pendiente: Embed de video

**Idea aprobada**: agregar al final de cada capítulo un bloque colapsable con el video original de YouTube del capítulo correspondiente.

**Diseño**:
- Bloque `<details>` colapsable, discreto
- Se expande para mostrar iframe 16:9 de YouTube
- No interfiere con la lectura prioritaria

**Implementación pendiente**:
1. Agregar campo `video_url` y `video_duracion` a cada `capitulo-XX.json`
2. Crear componente `VideoEmbed.astro`
3. Insertar al final de `[capitulo].astro` (después de la trivia)

**Referencia URL YouTube** (primer video de la serie):
`https://www.youtube.com/watch?v=Q6D3gXq28hw`
---

## 🎨 Paleta de colores

| Materia | Color | Hex |
|---------|-------|-----|
| Lenguaje | Rosa coral | `#EC4899` |
| Matemáticas | Azul eléctrico | `#3B82F6` |
| Historia y Geografía | Ámbar dorado | `#F59E0B` |
| Inglés | Turquesa | `#14B8A6` |
| Ciencias | Verde lima | `#84CC16` |
| Marca principal | Morado eléctrico | `#8B5CF6` |
| Aciertos | Verde menta | `#10B981` |
| Errores | Coral | `#F97316` |
| Fondo | Gris claro | `#F8F9FA` |

---

## 📚 Convenciones de contenido

### Estructura de cada lección JSON

- **id**: slug único en kebab-case
- **titulo**: título con emoji
- **categoria**: nombre de la materia o submódulo
- **emoji**: emoji representativo
- **progreso_puntos**: entero (100-200 XP)
- **contenido_modulos**: array de strings (bloques markdown)
- **trivia**: array de objetos con pregunta, opciones, respuesta_correcta, explicacion

### Formato del markdown (dentro de los strings)

- `#` título principal
- `##` secciones
- `###` subsecciones
- `**negrita**` para conceptos clave
- `> **Idea fuerza**:` para ideas destacadas
- Tablas con `|` cuando aplique

### Estilo del profesor (ver `PROMPT_PROFESOR.md`)

- Tono serio pero cercano, no infantil
- Frases cortas (máximo 20 palabras por oración)
- Ejemplos cotidianos
- Español de Chile
- Sin "amiga", "lista", "amiguitas"

---

## 🔄 Flujo de trabajo actual

### Generación de contenido

1. Elegir tema y dividir en 4-6 bloques temáticos
2. Cada bloque: pedir a Qwen (o a IA del chat) que genere ~350 palabras en markdown
3. Validar contenido (buscar errores factuales, matemáticos, conceptuales)
4. Guardar bloques en `.temporal/bloque-XX.md`
5. Generar trivia (10 preguntas) en JSON
6. Ensamblar todo en un único JSON final
7. Guardar en `src/data/materias/.../lecciones/<id>.json`
8. Activar en `submodulo.json` o `materia.json` (`"activa": true`)

### Publicación

```bash
cd ~/Escritorio/EstudioFernanda/web-educativa
git add .
git commit -m "Nueva leccion: <titulo>"
git push
