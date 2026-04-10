import { Check, X } from "lucide-react";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimateOnView } from "@/components/shared/animate-on-view";
import { cn } from "@/lib/utils";

const differences = [
  {
    theirs: "Prescribe medication and disappear",
    ours: "Medication + meal plans + coaching + tracking in one system",
  },
  {
    theirs: "Generic treatment plans for everyone",
    ours: "Personalized plan based on your health profile, goals, and preferences",
  },
  {
    theirs: "Wait days for customer support replies",
    ours: "Care team responds within hours — real people who know your name",
  },
  {
    theirs: "No guidance on what to eat while on medication",
    ours: "Weekly meal plans adapted for GLP-1 appetite changes with grocery lists",
  },
  {
    theirs: "No plan for what happens after you stop medication",
    ours: "Maintenance transition planning built into every program",
  },
  {
    theirs: "Hidden fees, auto-renew traps, cancellation hassles",
    ours: "Cancel in two clicks from your dashboard — no calls, no fees, no guilt",
  },
];

export function DifferentiatorSection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-linen/30 to-white">
      <SectionShell>
        <SectionHeading
          eyebrow="Why Nature's Journey"
          title="Not all GLP-1 programs are the same"
          description="Most telehealth weight loss programs just prescribe and disappear. We built something different."
        />

        <AnimateOnView>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-navy-100/60 shadow-premium-lg">
            {/* Header */}
            <div className="grid grid-cols-2 border-b border-navy-100/40">
              <div className="bg-red-50/50 p-4 text-center">
                <p className="text-sm font-bold text-red-500">Other programs</p>
              </div>
              <div className="bg-teal-50/50 p-4 text-center">
                <p className="text-sm font-bold text-teal">Nature's Journey</p>
              </div>
            </div>

            {/* Rows */}
            {differences.map((diff, i) => (
              <div
                key={i}
                className={cn(
                  "grid grid-cols-2 border-b border-navy-100/20 last:border-0",
                  i % 2 === 0 && "bg-navy-50/20"
                )}
              >
                {/* Theirs */}
                <div className="flex items-start gap-2.5 border-r border-navy-100/20 p-4">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  <span className="text-sm text-graphite-500">{diff.theirs}</span>
                </div>
                {/* Ours */}
                <div className="flex items-start gap-2.5 p-4">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                  <span className="text-sm font-medium text-navy">{diff.ours}</span>
                </div>
              </div>
            ))}
          </div>
        </AnimateOnView>
      </SectionShell>
    </section>
  );
}
