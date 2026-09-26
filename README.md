# Site melrolan.com.br

Site estático da Mel Rolan Travel Designer. Cada alteração enviada para a branch `main` é publicada automaticamente.

## Como atualizar preços e ofertas

Tudo o que muda com frequência fica em um único arquivo: **`data/ofertas.json`**.

- Preço de um tour: altere o `valor` dentro de `precos` do tour.
- Preço de consultoria, roteiro ou guias: altere `preco` ou `preco_a_partir_de`.
- Números da marca (nota, famílias atendidas, anos em Paris) e contatos: bloco `marca`.

Todas as páginas, cards, tabelas e dados estruturados leem desse arquivo. Não é preciso mexer em nenhum outro lugar.

## Estrutura

- `data/ofertas.json`: fonte única de preços, tours e dados da marca
- `src/pages.mjs`: textos de cada página
- `src/layout.mjs`: cabeçalho, rodapé e estrutura comum
- `public/`: estilos, scripts e imagens
- `build.mjs`: gera o site em `dist/`

## Rodar localmente

```
node build.mjs
```
