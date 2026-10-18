// Montagem das LPs: o mesmo código para o navegador (hidrata o HTML pré-gerado) e para o build (gera esse HTML).
import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

export function montar(App: React.ComponentType): void {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Could not find root element to mount to');
  const app = (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  if (rootElement.hasChildNodes()) hydrateRoot(rootElement, app);
  else createRoot(rootElement).render(app);
}

export function renderizar(App: React.ComponentType): string {
  return renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
