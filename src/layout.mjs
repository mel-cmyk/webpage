import fs from 'node:fs';
import crypto from 'node:crypto';
import { url, esc, wa, STAGING, SITE_URL, PUBLIC_URL } from './helpers.mjs';

// Endereço com versão (?v=) para CSS e JS: quando o arquivo muda, o navegador baixa a versão nova.
const versoes = {};
const asset = (p) => {
  if (!versoes[p]) versoes[p] = crypto.createHash('sha1').update(fs.readFileSync('public' + p)).digest('hex').slice(0, 8);
  return `${url(p)}?v=${versoes[p]}`;
};

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
      </ul>
    </div>
  </div>
  <div class="wrap small footer-legal">
    <span>© ${new Date().getFullYear()} Mel Rolan Travel Designer. Todos os direitos reservados.</span>
    <span class="footer-links"><a href="${url('/privacidade/')}">Política de privacidade</a> · <a href="${url('/aviso-legal/')}">Aviso legal</a> · <button type="button" class="link-btn" data-cookie-prefs>Preferências de cookies</button></span>
  </div>
</footer>`;
}

// Aviso de cookies: aparece até a pessoa escolher. Aceitar e Recusar têm o mesmo peso (regra da CNIL).
const cookieBanner = () => `
<div class="cookie-banner" id="cookie-banner" role="dialog" aria-labelledby="cookie-titulo" hidden>
  <p id="cookie-titulo" class="cookie-title">Cookies de medição</p>
  <p>Usamos o Google Analytics para entender como o site é usado e melhorar a sua experiência. Ele só é ativado se você aceitar. Você pode mudar de ideia quando quiser, pelo rodapé. <a href="${url('/privacidade/')}">Política de privacidade</a></p>
  <div class="cookie-actions">
    <button type="button" class="btn btn-small" data-consent="granted">Aceitar</button>
    <button type="button" class="btn btn-small" data-consent="denied">Recusar</button>
  </div>
</div>`;

export function layout({ data, path, title, description, body, jsonld = [], scripts = [], noFloat = false, og = 'og/home.jpg', servico = 'geral', analytics = [] }) {
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
${STAGING ? '<meta name="robots" content="noindex, nofollow">' : ''}
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
<body data-servico="${esc(servico)}">
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
${header(path)}
<main id="conteudo">
${body}
</main>
${footer(data)}
${noFloat ? '' : `<a class="wa-float" href="${wa(data, 'Olá! Vim pelo site da Mel Rolan e gostaria de tirar uma dúvida.')}" data-wa="flutuante" aria-label="Falar no WhatsApp">WhatsApp</a>`}
${cookieBanner()}
${analytics.length ? `<script id="ga-page" type="application/json">${JSON.stringify(analytics)}</script>` : ''}
<script src="${asset('/js/analytics.js')}" defer></script>
${js}
</body>
</html>`;
}
