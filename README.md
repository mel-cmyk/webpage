# Site melrolan.com.br

Site estático da Mel Rolan Travel Designer. Cada alteração enviada para a branch `main` é publicada automaticamente.

## Como atualizar preços e ofertas

Tudo o que muda com frequência fica em um único arquivo: **`data/ofertas.json`**.

- Preço de um tour: altere o `valor` dentro de `precos` do tour.
- Preço de consultoria, roteiro ou guias: altere `preco` ou `preco_a_partir_de`.
- Números da marca (nota, famílias atendidas, anos em Paris) e contatos: bloco `marca`.

Todas as páginas, cards, tabelas e dados estruturados leem desse arquivo. Não é preciso mexer em nenhum outro lugar.

### Promoção dos guias (preço com data de validade)

Em cada guia de `data/ofertas.json`, `preco` é o valor normal e o bloco `promocao` é o preço da campanha, válido até `valido_ate` (horário de Paris). Depois dessa data o guia volta sozinho ao `preco`, sem publicar de novo:

- as páginas de venda conferem a data no navegador e trocam o preço na hora;
- o fluxo "Publicar site" também roda sozinho logo após o prazo e deixa o HTML com o preço normal (agendamento no `deploy.yml`);
- para uma nova campanha, edite o bloco `promocao` (preço, `valido_ate`, `rotulo`) e, se o prazo for depois de 10/10/2026, ajuste as datas do agendamento em `.github/workflows/deploy.yml`.

O preço mostrado nas páginas é só vitrine: quem cobra é a loja (Wix). A troca do preço na Wix é manual e precisa acompanhar as datas daqui.

## Como trocar uma foto

As fotos ficam em `public/img/`, em versões otimizadas (.webp) de tamanhos diferentes, e são listadas em `data/imagens.json`. A foto de cada serviço, tour e guia é indicada no campo `imagem` de `data/ofertas.json`, junto com a descrição (`imagem_alt`), que é o texto lido pelo Google e por leitores de tela.

Para trocar uma foto, mande a nova imagem em alta resolução: ela é recortada, otimizada e salva com o mesmo nome, sem mexer no resto do site.

## Páginas de venda dos guias

`/guias/paris-com-criancas/` e `/guias/paris-essencial/` são aplicativos React (Vite + Tailwind) que ficam em `lps/` e são montados pelo mesmo build do site:

- `lps/criancas/` e `lps/essencial/`: código de cada página (`App.tsx`) e imagens (`public/images/`);
- `lps/shared/oferta.tsx`: lê o preço de `data/ofertas.json` (lógica em `src/oferta.mjs`);
- `lps/build.mjs`: gera as páginas, pré-gera o HTML e acrescenta o aviso de cookies e o `analytics.js` do site.

Medição (`public/js/analytics.js`): nessas páginas (`data-medicao="avancada"`) o Google carrega desde o início com tudo negado por padrão (Consent Mode avançado, `url_passthrough` ativo). Eventos: `view_item` ao abrir e `begin_checkout` no clique de cada botão de compra. Os links para a loja levam `gclid`, `gbraid`, `wbraid`, `fbclid` e UTMs da visita. O pixel da Meta só carrega com o consentimento de publicidade.

## Estrutura

- `data/ofertas.json`: fonte única de preços, tours e dados da marca
- `data/imagens.json`: lista das fotos e dos tamanhos disponíveis
- `src/pages.mjs`: textos de cada página
- `src/layout.mjs`: cabeçalho, rodapé e estrutura comum
- `public/`: estilos, scripts e imagens
- `build.mjs`: gera o site em `dist/`

## Rodar localmente

```
npm ci --prefix lps   # só na primeira vez
node build.mjs
```

`SKIP_LPS=1 node build.mjs` pula as páginas dos guias.

## Publicação e troca de domínio

- Modo de teste (padrão): o site sai em `mel-cmyk.github.io/webpage`, bloqueado para o Google.
- Modo de produção: criar a variável de repositório `SITE_PROD` com o valor `true` e rodar o fluxo "Publicar site". O arquivo `public/CNAME` mantém o domínio `www.melrolan.com.br`.
- Os links de compra dos guias apontam para a loja (`loja.melrolan.com.br`), campo `link_compra` em `data/ofertas.json`.
