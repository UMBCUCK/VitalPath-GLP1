"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface BeforeAfterSliderProps {
  beforeLabel?: string;
  afterLabel?: string;
  beforeWeight?: string;
  afterWeight?: string;
  name?: string;
  duration?: string;
  className?: string;
}

export function BeforeAfterSlider({
  beforeLabel = "Before",
  afterLabel = "After",
  beforeWeight = "247 lbs",
  afterWeight = "198 lbs",
  name = "Sarah M.",
  duration = "5 months",
  className,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <div className={cn("mx-auto max-w-md", className)}>
      <div
        ref={containerRef}
        className="relative h-80 w-full cursor-ew-resize select-none overflow-hidden rounded-2xl border-2 border-navy-100"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Before side (full width underneath) */}
        <div className="absolute inset-0 bg-gradient-to-br from-graphite-200 to-graphite-300">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-5xl font-bold text-white/30">{beforeWeight}</p>
            </div>
          </div>
          <div className="absolute left-3 top-3 rounded-lg bg-black/40 px-2.5 py-1">
            <p className="text-xs font-bold text-white">{beforeLabel}</p>
          </div>
        </div>

        {/* After side (clipped to position) */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-teal-400 to-atlantic"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-5xl font-bold text-white/40">{afterWeight}</p>
            </div>
          </div>
          <div className="absolute left-3 top-3 rounded-lg bg-teal/60 px-2.5 py-1">
            <p className="text-xs font-bold text-white">{afterLabel}</p>
          </div>
        </div>

        {/* Divider + handle — keyboard + screen reader accessible */}
        <div
          className="absolute top-0 bottom-0 z-10 flex items-center"
          style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        >
          <div className="h-full w-0.5 bg-white shadow-lg" aria-hidden="true" />
          <button
            type="button"
            role="slider"
            aria-label={`Before/after comparison slider — ${Math.round(position)}%`}
            aria-valuenow={Math.round(position)}
            aria-valuemin={5}
            aria-valuemax={95}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") { e.preventDefault(); setPosition((p) => Math.max(5, p - 5)); }
              if (e.key === "ArrowRight") { e.preventDefault(); setPosition((p) => Math.min(95, p + 5)); }
              if (e.key === "Home") { e.preventDefault(); setPosition(5); }
              if (e.key === "End") { e.preventDefault(); setPosition(95); }
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-navy/80 shadow-lg cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2"
          >
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M8 4l-6 8 6 8M16 4l6 8-6 8" />
            </svg>
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-navy">{name}</p>
          <p className="text-xs text-graphite-400">Lost {parseInt(beforeWeight) - parseInt(afterWeight)} lbs in {duration}</p>
        </div>
        <p className="text-[11px] text-graphite-400">Drag to compare · Artistic simulation · Not actual photos</p>
      </div>
    </div>
  );
}
