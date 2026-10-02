# Site melrolan.com.br

Site estático da Mel Rolan Travel Designer. Cada alteração enviada para a branch `main` é publicada automaticamente.

## Como atualizar preços e ofertas

Tudo o que muda com frequência fica em um único arquivo: **`data/ofertas.json`**.

- Preço de um tour: altere o `valor` dentro de `precos` do tour.
- Preço de consultoria, roteiro ou guias: altere `preco` ou `preco_a_partir_de`.
- Números da marca (nota, famílias atendidas, anos em Paris) e contatos: bloco `marca`.

Todas as páginas, cards, tabelas e dados estruturados leem desse arquivo. Não é preciso mexer em nenhum outro lugar.

## Como trocar uma foto

As fotos ficam em `public/img/`, em versões otimizadas (.webp) de tamanhos diferentes, e são listadas em `data/imagens.json`. A foto de cada serviço, tour e guia é indicada no campo `imagem` de `data/ofertas.json`, junto com a descrição (`imagem_alt`), que é o texto lido pelo Google e por leitores de tela.

Para trocar uma foto, mande a nova imagem em alta resolução: ela é recortada, otimizada e salva com o mesmo nome, sem mexer no resto do site.

## Estrutura

- `data/ofertas.json`: fonte única de preços, tours e dados da marca
- `data/imagens.json`: lista das fotos e dos tamanhos disponíveis
- `src/pages.mjs`: textos de cada página
- `src/layout.mjs`: cabeçalho, rodapé e estrutura comum
- `public/`: estilos, scripts e imagens
- `build.mjs`: gera o site em `dist/`

## Rodar localmente

```
node build.mjs
```

## Publicação e troca de domínio

- Modo de teste (padrão): o site sai em `mel-cmyk.github.io/webpage`, bloqueado para o Google.
- Modo de produção: criar a variável de repositório `SITE_PROD` com o valor `true` e rodar o fluxo "Publicar site". O arquivo `public/CNAME` mantém o domínio `www.melrolan.com.br`.
- Os links de compra dos guias apontam para a loja (`loja.melrolan.com.br`), campo `link_compra` em `data/ofertas.json`.
