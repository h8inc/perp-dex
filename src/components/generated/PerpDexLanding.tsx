import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, TrendingUp, Users, DollarSign } from 'lucide-react';
type PerpDexLandingProps = Record<string, never>;

// @component: PerpDexLanding
export const PerpDexLanding = (_props: PerpDexLandingProps) => {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('ETH');
  const [isAssetDropdownOpen, setIsAssetDropdownOpen] = useState(false);
  const assets = ['ETH', 'BTC', 'SOL', 'ARB'];

  // @return
  return <div className="min-h-screen w-full bg-[#1D1D1D] text-white font-['Inter'] overflow-x-hidden relative">
      {/* Creative Pattern Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#15F46F]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }} className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 sm:mb-12 tracking-tight" style={{
          height: "45px",
          fontWeight: "400",
          fontSize: "48px",
          marginBottom: "32px"
        }}>
            Non-Custodial Trading: Crypto & TradFi at <span className="text-[#15F46F]">100x Leverage</span>
          </h1>

          <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="max-w-lg mx-auto">
            <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#15F46F]/10 via-transparent to-transparent rounded-2xl pointer-events-none" />
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#15F46F]/20 to-transparent rounded-2xl blur-xl opacity-50 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex gap-2 mb-6">
                  <button onClick={() => setTradeType('buy')} className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${tradeType === 'buy' ? 'bg-[#15F46F] text-[#06171E] shadow-lg shadow-[#15F46F]/30' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
                    Buy
                  </button>
                  <button onClick={() => setTradeType('sell')} className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${tradeType === 'sell' ? 'bg-[#15F46F] text-[#06171E] shadow-lg shadow-[#15F46F]/30' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
                    Sell
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm text-white/60 mb-2 font-medium">
                      Amount
                    </label>
                    <input type="text" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-[#15F46F]/50 focus:border-[#15F46F]/50 transition-all" />
                  </div>

                  <div className="relative">
                    <label className="block text-sm text-white/60 mb-2 font-medium">
                      Asset
                    </label>
                    <button onClick={() => setIsAssetDropdownOpen(!isAssetDropdownOpen)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-lg flex items-center justify-between hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-[#15F46F]/50 focus:border-[#15F46F]/50">
                      <span>{selectedAsset}</span>
                      <ChevronDown className={`w-5 h-5 transition-transform ${isAssetDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isAssetDropdownOpen && <motion.div initial={{
                    opacity: 0,
                    y: -10
                  }} animate={{
                    opacity: 1,
                    y: 0
                  }} className="absolute top-full left-0 right-0 mt-2 bg-[#0a1f2a] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-20">
                        {assets.map(asset => <button key={asset} onClick={() => {
                      setSelectedAsset(asset);
                      setIsAssetDropdownOpen(false);
                    }} className="w-full px-4 py-3 text-left text-white hover:bg-[#15F46F]/20 transition-colors">
                            {asset}
                          </button>)}
                      </motion.div>}
                  </div>
                </div>

                <motion.button whileHover={{
                scale: 1.02
              }} whileTap={{
                scale: 0.98
              }} className="w-full bg-[#15F46F] hover:bg-[#ADFFCE] text-[#06171E] font-bold py-4 rounded-xl text-lg transition-all duration-200 shadow-lg shadow-[#15F46F]/30 hover:shadow-[#ADFFCE]/40">
                  Trade Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.4
      }} className="text-center">
          <p className="text-white/80 text-lg sm:text-xl font-medium mb-12 sm:mb-20 max-w-3xl mx-auto px-4">
            Trade forex, gold, indices with USDC. DeFi-powered unified margins, spot markets, lending ahead.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <motion.div className="p-6 sm:p-8">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">735K</div>
              <div className="text-white/60 text-sm sm:text-base font-medium">Traders</div>
            </motion.div>

            <motion.div className="p-6 sm:p-8">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">$100M</div>
              <div className="text-white/60 text-sm sm:text-base font-medium">Open Interest</div>
            </motion.div>

            <motion.div className="p-6 sm:p-8">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">$345B</div>
              <div className="text-white/60 text-sm sm:text-base font-medium">Total Volume</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>;
};