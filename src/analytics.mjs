// Monta o analytics.js a partir das partes em src/analytics/ (ordem pelo nome do arquivo).
// Tudo fica num único arquivo para o navegador baixar uma vez só; as partes dividem o código por assunto:
// base e consentimento, eventos, funis, Meta, TikTok, Clarity, links e origem, aviso de cookies e início.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const PASTA = path.join(path.dirname(new URL(import.meta.url).pathname), 'analytics');
let cache = null;

export function analyticsJs() {
  if (cache) return cache;
  const partes = fs.readdirSync(PASTA).filter((f) => f.endsWith('.js')).sort();
  const cabecalho = fs.readFileSync(path.join(PASTA, 'cabecalho.txt'), 'utf8');
  cache = cabecalho + '(function () {\n' + partes.map((f) => fs.readFileSync(path.join(PASTA, f), 'utf8')).join('') + '})();\n';
  return cache;
}

export const analyticsVersao = () => crypto.createHash('sha1').update(analyticsJs()).digest('hex').slice(0, 8);
