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

**Fin de la especificación del motor (v0.1).**