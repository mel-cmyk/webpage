// Sobre a Mel, Na mídia e Parcerias. Preços, números e contatos vêm de data/ofertas.json.
import { url, esc, img, SITE_URL } from '../helpers.mjs';
import { breadcrumbLd, ctaFinal } from './comum.mjs';
import { provaRapida, depoimentos, dataBR, logoImg, veiculoTxt } from './blocos.mjs';

// ---------------------------------------------------------------- SOBRE
export function sobre(data) {
  const m = data.marca;
  const body = `
<section class="hero hero-sm">
  <div class="wrap narrow">
    <p class="eyebrow">Sobre a Mel</p>
    <h1>A França do seu jeito, com o olhar de quem conhece cada canto.</h1>
  </div>
</section>
<section class="section">
  <div class="wrap split sobre-grid">
    ${img('sobre/retrato', 'Retrato de Mel Rolan diante da Basílica de Sacré-Cœur, em Montmartre', { cls: 'photo', sizes: '(min-width: 900px) 460px, 100vw', eager: true })}
    <div>
    <p>Sou a Mel, brasileira, bacharel em Turismo e ex-aluna da École du Louvre (2025/2026), e moro em Paris há mais de ${m.anos_na_franca.replace('+', '')} anos. Já viajei pelos quatro cantos da França, e esse repertório entra em cada roteiro. Antes de fundar a Mel Rolan Travel Designer, em 2021, trabalhei com compliance e gestão de riscos, e trouxe esse cuidado com cada detalhe para o planejamento de viagens.</p>
    <p>Desde então, já acompanhei mais de ${m.familias_atendidas.replace('+', '')} clientes brasileiros em roteiros, consultorias e passeios, de casais a grupos de 16 pessoas, de bebês a viajantes de 89 anos. Muitos já planejam voltar.</p>
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
<p class="center small">Agências de viagem e prestadores na França: <a href="${url('/parcerias/')}">conheça as nossas parcerias</a>.</p>
${ctaFinal(data, 'Vamos desenhar a sua viagem?', 'Conte como é a sua viagem e receba a indicação do caminho certo.')}
`;
  return {
    path: '/sobre/',
    title: 'Sobre a Mel Rolan | Travel designer brasileira em Paris',
    description: `Conheça a Mel Rolan, brasileira que vive em Paris há mais de ${m.anos_na_franca.replace('+', '')} anos e já acompanhou mais de ${m.familias_atendidas.replace('+', '')} clientes em roteiros, consultorias e tours.`,
    body,
    og: 'og/sobre.jpg',
    jsonld: [
      breadcrumbLd([
        ['Início', '/'],
        ['Sobre a Mel', '/sobre/'],
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Mel Rolan',
        jobTitle: 'Travel designer e guia em Paris',
        description: 'Brasileira que vive em Paris, bacharel em Turismo e ex-aluna da École du Louvre (2025/2026), especialista em viajantes brasileiros.',
        url: `${SITE_URL}/sobre/`,
        image: `${SITE_URL}/img/og/sobre.jpg`,
        alumniOf: { '@type': 'CollegeOrUniversity', name: 'École du Louvre' },
        worksFor: { '@type': 'TravelAgency', name: 'Mel Rolan Travel Designer', url: SITE_URL },
        homeLocation: { '@type': 'City', name: 'Paris' },
        knowsLanguage: ['pt-BR', 'fr'],
        sameAs: [m.instagram],
      },
    ],
  };
}

// ---------------------------------------------------------------- NA MÍDIA
export function naMidia(data) {
  const body = `
<section class="section">
  <div class="wrap narrow">
    <p class="eyebrow">Na mídia</p>
    <h1>A Mel Rolan na imprensa</h1>
    <p class="lead">Matérias em que a Mel fala sobre planejar viagens, Paris e viagens em família.</p>
    <div class="imprensa-lista">
      ${data.imprensa
        .map(
          (x) => `<article class="imprensa-item">
        <a class="imprensa-logo-link" href="${esc(x.url)}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">${logoImg(x)}</a>
        <p class="imprensa-veiculo">${veiculoTxt(x)} · ${dataBR(x.data)}${x.autor ? ` · por ${esc(x.autor)}` : ''}</p>
        <h2><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.titulo)}</a></h2>
        <p>${esc(x.subtitulo)}</p>
        ${x.citacao ? `<blockquote>“${esc(x.citacao)}”</blockquote>` : ''}
        <p class="small"><a href="${esc(x.url)}" target="_blank" rel="noopener">Ler a matéria em ${esc(x.veiculo)}</a></p>
      </article>`
        )
        .join('')}
    </div>
    <div class="assessoria">
      ${img('imprensa/milene-pinto', `${data.assessoria.nome}, ${data.assessoria.cargo.toLowerCase()}`, { cls: 'assessoria-foto', sizes: '96px' })}
      <div>
      <p class="eyebrow">Assessoria de imprensa</p>
      <p><strong>${esc(data.assessoria.nome)}</strong>, ${esc(data.assessoria.cargo.toLowerCase())}</p>
      <p>Jornalistas e veículos: entrem em contato para entrevistas, pautas e imagens.</p>
      <p><a href="mailto:${esc(data.assessoria.email)}">${esc(data.assessoria.email)}</a> · <a href="tel:${data.assessoria.telefone.replace(/[^+\d]/g, '')}">${esc(data.assessoria.telefone)}</a></p>
      </div>
    </div>
  </div>
</section>
${ctaFinal(data, 'Vamos desenhar a sua viagem?', 'Conte como é a sua viagem e receba a indicação do caminho certo.')}
`;
  return {
    path: '/na-midia/',
    title: 'Mel Rolan na mídia | Matérias e entrevistas',
    description:
      'Matérias da imprensa brasileira com a Mel Rolan, travel designer brasileira em Paris, sobre planejamento de viagens, calor em Paris e viagens em família.',
    body,
    og: 'og/sobre.jpg',
    jsonld: [
      breadcrumbLd([
        ['Início', '/'],
        ['Na mídia', '/na-midia/'],
      ]),
    ],
  };
}

// ---------------------------------------------------------------- PARCERIAS
export function parcerias(data) {
  const m = data.marca;
  const mail = (assunto) => `mailto:parceria@melrolan.com.br?subject=${encodeURIComponent(assunto)}`;
  const body = `
<section class="hero hero-sm">
  <div class="wrap narrow">
    <p class="eyebrow">Parcerias</p>
    <h1>Parcerias</h1>
    <p class="lead">A Mel Rolan Travel Designer trabalha com viajantes brasileiros em Paris desde ${m.ano_fundacao}. Além do atendimento direto, mantemos parcerias com agências de viagem no Brasil e com prestadores de experiências na França, construídas com o mesmo cuidado que dedicamos a cada cliente.</p>
    <p>Se o seu trabalho conversa com o nosso, queremos conhecer você.</p>
    <div class="actions">
      <a class="btn btn-ghost" href="#agencias">Agências no Brasil</a>
      <a class="btn btn-ghost" href="#france" lang="fr">Partenaires en France</a>
    </div>
  </div>
</section>
<section class="section" id="agencias">
  <div class="wrap">
    <h2 class="center">Para agências e agentes de viagem no Brasil</h2>
    <p class="center lead-sm">A sua agência cuida da viagem inteira. Nós cuidamos de Paris com o olhar de uma especialista em viajantes brasileiros, em português, com a mesma atenção que você daria ao seu cliente.</p>
    <div class="grid-3">
      <article class="card"><div class="card-body"><h3>Tours privativos em português</h3><p>Passeios a pé por Paris, conduzidos pela Mel, pensados para famílias, casais, grupos de amigos e quem viaja sozinha.</p></div></article>
      <article class="card"><div class="card-body"><h3>Roteiros personalizados</h3><p>Planejamento dia a dia, bairro por bairro, entregue pronto para o seu cliente usar durante a viagem.</p></div></article>
      <article class="card"><div class="card-body"><h3>Consultoria de viagem</h3><p>Uma conversa por vídeo com a Mel para tirar dúvidas e ajustar um roteiro que a agência já montou.</p></div></article>
    </div>
    <div class="narrow">
      <h3>Como funciona</h3>
      <p>A agência continua sendo a referência do cliente. Combinamos juntos o formato de cada atendimento, os prazos e a forma de comunicação com o viajante. As condições comerciais são apresentadas diretamente às agências interessadas.</p>
    </div>
  </div>
</section>
${provaRapida(m)}
<section class="section">
  <div class="wrap narrow center">
    <h2>Quer oferecer Paris com esse cuidado aos seus clientes?</h2>
    <div class="actions">
      <a class="btn" href="${mail('Parceria agência')}" data-contato="parceria-agencia">Falar sobre parceria</a>
    </div>
    <p class="small">ou pelo e-mail parceria@melrolan.com.br</p>
  </div>
</section>
<section class="section alt" id="france" lang="fr">
  <div class="wrap">
    <h2 class="center">Partenaires en France</h2>
    <div class="narrow">
      <p>Le Brésil est le troisième marché non européen de la France en nombre de visiteurs, après les États-Unis et le Canada. Ces voyageurs aiment Paris, mais ils cherchent à la découvrir dans leur langue et avec des repères qu'ils comprennent.</p>
      <p>Installée en France depuis plus de ${{ 5: 'cinq', 6: 'six', 7: 'sept', 8: 'huit', 9: 'neuf', 10: 'dix' }[m.anos_na_franca.replace('+', '')] || m.anos_na_franca.replace('+', '')} ans, Mel Rolan accompagne des voyageurs brésiliens à Paris depuis ${m.ano_fundacao} : itinéraires sur mesure, conseil et visites privées en portugais.</p>
    </div>
    <div class="grid-2">
      <article class="card"><div class="card-body"><h3>Ce que nous cherchons</h3><p>Des acteurs qui partagent notre exigence de qualité : prestataires d'expériences (ateliers, dégustations, activités pour les familles), hébergements et adresses adaptés aux familles et aux petits groupes, professionnels du tourisme qui reçoivent une clientèle brésilienne et souhaitent mieux l'accueillir.</p></div></article>
      <article class="card"><div class="card-body"><h3>Ce que nous apportons</h3><p>Une connaissance fine du voyageur brésilien, de ses attentes et de sa façon de préparer un voyage, et une relation de confiance avec une clientèle qui voyage en famille, en couple ou entre amis. Nous recommandons uniquement ce que nous avons testé.</p></div></article>
    </div>
    <div class="actions center">
      <a class="btn" href="${mail('Partenariat France')}" data-contato="parceria-franca">Nous contacter</a>
    </div>
    <p class="small center">ou par e-mail : parceria@melrolan.com.br</p>
  </div>
</section>
`;
  return {
    path: '/parcerias/',
    title: 'Parcerias | Mel Rolan Travel Designer',
    description:
      'Parcerias com agências de viagem brasileiras e prestadores de experiências na França. Tours privativos em português, roteiros e consultoria em formato B2B.',
    body,
    og: 'og/sobre.jpg',
    jsonld: [
      breadcrumbLd([
        ['Início', '/'],
        ['Parcerias', '/parcerias/'],
      ]),
    ],
  };
}
