// Funções utilitárias usadas por todas as páginas.
import fs from 'node:fs';

export const BASE = (process.env.SITE_BASE || '').replace(/\/$/, '');
export const STAGING = process.env.SITE_STAGING === '1';
export const SITE_URL = 'https://www.melrolan.com.br';

// Monta um link interno respeitando o endereço de teste (ex.: /webpage).
export const url = (p = '/') => `${BASE}${p}`;

export const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const num = (n) => Number(n).toLocaleString('pt-BR');
export const eur = (n) => `€ ${num(n)}`;
export const brl = (n) => `R$ ${num(n)}`;
export const money = (moeda, n) => (moeda === 'EUR' ? eur(n) : brl(n));

// Link do WhatsApp do site com mensagem pré-preenchida.
export const wa = (data, text) => {
  const base = data.marca.whatsapp_site_link;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
};

export const menorPreco = (tour) => Math.min(...tour.precos.map((p) => p.valor));

// Imagens: data/imagens.json lista, para cada imagem, os tamanhos disponíveis em public/img.
// Para trocar uma foto, basta substituir os arquivos mantendo o mesmo nome.
const IMAGENS = JSON.parse(fs.readFileSync(new URL('../data/imagens.json', import.meta.url), 'utf8'));

export function img(key, alt, { sizes = '100vw', cls = '', eager = false } = {}) {
  const v = IMAGENS[key];
  if (!v) throw new Error(`Imagem não encontrada em data/imagens.json: ${key}`);
  const maior = v[v.length - 1];
  const srcset = v.map((f) => `${url(f.src)} ${f.w}w`).join(', ');
  return `<img${cls ? ` class="${cls}"` : ''} src="${url(v[0].src)}" srcset="${srcset}" sizes="${sizes}" width="${maior.w}" height="${maior.h}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}
