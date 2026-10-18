// Monta o CSS do site e o das LPs a partir das partes de src/css/ (ordem alfabética = ordem da cascata).
import { readdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const DIR = new URL('./css/', import.meta.url);
const ler = (n) => readFileSync(new URL(n, DIR), 'utf8').trimEnd();
const partes = readdirSync(DIR)
  .filter((f) => f.endsWith('.css'))
  .sort();

const SITE = partes.filter((f) => !['cookies.css', 'cookies-site.css'].includes(f));
// Os cookies entram antes dos ajustes de celular e do rodapé não depender deles: ficam no fim, onde estavam.
export const siteCss = () => [...SITE.map(ler), ler('cookies.css'), ler('cookies-site.css')].join('\n') + '\n';
// Nas LPs o aviso fica acima da barra fixa de compra, no celular.
const LP = '@media (max-width: 699px) { .cookie-banner { bottom: calc(env(safe-area-inset-bottom, 0px) + 76px); } }';
export const consentCss = () => ler('cookies.css') + '\n' + LP + '\n';
export const hashCss = (s) => createHash('sha1').update(s).digest('hex').slice(0, 10);
