// Testes de comportamento no navegador (rode "npm run test:browser" depois de "node build.mjs").
// Provam o que o visitante vive: cookies, medição, funis, checkout. Sem rede externa: terceiros são simulados.
import { iniciar, contexto, SITE, eventos, chamadas } from './lib/navegador.mjs';
import { conferir, titulo, encerrar } from './lib/pagina.mjs';
import fs from 'node:fs';

const integ = JSON.parse(fs.readFileSync('data/integracoes.json', 'utf8'));
const browser = await iniciar();

async function pagina(caminho, opcoes) {
  const { ctx, registro } = await contexto(browser, opcoes);
  const p = await ctx.newPage();
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(SITE + caminho);
  await p.waitForTimeout(500);
  return { ctx, p, registro, erros };
}
const visivel = (p, sel) => p.isVisible(sel);

// ---------------------------------------------------------------- 1. Cookies e terceiros
titulo('Cookies: nada de terceiros antes do aceite');
for (const caminho of ['/', '/tours-em-paris/', '/guias/paris-essencial/', '/sobre/']) {
  const { ctx, p, registro, erros } = await pagina(caminho);
  const pre = [...new Set(registro.externos)];
  const permitido = (h) => h === 'www.googletagmanager.com';
  conferir(`${caminho}: só o Google Tag Manager (modo avançado) antes da escolha`, pre.every(permitido), pre.join(', '));
  conferir(`${caminho}: aviso de cookies visível`, await visivel(p, '#cookie-banner'));
  conferir(`${caminho}: sem erro de JavaScript`, erros.length === 0, erros.join(' | '));
  await ctx.close();
}

titulo('Cookies: recusar, aceitar e retirar o aceite');
{
  const { ctx, p, registro } = await pagina('/');
  await p.click('[data-consent="none"]'); await p.waitForTimeout(300);
  conferir('recusar: nem Clarity, nem TikTok, nem Meta', !registro.externos.some((h) => /clarity|tiktok|facebook/.test(h)));
  conferir('recusar: aviso some e a escolha fica guardada', !(await visivel(p, '#cookie-banner')) && (await p.evaluate(() => !!localStorage.getItem('mr_consent'))));
  await ctx.close();
}
{
  const { ctx, p, registro } = await pagina('/');
  await p.click('[data-consent="all"]'); await p.waitForTimeout(400);
  const ext = registro.externos.join(',');
  conferir('aceitar: o pixel do TikTok carrega', /tiktok/.test(ext));
  conferir('aceitar: o Clarity carrega (há ID)', !integ.clarity_id || /clarity/.test(ext));
  const tt = await chamadas(p, 'ttq');
  conferir('aceitar: TikTok recebe hold, grant e page, nessa ordem', ['holdConsent', 'grantConsent', 'page'].every((n, i) => tt[i] && tt[i][0] === n), JSON.stringify(tt.slice(0, 3)));
  // retirar o aceite
  await p.evaluate(() => document.querySelector('[data-cookie-prefs]').click());
  await p.evaluate(() => document.querySelector('[data-consent="none"]').click());
  await p.waitForTimeout(300);
  const tt2 = await chamadas(p, 'ttq');
  conferir('retirar o aceite: TikTok recebe revokeConsent', tt2.some((c) => c[0] === 'revokeConsent'));
  const cl = await p.evaluate(() => (window.clarity && window.clarity.q ? [...window.clarity.q].map((a) => [...a]) : []));
  conferir('retirar o aceite: Clarity recebe consent=false', !integ.clarity_id || cl.some((c) => c[0] === 'consent' && c[1] === false));
  await ctx.close();
}

titulo('Cookies: modal por teclado');
{
  const { ctx, p } = await pagina('/guias/paris-essencial/');
  await p.focus('#cookie-mais'); await p.keyboard.press('Enter'); await p.waitForTimeout(100);
  conferir('abre pelo teclado e o foco entra no modal', await p.evaluate(() => !document.getElementById('cookie-modal').hidden && document.getElementById('cookie-modal').contains(document.activeElement)));
  for (let k = 0; k < 9; k += 1) await p.keyboard.press('Tab');
  conferir('Tab fica preso dentro do modal', await p.evaluate(() => document.getElementById('cookie-modal').contains(document.activeElement)));
  await p.keyboard.press('Escape'); await p.waitForTimeout(80);
  conferir('Esc fecha e devolve o foco ao botão que abriu', await p.evaluate(() => document.getElementById('cookie-modal').hidden && document.activeElement.id === 'cookie-mais'));
  await p.click('#cookie-mais'); await p.check('#consent-medicao', { force: true }); await p.click('#cookie-salvar'); await p.waitForTimeout(200);
  const s = await p.evaluate(() => JSON.parse(localStorage.getItem('mr_consent')));
  conferir('salvar só medição: medição aceita e publicidade recusada', s.status === 'granted' && s.ads === false);
  await ctx.close();
}

titulo('Medição: Google, checkout e páginas de anúncio');
for (const caminho of ['/guias/paris-essencial/', '/guias/paris-com-criancas/']) {
  const { ctx, p } = await pagina(caminho + '?gclid=teste123&utm_source=teste');
  await p.click('[data-consent="all"]'); await p.waitForTimeout(300);
  const href = await p.evaluate(() => { const a = document.querySelector('a[data-checkout]'); a.addEventListener('click', (e) => e.preventDefault(), { once: true }); a.click(); return a.href; });
  const ev = await eventos(p);
  const vi = ev.find((e) => e.nome === 'view_item'), bc = ev.find((e) => e.nome === 'begin_checkout');
  conferir(`${caminho}: view_item com preço e moeda`, vi && vi.p.currency === 'BRL' && vi.p.value > 0);
  conferir(`${caminho}: begin_checkout com checkout_provider=wix e valor`, bc && bc.p.checkout_provider === 'wix' && bc.p.value > 0 && bc.p.currency === 'BRL');
  conferir(`${caminho}: o link da loja leva gclid e utm`, /gclid=teste123/.test(href) && /utm_source=teste/.test(href), href);
  await ctx.close();
}
{
  const { ctx, p, registro } = await pagina('/guias/paris-essencial/');
  conferir('LPs: nenhuma requisição ao Google Fonts', !registro.externos.some((h) => /fonts\.g/.test(h)), registro.externos.join(','));
  await ctx.close();
}
{
  const { ctx, p } = await pagina('/guias/paris-essencial//?gclid=x#preco');
  conferir('barra dupla no endereço é corrigida sem perder parâmetros', (await p.evaluate(() => location.pathname + location.search + location.hash)) === '/guias/paris-essencial/?gclid=x#preco');
  await ctx.close();
}
{
  const { ctx, p, registro } = await pagina('/?interno=1');
  await p.click('[data-consent="all"]'); await p.waitForTimeout(300);
  conferir('navegador interno (?interno=1): sem TikTok nem Clarity', !registro.externos.some((h) => /tiktok|clarity/.test(h)));
  await ctx.close();
}

// ---------------------------------------------------------------- 2. Funis
async function responder(p, resultado) {
  for (let k = 0; k < 9; k += 1) {
    if (await p.evaluate((r) => !document.getElementById(r).hidden, resultado)) return;
    const passo = await p.$('.step:not([hidden])');
    const nome = await passo.$('[name="nome"]');
    if (nome && (await nome.isVisible())) { await nome.fill('Teste Silva'); await (await passo.$('[name="whatsapp"]')).fill('11 98888-7777'); }
    const opcao = await passo.$('input[type=radio],input[type=checkbox]');
    if (opcao) await opcao.check({ force: true });
    await p.click('[data-next]'); await p.waitForTimeout(150);
  }
}
titulo('Funis: eventos e um único generate_lead por execução');
{
  const { ctx, p, registro } = await pagina('/diagnostico/');
  await p.click('[data-consent="all"]'); await p.waitForTimeout(300);
  await responder(p, 'resultado'); await p.waitForTimeout(500);
  await p.evaluate(() => { const a = document.querySelector('#resultado a[data-wa]'); a.addEventListener('click', (e) => e.preventDefault()); a.click(); a.click(); });
  const ev = await eventos(p);
  const por = (n) => ev.filter((e) => e.nome === n);
  const run = por('flow_view')[0] && por('flow_view')[0].p.flow_run_id;
  conferir('diagnóstico: flow_view, início, etapas e conclusão', por('flow_view').length === 1 && por('diagnostico_inicio').length === 1 && por('diagnostico_etapa').length >= 4 && por('diagnostico_conclusao').length === 1);
  conferir('diagnóstico: exatamente 1 generate_lead (formulário), mesmo com cliques no WhatsApp', por('generate_lead').length === 1 && por('generate_lead')[0].p.lead_method === 'formulario');
  conferir('diagnóstico: todos os eventos do funil com o mesmo flow_run_id', ev.filter((e) => /^(diagnostico_|flow_view|generate_lead)/.test(e.nome)).every((e) => e.p.flow_run_id === run));
  conferir('diagnóstico: nenhum dado pessoal nos eventos', !/Teste Silva|98888/.test(JSON.stringify(ev)));
  conferir('diagnóstico: TikTok recebe SubmitForm uma vez', (await chamadas(p, 'ttq')).filter((c) => c[0] === 'track' && c[1] === 'SubmitForm').length === 1);
  await ctx.close();
}
{
  const { ctx, p } = await pagina('/qual-tour-combina-com-voce/');
  await p.click('[data-consent="all"]'); await p.waitForTimeout(300);
  await responder(p, 'quiz-resultado'); await p.waitForTimeout(300);
  await p.evaluate(() => { const a = document.querySelector('#quiz-resultado a[data-wa]'); a.addEventListener('click', (e) => e.preventDefault()); a.click(); a.click(); });
  const ev = await eventos(p);
  const por = (n) => ev.filter((e) => e.nome === n);
  conferir('quiz: início, 6 etapas e conclusão com result_id', por('quiz_inicio').length === 1 && por('quiz_etapa').length === 6 && por('quiz_conclusao').length === 1 && /^tour_/.test(por('quiz_conclusao')[0].p.result_id));
  conferir('quiz: exatamente 1 generate_lead (WhatsApp) com origin_flow no whatsapp_click', por('generate_lead').length === 1 && por('generate_lead')[0].p.lead_method === 'whatsapp' && por('whatsapp_click').every((e) => e.p.origin_flow === 'quiz_tours'));
  conferir('quiz: sem Contact duplicado no TikTok', (await chamadas(p, 'ttq')).filter((c) => c[0] === 'track' && c[1] === 'Contact').length === 0);
  await ctx.close();
}

await browser.close();
encerrar();
