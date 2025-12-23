import React, { useState, useMemo } from 'react';
import { TrendingUp, Activity, Wallet, BarChart3, ChevronDown, MoreHorizontal, Maximize2, Info, TrendingDown, Check, X, Settings, CreditCard, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Bar, BarChart } from 'recharts';
import { cn } from '../../lib/utils';
import { MetricConfigModal, MetricConfig, SectionConfig } from './MetricConfigModal';

// --- Types ---

type ChartType = 'area' | 'candlestick';
type PortfolioPageTab = 'overview' | 'positions' | 'open-orders' | 'funding' | 'realized-pnl';
interface AccountData {
  id: string;
  name: string;
  equity: number;
  unrealisedPnl: number;
  realisedPnl: number;
  initialMargin: number;
  availableToTrade: number;
  availableToWithdraw: number;
  marginRatio: number;
  exposure: number;
  netExposure: number;
  leverage: number;
  profitFactor: number;
  winRate: number;
  maxDrawdown: number;
  tradingVolume: number;
}

// --- Mock Data ---

const MOCK_ACCOUNTS: AccountData[] = [{
  id: '1',
  name: 'Strategy 1',
  equity: 102.30,
  unrealisedPnl: 10.90,
  realisedPnl: 1002.30,
  initialMargin: 20.00,
  availableToTrade: 82.30,
  availableToWithdraw: 82.30,
  marginRatio: 17,
  exposure: 120.00,
  netExposure: 120.00,
  leverage: 1.17,
  profitFactor: 1.2,
  winRate: 53,
  maxDrawdown: 10.80,
  tradingVolume: 24500.00
}, {
  id: '2',
  name: 'Strategy 2',
  equity: 102.30,
  unrealisedPnl: 20.90,
  realisedPnl: 234.50,
  initialMargin: 20.00,
  availableToTrade: 82.30,
  availableToWithdraw: 82.30,
  marginRatio: 15,
  exposure: 120.00,
  netExposure: 120.00,
  leverage: 1.13,
  profitFactor: 1.4,
  winRate: 31,
  maxDrawdown: 10.80,
  tradingVolume: 9888.00
}, {
  id: '3',
  name: 'Strategy 3',
  equity: 102.30,
  unrealisedPnl: 10.90,
  realisedPnl: 450.20,
  initialMargin: 20.00,
  availableToTrade: 82.30,
  availableToWithdraw: 82.30,
  marginRatio: 18,
  exposure: 120.00,
  netExposure: 120.00,
  leverage: 1.14,
  profitFactor: 1.1,
  winRate: 48,
  maxDrawdown: 12.40,
  tradingVolume: 15200.00
}, {
  id: '4',
  name: 'Strategy 4',
  equity: 102.30,
  unrealisedPnl: 115.50,
  realisedPnl: -120.30,
  initialMargin: 20.00,
  availableToTrade: 82.30,
  availableToWithdraw: 82.30,
  marginRatio: 17,
  exposure: 120.00,
  netExposure: 120.00,
  leverage: 1.18,
  profitFactor: 0.8,
  winRate: 42,
  maxDrawdown: 22.10,
  tradingVolume: 31200.00
}];
const CHART_DATA = [{
  name: '5 Sep',
  value: 1280
}, {
  name: '6 Sep',
  value: 1450
}, {
  name: '7 Sep',
  value: 1320
}, {
  name: '8 Sep',
  value: 1420
}, {
  name: '9 Sep',
  value: 1180
}, {
  name: '10 Sep',
  value: 1420
}, {
  name: '11 Sep',
  value: 1350
}] as any[];
const CANDLESTICK_DATA = [{
  name: '5 Sep',
  open: 1250,
  high: 1320,
  low: 1230,
  close: 1280
}, {
  name: '6 Sep',
  open: 1280,
  high: 1480,
  low: 1270,
  close: 1450
}, {
  name: '7 Sep',
  open: 1450,
  high: 1460,
  low: 1300,
  close: 1320
}, {
  name: '8 Sep',
  open: 1320,
  high: 1450,
  low: 1310,
  close: 1420
}, {
  name: '9 Sep',
  open: 1420,
  high: 1430,
  low: 1150,
  close: 1180
}, {
  name: '10 Sep',
  open: 1180,
  high: 1450,
  low: 1170,
  close: 1420
}, {
  name: '11 Sep',
  open: 1420,
  high: 1390,
  low: 1330,
  close: 1350
}] as any[];

// --- Metric Explanations ---

const METRIC_EXPLANATIONS: Record<string, string> = {
  'equity': 'Total value of your account, including unrealized profits and losses. Calculated as: Cash Balance + Unrealized PNL.',
  'margin-ratio': 'Percentage of your equity used as margin. Lower values indicate healthier positions with more buffer. Formula: (Initial Margin / Equity) × 100.',
  'leverage': 'Multiplier showing how much exposure you have relative to your equity. Higher leverage increases both potential gains and losses.',
  'initial-margin': 'Collateral locked to maintain your current open positions. This cannot be withdrawn while positions are open.',
  'available-to-trade': 'Maximum funds you can use to open new positions without adding more capital.',
  'available-to-withdraw': 'Funds you can withdraw from your account without affecting current positions. Includes excess margin.',
  'total-pnl': 'Combined profit and loss including both realized gains/losses and current unrealized positions.',
  'unrealised-pnl': 'Profit or loss on your current open positions that hasn\'t been realized yet. Changes with market price movements.',
  'realised-pnl': 'Actual profit or loss from closed positions. This value is locked in and doesn\'t change with market movements.',
  'accrued-funding': 'Accumulated funding payments for perpetual contracts. Positive means you received funding, negative means you paid.',
  'win-rate': 'Percentage of profitable trades out of total trades closed. Higher win rate indicates more consistent profitability.',
  'profit-factor': 'Ratio of gross profit to gross loss. Values above 1.0 indicate profitable trading. Higher is better.',
  'max-drawdown': 'Largest peak-to-trough decline in account value. Indicates the maximum historical loss from a high point.',
  'exposure': 'Total notional value of all your positions. Shows your overall market exposure across all instruments.',
  'net-exposure': 'Net directional exposure after offsetting long and short positions. Shows your overall market direction bias.',
  'account-leverage': 'Account-level leverage calculated as Total Exposure / Equity. Shows overall risk across the account.',
  'total-pnl-percent': 'Total PNL expressed as a percentage of initial capital or equity.',
  'trading-volume': 'Total volume of trades executed over the selected time period.',
  'sharpe-ratio': 'Risk-adjusted return metric that measures excess return per unit of volatility. Higher values indicate better risk-adjusted performance.',
  'fees': 'Trading fees split between taker fees (market orders) and maker fees (limit orders). Lower fees improve overall profitability.'
};

// --- Tooltip Component ---

const MetricTooltip = ({
  label,
  explanation
}: {
  label: string;
  explanation: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  return <div className="relative inline-flex items-center">
      <div className="ml-1 cursor-help" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
        <Info size={12} className="text-zinc-500 hover:text-zinc-400 transition-colors" />
      </div>
      {isVisible && <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-zinc-900 border border-white/10 rounded-lg shadow-xl z-50 pointer-events-none">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
            {label}
          </div>
          <div className="text-xs text-zinc-300 leading-relaxed">
            {explanation}
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="border-4 border-transparent border-t-zinc-900" />
          </div>
        </div>}
    </div>;
};

// --- Sub-components (Internal Helpers) ---

const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
}).format(val);
const formatPercent = (val: number) => `${val}%`;

// Table Header with Tooltip
const TableHeader = ({
  label,
  explanationKey
}: {
  label: string;
  explanationKey?: string;
}) => {
  return <div className="flex items-center justify-end gap-1">
      <span>{label}</span>
      {explanationKey && METRIC_EXPLANATIONS[explanationKey] && <MetricTooltip label={label} explanation={METRIC_EXPLANATIONS[explanationKey]} />}
    </div>;
};

// --- Candlestick Component ---

const Candlestick = ({
  x,
  y,
  width,
  height,
  payload
}: any) => {
  const {
    open,
    close,
    high,
    low
  } = payload;
  const isGreen = close > open;
  const fill = isGreen ? '#10b981' : '#ef4444';
  const wickX = x + width / 2;
  const topWickY = y;
  const bottomWickY = y + height;
  const bodyTop = Math.min(y + (isGreen ? high - close : high - open) * height / (high - low), y + height);
  const bodyBottom = Math.max(y + (isGreen ? high - open : high - close) * height / (high - low), y);
  const bodyHeight = Math.abs(bodyBottom - bodyTop);
  return <g>
      {/* Wick */}
      <line x1={wickX} y1={topWickY} x2={wickX} y2={bottomWickY} stroke={fill} strokeWidth={1} />
      {/* Body */}
      <rect x={x} y={bodyTop} width={width} height={bodyHeight || 1} fill={fill} stroke={fill} strokeWidth={1} />
    </g>;
};
const CandlestickChart = ({
  data
}: {
  data: any[];
}) => {
  const processedData = data.map(item => ({
    ...item,
    range: [item.low, item.high]
  }));
  return <ResponsiveContainer width="100%" height="100%">
      <BarChart data={processedData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{
        fill: '#52525b',
        fontSize: 10
      }} dy={10} />
        <YAxis axisLine={false} tickLine={false} orientation="right" tick={{
        fill: '#52525b',
        fontSize: 10
      }} domain={['dataMin - 50', 'dataMax + 50']} />
        <Tooltip contentStyle={{
        backgroundColor: '#18181b',
        border: '1px solid #3f3f46',
        borderRadius: '4px'
      }} content={({
        active,
        payload
      }) => {
        if (active && payload && payload.length) {
          const data = payload[0].payload;
          const isGreen = data.close > data.open;
          return <div className="bg-zinc-900 border border-white/10 rounded-lg p-3 text-xs">
                  <div className="font-semibold mb-2 text-white">{data.name}</div>
                  <div className="space-y-1">
                    <div className="flex justify-between gap-3">
                      <span className="text-zinc-400">Open:</span>
                      <span className="font-mono text-white">${data.open}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-zinc-400">High:</span>
                      <span className="font-mono text-emerald-400">${data.high}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-zinc-400">Low:</span>
                      <span className="font-mono text-rose-400">${data.low}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-zinc-400">Close:</span>
                      <span className={cn("font-mono", isGreen ? "text-emerald-400" : "text-rose-400")}>
                        ${data.close}
                      </span>
                    </div>
                  </div>
                </div>;
        }
        return null;
      }} />
        <Bar dataKey="high" fill="transparent" shape={(props: any) => <Candlestick {...props} />} />
      </BarChart>
    </ResponsiveContainer>;
};

// @component: TradingDashboard
export const TradingDashboard = ({
  embedded = false,
  headerActions
}: {
  embedded?: boolean;
  headerActions?: React.ReactNode;
}) => {
  const [activeTableTab, setActiveTableTab] = useState<'health' | 'performance'>('health');
  const [timeRange, setTimeRange] = useState('1W');
  const [chartType, setChartType] = useState<ChartType>('area');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>(MOCK_ACCOUNTS.map(acc => acc.id));
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [pageTab, setPageTab] = useState<PortfolioPageTab>('overview');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);

  // All available metrics
  const ALL_AVAILABLE_METRICS: MetricConfig[] = useMemo(() => [{
    id: 'equity',
    label: 'Equity',
    value: '',
    explanationKey: 'equity',
    icon: <Wallet size={20} />
  }, {
    id: 'exposure',
    label: 'Exposure',
    value: '',
    explanationKey: 'exposure',
    icon: <Activity size={20} />
  }, {
    id: 'net-exposure',
    label: 'Net Exposure',
    value: '',
    explanationKey: 'net-exposure',
    icon: <Activity size={20} />
  }, {
    id: 'margin-ratio',
    label: 'Margin Ratio',
    value: '',
    explanationKey: 'margin-ratio',
    icon: <BarChart3 size={20} />
  }, {
    id: 'account-leverage',
    label: 'Account Leverage',
    value: '',
    explanationKey: 'account-leverage',
    icon: <TrendingUp size={20} />
  }, {
    id: 'available-to-trade',
    label: 'Available to Trade',
    value: '',
    explanationKey: 'available-to-trade',
    icon: <CreditCard size={20} />
  }, {
    id: 'available-to-withdraw',
    label: 'Available to Withdraw',
    value: '',
    explanationKey: 'available-to-withdraw',
    icon: <CreditCard size={20} />
  }, {
    id: 'initial-margin',
    label: 'Initial Margin',
    value: '',
    explanationKey: 'initial-margin',
    icon: <BarChart3 size={20} />
  }, {
    id: 'unrealised-pnl',
    label: 'Unrealised PnL',
    value: '',
    explanationKey: 'unrealised-pnl',
    icon: <TrendingUp size={20} />
  }, {
    id: 'total-pnl',
    label: 'Total PnL',
    value: '',
    explanationKey: 'total-pnl',
    icon: <Activity size={20} />
  }, {
    id: 'realised-pnl',
    label: 'Realised PnL',
    value: '',
    explanationKey: 'realised-pnl',
    icon: <TrendingUp size={20} />
  }, {
    id: 'win-rate',
    label: 'Win Rate',
    value: '',
    explanationKey: 'win-rate',
    icon: <Check size={20} />
  }, {
    id: 'max-drawdown',
    label: 'Max Drawdown',
    value: '',
    explanationKey: 'max-drawdown',
    icon: <TrendingDown size={20} />
  }, {
    id: 'trading-volume',
    label: 'Trading Volume',
    value: '',
    explanationKey: 'trading-volume',
    icon: <BarChart3 size={20} />
  }, {
    id: 'profit-factor',
    label: 'Profit Factor',
    value: '',
    explanationKey: 'profit-factor',
    icon: <TrendingUp size={20} />
  }, {
    id: 'sharpe-ratio',
    label: 'Sharpe Ratio',
    value: '',
    explanationKey: 'sharpe-ratio',
    icon: <Activity size={20} />
  }, {
    id: 'fees',
    label: 'Fees',
    value: '',
    explanationKey: 'fees',
    icon: <FileText size={20} />
  }, {
    id: 'accrued-funding',
    label: 'Accrued Funding',
    value: '',
    explanationKey: 'accrued-funding',
    icon: <CreditCard size={20} />
  }], []);

  // Section configuration with default metrics
  const [sectionConfig, setSectionConfig] = useState<SectionConfig>({
    id: 'metrics',
    title: 'Metrics',
    selectedMetrics: [{
      id: 'equity',
      label: 'Equity',
      value: '',
      explanationKey: 'equity'
    }, {
      id: 'margin-ratio',
      label: 'Margin Ratio',
      value: '',
      explanationKey: 'margin-ratio'
    }, {
      id: 'unrealised-pnl',
      label: 'Unrealised PnL',
      value: '',
      explanationKey: 'unrealised-pnl'
    }, {
      id: 'total-pnl',
      label: 'Total PnL',
      value: '',
      explanationKey: 'total-pnl'
    }, {
      id: 'win-rate',
      label: 'Win Rate',
      value: '',
      explanationKey: 'win-rate'
    }]
  });

  // Open edit modal
  const handleEditSection = () => {
    setModalOpen(true);
  };

  // Save section configuration
  const handleSaveSection = (updatedSection: SectionConfig) => {
    setSectionConfig(updatedSection);
  };

  // Filter accounts based on selection
  const filteredAccounts = useMemo(() => {
    return MOCK_ACCOUNTS.filter(acc => selectedAccounts.includes(acc.id));
  }, [selectedAccounts]);

  // Aggregated Stats
  const aggregates = useMemo(() => {
    const totalEquity = filteredAccounts.reduce((acc, curr) => acc + curr.equity, 0);
    const totalUPnl = filteredAccounts.reduce((acc, curr) => acc + curr.unrealisedPnl, 0);
    const totalRPnl = filteredAccounts.reduce((acc, curr) => acc + curr.realisedPnl, 0);
    const avgMarginRatio = filteredAccounts.length > 0 ? filteredAccounts.reduce((acc, curr) => acc + curr.marginRatio, 0) / filteredAccounts.length : 0;
    const totalExposure = filteredAccounts.reduce((acc, curr) => acc + curr.exposure, 0);
    const totalNetExposure = filteredAccounts.reduce((acc, curr) => acc + curr.netExposure, 0);
    const totalVolume = filteredAccounts.reduce((acc, curr) => acc + curr.tradingVolume, 0);
    const totalAvailableToTrade = filteredAccounts.reduce((acc, curr) => acc + curr.availableToTrade, 0);
    const totalAvailableToWithdraw = filteredAccounts.reduce((acc, curr) => acc + curr.availableToWithdraw, 0);
    const totalInitialMargin = filteredAccounts.reduce((acc, curr) => acc + curr.initialMargin, 0);
    const avgWinRate = filteredAccounts.length > 0 ? filteredAccounts.reduce((acc, curr) => acc + curr.winRate, 0) / filteredAccounts.length : 0;
    const avgProfitFactor = filteredAccounts.length > 0 ? filteredAccounts.reduce((acc, curr) => acc + curr.profitFactor, 0) / filteredAccounts.length : 0;
    const avgMaxDrawdown = filteredAccounts.length > 0 ? filteredAccounts.reduce((acc, curr) => acc + curr.maxDrawdown, 0) / filteredAccounts.length : 0;
    const avgLeverage = totalEquity > 0 ? totalExposure / totalEquity : 0;
    return {
      equity: totalEquity,
      uPnl: totalUPnl,
      rPnl: totalRPnl,
      totalPnl: totalUPnl + totalRPnl,
      marginRatio: avgMarginRatio,
      exposure: totalExposure,
      netExposure: totalNetExposure,
      volume: totalVolume,
      availableToTrade: totalAvailableToTrade,
      availableToWithdraw: totalAvailableToWithdraw,
      initialMargin: totalInitialMargin,
      winRate: avgWinRate,
      profitFactor: avgProfitFactor,
      maxDrawdown: avgMaxDrawdown,
      leverage: avgLeverage
    };
  }, [filteredAccounts]);

  // Get metric value based on metric ID
  const getMetricValue = (metricId: string) => {
    switch (metricId) {
      case 'equity':
        return formatCurrency(aggregates.equity);
      case 'exposure':
        return formatCurrency(aggregates.exposure);
      case 'net-exposure':
        return formatCurrency(aggregates.netExposure);
      case 'margin-ratio':
        return formatPercent(Math.round(aggregates.marginRatio));
      case 'account-leverage':
        return `${aggregates.leverage.toFixed(2)}x`;
      case 'available-to-trade':
        return formatCurrency(aggregates.availableToTrade);
      case 'available-to-withdraw':
        return formatCurrency(aggregates.availableToWithdraw);
      case 'initial-margin':
        return formatCurrency(aggregates.initialMargin);
      case 'unrealised-pnl':
        return formatCurrency(aggregates.uPnl);
      case 'total-pnl':
        return formatCurrency(aggregates.totalPnl);
      case 'realised-pnl':
        return formatCurrency(aggregates.rPnl);
      case 'win-rate':
        return formatPercent(Math.round(aggregates.winRate));
      case 'max-drawdown':
        return formatPercent(parseFloat(aggregates.maxDrawdown.toFixed(1)));
      case 'trading-volume':
        return formatCurrency(aggregates.volume);
      case 'profit-factor':
        return aggregates.profitFactor.toFixed(2);
      case 'sharpe-ratio':
        return '1.85';
      case 'fees':
        return '$245.50';
      case 'accrued-funding':
        return '-$45.60';
      default:
        return 'N/A';
    }
  };

  // Toggle account selection
  const toggleAccount = (accountId: string) => {
    setSelectedAccounts(prev => {
      if (prev.includes(accountId)) {
        // Don't allow deselecting all accounts
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== accountId);
      } else {
        return [...prev, accountId];
      }
    });
  };

  // Select all accounts
  const selectAllAccounts = () => {
    setSelectedAccounts(MOCK_ACCOUNTS.map(acc => acc.id));
  };

  // Clear all accounts (keep at least one)
  const clearAllAccounts = () => {
    setSelectedAccounts([MOCK_ACCOUNTS[0].id]);
  };

  // @return
  return <div className="flex flex-col w-full h-full min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans overflow-x-hidden">
      {!embedded && <header className="flex items-center justify-between px-6 h-14 border-b border-white/5 bg-[#0a0a0a]">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-lg tracking-tight">Portfolio Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-1.5 hover:bg-white/5 rounded-md cursor-pointer">
              <TrendingUp size={18} />
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
              <div className="w-5 h-5 bg-orange-500/20 rounded flex items-center justify-center">
                <Activity size={12} className="text-orange-500" />
              </div>
              <span className="text-xs font-mono text-zinc-400">0x1A2B...5678</span>
            </div>
          </div>
        </header>}

      {/* Page-level navigation (always visible, even when embedded) */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-white/5 bg-[#0a0a0a] gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative">
            <button onClick={() => setShowAccountDropdown(!showAccountDropdown)} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-md text-xs font-medium text-white transition-colors">
              Accounts · {selectedAccounts.length} <ChevronDown size={14} className={cn("transition-transform", showAccountDropdown && "rotate-180")} />
            </button>
            
            {/* Account Multi-Select Dropdown */}
            {showAccountDropdown && <div className="absolute top-full left-0 mt-2 w-72 bg-zinc-900 border border-white/10 rounded-lg shadow-xl z-50">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                  <span className="text-xs font-bold text-white uppercase tracking-wide">Filter Accounts</span>
                  <button onClick={() => setShowAccountDropdown(false)} className="text-zinc-500 hover:text-white transition-colors">
                    <X size={14} />
                  </button>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10">
                  <button onClick={selectAllAccounts} className="text-[10px] font-medium text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wide">
                    Select All
                  </button>
                  <span className="text-zinc-600">·</span>
                  <button onClick={clearAllAccounts} className="text-[10px] font-medium text-zinc-400 hover:text-zinc-300 transition-colors uppercase tracking-wide">
                    Clear All
                  </button>
                </div>
                
                {/* Account List */}
                <div className="max-h-64 overflow-y-auto">
                  {MOCK_ACCOUNTS.map(account => {
                const isSelected = selectedAccounts.includes(account.id);
                const isLastSelected = selectedAccounts.length === 1 && isSelected;
                return <button key={account.id} onClick={() => !isLastSelected && toggleAccount(account.id)} disabled={isLastSelected} className={cn("w-full flex items-center justify-between px-4 py-3 text-left transition-colors border-b border-white/5 last:border-b-0", isSelected ? "bg-emerald-500/10 hover:bg-emerald-500/15" : "hover:bg-white/5", isLastSelected && "opacity-50 cursor-not-allowed")}>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-white mb-0.5">{account.name}</div>
                          <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                            <span>Equity: {formatCurrency(account.equity)}</span>
                            <span className={cn("font-medium", account.unrealisedPnl >= 0 ? "text-emerald-400" : "text-rose-400")}>
                              {account.unrealisedPnl >= 0 ? '+' : ''}{formatCurrency(account.unrealisedPnl)}
                            </span>
                          </div>
                        </div>
                        
                        <div className={cn("w-4 h-4 rounded border flex items-center justify-center transition-all", isSelected ? "bg-emerald-500 border-emerald-500" : "border-zinc-600")}>
                          {isSelected && <Check size={12} className="text-white" />}
                        </div>
                      </button>;
              })}
                </div>
                
                {/* Footer */}
                <div className="px-4 py-3 border-t border-white/10 bg-zinc-900/50">
                  <div className="text-[10px] text-zinc-500">
                    {selectedAccounts.length} of {MOCK_ACCOUNTS.length} accounts selected
                  </div>
                </div>
              </div>}
          </div>
          <div className="flex bg-zinc-900/80 rounded-md p-1 gap-0.5">
            {['1D', '1W', '1M', '1Y', 'All'].map(range => <button key={range} onClick={() => setTimeRange(range)} className={cn("px-3 py-1 text-[11px] font-medium rounded transition-all", timeRange === range ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300")}>
                {range}
              </button>)}
          </div>
          <div className="h-4 w-[1px] bg-white/10 mx-2" />
          <div className="flex items-center gap-6 text-xs font-medium uppercase tracking-wider">
            <button onClick={() => setPageTab('overview')} className={cn("transition-colors border-b-2 pb-2 -mb-2", pageTab === 'overview' ? "text-white border-emerald-500" : "text-zinc-500 border-transparent hover:text-white")}>
              Overview
            </button>
            <button onClick={() => setPageTab('positions')} className={cn("transition-colors border-b-2 pb-2 -mb-2", pageTab === 'positions' ? "text-white border-emerald-500" : "text-zinc-500 border-transparent hover:text-white")}>
              Positions
            </button>
            <button onClick={() => setPageTab('open-orders')} className={cn("transition-colors border-b-2 pb-2 -mb-2", pageTab === 'open-orders' ? "text-white border-emerald-500" : "text-zinc-500 border-transparent hover:text-white")}>
              Open Orders
            </button>
            <button onClick={() => setPageTab('funding')} className={cn("transition-colors border-b-2 pb-2 -mb-2", pageTab === 'funding' ? "text-white border-emerald-500" : "text-zinc-500 border-transparent hover:text-white")}>
              Funding
            </button>
            <button onClick={() => setPageTab('realized-pnl')} className={cn("transition-colors border-b-2 pb-2 -mb-2", pageTab === 'realized-pnl' ? "text-white border-emerald-500" : "text-zinc-500 border-transparent hover:text-white")}>
              Realized P&amp;L
            </button>
          </div>
        </div>
        {headerActions && <div className="flex items-center gap-2 shrink-0">
            {headerActions}
          </div>}
      </div>

      {pageTab === 'overview' ? <>
          {/* Metrics Section */}
          <div className="px-6 py-4 border-b border-white/5 bg-[#0d0d0d]">
            <div className="flex flex-col gap-4">
              {/* Header with Edit Button */}
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-white">Key Metrics</h2>
                <button onClick={handleEditSection} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-md text-xs font-medium transition-colors">
                  <Settings size={14} />
                  Configure Metrics
                </button>
              </div>

              {/* Metrics Grid */}
              {sectionConfig.selectedMetrics.length === 0 ? <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-white/10 rounded-lg">
                  <div className="text-zinc-500 text-sm text-center mb-4">
                    No metrics configured
                  </div>
                  <button onClick={handleEditSection} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/50 rounded-lg text-sm font-medium transition-colors">
                    <Settings size={16} />
                    Add Metrics
                  </button>
                </div> : <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                  {sectionConfig.selectedMetrics.map(metric => <div key={metric.id} className="flex flex-col gap-2 p-4 bg-zinc-900/50 border border-white/5 rounded-lg hover:bg-zinc-900/80 hover:border-white/10 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-medium text-zinc-500 tracking-wide">
                          {metric.label}
                        </span>
                        {metric.explanationKey && METRIC_EXPLANATIONS[metric.explanationKey] && <MetricTooltip label={metric.label} explanation={METRIC_EXPLANATIONS[metric.explanationKey]} />}
                      </div>
                      <div className="text-lg font-semibold text-white">
                        {getMetricValue(metric.id)}
                      </div>
                    </div>)}
                </div>}
            </div>
          </div>

          {/* Chart Section */}
          <div className="flex-1 min-h-[400px] flex flex-col p-6 bg-[#0a0a0a]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-xs font-medium text-white">
                  <span>Cumulative P&amp;L</span>
                  <ChevronDown size={14} className="text-zinc-500" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-white">
                  <span>Total P&amp;L</span>
                  <ChevronDown size={14} className="text-zinc-500" />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Chart Type Toggle */}
                <div className="flex bg-zinc-900/80 rounded-md p-1 gap-0.5 border border-white/10">
                  <button onClick={() => setChartType('area')} className={cn("px-3 py-1.5 text-[11px] font-medium rounded transition-all flex items-center gap-1.5", chartType === 'area' ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300")}>
                    <TrendingUp size={12} />
                    Area
                  </button>
                  <button onClick={() => setChartType('candlestick')} className={cn("px-3 py-1.5 text-[11px] font-medium rounded transition-all flex items-center gap-1.5", chartType === 'candlestick' ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300")}>
                    <BarChart3 size={12} />
                    Candles
                  </button>
                </div>
                <button className="p-1 text-zinc-500 hover:text-white">
                  <Maximize2 size={14} />
                </button>
              </div>
            </div>

            <div className="flex-1">
              {chartType === 'area' ? <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_DATA}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{
                  fill: '#52525b',
                  fontSize: 10
                }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} orientation="right" tick={{
                  fill: '#52525b',
                  fontSize: 10
                }} domain={['dataMin - 50', 'dataMax + 50']} />
                    <Tooltip contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #3f3f46',
                  borderRadius: '4px'
                }} itemStyle={{
                  color: '#10b981',
                  fontSize: '12px'
                }} />
                    <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer> : <CandlestickChart data={CANDLESTICK_DATA} />}
            </div>
          </div>

          {/* Dynamic Table Section */}
          <div className="flex flex-col border-t border-white/5 bg-[#0d0d0d]">
            <div className="flex items-center justify-between px-6 py-3 border-b border-white/5">
              <div className="flex gap-6">
                <button onClick={() => setActiveTableTab('health')} className={cn("text-xs font-bold transition-all border-b-2 -mb-3 pb-3", activeTableTab === 'health' ? "text-white border-emerald-500" : "text-zinc-500 border-transparent")}>
                  Accounts Health
                </button>
                <button onClick={() => setActiveTableTab('performance')} className={cn("text-xs font-bold transition-all border-b-2 -mb-3 pb-3", activeTableTab === 'performance' ? "text-white border-emerald-500" : "text-zinc-500 border-transparent")}>
                  Accounts Performance
                </button>
              </div>
              <Maximize2 size={14} className="text-zinc-500 cursor-pointer hover:text-white" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-zinc-500 font-semibold border-b border-white/5">
                    <th className="px-6 py-4">ACCOUNT ↓</th>
                    {activeTableTab === 'health' ? <>
                        <th className="px-4 py-4 text-right">
                          <TableHeader label="EQUITY" explanationKey="equity" />
                        </th>
                        <th className="px-4 py-4 text-right">
                          <TableHeader label="U. PNL" explanationKey="unrealised-pnl" />
                        </th>
                        <th className="px-4 py-4 text-right">
                          <TableHeader label="INITIAL MARGIN" explanationKey="initial-margin" />
                        </th>
                        <th className="px-4 py-4 text-right">
                          <TableHeader label="AVAIL TO TRADE" explanationKey="available-to-trade" />
                        </th>
                        <th className="px-4 py-4 text-right">
                          <TableHeader label="AVAIL TO WITHDRAW" explanationKey="available-to-withdraw" />
                        </th>
                        <th className="px-4 py-4 text-right">
                          <TableHeader label="MARGIN RATIO" explanationKey="margin-ratio" />
                        </th>
                        <th className="px-4 py-4 text-right">
                          <TableHeader label="EXPOSURE" explanationKey="exposure" />
                        </th>
                        <th className="px-4 py-4 text-right">
                          <TableHeader label="NET EXPOSURE" explanationKey="net-exposure" />
                        </th>
                        <th className="px-4 py-4 text-right whitespace-nowrap">
                          <TableHeader label="ACCOUNT LEVERAGE" explanationKey="account-leverage" />
                        </th>
                        <th className="px-6 py-4"></th>
                      </> : <>
                        <th className="px-4 py-4 text-right">
                          <TableHeader label="R. PNL" explanationKey="realised-pnl" />
                        </th>
                        <th className="px-4 py-4 text-right">
                          <TableHeader label="U. PNL" explanationKey="unrealised-pnl" />
                        </th>
                        <th className="px-4 py-4 text-right">
                          <TableHeader label="TOTAL PNL" explanationKey="total-pnl" />
                        </th>
                        <th className="px-4 py-4 text-right">
                          <TableHeader label="TOTAL P&L %" explanationKey="total-pnl-percent" />
                        </th>
                        <th className="px-4 py-4 text-right">
                          <TableHeader label="PROFIT FACTOR" explanationKey="profit-factor" />
                        </th>
                        <th className="px-4 py-4 text-right">
                          <TableHeader label="WIN RATE" explanationKey="win-rate" />
                        </th>
                        <th className="px-4 py-4 text-right">
                          <TableHeader label="MAX DRAWDOWN" explanationKey="max-drawdown" />
                        </th>
                        <th className="px-4 py-4 text-right">
                          <TableHeader label="TRADING VOLUME" explanationKey="trading-volume" />
                        </th>
                        <th className="px-6 py-4"></th>
                      </>}
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map(acc => <tr key={acc.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4 font-medium text-white">{acc.name}</td>
                      {activeTableTab === 'health' ? <>
                          <td className="px-4 py-4 text-right font-mono">{formatCurrency(acc.equity)}</td>
                          <td className="px-4 py-4 text-right font-mono text-emerald-400">{formatCurrency(acc.unrealisedPnl)}</td>
                          <td className="px-4 py-4 text-right font-mono">{formatCurrency(acc.initialMargin)}</td>
                          <td className="px-4 py-4 text-right font-mono">{formatCurrency(acc.availableToTrade)}</td>
                          <td className="px-4 py-4 text-right font-mono">{formatCurrency(acc.availableToWithdraw)}</td>
                          <td className="px-4 py-4 text-right font-mono text-emerald-400">{acc.marginRatio}%</td>
                          <td className="px-4 py-4 text-right font-mono">{formatCurrency(acc.exposure)}</td>
                          <td className="px-4 py-4 text-right font-mono">{formatCurrency(acc.netExposure)}</td>
                          <td className="px-4 py-4 text-right font-mono">{acc.leverage}</td>
                        </> : <>
                          <td className="px-4 py-4 text-right font-mono text-emerald-400">{formatCurrency(acc.realisedPnl)}</td>
                          <td className="px-4 py-4 text-right font-mono text-emerald-400">{formatCurrency(acc.unrealisedPnl)}</td>
                          <td className="px-4 py-4 text-right font-mono text-emerald-400">{formatCurrency(acc.realisedPnl + acc.unrealisedPnl)}</td>
                          <td className="px-4 py-4 text-right font-mono text-emerald-400">12.30%</td>
                          <td className="px-4 py-4 text-right font-mono text-emerald-400">{acc.profitFactor}</td>
                          <td className="px-4 py-4 text-right font-mono text-emerald-400">{acc.winRate}%</td>
                          <td className="px-4 py-4 text-right font-mono">{acc.maxDrawdown}%</td>
                          <td className="px-4 py-4 text-right font-mono">{formatCurrency(acc.tradingVolume)}</td>
                        </>}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[10px] font-bold">Deposit</button>
                          <button className="p-1 text-zinc-500 hover:text-white"><MoreHorizontal size={16} /></button>
                        </div>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </> : <div className="px-6 py-8">
          <div className="border border-white/10 bg-zinc-900/30 rounded-lg p-6">
            <div className="text-sm font-medium text-white mb-1">
              {pageTab === 'positions' ? 'Positions' : pageTab === 'open-orders' ? 'Open Orders' : pageTab === 'funding' ? 'Funding' : 'Realized P&L'}
            </div>
            <div className="text-xs text-zinc-400">
              Coming soon — this tab is wired up and ready for data + table components.
            </div>
          </div>
        </div>}

      {/* Metric Configuration Modal */}
      <MetricConfigModal isOpen={modalOpen} onClose={() => setModalOpen(false)} section={sectionConfig} onSave={handleSaveSection} availableMetrics={ALL_AVAILABLE_METRICS} />
    </div>;
};