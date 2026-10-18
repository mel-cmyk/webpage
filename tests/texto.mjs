// Revisão automática do texto visível do site gerado (dist/): erros de escrita comuns e palavras novas.
// tests/palavras.txt guarda as palavras já revisadas (a lista foi conferida com dicionário em 18/10/2026). Uma palavra que não está lá
// reprova o teste: se for erro de digitação, corrija o texto; se estiver certa, acrescente a palavra no arquivo.
// Páginas em francês (parcerias) e de redirecionamento não entram.
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
const IGNORAR = /^(parcerias|404\.html|acessibilidade|category|consultoria-personalizada|contact|cópia|lp-|namidia|payment|política|product-page|tours-guiados)/;
const permitidas = new Set(fs.readFileSync('tests/palavras.txt', 'utf8').split('\n').map((l) => l.trim().toLowerCase()).filter((l) => l && !l.startsWith('#')));

const paginas = [];
(function andar(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) andar(f);
    else if (e.name === 'index.html' || e.name === '404.html') paginas.push(f);
  }
})(DIST);

const entidades = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ', '&times;': '×', '&rarr;': '→' };
const texto = (html, colar = false) => html
  .replace(/<(script|style|svg|noscript)[\s\S]*?<\/\1>/g, ' ')
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<\/?(a|strong|em|b|i|span|sup|u|mark)(\s[^>]*)?>/gi, colar ? '' : ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z#0-9]+;/gi, (e) => entidades[e] ?? ' ');

const erros = [];
const desconhecidas = new Map();
// Erros de escrita que nenhum dicionário pega.
const REGRAS = [
  [/—|–/, 'travessão (use vírgula, ponto ou dois-pontos)'],
  [/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{FE0F}]/u, 'emoji'],
  [/(^|[\s(])\+\d+ \p{L}/u, 'número com "+" na frente (escreva "650+" ou "mais de 650")'],
  [/\b(\p{L}{2,}) \1\b/iu, 'palavra repetida'],
  [/[a-zà-ú][,;:!?][A-Za-zÀ-ú]/, 'sem espaço depois da pontuação'],
  [/ [,;:!?](?!\d)/, 'espaço antes da pontuação'],
  [/(?<!\.)\.\.(?!\.)/, 'dois pontos seguidos'],
  // Títulos de avaliações reais de clientes (ex.: "O melhor tour de Paris") são citação e ficam de fora desta regra.
  [/\b(mais bem avaliado|mais procurado que|melhor que os outros|melhores que os outros|o tour mais)\b/i, 'comparação entre tours (regra do site)'],
  [/\bclientes (atendidas|encantadas)\b|\bfamílias (atendidos|encantados)\b/i, 'concordância de gênero'],
  [/\b(undefined|NaN|\[object Object\])\b/, 'valor quebrado no texto'],
];

for (const f of paginas) {
  const rel = path.relative(DIST, f);
  if (IGNORAR.test(rel)) continue;
  const bruto = fs.readFileSync(f, 'utf8');
  const t = texto(bruto);
  const colado = texto(bruto, true); // tags em linha somem sem deixar espaço: serve para conferir a pontuação junto de links e negritos
  for (const [re, msg] of REGRAS) {
    const base = msg.startsWith('espaço antes') || msg.startsWith('sem espaço') ? colado : t;
    const m = base.match(re);
    if (m) {
      const i = m.index;
      erros.push(`${rel}: ${msg}: "...${base.slice(Math.max(0, i - 25), i + 40).replace(/\s+/g, ' ').trim()}..."`);
    }
  }
  for (const p of t.match(/[\p{L}][\p{L}'’-]*/gu) || []) {
    const w = p.replace(/^['’-]+|['’-]+$/g, '');
    if (w.length < 3 || permitidas.has(w.toLowerCase())) continue;
    if (!desconhecidas.has(w.toLowerCase())) desconhecidas.set(w.toLowerCase(), rel);
  }
}
for (const [w, rel] of [...desconhecidas].sort()) erros.push(`${rel}: palavra desconhecida "${w}" (erro de digitação? se a palavra estiver certa, acrescente em tests/palavras.txt)`);

// Formato dos arquivos de dados: JSON com 2 espaços e quebra de linha no fim (imagens.json é uma tabela e fica de fora).
for (const f of fs.readdirSync('data').filter((x) => x.endsWith('.json') && x !== 'imagens.json')) {
  const bruto = fs.readFileSync(path.join('data', f), 'utf8');
  if (bruto !== JSON.stringify(JSON.parse(bruto), null, 2) + '\n') erros.push(`data/${f}: formato fora do padrão (JSON com 2 espaços e quebra de linha no fim)`);
}

if (process.argv.includes('--lista')) { console.log([...desconhecidas.keys()].sort().join('\n')); process.exit(0); }
if (erros.length) {
  for (const e of erros) console.error(`ERRO: ${e}`);
  console.error(`\n${erros.length} problema(s) de texto.`);
  process.exit(1);
}
console.log(`Texto ok: ${paginas.length} páginas revisadas.`);
