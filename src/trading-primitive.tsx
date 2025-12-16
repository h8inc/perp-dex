import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { TradingInterfaceWithPrimitive } from './components/perp/TradingInterfaceWithPrimitive';

const rootEl = document.getElementById('root');

if (!rootEl) {
  throw new Error('Root element #root not found for trading-primitive page.');
}

createRoot(rootEl).render(
  <StrictMode>
    <TradingInterfaceWithPrimitive />
  </StrictMode>
);

