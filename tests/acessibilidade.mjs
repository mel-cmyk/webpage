// Acessibilidade: roda o axe-core em todas as páginas do sitemap (celular e desktop), com o aviso de cookies aberto e depois de fechado.
// Reprova em violações "serious" e "critical" (WCAG 2.0/2.1 A e AA). Contraste de cor é conferido pelo axe com o estilo real da página.
import fs from 'node:fs';
import { iniciar, contexto, SITE } from './lib/navegador.mjs';

const axeSrc = fs.readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
const paginas = fs.readFileSync('dist/sitemap.xml', 'utf8').match(/<loc>[^<]+<\/loc>/g).map((x) => new URL(x.replace(/<\/?loc>/g, '')).pathname);
const GRAVES = new Set(['serious', 'critical']);
const lista = process.argv.includes('--tudo');

const b = await iniciar();
const achados = new Map();
for (const [nome, l, a, cel] of [['cel', 390, 800, true], ['desk', 1280, 900, false]]) {
  const { ctx } = await contexto(b, { largura: l, altura: a, celular: cel });
  const p = await ctx.newPage();
  for (const estado of ['aviso', 'fechado']) {
    for (const caminho of paginas) {
      await p.addInitScript((e) => { if (e === 'fechado') localStorage.setItem('mr_consent', JSON.stringify({ ads: false, analytics: false, timestamp: Date.now() })); }, estado);
      await p.goto(SITE + caminho); await p.waitForTimeout(200);
      await p.evaluate(axeSrc);
      const r = await p.evaluate(() => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } }));
      for (const v of r.violations) {
        if (!lista && !GRAVES.has(v.impact)) continue;
        for (const n of v.nodes) {
          const chave = `${caminho} · ${v.id} (${v.impact}) · ${n.target.join(' ')}`;
          if (!achados.has(chave)) achados.set(chave, `${v.help}${n.any[0] ? ': ' + n.any[0].message : ''}`);
        }
      }
    }
    await p.context().clearCookies();
    await p.evaluate(() => localStorage.clear()).catch(() => {});
  }
  await ctx.close();
}
await b.close();
if (achados.size) {
  for (const [k, v] of achados) console.error(`ERRO: ${k}\n      ${v}`);
  console.error(`\n${achados.size} problema(s) de acessibilidade.`);
  process.exit(1);
}
console.log(`Acessibilidade ok: ${paginas.length} páginas, celular e desktop.`);
