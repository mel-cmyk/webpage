  // Funis (Quiz dos Tours e Diagnóstico): parâmetros comuns e travas contra contagem dupla.
  // Sem dado pessoal: só ids, nomes de etapa e o resultado. Travas em sessionStorage (com memória como reserva).
  var memoria = {};
  function trava(chave) {
    try { if (sessionStorage.getItem(chave)) return false; sessionStorage.setItem(chave, '1'); return true; }
    catch (err) { if (memoria[chave]) return false; memoria[chave] = 1; return true; }
  }
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16);
    });
  }
  // Onde a pessoa clicou para chegar ao funil: guardado no clique; sem clique, usa a página anterior.
  function pontoEntrada(href) {
    var ant = '';
    try { var u = new URL(document.referrer); if (u.host === location.host) ant = u.pathname; } catch (err) {}
    if (ant === '/') return 'home';
    if (/^\/(tour|qual-tour)/.test(ant)) return 'pagina_tours';
    if (/^\/guia/.test(ant)) return 'pagina_guia';
    return 'direto';
  }
  function entrada() {
    try { var g = sessionStorage.getItem('mr_entrada'); if (g) { sessionStorage.removeItem('mr_entrada'); return g; } } catch (err) {}
    return pontoEntrada();
  }
  window.mrFlows = {};
  window.mrFluxo = function (flow, total) {
    var prefixo = flow === 'quiz_tours' ? 'quiz' : 'diagnostico';
    var run = uuid();
    var ponto = entrada();
    function base(extra) {
      var p = { flow: flow, flow_run_id: run, total_steps: total, entry_point: ponto };
      for (var k in extra) p[k] = extra[k];
      return p;
    }
    var f = {
      id: run,
      view: function () { if (trava('flow_view_' + run)) track('flow_view', base({})); },
      inicio: function () { if (trava(prefixo + '_inicio_' + run)) track(prefixo + '_inicio', base({})); },
      etapa: function (idx, nome, extra) {
        if (trava(prefixo + '_etapa_' + run + '_' + idx)) track(prefixo + '_etapa', base(Object.assign({ step_index: idx, step_name: nome }, extra)));
      },
      conclusao: function (resultId, extra) {
        if (trava(prefixo + '_conclusao_' + run)) track(prefixo + '_conclusao', base(Object.assign({ result_id: resultId }, extra)));
      },
      // generate_lead: no máximo 1 por execução, só no gesto real de captura.
      lead: function (metodo, fonte, resultId, extra) {
        if (trava('lead_sent_' + run)) track('generate_lead', base(Object.assign({ lead_method: metodo, lead_source: fonte, result_id: resultId }, extra)));
      },
      resultId: '',
    };
    window.mrFlows[flow] = f;
    return f;
  };

