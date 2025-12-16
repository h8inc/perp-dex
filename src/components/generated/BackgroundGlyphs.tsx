import React from 'react';
import { motion } from 'framer-motion';
export const BackgroundGlyphs = () => {
  return <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Ambient Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px] 2xl:w-[1000px] 2xl:h-[1000px] bg-purple-500/[0.15] rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px] 2xl:blur-[160px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px] 2xl:w-[1000px] 2xl:h-[1000px] bg-emerald-500/[0.15] rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px] 2xl:blur-[160px]" />
      </div>

      {/* Left Ring - Hidden on mobile, visible on larger screens */}
      <Ring className="hidden md:block left-[-250px] 2xl:left-[-500px] top-1/2 -translate-y-1/2 [--ring-sz:800px] 2xl:[--ring-sz:1300px]" direction={1} duration={120} />
      
      {/* Right Ring - Hidden on mobile, visible on larger screens */}
      <Ring className="hidden md:block right-[-250px] 2xl:right-[-500px] top-1/2 -translate-y-1/2 [--ring-sz:800px] 2xl:[--ring-sz:1300px]" direction={-1} duration={140} />
    </div>;
};
const Ring = ({
  className,
  direction,
  duration
}: {
  className: string;
  direction: number;
  duration: number;
}) => {
  // Glyph sets
  const outerGlyphs = ["0", "1", "0", "1", "8", "4", "X", "Y", "ETH", "BTC", "0", "1"];
  const midGlyphs = ["+", "×", "÷", "-", "=", "≠", "≈", "∞"];
  return <div className={`absolute ${className} flex items-center justify-center will-change-transform`} style={{
    width: 'var(--ring-sz)',
    height: 'var(--ring-sz)'
  }}>
       {/* Outer Circle Track */}
       <div className="absolute inset-0 rounded-full border border-white/[0.1]" />

       {/* Outer Rotating Numbers */}
       <motion.div className="absolute inset-0 w-full h-full" animate={{
      rotate: 360 * direction
    }} transition={{
      duration: duration,
      repeat: Infinity,
      ease: "linear"
    }}>
         {outerGlyphs.map((glyph, i) => {
        const count = outerGlyphs.length;
        const angle = i / count * 360;
        return <div key={`outer-${i}`} className="absolute top-1/2 left-1/2 text-sm font-mono text-white/[0.2]" style={{
          transform: `rotate(${angle}deg) translate(calc(var(--ring-sz) / 2)) rotate(90deg)`
        }}>
               {glyph}
             </div>;
      })}
       </motion.div>

       {/* Middle Circle Track */}
       <div className="absolute inset-[15%] rounded-full border border-white/[0.08]" />

       {/* Middle Rotating Glyphs (Reverse) */}
       <motion.div className="absolute inset-[15%] w-[70%] h-[70%]" animate={{
      rotate: -360 * direction
    }} transition={{
      duration: duration * 0.7,
      repeat: Infinity,
      ease: "linear"
    }}>
          {midGlyphs.map((glyph, i) => {
        const count = midGlyphs.length;
        const angle = i / count * 360;
        return <div key={`mid-${i}`} className="absolute top-1/2 left-1/2 text-xl font-light text-white/[0.15]" style={{
          transform: `rotate(${angle}deg) translate(calc(var(--ring-sz) * 0.35)) rotate(-90deg)`
        }}>
               {glyph}
             </div>;
      })}
       </motion.div>
       
       {/* Inner Decorative Circle */}
       <div className="absolute inset-[30%] rounded-full border border-dashed border-white/[0.1]" />
       
       <motion.div className="absolute inset-[30%] w-[40%] h-[40%]" animate={{
      rotate: 360 * direction
    }} transition={{
      duration: duration * 0.5,
      repeat: Infinity,
      ease: "linear"
    }}>
          {/* A few random bits */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] text-white/[0.2]">0101</div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] text-white/[0.2]">1010</div>
       </motion.div>
    </div>;
};