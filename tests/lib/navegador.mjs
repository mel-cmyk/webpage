// Navegador de teste: abre o site gerado (dist/) como se fosse www.melrolan.com.br, sem rede externa.
// Serviços de terceiros (Google, Meta, TikTok, Clarity) são simulados e registrados, para provar o que carrega e quando.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const DIST = path.resolve('dist');
const TIPOS = {
  html: 'text/html',
  js: 'text/javascript',
  css: 'text/css',
  webp: 'image/webp',
  png: 'image/png',
  jpg: 'image/jpeg',
  woff2: 'font/woff2',
  ico: 'image/x-icon',
  svg: 'image/svg+xml',
  json: 'application/json',
  xml: 'text/xml',
  txt: 'text/plain',
  pdf: 'application/pdf',
  webmanifest: 'application/manifest+json',
};
const SIMULADOS = /(^|\.)(googletagmanager\.com|clarity\.ms|tiktok\.com|facebook\.net)$/;

function acharChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  if (fs.existsSync(base)) {
    for (const d of fs
      .readdirSync(base)
      .filter((x) => /^chromium-\d+$/.test(x))
      .sort()
      .reverse()) {
      const p = path.join(base, d, 'chrome-linux', 'chrome');
      if (fs.existsSync(p)) return p;
    }
  }
  return undefined; // deixa o Playwright procurar
}

export async function iniciar() {
  return chromium.launch({ executablePath: acharChrome(), args: ['--no-sandbox'] });
}

// Contexto com o site no ar "no domínio oficial". `registro.externos` lista os hosts de terceiros pedidos.
export async function contexto(browser, { largura = 390, altura = 800, celular = true } = {}) {
  const ctx = await browser.newContext({
    viewport: { width: largura, height: altura },
    isMobile: celular,
    deviceScaleFactor: celular ? 2 : 1,
    reducedMotion: 'reduce',
  });
  const registro = { externos: [], bloqueados: [] };
  await ctx.route('**/*', (r) => {
    const u = new URL(r.request().url());
    if (u.hostname === 'www.melrolan.com.br') {
      let f = path.join(DIST, decodeURIComponent(u.pathname).replace(/\/{2,}/g, '/'));
      if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
      if (!fs.existsSync(f)) return r.fulfill({ status: 404, body: '' });
      return r.fulfill({ body: fs.readFileSync(f), contentType: TIPOS[f.split('.').pop()] || 'application/octet-stream' });
    }
    registro.externos.push(u.hostname);
    if (SIMULADOS.test(u.hostname)) return r.fulfill({ body: '', contentType: 'text/javascript' });
    if (u.hostname === 'www.wixapis.com') return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ access_token: 'teste' }) });
    registro.bloqueados.push(u.hostname);
    return r.abort();
  });
  return { ctx, registro };
}

export const SITE = 'https://www.melrolan.com.br';

// Eventos do GA4 enviados (dataLayer), sem os de configuração.
export const eventos = (page) => page.evaluate(() => (window.dataLayer || []).filter((a) => a[0] === 'event').map((a) => ({ nome: a[1], p: a[2] || {} })));
export const chamadas = (page, objeto) => page.evaluate((o) => (window[o] || []).map((a) => (Array.isArray(a) ? [...a] : [...a])), objeto);
