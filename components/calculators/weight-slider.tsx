"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

interface WeightSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  label?: string;
  className?: string;
}

export function WeightSlider({
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "lbs",
  label,
  className = "",
}: WeightSliderProps) {
  const trackRef = useRef<HTMLInputElement>(null);
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold text-navy mb-2">{label}</label>
      )}

      {/* Value display */}
      <div className="flex items-baseline justify-center gap-1.5 mb-4">
        <motion.span
          key={value}
          className="text-4xl font-bold text-navy tabular-nums"
          initial={{ scale: 1.08, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          {value}
        </motion.span>
        <span className="text-lg text-graphite-400 font-medium">{unit}</span>
      </div>

      {/* Slider track */}
      <div className="relative px-1">
        <input
          ref={trackRef}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="weight-slider w-full"
          style={{
            background: `linear-gradient(to right, #1F6F78 0%, #1F6F78 ${percentage}%, #E8EDF4 ${percentage}%, #E8EDF4 100%)`,
          }}
          aria-label={label || "Weight slider"}
        />

        {/* Tick labels */}
        <div className="flex justify-between mt-2 px-0.5">
          {[min, Math.round(min + (max - min) * 0.25), Math.round(min + (max - min) * 0.5), Math.round(min + (max - min) * 0.75), max].map(
            (tick) => (
              <span key={tick} className="text-[10px] text-graphite-400 tabular-nums">
                {tick}
              </span>
            )
          )}
        </div>
      </div>

      {/* Fine-tune input */}
      <div className="mt-3 flex justify-center">
        <div className="relative">
          <input
            type="number"
            value={value}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (v >= min && v <= max) onChange(v);
            }}
            className="w-24 rounded-lg border border-navy-100 bg-white px-3 py-1.5 text-center text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
            min={min}
            max={max}
            aria-label={`${label || "Weight"} exact value`}
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-graphite-400">
            {unit}
          </span>
        </div>
      </div>
    </div>
  );
}
