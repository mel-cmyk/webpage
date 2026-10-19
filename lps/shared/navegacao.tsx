// Caminhos de volta ao site a partir das páginas de venda dos guias (LPs).
// As LPs ficam em /guias/<guia>/: tirar esses dois níveis do endereço dá a raiz do site, com ou sem prefixo de teste.
import React from 'react';

const RAIZ = import.meta.env.BASE_URL.replace(/[^/]+\/[^/]+\/$/, '');
export const rotaSite = (caminho = ''): string => `${RAIZ}${caminho}`;

// Logo que leva à página inicial do site.
export const LogoLink: React.FC<{ origem: 'cabecalho' | 'rodape'; children: React.ReactNode }> = ({ origem, children }) => (
  <a href={rotaSite()} aria-label="Mel Rolan Travel Designer, página inicial" data-cta={`lp-logo-${origem}`} className="inline-flex items-center">
    {children}
  </a>
);

const ITENS = [
  ['Início', ''],
  ['Guias de Paris', 'guias-de-paris/'],
  ['Tours em Paris', 'tours-em-paris/'],
  ['Roteiro sob medida', 'roteiro-sob-medida/'],
  ['Consultoria', 'consultoria/'],
] as const;

// Fim da página: quem rolou até aqui sem comprar tem para onde ir.
export const NavegacaoSite: React.FC<{ className?: string }> = ({ className = '' }) => (
  <nav aria-label="Outras páginas do site" className={`flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-sans ${className}`}>
    {ITENS.map(([rotulo, caminho]) => (
      <a
        key={caminho}
        href={rotaSite(caminho)}
        data-cta="lp-rodape-nav"
        className="hover:text-[#C19450] transition-colors underline underline-offset-4 decoration-white/30"
      >
        {rotulo}
      </a>
    ))}
  </nav>
);
