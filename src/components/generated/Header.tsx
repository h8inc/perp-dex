import React from 'react';
type HeaderProps = {
  onStartTrading?: () => void;
};

export const Header = ({ onStartTrading }: HeaderProps) => {
  const handleStartTrading = () => {
    if (onStartTrading) {
      onStartTrading();
      return;
    }
    window.location.href = '/trading.html';
  };

  return <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-[72px] bg-transparent border-b border-white/5">
      {/* Left: Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        {['Docs', 'Blog', 'Podcast', 'Developers'].map(link => <a key={link} href="#" className="text-sm font-medium text-[#A0A0A0] hover:text-white transition-colors">
            {link}
          </a>)}
      </div>

      {/* Center: Logo */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 select-none">
        <div className="text-[#15F46F]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
          </svg>
        </div>
        <span className="text-white text-xl font-normal tracking-wide font-sans">extended</span>
      </div>

      {/* Right: CTA Button */}
      <div>
        <button onClick={handleStartTrading} className="bg-[#15F46F] hover:bg-[#12d160] text-[#06171E] px-6 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer">
          Start Trading
        </button>
      </div>
    </nav>;
};