import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, 
  ShieldCheck, 
  ArrowRight, 
  Star,
  MapPin,
  Clock,
  Utensils,
  Smartphone,
  BookOpen,
  Calendar,
  Lock,
  ChevronDown,
  X,
  ZoomIn
} from 'lucide-react';
import { OfertaProvider, useOferta } from '../shared/oferta';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

const PRIVACY_URL = "https://www.melrolan.com.br/privacidade/";

// Design System
// Navy: #22274F
// Gold: #C19450
// Creme: #F7F4EA

const useLinkValidationAndScroll = () => {
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const id = href.substring(1);
        const element = document.getElementById(id);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);
};

// --- Componentes Reutilizáveis ---

// Endereço-base da página (muda com o endereço de publicação)
const B = import.meta.env.BASE_URL;

interface ChicCTAProps {
  text: string;
  subtext?: string;
  className?: string;
  slot?: 'header' | 'hero' | 'inclusoes' | 'preco' | 'sticky_mobile' | string;
}

const ChicCTA = ({ text, subtext, className = "", slot = "hero" }: ChicCTAProps) => {
  const oferta = useOferta();
  // O analytics.js do site mede o clique (begin_checkout) e leva gclid, gbraid, wbraid e UTMs para a loja.
  return (
    <a 
      href={oferta.link_compra} 
      target="_blank"
      rel="noopener noreferrer"
      data-checkout={JSON.stringify(oferta.item)}
      data-slot={slot}
      className={`bg-[#C19450] text-[#22274F] hover:bg-[#b08442] hover:shadow-lg transform active:scale-95 transition-all duration-300 rounded-sm shadow-md flex flex-col items-center justify-center text-center select-none font-bold ${className}`}
    >
      <span className="flex items-center justify-center gap-2 uppercase tracking-widest text-sm md:text-base font-sans font-bold">
        {text} <ArrowRight className="w-5 h-5 text-[#22274F]" />
      </span>
      {subtext && <span className="text-[10px] text-[#22274F]/85 font-medium mt-1 font-sans tracking-wide">{subtext}</span>}
    </a>
  );
};

const SectionTitle = ({ title, subtitle, light = false }: { title: string, subtitle?: string, light?: boolean }) => (
  <div className="text-center mb-12">
    {subtitle && (
      <span className={`block font-bold uppercase tracking-[0.2em] text-xs mb-3 font-sans ${light ? 'text-[#C19450]' : 'text-[#8d6635]'}`}>
        {subtitle}
      </span>
    )}
    <h2 className={`text-3xl md:text-5xl font-serif italic leading-tight ${light ? 'text-white' : 'text-[#22274F]'}`}>
      {title}
    </h2>
    <div className="w-24 h-0.5 bg-[#C19450]/30 mx-auto mt-6"></div>
  </div>
);

// --- Header ---

const Header = () => {
  const oferta = useOferta();
  const [isScrolled, setIsScrolled] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-[#C19450]/15 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-2' : 'bg-white py-4'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          {!imgError ? (
            <img 
              src={`${B}images/logo.webp`} 
              alt="Mel Rolan Logo" 
              className="h-10 md:h-12 w-auto"
              onError={() => setImgError(true)}
              width="150"
              height="65"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="flex flex-col">
              <span className="text-xl font-serif font-bold text-[#22274F] leading-none uppercase tracking-tighter">MEL ROLAN</span>
            </div>
          )}
        </div>
        
        <ChicCTA 
          text={`Quero meu roteiro por R$ ${oferta.preco}`} 
          slot="header"
          className="hidden md:flex px-8 py-3 !min-h-[44px]"
        />
        
        <a 
          href={oferta.link_compra} 
          target="_blank"
          rel="noopener noreferrer"
          data-checkout={JSON.stringify(oferta.item)}
          data-slot="header"
          className="md:hidden text-[#22274F] font-serif italic text-sm border-b border-[#22274F]"
        >
          Quero meu roteiro
        </a>
      </div>
    </header>
  );
};

// --- Hero ---

const Hero = () => {
  const oferta = useOferta();
  return (
    <section className="relative pt-32 pb-12 md:pt-48 md:pb-20 bg-[#F7F4EA] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-block border border-[#22274F]/10 px-4 py-1 rounded-full mb-6 bg-white shadow-sm">
            <span className="text-[#22274F] font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold">
              Roteiro por Mel Rolan
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-serif text-[#22274F] leading-[1.1] mb-6 font-bold">
            Roteiro de Paris em 4 dias, pronto para usar.
          </h1>
          
          <p className="text-gray-700 font-sans text-lg leading-relaxed mb-8 max-w-xl mx-auto md:mx-0">
            Atrações, almoços e jantares agrupados por região, mais 6 bate-voltas. PDF com entrega imediata.
          </p>
          
          <div className="flex flex-col gap-4 max-w-md mx-auto md:mx-0">
            <div className="flex items-baseline justify-center md:justify-start gap-3 mb-2">
              {oferta.preco_de && <span className="text-gray-500 line-through font-serif text-lg">De R$ {oferta.preco_de}</span>}
              <span className="text-[#22274F] font-bold text-xl font-sans">{oferta.preco_de ? 'Por ' : ''}R$ {oferta.preco}</span>
            </div>
            
            <ChicCTA 
              text={`Quero meu roteiro por R$ ${oferta.preco}`} 
              slot="hero"
              className="w-full py-5 text-lg shadow-xl"
            />
            
            <div className="text-center md:text-left">
              <p className="text-xs font-sans text-gray-600 tracking-wide">
                Entrega imediata em PDF. Parcelamento sem juros conforme a loja e Pix. Garantia de 7 dias.
              </p>
            </div>

            <div className="text-center md:text-left pt-2 border-t border-[#22274F]/10">
              <p className="text-xs md:text-sm font-sans text-[#22274F] font-medium leading-snug">
                Mel Rolan, Travel Designer especialista em viajantes brasileiros, já atendeu mais de 650 clientes.
              </p>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4 text-[10px] text-gray-600 font-sans tracking-widest uppercase mt-1">
              <span className="flex items-center gap-1"><CheckCircle size={12} className="text-[#C19450]" /> Entrega Automática</span>
              <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-[#C19450]" /> Compra Segura</span>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full max-w-md relative">
           <div className="relative z-10 p-2 bg-white shadow-2xl rotate-2 rounded-sm">
             <img 
               src={`${B}images/hero-celular.webp`} 
               alt="Roteiro Paris Essencial no Celular" 
               className="w-full h-auto"
               width="500"
               height="750"
               decoding="async"
               loading="eager"
               fetchPriority="high"
             />
             <div className="absolute -bottom-6 -left-6 bg-[#22274F] text-white p-4 shadow-lg max-w-[200px] hidden md:block border-l-4 border-[#C19450]">
               <p className="font-serif italic text-lg leading-none">"O fim dos deslocamentos desnecessários."</p>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
};

// --- Barra de Autoridade ---

const AuthorityBar = () => (
  <div className="bg-[#22274F] py-4 border-y border-[#C19450]/30">
    <div className="max-w-6xl mx-auto px-4 text-center">
      <p className="text-white/90 text-xs md:text-sm uppercase tracking-[0.2em] font-medium font-sans flex items-center justify-center gap-3">
        <Star size={14} className="text-[#C19450]" fill="#C19450" />
        Mel Rolan, Travel Designer especialista em viajantes brasileiros, já atendeu mais de 650 clientes
        <Star size={14} className="text-[#C19450]" fill="#C19450" />
      </p>
    </div>
  </div>
);

// --- Amostra de um dia do roteiro ---

interface SampleDaySectionProps {
  onOpenSample: (imgSrc: string, altText: string) => void;
}

const SampleDaySection = ({ onOpenSample }: SampleDaySectionProps) => {
  const imgSrc = `${B}images/amostra-arco.webp`;
  const altText = "Exemplo real de página do Roteiro Paris Essencial: manhã no Arco do Triunfo com horários, dicas e mapa";
  
  return (
    <section className="py-20 bg-[#F7F4EA] border-b border-[#C19450]/20">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <SectionTitle 
          title="Veja uma página por dentro" 
          subtitle="AMOSTRA REAL DO ROTEIRO" 
        />
        
        <p className="text-gray-700 font-sans text-base md:text-lg max-w-2xl mx-auto -mt-6 mb-10 leading-relaxed">
          Cada atração vem detalhada com horários sugeridos, tempo estimado de visita, dicas práticas da Mel, acessibilidade e endereços completos.
        </p>

        <div className="max-w-md mx-auto">
          <button
            type="button"
            onClick={() => onOpenSample(imgSrc, altText)}
            className="group relative block w-full text-left focus:outline-none focus:ring-2 focus:ring-[#C19450] focus:ring-offset-4 rounded-sm shadow-2xl bg-white p-2 md:p-3 border border-[#C19450]/30 transition-transform duration-300 hover:scale-[1.01]"
            aria-label="Abrir amostra ampliada da página do roteiro"
          >
            <img 
              src={imgSrc} 
              alt={altText} 
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (!target.src.endsWith('.jpg')) {
                  target.src = `${B}images/amostra-arco.jpg`;
                }
              }}
              className="w-full h-auto rounded-sm"
              loading="lazy"
              decoding="async"
              width="800"
              height="1132"
            />
            <div className="absolute inset-0 bg-[#22274F]/10 group-hover:bg-[#22274F]/20 transition-colors flex items-center justify-center pointer-events-none rounded-sm">
              <span className="inline-flex items-center gap-2 bg-[#22274F]/90 text-white text-xs font-sans font-medium px-4 py-2 rounded-full shadow-md backdrop-blur-sm transform group-hover:scale-105 transition-transform">
                <ZoomIn size={14} className="text-[#C19450]" />
                Toque para ampliar a página
              </span>
            </div>
          </button>
          
          <p className="text-xs text-gray-600 font-sans mt-3">
            Página real do roteiro com indicação de horário, tempo estimado, acessibilidade e dica prática da autora.
          </p>
        </div>
      </div>
    </section>
  );
};

// --- Por que não montar sozinho ---

interface WhyNotSoloSectionProps {
  onOpenSample: (imgSrc: string, altText: string) => void;
}

const WhyNotSoloSection = ({ onOpenSample }: WhyNotSoloSectionProps) => {
  const imgSrc = `${B}images/mapa-logistico.webp`;
  const altText = "Ilustração da lógica por região do Roteiro Paris Essencial";

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <SectionTitle 
          title="Por que não montar sozinho" 
          subtitle="A LÓGICA POR REGIÃO" 
        />
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 relative">
            <button
              type="button"
              onClick={() => onOpenSample(imgSrc, altText)}
              id="btn-sample-trigger"
              className="group relative block w-full text-left focus:outline-none focus:ring-2 focus:ring-[#C19450] focus:ring-offset-4 rounded-sm"
              aria-label="Abrir ilustração da lógica por região do Roteiro Paris Essencial"
            >
              <img 
                src={imgSrc} 
                alt={altText} 
                className="w-full shadow-lg border-8 border-white bg-gray-50 transition-transform duration-300 group-hover:scale-[1.01]"
                width="800"
                height="1000"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-[#22274F]/10 group-hover:bg-[#22274F]/20 transition-colors flex items-center justify-center pointer-events-none">
                <span className="inline-flex items-center gap-2 bg-[#22274F]/90 text-white text-xs font-sans font-medium px-4 py-2 rounded-full shadow-md backdrop-blur-sm transform group-hover:scale-105 transition-transform">
                  <ZoomIn size={14} className="text-[#C19450]" />
                  Toque para ampliar
                </span>
              </div>
            </button>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#F7F4EA] -z-10"></div>
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#22274F]/5 -z-10"></div>
          </div>
          
          <div className="order-1 md:order-2">
            <p className="text-xl text-[#22274F] font-serif italic leading-relaxed mb-6">
              Blogs listam o que visitar. Este roteiro decide a ordem por você: cada dia fica dentro de uma região, com almoço e jantar na rota, sem vaivém de metrô.
            </p>
            <p className="text-gray-600 font-sans leading-relaxed mb-8">
              Cada dia foi planejado pela Mel a partir de vivência prática para conectar pontos de interesse por proximidade, vivendo a atmosfera parisiense sem o estresse de deslocamentos longos ou atrações espalhadas.
            </p>
            
            <ul className="space-y-4">
              {[
                "Atrações agrupadas por região",
                "Almoço e jantar na mesma rota",
                "Sem vaivém de metrô",
                "Planejado a partir de vivência com centenas de viajantes"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[#22274F] font-medium font-sans">
                  <span className="w-6 h-6 rounded-full bg-[#22274F]/10 text-[#22274F] flex items-center justify-center text-xs">
                    <CheckCircle size={14} className="text-[#C19450]" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Para quem é ---

const TargetAudienceSection = () => (
  <section className="py-20 bg-[#F7F4EA] border-t border-[#C19450]/20">
    <div className="max-w-5xl mx-auto px-4">
      <SectionTitle 
        title="Para quem é este roteiro" 
        subtitle="PERFIL DE VIAGEM" 
      />
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm flex flex-col">
          <div className="w-12 h-12 rounded-full bg-[#22274F] text-[#C19450] flex items-center justify-center font-serif text-xl font-bold mb-6">
            1
          </div>
          <h3 className="text-xl font-serif italic text-[#22274F] mb-3">Primeira vez em Paris</h3>
          <p className="text-gray-700 font-sans text-sm leading-relaxed">
            Para quem quer visitar os principais cartões-postais da cidade sem errar nos deslocamentos nem perder dias tentando descobrir o que fazer primeiro.
          </p>
        </div>

        <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm flex flex-col">
          <div className="w-12 h-12 rounded-full bg-[#22274F] text-[#C19450] flex items-center justify-center font-serif text-xl font-bold mb-6">
            2
          </div>
          <h3 className="text-xl font-serif italic text-[#22274F] mb-3">Quem já conhece a cidade</h3>
          <p className="text-gray-700 font-sans text-sm leading-relaxed">
            Para quem deseja redescobrir Paris com restaurantes selecionados e estender o passeio com 6 opções de bate-volta pelos arredores.
          </p>
        </div>

        <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm flex flex-col">
          <div className="w-12 h-12 rounded-full bg-[#22274F] text-[#C19450] flex items-center justify-center font-serif text-xl font-bold mb-6">
            3
          </div>
          <h3 className="text-xl font-serif italic text-[#22274F] mb-3">Viagens de 1 a 10 dias</h3>
          <p className="text-gray-700 font-sans text-sm leading-relaxed">
            O roteiro atende quem fica de 1 a 10 dias: são 4 dias inteiros dedicados só a Paris e mais 6 sugestões de bate-volta para todos os gostos e interesses para complementar esses 4 dias, totalizando 10 dias de roteiro prontos para usar.
          </p>
        </div>
      </div>
    </div>
  </section>
);

// --- Inclusões do Roteiro ---

const InclusionsSection = () => {
  const oferta = useOferta();
  const items = [
    {
      icon: <MapPin className="text-[#C19450]" size={28} />,
      title: "Roteiro de 4 dias no coração de Paris",
      desc: "Torre Eiffel, Louvre, Saint-Germain e Montmartre, organizados por região para você caminhar menos e aproveitar mais."
    },
    {
      icon: <Calendar className="text-[#C19450]" size={28} />,
      title: "6 Sugestões de Bate-Volta",
      desc: "Expanda sua viagem para Versalhes, Giverny, Reims (Champagne) e muito mais. Roteiro de 4 dias mais 6 bate-voltas."
    },
    {
      icon: <Utensils className="text-[#C19450]" size={28} />,
      title: "Seleção de Almoço e Jantar",
      desc: "Restaurantes recomendados por região a partir da vivência real da Mel, para você comer bem sem desvios desnecessários."
    },
    {
      icon: <BookOpen className="text-[#C19450]" size={28} />,
      title: "Checklist Prático 2026",
      desc: "Documentação, segurança, voltagem, fuso e dicas de etiqueta nos restaurantes."
    },
    {
      icon: <Star className="text-[#C19450]" size={28} />,
      title: "Inspiração Cultural",
      desc: "Guia de filmes, séries e livros para você se apaixonar pela cidade antes mesmo de decolar."
    }
  ];

  return (
    <section id="conteudo" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <SectionTitle 
          title="O que você vai receber" 
          subtitle="CONTEÚDO COMPLETO"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <div key={idx} className="bg-[#F7F4EA] border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="mb-6 bg-white w-14 h-14 rounded-full flex items-center justify-center">{item.icon}</div>
              <h3 className="text-xl font-serif italic mb-3 text-[#22274F]">{item.title}</h3>
              <p className="text-gray-600 font-sans text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
          
          {/* Card de CTA dentro do Grid */}
          <div className="bg-[#22274F] text-white p-8 flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-[#C19450]/20 rounded-full -mr-10 -mt-10"></div>
             <h3 className="text-[#C19450] font-bold uppercase tracking-widest text-sm mb-3 relative z-10">Acesso Imediato</h3>
             {oferta.rotulo ? (
               <div className="mb-2 relative z-10">
                 <span 
                   className="inline-block text-[#86632B] uppercase tracking-wider text-xs font-semibold px-2 py-0.5 bg-[#F7F4EA] rounded-sm"
                   style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#86632B' }}
                 >
                   {oferta.rotulo}
                 </span>
               </div>
             ) : null}
             <div className="mb-6 relative z-10">
               {oferta.preco_de && <span className="text-gray-400 line-through text-sm block">R$ {oferta.preco_de}</span>}
               <span className="text-white font-serif text-3xl font-bold">R$ {oferta.preco}</span>
             </div>
             <ChicCTA 
               text={`Quero meu roteiro por R$ ${oferta.preco}`} 
               slot="inclusoes"
               className="w-full py-4 text-sm relative z-10"
             />
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Depoimentos ---

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Mel tem uma sensibilidade impressionante! Transborda amor na sua escuta e entrega mais do que podemos imaginar.",
      author: "Roberta",
      location: "São Paulo, SP"
    },
    {
      quote: "Mel foi bastante atenta e cuidadosa, buscando atender as particularidades do nosso grupo. Conhecer a França de mãos dadas com Mel, tornou a experiência inesquecível.",
      author: "Fernanda",
      location: "Natal, RN"
    },
    {
      quote: "Além de competente, ela é uma simpatia de pessoa, educada, honesta e super acessível. O trabalho da Mel foi primordial para o sucesso da nossa tão sonhada e planejada viagem!",
      author: "Renata",
      location: "Pereiras, SP"
    }
  ];

  return (
    <section className="py-24 bg-[#22274F] text-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-serif italic text-[#C19450] mb-4">
          A expertise que já encantou centenas de viajantes
        </h2>
        <p className="text-gray-300 text-sm md:text-base font-sans max-w-2xl mx-auto mb-16 leading-relaxed">
          Depoimentos de clientes dos roteiros personalizados, consultorias e tours da Mel.
        </p>

        <div className="grid md:grid-cols-3 gap-12">
          {testimonials.map((t, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} size={20} className="fill-[#C19450] text-[#C19450]" />
                ))}
              </div>
              <p className="font-serif italic text-lg mb-8 leading-relaxed">
                "{t.quote}"
              </p>
              <div className="mt-auto">
                <p className="font-bold text-[#C19450] text-lg">{t.author}</p>
                <p className="text-sm text-gray-300 uppercase tracking-wide">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Oferta e Preço ---

const PricingSection = () => {
  const oferta = useOferta();
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="bg-[#F7F4EA] border border-[#22274F]/10 p-8 md:p-16 text-center shadow-xl rounded-sm">
          <SectionTitle 
            title="Roteiro de Travel Designer por preço de guia digital"
            subtitle={oferta.ativa ? "OFERTA ESPECIAL" : "VALOR DO ROTEIRO"}
          />
          
          <p className="text-sm font-sans text-gray-700 max-w-xl mx-auto -mt-6 mb-8 leading-relaxed">
            Uma consultoria personalizada de viagem custa muito mais do que R$ {oferta.preco}. Aqui você leva a mesma lógica de planejamento da Mel, em um roteiro pronto para usar.
          </p>

          {oferta.rotulo ? (
            <div className="mb-3">
              <span 
                className="inline-block text-[#86632B] uppercase tracking-wider text-xs font-semibold px-2 py-0.5 bg-white border border-[#86632B]/30 rounded-sm"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#86632B' }}
              >
                {oferta.rotulo}
              </span>
            </div>
          ) : null}

          <div className="flex flex-col items-center justify-center gap-2 mb-10">
             {oferta.preco_de && <p className="text-gray-500 font-serif italic text-xl line-through decoration-[#C19450]">De R$ {oferta.preco_de},00</p>}
             <div className="flex items-baseline gap-2">
               <span className="text-gray-700 font-sans uppercase tracking-widest text-sm font-bold">{oferta.preco_de ? 'Por apenas' : 'Valor'}</span>
               <span className="text-6xl md:text-8xl font-serif text-[#22274F] font-bold">{oferta.preco}</span>
               <span className="text-[#22274F] text-xl font-bold self-start mt-4">,00</span>
             </div>
          </div>
          
          <div className="max-w-md mx-auto space-y-4">
            <ChicCTA 
              text={`Quero meu roteiro por R$ ${oferta.preco}`} 
              subtext="Download imediato em PDF (Smartphone e Tablet)"
              slot="preco"
              className="w-full py-5 text-lg shadow-xl"
            />
            
            <div className="text-center">
              <p className="text-xs font-sans text-gray-600 tracking-wide font-medium">
                Entrega imediata em PDF. Parcelamento sem juros conforme a loja e Pix. Garantia de 7 dias.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm font-sans pt-2">
              <ShieldCheck className="text-[#C19450]" size={18} />
              <span>7 dias de garantia incondicional</span>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-[#C19450]/20 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center">
              <Smartphone size={20} className="text-[#22274F] mb-2" />
              <span className="text-[10px] uppercase tracking-widest text-gray-700">100% Digital</span>
            </div>
            <div className="flex flex-col items-center">
              <Clock size={20} className="text-[#22274F] mb-2" />
              <span className="text-[10px] uppercase tracking-widest text-gray-700">Acesso Vitalício</span>
            </div>
             <div className="flex flex-col items-center">
              <Lock size={20} className="text-[#22274F] mb-2" />
              <span className="text-[10px] uppercase tracking-widest text-gray-700">Pagamento Seguro</span>
            </div>
             <div className="flex flex-col items-center">
              <BookOpen size={20} className="text-[#22274F] mb-2" />
              <span className="text-[10px] uppercase tracking-widest text-gray-700">PDF Interativo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Perguntas Frequentes (FAQ) ---

const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    {
      q: "Já tenho blogs e vídeos, por que comprar?",
      a: "Blogs e vídeos listam atrações soltas, mas não resolvem a sua rotina. Este roteiro decide a ordem por você: cada dia fica dentro de uma região, com almoço e jantar na rota, sem vaivém de metrô."
    },
    {
      q: "Funciona sem internet?",
      a: "Sim. Como o roteiro é entregue em formato PDF, você pode salvá-lo no celular ou tablet e consultar todas as páginas sem precisar de conexão. Apenas os links externos para compra de ingressos ou rotas de navegação exigem acesso à internet."
    },
    {
      q: "Como peço reembolso?",
      a: "Você tem 7 dias de garantia incondicional a partir da compra. Para pedir o reembolso, basta enviar uma mensagem para contato@melrolan.com.br ou pelo WhatsApp +33 7 83 48 37 56 informando os dados da compra. O valor pago é devolvido integralmente."
    },
    {
      q: "Como recebo o roteiro?",
      a: "Você recebe o PDF por e-mail logo após a confirmação do pagamento, com o link para baixar. Se não encontrar o e-mail, olhe a caixa de spam ou escreva para contato@melrolan.com.br."
    },
    {
      q: "O roteiro funciona para quem viaja sozinho, em casal ou em grupo?",
      a: "Sim. O roteiro foi planejado pela lógica de deslocamento entre atrações por região, não pelo perfil de quem viaja, e se adapta a qualquer grupo."
    },
    {
      q: "Qual a diferença entre o Guia Paris Essencial e o Guia Paris com Crianças?",
      a: "O Essencial é um roteiro de 4 dias mais 6 bate-voltas para quem quer aproveitar Paris e arredores com vivência real. O Guia Paris com Crianças é uma lista curada por faixa etária para quem viaja com filhos, para cada família montar a própria programação."
    }
  ];

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-[#F7F4EA] border-t border-[#C19450]/20">
      <div className="max-w-3xl mx-auto px-4">
        <SectionTitle 
          title="Perguntas Frequentes" 
          subtitle="Tire suas dúvidas"
        />

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div 
                key={i} 
                className="bg-white border border-[#C19450]/20 rounded-sm overflow-hidden shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="w-full text-left p-6 flex justify-between items-center gap-4 focus:outline-none focus:ring-2 focus:ring-[#C19450]"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-question-${i}`}
                >
                  <span className="font-serif italic text-lg md:text-xl text-[#22274F] font-semibold">
                    {faq.q}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-[#C19450] flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`} 
                  />
                </button>
                {isOpen && (
                  <div 
                    id={`faq-answer-${i}`} 
                    role="region" 
                    aria-labelledby={`faq-question-${i}`}
                    className="px-6 pb-6 pt-1 text-gray-700 font-sans text-sm md:text-base leading-relaxed border-t border-gray-100"
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// --- Sobre a Autora ---

const AuthorSection = () => (
  <section className="py-20 bg-[#22274F] text-white">
    <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
      <div className="flex-1 order-2 md:order-1">
        <span className="text-[#C19450] font-bold uppercase tracking-[0.2em] text-xs mb-4 block">Sobre a Autora</span>
        <h2 className="text-3xl md:text-5xl font-serif italic mb-6 text-white">Mel Rolan</h2>
        <p className="text-gray-300 font-sans leading-relaxed mb-6">
          Mel Rolan é Travel Designer especialista em viajantes brasileiros, com mais de 650 clientes atendidos. Mora na França há mais de 5 anos e é formada em Turismo.
        </p>
        <p className="text-gray-300 font-sans leading-relaxed">
          Especialista em viagens e roteiros personalizados, Mel transformou sua vivência real no país em uma metodologia que organiza o roteiro dos brasileiros em Paris, unindo conhecimento do destino com a prática de quem viaja.
        </p>
      </div>
      <div className="flex-1 order-1 md:order-2">
         <div className="relative p-2 border border-[#C19450]/30">
           <img 
             src={`${B}images/mel-rolan.webp`} 
             alt="Mel Rolan" 
             className="w-full grayscale hover:grayscale-0 transition-all duration-700"
             width="800"
             height="533"
             loading="lazy"
             decoding="async"
           />
         </div>
      </div>
    </div>
  </section>
);

// --- Barra Fixa no Celular ---

const StickyMobileCTA = () => {
  const oferta = useOferta();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 bg-white/95 backdrop-blur-md border-t border-gray-100 md:hidden shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between mb-2 px-1">
         <div className="flex items-center gap-2">
           <span className="text-[10px] uppercase font-bold text-gray-700 tracking-widest">{oferta.ativa ? "Oferta por tempo limitado" : "Roteiro Paris Essencial"}</span>
         </div>
         <span className="text-xs font-bold text-[#22274F]">R$ {oferta.preco}</span>
      </div>
      <ChicCTA 
        text={`Quero meu roteiro por R$ ${oferta.preco}`} 
        slot="sticky_mobile"
        className="w-full py-4 text-xs shadow-lg" 
      />
    </div>
  );
};

// --- Rodapé ---

const Footer = () => {
  const [imgError, setImgError] = useState(false);
  return (
    <footer className="bg-[#181d3b] text-white py-12 border-t border-white/5 pb-32 md:pb-12">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="mb-8 flex justify-center">
           {!imgError ? (
            <img 
              src={`${B}images/logo.webp`} 
              alt="Mel Rolan Logo" 
              className="h-10 md:h-12 w-auto brightness-0 invert opacity-80"
              onError={() => setImgError(true)}
              width="150"
              height="65"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="font-serif text-2xl font-bold">MEL ROLAN</span>
          )}
        </div>
        <div className="flex flex-wrap justify-center items-center gap-6 text-[10px] uppercase tracking-widest text-gray-400 mb-8">
          <a href="https://loja.melrolan.com.br/pol%C3%ADtica" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Termos</a>
          <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacidade</a>
          <button 
            type="button" 
            data-cookie-prefs
            className="hover:text-white transition-colors uppercase tracking-widest text-[10px] text-gray-400 bg-transparent border-0 cursor-pointer p-0 underline-offset-2 hover:underline"
          >
            Preferências de cookies
          </button>
          <a href="https://www.instagram.com/mel.rolan/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
          <a href="mailto:contato@melrolan.com.br" className="hover:text-white transition-colors">Contato</a>
        </div>
        <p className="text-[10px] text-gray-400">© 2026 Mel Rolan Travel Designer. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

// --- Modal de Amostra Ampliada ---

interface SampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc?: string;
  imageAlt?: string;
}

const SampleModal = ({ isOpen, onClose, imageSrc, imageAlt }: SampleModalProps) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const src = imageSrc || `${B}images/mapa-logistico.webp`;
  const alt = imageAlt || "Ilustração ampliada da lógica por região do Roteiro Paris Essencial";

  useEffect(() => {
    if (!isOpen) return;

    // Foco inicial no botão fechar
    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl w-full max-h-[95vh] flex flex-col items-center justify-center bg-white/5 rounded-lg p-2 md:p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-0 md:top-2 md:right-2 z-10 p-2 text-white bg-[#22274F]/80 hover:bg-[#22274F] rounded-full focus:outline-none focus:ring-2 focus:ring-[#C19450] transition-colors"
          aria-label="Fechar ampliação"
        >
          <X size={24} />
        </button>
        <img 
          src={src} 
          alt={alt} 
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (target.src.endsWith('.webp')) {
              target.src = target.src.replace(/\.webp$/, '.jpg');
            }
          }}
          className="max-h-[85vh] w-auto max-w-full object-contain rounded shadow-2xl border border-white/20"
        />
      </div>
    </div>
  );
};

// --- Componente Raiz ---

const App: React.FC = () => {
  useLinkValidationAndScroll();

  const [sampleModalOpen, setSampleModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<{ src: string; alt: string }>({
    src: `${B}images/mapa-logistico.webp`,
    alt: "Ilustração ampliada da lógica por região do Roteiro Paris Essencial"
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenSample = (src: string, alt: string) => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      try {
        window.gtag('event', 'view_sample', { sample: 'essencial-arco' });
      } catch (e) {
        console.error('gtag view_sample error:', e);
      }
    }
    setModalImage({ src, alt });
    setSampleModalOpen(true);
  };

  const handleCloseSample = () => {
    setSampleModalOpen(false);
    const trigger = document.getElementById('btn-sample-trigger');
    trigger?.focus();
  };

  return (
    <div className="min-h-screen bg-white selection:bg-[#C19450] selection:text-[#22274F] font-sans">
      <Header />
      <main>
        <Hero />
        <AuthorityBar />
        <SampleDaySection onOpenSample={handleOpenSample} />
        <WhyNotSoloSection onOpenSample={handleOpenSample} />
        <TargetAudienceSection />
        <InclusionsSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <AuthorSection />
      </main>
      
      {/* Elementos apenas do cliente */}
      {mounted && <StickyMobileCTA />}
      <Footer />

      {mounted && (
        <SampleModal 
          isOpen={sampleModalOpen} 
          onClose={handleCloseSample}
          imageSrc={modalImage.src}
          imageAlt={modalImage.alt}
        />
      )}
    </div>
  );
};

const Pagina: React.FC = () => (
  <OfertaProvider guiaId="guia-paris-essencial">
    <App />
  </OfertaProvider>
);

export default Pagina;
