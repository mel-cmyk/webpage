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
    if (e.ads) carregarTikTok(); else revogarTikTok();
    if (e.analytics) carregarClarity(e); else revogarClarity();
  }

