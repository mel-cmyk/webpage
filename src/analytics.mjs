// Monta o analytics.js a partir das partes em src/analytics/ (ordem pelo nome do arquivo).
// Tudo fica num único arquivo para o navegador baixar uma vez só; as partes dividem o código por assunto:
// base e consentimento, eventos, funis, Meta, TikTok, Clarity, links e origem, aviso de cookies e início.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { GA_ID, ADS_ID, TIKTOK_ID } from './integracoes.mjs';

const PASTA = path.join(path.dirname(new URL(import.meta.url).pathname), 'analytics');
let cache = null;

export function analyticsJs() {
  if (cache) return cache;
  const partes = fs.readdirSync(PASTA).filter((f) => f.endsWith('.js')).sort();
  const cabecalho = fs.readFileSync(path.join(PASTA, 'cabecalho.txt'), 'utf8');
  const codigo = cabecalho + '(function () {\n' + partes.map((f) => fs.readFileSync(path.join(PASTA, f), 'utf8')).join('') + '})();\n';
  // IDs vêm de data/integracoes.json (src/integracoes.mjs); nas partes aparecem como {{GA_ID}}, {{ADS_ID}} e {{TIKTOK_ID}}.
  cache = codigo.replaceAll('{{GA_ID}}', GA_ID).replaceAll('{{ADS_ID}}', ADS_ID).replaceAll('{{TIKTOK_ID}}', TIKTOK_ID);
  if (/\{\{[A-Z_]+\}\}/.test(cache)) throw new Error('analytics: placeholder sem valor em data/integracoes.json');
  return cache;
}

export const analyticsVersao = () => crypto.createHash('sha1').update(analyticsJs()).digest('hex').slice(0, 8);
