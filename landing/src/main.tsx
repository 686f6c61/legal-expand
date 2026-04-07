// Inicializa GlitchTip (Sentry-compatible). DSN inyectada en build via VITE_GLITCHTIP_DSN.
import * as __Sentry from '@sentry/browser';
const __dsn = import.meta.env.VITE_GLITCHTIP_DSN;
if (__dsn) {
  __Sentry.init({
    dsn: __dsn,
    release: 'legal-expand-landing',
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.01,
  });
}

/**
 * legal-expand - Entry Point
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Punto de entrada de la aplicación React. Importa estilos globales y
 * renderiza el componente App en el DOM.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/theme.css';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
