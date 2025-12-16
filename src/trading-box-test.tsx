import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { TradingBoxTestPage } from './components/perp/TradingBoxTestPage';

const rootEl = document.getElementById('root');

if (!rootEl) {
  throw new Error('Root element #root not found for trading-box-test page.');
}

createRoot(rootEl).render(
  <StrictMode>
    <TradingBoxTestPage />
  </StrictMode>
);

