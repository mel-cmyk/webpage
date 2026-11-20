// Página de entrada de quem vem do TikTok (link da bio). Dados em data/tiktok.json.
// Não listada, como a de bônus e a do milheiro: noindex, fora do sitemap, do llms.txt e do menu, bloqueada no robots.txt.
// O checklist só aparece depois de nome e WhatsApp, salvos no Wix Forms (public/js/checklist.js): cada pedido é um lead.
import fs from 'node:fs';
import { url, esc, img } from './helpers.mjs';

export const TIKTOK = JSON.parse(fs.readFileSync(new URL('../data/tiktok.json', import.meta.url), 'utf8'));

export function paginaTiktok(data) {
  const { pagina, checklist, cartoes } = TIKTOK;
  const m = data.marca;
  const texto = pagina.texto
    .replace('{ano_fundacao}', m.ano_fundacao)
    .replace('{clientes}', m.familias_atendidas.replace('+', ''))
    .replace('{nota}', m.nota_satisfacao);
  const utm = 'utm_source=tiktok&utm_medium=bio&utm_campaign=tiktok_lp';
  const comUtm = (link) => `${url(link)}${link.includes('?') ? '&' : '?'}${utm}`;
  const whatsapp = `${data.marca.whatsapp_site_link}?text=${encodeURIComponent(checklist.mensagem_whatsapp)}`;
  const cfg = {
    procura: checklist.procura,
    wix: data.integracoes && {
      clientId: data.integracoes.wix_forms.client_id,
      formId: data.integracoes.wix_forms.form_id,
      campos: data.integracoes.wix_forms.campos,
    },
  };
  const outros = cartoes
    .map(
      (c) => `<article class="card tiktok-card">
      <p class="tiktok-tag">${esc(c.tag)}</p>
      <h2 class="h3">${esc(c.titulo)}</h2>
      <p>${esc(c.texto)}</p>
      <a class="btn btn-ghost" href="${comUtm(c.link)}">${esc(c.botao)}</a>
    </article>`
    )
    .join('\n    ');
  const body = `
<section class="section tiktok-topo">
  <div class="wrap tiktok-wrap">
    <div class="card tiktok-hero">
      ${img(pagina.imagem, pagina.imagem_alt, { sizes: '(max-width: 640px) 100vw, 600px', cls: 'tiktok-foto', eager: true })}
      <div class="tiktok-hero-txt">
        <p class="eyebrow">${esc(pagina.eyebrow)}</p>
        <h1>${esc(pagina.titulo)}</h1>
        <p class="lead-sm">${esc(texto)}</p>
      </div>
    </div>

    <article class="card tiktok-card tiktok-checklist" id="checklist">
      <p class="tiktok-tag">${esc(checklist.tag)}</p>
      <h2 class="h3">${esc(checklist.titulo)}</h2>
      <p>${esc(checklist.texto)}</p>
      <form id="form-checklist" class="quiz tiktok-form" novalidate data-clarity-mask="True">
        <label class="text-label">Seu primeiro nome<input type="text" name="nome" autocomplete="given-name" required maxlength="60"></label>
        <label class="text-label">Seu WhatsApp, com DDD<input type="tel" name="whatsapp" autocomplete="tel" inputmode="tel" required placeholder="Ex.: 11 91234-5678" maxlength="25"></label>
        <p class="quiz-error small" role="alert" hidden></p>
        <button type="submit" class="btn">${esc(checklist.botao)}</button>
        <p class="hint">${esc(checklist.aviso)} Veja a <a href="${url('/privacidade/')}">política de privacidade</a>.</p>
      </form>
      <div class="tiktok-sucesso" hidden aria-live="polite">
        <p class="h3">${esc(checklist.sucesso_titulo)}</p>
        <p>${esc(checklist.sucesso_texto)}</p>
        <div class="tiktok-botoes">
          <a class="btn" href="${url(checklist.arquivo)}" download data-download="checklist-primeira-vez">${esc(checklist.botao_download)}</a>
          <a class="btn btn-ghost" href="${esc(whatsapp)}" target="_blank" rel="noopener" data-whatsapp="tiktok">${esc(checklist.botao_whatsapp)}</a>
        </div>
      </div>
    </article>

    ${outros}
  </div>
</section>
<script id="checklist-config" type="application/json">${JSON.stringify(cfg)}</script>
`;
  return {
    path: pagina.path,
    title: pagina.title,
    description: pagina.description,
    body,
    scripts: ['/js/checklist.js'],
    noFloat: true,
    noindex: true,
  };
}
