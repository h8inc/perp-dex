import React from 'react';

type TradingPageProps = {
  onBack?: () => void;
};

export const TradingPage = ({ onBack }: TradingPageProps) => {
  return (
    <div className="min-h-screen w-full bg-[#0b0e11] text-white font-['Inter']">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <p className="text-sm uppercase tracking-[0.14em] text-[#5d6785]">
            perp desk
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-3 max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
                Start trading perpetual futures with instant margin routing
              </h1>
              <p className="text-base text-[#a0a0a0]">
                Fast fills, deep liquidity, and risk controls tuned for high-frequency strategies.
                Connect your wallet to begin placing long, short, or swap orders with unified collateral.
              </p>
            </div>
            {onBack && (
              <button
                onClick={onBack}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                ← Back to landing
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Session overview</h2>
              <span className="text-xs text-[#5d6785]">Live market</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-[#cfd4df]">
              <div className="rounded-xl border border-white/5 bg-[#11151c] p-4 space-y-2">
                <p className="text-xs uppercase tracking-[0.08em] text-[#5d6785]">selected pair</p>
                <p className="text-xl font-semibold text-white">BTC / USD</p>
                <p className="text-[#00ff9d] text-sm">+0.64% today</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-[#11151c] p-4 space-y-2">
                <p className="text-xs uppercase tracking-[0.08em] text-[#5d6785]">available margin</p>
                <p className="text-xl font-semibold text-white">$12,450.00</p>
                <p className="text-[#a0a0a0] text-sm">Combined across assets</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-[#11151c] p-4 space-y-2">
                <p className="text-xs uppercase tracking-[0.08em] text-[#5d6785]">est. funding</p>
                <p className="text-xl font-semibold text-white">0.008% / 8h</p>
                <p className="text-[#a0a0a0] text-sm">Next window in 47m</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-[#11151c] p-4 space-y-2">
                <p className="text-xs uppercase tracking-[0.08em] text-[#5d6785]">maintenance</p>
                <p className="text-xl font-semibold text-white">3.5%</p>
                <p className="text-[#a0a0a0] text-sm">Auto liquidations disabled in demo</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Order ticket</h2>
              <span className="text-xs text-[#5d6785]">Preview mode</span>
            </div>
            <div className="space-y-3 text-sm text-[#cfd4df]">
              <p className="text-[#a0a0a0]">
                A full trading ticket will live here. For now, use this page as the entry point to the
                desk—hook up real execution when ready.
              </p>
              <div className="rounded-xl border border-dashed border-white/20 bg-[#11151c] p-5 text-center text-[#5d6785]">
                Trading UI placeholder — connect order form, chart, and positions here.
              </div>
              <div className="flex gap-3">
                <button className="flex-1 rounded-full bg-[#15F46F] text-[#06171E] py-3 text-sm font-medium hover:bg-[#ADFFCE] transition-colors">
                  Connect wallet
                </button>
                <button className="flex-1 rounded-full border border-white/10 bg-white/5 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                  View docs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

