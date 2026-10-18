// Quiz do tour ideal e diagnóstico da viagem. Preços, números e contatos vêm de data/ofertas.json.
import { url, esc, eur, menorPreco } from '../helpers.mjs';
import { precoServico, breadcrumbLd } from './comum.mjs';
import { CONTEUDO } from '../conteudo.mjs';

// ---------------------------------------------------------------- QUIZ: QUAL TOUR COMBINA COM VOCÊ
const quizPerguntas = CONTEUDO.quiz_perguntas.map((p) => ({ q: p.pergunta, o: p.opcoes.map((o) => [o.texto, o.pontos]) }));

export function quizTour(data) {
  const tours = Object.fromEntries(
    data.tours.map((t) => [t.id, { nome: t.nome, subtitulo: t.subtitulo || '', ideal: t.ideal_para || '', duracao: t.duracao, pagina: url('/tours-em-paris/' + t.id + '/'), preco: eur(menorPreco(t)) }])
  );
  const cfg = { tours, perguntas: quizPerguntas, whatsapp: data.marca.whatsapp_site_link, personalizado: url('/tours-em-paris/tour-personalizado/'), todos: url('/tours-em-paris/') };
  const body = `
<section class="hero hero-sm">
  <div class="wrap narrow">
    <p class="eyebrow">Quiz</p>
    <h1>Qual tour em Paris combina com você?</h1>
    <p class="lead">Seis perguntas sobre o seu jeito de viajar. Sem resposta certa, só escolha a que tem mais a ver com você.</p>
  </div>
</section>
<section class="section">
  <div class="wrap narrow">
    <form id="quiz-tour" class="quiz" novalidate>
      <p class="quiz-progress" aria-live="polite"></p>
      ${quizPerguntas
        .map(
          (p, n) => `<fieldset class="step" data-step="${n + 1}"${n ? ' hidden' : ''}>
        <legend>${esc(p.q)}</legend>
        ${p.o.map((o, k) => `<label><input type="radio" name="q${n}" value="${k}"> ${esc(o[0])}</label>`).join('\n        ')}
      </fieldset>`
        )
        .join('\n')}
      <div class="quiz-nav">
        <button type="button" class="btn btn-ghost" data-back hidden>Voltar</button>
        <button type="button" class="btn" data-next>Continuar</button>
      </div>
      <p class="quiz-error small" role="alert" hidden>Escolha uma opção para continuar.</p>
    </form>
    <div id="quiz-resultado" class="result" hidden aria-live="polite"></div>
  </div>
</section>
<script id="quiz-tour-config" type="application/json">${JSON.stringify(cfg)}</script>
`;
  return {
    path: '/qual-tour-combina-com-voce/',
    title: 'Quiz: qual tour em Paris combina com você? | Mel Rolan',
    description: 'Responda seis perguntas divertidas sobre o seu jeito de viajar e descubra qual tour privativo em Paris, em português, tem mais a ver com você.',
    body,
    scripts: ['/js/wizard.js', '/js/quiz-tour.js'],
    noFloat: true,
    og: 'og/tours.jpg',
    jsonld: [breadcrumbLd([['Início', '/'], ['Tours em Paris', '/tours-em-paris/'], ['Quiz do tour ideal', '/qual-tour-combina-com-voce/']])],
  };
}

// ---------------------------------------------------------------- DIAGNÓSTICO
export function diagnostico(data) {
  const cfg = {
    whatsapp: data.marca.whatsapp_site_link,
    base: url(''),
    servicos: Object.fromEntries(data.servicos.map((s) => [s.id, { nome: s.nome, preco: precoServico(s), pagina: url(s.pagina + '/') }])),
    guia: { nome: data.guias[0].nome, link: url(data.guias[0].landing) },
    quizTour: url('/qual-tour-combina-com-voce/'),
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
    <p class="lead">Cinco perguntas rápidas. No final, você vê a combinação de serviços indicada pela Mel, e as suas respostas chegam para a nossa equipe, que fala com você pelo WhatsApp.</p>
  </div>
</section>
<section class="section">
  <div class="wrap narrow">
    <form id="diagnostico" class="quiz" novalidate data-clarity-mask="True">
      <p class="quiz-progress" aria-live="polite"></p>

      <fieldset class="step" data-step="1">
        <legend>O que você gostaria de ter nesta viagem?</legend>
        <p class="hint">Pode marcar mais de uma opção.</p>
        <label><input type="checkbox" name="procura" value="tours"> Passeios guiados em Paris, em português</label>
        <label><input type="checkbox" name="procura" value="roteiro"> A viagem inteira planejada, dia a dia</label>
        <label><input type="checkbox" name="procura" value="consultoria"> Uma conversa com a Mel para planejar, tirar dúvidas ou validar</label>
        <label><input type="checkbox" name="procura" value="guias"> Um guia digital (PDF) para planejar por conta própria</label>
        <label><input type="checkbox" name="procura" value="nao-sei"> Ainda não sei, quero uma indicação</label>
      </fieldset>

      <fieldset class="step" data-step="2" hidden>
        <legend>Quando é a viagem?</legend>
        <label><input type="radio" name="quando" value="nos próximos 3 meses"> Nos próximos 3 meses</label>
        <label><input type="radio" name="quando" value="em 3 a 6 meses"> Em 3 a 6 meses</label>
        <label><input type="radio" name="quando" value="em 6 a 12 meses"> Em 6 a 12 meses</label>
        <label><input type="radio" name="quando" value="daqui a mais de 12 meses"> Daqui a mais de 12 meses</label>
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
        <legend>Como vocês gostam de viajar?</legend>
        <p class="hint">Pode marcar mais de uma opção.</p>
        <label><input type="checkbox" name="estilo" value="primeira vez"> É a primeira vez em Paris</label>
        <label><input type="checkbox" name="estilo" value="historia"> Adoramos história e curiosidades</label>
        <label><input type="checkbox" name="estilo" value="sem pressa"> Preferimos ritmo leve, sem correria</label>
        <label><input type="checkbox" name="estilo" value="ver tudo"> Queremos ver o máximo possível</label>
        <label><input type="checkbox" name="estilo" value="fora do roteiro"> Queremos lugares fora do roteiro turístico</label>
        <label><input type="checkbox" name="estilo" value="outras cidades"> Vamos visitar outras cidades da França</label>
      </fieldset>

      <fieldset class="step" data-step="5" hidden>
        <legend>Para quem enviamos a indicação?</legend>
        <label class="text-label">Seu primeiro nome<input type="text" name="nome" autocomplete="given-name" required maxlength="60"></label>
        <label class="text-label">Seu WhatsApp, com DDD<input type="tel" name="whatsapp" autocomplete="tel" inputmode="tel" required placeholder="Ex.: 11 91234-5678" maxlength="25"></label>
        <p class="hint">Mora fora do Brasil? Use o código do país, por exemplo +33 6 12 34 56 78.</p>
        <label class="text-label">Algo mais que a Mel deveria saber? (opcional)<textarea name="obs" rows="3" maxlength="500" placeholder="Ex.: é a nossa primeira vez em Paris"></textarea></label>
        <p class="hint">Ao ver a indicação, você envia as suas respostas, o seu nome e o seu WhatsApp à equipe da Mel Rolan, apenas para falarmos com você sobre a sua viagem. Veja a <a href="${url('/privacidade/')}">política de privacidade</a>.</p>
      </fieldset>

      <div class="quiz-nav">
        <button type="button" class="btn btn-ghost" data-back hidden>Voltar</button>
        <button type="button" class="btn" data-next>Continuar</button>
      </div>
      <p class="quiz-error small" role="alert" hidden>Escolha uma opção para continuar.</p>
    </form>

    <div id="resultado" class="result" hidden aria-live="polite" data-clarity-mask="True"></div>
  </div>
</section>
<script id="diagnostico-config" type="application/json">${JSON.stringify(cfg)}</script>
`;
  return {
    path: '/diagnostico/',
    title: 'Diagnóstico da viagem a Paris | Mel Rolan',
    description:
      'Responda cinco perguntas rápidas e descubra qual combinação de serviços combina com a sua viagem a Paris: tour, roteiro, consultoria ou guia digital.',
    body,
    scripts: ['/js/wizard.js', '/js/diagnostico.js'],
    noFloat: true,
    og: 'og/diagnostico.jpg',
  };
}
