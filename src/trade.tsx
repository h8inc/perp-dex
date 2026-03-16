import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { TradePage } from './components/perp/TradePage';

const rootEl = document.getElementById('root');

if (!rootEl) {
  throw new Error('Root element #root not found for trade page.');
}

createRoot(rootEl).render(
  <StrictMode>
    <TradePage />
  </StrictMode>
);
