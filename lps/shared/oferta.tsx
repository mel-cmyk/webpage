// Preço vigente dos guias, vindo de data/ofertas.json (mesma lógica do restante do site, em src/oferta.mjs).
// O HTML pré-gerado sai com o estado do momento da publicação (data-promo em <html>).
// No navegador, a página confere a validade e, se a promoção venceu, troca sozinha para o preço normal.
import React, { createContext, useContext, useEffect, useState } from 'react';
import ofertas from '../../data/ofertas.json';
// @ts-ignore: módulo JS sem tipos
import { vigente, itemGA } from '../../src/oferta.mjs';

export interface Oferta {
  ativa: boolean;
  preco: number;
  preco_de: number | null;
  rotulo: string;
  parcelas: number;
  parcela: number | null;
  preco_normal: number;
  valido_ate: string | null;
  link_compra: string;
  item: Record<string, unknown>;
}

const guia = (id: string): any => {
  const g = (ofertas as any).guias.find((x: any) => x.id === id);
  if (!g) throw new Error(`Guia não encontrado em data/ofertas.json: ${id}`);
  return g;
};

const montar = (id: string, ativa: boolean): Oferta => {
  const g = guia(id);
  // O estado (ativa ou não) vem de fora; por isso o "agora" é forçado: 0 = promoção ativa, Infinity = vencida.
  const agora = ativa ? 0 : Infinity;
  return { ...vigente(g, agora), link_compra: g.link_compra, item: itemGA(g, agora) };
};

export const promoAtivaAgora = (id: string): boolean => vigente(guia(id)).ativa;

const estadoInicial = (id: string): boolean => {
  if (typeof document === 'undefined') return promoAtivaAgora(id); // pré-geração
  const d = document.documentElement.dataset.promo; // veio do HTML pré-gerado
  return d === undefined ? promoAtivaAgora(id) : d === '1';
};

const Ctx = createContext<Oferta | null>(null);

export const OfertaProvider: React.FC<{ guiaId: string; children: React.ReactNode }> = ({ guiaId, children }) => {
  const [ativa, setAtiva] = useState<boolean>(() => estadoInicial(guiaId));
  useEffect(() => {
    const g = guia(guiaId);
    const conferir = () => setAtiva(promoAtivaAgora(guiaId));
    conferir();
    if (!g.promocao) return;
    const falta = Date.parse(g.promocao.valido_ate) - Date.now();
    if (falta > 0 && falta < 2 ** 31 - 1) {
      const t = setTimeout(conferir, falta + 500);
      return () => clearTimeout(t);
    }
  }, [guiaId]);
  return <Ctx.Provider value={montar(guiaId, ativa)}>{children}</Ctx.Provider>;
};

export const useOferta = (): Oferta => {
  const o = useContext(Ctx);
  if (!o) throw new Error('useOferta fora do OfertaProvider');
  return o;
};

export const formatBR = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const formatInteiro = (v: number) => v.toLocaleString('pt-BR');
