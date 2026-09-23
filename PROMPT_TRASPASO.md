# 🔄 PROMPT DE TRASPASO — web-educativa

## Estado actual (2026-09-23)

**Web pública**: https://web-educativa.pages.dev
**Repo**: https://github.com/Ferbeatriz/web-educativa
**Stack**: Astro 7 + Tailwind v4 + Cloudflare Pages

## Materias activas (6)

- Lenguaje (rosa #EC4899) → **Club de Lectura** con La historia de Manú (87 preguntas)
- Matemáticas (azul #3B82F6) → 2 lecciones: Propiedades Multiplicación + Introducción División
- Historia (ámbar #F59E0B) → 2 cursos especiales completos:
  - Ojo de Horus (10 caps) en Historia Universal → Antiguo Egipto
  - Selk'nam (15 caps) en Historia de Chile
- Inglés (turquesa #14B8A6) → sin contenido
- Ciencias (verde #84CC16) → sin contenido
- Programación (magenta #D946EF) → Creadoras de Mundos (estructura)

## Módulos especiales

### Club de Lectura
- **Ubicación**: `src/data/materias/lenguaje/lecturas/`
- **Sistema**: rotación aleatoria de preguntas con localStorage
- **Componentes**: `src/components/comprension/`
- **Páginas**: `src/pages/lenguaje/`
- **Banco actual**: 50 + 25 + 12 = 87 preguntas (La historia de Manú)
- **Algoritmo**: `src/scripts/seleccion-preguntas.js`
- **Distribución**: 30% media / 40% difícil / 30% muy difícil
- **Persistencia**: localStorage por navegador

## Tareas pendientes (por prioridad)

1. **Sistema de login y métricas** (foco del próximo chat)
   - Cloudflare Workers + D1 + Access
   - Login con email/código
   - Panel admin
   - Notificaciones por email
   - Métricas de uso
2. Agregar más libros al Club de Lectura
3. Curso Creadoras de Mundos Digitales (Programación)
4. Lecciones normales de Ciencias, Inglés, Lenguaje
5. Embed de video por capítulo (Ojo de Horus / Selk'nam)

## Cómo generar contenido

### Lección normal
- 4-6 bloques de ~350 palabras markdown
- 10 preguntas de trivia (4 opciones cada una)
- Guardar en `src/data/materias/<materia>/lecciones/<id>.json`
- Activar en `<materia>/materia.json` con `"activa": true`

### Capítulo de curso especial
- 4-6 bloques markdown
- 10 preguntas de trivia
- `vocabulario[]` y `linea_tiempo[]` o `momentos_del_relato[]`
- Guardar en `curso-especial/capitulo-XX.json`
- Activar en `curso.json` con `"activo": true`

### Libro del Club de Lectura
- `meta.json` (info del libro + configuración)
- `banco-comprension.json` (mínimo 30 preguntas)
- `banco-desarrollo.json` (mínimo 15 preguntas)
- `banco-relectura.json` (mínimo 8 desafíos)
- Guardar en `src/data/materias/lenguaje/lecturas/<id>/`
- Agregar al `indice.json`
- Agregar import en `src/pages/lenguaje/comprension/[libro].astro`

## Tono de contenido

- Rol: profesor de enseñanza básica
- Tono serio pero cercano
- Frases cortas (máx 20 palabras)
- Español de Chile
- Cero lenguaje infantil
- Adaptar contenido sensible a niñas de 9-12 años

## Documentación completa

Los archivos `ESTADO_PROYECTO.md` y `GUIA_IA.md` tienen la documentación completa. Actualizar tras cada cambio significativo.

---

**Próximo chat**: Sistema de login + métricas + emails (Cloudflare Workers + D1 + Access).
