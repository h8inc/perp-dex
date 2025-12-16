import React from 'react';

type TabButtonProps = {
  active: boolean;
  label: string;
  onClick: () => void;
  accentColor?: 'green' | 'blue';
};

export const TabButton = ({
  active,
  label,
  onClick,
  accentColor = 'green'
}: TabButtonProps) => {
  const activeClass = 'bg-[#00ff9d]/10 text-[#00ff9d] border-b-[#00ff9d]';
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-5 py-4 text-sm font-medium transition-colors border-b-[2px] ${
        active
          ? activeClass
          : 'text-gray-400 border-b-transparent hover:text-white hover:bg-white/5'
      } first:rounded-tl-lg last:rounded-tr-lg`}
    >
      {label}
    </button>
  );
};

type TradingTabsProps = {
  activeTab: 'Long' | 'Short' | 'Swap';
  onTabChange: (tab: 'Long' | 'Short' | 'Swap') => void;
};

export const TradingTabs = ({ activeTab, onTabChange }: TradingTabsProps) => {
  return (
    <div className="flex h-10 items-center justify-between rounded-t-xl border-b border-white/10 bg-[#0b0e11] overflow-hidden">
      <div className="flex w-full">
        <TabButton
          active={activeTab === 'Long'}
          label="Long"
          onClick={() => onTabChange('Long')}
          accentColor="green"
        />
        <TabButton
          active={activeTab === 'Short'}
          label="Short"
          onClick={() => onTabChange('Short')}
          accentColor="green"
        />
        <TabButton
          active={activeTab === 'Swap'}
          label="Swap"
          onClick={() => onTabChange('Swap')}
        />
      </div>
    </div>
  );
};

