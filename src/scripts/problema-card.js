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
  
  // Extraemos el dividendo y divisor del problema para la animación
  // Los obtenemos de los inputs o los deducimos del cociente/resto
  const dividendo = cocienteEsperado * (parseInt(card.getAttribute('data-divisor') || '0') || 1) + restoEsperado;
  const divisor = parseInt(card.getAttribute('data-divisor') || '0') || 1;

  const inputCociente = card.querySelector('.input-cociente');
  const inputResto = card.querySelector('.input-resto');
  const feedback = card.querySelector('.feedback');
  const tutorContainer = card.querySelector('.tutor-container');
  const animacionContainer = card.querySelector('.animacion-container'); // NUEVO

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
    feedback.innerHTML = '✅ ¡Muy bien! Cociente: ' + cocienteEsperado + ', Resto: ' + restoEsperado + '.';
    
    if (animacionContainer) animacionContainer.hidden = true; // Ocultar si estaba visible
    
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
    // ❌ INCORRECTO → activar tutor y animación
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

    // --- LÓGICA DE LA ANIMACIÓN ---
    if (animacionContainer) {
      animacionContainer.hidden = false;
      animacionContainer.innerHTML = ''; // Limpiar si ya había una

      const animacion = document.createElement('animacion-division');
      animacionContainer.appendChild(animacion);

      // Calcular el estado del reparto según la respuesta del estudiante
      // Nota: Aquí asumimos que si el estudiante ingresó un cociente, ese es su "por_grupo".
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

      // Renderizar el Web Component
      if (typeof (animacion as any).render === 'function') {
        (animacion as any).render(visual, escenario);
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