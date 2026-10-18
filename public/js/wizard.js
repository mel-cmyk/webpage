// Núcleo dos formulários em etapas (quiz do tour e diagnóstico): navegação, progresso, erro e eventos do funil.
// Cada página passa só o que é dela: como validar uma etapa, o que fazer ao mostrá-la e como montar o resultado.
(function () {
  window.mrWizard = function (o) {
    const form = document.getElementById(o.formId);
    if (!form) return null;
    const steps = [...form.querySelectorAll('.step')];
    const back = form.querySelector('[data-back]');
    const next = form.querySelector('[data-next]');
    const error = form.querySelector('.quiz-error');
    const progress = form.querySelector('.quiz-progress');
    const result = document.getElementById(o.resultId);
    const track = (name, params) => { if (window.mrTrack) window.mrTrack(name, params || {}); };
    const fluxo = window.mrFluxo ? window.mrFluxo(o.fluxo, steps.length) : null;
    const nomeEtapa = (n) => o.nomeEtapa(steps[n], n);
    let i = 0;
    let started = false;
    if (fluxo) fluxo.view();

    function show(n) {
      steps.forEach((s, idx) => (s.hidden = idx !== n));
      back.hidden = n === 0;
      next.textContent = n === steps.length - 1 ? o.rotuloFinal : 'Continuar';
      progress.textContent = `Pergunta ${n + 1} de ${steps.length}`;
      error.hidden = true;
      if (o.aoMostrar) o.aoMostrar(n);
    }

    // Mostra o resultado e fecha o formulário; quem chama monta o HTML antes.
    function mostrarResultado() {
      form.hidden = true;
      result.hidden = false;
      result.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    form.addEventListener('change', () => {
      if (o.aoMudar) o.aoMudar();
      if (!started) { started = true; if (fluxo) fluxo.inicio(); else if (o.eventoInicio) track(o.eventoInicio); }
    });
    next.addEventListener('click', () => {
      if (!o.validar(steps[i], i, error)) { error.hidden = false; return; }
      if (fluxo) fluxo.etapa(i + 1, nomeEtapa(i), o.paramsEtapa ? o.paramsEtapa(i) : undefined);
      if (i < steps.length - 1) { i += 1; show(i); } else { next.disabled = true; o.concluir(); }
    });
    back.addEventListener('click', () => { if (i > 0) { i -= 1; show(i); } });
    form.addEventListener('submit', (e) => { e.preventDefault(); next.click(); });
    show(0);
    return { form, result, fluxo, track, mostrarResultado };
  };
})();
