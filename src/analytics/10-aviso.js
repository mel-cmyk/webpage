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
  // Detalhes e escolhas por finalidade ficam num modal; o aviso na tela é só uma linha e três botões.
  // Teclado: o foco entra no modal, o Tab fica preso dentro dele e, ao fechar, o foco volta ao botão que abriu.
  var focoAnterior = null;
  function expandirOpcoes(v) {
    var m = document.getElementById('cookie-modal');
    if (!m || m.hidden === !v) return;
    m.hidden = !v;
    document.body.classList.toggle('cookie-modal-aberto', v);
    if (v) {
      focoAnterior = document.activeElement;
      var f = document.getElementById('cookie-salvar');
      if (f) f.focus();
    } else if (focoAnterior && document.body.contains(focoAnterior) && focoAnterior.offsetParent !== null) {
      focoAnterior.focus();
      focoAnterior = null;
    }
  }
  document.addEventListener('keydown', function (e) {
    var m = document.getElementById('cookie-modal');
    if (!m || m.hidden) return;
    if (e.key === 'Escape') { expandirOpcoes(false); return; }
    if (e.key !== 'Tab') return;
    var itens = m.querySelectorAll('button, a[href], input');
    if (!itens.length) return;
    var primeiro = itens[0], ultimo = itens[itens.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
    else if (!m.contains(document.activeElement)) { e.preventDefault(); primeiro.focus(); }
  });
  function escolher(modo) {
    var e = modo === 'all' ? { analytics: true, ads: true }
      : modo === 'none' ? { analytics: false, ads: false }
      : { analytics: !!(document.getElementById('consent-medicao') || {}).checked, ads: !!(document.getElementById('consent-anuncios') || {}).checked };
    salvarEscolha(e);
    mostrarAviso(false);
    expandirOpcoes(false);
    // Fecha o aviso na hora e só depois carrega Google, Clarity e pixels (resposta ao toque mais rápida, INP).
    depois(function () { aplicarDepois(e); });
  }
  function depois(fn) { requestAnimationFrame(function () { setTimeout(fn, 0); }); }
  function aplicarDepois(e) {
    aplicarConsentimento(e);
    if (e.analytics) registrarOrigem();
    else { try { sessionStorage.removeItem('mr_origem'); } catch (err) {} }
    if (e.analytics || e.ads) carregarGA();
    if (!e.analytics || !e.ads) apagarCookiesGA();
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-consent]');
    if (b) { if (b.dataset.consent === 'more') { expandirOpcoes(true); return; } if (b.dataset.consent === 'close') { expandirOpcoes(false); return; } escolher(b.dataset.consent); return; }
    if (e.target.closest('[data-cookie-prefs]')) { marcarOpcoes(lerEscolha()); expandirOpcoes(true); return; }

    var a = e.target.closest('a');
    if (!a) return;
    decorarLink(a);
    if (/^\/(diagnostico|qual-tour-combina-com-voce)\/?$/.test(a.pathname)) {
      var ep = a.closest('[role="dialog"],.popup,.modal') ? 'popup' : a.closest('header,nav') ? 'menu' : null;
      if (!ep) { var pp = location.pathname; ep = pp === '/' ? 'home' : /^\/(tour|qual-tour)/.test(pp) ? 'pagina_tours' : /^\/guia/.test(pp) ? 'pagina_guia' : 'direto'; }
      try { sessionStorage.setItem('mr_entrada', ep); } catch (err) {}
    }
    var servico = document.body.dataset.servico || 'geral';
    var extra = {};
    try { if (a.dataset.lead) extra = JSON.parse(a.dataset.lead); } catch (err) {}

    if (a.dataset.wa) {
      // whatsapp_click: todo clique no WhatsApp (evento-chave já usado na propriedade).
      // generate_lead é disparado pelo diagnóstico, quando o lead é salvo no Wix (diagnostico.js).
      var p = { origem: a.dataset.wa, servico: a.dataset.servico || servico };
      for (var k in extra) p[k] = extra[k];
      var fl = a.dataset.flow && window.mrFlows[a.dataset.flow];
      if (fl) {
        // Botão de resultado do funil: o clique no WhatsApp é o gesto de captura (1 generate_lead por execução).
        p.origin_flow = a.dataset.flow;
        p.flow_run_id = fl.id;
        track('whatsapp_click', p);
        fl.lead('whatsapp', a.dataset.flow + '_resultado', fl.resultId);
      } else track('whatsapp_click', p);
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

