# 🤖 GUÍA PARA IA — Proyecto web-educativa

> Este documento explica cómo generar contenido y código para esta plataforma.
> Está pensado para que CUALQUIER IA (DeepSeek, Claude, GPT, Ollama local)
> pueda retomar el proyecto sin contexto previo.

---

## 🎯 Contexto del proyecto

Plataforma educativa web para niñas de 9-12 años con contenido de:
- Lenguaje
- Matemáticas
- Historia y Geografía
- Inglés
- Ciencias
- Programación

**Stack actual**: Astro 7 + Tailwind v4 + Cloudflare Pages (frontend) + Cloudflare Workers + D1 (backend).
Contenido generado con IA, guardado como JSON estructurado.

**Estado actual**: ver `ESTADO_PROYECTO.md`.

---


## 📚 Alineación curricular (LECTURA OBLIGATORIA)

Antes de generar cualquier contenido o diseñar cualquier componente,
lee `ALINEACION_MINEDUC.md`. Toda la plataforma está alineada con los
OA y OAT del MINEDUC para la Educación Básica.





## 👤 Rol de la IA

Actuar como **profesor de enseñanza básica** con 20 años de experiencia.

**Tono**:
- Serio pero cercano (no "buena onda" forzado).
- Frases cortas (máximo 20 palabras).
- Explicar lo complejo de forma simple sin perder rigor.
- Español de Chile.
- Cero lenguaje infantil ("amiguitas", "genial", emojis excesivos).

**Público**: niñas de 9-12 años, educación básica, transición a media.

---

## 📋 Estructura de una lección normal

Cada lección consta de **6-7 bloques temáticos** + **1 trivia**.

### Bloques temáticos (estilo narrativo, todas las materias)

Todas las lecciones —Ciencias, Matemáticas, Historia, Inglés, Lenguaje, Programación— usan **narración continua**. No se enumeran datos sueltos: se explica con historias, analogías y ejemplos.

**Estructura sugerida**:

1. **Introducción** — Presenta el tema, activa curiosidad con pregunta retórica.
2. **Desarrollo 1** — Primer aspecto clave.
3. **Desarrollo 2** — Segundo aspecto clave.
4. **Desarrollo 3** — Tercer aspecto clave.
5. **Aplicación** — Conexión con la vida cotidiana.
6. **Resumen** — Tabla o lista al final del bloque (nunca como contenido principal).
7. **Cierre** — Frase de idea fuerza + puente a la próxima lección.

**Reglas de escritura**:

- **Narrar, no enumerar.** Cada concepto se explica con una historia, una analogía o un ejemplo.
- **Preguntas retóricas** para invitar a pensar ("¿Te has preguntado por qué...?").
- **Ejemplos cotidianos chilenos** ("como cuando riegas el jardín de tu abuela...").
- **Tablas y listas solo como resumen** al final del bloque, nunca como contenido principal.
- **Extensión**: hasta **3.000 palabras** por lección (techo, no objetivo).
- **Sin lenguaje infantil** ("amiguitas", "genial"). Español de Chile.
- **Idea fuerza** al final de cada bloque (frase destacada en blockquote).
- **Imágenes**: máximo 60% del ancho en desktop, 100% en móvil (CSS ya configurado).

**Referencia de estilo**: ver `src/data/materias/lenguaje/lecciones/los-textos-narrativos.json`.

### Trivia (10-15 preguntas en el banco)

- 4 opciones por pregunta (siempre 4, nunca 3 ni 5).
- `respuesta_correcta` es índice 0-3.
- `explicacion` de 1-2 oraciones.
- Distractores plausibles (no absurdos).
- Variedad: comprensión, aplicación, reconocimiento.
- Distribución de dificultad: 30% media / 40% difícil / 30% muy difícil.
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

IMPORTANTE:

Los #, ## sí van dentro del string JSON (se renderizan con marked)

Usar \n para saltos de línea dentro del string

Los emojis al inicio de títulos son bienvenidos (🎯, 📖, 💡, etc.)

{
  "id": "slug-en-kebab-case",
  "titulo": "Título con Emoji 🎯",
  "categoria": "Nombre de la materia o submódulo",
  "emoji": "🎯",
  "progreso_puntos": 50,
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
| Programación | `src/data/materias/programacion/cursos/<curso>/capitulo-XX.json` |

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

Para submódulos (Historia Universal, etc.)
Editar src/data/materias/historia/submodulos/<submodulo>/submodulo.json y agregar a lecciones:

json
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
Nota: si "activa": false, la lección no se muestra en la web aunque el JSON exista.

👁️ Cursos Especiales (Ojo de Horus, Selk'nam, Creadoras de Mundos)
Los cursos especiales tienen estructura diferente a las lecciones normales.

Ubicación típica: src/data/materias/<materia>/submodulos/<submodulo>/lecciones/<tema>/curso-especial/

Estructura de datos:

curso.json — info general + array de capítulos con activo: true/false

capitulo-XX.json — contenido de cada capítulo

Campos especiales de un capítulo:

numero — número arábigo (1, 2, 3...)

numero_romano — número romano (I, II, III...)

vocabulario[] — array de { termino, definicion }

linea_tiempo[] — array de { fecha, evento }

subtitulo — subtítulo del capítulo

actividades[] — (solo Creadoras de Mundos) array de { titulo, descripcion, nivel }

Cómo activar un capítulo nuevo:

Crear el JSON del capítulo en curso-especial/capitulo-XX.json

En curso.json, cambiar "activo": false a "activo": true para ese capítulo

Reiniciar el servidor de Astro (Ctrl+C → npm run dev)

🔍 Validación antes de publicar
Siempre validar el JSON antes de hacer commit:

bash
cat <archivo>.json | python3 -m json.tool > /dev/null && echo "✓ VÁLIDO" || echo "✗ INVÁLIDO"
Si dice "INVÁLIDO", hay un error de sintaxis (coma extra, comilla mal cerrada, etc.).

---

## 🖥️ Panel de Administración

**URL en producción**: `https://web-educativa.pages.dev/admin`
**URL en local**: `http://localhost:4321/admin`

### Autenticación

- **Método**: token en `localStorage` (mismo patrón que las alumnas).
- **Login**: `POST /api/admin/login` con body `{ password }`.
- **Verificación**: `GET /api/admin/me` con header `Authorization: Bearer <token>`.
- **Logout**: `POST /api/admin/logout`.

### Secrets de Cloudflare

- `ADMIN_PASSWORD_HASH`: hash PBKDF2 de la contraseña maestra.
- `ADMIN_SESSION_SECRET`: string aleatorio (reservado).

### Generar hash de contraseña admin

Pasos:
1. `cd workers/api`
2. `node scripts-hash-admin.js`
3. Ingresar contraseña, copiar el hash
4. `cd ../..`
5. `npx wrangler secret put ADMIN_PASSWORD_HASH`
6. Pegar el hash
7. `npx wrangler deploy`

### Páginas del panel

| Página | Función |
|--------|---------|
| `/admin/login` | Login con contraseña maestra |
| `/admin` | Dashboard con estadísticas |
| `/admin/clases` | Gestión de clases (crear, activar/desactivar) |
| `/admin/alumnas` | Gestión de alumnas (crear, resetear password, ver progreso) |

### Crear alumnas desde el panel

1. Ir a `/admin/alumnas`
2. Clic en "+ Nueva alumna"
3. Rellenar: nombre, usuario, clase
4. Clic en "Crear alumna"
5. Se genera contraseña automáticamente (formato `animal-color-numero`, ej: `gato-azul-42`)
6. El modal muestra la contraseña UNA SOLA VEZ → copiarla y dársela a la alumna

---

## 🔌 Endpoints del Worker API

**Base URL**: `https://web-educativa-api.ferbeatriz.workers.dev`

### Health & Info

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Health check (Worker + BD) |
| GET | `/api` | Info general + lista de endpoints |

### Autenticación de alumnas

| Método | Ruta | Body/Header | Descripción |
|--------|------|-------------|-------------|
| POST | `/api/auth/login` | `{ usuario, password }` | Login |
| POST | `/api/auth/logout` | `Bearer <token>` | Logout |
| GET | `/api/auth/me` | `Bearer <token>` | Info de la alumna |
| GET | `/api/auth/perfil` | `Bearer <token>` | Perfil completo (con clase) |

### Progreso

| Método | Ruta | Body/Header | Descripción |
|--------|------|-------------|-------------|
| POST | `/api/progreso/completar` | `{ leccion_id, materia_id }` | Marcar lección como completada |
| GET | `/api/progreso/resumen` | `Bearer <token>` | Resumen (XP, nivel) |
| GET | `/api/progreso/completo` | `Bearer <token>` | Todas las lecciones completadas |
| GET | `/api/progreso/leccion/:id` | `Bearer <token>` | ¿Completó esta lección? |

### Panel admin

| Método | Ruta | Body/Header | Descripción |
|--------|------|-------------|-------------|
| POST | `/api/admin/login` | `{ password }` | Login admin |
| POST | `/api/admin/logout` | `Bearer <token>` | Logout admin |
| GET | `/api/admin/me` | `Bearer <token>` | Verificar sesión |
| GET | `/api/admin/estadisticas` | `Bearer <token>` | Stats para dashboard |
| GET | `/api/admin/clases` | `Bearer <token>` | Listar clases |
| POST | `/api/admin/clases` | `{ nombre, codigo }` | Crear clase |
| PATCH | `/api/admin/clases/:id` | `{ activa: boolean }` | Activar/desactivar clase |
| GET | `/api/admin/alumnas` | `Bearer <token>` | Listar alumnas (con progreso) |
| POST | `/api/admin/alumnas` | `{ nombre, usuario, clase_id }` | Crear alumna |
| PATCH | `/api/admin/alumnas/:id` | `{ activa: boolean }` | Activar/desactivar alumna |
| POST | `/api/admin/alumnas/:id/resetear-password` | `Bearer <token>` | Resetear contraseña |
| GET | `/api/admin/alumnas/:id/progreso` | `Bearer <token>` | Progreso detallado |

---

## 🗄️ Base de datos D1

**Database**: `web-educativa-db`
**ID**: `dfe90365-c58f-4043-a79f-87dce0a5e313`

### Tablas

| Tabla | Campos principales |
|-------|-------------------|
| `clases` | id, nombre, codigo (único), activa, creada_en |
| `alumnas` | id, nombre, usuario (único), clase_id, activa, ultimo_login, creada_en |
| `metodos_auth` | id, alumna_id, tipo (`password`), credencial_hash (PBKDF2), activo |
| `sesiones` | id, alumna_id, token_hash, expira_en, creada_en |
| `progreso` | id, alumna_id, leccion_id, materia_id, xp_ganados, completada_en |
| `admin_sesiones` | id, token_hash (único), expira_en, creada_en |

**Constraints importantes**:
- `alumnas.usuario` es único.
- `clases.codigo` es único.
- `progreso` tiene `UNIQUE(alumna_id, leccion_id)` → evita duplicados.

---

## 🎯 Sistema de niveles

| Nivel | Nombre | XP mínimo | Emoji |
|-------|--------|-----------|-------|
| 1 | Aprendiz | 0 | 🥚 |
| 2 | Curiosa | 100 | 🐣 |
| 3 | Exploradora | 250 | 🦉 |
| 4 | Aventurera | 500 | 🗺️ |
| 5 | Sabia | 1000 | 📚 |
| 6 | Maestra | 2000 | 👑 |

**Cálculo**: se hace con la función `calcularNivel(xp)` que está en `workers/api/src/routes/progreso.ts`.

**XP por lección**: 50 (fijo). Repetir lección NO da XP.

---

## 🔄 Flujo de trabajo recomendado

### Crear contenido (lecciones)

1. Elegir tema y dividir en 4-6 bloques temáticos
2. Generar contenido (~350 palabras por bloque)
3. Validar contenido (errores factuales, matemáticos, conceptuales)
4. Generar trivia (10 preguntas)
5. Ensamblar JSON
6. Guardar en la ubicación correcta
7. Activar en `materia.json` o `submodulo.json`
8. Validar el JSON con `python3 -m json.tool`
9. Commit + push

### Modificar el Worker (backend)

1. Editar archivos en `workers/api/src/`
2. Verificar TypeScript: `cd workers/api && npx tsc --noEmit`
3. Deploy: `cd ../.. && npx wrangler deploy`
4. Probar con curl

### Modificar el frontend

1. Editar archivos en `src/`
2. Compilar: `npm run build`
3. Commit + push (Cloudflare Pages hace el deploy automático)
4. Esperar 1-2 minutos y probar en producción

### Publicación (OBLIGATORIO después de cada cambio)

```bash
cd ~/Escritorio/EstudioFernanda/web-educativa
git add .
git commit -m "Descripción breve"
git push
Formatos de mensaje de commit:

Nueva lección: "Nueva lección: <título> (<materia>)"

Nuevo capítulo: "Nuevo capítulo: <título> (<curso>)"

Actualización: "Update: <descripción>"

Fix: "Fix: <descripción>"

Fase: "Fase X: <descripción>"

🎓 Errores comunes a evitar
En IA de modelos pequeños (llama3.2:3b)
❌ Confundir suma con multiplicación

❌ Repetir el mismo ejemplo dos veces

❌ Saltarse la estructura de encabezados

❌ Inventar datos históricos/científicos

❌ Mezclar idiomas

En modelos grandes (Qwen 2.5 7B, Claude, GPT)
⚠️ Ser demasiado extenso (superar las 400 palabras por bloque)

⚠️ Usar lenguaje demasiado formal o académico

⚠️ Poner demasiados emojis

⚠️ Olvidar la sección "Idea fuerza"

En general
❌ No verificar la respuesta correcta de las trivias

❌ Dejar emojis fuera del título

❌ No probar el JSON localmente antes de publicar

🎨 Paleta de colores (referencia rápida)
Lenguaje: rosa coral #EC4899

Matemáticas: azul eléctrico #3B82F6

Historia: ámbar dorado #F59E0B

Inglés: turquesa #14B8A6

Ciencias: verde lima #84CC16

Programación: magenta #D946EF

📌 Documentación relacionada
Archivo	Contenido
ESTADO_PROYECTO.md	Estado general + pendientes
PROMPT_TRASPASO.md	Prompt para chat nuevo
NOTIFICACIONES_PLAN.md	Plan de notificaciones por email
TUTOR_PLAN.md	Plan del tutor interactivo tipo Synthesis
PROMPT_PROFESOR.md	Personalidad de la IA
Fin de la guía.
