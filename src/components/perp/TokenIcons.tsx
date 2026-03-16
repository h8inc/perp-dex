import React, { useState } from 'react';

const TOKEN_LOGO_URLS: Record<string, string> = {
  BTC: '/tokens/btc.png',
  WBTC: '/tokens/wbtc.png',
  ETH: '/tokens/eth.png',
  WETH: '/tokens/eth.png',
  USDC: '/tokens/usdc.png',
  USDT: '/tokens/usdt.png',
  SOL: '/tokens/sol.png',
  DAI: '/tokens/dai.png',
  MATIC: '/tokens/matic.png',
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
