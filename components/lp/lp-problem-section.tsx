import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { LpIconBox } from "./lp-themed";
import { LpTrackedCta } from "./lp-tracked-cta";

interface ProblemCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface LpProblemSectionProps {
  eyebrow?: string;
  heading?: string;
  cards: readonly ProblemCard[];
  transitionText?: string;
  ctaLocation?: string;
}

export function LpProblemSection({
  eyebrow = "THE REAL PROBLEM",
  heading = "Why Diets and Willpower Keep Failing",
  cards,
  transitionText = "There's a clinically proven way forward.",
  ctaLocation = "problem-section",
}: LpProblemSectionProps) {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <span
            className="mb-3 inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{
              backgroundColor: "var(--lp-badge-bg)",
              color: "var(--lp-badge-text)",
              borderWidth: "1px",
              borderColor: "var(--lp-badge-border)",
            }}
          >
            {eyebrow}
          </span>
          <h2 className="mt-2 text-2xl font-bold text-lp-heading sm:text-3xl lg:text-4xl">
            {heading}
          </h2>
        </div>

        {/* Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {cards.map((card, i) => (
            <div
              key={i}
              className="rounded-xl border p-6 opacity-0 animate-fade-in-up"
              style={{
                borderColor: "rgba(239,68,68,0.2)",
                backgroundColor: "var(--lp-card-bg, #fff)",
                animationDelay: `${0.1 + i * 0.1}s`,
                animationFillMode: "forwards",
              }}
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                <card.icon className="h-5 w-5 text-red-500" />
              </div>
              <h3 className="mb-2 text-base font-bold text-lp-heading">{card.title}</h3>
              <p className="text-sm leading-relaxed text-lp-body">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Transition */}
        <div
          className="mt-8 rounded-xl border p-5 text-center opacity-0 animate-fade-in-up"
          style={{
            borderColor: "var(--lp-stat-border)",
            backgroundColor: "var(--lp-section-alt)",
            animationDelay: "0.4s",
            animationFillMode: "forwards",
          }}
        >
          <p className="mb-3 text-sm font-semibold text-lp-heading">{transitionText}</p>
          <LpTrackedCta location={ctaLocation} label="Start Free Assessment" />
        </div>
      </div>
    </section>
  );
}
