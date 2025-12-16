import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export type OrderType = 'Market' | 'Limit' | 'TWAP' | 'TPSL' | 'StopMarket';

type OrderTypeSelectorProps = {
  orderType: OrderType;
  onOrderTypeChange: (type: OrderType) => void;
  isSwap: boolean;
};

export const OrderTypeSelector = ({
  orderType,
  onOrderTypeChange,
  isSwap
}: OrderTypeSelectorProps) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  return (
    <div className="flex gap-1 text-[13px] relative">
      <button
        onClick={() => {
          onOrderTypeChange('Market');
          setShowMoreMenu(false);
        }}
        className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
          orderType === 'Market'
            ? 'bg-white/10 text-white'
            : 'text-gray-500 hover:text-white'
        }`}
      >
        Market
      </button>
      <button
        onClick={() => {
          onOrderTypeChange('Limit');
          setShowMoreMenu(false);
        }}
        className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
          orderType === 'Limit'
            ? 'bg-white/10 text-white'
            : 'text-gray-500 hover:text-white'
        }`}
      >
        Limit
      </button>

      {isSwap ? (
        <button
          onClick={() => {
            onOrderTypeChange('TWAP');
            setShowMoreMenu(false);
          }}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            orderType === 'TWAP'
              ? 'bg-white/10 text-white'
              : 'text-gray-500 hover:text-white'
          }`}
        >
          TWAP
        </button>
      ) : (
        <div className="relative">
          <button
            onClick={() => setShowMoreMenu(prev => !prev)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${
              ['TPSL', 'StopMarket', 'TWAP'].includes(orderType)
                ? 'bg-white/10 text-white'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            More <ChevronDown className="h-3 w-3" />
          </button>
          {showMoreMenu && (
            <div className="absolute z-30 mt-1 w-40 rounded-lg border border-white/10 bg-[#0f1117] shadow-lg">
              {(
                [
                  ['TPSL', 'TP/SL'],
                  ['StopMarket', 'Stop Market'],
                  ['TWAP', 'TWAP']
                ] as const
              ).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => {
                    onOrderTypeChange(val as OrderType);
                    setShowMoreMenu(false);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-sm text-left hover:bg-white/5 ${
                    orderType === val ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

