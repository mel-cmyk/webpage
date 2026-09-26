// Diagnóstico da viagem: 5 etapas, recomendação e WhatsApp pré-preenchido.
(function () {
  const form = document.getElementById('diagnostico');
  if (!form) return;
  const cfg = JSON.parse(document.getElementById('diagnostico-config').textContent);
  const steps = [...form.querySelectorAll('.step')];
  const back = form.querySelector('[data-back]');
  const next = form.querySelector('[data-next]');
  const error = form.querySelector('.quiz-error');
  const progress = form.querySelector('.quiz-progress');
  const result = document.getElementById('resultado');
  const track = (name, params) => { if (window.mrTrack) window.mrTrack(name, params || {}); };
  let i = 0;
  let started = false;

  const val = (name) => (form.elements[name] && form.elements[name].value || '').trim();

  function toggleConditional() {
    form.querySelectorAll('[data-show-if]').forEach((el) => {
      const [k, v] = el.dataset.showIf.split('=');
      el.hidden = val(k) !== v;
    });
  }

  function show(n) {
    steps.forEach((s, idx) => (s.hidden = idx !== n));
    back.hidden = n === 0;
    next.textContent = n === steps.length - 1 ? 'Ver a indicação' : 'Continuar';
    progress.textContent = `Pergunta ${n + 1} de ${steps.length}`;
    error.hidden = true;
    toggleConditional();
  }

  function valid(n) {
    const radios = steps[n].querySelectorAll('input[type="radio"]');
    if (!radios.length) return true;
    return [...radios].some((r) => r.checked);
  }

  // Critério de qualificação: orçamento para os serviços.
  function qualificado() {
    const inv = val('investimento');
    if (inv === 'até R$ 500') return 'nao';
    if (inv === 'ainda não sei') return 'indefinido';
    return 'sim';
  }

  function recomendar() {
    const procura = val('procura');
    const inv = val('investimento');
    if (procura === 'guias' || inv === 'até R$ 500') return 'guias';
    if (procura !== 'nao-sei') return procura;
    if (inv === 'de R$ 500 a R$ 1.500') return 'consultoria';
    if (inv === 'ainda não sei') return 'consultoria';
    return 'roteiro';
  }

  function finish() {
    const rec = recomendar();
    const s = cfg.servicos[rec];
    const nome = val('nome');
    const linhas = [
      `Olá! ${nome ? 'Sou ' + nome + ' e ' : ''}fiz o diagnóstico no site da Mel Rolan.`,
      `Procuro: ${form.querySelector('input[name="procura"]:checked').parentElement.textContent.trim()}`,
      `Viagem: ${val('quando')}`,
      `Quem viaja: ${val('quem')}${val('idades') ? ' (crianças: ' + val('idades') + ')' : ''}`,
      `Investimento nos serviços: ${val('investimento')}`,
      `Indicação do site: ${s.nome}`,
    ];
    if (val('obs')) linhas.push(`Observação: ${val('obs')}`);
    const origem = window.mrOrigem ? window.mrOrigem() : '';
    if (origem) linhas.push(`Ref.: site · ${origem}`);
    const waLink = `${cfg.whatsapp}?text=${encodeURIComponent(linhas.join('\n'))}`;

    const guiaExtra =
      rec === 'guias'
        ? `<p>Para quem quer planejar com autonomia, os guias digitais trazem a curadoria completa da Mel, com acesso imediato.</p>
           <div class="actions"><a class="btn" href="${s.pagina}" data-cta="diagnostico-resultado-guias">Ver os guias</a>
           <a class="btn btn-ghost" href="${waLink}" data-wa="diagnostico-guias">Tirar uma dúvida no WhatsApp</a></div>`
        : `<p>Continue a conversa no WhatsApp: a mensagem já vai com as suas respostas, para você não precisar repetir nada.</p>
           <div class="actions"><a class="btn" href="${waLink}" data-wa="diagnostico-${rec}">Continuar no WhatsApp</a>
           <a class="btn btn-ghost" href="${s.pagina}">Conhecer ${s.nome.toLowerCase()}</a></div>`;

    result.innerHTML = `
      <p class="eyebrow">A indicação para a sua viagem</p>
      <h2>${s.nome}</h2>
      <p class="price">${s.preco}</p>
      ${guiaExtra}
      <p class="small">Atendimento em português, direto de Paris.</p>`;
    const lead = JSON.stringify({
      metodo: 'diagnostico',
      indicacao: rec,
      faixa_investimento: val('investimento'),
      qualificado: qualificado(),
      prazo_viagem: val('quando'),
      perfil_viagem: val('quem'),
    });
    result.querySelectorAll('a[data-wa]').forEach((a) => { a.dataset.lead = lead; a.dataset.servico = rec; });
    form.hidden = true;
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
    track('diagnostico_conclusao', {
      indicacao: rec,
      faixa_investimento: val('investimento'),
      procura: val('procura'),
      qualificado: qualificado(),
      prazo_viagem: val('quando'),
      perfil_viagem: val('quem'),
    });
  }

  form.addEventListener('change', () => {
    toggleConditional();
    if (!started) { started = true; track('diagnostico_inicio'); }
  });
  next.addEventListener('click', () => {
    if (!valid(i)) { error.hidden = false; return; }
    if (i < steps.length - 1) { i += 1; show(i); track('diagnostico_etapa', { etapa: i + 1 }); } else { finish(); }
  });
  back.addEventListener('click', () => { if (i > 0) { i -= 1; show(i); } });
  show(0);
})();
