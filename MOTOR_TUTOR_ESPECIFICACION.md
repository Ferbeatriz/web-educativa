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

### Fase 3: Motor de errores (próxima sesión)
**Objetivo**: que cada intento del estudiante se registre con su `error_type`, para alimentar el panel docente.

**Qué registrar por cada intento:**
- `problema_id`: qué problema resolvió.
- `paso_n`: en qué paso del tutor está (si aplica).
- `respuesta_dada`: qué escribió o eligió.
- `respuesta_correcta`: qué se esperaba.
- `error_type`: qué tipo de error cometió (ej: `ignorar_resto`, `sobreestimar`, `error_resta_intermedia`).
- `intentos`: cuántas veces intentó ese paso.
- `timestamp`: cuándo lo hizo.

**Qué error_type asignar a cada error común del tutor:**
- Cuando el estudiante escribe un cociente incorrecto → `error_cociente`.
- Cuando escribe un resto incorrecto → `error_resto`.
- Cuando deja resto mayor que divisor → `error_resto_mayor_divisor`.
- Cuando falla en un paso del tutor → el `error_type` que corresponda al tipo de error.

**Arquitectura propuesta (a validar):**
1. **Frontend**: los scripts `problema-card.js` y `tutor-contextualizado.js` envían los datos a un endpoint del Worker.
2. **Backend**: el Worker recibe los datos y los guarda en D1 (tabla `intentos_ejercicios`).
3. **Panel docente**: consulta D1 y muestra errores agregados por estudiante y por curso.

**Tabla propuesta en D1:**
```sql
CREATE TABLE intentos_ejercicios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alumna_id INTEGER NOT NULL,
  problema_id TEXT NOT NULL,
  paso_n INTEGER,
  respuesta_dada TEXT,
  respuesta_correcta TEXT,
  error_type TEXT,
  intentos INTEGER DEFAULT 1,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (alumna_id) REFERENCES alumnas(id)
);



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
