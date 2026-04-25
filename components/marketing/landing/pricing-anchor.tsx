import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/shared/section-shell";

interface Props {
  eyebrow?: string;
  headline: string;
  subhead?: string;
  includes: string[];
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  accent?: "teal" | "emerald" | "lavender" | "atlantic" | "gold" | "rose";
}

const gradientMap = {
  teal: "from-navy via-atlantic to-teal",
  emerald: "from-emerald-900 via-emerald-700 to-teal",
  lavender: "from-slate-900 via-violet-800 to-fuchsia-700",
  atlantic: "from-navy via-atlantic to-sky-600",
  gold: "from-navy via-amber-700 to-gold",
  rose: "from-navy via-rose-700 to-pink-500",
};

export function LandingPricingAnchor({
  eyebrow = "Transparent pricing",
  headline,
  subhead,
  includes,
  primaryCtaLabel = "Start My Assessment",
  primaryCtaHref = "/qualify",
  secondaryCtaLabel = "See Full Pricing",
  secondaryCtaHref = "/pricing",
  accent = "teal",
}: Props) {
  const grad = gradientMap[accent];

  return (
    <section className="relative py-20">
      <SectionShell>
        <div className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${grad} p-8 shadow-premium-lg sm:p-12 lg:p-16`}>
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10" aria-hidden>
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="pricing-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="white" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pricing-grid)" />
            </svg>
          </div>
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" aria-hidden />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" aria-hidden />

          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center">
            {/* Left: Message */}
            <div className="text-white">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                <span className="text-xs font-bold uppercase tracking-wider text-gold">
                  {eyebrow}
                </span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl leading-[1.1]">
                {headline}
              </h2>
              {subhead && (
                <p className="mt-5 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
                  {subhead}
                </p>
              )}

              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Link href={primaryCtaHref}>
                  <Button variant="emerald" size="xl" className="w-full sm:w-auto gap-2 rounded-full px-10 h-16 text-lg hover:scale-[1.02] hover:brightness-110 transition-all">
                    {primaryCtaLabel}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href={secondaryCtaHref}>
                  <Button size="xl" variant="outline" className="w-full sm:w-auto rounded-full border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white">
                    {secondaryCtaLabel}
                  </Button>
                </Link>
              </div>

              <p className="mt-4 flex items-center gap-2 text-sm text-white/70">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                30-day money-back guarantee · Cancel anytime · No insurance needed
              </p>
            </div>

            {/* Right: Price card */}
            <div className="relative rounded-2xl border border-white/15 bg-white/95 p-6 shadow-premium-lg backdrop-blur-sm sm:p-7">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-graphite-400">
                    Plans start at
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-navy sm:text-6xl">$179</span>
                    <span className="text-sm font-medium text-graphite-400">/month</span>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  Save 87%
                </span>
              </div>
              <p className="mt-1 text-sm text-graphite-500 line-through">$1,349/mo brand-name retail</p>

              <div className="mt-5 border-t border-navy-100/50 pt-5">
                <div className="mb-3 text-sm font-bold text-navy">What's included:</div>
                <ul className="space-y-2.5">
                  {includes.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                        <Check className="h-2.5 w-2.5 text-emerald-700 stroke-[3]" />
                      </div>
                      <span className="text-sm leading-snug text-graphite-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </SectionShell>
    </section>
  );
}
