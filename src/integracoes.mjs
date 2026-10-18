// IDs das ferramentas de medição e anúncios, lidos de data/integracoes.json (fonte única).
// O build coloca cada ID onde é preciso (analytics.js, HTML, páginas dos guias). Valida o formato para não publicar ID quebrado.
import fs from 'node:fs';

export const INTEG = JSON.parse(fs.readFileSync(new URL('../data/integracoes.json', import.meta.url), 'utf8'));

const FORMATOS = {
  'google.analytics_id': [/^G-[A-Z0-9]{6,12}$/, 'G-XXXXXXXXXX'],
  'google.ads_id': [/^AW-\d{8,12}$/, 'AW-0000000000'],
  'meta.pixel_id': [/^\d{10,20}$/, 'só números'],
  'tiktok.pixel_id': [/^[A-Z0-9]{16,24}$/, 'letras e números maiúsculos'],
};
const ler = (caminho) => caminho.split('.').reduce((o, k) => (o ? o[k] : undefined), INTEG);
for (const [caminho, [formato, exemplo]] of Object.entries(FORMATOS)) {
  const v = ler(caminho);
  if (typeof v !== 'string' || !formato.test(v)) throw new Error(`data/integracoes.json: "${caminho}" ausente ou fora do formato (${exemplo}). Valor: ${JSON.stringify(v)}`);
}
// Clarity é opcional: vazio desliga a ferramenta (ver clarityAttr em layout.mjs).
if (INTEG.clarity_id && !/^[a-z0-9]{8,12}$/i.test(INTEG.clarity_id)) throw new Error('data/integracoes.json: "clarity_id" fora do formato');

export const GA_ID = INTEG.google.analytics_id;
export const ADS_ID = INTEG.google.ads_id;
export const META_PIXEL = INTEG.meta.pixel_id;
export const TIKTOK_ID = INTEG.tiktok.pixel_id;
