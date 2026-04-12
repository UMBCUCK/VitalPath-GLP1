"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string; // if omitted, reads --chart-primary CSS var
  className?: string;
}

export function Sparkline({
  data,
  width = 80,
  height = 28,
  color,
  className,
}: SparklineProps) {
  const [resolvedColor, setResolvedColor] = useState(color ?? "#1F6F78");

  useEffect(() => {
    if (color) {
      setResolvedColor(color);
      return;
    }
    const update = () => {
      const val = getComputedStyle(document.documentElement)
        .getPropertyValue("--chart-primary")
        .trim();
      if (val) setResolvedColor(val);
    };
    update();
    // Re-read when the html class changes (theme switch)
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [color]);
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const areaD = `${pathD} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;
  const gradId = `spark-${resolvedColor.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={resolvedColor} stopOpacity="0.2" />
          <stop offset="100%" stopColor={resolvedColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradId})`} />
      <path d={pathD} fill="none" stroke={resolvedColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
