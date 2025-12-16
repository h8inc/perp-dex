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
  balance?: string;
  readOnly?: boolean;
};

export const TokenInput = ({
  label,
  value,
  onChange,
  token,
  onTokenClick,
  subValue,
  balance,
  readOnly = false
}: TokenInputProps) => {
  return (
    <div className="rounded-lg border border-white/10 bg-[#15191e] p-4 transition-colors focus-within:border-[#00ff9d]/50 hover:bg-[#1a1d26]">
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
          className="w-full min-w-0 bg-transparent text-2xl font-medium text-white placeholder-gray-600 outline-none"
        />
        <div className="flex shrink-0 items-center gap-2">
          {subValue && (
            <div className="flex items-baseline gap-1 mr-2">
              <span className="text-xs text-gray-400">Leverage:</span>
              <span className="text-xs text-gray-400">{subValue}</span>
            </div>
          )}
          <button
            onClick={onTokenClick}
            className="flex items-center gap-2 rounded-full bg-white/5 py-1.5 pl-2 pr-3 hover:bg-white/10 transition-colors border border-transparent hover:border-white/10 cursor-pointer"
          >
            {getTokenIcon(token.symbol, 24)}
            <span className="text-base font-medium text-white">{token.symbol}</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>
      <div className="mt-1 text-xs text-gray-500">$0.00</div>
    </div>
  );
};

