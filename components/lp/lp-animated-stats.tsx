"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

/**
 * Returns true only if the stat value is a "clean" single number that can
 * safely count-up (e.g. "$179/mo", "18,000+", "94%", "4.9"). Returns false for
 * strings like "Hormonal", "Insulin", or ranges like "15-20%*" — those would
 * otherwise flash NaN or concatenate digits (1520) mid-animation.
 */
function isAnimatable(target: string): boolean {
  // Ranges like "15-20%" or "15–20%" → concatenate digits → bad animation.
  if (/\d\s*[-–]\s*\d/.test(target)) return false;
  // Strip everything that's legitimately part of a numeric stat; if letters
  // remain, the target is a word like "Hormonal" or "Insulin" → show static.
  const leftover = target
    .replace(/[$+,%*†\s]/g, "")
    .replace(/\/mo(nth)?/gi, "")
    .replace(/[0-9.]/g, "");
  if (leftover !== "") return false;
  const num = parseFloat(target.replace(/[^0-9.]/g, ""));
  return Number.isFinite(num);
}

function AnimatedStatValue({ target, suffix = "" }: { target: string; suffix: string }) {
  const animatable = isAnimatable(target);
  // Non-animatable targets render the full label from first paint, so users
  // never see transient gibberish like "NaN" or "1503%".
  const [display, setDisplay] = useState(target + suffix);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!animatable) return;
    const el = ref.current;
    if (!el) return;
    let rafId = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const num = parseFloat(target.replace(/[^0-9.]/g, ""));
          const hasPlus = target.includes("+");
          const hasComma = target.includes(",");
          const isPercent = target.includes("%");
          const duration = 1500;
          const start = performance.now();

          // PERF: requestAnimationFrame instead of setInterval. setInterval
          // ticks on its own clock, off the browser's compositor frame
          // schedule, which produced visible jank on the homepage stats and
          // contributed to a worse INP score. rAF is paint-aligned, idles
          // when the tab is hidden, and only updates the DOM once per frame.
          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            let current = Math.round(num * eased * 10) / 10;
            if (num >= 100) current = Math.round(current);

            let formatted = hasComma
              ? current.toLocaleString()
              : num < 10
                ? current.toFixed(1)
                : String(Math.round(current));

            if (isPercent) formatted += "%";
            if (hasPlus) formatted += "+";
            formatted += suffix;
            setDisplay(formatted);

            if (progress < 1) {
              rafId = requestAnimationFrame(step);
            } else {
              setDisplay(target + suffix);
            }
          };
          rafId = requestAnimationFrame(step);
        }
      },
      { rootMargin: "0px" }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [target, suffix, animatable]);

  return <span ref={ref}>{display}</span>;
}

interface LpAnimatedStatsProps {
  stats: readonly Stat[];
  className?: string;
}

export function LpAnimatedStats({ stats, className }: LpAnimatedStatsProps) {
  // CLS fix: stat cards previously rendered with `opacity-0 animate-fade-in-up`
  // and per-card animationDelay 0.2s..0.5s. While the cards reserve their
  // grid space (so geometric CLS is small), the staggered opacity flip
  // produces unstable LCP candidate selection on slower devices and forces
  // 4 extra style recalcs during the critical hero render. They now render
  // visible from first paint; the count-up animation alone provides the
  // motion polish.
  return (
    <div className={`grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 ${className ?? ""}`}>
      {stats.map((stat, i) => (
        <div
          key={i}
          className="rounded-xl border bg-[var(--lp-card-bg,#fff)] p-4 text-center"
          style={{ borderColor: "var(--lp-stat-border)" }}
        >
          <div className="text-2xl font-bold text-lp-heading sm:text-3xl">
            <AnimatedStatValue target={stat.value} suffix={stat.suffix ?? ""} />
          </div>
          <div className="mt-1 text-xs text-lp-body-muted">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
