  // Microsoft Clarity: só existe depois do consentimento de medição, no domínio oficial, fora do tráfego interno e com ID configurado.
  // O diagnóstico é mascarado (data-clarity-mask), então nome e WhatsApp nunca aparecem nas gravações.
  function carregarClarity(e) {
    if (!CLARITY_ID || !OFICIAL || INTERNO) return;
    if (!clarityCarregado) {
      clarityCarregado = true;
      (function (c, l, a, r, i, t, y) {
        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
        t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
        y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
      })(window, document, 'clarity', 'script', CLARITY_ID);
    }
    window.clarity('consentv2', { ad_Storage: e.ads ? 'granted' : 'denied', analytics_Storage: 'granted' });
  }
  function revogarClarity() {
    if (clarityCarregado) window.clarity('consent', false);
  }
  function carregarMeta() {
    if (INTERNO || metaCarregado || !OFICIAL || !META_ID) return; // pixel da Meta só no domínio oficial
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

