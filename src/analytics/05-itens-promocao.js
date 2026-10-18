// Itens com valido_ate: se a promoção venceu com a página aberta, vale o preco_normal.
// Os dois campos auxiliares não vão para o Google.
function normalizar(params) {
  if (
    !params.items ||
    !params.items.some(function (it) {
      return it.valido_ate;
    })
  )
    return params;
  var total = 0,
    mudou = false;
  var itens = params.items.map(function (it) {
    if (!it.valido_ate) {
      total += (it.price || 0) * (it.quantity || 1);
      return it;
    }
    var c = {};
    for (var k in it) c[k] = it[k];
    if (Date.now() >= Date.parse(it.valido_ate)) {
      c.price = it.preco_normal;
      mudou = true;
    }
    delete c.valido_ate;
    delete c.preco_normal;
    total += (c.price || 0) * (c.quantity || 1);
    return c;
  });
  var p = {};
  for (var k in params) p[k] = params[k];
  p.items = itens;
  if (mudou && p.value != null) p.value = total;
  return p;
}
