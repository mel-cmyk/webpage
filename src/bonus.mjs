// Bônus do Guia Paris com Crianças: página única de entrega, não listada. Dados em data/bonus-criancas.json.
// Os PDFs ficam em public/bonus/ com nome difícil de adivinhar. A página tem noindex, fica fora do sitemap,
// é bloqueada no robots.txt e não tem links vindos do site: o link vai só no e-mail de confirmação da compra.
import fs from 'node:fs';
import { url, esc } from './helpers.mjs';

export const BONUS = JSON.parse(fs.readFileSync(new URL('../data/bonus-criancas.json', import.meta.url), 'utf8'));

export function paginaBonus(data) {
  const { pagina, bonus } = BONUS;
  const cartoes = bonus
    .map(
      (b) => `<article class="card" style="display:flex;flex-direction:column;align-items:center;text-align:center;padding:24px;height:100%">
      <img src="${url(b.capa)}" width="600" height="600" alt="${esc(b.capa_alt)}" style="display:block;width:180px;height:180px;object-fit:cover;border-radius:14px;box-shadow:0 6px 24px rgba(34,39,79,0.12);margin-bottom:16px">
      <h2 class="h3" style="min-height:3.4em;display:flex;align-items:flex-start;justify-content:center;margin:0 0 8px">${esc(b.titulo)}</h2>
      <p style="margin:0 0 20px">${esc(b.descricao)}</p>
      <a class="btn" style="margin-top:auto;align-self:center" href="${url('/bonus/' + b.arquivo)}" download data-download="${esc(b.id)}">Baixar o bônus</a>
    </article>`
    )
    .join('\n    ');
  const body = `
<section class="hero hero-sm">
  <div class="wrap narrow center">
    <h1>${esc(pagina.titulo)}</h1>
    <p class="lead">${esc(pagina.boas_vindas)}</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;max-width:720px;margin:0 auto;align-items:stretch">
    ${cartoes}
    </div>
    ${pagina.nota_rodape ? `<p class="center small" style="margin-top:24px">${esc(pagina.nota_rodape)}</p>` : ''}
    <p class="center small" style="margin-top:12px">Se tiver qualquer dificuldade, escreva para ${esc(data.marca.email)}.</p>
  </div>
</section>`;
  return {
    path: pagina.caminho,
    title: `${pagina.titulo} | Mel Rolan`,
    description: 'Download dos bônus do Guia Paris com Crianças.',
    body,
    servico: 'bonus',
    noFloat: true,
    noindex: true,
  };
}
