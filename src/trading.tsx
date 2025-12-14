import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { TradingInterface } from './components/perp/TradingInterface';

const rootEl = document.getElementById('root');

if (!rootEl) {
  throw new Error('Root element #root not found for trading page.');
}

createRoot(rootEl).render(
  <StrictMode>
    <TradingInterface />
  </StrictMode>
);

