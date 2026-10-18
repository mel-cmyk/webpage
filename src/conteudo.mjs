// Textos que mudam com frequência, lidos de data/conteudo.json (fonte única).
// A forma é validada aqui: um campo faltando derruba o build, em vez de publicar uma página quebrada.
import fs from 'node:fs';

export const CONTEUDO = JSON.parse(fs.readFileSync(new URL('../data/conteudo.json', import.meta.url), 'utf8'));

const erros = [];
const texto = (v, onde) => { if (typeof v !== 'string' || !v.trim()) erros.push(`${onde}: texto vazio ou ausente`); };
const faq = (lista, onde) => lista.forEach((x, i) => { texto(x.q, `${onde}[${i}].q`); texto(x.a, `${onde}[${i}].a`); });

Object.values(CONTEUDO.selos_tours).forEach((s, i) => texto(s, `selos_tours[${i}]`));
texto(CONTEUDO.tripadvisor.url, 'tripadvisor.url');
for (const [id, a] of Object.entries(CONTEUDO.tripadvisor.avaliacoes)) { texto(a.titulo, `tripadvisor.${id}.titulo`); texto(a.texto, `tripadvisor.${id}.texto`); texto(a.autor, `tripadvisor.${id}.autor`); texto(a.info, `tripadvisor.${id}.info`); }
CONTEUDO.tours_incluido.forEach((s, i) => texto(s, `tours_incluido[${i}]`));
faq(CONTEUDO.tours_faq, 'tours_faq');
for (const [id, s] of Object.entries(CONTEUDO.home.servicos)) { texto(s.para, `home.servicos.${id}.para`); texto(s.txt, `home.servicos.${id}.txt`); texto(s.cta, `home.servicos.${id}.cta`); }
CONTEUDO.home.faq.forEach((x, i) => { if ('faq_tours' in x) { if (!CONTEUDO.tours_faq[x.faq_tours]) erros.push(`home.faq[${i}]: faq_tours ${x.faq_tours} não existe`); } else faq([x], `home.faq[${i}]`); });
CONTEUDO.quiz_perguntas.forEach((p, n) => {
  texto(p.pergunta, `quiz_perguntas[${n}].pergunta`);
  if (!p.opcoes.length) erros.push(`quiz_perguntas[${n}]: sem opções`);
  p.opcoes.forEach((o, k) => { texto(o.texto, `quiz_perguntas[${n}].opcoes[${k}].texto`); if (!Object.keys(o.pontos).length) erros.push(`quiz_perguntas[${n}].opcoes[${k}]: sem pontos`); });
});
CONTEUDO.depoimentos.forEach((d, i) => { texto(d.nome, `depoimentos[${i}].nome`); texto(d.texto, `depoimentos[${i}].texto`); texto(d.cidade, `depoimentos[${i}].cidade`); texto(d.uf, `depoimentos[${i}].uf`); });
for (const [lp, v] of Object.entries(CONTEUDO.lps)) faq(v.faq.map((x) => ({ q: x.q, a: x.a })), `lps.${lp}.faq`);
for (const [id, t] of Object.entries(CONTEUDO.diagnostico.indicacao)) texto(t, `diagnostico.indicacao.${id}`);
for (const [id, t] of Object.entries(CONTEUDO.diagnostico.perfis)) texto(t, `diagnostico.perfis.${id}`);
if (erros.length) throw new Error('data/conteudo.json inválido:\n- ' + erros.join('\n- '));

export const faqHome = () => CONTEUDO.home.faq.map((x) => ('faq_tours' in x ? CONTEUDO.tours_faq[x.faq_tours] : x));
