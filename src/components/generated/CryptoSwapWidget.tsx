import React, { useState } from 'react';
import { ArrowDown, ChevronDown } from 'lucide-react';
import { TradingMetrics } from './TradingMetrics';
import { BackgroundGlyphs } from './BackgroundGlyphs';
import { TokenSelector, type TokenData, type Network } from '../perp/primitives/TokenSelector';
const ETH_ICON = "/tokens/eth.png";

// Mock suggested tokens for the Buy section
const SUGGESTED_TOKENS = [{
  symbol: "ETH",
  icon: "/tokens/eth.png"
}, {
  symbol: "USDC",
  icon: "/tokens/usdc.png"
}, {
  symbol: "USDT",
  icon: "/tokens/usdt.png"
}, {
  symbol: "WBTC",
  icon: "/tokens/wbtc.png"
}] as any[];
const POPULAR_TOKENS = [{
  symbol: "ETH",
  name: "ETH",
  icon: "/tokens/eth.png"
}, {
  symbol: "USDC",
  name: "USDC",
  icon: "/tokens/usdc.png"
}, {
  symbol: "USDT",
  name: "USDT",
  icon: "/tokens/usdt.png"
}, {
  symbol: "WBTC",
  name: "WBTC",
  icon: "/tokens/wbtc.png"
}, {
  symbol: "WETH",
  name: "WETH",
  icon: "/tokens/eth.png"
}] as any[];

const DEPOSIT_TOKENS = [{
  symbol: "USDC",
  name: "USDC",
  icon: "/tokens/usdc.png"
}, {
  symbol: "ETH",
  name: "ETH",
  icon: "/tokens/eth.png"
}, {
  symbol: "wstETH",
  name: "wstETH",
  icon: "/tokens/wsteth.png"
}] as any[];
const TOKEN_LIST = [{
  symbol: "ETH",
  name: "Ethereum",
  icon: "/tokens/eth.png",
  balance: "0"
}, {
  symbol: "USDT",
  name: "Tether",
  icon: "/tokens/usdt.png",
  balance: "0"
}, {
  symbol: "USDC",
  name: "USDC",
  icon: "/tokens/usdc.png",
  balance: "0"
}, {
  symbol: "SOL",
  name: "Solana",
  icon: "/tokens/sol.png",
  balance: "0"
}, {
  symbol: "DAI",
  name: "Dai",
  icon: "/tokens/dai.png",
  balance: "0"
}, {
  symbol: "MATIC",
  name: "Polygon",
  icon: "/tokens/matic.png",
  balance: "0"
}] as any[];
export const CryptoSwapWidget = () => {
  const [sellAmount, setSellAmount] = useState<string>('');
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
  const [selectorFor, setSelectorFor] = useState<'sell' | 'receive'>('sell');
  const [buyToken, setBuyToken] = useState<TokenData>(() => DEPOSIT_TOKENS.find(t => t.symbol === "USDC") || DEPOSIT_TOKENS[0]);
  const [selectedNetwork, setSelectedNetwork] = useState<Network>({
    id: 'ethereum',
    name: 'Ethereum',
    icon: '/tokens/eth.png'
  });
  const handleSelectToken = (token: TokenData) => {
    setBuyToken(token);
    setIsTokenSelectorOpen(false);
  };
  const handleSetPercentage = (pct: number) => {
    const balance = 0.03473;
    setSellAmount((balance * pct).toFixed(5));
  };
  const hasAmount = sellAmount && parseFloat(sellAmount) > 0;
  const networks: Network[] = [
    { id: 'ethereum', name: 'Ethereum', icon: '/tokens/eth.png' },
    { id: 'arbitrum', name: 'Arbitrum', icon: '/tokens/arb.png' },
    { id: 'optimism', name: 'Optimism', icon: '/tokens/op.png' },
    { id: 'base', name: 'Base', icon: '/tokens/base.png' },
    { id: 'polygon', name: 'Polygon', icon: '/tokens/matic.png' },
    { id: 'avalanche', name: 'Avalanche', icon: '/tokens/avax.png' },
  ];
  return <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 pt-24 md:pt-16 gap-8 bg-[#1D1D1D] overflow-hidden text-white font-['Inter']">
      
      <BackgroundGlyphs />

      <div className="relative z-10 w-full flex flex-col items-center gap-8 pt-14 md:pt-0">
      
      {/* Headline */}
      <h1 className="text-4xl md:text-5xl font-bold text-center" style={{
        paddingTop: "0px",
        color: "rgb(250 250 250 / 0.98)",
        fontWeight: "500"
      }}>
        Sel-custody trading. <span className="text-[#15F46F]">Crypto & TradFi</span>
      </h1>

      <div className="relative flex flex-col w-[480px] max-w-full bg-[#131313] rounded-[24px] p-2 shadow-2xl font-sans text-white border border-white/5 overflow-hidden" style={{
        fontFamily: "'Inter', sans-serif"
      }}>
        
        {/* DEPOSIT SECTION - Fixed Height 148px */}
        <div className="flex flex-col justify-between px-4 py-4 relative bg-[#131313] hover:bg-white/[0.02] rounded-[20px] transition-colors group h-[148px]">
          {/* Header Row: Label + Percentage Buttons */}
          <div className="flex justify-between items-center h-6">
            <span className="text-[#a0a0a0] font-medium text-sm">Deposit</span>
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
            
            <button
              onClick={() => {
                setSelectorFor('sell');
                setIsTokenSelectorOpen(true);
              }}
              className="flex items-center gap-2 bg-[#131313] border border-[#393939] hover:border-[#505050] hover:bg-[#1a1a1a] rounded-full py-1 pl-1 pr-3 shadow-sm transition-all cursor-pointer shrink-0 h-[36px]"
            >
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

        {/* RECEIVE SECTION - Fixed Height 148px */}
        <div className="flex flex-col justify-between px-4 py-4 bg-[#1f1f1f] rounded-[20px] border border-transparent hover:border-white/5 transition-colors h-[148px]">
          
          {/* Header Row: Label + Suggested Tokens */}
          <div className="flex justify-between items-center h-6">
            <span className="text-[#a0a0a0] font-medium text-sm">Receive</span>
            
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
            
            <button
              onClick={() => {
                setSelectorFor('receive');
                setIsTokenSelectorOpen(true);
              }}
              className="flex items-center gap-2 bg-[#131313] border border-[#393939] hover:border-[#505050] hover:bg-[#1a1a1a] rounded-full py-1 pl-1 pr-3 shadow-sm transition-all cursor-pointer shrink-0 h-[36px]"
            >
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

      <p className="text-[#a0a0a0] text-base text-center max-w-[480px] -mt-4">Trade forex, gold, indices with USDC. DeFi-powered unified margins, spot markets, lending ahead.</p>

      <div className="w-full max-w-4xl">
        <TradingMetrics />
      </div>

      {/* Token Selector */}
      <TokenSelector
        isOpen={isTokenSelectorOpen}
        onClose={() => setIsTokenSelectorOpen(false)}
        onSelectToken={handleSelectToken}
        availableTokens={selectorFor === 'sell' ? DEPOSIT_TOKENS : TOKEN_LIST}
        popularTokens={selectorFor === 'sell' ? DEPOSIT_TOKENS : POPULAR_TOKENS}
        listTitle="Tokens by 24H volume"
        networks={networks}
        selectedNetwork={selectedNetwork}
        onNetworkChange={setSelectedNetwork}
        showNetworks={selectorFor === 'sell'}
      />

      </div>
    </div>;
};