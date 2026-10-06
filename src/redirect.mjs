// Página de redirecionamento dos endereços antigos (Wix). GitHub Pages não faz 301 no servidor:
// a página leva a pessoa ao destino na hora (meta refresh + script) e o rel=canonical diz ao Google que o destino é o endereço definitivo.
// Autossuficiente: CSS embutido, fontes e logo do próprio site, sem GA4, sem pixel e sem scripts externos.
import { url, esc } from './helpers.mjs';

export function paginaRedirecionamento(alvo, canon) {
  const destino = encodeURI(alvo);
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Página transferida | Mel Rolan</title>
<link rel="canonical" href="${esc(encodeURI(canon))}">
<meta http-equiv="refresh" content="0; url=${esc(destino)}">
<link rel="preload" href="${url('/fonts/lora-latin.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${url('/fonts/poppins-400.woff2')}" as="font" type="font/woff2" crossorigin>
<style>
@font-face { font-family: 'Lora'; font-style: normal; font-weight: 500 600; font-display: swap; src: url('${url('/fonts/lora-latin.woff2')}') format('woff2'); }
@font-face { font-family: 'Poppins'; font-style: normal; font-weight: 400; font-display: swap; src: url('${url('/fonts/poppins-400.woff2')}') format('woff2'); }
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px; background: #f7f4ea; color: #22274f; font-family: 'Poppins', system-ui, -apple-system, 'Segoe UI', sans-serif; font-size: 16px; line-height: 1.65; text-align: center; }
main { max-width: 420px; }
img { display: block; margin: 0 auto 28px; width: 160px; height: auto; }
.msg { margin: 0 0 12px; font-family: 'Lora', Georgia, serif; font-weight: 600; font-size: 1.35rem; line-height: 1.3; }
.reserva { margin: 0; font-size: 0.95rem; }
.reserva a { display: inline-block; padding: 10px 12px; color: #22274f; text-decoration: underline; text-decoration-color: #86632b; text-underline-offset: 4px; }
.reserva a:hover { color: #86632b; }
a:focus-visible { outline: 3px solid #86632b; outline-offset: 2px; border-radius: 4px; }
</style>
</head>
<body>
<main>
<img src="${url('/img/logo.webp')}" alt="Mel Rolan Travel Designer" width="400" height="174">
<h1 class="msg">Levando você para a página certa</h1>
<p class="reserva"><a href="${esc(destino)}">Se nada acontecer, clique aqui</a></p>
</main>
<script>(function(){var d=${JSON.stringify(destino)};var q=location.search;if(q)q=(d.indexOf('?')<0?q:'&'+q.slice(1));location.replace(d+q+location.hash);})();</script>
</body>
</html>`;
}
