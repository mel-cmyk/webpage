// Página inicial. Preços, números e contatos vêm de data/ofertas.json.
import { url, esc, img, SITE_URL } from '../helpers.mjs';
import { RESPOSTA, precoServico, faqHtml, faqLd, ctaFinal } from './comum.mjs';
import { provaRapida, depoimentos, imprensaFaixa, faqTours } from './blocos.mjs';

// ---------------------------------------------------------------- HOME
export function home(data) {
  const m = data.marca;
  const cards = [...data.servicos].sort((a, b) => a.ordem - b.ordem);
  const textos = {
    tours: {
      para: 'conhecer Paris a pé, no próprio ritmo, com uma guia brasileira ao lado.',
      txt: `Roteiros ao ar livre pelas ruas, praças e jardins que contam a história da cidade. Só o seu grupo, em português, com tempo para o café, as fotos e as pausas que o seu grupo pedir.`,
      cta: 'Ver os tours',
    },
    roteiro: {
      para: 'receber a viagem inteira desenhada, dia a dia.',
      txt: 'A Mel conhece quem vai viajar, entende o ritmo de cada um e monta a programação completa: atrações, restaurantes, deslocamentos e o que precisa ser reservado com antecedência, tudo numa plataforma que você leva no celular.',
      cta: 'Quero um roteiro',
    },
    consultoria: {
      para: 'começar a planejar, tirar dúvidas ou validar o que já tem.',
      txt: 'Uma conversa por vídeo com a Mel, no ponto em que a sua viagem estiver: definir destinos e dias em cada região, esclarecer dúvidas ou validar o que já está planejado. Com um mapa digital exclusivo para consultar depois.',
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
      a: 'O tour é um passeio a pé com a Mel, em Paris. O roteiro é a viagem inteira planejada para você, dia a dia. A consultoria é uma conversa com a Mel para o momento em que você estiver: começar a planejar, tirar dúvidas ou validar o que já decidiu. O guia digital é a curadoria pronta, para quem prefere planejar sozinho. Se ainda estiver em dúvida, o diagnóstico indica o caminho em dois minutos.',
    },
    {
      q: 'Os serviços são só para famílias com crianças?',
      a: 'Não. A Mel atende famílias com crianças, casais, grupos de amigos, viagens com várias gerações e quem viaja sozinha, com o mesmo cuidado. O que muda é o desenho de cada dia: o ritmo, os bairros, as pausas e os programas escolhidos para quem vai estar lá.',
    },
    faqTours[3],
    faqTours[1],
    {
      q: 'A Mel acompanha a viagem inteira?',
      a: 'O roteiro e a consultoria são entregues antes do embarque, com tudo pensado para você viajar com autonomia e segurança. Não oferecemos atendimento em tempo real durante toda a viagem, mas ficamos à disposição para um apoio pontual, se necessário. Os guias digitais são materiais em PDF, sem acompanhamento.',
    },
    {
      q: 'Quais são as formas de pagamento?',
      a: 'Serviços: Pix, cartão ou Wise. Guias digitais: cartão em até 4x sem juros ou Pix, em loja segura.',
    },
    {
      q: 'Com quanta antecedência devo contratar?',
      a: 'Depende do serviço. A consultoria pode ser contratada a qualquer momento, e quanto antes, melhor. Para o roteiro personalizado, o ideal é contratar com 6 meses de antecedência. Para os tours guiados nas férias de julho e no fim de ano, reserve com bastante antecedência, porque as agendas fecham cedo. Os guias digitais podem ser comprados a qualquer momento, com acesso imediato.',
    },
  ];

  const body = `
<section class="hero hero-photo">
  <div class="hero-media">${img('home/hero', 'Mel Rolan caminhando sobre uma ponte do Sena, em Paris', { sizes: '100vw', eager: true })}</div>
  <div class="wrap hero-content">
    <p class="eyebrow">Mel Rolan Travel Designer · Paris</p>
    <h1>A sua viagem à França, pensada por quem é especialista em viajantes brasileiros.</h1>
    <p class="lead">Tours privativos em português, roteiros sob medida, consultoria e guias digitais para brasileiros que querem viver Paris com tempo, contexto e escolhas certas. Curadoria da Mel, que desde ${m.ano_fundacao} já planejou a viagem de mais de ${m.familias_atendidas.replace('+', '')} clientes brasileiros.</p>
    <div class="actions">
      <a class="btn" href="${url('/diagnostico/')}" data-cta="diagnostico-hero">Descobrir o que combina com a minha viagem</a>
      <a class="btn btn-ghost" href="#como-ajudar">Ver tours e serviços</a>
    </div>
    <p class="small">${RESPOSTA}</p>
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
    <p class="center">Ainda em dúvida? <a href="${url('/diagnostico/')}">Responda cinco perguntas rápidas</a> e veja qual combinação de serviços combina com a sua viagem.</p>
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
        <p class="small">Para planejar por conta própria, conheça o <a href="${url(data.guias[0].landing)}">guia Paris com Crianças</a>.</p>
      </article>
      <article class="card perfil">
        <h3>Casais</h3>
        <p>Bairros para caminhar sem pressa, mesas escolhidas com cuidado e programação com respiro, sem transformar a viagem numa maratona de pontos turísticos.</p>
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
        <thead><tr><th>Como costuma ser</th><th>Como a Mel planeja</th></tr></thead>
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
${imprensaFaixa(data)}
${depoimentos(m)}
<section class="section alt">
  <div class="wrap split">
    ${img('home/mel', 'Mel Rolan sorrindo às margens do Sena, em Paris', { cls: 'photo', sizes: '(min-width: 900px) 540px, 100vw' })}
    <div>
    <h2>Quem desenha a sua viagem</h2>
    <p>Sou a Mel, brasileira, bacharel em Turismo e ex-aluna da École du Louvre (2025/2026), e já viajei pelos quatro cantos da França, um repertório que entra em cada roteiro. Antes de fundar a Mel Rolan Travel Designer, em ${m.ano_fundacao}, trabalhei com compliance e gestão de riscos, e trouxe esse cuidado com cada detalhe para o planejamento de viagens. Desde então, já acompanhei mais de ${m.familias_atendidas.replace('+', '')} clientes brasileiros em roteiros, consultorias e passeios, de casais a grupos de 16 pessoas, de bebês a viajantes de 89 anos.</p>
    
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
${ctaFinal(data, 'Vamos desenhar a sua viagem?', 'Conte em dois minutos como é a sua viagem e receba a indicação do caminho certo. Se preferir, fale direto com a gente.')}
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
    founder: { '@type': 'Person', name: 'Mel Rolan', alumniOf: { '@type': 'CollegeOrUniversity', name: 'École du Louvre' } },
    logo: `${SITE_URL}/apple-touch-icon.png`,
    image: `${SITE_URL}/img/og/home.jpg`,
    knowsLanguage: ['pt-BR', 'fr'],
    sameAs: [m.instagram],
  };
  return {
    path: '/',
    title: 'Mel Rolan | Tours, roteiros e consultoria em Paris',
    description:
      'Tours privativos em português, roteiros sob medida, consultoria e guias digitais para brasileiros em Paris, com curadoria de uma especialista.',
    body,
    og: 'og/home.jpg',
    jsonld: [
      org,
      { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Mel Rolan Travel Designer', url: SITE_URL, inLanguage: 'pt-BR' },
      faqLd(faq),
    ],
  };
}
