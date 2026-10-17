# 📄 INFORME AL APODERADO — Diseño en borrador

> Estado: borrador, no implementado.
> Fecha: 2026-10-15
> Pertenece al: Mes 2 del roadmap (y posteriores).
> Documento vivo: se completa cuando se implemente.

---

## 🎯 Objetivo

Que el apoderado pueda responder en menos de 1 minuto:
- ¿Qué aprendió mi hija esta semana?
- ¿En qué está teniendo dificultades?
- ¿Qué puedo hacer yo para ayudarla en 10 minutos?

---

## 🔒 Principios de privacidad (Ley 21.719)

1. **Datos de menores son categoría especial.** Todo acceso requiere
   consentimiento parental explícito.
2. **El apoderado solo ve a su propia hija.** Nunca comparaciones con
   otras alumnas, nunca rankings públicos.
3. **Dos niveles de consentimiento**:
   - `consentimientos_tracking` (existente): permite tracking anónimo
     para estadísticas agregadas y panel docente.
   - **Consentimiento específico** (futuro): permite mostrar al
     apoderado patrones de error individuales de su hija.
4. **Datos crudos nunca se exponen.** El informe muestra agregados y
   patrones, no intentos individuales.
5. **Revocable.** El apoderado puede pedir que se deje de mostrar
   el informe detallado en cualquier momento.

---

## 📊 Tipos de datos que se pueden mostrar

### Datos de progreso (ya disponibles hoy, con `alumna_id`)

- Lecciones completadas (total, por materia).
- Racha (días consecutivos, días activos últimos 30).
- Logros desbloqueados.
- XP total y nivel.
- Fechas: primera lección, última lección.

Estos datos **no requieren consentimiento específico adicional**:
son datos de progreso propios de la alumna, y ya están cubiertos por
el consentimiento parental actual.

### Datos de patrones de error (requieren diseño futuro)

- "Tu hija falla más en divisiones con resto".
- "Tu hija confunde el orden de las operaciones".
- "Tu hija mejora en lectura inferencial desde septiembre".

Estos datos **sí requieren**:
- Consentimiento específico.
- Desanonimización controlada (vía `mapa_identidad`).
- Diseño de salida cuidadoso (ver sección siguiente).

---

## 🎨 Reglas de diseño de salida

Cuando el informe muestre patrones de error individuales:

### Lenguaje descriptivo, no evaluativo

| ❌ Evitar | ✅ Preferir |
|-----------|-------------|
| "Está mal en división" | "Le cuesta más la división con resto" |
| "Tiene problemas de comprensión" | "Está trabajando la lectura inferencial" |
| "No entiende las fracciones" | "Las fracciones son su próximo desafío" |

### Con contexto de edad

Siempre acompañar con una frase que normalice el desafío:
- "Esto es normal a esta edad".
- "Muchos niños lo trabajan en 3°-4° básico".
- "Es parte del proceso de aprendizaje".

### Con acción concreta

Nunca dejar el diagnóstico solo. Siempre incluir:
- Una actividad de 10 minutos que el apoderado puede hacer.
- Un ejemplo cotidiano.
- Un link a la lección correspondiente en la plataforma.

### Sin comparaciones públicas

- Nunca "está bajo el promedio del curso".
- Nunca "es la número X de la clase".
- Nunca ranking.

### Enfocado en progreso, no en estado

| ❌ Evitar | ✅ Preferir |
|-----------|-------------|
| "Todavía falla en división" | "Mejoró en división simple desde septiembre" |
| "Le faltan 5 lecciones" | "Lleva 3 de 6 lecciones, avanza a buen ritmo" |

---

## 📝 Datos que conviene guardar desde ahora

Para que el informe futuro sea posible, conviene guardar desde ya:

### En `progreso` (ya se guarda)

- `alumna_id`, `leccion_id`, `materia_id`, `xp_ganados`, `completada_en`.

### En `intentos_ejercicios` (ya se guarda, anónimo)

- `alumna_hash`, `ejercicio_id`, `error_type`, `origen`, `creado_en`.

### Posibles extensiones a `intentos_ejercicios` (a evaluar)

- `leccion_id`: para poder agregar intentos por lección.
- `tipo_ejercicio`: para clasificar el ejercicio (ej: `division_simple`,
  `division_con_resto`, `resta_con_reserva`).
- `dificultad_declarada`: la dificultad que el ejercicio declara
  (fácil, media, difícil).
- `resultado`: correcto / incorrecto.
- `intentos_antes_de_acertar`: cuántos intentos fallidos hubo antes
  del correcto.

Estas extensiones permiten análisis agregado del tipo:
- "El ejercicio X tiene 60% de tasa de error, quizás es muy difícil
  para 3°".
- "El ejercicio Y tiene 95% de tasa de acierto, quizás es muy fácil".

**Esto no es para informes individuales**. Es para diseño pedagógico:
saber si los ejercicios están bien calibrados.

---

## 🗓️ Fases de implementación

### Fase 1: informe básico de progreso (Mes 2)
- Solo datos de `progreso`.
- Sin patrones de error individuales.
- Sin consentimiento específico adicional.

### Fase 2: extensión a intentos (post-Mes 2)
- Extender `intentos_ejercicios` con campos de clasificación.
- Análisis agregado para diseño pedagógico.

### Fase 3: informe con patrones individuales (futuro)
- Requiere consentimiento específico.
- Requiere diseño de salida cuidadoso.
- Requiere desanonimización controlada.

---

## 🔗 Documentos relacionados

| Archivo | Relación |
|---------|----------|
| `ROADMAP_3_MESES.md` | Mes 2 incluye el informe básico |
| `ALINEACION_MINEDUC.md` | Principios de IA y privacidad |
| `NOTIFICACIONES_PLAN.md` | Plan de envío por email |
| `MOTOR_TUTOR_ESPECIFICACION.md` | Motor de errores (fuente de datos) |

---

**Fin del borrador.**