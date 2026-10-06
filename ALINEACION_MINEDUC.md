# 📚 ALINEACIÓN CURRICULAR — web-educativa

> Este documento es la referencia obligatoria para todo el desarrollo
> de la plataforma. Ninguna funcionalidad, lección o motor se aprueba
> si no está alineada con los OA del MINEDUC.
>
> Léelo antes de diseñar cualquier contenido o componente.

---

## 🎯 Principio rector

Toda la plataforma está diseñada para apoyar el logro de los
**Objetivos de Aprendizaje (OA)** y los **Objetivos de Aprendizaje
Transversales (OAT)** definidos en las Bases Curriculares del MINEDUC
para la Educación Básica (1° a 6°).

La plataforma no reemplaza al docente: lo **potencia** con datos,
herramientas y contenido alineado al currículum.

---

## 📖 Fuentes curriculares oficiales

| Documento | Fuente | Uso en la plataforma |
|-----------|--------|----------------------|
| Bases Curriculares 1° a 6° Básico | MINEDUC, Decreto Supremo N° 433/2012 | Definición de OA y OAT por asignatura y curso |
| Programas de Estudio 1° a 6° Básico | MINEDUC, Decreto Supremo N° 2960/2012 | Secuencia de OA por unidad, orientaciones didácticas |
| Planes de Estudio | MINEDUC | Tiempo mínimo por asignatura, organización escolar |

---

## 🧩 Estructura de los OA por asignatura

Cada asignatura organiza sus OA en **ejes temáticos**. Estos son los
ejes que la plataforma debe respetar:

### Matemática (5 ejes)
1. Números y operaciones
2. Patrones y álgebra
3. Geometría
4. Medición
5. Datos y probabilidades

### Lenguaje y Comunicación (3 ejes)
1. Lectura
2. Escritura
3. Comunicación oral

### Ciencias Naturales (3 ejes)
1. Ciencias de la vida
2. Ciencias físicas y químicas
3. Ciencias de la Tierra y el Universo

### Historia, Geografía y Ciencias Sociales (3 ejes)
1. Historia
2. Geografía
3. Formación Ciudadana

### Inglés (4 ejes)
1. Comprensión auditiva
2. Comprensión de lectura
3. Expresión oral
4. Expresión escrita

---

## 🔗 Alineación del motor de razonamiento con los OA

El motor de razonamiento paso a paso está diseñado para apoyar
los siguientes OA (ejemplo con Matemática):

### OA de Matemática que el motor puede abordar

| Curso | Eje | OA | ¿El motor lo puede abordar? |
|-------|-----|----|-----------------------------|
| 1° | Números | OA 9: Demostrar que comprenden la adición y la sustracción de números del 0 al 20 | ✅ Sí |
| 2° | Números | OA 9: Demostrar que comprende la adición y la sustracción en el ámbito del 0 al 100 | ✅ Sí |
| 3° | Números | OA 6: Demostrar que comprenden la adición y la sustracción de números del 0 al 1.000 | ✅ Sí |
| 3° | Números | OA 9: Demostrar que comprenden la división en el contexto de las tablas | ✅ Sí (ya implementado) |
| 4° | Números | OA 6: Demostrar que comprenden la división con dividendos de dos dígitos | ✅ Sí |
| 5° | Números | OA 4: Demostrar que comprenden la división con dividendos de tres dígitos | ✅ Sí |
| 6° | Números | OA 7: Demostrar que comprenden la multiplicación y la división de decimales | ⏳ Pendiente |

### OA Transversales (OAT) que el motor debe promover

| Dimensión | OAT | ¿Cómo lo promueve el motor? |
|-----------|-----|------------------------------|
| Cognitiva | Identificar, procesar y sintetizar información | El estudiante procesa cada paso, no solo recibe la respuesta |
| Cognitiva | Resolver problemas de manera reflexiva | El motor guía el razonamiento, no da la solución |
| Proactividad | Practicar la iniciativa personal y la creatividad | El estudiante elige estrategias, no solo sigue instrucciones |
| Proactividad | Comprender y valorar la perseverancia | El feedback permite reintentar sin frustración |

---

## 🎓 Rol del docente según el MINEDUC

El motor y el panel docente deben **preservar y potenciar** las
siguientes funciones del profesor, definidas en las Bases Curriculares:

| Función | Fundamento MINEDUC | Componente de la plataforma |
|---------|---------------------|------------------------------|
| Facilitador | "Crea un clima que promueve el aprendizaje" | Panel docente con datos accionables |
| Monitor | "Ofrece múltiples oportunidades de usar el lenguaje y reflexionar" | Motor que guía el razonamiento paso a paso |
| Modelo | "Se constituye en un ejemplo" | Ejemplos resueltos en el motor |
| Guía del COPISI | "Guía la transición concreto → pictórico → simbólico" | Visualizaciones por paso |
| Tomador de decisiones | "Puede tomar decisiones para modificar su planificación" | Panel con datos de proceso |
| Evaluador | "La evaluación forma parte constitutiva del proceso" | Registro de errores por paso |
| Agente de diversidad | "Debe tomar en cuenta la diversidad" | Adaptación de dificultad por estudiante |

---

## 🤖 Rol de la IA según la evidencia

La IA debe cumplir los siguientes principios (OECD, UNESCO, Horizon Report):

| Principio | Fundamento | Cómo se aplica |
|-----------|------------|-----------------|
| Agencia humana | OECD | El estudiante es agente de su aprendizaje; el docente, de su enseñanza |
| Human in the loop | OECD | El docente puede intervenir en cualquier decisión de la IA |
| Centrado en el ser humano | UNESCO | La IA está bajo control humano, es transparente y explicable |
| Privacidad desde el diseño | Ley 21.719 | Los datos de menores son categoría especial; consentimiento parental obligatorio |
| Esfuerzo productivo | OECD | La IA no da la respuesta; guía el razonamiento |

---

## ✅ Filtro de calidad: ¿está alineado con el MINEDUC?

Antes de aprobar cualquier contenido, funcionalidad o componente,
responder estas preguntas:

1. ¿Qué OA del MINEDUC aborda?
2. ¿Qué OAT promueve?
3. ¿Qué función del docente preserva o potencia?
4. ¿Qué principio de IA (OECD, UNESCO, Ley 21.719) respeta?
5. ¿Cómo se evalúa que el estudiante logró el OA?

Si alguna respuesta es "ninguna" o "no aplica", el desarrollo
no está alineado con el currículum y debe rediseñarse.

---

## 📌 Documentos relacionados

| Archivo | Contenido |
|---------|-----------|
| `ESTADO_PROYECTO.md` | Estado general + pendientes |
| `GUIA_IA.md` | Manual técnico completo |
| `PROMPT_TRASPASO.md` | Prompt para chat nuevo |
| `ALINEACION_MINEDUC.md` | Este archivo |
| `MOTOR_TUTOR_ESPECIFICACION.md` | Especificación del motor (pendiente) |
| `NOTIFICACIONES_PLAN.md` | Plan de notificaciones |
| `TUTOR_PLAN.md` | Plan del tutor interactivo |

---

**Fin del documento de alineación curricular.**