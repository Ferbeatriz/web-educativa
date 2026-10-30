// Script global para las tarjetas de problema.

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
  const dividendo = parseInt(card.getAttribute('data-dividendo') || '0');
  const divisor = parseInt(card.getAttribute('data-divisor') || '1');

  const inputCociente = card.querySelector('.input-cociente');
  const inputResto = card.querySelector('.input-resto');
  const feedback = card.querySelector('.feedback');
  const tutorContainer = card.querySelector('.tutor-container');
  const animacionContainer = card.querySelector('.animacion-container');

  if (!inputCociente || !inputResto || !feedback || !tutorContainer) return;

  const cocienteUsuario = parseInt(inputCociente.value);
  const restoUsuario = parseInt(inputResto.value);

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
    feedback.innerHTML = '✅ ¡Muy bien! Cociente: ' + cocienteEsperado + ', Resto: ' + restoEsperado + '.';
    
    if (animacionContainer) animacionContainer.innerHTML = ''; // Limpiar animación si había
    
    btn.setAttribute('disabled', 'true');
    inputCociente.setAttribute('disabled', 'true');
    inputResto.setAttribute('disabled', 'true');

    registrarIntento({
      problema_id: problemaId,
      paso_n: null,
      respuesta_dada: cocienteUsuario + '/' + restoUsuario,
      respuesta_correcta: cocienteEsperado + '/' + restoEsperado,
      error_type: null,
      origen: 'problema_card',
    });
  } else {
    // ❌ INCORRECTO
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

       // --- ANIMACIÓN ---
    // Solo mostramos la animación si el número es pequeño (ej. 10, 20) 
    // para que los bloques no hagan colapsar la pantalla.
    if (animacionContainer) {
      animacionContainer.innerHTML = ''; 
      
      if (dividendo <= 50) {
        renderizarAnimacion(animacionContainer, dividendo, divisor, cocienteUsuario, cocienteEsperado);
      }
    }
    // ------------------------------

    tutorContainer.hidden = false;
    tutorContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

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


window.addEventListener('manipulativo-completado', (e) => {
  const { problemaId, cocienteEsperado } = e.detail || {};
  if (!problemaId) return;

  const card = document.querySelector(`.problema-card[data-problema-id="${problemaId}"]`);
  if (!card) return;

  const resultadoDiv = card.querySelector('#resultado-problema-' + problemaId);
  if (!resultadoDiv) return;

  const cociente = cocienteEsperado;
  const dividendo = parseInt(card.getAttribute('data-dividendo') || '0');
  const divisor = parseInt(card.getAttribute('data-divisor') || '1');
  const resto = dividendo % divisor;

  let texto = `Cada ${divisor} grupo${divisor !== 1 ? 's' : ''} tiene ${cociente} elemento${cociente !== 1 ? 's' : ''}.`;
  if (resto > 0) {
    texto += ` Sobran ${resto}.`;
  }

  resultadoDiv.hidden = false;
  resultadoDiv.innerHTML = '<strong>🎯 Resultado:</strong> ' + texto;
  resultadoDiv.className = 'resultado-problema resultado-correcto';
});
function renderizarAnimacion(container, dividendo, divisor, cocienteUsuario, cocienteEsperado) {
  const animacion = document.createElement('animacion-division');
  container.appendChild(animacion);

  const estado = cocienteUsuario > cocienteEsperado ? 'sobra' : 'falta';
  
  const visual = {
    tipo: 'grupos',
    total: dividendo,
    emoji_bloque: '🟦',
    etiqueta_grupo: 'grupo'
  };

  const escenario = {
    estado: estado,
    grupos: divisor,
    por_grupo: cocienteUsuario,
    resultado: divisor * cocienteUsuario,
    resto: dividendo - (divisor * cocienteUsuario),
    nota: `Tu respuesta (${cocienteUsuario} en cada grupo) deja ${estado === 'sobra' ? 'sobrantes' : 'faltantes'} bloques.`
  };

  if (typeof animacion.render === 'function') {
    animacion.render(visual, escenario);
  } else {
    // Si el componente aún no está listo, esperamos un poco
    setTimeout(() => {
      if (typeof animacion.render === 'function') {
        animacion.render(visual, escenario);
      }
    }, 100);
  }
}
