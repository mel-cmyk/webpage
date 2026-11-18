// Calculadora de milhas e referência do milheiro: página não listada, enviada só a clientes da consultoria.
// Dados em data/referencia-milhas.json. Mesma lógica da página de bônus: noindex, fora do sitemap e do llms.txt,
// bloqueada no robots.txt e sem links vindos do site. A conta roda no navegador (public/js/calculadora-milhas.js).
import fs from 'node:fs';
import { url, esc } from './helpers.mjs';
import { faqHtml } from './pages/comum.mjs';

export const MILHAS = JSON.parse(fs.readFileSync(new URL('../data/referencia-milhas.json', import.meta.url), 'utf8'));

const brl = (n) => `R$ ${n.toFixed(2).replace('.', ',')}`;

export function paginaMilhas(data) {
  const { pagina, programas, atualizado_em, fonte, perguntas, dicas } = MILHAS;
  const blocosDicas = dicas
    .map(
      (g) => `<div class="milhas-dicas-grupo">
      <h3>${esc(g.grupo)}</h3>
      <div class="milhas-dicas">${g.itens.map((d) => `<article class="card"><h4>${esc(d.titulo)}</h4><p>${esc(d.texto)}</p></article>`).join('')}</div>
    </div>`
    )
    .join('\n    ');
  const opcoes = programas.map((p) => `<option value="${esc(p.nome)}">${esc(p.nome)}</option>`).join('');
  const refs = Object.fromEntries(programas.map((p) => [p.nome, p.valor]));
  const linhas = programas
    .map(
      (p) =>
        `<tr><td><strong>${esc(p.nome)}</strong><br><span class="small">${esc(p.nota)}</span></td><td class="milhas-valor"><strong>${brl(p.valor)}</strong></td></tr>`
    )
    .join('');
  const body = `
<section class="section milhas-topo">
  <div class="wrap narrow">
    <h1 class="center">Calculadora de milhas</h1>
    <p class="center lead-sm">Descubra se vale emitir a sua passagem com milhas ou pagar em dinheiro. Ferramenta exclusiva para clientes da consultoria Mel Rolan.</p>
    <form class="card milhas-calc" id="calculadora-milhas" data-refs='${esc(JSON.stringify(refs))}' novalidate>
      <div class="milhas-campos">
        <label>Programa de milhas<select name="programa">${opcoes}</select></label>
        <label>Preço da passagem em dinheiro (R$)<input name="preco" type="text" inputmode="decimal" placeholder="Ex.: 6.000" autocomplete="off"></label>
        <label>Milhas pedidas para o mesmo voo<input name="milhas" type="text" inputmode="numeric" placeholder="Ex.: 150.000" autocomplete="off"></label>
        <label>Taxas da emissão com milhas (R$)<input name="taxas" type="text" inputmode="decimal" placeholder="Ex.: 400" autocomplete="off"></label>
      </div>
      <p class="small milhas-dica">Some ida e volta e todos os passageiros, nas mesmas datas, em dinheiro e em milhas.</p>
      <div class="milhas-resultado" aria-live="polite">
        <p class="milhas-veredito" data-estado="vazio">Preencha os campos para ver o resultado.</p>
        <dl class="milhas-numeros" hidden>
          <div><dt>Cada 1.000 milhas renderam</dt><dd data-campo="obtido"></dd></div>
          <div><dt>Referência do programa</dt><dd data-campo="ref"></dd></div>
          <div><dt>Você deixa de pagar</dt><dd data-campo="economia"></dd></div>
        </dl>
      </div>
    </form>
  </div>
</section>
<section class="section">
  <div class="wrap narrow">
    <h2 class="center">Referência do milheiro</h2>
    <p class="center lead-sm">Quanto valem 1.000 milhas em cada programa: é a régua da calculadora.</p>
    <table>
      <thead><tr><th scope="col">Programa</th><th scope="col">R$ por 1.000 milhas</th></tr></thead>
      <tbody>${linhas}</tbody>
    </table>
    <p class="small" style="margin-top:12px">Valores atualizados em ${esc(atualizado_em)}. Fonte: ${esc(fonte.nome)} (<a href="${esc(fonte.url)}">${esc(fonte.url.replace(/^https?:\/\//, ''))}</a>).</p>
  </div>
</section>
<section class="section alt">
  <div class="wrap">
    <h2 class="center">Boas práticas e dicas</h2>
    <p class="center lead-sm">O que faz as suas milhas renderem mais, do acúmulo à emissão.</p>
    ${blocosDicas}
  </div>
</section>
<section class="section">
  <div class="wrap narrow">
    <h2 class="center">Leia-me: milhas sem mistério</h2>
    <p class="center lead-sm">Pense em milhas como moedas estrangeiras. Toque em cada pergunta para ver a resposta.</p>
    ${faqHtml(perguntas.map((p) => ({ q: p.pergunta, a: esc(p.resposta) })))}
    <p class="center" style="margin-top:32px"><a class="btn" href="${url(pagina.planilha)}" download data-download="calculadora-milhas">Baixar a calculadora em Excel</a></p>
    <p class="center small" style="margin-top:16px">Na planilha, confira a aba Referências e atualize os valores com os desta página.</p>
    <p class="center small">Material informativo, não é recomendação financeira. Dúvidas: ${esc(data.marca.email)}.</p>
  </div>
</section>`;
  return {
    path: pagina.caminho,
    title: 'Calculadora de milhas | Mel Rolan',
    description: 'Calculadora e referência do milheiro por programa de fidelidade, exclusiva para clientes da consultoria Mel Rolan.',
    body,
    servico: 'milhas',
    scripts: ['/js/calculadora-milhas.js'],
    noFloat: true,
    noindex: true,
  };
}
