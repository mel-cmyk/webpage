// Conteúdo de todas as páginas, uma por arquivo/tema em src/pages/. Preços, números e contatos vêm de data/ofertas.json.
import { privacidade, avisoLegal } from '../legal.mjs';
import { home } from './home.mjs';
import { toursHub, tourPage } from './tours.mjs';
import { roteiro, consultoria } from './servicos.mjs';
import { guias } from './guias.mjs';
import { sobre, naMidia, parcerias } from './institucional.mjs';
import { quizTour, diagnostico } from './funis.mjs';

export function pages(data) {
  return [
    home(data),
    toursHub(data),
    ...data.tours.map((t) => tourPage(data, t)),
    roteiro(data),
    consultoria(data),
    guias(data),
    sobre(data),
    naMidia(data),
    parcerias(data),
    quizTour(data),
    diagnostico(data),
    privacidade(data),
    avisoLegal(data),
  ];
}
