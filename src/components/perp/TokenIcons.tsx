import React, { useState } from 'react';

// Token logo URL mappings using reliable CDN sources
const TOKEN_LOGO_URLS: Record<string, string> = {
  BTC: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
  WBTC: 'https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png',
  ETH: 'https://token-icons.s3.amazonaws.com/eth.png',
  WETH: 'https://assets.coingecko.com/coins/images/2518/large/weth.png',
  USDC: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
  USDT: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
  SOL: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
  DAI: 'https://assets.coingecko.com/coins/images/9956/large/Badge_Dai.png',
  MATIC: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
};

// Token icon component with error handling
const TokenIconWithErrorHandling = ({ 
  symbol, 
  size = 24, 
  className = '' 
}: { 
  symbol: string; 
  size?: number; 
  className?: string;
}) => {
  const normalizedSymbol = symbol.toUpperCase();
  const logoUrl = TOKEN_LOGO_URLS[normalizedSymbol];
  const [imageError, setImageError] = useState(false);

  if (logoUrl && !imageError) {
    return (
      <img
        src={logoUrl}
        alt={normalizedSymbol}
        className={`rounded-full ${className}`}
        style={{ width: size, height: size, objectFit: 'cover' }}
        onError={() => setImageError(true)}
      />
    );
  }

  // Fallback to a generic icon
  return (
    <div 
      className={`flex items-center justify-center rounded-full bg-white/10 font-bold text-white ${className}`} 
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {normalizedSymbol.slice(0, 2)}
    </div>
  );
};

// Token icon mapper (backwards compatible)
export const getTokenIcon = (symbol: string, size = 24, className = '') => {
  const normalizedSymbol = symbol.toUpperCase();
  const logoUrl = TOKEN_LOGO_URLS[normalizedSymbol];

  if (logoUrl) {
    return <TokenIconWithErrorHandling symbol={normalizedSymbol} size={size} className={className} />;
  }

  // Fallback to a generic icon
  return (
    <div 
      className={`flex items-center justify-center rounded-full bg-white/10 font-bold text-white ${className}`} 
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {normalizedSymbol.slice(0, 2)}
    </div>
  );
};
