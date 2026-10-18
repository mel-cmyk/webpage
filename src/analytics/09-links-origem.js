// Leva gclid, gbraid, wbraid, fbclid e UTMs da visita pelos links do site e da loja. O WhatsApp não recebe nada: a mensagem fica limpa.
// Só usa o endereço da página atual: nada é gravado, então funciona mesmo com cookies recusados.
// Roda no clique, antes da navegação.
function decorarLink(a) {
  try {
    var h = a.getAttribute('href') || '';
    if (!h || h.charAt(0) === '#' || !/^(https?:)?\/\/|^\/|^[a-z0-9]/i.test(h)) return;
    var u = new URL(a.href);
    if (u.hostname !== LOJA && u.hostname !== location.hostname) return;
    var mudou = false;
    new URLSearchParams(location.search).forEach(function (v, k) {
      if (PARAMS_LOJA.test(k)) {
        u.searchParams.set(k, v);
        mudou = true;
      }
    });
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
  var cfg = INTERNO ? { traffic_type: 'internal' } : {};
  if (AVANCADO) {
    cfg.linker = { domains: ['melrolan.com.br', 'www.melrolan.com.br', LOJA], accept_incoming: true };
    gtag('config', GA_ID, cfg);
    gtag('config', ADS_ID);
  } else gtag('config', GA_ID, cfg);
  fila.forEach(function (e) {
    gtag('event', e[0], e[1]);
  });
  fila = [];
}

function apagarCookiesGA() {
  document.cookie.split(';').forEach(function (c) {
    var nome = c.split('=')[0].trim();
    if (/^(_ga|_gid|_gat|_gcl_|_gac_|_clck|_clsk)/.test(nome)) {
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
  return q.get('utm_source')
    ? q.get('utm_source') + (q.get('utm_medium') ? ' / ' + q.get('utm_medium') : '') + (q.get('utm_campaign') ? ' / ' + q.get('utm_campaign') : '')
    : q.get('gclid') || q.get('gbraid') || q.get('wbraid')
      ? 'google / anuncio'
      : q.get('fbclid')
        ? 'meta'
        : '';
}
// Com consentimento de medição, a origem da primeira página da visita (inclui quem veio do Instagram, do Google etc.)
// fica guardada só durante a visita.
function registrarOrigem() {
  try {
    if (sessionStorage.getItem('mr_origem')) return;
    var origem =
      origemDaUrl() ||
      (document.referrer && new URL(document.referrer).hostname.indexOf('melrolan.com.br') === -1
        ? new URL(document.referrer).hostname
            .replace(/^www\./, '')
            .replace(/^l\./, '')
            .replace(/^lm\./, '')
        : '');
    if (origem) sessionStorage.setItem('mr_origem', origem);
  } catch (e) {}
}
window.mrOrigem = function () {
  try {
    var e = lerEscolha();
    var g = e && e.analytics ? sessionStorage.getItem('mr_origem') : '';
    return g || origemDaUrl();
  } catch (er) {
    return origemDaUrl();
  }
};
