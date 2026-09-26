// Consentimento de cookies (CNIL/LGPD) e medição com o Google Analytics 4.
// O GA só é carregado depois que a pessoa clica em "Aceitar", e só no domínio oficial
// (o endereço de teste mostra o aviso, mas não envia dados).
(function () {
  var GA_ID = 'G-L71ZP46QX2';
  var KEY = 'mr_consent'; // mesma chave usada nas páginas de venda dos guias
  var VALIDADE = 182 * 24 * 60 * 60 * 1000; // a escolha vale 6 meses, depois perguntamos de novo
  var PROD = /(^|\.)melrolan\.com\.br$/.test(location.hostname);
  var carregado = false;
  var fila = [];

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });

  function lerEscolha() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (s && (s.status === 'granted' || s.status === 'denied') && Date.now() - (s.timestamp || 0) < VALIDADE) return s.status;
    } catch (e) {}
    return null;
  }
  function salvarEscolha(status) {
    try { localStorage.setItem(KEY, JSON.stringify({ status: status, date: new Date().toISOString(), timestamp: Date.now() })); } catch (e) {}
  }

  // Eventos: ficam na fila até o GA ser carregado (se nunca for, nada é enviado).
  function track(nome, params) {
    if (carregado) gtag('event', nome, params || {});
    else fila.push([nome, params || {}]);
  }
  window.mrTrack = track;

  function carregarGA() {
    if (carregado || !PROD) return;
    carregado = true;
    gtag('consent', 'update', { analytics_storage: 'granted' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID);
    fila.forEach(function (e) { gtag('event', e[0], e[1]); });
    fila = [];
  }

  function apagarCookiesGA() {
    document.cookie.split(';').forEach(function (c) {
      var nome = c.split('=')[0].trim();
      if (/^_ga/.test(nome)) {
        ['', '; domain=.melrolan.com.br', '; domain=' + location.hostname].forEach(function (d) {
          document.cookie = nome + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
        });
      }
    });
  }

  // Origem da visita (Google, Instagram, anúncio...), guardada só durante a visita e só com consentimento.
  function registrarOrigem() {
    try {
      if (sessionStorage.getItem('mr_origem')) return;
      var q = new URLSearchParams(location.search);
      var origem = q.get('utm_source') ? q.get('utm_source') + (q.get('utm_medium') ? ' / ' + q.get('utm_medium') : '') + (q.get('utm_campaign') ? ' / ' + q.get('utm_campaign') : '')
        : q.get('gclid') ? 'google / anuncio'
        : q.get('fbclid') ? 'meta'
        : document.referrer && new URL(document.referrer).hostname.indexOf('melrolan.com.br') === -1 ? new URL(document.referrer).hostname.replace(/^www\./, '').replace(/^l\./, '').replace(/^lm\./, '')
        : '';
      if (origem) sessionStorage.setItem('mr_origem', origem);
    } catch (e) {}
  }
  window.mrOrigem = function () {
    try { return lerEscolha() === 'granted' ? sessionStorage.getItem('mr_origem') || '' : ''; } catch (e) { return ''; }
  };

  // Aviso de cookies
  var banner = document.getElementById('cookie-banner');
  function mostrarAviso(v) {
    if (!banner) return;
    banner.hidden = !v;
    document.body.classList.toggle('cookie-aberto', v);
  }
  function escolher(status) {
    salvarEscolha(status);
    mostrarAviso(false);
    if (status === 'granted') { registrarOrigem(); carregarGA(); }
    else {
      if (carregado) gtag('consent', 'update', { analytics_storage: 'denied' });
      apagarCookiesGA();
      try { sessionStorage.removeItem('mr_origem'); } catch (e) {}
    }
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-consent]');
    if (b) { escolher(b.dataset.consent); return; }
    if (e.target.closest('[data-cookie-prefs]')) { mostrarAviso(true); return; }

    var a = e.target.closest('a');
    if (!a) return;
    var servico = document.body.dataset.servico || 'geral';
    var extra = {};
    try { if (a.dataset.lead) extra = JSON.parse(a.dataset.lead); } catch (err) {}

    if (a.dataset.wa) {
      // whatsapp_click: todo clique no WhatsApp (evento-chave já usado na propriedade).
      // generate_lead: só quando o clique vem do resultado do diagnóstico (lead com as respostas).
      var p = { origem: a.dataset.wa, servico: a.dataset.servico || servico };
      for (var k in extra) p[k] = extra[k];
      track('whatsapp_click', p);
      if (extra.metodo === 'diagnostico') track('generate_lead', p);
    } else if (a.dataset.checkout) {
      var g = JSON.parse(a.dataset.checkout);
      track('begin_checkout', { currency: 'BRL', value: g.price, items: [g] });
    } else if (a.dataset.item) {
      track('select_item', { item_list_name: 'tours', items: [JSON.parse(a.dataset.item)] });
    } else if (a.dataset.contato) {
      track(a.dataset.contato === 'email' ? 'email_click' : 'instagram_click', { origem: 'rodape' });
    } else if (a.dataset.cta) {
      track('clique_cta', { origem: a.dataset.cta });
    }
  });

  // Eventos da própria página (ex.: visualização de um tour)
  var pagina = document.getElementById('ga-page');
  if (pagina) {
    try { JSON.parse(pagina.textContent).forEach(function (ev) { track(ev.name, ev.params); }); } catch (e) {}
  }

  var escolha = lerEscolha();
  if (escolha === 'granted') { registrarOrigem(); carregarGA(); }
  else if (escolha === null) mostrarAviso(true);
})();
