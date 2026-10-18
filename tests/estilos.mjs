// Prova de refatoração de CSS: compara o estilo calculado de todos os elementos (celular e desktop, inclusive os resultados do quiz e do diagnóstico)
// entre o site.css guardado em .referencia/ (npm run referencia) e o gerado agora. Devem ser iguais quando a mudança é só de organização.
import fs from 'node:fs';
import crypto from 'node:crypto';
import { iniciar, contexto, SITE } from './lib/navegador.mjs';
const velho = fs.readFileSync('.referencia/css/site.css');
const paginas = fs
  .readFileSync('dist/sitemap.xml', 'utf8')
  .match(/<loc>[^<]+<\/loc>/g)
  .map((x) => new URL(x.replace(/<\/?loc>/g, '')).pathname)
  .filter((p) => !p.startsWith('/guias/'));
const coletar = () => {
  const props = [
    'display',
    'position',
    'margin-top',
    'margin-bottom',
    'margin-left',
    'margin-right',
    'padding-top',
    'padding-bottom',
    'padding-left',
    'padding-right',
    'width',
    'height',
    'color',
    'background-color',
    'font-size',
    'font-family',
    'font-weight',
    'line-height',
    'border-top-width',
    'border-bottom-color',
    'border-radius',
    'order',
    'flex-direction',
    'align-items',
    'align-self',
    'gap',
    'text-align',
    'opacity',
    'z-index',
    'max-width',
    'aspect-ratio',
    '-webkit-line-clamp',
    'cursor',
    'white-space',
    'text-transform',
    'letter-spacing',
  ];
  return [...document.querySelectorAll('body *')]
    .map((el, i) => {
      const cs = getComputedStyle(el);
      return i + ':' + el.tagName + ':' + props.map((p) => cs.getPropertyValue(p)).join('|');
    })
    .join('\n');
};
async function rodar(usarVelho) {
  const b = await iniciar();
  const out = {};
  for (const [nome, l, a, cel] of [
    ['cel', 390, 800, true],
    ['desk', 1280, 900, false],
  ]) {
    const { ctx } = await contexto(b, { largura: l, altura: a, celular: cel });
    if (usarVelho) await ctx.route('**/css/site.css*', (r) => r.fulfill({ body: velho, contentType: 'text/css' }), { times: 1000 });
    const p = await ctx.newPage();
    await p.addInitScript(() => localStorage.setItem('mr_consent', JSON.stringify({ ads: false, analytics: false, timestamp: Date.now() })));
    for (const path of paginas) {
      await p.goto(SITE + path);
      await p.waitForTimeout(150);
      out[nome + path] = crypto
        .createHash('md5')
        .update(await p.evaluate(coletar))
        .digest('hex');
      if (path === '/qual-tour-combina-com-voce/' || path === '/diagnostico/') {
        for (let k = 0; k < 9; k++) {
          if (await p.evaluate(() => [...document.querySelectorAll('#quiz-resultado,#resultado')].some((e) => !e.hidden))) break;
          const passo = await p.$('.step:not([hidden])');
          if (!passo) break;
          const nm = await passo.$('[name="nome"]');
          if (nm && (await nm.isVisible())) {
            await nm.fill('T S');
            await (await passo.$('[name="whatsapp"]')).fill('11 98888-7777');
          }
          const o = await passo.$('input[type=radio],input[type=checkbox]');
          if (o) await o.check({ force: true });
          await p.click('[data-next]');
          await p.waitForTimeout(120);
        }
        await p.waitForTimeout(300);
        out[nome + path + '#resultado'] = crypto
          .createHash('md5')
          .update(await p.evaluate(coletar))
          .digest('hex');
      }
    }
    await ctx.close();
  }
  await b.close();
  return out;
}
const a = await rodar(true);
const n = await rodar(false);
const dif = Object.keys(a).filter((k) => a[k] !== n[k]);
console.log(
  dif.length
    ? `${dif.length} estado(s) com estilo diferente (de ${Object.keys(a).length}): ${dif.slice(0, 10).join(', ')}`
    : `Estilos idênticos (${Object.keys(a).length} estados).`
);
process.exit(dif.length ? 1 : 0);
