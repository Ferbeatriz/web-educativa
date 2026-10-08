# 📘 BITÁCORA — Ejercicios de División Contextualizados

> **Sesión:** 2026-10-08
> **Estado:** Completado y funcional en local

---

## Lo que se implementó

### 1. JSON de 20 problemas (`division-problemas.json`)

**Ruta:** `src/data/materias/matematicas/lecciones/division-problemas.json`

- **6 media** (30%): repartir objetos en grupos iguales (tomates, láminas, sillas, huevos, flores, lápices).
- **8 difícil** (40%): empaque y sobrantes (galletas, libros, jugos, panes, dulces, frutas, cuadernos, botellas).
- **6 muy difícil** (30%): contexto con desafío adicional (dinero, tiempo, capacidad, árboles).

Cada problema tiene:
- `contexto` (sujeto, objeto, cantidad_total, cantidad_grupos, situación).
- `enunciado`, `pregunta`, `dividendo`, `divisor`, `cociente_esperado`, `resto_esperado`.
- `tutor.pasos` con preguntas y feedback contextualizados.

### 2. Componentes Astro

- **`ListaProblemas.astro`**: muestra los 20 problemas agrupados por dificultad.
- **`ProblemaCard.astro`**: campo abierto (cociente + resto) + validación + activación del tutor.
- **`TutorContextualizado.astro`**: pasos del tutor con feedback contextualizado.

### 3. Scripts externos (`src/scripts/`)

- **`problema-card.js`**: maneja la validación de la respuesta del problema.
- **`tutor-contextualizado.js`**: maneja la lógica del tutor paso a paso.

**¿Por qué externos?** Astro duplica los scripts inline cuando un componente se renderiza múltiples veces (20 problemas = 20 scripts duplicados). Al moverlos a archivos externos, se cargan una sola vez.

### 4. Página de lección

**Ruta:** `src/pages/leccion/[...slug].astro`

- Detecta `esEjercicios` (presencia de `niveles` y ausencia de `contenido_modulos`).
- Renderiza la rama de ejercicios o la rama de teoría según corresponda.

### 5. Registro

- Lección `division-problemas` registrada en `materia.json` con `orden: 3`.

---

## Decisiones de diseño (para no olvidar)

| Decisión | Razón |
|----------|-------|
| **Formato**: campo abierto (cociente + resto) | Pedagogía diagnóstica: captura el error exacto sin ambigüedad |
| **Corrección**: automática al comprobar | Feedback inmediato, mejor que al final |
| **Tutor**: se activa SOLO al fallar | El que acierta ya demostró que comprendió |
| **Tutor**: no revela la respuesta correcta al fallar | Preserva el esfuerzo productivo (OECD) |
| **Contexto**: una vez por problema, persistente en pasos | El estudiante ancla cada paso en algo significativo |
| **Tutor**: generado con plantillas parametrizables | Reutilizable para otros problemas |
| **Scripts**: externos, no inline | Evita duplicación en Astro |

---

## Alineación curricular

| OA MINEDUC | Cómo lo aborda |
|------------|----------------|
| 4° OA 6: División con dividendos de dos dígitos y divisores de un dígito | Problemas media |
| 5° OA 4: División con dividendos de tres dígitos y divisores de un dígito | Problemas difícil |
| 6° OA 2: Cálculo con cuatro operaciones | Problemas muy difícil (incluyen dinero) |
| OAT Cognitiva: Resolver problemas de manera reflexiva | El tutor guía el razonamiento, no da la solución |
| OAT Proactividad: Perseverancia | El feedback permite reintentar sin frustración |

---

## Estado verificado

- ✅ Lección visible en `http://localhost:4321/materia/matematicas`
- ✅ Los 20 problemas cargan en `http://localhost:4321/leccion/matematicas/division-problemas`
- ✅ Campo abierto (cociente + resto) con validación
- ✅ Activación del tutor contextualizado al fallar
- ✅ Lógica de reintento (no revela la respuesta)
- ✅ Tutor avanza paso a paso
- ✅ Cierre al completar todos los pasos

---

## Próximos pasos

1. **Motor de errores** (prioridad alta):
   - Crear tabla `intentos_ejercicios` en D1.
   - Endpoint `/api/tutor/registrar-intento` en Worker.
   - Enviar intentos desde `problema-card.js` y `tutor-contextualizado.js`.
   - Etiquetar errores del tutor con `error_type`.

2. **Panel docente** (prioridad media):
   - Mostrar errores por estudiante.
   - Mostrar patrones del curso.
   - Alertas y exportación.

3. **Otras lecciones** (prioridad media):
   - Validar `resta-52-menos-27.json`.
   - Guardar "Los Textos Poéticos" (Lenguaje).
   - Crear `OA_LENGUAJE.md`.

---

**Fin de la bitácora.**