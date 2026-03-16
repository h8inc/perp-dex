import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronDown,
  Wallet,
  Bell,
  Search,
  Star,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  BarChart3,
  Activity,
  Globe,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { TradingBox } from './TradingBox';
import { getTokenIcon } from './TokenIcons';

const MARKET_PAIRS = [
  { symbol: 'BTC', name: 'Bitcoin', price: 91284.32, change24h: 2.41, volume: '4.2B', high: 92100.0, low: 89500.0, fundingRate: 0.0045 },
  { symbol: 'ETH', name: 'Ethereum', price: 3421.87, change24h: -0.83, volume: '2.1B', high: 3480.0, low: 3380.0, fundingRate: 0.0032 },
  { symbol: 'SOL', name: 'Solana', price: 187.45, change24h: 5.12, volume: '890M', high: 192.0, low: 178.0, fundingRate: 0.0067 },
] as const;

type MarketPair = typeof MARKET_PAIRS[number];

const MOCK_TRADES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  price: 91284.32 + (Math.random() - 0.5) * 400,
  size: (Math.random() * 2.5 + 0.01).toFixed(4),
  time: new Date(Date.now() - i * 3200).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  side: Math.random() > 0.5 ? 'buy' : 'sell' as 'buy' | 'sell',
}));

const MOCK_POSITIONS = [
  { pair: 'BTC-USDC', side: 'Long', size: '$12,400', entry: '$89,200', mark: '$91,284', pnl: '+$2,340', pnlPct: '+2.6%', leverage: '10x' },
  { pair: 'ETH-USDC', side: 'Short', size: '$5,800', entry: '$3,520', mark: '$3,421', pnl: '+$162', pnlPct: '+2.8%', leverage: '5x' },
];

const MOCK_ORDERS = [
  { pair: 'BTC-USDC', type: 'Limit', side: 'Buy', price: '$88,500', size: '$5,000', filled: '0%', time: '2m ago' },
  { pair: 'SOL-USDC', type: 'Stop', side: 'Sell', price: '$175.00', size: '$2,000', filled: '0%', time: '15m ago' },
];

const formatPrice = (price: number) =>
  price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const MarketSelector = ({
  selected,
  onSelect,
}: {
  selected: MarketPair;
  onSelect: (pair: MarketPair) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-2.5 hover:bg-white/10 transition-colors border border-white/5 hover:border-white/10"
      >
        {getTokenIcon(selected.symbol, 28)}
        <div className="flex flex-col items-start">
          <span className="text-white font-semibold text-base leading-tight">{selected.symbol}/USDC</span>
          <span className="text-[11px] text-gray-500">Perpetual</span>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-400 ml-1" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-2 z-50 w-72 rounded-xl border border-white/10 bg-[#131318] shadow-2xl overflow-hidden">
            <div className="p-3 border-b border-white/5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  className="w-full bg-white/5 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-[#00ff9d]/40"
                  placeholder="Search markets..."
                />
              </div>
            </div>
            <div className="p-1">
              {MARKET_PAIRS.map((pair) => (
                <button
                  key={pair.symbol}
                  onClick={() => {
                    onSelect(pair);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors ${
                    selected.symbol === pair.symbol ? 'bg-white/5' : ''
                  }`}
                >
                  {getTokenIcon(pair.symbol, 32)}
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-white">{pair.symbol}/USDC</div>
                    <div className="text-xs text-gray-500">{pair.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">${formatPrice(pair.price)}</div>
                    <div className={`text-xs ${pair.change24h >= 0 ? 'text-[#00ff9d]' : 'text-red-400'}`}>
                      {pair.change24h >= 0 ? '+' : ''}{pair.change24h}%
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const StatBadge = ({ label, value, color }: { label: string; value: string; color?: string }) => (
  <div className="flex flex-col gap-0.5 px-4 border-r border-white/5 last:border-r-0">
    <span className="text-[11px] text-gray-500 whitespace-nowrap">{label}</span>
    <span className={`text-sm font-medium whitespace-nowrap ${color || 'text-white'}`}>{value}</span>
  </div>
);

const PriceChart = ({ pair }: { pair: MarketPair }) => {
  const points = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    let price = pair.price * 0.985;
    for (let i = 0; i <= 96; i++) {
      price += (Math.random() - 0.48) * pair.price * 0.003;
      pts.push({ x: i, y: price });
    }
    pts.push({ x: 97, y: pair.price });
    return pts;
  }, [pair.symbol]);

  const minY = Math.min(...points.map((p) => p.y));
  const maxY = Math.max(...points.map((p) => p.y));
  const rangeY = maxY - minY || 1;

  const toSvg = (pt: { x: number; y: number }) => ({
    sx: (pt.x / 97) * 100,
    sy: 100 - ((pt.y - minY) / rangeY) * 80 - 10,
  });

  const pathD = points
    .map((pt, i) => {
      const { sx, sy } = toSvg(pt);
      return `${i === 0 ? 'M' : 'L'}${sx},${sy}`;
    })
    .join(' ');

  const areaD = pathD + ` L100,100 L0,100 Z`;
  const isPositive = pair.change24h >= 0;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5">
        {['1H', '4H', '1D', '1W', '1M'].map((tf) => (
          <button
            key={tf}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              tf === '1D' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
            }`}
          >
            {tf}
          </button>
        ))}
        <div className="flex-1" />
        <button className="text-gray-500 hover:text-white transition-colors">
          <BarChart3 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 relative min-h-0 p-4">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isPositive ? '#00ff9d' : '#ef4444'} stopOpacity="0.15" />
              <stop offset="100%" stopColor={isPositive ? '#00ff9d' : '#ef4444'} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 25, 50, 75, 100].map((y) => (
            <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="white" strokeOpacity="0.04" strokeWidth="0.3" />
          ))}
          <path d={areaD} fill="url(#chartGrad)" />
          <path d={pathD} fill="none" stroke={isPositive ? '#00ff9d' : '#ef4444'} strokeWidth="0.6" strokeLinecap="round" />
        </svg>

        <div className="absolute top-6 left-6">
          <div className="text-2xl font-bold text-white">${formatPrice(pair.price)}</div>
          <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-[#00ff9d]' : 'text-red-400'}`}>
            {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            {isPositive ? '+' : ''}{pair.change24h}% (24h)
          </div>
        </div>
      </div>
    </div>
  );
};

const RecentTrades = () => (
  <div className="flex flex-col h-full">
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
      <span className="text-sm font-medium text-white">Recent Trades</span>
      <Activity className="h-4 w-4 text-gray-500" />
    </div>
    <div className="flex items-center justify-between px-4 py-2 text-[11px] text-gray-500 border-b border-white/5">
      <span className="w-1/3">Price</span>
      <span className="w-1/3 text-right">Size</span>
      <span className="w-1/3 text-right">Time</span>
    </div>
    <div className="flex-1 overflow-y-auto">
      {MOCK_TRADES.map((trade) => (
        <div key={trade.id} className="flex items-center justify-between px-4 py-1.5 text-xs hover:bg-white/[0.02] transition-colors">
          <span className={`w-1/3 font-mono ${trade.side === 'buy' ? 'text-[#00ff9d]' : 'text-red-400'}`}>
            {formatPrice(trade.price)}
          </span>
          <span className="w-1/3 text-right text-gray-400 font-mono">{trade.size}</span>
          <span className="w-1/3 text-right text-gray-500">{trade.time}</span>
        </div>
      ))}
    </div>
  </div>
);

type BottomTab = 'positions' | 'orders' | 'history';

const BottomPanel = () => {
  const [tab, setTab] = useState<BottomTab>('positions');

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-0 border-b border-white/5 shrink-0">
        {([['positions', 'Positions'], ['orders', 'Open Orders'], ['history', 'Trade History']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
              tab === key ? 'text-white border-[#00ff9d]' : 'text-gray-500 border-transparent hover:text-gray-300'
            }`}
          >
            {label}
            {key === 'positions' && MOCK_POSITIONS.length > 0 && (
              <span className="ml-1.5 bg-white/10 text-[10px] px-1.5 py-0.5 rounded-full">{MOCK_POSITIONS.length}</span>
            )}
            {key === 'orders' && MOCK_ORDERS.length > 0 && (
              <span className="ml-1.5 bg-white/10 text-[10px] px-1.5 py-0.5 rounded-full">{MOCK_ORDERS.length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {tab === 'positions' && (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 border-b border-white/5">
                <th className="text-left font-medium px-4 py-2.5">Market</th>
                <th className="text-left font-medium px-4 py-2.5">Side</th>
                <th className="text-right font-medium px-4 py-2.5">Size</th>
                <th className="text-right font-medium px-4 py-2.5">Entry</th>
                <th className="text-right font-medium px-4 py-2.5">Mark</th>
                <th className="text-right font-medium px-4 py-2.5">PnL</th>
                <th className="text-right font-medium px-4 py-2.5">Leverage</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_POSITIONS.map((pos, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors border-b border-white/[0.03]">
                  <td className="px-4 py-3 text-white font-medium">{pos.pair}</td>
                  <td className={`px-4 py-3 font-medium ${pos.side === 'Long' ? 'text-[#00ff9d]' : 'text-red-400'}`}>{pos.side}</td>
                  <td className="px-4 py-3 text-right text-white">{pos.size}</td>
                  <td className="px-4 py-3 text-right text-gray-400">{pos.entry}</td>
                  <td className="px-4 py-3 text-right text-white">{pos.mark}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-[#00ff9d]">{pos.pnl}</span>
                    <span className="text-gray-500 ml-1">({pos.pnlPct})</span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-400">{pos.leverage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'orders' && (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 border-b border-white/5">
                <th className="text-left font-medium px-4 py-2.5">Market</th>
                <th className="text-left font-medium px-4 py-2.5">Type</th>
                <th className="text-left font-medium px-4 py-2.5">Side</th>
                <th className="text-right font-medium px-4 py-2.5">Price</th>
                <th className="text-right font-medium px-4 py-2.5">Size</th>
                <th className="text-right font-medium px-4 py-2.5">Filled</th>
                <th className="text-right font-medium px-4 py-2.5">Time</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ORDERS.map((order, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors border-b border-white/[0.03]">
                  <td className="px-4 py-3 text-white font-medium">{order.pair}</td>
                  <td className="px-4 py-3 text-gray-400">{order.type}</td>
                  <td className={`px-4 py-3 font-medium ${order.side === 'Buy' ? 'text-[#00ff9d]' : 'text-red-400'}`}>{order.side}</td>
                  <td className="px-4 py-3 text-right text-white">{order.price}</td>
                  <td className="px-4 py-3 text-right text-gray-400">{order.size}</td>
                  <td className="px-4 py-3 text-right text-gray-400">{order.filled}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'history' && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Clock className="h-8 w-8 mb-3 opacity-40" />
            <span className="text-sm">No trade history yet</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const TradePage = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [selectedPair, setSelectedPair] = useState<MarketPair>(MARKET_PAIRS[0]);
  const [walletAddress] = useState('0x7a3F...e92B');

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0a0b0f] text-white font-sans antialiased overflow-hidden">
      {/* Top Navbar */}
      <header className="shrink-0 flex items-center justify-between h-14 px-5 border-b border-white/5 bg-[#0d0e13]">
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-2 group">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#00ff9d] to-[#00cc7d] flex items-center justify-center">
              <span className="text-[#0a0b0f] font-black text-sm">P</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight group-hover:text-[#00ff9d] transition-colors">Perp</span>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            <a href="/trade.html" className="px-3 py-1.5 text-sm font-medium text-white bg-white/5 rounded-lg">Trade</a>
            <a href="/trading.html" className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-white rounded-lg transition-colors">Dashboard</a>
            <a href="#" className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-white rounded-lg transition-colors">Earn</a>
            <a href="#" className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-white rounded-lg transition-colors">Leaderboard</a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
            <Globe className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5 relative">
            <Bell className="h-4 w-4" />
            <div className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#00ff9d]" />
          </button>

          {isWalletConnected ? (
            <button
              onClick={() => setIsWalletConnected(false)}
              className="flex items-center gap-2 h-9 px-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="h-2 w-2 rounded-full bg-[#00ff9d]" />
              <span className="text-sm font-medium text-white">{walletAddress}</span>
              <Copy className="h-3.5 w-3.5 text-gray-500" />
            </button>
          ) : (
            <button
              onClick={() => setIsWalletConnected(true)}
              className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#00ff9d] hover:bg-[#00e68a] transition-colors"
            >
              <Wallet className="h-4 w-4 text-[#0a0b0f]" />
              <span className="text-sm font-semibold text-[#0a0b0f]">Connect</span>
            </button>
          )}
        </div>
      </header>

      {/* Market Info Bar */}
      <div className="shrink-0 flex items-center h-12 px-5 border-b border-white/5 bg-[#0d0e13]/80 overflow-x-auto">
        <MarketSelector selected={selectedPair} onSelect={setSelectedPair} />
        <div className="flex items-center ml-5 overflow-x-auto">
          <StatBadge
            label="Mark Price"
            value={`$${formatPrice(selectedPair.price)}`}
            color={selectedPair.change24h >= 0 ? 'text-[#00ff9d]' : 'text-red-400'}
          />
          <StatBadge label="24h Change" value={`${selectedPair.change24h >= 0 ? '+' : ''}${selectedPair.change24h}%`} color={selectedPair.change24h >= 0 ? 'text-[#00ff9d]' : 'text-red-400'} />
          <StatBadge label="24h Volume" value={`$${selectedPair.volume}`} />
          <StatBadge label="24h High" value={`$${formatPrice(selectedPair.high)}`} />
          <StatBadge label="24h Low" value={`$${formatPrice(selectedPair.low)}`} />
          <StatBadge label="Funding Rate" value={`${(selectedPair.fundingRate * 100).toFixed(4)}%`} color="text-[#00ff9d]" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Left: Chart + Bottom Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chart Area */}
          <div className="flex-1 min-h-0 flex">
            <div className="flex-1 border-r border-white/5">
              <PriceChart pair={selectedPair} />
            </div>
            {/* Recent Trades Sidebar */}
            <div className="hidden xl:flex w-64 flex-col border-r border-white/5">
              <RecentTrades />
            </div>
          </div>

          {/* Bottom Panel: Positions / Orders / History */}
          <div className="shrink-0 h-[220px] border-t border-white/5 bg-[#0d0e13]/50">
            <BottomPanel />
          </div>
        </div>

        {/* Right: Trading Box */}
        <div className="hidden md:block w-[420px] shrink-0 border-l border-white/5 overflow-y-auto bg-[#0b0e11]">
          <TradingBox
            isWalletConnected={isWalletConnected}
            onConnectWallet={() => setIsWalletConnected(true)}
            onDisconnect={() => setIsWalletConnected(false)}
          />
        </div>
      </div>

      {/* Mobile: Fixed bottom TradingBox trigger */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40">
        <MobileTradingSheet
          isWalletConnected={isWalletConnected}
          onConnectWallet={() => setIsWalletConnected(true)}
          onDisconnect={() => setIsWalletConnected(false)}
        />
      </div>
    </div>
  );
};

const MobileTradingSheet = ({
  isWalletConnected,
  onConnectWallet,
  onDisconnect,
}: {
  isWalletConnected: boolean;
  onConnectWallet: () => void;
  onDisconnect: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />
      )}
      <div
        className={`relative z-50 bg-[#0b0e11] border-t border-white/10 transition-all duration-300 ${
          isOpen ? 'h-[85vh] rounded-t-2xl' : 'h-14'
        }`}
      >
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="w-full h-14 flex items-center justify-center gap-2 bg-[#00ff9d] text-[#0a0b0f] font-semibold text-sm"
          >
            <TrendingUp className="h-4 w-4" />
            Open Trading Panel
          </button>
        )}
        {isOpen && (
          <div className="h-full overflow-y-auto">
            <TradingBox
              isWalletConnected={isWalletConnected}
              onConnectWallet={onConnectWallet}
              onDisconnect={onDisconnect}
              isMobileSheet
              isSheetOpen={isOpen}
              onToggleSheet={() => setIsOpen(false)}
            />
          </div>
        )}
      </div>
    </>
  );
};
