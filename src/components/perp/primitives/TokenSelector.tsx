import React, { useState, useRef, useEffect } from 'react';
import { X, Search, ArrowLeft, ChevronDown, Wallet, Clock, TrendingUp, Coins } from 'lucide-react';
import { getTokenIcon } from '../TokenIcons';

// Flexible token type that supports both structures
export type TokenData = {
  symbol: string;
  name: string;
  icon?: string; // Optional icon URL (for CryptoSwapWidget style)
  balance?: string; // Optional balance display
  value?: string; // Optional USD value
  address?: string; // Optional contract address
  [key: string]: any; // Allow additional properties
};

export type Network = {
  id: string;
  name: string;
  icon?: string;
};

type TokenSelectorProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectToken: (token: TokenData) => void;
  availableTokens: TokenData[];
  isMobile?: boolean;
  popularTokens?: TokenData[]; // Optional separate popular tokens list
  title?: string; // Optional custom title
  listTitle?: string; // Optional custom list title
  isWalletConnected?: boolean; // Wallet connection status
  userTokens?: TokenData[]; // User's tokens (when wallet connected)
  recentSearches?: TokenData[]; // Recent token searches
  networks?: Network[]; // Available networks
  selectedNetwork?: Network; // Currently selected network
  onNetworkChange?: (network: Network) => void; // Network change handler
  onClearRecentSearches?: () => void; // Clear recent searches handler
};

// Helper component to render a token row
const TokenRow = ({ 
  token, 
  onClick, 
  showBalance = false,
  showValue = false,
  showAddress = false 
}: { 
  token: TokenData; 
  onClick: () => void;
  showBalance?: boolean;
  showValue?: boolean;
  showAddress?: boolean;
}) => {
  const renderTokenIcon = (token: TokenData, size: number) => {
    if (token.icon) {
      return (
        <img
          src={token.icon}
          alt={token.symbol}
          className="w-full h-full object-cover rounded-full"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      );
    }
    return getTokenIcon(token.symbol, size);
  };

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 active:bg-white/5 transition-colors group text-left cursor-pointer"
    >
      <div className="w-10 h-10 rounded-full overflow-hidden bg-[#2d2d2d] shrink-0 flex items-center justify-center">
        {renderTokenIcon(token, 40)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white font-medium text-base truncate">
            {token.name}
          </span>
          <span className="text-[#5d6785] text-xs font-medium bg-[#1f1f1f] px-1.5 py-0.5 rounded uppercase">
            {token.symbol}
          </span>
          {showAddress && token.address && (
            <span className="text-[#5d6785] text-xs font-mono">
              {token.address.slice(0, 6)}...{token.address.slice(-4)}
            </span>
          )}
        </div>
        {(showBalance || showValue) && (
          <div className="flex items-center gap-2 mt-0.5">
            {showBalance && token.balance && (
              <span className="text-[#a0a0a0] text-sm">
                {token.balance}
              </span>
            )}
            {showValue && token.value && (
              <span className="text-white text-sm font-medium">
                {token.value}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
};

export const TokenSelector = ({
  isOpen,
  onClose,
  onSelectToken,
  availableTokens,
  isMobile = false,
  popularTokens,
  title = 'Select a token',
  listTitle = 'Tokens by 24H volume',
  isWalletConnected = false,
  userTokens = [],
  recentSearches = [],
  networks = [],
  selectedNetwork,
  onNetworkChange,
  onClearRecentSearches
}: TokenSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState(false);
  const networkDropdownRef = useRef<HTMLDivElement>(null);

  // Close network dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (networkDropdownRef.current && !networkDropdownRef.current.contains(event.target as Node)) {
        setIsNetworkDropdownOpen(false);
      }
    };

    if (isNetworkDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isNetworkDropdownOpen]);

  if (!isOpen) return null;

  // Use popularTokens if provided, otherwise use availableTokens for the grid
  const tokensForGrid = popularTokens || availableTokens;
  
  // Filter tokens based on search query
  const filterTokens = (tokens: TokenData[]) => {
    if (!searchQuery) return tokens;
    return tokens.filter(
      t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.address?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredUserTokens = filterTokens(userTokens);
  const filteredRecentSearches = filterTokens(recentSearches);
  const filteredAvailableTokens = filterTokens(availableTokens);

  // Show sections based on search query and wallet status
  const showUserTokens = isWalletConnected && (searchQuery ? filteredUserTokens.length > 0 : userTokens.length > 0);
  const showRecentSearches = searchQuery ? filteredRecentSearches.length > 0 : recentSearches.length > 0;
  const showAvailableTokens = filteredAvailableTokens.length > 0;

  const handleSelect = (token: TokenData) => {
    onSelectToken(token);
    setSearchQuery('');
    onClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    setIsNetworkDropdownOpen(false);
    onClose();
  };

  const handleNetworkSelect = (network: Network) => {
    onNetworkChange?.(network);
    setIsNetworkDropdownOpen(false);
  };

  // Render search bar with network selector
  const renderSearchBar = (bgColor: string) => (
    <div className="px-4 pb-4 shrink-0">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a0a0a0] group-focus-within:text-[#00ff9d] transition-colors z-10" />
        <input
          type="text"
          placeholder="Search tokens"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className={`w-full bg-[#1f1f1f] text-white placeholder-[#5d6785] rounded-xl pl-10 ${networks.length > 0 ? 'pr-24' : 'pr-4'} py-3 outline-none border border-transparent focus:border-[#00ff9d]/50 transition-all text-base`}
        />
        {networks.length > 0 && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20" ref={networkDropdownRef}>
            <button
              onClick={() => setIsNetworkDropdownOpen(!isNetworkDropdownOpen)}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-[#2d2d2d] hover:bg-[#393939] border border-white/5 transition-colors cursor-pointer"
            >
              {selectedNetwork?.icon ? (
                <img src={selectedNetwork.icon} alt={selectedNetwork.name} className="w-4 h-4 rounded-full shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-[#00ff9d] shrink-0" />
              )}
              <span className="text-xs font-medium text-white whitespace-nowrap">
                {selectedNetwork?.name || 'Network'}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#a0a0a0] transition-transform shrink-0 ${isNetworkDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isNetworkDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#1f1f1f] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                {networks.map(network => (
                  <button
                    key={network.id}
                    onClick={() => handleNetworkSelect(network)}
                    className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 transition-colors text-left ${
                      selectedNetwork?.id === network.id ? 'bg-white/5' : ''
                    }`}
                  >
                    {network.icon ? (
                      <img src={network.icon} alt={network.name} className="w-4 h-4 rounded-full" />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-[#00ff9d]" />
                    )}
                    <span className="text-sm text-white">{network.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Render token list sections
  const renderTokenSections = (bgColor: string) => (
    <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4 min-h-0">
      {/* Popular Tokens Grid */}
      {!searchQuery && tokensForGrid.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {tokensForGrid.map(token => (
            <button
              key={token.symbol}
              onClick={() => handleSelect(token)}
              className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border border-white/5 bg-[#1f1f1f]/50 hover:bg-[#2d2d2d] active:bg-[#2d2d2d] transition-colors group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-[#2d2d2d] shrink-0 flex items-center justify-center">
                {token.icon ? (
                  <img src={token.icon} alt={token.symbol} className="w-full h-full object-cover rounded-full" />
                ) : (
                  getTokenIcon(token.symbol, 32)
                )}
              </div>
              <span className="text-xs font-medium text-white group-hover:text-white/90">
                {token.symbol}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Your tokens section */}
      {showUserTokens && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-[#a0a0a0] font-medium mb-2 sticky top-0 bg-[#0b0e11] py-2 z-10">
            <Coins className="w-4 h-4" />
            <span>Your tokens</span>
          </div>
          <div className="space-y-1">
            {(searchQuery ? filteredUserTokens : userTokens).map(token => (
              <TokenRow
                key={`${token.symbol}-${token.address || ''}`}
                token={token}
                onClick={() => handleSelect(token)}
                showBalance={true}
                showValue={true}
                showAddress={!!token.address}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent searches section */}
      {showRecentSearches && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-[#a0a0a0] font-medium mb-2 sticky top-0 bg-[#0b0e11] py-2 z-10">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Recent searches</span>
            </div>
            {onClearRecentSearches && !searchQuery && (
              <button
                onClick={onClearRecentSearches}
                className="text-xs text-[#5d6785] hover:text-white transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <div className="space-y-1">
            {(searchQuery ? filteredRecentSearches : recentSearches).map(token => (
              <TokenRow
                key={`recent-${token.symbol}-${token.address || ''}`}
                token={token}
                onClick={() => handleSelect(token)}
                showAddress={!!token.address}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tokens by 24H volume section */}
      {showAvailableTokens && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-[#a0a0a0] font-medium mb-2 sticky top-0 bg-[#0b0e11] py-2 z-10">
            <TrendingUp className="w-4 h-4" />
            <span>{listTitle}</span>
          </div>
          <div className="space-y-1">
            {filteredAvailableTokens.map(token => (
              <TokenRow
                key={`available-${token.symbol}-${token.address || ''}`}
                token={token}
                onClick={() => handleSelect(token)}
                showAddress={!!token.address}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!showUserTokens && !showRecentSearches && !showAvailableTokens && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-[#a0a0a0] text-sm">No tokens found</p>
        </div>
      )}
    </div>
  );

  // Mobile: Render as second page bottom sheet
  if (isMobile) {
    return (
      <div className="absolute inset-0 bg-[#0b0e11] flex flex-col h-full animate-in slide-in-from-right duration-300">
        {/* Header with Back Arrow */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10 shrink-0">
          <button
            onClick={handleClose}
            className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-white font-semibold text-lg flex-1">{title}</h3>
        </div>

        {/* Search Bar with Network Selector */}
        {renderSearchBar('#0b0e11')}

        {/* Token List Sections */}
        {renderTokenSections('#0b0e11')}
      </div>
    );
  }

  // Desktop: Render as modal overlay
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative w-[480px] max-w-full h-[600px] max-h-[90vh] bg-[#131313]/95 backdrop-blur-xl rounded-[24px] border border-white/10 flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-2 shrink-0">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6 text-[#a0a0a0] hover:text-white" />
          </button>
        </div>

        {/* Search Bar with Network Selector */}
        {renderSearchBar('#131313')}

        {/* Token List Sections */}
        {renderTokenSections('#131313')}
      </div>
    </div>
  );
};
