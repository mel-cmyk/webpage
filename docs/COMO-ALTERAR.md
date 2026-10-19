# Como alterar o site

Regra de ouro: **texto e número ficam em `data/`; aparência fica em `src/css/`; estrutura da página fica em `src/pages/`.** Quase todo pedido de mudança é só um arquivo de `data/`.

## Pedido → onde mexer

| Quero mudar... | Arquivo |
|---|---|
| Preço de tour, consultoria, roteiro ou guia | `data/ofertas.json` |
| Duração ou faixas de preço de um tour | `data/ofertas.json` (tours) |
| Promoção dos guias (preço, prazo, rótulo) | `data/ofertas.json` (`promocao`), mais as datas em `.github/workflows/deploy.yml` |
| Nota, anos em Paris, clientes atendidos, WhatsApp, e-mail | `data/ofertas.json` (bloco `marca`) |
| Selo de um tour ("Novidade", "Muito procurado") | `data/conteudo.json` (`selos_tours`) |
| Avaliações do Tripadvisor | `data/conteudo.json` (`tripadvisor`) |
| "O que inclui" e FAQ dos tours | `data/conteudo.json` (`tours_incluido`, `tours_faq`) |
| Textos dos cards e FAQ da home | `data/conteudo.json` (`home`) |
| Depoimentos de clientes (site e LPs) | `data/conteudo.json` (`depoimentos`) |
| Perguntas frequentes das LPs dos guias | `data/conteudo.json` (`lps`); `{email}`, `{whatsapp}` e `{parcelas}` são preenchidos sozinhos |
| Textos da indicação do diagnóstico e parágrafo por perfil | `data/conteudo.json` (`diagnostico`) |
| Perguntas e pontuação do quiz do tour | `data/conteudo.json` (`quiz_perguntas`) |
| Matérias de imprensa | `data/imprensa.json` |
| Foto de um serviço, tour ou guia | `data/ofertas.json` (campo `imagem`) e `data/imagens.json` |
| IDs do Google, Meta, TikTok, Clarity, formulário Wix | `data/integracoes.json` |
| Bônus do guia Paris com Crianças | `data/bonus-criancas.json` |
| Redirecionamentos de URLs antigas | `data/redirects.json` |
| Texto fixo de uma página (títulos, parágrafos) | `src/pages/<tema>.mjs` (home, tours, servicos, guias, institucional, funis) |
| Cabeçalho, menu, rodapé | `src/layout.mjs` |
| Texto do aviso de cookies | `src/layout.mjs` (`cookieBanner`) |
| Cor, tamanho, espaçamento | `src/css/` (um arquivo por assunto; `cookies.css` vale para o site e para as LPs) |
| Lógica do quiz ou do diagnóstico | `public/js/quiz-tour.js`, `public/js/diagnostico.js` (o núcleo comum é `wizard.js`) |
| Eventos de medição (GA4, Meta, TikTok, Clarity) | `src/analytics/` e `docs/eventos.md` |
| Estrutura das páginas de venda dos guias (LPs) | `lps/criancas/App.tsx`, `lps/essencial/App.tsx`; o que é comum fica em `lps/shared/` (os textos de depoimentos e FAQ vêm de `data/conteudo.json`) |

## Como o site é montado

```
data/*.json  ─┐
src/pages/    ├─> build.mjs ─> dist/ ─> GitHub Pages
src/css/      │    (junta o CSS e o analytics.js, gera o HTML)
src/analytics/┘
lps/ (React) ──> lps/build.mjs ─> dist/guias/
```

`src/conteudo.mjs` e `src/integracoes.mjs` validam os JSONs no build: campo vazio ou ID mal formado derruba a publicação, em vez de publicar uma página quebrada.

## Antes de publicar

1. `node build.mjs` (use `SKIP_LPS=1` para pular as LPs).
2. `npm run formatar` arruma o estilo do código e `npm run lint` aponta erros (o GitHub confere os dois).
3. `npm test` confere links, SEO, preços e ids, e revisa o texto (travessão, emoji, "+650", palavra repetida, pontuação, concordância conhecida e palavras novas). Se aparecer "palavra desconhecida" e a palavra estiver certa, acrescente em `tests/palavras.txt`.
4. `npm run test:browser` confere cookies, medição, funis e checkout. `npm run test:acessibilidade` roda o axe (contraste, rótulos, estrutura) em todas as páginas. `npm run test:orcamento` barra páginas que ficam pesadas demais no celular.
5. Se mexeu em aparência ou estrutura: `npm run comparar` e `npm run visual` (guardar o antes com `npm run referencia` e `npm run visual:salvar`). Devem dizer "idêntico" quando a mudança não deveria alterar nada.

Em cada pull request o GitHub também compara esta branch com a main (HTML, estilo calculado e capturas) e mostra o resultado no resumo da execução, como aviso. Capturas que mudaram vêm num arquivo anexo.

O GitHub repete `npm test` e o teste de navegador sozinho em cada pull request e antes de cada publicação. Se algum falhar, o site não é publicado.

## Caminhos de volta (navegação)

- Toda página tem o logo do cabeçalho levando à home (o teste de navegador confere em todas as páginas do sitemap).
- As LPs dos guias não têm menu de propósito (foco na compra), mas têm o logo com link para a home e, no rodapé, uma faixa com as páginas principais do site (`lps/shared/navegacao.tsx`).
- Cartões que parecem clicáveis precisam levar a algum lugar: os de tours e serviços já levam; os do hub de guias levam à página do guia. Ao criar um cartão novo, use o padrão `card-link` (link esticado no título) e deixe os botões acima dele.
- Para achar cliques que não levam a lugar nenhum, o Microsoft Clarity mostra "dead clicks" e "rage clicks" por página.

## Regras que valem sempre

- Preço, número e contato: um lugar só (`data/ofertas.json`). Nunca escrever no texto da página.
- Texto em pt-BR, sem emojis e sem travessão longo.
- Nada de comparar tours entre si ("o melhor", "o mais"); só elogio ao próprio tour.
- Cookies: nenhuma ferramenta de terceiros carrega antes do aceite (o teste de navegador confere).
- A loja (Wix) cobra: mudar preço no site não muda a cobrança. Troque nos dois.
