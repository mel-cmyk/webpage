// Consentimento de cookies (CNIL/LGPD), medição com o Google Analytics 4 e publicidade (remarketing).
// Duas finalidades, escolhidas separadamente: medição (analytics_storage) e publicidade
// (ad_storage, ad_user_data, ad_personalization). O Google só é carregado depois de uma escolha
// que aceite ao menos uma delas, e só no domínio oficial (o endereço de teste mostra o aviso, mas não envia dados).
(function () {
  var GA_ID = 'G-L71ZP46QX2';
  var KEY = 'mr_consent'; // mesma chave usada nas páginas de venda dos guias
  var VALIDADE = 182 * 24 * 60 * 60 * 1000; // a escolha vale 6 meses, depois perguntamos de novo
  // REGRA ÚNICA DE ENVIO: onde o Google (GA4 e Google Ads) pode receber dados.
  // - Domínio oficial (melrolan.com.br): todas as páginas.
  // - Endereço de teste (mel-cmyk.github.io/webpage): só as páginas que recebem anúncios, para validar a medição
  //   antes da troca de domínio. Quando o site passar a ser servido só pelo domínio oficial, apague a linha
  //   TESTE e use PROD = OFICIAL. A lista de páginas deve acompanhar PAGINAS_ANUNCIOS em src/layout.mjs.
  var OFICIAL = /(^|\.)melrolan\.com\.br$/.test(location.hostname);
  var TESTE = location.hostname === 'mel-cmyk.github.io' && /^\/webpage\/($|(guias|guias-de-paris|tours-em-paris|roteiro-sob-medida|consultoria|diagnostico|qual-tour-combina-com-voce)\/)/.test(location.pathname);
  var PROD = OFICIAL || TESTE;
  var carregado = false;
  var fila = [];

  // Páginas que podem receber anúncios (body[data-medicao="avancada"]: guias, início, tours, quiz, roteiro, consultoria,
  // diagnóstico e guias de Paris): Consent Mode avançado. A tag do Google carrega desde o início, com tudo negado por
  // padrão (sem cookies, só sinais de uso sem cookies), e passa a usar cookies se a pessoa aceitar.
  // As demais páginas (privacidade, aviso legal, sobre, parcerias) carregam o Google só depois do aceite.
  var AVANCADO = document.body.dataset.medicao === 'avancada';
  var ADS_ID = 'AW-17904451325';
  var META_ID = document.body.dataset.metaPixel || ''; // pixel da Meta: só nas páginas que o declaram e só com consentimento de publicidade
  var LOJA = 'loja.melrolan.com.br';
  var PARAMS_LOJA = /^(gclid|gbraid|wbraid|fbclid|utm_[a-z0-9_]+)$/i;
  var metaCarregado = false;
  var metaFila = [];

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  var padrao = {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  };
  if (AVANCADO) padrao.wait_for_update = 500; // dá meio segundo para a escolha guardada chegar antes do primeiro envio
  gtag('consent', 'default', padrao);
  if (AVANCADO) gtag('set', 'url_passthrough', true);

  // Escolha guardada: { analytics: bool, ads: bool } ou null (nunca escolheu, expirou ou veio de versão antiga sem a finalidade de publicidade).
  function lerEscolha() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (s && typeof s.ads === 'boolean' && Date.now() - (s.timestamp || 0) < VALIDADE) return { analytics: s.status === 'granted', ads: s.ads };
    } catch (e) {}
    return null;
  }
  // status continua 'granted' / 'denied' para a medição, no mesmo formato das páginas de venda dos guias.
  function salvarEscolha(e) {
    try { localStorage.setItem(KEY, JSON.stringify({ status: e.analytics ? 'granted' : 'denied', ads: e.ads, date: new Date().toISOString(), timestamp: Date.now() })); } catch (err) {}
  }
  function aplicarConsentimento(e) {
    var a = e.ads ? 'granted' : 'denied';
    gtag('consent', 'update', {
      analytics_storage: e.analytics ? 'granted' : 'denied',
      ad_storage: a,
      ad_user_data: a,
      ad_personalization: a,
    });
    if (META_ID) { if (e.ads) carregarMeta(); else if (metaCarregado) window.fbq('consent', 'revoke'); }
  }

  // Eventos: ficam na fila até o GA ser carregado (se nunca for, nada é enviado).
  function track(nome, params) {
    params = normalizar(params || {});
    if (carregado) gtag('event', nome, params);
    else fila.push([nome, params]);
    meta(nome, params);
  }
  window.mrTrack = track;

  // Itens com valido_ate: se a promoção venceu com a página aberta, vale o preco_normal.
  // Os dois campos auxiliares não vão para o Google.
  function normalizar(params) {
    if (!params.items || !params.items.some(function (it) { return it.valido_ate; })) return params;
    var total = 0, mudou = false;
    var itens = params.items.map(function (it) {
      if (!it.valido_ate) { total += (it.price || 0) * (it.quantity || 1); return it; }
      var c = {};
      for (var k in it) c[k] = it[k];
      if (Date.now() >= Date.parse(it.valido_ate)) { c.price = it.preco_normal; mudou = true; }
      delete c.valido_ate; delete c.preco_normal;
      total += (c.price || 0) * (c.quantity || 1);
      return c;
    });
    var p = {};
    for (var k in params) p[k] = params[k];
    p.items = itens;
    if (mudou && p.value != null) p.value = total;
    return p;
  }

  // Pixel da Meta: só existe depois do consentimento de publicidade.
  function meta(nome, params) {
    var map = { view_item: 'ViewContent', begin_checkout: 'InitiateCheckout' };
    if (!META_ID || !map[nome]) return;
    var it = (params.items || [])[0] || {};
    var dados = ['track', map[nome], { content_name: it.item_name, content_ids: [it.item_id], content_type: 'product', value: params.value, currency: params.currency }];
    if (metaCarregado) window.fbq.apply(window, dados);
    else metaFila.push(dados);
  }
  function carregarMeta() {
    if (metaCarregado || !OFICIAL || !META_ID) return; // pixel da Meta só no domínio oficial
    metaCarregado = true;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('set', 'autoConfig', false, META_ID);
    window.fbq('init', META_ID);
    window.fbq('track', 'PageView');
    metaFila.forEach(function (d) { window.fbq.apply(window, d); });
    metaFila = [];
  }

  // Leva gclid, gbraid, wbraid, fbclid e UTMs da visita pelos links do site, da loja e do WhatsApp (neste, na linha "Ref.").
  // Só usa o endereço da página atual: nada é gravado, então funciona mesmo com cookies recusados.
  // Roda no clique, antes da navegação.
  function decorarLink(a) {
    try {
      var h = a.getAttribute('href') || '';
      if (!h || h.charAt(0) === '#' || !/^(https?:)?\/\/|^\/|^[a-z0-9]/i.test(h)) return;
      var u = new URL(a.href);
      if (u.hostname === 'wa.me') {
        var origem = window.mrOrigem();
        if (!origem) return;
        var m = /[?&]text=([^&]*)/.exec(u.search);
        var t = m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : 'Olá! Vim pelo site da Mel Rolan.';
        if (t.indexOf('Ref.:') !== -1) return;
        u.search = '?text=' + encodeURIComponent(t + '\nRef.: site · ' + origem);
        a.href = u.toString();
        return;
      }
      if (u.hostname !== LOJA && u.hostname !== location.hostname) return;
      var mudou = false;
      new URLSearchParams(location.search).forEach(function (v, k) { if (PARAMS_LOJA.test(k)) { u.searchParams.set(k, v); mudou = true; } });
      if (mudou) a.href = u.toString();
    } catch (e) {}
  }

  function carregarGA() {
    if (carregado || !PROD) return;
    carregado = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    if (AVANCADO) {
      gtag('config', GA_ID, { linker: { domains: ['melrolan.com.br', 'www.melrolan.com.br', LOJA], accept_incoming: true } });
      gtag('config', ADS_ID);
    } else gtag('config', GA_ID);
    fila.forEach(function (e) { gtag('event', e[0], e[1]); });
    fila = [];
  }

  function apagarCookiesGA() {
    document.cookie.split(';').forEach(function (c) {
      var nome = c.split('=')[0].trim();
      if (/^(_ga|_gid|_gat|_gcl_|_gac_)/.test(nome)) {
        ['', '; domain=.melrolan.com.br', '; domain=' + location.hostname].forEach(function (d) {
          document.cookie = nome + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
        });
      }
    });
  }

  // Origem da visita (Google, Instagram, anúncio...).
  // Pelos parâmetros do endereço (UTMs, gclid...), que vão de página em página pelos links do site. Não grava nada.
  function origemDaUrl() {
    var q = new URLSearchParams(location.search);
    return q.get('utm_source') ? q.get('utm_source') + (q.get('utm_medium') ? ' / ' + q.get('utm_medium') : '') + (q.get('utm_campaign') ? ' / ' + q.get('utm_campaign') : '')
      : (q.get('gclid') || q.get('gbraid') || q.get('wbraid')) ? 'google / anuncio'
      : q.get('fbclid') ? 'meta'
      : '';
  }
  // Com consentimento de medição, a origem da primeira página da visita (inclui quem veio do Instagram, do Google etc.)
  // fica guardada só durante a visita.
  function registrarOrigem() {
    try {
      if (sessionStorage.getItem('mr_origem')) return;
      var origem = origemDaUrl()
        || (document.referrer && new URL(document.referrer).hostname.indexOf('melrolan.com.br') === -1 ? new URL(document.referrer).hostname.replace(/^www\./, '').replace(/^l\./, '').replace(/^lm\./, '') : '');
      if (origem) sessionStorage.setItem('mr_origem', origem);
    } catch (e) {}
  }
  window.mrOrigem = function () {
    try { var e = lerEscolha(); var g = e && e.analytics ? sessionStorage.getItem('mr_origem') : ''; return g || origemDaUrl(); } catch (er) { return origemDaUrl(); }
  };

  // Aviso de cookies
  var banner = document.getElementById('cookie-banner');
  function mostrarAviso(v) {
    if (!banner) return;
    banner.hidden = !v;
    document.body.classList.toggle('cookie-aberto', v);
  }
  function marcarOpcoes(e) {
    var m = document.getElementById('consent-medicao'), p = document.getElementById('consent-anuncios');
    if (m) m.checked = !!(e && e.analytics);
    if (p) p.checked = !!(e && e.ads);
  }
  function expandirOpcoes(v) {
    var o = document.getElementById('cookie-opcoes'), m = document.getElementById('cookie-mais'), s = document.getElementById('cookie-salvar');
    if (o) o.hidden = !v;
    if (m) m.hidden = v;
    if (s) s.hidden = !v;
  }
  function escolher(modo) {
    var e = modo === 'all' ? { analytics: true, ads: true }
      : modo === 'none' ? { analytics: false, ads: false }
      : { analytics: !!(document.getElementById('consent-medicao') || {}).checked, ads: !!(document.getElementById('consent-anuncios') || {}).checked };
    salvarEscolha(e);
    mostrarAviso(false);
    expandirOpcoes(false);
    aplicarConsentimento(e);
    if (e.analytics) registrarOrigem();
    else { try { sessionStorage.removeItem('mr_origem'); } catch (err) {} }
    if (e.analytics || e.ads) carregarGA();
    if (!e.analytics || !e.ads) apagarCookiesGA();
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-consent]');
    if (b) { if (b.dataset.consent === 'more') { expandirOpcoes(true); return; } escolher(b.dataset.consent); return; }
    if (e.target.closest('[data-cookie-prefs]')) { marcarOpcoes(lerEscolha()); expandirOpcoes(true); mostrarAviso(true); return; }

    var a = e.target.closest('a');
    if (!a) return;
    decorarLink(a);
    var servico = document.body.dataset.servico || 'geral';
    var extra = {};
    try { if (a.dataset.lead) extra = JSON.parse(a.dataset.lead); } catch (err) {}

    if (a.dataset.wa) {
      // whatsapp_click: todo clique no WhatsApp (evento-chave já usado na propriedade).
      // generate_lead é disparado pelo diagnóstico, quando o lead é salvo no Wix (diagnostico.js).
      var p = { origem: a.dataset.wa, servico: a.dataset.servico || servico };
      for (var k in extra) p[k] = extra[k];
      track('whatsapp_click', p);
    } else if (a.dataset.checkout) {
      // O link já foi decorado acima. As páginas abrem a loja em nova aba, então o evento não se perde.
      var g = JSON.parse(a.dataset.checkout);
      var p = { currency: 'BRL', value: g.price * (g.quantity || 1), items: [g] };
      if (a.dataset.slot) p.creative_slot = a.dataset.slot;
      track('begin_checkout', p);
    } else if (a.dataset.item) {
      track('select_item', { item_list_name: 'tours', items: [JSON.parse(a.dataset.item)] });
    } else if (a.dataset.contato) {
      track(a.dataset.contato === 'email' ? 'email_click' : 'instagram_click', { origem: 'rodape' });
    } else if (a.dataset.download) {
      track('bonus_download', { bonus: a.dataset.download });
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
  if (escolha) {
    aplicarConsentimento(escolha);
    if (escolha.analytics) registrarOrigem();
    if (escolha.analytics || escolha.ads) carregarGA();
  } else { marcarOpcoes(null); expandirOpcoes(false); mostrarAviso(true); }
  if (AVANCADO) carregarGA();
})();
