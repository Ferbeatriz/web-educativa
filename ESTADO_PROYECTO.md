# 📊 ESTADO DEL PROYECTO — web-educativa

> Última actualización: 2026-09-28
> Proyecto: Plataforma educativa interactiva para niñas de 9-12 años

---

## 🎯 Visión del proyecto

Plataforma web educativa modular con las siguientes características:

- **Público objetivo**: niñas de 9-12 años (preadolescentes)
- **Estética**: inspirada en Base44 (limpia, moderna, con panel modular)
- **Materias**: Lenguaje, Matemáticas, Historia, Inglés, Ciencias, Programación
- **Contenido**: generado con IA local (Ollama + Qwen 2.5 7B)
- **Interactividad**: trivias + progreso real + sistema de niveles
- **Proyectos especiales**: Curso Ojo de Horus, Creadoras de Mundos Digitales, Selk'nam

---

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

### Secrets del Worker (Cloudflare)

- `ADMIN_PASSWORD_HASH`: hash PBKDF2 de la contraseña maestra
- `ADMIN_SESSION_SECRET`: string aleatorio (reservado para firmas futuras)

---

## 📁 Estructura del proyecto
web-educativa/
├── ESTADO_PROYECTO.md ← Este archivo
├── GUIA_IA.md ← Manual técnico para IAs
├── PROMPT_TRASPASO.md ← Prompt para chat nuevo
├── NOTIFICACIONES_PLAN.md ← Plan de notificaciones (pendiente)
├── TUTOR_PLAN.md ← Plan del tutor interactivo (pendiente)
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
│ └── src/
│ ├── index.ts ← Router principal
│ ├── lib/
│ │ ├── crypto.ts ← PBKDF2 + tokens
│ │ ├── db.ts ← Helpers de BD
│ │ ├── admin-sesion.ts ← Sesiones admin
│ │ └── passwords.ts ← Generador de contraseñas
│ └── routes/
│ ├── auth.ts
│ ├── progreso.ts
│ ├── admin.ts
│ ├── admin-clases.ts
│ ├── admin-alumnas.ts
│ └── admin-estadisticas.ts
└── src/ ← Frontend
├── layouts/Layout.astro
├── components/
│ ├── Header.astro
│ ├── Footer.astro
│ ├── MateriaCard.astro
│ ├── TriviaQuiz.astro
│ ├── BarraProgresoLectura.astro
│ └── BotonCompletar.astro
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
│ ├── leccion/[...slug].astro
│ └── admin/
│ ├── login.astro
│ ├── index.astro
│ ├── clases.astro
│ └── alumnas.astro
└── data/
└── materias/ ← Contenido JSON


---

## ✅ Estado actual (2026-09-28)

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

## ⏳ PENDIENTES (en orden de prioridad)

### 🅲️ TUTOR INTERACTIVO TIPO SYNTHESIS (próxima fase)

**Objetivo**: transformar las lecciones de "leer → responder trivia" a un formato interactivo tipo tutor guiado por pasos.

**Características**:
- Presentación del problema con contexto visual.
- Guía paso a paso con feedback inmediato.
- Manejo de errores comunes con explicaciones específicas.
- Interacción por botones/clic (drag & drop en fase posterior).
- **NO usa voz** (solo touch/clic).
- Aplicable a TODAS las materias.

**Ver `TUTOR_PLAN.md` para el diseño completo.**

**Tiempo estimado**: 3-4 sesiones para MVP.

---

### 🅰️ SISTEMA DE NOTIFICACIONES POR EMAIL

**Objetivo**: notificaciones automáticas a apoderados, alumnas y admin.

**Características**:
- Informe mensual a apoderados (progreso de su hija).
- Notificación a alumnas de nuevo contenido.
- Resumen semanal para admin.
- Formulario de apoderados (nombre + email + consentimiento).
- Cumplimiento Ley 19.628 de Chile.

**Ver `NOTIFICACIONES_PLAN.md` para el diseño completo.**

**Tiempo estimado**: 1-2 sesiones.

---

### 🅱️ MÉTRICAS DETALLADAS

**Objetivo**: ampliar el panel admin con análisis profundo.

**Características**:
- Página `/admin/metricas`.
- Lecciones más/menos completadas.
- Preguntas de trivia con más errores.
- Gráfico de actividad por día.
- Ranking de alumnas por XP.

**Tiempo estimado**: 1 sesión.

---

### 🅳️ EMBED DE VIDEO POR CAPÍTULO

**Objetivo**: agregar video de YouTube a cada capítulo de cursos especiales.

**Características**:
- Bloque `<details>` colapsable al final de cada capítulo.
- iframe 16:9 de YouTube.
- Campos `video_url` y `video_duracion` en los JSON.

**Tiempo estimado**: 30 minutos.

---

### 🅴️ PRUEBAS CON ALUMNAS REALES

**Objetivo**: usar la plataforma con el curso real.

**Pasos**:
- Crear la clase "3° Básico D 2026" completa.
- Generar credenciales.
- Preparar documentos para imprimir.
- Probar el flujo end-to-end.

**Tiempo estimado**: 30 minutos.

---

### 🅵️ CREAR MÁS CONTENIDO EDUCATIVO

**Cursos especiales pendientes**:
- Creadoras de Mundos Digitales — 10 capítulos (Programación).
- Selk'nam — 5 capítulos pendientes.

**Lecciones normales pendientes**:
- Inglés (Unit 1 "Family Matters" + otras).
- Ciencias, Lenguaje, Historia.

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
  "trivia": [
    {
      "pregunta": "...",
      "opciones": ["A", "B", "C", "D"],
      "respuesta_correcta": 1,
      "explicacion": "..."
    }
  ]
}

Estilo del profesor (ver PROMPT_PROFESOR.md)
Tono serio pero cercano, no infantil.

Frases cortas (máximo 20 palabras).

Ejemplos cotidianos.

Español de Chile.

Sin "amiga", "lista", "amiguitas".

Flujo de trabajo (OBLIGATORIO)
Publicación después de cada cambio
bash
cd ~/Escritorio/EstudioFernanda/web-educativa
git add .
git commit -m "Descripción breve del cambio"
git push

Formatos de mensaje de commit:

Nueva lección: "Nueva lección: <título> (<materia>)"

Nuevo capítulo: "Nuevo capítulo: <título> (<curso>)"

Actualización: "Update: <descripción>"

Fix: "Fix: <descripción>"

Fase: "Fase X: <descripción>"

Notas para el próximo chat
Antes de empezar una nueva fase, consultar:

Este archivo (ESTADO_PROYECTO.md) para el estado general.

GUIA_IA.md para el manual técnico.

PROMPT_TRASPASO.md para el prompt de traspaso.

NOTIFICACIONES_PLAN.md o TUTOR_PLAN.md según corresponda.

Prioridad siguiente: implementar el tutor interactivo tipo Synthesis (ver TUTOR_PLAN.md).

Fin del estado del proyecto.
