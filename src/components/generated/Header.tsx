import React, { useState } from 'react';
type HeaderProps = {
  onStartTrading?: () => void;
};

export const Header = ({ onStartTrading }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleStartTrading = () => {
    if (onStartTrading) {
      onStartTrading();
      return;
    }
    window.location.href = '/trading.html';
  };

  const links = ['Docs', 'Blog', 'Podcast', 'Developers'];

  return <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 h-[72px] bg-transparent border-b border-white/5 relative">
      {/* Left: Nav or Hamburger */}
      <div className="flex items-center">
        <button
          className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setMobileMenuOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className="block w-5 h-0.5 bg-white mb-1" />
          <span className="block w-5 h-0.5 bg-white mb-1" />
          <span className="block w-5 h-0.5 bg-white" />
        </button>
        <div className="hidden md:flex items-center gap-8">
          {links.map(link => <a key={link} href="#" className="text-sm font-medium text-[#A0A0A0] hover:text-white transition-colors">
              {link}
            </a>)}
        </div>
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
        <button onClick={handleStartTrading} className="bg-[#15F46F] hover:bg-[#12d160] text-[#06171E] px-4 py-2 rounded-lg text-xs md:text-sm md:px-6 md:py-2.5 font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer">
          Start Trading
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && <div className="md:hidden absolute top-full left-0 right-0 bg-[#0b0e11]/95 backdrop-blur-sm border-b border-white/10 px-4 py-3 flex flex-col gap-3">
          {links.map(link => <a key={link} href="#" className="text-sm font-medium text-[#A0A0A0] hover:text-white transition-colors">
              {link}
            </a>)}
        </div>}
    </nav>;
};