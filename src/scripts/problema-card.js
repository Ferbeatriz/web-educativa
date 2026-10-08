// Script global para las tarjetas de problema.
// Se importa una vez y maneja todos los ProblemaCard de la página.

document.addEventListener('click', (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  if (!target.classList.contains('btn-comprobar')) return;

  const btn = target;
  const card = btn.closest('.problema-card');
  if (!card) return;

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
    console.log('[Problema ' + card.getAttribute('data-problema-id') + '] Correcto');
  } else {
    // ❌ INCORRECTO → activar tutor
    feedback.hidden = false;
    feedback.className = 'feedback feedback-incorrecto';

    let mensaje = '❌ Casi. ';
    if (!cocienteCorrecto && !restoCorrecto) {
      mensaje += 'Revisa el cociente y el resto. ';
    } else if (!cocienteCorrecto) {
      mensaje += 'Revisa el cociente. ';
    } else {
      mensaje += 'Revisa el resto. ';
    }
    mensaje += 'Vamos a resolverlo juntos.';
    feedback.innerHTML = mensaje;

    tutorContainer.hidden = false;
    tutorContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    console.log(
      '[Problema ' +
        card.getAttribute('data-problema-id') +
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
  }
});