// Diagnóstico da viagem: 5 etapas, recomendação, lead salvo no Wix e WhatsApp pré-preenchido.
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
  const labelOf = (name) => {
    const el = form.querySelector(`input[name="${name}"]:checked`);
    return el ? el.parentElement.textContent.trim() : '';
  };

  // WhatsApp em formato internacional (E.164). Sem código de país, assume Brasil (+55).
  function telefone() {
    const bruto = val('whatsapp');
    const digitos = bruto.replace(/\D/g, '');
    if (!digitos) return '';
    if (bruto.trim().startsWith('+')) return '+' + digitos;
    if (digitos.startsWith('00')) return '+' + digitos.slice(2);
    if (digitos.length === 10 || digitos.length === 11) return '+55' + digitos;
    return '+' + digitos;
  }
  const telefoneValido = () => /^\+\d{10,15}$/.test(telefone());

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
    const step = steps[n];
    const radios = step.querySelectorAll('input[type="radio"]');
    if (radios.length && ![...radios].some((r) => r.checked)) {
      error.textContent = 'Escolha uma opção para continuar.';
      return false;
    }
    if (step.querySelector('[name="whatsapp"]')) {
      if (!val('nome')) { error.textContent = 'Informe o seu primeiro nome.'; form.elements.nome.focus(); return false; }
      if (!telefoneValido()) { error.textContent = 'Informe um WhatsApp válido, com DDD (ex.: 11 91234-5678).'; form.elements.whatsapp.focus(); return false; }
    }
    return true;
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

  // Salva o lead no Wix Forms (vira submissão no painel e contato no CRM), com um token anônimo de visitante.
  // Não bloqueia a pessoa: se falhar, o resultado e o WhatsApp continuam funcionando.
  async function salvarLead(valores) {
    const w = cfg.wix;
    if (!w || !w.clientId || !w.formId) return false;
    const t = await fetch('https://www.wixapis.com/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId: w.clientId, grantType: 'anonymous' }),
    });
    if (!t.ok) throw new Error('token ' + t.status);
    const { access_token: token } = await t.json();
    const submissions = {};
    for (const [chave, valor] of Object.entries(valores)) {
      if (valor && w.campos[chave]) submissions[w.campos[chave]] = valor;
    }
    const r = await fetch('https://www.wixapis.com/form-submission-service/v4/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: token },
      body: JSON.stringify({ submission: { formId: w.formId, submissions } }),
    });
    if (!r.ok) throw new Error('submissão ' + r.status);
    return true;
  }

  function finish() {
    const rec = recomendar();
    const s = cfg.servicos[rec];
    const nome = val('nome');
    const quem = `${val('quem')}${val('idades') ? ' (crianças: ' + val('idades') + ')' : ''}`;
    const origem = window.mrOrigem ? window.mrOrigem() : '';
    const linhas = [
      `Olá! ${nome ? 'Sou ' + nome + ' e ' : ''}fiz o diagnóstico no site da Mel Rolan.`,
      `Procuro: ${labelOf('procura')}`,
      `Viagem: ${val('quando')}`,
      `Quem viaja: ${quem}`,
      `Investimento nos serviços: ${val('investimento')}`,
      `Indicação do site: ${s.nome}`,
    ];
    if (val('obs')) linhas.push(`Observação: ${val('obs')}`);
    if (origem) linhas.push(`Ref.: site · ${origem}`);
    const waLink = `${cfg.whatsapp}?text=${encodeURIComponent(linhas.join('\n'))}`;

    const guiaExtra =
      rec === 'guias'
        ? `<p>Para quem quer planejar com autonomia, os guias digitais trazem a curadoria completa da Mel, com acesso imediato.</p>
           <div class="actions"><a class="btn" href="${s.pagina}" data-cta="diagnostico-resultado-guias">Ver os guias</a>
           <a class="btn btn-ghost" href="${waLink}" data-wa="diagnostico-guias">Tirar uma dúvida no WhatsApp</a></div>`
        : `<p>Suas respostas já chegaram para a nossa equipe. Se quiser adiantar, continue a conversa agora pelo WhatsApp: a mensagem já vai com tudo o que você respondeu.</p>
           <div class="actions"><a class="btn" href="${waLink}" data-wa="diagnostico-${rec}">Continuar no WhatsApp</a>
           <a class="btn btn-ghost" href="${s.pagina}">Conhecer ${s.nome.toLowerCase()}</a></div>`;

    result.innerHTML = `
      <p class="eyebrow">A indicação para a sua viagem</p>
      <h2>${s.nome}</h2>
      <p class="price">${s.preco}</p>
      ${guiaExtra}
      <p class="small">Atendimento em português, direto de Paris.</p>`;

    const params = {
      metodo: 'diagnostico',
      indicacao: rec,
      faixa_investimento: val('investimento'),
      qualificado: qualificado(),
      prazo_viagem: val('quando'),
      perfil_viagem: val('quem'),
    };
    result.querySelectorAll('a[data-wa]').forEach((a) => { a.dataset.lead = JSON.stringify(params); a.dataset.servico = rec; });
    form.hidden = true;
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
    track('diagnostico_conclusao', Object.assign({ procura: val('procura') }, params));

    // Sem nome ou WhatsApp no GA: só as respostas de múltipla escolha vão para a medição.
    salvarLead({
      nome,
      whatsapp: telefone(),
      procura: labelOf('procura'),
      quando: val('quando'),
      quem_viaja: quem,
      investimento: val('investimento'),
      indicacao: s.nome,
      observacao: val('obs'),
      origem,
    })
      .then((ok) => { if (ok) track('generate_lead', Object.assign({ servico: rec }, params)); })
      .catch((e) => { console.warn('Lead do diagnóstico não foi salvo:', e.message); track('lead_erro', { metodo: 'diagnostico' }); });
  }

  form.addEventListener('change', () => {
    toggleConditional();
    if (!started) { started = true; track('diagnostico_inicio'); }
  });
  next.addEventListener('click', () => {
    if (!valid(i)) { error.hidden = false; return; }
    if (i < steps.length - 1) { i += 1; show(i); track('diagnostico_etapa', { etapa: i + 1 }); } else { next.disabled = true; finish(); }
  });
  back.addEventListener('click', () => { if (i > 0) { i -= 1; show(i); } });
  form.addEventListener('submit', (e) => { e.preventDefault(); next.click(); });
  show(0);
})();
