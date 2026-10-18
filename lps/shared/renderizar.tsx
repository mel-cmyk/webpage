// Geração do HTML pré-renderizado das LPs (só no build, nunca no navegador).
import React from 'react';
import { renderToString } from 'react-dom/server';

export function renderizar(App: React.ComponentType): string {
  return renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
