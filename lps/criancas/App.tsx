import React, { useState, useEffect, useRef } from 'react';
import { 
  Check, 
  ShieldCheck, 
  ArrowRight, 
  ChevronDown,
  ChevronUp,
  Sparkles,
  Ticket,
  HeartPulse,
  Clock,
  Instagram,
  Mail,
  Baby,
  Gift,
  X,
  Maximize2
} from 'lucide-react';
import { OfertaProvider, useOferta, formatBR } from '../shared/oferta';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

// --- Constantes Principais do Produto ---

const PRIVACY_URL = "https://www.melrolan.com.br/privacidade/";
const GUARANTEE_TEXT = "Garantia incondicional de 7 dias. Você tem 7 dias completos para avaliar o guia. Se por qualquer motivo não fizer sentido para a sua família, basta solicitar o reembolso em até 7 dias da compra, sem perguntas e sem outras condições.";

const formatPriceBR = formatBR;

// Endereço-base da página (muda com o endereço de publicação)
const B = import.meta.env.BASE_URL;

interface GuideReview {
  nome: string;
  texto: string;
  cidade?: string;
  idadeFilhos?: string;
}

// Campo pronto para avaliações futuras do próprio guia
const GUIDE_REVIEWS: GuideReview[] = [];

interface Testimonial {
  nome: string;
  texto: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    nome: "Roberta",
    texto: "Mel tem uma sensibilidade impressionante! Transborda amor na sua escuta e entrega mais do que podemos imaginar."
  },
  {
    nome: "Fernanda",
    texto: "Mel foi bastante atenta e cuidadosa, buscando atender as particularidades do nosso grupo. Conhecer a França de mãos dadas com Mel, tornou a experiência inesquecível."
  },
  {
    nome: "Renata",
    texto: "Além de competente, ela é uma simpatia de pessoa, educada, honesta e super acessível. O trabalho da Mel foi primordial para o sucesso da nossa tão sonhada e planejada viagem!"
  }
];

// Amostras do PDF para a seção "Veja páginas reais do guia"
interface SampleImage {
  id: string;
  src: string;
  srcSet?: string;
  alt: string;
  title: string;
}

const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: "amostra-3",
    src: `${B}images/amostra-3.webp`,
    srcSet: `${B}images/amostra-3-400.webp 400w, ${B}images/amostra-3.webp 800w`,
    alt: "Página interna do guia detalhando o Musée en Herbe em Paris, com indicação de idade, tempo médio de visita, regras para dias de chuva e reserva obrigatória",
    title: "Atrações e museus com indicação de idade"
  },
  {
    id: "amostra-2",
    src: `${B}images/amostra-2.webp`,
    srcSet: `${B}images/amostra-2-400.webp 400w, ${B}images/amostra-2.webp 800w`,
    alt: "Página interna do guia com curadoria de lojas de artigos infantis, livrarias e brinquedos artesanais em Paris",
    title: "Lojas infantis e brinquedos artesanais"
  },
  {
    id: "amostra-1",
    src: `${B}images/amostra-1.webp`,
    srcSet: `${B}images/amostra-1-400.webp 400w, ${B}images/amostra-1.webp 800w`,
    alt: "Página interna do guia sobre onde provar macarons com crianças, destacando a pâtisserie Carette no Trocadéro e na Place des Vosges",
    title: "Experiências gastronômicas para toda a família"
  }
];

// --- Componentes Reutilizáveis ---

interface ChicCTAProps {
  text: string;
  subtext?: string;
  className?: string;
  slot: string;
  id?: string;
}

const ChicCTA: React.FC<ChicCTAProps> = ({ text, subtext, className = "", slot, id }) => {
  const oferta = useOferta();
  // O analytics.js do site mede o clique (begin_checkout) e leva gclid, gbraid, wbraid e UTMs para a loja.
  return (
    <a
      id={id}
      href={oferta.link_compra}
      target="_blank"
      rel="noopener noreferrer"
      data-checkout={JSON.stringify(oferta.item)}
      data-slot={slot}
      className={`inline-flex flex-col items-center justify-center text-center bg-[#C19450] hover:bg-[#B38541] text-[#22274F] font-sans font-semibold tracking-wide min-h-[52px] px-8 py-3 rounded transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#22274F] focus:ring-offset-2 select-none ${className}`}
    >
      <span className="flex items-center justify-center gap-2 uppercase text-sm md:text-base font-semibold">
        {text} <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
      </span>
      {subtext && (
        <span className="text-xs font-normal opacity-90 mt-0.5 tracking-normal">
          {subtext}
        </span>
      )}
    </a>
  );
};

const SectionHeader: React.FC<{
  title: string;
  subtitle?: string;
  light?: boolean;
}> = ({ title, subtitle, light = false }) => (
  <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
    {subtitle && (
      <span className={`block text-xs font-sans font-semibold uppercase tracking-[0.2em] mb-3 ${light ? 'text-[#A2CBED]' : 'text-[#C19450]'}`}>
        {subtitle}
      </span>
    )}
    <h2 className={`text-2xl sm:text-3xl md:text-4xl font-serif font-bold leading-tight ${light ? 'text-[#F7F4EA]' : 'text-[#22274F]'}`}>
      {title}
    </h2>
    <div className="w-16 h-0.5 mx-auto mt-5 bg-[#C19450]" aria-hidden="true" />
  </div>
);

// --- Seção: Cabeçalho Fixo Mínimo ---

const Header: React.FC = () => {
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F7F4EA]/95 backdrop-blur-md border-b border-[#22274F]/10 py-3 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        <div className="flex items-center">
          {!logoError ? (
            <img 
              src={`${B}images/logo.webp`} 
              alt="Mel Rolan Travel Designer" 
              className="h-8 sm:h-9 md:h-11 w-auto"
              onError={() => setLogoError(true)}
              width="140"
              height="60"
              loading="eager"
            />
          ) : (
            <span className="text-lg md:text-xl font-serif font-bold text-[#22274F] tracking-tight">
              Mel Rolan
            </span>
          )}
        </div>
        
        <ChicCTA 
          id="header-cta"
          text="Quero o guia" 
          slot="header"
          className="px-5 md:px-7 !min-h-[44px] text-xs md:text-sm"
        />
      </div>
    </header>
  );
};

// --- Bloco 1: Hero ---

const Hero: React.FC = () => {
  const oferta = useOferta();
  const [imgError, setImgError] = useState(false);

  return (
    <section className="pt-20 sm:pt-24 md:pt-36 pb-10 sm:pb-14 md:pb-24 bg-[#F7F4EA] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-12 gap-6 md:gap-12 items-center">
          {/* Conteúdo de Texto e CTA: no celular fica acima da capa */}
          <div className="md:col-span-7 text-center md:text-left flex flex-col items-center md:items-start">
            <div className="inline-block border border-[#22274F]/15 bg-white/70 px-3.5 py-1 rounded-full mb-3 sm:mb-5">
              <span className="text-[#22274F] text-[11px] sm:text-xs font-sans font-semibold uppercase tracking-wider">
                Curadoria por Mel Rolan
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#22274F] leading-[1.15] mb-3 sm:mb-5">
              O que fazer em Paris com crianças: seleção testada e organizada por idade.
            </h1>

            <p className="text-sm sm:text-lg md:text-xl text-[#22274F]/90 font-sans font-medium leading-snug sm:leading-relaxed mb-3 sm:mb-4 max-w-2xl mx-auto md:mx-0">
              Atrações, parquinhos, metrô e restaurantes por idade, de 0 a 12 anos, e bônus de inverno 2026/2027.
            </p>

            {/* Aviso de escopo: confirma, logo no topo, o que o guia é e o que não é */}
            <p className="text-xs sm:text-base text-[#22274F] font-sans leading-relaxed mb-4 sm:mb-6 max-w-xl mx-auto md:mx-0 border-l-4 border-[#C19450] bg-white/70 px-3 py-2 rounded-r text-left">
              É uma seleção para você montar os dias da sua família, não um roteiro dia a dia.
            </p>

            <div className="flex flex-col items-center md:items-start w-full max-w-md mx-auto md:mx-0">
              <ChicCTA 
                id="hero-cta"
                text={`Quero meu guia por R$ ${oferta.preco}`}
                slot="hero"
                className="w-full text-sm sm:text-base min-h-[52px] py-3.5"
              />
              <p className="text-[11px] sm:text-xs text-[#22274F]/80 font-sans text-center md:text-left mt-2 w-full">
                PDF com entrega imediata por e-mail. Ou {oferta.parcelas}x de R$ {formatPriceBR(oferta.parcela ?? 0)} sem juros no cartão. Também aceitamos Pix.
              </p>
              <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-[#22274F]/85 font-sans mt-2">
                <ShieldCheck className="w-4 h-4 text-[#C19450] shrink-0" aria-hidden="true" />
                <span>Garantia de 7 dias</span>
              </div>
              <p className="text-xs sm:text-sm text-[#22274F] font-sans font-medium leading-snug mt-4 pt-3 border-t border-[#22274F]/10 w-full text-center md:text-left">
                Mel Rolan, Travel Designer especialista em viajantes brasileiros, já atendeu mais de 650 clientes.
              </p>
            </div>
          </div>

          {/* Imagem da Capa: abaixo do botão em telas pequenas, coluna lateral no desktop */}
          <div className="md:col-span-5 flex justify-center mt-4 md:mt-0">
            <div className="w-full max-w-[220px] sm:max-w-xs md:max-w-md">
              {!imgError ? (
                <div className="bg-white p-2.5 sm:p-3 rounded-lg shadow-xl border border-[#22274F]/10 transform md:rotate-1 hover:rotate-0 transition-transform duration-300">
                  <img 
                    src={`${B}images/hero-criancas.webp`} 
                    srcSet={`${B}images/hero-criancas-480.webp 480w, ${B}images/hero-criancas.webp 900w`}
                    sizes="(max-width: 640px) 80vw, 420px"
                    alt="Capa do Guia Paris com Crianças da Mel Rolan com três crianças admirando a Torre Eiffel" 
                    className="w-full h-auto rounded aspect-[900/1272] object-cover"
                    width={900}
                    height={1272}
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                    onError={() => setImgError(true)}
                  />
                </div>
              ) : (
                <div className="bg-white rounded-lg p-6 sm:p-10 shadow-xl border border-[#C19450]/30 text-center flex flex-col justify-between min-h-[340px]">
                  <div className="border-b border-[#22274F]/10 pb-4">
                    <span className="text-xs uppercase tracking-[0.25em] font-sans font-semibold text-[#C19450] block mb-2">
                      Guia Digital em PDF
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[#22274F] leading-tight">
                      Paris com Crianças
                    </h2>
                    <p className="font-serif italic text-xs sm:text-sm text-[#22274F]/80 mt-1">
                      Inspirações pra sua viagem em família
                    </p>
                  </div>
                  
                  <div className="py-4 space-y-1.5">
                    <p className="text-sm font-sans text-[#22274F]/90 font-medium">
                      158 páginas de curadoria real
                    </p>
                    <p className="text-xs font-sans text-[#22274F]/70">
                      Acesso imediato • Atualizado 2026
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#22274F]/10">
                    <span className="text-xs font-serif font-bold text-[#22274F] uppercase tracking-wider block">
                      Mel Rolan
                    </span>
                    <span className="text-[11px] font-sans text-[#22274F]/70">
                      Travel Designer
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Para quem é este guia ---

const ForWhoSection: React.FC = () => {
  const perfis = [
    {
      titulo: "Primeira viagem a Paris com crianças",
      texto: "Famílias que estão planejando a primeira viagem com os filhos e querem uma lista curada de atrações, parquinhos e restaurantes por idade para começar."
    },
    {
      titulo: "Quem já foi e quer novas ideias",
      texto: "Famílias que já conhecem Paris e procuram novas ideias de atrações, parquinhos e restaurantes, separadas por faixa etária."
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-white border-b border-[#22274F]/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <SectionHeader 
          title="Para quem é este guia" 
          subtitle="Para Quem É"
        />
        <div className="grid sm:grid-cols-2 gap-6 text-left">
          {perfis.map((perfil, index) => (
            <div key={index} className="bg-[#F7F4EA] p-6 sm:p-7 rounded-lg border border-[#22274F]/5 shadow-sm">
              <h3 className="font-serif font-bold text-lg text-[#22274F] mb-2">{perfil.titulo}</h3>
              <p className="text-base text-[#22274F]/85 font-sans leading-relaxed">{perfil.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Bloco 2: O Problema ---

const ProblemSection: React.FC = () => {
  const cards = [
    {
      icon: <Baby className="w-7 h-7 text-[#C19450]" aria-hidden="true" />,
      text: "O metrô com carrinho e crianças pequenas cobra planejamento."
    },
    {
      icon: <Ticket className="w-7 h-7 text-[#C19450]" aria-hidden="true" />,
      text: "Muitos ingressos gratuitos para crianças exigem reserva."
    },
    {
      icon: <HeartPulse className="w-7 h-7 text-[#C19450]" aria-hidden="true" />,
      text: "Um imprevisto de saúde longe de casa assusta mais com filhos."
    },
    {
      icon: <Clock className="w-7 h-7 text-[#C19450]" aria-hidden="true" />,
      text: "Cada idade pede um ritmo e uma atração diferente."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white border-y border-[#22274F]/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <SectionHeader 
          title="Viajar para Paris com filhos não é como viajar sem eles." 
          subtitle="O Ponto de Partida"
        />

        <div className="grid sm:grid-cols-2 gap-6 md:gap-8 mb-12 text-left">
          {cards.map((card, index) => (
            <div 
              key={index} 
              className="bg-[#F7F4EA] p-6 sm:p-7 rounded-lg border border-[#22274F]/5 flex items-start gap-4 shadow-sm"
            >
              <div className="p-3 bg-white rounded-md shrink-0 shadow-xs border border-[#C19450]/20">
                {card.icon}
              </div>
              <p className="text-base text-[#22274F] font-sans font-medium leading-relaxed self-center">
                {card.text}
              </p>
            </div>
          ))}
        </div>

        <p className="text-xl md:text-2xl font-serif italic text-[#22274F] font-bold">
          Este guia foi feito para isso.
        </p>
      </div>
    </section>
  );
};

// --- Bloco 3: O que você vai encontrar (8 itens em grade) ---

const InclusionsSection: React.FC = () => {
  const items = [
    {
      title: "Preparação antes do embarque",
      desc: "Filmes, livros e atividades para preparar as crianças antes de embarcar, para que cheguem curiosas, e não apreensivas."
    },
    {
      title: "Sem surpresas no transporte público",
      desc: "Como se locomover em Paris com carrinho, bebê e crianças pequenas, sem surpresas no metrô."
    },
    {
      title: "Ingressos e reservas",
      desc: "O que é gratuito para crianças nos museus e como reservar corretamente."
    },
    {
      title: "Indicação por faixa etária",
      desc: "Museus, atrações, parques e experiências com indicação de faixa etária."
    },
    {
      title: "Parquinhos e praças",
      desc: "Os melhores parquinhos de Paris, incluindo os escondidos que só os moradores conhecem."
    },
    {
      title: "Gastronomia familiar",
      desc: "Macarons, croissants e muito mais: o que vale provar com as crianças."
    },
    {
      title: "Emergências e saúde",
      desc: "Como lidar com emergências médicas: farmacinha, hospitais pediátricos e seguro viagem."
    },
    {
      title: "Transporte público 2026",
      desc: "Tudo sobre transporte público com crianças: bilhetes, valores de 2026, aplicativos e como economizar."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-[#F7F4EA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeader 
          title="O que você vai encontrar no guia" 
          subtitle="Conteúdo Completo"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {items.map((item, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg border border-[#22274F]/10 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#C19450]/15 text-[#C19450] text-xs font-sans font-bold mb-4">
                  0{index + 1}
                </span>
                <h3 className="text-base font-serif font-bold text-[#22274F] mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-[#22274F]/80 font-sans leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <ChicCTA 
            id="inclusoes-cta"
            text="Quero meu guia" 
            slot="inclusoes"
            className="w-full md:w-auto px-10 text-base"
          />
        </div>
      </div>
    </section>
  );
};

// --- Bloco 4: Para Cada Idade ---

const AgeGroupsSection: React.FC = () => {
  const ageCards = [
    {
      faixa: "0 a 2 anos",
      titulo: "O passeio que cabe na soneca",
      texto: "Como se locomover com carrinho e bebê, onde trocar, amamentar e descansar, e quais programas funcionam com um ritmo imprevisível."
    },
    {
      faixa: "3 a 5 anos",
      titulo: "Curiosidade sem cansaço",
      texto: "Atrações interativas e parquinhos escolhidos para essa idade, como o Musée en Herbe, um museu pensado para crianças a partir de 3 anos."
    },
    {
      faixa: "6 a 9 anos",
      titulo: "Paris vira uma aventura",
      texto: "Programas que prendem a atenção de quem já tem opinião: museus com atividades, passeios e lugares que as crianças contam para os amigos."
    },
    {
      faixa: "10 a 12 anos",
      titulo: "Programas que respeitam a idade deles",
      texto: "Indicações para pré-adolescentes que já querem escolher o que fazer, com atrações para dias de chuva e para dias de sol."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white border-b border-[#22274F]/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <span className="block text-xs font-sans font-semibold uppercase tracking-[0.2em] mb-3 text-[#C19450]">
            Faixa Etária
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold leading-tight text-[#22274F]">
            Cada idade, uma curadoria de atrações.
          </h2>
          <div className="w-16 h-0.5 mx-auto mt-4 mb-5 bg-[#C19450]" aria-hidden="true" />
          <p className="text-sm sm:text-base font-sans text-[#22274F]/85 leading-relaxed">
            Cada atração do guia traz a idade recomendada, o tempo médio de visita, se serve para dia de chuva, se exige reserva e em que idioma é a visita.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ageCards.map((card, index) => (
            <div 
              key={index}
              className="bg-[#F7F4EA] p-6 rounded-lg border border-[#22274F]/10 flex flex-col justify-between shadow-xs hover:shadow-sm transition-shadow text-left"
            >
              <div>
                <span className="inline-block bg-[#C19450] text-[#22274F] text-xs font-sans font-bold uppercase tracking-wider px-3 py-1 rounded mb-4">
                  {card.faixa}
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#22274F] mb-2.5 leading-snug">
                  {card.titulo}
                </h3>
                <p className="text-sm text-[#22274F]/85 font-sans leading-relaxed">
                  {card.texto}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Bloco 5: Veja páginas reais do guia (com modal de ampliação) ---

const SampleImagesSection: React.FC = () => {
  const [activeSample, setActiveSample] = useState<SampleImage | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openModal = (sample: SampleImage, triggerEl: HTMLElement) => {
    triggerRef.current = triggerEl;
    setActiveSample(sample);

    // Disparo protegido do evento gtag
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      try {
        window.gtag('event', 'view_sample', { sample: sample.id });
      } catch {
        // tracking resiliente
      }
    }
  };

  const closeModal = () => {
    setActiveSample(null);
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  };

  // Efeito para foco, tecla Escape e bloqueio de rolagem no modal
  useEffect(() => {
    if (!activeSample) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Foco no botão de fechar
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'Tab') {
        // Prender foco no modal (único elemento focável no momento é o close button)
        if (closeButtonRef.current && document.activeElement !== closeButtonRef.current) {
          e.preventDefault();
          closeButtonRef.current.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSample]);

  if (!SAMPLE_IMAGES || SAMPLE_IMAGES.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-[#F7F4EA] border-b border-[#22274F]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeader 
          title="Veja por dentro: páginas do guia" 
          subtitle="Três páginas reais do guia. Cada indicação traz endereço, metrô, horário, idade recomendada e a opinião da Mel."
        />

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {SAMPLE_IMAGES.map((sample, index) => (
            <div 
              key={index} 
              className="bg-white p-3.5 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-[#22274F]/10 flex flex-col"
            >
              <button
                type="button"
                onClick={(e) => openModal(sample, e.currentTarget)}
                aria-label={`Ampliar página: ${sample.title}`}
                className="group relative bg-[#F7F4EA] rounded overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-[#C19450] focus:ring-offset-2"
              >
                <img 
                  src={sample.src} 
                  srcSet={sample.srcSet}
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 360px"
                  alt={sample.alt} 
                  className="w-full h-auto rounded aspect-[800/1131] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  width={800}
                  height={1131}
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-[#22274F]/0 group-hover:bg-[#22274F]/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-1.5 bg-[#22274F] text-[#F7F4EA] text-xs font-sans font-medium px-3 py-1.5 rounded shadow-md">
                    <Maximize2 className="w-3.5 h-3.5 text-[#C19450]" aria-hidden="true" /> Ampliar
                  </span>
                </div>
              </button>

              <div className="mt-3 flex flex-col items-center">
                <p className="text-xs sm:text-sm font-sans font-medium text-[#22274F] text-center leading-snug">
                  {sample.title}
                </p>
                <button
                  type="button"
                  onClick={(e) => openModal(sample, e.currentTarget)}
                  className="mt-1.5 inline-flex items-center gap-1 text-xs font-sans font-medium text-[#C19450] hover:text-[#B38541] focus:outline-none focus:underline"
                >
                  <Maximize2 className="w-3 h-3" aria-hidden="true" />
                  <span>Toque para ampliar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Acessível de Ampliação da Amostra */}
      {activeSample && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-label={`Página ampliada: ${activeSample.title}`}
          onClick={closeModal}
          className="fixed inset-0 z-50 bg-[#22274F]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-lg p-2 sm:p-3 shadow-2xl max-w-2xl w-full flex flex-col items-center"
          >
            <div className="w-full flex items-center justify-between pb-2 px-2 border-b border-[#22274F]/10 mb-2">
              <span className="font-serif font-bold text-xs sm:text-sm text-[#22274F] truncate pr-2">
                {activeSample.title}
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeModal}
                aria-label="Fechar ampliação"
                className="p-1.5 rounded-full text-[#22274F] hover:bg-[#F7F4EA] focus:outline-none focus:ring-2 focus:ring-[#C19450] transition-colors shrink-0"
              >
                <X className="w-5 h-5 text-[#22274F]" aria-hidden="true" />
              </button>
            </div>

            <div className="w-full flex justify-center overflow-auto max-h-[90vh]">
              <img 
                src={activeSample.src} 
                alt={activeSample.alt} 
                className="max-h-[90vh] w-auto max-w-full object-contain rounded"
                loading="eager"
                decoding="async"
              />
            </div>

            <div className="w-full text-center pt-2 border-t border-[#22274F]/10 mt-2">
              <p className="text-[11px] sm:text-xs text-[#22274F]/75 font-sans">
                Pressione Esc ou clique fora para fechar
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// --- Bloco 6: Quem Faz ---

const AuthorSection: React.FC = () => {
  const [authorImgError, setAuthorImgError] = useState(false);

  return (
    <section className="py-16 md:py-24 bg-[#22274F] text-[#F7F4EA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-12 gap-10 md:gap-12 items-center">
          <div className="md:col-span-5 flex justify-center">
            <div className="w-full max-w-xs md:max-w-sm p-2 bg-[#22274F] border border-[#C19450]/40 rounded-lg shadow-lg">
              {!authorImgError ? (
                <img 
                  src={`${B}images/mel-rolan.webp`} 
                  alt="Mel Rolan em Paris" 
                  className="w-full h-auto rounded"
                  width="400"
                  height="267"
                  loading="lazy"
                  decoding="async"
                  onError={() => setAuthorImgError(true)}
                />
              ) : (
                <div className="bg-[#22274F] p-8 text-center border border-[#C19450]/20 rounded">
                  <span className="font-serif text-2xl font-bold text-[#C19450]">Mel Rolan</span>
                  <p className="text-xs uppercase tracking-widest text-[#F7F4EA]/70 mt-1">Travel Designer</p>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-7">
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-[#C19450] block mb-3">
              Sobre a Autora
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#F7F4EA] leading-tight mb-6">
              Feito por uma especialista em viajantes brasileiros.
            </h2>
            
            <p className="text-base sm:text-lg text-[#F7F4EA]/90 font-sans leading-relaxed mb-6">
              Sou a Mel, Travel Designer especialista em viajantes brasileiros. Já acompanhei mais de 650 clientes em roteiros personalizados, consultorias e passeios. Sou mãe e moro em Paris há mais de 5 anos. Este guia é o material que eu faria para uma amiga querida que estivesse organizando a viagem da vida com os filhos.
            </p>

            <div className="inline-flex items-center gap-3 bg-white/5 border border-[#C19450]/30 px-5 py-3 rounded-md">
              <Sparkles className="w-5 h-5 text-[#C19450] shrink-0" aria-hidden="true" />
              <p className="text-xs sm:text-sm text-[#F7F4EA]/90 font-sans font-medium">
                Nota 9,97 de 10 nas pesquisas de satisfação dos serviços da Mel Rolan (mais de 110 respostas, 2022 a 2026).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Bloco 7: Depoimentos (Oculto se TESTIMONIALS estiver vazio) ---

const TestimonialsSection: React.FC = () => {
  const hasGuideReviews = GUIDE_REVIEWS && GUIDE_REVIEWS.length > 0;
  const hasServiceReviews = TESTIMONIALS && TESTIMONIALS.length > 0;

  if (!hasGuideReviews && !hasServiceReviews) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-[#F7F4EA] border-b border-[#22274F]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Bloco de Avaliações Futuras do Guia (aparece apenas quando GUIDE_REVIEWS tiver itens) */}
        {hasGuideReviews && (
          <div className="mb-16">
            <SectionHeader 
              title="O que dizem as leitoras do guia" 
              subtitle="Avaliações do Guia"
            />
            <div className="grid md:grid-cols-3 gap-8">
              {GUIDE_REVIEWS.map((review, idx) => (
                <div 
                  key={idx}
                  className="bg-white p-7 rounded-lg border border-[#22274F]/10 shadow-sm flex flex-col justify-between"
                >
                  <p className="font-serif italic text-base sm:text-lg text-[#22274F] leading-relaxed mb-6">
                    "{review.texto}"
                  </p>
                  <div className="pt-4 border-t border-[#22274F]/10">
                    <p className="font-sans font-bold text-[#22274F] text-sm">
                      {review.nome}
                    </p>
                    <p className="text-xs text-[#22274F]/70 font-sans">
                      {review.cidade ? `${review.cidade} • ` : ''}Leitora do Guia
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Depoimentos dos Serviços da Mel */}
        {hasServiceReviews && (
          <div>
            <SectionHeader 
              title="A expertise que já encantou centenas de viajantes" 
              subtitle="Depoimentos Reais"
            />

            <p className="text-xs sm:text-sm font-sans text-[#22274F]/75 text-center max-w-2xl mx-auto mb-8">
              Depoimentos de clientes dos roteiros personalizados, consultorias e tours da Mel. Mais de 110 respostas nas pesquisas de satisfação, nota 9,97 de 10 (2022 a 2026).
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t, idx) => (
                <div 
                  key={idx}
                  className="bg-white p-7 rounded-lg border border-[#22274F]/10 shadow-sm flex flex-col justify-between"
                >
                  <p className="font-serif italic text-base sm:text-lg text-[#22274F] leading-relaxed mb-6">
                    "{t.texto}"
                  </p>
                  <div className="pt-4 border-t border-[#22274F]/10">
                    <p className="font-sans font-bold text-[#22274F] text-sm">
                      {t.nome}
                    </p>
                    <p className="text-xs text-[#22274F]/70 font-sans">
                      Cliente dos serviços da Mel Rolan
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// --- Cartão de bônus (os dois bônus usam o mesmo cartão: mesmo tamanho e alinhamento) ---

interface BonusCardProps {
  img: string;
  alt: string;
  badge: string;
  title: string;
  text: string;
  footer: string;
  icon: React.ReactNode;
}

const BonusCard: React.FC<BonusCardProps> = ({ img, alt, badge, title, text, footer, icon }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#22274F]/10 shadow-xs flex flex-col items-center gap-4 h-full">
      <div className="w-[180px] h-[180px] shrink-0">
        {!imgError ? (
          <img
            src={img}
            alt={alt}
            width="600"
            height="600"
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover rounded-xl shadow-xs"
          />
        ) : (
          <div className="w-full h-full rounded-xl bg-[#F7F4EA] border border-[#C19450]/30" aria-hidden="true" />
        )}
      </div>
      <div className="flex-1 flex flex-col w-full min-w-0">
        <div className="flex items-center justify-between gap-2 mb-3 min-h-[28px]">
          <span className="inline-block bg-[#C19450] text-[#22274F] text-xs font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded whitespace-nowrap">
            {badge}
          </span>
          {icon}
        </div>
        <h4 className="font-serif text-base sm:text-lg font-bold text-[#22274F] mb-2 leading-snug min-h-[48px] sm:min-h-[56px] flex items-start">
          {title}
        </h4>
        <p className="text-xs sm:text-sm text-[#22274F]/85 font-sans leading-relaxed mb-4">
          {text}
        </p>
        <div className="mt-auto pt-3 border-t border-[#22274F]/10">
          <p className="text-xs font-sans font-medium text-[#22274F]">{footer}</p>
        </div>
      </div>
    </div>
  );
};

// --- Bloco 8: Oferta ---

const OfferSection: React.FC = () => {
  const oferta = useOferta();

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-[#F7F4EA] border border-[#22274F]/10 rounded-xl p-6 sm:p-10 md:p-12 shadow-lg text-center">
          <span className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-[#C19450] block mb-2">
            Acesso Imediato
          </span>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#22274F] leading-tight mb-8">
            Tudo o que você precisa para levar seus filhos a Paris.
          </h2>

          {/* Lista de Itens do Guia */}
          <div className="text-left space-y-3.5 mb-8 max-w-xl mx-auto bg-white/70 p-5 sm:p-6 rounded-lg border border-[#22274F]/10">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-[#C19450] shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm sm:text-base text-[#22274F] font-sans">
                <strong>Guia completo em PDF</strong> (158 páginas de curadoria real)
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-[#C19450] shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm sm:text-base text-[#22274F] font-sans">
                <strong>Acesso imediato por e-mail</strong> logo após a confirmação do pagamento
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-[#C19450] shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm sm:text-base text-[#22274F] font-sans">
                <strong>10% de desconto em qualquer serviço da Mel Rolan</strong> (roteiro sob medida, consultoria ou tour guiado presencial em Paris) para quem compra o guia
              </p>
            </div>
          </div>

          {/* Bônus em destaque no bloco Oferta */}
          <div className="mb-8 max-w-2xl mx-auto">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#22274F] text-center mb-5">
              Você leva dois bônus junto com o guia
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 auto-rows-fr gap-4 text-left items-stretch">
              <BonusCard
                img={`${B}images/bonus-inverno.webp`}
                alt="Capa do Bônus de Inverno 2026/2027"
                badge="Bônus 1"
                title="Bônus de Inverno 2026/2027"
                text="19 páginas para viajar com crianças entre novembro e fevereiro: mercados de Natal, patinação, espetáculos e refúgios para os dias frios. Endereço, metrô, idade recomendada e se precisa reservar em cada indicação."
                footer="Incluído na compra do guia, sem custo adicional."
                icon={<Sparkles className="w-5 h-5 text-[#C19450] shrink-0" aria-hidden="true" />}
              />
              <BonusCard
                img={`${B}images/bonus-checklist.webp`}
                alt="Capa do Bônus: Checklist de Viagem com Crianças para Paris"
                badge="Bônus 2"
                title="Checklist de Viagem com Crianças para Paris"
                text="Lista completa organizada por tema e por prazo, do passaporte ao primeiro dia em Paris, para você não esquecer nada."
                footer="Não é vendido separadamente: só recebe quem compra o guia."
                icon={<Gift className="w-5 h-5 text-[#C19450] shrink-0" aria-hidden="true" />}
              />
            </div>

            <p className="text-xs sm:text-sm text-[#22274F]/85 font-sans text-center mt-5 leading-relaxed">
              Você recebe o link de download dos dois bônus no e-mail de confirmação da compra, junto com o guia.
            </p>
          </div>

          {/* Linha de Resultado e Bloco de Preço */}
          <div className="mb-8 pb-8 border-b border-[#22274F]/10 max-w-xl mx-auto">
            <p className="font-serif text-lg sm:text-xl md:text-2xl text-[#22274F] font-bold text-center leading-snug mb-2">
              Chegue a Paris com a curadoria de quem vive a cidade com crianças, sem improviso no metrô, no museu ou no restaurante.
            </p>
            <p className="font-sans text-xs sm:text-sm text-[#22274F]/75 text-center mb-6">
              Um guia de 158 páginas feito para famílias brasileiras, por quem vive em Paris.
            </p>

            {oferta.rotulo && (
              <span className="inline-block text-[#86632B] font-sans font-semibold text-xs tracking-wider uppercase mb-1">
                {oferta.rotulo}
              </span>
            )}

            {oferta.preco_de && (
              <span className="text-[#22274F]/50 line-through font-serif text-xl block mb-1">
                De R$ {oferta.preco_de}
              </span>
            )}
            <div className="flex items-baseline justify-center gap-1">
              {oferta.preco_de && <span className="text-xs font-sans font-semibold uppercase text-[#22274F]/70">Por</span>}
              <span className="text-5xl sm:text-6xl font-serif font-bold text-[#22274F]">
                R$ {oferta.preco}
              </span>
            </div>
            <p className="text-sm text-[#22274F]/80 font-sans font-medium mt-2">
              ou {oferta.parcelas}x de R$ {formatPriceBR(oferta.parcela ?? 0)} sem juros
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-3">
            <ChicCTA 
              id="preco-cta"
              text={`Quero meu guia por R$ ${oferta.preco}`}
              slot="preco"
              className="w-full text-base py-4"
            />
                        <div className="flex items-center justify-center gap-1.5 text-xs text-[#22274F]/85 font-sans pt-1">
              <ShieldCheck className="w-4 h-4 text-[#C19450] shrink-0" aria-hidden="true" />
              <span>Garantia incondicional de 7 dias. Se não fizer sentido para a sua família, devolvemos o valor.</span>
            </div>
            <p className="text-xs text-[#22274F]/75 font-sans">
              Pagamento seguro pela Wix. Cartão ou Pix.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Bloco 9: Garantia (Oculto se GUARANTEE_TEXT estiver vazio) ---

const GuaranteeSection: React.FC = () => {
  if (!GUARANTEE_TEXT) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-[#F7F4EA] border-y border-[#22274F]/10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex p-3 bg-white rounded-full border border-[#C19450]/30 shadow-xs mb-4">
          <ShieldCheck className="w-8 h-8 text-[#C19450]" aria-hidden="true" />
        </div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#22274F] mb-3">
          Garantia incondicional de 7 dias
        </h2>
        <p className="text-sm sm:text-base text-[#22274F]/85 font-sans leading-relaxed max-w-2xl mx-auto">
          {GUARANTEE_TEXT}
        </p>
      </div>
    </section>
  );
};

// --- Bloco 10: Perguntas Frequentes (Acordeão Acessível) ---

interface FAQItem {
  question: string;
  answer: string;
}

const FAQSection: React.FC = () => {
  const oferta = useOferta();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "É um roteiro?",
      answer: "Não. É uma lista curada de atrações, parquinhos, restaurantes e dicas de metrô, organizada por idade, para você montar os dias da sua família do seu jeito. Se preferir um roteiro sob medida, a Mel também faz, e leitores do guia têm 10% de desconto."
    },
    {
      question: "Em que formato recebo?",
      answer: "Em PDF, por e-mail, logo após a confirmação do pagamento, com o link para baixar. Se não encontrar o e-mail, olhe a caixa de spam ou escreva para contato@melrolan.com.br."
    },
    {
      question: "O que é o bônus de inverno?",
      answer: "É um PDF de 19 páginas com o que fazer em Paris com crianças entre novembro e fevereiro."
    },
    {
      question: "Como recebo os bônus?",
      answer: "Você recebe o link de download do Bônus de Inverno e do Checklist no e-mail de confirmação da compra, junto com o guia. Se o e-mail não chegar, olhe a caixa de spam ou escreva para contato@melrolan.com.br."
    },
    {
      question: "Serve para a idade dos meus filhos?",
      answer: "Serve para famílias com crianças de 0 a 12 anos. O guia traz ideias para as faixas de 0 a 2, 3 a 5, 6 a 9 e 10 a 12 anos, e cada atração indica a idade recomendada. Para quem vai com bebê, trata também do metrô com carrinho."
    },
    {
      question: "Posso pagar no Pix?",
      answer: `Sim. O pagamento é feito na loja da Mel Rolan, com cartão ou Pix, e você pode parcelar em até ${oferta.parcelas}x sem juros no cartão.`
    },
    {
      question: "O guia traz valores atualizados?",
      answer: "Sim. O guia foi revisado para 2026, incluindo valores de transporte público e ingressos. Quando algum preço muda, a Mel atualiza o material."
    }
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <SectionHeader 
          title="Perguntas frequentes" 
          subtitle="Tire Suas Dúvidas"
        />

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const buttonId = `faq-btn-${index}`;
            const panelId = `faq-panel-${index}`;

            return (
              <div 
                key={index}
                className="border border-[#22274F]/15 rounded-lg overflow-hidden bg-[#F7F4EA]/50"
              >
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between p-5 text-left font-serif font-bold text-base sm:text-lg text-[#22274F] hover:bg-[#F7F4EA] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C19450]"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#C19450] shrink-0 ml-4" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#22274F]/60 shrink-0 ml-4" aria-hidden="true" />
                  )}
                </button>

                {isOpen && (
                  <div 
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="p-5 pt-0 text-sm sm:text-base text-[#22274F]/85 font-sans leading-relaxed border-t border-[#22274F]/5 bg-white"
                  >
                    {faq.answer}
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

// --- Bloco 11: Chamada Final ---

const FinalCTASection: React.FC = () => {
  const oferta = useOferta();
  const [checklistErr, setChecklistErr] = useState(false);
  const [invernoErr, setInvernoErr] = useState(false);
  const bonusSummaryShort = `Guia + 2 bônus por R$ ${oferta.preco}`;

  return (
    <section className="py-16 md:py-20 bg-[#F7F4EA] border-t border-[#22274F]/10 text-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#22274F] mb-3 leading-tight">
          Sua viagem em família merece um plano.
        </h2>
        <div className="flex items-center justify-center gap-3.5 mb-6">
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {!invernoErr && (
              <img 
                src={`${B}images/bonus-inverno.webp`} 
                alt="Capa do Bônus de Inverno 2026/2027" 
                width="56" 
                height="56" 
                loading="lazy" 
                decoding="async" 
                onError={() => setInvernoErr(true)}
                className="w-14 h-14 object-cover rounded-lg shadow-xs"
              />
            )}
            {!checklistErr && (
              <img 
                src={`${B}images/bonus-checklist.webp`} 
                alt="Capa do Bônus: Checklist de Viagem com Crianças para Paris"
                width="56" 
                height="56" 
                loading="lazy" 
                decoding="async" 
                onError={() => setChecklistErr(true)}
                className="w-14 h-14 object-cover rounded-lg shadow-xs"
              />
            )}
          </div>
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            {oferta.rotulo && (
              <span className="text-[#86632B] font-sans font-semibold text-xs tracking-wider uppercase mb-0.5">
                {oferta.rotulo}
              </span>
            )}
            <p className="text-sm sm:text-base font-sans text-[#22274F]/85 font-medium">
              {bonusSummaryShort}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2.5">
          <ChicCTA 
            id="final-cta"
            text={`Quero meu guia por R$ ${oferta.preco}`}
            slot="final"
            className="w-full sm:w-auto px-10 text-base py-4"
          />
                    <div className="flex items-center justify-center gap-1.5 text-xs text-[#22274F]/85 font-sans">
            <ShieldCheck className="w-4 h-4 text-[#C19450] shrink-0" aria-hidden="true" />
            <span>Garantia de 7 dias</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Botão Fixo no Celular (Sticky Mobile CTA) ---

const StickyMobileCTA: React.FC = () => {
  const oferta = useOferta();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <aside 
      aria-label="Barra fixa de compra"
      className={`fixed bottom-0 left-0 right-0 z-40 p-3 bg-[#F7F4EA]/95 backdrop-blur-md border-t border-[#22274F]/15 md:hidden shadow-lg transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full pointer-events-none"
      }`}
    >
      <ChicCTA 
        id="sticky-mobile-cta"
        text={`Quero meu guia - R$ ${oferta.preco}`}
        subtext="Guia + 2 bônus inclusos"
        slot="sticky_mobile"
        className="w-full text-sm py-2.5"
      />
    </aside>
  );
};

// --- Rodapé ---

const Footer: React.FC = () => {
  const [footerLogoError, setFooterLogoError] = useState(false);

  return (
    <footer className="bg-[#22274F] text-[#F7F4EA] py-12 border-t border-white/10 pb-28 md:pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="mb-6 flex justify-center">
          {!footerLogoError ? (
            <img 
              src={`${B}images/logo.webp`} 
              alt="Mel Rolan Travel Designer" 
              className="h-10 w-auto brightness-0 invert opacity-90"
              onError={() => setFooterLogoError(true)}
              width="140"
              height="60"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="font-serif text-xl font-bold text-[#F7F4EA]">
              Mel Rolan
            </span>
          )}
        </div>

        <p className="font-serif font-bold text-base text-[#F7F4EA] mb-2">
          Mel Rolan Travel Designer
        </p>

        <div className="flex flex-wrap justify-center items-center gap-6 text-xs font-sans text-[#F7F4EA]/80 mb-6">
          <a 
            href="mailto:contato@melrolan.com.br" 
            className="hover:text-[#C19450] transition-colors flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" aria-hidden="true" /> contato@melrolan.com.br
          </a>
          <a 
            href="https://www.instagram.com/mel.rolan/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-[#C19450] transition-colors flex items-center gap-1.5"
          >
            <Instagram className="w-3.5 h-3.5" aria-hidden="true" /> @mel.rolan
          </a>
          <a 
            href={PRIVACY_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-[#C19450] transition-colors underline"
          >
            Política de privacidade
          </a>
          {(
            <button
              type="button"
              data-cookie-prefs
              className="hover:text-[#C19450] transition-colors underline focus:outline-none cursor-pointer"
            >
              Preferências de cookies
            </button>
          )}
        </div>

        <p className="text-xs font-sans text-[#F7F4EA]/80 max-w-xl mx-auto leading-relaxed mb-6">
          Este guia é um produto digital. Não é um serviço presencial nem de acompanhamento durante a viagem.
        </p>

        <p className="text-[11px] font-sans text-[#F7F4EA]/70">
          © 2026 Mel Rolan Travel Designer. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

// --- Componente Principal ---

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7F4EA] text-[#22274F] font-sans selection:bg-[#C19450] selection:text-[#22274F]">
      <Header />
      <main id="main-content">
        <Hero />
        <SampleImagesSection />
        <ForWhoSection />
        <ProblemSection />
        <InclusionsSection />
        <AgeGroupsSection />
        <AuthorSection />
        <TestimonialsSection />
        <OfferSection />
        <GuaranteeSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <StickyMobileCTA />
      <Footer />
    </div>
  );
};

const Pagina: React.FC = () => (
  <OfertaProvider guiaId="guia-paris-com-criancas">
    <App />
  </OfertaProvider>
);

export default Pagina;
