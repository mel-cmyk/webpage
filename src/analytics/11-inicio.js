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
  // Páginas de anúncios: o Google carrega logo após a página terminar de abrir, para não disputar banda com a foto do topo (LCP).
  // Os eventos ficam na fila até lá.
  if (AVANCADO) {
    if (document.readyState === 'complete') carregarGA();
    else window.addEventListener('load', function () { setTimeout(carregarGA, 0); }, { once: true });
  }
