// Conteúdo de todas as páginas. Preços, números e contatos vêm de data/ofertas.json.
import { url, esc, eur, brl, money, wa, menorPreco, img, SITE_URL } from './helpers.mjs';
import { privacidade, avisoLegal } from './legal.mjs';

const servico = (data, id) => data.servicos.find((s) => s.id === id);

const precoServico = (s) =>
  s.preco != null ? money(s.moeda, s.preco) : `A partir de ${money(s.moeda, s.preco_a_partir_de)}`;

const CARD_SIZES = '(min-width: 1000px) 340px, (min-width: 700px) 50vw, 100vw';

// Topo das páginas internas: texto à esquerda, foto à direita (no celular, foto abaixo do texto).
const heroSplit = (inner, key, alt) => `
<section class="hero hero-sm hero-split">
  <div class="wrap hero-split-grid">
    <div>${inner}</div>
    <div class="hero-split-media">${img(key, alt, { sizes: '(min-width: 900px) 540px, 100vw', eager: true })}</div>
  </div>
</section>`;

// Itens no formato do GA4 (comércio eletrônico), usados nos eventos de visualização e clique.
const tourItem = (t) => ({ item_id: t.id, item_name: t.nome, item_category: 'tour', price: menorPreco(t), currency: 'EUR' });
const guiaItem = (g) => ({ item_id: g.id, item_name: g.nome, item_category: 'guia digital', price: g.preco, currency: 'BRL' });
const attr = (o) => esc(JSON.stringify(o));

const breadcrumbLd = (itens) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: itens.map(([nome, caminho], i) => ({ '@type': 'ListItem', position: i + 1, name: nome, item: `${SITE_URL}${caminho}` })),
});

const servicoLd = (s, descricao) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: s.nome,
  serviceType: s.nome,
  description: descricao,
  areaServed: [{ '@type': 'Country', name: 'França' }, { '@type': 'City', name: 'Paris' }],
  availableLanguage: 'pt-BR',
  provider: { '@type': 'TravelAgency', name: 'Mel Rolan Travel Designer', url: SITE_URL },
  offers: {
    '@type': 'Offer',
    priceCurrency: s.moeda,
    ...(s.preco != null ? { price: s.preco } : { priceSpecification: { '@type': 'PriceSpecification', minPrice: s.preco_a_partir_de, priceCurrency: s.moeda } }),
  },
});

const faqHtml = (items) =>
  `<div class="faq">${items
    .map((f) => `<details><summary>${esc(f.q)}</summary><p>${f.a}</p></details>`)
    .join('')}</div>`;

const faqLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') },
  })),
});

const ctaFinal = (data, titulo, texto) => `
<section class="section cta-final">
  <div class="cta-bg" aria-hidden="true">${img('paginas/cta', '', { sizes: '100vw' })}</div>
  <div class="wrap narrow center">
    <h2>${titulo}</h2>
    <p>${texto}</p>
    <div class="actions center">
      <a class="btn" href="${url('/diagnostico/')}" data-cta="diagnostico">Começar o diagnóstico</a>
      <a class="btn btn-ghost" href="${wa(data, 'Olá! Vim pelo site da Mel Rolan e gostaria de conversar sobre a minha viagem a Paris.')}" data-wa="cta-final">Falar no WhatsApp</a>
    </div>
    <p class="small">Atendimento em português, direto de Paris.</p>
  </div>
</section>`;

const provaRapida = (m) => `
<section class="proof" aria-label="Números da Mel Rolan">
  <div class="wrap proof-grid">
    <p><strong>${m.nota_satisfacao} de 10</strong><span>na pesquisa de satisfação dos clientes (${m.pesquisas_satisfacao} respostas, ${m.periodo_pesquisas})</span></p>
    <p><strong>${m.familias_atendidas} famílias</strong><span>atendidas em roteiros, consultorias e tours</span></p>
    <p><strong>${m.anos_na_franca} anos</strong><span>vivendo em Paris</span></p>
  </div>
</section>`;

const depoimentos = (m) => `
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
    <div class="grid-3 quotes">
      <figure><blockquote>“Mel tem uma sensibilidade impressionante! Desde a primeira conversa dá pra sentir o quanto ela é competente, organizada e ama o que faz. Que sorte a nossa encontrar a Mel nessa viagem mãe e filha, que será inesquecível para nós. Ela cuidou de tudo, nos colocou com as melhores pessoas e nos melhores lugares.”</blockquote><figcaption><strong>Roberta</strong>, São Paulo (SP) · viagem mãe e filha</figcaption></figure>
      <figure><blockquote>“Mel foi bastante atenta e cuidadosa, buscando atender as particularidades do nosso grupo. Conhecer a França de mãos dadas com a Mel tornou a experiência inesquecível.”</blockquote><figcaption><strong>Fernanda</strong>, Natal (RN) · viagem em grupo</figcaption></figure>
      <figure><blockquote>“Além de competente, ela é uma simpatia de pessoa, educada, honesta e super acessível. O trabalho da Mel foi primordial para o sucesso da nossa tão sonhada e planejada viagem!”</blockquote><figcaption><strong>Renata</strong>, Pereiras (SP)</figcaption></figure>
    </div>
  </div>
</section>`;

const incluidoTours = [
  'Guia brasileira exclusiva para o seu grupo',
  'Logística a pé pensada para o seu ritmo',
  'Narrativa cultural em português',
  'Paradas estratégicas para fotos',
  'Indicações gastronômicas para o dia do tour',
  'Dicas práticas de segurança',
  'Alinhamento prévio pelo WhatsApp',
];

const faqTours = [
  {
    q: 'Como funciona a reserva de um tour?',
    a: 'Você chama no WhatsApp, verificamos a disponibilidade para as datas da sua viagem e definimos o roteiro. Para garantir a data, pedimos um sinal, reembolsável em cancelamentos feitos com pelo menos 30 dias de antecedência. O restante é pago perto do passeio.',
  },
  {
    q: 'O roteiro do tour pode ser alterado?',
    a: 'Sim. Como o tour é privativo, se no dia estiver chovendo ou você preferir se concentrar em um bairro, adaptamos o trajeto. Em caso de chuva forte ou imprevisto, a data pode ser remarcada.',
  },
  {
    q: 'Os tours entram em museus ou monumentos?',
    a: 'Não. Os tours acontecem inteiramente ao ar livre, por escolha: ruas, praças, jardins e as margens do Sena, onde a história de Paris se conta melhor a pé. Se quiser incluir museus na viagem, a Mel indica como encaixá-los na sua programação.',
  },
  {
    q: 'É adequado para crianças?',
    a: 'Totalmente. Temos um livro de atividades exclusivo, protagonizado pelo Monsieur Pombo, e fazemos pausas estratégicas em carrosséis e parques. Paris pode ser mágica para os pequenos quando o ritmo é pensado para eles.',
  },
];

// ---------------------------------------------------------------- HOME
function home(data) {
  const m = data.marca;
  const cards = [...data.servicos].sort((a, b) => a.ordem - b.ordem);
  const textos = {
    tours: {
      para: 'conhecer Paris a pé, no próprio ritmo, com uma guia brasileira ao lado.',
      txt: `Oito roteiros ao ar livre pelas ruas, praças e jardins que contam a história da cidade. Só o seu grupo, em português, com tempo para o café e para as pausas das crianças.`,
      cta: 'Ver os tours',
    },
    roteiro: {
      para: 'receber a viagem inteira desenhada, dia a dia.',
      txt: 'A Mel conhece a sua família, entende o ritmo de cada um e monta a programação completa: atrações, restaurantes, deslocamentos e o que precisa ser reservado com antecedência, tudo numa plataforma que você leva no celular.',
      cta: 'Quero um roteiro',
    },
    consultoria: {
      para: 'validar com segurança o que já começou a planejar.',
      txt: 'Uma conversa por vídeo para validar cidades, época, hospedagem e prioridades, com um mapa digital exclusivo para você consultar depois.',
      cta: 'Ver a consultoria',
    },
    guias: {
      para: 'planejar com autonomia, com a curadoria pronta.',
      txt: 'Curadoria completa em PDF, com acesso imediato: Paris com Crianças, com 158 páginas pensadas para cada idade, e Paris Essencial, com roteiro de 4 dias e 6 bate-voltas.',
      cta: 'Ver os guias',
    },
  };
  const faq = [
    {
      q: 'Qual a diferença entre tour, roteiro, consultoria e guia?',
      a: 'O tour é um passeio a pé com a Mel, em Paris. O roteiro é a viagem inteira planejada para você, dia a dia. A consultoria é uma conversa para validar as decisões que você já está tomando. O guia digital é a curadoria pronta, para quem prefere planejar sozinho. Se ainda estiver em dúvida, o diagnóstico indica o caminho em dois minutos.',
    },
    faqTours[3],
    faqTours[2],
    faqTours[0],
    {
      q: 'A Mel acompanha a viagem inteira?',
      a: 'O roteiro e a consultoria são entregues antes do embarque, com tudo pensado para você viajar com autonomia e segurança. Não oferecemos atendimento em tempo real durante toda a viagem. Os guias digitais são materiais em PDF, sem acompanhamento.',
    },
    {
      q: 'Quais são as formas de pagamento?',
      a: 'Serviços: Pix, cartão ou Wise. Guias digitais: cartão em até 4x sem juros ou Pix, em loja segura.',
    },
    {
      q: 'Com quanta antecedência devo contratar?',
      a: 'Para as férias de julho e para o fim de ano, as agendas costumam fechar cedo: o ideal é começar de 4 a 6 meses antes. Os guias digitais podem ser comprados a qualquer momento, com acesso imediato.',
    },
  ];

  const body = `
<section class="hero hero-photo">
  <div class="hero-media">${img('home/hero', 'Mel Rolan caminhando sobre uma ponte do Sena, em Paris', { sizes: '100vw', eager: true })}</div>
  <div class="wrap hero-content">
    <p class="eyebrow">Mel Rolan Travel Designer · Paris</p>
    <h1>Paris no seu ritmo, com quem vive aqui.</h1>
    <p class="lead">Tours privativos em português, roteiros sob medida, consultoria e guias digitais para brasileiros que querem viver Paris com tempo, contexto e escolhas certas. Curadoria da Mel, que mora em Paris há mais de ${m.anos_na_franca.replace('+', '')} anos.</p>
    <div class="actions">
      <a class="btn" href="${url('/diagnostico/')}" data-cta="diagnostico-hero">Descobrir o que combina com a minha viagem</a>
      <a class="btn btn-ghost" href="#como-ajudar">Ver tours e serviços</a>
    </div>
    <p class="small">Atendimento em português, direto de Paris.</p>
  </div>
</section>
${provaRapida(m)}
<section class="section" id="como-ajudar">
  <div class="wrap">
    <h2 class="center">Quatro formas de viver Paris com a Mel</h2>
    <p class="center lead-sm">Do planejamento completo ao passeio a pé pelas ruas da cidade, escolha o nível de apoio que faz sentido para a sua viagem.</p>
    <div class="grid-4 cards">
      ${cards
        .map((s) => {
          const t = textos[s.id];
          return `<article class="card card-photo">
        ${img(s.imagem, s.imagem_alt, { sizes: '(min-width: 1000px) 270px, (min-width: 700px) 50vw, 100vw' })}
        <div class="card-body">
        <h3>${esc(s.nome)}</h3>
        <p class="card-for"><strong>Para quem quer</strong> ${t.para}</p>
        <p>${t.txt}</p>
        <p class="price">${precoServico(s)}<span>${esc(s.unidade_preco)}</span></p>
        <a class="btn btn-small" href="${url(s.pagina + '/')}">${t.cta}</a>
        </div>
      </article>`;
        })
        .join('')}
    </div>
    <p class="center">Ainda em dúvida? <a href="${url('/diagnostico/')}">Responda cinco perguntas rápidas</a> e veja qual opção combina com a sua viagem.</p>
  </div>
</section>
<section class="section alt" id="para-quem">
  <div class="wrap">
    <h2 class="center">Cada viagem começa por quem vai viajar.</h2>
    <p class="center lead-sm">Famílias com crianças, casais, amigos, várias gerações e quem viaja sozinha. A Mel já atendeu de bebês de colo a viajantes de 89 anos, em grupos de até 16 pessoas, e desenha cada dia a partir de quem vai estar lá.</p>
    <div class="grid-4 perfis">
      <article class="card perfil">
        <h3>Famílias com crianças</h3>
        <p>Cada idade tem um ritmo, uma hora de soneca e um limite de caminhada. Parquinhos, pausas e restaurantes onde as crianças comem bem já entram no plano.</p>
        <p class="small">Para planejar por conta própria, conheça o <a href="${esc(data.guias[0].landing)}">guia Paris com Crianças</a>.</p>
      </article>
      <article class="card perfil">
        <h3>Casais</h3>
        <p>Bairros para caminhar sem pressa, mesas escolhidas com cuidado e tempo livre de verdade, sem transformar a viagem numa maratona de pontos turísticos.</p>
      </article>
      <article class="card perfil">
        <h3>Várias gerações e amigos</h3>
        <p>Avós, pais, filhos ou amigos no mesmo roteiro, com deslocamentos que respeitam o fôlego de cada um e programas que agradam a todas as idades.</p>
      </article>
      <article class="card perfil">
        <h3>Viajando sozinha</h3>
        <p>Bairros tranquilos para se hospedar, programas que funcionam bem para quem está sozinha e a liberdade de montar cada dia do seu jeito, com o olhar de uma mulher que escolheu viver em Paris.</p>
      </article>
    </div>
    <div class="compare-block">
      <h3 class="center compare-title">O mesmo dia, de dois jeitos</h3>
      <table class="compare">
        <thead><tr><th>Sem ajuste</th><th>Com curadoria</th></tr></thead>
        <tbody>
          <tr><td>Atrações espalhadas pelos dois lados da cidade</td><td>Um bairro por período, com tudo a poucos passos</td></tr>
          <tr><td>Metrô lotado na hora do rush</td><td>Deslocamentos fora do horário de pico, com a linha certa</td></tr>
          <tr><td>Almoço apressado onde deu</td><td>Um restaurante escolhido para quem está viajando</td></tr>
          <tr><td>Cansaço acumulado no meio da tarde</td><td>Uma pausa prevista num jardim, num café ou num parquinho, conforme o grupo</td></tr>
        </tbody>
      </table>
      <div class="actions center">
        <a class="btn" href="${url('/diagnostico/')}" data-cta="diagnostico-perfis">Planejar a minha viagem</a>
      </div>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <h2 class="center">Como funciona</h2>
    <ol class="steps">
      <li><strong>Conte sobre a sua viagem.</strong> Em dois minutos, você diz quem viaja, quando e o que procura.</li>
      <li><strong>Converse com a gente no WhatsApp.</strong> Você recebe a indicação da opção certa e tira suas dúvidas em português.</li>
      <li><strong>Chegue a Paris com tudo pensado.</strong> Com o roteiro, a consultoria ou o tour confirmados, cada detalhe está resolvido antes do embarque.</li>
    </ol>
    <p class="center small">Os guias digitais têm compra direta, com acesso imediato por e-mail.</p>
  </div>
</section>
${depoimentos(m)}
<section class="section alt">
  <div class="wrap split">
    ${img('home/mel', 'Mel Rolan sorrindo às margens do Sena, em Paris', { cls: 'photo', sizes: '(min-width: 900px) 540px, 100vw' })}
    <div>
    <h2>Quem desenha a sua viagem</h2>
    <p>Sou a Mel, brasileira, e moro em Paris há mais de 5 anos. Antes de fundar a Mel Rolan Travel Designer, em 2021, trabalhei com compliance e gestão de riscos, e trouxe esse cuidado com cada detalhe para o planejamento de viagens. Desde então, já acompanhei mais de ${m.familias_atendidas.replace('+', '')} famílias brasileiras em roteiros, consultorias e passeios.</p>
    <p>O que eu entrego é o que só se aprende vivendo aqui. Curadoria não se baixa. Ela se vive.</p>
    <a class="btn btn-ghost" href="${url('/sobre/')}">Conhecer a história da Mel</a>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap narrow">
    <h2 class="center">Perguntas frequentes</h2>
    ${faqHtml(faq)}
  </div>
</section>
${ctaFinal(data, 'Vamos desenhar a sua Paris?', 'Conte em dois minutos como é a sua viagem e receba a indicação do caminho certo. Se preferir, fale direto com a gente.')}
`;
  const org = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Mel Rolan Travel Designer',
    url: SITE_URL,
    description:
      'Tours privativos em português, roteiros sob medida, consultoria e guias digitais para brasileiros em Paris.',
    email: m.email,
    telephone: m.whatsapp_site.replace(/\s/g, ''),
    areaServed: { '@type': 'City', name: 'Paris' },
    founder: { '@type': 'Person', name: 'Mel Rolan' },
    logo: `${SITE_URL}/apple-touch-icon.png`,
    image: `${SITE_URL}/img/og/home.jpg`,
    knowsLanguage: ['pt-BR', 'fr'],
    sameAs: [m.instagram],
  };
  return {
    path: '/',
    title: 'Mel Rolan Travel Designer | Tours, roteiros e consultoria em Paris',
    description:
      'Tours privativos em português, roteiros sob medida, consultoria e guias digitais para brasileiros em Paris. Curadoria de quem mora na cidade há mais de 5 anos.',
    body,
    og: 'og/home.jpg',
    jsonld: [
      org,
      { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Mel Rolan Travel Designer', url: SITE_URL, inLanguage: 'pt-BR' },
      faqLd(faq),
    ],
  };
}

// ---------------------------------------------------------------- TOURS
function toursHub(data) {
  const s = servico(data, 'tours');
  const body = `
${heroSplit(`
    <p class="eyebrow">Tours privativos em Paris</p>
    <h1>Paris além dos cartões-postais, a pé e em português.</h1>
    <p class="lead">Passeios privativos, leves e sem correria, com uma guia brasileira que vive em Paris há mais de 5 anos. Só o seu grupo, no seu ritmo, pelas ruas, praças e jardins que contam a história da cidade.</p>
    <p class="price">${precoServico(s)}<span>${esc(s.unidade_preco)}</span></p>`, 'paginas/tours', 'Mel Rolan olhando para trás numa rua de paralelepípedos de Paris')}
<section class="section">
  <div class="wrap">
    <h2 class="center">Escolha o seu tour</h2>
    <div class="grid-3 cards">
      ${data.tours
        .map(
          (t) => `<article class="card card-photo">
        ${img(t.imagem, t.imagem_alt, { sizes: CARD_SIZES })}
        <div class="card-body">
        <p class="card-meta">${esc(t.duracao)} · ${esc(t.encontro)}</p>
        <h3>${esc(t.nome)}</h3>
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
<section class="section alt">
  <div class="wrap">
    <h2 class="center">O que está incluído em todos os tours</h2>
    <ul class="checklist grid-2">${incluidoTours.map((i) => `<li>${i}</li>`).join('')}</ul>
  </div>
</section>
<section class="section">
  <div class="wrap narrow">
    <h2 class="center">Perguntas frequentes</h2>
    ${faqHtml(faqTours)}
  </div>
</section>
${ctaFinal(data, 'Quer ajuda para escolher o tour?', 'Conte quem viaja e quando, e a gente indica o tour que combina com o seu grupo.')}
`;
  return {
    path: '/tours-em-paris/',
    title: 'Tours privativos em Paris em português | Mel Rolan',
    description:
      'Tours privativos a pé em Paris, em português, com guia brasileira. Oito roteiros ao ar livre, a partir de € 280 por grupo.',
    body,
    og: 'og/tours.jpg',
    servico: 'tours',
    analytics: [{ name: 'view_item_list', params: { item_list_name: 'tours', items: data.tours.map(tourItem) } }],
    jsonld: [faqLd(faqTours), breadcrumbLd([['Início', '/'], ['Tours em Paris', '/tours-em-paris/']])],
  };
}

function tourPage(data, t) {
  const outros = data.tours.filter((o) => o.id !== t.id).slice(0, 3);
  const msg = `Olá! Vim pelo site da Mel Rolan e gostaria de consultar datas para o tour ${t.nome}.`;
  const body = `
<nav class="wrap crumbs small" aria-label="Você está em"><a href="${url('/')}">Início</a> › <a href="${url('/tours-em-paris/')}">Tours em Paris</a> › ${esc(t.nome)}</nav>
${heroSplit(`
    <p class="eyebrow">Tour privativo em Paris · ${esc(t.duracao)}</p>
    <h1>${esc(t.nome)}</h1>
    ${t.ideal_para ? `<p class="lead"><strong>Ideal se:</strong> ${esc(t.ideal_para)}</p>` : ''}
    ${t.descricao ? `<p>${esc(t.descricao)}</p>` : ''}
    <p class="price">A partir de ${eur(menorPreco(t))}<span>${esc(t.precos[0].grupo)}</span></p>
    <div class="actions">
      <a class="btn" href="${wa(data, msg)}" data-wa="tour-${t.id}" data-lead="${attr({ tour_id: t.id })}">Consultar datas no WhatsApp</a>
    </div>`, t.imagem, t.imagem_alt)}
<section class="section">
  <div class="wrap split">
    <div>
      <h2>Roteiro</h2>
      <ol class="route">${t.roteiro.map((r) => `<li>${esc(r)}</li>`).join('')}</ol>
      <p class="small">Tour 100% ao ar livre. Ponto de encontro: ${esc(t.encontro)}.</p>
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
        (o) => `<article class="card card-photo">${img(o.imagem, o.imagem_alt, { sizes: CARD_SIZES })}<div class="card-body"><p class="card-meta">${esc(o.duracao)}</p><h3>${esc(o.nome)}</h3><p class="price">A partir de ${eur(menorPreco(o))}</p><a class="btn btn-small btn-ghost" href="${url('/tours-em-paris/' + o.id + '/')}" data-item="${attr(tourItem(o))}">Ver o tour</a></div></article>`
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
    title: `${t.nome}: tour privativo em Paris em português | Mel Rolan`,
    description: `${t.nome}: tour privativo de ${t.duracao} em Paris, em português, com guia brasileira. A partir de ${eur(menorPreco(t))} por grupo.`,
    body,
    og: `og/tour-${t.id}.jpg`,
    servico: 'tours',
    analytics: [{ name: 'view_item', params: { currency: 'EUR', value: menorPreco(t), items: [tourItem(t)] } }],
    jsonld: [trip, breadcrumbLd([['Início', '/'], ['Tours em Paris', '/tours-em-paris/'], [t.nome, `/tours-em-paris/${t.id}/`]])],
  };
}

// ---------------------------------------------------------------- ROTEIRO
function roteiro(data) {
  const s = servico(data, 'roteiro');
  const msg = 'Olá! Vim pelo site da Mel Rolan e tenho interesse em um roteiro sob medida para Paris.';
  const body = `
${heroSplit(`
    <p class="eyebrow">Roteiro sob medida</p>
    <h1>A sua viagem inteira, desenhada dia a dia para quem vai viajar.</h1>
    <p class="lead">Um roteiro personalizado que leva em conta os seus desejos, o orçamento, o ritmo de cada um e o que faz sentido para a sua família, com acesso a experiências autênticas que só quem vive aqui conhece.</p>
    <p class="price">${precoServico(s)}</p>
    <div class="actions">
      <a class="btn" href="${url('/diagnostico/')}" data-cta="diagnostico-roteiro">Começar pelo diagnóstico</a>
      <a class="btn btn-ghost" href="${wa(data, msg)}" data-wa="roteiro">Falar no WhatsApp</a>
    </div>`, 'paginas/roteiro', 'Mel Rolan num café de Paris, com um chocolate quente')}
<section class="section">
  <div class="wrap">
    <h2 class="center">Sua viagem em 3 etapas</h2>
    <ol class="steps steps-3">
      <li><strong>Conexão.</strong> Por meio de um questionário e de uma reunião inicial, a Mel conhece as suas preferências e expectativas.</li>
      <li><strong>Travel design.</strong> A viagem ganha forma: itinerário, experiências, restaurantes e deslocamentos definidos um a um.</li>
      <li><strong>Entrega.</strong> Você recebe o roteiro de forma visual e detalhada e, se preciso, ajustamos juntos para que fique ainda mais do seu jeito.</li>
    </ol>
  </div>
</section>
<section class="section alt">
  <div class="wrap">
    <h2 class="center">O que o roteiro inclui</h2>
    <ul class="checklist grid-2">
      <li>A programação completa, dia a dia, com atrações, restaurantes e experiências escolhidos para você</li>
      <li>Organização dos serviços necessários, como traslados e guias</li>
      <li>Mapas e orientações de deslocamento, com trajetos, aplicativos e transporte</li>
      <li>Guia de informações úteis sobre os destinos</li>
      <li>Dois encontros online para conversar sobre dúvidas e preocupações</li>
      <li>Suporte por WhatsApp durante o planejamento</li>
    </ul>
  </div>
</section>
<section class="section">
  <div class="wrap split">
    ${img('servicos/roteiro', 'Café, croissant e o celular com o roteiro da viagem, numa mesa em Paris', { cls: 'photo', sizes: '(min-width: 900px) 540px, 100vw' })}
    <div>
    <h2>Seu roteiro na palma da mão</h2>
    <p>Você acessa o roteiro completo numa plataforma digital, pelo aplicativo no celular ou pela versão web, para consultar a qualquer momento da viagem. Nela ficam também as reservas antecipadas, os ingressos e os serviços contratados, organizados de forma simples.</p>
    </div>
  </div>
  <div class="wrap narrow">
    <h2>Por que contratar uma especialista no destino</h2>
    <ul class="checklist">
      <li>Você se inspira e sonha, sem gastar horas em pesquisas na internet.</li>
      <li>Você não perde tempo com atrações e lugares que não fazem sentido para você.</li>
      <li>Você chega a Paris mais preparado e seguro, com cada detalhe pensado antes do embarque.</li>
    </ul>
    <p class="small">O roteiro é entregue antes da viagem. Não inclui atendimento em tempo real durante a viagem.</p>
  </div>
</section>
${depoimentos(data.marca)}
${ctaFinal(data, 'Vamos desenhar a sua viagem?', `Roteiros a partir de ${brl(s.preco_a_partir_de)}. Conte como é a sua viagem e a Mel indica o formato certo.`)}
`;
  return {
    path: '/roteiro-sob-medida/',
    title: 'Roteiro personalizado para Paris e França | Mel Rolan',
    description: `Roteiro sob medida para Paris e a França, dia a dia, feito por quem vive em Paris. A partir de ${brl(s.preco_a_partir_de)}.`,
    body,
    og: 'og/roteiro.jpg',
    servico: 'roteiro',
    jsonld: [
      servicoLd(s, 'Roteiro de viagem personalizado para Paris e a França, planejado dia a dia por uma travel designer brasileira que vive em Paris.'),
      breadcrumbLd([['Início', '/'], ['Roteiro sob medida', '/roteiro-sob-medida/']]),
    ],
  };
}

// ---------------------------------------------------------------- CONSULTORIA
function consultoria(data) {
  const s = servico(data, 'consultoria');
  const msg = 'Olá! Vim pelo site da Mel Rolan e tenho interesse na consultoria de viagem.';
  const body = `
${heroSplit(`
    <p class="eyebrow">Consultoria personalizada</p>
    <h1>Planeje a sua viagem à França com mais segurança.</h1>
    <p class="lead">Para quem já começou a planejar e quer tomar as melhores decisões com a ajuda de uma especialista que vive no destino.</p>
    <p class="price">${precoServico(s)}<span>${esc(s.unidade_preco)}</span></p>
    <div class="actions">
      <a class="btn" href="${wa(data, msg)}" data-wa="consultoria">Agendar pelo WhatsApp</a>
      <a class="btn btn-ghost" href="${url('/diagnostico/')}" data-cta="diagnostico-consultoria">Não sei se é para mim</a>
    </div>`, 'paginas/consultoria', 'Mel Rolan sorrindo junto a um muro de pedra em Paris')}
<section class="section">
  <div class="wrap">
    <h2 class="center">Consultoria em 2 etapas</h2>
    <ol class="steps steps-2">
      <li><strong>Conexão.</strong> Um questionário para a Mel conhecer você e entender as suas dúvidas e necessidades.</li>
      <li><strong>Reunião de consultoria.</strong> Uma conversa por vídeo para esclarecer as dúvidas e ajudar você a tomar as melhores decisões.</li>
    </ol>
  </div>
</section>
<section class="section alt">
  <div class="wrap narrow">
    <h2>O que você recebe</h2>
    <p>Um mapa digital exclusivo com sugestões de regiões e cidades-base para a sua viagem. Nele podem entrar indicações específicas de hospedagem, atrações e restaurantes, de acordo com os seus interesses. O mapa também serve de apoio durante a reunião.</p>
    <h2>Em que a consultoria ajuda</h2>
    <ul class="checklist">
      <li>Melhor época do ano para as regiões que você quer visitar</li>
      <li>Cidades-base, roteiro geral e meios de transporte entre elas</li>
      <li>Hospedagem de acordo com o seu orçamento</li>
      <li>Curadoria de atrações, restaurantes e lojas</li>
    </ul>
    <p class="small">Precisa de tudo planejado, dia a dia? Veja o <a href="${url('/roteiro-sob-medida/')}">roteiro sob medida</a>.</p>
  </div>
</section>
${ctaFinal(data, 'Vamos conversar sobre a sua viagem?', `Consultoria por ${brl(s.preco)}, com mapa digital exclusivo.`)}
`;
  return {
    path: '/consultoria/',
    title: 'Consultoria de viagem para Paris e França | Mel Rolan',
    description: `Consultoria por vídeo para planejar a sua viagem à França, com mapa digital exclusivo. ${brl(s.preco)}.`,
    body,
    og: 'og/consultoria.jpg',
    servico: 'consultoria',
    jsonld: [
      servicoLd(s, 'Consultoria de viagem por vídeo para validar cidades, época, hospedagem e prioridades de uma viagem à França, com mapa digital exclusivo.'),
      breadcrumbLd([['Início', '/'], ['Consultoria', '/consultoria/']]),
    ],
  };
}

// ---------------------------------------------------------------- GUIAS
function guias(data) {
  const body = `
<section class="hero hero-sm">
  <div class="wrap narrow">
    <p class="eyebrow">Guias digitais de Paris</p>
    <h1>A curadoria da Mel, pronta para você planejar com autonomia.</h1>
    <p class="lead">Guias em PDF com acesso imediato por e-mail, feitos por quem mora em Paris há mais de 5 anos.</p>
  </div>
</section>
<section class="section">
  <div class="wrap grid-2 cards">
    ${data.guias
      .map(
        (g) => `<article class="card card-h">
      ${img(g.imagem, g.imagem_alt, { cls: 'cover', sizes: '(min-width: 600px) 200px, 100vw' })}
      <div class="card-body">
      <h2 class="h3">${esc(g.nome)}</h2>
      ${g.paginas ? `<p>${g.paginas} páginas de curadoria real${g.bonus ? `, com bônus: ${esc(g.bonus)}` : ''}.</p>` : ''}
      ${g.descricao ? `<p>${esc(g.descricao)}</p>` : ''}
      <p class="price">${g.preco_de ? `<s>${brl(g.preco_de)}</s> ` : ''}${brl(g.preco)}${g.parcelamento ? `<span>ou ${esc(g.parcelamento)}</span>` : '<span aria-hidden="true">&nbsp;</span>'}</p>
      <div class="actions stack guia-actions">
        <a class="btn btn-small" href="${esc(g.link_compra)}" data-checkout="${attr(guiaItem(g))}">Comprar agora</a>
        <a class="btn btn-small btn-ghost" href="${esc(g.landing)}">Conhecer o guia</a>
      </div>
      </div>
    </article>`
      )
      .join('')}
  </div>
  <ul class="wrap pagamento" aria-label="Pagamento e entrega">
    <li><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>Pagamento seguro</li>
    <li><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19M6.5 15h4"/></svg>Cartão de crédito</li>
    <li><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3l9 9-9 9-9-9z"/><path d="M8.5 12h7"/></svg>Pix</li>
    <li><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5 12 13l8.5-6.5"/></svg>Acesso imediato por e-mail</li>
  </ul>
</section>
${ctaFinal(data, 'Prefere ajuda personalizada?', 'Se quiser alguém desenhando a viagem com você, conheça o roteiro sob medida e a consultoria.')}
`;
  return {
    path: '/guias-de-paris/',
    title: 'Guias de Paris em PDF | Mel Rolan Travel Designer',
    description:
      'Guias digitais de Paris em PDF: Paris com Crianças e Paris Essencial. Curadoria de quem vive em Paris, com acesso imediato.',
    body,
    og: 'og/guias.jpg',
    servico: 'guias',
    analytics: [{ name: 'view_item_list', params: { item_list_name: 'guias', items: data.guias.map(guiaItem) } }],
    jsonld: [
      ...data.guias.map((g) => ({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: g.nome,
        image: `${SITE_URL}/img/${g.imagem}-600.webp`,
        description: g.paginas ? `Guia digital em PDF com ${g.paginas} páginas.` : 'Guia digital em PDF.',
        brand: { '@type': 'Brand', name: 'Mel Rolan Travel Designer' },
        offers: { '@type': 'Offer', price: g.preco, priceCurrency: 'BRL', availability: 'https://schema.org/InStock', url: g.link_compra },
      })),
      breadcrumbLd([['Início', '/'], ['Guias de Paris', '/guias-de-paris/']]),
    ],
  };
}

// ---------------------------------------------------------------- SOBRE
function sobre(data) {
  const m = data.marca;
  const body = `
<section class="hero hero-sm">
  <div class="wrap narrow">
    <p class="eyebrow">Sobre a Mel</p>
    <h1>Curadoria não se baixa. Ela se vive.</h1>
  </div>
</section>
<section class="section">
  <div class="wrap split sobre-grid">
    ${img('sobre/retrato', 'Retrato de Mel Rolan diante da Basílica de Sacré-Cœur, em Montmartre', { cls: 'photo', sizes: '(min-width: 900px) 460px, 100vw', eager: true })}
    <div>
    <p>Sou a Mel, brasileira, e moro em Paris há mais de ${m.anos_na_franca.replace('+', '')} anos. Antes de fundar a Mel Rolan Travel Designer, em 2021, trabalhei com compliance e gestão de riscos, e trouxe esse cuidado com cada detalhe para o planejamento de viagens.</p>
    <p>Desde então, já acompanhei mais de ${m.familias_atendidas.replace('+', '')} famílias brasileiras em roteiros, consultorias e passeios, de casais a grupos de 16 pessoas, de bebês a viajantes de 89 anos. Muitas já planejam voltar.</p>
    <p>O meu trabalho vai além de apontar monumentos. Eu traduzo os códigos culturais de Paris para quem chega do Brasil, crio conexões e garanto que a viagem seja fluida, com escolhas que fazem sentido para cada pessoa.</p>
    </div>
  </div>
  <div class="wrap gallery">
    ${img('sobre/g1', 'Retrato de Mel Rolan numa ruela de Paris', { sizes: '(min-width: 1000px) 360px, 33vw' })}
    ${img('sobre/g2', 'Mel Rolan sorrindo diante de uma porta azul em Paris', { sizes: '(min-width: 1000px) 360px, 33vw' })}
    ${img('sobre/g3', 'Mel Rolan rindo enquanto caminha por uma rua de Paris', { sizes: '(min-width: 1000px) 360px, 33vw' })}
  </div>
</section>
${provaRapida(m)}
${depoimentos(m)}
${ctaFinal(data, 'Vamos desenhar a sua Paris?', 'Conte como é a sua viagem e receba a indicação do caminho certo.')}
`;
  return {
    path: '/sobre/',
    title: 'Sobre a Mel Rolan | Travel designer brasileira em Paris',
    description: `Conheça a Mel Rolan, brasileira que vive em Paris há mais de 5 anos e já acompanhou mais de 650 famílias em roteiros, consultorias e tours.`,
    body,
    og: 'og/sobre.jpg',
    jsonld: [breadcrumbLd([['Início', '/'], ['Sobre a Mel', '/sobre/']])],
  };
}

// ---------------------------------------------------------------- DIAGNÓSTICO
function diagnostico(data) {
  const cfg = {
    whatsapp: data.marca.whatsapp_site_link,
    base: url(''),
    servicos: Object.fromEntries(data.servicos.map((s) => [s.id, { nome: s.nome, preco: precoServico(s), pagina: url(s.pagina + '/') }])),
    guia: { nome: data.guias[0].nome, link: data.guias[0].landing },
    wix: data.integracoes && {
      clientId: data.integracoes.wix_forms.client_id,
      formId: data.integracoes.wix_forms.form_id,
      campos: data.integracoes.wix_forms.campos,
    },
  };
  const body = `
<section class="hero hero-sm">
  <div class="wrap narrow">
    <p class="eyebrow">Diagnóstico da viagem</p>
    <h1>Qual opção combina com a sua viagem?</h1>
    <p class="lead">Cinco perguntas rápidas. No final, você vê a indicação da Mel, e as suas respostas chegam para a nossa equipe, que fala com você pelo WhatsApp.</p>
  </div>
</section>
<section class="section">
  <div class="wrap narrow">
    <form id="diagnostico" class="quiz" novalidate>
      <p class="quiz-progress" aria-live="polite"></p>

      <fieldset class="step" data-step="1">
        <legend>O que você procura?</legend>
        <label><input type="radio" name="procura" value="tours"> Um passeio guiado em Paris</label>
        <label><input type="radio" name="procura" value="roteiro"> A viagem inteira planejada para mim</label>
        <label><input type="radio" name="procura" value="consultoria"> Validar o que eu já planejei</label>
        <label><input type="radio" name="procura" value="guias"> Um guia para planejar sozinho</label>
        <label><input type="radio" name="procura" value="nao-sei"> Ainda não sei</label>
      </fieldset>

      <fieldset class="step" data-step="2" hidden>
        <legend>Quando é a viagem?</legend>
        <label><input type="radio" name="quando" value="nos próximos 3 meses"> Nos próximos 3 meses</label>
        <label><input type="radio" name="quando" value="em 3 a 6 meses"> Em 3 a 6 meses</label>
        <label><input type="radio" name="quando" value="daqui a mais de 6 meses"> Daqui a mais de 6 meses</label>
        <label><input type="radio" name="quando" value="ainda sem data"> Ainda não tenho data</label>
      </fieldset>

      <fieldset class="step" data-step="3" hidden>
        <legend>Quem vai viajar?</legend>
        <label><input type="radio" name="quem" value="família com crianças"> Família com crianças</label>
        <label><input type="radio" name="quem" value="casal"> Casal</label>
        <label><input type="radio" name="quem" value="viagem solo"> Vou sozinha ou sozinho</label>
        <label><input type="radio" name="quem" value="amigos ou grupo"> Amigos ou grupo</label>
        <label><input type="radio" name="quem" value="família com avós"> Várias gerações, com avós</label>
        <div class="conditional" data-show-if="quem=família com crianças">
          <label class="text-label">Idade das crianças (opcional)<input type="text" name="idades" placeholder="Ex.: 3 e 7 anos"></label>
        </div>
      </fieldset>

      <fieldset class="step" data-step="4" hidden>
        <legend>Quanto você pretende investir nos serviços da Mel?</legend>
        <p class="hint">Sem contar passagens, hospedagem e ingressos. Perguntamos para indicar a opção que faz sentido para você, sem desperdiçar o seu tempo.</p>
        <label><input type="radio" name="investimento" value="até R$ 500"> Até R$ 500</label>
        <label><input type="radio" name="investimento" value="de R$ 500 a R$ 1.500"> De R$ 500 a R$ 1.500</label>
        <label><input type="radio" name="investimento" value="de R$ 1.500 a R$ 3.000"> De R$ 1.500 a R$ 3.000</label>
        <label><input type="radio" name="investimento" value="acima de R$ 3.000"> Acima de R$ 3.000</label>
        <label><input type="radio" name="investimento" value="ainda não sei"> Ainda não sei</label>
      </fieldset>

      <fieldset class="step" data-step="5" hidden>
        <legend>Para quem enviamos a indicação?</legend>
        <label class="text-label">Seu primeiro nome<input type="text" name="nome" autocomplete="given-name" required maxlength="60"></label>
        <label class="text-label">Seu WhatsApp, com DDD<input type="tel" name="whatsapp" autocomplete="tel" inputmode="tel" required placeholder="Ex.: 11 91234-5678" maxlength="25"></label>
        <p class="hint">Mora fora do Brasil? Use o código do país, por exemplo +33 6 12 34 56 78.</p>
        <label class="text-label">Algo mais que a Mel deveria saber? (opcional)<textarea name="obs" rows="3" maxlength="500" placeholder="Ex.: é a nossa primeira vez em Paris"></textarea></label>
        <p class="hint">Ao ver a indicação, suas respostas, seu nome e seu WhatsApp são enviados à equipe da Mel Rolan, apenas para falarmos com você sobre a sua viagem. Veja a <a href="${url('/privacidade/')}">política de privacidade</a>.</p>
      </fieldset>

      <div class="quiz-nav">
        <button type="button" class="btn btn-ghost" data-back hidden>Voltar</button>
        <button type="button" class="btn" data-next>Continuar</button>
      </div>
      <p class="quiz-error small" role="alert" hidden>Escolha uma opção para continuar.</p>
    </form>

    <div id="resultado" class="result" hidden aria-live="polite"></div>
  </div>
</section>
<script id="diagnostico-config" type="application/json">${JSON.stringify(cfg)}</script>
`;
  return {
    path: '/diagnostico/',
    title: 'Diagnóstico da viagem a Paris | Mel Rolan',
    description:
      'Responda cinco perguntas rápidas e descubra qual opção combina com a sua viagem a Paris: tour, roteiro, consultoria ou guia digital.',
    body,
    scripts: ['/js/diagnostico.js'],
    noFloat: true,
    og: 'og/diagnostico.jpg',
  };
}

export function pages(data) {
  return [
    home(data),
    toursHub(data),
    ...data.tours.map((t) => tourPage(data, t)),
    roteiro(data),
    consultoria(data),
    guias(data),
    sobre(data),
    diagnostico(data),
    privacidade(data),
    avisoLegal(data),
  ];
}
