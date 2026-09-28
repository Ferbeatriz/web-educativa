# 🔄 PROMPT DE TRASPASO — web-educativa

> Copia este archivo al inicio de un chat nuevo para que la IA
> tenga todo el contexto necesario para continuar el proyecto.

---

## 👋 Saludo inicial sugerido

"Hola, vengo del proyecto web-educativa. Acabo de actualizar toda la documentación en este repositorio:

- `ESTADO_PROYECTO.md` → Estado general + pendientes
- `GUIA_IA.md` → Manual técnico completo
- `PROMPT_TRASPASO.md` → Este archivo
- `TUTOR_PLAN.md` → Plan del tutor interactivo (próxima fase)
- `NOTIFICACIONES_PLAN.md` → Plan de notificaciones por email

Por favor, lee esos archivos primero y luego continuamos."

---

## 📊 Estado del proyecto (2026-09-28)

**Web pública**: https://web-educativa.pages.dev
**Panel admin**: https://web-educativa.pages.dev/admin
**Repo**: https://github.com/Ferbeatriz/web-educativa
**Stack**: Astro 7 + Tailwind v4 + Cloudflare Pages + Cloudflare Workers + D1

---

## ✅ Fases completadas

| # | Fase | Estado |
|---|------|--------|
| 1 | Infraestructura Cloudflare (D1 + Worker) | ✅ |
| 2a | Login alumnas (PBKDF2 + tokens) | ✅ |
| 2b | Página `/login` + header dinámico | ✅ |
| 2c | Perfil + validación automática | ✅ |
| 2d | Dashboard privado + búho 🦉 | ✅ |
| 3 | Progreso real (XP, niveles, anti-farmeo) | ✅ |
| 3b | Barra de lectura + botón completar | ✅ |
| 4a | Panel admin (login) | ✅ |
| 4b | Gestión de clases + alumnas | ✅ |
| 4c | Dashboard admin con estadísticas | ✅ |

**Todo funciona en producción.**

---

## ⏳ Pendientes (por prioridad)

### 🥇 1. TUTOR INTERACTIVO TIPO SYNTHESIS (próxima fase)

Transformar las lecciones de "leer → responder trivia" a un formato interactivo tipo tutor guiado por pasos.

**Ver `TUTOR_PLAN.md` para el diseño completo.**

**Prioridad**: Alta. Es lo que la autora quiere hacer a continuación.

---

### 🥈 2. Notificaciones por email

Informe mensual a apoderados, notificación de nuevo contenido a alumnas, resumen semanal para admin.

**Ver `NOTIFICACIONES_PLAN.md` para el diseño completo.**

---

### 🥉 3. Métricas detalladas del panel admin

Página `/admin/metricas` con:
- Lecciones más/menos completadas.
- Preguntas con más errores.
- Gráfico de actividad.
- Ranking de alumnas.

---

### 4. Embed de video por capítulo

Bloque colapsable con video de YouTube al final de cada capítulo de cursos especiales.

---

### 5. Pruebas con alumnas reales

Crear la clase "3° Básico D 2026" completa con 30-40 alumnas reales.

---

### 6. Crear más contenido educativo

Cursos especiales pendientes: Creadoras de Mundos (Programación), Selk'nam (5 capítulos).
Lecciones normales pendientes: Inglés, Ciencias, Lenguaje, Historia.

---

## 🎯 Estructura de datos clave

**Tablas D1**:
- `clases`, `alumnas`, `metodos_auth`, `sesiones`, `progreso`, `admin_sesiones`

**Sistema de niveles**:
| Nivel | XP | Emoji |
|-------|-----|-------|
| Aprendiz | 0-99 | 🥚 |
| Curiosa | 100-249 | 🐣 |
| Exploradora | 250-499 | 🦉 |
| Aventurera | 500-999 | 🗺️ |
| Sabia | 1000-1999 | 📚 |
| Maestra | 2000+ | 👑 |

**XP por lección**: 50 (fijo).

---

## 🔑 Datos importantes

- **Database ID**: `dfe90365-c58f-4043-a79f-87dce0a5e313`
- **Worker URL**: `https://web-educativa-api.ferbeatriz.workers.dev`
- **Cuenta Cloudflare**: `ferbeatriz@proton.me`
- **Secrets**: `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET`

**Para probar el login admin**: contraseña maestra del usuario (no compartir en chat).

---

## 🚦 Cómo continuar

**Opción A (recomendada)**: Empezar con el **tutor interactivo tipo Synthesis**.

Pasos sugeridos:
1. Leer `TUTOR_PLAN.md` completo.
2. Confirmar el enfoque por fases (empezar simple, complejidad después).
3. Empezar con **una sola lección modelo** (división 37÷5).
4. Validar el enfoque con la autora.
5. Expandir a más lecciones.

**Tiempo estimado**: 3-4 sesiones para MVP completo.

---

## 💡 Notas para la IA nueva

- **Tono**: profesor de enseñanza básica, serio pero cercano, español de Chile.
- **Publicación obligatoria**: siempre entregar comandos `git add . && git commit && git push` después de cada cambio.
- **Documentación**: leer los 5 archivos .md antes de empezar.
- **Sin lenguaje infantil**: nada de "amiguitas", "genial", etc.
- **Fases cortas**: preferir cambios incrementales, no reescrituras masivas.

---

**Fin del prompt de traspaso.**
