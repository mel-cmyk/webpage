// Páginas legais: política de privacidade e aviso legal.
import { url, esc } from './helpers.mjs';

const ATUALIZACAO = '6 de outubro de 2026';

// Dados do controlador, iguais aos da política de privacidade já publicada no site atual.
const RAZAO_SOCIAL = '44.907.716 Melissa Rolan Pinto';
const ENDERECO = 'Rua Helio Manzoni, 338, Gopouva, Guarulhos (SP), Brasil';

const pagina = (titulo, conteudo) => `
<section class="hero hero-sm">
  <div class="wrap narrow">
    <h1>${titulo}</h1>
    <p class="small">Última atualização: ${ATUALIZACAO}</p>
  </div>
</section>
<section class="section section-top-0">
  <div class="wrap narrow legal">${conteudo}</div>
</section>`;

export function privacidade(data) {
  const m = data.marca;
  const body = pagina(
    'Política de privacidade',
    `
<p>Esta política explica como a Mel Rolan Travel Designer ("Mel Rolan", "nós") trata os dados pessoais de quem visita o site melrolan.com.br, entra em contato conosco, compra um guia digital ou contrata um dos nossos serviços. Ela segue a Lei Geral de Proteção de Dados (Lei nº 13.709/2018, LGPD) e, quando aplicável, o Regulamento Geral de Proteção de Dados da União Europeia (RGPD).</p>

<h2>1. Quem é o responsável pelos dados</h2>
<p>Controladora: ${RAZAO_SOCIAL}, nome comercial Mel Rolan Travel Designer, CNPJ ${esc(m.cnpj_brasil)}, ${ENDERECO}. Na França, a atividade é registrada sob o SIRET ${esc(m.siret_franca)}. Contato para assuntos de privacidade: <a href="mailto:${esc(m.email)}">${esc(m.email)}</a>.</p>

<h2>2. Quais dados tratamos</h2>
<p><strong>Dados que você nos envia.</strong> Quando você fala conosco pelo WhatsApp ou por e-mail: nome, telefone, e-mail e informações sobre a viagem, como datas, quem vai viajar, idade das crianças e preferências. Quando você compra um guia: nome, e-mail e os dados necessários para o pagamento, que são tratados diretamente pela loja e pelo processador de pagamentos; nós não armazenamos números de cartão.</p>
<p><strong>Diagnóstico da viagem.</strong> Quando você conclui o diagnóstico, suas respostas, seu primeiro nome e seu WhatsApp são enviados à nossa equipe e ficam registrados na nossa ferramenta de atendimento (Wix), para que possamos falar com você sobre a viagem. A mensagem de WhatsApp com as respostas só é enviada se você decidir enviá-la.</p>
<p><strong>Dados de navegação, com o seu consentimento.</strong> Se você aceitar os cookies de medição, o Google Analytics registra informações como páginas visitadas, origem da visita (por exemplo, uma busca no Google ou o Instagram), tipo de dispositivo e navegador, região aproximada e cliques em botões, como os de WhatsApp. Esses dados são usados de forma agregada, para entender como o site é usado.</p>
<p><strong>Publicidade, com o seu consentimento.</strong> Se você aceitar a publicidade, o Google Ads e o Google Analytics usam identificadores e as páginas que você visitou no site para medir o resultado dos nossos anúncios e para mostrar anúncios da Mel Rolan Travel Designer a quem já visitou o site (remarketing). Não enviamos ao Google o seu nome nem o seu telefone.</p>
<p><strong>Pixel da Meta, com o seu consentimento.</strong> Nas páginas de venda dos guias, se você aceitar a publicidade, carregamos o pixel da Meta (Facebook e Instagram). Ele só é carregado depois do seu aceite e só no domínio oficial do site. O pixel registra a visita à página, a visualização do guia e o clique para comprar, e usa cookies e identificadores da Meta para medir os nossos anúncios e mostrar anúncios da Mel Rolan Travel Designer no Facebook e no Instagram. Não enviamos à Meta o seu nome nem o seu telefone. Se você recusar a publicidade, o pixel não é carregado.</p>
<p><strong>Pixel do TikTok, com o seu consentimento.</strong> Em todas as páginas do site, se você aceitar a publicidade, carregamos o pixel do TikTok. Ele só é carregado depois do seu aceite e só no domínio oficial do site. O pixel registra a visita às páginas e ações como clicar em um botão de contato, responder o quiz ou o diagnóstico até o fim e chamar a Mel pelo WhatsApp ou e-mail, e usa cookies e identificadores do TikTok para medir os nossos anúncios. Não enviamos ao TikTok o seu nome, e-mail nem telefone. Se você recusar a publicidade, ou retirar o consentimento depois, o pixel não envia mais nada.</p>
<p><strong>Sinais de uso sem cookies, mesmo se você recusar.</strong> Nas páginas de serviços e de venda (início, tours, quiz, roteiro sob medida, consultoria, diagnóstico e guias), a tag do Google é carregada desde a abertura da página, no modo avançado de consentimento do Google (Consent Mode). Se você recusar os cookies, ela não grava cookies nem usa identificadores de publicidade, mas pode enviar ao Google sinais de uso, como a visita a uma página, o clique em um botão, o endereço da página (que pode conter o código do anúncio em que você clicou) e dados técnicos do navegador e do dispositivo, para medirmos os anúncios de forma agregada. Esses sinais não incluem o seu nome nem o seu contato.</p>

<h2>3. Para que usamos os dados</h2>
<ul>
  <li>Responder aos seus contatos e preparar propostas de tour, roteiro ou consultoria.</li>
  <li>Prestar o serviço contratado e entregar os guias digitais comprados.</li>
  <li>Cumprir obrigações legais, fiscais e contábeis.</li>
  <li>Medir o desempenho do site e melhorar o conteúdo, quando você aceita os cookies de medição.</li>
  <li>Medir o resultado dos anúncios e mostrar anúncios nossos a quem já visitou o site, quando você aceita a publicidade.</li>
  <li>Enviar comunicações sobre nossos produtos e serviços, quando você consentiu ou quando a lei permitir, sempre com a opção de cancelar.</li>
</ul>

<h2>4. Bases legais</h2>
<p>Tratamos dados para executar um contrato ou atender a um pedido seu antes da contratação, para cumprir obrigações legais, com base no nosso legítimo interesse (por exemplo, a segurança do site) e com o seu consentimento (cookies de medição, cookies de publicidade e comunicações de marketing). O consentimento pode ser retirado a qualquer momento.</p>

<h2>5. Cookies</h2>
<p>O site usa cookies e tecnologias semelhantes para duas finalidades. No aviso de cookies, você escolhe cada uma separadamente, e nenhum cookie é gravado antes da sua escolha. Nas páginas de serviços e de venda, a tag do Google é carregada desde o início e, enquanto o consentimento não for dado, funciona sem cookies (veja abaixo).</p>
<ul>
  <li><strong>Medição:</strong> Google Analytics, com os cookies _ga e _ga_*, de até 13 meses.</li>
  <li><strong>Publicidade:</strong> Google Ads e Google Analytics, com cookies como _gcl_au e _gcl_aw, de até 90 dias, e o envio de identificadores de publicidade ao Google. Servem para medir os nossos anúncios e para mostrar anúncios da Mel Rolan Travel Designer, no Google, no YouTube e em sites parceiros do Google, a quem já visitou o site.</li>
  <li><strong>Publicidade, pixel da Meta:</strong> cookies da Meta, como _fbp, de até 90 dias, gravados somente se você aceitar a publicidade, nas páginas de venda dos guias.</li>
  <li><strong>Publicidade, pixel do TikTok:</strong> cookies do TikTok, como _ttp, de até 13 meses, gravados somente se você aceitar a publicidade.</li>
  <li><strong>Sem consentimento (Consent Mode avançado):</strong> sem cookies e sem identificadores de publicidade, o Google pode receber os sinais de uso descritos na seção 2, nas páginas de serviços e de venda.</li>
</ul>
<p>Se você clicar em "Recusar tudo", nenhum desses cookies é gravado, o Google continua a receber apenas os sinais sem cookies descritos acima, e o site funciona normalmente. A sua escolha fica guardada no seu navegador por 6 meses; depois disso, perguntamos de novo. Você pode mudar a escolha a qualquer momento pelo link "Preferências de cookies", no rodapé. Para limitar anúncios personalizados em geral, você também pode usar as configurações de anúncios da sua conta Google.</p>
<p>As páginas de venda dos guias usam o mesmo aviso e a mesma escolha do site. A loja (loja.melrolan.com.br) tem o seu próprio aviso de cookies, com escolha independente.</p>

<h2>6. Com quem compartilhamos os dados</h2>
<p>Apenas com quem precisa deles para o serviço funcionar: GitHub (hospedagem do site), Google (medição e publicidade, se você aceitar cada uma), TikTok (pixel, se você aceitar a publicidade), Meta, pelo WhatsApp (as conversas que você inicia conosco) e pelo pixel das páginas de venda dos guias (se você aceitar a publicidade), Wix (loja, pagamentos dos guias e registro dos contatos feitos pelo diagnóstico), provedores de e-mail e de agenda e profissionais de contabilidade. Não vendemos dados pessoais.</p>

<h2>7. Transferência internacional</h2>
<p>Alguns desses provedores operam fora do Brasil e da União Europeia, como nos Estados Unidos. Nesses casos, a transferência se apoia nas salvaguardas previstas na LGPD e no RGPD, como as cláusulas contratuais padrão adotadas pelos próprios provedores.</p>

<h2>8. Por quanto tempo guardamos os dados</h2>
<p>Pelo tempo necessário para as finalidades acima e para cumprir obrigações legais e fiscais, em regra até cinco anos após a compra ou o fim do serviço. Dados de marketing ficam guardados até você retirar o consentimento ou pedir a exclusão.</p>

<h2>9. Seus direitos</h2>
<p>Você pode pedir, a qualquer momento, a confirmação de que tratamos seus dados, o acesso, a correção, a portabilidade, a limitação ou a exclusão, informações sobre com quem compartilhamos, e pode se opor a um tratamento ou retirar o consentimento. Escreva para <a href="mailto:${esc(m.email)}">${esc(m.email)}</a>. Respondemos em até 15 dias.</p>
<p>Se considerar que seus direitos não foram respeitados, você pode recorrer à Autoridade Nacional de Proteção de Dados (ANPD), no Brasil, ou à CNIL, na França.</p>

<h2>10. Segurança</h2>
<p>Adotamos medidas técnicas e organizacionais razoáveis, como conexão segura (HTTPS), acesso restrito e uso de plataformas reconhecidas. Nenhum sistema é totalmente imune a falhas; em caso de incidente relevante, avisaremos você e a autoridade competente, conforme a lei.</p>

<h2>11. Crianças</h2>
<p>Nossos serviços são contratados por adultos. Podemos receber dos responsáveis a idade das crianças para adequar o roteiro, e usamos essa informação somente para esse fim.</p>

<h2>12. Alterações</h2>
<p>Podemos atualizar esta política. A data no topo indica a versão em vigor.</p>
`
  );
  return {
    path: '/privacidade/',
    title: 'Política de privacidade | Mel Rolan Travel Designer',
    description: 'Como a Mel Rolan Travel Designer trata os dados pessoais de quem visita o site, entra em contato ou contrata os serviços.',
    body,
  };
}

export function avisoLegal(data) {
  const m = data.marca;
  const body = pagina(
    'Aviso legal',
    `
<h2>Responsável pelo site</h2>
<p>Mel Rolan Travel Designer<br>${RAZAO_SOCIAL}<br>CNPJ ${esc(m.cnpj_brasil)}<br>${ENDERECO}<br>Registro na França: SIRET ${esc(m.siret_franca)}</p>
<p>E-mail: <a href="mailto:${esc(m.email)}">${esc(m.email)}</a><br>WhatsApp: ${esc(m.whatsapp_site)}</p>
<p>Responsável pela publicação: Melissa Rolan Pinto.</p>

<h2>Hospedagem</h2>
<p>GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, Estados Unidos (github.com).</p>

<h2>Propriedade intelectual</h2>
<p>Os textos, fotografias, marcas e demais conteúdos deste site pertencem à Mel Rolan Travel Designer ou são usados com autorização. A reprodução, total ou parcial, depende de autorização prévia por escrito.</p>

<h2>Imagens</h2>
<p>Fotos: Meiry Peruch (Flânerie Photo), ensaio da Mel Rolan em Paris, e Diogo Pires de Oliveira, cenários do tour de cinema. Algumas imagens de ambientação de Paris foram criadas com uma ferramenta de inteligência artificial e têm caráter ilustrativo.</p>

<h2>Preços e informações</h2>
<p>Os preços e as condições publicados no site são informativos e são confirmados no momento da contratação. Horários e condições de atrações de terceiros podem mudar sem aviso.</p>

<h2>Dados pessoais e cookies</h2>
<p>Veja a <a href="${url('/privacidade/')}">política de privacidade</a>.</p>
`
  );
  return {
    path: '/aviso-legal/',
    title: 'Aviso legal | Mel Rolan Travel Designer',
    description: 'Informações legais sobre o site da Mel Rolan Travel Designer: responsável, hospedagem e propriedade intelectual.',
    body,
  };
}
