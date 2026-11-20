// Checklist "Primeira vez em Paris" (/tiktok/): nome e WhatsApp viram lead no Wix Forms e liberam o PDF na hora.
// Se o Wix falhar, a pessoa recebe o checklist do mesmo jeito (não perdemos a confiança dela); o erro vai para a medição.
(function () {
  const cfg = JSON.parse((document.getElementById('checklist-config') || {}).textContent || 'null');
  const form = document.getElementById('form-checklist');
  if (!cfg || !form) return;
  const erro = form.querySelector('.quiz-error');
  const sucesso = document.querySelector('.tiktok-sucesso');
  const track = (nome, params) => {
    if (window.mrTrack) window.mrTrack(nome, params || {});
  };
  const val = (n) => ((form.elements[n] && form.elements[n].value) || '').trim();

  // WhatsApp em formato internacional (E.164). Sem código de país, assume Brasil (+55). Mesma regra do diagnóstico.
  function telefone() {
    const bruto = val('whatsapp');
    const digitos = bruto.replace(/\D/g, '');
    if (!digitos) return '';
    if (bruto.startsWith('+')) return '+' + digitos;
    if (digitos.startsWith('00')) return '+' + digitos.slice(2);
    if (digitos.length === 10 || digitos.length === 11) return '+55' + digitos;
    return '+' + digitos;
  }

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

  function mostrarErro(texto, campo) {
    erro.textContent = texto;
    erro.hidden = false;
    if (campo) form.elements[campo].focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    erro.hidden = true;
    if (!val('nome')) return mostrarErro('Informe o seu primeiro nome.', 'nome');
    if (!/^\+\d{10,15}$/.test(telefone())) return mostrarErro('Informe um WhatsApp válido, com DDD (ex.: 11 91234-5678).', 'whatsapp');
    const botao = form.querySelector('button[type="submit"]');
    botao.disabled = true;
    const origem = window.mrOrigem ? window.mrOrigem() : '';
    salvarLead({
      nome: val('nome'),
      whatsapp: telefone(),
      procura: cfg.procura,
      indicacao: cfg.procura,
      origem: ['tiktok', origem].filter(Boolean).join(' · '),
    })
      .then((ok) => {
        if (ok) track('generate_lead', { lead_method: 'formulario', lead_source: 'checklist_tiktok' });
      })
      .catch((err) => {
        console.warn('Lead do checklist não foi salvo:', err.message);
        track('lead_erro', { metodo: 'checklist_tiktok' });
      })
      .finally(() => {
        form.hidden = true;
        sucesso.hidden = false;
        sucesso.querySelector('a[download]').focus();
      });
  });
})();
