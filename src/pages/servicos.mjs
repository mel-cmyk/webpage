// Roteiro sob medida e consultoria. Preços, números e contatos vêm de data/ofertas.json.
import { url, esc, brl, wa, img } from '../helpers.mjs';
import { servico, precoServico, heroSplit, breadcrumbLd, servicoLd, ctaFinal } from './comum.mjs';
import { depoimentos, TRIP, tripCard, imprensaCitacao, blocoSozinha } from './blocos.mjs';

// ---------------------------------------------------------------- ROTEIRO
export function roteiro(data) {
  const s = servico(data, 'roteiro');
  const msg = 'Olá! Vim pelo site da Mel Rolan e tenho interesse em um roteiro sob medida para a minha viagem à França.';
  const body = `
${heroSplit(
  `
    <p class="eyebrow">Roteiro sob medida</p>
    <h1>A sua viagem inteira, desenhada dia a dia para quem vai viajar.</h1>
    <p class="lead">Um roteiro personalizado que leva em conta os seus desejos, o orçamento e o ritmo de quem vai viajar, com experiências autênticas sugeridas pela Mel.</p>
    <p class="price">${precoServico(s)}</p>
    <div class="actions">
      <a class="btn" href="${url('/diagnostico/')}" data-cta="diagnostico-roteiro">Começar pelo diagnóstico</a>
      <a class="btn btn-ghost" href="${wa(data, msg)}" data-wa="roteiro">Falar no WhatsApp</a>
    </div>`,
  'paginas/roteiro',
  'Mel Rolan num café de Paris, com um chocolate quente'
)}
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
<section class="section">
  <div class="wrap">
    <aside class="card destaque destaque-img">
      ${img('roteiro/trello', 'Roteiro personalizado numa plataforma digital, aberto num notebook e num celular', { sizes: '(min-width: 760px) 340px, 100vw' })}
      <div>
        <p class="eyebrow">Como você recebe o roteiro</p>
        <h3>No computador e no celular</h3>
        <p>O roteiro chega numa plataforma digital, organizado dia a dia e por período, com fotos, horários, endereços, links de caminhada no Google Maps e links seguros para os sites oficiais. Na mesma plataforma você faz a gestão da viagem: anexa as reservas das atrações, os ingressos e o que mais contratar, e tem todo o plano à mão no computador e no celular.</p>
      </div>
    </aside>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <h2 class="center">Um roteiro para cada tipo de viagem</h2>
    <p class="center lead-sm">O mesmo cuidado, com um desenho diferente para cada perfil.</p>
    <div class="grid-4 perfis">
      <article class="card perfil"><h3>Famílias com crianças</h3><p>Programação no ritmo de cada idade, com pausas, parquinhos e restaurantes onde as crianças comem bem.</p></article>
      <article class="card perfil"><h3>Casais</h3><p>Bairros para caminhar sem pressa, mesas escolhidas com cuidado e programação com respiro entre um passeio e outro.</p></article>
      <article class="card perfil"><h3>Várias gerações e amigos</h3><p>Um roteiro que agrada a todas as idades, com deslocamentos pensados para o fôlego de cada um.</p></article>
      <article class="card perfil"><h3>Viajando sozinha</h3><p>Hospedagem em bairros tranquilos, programas que funcionam bem para quem está sozinha e liberdade para montar cada dia do seu jeito.</p></article>
    </div>
    ${blocoSozinha()}
  </div>
</section>
<section class="section alt">
  <div class="wrap">
    <h2 class="center">O que o roteiro inclui</h2>
    <ul class="checklist grid-2">
      <li>A programação completa, dia a dia, com atrações, restaurantes e experiências sugeridos para você</li>
      <li>Organização dos serviços necessários, como traslados e guias</li>
      <li>Mapas e orientações de deslocamento, com trajetos, aplicativos e transporte</li>
      <li>Guia de informações úteis sobre os destinos</li>
      <li>Dois encontros online para conversar sobre dúvidas e preocupações</li>
      <li>Suporte por WhatsApp durante o planejamento</li>
    </ul>
    <aside class="card destaque destaque-img">
      ${img('pombo/roteiro-pdf', 'Livro de atividades do Monsieur Pombo aberto num tablet e num celular', { sizes: '(min-width: 760px) 340px, 100vw' })}
      <div>
        <p class="eyebrow">Para os pequenos viajantes</p>
        <h3>O livro de atividades do Monsieur Pombo</h3>
        <p>Criado pela Mel para as crianças que viajam com a família, o livro chega em PDF junto com o roteiro, com histórias, jogos e desafios para antes, durante e depois da viagem.</p>
      </div>
    </aside>
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
      <li>Você chega à França mais preparado e seguro, com cada detalhe pensado antes do embarque.</li>
    </ul>
    <p class="small">O roteiro é entregue antes da viagem. Não inclui atendimento em tempo real durante a viagem.</p>
  </div>
</section>
${imprensaCitacao(data, 'catraca-livre-ia')}
${depoimentos(data.marca, tripCard(TRIP.rafaelRoteiro))}
${ctaFinal(data, 'Vamos desenhar a sua viagem?', `Roteiros a partir de ${brl(s.preco_a_partir_de)}. Conte como é a sua viagem e a Mel indica o formato certo.`)}
`;
  return {
    path: '/roteiro-sob-medida/',
    title: 'Roteiro personalizado para Paris e França | Mel Rolan',
    description: `Roteiro sob medida para Paris e a França, dia a dia, feito por uma especialista em viajantes brasileiros. A partir de ${brl(s.preco_a_partir_de)}.`,
    body,
    og: 'og/roteiro.jpg',
    servico: 'roteiro',
    jsonld: [
      servicoLd(s, 'Roteiro de viagem personalizado para Paris e a França, planejado dia a dia por uma travel designer especialista em viajantes brasileiros.'),
      breadcrumbLd([
        ['Início', '/'],
        ['Roteiro sob medida', '/roteiro-sob-medida/'],
      ]),
    ],
  };
}

// ---------------------------------------------------------------- CONSULTORIA
export function consultoria(data) {
  const s = servico(data, 'consultoria');
  const msg = 'Olá! Vim pelo site da Mel Rolan e tenho interesse na consultoria de viagem.';
  const body = `
${heroSplit(
  `
    <p class="eyebrow">Consultoria personalizada</p>
    <h1>Planeje a sua viagem à França com mais segurança.</h1>
    <p class="lead">Serve para qualquer momento da viagem: para quem ainda nem começou e quer definir destinos e dias em cada região, para quem tem dúvidas sobre a cidade e para quem já planejou tudo e quer validar cada escolha com uma especialista.</p>
    <p class="price">${precoServico(s)}<span>${esc(s.unidade_preco)}</span></p>
    <div class="actions">
      <a class="btn" href="${wa(data, msg)}" data-wa="consultoria">Agendar pelo WhatsApp</a>
      <a class="btn btn-ghost" href="${url('/diagnostico/')}" data-cta="diagnostico-consultoria">Não sei se é para mim</a>
    </div>`,
  'paginas/consultoria',
  'Mel Rolan sorrindo junto a um muro de pedra em Paris'
)}
<section class="section">
  <div class="wrap">
    <h2 class="center">Consultoria em 2 etapas</h2>
    <ol class="steps steps-2">
      <li><strong>Conexão.</strong> Um questionário para a Mel conhecer você e entender as suas dúvidas e necessidades.</li>
      <li><strong>Reunião de consultoria.</strong> Uma conversa por vídeo de 1h30 para esclarecer as dúvidas e ajudar você a tomar as melhores decisões.</li>
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
      <li>Validação de um roteiro que você já montou</li>
    </ul>
    <p class="small">Precisa de tudo planejado, dia a dia? Veja o <a href="${url('/roteiro-sob-medida/')}">roteiro sob medida</a>.</p>
  </div>
</section>
${imprensaCitacao(data, 'catraca-livre-ia')}
${ctaFinal(data, 'Vamos conversar sobre a sua viagem?', `Consultoria por ${brl(s.preco)}, com mapa digital exclusivo.`)}
`;
  return {
    path: '/consultoria/',
    title: 'Consultoria de viagem para Paris e França | Mel Rolan',
    description: `Consultoria por vídeo com a Mel, especialista em viajantes brasileiros: tire dúvidas, valide o plano e receba um mapa digital exclusivo. ${brl(s.preco)}.`,
    body,
    og: 'og/consultoria.jpg',
    servico: 'consultoria',
    jsonld: [
      servicoLd(s, 'Consultoria de viagem por vídeo para começar a planejar, tirar dúvidas ou validar uma viagem à França, com mapa digital exclusivo.'),
      breadcrumbLd([
        ['Início', '/'],
        ['Consultoria', '/consultoria/'],
      ]),
    ],
  };
}
