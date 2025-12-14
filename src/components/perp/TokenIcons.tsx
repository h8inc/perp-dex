import React from 'react';

// Token icon URLs matching CryptoSwapWidget
const BTC_ICON_URL = "https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png?v=026";
const ETH_ICON_URL = "https://token-icons.s3.amazonaws.com/eth.png";
const USDC_ICON_URL = "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026";
const USDT_ICON_URL = "https://cryptologos.cc/logos/tether-usdt-logo.png?v=026";
const SOL_ICON_URL = "https://cryptologos.cc/logos/solana-sol-logo.png?v=026";

// Bitcoin Icon - Using image URL from CryptoSwapWidget (same as WBTC)
export const BitcoinIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <img 
    src={BTC_ICON_URL} 
    alt="BTC" 
    className={`rounded-full ${className}`}
    style={{ width: size, height: size }}
    onError={(e) => {
      (e.target as HTMLImageElement).src = "https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png?v=026";
    }}
  />
);

// Ethereum Icon - Using image URL from CryptoSwapWidget
export const EthereumIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <img 
    src={ETH_ICON_URL} 
    alt="ETH" 
    className={`rounded-full ${className}`}
    style={{ width: size, height: size }}
    onError={(e) => {
      (e.target as HTMLImageElement).src = "https://token-icons.s3.amazonaws.com/eth.png";
    }}
  />
);

// USDC Icon - Using image URL from CryptoSwapWidget
export const USDCIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <img 
    src={USDC_ICON_URL} 
    alt="USDC" 
    className={`rounded-full ${className}`}
    style={{ width: size, height: size }}
    onError={(e) => {
      (e.target as HTMLImageElement).src = "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026";
    }}
  />
);

// Wrapped Bitcoin Icon - Uses same image URL as Bitcoin
export const WBTCIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <img 
    src={BTC_ICON_URL} 
    alt="WBTC" 
    className={`rounded-full ${className}`}
    style={{ width: size, height: size }}
    onError={(e) => {
      (e.target as HTMLImageElement).src = "https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png?v=026";
    }}
  />
);

// USDT Icon - Using image URL from CryptoSwapWidget
export const USDTIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <img 
    src={USDT_ICON_URL} 
    alt="USDT" 
    className={`rounded-full ${className}`}
    style={{ width: size, height: size }}
    onError={(e) => {
      (e.target as HTMLImageElement).src = "https://cryptologos.cc/logos/tether-usdt-logo.png?v=026";
    }}
  />
);

// Solana Icon - Using image URL from CryptoSwapWidget
export const SolanaIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <img 
    src={SOL_ICON_URL} 
    alt="SOL" 
    className={`rounded-full ${className}`}
    style={{ width: size, height: size }}
    onError={(e) => {
      (e.target as HTMLImageElement).src = "https://cryptologos.cc/logos/solana-sol-logo.png?v=026";
    }}
  />
);

// Token icon mapper
export const getTokenIcon = (symbol: string, size = 24, className = '') => {
  const normalizedSymbol = symbol.toUpperCase();
  
  switch (normalizedSymbol) {
    case 'BTC':
      return <BitcoinIcon size={size} className={className} />;
    case 'WBTC':
      return <WBTCIcon size={size} className={className} />;
    case 'ETH':
      return <EthereumIcon size={size} className={className} />;
    case 'WETH':
      return <EthereumIcon size={size} className={className} />;
    case 'USDC':
      return <USDCIcon size={size} className={className} />;
    case 'USDT':
      return <USDTIcon size={size} className={className} />;
    case 'SOL':
      return <SolanaIcon size={size} className={className} />;
    default:
      // Fallback to a generic icon
      return (
        <div className={`flex items-center justify-center rounded-full bg-white/10 font-bold text-white ${className}`} style={{ width: size, height: size, fontSize: size * 0.4 }}>
          {normalizedSymbol.slice(0, 2)}
        </div>
      );
  }
};
