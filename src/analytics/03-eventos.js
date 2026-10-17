  // Eventos: ficam na fila até o GA ser carregado (se nunca for, nada é enviado).
  function track(nome, params) {
    params = normalizar(params || {});
    if (carregado) gtag('event', nome, params);
    else fila.push([nome, params]);
    meta(nome, params);
    tiktok(nome, params);
  }
  window.mrTrack = track;

