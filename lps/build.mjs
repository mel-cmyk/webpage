// Monta as páginas de venda dos guias (React) dentro de ../dist/guias/. Chamado pelo build.mjs do site.
// Para cada guia: gera o site com o Vite, pré-gera o HTML (para o Google e para abrir rápido),
// e acrescenta o aviso de cookies e o analytics.js do site.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { cookieBanner } from '../src/layout.mjs';
import { url, STAGING, SITE_URL } from '../src/helpers.mjs';
import { vigente, itemGA } from '../src/oferta.mjs';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(aqui, '..');
const ofertas = JSON.parse(fs.readFileSync(path.join(raiz, 'data/ofertas.json'), 'utf8'));
const BASE = (process.env.SITE_BASE || '').replace(/\/$/, '');
const META_PIXEL = '1769596457566966';

export const LPS = [
  { pasta: 'criancas', guia: 'guia-paris-com-criancas', destino: 'paris-com-criancas' },
  { pasta: 'essencial', guia: 'guia-paris-essencial', destino: 'paris-essencial' },
];

const versao = (arq) => crypto.createHash('sha1').update(fs.readFileSync(path.join(raiz, 'public', arq))).digest('hex').slice(0, 8);
const vite = path.join(aqui, 'node_modules/.bin/vite');

for (const lp of LPS) {
  const dir = path.join(aqui, lp.pasta);
  const base = `${BASE}/guias/${lp.destino}/`;
  const g = ofertas.guias.find((x) => x.id === lp.guia);
  const env = { ...process.env, LP_BASE: base };
  fs.rmSync(path.join(dir, 'dist'), { recursive: true, force: true });
  fs.rmSync(path.join(dir, 'dist-server'), { recursive: true, force: true });
  execFileSync(vite, ['build'], { cwd: dir, env, stdio: 'inherit' });
  execFileSync(vite, ['build', '--ssr', 'src/entry-server.tsx', '--outDir', 'dist-server'], { cwd: dir, env, stdio: 'inherit' });

  const { render } = await import(pathToFileURL(path.join(dir, 'dist-server/entry-server.js')).href);
  const agora = Date.now();
  const v = vigente(g, agora);
  let html = fs.readFileSync(path.join(dir, 'dist/index.html'), 'utf8');

  // Endereços das imagens do modelo (preload), conforme o endereço de publicação. As do React já saem corretas.
  html = html.replace(/(["' ,])\/(images\/)/g, `$1${base}$2`);
  // Preço nos dados estruturados do Google (Product/Offer).
  html = html.replace(/("price":\s*")[0-9.]+(")/, `$1${v.preco.toFixed(2)}$2`);

  html = html.replace('<html lang="pt-BR">', `<html lang="pt-BR" data-promo="${v.ativa ? 1 : 0}">`);
  html = html.replace('<div id="root"></div>', () => `<div id="root">${render()}</div>`);
  html = html.replace('<!--MR_HEAD-->', `${STAGING ? '<meta name="robots" content="noindex, nofollow">\n    ' : ''}<link rel="stylesheet" href="${url('/css/consent.css')}?v=${versao('css/consent.css')}">`);
  html = html.replace('<!--MR_BANNER-->', () => cookieBanner());
  const pagina = [{ name: 'view_item', params: { currency: 'BRL', value: v.preco, items: [itemGA(g, agora)] } }];
  html = html.replace('<!--MR_ANALYTICS-->', () => `<script id="ga-page" type="application/json">${JSON.stringify(pagina)}</script>\n<script src="${url('/js/analytics.js')}?v=${versao('js/analytics.js')}" defer></script>`);
  html = html.replace(/<body /, `<body data-servico="guias" data-medicao="avancada" data-meta-pixel="${META_PIXEL}" `);
  if (/<!--MR_/.test(html)) throw new Error(`Marcador não substituído em ${lp.pasta}`);

  const saida = path.join(raiz, 'dist/guias', lp.destino);
  fs.rmSync(saida, { recursive: true, force: true });
  fs.cpSync(path.join(dir, 'dist'), saida, { recursive: true });
  fs.writeFileSync(path.join(saida, 'index.html'), html);
  fs.rmSync(path.join(dir, 'dist'), { recursive: true, force: true });
  fs.rmSync(path.join(dir, 'dist-server'), { recursive: true, force: true });
  console.log(`OK: ${SITE_URL}/guias/${lp.destino}/ (promoção ${v.ativa ? 'ativa' : 'encerrada'})`);
}
