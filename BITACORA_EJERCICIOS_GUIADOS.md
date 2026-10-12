# 📘 BITÁCORA — Ejercicios Guiados (3° Básico)

> **Sesión:** 2026-10-11
> **Commit:** `2a05138`
> **Estado:** Completado y funcional en local

---

## Lo que se implementó

### 1. Lección A: Repartimos en partes iguales

**Ruta:** `src/data/materias/matematicas/lecciones/division-reparto-3basico.json`

- 5 rondas, 52 ejercicios.
- Basada en las Guías 1-5 de `Division1.PDF`.
- Elementos gráficos: 🟡 fichas, 🔵 botones, ✏️ lápices, 🌸 flores, 🍪 galletas.

### 2. Lección B: Repaso de división

**Ruta:** `src/data/materias/matematicas/lecciones/division-repaso-3basico.json`

- 5 rondas, 30 ejercicios.
- Basada en las Guías 1-6 de `Division2.PDF`.

### 3. Tipo de lección nuevo: `ejercicios-guiados`

- Componente `src/components/ejercicios/EjerciciosGuiados.astro`.
- Script `src/scripts/ejercicios-guiados.js`.
- Página `leccion/[...slug].astro` con 3 ramas (guiados, ejercicios, teoría).

### 4. Tipos de respuesta soportados

`numero`, `division`, `division_y_grupos`, `dos_divisiones`, `division_y_multiplicacion`, `secuencia`.

---

## Decisiones de diseño

| Decisión | Razón |
|----------|-------|
| Preámbulo teórico breve por ronda | Contextualiza sin recargar |
| Emojis en vez de dibujos | La estudiante no tiene que dibujar |
| Feedback inmediato (simple) | Es lección de práctica, no de razonamiento |
| Sin tutor paso a paso | 82 ejercicios × tutor sería inviable |
| Sin trivia final | Las guías son de ejercicios, no de evaluación |

---

## Alineación MINEDUC

- OA 8 (3°): Tablas de multiplicar.
- OA 9 (3°): División en el contexto de las tablas.
- OA 10 (3°): Problemas con las cuatro operaciones.

---

## Pendientes

1. Deploy del Worker a producción.
2. Configurar `INTENTOS_SALT` en remoto.
3. Verificar `PUBLIC_API_URL` en Pages.
4. Panel docente.

---

**Fin de la bitácora.**