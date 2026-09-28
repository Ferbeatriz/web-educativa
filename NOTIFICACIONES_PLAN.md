# 📧 SISTEMA DE NOTIFICACIONES — Plan de Implementación

> Estado: Planificado, no implementado
> Prioridad: Media
> Fecha de diseño: 2026-09-28

---

## 🎯 Objetivo

Enviar notificaciones automáticas por email a:
1. **Apoderados**: informe mensual de progreso de su hija.
2. **Alumnas**: notificación de nuevo contenido disponible.
3. **Admin (Ferbeatriz)**: resumen semanal de uso.

**Consideración legal**: Cumplir con la Ley 19.628 de Chile (protección de datos personales de menores).

---

## 📋 Decisiones clave

| Decisión | Elección |
|----------|----------|
| Proveedor de emails | Cloudflare Email Workers (nativo) |
| Trigger de envíos | Cloudflare Cron Triggers |
| Consentimiento | Opción C (código de clase + documento físico firmado) |
| Frecuencia apoderados | Mensual |
| Frecuencia admin | Semanal (lunes por la mañana) |
| Notificación alumnas | Solo cuando se publique contenido nuevo |

---

## 🏗️ Arquitectura propuesta

### Base de datos (nuevas tablas)

**Tabla `apoderados`**:
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER | PK autoincremental |
| nombre | TEXT | Nombre del apoderado |
| email | TEXT (único) | Email de contacto |
| alumna_id | INTEGER | FK a alumnas |
| consentimiento | INTEGER | 0/1 (firmó consentimiento) |
| creado_en | TEXT | Timestamp |

**Tabla `notificaciones`**:
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER | PK autoincremental |
| tipo | TEXT | "informe_mensual", "nuevo_contenido", "resumen_admin" |
| destinatario | TEXT | Email destinatario |
| asunto | TEXT | Asunto del email |
| enviado_en | TEXT | Timestamp |
| estado | TEXT | "enviado", "fallido", "rebotado" |

### Cloudflare Email Workers

**Ventajas**:
- Nativo de Cloudflare (no requiere API externa).
- Incluido en el plan free (hasta cierto límite).
- Compatible con el Worker existente.

**Configuración necesaria**:
- Habilitar Email Routing en el dominio.
- Configurar DKIM, SPF, DMARC (Cloudflare lo hace automáticamente).

### Cloudflare Cron Triggers

**Tareas programadas**:

| Cron | Frecuencia | Acción |
|------|------------|--------|
| `0 9 1 * *` | 1° de cada mes, 9 AM | Informe mensual a apoderados |
| `0 8 * * 1` | Lunes, 8 AM | Resumen semanal a admin |
| Manual (endpoint) | Cuando se publique contenido | Notificación a alumnas |

---

## 📧 Plantillas de email

### 1. Informe mensual a apoderados

**Asunto**: `Informe mensual de [Nombre Alumna] · Web Educativa`

**Contenido**:
- Saludo personalizado al apoderado.
- Resumen de la alumna:
  - Nivel actual + emoji.
  - XP total ganado este mes.
  - Lecciones completadas este mes.
  - Materias exploradas.
- Mensaje motivacional.
- Link a la plataforma.
- Instrucciones para darse de baja.

### 2. Notificación de nuevo contenido a alumnas

**Asunto**: `🎉 Nuevo contenido disponible en [Materia]`

**Contenido**:
- Saludo personalizado a la alumna.
- Título de la nueva lección.
- Breve descripción.
- Link directo a la lección.

### 3. Resumen semanal para admin

**Asunto**: `Resumen semanal · Web Educativa`

**Contenido**:
- Total de alumnas activas.
- Lecciones completadas esta semana.
- XP total generado.
- Ranking de las 5 alumnas más activas.
- Alertas (alumnas sin conexión, errores técnicos).

---

## 🗺️ Roadmap por fases

### 🥇 Fase 1 — Infraestructura de emails (1 sesión)

**Objetivo**: poder enviar emails desde el Worker.

**Entregables**:
- Email Routing habilitado en Cloudflare.
- Worker configurado para enviar emails.
- Endpoint `POST /api/admin/test-email` para probar.
- Documentación de la configuración.

### 🥈 Fase 2 — Tabla de apoderados + formulario (1 sesión)

**Objetivo**: registrar apoderados y su consentimiento.

**Entregables**:
- Tabla `apoderados` en D1.
- Endpoint `POST /api/apoderados/registrar`.
- Documento físico de consentimiento (PDF para imprimir).
- Página `/admin/apoderados` para gestionar.

### 🥉 Fase 3 — Informe mensual a apoderados (1 sesión)

**Objetivo**: enviar el primer informe real.

**Entregables**:
- Plantilla HTML del email.
- Función `enviarInformeMensual(alumna_id)`.
- Cron Trigger configurado.
- Prueba con datos reales.

### 🏅 Fase 4 — Notificaciones a alumnas + resumen admin (1 sesión)

**Objetivo**: completar el sistema.

**Entregables**:
- Plantilla para nuevo contenido.
- Plantilla para resumen admin.
- Cron Trigger semanal.
- Panel admin para gestionar notificaciones.

---

## 📊 Estimación de sesiones

| Fase | Trabajo | Sesiones |
|------|---------|----------|
| 1 | Infraestructura de emails | 1 |
| 2 | Tabla apoderados + consentimiento | 1 |
| 3 | Informe mensual | 1 |
| 4 | Notificaciones y resumen | 1 |
| **Total** | | **4 sesiones** |

---

## ⚖️ Consideraciones legales (Ley 19.628 Chile)

**Requisitos**:
1. **Consentimiento explícito** del apoderado para recibir emails.
2. **Información clara** sobre qué datos se recopilan y para qué.
3. **Derecho a eliminar datos** en cualquier momento.
4. **Uso limitado** de datos (solo para notificaciones educativas).
5. **Seguridad**: no exponer datos sensibles en los emails.

**Implementación**:
- Documento físico de consentimiento (firmado al inicio del año escolar).
- Link de baja en cada email.
- Política de privacidad pública (crear página `/privacidad`).

---

## 🎯 Prioridad y siguiente paso

**Próximo paso al retomar**:

1. Leer este archivo completo.
2. Confirmar la decisión del stack (Cloudflare Email Workers).
3. Empezar con la **Fase 1**: infraestructura de emails.

**Antes de empezar**, verificar:
- ¿Cloudflare Email Workers tiene cuota gratuita suficiente? (Sí, ~100 emails/día en plan free).
- ¿El dominio `web-educativa.pages.dev` puede enviar emails? (Los dominios `.pages.dev` pueden tener limitaciones; puede que se necesite un dominio propio).

**⚠️ Consideración importante**: posiblemente se necesite un dominio personalizado (ej: `aprendejugando.cl`) para enviar emails con dominio propio. Costo: ~$10 USD/año.

---

**Fin del plan de notificaciones.**
