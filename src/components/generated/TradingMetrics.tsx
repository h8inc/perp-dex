import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
type MetricItemProps = {
  label: string;
  value: string;
  isInteractive?: boolean;
  href?: string;
};
const MetricItem = ({
  label,
  value,
  isInteractive,
  href = '#'
}: MetricItemProps) => {
  const commonClasses = "flex flex-col gap-1";
  if (isInteractive) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={cn(commonClasses, "group cursor-pointer")}>
        <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-slate-400 transition-colors duration-180 group-hover:text-blue-300 whitespace-nowrap">
          {label}
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
        </span>
        <div className="text-[28px] sm:text-[40px] font-medium tracking-tight text-foreground transition-colors duration-180 group-active:text-foreground/80 leading-none">
          {value}
        </div>
      </a>;
  }
  return <div className={commonClasses}>
      <span className="text-xs sm:text-sm text-slate-400 whitespace-nowrap">
        {label}
      </span>
      <div className="text-[28px] sm:text-[32px] md:text-[36px] font-medium tracking-tight text-foreground leading-none">
        {value}
      </div>
    </div>;
};

// @component: TradingMetrics
export const TradingMetrics = () => {
  const metrics = [{
    label: 'Traders',
    value: '735K',
    isInteractive: false
  }, {
    label: 'Open Interest',
    value: '$100M',
    isInteractive: false
  }, {
    label: '24h Volume',
    value: '$700M',
    isInteractive: true,
    href: 'https://dune.com/0xkody/extended-exchange-dex-capital-trading-risk-vaults'
  }] as any[];

  // @return
  return (
    <div
      className={cn(
        "w-full bg-transparent flex flex-row items-center justify-center flex-wrap",
        "gap-4 md:gap-12 lg:gap-20",
        "mt-8 pb-12 md:pb-8"
      )}
    >
      {metrics.map((metric, index) => (
        <MetricItem
          key={index}
          label={metric.label}
          value={metric.value}
          isInteractive={metric.isInteractive}
          href={metric.href}
        />
      ))}
    </div>
  );
};