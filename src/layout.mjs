import fs from 'node:fs';
import crypto from 'node:crypto';
import { url, esc, wa, STAGING, SITE_URL, PUBLIC_URL } from './helpers.mjs';

// Endereço com versão (?v=) para CSS e JS: quando o arquivo muda, o navegador baixa a versão nova.
const versoes = {};
export const asset = (p) => {
  if (!versoes[p]) versoes[p] = crypto.createHash('sha1').update(fs.readFileSync('public' + p)).digest('hex').slice(0, 8);
  return `${url(p)}?v=${versoes[p]}`;
};

// Páginas que podem receber anúncios: usam o Consent Mode avançado (analytics.js, body data-medicao="avancada").
// A regra de envio no endereço de teste, em public/js/analytics.js (TESTE), deve acompanhar esta lista.
const PAGINAS_ANUNCIOS = /^\/($|(tours-em-paris|roteiro-sob-medida|consultoria|diagnostico|guias-de-paris|qual-tour-combina-com-voce)\/)/;

const nav = [
  ['/tours-em-paris/', 'Tours em Paris'],
  ['/roteiro-sob-medida/', 'Roteiro sob medida'],
  ['/consultoria/', 'Consultoria'],
  ['/guias-de-paris/', 'Guias de Paris'],
  ['/sobre/', 'Sobre a Mel'],
];

function header(current) {
  const links = nav
    .map(
      ([href, label]) =>
        `<a href="${url(href)}"${current.startsWith(href) ? ' aria-current="page"' : ''}>${label}</a>`
    )
    .join('');
  return `
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="${url('/')}" aria-label="Mel Rolan Travel Designer, página inicial">
      <img src="${url('/img/logo.webp')}" alt="Mel Rolan Travel Designer" width="115" height="50">
    </a>
    <nav class="nav-desktop" aria-label="Principal">${links}</nav>
    <a class="btn btn-small nav-cta" href="${url('/diagnostico/')}">Planejar minha viagem</a>
    <details class="nav-mobile">
      <summary aria-label="Abrir menu">Menu</summary>
      <nav aria-label="Principal (celular)">${links}<a class="btn" href="${url('/diagnostico/')}">Planejar minha viagem</a></nav>
    </details>
  </div>
</header>`;
}

function footer(data) {
  const m = data.marca;
  return `
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div>
      <p class="footer-brand">Mel Rolan Travel Designer</p>
      <p>Paris, França. Atendimento em português.</p>
      <p class="small">SIRET ${esc(m.siret_franca)} · CNPJ ${esc(m.cnpj_brasil)}</p>
      <p class="small">Agência de turismo cadastrada no <a href="https://cadastur.turismo.gov.br" target="_blank" rel="noopener">Cadastur</a>, Ministério do Turismo.</p>
    </div>
    <div>
      <p class="footer-title">Serviços</p>
      <ul>
        <li><a href="${url('/tours-em-paris/')}">Tours em Paris</a></li>
        <li><a href="${url('/roteiro-sob-medida/')}">Roteiro sob medida</a></li>
        <li><a href="${url('/consultoria/')}">Consultoria</a></li>
        <li><a href="${url('/guias-de-paris/')}">Guias de Paris</a></li>
      </ul>
    </div>
    <div>
      <p class="footer-title">Contato</p>
      <ul>
        <li><a href="${wa(data)}" data-wa="rodape">WhatsApp ${esc(m.whatsapp_site)}</a></li>
        <li><a href="mailto:${esc(m.email)}" data-contato="email">${esc(m.email)}</a></li>
        <li><a href="${esc(m.instagram)}" rel="noopener" data-contato="instagram">Instagram @mel.rolan</a></li>
        <li><a href="${url('/sobre/')}">Sobre a Mel</a></li>
        <li><a href="${url('/parcerias/')}">Parcerias / Partenariats</a></li>
      </ul>
    </div>
  </div>
  <div class="wrap small footer-legal">
    <span>© ${new Date().getFullYear()} Mel Rolan Travel Designer. Todos os direitos reservados.</span>
    <span class="footer-links"><a href="${url('/privacidade/')}">Política de privacidade</a> · <a href="${url('/aviso-legal/')}">Aviso legal</a> · <button type="button" class="link-btn" data-cookie-prefs>Preferências de cookies</button></span>
  </div>
</footer>`;
}

// Aviso de cookies: aparece até a pessoa escolher. Duas finalidades, escolhidas separadamente.
// Aceitar tudo, Recusar tudo e Salvar escolhas têm o mesmo peso (regra da CNIL).
export const cookieBanner = () => `
<div class="cookie-banner" id="cookie-banner" role="dialog" aria-labelledby="cookie-titulo" hidden>
  <p id="cookie-titulo" class="cookie-title">Cookies e privacidade</p>
  <p>Usamos cookies para medir o uso do site (Google Analytics) e para a publicidade (Google Ads), que mede os anúncios e mostra anúncios da Mel Rolan a quem já visitou o site. Os cookies só são gravados depois da sua escolha. Se você recusar, nas páginas de serviços e de venda o Google ainda recebe sinais de uso sem cookies, como a visita a uma página e o clique em um botão, para medir os anúncios de forma agregada. Esses sinais não incluem o seu nome nem o seu contato. Você pode mudar de ideia quando quiser, pelo rodapé. <a href="${url('/privacidade/')}">Política de privacidade</a></p>
  <div class="cookie-opcoes" id="cookie-opcoes" hidden>
    <label class="cookie-opt"><input type="checkbox" id="consent-medicao"><span><strong>Medição.</strong> Google Analytics: mostra como o site é usado, para melhorarmos o conteúdo.</span></label>
    <label class="cookie-opt"><input type="checkbox" id="consent-anuncios"><span><strong>Publicidade.</strong> Google Ads: mede o resultado dos anúncios e mostra anúncios da Mel Rolan a quem já visitou o site.</span></label>
  </div>
  <div class="cookie-actions">
    <button type="button" class="btn btn-small" data-consent="all">Aceitar tudo</button>
    <button type="button" class="btn btn-small" data-consent="none">Recusar tudo</button>
    <button type="button" class="btn btn-small" id="cookie-mais" data-consent="more">Personalizar</button>
    <button type="button" class="btn btn-small" id="cookie-salvar" data-consent="custom" hidden>Salvar escolhas</button>
  </div>
</div>`;

export function layout({ data, path, title, description, body, jsonld = [], scripts = [], noFloat = false, og = 'og/home.jpg', servico = 'geral', analytics = [], noindex = false }) {
  const canonical = `${SITE_URL}${path}`;
  const ogImage = `${PUBLIC_URL}/img/${og}`;
  const ld = jsonld
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`)
    .join('\n');
  const js = scripts.map((s) => `<script src="${asset(s)}" defer></script>`).join('\n');
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${STAGING || noindex ? '<meta name="robots" content="noindex, nofollow">' : ''}
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="Mel Rolan Travel Designer">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#22274f">
<link rel="manifest" href="${url('/site.webmanifest')}">
<link rel="icon" href="${url('/favicon.ico')}" sizes="any">
<link rel="apple-touch-icon" href="${url('/apple-touch-icon.png')}">
<link rel="preload" href="${url('/fonts/lora-latin.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${url('/fonts/poppins-400.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${asset('/css/site.css')}">
${ld}
</head>
<body data-servico="${esc(servico)}"${PAGINAS_ANUNCIOS.test(path) ? ' data-medicao="avancada"' : ''}>
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
${header(path)}
<main id="conteudo">
${body}
</main>
${footer(data)}
${noFloat ? '' : `<a class="wa-float" href="${wa(data, 'Olá! Vim pelo site da Mel Rolan e gostaria de tirar uma dúvida.')}" data-wa="flutuante" aria-label="Falar no WhatsApp"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg><span>Fale com a Mel</span></a>`}
${cookieBanner()}
${analytics.length ? `<script id="ga-page" type="application/json">${JSON.stringify(analytics)}</script>` : ''}
<script>document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.getAttribute('href');if(/^(https?:|mailto:|tel:)/.test(h)&&a.host!==location.host){a.target='_blank';a.rel='noopener';}},true);</script>
<script src="${asset('/js/analytics.js')}" defer></script>
${js}
</body>
</html>`;
}
