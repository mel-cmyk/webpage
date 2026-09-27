// Gera o site estático em dist/. Uso: node build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { layout } from './src/layout.mjs';
import { pages } from './src/pages.mjs';
import { SITE_URL, STAGING, url } from './src/helpers.mjs';

const OUT = 'dist';
const data = JSON.parse(fs.readFileSync('data/ofertas.json', 'utf8'));
data.integracoes = JSON.parse(fs.readFileSync('data/integracoes.json', 'utf8'));

fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync('public', OUT, { recursive: true });

const all = pages(data);
for (const p of all) {
  const html = layout({ data, ...p });
  const file = path.join(OUT, p.path, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
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
    fs.writeFileSync(
      file,
      `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Página transferida</title><link rel="canonical" href="${encodeURI(canon)}"><meta http-equiv="refresh" content="0; url=${encodeURI(alvo)}"></head><body><p>Esta página mudou de endereço: <a href="${encodeURI(alvo)}">continuar</a>.</p><script>location.replace(${JSON.stringify(encodeURI(alvo))} + location.search);</script></body></html>`
    );
  }
  netlify.push(`${encodeURI(from)}  ${encodeURI(to)}  301`);
}
fs.writeFileSync(path.join(OUT, '_redirects'), netlify.join('\n') + '\n');

// sitemap.xml
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  path.join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${all
    .map((p) => `  <url><loc>${SITE_URL}${p.path}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`
);

// robots.txt (o endereço de teste não é indexado)
fs.writeFileSync(
  path.join(OUT, 'robots.txt'),
  STAGING ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
);

// llms.txt
const m = data.marca;
fs.writeFileSync(
  path.join(OUT, 'llms.txt'),
  `# Mel Rolan Travel Designer\n\n> Tours privativos em português em Paris, roteiros sob medida, consultoria de viagem e guias digitais para brasileiros. Mel Rolan é brasileira, vive em Paris há mais de ${m.anos_na_franca.replace('+', '')} anos e já atendeu mais de ${m.familias_atendidas.replace('+', '')} famílias em todos os serviços. Nota ${m.nota_satisfacao} de 10 em ${m.pesquisas_satisfacao} pesquisas de satisfação (${m.periodo_pesquisas}).\n\n## Páginas\n${all
    .filter((p) => p.path !== '/404/')
    .map((p) => `- [${p.title.split(' | ')[0]}](${SITE_URL}${p.path})`)
    .join('\n')}\n\n## Contato\n- WhatsApp: ${m.whatsapp_site}\n- E-mail: ${m.email}\n`
);

console.log(`OK: ${all.length} páginas geradas em ${OUT}/`);
