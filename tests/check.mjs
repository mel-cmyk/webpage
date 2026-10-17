// Conferência do site gerado (dist/): rode "node build.mjs && node tests/check.mjs".
// Sem dependências. Falha (código 1) se achar erro; avisos não derrubam o deploy.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const DIST = 'dist';
const BASE = (process.env.SITE_BASE || '').replace(/\/$/, '');
const erros = [];
const avisos = [];
const erro = (m) => erros.push(m);
const aviso = (m) => avisos.push(m);

const data = JSON.parse(fs.readFileSync('data/ofertas.json', 'utf8'));
const integ = JSON.parse(fs.readFileSync('data/integracoes.json', 'utf8'));

function arquivos(dir, ext) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? arquivos(p, ext) : !ext || p.endsWith(ext) ? [p] : [];
  });
}
const paginasHtml = arquivos(DIST, '.html');
const ler = (f) => fs.readFileSync(f, 'utf8');
const txt = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const nome = (f) => path.relative(DIST, f).replace(/index\.html$/, '') || '/';
const eur = (n) => `€ ${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

// Páginas reais (sem redirecionamentos nem página de bônus)
const reais = paginasHtml.filter((f) => {
  const h = ler(f);
  return !/http-equiv="refresh"/.test(h) && !f.includes(`${path.sep}bonus${path.sep}`) && !f.endsWith('404.html');
});

// 1. Cada página: título, descrição, h1, canonical, alt, lixo de template
for (const f of reais) {
  const h = ler(f);
  const n = nome(f);
  const t = (h.match(/<title>([\s\S]*?)<\/title>/) || [])[1]?.trim() || '';
  const d = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  if (!t) erro(`${n}: sem <title>`);
  else if (t.length > 65) erro(`${n}: título com ${t.length} caracteres (máx. 65)`);
  if (!d) erro(`${n}: sem meta description`);
  else if (d.length > 165) erro(`${n}: descrição com ${d.length} caracteres (máx. 165)`);
  else if (d.length < 70) aviso(`${n}: descrição curta (${d.length})`);
  const h1 = (h.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) erro(`${n}: ${h1} elementos h1 (esperado 1)`);
  if (!/rel="canonical"/.test(h)) erro(`${n}: sem canonical`);
  const semAlt = (h.match(/<img(?![^>]*\balt=)[^>]*>/g) || []).length;
  if (semAlt) erro(`${n}: ${semAlt} imagem(ns) sem alt`);
  const t2 = txt(h);
  for (const lixo of ['undefined', 'NaN', '[object Object]', '{numeros', '${']) if (t2.includes(lixo)) erro(`${n}: texto com "${lixo}"`);
  for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { erro(`${n}: JSON-LD inválido`); }
  }
}

// 2. Links e arquivos internos existem; nenhum com barra dupla
const quebrados = new Set();
for (const f of paginasHtml) {
  const h = ler(f);
  for (const m of h.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    let u = decodeURIComponent(m[1]);
    if (BASE && u.startsWith(BASE + '/')) u = u.slice(BASE.length);
    if (/\/\/+/.test(u)) erro(`${nome(f)}: link com barra dupla: ${u}`);
    let alvo = path.join(DIST, u);
    if (fs.existsSync(alvo) && fs.statSync(alvo).isDirectory()) alvo = path.join(alvo, 'index.html');
    if (!fs.existsSync(alvo)) quebrados.add(`${nome(f)} -> ${u}`);
  }
}
for (const q of quebrados) erro(`link quebrado: ${q}`);

// 3. Preços e durações dos tours batem com data/ofertas.json
const menor = Math.min(...data.tours.map((t) => Math.min(...t.precos.map((p) => p.valor))));
const hub = txt(ler(path.join(DIST, 'tours-em-paris', 'index.html')));
if (!hub.includes(`A partir de ${eur(menor)}`) && !hub.includes(`a partir de ${eur(menor)}`)) erro(`tours-em-paris: não mostra "a partir de ${eur(menor)}"`);
const cardTours = data.servicos.find((s) => s.id === 'tours');
if (cardTours.preco_a_partir_de !== menor) erro(`data/ofertas.json: servicos.tours.preco_a_partir_de (${cardTours.preco_a_partir_de}) difere do menor preço dos tours (${menor})`);
for (const t of data.tours) {
  const f = path.join(DIST, 'tours-em-paris', t.id, 'index.html');
  if (!fs.existsSync(f)) { erro(`tour sem página: ${t.id}`); continue; }
  const h = txt(ler(f));
  for (const p of t.precos) if (!h.includes(eur(p.valor))) erro(`${t.id}: preço ${eur(p.valor)} não aparece na página`);
  if (!h.includes(t.duracao)) erro(`${t.id}: duração ${t.duracao} não aparece na página`);
}

// 4. Números da marca (clientes, nota) aparecem onde devem e não há resíduos antigos
const m = data.marca;
const clientes = m.familias_atendidas.replace('+', '');
for (const pg of ['', 'sobre', path.join('guias', 'paris-com-criancas'), path.join('guias', 'paris-essencial')]) {
  const h = txt(ler(path.join(DIST, pg, 'index.html')));
  if (!h.includes(clientes)) erro(`${pg || '/'}: não cita ${clientes} clientes`);
}
for (const f of reais) {
  const h = txt(ler(f));
  for (const velho of ['R$ 397', 'PARIS147', 'PARIS97']) if (h.includes(velho)) erro(`${nome(f)}: resíduo "${velho}"`);
}

// 5. Sitemap: todas as páginas indexáveis e nenhuma noindex
const sitemap = ler(path.join(DIST, 'sitemap.xml'));
const locs = [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map((x) => x[1]);
for (const f of reais) {
  const h = ler(f);
  const n = nome(f);
  const indexavel = !/noindex/.test(h);
  const noMapa = locs.some((l) => l.endsWith(n === '/' ? '/' : n));
  if (indexavel && !noMapa && !BASE) erro(`${n}: indexável mas fora do sitemap`);
  if (!indexavel && noMapa) erro(`${n}: noindex mas está no sitemap`);
}

// 6. Medição: sintaxe do analytics.js, e o Clarity só aparece com ID válido
try { execFileSync('node', ['--check', path.join(DIST, 'js', 'analytics.js')]); } catch { erro('analytics.js com erro de sintaxe'); }
const home = ler(path.join(DIST, 'index.html'));
const temClarity = /data-clarity="/.test(home);
if (temClarity !== /^[a-z0-9]{8,12}$/i.test(integ.clarity_id || '')) erro('Clarity: atributo data-clarity não bate com clarity_id');
if (!/id="cookie-modal"/.test(home)) erro('home: sem modal de cookies');

// 7. Peso: nenhuma imagem acima de 600 KB (PDFs dos bônus ficam de fora)
for (const f of arquivos(DIST)) {
  if (!/\.(webp|jpg|jpeg|png)$/i.test(f)) continue;
  const kb = fs.statSync(f).size / 1024;
  if (kb > 600) erro(`imagem pesada: ${path.relative(DIST, f)} (${Math.round(kb)} KB)`);
  else if (kb > 300) aviso(`imagem grande: ${path.relative(DIST, f)} (${Math.round(kb)} KB)`);
}

for (const a of avisos) console.log(`aviso: ${a}`);
if (erros.length) {
  for (const e of erros) console.error(`ERRO: ${e}`);
  console.error(`\n${erros.length} erro(s) em ${reais.length} páginas.`);
  process.exit(1);
}
console.log(`OK: ${reais.length} páginas conferidas, ${locs.length} no sitemap, sem erros${avisos.length ? ` (${avisos.length} avisos)` : ''}.`);
