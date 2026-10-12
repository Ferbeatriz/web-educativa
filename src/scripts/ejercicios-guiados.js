// Script global para ejercicios guiados.
// Valida las respuestas de cada ejercicio según su tipo.

document.addEventListener('click', (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  if (!target.classList.contains('btn-comprobar-ejercicio')) return;

  const btn = target;
  const card = btn.closest('.ejercicio-card');
  if (!card) return;

  const tipo = card.getAttribute('data-tipo');
  const respuestaCorrecta = card.getAttribute('data-respuesta') || '';
  const valoresCorrectos = JSON.parse(card.getAttribute('data-valores') || '[]');
  const feedback = card.querySelector('.feedback-ejercicio');

  let correcto = false;
  let inputs = [];

  if (tipo === 'numero') {
    const input = card.querySelector('.input-respuesta');
    inputs = [input];
    correcto = input && input.value.trim() === respuestaCorrecta;
  }

  if (tipo === 'division') {
    const [a, b, c] = [
      card.querySelector('.input-div-1'),
      card.querySelector('.input-div-2'),
      card.querySelector('.input-div-3'),
    ];
    inputs = [a, b, c];
    const partesLimpio = respuestaCorrecta.replace(/\s/g, '').split('=');
    const divPart = partesLimpio[0].split('÷');
    correcto =
      a?.value.trim() === divPart[0] &&
      b?.value.trim() === divPart[1] &&
      c?.value.trim() === partesLimpio[1];
  }

  if (tipo === 'division_y_grupos') {
    const [a, b, c, g] = [
      card.querySelector('.input-div-1'),
      card.querySelector('.input-div-2'),
      card.querySelector('.input-div-3'),
      card.querySelector('.input-grupos'),
    ];
    inputs = [a, b, c, g];
    const partes = respuestaCorrecta.replace(/\s/g, '').split(';');
    const divPart = partes[0].split('=');
    const divOp = divPart[0].split('÷');
    correcto =
      a?.value.trim() === divOp[0] &&
      b?.value.trim() === divOp[1] &&
      c?.value.trim() === divPart[1] &&
      g?.value.trim() === partes[1].replace('grupos', '').trim();
  }

  if (tipo === 'dos_divisiones') {
    const [a1, b1, c1, a2, b2, c2] = [
      card.querySelector('.input-div1-a'),
      card.querySelector('.input-div1-b'),
      card.querySelector('.input-div1-c'),
      card.querySelector('.input-div2-a'),
      card.querySelector('.input-div2-b'),
      card.querySelector('.input-div2-c'),
    ];
    inputs = [a1, b1, c1, a2, b2, c2];
    const partes = respuestaCorrecta.replace(/\s/g, '').split(';');
    const d1 = partes[0].split('=');
    const op1 = d1[0].split('÷');
    const d2 = partes[1].split('=');
    const op2 = d2[0].split('÷');
    correcto =
      a1?.value.trim() === op1[0] &&
      b1?.value.trim() === op1[1] &&
      c1?.value.trim() === d1[1] &&
      a2?.value.trim() === op2[0] &&
      b2?.value.trim() === op2[1] &&
      c2?.value.trim() === d2[1];
  }

  if (tipo === 'division_y_multiplicacion') {
    const [da, db, dc, ma, mb, mc] = [
      card.querySelector('.input-div-a'),
      card.querySelector('.input-div-b'),
      card.querySelector('.input-div-c'),
      card.querySelector('.input-mult-a'),
      card.querySelector('.input-mult-b'),
      card.querySelector('.input-mult-c'),
    ];
    inputs = [da, db, dc, ma, mb, mc];
    const partes = respuestaCorrecta.replace(/\s/g, '').split(';');
    const d = partes[0].split('=');
    const dOp = d[0].split('÷');
    const m = partes[1].split('=');
    const mOp = m[0].split('×');
    correcto =
      da?.value.trim() === dOp[0] &&
      db?.value.trim() === dOp[1] &&
      dc?.value.trim() === d[1] &&
      ma?.value.trim() === mOp[0] &&
      mb?.value.trim() === mOp[1] &&
      mc?.value.trim() === m[1];
  }

  if (tipo === 'secuencia') {
    const secInputs = card.querySelectorAll('.input-secuencia');
    inputs = Array.from(secInputs);
    correcto = secInputs.length === valoresCorrectos.length;
    secInputs.forEach((inp, i) => {
      if (inp.value.trim() !== valoresCorrectos[i]) correcto = false;
    });
  }

  inputs.forEach((inp) => {
    if (!inp) return;
    inp.classList.remove('input-correcto', 'input-incorrecto');
    inp.classList.add(correcto ? 'input-correcto' : 'input-incorrecto');
  });

  if (feedback) {
    feedback.classList.remove('hidden', 'feedback-correcto', 'feedback-incorrecto');
    if (correcto) {
      feedback.textContent = '✅ ¡Correcto!';
      feedback.classList.add('feedback-correcto');
      btn.disabled = true;
      btn.style.opacity = '0.6';
    } else {
      feedback.textContent = `❌ Intenta de nuevo.`;
      feedback.classList.add('feedback-incorrecto');
    }
  }
});