// GA4: só carrega no domínio oficial, para o endereço de teste não misturar os dados.
(function () {
  if (!/(^|\.)melrolan\.com\.br$/.test(location.hostname)) return;
  var id = 'G-L71ZP46QX2';
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', id);

  // Cliques no WhatsApp e nos CTAs principais
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    if (a.dataset.wa) gtag('event', 'clique_whatsapp', { origem: a.dataset.wa });
    else if (a.dataset.cta) gtag('event', 'clique_cta', { origem: a.dataset.cta });
  });
})();
