// Preço vigente de um guia. Fonte única: data/ofertas.json (campo "promocao", com "valido_ate").
// Depois de valido_ate, o guia volta sozinho ao preço normal (campo "preco").
const MIN = (n) => Number(n.toFixed(2));

export function vigente(g, agora = Date.now()) {
  const p = g.promocao;
  const ativa = !!(p && agora < Date.parse(p.valido_ate));
  const preco = ativa ? p.preco : g.preco;
  const parcelas = g.parcelas || 0;
  return {
    ativa,
    preco,
    preco_de: ativa ? p.preco_de : null,
    rotulo: ativa ? p.rotulo || '' : '',
    parcelas,
    parcela: parcelas ? MIN(preco / parcelas) : null,
    preco_normal: g.preco,
    valido_ate: p ? p.valido_ate : null,
  };
}

// Item no formato do GA4. preco_normal e valido_ate seguem junto para o navegador
// trocar o valor se a promoção vencer com a página aberta (analytics.js remove os dois antes de enviar).
export function itemGA(g, agora = Date.now()) {
  const v = vigente(g, agora);
  const item = { item_id: g.id, item_name: g.nome, item_category: 'guia digital', price: v.preco, quantity: 1, currency: 'BRL' };
  if (g.promocao) {
    item.preco_normal = g.preco;
    item.valido_ate = g.promocao.valido_ate;
  }
  return item;
}
