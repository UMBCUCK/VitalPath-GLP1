"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "./animated-counter";

interface WaterFillProps {
  percentage: number; // 0-100
  ozValue: number;
  size?: number;
  className?: string;
}

export function WaterFill({
  percentage,
  ozValue,
  size = 200,
  className = "",
}: WaterFillProps) {
  const clampedPct = Math.max(0, Math.min(100, percentage));
  const glassWidth = size * 0.5;
  const glassHeight = size * 0.7;
  const glassX = (size - glassWidth) / 2;
  const glassY = size * 0.05;
  const wallThickness = 3;
  const taperInset = glassWidth * 0.08;

  // Glass inner dimensions for fill
  const innerLeft = glassX + wallThickness + taperInset;
  const innerRight = glassX + glassWidth - wallThickness - taperInset;
  const innerTop = glassY + wallThickness;
  const innerBottom = glassY + glassHeight - wallThickness;
  const innerHeight = innerBottom - innerTop;
  const fillHeight = (clampedPct / 100) * innerHeight;
  const fillY = innerBottom - fillHeight;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        width={size}
        height={size * 0.85}
        viewBox={`0 0 ${size} ${size * 0.85}`}
        className="overflow-visible"
      >
        {/* Glass outline */}
        <path
          d={`
            M ${glassX + taperInset} ${glassY}
            L ${glassX + glassWidth - taperInset} ${glassY}
            L ${glassX + glassWidth} ${glassY + glassHeight}
            Q ${glassX + glassWidth} ${glassY + glassHeight + 4} ${glassX + glassWidth - 4} ${glassY + glassHeight + 4}
            L ${glassX + 4} ${glassY + glassHeight + 4}
            Q ${glassX} ${glassY + glassHeight + 4} ${glassX} ${glassY + glassHeight}
            Z
          `}
          fill="none"
          stroke="#C8D5E4"
          strokeWidth={wallThickness}
          strokeLinejoin="round"
        />

        {/* Clip path for water fill */}
        <defs>
          <clipPath id="glassClip">
            <path
              d={`
                M ${glassX + taperInset + wallThickness} ${glassY + wallThickness}
                L ${glassX + glassWidth - taperInset - wallThickness} ${glassY + wallThickness}
                L ${glassX + glassWidth - wallThickness} ${glassY + glassHeight - wallThickness}
                L ${glassX + wallThickness} ${glassY + glassHeight - wallThickness}
                Z
              `}
            />
          </clipPath>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1F6F78" stopOpacity={0.7} />
            <stop offset="100%" stopColor="#0D9488" stopOpacity={0.9} />
          </linearGradient>
        </defs>

        {/* Water fill (animated) */}
        <g clipPath="url(#glassClip)">
          <motion.rect
            x={glassX}
            width={glassWidth}
            height={glassHeight}
            fill="url(#waterGrad)"
            initial={{ y: glassY + glassHeight }}
            animate={{ y: fillY }}
            transition={{ type: "spring", stiffness: 35, damping: 12, delay: 0.4 }}
          />

          {/* Wave effect on top of water */}
          <motion.path
            d={`
              M ${glassX} ${0}
              Q ${glassX + glassWidth * 0.25} ${-6}, ${glassX + glassWidth * 0.5} ${0}
              Q ${glassX + glassWidth * 0.75} ${6}, ${glassX + glassWidth} ${0}
              V 10 H ${glassX} Z
            `}
            fill="rgba(255,255,255,0.2)"
            initial={{ y: glassY + glassHeight }}
            animate={{ y: fillY - 3 }}
            transition={{ type: "spring", stiffness: 35, damping: 12, delay: 0.4 }}
          />
        </g>

        {/* Reflection highlight */}
        <rect
          x={glassX + glassWidth * 0.15}
          y={glassY + glassHeight * 0.1}
          width={3}
          height={glassHeight * 0.5}
          rx={1.5}
          fill="white"
          opacity={0.3}
        />
      </svg>

      {/* Value display */}
      <div className="text-center -mt-1">
        <div className="text-4xl font-bold text-navy">
          <AnimatedCounter value={ozValue} suffix=" oz" />
        </div>
        <p className="text-sm text-graphite-400 mt-1">daily target</p>
      </div>
    </div>
  );
}
