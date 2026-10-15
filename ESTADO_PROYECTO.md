# 📊 ESTADO DEL PROYECTO — web-educativa

> Última actualización: 2026-10-15
> Commit de referencia: `45f90c1`
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

## ✅ Estado actual (2026-10-14)

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





