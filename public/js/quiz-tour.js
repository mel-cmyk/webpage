// Quiz "Qual tour combina com você": soma pontos por tour e mostra o resultado.
(function () {
  const form = document.getElementById('quiz-tour');
  if (!form) return;
  const cfg = JSON.parse(document.getElementById('quiz-tour-config').textContent);
  const steps = [...form.querySelectorAll('.step')];
  const back = form.querySelector('[data-back]');
  const next = form.querySelector('[data-next]');
  const error = form.querySelector('.quiz-error');
  const progress = form.querySelector('.quiz-progress');
  const result = document.getElementById('quiz-resultado');
  const track = (name, params) => { if (window.mrTrack) window.mrTrack(name, params || {}); };
  let i = 0;
  let started = false;

  function show(n) {
    steps.forEach((s, idx) => (s.hidden = idx !== n));
    back.hidden = n === 0;
    next.textContent = n === steps.length - 1 ? 'Ver o meu tour' : 'Continuar';
    progress.textContent = `Pergunta ${n + 1} de ${steps.length}`;
    error.hidden = true;
  }

  function resultado() {
    const pontos = {};
    cfg.perguntas.forEach((p, n) => {
      const el = form.querySelector(`input[name="q${n}"]:checked`);
      if (!el) return;
      Object.entries(p.o[Number(el.value)][1]).forEach(([id, v]) => { pontos[id] = (pontos[id] || 0) + v; });
    });
    const ordem = Object.entries(pontos).sort((a, b) => b[1] - a[1]);
    return { primeiro: ordem[0] && ordem[0][0], segundo: ordem[1] && ordem[1][0], terceiro: ordem[2] && ordem[2][0], empate: ordem[1] && ordem[0][1] - ordem[1][1] <= 1 };
  }

  function finish() {
    const r = resultado();
    const t = cfg.tours[r.primeiro];
    const s = r.segundo ? cfg.tours[r.segundo] : null;
    const msg = `Olá! Fiz o quiz no site da Mel Rolan e o meu tour ideal deu ${t.nome}. Gostaria de consultar datas.`;
    const wa = `${cfg.whatsapp}?text=${encodeURIComponent(msg)}`;
    const extra = (id, rotulo) => { const x = id ? cfg.tours[id] : null; return x ? `<div class="result-extra"><p class="eyebrow">${rotulo}</p><h3>${x.nome}</h3>${x.subtitulo ? `<p class="card-sub">${x.subtitulo}</p>` : ''}<a href="${x.pagina}">Ver o tour</a></div>` : ''; };
    const alternativa = extra(r.segundo, '2º lugar para você') + extra(r.terceiro, '3º lugar para você');
    result.innerHTML = `
      <p class="eyebrow">1º lugar: o seu tour ideal</p>
      <h2>${t.nome}</h2>
      ${t.subtitulo ? `<p class="subtitulo">${t.subtitulo}</p>` : ''}
      <p>${t.ideal}</p>
      <p class="price">${t.duracao} · a partir de ${t.preco} por grupo</p>
      <div class="actions"><a class="btn" href="${t.pagina}" data-cta="quiz-tour-resultado">Conhecer o tour</a>
      <a class="btn btn-ghost" href="${wa}" data-wa="quiz-tour" data-lead='${JSON.stringify({ metodo: 'quiz_tour', tour_id: r.primeiro })}'>Consultar datas no WhatsApp</a></div>
      ${alternativa}
      <p class="small">Gostou de mais de um? No <a href="${cfg.personalizado}">Tour Personalizado</a>, a Mel desenha um percurso só com o que tem a ver com você. Ou <a href="${cfg.todos}">veja todos os tours</a>.</p>`;
    form.hidden = true;
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
    track('quiz_tour_conclusao', { tour_id: r.primeiro, segundo: r.segundo || '' });
  }

  form.addEventListener('change', () => { if (!started) { started = true; track('quiz_tour_inicio'); } });
  next.addEventListener('click', () => {
    if (!steps[i].querySelector('input:checked')) { error.hidden = false; return; }
    if (i < steps.length - 1) { i += 1; show(i); } else { next.disabled = true; finish(); }
  });
  back.addEventListener('click', () => { if (i > 0) { i -= 1; show(i); } });
  form.addEventListener('submit', (e) => { e.preventDefault(); next.click(); });
  show(0);
})();
