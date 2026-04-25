"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ICONS, type IconName } from "./icons";

export interface LandingStat {
  value: string;
  label: string;
  icon?: IconName;
  tone?: "teal" | "emerald" | "lavender" | "atlantic" | "gold" | "rose";
}

interface Props {
  stats: LandingStat[];
  eyebrow?: string;
}

const toneMap = {
  teal: { text: "text-teal", bg: "bg-teal/10" },
  emerald: { text: "text-emerald-600", bg: "bg-emerald-50" },
  lavender: { text: "text-violet-600", bg: "bg-violet-50" },
  atlantic: { text: "text-atlantic", bg: "bg-atlantic/10" },
  gold: { text: "text-gold-700", bg: "bg-gold/10" },
  rose: { text: "text-rose-600", bg: "bg-rose-50" },
};

function AnimatedValue({ target }: { target: string }) {
  const [display, setDisplay] = useState(target);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced-motion: snap to final value, no animation
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(target);
      done.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done.current) return;
        done.current = true;

        const match = target.match(/[\d,.]+/);
        if (!match) return;
        const raw = match[0];
        const num = parseFloat(raw.replace(/,/g, ""));
        if (!isFinite(num)) return;

        const prefix = target.slice(0, match.index ?? 0);
        const suffix = target.slice((match.index ?? 0) + raw.length);
        const hasComma = raw.includes(",");
        const decimals = raw.split(".")[1]?.length ?? 0;

        const duration = 1400;
        const startedAt = performance.now();
        let raf = 0;
        const tick = (now: number) => {
          const t = Math.min(1, (now - startedAt) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          const v = num * eased;
          const formatted =
            decimals > 0
              ? v.toFixed(decimals)
              : hasComma
                ? Math.round(v).toLocaleString()
                : String(Math.round(v));
          setDisplay(`${prefix}${formatted}${suffix}`);
          if (t < 1) raf = requestAnimationFrame(tick);
          else setDisplay(target);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
      },
      { rootMargin: "-60px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{display}</span>;
}

export function LandingStatsRow({ stats, eyebrow }: Props) {
  return (
    <section className="relative border-y border-navy-100/40 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {eyebrow && (
          <div className="mb-6 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-graphite-400">
              {eyebrow}
            </span>
          </div>
        )}
        <div className={cn(
          "grid grid-cols-2 gap-3 sm:gap-4",
          stats.length === 3 && "grid-cols-1 sm:grid-cols-3",
          stats.length === 4 && "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4",
          stats.length === 5 && "grid-cols-2 sm:grid-cols-2 lg:grid-cols-5",
          stats.length === 6 && "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
        )}>
          {stats.map((s) => {
            const tone = toneMap[s.tone ?? "teal"];
            const Icon = s.icon ? ICONS[s.icon] : undefined;
            return (
              <div
                key={s.label}
                className="group relative overflow-hidden rounded-2xl border border-navy-100/50 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-premium sm:p-5"
              >
                {Icon && (
                  <div className={cn("mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl sm:mb-3 sm:h-10 sm:w-10", tone.bg)}>
                    <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", tone.text)} />
                  </div>
                )}
                <div className={cn("text-2xl font-bold sm:text-3xl lg:text-4xl", tone.text)}>
                  <AnimatedValue target={s.value} />
                </div>
                <div className="mt-1.5 text-[11px] leading-snug text-graphite-500 sm:text-sm">
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
