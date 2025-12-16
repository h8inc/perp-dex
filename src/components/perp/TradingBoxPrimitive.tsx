import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Settings, Info, ArrowDown } from 'lucide-react';
import { TokenInput, type Token } from './trading/TokenInput';
import { TradingTabs } from './trading/TradingTabs';
import { LeverageSlider } from './trading/LeverageSlider';
import { TokenSelector } from './primitives/TokenSelector';
import { OrderTypeSelector, type OrderType } from './trading/OrderTypeSelector';

// Available tokens
const AVAILABLE_TOKENS: Token[] = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'USDC', name: 'USD Coin' },
  { symbol: 'USDT', name: 'Tether' },
  { symbol: 'SOL', name: 'Solana' },
];

// Leverage marks for slider
const LEVERAGE_MARKS = [
  { val: 0.1, label: '0.1x' },
  { val: 1, label: '1x' },
  { val: 2, label: '2x' },
  { val: 5, label: '5x' },
  { val: 10, label: '10x' },
  { val: 25, label: '25x' },
  { val: 50, label: '50x' },
];

// @component: TradingBoxPrimitive
// This is the new version built with primitives
// Once ready, it will replace TradingBox.tsx
type TradingBoxPrimitiveProps = {
  isWalletConnected?: boolean;
  onConnectWallet?: () => void;
  onDisconnect?: () => void;
  isMobileSheet?: boolean;
  isSheetOpen?: boolean;
  onToggleSheet?: () => void;
};

export const TradingBoxPrimitive = ({
  isWalletConnected = false,
  onConnectWallet,
  onDisconnect,
  isMobileSheet = false,
  isSheetOpen = true,
  onToggleSheet
}: TradingBoxPrimitiveProps) => {
  const [activeTab, setActiveTab] = useState<'Long' | 'Short' | 'Swap'>('Long');
  const [orderType, setOrderType] = useState<OrderType>('Market');
  const [payAmount, setPayAmount] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [leverage, setLeverage] = useState(20);
  const [isExecDetailsOpen, setIsExecDetailsOpen] = useState(true);
  const [payToken, setPayToken] = useState<Token>(
    AVAILABLE_TOKENS.find(t => t.symbol === 'USDC') || AVAILABLE_TOKENS[2]
  );
  const [receiveToken, setReceiveToken] = useState<Token>(
    AVAILABLE_TOKENS.find(t => t.symbol === 'BTC') || AVAILABLE_TOKENS[0]
  );
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
  const [tokenSelectorFor, setTokenSelectorFor] = useState<'pay' | 'receive'>('pay');
  
  // Network selection state
  const [selectedNetwork, setSelectedNetwork] = useState<{ id: string; name: string; icon?: string } | undefined>({
    id: 'ethereum',
    name: 'Ethereum',
    icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
  });
  
  // Available networks with logos
  const networks = [
    { 
      id: 'ethereum', 
      name: 'Ethereum',
      icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
    },
    { 
      id: 'arbitrum', 
      name: 'Arbitrum',
      icon: 'https://assets.coingecko.com/coins/images/16547/large/photo_2023-03-29_21.47.00.jpeg'
    },
    { 
      id: 'polygon', 
      name: 'Polygon',
      icon: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png'
    },
    { 
      id: 'base', 
      name: 'Base',
      icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png'
    },
    { 
      id: 'optimism', 
      name: 'Optimism',
      icon: 'https://assets.coingecko.com/coins/images/25244/large/Optimism.png'
    },
    { 
      id: 'starknet', 
      name: 'Starknet',
      icon: 'https://logo.svgcdn.com/token-branded/starknet.svg'
    },
  ];

  const isSwap = activeTab === 'Swap';
  const minLeverage = LEVERAGE_MARKS[0].val;
  const maxLeverage = LEVERAGE_MARKS[LEVERAGE_MARKS.length - 1].val;
  const clampedLeverage = Math.min(maxLeverage, Math.max(minLeverage, leverage));
  const effectiveLeverage = isSwap ? 1 : clampedLeverage;
  const parsedPay = parseFloat(payAmount || '0');
  const hasPay = Number.isFinite(parsedPay) && parsedPay > 0;
  const parsedLimit = parseFloat(limitPrice || '0');
  const hasLimitPrice = Number.isFinite(parsedLimit) && parsedLimit > 0;
  const longAmount = hasPay ? (parsedPay * effectiveLeverage).toFixed(2) : '';

  const handleSelectToken = (token: Token) => {
    if (tokenSelectorFor === 'pay') {
      setPayToken(token);
    } else {
      setReceiveToken(token);
    }
    setIsTokenSelectorOpen(false);
  };

  const sheetWrapperClass = isMobileSheet
    ? 'w-full bg-[#0b0e11] border-t border-white/10 font-sans antialiased shadow-2xl transition-transform duration-300 h-[90vh] max-h-[90vh] flex flex-col'
    : 'flex w-full items-start justify-center bg-[#0b0e11] font-sans antialiased h-full';

  const sheetWrapperStyle = isMobileSheet
    ? { 
        transform: isSheetOpen ? 'translateY(0)' : 'translateY(calc(100% - 56px))',
        height: isSheetOpen ? '90vh' : '56px',
        maxHeight: isSheetOpen ? '90vh' : '56px'
      }
    : {
        paddingLeft: '0px',
        paddingRight: '0px',
        paddingTop: '0px',
        paddingBottom: '0px'
      };

  return (
    <>
      <div className={sheetWrapperClass} style={sheetWrapperStyle}>
        <div
          className={`${
            isMobileSheet
              ? 'w-full max-w-full rounded-t-[16px] flex flex-col h-full max-h-full overflow-hidden relative'
              : 'w-full max-w-[420px] rounded-xl'
          } shrink-0 bg-[#0b0e11] border border-white/10`}
          style={{
            borderTopWidth: '0px',
            borderRightWidth: '0px',
            borderBottomWidth: '0px',
            borderLeftWidth: '0px',
            borderStyle: 'none',
            borderRadius: isMobileSheet ? '16px 16px 0 0' : '14px'
          }}
        >
        {/* Token Selector - Mobile: Second page within bottom sheet */}
        {isMobileSheet && isTokenSelectorOpen && (
          <TokenSelector
            isOpen={isTokenSelectorOpen}
            onClose={() => setIsTokenSelectorOpen(false)}
            onSelectToken={handleSelectToken}
            availableTokens={AVAILABLE_TOKENS}
            isMobile={true}
            isWalletConnected={isWalletConnected}
            networks={networks}
            selectedNetwork={selectedNetwork}
            onNetworkChange={setSelectedNetwork}
          />
        )}

        {/* Main Content - Hide on mobile when token selector is open */}
        {(!isMobileSheet || !isTokenSelectorOpen) && (
          <>
            {/* Header Tabs */}
            <div className="flex h-10 items-center justify-between rounded-t-xl border-b border-white/10 bg-[#0b0e11] overflow-hidden shrink-0">
              {isSheetOpen && (
                <TradingTabs activeTab={activeTab} onTabChange={setActiveTab} />
              )}
              {!isSheetOpen && isMobileSheet && (
                <div className="flex-1" />
              )}
              <div className="flex items-center px-4 shrink-0">
                <button
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  onClick={() => onToggleSheet && onToggleSheet()}
                  aria-label={isSheetOpen ? 'Collapse' : 'Expand'}
                >
                  {isMobileSheet ? (
                    isSheetOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronUp className="h-4 w-4" />
                    )
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Form Content - Only show when sheet is open */}
            {isSheetOpen ? (
          <div
            className={`flex flex-col gap-1 p-4 ${
              isMobileSheet ? 'flex-1 overflow-y-auto min-h-0' : ''
            }`}
            style={{
              width: '100%',
              maxWidth: '100%'
            }}
          >
          {/* Sub Header: Order Type + Icons */}
          <div className="mb-4 flex items-center justify-between">
            <OrderTypeSelector
              orderType={orderType}
              onOrderTypeChange={setOrderType}
              isSwap={isSwap}
            />

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
            <div className="relative">
              <TokenInput
                label={isSwap ? 'Pay' : 'Pay'}
                value={payAmount}
                onChange={val => setPayAmount(val)}
                token={payToken}
                onTokenClick={() => {
                  setTokenSelectorFor('pay');
                  setIsTokenSelectorOpen(true);
                }}
              />
            </div>

            {/* Swap Arrow - Positioned between Pay and Receive inputs */}
            <div className="relative h-0 -my-2 z-10 flex items-center justify-center">
              <button className="flex h-10 w-10 items-center justify-center rounded-lg border-[3px] border-[#0b0e11] bg-[#15191e] text-gray-400 shadow-lg hover:bg-[#1a1d26] hover:text-white transition-colors">
                <ArrowDown className="h-5 w-5" />
              </button>
            </div>

            <div className="relative">
              <TokenInput
                label={isSwap ? 'Receive' : activeTab}
                value={longAmount}
                token={receiveToken}
                onTokenClick={() => {
                  setTokenSelectorFor('receive');
                  setIsTokenSelectorOpen(true);
                }}
                subValue={!isSwap ? `${clampedLeverage.toFixed(2)}x` : undefined}
                readOnly
              />
            </div>

            {orderType === 'Limit' && (
              <div className="rounded-lg border border-white/10 bg-[#15191e] p-4 transition-colors hover:bg-[#1a1d26]">
                <div className="mb-2 flex justify-between text-xs text-gray-400">
                  <span>Limit Price</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.0"
                    value={limitPrice}
                    onChange={e => setLimitPrice(e.target.value)}
                    className="w-full min-w-0 bg-transparent text-2xl font-medium text-white placeholder-gray-600 outline-none"
                  />
                  <span className="text-sm text-gray-400">USD</span>
                </div>
              </div>
            )}
          </div>

          {/* Leverage Slider (Hidden for Swap) */}
          {!isSwap && (
            <LeverageSlider
              value={leverage}
              onChange={setLeverage}
              marks={LEVERAGE_MARKS}
              min={minLeverage}
              max={maxLeverage}
            />
          )}

          {/* Footer Info Area */}
          <div
            className={`mt-4 flex flex-col gap-2.5 rounded-lg p-1 text-[13px] ${
              isSwap ? 'min-h-[180px]' : ''
            }`}
          >
            {isSwap ? (
              // Swap Footer Content
              <>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Min. Receive</span>
                  <span className="text-white">-</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Price Impact / Fees</span>
                  <span className="text-gray-500">
                    <span className="text-white">0.000%</span> /{' '}
                    <span className="text-white">0.000%</span>
                  </span>
                </div>

                <div
                  className="flex items-center justify-between cursor-pointer group py-1"
                  onClick={() => setIsExecDetailsOpen(!isExecDetailsOpen)}
                >
                  <span className="text-gray-500 group-hover:text-white transition-colors">
                    Execution Details
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform ${
                      isExecDetailsOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>

                {isExecDetailsOpen && (
                  <div className="flex flex-col gap-2.5 pl-0 animate-in fade-in slide-in-from-top-1 duration-200">
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
                        <button className="rounded bg-white/5 px-2 py-0.5 text-xs text-gray-500 hover:text-white">
                          -
                        </button>
                        <span className="text-white">1%</span>
                      </div>
                    </div>
                  </div>
                )}

                {isWalletConnected ? (
                  <button
                    disabled={!(hasPay && (orderType !== 'Limit' || hasLimitPrice))}
                    className={`mt-4 w-full h-11 rounded-lg text-sm font-semibold transition-colors ${
                      hasPay && (orderType !== 'Limit' || hasLimitPrice)
                        ? 'bg-[#15F46F] text-[#06171E] hover:bg-[#12d160]'
                        : 'bg-white/5 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Trade
                  </button>
                ) : (
                  <button
                    onClick={onConnectWallet}
                    className="mt-4 w-full h-11 rounded-lg bg-[#15F46F] hover:bg-[#12d160] text-[#06171E] text-sm font-semibold transition-colors"
                  >
                    Connect Wallet
                  </button>
                )}
              </>
            ) : (
              // Long/Short Footer Content
              <>
                <div className="flex items-baseline justify-between">
                  <span className="text-gray-500">Pool</span>
                  <div className="flex items-center gap-1 text-gray-500 hover:text-white cursor-pointer group">
                    <span className="font-medium text-white group-hover:text-[#00ff9d] transition-colors">
                      BTC-USDC
                    </span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </div>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="border-b border-dashed border-gray-600/40 text-gray-500 cursor-help">
                    Collateral In
                  </span>
                  <div className="flex items-center gap-1 text-gray-500 hover:text-white cursor-pointer group">
                    <span className="font-medium text-white group-hover:text-[#00ff9d] transition-colors">
                      USDC
                    </span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </div>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-gray-500">Liquidation Price</span>
                  <span className="text-white">-</span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="border-b border-dashed border-gray-600/40 text-gray-500 cursor-help">
                    Price Impact / Fees
                  </span>
                  <div className="text-right text-gray-500">
                    <span className="text-white">0.000%</span> /{' '}
                    <span className="text-white">0.000%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between cursor-pointer group">
                  <span className="text-gray-500 group-hover:text-[#00ff9d] transition-colors">
                    Execution Details
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-[#00ff9d] transition-colors" />
                </div>

                {isWalletConnected ? (
                  <button
                    disabled={!(hasPay && (orderType !== 'Limit' || hasLimitPrice))}
                    className={`mt-4 w-full h-11 rounded-lg text-sm font-semibold transition-colors ${
                      hasPay && (orderType !== 'Limit' || hasLimitPrice)
                        ? 'bg-[#15F46F] text-[#06171E] hover:bg-[#12d160]'
                        : 'bg-white/5 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Trade
                  </button>
                ) : (
                  <button
                    onClick={onConnectWallet}
                    className="mt-4 w-full h-11 rounded-lg bg-[#15F46F] hover:bg-[#12d160] text-[#06171E] text-sm font-semibold transition-colors"
                  >
                    Connect Wallet
                  </button>
                )}
              </>
            )}
          </div>
          </div>
        ) : null}
          </>
        )}
        </div>
      </div>

      {/* Token Selector Modal - Desktop only */}
      {!isMobileSheet && (
        <TokenSelector
          isOpen={isTokenSelectorOpen}
          onClose={() => setIsTokenSelectorOpen(false)}
          onSelectToken={handleSelectToken}
          availableTokens={AVAILABLE_TOKENS}
          isMobile={false}
          isWalletConnected={isWalletConnected}
          networks={networks}
          selectedNetwork={selectedNetwork}
          onNetworkChange={setSelectedNetwork}
        />
      )}
    </>
  );
};
