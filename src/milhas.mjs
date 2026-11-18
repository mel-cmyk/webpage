// Referência do milheiro: página não listada, enviada só a clientes da consultoria. Dados em data/referencia-milhas.json.
// Mesma lógica da página de bônus: noindex, fora do sitemap e do llms.txt, bloqueada no robots.txt e sem links vindos do site.
import fs from 'node:fs';
import { url, esc } from './helpers.mjs';

export const MILHAS = JSON.parse(fs.readFileSync(new URL('../data/referencia-milhas.json', import.meta.url), 'utf8'));

const brl = (n) => `R$ ${n.toFixed(2).replace('.', ',')}`;

export function paginaMilhas(data) {
  const { pagina, programas, atualizado_em, fonte } = MILHAS;
  const linhas = programas
    .map(
      (p) =>
        `<tr><td><strong>${esc(p.nome)}</strong><br><span class="small">${esc(p.nota)}</span></td><td style="white-space:nowrap;vertical-align:middle"><strong>${brl(p.valor)}</strong></td></tr>`
    )
    .join('');
  const body = `
<section class="hero hero-sm">
  <div class="wrap narrow center">
    <h1>Referência do milheiro</h1>
    <p class="lead">Ferramenta exclusiva para clientes da consultoria Mel Rolan: a cotação de 1.000 milhas em cada programa, para usar na calculadora de milhas.</p>
  </div>
</section>
<section class="section">
  <div class="wrap narrow">
    <table>
      <thead><tr><th scope="col">Programa</th><th scope="col">R$ por 1.000 milhas</th></tr></thead>
      <tbody>${linhas}</tbody>
    </table>
    <p class="small" style="margin-top:12px">Valores atualizados em ${esc(atualizado_em)}. Fonte: ${esc(fonte.nome)} (<a href="${esc(fonte.url)}">${esc(fonte.url.replace(/^https?:\/\//, ''))}</a>).</p>
    <div class="card destaque">
      <h2 class="h3">Como usar</h2>
      <p>1. Abra a calculadora de milhas e vá até a aba Referências.</p>
      <p>2. Se algum valor desta página for diferente, digite o novo número na célula azul do programa e a nova data.</p>
      <p>3. Volte à aba Calculadora: o veredito se atualiza sozinho.</p>
    </div>
    <p class="center" style="margin-top:32px"><a class="btn" href="${url(pagina.planilha)}" download data-download="calculadora-milhas">Baixar a calculadora de milhas</a></p>
    <p class="center small" style="margin-top:24px">Pense no milheiro como a cotação de uma moeda: se o seu voo faz cada 1.000 milhas renderem mais do que o valor desta tabela, emitir com milhas é uma boa troca.</p>
    <p class="center small">Material informativo, não é recomendação financeira. Dúvidas: ${esc(data.marca.email)}.</p>
  </div>
</section>`;
  return {
    path: pagina.caminho,
    title: 'Referência do milheiro | Mel Rolan',
    description: 'Cotação de referência do milheiro por programa de fidelidade, para clientes da consultoria Mel Rolan.',
    body,
    servico: 'milhas',
    noFloat: true,
    noindex: true,
  };
}
