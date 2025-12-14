import React, { useState } from 'react';
import { ArrowDown, ChevronDown, X, Search, Wallet, Globe } from 'lucide-react';
import { TradingMetrics } from './TradingMetrics';
import { BackgroundGlyphs } from './BackgroundGlyphs';
const ETH_ICON = "https://token-icons.s3.amazonaws.com/eth.png";

// Mock suggested tokens for the Buy section
const SUGGESTED_TOKENS = [{
  symbol: "ETH",
  icon: "https://token-icons.s3.amazonaws.com/eth.png"
}, {
  symbol: "USDC",
  icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026"
}, {
  symbol: "USDT",
  icon: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=026"
}, {
  symbol: "WBTC",
  icon: "https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png?v=026"
}] as any[];
const POPULAR_TOKENS = [{
  symbol: "ETH",
  name: "ETH",
  icon: "https://token-icons.s3.amazonaws.com/eth.png"
}, {
  symbol: "USDC",
  name: "USDC",
  icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026"
}, {
  symbol: "USDT",
  name: "USDT",
  icon: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=026"
}, {
  symbol: "WBTC",
  name: "WBTC",
  icon: "https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png?v=026"
}, {
  symbol: "WETH",
  name: "WETH",
  icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026"
}] as any[];
const TOKEN_LIST = [{
  symbol: "ETH",
  name: "Ethereum",
  icon: "https://token-icons.s3.amazonaws.com/eth.png",
  balance: "0"
}, {
  symbol: "USDT",
  name: "Tether",
  icon: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=026",
  balance: "0"
}, {
  symbol: "USDC",
  name: "USDC",
  icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026",
  balance: "0"
}, {
  symbol: "SOL",
  name: "Solana",
  icon: "https://cryptologos.cc/logos/solana-sol-logo.png?v=026",
  balance: "0"
}, {
  symbol: "DAI",
  name: "Dai",
  icon: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=026",
  balance: "0"
}, {
  symbol: "MATIC",
  name: "Polygon",
  icon: "https://cryptologos.cc/logos/polygon-matic-logo.png?v=026",
  balance: "0"
}] as any[];
export const CryptoSwapWidget = () => {
  const [sellAmount, setSellAmount] = useState<string>('');
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [buyToken, setBuyToken] = useState(() => POPULAR_TOKENS.find(t => t.symbol === "USDC") || POPULAR_TOKENS[0]);
  const handleSelectToken = (token: any) => {
    setBuyToken(token);
    setIsTokenSelectorOpen(false);
  };
  const handleSetPercentage = (pct: number) => {
    const balance = 0.03473;
    setSellAmount((balance * pct).toFixed(5));
  };
  const hasAmount = sellAmount && parseFloat(sellAmount) > 0;
  return <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 pt-24 md:pt-16 gap-8 bg-[#1D1D1D] overflow-hidden text-white font-['Inter']">
      
      <BackgroundGlyphs />

      <div className="relative z-10 w-full flex flex-col items-center gap-8 pt-14 md:pt-0">
      
      {/* Headline */}
      <h1 className="text-4xl md:text-5xl font-bold text-center" style={{
        paddingTop: "0px",
        color: "rgb(250 250 250 / 0.98)",
        fontWeight: "500"
      }}>
        Self-Custody. <span className="text-[#15F46F]">CEX-Grade Performance.</span>
      </h1>

      <div className="relative flex flex-col w-[480px] max-w-full bg-[#131313] rounded-[24px] p-2 shadow-2xl font-sans text-white border border-white/5 overflow-hidden" style={{
        fontFamily: "'Inter', sans-serif"
      }}>
        
        {/* SELL SECTION - Fixed Height 148px */}
        <div className="flex flex-col justify-between px-4 py-4 relative bg-[#131313] hover:bg-white/[0.02] rounded-[20px] transition-colors group h-[148px]">
          {/* Header Row: Label + Percentage Buttons */}
          <div className="flex justify-between items-center h-6">
            <span className="text-[#a0a0a0] font-medium text-sm">Sell</span>
            <div className={`flex gap-1 transition-opacity duration-200 ${sellAmount ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              {[{
                label: '25%',
                val: 0.25
              }, {
                label: '50%',
                val: 0.5
              }, {
                label: 'Max',
                val: 1
              }].map(btn => <button key={btn.label} onClick={() => handleSetPercentage(btn.val)} className="px-2 py-1 text-xs font-medium text-[#a0a0a0] hover:text-white bg-[#1f1f1f] hover:bg-[#2d2d2d] rounded-lg border border-white/5 transition-colors">
                  {btn.label}
                </button>)}
            </div>
          </div>

          {/* Input Row */}
          <div className="flex items-center justify-between gap-4">
            <input type="text" inputMode="decimal" placeholder="0" value={sellAmount} onChange={e => {
              if (/^\d*\.?\d*$/.test(e.target.value)) {
                setSellAmount(e.target.value);
              }
            }} className="w-full bg-transparent text-4xl font-normal text-white placeholder-white/20 outline-none border-none p-0 m-0" />
            
            <button className="flex items-center gap-2 bg-[#131313] border border-[#393939] hover:border-[#505050] hover:bg-[#1a1a1a] rounded-full py-1 pl-1 pr-3 shadow-sm transition-all cursor-pointer shrink-0 h-[36px]">
              <div className="w-[28px] h-[28px] rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img src={ETH_ICON} alt="ETH" className="w-full h-full object-cover" onError={e => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/28x28/333/FFF?text=E";
                }} />
              </div>
              <span className="font-semibold text-base ml-1">ETH</span>
              <ChevronDown className="w-5 h-5 text-[#a0a0a0]" />
            </button>
          </div>

          {/* Footer Row: Fiat Value + Balance */}
          <div className="flex justify-between items-center h-6">
            <span className="text-[#a0a0a0] text-sm">
              ${(parseFloat(sellAmount || '0') * 2450.50).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
            <span className="text-[#a0a0a0] text-sm">Balance: 0.03473</span>
          </div>
        </div>

        {/* SWAP ARROW */}
        <div className="relative h-1 z-20 flex items-center justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-1 bg-[#131313] rounded-xl">
                <button className="w-10 h-10 bg-[#1f1f1f] hover:bg-[#2d2d2d] border-[4px] border-[#131313] rounded-xl flex items-center justify-center text-white transition-colors cursor-pointer group">
                <ArrowDown className="w-5 h-5 text-white/80 group-hover:text-white" strokeWidth={3} />
                </button>
            </div>
        </div>

        {/* BUY SECTION - Fixed Height 148px */}
        <div className="flex flex-col justify-between px-4 py-4 bg-[#1f1f1f] rounded-[20px] border border-transparent hover:border-white/5 transition-colors h-[148px]">
          
          {/* Header Row: Label + Suggested Tokens */}
          <div className="flex justify-between items-center h-6">
            <span className="text-[#a0a0a0] font-medium text-sm">Buy</span>
            
            {/* Suggested Tokens - Visible only when sell amount is entered */}
            {hasAmount && <div className="flex items-center gap-2">
                    {SUGGESTED_TOKENS.map((token, idx) => <button key={token.symbol} className="w-6 h-6 rounded-full bg-[#2d2d2d] overflow-hidden hover:scale-110 transition-transform cursor-pointer" onClick={() => handleSelectToken(token)}>
                            <img src={token.icon} alt={token.symbol} className="w-full h-full object-cover" />
                         </button>)}
                </div>}
          </div>

          {/* Input Row */}
          <div className="flex items-center justify-between gap-4">
            <input type="text" placeholder="0" readOnly value={hasAmount ? (parseFloat(sellAmount) * 2450.50).toFixed(2) : ''} className="w-full bg-transparent text-4xl font-normal text-white placeholder-white/20 outline-none border-none p-0 m-0 cursor-default" />
            
            <button onClick={() => setIsTokenSelectorOpen(true)} className="flex items-center gap-2 bg-[#131313] border border-[#393939] hover:border-[#505050] hover:bg-[#1a1a1a] rounded-full py-1 pl-1 pr-3 shadow-sm transition-all cursor-pointer shrink-0 h-[36px]">
              <div className="w-[28px] h-[28px] rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img src={buyToken?.icon} alt={buyToken?.symbol} className="w-full h-full object-cover" onError={e => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/28x28/333/FFF?text=AS";
                }} />
              </div>
              <span className="font-semibold text-base ml-1">{buyToken?.symbol || 'Token'}</span>
              <ChevronDown className="w-5 h-5 text-[#a0a0a0]" />
            </button>
          </div>

          {/* Footer Row: Fiat Value */}
          <div className="flex justify-between items-center h-6">
            <span className="text-[#a0a0a0] text-sm">
               {hasAmount ? '$' + (parseFloat(sellAmount) * 2450.50).toLocaleString('en-US', {
                minimumFractionDigits: 2
              }) : '$0.00'}
            </span>
          </div>
        </div>

        {/* ACTION BUTTON */}
        <div className="mt-2">
          <button
            className={`w-full py-4 rounded-[20px] text-lg font-medium transition-all duration-200 ${!hasAmount ? 'bg-[#2d2f36] text-[#5d6785] cursor-not-allowed' : 'bg-[#15F46F] text-[#06171E] hover:bg-[#ADFFCE] shadow-[0_0_20px_rgba(21,244,111,0.3)]'}`}
            onClick={() => {
              if (!hasAmount) return;
              window.location.href = '/trading.html';
            }}
          >
            {!hasAmount ? 'Enter an amount' : 'Get started'}
          </button>
        </div>

      </div>

      <p className="text-[#a0a0a0] text-base text-center max-w-[480px] -mt-4">CEX performance meets self-custody—perps, spot, lending, and instant-fiat in one seamless margin system.</p>

      <div className="w-full max-w-4xl">
        <TradingMetrics />
      </div>

      {/* GLASSMORPHIC TOKEN SELECTOR OVERLAY - Moved outside to prevent overflow clipping */}
      {isTokenSelectorOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur Layer */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300" onClick={() => setIsTokenSelectorOpen(false)} />
          
          {/* Content Container */}
          <div className="relative w-[480px] max-w-full h-[600px] max-h-[90vh] bg-[#131313]/95 backdrop-blur-xl rounded-[24px] border border-white/10 flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 pb-2 shrink-0">
              <h3 className="text-white font-semibold text-lg">Select a token</h3>
              <button onClick={() => setIsTokenSelectorOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
                <X className="w-6 h-6 text-[#a0a0a0] hover:text-white" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="px-4 pb-4 shrink-0">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a0a0a0] group-focus-within:text-[#15F46F] transition-colors" />
                <input type="text" placeholder="Search tokens" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-[#1f1f1f] text-white placeholder-[#5d6785] rounded-xl pl-10 pr-10 py-3 outline-none border border-transparent focus:border-[#15F46F]/50 transition-all text-base" />
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4 space-y-6">
              
              {/* Popular Tokens Grid */}
              <div className="grid grid-cols-4 gap-2">
                {POPULAR_TOKENS.map(token => <button key={token.symbol} className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border border-white/5 bg-[#1f1f1f]/50 hover:bg-[#2d2d2d] transition-colors group cursor-pointer" onClick={() => handleSelectToken(token)}>
                    <img src={token.icon} alt={token.symbol} className="w-8 h-8 rounded-full" />
                    <span className="text-xs font-medium text-white group-hover:text-white/90">{token.symbol}</span>
                  </button>)}
              </div>

              {/* Token List */}
              <div className="space-y-1">
                <div className="text-sm text-[#a0a0a0] font-medium mb-2 sticky top-0 bg-[#131313] py-2 z-10">
                  Tokens by 24H volume
                </div>
                
                {TOKEN_LIST.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.symbol.toLowerCase().includes(searchQuery.toLowerCase())).map(token => <button key={`${token.symbol}-${token.name}`} onClick={() => handleSelectToken(token)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group text-left cursor-pointer">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-[#2d2d2d] shrink-0">
                      <img src={token.icon} alt={token.symbol} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                          <span className="text-white font-medium text-base truncate">{token.name}</span>
                          <span className="text-[#5d6785] text-xs font-medium bg-[#1f1f1f] px-1.5 py-0.5 rounded uppercase">{token.symbol}</span>
                      </div>
                      <div className="text-[#a0a0a0] text-sm group-hover:text-[#a0a0a0]/80">
                         {token.symbol} 
                      </div>
                    </div>
                    <div className="text-right">
                       {/* Optional: Add balance or price here if available */}
                    </div>
                  </button>)}
              </div>
            </div>

          </div>
        </div>}

      </div>
    </div>;
};