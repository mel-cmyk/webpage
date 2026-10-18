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
- para uma nova campanha, edite o bloco `promocao` (preço, `valido_ate`, `rotulo`) e ajuste também as datas do agendamento (hoje, 01/11/2026 em UTC) em `.github/workflows/deploy.yml`.

O preço mostrado nas páginas é só vitrine: quem cobra é a loja (Wix). A troca do preço na Wix é manual e precisa acompanhar as datas daqui.

## Como trocar uma foto

As fotos ficam em `public/img/`, em versões otimizadas (.webp) de tamanhos diferentes, e são listadas em `data/imagens.json`. A foto de cada serviço, tour e guia é indicada no campo `imagem` de `data/ofertas.json`, junto com a descrição (`imagem_alt`), que é o texto lido pelo Google e por leitores de tela.

Para trocar uma foto, mande a nova imagem em alta resolução: ela é recortada, otimizada e salva com o mesmo nome, sem mexer no resto do site.

## Páginas de venda dos guias

`/guias/paris-com-criancas/` e `/guias/paris-essencial/` são aplicativos React (Vite + Tailwind) que ficam em `lps/` e são montados pelo mesmo build do site:

- `lps/criancas/` e `lps/essencial/`: código de cada página (`App.tsx`) e imagens (`public/images/`);
- `lps/shared/oferta.tsx`: lê o preço de `data/ofertas.json` (lógica em `src/oferta.mjs`);
- `lps/build.mjs`: gera as páginas, pré-gera o HTML e acrescenta o aviso de cookies e o `analytics.js` do site.

Medição (`src/analytics/`, montado em `dist/js/analytics.js` por `src/analytics.mjs`): nessas páginas (`data-medicao="avancada"`) o Google carrega desde o início com tudo negado por padrão (Consent Mode avançado, `url_passthrough` ativo). Eventos: `view_item` ao abrir e `begin_checkout` no clique de cada botão de compra. Os links para a loja levam `gclid`, `gbraid`, `wbraid`, `fbclid` e UTMs da visita. O pixel da Meta só carrega com o consentimento de publicidade.

## Estrutura

Guia completo de "pedido → arquivo": **`docs/COMO-ALTERAR.md`**.

- `data/ofertas.json`: preços, tours e dados da marca (fonte única)
- `data/conteudo.json`: textos editáveis (selos, avaliações, FAQs, quiz, textos da home)
- `data/imagens.json`, `data/imprensa.json`, `data/integracoes.json`, `data/redirects.json`, `data/bonus-criancas.json`
- `src/pages/`: estrutura das páginas, um arquivo por tema; `comum.mjs` e `blocos.mjs` guardam as peças reaproveitadas e `index.mjs` lista as páginas
- `src/layout.mjs`: cabeçalho, rodapé e estrutura comum
- `src/css/`: partes do CSS por assunto; `src/css.mjs` monta `site.css` e `consent.css` (LPs)
- `src/analytics/`: partes do `analytics.js` por assunto; `src/analytics.mjs` junta tudo
- `src/conteudo.mjs`, `src/integracoes.mjs`: leem e validam os JSONs
- `public/`: scripts, fontes e imagens (o CSS é gerado no build)
- `lps/`: páginas de venda dos guias (React), com o comum em `lps/shared/`
- `tests/`: conferência do site (`check.mjs`), navegador (`comportamento.mjs`) e comparações (`referencia.mjs`, `visual.mjs`)
- `docs/`: eventos de medição e DNS
- `build.mjs`: gera o site em `dist/`

## Testes e prova de que nada quebrou

- `npm test`: confere o site gerado (links, SEO, preços, peso) e revisa o texto (`tests/texto.mjs`: erros de escrita comuns e palavras novas, com a lista revisada em `tests/palavras.txt`). Roda sozinho antes de cada deploy.
- `npm run test:browser`: abre o site num navegador de teste e confere cookies, medição, funis e checkout (precisa de `npm install` uma vez).
- Antes de uma refatoração: `node build.mjs && npm run referencia && npm run visual:salvar`. Depois de mexer: `node build.mjs && npm run comparar && npm run visual`. Os dois devem dizer "idêntico". Para mexidas só de organização no CSS, `npm run estilos` compara o estilo calculado de todos os elementos (celular e desktop, com os resultados do quiz e do diagnóstico) contra a referência.

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
