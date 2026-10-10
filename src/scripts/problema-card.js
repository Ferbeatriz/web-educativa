// Script global para las tarjetas de problema.
// Se importa una vez y maneja todos los ProblemaCard de la página.

import { registrarIntento } from '../lib/intentos';

document.addEventListener('click', (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  if (!target.classList.contains('btn-comprobar')) return;

  const btn = target;
  const card = btn.closest('.problema-card');
  if (!card) return;

  const problemaId = card.getAttribute('data-problema-id') || '';
  const cocienteEsperado = parseInt(card.getAttribute('data-cociente') || '0');
  const restoEsperado = parseInt(card.getAttribute('data-resto') || '0');

  const inputCociente = card.querySelector('.input-cociente');
  const inputResto = card.querySelector('.input-resto');
  const feedback = card.querySelector('.feedback');
  const tutorContainer = card.querySelector('.tutor-container');

  if (!inputCociente || !inputResto || !feedback || !tutorContainer) return;

  const cocienteUsuario = parseInt(inputCociente.value);
  const restoUsuario = parseInt(inputResto.value);

  // Validar que ambos campos estén llenos
  if (isNaN(cocienteUsuario) || isNaN(restoUsuario)) {
    feedback.hidden = false;
    feedback.className = 'feedback feedback-error';
    feedback.innerHTML = '⚠️ Completa ambos campos antes de comprobar.';
    return;
  }

  const cocienteCorrecto = cocienteUsuario === cocienteEsperado;
  const restoCorrecto = restoUsuario === restoEsperado;

  if (cocienteCorrecto && restoCorrecto) {
    // ✅ CORRECTO
    feedback.hidden = false;
    feedback.className = 'feedback feedback-correcto';
    feedback.innerHTML =
      '✅ ¡Muy bien! Cociente: ' + cocienteEsperado + ', Resto: ' + restoEsperado + '.';
    btn.setAttribute('disabled', 'true');
    inputCociente.setAttribute('disabled', 'true');
    inputResto.setAttribute('disabled', 'true');
    console.log('[Problema ' + problemaId + '] Correcto');

    // 📊 Registrar intento exitoso (error_type: null)
    registrarIntento({
      problema_id: problemaId,
      paso_n: null,
      respuesta_dada: cocienteUsuario + '/' + restoUsuario,
      respuesta_correcta: cocienteEsperado + '/' + restoEsperado,
      error_type: null,
      origen: 'problema_card',
    });
  } else {
    // ❌ INCORRECTO → activar tutor
    feedback.hidden = false;
    feedback.className = 'feedback feedback-incorrecto';

    let mensaje = '❌ Casi. ';
    let errorType;
    if (!cocienteCorrecto && !restoCorrecto) {
      mensaje += 'Revisa el cociente y el resto. ';
      errorType = 'ambos_incorrectos';
    } else if (!cocienteCorrecto) {
      mensaje += 'Revisa el cociente. ';
      errorType = 'cociente_incorrecto';
    } else {
      mensaje += 'Revisa el resto. ';
      errorType = 'resto_incorrecto';
    }
    mensaje += 'Vamos a resolverlo juntos.';
    feedback.innerHTML = mensaje;

    tutorContainer.hidden = false;
    tutorContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    console.log(
      '[Problema ' +
        problemaId +
        '] Error: cociente=' +
        cocienteUsuario +
        ' (esperado ' +
        cocienteEsperado +
        '), resto=' +
        restoUsuario +
        ' (esperado ' +
        restoEsperado +
        ')'
    );

    // 📊 Registrar intento fallido con su tipo de error
    registrarIntento({
      problema_id: problemaId,
      paso_n: null,
      respuesta_dada: cocienteUsuario + '/' + restoUsuario,
      respuesta_correcta: cocienteEsperado + '/' + restoEsperado,
      error_type: errorType,
      origen: 'problema_card',
    });
  }
});