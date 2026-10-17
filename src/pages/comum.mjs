// Peças compartilhadas entre as páginas (dados de serviço, hero, FAQ, chamada final, dados estruturados). Preços, números e contatos vêm de data/ofertas.json.
import { url, esc, money, wa, menorPreco, img, SITE_URL } from '../helpers.mjs';
import { itemGA } from '../oferta.mjs';

// Expectativa de resposta (Diogo, 17/10/2026).
export const RESPOSTA = 'Respondemos em até 24 horas, no horário de Paris (4 a 5 horas à frente de Brasília, conforme a época do ano). Nosso atendimento é 100% humano.';

export const servico = (data, id) => data.servicos.find((s) => s.id === id);

export const precoServico = (s) =>
  s.preco != null ? money(s.moeda, s.preco) : `A partir de ${money(s.moeda, s.preco_a_partir_de)}`;

export const CARD_SIZES = '(min-width: 1000px) 340px, (min-width: 700px) 50vw, 100vw';

// Topo das páginas internas: texto à esquerda, foto à direita (no celular, foto abaixo do texto).
// href (opcional): a foto vira link (ex.: leva à lista de tours), porque muita gente toca na foto do topo.
export const heroSplit = (inner, key, alt, href = '') => {
  const foto = img(key, alt, { sizes: '(min-width: 900px) 540px, 100vw', eager: true });
  return `
<section class="hero hero-sm hero-split">
  <div class="wrap hero-split-grid">
    <div>${inner}</div>
    <div class="hero-split-media">${href ? `<a href="${href}" data-cta="hero-foto" aria-label="Ver os tours">${foto}</a>` : foto}</div>
  </div>
</section>`;
};

// Itens no formato do GA4 (comércio eletrônico), usados nos eventos de visualização e clique.
export const tourItem = (t) => ({ item_id: t.id, item_name: t.nome, item_category: 'tour', price: menorPreco(t), currency: 'EUR' });

export const guiaItem = (g) => itemGA(g);

export const attr = (o) => esc(JSON.stringify(o));

export const breadcrumbLd = (itens) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: itens.map(([nome, caminho], i) => ({ '@type': 'ListItem', position: i + 1, name: nome, item: `${SITE_URL}${caminho}` })),
});

export const servicoLd = (s, descricao) => ({
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

export const faqHtml = (items) =>
  `<div class="faq">${items
    .map((f) => `<details><summary>${esc(f.q)}</summary><p>${f.a}</p></details>`)
    .join('')}</div>`;

export const faqLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') },
  })),
});

export const ctaFinal = (data, titulo, texto) => `
<section class="section cta-final">
  <div class="cta-bg" aria-hidden="true">${img('paginas/cta', '', { sizes: '100vw' })}</div>
  <div class="wrap narrow center">
    <h2>${titulo}</h2>
    <p>${texto}</p>
    <div class="actions center">
      <a class="btn" href="${url('/diagnostico/')}" data-cta="diagnostico">Começar o diagnóstico</a>
      <a class="btn btn-ghost" href="${wa(data, 'Olá! Vim pelo site da Mel Rolan e gostaria de conversar sobre a minha viagem a Paris.')}" data-wa="cta-final">Falar no WhatsApp</a>
    </div>
    <p class="small">${RESPOSTA}</p>
  </div>
</section>`;
