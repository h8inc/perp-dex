import React from 'react';

// Bitcoin Icon - Official Bitcoin logo with proper ₿ symbol paths
export const BitcoinIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`rounded-full ${className}`}>
    <circle cx="12" cy="12" r="12" fill="#F7931A" />
    {/* Bitcoin symbol paths */}
    <path d="M9.5 7.5h2.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5h-2.5V7.5zm0 4h2.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5h-2.5v-5z" fill="white" />
    <path d="M8.5 7.5h1v9h-1v-9zm6 0h1v9h-1v-9z" fill="white" />
    <path d="M10.5 10.5h3v1h-3v-1zm0 2h3v1h-3v-1z" fill="#F7931A" />
  </svg>
);

// Ethereum Icon
export const EthereumIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`rounded-full bg-[#627EEA] ${className}`}>
    <path d="M12 2L5 12L12 16L19 12L12 2Z" fill="white" />
    <path d="M5 12L12 16L12 22L5 17V12Z" fill="white" opacity="0.6" />
    <path d="M19 12L12 16L12 22L19 17V12Z" fill="white" opacity="0.6" />
  </svg>
);

// USDC Icon - Proper SVG matching official USDC logo
export const USDCIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`rounded-full ${className}`}>
    <circle cx="12" cy="12" r="12" fill="#2775CA" />
    <circle cx="12" cy="12" r="10" fill="#2775CA" />
    <path d="M12 4C7.58 4 4 7.58 4 12s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" fill="white" />
    <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" fill="#2775CA" />
    <circle cx="12" cy="12" r="2.5" fill="white" />
  </svg>
);

// Wrapped Bitcoin Icon - Uses Bitcoin icon
export const WBTCIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <BitcoinIcon size={size} className={className} />
);

// USDT Icon
export const USDTIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`rounded-full bg-[#26a17b] ${className}`}>
    <circle cx="12" cy="12" r="12" fill="#26a17b" />
    <path d="M12 4.5C7.5 4.5 4 7.5 4 12C4 16.5 7.5 19.5 12 19.5C16.5 19.5 20 16.5 20 12C20 7.5 16.5 4.5 12 4.5ZM12 18C9 18 6.5 15.5 6.5 12.5C6.5 9.5 9 7 12 7C15 7 17.5 9.5 17.5 12.5C17.5 15.5 15 18 12 18Z" fill="white" />
    <path d="M9 10.5H15V11.5H9V10.5Z" fill="white" />
    <path d="M9 12.5H15V13.5H9V12.5Z" fill="white" />
  </svg>
);

// Solana Icon
export const SolanaIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`rounded-full bg-gradient-to-br from-[#14F195] to-[#9945FF] ${className}`}>
    <circle cx="12" cy="12" r="12" fill="url(#sol-gradient)" />
    <defs>
      <linearGradient id="sol-gradient" x1="0" y1="0" x2="24" y2="24">
        <stop offset="0%" stopColor="#14F195" />
        <stop offset="100%" stopColor="#9945FF" />
      </linearGradient>
    </defs>
    <path d="M7.5 7.5L16.5 7.5L7.5 16.5L16.5 16.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
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
