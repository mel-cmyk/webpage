// Comparação visual: capturas de tela de todas as páginas (celular e desktop) antes e depois de uma mudança.
//   node build.mjs && node tests/visual.mjs salvar
//   (mexe no código) node build.mjs && node tests/visual.mjs comparar
import fs from 'node:fs';
import path from 'node:path';
import { iniciar, contexto, SITE } from './lib/navegador.mjs';

const REF = '.visual';
const modo = process.argv[2];
if (!['salvar', 'comparar'].includes(modo)) { console.error('Uso: node tests/visual.mjs salvar | comparar'); process.exit(2); }

const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8');
const paginas = [...sitemap.matchAll(/<loc>[^<]*melrolan\.com\.br([^<]*)<\/loc>/g)].map((m) => m[1] || '/');
const nome = (p, v) => `${(p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/\//g, '__'))}.${v}.png`;
const dir = modo === 'salvar' ? REF : `${REF}.novo`;
fs.rmSync(dir, { recursive: true, force: true });
fs.mkdirSync(dir, { recursive: true });

const browser = await iniciar();
const variantes = [{ id: 'cel', largura: 390, altura: 800, celular: true }, { id: 'desk', largura: 1280, altura: 900, celular: false }];
for (const v of variantes) {
  const { ctx } = await contexto(browser, v);
  // escolha de cookies já feita (recusar), para o aviso não cobrir a página; o aviso e o modal têm capturas próprias
  await ctx.addInitScript(() => { try { localStorage.setItem('mr_consent', JSON.stringify({ status: 'denied', ads: false, date: new Date().toISOString(), timestamp: Date.now() })); } catch (e) {} });
  for (const caminho of paginas) {
    const p = await ctx.newPage();
    await p.goto(SITE + caminho);
    await p.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}' });
    // percorre a página para carregar as imagens preguiçosas
    const alturaTotal = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < alturaTotal; y += v.altura) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await p.waitForTimeout(60); }
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(250);
    await p.screenshot({ path: path.join(dir, nome(caminho, v.id)), fullPage: true });
    await p.close();
  }
  await ctx.close();
}
// aviso de cookies e modal (primeira visita)
{
  const { ctx } = await contexto(browser, variantes[0]);
  const p = await ctx.newPage();
  await p.goto(SITE + '/');
  await p.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
  await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(dir, 'cookies-aviso.cel.png') });
  await p.click('#cookie-mais'); await p.waitForTimeout(200);
  await p.screenshot({ path: path.join(dir, 'cookies-modal.cel.png') });
  // o mesmo nas páginas dos guias (usam o mesmo aviso, com estilos próprios)
  for (const lp of ['/guias/paris-essencial/', '/guias/paris-com-criancas/']) {
    const q = await ctx.newPage();
    await q.goto(SITE + lp);
    await q.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
    await q.waitForTimeout(300);
    const id = lp.split('/')[2];
    await q.screenshot({ path: path.join(dir, `cookies-aviso.${id}.cel.png`) });
    await q.click('#cookie-mais'); await q.waitForTimeout(200);
    await q.screenshot({ path: path.join(dir, `cookies-modal.${id}.cel.png`) });
    await q.close();
  }
  await ctx.close();
}
{
  const { ctx } = await contexto(browser, variantes[1]);
  const p = await ctx.newPage();
  await p.goto(SITE + '/guias/paris-essencial/');
  await p.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
  await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(dir, 'cookies-aviso.paris-essencial.desk.png') });
  await p.click('#cookie-mais'); await p.waitForTimeout(200);
  await p.screenshot({ path: path.join(dir, 'cookies-modal.paris-essencial.desk.png') });
  const h = await ctx.newPage();
  await h.goto(SITE + '/');
  await h.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
  await h.waitForTimeout(300);
  await h.screenshot({ path: path.join(dir, 'cookies-aviso.home.desk.png') });
  await h.click('#cookie-mais'); await h.waitForTimeout(200);
  await h.screenshot({ path: path.join(dir, 'cookies-modal.home.desk.png') });
  await ctx.close();
}
await browser.close();

if (modo === 'salvar') { console.log(`Referência visual salva em ${REF}/ (${fs.readdirSync(REF).length} capturas).`); process.exit(0); }
if (!fs.existsSync(REF)) { console.error('Sem referência visual: rode "node tests/visual.mjs salvar" antes de mexer no código.'); process.exit(2); }
const dif = [];
for (const f of fs.readdirSync(REF)) {
  const novo = path.join(dir, f);
  if (!fs.existsSync(novo)) { dif.push(`faltou: ${f}`); continue; }
  if (!fs.readFileSync(path.join(REF, f)).equals(fs.readFileSync(novo))) dif.push(`mudou: ${f}`);
}
if (dif.length) { console.log(`${dif.length} captura(s) diferente(s) (novas em ${dir}/):\n${dif.map((d) => `- ${d}`).join('\n')}`); process.exit(1); }
fs.rmSync(dir, { recursive: true, force: true });
console.log(`Visualmente idêntico (${fs.readdirSync(REF).length} capturas).`);
