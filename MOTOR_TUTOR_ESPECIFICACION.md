# 🔧 ESPECIFICACIÓN DEL MOTOR DE RAZONAMIENTO — web-educativa

> **Estado:** En construcción (v0.1)
> **Última actualización:** 2026-10-06
> **Documento base:** `division-37-entre-5.json`, `resta-52-menos-27.json`
> **LECTURA OBLIGATORIA:** `ALINEACION_MINEDUC.md`

---

## 🎯 Propósito

El motor define la estructura, las reglas y los componentes de un
ejercicio de tutoría paso a paso. Su objetivo es garantizar que todos
los ejercicios tengan calidad pedagógica consistente, feedback
específico para errores comunes y una experiencia de usuario uniforme,
alineada con los OA del MINEDUC.

---

## 📥 Estructura de datos de entrada

Todo ejercicio del motor debe tener los siguientes campos:

| Campo | Tipo | Invariante | Descripción |
|-------|------|------------|-------------|
| `id` | String | ✅ | Slug único en kebab-case |
| `materia_id` | String | ✅ | Identificador de la materia |
| `tema` | String | ✅ | Tema específico (ej: `division`, `resta_con_reserva`) |
| `dificultad` | String | ✅ | `facil`, `media`, `dificil` |
| `titulo` | String | ✅ | Título con emoji |
| `emoji` | String | ✅ | Emoji principal |
| `contexto` | String | ✅ | Situación narrativa |
| `pasos` | Array | ✅ | Array de pasos (ver estructura) |
| `cierre` | String | ✅ | Mensaje pedagógico final |

### Estructura de cada paso

| Campo | Tipo | Invariante | Descripción |
|-------|------|------------|-------------|
| `n` | Number | ✅ | Número secuencial del paso |
| `pregunta` | String | ✅ | Texto de la pregunta |
| `tipo` | String | ✅ | `si_no`, `opciones` (futuro: `numero`) |
| `opciones` | Array | ✅ | Alternativas |
| `respuesta_correcta` | String | ✅ | Respuesta correcta |
| `feedback_correcto` | String | ✅ | Mensaje de acierto |
| `errores_comunes` | Object | ✅ | Mapa respuesta_incorrecta → feedback |
| `visual` | Object | ❌ | Visualización asociada (parametrizable) |

---

## 📤 Estructura de datos de salida

El motor produce un JSON con la estructura anterior, listo para ser
consumido por `<TutorPasos />`.

---

## 🧩 Bibliotecas de componentes reutilizables

### 1. Plantillas de pasos por tipo de operación

| Operación | Pasos sugeridos |
|-----------|-----------------|
| **División** | 1. ¿Se puede dividir la primera cifra? <br> 2. Encontrar el múltiplo más cercano. <br> 3. Multiplicar para saber cuántos se usaron. <br> 4. Restar para encontrar el resto. |
| **Resta con reserva** | 1. ¿Se puede restar la primera cifra? <br> 2. Pedir prestado a la decena. <br> 3. Restar las unidades. <br> 4. Restar las decenas. <br> 5. Resultado final. |
| **Fracciones** | 1. Identificar denominador común. <br> 2. Amplificar fracciones. <br> 3. Sumar/restar numeradores. <br> 4. Simplificar. |

### 2. Biblioteca de errores comunes

| Tipo de error | Plantilla de feedback |
|---------------|------------------------|
| Sobreestimación | `"[Respuesta] × [Divisor] = [Resultado]. Te pasaste por [Diferencia]. Prueba con un número más chico."` |
| Subestimación | `"[Respuesta] × [Divisor] = [Resultado]. Quedan [Diferencia] y todavía alcanza para más. Sube un poco."` |
| Error en resta | `"Casi. [Número1] − [Número2] no es [Respuesta]. Revisa la resta con calma."` |
| Resto mayor o igual | `"El resto siempre es menor que el divisor. Si sobraran [Respuesta], alcanzaría para un grupo más."` |

### 3. Biblioteca de visualizaciones

| Tipo | Descripción | Escenarios |
|------|-------------|------------|
| **Grupos** | Bloques agrupados en cajas | `falta`, `correcto`, `sobra` |
| **Resto** | Bloques que sobran | `correcto`, `imposible` |
| **Resta** | Descomposición con préstamo | `pedir_prestado`, `restar_unidades`, `restar_decenas` (pendiente) |

---

## 🗺️ Estado actual de implementación

| Componente | Estado | Notas |
|------------|--------|-------|
| Estructura de datos | ✅ Definida | Basada en `division-37-entre-5.json` |
| Validador (`validador.ts`) | ✅ Implementado | Genérico para todos los ejercicios |
| Componente UI (`TutorPasos.astro`) | ✅ Implementado | Genérico |
| Animación división | ✅ Implementada | `AnimacionDivision.astro` |
| Animación resta | ⏳ Pendiente | Necesita `AnimacionResta.astro` |
| Segundo ejercicio (resta) | ⏳ Borrador listo | `resta-52-menos-27.json` |
| Generador automático | 🔮 Futuro | Script que produce JSON |

---

## ✅ Filtro de calidad del motor

Antes de aprobar un nuevo ejercicio o componente del motor:

1. ¿Qué OA del MINEDUC aborda? (ver `ALINEACION_MINEDUC.md`)
2. ¿Tiene al menos 2 errores comunes por paso?
3. ¿Cada error tiene feedback específico?
4. ¿Tiene visualización o justificación de por qué no?
5. ¿Preserva el rol del docente según el MINEDUC?
6. ¿Cumple con los principios de IA (OECD, UNESCO, Ley 21.719)?

---

## 🚧 Próximos pasos

1. **Validar el JSON de resta** (`resta-52-menos-27.json`).
2. **Definir `VisualResta`** en `validador.ts`.
3. **Crear `AnimacionResta.astro`**.
4. **Registrar el tutor de resta** en `materia.json`.
5. **Probar con una niña real** antes de expandir.

---

---

## 📝 Bitácora de implementación

### Fase 1: Tutor de división (completado)
- `division-37-entre-5.json` funcional.
- `TutorPasos.astro` + `validador.ts` genéricos.

### Fase 2: Ejercicios de división contextualizados (completado)
- **20 problemas** en `division-problemas.json`:
  - 6 media (30%): repartir objetos en grupos iguales.
  - 8 difícil (40%): empaque y sobrantes.
  - 6 muy difícil (30%): contexto con desafío adicional (dinero, tiempo).
- **Formato**: campo abierto (cociente + resto), no alternativas.
- **Corrección**: automática al comprobar, feedback inmediato.
- **Tutor contextualizado**: se activa SOLO cuando el estudiante falla.
- **Lógica de reintento**: al fallar, NO revela la respuesta correcta. Permite reintentar hasta acertar.
- **Contexto persistente**: el objeto (tomates, galletas, sillas) se mantiene en cada paso.
- **Componentes**:
  - `ListaProblemas.astro`: muestra los 20 problemas agrupados por dificultad.
  - `ProblemaCard.astro`: campo abierto + validación + activación del tutor.
  - `TutorContextualizado.astro`: pasos con feedback contextualizado.
- **Scripts externos** en `src/scripts/`:
  - `problema-card.js`: maneja la validación de respuesta.
  - `tutor-contextualizado.js`: maneja la lógica del tutor paso a paso.
- **Página**: `leccion/[...slug].astro` detecta `esEjercicios` (presencia de `niveles`) y renderiza según tipo.

### Fase 3: Motor de errores (completado 2026-10-12)

**Estado**: ✅ Implementado y funcionando en producción.

**Commits**: `50d48f3` (fix frontend) | Worker versión `2f19a8e8`.

Fase 4: Panel docente (futuro)
Mostrar errores por estudiante.

Mostrar patrones del curso.

Alertas de estudiantes que necesitan apoyo.

Exportar datos para planificación.

Fase 5: Expansión (futuro)
Tutor de resta con reserva.

Tutor de fracciones.

Lecciones de Lenguaje (textos poéticos).

OA de otras materias.



**Fin de la especificación del motor (v0.1).**
---

## 📝 Bitácora de implementación — Fase 4

### Tipo de lección: `ejercicios-guiados`

**Fecha:** 2026-10-11
**Commit:** `2a05138`

**Qué es:** un tipo de lección nuevo que combina:
- Preámbulo teórico breve por ronda (2-3 oraciones + ejemplo).
- Ejercicios interactivos con validación inmediata.
- Sin trivia final (es lección de práctica).

**Estructura del JSON:**

```json
{
  "id": "division-reparto-3basico",
  "titulo": "Repartimos en partes iguales",
  "tipo": "ejercicios-guiados",
  "contenido_modulos": [
    {
      "tipo": "ronda",
      "titulo": "Ronda 1 · ...",
      "emoji": "🍎",
      "elemento": "fichas",
      "emoji_elemento": "🟡",
      "preambulo": "Texto markdown con **negritas** y ejemplos.",
      "ejercicios": [
        {
          "n": 1,
          "enunciado": "...",
          "visual": "🟡🟡🟡🟡\n\n👧 👦",
          "pregunta": "...",
          "respuesta": "2",
          "tipo_respuesta": "numero",
          "unidad": "fichas"
        }
      ]
    }
  ]
}
Tipos de respuesta soportados:

Tipo	Formato	Ejemplo
numero	Campo único numérico	[__]
division	3 campos: dividendo ÷ divisor = cociente	[__] ÷ [__] = [__]
division_y_grupos	3 campos + campo grupos	[__] ÷ [__] = [__] y [__] grupos
dos_divisiones	6 campos (2 divisiones)	dos filas de 3 campos
division_y_multiplicacion	6 campos (división + comprobación)	3 + 3 campos
secuencia	N campos según valores	lista de [__]
Componentes creados:

src/components/ejercicios/EjerciciosGuiados.astro: renderiza las rondas.

src/scripts/ejercicios-guiados.js: valida las respuestas.

Página adaptada:

src/pages/leccion/[...slug].astro ahora tiene 3 ramas:

esEjerciciosGuiados → EjerciciosGuiados
esEjercicios → ListaProblemas
teoría → contenido_modulos + trivia
Lecciones creadas:

Lección	Ejercicios	Rondas	Fuente
division-reparto-3basico	52	5	Guías 1-5 de Division1.PDF
division-repaso-3basico	30	5	Guías 1-6 de Division2.PDF
Alineación MINEDUC:

OA 8 (3°): Demostrar que comprenden las tablas de multiplicar.

OA 9 (3°): Demostrar que comprenden la división en el contexto de las tablas.

OA 10 (3°): Resolver problemas rutinarios con las cuatro operaciones.

Fidelidad a las guías: los enunciados son textuales del MINEDUC. Los elementos gráficos se representan con emojis para que la estudiante no tenga que dibujar.

Pendientes:

Deploy del Worker a producción (con INTENTOS_SALT).

Verificar PUBLIC_API_URL en Cloudflare Pages.

Documentar el tipo en la Guía IA.

Fin de la bitácora de la Fase 4.


---

## 📝 Bitácora de implementación — Panel docente

### Panel de métricas del motor de errores

**Fecha:** 2026-10-12
**Commit:** `7d1b439`
**Worker:** `7ca9a592`

**Ruta:** `/admin/metricas`

**Endpoints nuevos en el Worker**:
- `GET /api/admin/metricas/resumen` — contadores globales.
- `GET /api/admin/metricas/por-error` — distribución por `error_type`.
- `GET /api/admin/metricas/por-dia` — serie temporal.
- `GET /api/admin/metricas/por-alumna` — tabla agregada por alumna.

**Filtros comunes**: `?desde=YYYY-MM-DD&hasta=YYYY-MM-DD&origen=problema_card|tutor`

**Desanonimizado**:
- `intentos_ejercicios` guarda `alumna_hash`, no `alumna_id`.
- JOIN con `mapa_identidad` → `alumnas` para mostrar nombre.
- Si el hash no está en `mapa_identidad`, se muestra "(anónima)" y se avisa con banner.

**Diseño visual**:
- Resumen: 4 tarjetas (total, tasa, alumnas, días).
- Errores por tipo: tabla con badges + barras proporcionales.
- Actividad por día: barritas verde/naranja con tooltip.
- Detalle por alumna: tabla con error más frecuente.

**Decisión de diseño**: se mantuvo el estilo del dashboard admin existente (Inter, fondo `#F8FAFC`, header oscuro `#0F172A`).

**Pendiente cosmético**: cuando hay un solo día con actividad, la barra ocupa todo el ancho. Se resolverá naturalmente cuando haya más días. Mejora futura opcional: limitar `.dia-col` a `max-width: 60px`.

---




