"use client";

import { useRef, useEffect, useState } from "react";
import { clinicalResults } from "@/lib/content";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { siteConfig } from "@/lib/site";

function AnimatedStat({ stat, delay }: { stat: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { rootMargin: "-30px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
        {stat}
      </p>
    </div>
  );
}

export function ResultsSection() {
  return (
    <section className="bg-navy-gradient py-20 lg:py-28">
      <SectionShell className="text-center">
        <SectionHeading
          eyebrow="Clinical Results"
          title="Proven results backed by clinical data"
          description="GLP-1 medications are among the most studied weight loss treatments in history. Here's what the data shows."
        />

        {/* Override heading colors for dark bg */}
        <style>{`
          .results-heading [class*="text-navy"] { color: white !important; }
          .results-heading [class*="text-graphite"] { color: rgba(255,255,255,0.7) !important; }
          .results-heading [class*="border-teal-100"] { border-color: rgba(31,111,120,0.4) !important; }
          .results-heading [class*="bg-teal-50"] { background: rgba(31,111,120,0.2) !important; }
          .results-heading [class*="text-teal-800"] { color: rgba(150,209,214,1) !important; }
        `}</style>

        <div className="results-heading -mt-12" />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {clinicalResults.map((result, i) => (
            <div
              key={result.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
            >
              <AnimatedStat stat={result.stat} delay={i * 150} />
              <p className="mt-3 text-base font-semibold text-white/90">
                {result.label}
              </p>
              <p className="mt-2 text-xs text-white/50">
                {result.source}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-white/40">
          * {siteConfig.compliance.resultsDisclaimer}
        </p>
      </SectionShell>
    </section>
  );
}
