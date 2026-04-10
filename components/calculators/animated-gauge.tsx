"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { AnimatedCounter } from "./animated-counter";

export interface GaugeZone {
  from: number;
  to: number;
  color: string;
  label: string;
}

interface AnimatedGaugeProps {
  value: number;
  min: number;
  max: number;
  zones: GaugeZone[];
  size?: number;
  label?: string;
  className?: string;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export function AnimatedGauge({
  value,
  min,
  max,
  zones,
  size = 280,
  label,
  className = "",
}: AnimatedGaugeProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: "100px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) setHasAnimated(true);
  }, [isInView, hasAnimated]);

  const cx = size / 2;
  const cy = size * 0.55;
  const radius = size * 0.38;
  const strokeWidth = size * 0.07;
  const needleLength = radius - strokeWidth / 2 - 4;

  // Arc spans 180 degrees: from 180 (left) to 360 (right)
  const startAngle = 180;
  const endAngle = 360;
  const totalAngle = endAngle - startAngle;

  const clampedValue = Math.max(min, Math.min(max, value));
  const valuePercent = (clampedValue - min) / (max - min);
  const needleAngle = startAngle + valuePercent * totalAngle;

  // Find active zone
  const activeZone = zones.find((z) => clampedValue >= z.from && clampedValue < z.to) || zones[zones.length - 1];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        ref={ref}
        width={size}
        height={size * 0.65}
        viewBox={`0 0 ${size} ${size * 0.65}`}
        className="overflow-visible"
      >
        {/* Zone arcs */}
        {zones.map((zone, i) => {
          const zoneStart = startAngle + ((zone.from - min) / (max - min)) * totalAngle;
          const zoneEnd = startAngle + ((Math.min(zone.to, max) - min) / (max - min)) * totalAngle;
          return (
            <path
              key={i}
              d={arcPath(cx, cy, radius, zoneStart, zoneEnd)}
              fill="none"
              stroke={zone.color}
              strokeWidth={strokeWidth}
              strokeLinecap="butt"
              opacity={activeZone === zone ? 1 : 0.35}
              className="transition-opacity duration-500"
            />
          );
        })}

        {/* Tick marks */}
        {zones.map((zone, i) => {
          if (i === 0) return null;
          const tickAngle = startAngle + ((zone.from - min) / (max - min)) * totalAngle;
          const inner = polarToCartesian(cx, cy, radius - strokeWidth / 2 - 2, tickAngle);
          const outer = polarToCartesian(cx, cy, radius + strokeWidth / 2 + 2, tickAngle);
          return (
            <line
              key={`tick-${i}`}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="white"
              strokeWidth={2}
            />
          );
        })}

        {/* Needle */}
        <motion.line
          x1={cx}
          y1={cy}
          x2={cx + needleLength}
          y2={cy}
          stroke="#0E223D"
          strokeWidth={3}
          strokeLinecap="round"
          style={{ originX: `${cx}px`, originY: `${cy}px` }}
          initial={{ rotate: startAngle }}
          animate={hasAnimated ? { rotate: needleAngle } : { rotate: startAngle }}
          transition={{ type: "spring", stiffness: 50, damping: 15, delay: 0.3 }}
        />

        {/* Needle center dot */}
        <circle cx={cx} cy={cy} r={6} fill="#0E223D" />
        <circle cx={cx} cy={cy} r={3} fill="white" />
      </svg>

      {/* Value display below gauge */}
      <div className="text-center -mt-2">
        <div className="text-5xl font-bold text-navy">
          <AnimatedCounter value={value} decimals={1} />
        </div>
        {label && (
          <span
            className="mt-1 inline-block rounded-full px-3 py-1 text-sm font-semibold"
            style={{ backgroundColor: activeZone.color + "20", color: activeZone.color }}
          >
            {label}
          </span>
        )}
      </div>

      {/* Zone labels */}
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {zones.map((zone, i) => (
          <span
            key={i}
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-all duration-300 ${
              activeZone === zone
                ? "ring-2 ring-offset-1 scale-105"
                : "opacity-50"
            }`}
            style={{
              backgroundColor: zone.color + "20",
              color: zone.color,
              outlineColor: zone.color,
            }}
          >
            {zone.label}
          </span>
        ))}
      </div>
    </div>
  );
}
