// Bônus de Inverno 2026/2027 do Guia Paris com Crianças: página de download não listada.
// O PDF fica em public/bonus/ com nome difícil de adivinhar. A página tem noindex, fica fora do sitemap,
// é bloqueada no robots.txt e não tem links vindos do site: o link vai só no e-mail de confirmação da compra.
import { url, esc } from './helpers.mjs';

export const BONUS_INVERNO = {
  caminho: '/bonus/inverno-2026-2027/',
  pdf: 'inverno-2026-2027-8270e0fa.pdf', // arquivo em public/bonus/
  capa: '/img/bonus-inverno-capa.webp',
};

export function paginaBonusInverno(data) {
  const b = BONUS_INVERNO;
  const body = `
<section class="hero hero-sm">
  <div class="wrap narrow center">
    <img src="${url(b.capa)}" width="600" height="600" alt="Capa do Bônus de Inverno 2026/2027" style="display:block;width:200px;height:auto;margin:0 auto 24px;border-radius:14px;box-shadow:0 6px 24px rgba(34,39,79,0.12)">
    <h1>Seu Bônus de Inverno 2026/2027</h1>
    <p class="lead">Obrigada por levar o Guia Paris com Crianças. Este é o seu bônus, com 19 páginas para viajar com crianças entre novembro e fevereiro.</p>
    <div class="actions center"><a class="btn" href="${url('/bonus/' + b.pdf)}" download data-download="bonus-inverno-2026-2027">Baixar o bônus</a></div>
    <p class="small">PDF com 19 páginas. Se tiver qualquer dificuldade, escreva para ${esc(data.marca.email)}.</p>
  </div>
</section>`;
  return {
    path: b.caminho,
    title: 'Seu Bônus de Inverno 2026/2027 | Mel Rolan',
    description: 'Download do Bônus de Inverno 2026/2027 do Guia Paris com Crianças.',
    body,
    servico: 'bonus',
    noFloat: true,
    noindex: true,
  };
}
