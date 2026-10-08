// Diagnóstico da viagem: 6 etapas, recomendação, lead salvo no Wix e WhatsApp pré-preenchido.
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

  const val = (name) => {
    const els = form.querySelectorAll(`[name="${name}"]`);
    if (els.length && els[0].type === 'checkbox') return [...els].filter((e) => e.checked).map((e) => e.value).join(', ');
    return (form.elements[name] && form.elements[name].value || '').trim();
  };
  const lista = (name) => [...form.querySelectorAll(`input[name="${name}"]:checked`)].map((e) => e.value);
  const labelOf = (name) =>
    [...form.querySelectorAll(`input[name="${name}"]:checked`)].map((el) => el.parentElement.textContent.trim()).join('; ');

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
    const radios = step.querySelectorAll('input[type="radio"], input[type="checkbox"]');
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

  // Recomendação: combina o que a pessoa quer, o orçamento e o estilo de viagem.
  // Devolve { principal, complemento, motivo } com ids de serviço (tours, roteiro, consultoria, guias).
  function recomendar() {
    const quer = lista('procura');
    const estilo = lista('estilo');
    const inv = val('investimento');
    const faixa = { 'até R$ 500': 0, 'de R$ 500 a R$ 1.000': 1, 'de R$ 1.000 a R$ 3.000': 2, 'acima de R$ 3.000': 3, 'ainda não sei': -1 }[inv];
    const q = (id) => quer.includes(id);
    const indeciso = !quer.length || (q('nao-sei') && quer.length === 1);
    let principal;
    let complemento = null;

    if (faixa === 0) {
      principal = 'guias';
    } else if (q('roteiro') && val('quando') === 'daqui a mais de 12 meses' && faixa >= 2) {
      // Viagem a 12 meses ou mais, com orçamento: a consultoria define destinos e dias agora; o roteiro vem mais perto da data.
      principal = 'consultoria';
      complemento = 'roteiro';
    } else if (q('roteiro') || (indeciso && faixa >= 2)) {
      principal = faixa === 1 ? 'consultoria' : 'roteiro';
      if (faixa === 3 || q('tours')) complemento = 'tours';
    } else if (q('consultoria')) {
      principal = 'consultoria';
      if (faixa >= 3 || q('tours')) complemento = 'tours';
    } else if (q('tours')) {
      principal = 'tours';
      if (faixa >= 2 && (estilo.includes('primeira vez') || estilo.includes('outras cidades'))) complemento = 'consultoria';
      else if (q('guias')) complemento = 'guias';
    } else if (q('guias')) {
      principal = 'guias';
      if (faixa >= 2) complemento = 'consultoria';
    } else {
      principal = 'consultoria';
      if (faixa === 3) complemento = 'tours';
    }
    if (complemento === principal) complemento = null;
    // Quem contrata roteiro ou consultoria não precisa do guia como complemento.
    if (complemento === 'guias' && (principal === 'roteiro' || principal === 'consultoria')) complemento = null;
    return { principal, complemento };
  }

  const textos = {
    tours: 'Passeios privativos a pé, em português, no ritmo do seu grupo.',
    roteiro: 'A viagem inteira desenhada dia a dia, com tudo pensado para quem vai viajar.',
    consultoria: 'Uma conversa por vídeo com a Mel no ponto em que a sua viagem estiver: definir destinos e dias, tirar dúvidas ou validar o que já foi planejado.',
    guias: 'A curadoria da Mel em PDF, com acesso imediato, para planejar com autonomia.',
  };

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
    const recs = recomendar();
    const rec = recs.principal;
    const s = cfg.servicos[rec];
    const c = recs.complemento ? cfg.servicos[recs.complemento] : null;
    const indicacao = c ? `${s.nome} + ${c.nome}` : s.nome;
    const nome = val('nome');
    const quem = `${val('quem')}${val('idades') ? ' (crianças: ' + val('idades') + ')' : ''}`;
    const origem = window.mrOrigem ? window.mrOrigem() : '';
    const linhas = [
      `Olá! ${nome ? 'Sou ' + nome + ' e ' : ''}fiz o diagnóstico no site da Mel Rolan.`,
      `Procuro: ${labelOf('procura')}`,
      `Viagem: ${val('quando')}`,
      `Quem viaja: ${quem}`,
      `Estilo: ${labelOf('estilo')}`,
      `Investimento nos serviços: ${val('investimento')}`,
      `Diagnóstico do site: ${indicacao}`,
    ];
    if (val('obs')) linhas.push(`Observação: ${val('obs')}`);
    const waLink = `${cfg.whatsapp}?text=${encodeURIComponent(linhas.join('\n'))}`;

    const guiaExtra =
      rec === 'guias'
        ? `<p>Para quem quer planejar com autonomia, os guias digitais trazem a curadoria completa da Mel, com acesso imediato.</p>
           <div class="actions"><a class="btn" href="${s.pagina}" data-cta="diagnostico-resultado-guias">Ver os guias</a>
           <a class="btn btn-ghost" href="${waLink}" data-wa="diagnostico-guias">Tirar uma dúvida no WhatsApp</a></div>`
        : `<p>Suas respostas já chegaram para a nossa equipe. Se quiser adiantar, continue a conversa agora pelo WhatsApp: a mensagem já vai com tudo o que você respondeu.</p>
           <div class="actions"><a class="btn" href="${waLink}" data-wa="diagnostico-${rec}">Continuar no WhatsApp</a>
           <a class="btn btn-ghost" href="${s.pagina}">Conhecer ${s.nome.toLowerCase()}</a></div>`;

    const extraTour = (recs.principal === 'tours' || recs.complemento === 'tours') && cfg.quizTour
      ? `<p class="small">Quer descobrir qual tour tem mais a ver com você? <a href="${cfg.quizTour}" data-cta="diagnostico-quiz-tour">Faça o quiz do tour ideal</a>.</p>`
      : '';
    const blocoComplemento = c
      ? `<div class="result-extra"><p class="eyebrow">Para completar</p><h3>${c.nome}</h3><p>${textos[recs.complemento]}</p><p class="price">${c.preco}</p><a href="${c.pagina}">Conhecer ${c.nome.toLowerCase()}</a></div>`
      : '';
    result.innerHTML = `
      <p class="eyebrow">A indicação para a sua viagem</p>
      <h2>${s.nome}</h2>
      <p>${textos[rec]}</p>
      <p class="price">${s.preco}</p>
      ${blocoComplemento}
      ${guiaExtra}
      ${extraTour}
      <p class="small">Atendimento em português, direto de Paris.</p>`;

    const params = {
      metodo: 'diagnostico',
      indicacao: recs.complemento ? `${rec}+${recs.complemento}` : rec,
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
      quem_viaja: quem + (val('estilo') ? ' · estilo: ' + labelOf('estilo') : ''),
      investimento: val('investimento'),
      indicacao,
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
