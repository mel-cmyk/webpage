// Foto de referência do site gerado: serve para provar que uma refatoração não mudou nada.
//   node build.mjs && node tests/referencia.mjs salvar      guarda uma cópia de dist/ em .referencia/
//   (mexe no código) node build.mjs && node tests/referencia.mjs comparar
// Ignora só o que muda sozinho: o hash de versão (?v=...) e os nomes com hash das LPs.
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const REF = '.referencia';
const modo = process.argv[2];
const norm = (txt) => txt.replace(/\?v=[0-9a-f]{8}/g, '?v=X').replace(/-[A-Za-z0-9_-]{8}\.(js|css)\b/g, '-H.$1');
const chave = (rel) => rel.replace(/-[A-Za-z0-9_-]{8}\.(js|css)$/, '-H.$1');
const textual = (f) => /\.(html|js|css|xml|txt|json|webmanifest|svg)$/.test(f);

function listar(base, sub = '') {
  return fs.readdirSync(path.join(base, sub), { withFileTypes: true }).flatMap((d) => {
    const rel = path.join(sub, d.name);
    return d.isDirectory() ? listar(base, rel) : [rel];
  });
}
const conteudo = (base, rel) => (textual(rel) ? norm(fs.readFileSync(path.join(base, rel), 'utf8')) : fs.readFileSync(path.join(base, rel)).toString('base64'));

if (modo === 'salvar') {
  fs.rmSync(REF, { recursive: true, force: true });
  fs.cpSync(DIST, REF, { recursive: true });
  console.log(`Referência salva em ${REF}/ (${listar(REF).length} arquivos).`);
} else if (modo === 'comparar') {
  if (!fs.existsSync(REF)) {
    console.error('Sem referência: rode "node tests/referencia.mjs salvar" antes de mexer no código.');
    process.exit(2);
  }
  const a = new Map(listar(REF).map((r) => [chave(r), r]));
  const b = new Map(listar(DIST).map((r) => [chave(r), r]));
  const dif = [];
  for (const [k, r] of a) {
    if (!b.has(k)) {
      dif.push(`removido: ${r}`);
      continue;
    }
    if (conteudo(REF, r) !== conteudo(DIST, b.get(k))) dif.push(`mudou: ${b.get(k)}`);
  }
  for (const [k, r] of b) if (!a.has(k)) dif.push(`novo: ${r}`);
  if (dif.length) {
    console.log(`${dif.length} diferença(s) em relação à referência:\n${dif.map((d) => `- ${d}`).join('\n')}`);
    process.exit(1);
  }
  console.log(`Idêntico à referência (${a.size} arquivos).`);
} else {
  console.error('Uso: node tests/referencia.mjs salvar | comparar');
  process.exit(2);
}
