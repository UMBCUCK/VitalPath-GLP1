import Link from "next/link";
import { ArrowRight, ClipboardCheck, Stethoscope, Package, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";

interface Props {
  title?: string;
  eyebrow?: string;
  description?: string;
  accent?: "teal" | "emerald" | "lavender" | "atlantic" | "gold" | "rose";
  ctaLabel?: string;
  ctaHref?: string;
  segmentLabel?: string;
}

const gradMap = {
  teal: "from-teal to-atlantic",
  emerald: "from-emerald to-teal",
  lavender: "from-violet-500 to-fuchsia-400",
  atlantic: "from-atlantic to-teal",
  gold: "from-gold to-amber-400",
  rose: "from-rose-500 to-pink-400",
};

const steps = [
  {
    icon: ClipboardCheck,
    title: "2-minute assessment",
    description: "Answer a handful of questions about your health, weight history, and goals. No credit card needed to start.",
    time: "2 min",
  },
  {
    icon: Stethoscope,
    title: "Provider review",
    description: "A board-certified physician reviews your intake, labs (if available), and contraindications. Same-day evaluations available.",
    time: "Within 24h",
  },
  {
    icon: Package,
    title: "Medication ships",
    description: "If prescribed, your compounded semaglutide or tirzepatide ships in 48 hours from a licensed 503A pharmacy — discreet and refrigerated.",
    time: "48h ship",
  },
  {
    icon: Sparkles,
    title: "Ongoing care",
    description: "Unlimited messaging with your provider, monthly dose adjustments, and a care team that monitors your progress — not just your scale.",
    time: "Every month",
  },
];

export function LandingHowItWorks({
  title = "How it works",
  eyebrow = "Getting started",
  description = "From assessment to medication at your door — in under 72 hours.",
  accent = "teal",
  ctaLabel = "Start My 2-Minute Assessment",
  ctaHref = "/qualify",
  segmentLabel,
}: Props) {
  const grad = gradMap[accent];
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-cloud/30 to-white py-20">
      <SectionShell>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={segmentLabel ? `${description} ${segmentLabel}` : description}
        />

        <div className="relative mx-auto mt-14 grid max-w-6xl gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line (desktop only) */}
          <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-0.5 bg-gradient-to-r from-transparent via-navy-100 to-transparent lg:block" aria-hidden />

          {steps.map((step, i) => (
            <div
              key={step.title}
              className="group relative flex flex-col rounded-2xl border border-navy-100/50 bg-white p-6 shadow-premium transition-all hover:-translate-y-1 hover:shadow-premium-lg hover:border-navy-200"
            >
              {/* Step number badge */}
              <div className="absolute -top-4 left-6 flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${grad} text-white text-xs font-bold shadow-premium`}>
                  {i + 1}
                </div>
                <span className="rounded-full border border-navy-100 bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-graphite-500 shadow-sm">
                  {step.time}
                </span>
              </div>

              <div className="mt-5 mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50">
                <step.icon className="h-5 w-5 text-navy" />
              </div>
              <h3 className="font-bold text-navy">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-graphite-600">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Central CTA */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <Link href={ctaHref}>
            <Button variant="emerald" size="xl" className="gap-2 rounded-full px-10 h-16 text-lg hover:scale-[1.02] hover:brightness-110 transition-all">
              {ctaLabel}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <p className="text-xs text-graphite-400">No credit card · No commitment · 30-day money-back guarantee</p>
        </div>
      </SectionShell>
    </section>
  );
}
