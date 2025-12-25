import React from 'react';
import { ChevronDown } from 'lucide-react';
import { getTokenIcon } from '../TokenIcons';

export type Token = {
  symbol: string;
  name: string;
};

type TokenInputProps = {
  label: string;
  value: string;
  onChange?: (val: string) => void;
  token: Token;
  onTokenClick: () => void;
  subValue?: string;
  subValuePlacement?: 'inline' | 'below';
  balance?: string;
  readOnly?: boolean;
  compact?: boolean;
};

export const TokenInput = ({
  label,
  value,
  onChange,
  token,
  onTokenClick,
  subValue,
  subValuePlacement = 'inline',
  balance,
  readOnly = false,
  compact = false
}: TokenInputProps) => {
  const padding = compact ? 'p-3' : 'p-4';
  const inputSize = compact ? 'text-xl' : 'text-2xl';
  const tokenBtnPadding = compact ? 'py-1 px-2.5' : 'py-1.5 pl-2 pr-3';
  const tokenIconSize = compact ? 20 : 24;

  return (
    <div className={`rounded-lg border border-white/10 bg-[#15191e] ${padding} transition-colors focus-within:border-[#00ff9d]/50 hover:bg-[#1a1d26]`}>
      <div className="mb-2 flex justify-between text-xs text-gray-400">
        <span>{label}</span>
        {balance && <span>{balance}</span>}
      </div>
      <div className="flex items-center justify-between gap-3">
        <input
          type="text"
          inputMode="decimal"
          placeholder="0.0"
          value={value}
          onChange={e => onChange && onChange(e.target.value)}
          readOnly={readOnly}
          className={`w-full min-w-0 bg-transparent ${inputSize} font-medium text-white placeholder-gray-600 outline-none`}
        />
        <div className="flex shrink-0 items-center gap-2">
          {subValue && subValuePlacement === 'inline' && (
            <div className="flex items-baseline gap-1 mr-2">
              <span className="text-xs text-gray-400">Leverage:</span>
              <span className="text-xs text-gray-400">{subValue}</span>
            </div>
          )}
          <button
            onClick={onTokenClick}
            className={`flex items-center gap-2 rounded-full bg-white/5 ${tokenBtnPadding} hover:bg-white/10 transition-colors border border-transparent hover:border-white/10 cursor-pointer`}
          >
            {getTokenIcon(token.symbol, tokenIconSize)}
            <span className="text-base font-medium text-white">{token.symbol}</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>
      {subValue && subValuePlacement === 'below' && (
        <div className="mt-2 flex justify-end text-xs text-gray-400">
          <span className="mr-1">Leverage:</span>
          <span>{subValue}</span>
        </div>
      )}
      <div className="mt-1 text-xs text-gray-500">$0.00</div>
    </div>
  );
};

