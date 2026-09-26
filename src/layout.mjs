import { url, esc, wa, STAGING, SITE_URL } from './helpers.mjs';

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
        <li><a href="mailto:${esc(m.email)}">${esc(m.email)}</a></li>
        <li><a href="${esc(m.instagram)}" rel="noopener">Instagram @mel.rolan</a></li>
        <li><a href="${url('/sobre/')}">Sobre a Mel</a></li>
      </ul>
    </div>
  </div>
  <div class="wrap small footer-legal">© ${new Date().getFullYear()} Mel Rolan Travel Designer. Todos os direitos reservados.</div>
</footer>`;
}

export function layout({ data, path, title, description, body, jsonld = [], scripts = [], noFloat = false }) {
  const canonical = `${SITE_URL}${path}`;
  const ld = jsonld
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`)
    .join('\n');
  const js = scripts.map((s) => `<script src="${url(s)}" defer></script>`).join('\n');
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
<link rel="icon" href="${url('/favicon.ico')}" sizes="any">
<link rel="apple-touch-icon" href="${url('/apple-touch-icon.png')}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;1,500&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${url('/css/site.css')}">
${ld}
</head>
<body>
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
${header(path)}
<main id="conteudo">
${body}
</main>
${footer(data)}
${noFloat ? '' : `<a class="wa-float" href="${wa(data, 'Olá! Vim pelo site da Mel Rolan e gostaria de tirar uma dúvida.')}" data-wa="flutuante" aria-label="Falar no WhatsApp">WhatsApp</a>`}
<script src="${url('/js/analytics.js')}" defer></script>
${js}
</body>
</html>`;
}
