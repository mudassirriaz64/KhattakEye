import { useState, useEffect, useCallback } from "react";

type PriceSliderProps = {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  currency?: string;
};

export function PriceSlider({ min, max, value, onChange, currency = "Rs." }: PriceSliderProps) {
  const [local, setLocal] = useState(value);

  useEffect(() => { setLocal(value); }, [value]);

  const handleChange = useCallback((index: 0 | 1, newVal: number) => {
    const clamped = Math.min(max, Math.max(min, newVal));
    const next: [number, number] = index === 0
      ? [Math.min(clamped, local[1]), local[1]]
      : [local[0], Math.max(clamped, local[0])];
    setLocal(next);
    onChange(next);
  }, [min, max, local, onChange]);

  const percentMin = ((local[0] - min) / (max - min)) * 100;
  const percentMax = ((local[1] - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="relative h-2">
        <div className="absolute inset-0 rounded-full bg-[color:var(--color-border)]" />
        <div
          className="absolute h-full rounded-full bg-[color:var(--color-brand-primary)]"
          style={{ left: `${percentMin}%`, right: `${100 - percentMax}%` }}
        />
        {[0, 1].map((idx) => (
          <input
            key={idx}
            type="range"
            min={min}
            max={max}
            value={local[idx]}
            onChange={(e) => handleChange(idx as 0 | 1, Number(e.target.value))}
            className="absolute top-0 h-2 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-[color:var(--color-brand-primary)] [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
            style={{ zIndex: idx === 1 ? 1 : 2 }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-sm text-[color:var(--color-text-secondary)]">
        <span>{currency} {local[0].toLocaleString()}</span>
        <span>{currency} {local[1].toLocaleString()}</span>
      </div>
    </div>
  );
}
