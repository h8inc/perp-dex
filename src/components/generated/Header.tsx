import React, { useState, useEffect } from 'react';
import { MoreHorizontal, X } from 'lucide-react';
import { motion } from 'framer-motion';
type HeaderProps = {
  onStartTrading?: () => void;
};

export const Header = ({ onStartTrading }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigationLinks = ['Docs', 'Blog', 'Podcast', 'Developers'];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleStartTrading = () => {
    if (onStartTrading) {
      onStartTrading();
      return;
    }
    window.location.href = '/trading.html';
  };

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -72 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-8 h-[72px] backdrop-blur-md bg-[#1D1D1D]/80 border-b border-white/10"
      >
        {/* Mobile: Logo on Left */}
        <div className="md:hidden flex items-center select-none">
          <img 
            src="/logo.svg" 
            alt="Extended" 
            className="h-5 w-auto"
          />
        </div>

        {/* Desktop: Navigation Links on Left */}
        <div className="hidden md:flex items-center gap-8">
          {navigationLinks.map(link => (
            <a key={link} href="#" className="text-sm font-medium text-[#A0A0A0] hover:text-white transition-colors">
              {link}
            </a>
          ))}
        </div>

        {/* Desktop: Logo in Center */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center select-none">
          <img 
            src="/logo.svg" 
            alt="Extended" 
            className="h-6 w-auto"
          />
        </div>

        {/* Right: Mobile - Hamburger Menu + Start Trading Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-white hover:text-[#15F46F] transition-colors bg-white/5 hover:bg-white/10 rounded-lg"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <MoreHorizontal className="w-5 h-5" />
            )}
          </button>
          <button onClick={handleStartTrading} className="bg-[#15F46F] hover:bg-[#12d160] text-[#06171E] px-4 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap">
            Start Trading
          </button>
        </div>

        {/* Right: Desktop - Start Trading Button */}
        <div className="hidden md:block">
          <button onClick={handleStartTrading} className="bg-[#15F46F] hover:bg-[#12d160] text-[#06171E] px-6 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap">
            Start Trading
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed top-[72px] left-0 right-0 z-50 bg-[#1D1D1D] border-b border-white/10 md:hidden">
            <div className="flex flex-col">
              {navigationLinks.map(link => (
                <a
                  key={link}
                  href="#"
                  className="px-6 py-4 text-sm font-medium text-[#A0A0A0] hover:text-white hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};