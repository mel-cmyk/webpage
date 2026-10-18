// Montagem das LPs no navegador: hidrata o HTML pré-gerado (ou renderiza, se a página vier vazia).
// A geração do HTML (react-dom/server) fica em renderizar.tsx, para não entrar no JavaScript que o visitante baixa.
import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

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
