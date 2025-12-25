import React from 'react';
import { CryptoSwapWidgetPrimitive } from './CryptoSwapWidgetPrimitive';
import { TradingMetrics } from './TradingMetrics';
import { BackgroundGlyphs } from './BackgroundGlyphs';
import { Header } from './Header';

// @component: LandingPage
// Clean landing page that composes the widget with other landing elements
// This will eventually replace the landing page functionality in CryptoSwapWidget.tsx
type LandingPageProps = {
  onGetStarted?: () => void; // Optional callback for "Get started" button
};

export const LandingPage = ({
  onGetStarted
}: LandingPageProps = {}) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 pt-24 md:pt-16 gap-6 sm:gap-8 bg-[#1D1D1D] overflow-hidden text-white font-['Inter']">
      <Header onStartTrading={onGetStarted} />
      <BackgroundGlyphs />

      <div className="relative z-10 w-full flex flex-col items-center gap-6 sm:gap-8 pt-14 md:pt-0">
        {/* Headline */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-center px-4"
          style={{
            paddingTop: "0px",
            color: "rgb(250 250 250 / 0.98)",
            fontWeight: "500"
          }}
        >
          Self-custody trading <span className="text-[#15F46F]">Crypto & TradFi</span>
        </h1>

        {/* Swap Widget */}
        <CryptoSwapWidgetPrimitive onGetStarted={onGetStarted} />

        {/* Subheadline */}
        <p className="text-[#a0a0a0] text-sm sm:text-base text-center max-w-[480px] -mt-4 px-4">
          Trade forex, gold, indices with USDC. DeFi-powered unified margins, spot markets, lending ahead.
        </p>

        {/* Trading Metrics */}
        <div className="w-full px-4 md:px-0 md:max-w-4xl md:mx-auto">
          <TradingMetrics />
        </div>
      </div>
    </div>
  );
};

