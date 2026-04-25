"use client";

/**
 * QualifyStep0Commitment
 * ─────────────────────────────────────────────────────────────
 * Tier 10.7 — Pre-step commitment modal shown on the very first
 * visit to /qualify (when the experiment variant is "on").
 *
 * Psychology: asking a single low-stakes question ("how much weight
 * do you want to lose?") BEFORE showing any form creates commitment
 * and consistency (Cialdini). Users who answer something are
 * statistically more likely to finish the full assessment.
 *
 * Behavior:
 *   - Session-gated (localStorage) so only fires once per visitor
 *   - 4 chip options that map to the existing weight-range enum
 *   - Writes to funnel store so it auto-selects later in the form
 *   - Has a skip link for visitors who prefer the direct form
 *   - Fires granular analytics for variant conversion analysis
 */
import { useEffect, useState } from "react";
import { Target, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";

export interface QualifyStep0CommitmentProps {
  /** When false, the component renders nothing (used by the A/B flag). */
  active: boolean;
  /** Called when the user picks a range or skips. */
  onAnswered: (range: { label: string; value: string } | null) => void;
}

const WEIGHT_RANGES = [
  { label: "10–25 lbs", value: "10-25", description: "Small but meaningful change" },
  { label: "26–50 lbs", value: "26-50", description: "A major turnaround" },
  { label: "51–75 lbs", value: "51-75", description: "Life-changing result" },
  { label: "76+ lbs", value: "76+", description: "Total transformation" },
];

const STORAGE_KEY = "nj-step0-answered";

export function QualifyStep0Commitment({ active, onAnswered }: QualifyStep0CommitmentProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!active) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    setShow(true);
    track("qualify_step0_view");
  }, [active]);

  function handlePick(range: typeof WEIGHT_RANGES[number]) {
    track("qualify_step0_answer", {
      range: range.value,
      label: range.label,
    });
    sessionStorage.setItem(STORAGE_KEY, "1");
    setShow(false);
    onAnswered({ label: range.label, value: range.value });
  }

  function handleSkip() {
    track("qualify_step0_skip");
    sessionStorage.setItem(STORAGE_KEY, "1");
    setShow(false);
    onAnswered(null);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm animate-fade-in"
        onClick={handleSkip}
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-premium-xl animate-fade-in-up">
        <button
          onClick={handleSkip}
          className="absolute right-4 top-4 z-10 rounded-lg p-2 text-graphite-400 hover:bg-navy-50 hover:text-navy transition-colors"
          aria-label="Skip"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Gradient header */}
        <div className="bg-gradient-to-br from-teal via-atlantic to-navy px-6 py-6 text-center text-white">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <Target className="h-6 w-6" />
          </div>
          <p className="mt-3 text-xs font-bold uppercase tracking-widest opacity-80">
            1 quick question · 5 seconds
          </p>
          <h2 className="mt-1 text-2xl font-bold">How much weight do you want to lose?</h2>
        </div>

        <div className="p-6 sm:p-7">
          <p className="text-sm text-graphite-500 text-center mb-5">
            This helps us tailor the right plan level and medication option for you.
          </p>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {WEIGHT_RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => handlePick(r)}
                className="group flex flex-col items-start gap-0.5 rounded-xl border-2 border-navy-100 bg-white px-4 py-3 text-left transition-all hover:border-teal hover:bg-teal-50/30"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-base font-bold text-navy group-hover:text-teal">
                    {r.label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-graphite-300 group-hover:text-teal transition-colors" />
                </div>
                <span className="text-[11px] text-graphite-500">{r.description}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSkip}
            className="mt-5 w-full text-center text-sm text-graphite-400 hover:text-navy transition-colors"
          >
            Skip — take me to the full assessment
          </button>

          <p className="mt-3 text-center text-[11px] text-graphite-400">
            Nothing is locked in. Your provider tailors the final recommendation.
          </p>
        </div>
      </div>
    </div>
  );
}
