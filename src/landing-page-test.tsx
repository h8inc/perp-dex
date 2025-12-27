import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { LandingPage } from './components/generated/LandingPage';

const rootEl = document.getElementById('root');

if (!rootEl) {
  throw new Error('Root element #root not found for landing page test.');
}

createRoot(rootEl).render(
  <StrictMode>
    <LandingPage />
  </StrictMode>
);






