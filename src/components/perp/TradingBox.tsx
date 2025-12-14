import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Settings, Info, ArrowDown } from 'lucide-react';

// --- Icons ---

const BitcoinIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-full bg-[#f7931a]">
    <path d="M16.5 14.5C16.5 14.5 18 13.5 18 11.5C18 9.5 16.5 8.5 15.5 8.5H12V16.5H15.5C16.5 16.5 16.5 14.5 16.5 14.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 8.5V4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 16.5V20.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
const USDCIcon = () => <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2775ca] text-[11px] font-bold text-white">
    $
  </div>;

// --- Helper Components ---

const TabButton = ({
  active,
  label,
  onClick,
  accentColor = "green"
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  accentColor?: "green" | "blue";
}) => {
  // Matching the screenshot:
  // Active tab background is lighter/different color, usually blueish for Swap or specific for Long/Short
  // The screenshot shows "Swap" active with a blue indicator.
  const activeClass = "bg-[#00ff9d]/10 text-[#00ff9d] border-b-[#00ff9d]";
  return <button onClick={onClick} className={`flex-1 px-5 py-4 text-sm font-medium transition-colors border-b-[2px] ${active ? activeClass : "text-gray-400 border-b-transparent hover:text-white hover:bg-white/5"} first:rounded-tl-lg last:rounded-tr-lg`}>
      {label}
    </button>;
};
const TokenInput = ({
  label,
  value,
  onChange,
  tokenIcon: TokenIcon,
  tokenSymbol,
  subValue,
  balance,
  readOnly = false
}: {
  label: string;
  value: string;
  onChange?: (val: string) => void;
  tokenIcon: React.ElementType;
  tokenSymbol: string;
  subValue?: string;
  balance?: string;
  readOnly?: boolean;
}) => <div className="rounded-lg border border-white/10 bg-[#15191e] p-4 transition-colors focus-within:border-[#00ff9d]/50 hover:bg-[#1a1d26]">
    <div className="mb-2 flex justify-between text-xs text-gray-400">
      <span>{label}</span>
      {balance && <span>{balance}</span>}
    </div>
    <div className="flex items-center justify-between gap-3">
      <input type="text" inputMode="decimal" placeholder="0.0" value={value} onChange={e => onChange && onChange(e.target.value)} readOnly={readOnly} className="w-full min-w-0 bg-transparent text-2xl font-medium text-white placeholder-gray-600 outline-none" />
      <div className="flex shrink-0 items-center gap-2">
        {subValue && <div className="flex items-baseline gap-1 mr-2">
            <span className="text-xs text-gray-400">Leverage:</span>
            <span className="text-xs text-gray-400">{subValue}</span>
          </div>}
        <button className="flex items-center gap-2 rounded-full bg-white/5 py-1.5 pl-2 pr-3 hover:bg-white/10 transition-colors border border-transparent hover:border-white/10">
          <TokenIcon />
          <span className="text-base font-medium text-white">{tokenSymbol}</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
      </div>
    </div>
    <div className="mt-1 text-xs text-gray-500">
        $0.00
    </div>
  </div>;
const SliderMark = ({
  label,
  position,
  active
}: {
  label: string;
  position: string;
  active: boolean;
}) => <div className="absolute flex -translate-x-1/2 flex-col items-center" style={{
  left: position,
  top: '50%'
}}>
    <div className={`mb-2 h-1.5 w-1.5 -translate-y-1/2 rounded-full transition-opacity ${active ? "bg-[#00ff9d] ring-2 ring-[#0b0e11] opacity-100" : "opacity-0"}`} />
    <span className={`mt-2 text-[10px] font-medium uppercase ${active ? "text-gray-300" : "text-gray-600"}`}>
      {label}
    </span>
  </div>;

// @component: TradingBox
type TradingBoxProps = {
  isWalletConnected?: boolean;
  onConnectWallet?: () => void;
  onDisconnect?: () => void;
};

export const TradingBox = ({
  isWalletConnected = false,
  onConnectWallet,
  onDisconnect
}: TradingBoxProps) => {
  const [activeTab, setActiveTab] = useState<'Long' | 'Short' | 'Swap'>('Long');
  const [orderType, setOrderType] = useState<'Market' | 'Limit' | 'TWAP' | 'TPSL' | 'StopMarket'>('Market');
  const [payAmount, setPayAmount] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [leverage, setLeverage] = useState(20);
  const [isExecDetailsOpen, setIsExecDetailsOpen] = useState(true);
  const [isDraggingLeverage, setIsDraggingLeverage] = useState(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  // Marks for slider
  const marks = [{
    val: 0.1,
    label: '0.1x'
  }, {
    val: 1,
    label: '1x'
  }, {
    val: 2,
    label: '2x'
  }, {
    val: 5,
    label: '5x'
  }, {
    val: 10,
    label: '10x'
  }, {
    val: 25,
    label: '25x'
  }, {
    val: 50,
    label: '50x'
  }] as const;
  const isSwap = activeTab === 'Swap';
  const minLeverage = marks[0].val;
  const maxLeverage = marks[marks.length - 1].val;
  const marksWithPos = marks.map((m, i) => ({
    ...m,
    pos: (i / (marks.length - 1)) * 100
  }));
  const clampedLeverage = Math.min(maxLeverage, Math.max(minLeverage, leverage));
  const effectiveLeverage = isSwap ? 1 : clampedLeverage;
  const parsedPay = parseFloat(payAmount || '0');
  const hasPay = Number.isFinite(parsedPay) && parsedPay > 0;
  const parsedLimit = parseFloat(limitPrice || '0');
  const hasLimitPrice = Number.isFinite(parsedLimit) && parsedLimit > 0;
  const longAmount = hasPay ? (parsedPay * effectiveLeverage).toFixed(2) : '';
  const leveragePct = (() => {
    if (marksWithPos.length === 1) return 0;
    for (let i = 0; i < marksWithPos.length - 1; i++) {
      const left = marksWithPos[i];
      const right = marksWithPos[i + 1];
      if (clampedLeverage <= right.val) {
        const range = right.val - left.val || 1;
        const t = (clampedLeverage - left.val) / range;
        return left.pos + (right.pos - left.pos) * t;
      }
    }
    return 100;
  })();

  const updateLeverageFromPosition = useCallback((clientX: number) => {
    const rect = sliderRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    const clampedPct = Math.min(100, Math.max(0, pct));
    for (let i = 0; i < marksWithPos.length - 1; i++) {
      const left = marksWithPos[i];
      const right = marksWithPos[i + 1];
      if (clampedPct <= right.pos) {
        const span = right.pos - left.pos || 1;
        const t = (clampedPct - left.pos) / span;
        const nextVal = left.val + (right.val - left.val) * t;
        setLeverage(nextVal);
        return;
      }
    }
    setLeverage(maxLeverage);
  }, [marksWithPos, maxLeverage]);

  useEffect(() => {
    if (!isDraggingLeverage) return;
    const handleMove = (e: MouseEvent) => {
      updateLeverageFromPosition(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      updateLeverageFromPosition(e.touches[0].clientX);
    };
    const stop = () => setIsDraggingLeverage(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', stop);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', stop);
    window.addEventListener('touchcancel', stop);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', stop);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', stop);
      window.removeEventListener('touchcancel', stop);
    };
  }, [isDraggingLeverage, updateLeverageFromPosition]);

  // @return
  return <div className="flex w-full items-start justify-center bg-[#0b0e11] p-4 font-sans antialiased h-full" style={{
    paddingLeft: "0px",
    paddingRight: "0px",
    paddingTop: "0px",
    paddingBottom: "0px"
  }}>
      <div className="w-full max-w-[420px] shrink-0 rounded-xl bg-[#0b0e11] border border-white/10" style={{
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderStyle: "none",
      borderRadius: "14px"
    }}>
        
        {/* Header Tabs */}
        <div className="flex h-10 items-center justify-between rounded-t-xl border-b border-white/10 bg-[#0b0e11] overflow-hidden">
          <div className="flex w-full">
            <TabButton active={activeTab === 'Long'} label="Long" onClick={() => setActiveTab('Long')} accentColor="green" />
            <TabButton active={activeTab === 'Short'} label="Short" onClick={() => setActiveTab('Short')} accentColor="green" />
            <TabButton active={activeTab === 'Swap'} label="Swap" onClick={() => setActiveTab('Swap')} />
          </div>
          <div className="flex items-center px-4">
             <button className="p-2 text-gray-400 hover:text-white transition-colors">
               <ChevronDown className="h-4 w-4" />
             </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex flex-col gap-1 p-4" style={{
        width: "320px",
        maxWidth: "320px"
      }}>
          
          {/* Sub Header: Order Type + Icons */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-1 text-[13px] relative">
              <button onClick={() => {
              setOrderType('Market');
              setShowMoreMenu(false);
            }} className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${orderType === 'Market' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}>
                Market
              </button>
              <button onClick={() => {
              setOrderType('Limit');
              setShowMoreMenu(false);
            }} className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${orderType === 'Limit' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}>
                Limit
              </button>
              
              {isSwap ? <button onClick={() => {
              setOrderType('TWAP');
              setShowMoreMenu(false);
            }} className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${orderType === 'TWAP' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}>
                  TWAP
                </button> : <div className="relative">
                  <button onClick={() => setShowMoreMenu(prev => !prev)} className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${['TP/SL', 'StopMarket', 'TWAP'].includes(orderType) ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}>
                      More <ChevronDown className="h-3 w-3" />
                    </button>
                  {showMoreMenu && <div className="absolute z-30 mt-1 w-40 rounded-lg border border-white/10 bg-[#0f1117] shadow-lg">
                      {([['TPSL', 'TP/SL'], ['StopMarket', 'Stop Market'], ['TWAP', 'TWAP']] as const).map(([val, label]) => <button key={val} onClick={() => {
                    setOrderType(val as any);
                    setShowMoreMenu(false);
                  }} className={`flex w-full items-center justify-between px-3 py-2 text-sm text-left hover:bg-white/5 ${orderType === val ? 'text-white' : 'text-gray-400'}`}>
                          <span>{label}</span>
                        </button>)}
                    </div>}
                </div>}
            </div>
            
            <div className="flex items-center gap-3">
              <button className="text-gray-500 hover:text-white transition-colors">
                <Info className="h-4 w-4" />
              </button>
              <button className="text-gray-500 hover:text-white transition-colors">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Inputs */}
          <div className="flex flex-col gap-1.5 relative">
            <TokenInput label={isSwap ? "Pay" : "Pay"} value={payAmount} onChange={val => setPayAmount(val)} tokenIcon={USDCIcon} tokenSymbol="USDC" />
            
            {/* Swap Arrow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <button className="flex h-10 w-10 items-center justify-center rounded-lg border-[3px] border-[#0b0e11] bg-[#15191e] text-gray-400 shadow-lg hover:bg-[#1a1d26] hover:text-white transition-colors">
                <ArrowDown className="h-5 w-5" />
              </button>
            </div>

            <TokenInput label={isSwap ? "Receive" : activeTab} value={longAmount} tokenIcon={BitcoinIcon} tokenSymbol="BTC" subValue={!isSwap ? `${clampedLeverage.toFixed(2)}x` : undefined} readOnly />

            {orderType === 'Limit' && <div className="rounded-lg border border-white/10 bg-[#15191e] p-4 transition-colors hover:bg-[#1a1d26]">
                <div className="mb-2 flex justify-between text-xs text-gray-400">
                  <span>Limit Price</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="text" inputMode="decimal" placeholder="0.0" value={limitPrice} onChange={e => setLimitPrice(e.target.value)} className="w-full min-w-0 bg-transparent text-2xl font-medium text-white placeholder-gray-600 outline-none" />
                  <span className="text-sm text-gray-400">USD</span>
                </div>
              </div>}
          </div>

          {/* Leverage Slider (Hidden for Swap) */}
          {!isSwap && <div className="mt-6 px-1">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400">Leverage</span>
                <div className="rounded bg-white/5 px-2 py-1 text-right text-xs font-mono text-white border border-white/10">
                  {clampedLeverage.toFixed(2)}x
                </div>
              </div>
              
              <div
                className="relative mb-8 h-4 w-full select-none px-2"
                ref={sliderRef}
                onMouseDown={e => {
                  setIsDraggingLeverage(true);
                  updateLeverageFromPosition(e.clientX);
                }}
                onTouchStart={e => {
                  setIsDraggingLeverage(true);
                  updateLeverageFromPosition(e.touches[0].clientX);
                }}
              >
                {/* Rail */}
                <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-white/10" />
                
                {/* Track */}
                <div className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#00ff9d]" style={{
              width: `${leveragePct}%`
            }} />
                
                {/* Handle */}
                <div className="absolute top-1/2 h-4 w-4 -translate-y-1/2 -translate-x-1/2 cursor-grab rounded-full border-2 border-[#00ff9d] bg-[#0b0e11] shadow z-10 hover:scale-110 transition-transform" style={{
              left: `${leveragePct}%`
            }} />

                {/* Marks */}
                <div className="pointer-events-none absolute inset-y-0 left-2 right-2">
                  {marksWithPos.map((m, i) => <SliderMark key={i} label={m.label} position={`${m.pos}%`} active={leveragePct >= m.pos} />)}
                </div>
              </div>
            </div>}

          {/* Footer Info Area */}
          <div className={`mt-4 flex flex-col gap-2.5 rounded-lg p-1 text-[13px] ${isSwap ? 'min-h-[180px]' : ''}`}>
            
            {isSwap ?
          // Swap Footer Content
          <>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Min. Receive</span>
                  <span className="text-white">-</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Price Impact / Fees</span>
                  <span className="text-gray-500">
                    <span className="text-white">0.000%</span> / <span className="text-white">0.000%</span>
                  </span>
                </div>

                <div className="flex items-center justify-between cursor-pointer group py-1" onClick={() => setIsExecDetailsOpen(!isExecDetailsOpen)}>
                  <span className="text-gray-500 group-hover:text-white transition-colors">Execution Details</span>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isExecDetailsOpen ? 'rotate-180' : ''}`} />
                </div>
                
                {isExecDetailsOpen && <div className="flex flex-col gap-2.5 pl-0 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Fees</span>
                      <span className="text-white">-</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                          <span className="text-gray-500">Network Fee</span>
                          <Info className="h-3 w-3 text-gray-500" />
                      </div>
                      <span className="text-white">-$0.24</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Spread</span>
                      <span className="text-white">0.00%</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Allowed Slippage</span>
                        <Info className="h-3 w-3 text-gray-500" />
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="rounded bg-white/5 px-2 py-0.5 text-xs text-gray-500 hover:text-white">-</button>
                        <span className="text-white">1%</span>
                      </div>
                    </div>
                  </div>}

                {isWalletConnected ? <button disabled={!(hasPay && (orderType !== 'Limit' || hasLimitPrice))} className={`mt-4 w-full h-11 rounded-lg text-sm font-semibold transition-colors ${hasPay && (orderType !== 'Limit' || hasLimitPrice) ? 'bg-[#15F46F] text-[#06171E] hover:bg-[#12d160]' : 'bg-white/5 text-gray-500 cursor-not-allowed'}`}>
                    Trade
                  </button> : <button onClick={onConnectWallet} className="mt-4 w-full h-11 rounded-lg bg-[#15F46F] hover:bg-[#12d160] text-[#06171E] text-sm font-semibold transition-colors">
                    Connect Wallet
                  </button>}
              </> :
          // Long/Short Footer Content (Existing)
          <>
                <div className="flex items-baseline justify-between">
                  <span className="text-gray-500">Pool</span>
                  <div className="flex items-center gap-1 text-gray-500 hover:text-white cursor-pointer group">
                    <span className="font-medium text-white group-hover:text-[#00ff9d] transition-colors">BTC-USDC</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </div>
                </div>
                
                <div className="flex items-baseline justify-between">
                  <span className="border-b border-dashed border-gray-600/40 text-gray-500 cursor-help">Collateral In</span>
                  <div className="flex items-center gap-1 text-gray-500 hover:text-white cursor-pointer group">
                    <span className="font-medium text-white group-hover:text-[#00ff9d] transition-colors">USDC</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </div>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-gray-500">Liquidation Price</span>
                  <span className="text-white">-</span>
                </div>
                
                <div className="flex items-baseline justify-between">
                  <span className="border-b border-dashed border-gray-600/40 text-gray-500 cursor-help">Price Impact / Fees</span>
                  <div className="text-right text-gray-500">
                    <span className="text-white">0.000%</span> / <span className="text-white">0.000%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between cursor-pointer group">
                  <span className="text-gray-500 group-hover:text-[#00ff9d] transition-colors">Execution Details</span>
                  <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-[#00ff9d] transition-colors" />
                </div>

                {isWalletConnected ? <button disabled={!(hasPay && (orderType !== 'Limit' || hasLimitPrice))} className={`mt-4 w-full h-11 rounded-lg text-sm font-semibold transition-colors ${hasPay && (orderType !== 'Limit' || hasLimitPrice) ? 'bg-[#15F46F] text-[#06171E] hover:bg-[#12d160]' : 'bg-white/5 text-gray-500 cursor-not-allowed'}`}>
                    Trade
                  </button> : <button onClick={onConnectWallet} className="mt-4 w-full h-11 rounded-lg bg-[#15F46F] hover:bg-[#12d160] text-[#06171E] text-sm font-semibold transition-colors">
                    Connect Wallet
                  </button>}
              </>}

          </div>

        </div>
      </div>
    </div>;
};