// Pixel da Meta: só existe depois do consentimento de publicidade.
function meta(nome, params) {
  var map = { view_item: 'ViewContent', begin_checkout: 'InitiateCheckout', generate_lead: 'Lead', whatsapp_click: 'Contact' };
  if (INTERNO || !META_ID || !map[nome]) return;
  if (nome === 'generate_lead' || nome === 'whatsapp_click') {
    // sem dados pessoais: só o evento
    var d = ['track', map[nome]];
    if (metaCarregado) window.fbq.apply(window, d);
    else metaFila.push(d);
    return;
  }
  var it = (params.items || [])[0] || {};
  var dados = [
    'track',
    map[nome],
    { content_name: it.item_name, content_ids: [it.item_id], content_type: 'product', value: params.value, currency: params.currency },
  ];
  if (metaCarregado) window.fbq.apply(window, dados);
  else metaFila.push(dados);
}
