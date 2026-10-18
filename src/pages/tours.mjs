// Lista de tours e página de cada tour. Preços, números e contatos vêm de data/ofertas.json.
import { url, esc, eur, wa, menorPreco, img, SITE_URL } from '../helpers.mjs';
import { RESPOSTA, servico, precoServico, CARD_SIZES, heroSplit, tourItem, attr, breadcrumbLd, faqHtml, faqLd, ctaFinal } from './comum.mjs';
import { seloTour, TRIP_URL, avaliacoesTours, imprensaCitacao, incluidoTours, blocoSozinha, perfisTour, faqTours } from './blocos.mjs';

// ---------------------------------------------------------------- TOURS
export function toursHub(data) {
  const s = servico(data, 'tours');
  const body = `
${heroSplit(
  `
    <p class="eyebrow">Tours privativos em Paris</p>
    <h1>Paris além dos cartões-postais, a pé e em português.</h1>
    <p class="lead">Passeios privativos, leves e sem correria, com a Mel, travel designer especializada em viajantes brasileiros. Só o seu grupo, no seu ritmo, pelas ruas, praças e jardins que contam a história da cidade.</p>
    <p class="price">${precoServico(s)}<span>${esc(s.unidade_preco)}</span></p>
    <div class="actions">
      <a class="btn" href="#escolha-o-tour" data-cta="tours-hero-lista">Escolher o meu tour</a>
      <a class="btn btn-ghost" href="${wa(data, 'Olá! Vim pelo site da Mel Rolan e gostaria de consultar datas para um tour em Paris.')}" data-wa="tours-hero">Consultar datas no WhatsApp</a>
    </div>
    <p class="small"><a href="${TRIP_URL}" target="_blank" rel="noopener" data-cta="tripadvisor-tours">5,0 no Tripadvisor</a> · ${data.marca.nota_satisfacao} de 10 na pesquisa de satisfação</p>
    <p class="small">${RESPOSTA}</p>`,
  'paginas/tours',
  'Mel Rolan olhando para trás numa rua de paralelepípedos de Paris',
  '#escolha-o-tour'
)}
<section class="section" id="escolha-o-tour">
  <div class="wrap">
    <h2 class="center">Escolha o seu tour</h2>
    <div class="quiz-cta center"><p class="eyebrow">Em dúvida sobre qual escolher?</p><p>Responda 6 perguntas rápidas e descubra os tours que mais combinam com você.</p><a class="btn" href="${url('/qual-tour-combina-com-voce/')}" data-cta="tours-quiz">Fazer o quiz do tour ideal</a></div>
    <div class="grid-3 cards">
      ${data.tours
        .map(
          (t) => `<article class="card card-photo">
        ${img(t.imagem, t.imagem_alt, { sizes: CARD_SIZES })}
        <div class="card-body">
        ${seloTour(t)}<p class="card-meta">${esc(t.duracao)} · ${esc(t.encontro)}</p>
        <h3>${esc(t.nome)}</h3>
        ${t.subtitulo ? `<p class="card-sub">${esc(t.subtitulo)}</p>` : ''}
        <p class="card-txt">${esc(t.ideal_para || t.descricao || t.roteiro.join(' · '))}</p>
        <p class="price">A partir de ${eur(menorPreco(t))}<span>${esc(t.precos[0].grupo)}</span></p>
        <a class="btn btn-small" href="${url('/tours-em-paris/' + t.id + '/')}" data-item="${attr(tourItem(t))}">Ver o tour</a>
        </div>
      </article>`
        )
        .join('')}
    </div>
  </div>
</section>
${avaliacoesTours()}
<section class="section alt">
  <div class="wrap">
    <h2 class="center">Para todos os grupos, com tudo incluído</h2>
    <p class="center lead-sm">Todos os tours funcionam para todos os perfis. O conteúdo é adaptado a cada grupo, do livro de atividades para os pequenos à profundidade histórica para quem quer ir mais longe.</p>
    <ul class="checklist grid-2">
      <li><strong>Com crianças:</strong> todas as idades, inclusive com carrinho de bebê. Cada criança ganha o livro impresso do Monsieur Pombo.</li>
      <li><strong>Com avós:</strong> grupos de até três gerações, ritmo leve e muitas paradas no caminho.</li>
      <li><strong>Casais:</strong> só vocês dois e a Mel, no ritmo de vocês.</li>
      <li><strong>Viajando sozinha:</strong> uma guia brasileira ao seu lado e liberdade para parar onde der vontade.</li>
    </ul>
    <h3 class="center">Incluído em todos os tours</h3>
    <ul class="checklist grid-2">${incluidoTours.map((i) => `<li>${i}</li>`).join('')}</ul>
    <p class="center small">Todos os passeios têm paradas para descansar, tomar um café e ir ao banheiro.</p>
    ${blocoSozinha()}
  </div>
</section>
<section class="section alt">
  <div class="wrap">
    <h2 class="center">Quer a viagem inteira pensada para você?</h2>
    <p class="center lead">O tour resolve um dia em Paris. Se você quer o resto da viagem resolvido, a Mel também planeja.</p>
    <div class="grid-2 cards">
      <article class="card"><div class="card-body">
        <h3>Roteiro sob medida</h3>
        <p class="card-txt">A viagem planejada dia a dia, com atrações, restaurantes e deslocamentos, numa plataforma que você leva no celular.</p>
        <a class="btn btn-small" href="${url('/roteiro-sob-medida/')}" data-cta="tours-roteiro">Conhecer o roteiro</a>
      </div></article>
      <article class="card"><div class="card-body">
        <h3>Consultoria</h3>
        <p class="card-txt">Uma conversa por vídeo com a Mel para começar a planejar, tirar dúvidas ou validar o que você já decidiu.</p>
        <a class="btn btn-small" href="${url('/consultoria/')}" data-cta="tours-consultoria">Conhecer a consultoria</a>
      </div></article>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap narrow">
    <h2 class="center">Perguntas frequentes</h2>
    ${faqHtml(faqTours)}
  </div>
</section>
${imprensaCitacao(data, 'r7-novo-luxo-tempo', 'Quando a viagem deixa de ser uma corrida contra o relógio, as pessoas conseguem aproveitar melhor o destino.')}
${ctaFinal(data, 'Quer ajuda para escolher o tour?', 'Conte quem viaja e quando, e a gente indica o tour que combina com o seu grupo.')}
`;
  return {
    path: '/tours-em-paris/',
    title: 'Tours privativos em Paris em português | Mel Rolan',
    description: `Tours privativos a pé em Paris, em português, com guia brasileira. Roteiros ao ar livre, a partir de ${eur(Math.min(...data.tours.map(menorPreco)))} por grupo.`,
    body,
    og: 'og/tours.jpg',
    servico: 'tours',
    analytics: [{ name: 'view_item_list', params: { item_list_name: 'tours', items: data.tours.map(tourItem) } }],
    jsonld: [
      faqLd(faqTours),
      breadcrumbLd([
        ['Início', '/'],
        ['Tours em Paris', '/tours-em-paris/'],
      ]),
    ],
  };
}

export function tourPage(data, t) {
  const outros = data.tours.filter((o) => o.id !== t.id).slice(0, 3);
  const msg = `Olá! Vim pelo site da Mel Rolan e gostaria de consultar datas para o tour ${t.nome}.`;
  const body = `
<nav class="wrap crumbs small" aria-label="Você está em"><a href="${url('/')}">Início</a> › <a href="${url('/tours-em-paris/')}">Tours em Paris</a> › ${esc(t.nome)}</nav>
${heroSplit(
  `
    <p class="eyebrow">Tour privativo em Paris · ${esc(t.duracao)}</p>
    <h1>${esc(t.nome)}</h1>
    ${t.subtitulo ? `<p class="subtitulo">${esc(t.subtitulo)}</p>` : ''}
    ${t.ideal_para ? `<p class="lead"><strong>Ideal para:</strong> ${esc(t.ideal_para)}</p>` : ''}
    ${t.descricao ? `<p>${esc(t.descricao)}</p>` : ''}
    <p class="price">A partir de ${eur(menorPreco(t))}<span>${esc(t.precos[0].grupo)}</span></p>
    <div class="actions">
      <a class="btn" href="${wa(data, msg)}" data-wa="tour-${t.id}" data-lead="${attr({ tour_id: t.id })}">Consultar datas no WhatsApp</a>
    </div>
    <p class="small">${RESPOSTA}</p>`,
  t.imagem,
  t.imagem_alt
)}
<section class="section">
  <div class="wrap split">
    <div>
      <h2>Roteiro</h2>
      <ol class="route">${t.roteiro.map((r) => `<li>${esc(r)}</li>`).join('')}</ol>
      <p class="small">Tour 100% ao ar livre. Percurso: ${esc(t.encontro)}.</p>
    </div>
    <div>
      <h2>Valores</h2>
      <table class="prices">
        <tbody>${t.precos.map((p) => `<tr><td>${esc(p.grupo)}</td><td>${eur(p.valor)}</td></tr>`).join('')}</tbody>
      </table>
      <p class="small">Valor por grupo, não por pessoa. Duração: ${esc(t.duracao)}.</p>
    </div>
  </div>
</section>
${avaliacoesTours(t.id)}
<section class="section">
  <div class="wrap">
    <h2 class="center">Para quem é este tour</h2>
    <p class="center lead-sm">Para todos os perfis. O conteúdo é adaptado a cada grupo, do livro de atividades para os pequenos à profundidade histórica para quem quer ir mais longe.</p>
    ${perfisTour(t)}
    ${blocoSozinha()}
  </div>
</section>
<section class="section alt">
  <div class="wrap">
    <h2 class="center">O que está incluído</h2>
    <ul class="checklist grid-2">${incluidoTours.map((i) => `<li>${i}</li>`).join('')}</ul>
  </div>
</section>
<section class="section">
  <div class="wrap narrow">
    <h2 class="center">Como reservar</h2>
    <ol class="steps">
      <li><strong>Chame no WhatsApp</strong> com as datas da viagem e o número de pessoas.</li>
      <li><strong>Confirme a data</strong> com um sinal, reembolsável em cancelamentos feitos com pelo menos 30 dias de antecedência.</li>
      <li><strong>Pague o restante</strong> perto do passeio. Pix, cartão ou Wise.</li>
    </ol>
    <div class="actions center"><a class="btn" href="${wa(data, msg)}" data-wa="tour-${t.id}-rodape" data-lead="${attr({ tour_id: t.id })}">Consultar datas no WhatsApp</a></div>
  </div>
</section>
<section class="section alt">
  <div class="wrap">
    <h2 class="center">Outros tours</h2>
    <div class="grid-3 cards">${outros
      .map(
        (o) =>
          `<article class="card card-photo">${img(o.imagem, o.imagem_alt, { sizes: CARD_SIZES })}<div class="card-body">${seloTour(o)}<p class="card-meta">${esc(o.duracao)}</p><h3>${esc(o.nome)}</h3>${o.subtitulo ? `<p class="card-sub">${esc(o.subtitulo)}</p>` : ''}<p class="price">A partir de ${eur(menorPreco(o))}</p><a class="btn btn-small btn-ghost" href="${url('/tours-em-paris/' + o.id + '/')}" data-item="${attr(tourItem(o))}">Ver o tour</a></div></article>`
      )
      .join('')}</div>
  </div>
</section>`;
  const trip = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: t.nome,
    description: t.ideal_para || t.descricao || `Tour privativo em Paris: ${t.roteiro.join(', ')}.`,
    touristType: 'Viajantes brasileiros',
    itinerary: { '@type': 'ItemList', itemListElement: t.roteiro.map((r, i) => ({ '@type': 'ListItem', position: i + 1, name: r })) },
    offers: t.precos.map((p) => ({ '@type': 'Offer', name: p.grupo, price: p.valor, priceCurrency: 'EUR' })),
    provider: { '@type': 'TravelAgency', name: 'Mel Rolan Travel Designer', url: SITE_URL },
  };
  return {
    path: `/tours-em-paris/${t.id}/`,
    title: `${/^tour /i.test(t.nome) ? t.nome : 'Tour ' + t.nome}${/paris/i.test(t.nome) ? ' em português' : ' em Paris'} | Mel Rolan`,
    description: `${t.nome}: tour privativo de ${t.duracao} em Paris, em português, com guia brasileira. A partir de ${eur(menorPreco(t))} por grupo.`,
    body,
    og: `og/tour-${t.id}.jpg`,
    servico: 'tours',
    analytics: [{ name: 'view_item', params: { currency: 'EUR', value: menorPreco(t), items: [tourItem(t)] } }],
    jsonld: [
      trip,
      breadcrumbLd([
        ['Início', '/'],
        ['Tours em Paris', '/tours-em-paris/'],
        [t.nome, `/tours-em-paris/${t.id}/`],
      ]),
    ],
  };
}
