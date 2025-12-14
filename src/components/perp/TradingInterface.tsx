import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine } from 'recharts';
import { ChevronDown, Settings, Maximize2, Share2, Camera, Layout, Search, Bell, Menu, Wallet, ArrowUpDown, Plus, Minus, MoreHorizontal, Info, History, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { TradingBox } from './TradingBox';
import { BitcoinIcon } from './TokenIcons';

// --- Types & Mock Data ---

type OrderBookItem = {
  price: number;
  size: number;
  total: number;
  type: 'bid' | 'ask';
};
const generateOrderBook = (): {
  asks: OrderBookItem[];
  bids: OrderBookItem[];
} => {
  const currentPrice = 90528;
  const asks: OrderBookItem[] = [];
  const bids: OrderBookItem[] = [];
  for (let i = 0; i < 15; i++) {
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

const Header = ({
  isWalletConnected,
  onConnect,
  onDisconnect
}: {
  isWalletConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}) => <header className="flex h-12 items-center justify-between border-b border-white/10 bg-[#0b0e11] px-4 text-sm font-medium text-gray-400">
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2 select-none">
        <div className="text-[#15F46F]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
          </svg>
        </div>
        <span className="text-white text-lg font-normal tracking-wide font-sans">extended</span>
      </div>
      <nav className="hidden md:flex items-center gap-4">
        <a href="#" className="text-white hover:text-[#00ff9d]">Trade</a>
        <a href="#" className="hover:text-white">Portfolio</a>
        <a href="#" className="hover:text-white">Vault</a>
        <a href="#" className="hover:text-white">Funding</a>
        <a href="#" className="hover:text-white">Refer</a>
        <a href="#" className="hover:text-white">Points</a>
        <a href="#" className="hover:text-white">Leaderboard</a>
        <a href="#" className="hover:text-white">More</a>
      </nav>
    </div>
    <div className="flex items-center gap-3">
      <div className="hidden md:flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" style={{
        display: "none"
      }}></span>
        <span className="text-xs text-green-500" style={{
        display: "none"
      }}>Connected</span>
      </div>
      <button className="p-2 hover:bg-white/5 rounded-full"><Bell size={16} /></button>
      <button className="p-2 hover:bg-white/5 rounded-full"><Settings size={16} /></button>
      {!isWalletConnected ? <button onClick={onConnect} className="flex items-center gap-2 bg-[#15F46F] hover:bg-[#12d160] text-[#06171E] px-4 h-9 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0">
          <Wallet size={14} />
          Connect Wallet
        </button> : <button onClick={onDisconnect} className="flex items-center gap-2 px-3 h-9 rounded-lg text-sm font-medium text-white border border-white/10 hover:border-white/30 hover:bg-white/5 transition-colors cursor-pointer shrink-0">
          Switch to guest
        </button>}
    </div>
  </header>;
const MarketTicker = () => <div className="flex h-14 items-center gap-6 border-b border-white/10 bg-[#0b0e11] px-4 text-xs overflow-x-auto no-scrollbar">
    <div className="flex items-center gap-2 pr-4 border-r border-white/10 min-w-fit">
      <div className="flex items-center gap-1.5 cursor-pointer hover:bg-white/5 p-1 rounded">
        <BitcoinIcon size={20} />
        <span className="text-base font-bold text-white">BTC / USD</span>
        <ChevronDown size={14} />
      </div>
    </div>
    
    <div className="flex flex-col">
      <span className="text-lg font-bold text-white">90,528 USD</span>
      <span className="text-[#00ff9d] text-[10px]">$90,528</span>
    </div>

    <div className="flex flex-col gap-0.5">
      <span className="text-gray-500 text-[10px]">MARK PRICE</span>
      <span className="text-white">90,523 USD</span>
    </div>

    <div className="flex flex-col gap-0.5">
      <span className="text-gray-500 text-[10px]">INDEX PRICE</span>
      <span className="text-white">90,569 USD</span>
    </div>

    <div className="flex flex-col gap-0.5">
      <span className="text-gray-500 text-[10px]">FUNDING RATE</span>
      <div className="flex gap-1">
        <span className="text-[#00ff9d]">0.0003%</span>
        <span className="text-gray-400">47:32</span>
      </div>
    </div>

    <div className="flex flex-col gap-0.5">
      <span className="text-gray-500 text-[10px]">24H CHANGE</span>
      <span className="text-[#ff4d4d]">-1,847 USD -2.00%</span>
    </div>

    <div className="flex flex-col gap-0.5">
      <span className="text-gray-500 text-[10px]">OPEN INTEREST</span>
      <span className="text-white">29,808,455 USD</span>
    </div>

     <div className="flex flex-col gap-0.5">
      <span className="text-gray-500 text-[10px]">24H VOLUME</span>
      <span className="text-white">452,119,618 USD</span>
    </div>
  </div>;
const ChartSection = () => {
  const [timeframe, setTimeframe] = useState('1h');
  return <div className="flex flex-1 flex-col border-r border-white/10 bg-[#0b0e11]">
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
      <div className="relative flex-1 min-h-[400px]">
        <div className="absolute inset-0 p-4">
          <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
            <span>BTC-USD (Last)</span>
            <span>1h</span>
            <span>Extended</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-[#00ff9d]">O 90548</span>
              <span className="text-[#ff4d4d]">H 90570</span>
              <span className="text-[#ff4d4d]">L 90500</span>
              <span className="text-white">C 90528</span>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#00ff9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="time" hide />
              <YAxis orientation="right" domain={['auto', 'auto']} tick={{
              fill: '#6b7280',
              fontSize: 10
            }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{
              backgroundColor: '#1f2937',
              borderColor: '#374151',
              color: '#fff'
            }} itemStyle={{
              color: '#fff'
            }} labelStyle={{
              display: 'none'
            }} />
              <Area type="monotone" dataKey="price" stroke="#00ff9d" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
              <Line type="monotone" dataKey="ma7" stroke="#3b82f6" strokeWidth={1} dot={false} strokeOpacity={0.5} />
               <Line type="monotone" dataKey="ma25" stroke="#eab308" strokeWidth={1} dot={false} strokeOpacity={0.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Floating Tools (Left Side) */}
        <div className="absolute left-2 top-12 flex flex-col gap-1 bg-[#15191e] border border-white/5 rounded p-1">
          {[1, 2, 3, 4, 5, 6].map(i => <button key={i} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white">
                <Layout size={14} />
             </button>)}
        </div>
      </div>
    </div>;
};
const OrderBook = () => {
  return <div className="flex w-[280px] flex-col border-r border-white/10 bg-[#0b0e11]">
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
          {asks.slice(0, 14).map((ask, i) => <div key={i} className="relative flex items-center justify-between px-3 py-0.5 text-xs hover:bg-white/5 cursor-pointer group">
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
          {bids.slice(0, 14).map((bid, i) => <div key={i} className="relative flex items-center justify-between px-3 py-0.5 text-xs hover:bg-white/5 cursor-pointer group">
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
  return <div className="flex-1 flex flex-col bg-[#0b0e11] min-h-[200px] border-t border-white/10">
        <div className="flex items-center gap-6 px-4 pt-7 border-b border-white/10 overflow-x-auto no-scrollbar">
            {TABS_BOTTOM.map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={cn("py-3 text-xs font-medium whitespace-nowrap transition-colors border-b-2", activeTab === tab ? "text-white border-white" : "text-gray-500 border-transparent hover:text-gray-300")}>
                    {tab}
                </button>)}
        </div>
        
        {/* Content Area */}
        <div className="flex-1 p-0 overflow-auto">
            {activeTab === 'Account' && <div className="px-4 py-4">
                    {!isWalletConnected ? <div className="flex justify-between items-center">
                        <div className="text-gray-400 text-sm">Connect your wallet to view account stats.</div>
                        <button onClick={onConnectWallet} className="h-9 px-4 rounded-lg bg-[#15F46F] hover:bg-[#12d160] text-[#06171E] text-sm font-medium transition-colors">
                          Connect Wallet
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

  // @return
  return <div className="flex flex-col h-screen w-full bg-[#0b0e11] text-white overflow-hidden font-sans selection:bg-[#00ff9d]/30">
      <Header isWalletConnected={isWalletConnected} onConnect={() => setIsWalletConnected(true)} onDisconnect={() => setIsWalletConnected(false)} />
      <MarketTicker />
      
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Left Column: Chart & Bottom Panel */}
        <div className="flex w-full lg:flex-[0.58] flex-col min-w-0">
          <ChartSection />
          <BottomPanel isWalletConnected={isWalletConnected} onConnectWallet={() => setIsWalletConnected(true)} />
        </div>

        {/* Middle Column: Order Book */}
        <div className="hidden lg:block border-l border-white/10">
          <OrderBook />
        </div>

        {/* Right Column: Order Entry */}
        <div className="hidden lg:block lg:flex-[0.42] lg:min-w-[420px] lg:max-w-none border-l border-white/10 bg-[#0b0e11] overflow-y-auto">
          <TradingBox isWalletConnected={isWalletConnected} onConnectWallet={() => setIsWalletConnected(true)} onDisconnect={() => setIsWalletConnected(false)} />
        </div>
      </div>

      {/* Mobile bottom sheet for TradingBox */}
      <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
        <TradingBox
          isMobileSheet
          isSheetOpen={isMobileSheetOpen}
          onToggleSheet={() => setIsMobileSheetOpen(o => !o)}
          isWalletConnected={isWalletConnected}
          onConnectWallet={() => setIsWalletConnected(true)}
          onDisconnect={() => setIsWalletConnected(false)}
        />
      </div>
    </div>;
};