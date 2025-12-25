import React, { useRef, useEffect, useCallback, useState } from 'react';

type SliderMark = {
  val: number;
  label: string;
};

type SliderMarkComponentProps = {
  label: string;
  position: string;
  active: boolean;
};

const SliderMarkComponent = ({ label, position, active }: SliderMarkComponentProps) => (
  <div
    className="absolute flex -translate-x-1/2 flex-col items-center"
    style={{
      left: position,
      top: '50%'
    }}
  >
    <div
      className={`mb-2 h-1.5 w-1.5 -translate-y-1/2 rounded-full transition-opacity ${
        active ? 'bg-[#00ff9d] ring-2 ring-[#0b0e11] opacity-100' : 'opacity-0'
      }`}
    />
    <span
      className={`mt-2 text-[10px] font-medium uppercase ${
        active ? 'text-gray-300' : 'text-gray-600'
      }`}
    >
      {label}
    </span>
  </div>
);

type LeverageSliderProps = {
  value: number;
  onChange: (value: number) => void;
  marks: SliderMark[];
  min: number;
  max: number;
};

export const LeverageSlider = ({
  value,
  onChange,
  marks,
  min,
  max
}: LeverageSliderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  // Calculate positions for marks
  const marksWithPos = marks.map((m, i) => ({
    ...m,
    pos: (i / (marks.length - 1)) * 100
  }));

  // Clamp value
  const clampedValue = Math.min(max, Math.max(min, value));

  // Calculate percentage position
  const valuePct = (() => {
    if (marksWithPos.length === 1) return 0;
    for (let i = 0; i < marksWithPos.length - 1; i++) {
      const left = marksWithPos[i];
      const right = marksWithPos[i + 1];
      if (clampedValue <= right.val) {
        const range = right.val - left.val || 1;
        const t = (clampedValue - left.val) / range;
        return left.pos + (right.pos - left.pos) * t;
      }
    }
    return 100;
  })();

  const updateValueFromPosition = useCallback(
    (clientX: number) => {
      const rect = sliderRef.current?.getBoundingClientRect();
      if (!rect) return;
      const pct = ((clientX - rect.left) / rect.width) * 100;
      const clampedPct = Math.min(100, Math.max(0, pct));
      for (let i = 0; i < marksWithPos.length - 1; i++) {
        const left = marksWithPos[i];
        const right = marksWithPos[i + 1];
        if (clampedPct <= right.pos) {
          const span = right.pos - left.pos || 1;
          const t = (clampedPct - left.pos) / span;
          const nextVal = left.val + (right.val - left.val) * t;
          onChange(nextVal);
          return;
        }
      }
      onChange(max);
    },
    [marksWithPos, max, onChange]
  );

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      updateValueFromPosition(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      updateValueFromPosition(e.touches[0].clientX);
    };
    const stop = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', stop);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', stop);
    window.addEventListener('touchcancel', stop);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', stop);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', stop);
      window.removeEventListener('touchcancel', stop);
    };
  }, [isDragging, updateValueFromPosition]);

  return (
    <div className="mt-6 px-1">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400">Leverage</span>
        <div className="rounded bg-white/5 px-2 py-1 text-right text-xs font-mono text-white border border-white/10">
          {clampedValue.toFixed(2)}x
        </div>
      </div>

      <div
        className="relative mb-8 h-4 w-full select-none px-2"
        ref={sliderRef}
        onMouseDown={e => {
          setIsDragging(true);
          updateValueFromPosition(e.clientX);
        }}
        onTouchStart={e => {
          setIsDragging(true);
          updateValueFromPosition(e.touches[0].clientX);
        }}
      >
        {/* Rail */}
        <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-white/10" />

        {/* Track */}
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#00ff9d]"
          style={{
            width: `${valuePct}%`
          }}
        />

        {/* Handle */}
        <div
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 -translate-x-1/2 cursor-grab rounded-full border-2 border-[#00ff9d] bg-[#0b0e11] shadow z-10 hover:scale-110 transition-transform"
          style={{
            left: `${valuePct}%`
          }}
        />

        {/* Marks */}
        <div className="pointer-events-none absolute inset-y-0 left-2 right-2">
          {marksWithPos.map((m, i) => (
            <SliderMarkComponent
              key={i}
              label={m.label}
              position={`${m.pos}%`}
              active={valuePct >= m.pos}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

