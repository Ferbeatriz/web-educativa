// Script global del tutor contextualizado.
// Se importa una sola vez y maneja todos los tutores de la página.

import { registrarIntento } from '../lib/intentos';

document.addEventListener('click', (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;

  // ============================================
  // CLIC EN OPCIÓN
  // ============================================
  if (target.classList.contains('opcion-btn')) {
    const btn = target;
    const pasoDiv = btn.closest('.tutor-paso');
    if (!pasoDiv) return;

    const respuestaCorrecta = pasoDiv.getAttribute('data-respuesta-correcta');
    const errores = JSON.parse(pasoDiv.getAttribute('data-errores') || '{}');
    const feedback = pasoDiv.querySelector('.paso-feedback');
    const btnSiguiente = pasoDiv.querySelector('.btn-siguiente');
    const opcionElegida = btn.getAttribute('data-opcion');

    if (!feedback || !btnSiguiente) return;

    // Extraer problema_id y paso_n para tracking
    const tutorContainer = pasoDiv.closest('.tutor-contextualizado');
    const problemaId = tutorContainer?.getAttribute('data-problema-id') || '';
    const pasoN = parseInt(pasoDiv.getAttribute('data-paso-n') || '0');

    // Limpiar estados anteriores del paso
    pasoDiv.querySelectorAll('.opcion-btn').forEach((b) => {
      b.classList.remove('opcion-correcta', 'opcion-incorrecta');
      b.removeAttribute('disabled');
    });

    if (opcionElegida === respuestaCorrecta) {
      // ✅ CORRECTO
      feedback.hidden = false;
      feedback.className = 'paso-feedback feedback-correcto';
      feedback.innerHTML = '✅ ¡Correcto!';
      btn.classList.add('opcion-correcta');

      pasoDiv.querySelectorAll('.opcion-btn').forEach((b) => {
        b.setAttribute('disabled', 'true');
      });

      btnSiguiente.hidden = false;
      btnSiguiente.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // 📊 Registrar intento correcto del tutor
      registrarIntento({
        problema_id: problemaId,
        paso_n: pasoN,
        respuesta_dada: opcionElegida || '',
        respuesta_correcta: respuestaCorrecta || '',
        error_type: null,
        origen: 'tutor',
      });
    } else {
      // ❌ INCORRECTO: NO revelar la correcta, permitir reintentar
      feedback.hidden = false;
      feedback.className = 'paso-feedback feedback-incorrecto';
      const mensajeError = errores[opcionElegida] || 'Casi. Revisa tu respuesta.';
      feedback.innerHTML = '❌ ' + mensajeError;
      btn.classList.add('opcion-incorrecta');

      // 📊 Registrar intento fallido del tutor
      registrarIntento({
        problema_id: problemaId,
        paso_n: pasoN,
        respuesta_dada: opcionElegida || '',
        respuesta_correcta: respuestaCorrecta || '',
        error_type: 'paso_incorrecto',
        origen: 'tutor',
      });
    }
  }

  // ============================================
  // CLIC EN "SIGUIENTE PASO"
  // ============================================
  if (target.classList.contains('btn-siguiente')) {
    const btn = target;
    const pasoActual = btn.closest('.tutor-paso');
    if (!pasoActual) return;

    const tutorContainer = pasoActual.closest('.tutor-contextualizado');
    if (!tutorContainer) return;

    const pasoN = parseInt(pasoActual.getAttribute('data-paso-n') || '0');
    const pasoSiguiente = tutorContainer.querySelector(
      '.tutor-paso[data-paso-n="' + (pasoN + 1) + '"]'
    );

    pasoActual.setAttribute('hidden', 'true');

    if (pasoSiguiente) {
      pasoSiguiente.removeAttribute('hidden');
      pasoSiguiente.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      const cierre = tutorContainer.querySelector('.tutor-cierre');
      if (cierre) {
        cierre.removeAttribute('hidden');
        cierre.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }
});