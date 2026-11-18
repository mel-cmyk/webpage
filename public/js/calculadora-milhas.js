// Calculadora de milhas (página /referencia-milhas/): compara o valor obtido por 1.000 milhas com a referência do programa.
(function () {
  const form = document.getElementById('calculadora-milhas');
  if (!form) return;
  let refs = {};
  try {
    refs = JSON.parse(form.dataset.refs || '{}');
  } catch (e) {}
  const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const veredito = form.querySelector('.milhas-veredito');
  const numeros = form.querySelector('.milhas-numeros');
  const campo = (n) => form.querySelector(`[data-campo="${n}"]`);

  // Aceita "6.000", "6000", "6.000,50" e "R$ 6.000".
  function numero(txt) {
    let s = String(txt || '').replace(/[^\d.,]/g, '');
    if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
    else s = s.replace(/\./g, '');
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
  }

  function calcular() {
    const ref = refs[form.elements.programa.value] || 0;
    const preco = numero(form.elements.preco.value);
    const milhas = numero(form.elements.milhas.value);
    const taxas = numero(form.elements.taxas.value);
    if (!preco || !milhas || !ref) {
      veredito.dataset.estado = 'vazio';
      veredito.textContent = 'Preencha os campos para ver o resultado.';
      numeros.hidden = true;
      return;
    }
    const obtido = ((preco - taxas) / milhas) * 1000;
    let estado = 'nao';
    let texto = 'Não vale: pague em dinheiro e guarde os pontos.';
    if (obtido >= ref * 1.1) {
      estado = 'vale';
      texto = 'Vale a pena emitir com milhas.';
    } else if (obtido >= ref * 0.9) {
      estado = 'empate';
      texto = 'Empate: escolha pelo que for mais prático.';
    }
    veredito.dataset.estado = estado;
    veredito.textContent = texto;
    campo('obtido').textContent = brl.format(Math.max(obtido, 0));
    campo('ref').textContent = brl.format(ref);
    campo('economia').textContent = brl.format(Math.max(preco - taxas, 0));
    numeros.hidden = false;
  }

  form.addEventListener('input', calcular);
  form.addEventListener('change', calcular);
  form.addEventListener('submit', (e) => e.preventDefault());
  calcular();
})();
