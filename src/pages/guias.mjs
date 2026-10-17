// Página dos guias digitais. Preços, números e contatos vêm de data/ofertas.json.
import { url, esc, brl, img, SITE_URL } from '../helpers.mjs';
import { vigente } from '../oferta.mjs';
import { servico, guiaItem, attr, breadcrumbLd, ctaFinal } from './comum.mjs';

// ---------------------------------------------------------------- GUIAS
export function guias(data) {
  const body = `
<section class="hero hero-sm">
  <div class="wrap narrow">
    <p class="eyebrow">Guias digitais de Paris</p>
    <h1>A curadoria da Mel, pronta para você planejar com autonomia.</h1>
    <p class="lead">Guias em PDF com acesso imediato por e-mail, feitos pela Mel a partir da experiência com centenas de famílias brasileiras.</p>
  </div>
</section>
<section class="section">
  <div class="wrap grid-2 cards">
    ${data.guias
      .map(
        (g) => { const v = vigente(g); return `<article class="card card-h">
      ${img(g.imagem, g.imagem_alt, { cls: 'cover', sizes: '(min-width: 600px) 200px, 100vw' })}
      <div class="card-body">
      <h2 class="h3">${esc(g.nome)}</h2>
      ${g.paginas ? `<p>${g.paginas} páginas de curadoria real${g.bonus ? `, com bônus: ${esc(g.bonus)}` : ''}.</p>` : ''}
      ${g.descricao ? `<p>${esc(g.descricao)}</p>` : ''}
      <p class="price">${v.preco_de ? `<s>${brl(v.preco_de)}</s> ` : ''}${brl(v.preco)}${v.parcela ? `<span>ou ${v.parcelas}x de ${brl(v.parcela)} sem juros</span>` : '<span aria-hidden="true">&nbsp;</span>'}</p>
      <div class="actions stack guia-actions">
        <a class="btn btn-small" href="${esc(g.link_compra)}" data-checkout="${attr(guiaItem(g))}">Comprar agora</a>
        <a class="btn btn-small btn-ghost" href="${url(g.landing)}">Conhecer o guia</a>
      </div>
      </div>
    </article>`; }
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
      'Guias digitais de Paris em PDF: Paris com Crianças e Paris Essencial. Curadoria da Mel Rolan, com acesso imediato.',
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
        offers: { '@type': 'Offer', price: vigente(g).preco, priceCurrency: 'BRL', availability: 'https://schema.org/InStock', url: g.link_compra },
      })),
      breadcrumbLd([['Início', '/'], ['Guias de Paris', '/guias-de-paris/']]),
    ],
  };
}
