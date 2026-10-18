// Pixel do TikTok: espelho do mesmo ponto de disparo do GA4 (track). Só existe depois do consentimento de publicidade.
// Sem dado pessoal: só slugs, categorias e ids do fluxo. Todo evento leva event_id único (deduplicação futura com a Events API).
// Fluxo: o clique no WhatsApp do resultado vira SubmitForm (generate_lead) e não Contact; conclusão nunca é lead.
function tiktok(nome, params) {
  if (INTERNO || !TT_ID || !OFICIAL) return;
  var it = (params.items || [])[0] || {};
  var fluxo = {
    flow: params.flow,
    flow_run_id: params.flow_run_id,
    result_id: params.result_id,
    lead_method: params.lead_method,
    lead_source: params.lead_source,
  };
  var ev = null;
  if (nome === 'view_item')
    ev = ['ViewContent', { content_id: it.item_id, content_type: 'product', content_name: it.item_name, value: params.value, currency: params.currency }];
  else if (nome === 'clique_cta') ev = ['ClickButton', { content_name: params.origem }];
  else if (nome === 'whatsapp_click') {
    if (!params.origin_flow) ev = ['Contact', { method: 'whatsapp' }];
  } else if (nome === 'email_click') ev = ['Contact', { method: 'email' }];
  else if (nome === 'generate_lead') ev = ['SubmitForm', fluxo];
  else if (nome === 'begin_checkout')
    ev = [
      'InitiateCheckout',
      {
        content_type: 'product',
        contents: [{ content_id: it.item_id, content_name: it.item_name, quantity: it.quantity || 1, price: it.price }],
        value: params.value,
        currency: params.currency,
      },
    ];
  else if (nome === 'purchase') ev = ['CompletePayment', { content_type: 'product', value: params.value, currency: params.currency }];
  else if (nome === 'quiz_inicio' || nome === 'quiz_conclusao') ev = [nome.replace('quiz_', 'quiz_tours_'), fluxo];
  else if (nome === 'diagnostico_inicio' || nome === 'diagnostico_conclusao') ev = [nome, fluxo];
  if (!ev) return;
  var d = { nome: ev[0], dados: ev[1], id: uuid() };
  if (ttCarregado) window.ttq.track(d.nome, limpar(d.dados), { event_id: d.id });
  else ttFila.push(d);
}
function limpar(o) {
  var r = {};
  for (var k in o) if (o[k] !== undefined && o[k] !== '') r[k] = o[k];
  return r;
}
function carregarTikTok() {
  if (INTERNO || !TT_ID || !OFICIAL) return;
  if (ttCarregado) {
    window.ttq.grantConsent();
    return;
  }
  ttCarregado = true;
  !(function (w, d, t) {
    w.TiktokAnalyticsObject = t;
    var ttq = (w[t] = w[t] || []);
    ttq.methods = [
      'page',
      'track',
      'identify',
      'instances',
      'debug',
      'on',
      'off',
      'once',
      'ready',
      'alias',
      'group',
      'enableCookie',
      'disableCookie',
      'holdConsent',
      'revokeConsent',
      'grantConsent',
    ];
    ttq.setAndDefer = function (t, e) {
      t[e] = function () {
        t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
      };
    };
    for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
    ttq.instance = function (t) {
      for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
      return e;
    };
    ttq.load = function (e, n) {
      var r = 'https://analytics.tiktok.com/i18n/pixel/events.js';
      ttq._i = ttq._i || {};
      ttq._i[e] = [];
      ttq._i[e]._u = r;
      ttq._t = ttq._t || {};
      ttq._t[e] = +new Date();
      ttq._o = ttq._o || {};
      ttq._o[e] = n || {};
      n = document.createElement('script');
      n.type = 'text/javascript';
      n.async = !0;
      n.src = r + '?sdkid=' + e + '&lib=' + t;
      e = document.getElementsByTagName('script')[0];
      e.parentNode.insertBefore(n, e);
    };
    ttq.holdConsent();
    ttq.load(TT_ID);
    ttq.grantConsent(); // este código só roda depois do aceite de publicidade
    ttq.page();
  })(window, document, 'ttq');
  ttFila.forEach(function (d) {
    window.ttq.track(d.nome, limpar(d.dados), { event_id: d.id });
  });
  ttFila = [];
}
function revogarTikTok() {
  ttFila = [];
  if (ttCarregado) window.ttq.revokeConsent();
}
