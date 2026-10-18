// Blocos de conteúdo reaproveitados em mais de uma página (provas, avaliações, imprensa, selos e textos de tours). Preços, números e contatos vêm de data/ofertas.json.
import { url, esc, img } from '../helpers.mjs';
import { CONTEUDO } from '../conteudo.mjs';

// Selos nos cards de tour. Sem comparação entre tours (Diogo, 18/10/2026): nada de "mais" ou "melhor", só elogio ao próprio tour.
export const SELOS = CONTEUDO.selos_tours;

export const seloTour = (t) => (SELOS[t.id] ? `<p class="selo-tour">${SELOS[t.id]}</p>` : '');

export const TRIP_URL = CONTEUDO.tripadvisor.url;

export const provaRapida = (m) => `
<section class="proof" aria-label="Números da Mel Rolan">
  <div class="wrap proof-grid">
    <p><strong>${m.nota_satisfacao} de 10</strong><span>na pesquisa de satisfação dos clientes (${m.pesquisas_satisfacao} respostas, ${m.periodo_pesquisas})</span></p>
    <p><strong>${m.familias_atendidas} clientes</strong><span>atendidos em roteiros, consultorias e tours</span></p>
    <p><strong>${m.anos_na_franca} anos</strong><span>vivendo em Paris</span></p>
    <p><strong>5,0 no Tripadvisor</strong><span>nas avaliações de quem fez o tour (<a href="${TRIP_URL}" target="_blank" rel="noopener" data-cta="tripadvisor-home">ver avaliações</a>)</span></p>
  </div>
</section>`;

// Depoimentos (data/conteudo.json). Com um cartão extra no topo, a lista mostra só os dois primeiros.
const depoimentoCard = (d) => `<figure><blockquote>“${d.texto}”</blockquote><figcaption><strong>${d.nome}</strong>, ${d.cidade} (${d.uf})${d.contexto ? ' · ' + d.contexto : ''}</figcaption></figure>`;

export const depoimentos = (m, extra = '') => `
<section class="section">
  <div class="wrap">
    <div class="selo-wrap">
      <div class="selo" role="img" aria-label="Nota ${m.nota_satisfacao} de 10 na pesquisa de satisfação">
        <span class="selo-nota">${m.nota_satisfacao}</span>
        <span class="selo-de">de 10</span>
      </div>
      <div>
        <p class="eyebrow">Satisfação dos clientes</p>
        <h2>Quem viajou com a Mel recomenda.</h2>
        <p class="selo-txt">Nota média ${m.nota_satisfacao} de 10 em ${m.pesquisas_satisfacao} pesquisas de satisfação respondidas por clientes de roteiros, consultorias e tours, de ${m.periodo_pesquisas}.</p>
      </div>
    </div>
    <div class="grid-3 quotes">${extra}
      ${CONTEUDO.depoimentos.slice(0, extra ? 2 : 3).map(depoimentoCard).join('\n      ')}
    </div>
  </div>
</section>`;

// Avaliações do Tripadvisor (perfil "Mel Rolan — Tours em Paris"), publicadas com autorização dos clientes (Diogo, 17/10/2026).
// Trechos fiéis ao texto original; [...] marca cortes e [colchetes] marcam edições (a ferramenta do roteiro não é nomeada).
export const TRIP = CONTEUDO.tripadvisor.avaliacoes;

export const tripCard = (d) => `<figure><p class="quote-title">${esc(d.titulo)}</p><blockquote>“${esc(d.texto)}”</blockquote><figcaption><strong>${esc(d.autor)}</strong>, ${esc(d.info)} · Tripadvisor, 5 de 5</figcaption></figure>`;

// Avaliações de tours: as do próprio tour primeiro.
export const avaliacoesTours = (tourId = '') => {
  const lista = [TRIP.marise, TRIP.rafael, TRIP.lucas].sort((a, b) => (b.tours.includes(tourId) ? 1 : 0) - (a.tours.includes(tourId) ? 1 : 0));
  return `
<section class="section">
  <div class="wrap">
    <p class="eyebrow center">Avaliações no Tripadvisor</p>
    <h2 class="center">Nota 5,0 de quem fez o tour</h2>
    <div class="grid-3 quotes">${lista.map(tripCard).join('')}</div>
    <p class="center"><a href="${TRIP_URL}" target="_blank" rel="noopener" data-cta="tripadvisor">Ver todas as avaliações no Tripadvisor</a></p>
  </div>
</section>`;
};

// Imprensa (data/imprensa.json): só o que a matéria diz. Citação entre aspas e sempre com veículo, data e link.
export const dataBR = (iso) => iso.split('-').reverse().join('/');

export const logoImg = (x) => `<img class="imprensa-logo" src="${url(x.logo.src)}" width="${x.logo.w}" height="${x.logo.h}" alt="${esc(x.veiculo)}" loading="lazy">`;

export const veiculoTxt = (x) => esc(x.veiculo) + (x.secao ? `, ${esc(x.secao)}` : '');

export const imprensaFaixa = (data) => `
<section class="section imprensa">
  <div class="wrap">
    <p class="eyebrow center">Na imprensa</p>
    <h2 class="center">A Mel nos veículos brasileiros</h2>
    <div class="grid-3 imprensa-grid">
      ${data.imprensa.slice(0, 3).map((x) => `<a class="imprensa-card" href="${esc(x.url)}" target="_blank" rel="noopener">${logoImg(x)}<span class="imprensa-veiculo">${x.secao ? esc(x.secao) : '&nbsp;'}</span><span class="imprensa-titulo">${esc(x.titulo)}</span><span class="imprensa-data">${dataBR(x.data)}</span></a>`).join('')}
    </div>
    <p class="center small"><a href="${url('/na-midia/')}">Ver todas as matérias</a></p>
  </div>
</section>`;

export const imprensaCitacao = (data, id, citacao) => {
  const x = data.imprensa.find((m) => m.id === id);
  return `
<section class="section imprensa-citacao">
  <div class="wrap narrow">
    <figure><blockquote>“${esc(citacao || x.citacao)}”</blockquote><figcaption>Mel Rolan, em <a href="${esc(x.url)}" target="_blank" rel="noopener">${veiculoTxt(x)}</a> · ${dataBR(x.data)}</figcaption></figure>
  </div>
</section>`;
};

export const incluidoTours = CONTEUDO.tours_incluido;

// Para quem é cada tour (informações da Mel, 17/10/2026): todos os tours servem a todos os perfis; o conteúdo é adaptado ao grupo.
// Bloco para quem viaja sozinha (texto de Diogo, 17/10/2026).
export const blocoSozinha = () => `
    <aside class="card destaque">
      <div>
        <p class="eyebrow">Para quem viaja sozinha</p>
        <h3>Viajando sozinha, com tranquilidade</h3>
        <p>Paris se aproveita muito bem sozinha e é uma cidade segura, com os mesmos cuidados de qualquer grande cidade. A Mel indica bairros tranquilos e bem servidos de transporte para se hospedar, os trajetos mais simples entre um programa e outro e os horários em que cada região é mais agradável. Nos tours, você tem uma guia brasileira ao seu lado do início ao fim, e no roteiro sob medida cada dia já chega pensado para quem está sozinha.</p>
      </div>
    </aside>`;

export const TOURS_CURTOS = ['3h', '3h30'];

export const perfisTour = (t) => {
  const ritmo = t && TOURS_CURTOS.includes(t.duracao)
    ? 'Percurso de 4 a 5 km, com muitas paradas no caminho. Não exige preparo físico.'
    : 'Ritmo leve, com muitas paradas no caminho. Não exige preparo físico.';
  const montmartre = t && t.id === 'montmartre' ? ' Em Montmartre, o percurso foi pensado para ter pouquíssimas escadas, e as subidas são curtas e leves.' : '';
  return `
    <div class="grid-4 perfis">
      <article class="card perfil"><h3>Com crianças</h3><p>Para todas as idades, inclusive com carrinho de bebê. A linguagem é adaptada a cada criança, e cada uma ganha o livro de atividades do Monsieur Pombo.</p></article>
      <article class="card perfil"><h3>Com avós</h3><p>Grupos de até três gerações no mesmo passeio. ${ritmo}${montmartre}</p></article>
      <article class="card perfil"><h3>Casais</h3><p>Só vocês dois e a Mel, no ritmo de vocês, com tempo para o café, as fotos e as histórias que mais interessarem.</p></article>
      <article class="card perfil"><h3>Viajando sozinha</h3><p>Uma guia brasileira ao seu lado, com a profundidade histórica que você quiser e liberdade para parar onde der vontade.</p></article>
    </div>
    <p class="center small">Todos os passeios têm paradas para descansar, tomar um café e ir ao banheiro.</p>`;
};

export const faqTours = CONTEUDO.tours_faq;
