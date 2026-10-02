# 📚 PROTOCOLO — Agregar una nueva comprensión de lectura

> Este documento define el flujo exacto para agregar un nuevo libro
> al Club de Lectura de Lenguaje.
>
> Léelo antes de pedir una nueva comprensión de lectura.

---

## 🎯 Cómo funciona

Cuando quieras agregar un nuevo libro al Club de Lectura, sigue este protocolo. La IA te pedirá exactamente estos archivos, ni más ni menos.

---

## 📎 Archivos que debes subir

### Obligatorios (4)

| # | Archivo | Ruta en el proyecto | Por qué |
|---|---------|---------------------|---------|
| 1 | **`indice.json`** | `src/data/materias/lenguaje/lecturas/indice.json` | Para saber qué libros ya están y cómo se registran |
| 2 | **`[libro].astro`** | `src/pages/lenguaje/comprension/[libro].astro` | Para replicar el patrón de integración |
| 3 | **Un libro de referencia** (carpeta completa con 4 JSON) | `src/data/materias/lenguaje/lecturas/la-historia-de-manu/` (o cualquier otro) | Para copiar la estructura exacta de meta + 3 bancos |
| 4 | **El texto del nuevo libro** (PDF) | — | Para generar las preguntas |

### Opcionales

| # | Archivo | Cuándo subirlo |
|---|---------|----------------|
| 5 | `seleccion-preguntas.js` | Solo si la IA necesita revisar o modificar la lógica de rotación |
| 6 | `CuestionarioAleatorio.astro` | Solo si la IA necesita modificar el componente |

**Regla**: si es la primera vez que agregas un libro en este chat, sube los 4 obligatorios. Si ya subiste el libro de referencia antes, no hace falta volver a subirlo (a menos que la estructura haya cambiado).

---

## 🎬 Cómo pedirlo

### Tú dices (en chat nuevo)

> "Quiero agregar una nueva comprensión de lectura. El libro es [título] de [autor]. Te adjunto los archivos."

Y adjuntas los 4 obligatorios.

### La IA debe responder

> "Perfecto. Recibí:
> 1. `indice.json` ✅
> 2. `[libro].astro` ✅
> 3. Libro de referencia (Manu) ✅
> 4. El texto del nuevo libro (PDF) ✅
>
> Voy a generar:
> - `meta.json` — datos del libro
> - `banco-comprension.json` — 30 preguntas de opción múltiple (10 por sesión)
> - `banco-desarrollo.json` — 15 preguntas de desarrollo (5 por sesión)
> - `banco-relectura.json` — 10 desafíos de relectura (3 por sesión)
>
> Y actualizaré `indice.json` y `[libro].astro` para registrar el nuevo libro.
>
> ¿Confirmas antes de empezar?"

### Tú confirmas

> "Sí, adelante."

### La IA genera

Y te entrega los archivos listos para pegar.

---

## 📋 Especificaciones de los bancos

### `banco-comprension.json`

- **Total**: 30 preguntas.
- **Se muestran por sesión**: 10.
- **Formato**: opción múltiple, 4 opciones, 1 correcta.
- **Dificultad**: 30% media / 40% difícil / 30% muy difícil.
- **Campos por pregunta**:
  - `id` (ej: `c01`, `c02`...)
  - `dificultad` (`media`, `dificil`, `muy_dificil`)
  - `tema` (ej: "El narrador", "La amistad")
  - `pregunta`
  - `opciones` (4 strings)
  - `respuesta_correcta` (índice 0-3)
  - `explicacion` (por qué es correcta)
  - `pista` (dónde buscar en el libro: página o capítulo)

### `banco-desarrollo.json`

- **Total**: 15 preguntas.
- **Se muestran por sesión**: 5.
- **Formato**: pregunta abierta + criterios de evaluación.
- **Campos por pregunta**:
  - `id`, `dificultad`, `tema`, `pregunta`
  - `criterios` (array de lo que se evalúa)
  - `extension` (ej: "5 a 8 oraciones")

### `banco-relectura.json`

- **Total**: 10 desafíos.
- **Se muestran por sesión**: 3.
- **Formato**: actividad que invita a volver al texto.
- **Campos por desafío**:
  - `id`, `dificultad`, `tema`
  - `titulo`
  - `instrucciones` (array de pasos)
  - `pista` (dónde buscar)
  - `entregable` (qué se espera: dibujo, tabla, párrafo, etc.)

---

## ⚠️ Reglas estrictas

1. **No inventar datos**: si algo no está en el texto del libro, no usarlo. Verificar cada dato.
2. **No inventar personajes**: si un personaje no existe, no mencionarlo.
3. **No inventar capítulos**: contar los capítulos reales del libro antes de referenciarlos.
4. **No duplicar preguntas**: revisar que cada tema tenga cobertura distinta.
5. **No copiar preguntas del libro**: las preguntas deben ser de comprensión avanzada, no de memorización.
6. **Sin preguntas de desarrollo tipo "escribe un párrafo"**: el sistema solo soporta opción múltiple.
7. **Pistas verificables**: cada pista debe apuntar a un lugar real del texto.

---

## 🔮 Nota sobre automatización futura

Actualmente, la generación de comprensiones de lectura se hace en el chat con la IA. Esto tiene una limitación: hay que subir el PDF del libro **cada vez**.

**Objetivo a mediano plazo**: crear un script local (`scripts/generar-comprension.js`) que:

1. Reciba el PDF del libro.
2. Llame a Ollama + Qwen 2.5 7B (local, gratis) o Claude API (~$0.50 USD/libro).
3. Genere los 3 bancos automáticamente.
4. Guarde los JSON en la carpeta correcta.

Cuando ese script exista, el flujo será:

```bash
node scripts/generar-comprension.js \
  --libro "nuevo-libro" \
  --autor "Autor" \
  --pdf ./libros/nuevo-libro.pdf

Y el chat con la IA solo se usará para ajustar detalles, no para generar todo.

Por ahora: sigue el protocolo manual descrito arriba.

Fin del protocolo.
