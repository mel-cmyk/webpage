  // Barra dupla no endereço (ex.: /guias/paris-essencial//, vinda de links de fora como anúncios ou e-mails):
  // limpa antes de qualquer medição, para o Google Analytics registrar sempre a mesma página.
  try {
    if (/\/\/+/.test(location.pathname)) history.replaceState(history.state, '', location.pathname.replace(/\/{2,}/g, '/') + location.search + location.hash);
  } catch (e) {}
  var GA_ID = '{{GA_ID}}';
  var KEY = 'mr_consent'; // mesma chave usada nas páginas de venda dos guias
  var VALIDADE = 182 * 24 * 60 * 60 * 1000; // a escolha vale 6 meses, depois perguntamos de novo
  // REGRA ÚNICA DE ENVIO: o Google (GA4 e Google Ads) só recebe dados no domínio oficial (melrolan.com.br).
  // Qualquer outro endereço (prévia, teste local) mostra o aviso de cookies, mas não envia nada.
  var OFICIAL = /(^|\.)melrolan\.com\.br$/.test(location.hostname);
  var PROD = OFICIAL;
  // Tráfego interno (equipe): abrir o site uma vez com ?interno=1 marca este navegador (traffic_type=internal no GA4,
  // para o filtro de dados do GA4 excluir as visitas). ?interno=0 desmarca. Navegador marcado também não alimenta Meta e TikTok.
  var INTERNO = false;
  try {
    var qi = new URLSearchParams(location.search).get('interno');
    if (qi === '1') localStorage.setItem('mr_interno', '1');
    else if (qi === '0') localStorage.removeItem('mr_interno');
    INTERNO = localStorage.getItem('mr_interno') === '1';
  } catch (e) {}
  var carregado = false;
  var fila = [];

  // Páginas que podem receber anúncios (body[data-medicao="avancada"]: guias, início, tours, quiz, roteiro, consultoria,
  // diagnóstico e guias de Paris): Consent Mode avançado. A tag do Google carrega desde o início, com tudo negado por
  // padrão (sem cookies, só sinais de uso sem cookies), e passa a usar cookies se a pessoa aceitar.
  // As demais páginas (privacidade, aviso legal, sobre, parcerias) carregam o Google só depois do aceite.
  var AVANCADO = document.body.dataset.medicao === 'avancada';
  var ADS_ID = '{{ADS_ID}}';
  var META_ID = document.body.dataset.metaPixel || ''; // pixel da Meta: só nas páginas que o declaram e só com consentimento de publicidade
  var LOJA = 'loja.melrolan.com.br';
  var PARAMS_LOJA = /^(gclid|gbraid|wbraid|fbclid|utm_[a-z0-9_]+)$/i;
  var CLARITY_ID = document.body.dataset.clarity || ''; // Microsoft Clarity (mapas de calor e gravações): só com consentimento de medição, nunca em navegador interno, e só se houver ID
  var clarityCarregado = false;
  var metaCarregado = false;
  var metaFila = [];
  var TT_ID = '{{TIKTOK_ID}}'; // pixel do TikTok (só navegador): todas as páginas, só com consentimento de publicidade
  var ttCarregado = false;
  var ttFila = [];

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

