// Textos editáveis das LPs, lidos de data/conteudo.json (os mesmos do restante do site).
// {email}, {whatsapp} e {parcelas} nos textos são trocados pelos valores de data/ofertas.json.
import conteudo from '../../data/conteudo.json';
import ofertas from '../../data/ofertas.json';

const marca = (ofertas as any).marca;

export const preencher = (texto: string, extra: Record<string, string | number> = {}): string => {
  const valores: Record<string, string | number> = { email: marca.email, whatsapp: marca.whatsapp_site, ...extra };
  return texto.replace(/\{(\w+)\}/g, (m, k) => (k in valores ? String(valores[k]) : m));
};

export interface Depoimento {
  id: string;
  nome: string;
  cidade: string;
  uf: string;
  texto: string;
  texto_curto?: string;
}
export const depoimentos = (conteudo as any).depoimentos as Depoimento[];

export const faqDaLp = (lp: 'criancas' | 'essencial', extra: Record<string, string | number> = {}) =>
  ((conteudo as any).lps[lp].faq as { q: string; a: string }[]).map((i) => ({ q: i.q, a: preencher(i.a, extra) }));
