"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

function AnimatedStatValue({ target, suffix = "" }: { target: string; suffix: string }) {
  const [display, setDisplay] = useState(target + suffix);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const num = parseFloat(target.replace(/[^0-9.]/g, ""));
          const hasPlus = target.includes("+");
          const hasComma = target.includes(",");
          const isPercent = target.includes("%");
          const duration = 1500;
          const steps = 40;
          const stepDuration = duration / steps;
          let step = 0;

          const interval = setInterval(() => {
            step++;
            const progress = step / steps;
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

            if (step >= steps) {
              clearInterval(interval);
              setDisplay(target + suffix);
            }
          }, stepDuration);
        }
      },
      { rootMargin: "0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, suffix]);

  return <span ref={ref}>{display}</span>;
}

interface LpAnimatedStatsProps {
  stats: readonly Stat[];
  className?: string;
}

export function LpAnimatedStats({ stats, className }: LpAnimatedStatsProps) {
  return (
    <div className={`grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 ${className ?? ""}`}>
      {stats.map((stat, i) => (
        <div
          key={i}
          className="rounded-xl border bg-[var(--lp-card-bg,#fff)] p-4 text-center opacity-0 animate-fade-in-up"
          style={{
            borderColor: "var(--lp-stat-border)",
            animationDelay: `${0.2 + i * 0.1}s`,
            animationFillMode: "forwards",
          }}
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
