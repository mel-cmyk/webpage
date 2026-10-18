// Pequenos auxiliares para os testes: asserções com mensagem clara e resumo no final.
let ok = 0;
const falhas = [];
export function conferir(descricao, condicao, detalhe = '') {
  if (condicao) {
    ok += 1;
    console.log(`  ok   ${descricao}`);
  } else {
    falhas.push(descricao);
    console.log(`  ERRO ${descricao}${detalhe ? ` (${detalhe})` : ''}`);
  }
}
export const titulo = (t) => console.log(`\n${t}`);
export function encerrar() {
  console.log(`\n${ok} conferências ok, ${falhas.length} erro(s).`);
  if (falhas.length) {
    console.log(`Falharam:\n- ${falhas.join('\n- ')}`);
    process.exit(1);
  }
}
