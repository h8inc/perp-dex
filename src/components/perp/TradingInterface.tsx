import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronDown, Settings, Maximize2, Share2, Camera, Layout, Search, Bell, Menu, Wallet, ArrowUpDown, Plus, Minus, MoreHorizontal, X, Info, History, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { TradingBoxPrimitive } from './TradingBoxPrimitive';
import { TradingDashboard } from '../generated/TradingDashboard';
import { getTokenIcon } from './TokenIcons';
import { SidebarNavigation } from '../generated/SidebarNavigation';

// --- Types & Mock Data ---

type OrderBookItem = {
  price: number;
  size: number;
  total: number;
  type: 'bid' | 'ask';
};
const generateOrderBook = (levels: number = 15): {
  asks: OrderBookItem[];
  bids: OrderBookItem[];
} => {
  const currentPrice = 90528;
  const asks: OrderBookItem[] = [];
  const bids: OrderBookItem[] = [];
  for (let i = 0; i < levels; i++) {
    const askPrice = currentPrice + i * 10 + Math.random() * 5;
    const bidPrice = currentPrice - i * 10 - Math.random() * 5;
    asks.push({
      price: askPrice,
      size: Math.random() * 2 + 0.1,
      total: 0,
      // calculated later
      type: 'ask'
    });
    bids.push({
      price: bidPrice,
      size: Math.random() * 2 + 0.1,
      total: 0,
      // calculated later
      type: 'bid'
    });
  }

  // Calculate totals
  let askTotal = 0;
  asks.forEach(a => {
    askTotal += a.size;
    a.total = askTotal;
  });
  let bidTotal = 0;
  bids.forEach(b => {
    bidTotal += b.size;
    b.total = bidTotal;
  });
  return {
    asks: asks.reverse(),
    bids
  };
};
const generateChartData = () => {
  const data: Array<{
    time: number;
    price: number;
    volume: number;
    ma7: number;
    ma25: number;
  }> = [];
  let price = 90000;
  for (let i = 0; i < 100; i++) {
    price = price + (Math.random() - 0.5) * 200;
    data.push({
      time: i,
      price: price,
      volume: Math.random() * 100,
      ma7: price + (Math.random() - 0.5) * 50,
      ma25: price + (Math.random() - 0.5) * 100
    });
  }
  return data;
};
const chartData = generateChartData();
const {
  asks,
  bids
} = generateOrderBook();
const TIME_FRAMES = ['1m', '15m', '30m', '1h', '4h', 'D', 'W'];
const TABS_BOTTOM = ['Account', 'Balances', 'Positions', 'Orders', 'TWAP', 'Trades', 'Funding', 'Realized PnL', 'Orders History', 'Transfers'];

// --- Components ---

const CandlestickChart = ({ data }: { data: Array<{ time: number; price: number; volume: number; ma7: number; ma25: number }> }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Convert price data to OHLC (simplified - using price as close, generating OHLC)
  const ohlcData = useMemo(() => {
    return data.map((d, i) => {
      const open = i === 0 ? d.price : data[i - 1].price;
      const close = d.price;
      const high = Math.max(open, close) + Math.random() * 50;
      const low = Math.min(open, close) - Math.random() * 50;
      return { ...d, open, high, low, close };
    });
  }, [data]);

  if (dimensions.width === 0 || dimensions.height === 0) {
    return <div ref={containerRef} className="w-full h-full" />;
  }

  const padding = { top: 20, right: 40, bottom: 20, left: 20 };
  const chartWidth = dimensions.width - padding.left - padding.right;
  const chartHeight = dimensions.height - padding.top - padding.bottom;
  const candleWidth = chartWidth / ohlcData.length * 0.8;
  const candleGap = chartWidth / ohlcData.length * 0.2;

  const allPrices = ohlcData.flatMap(d => [d.high, d.low]);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const priceRange = maxPrice - minPrice || 1;

  const priceToY = (price: number) => {
    return chartHeight - ((price - minPrice) / priceRange) * chartHeight;
  };

  return (
    <div ref={containerRef} className="w-full h-full">
      <svg width={dimensions.width} height={dimensions.height} className="w-full h-full">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = padding.top + ratio * chartHeight;
          return (
            <line
              key={ratio}
              x1={padding.left}
              y1={y}
              x2={padding.left + chartWidth}
              y2={y}
              stroke="#ffffff10"
              strokeDasharray="3 3"
            />
          );
        })}

        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const price = minPrice + (1 - ratio) * priceRange;
          const y = padding.top + ratio * chartHeight;
          return (
            <text
              key={ratio}
              x={padding.left + chartWidth + 8}
              y={y + 4}
              fill="#6b7280"
              fontSize="10"
              textAnchor="start"
            >
              {price.toFixed(0)}
            </text>
          );
        })}

        {/* Candlesticks */}
        {ohlcData.map((d, i) => {
          const x = padding.left + i * (candleWidth + candleGap) + candleGap / 2;
          const isBullish = d.close >= d.open;
          const bodyTop = priceToY(Math.max(d.open, d.close));
          const bodyBottom = priceToY(Math.min(d.open, d.close));
          const bodyHeight = Math.max(1, bodyBottom - bodyTop);
          const wickTop = priceToY(d.high);
          const wickBottom = priceToY(d.low);

          return (
            <g key={i}>
              {/* Wick */}
              <line
                x1={x + candleWidth / 2}
                y1={wickTop}
                x2={x + candleWidth / 2}
                y2={wickBottom}
                stroke={isBullish ? '#00ff9d' : '#ff4d4d'}
                strokeWidth="1"
              />
              {/* Body */}
              <rect
                x={x}
                y={bodyTop}
                width={candleWidth}
                height={bodyHeight}
                fill={isBullish ? '#00ff9d' : '#ff4d4d'}
                stroke={isBullish ? '#00ff9d' : '#ff4d4d'}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const MobileTopBar = ({
  onOpenNav
}: {
  onOpenNav: () => void;
}) => {
  return <div className="md:hidden flex items-center justify-between h-14 px-4 border-b border-white/10 bg-[#0b0e11]">
      <img src="/logo.svg" alt="Extended" className="h-5 w-auto select-none" />
      <button onClick={onOpenNav} className="p-2 text-white hover:text-[#15F46F] transition-colors bg-white/5 hover:bg-white/10 rounded-lg" aria-label="Open navigation">
        <Menu className="w-5 h-5" />
          </button>
    </div>;
};
const MarketTicker = ({
  rightActions
}: {
  rightActions?: React.ReactNode;
}) => {
  return (
    <>
      {/* Mobile: Compact Ticker */}
      <div className="md:hidden flex h-14 items-center justify-between gap-3 border-b border-white/10 bg-[#0b0e11] px-4 sm:px-6 text-xs">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {getTokenIcon('BTC', 24)}
          <span className="text-sm font-medium text-white whitespace-nowrap">BTC</span>
          <div className="flex items-center text-gray-400">
            <ArrowUpDown size={12} />
          </div>
          <span className="text-sm font-medium text-white ml-1">$86,210</span>
          <span className="text-[#00ff9d] text-xs ml-1">/ 0.36%</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {rightActions}
        <button className="p-1.5 hover:bg-white/5 rounded-full shrink-0">
          <MoreHorizontal size={16} className="text-gray-400" />
        </button>
        </div>
      </div>

      {/* Desktop: Full Ticker */}
      <div className="hidden md:flex h-14 items-center border-b border-white/10 bg-[#0b0e11] px-4 sm:px-6 text-xs">
        {/* Scrollable stats strip */}
        <div className="flex items-center gap-6 min-w-0 flex-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 pr-4 border-r border-white/10 min-w-fit">
          <div className="flex items-center gap-1.5 cursor-pointer hover:bg-white/5 p-1 rounded">
            {getTokenIcon('BTC', 20)}
            <span className="text-base font-bold text-white">BTC / USD</span>
            <ChevronDown size={14} />
          </div>
        </div>
        
          <div className="flex flex-col min-w-fit">
          <span className="text-lg font-medium text-white">90,528 USD</span>
          <span className="text-[#00ff9d] text-[10px]">$90,528</span>
        </div>

          <div className="flex flex-col gap-0.5 min-w-fit">
          <span className="text-gray-500 text-[10px]">MARK PRICE</span>
          <span className="text-white">90,523 USD</span>
        </div>

          <div className="flex flex-col gap-0.5 min-w-fit">
          <span className="text-gray-500 text-[10px]">INDEX PRICE</span>
          <span className="text-white">90,569 USD</span>
        </div>

          <div className="flex flex-col gap-0.5 min-w-fit">
          <span className="text-gray-500 text-[10px]">FUNDING RATE</span>
          <div className="flex gap-1">
            <span className="text-[#00ff9d]">0.0003%</span>
            <span className="text-gray-400">47:32</span>
          </div>
        </div>

          <div className="flex flex-col gap-0.5 min-w-fit">
          <span className="text-gray-500 text-[10px]">24H CHANGE</span>
          <span className="text-[#ff4d4d]">-1,847 USD -2.00%</span>
        </div>

          <div className="flex flex-col gap-0.5 min-w-fit">
          <span className="text-gray-500 text-[10px]">OPEN INTEREST</span>
          <span className="text-white">29,808,455 USD</span>
        </div>

          <div className="flex flex-col gap-0.5 min-w-fit">
          <span className="text-gray-500 text-[10px]">24H VOLUME</span>
          <span className="text-white">452,119,618 USD</span>
          </div>
        </div>

        {/* Fixed right slot for actions (prevents button shifting) */}
        {rightActions && <div className="ml-4 flex items-center gap-2 shrink-0">
            {rightActions}
          </div>}
      </div>
    </>
  );
};
const ChartSection = () => {
  const [timeframe, setTimeframe] = useState('1h');
  const [isStatsSheetOpen, setIsStatsSheetOpen] = useState(false);
  
  return (
    <>
      <div className="flex flex-1 flex-col border-r border-white/10 bg-[#0b0e11]">
        {/* Chart Toolbar */}
        <div className="flex h-10 items-center justify-between border-b border-white/10 px-2">
          <div className="flex items-center gap-1">
            {TIME_FRAMES.map(tf => <button key={tf} onClick={() => setTimeframe(tf)} className={cn("px-2 py-1 text-xs rounded hover:bg-white/5 transition-colors", timeframe === tf ? "text-[#00ff9d] bg-white/5" : "text-gray-400")}>
                {tf}
              </button>)}
            <div className="h-4 w-[1px] bg-white/10 mx-2" />
            <button className="p-1 hover:bg-white/5 rounded text-gray-400"><Layout size={14} /></button>
            <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white">
              <span>Indicators</span>
            </button>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
             <button className="p-1 hover:bg-white/5 rounded"><Camera size={14} /></button>
             <button className="p-1 hover:bg-white/5 rounded"><Maximize2 size={14} /></button>
          </div>
        </div>

        {/* Main Chart Area */}
        <div className="relative flex-1 min-h-0">
          <div className="absolute inset-0 p-4 flex flex-col min-h-0">
            <div className="flex items-center gap-4 text-xs text-gray-400 mb-2 shrink-0">
              <span>BTC-USD (Last)</span>
              <span>1h</span>
              <span>Extended</span>
              {/* Mobile: Pulsing Green Dot */}
              <button
                onClick={() => setIsStatsSheetOpen(true)}
                className="md:hidden p-1.5 hover:bg-white/5 rounded-full transition-colors"
                aria-label="Open price stats"
              >
                <span className="w-3 h-3 rounded-full bg-[#00ff9d] animate-pulse block"></span>
              </button>
              {/* Desktop: OHLC Stats */}
              <div className="hidden md:flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-[#00ff9d]">O 90548</span>
                <span className="text-[#ff4d4d]">H 90570</span>
                <span className="text-[#ff4d4d]">L 90500</span>
                <span className="text-white">C 90528</span>
              </div>
            </div>
          
            <div className="flex-1 min-h-0">
            <CandlestickChart data={chartData} />
          </div>
        </div>
        
        {/* Floating Tools (Left Side) */}
        <div className="absolute left-2 top-12 flex flex-col gap-1 bg-[#15191e] border border-white/5 rounded p-1">
          {[1, 2, 3, 4, 5, 6].map(i => <button key={i} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white">
                <Layout size={14} />
             </button>)}
        </div>
      </div>
    </div>

    {/* Mobile: Bottom Sheet with OHLC Stats */}
    {isStatsSheetOpen && (
      <>
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsStatsSheetOpen(false)}
        />
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0b0e11] border-t border-white/10 rounded-t-2xl md:hidden max-h-[50vh] overflow-y-auto">
          <div className="sticky top-0 bg-[#0b0e11] border-b border-white/10 px-4 py-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Price Stats</h3>
            <button
              onClick={() => setIsStatsSheetOpen(false)}
              className="p-1 hover:bg-white/5 rounded-full"
              aria-label="Close"
            >
              <X size={18} className="text-gray-400" />
            </button>
          </div>
          <div className="px-4 py-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-sm font-medium text-gray-400">BTC-USD</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-gray-500 text-[10px]">OPEN</span>
                <span className="text-[#00ff9d] text-sm font-medium">90,548</span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-gray-500 text-[10px]">HIGH</span>
                <span className="text-[#ff4d4d] text-sm font-medium">90,570</span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-gray-500 text-[10px]">LOW</span>
                <span className="text-[#ff4d4d] text-sm font-medium">90,500</span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-gray-500 text-[10px]">CLOSE</span>
                <span className="text-white text-sm font-medium">90,528</span>
              </div>
            </div>
          </div>
        </div>
      </>
    )}
    </>
  );
};
const OrderBook = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [rowsPerSide, setRowsPerSide] = useState(14);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const update = () => {
      const h = el.clientHeight;
      // Approximate fixed chrome height in px: header (40) + col header (~24) + mid price (~40) + bottom controls (~44) + padding (~16)
      const chrome = 40 + 24 + 40 + 44 + 16;
      const rowH = 18; // px-3 py-0.5 text-xs rows are ~18px tall
      const usable = Math.max(0, h - chrome);
      const next = Math.max(10, Math.min(40, Math.floor(usable / 2 / rowH)));
      setRowsPerSide(next);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const {
    asks,
    bids
  } = useMemo(() => generateOrderBook(rowsPerSide * 2 + 6), [rowsPerSide]);

  return <div ref={containerRef} className="flex h-full min-h-0 w-[280px] flex-col border-r border-white/10 bg-[#0b0e11]">
      <div className="flex h-10 items-center justify-between border-b border-white/10 px-3">
        <div className="flex gap-4 text-xs font-medium">
          <button className="text-white border-b-2 border-[#00ff9d] pb-2.5 mt-2.5">Order Book</button>
          <button className="text-gray-500 hover:text-white pb-2.5 mt-2.5">Trades</button>
        </div>
        <MoreHorizontal size={14} className="text-gray-400" />
      </div>

      <div className="flex items-center justify-between px-3 py-2 text-[10px] text-gray-500 uppercase">
        <span>Price (USD)</span>
        <span className="text-right">Size (BTC)</span>
        <span className="text-right">Total (BTC)</span>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Asks (Red) */}
        <div className="flex-1 overflow-hidden flex flex-col justify-end">
          {asks.slice(0, rowsPerSide).map((ask, i) => <div key={i} className="relative flex items-center justify-between px-3 py-0.5 text-xs hover:bg-white/5 cursor-pointer group">
              <span className="text-[#ff4d4d] z-10">{ask.price.toFixed(0)}</span>
              <span className="text-gray-300 z-10 group-hover:text-white">{ask.size.toFixed(4)}</span>
              <span className="text-gray-500 z-10">{ask.total.toFixed(4)}</span>
              <div className="absolute right-0 top-0 bottom-0 bg-[#ff4d4d]/10 z-0 transition-all" style={{
            width: `${Math.min(ask.size / 5 * 100, 100)}%`
          }} />
            </div>)}
        </div>

        {/* Current Price Middle Section */}
        <div className="flex items-center justify-between bg-[#15191e] px-3 py-2 my-1 border-y border-white/5">
           <div className="flex items-center gap-2">
             <span className="text-lg font-bold text-[#00ff9d]">90,528</span>
             <ArrowUpDown size={12} className="text-[#00ff9d]" />
           </div>
           <span className="text-[10px] text-gray-500">Spread: 0.01%</span>
        </div>

        {/* Bids (Green) */}
        <div className="flex-1 overflow-hidden">
          {bids.slice(0, rowsPerSide).map((bid, i) => <div key={i} className="relative flex items-center justify-between px-3 py-0.5 text-xs hover:bg-white/5 cursor-pointer group">
              <span className="text-[#00ff9d] z-10">{bid.price.toFixed(0)}</span>
              <span className="text-gray-300 z-10 group-hover:text-white">{bid.size.toFixed(4)}</span>
              <span className="text-gray-500 z-10">{bid.total.toFixed(4)}</span>
              <div className="absolute right-0 top-0 bottom-0 bg-[#00ff9d]/10 z-0 transition-all" style={{
            width: `${Math.min(bid.size / 5 * 100, 100)}%`
          }} />
            </div>)}
        </div>
      </div>
      
      {/* Bottom controls of orderbook */}
      <div className="p-2 border-t border-white/10 flex justify-between items-center bg-[#0b0e11]">
         <div className="flex gap-1">
             <button className="bg-white/5 p-1 rounded hover:bg-white/10 text-xs text-gray-400">All</button>
             <button className="bg-white/5 p-1 rounded hover:bg-white/10 text-xs text-gray-400">Bids</button>
             <button className="bg-white/5 p-1 rounded hover:bg-white/10 text-xs text-gray-400">Asks</button>
         </div>
         <div className="flex items-center gap-1 text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">
             <span>10</span>
             <ChevronDown size={10} />
         </div>
      </div>
    </div>;
};
const BottomPanel = ({
  isWalletConnected,
  onConnectWallet
}: {
  isWalletConnected: boolean;
  onConnectWallet: () => void;
}) => {
  const [activeTab, setActiveTab] = useState('Account');
  const accountStats = React.useMemo(() => ({
    pnl: (Math.random() * 2 - 1).toFixed(2) + ' USD',
    equity: (10000 + Math.random() * 5000).toFixed(2) + ' USD',
    marginRatio: (Math.random() * 5).toFixed(2) + '%',
    exposure: (Math.random() * 20000).toFixed(2) + ' USD',
    accountLeverage: (Math.random() * 10).toFixed(1)
  }), [isWalletConnected]);
  return <div className="shrink-0 flex flex-col bg-[#0b0e11] border-t border-white/10 h-[220px] md:h-[240px] lg:h-[280px] xl:h-[320px] min-h-0">
        <div className="flex items-center gap-6 px-4 pt-7 border-b border-white/10 overflow-x-auto no-scrollbar">
            {TABS_BOTTOM.map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={cn("py-3 text-xs font-medium whitespace-nowrap transition-colors border-b-2", activeTab === tab ? "text-white border-white" : "text-gray-500 border-transparent hover:text-gray-300")}>
                    {tab}
                </button>)}
        </div>
        
        {/* Content Area */}
        <div className="flex-1 p-0 overflow-hidden">
            {activeTab === 'Account' && <div className="px-4 py-4">
                    {!isWalletConnected ? <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="text-gray-400 text-sm">Connect your wallet to view account stats.</div>
                        <button onClick={onConnectWallet} className="flex items-center gap-2 bg-[#15F46F] hover:bg-[#12d160] text-[#06171E] px-4 py-2 md:px-6 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap shrink-0">
                          <Wallet size={14} />
                          <span className="hidden md:inline">Connect Wallet</span>
                          <span className="md:hidden">Connect</span>
                        </button>
                      </div> : <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <span className="text-gray-400">Unrealized PnL</span>
                        <span className="text-right text-white">{accountStats.pnl}</span>
                        <span className="text-gray-400">Equity</span>
                        <span className="text-right text-white">{accountStats.equity}</span>
                        <span className="text-gray-400">Margin Ratio</span>
                        <span className="text-right text-[#00ff9d]">{accountStats.marginRatio}</span>
                        <span className="text-gray-400">Exposure</span>
                        <span className="text-right text-white">{accountStats.exposure}</span>
                        <span className="text-gray-400">Account Leverage</span>
                        <span className="text-right text-white">{accountStats.accountLeverage}</span>
                      </div>}
                  </div>}

            {activeTab === 'Balances' && <div className="w-full">
                    <div className="grid grid-cols-6 px-4 py-2 text-[10px] text-gray-500 uppercase bg-[#15191e]/50">
                        <div>Coin</div>
                        <div className="text-right">Balance</div>
                        <div className="text-right">Index Price</div>
                        <div className="text-right">Notional Value</div>
                        <div className="text-right">Contrib. Factor</div>
                        <div className="text-right">Available to Withdraw</div>
                    </div>
                    {/* Empty State */}
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-gray-500 text-xs mb-4">No balance data.</p>
                    </div>
                </div>}
        </div>
    </div>;
};

// @component: TradingInterface
export const TradingInterface = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [activeView, setActiveView] = useState<'trade' | 'portfolio'>('trade');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    const applyFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'portfolio') setActiveView('portfolio');
      else setActiveView('trade');
    };
    applyFromHash();
    window.addEventListener('hashchange', applyFromHash);
    return () => window.removeEventListener('hashchange', applyFromHash);
  }, []);

  const navigateTo = (id: 'trade' | 'portfolio') => {
    window.location.hash = id;
  };

  const walletAction = !isWalletConnected ? <button onClick={() => setIsWalletConnected(true)} className="flex items-center gap-2 bg-[#15F46F] hover:bg-[#12d160] text-[#06171E] px-4 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap">
        <Wallet size={14} />
        Connect Wallet
      </button> : <button onClick={() => setIsWalletConnected(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-white border border-white/10 hover:border-white/30 hover:bg-white/5 transition-colors cursor-pointer shrink-0 whitespace-nowrap">
        Switch to guest
      </button>;

  // @return
  return <div className="flex flex-col h-screen w-full bg-[#0b0e11] text-white overflow-hidden font-sans selection:bg-[#00ff9d]/30">
      <MobileTopBar onOpenNav={() => setIsMobileNavOpen(true)} />

      {/* Mobile nav drawer */}
      {isMobileNavOpen && <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsMobileNavOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-[240px]">
            <SidebarNavigation
              className="h-full"
              activeItemId={activeView === 'portfolio' ? 'portfolio' : 'trade'}
              onNavigate={id => {
                if (id === 'portfolio') navigateTo('portfolio');
                if (id === 'trade') navigateTo('trade');
                setIsMobileNavOpen(false);
              }}
              footerActions={isCollapsed => <>
                  <button className={cn("h-10 rounded-xl text-[#9497a9] hover:bg-[#ffffff0a] hover:text-white transition-all duration-200 flex items-center", isCollapsed ? "w-10 justify-center px-0" : "w-full px-3 gap-3")}>
                    <Bell size={18} />
                    {!isCollapsed && <span className="text-sm font-medium">Notifications</span>}
                  </button>
                  <button className={cn("h-10 rounded-xl text-[#9497a9] hover:bg-[#ffffff0a] hover:text-white transition-all duration-200 flex items-center", isCollapsed ? "w-10 justify-center px-0" : "w-full px-3 gap-3")}>
                    <Settings size={18} />
                    {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
                  </button>
                </>}
            />
          </div>
        </div>}

      <div className="flex flex-1 min-h-0">
        {/* Desktop sidebar navigation */}
        <SidebarNavigation
          className="hidden md:flex shrink-0"
          activeItemId={activeView === 'portfolio' ? 'portfolio' : 'trade'}
          onNavigate={id => {
            if (id === 'portfolio') navigateTo('portfolio');
            if (id === 'trade') navigateTo('trade');
          }}
          footerActions={isCollapsed => <>
              <button className={cn("h-10 rounded-xl text-[#9497a9] hover:bg-[#ffffff0a] hover:text-white transition-all duration-200 flex items-center", isCollapsed ? "w-10 justify-center px-0" : "w-full px-3 gap-3")}>
                <Bell size={18} />
                {!isCollapsed && <span className="text-sm font-medium">Notifications</span>}
              </button>
              <button className={cn("h-10 rounded-xl text-[#9497a9] hover:bg-[#ffffff0a] hover:text-white transition-all duration-200 flex items-center", isCollapsed ? "w-10 justify-center px-0" : "w-full px-3 gap-3")}>
                <Settings size={18} />
                {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
              </button>
            </>}
        />

        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col min-h-0">
          {activeView === 'portfolio' ? <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-gutter:stable]">
              <TradingDashboard embedded headerActions={walletAction} />
            </div> : <>
              <MarketTicker rightActions={walletAction} />
              
              <div className="flex flex-1 min-h-0 overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable] flex-col lg:flex-row">
        {/* Left Column: Chart & Bottom Panel */}
                <div className="flex flex-1 flex-col min-w-0 min-h-0">
          <ChartSection />
          <BottomPanel isWalletConnected={isWalletConnected} onConnectWallet={() => setIsWalletConnected(true)} />
        </div>

        {/* Middle Column: Order Book */}
                <div className="hidden lg:block border-l border-white/10 w-[280px] shrink-0 min-h-0">
          <OrderBook />
        </div>

        {/* Right Column: Order Entry */}
                <div className="hidden lg:flex flex-col border-l border-white/10 bg-[#0b0e11] lg:flex-[0.32] lg:min-w-[360px] lg:max-w-[520px] min-h-0">
          <TradingBoxPrimitive isWalletConnected={isWalletConnected} onConnectWallet={() => setIsWalletConnected(true)} onDisconnect={() => setIsWalletConnected(false)} />
        </div>
      </div>

      {/* Mobile bottom sheet for TradingBox */}
      <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
        <TradingBoxPrimitive
          isMobileSheet
          isSheetOpen={isMobileSheetOpen}
          onToggleSheet={() => setIsMobileSheetOpen(o => !o)}
          isWalletConnected={isWalletConnected}
          onConnectWallet={() => setIsWalletConnected(true)}
          onDisconnect={() => setIsWalletConnected(false)}
        />
              </div>
            </>}
      </div>
      </div>
    </div>;
};