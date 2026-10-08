// Gera o site estático em dist/. Uso: node build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { layout } from './src/layout.mjs';
import { pages } from './src/pages.mjs';
import { SITE_URL, STAGING, url } from './src/helpers.mjs';
import { vigente } from './src/oferta.mjs';
import { paginaRedirecionamento } from './src/redirect.mjs';
import { BONUS_INVERNO, paginaBonusInverno } from './src/bonus.mjs';

const OUT = 'dist';
const data = JSON.parse(fs.readFileSync('data/ofertas.json', 'utf8'));
data.integracoes = JSON.parse(fs.readFileSync('data/integracoes.json', 'utf8'));

// "A partir de" dos guias acompanha o menor preço vigente (promoção ou preço normal).
const cardGuias = data.servicos.find((x) => x.id === 'guias');
cardGuias.preco_a_partir_de = Math.min(...data.guias.map((g) => vigente(g).preco));

fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync('public', OUT, { recursive: true });

const all = pages(data);
for (const p of all) {
  const html = layout({ data, ...p });
  const file = path.join(OUT, p.path, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

// Páginas de venda dos guias (React), montadas por lps/build.mjs. Precisa de: npm ci --prefix lps
const lpsPaginas = data.guias.map((g) => ({ path: g.landing, title: g.nome }));
if (process.env.SKIP_LPS !== '1') {
  if (!fs.existsSync('lps/node_modules')) throw new Error('Falta instalar as páginas dos guias: rode "npm ci --prefix lps" (ou use SKIP_LPS=1 para pular).');
  execFileSync('node', ['lps/build.mjs'], { stdio: 'inherit' });
}

// Página de download do Bônus de Inverno: fora de pages() de propósito, para não entrar no sitemap nem no llms.txt.
{
  const pdf = path.join('public/bonus', BONUS_INVERNO.pdf);
  if (!fs.existsSync(pdf)) {
    const aviso = `O PDF do bônus não está em ${pdf}. O botão de download ficaria quebrado.`;
    if (process.env.CI) throw new Error(aviso);
    console.warn(`AVISO: ${aviso}`);
  }
  const b = paginaBonusInverno(data);
  const file = path.join(OUT, b.path, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, layout({ data, ...b }));
}

// 404
fs.writeFileSync(
  path.join(OUT, '404.html'),
  layout({
    data,
    path: '/404/',
    title: 'Página não encontrada | Mel Rolan',
    description: 'Página não encontrada.',
    body: `<section class="hero"><div class="wrap narrow center"><h1>Página não encontrada</h1><p class="lead">O endereço pode ter mudado.</p><a class="btn" href="${url('/')}">Voltar para o início</a></div></section>`,
  })
);

// Redirecionamentos dos endereços antigos (Wix).
// GitHub Pages não faz redirecionamento 301 no servidor: geramos uma página com meta refresh imediato,
// que o Google trata como redirecionamento permanente. Na Netlify, o arquivo _redirects faz o 301 de verdade.
const { redirecionamentos } = JSON.parse(fs.readFileSync('data/redirects.json', 'utf8'));
const destino = (to) => (/^https?:/.test(to) ? to : url(to));
const netlify = [];
for (const [from, to] of Object.entries(redirecionamentos)) {
  const alvo = destino(to);
  const canon = /^https?:/.test(to) ? to : `${SITE_URL}${to}`;
  const file = path.join(OUT, from, 'index.html');
  if (!fs.existsSync(file)) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, paginaRedirecionamento(alvo, canon));
  }
  netlify.push(`${encodeURI(from)}  ${encodeURI(to)}  301`);
}
fs.writeFileSync(path.join(OUT, '_redirects'), netlify.join('\n') + '\n');

// sitemap.xml
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  path.join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...all, ...lpsPaginas]
    .map((p) => `  <url><loc>${SITE_URL}${p.path}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`
);

// robots.txt (o endereço de teste não é indexado)
fs.writeFileSync(
  path.join(OUT, 'robots.txt'),
  STAGING ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nDisallow: /bonus/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
);

// llms.txt
const m = data.marca;
fs.writeFileSync(
  path.join(OUT, 'llms.txt'),
  `# Mel Rolan Travel Designer\n\n> Tours privativos em português em Paris, roteiros sob medida, consultoria de viagem e guias digitais para brasileiros. Mel Rolan é brasileira, vive em Paris há mais de ${m.anos_na_franca.replace('+', '')} anos e já atendeu mais de ${m.familias_atendidas.replace('+', '')} famílias em todos os serviços. Nota ${m.nota_satisfacao} de 10 em ${m.pesquisas_satisfacao} pesquisas de satisfação (${m.periodo_pesquisas}).\n\n## Páginas\n${[...all, ...lpsPaginas]
    .filter((p) => p.path !== '/404/')
    .map((p) => `- [${p.title.split(' | ')[0]}](${SITE_URL}${p.path})`)
    .join('\n')}\n\n## Contato\n- WhatsApp: ${m.whatsapp_site}\n- E-mail: ${m.email}\n`
);

console.log(`OK: ${all.length} páginas geradas em ${OUT}/ (+ ${lpsPaginas.length} páginas de guias)`);
