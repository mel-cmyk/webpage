// Orçamento de peso: quanto cada página baixa no celular (HTML, CSS, JS, fontes e imagens do próprio site, sem terceiros).
// Fica um pouco acima do valor de hoje, para barrar o salto de peso sem atrapalhar a rotina. Ajuste só com motivo.
import { iniciar, contexto, SITE } from './lib/navegador.mjs';

const paginas = (await import('node:fs')).readFileSync('dist/sitemap.xml', 'utf8').match(/<loc>[^<]+<\/loc>/g).map((x) => new URL(x.replace(/<\/?loc>/g, '')).pathname);
// Páginas do site (HTML estático) e páginas de venda dos guias (React, bem mais pesadas: o JS delas é uma meta de redução, ver docs).
const LIMITES = { site: { total: 700, js: 50, css: 45, html: 60 }, guia: { total: 1200, js: 560, css: 40, html: 100 } };
const imprimir = process.argv.includes('--tabela');

const b = await iniciar();
const { ctx } = await contexto(b, { largura: 390, altura: 800, celular: true });
const p = await ctx.newPage();
await p.addInitScript(() => localStorage.setItem('mr_consent', JSON.stringify({ ads: false, analytics: false, timestamp: Date.now() })));
const erros = [];
for (const caminho of paginas) {
  const tam = { html: 0, js: 0, css: 0, fonte: 0, img: 0, outros: 0 };
  const ouvir = async (r) => {
    if (!r.url().startsWith(SITE)) return;
    const corpo = await r.body().catch(() => Buffer.alloc(0));
    const t = r.request().resourceType();
    const k = t === 'document' ? 'html' : t === 'script' ? 'js' : t === 'stylesheet' ? 'css' : t === 'font' ? 'fonte' : t === 'image' ? 'img' : 'outros';
    tam[k] += corpo.length;
  };
  p.on('response', ouvir);
  await p.goto(SITE + caminho, { waitUntil: 'load' });
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await p.waitForTimeout(400);
  p.off('response', ouvir);
  const kb = (n) => Math.round(n / 1024);
  const L = caminho.startsWith('/guias/') ? LIMITES.guia : LIMITES.site;
  const total = kb(Object.values(tam).reduce((a, c) => a + c, 0));
  if (imprimir) console.log(`${caminho.padEnd(52)} total ${String(total).padStart(5)} · html ${kb(tam.html)} js ${kb(tam.js)} css ${kb(tam.css)} fontes ${kb(tam.fonte)} img ${kb(tam.img)}`);
  if (total > L.total) erros.push(`${caminho}: ${total} KB no total (limite ${L.total})`);
  if (kb(tam.js) > L.js) erros.push(`${caminho}: ${kb(tam.js)} KB de JS (limite ${L.js})`);
  if (kb(tam.css) > L.css) erros.push(`${caminho}: ${kb(tam.css)} KB de CSS (limite ${L.css})`);
  if (kb(tam.html) > L.html) erros.push(`${caminho}: ${kb(tam.html)} KB de HTML (limite ${L.html})`);
}
await ctx.close(); await b.close();
if (erros.length) { for (const e of erros) console.error(`ERRO: ${e}`); process.exit(1); }
console.log(`Orçamento de peso ok em ${paginas.length} páginas (celular).`);
