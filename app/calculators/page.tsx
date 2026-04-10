export const dynamic = "force-static";

import type { Metadata } from "next";
import Link from "next/link";
import {
  Calculator,
  Droplets,
  Flame,
  Target,
  TrendingUp,
  DollarSign,
  Users,
  Scale,
  ArrowRight,
} from "lucide-react";
import { SectionShell } from "@/components/shared/section-shell";
import { Badge } from "@/components/ui/badge";
import { CtaSection } from "@/components/marketing/cta-section";
import { MarketingShell } from "@/components/layout/marketing-shell";

export const metadata: Metadata = {
  title: "Health Calculators",
  description:
    "Free health calculators: BMI, TDEE, protein intake, hydration, weight loss timeline, and more. Evidence-based tools to support your health decisions.",
};

const calculators = [
  {
    icon: Scale,
    title: "BMI Calculator",
    description: "Interactive gauge shows your BMI on a color-coded spectrum with population context.",
    href: "/calculators/bmi",
    color: "from-teal-50 to-sage",
    iconColor: "text-teal",
    tag: "Most Popular",
  },
  {
    icon: Flame,
    title: "TDEE Calculator",
    description: "See your daily calories with animated macro breakdown charts for each goal.",
    href: "/calculators/tdee",
    color: "from-gold-50 to-linen",
    iconColor: "text-gold-600",
    tag: null,
  },
  {
    icon: Target,
    title: "Protein Calculator",
    description: "Get your protein target with food equivalents and a visual daily meal schedule.",
    href: "/calculators/protein",
    color: "from-atlantic/5 to-navy-50",
    iconColor: "text-atlantic",
    tag: null,
  },
  {
    icon: Droplets,
    title: "Hydration Calculator",
    description: "Animated water fill shows your daily goal with a time-of-day drinking schedule.",
    href: "/calculators/hydration",
    color: "from-blue-50 to-teal-50",
    iconColor: "text-blue-500",
    tag: null,
  },
  {
    icon: TrendingUp,
    title: "Timeline Calculator",
    description: "See your projected weight loss curve with GLP-1 vs diet alone comparison.",
    href: "/calculators/timeline",
    color: "from-emerald-50 to-sage",
    iconColor: "text-emerald-600",
    tag: null,
  },
];

const comingSoon = [
  {
    icon: DollarSign,
    title: "Subscription Value",
    description: "See the total value of what's included in each membership plan.",
    color: "from-gold-50 to-linen-100",
    iconColor: "text-gold-700",
  },
  {
    icon: Users,
    title: "Referral Earnings",
    description: "Estimate how much you can earn by sharing Nature's Journey.",
    color: "from-teal-50 to-blue-50",
    iconColor: "text-teal-600",
  },
  {
    icon: Calculator,
    title: "Maintenance Cost",
    description: "Plan your budget for the maintenance phase.",
    color: "from-navy-50 to-sage/50",
    iconColor: "text-navy-500",
  },
];

export default function CalculatorsPage() {
  return (
    <MarketingShell>
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6">
            Health Tools
          </Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Free health calculators
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">
            Evidence-based tools to help you understand your body, plan your nutrition,
            and make informed decisions about your health.
          </p>
        </SectionShell>
      </section>

      {/* Featured: Complete Health Profile */}
      <section className="py-12 border-b border-navy-100/40">
        <SectionShell>
          <Link
            href="/calculators/complete"
            className="group block rounded-2xl bg-gradient-to-r from-teal to-atlantic p-8 sm:p-10 text-white shadow-premium-lg hover:shadow-premium-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex-1">
                <Badge variant="gold" className="mb-3">
                  Recommended
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-bold">
                  Complete Health Profile
                </h2>
                <p className="mt-3 text-white/70 max-w-lg">
                  Enter your stats once and get BMI, daily calories, protein, hydration, and
                  your weight loss timeline — all in one place. Save results to your account.
                </p>
                <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white group-hover:bg-white/20 transition-colors">
                  Get All My Numbers
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-center gap-3 opacity-80">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-lg bg-white/10 px-3 py-2"><Scale className="mx-auto h-5 w-5 text-white/80 mb-0.5" /><p className="text-[9px]">BMI</p></div>
                  <div className="rounded-lg bg-white/10 px-3 py-2"><Flame className="mx-auto h-5 w-5 text-white/80 mb-0.5" /><p className="text-[9px]">TDEE</p></div>
                  <div className="rounded-lg bg-white/10 px-3 py-2"><Target className="mx-auto h-5 w-5 text-white/80 mb-0.5" /><p className="text-[9px]">Protein</p></div>
                  <div className="rounded-lg bg-white/10 px-3 py-2"><Droplets className="mx-auto h-5 w-5 text-white/80 mb-0.5" /><p className="text-[9px]">Water</p></div>
                </div>
              </div>
            </div>
          </Link>
        </SectionShell>
      </section>

      {/* SEO intro content */}
      <section className="py-12 border-b border-navy-100/40">
        <SectionShell className="max-w-3xl">
          <div className="space-y-4 text-sm leading-relaxed text-graphite-600">
            <p>
              These calculators are designed specifically for people considering or currently on a
              GLP-1 weight management program. Each tool is built on published clinical formulas and
              provides personalized targets based on your body.
            </p>
            <p>
              <strong>Why they matter during treatment:</strong> GLP-1 medications reduce appetite,
              which makes it easy to under-eat — especially protein. Losing muscle alongside fat
              slows your metabolism and makes weight regain more likely. Our protein and hydration
              calculators help you hit the targets that preserve lean mass and keep your body
              functioning optimally during active weight loss.
            </p>
            <p>
              BMI and TDEE calculators help your provider assess eligibility and set appropriate
              calorie targets. These same numbers inform your personalized treatment plan and meal
              recommendations. For a deeper understanding of how these tools fit into the full
              program, see our{" "}
              <Link href="/guide" className="text-teal hover:underline font-medium">
                complete GLP-1 weight loss guide
              </Link>.
            </p>
          </div>
        </SectionShell>
      </section>

      {/* Main calculators grid */}
      <section className="py-16">
        <SectionShell>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {calculators.map((calc) => (
              <Link
                key={calc.title}
                href={calc.href}
                className="group flex flex-col rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium transition-all duration-300 hover:shadow-premium-lg hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${calc.color}`}>
                    <calc.icon className={`h-6 w-6 ${calc.iconColor}`} />
                  </div>
                  {calc.tag && (
                    <Badge variant={calc.tag === "Most Popular" ? "gold" : "secondary"} className="text-[10px]">
                      {calc.tag}
                    </Badge>
                  )}
                </div>
                <h3 className="mt-4 text-base font-bold text-navy">{calc.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-graphite-400">
                  {calc.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-teal">
                  Calculate now <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Coming soon section */}
      <section className="py-10 border-t border-navy-100/40">
        <SectionShell>
          <p className="text-xs font-semibold uppercase tracking-wider text-graphite-400 mb-4">More tools coming soon</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {comingSoon.map((calc) => (
              <div
                key={calc.title}
                className="flex items-center gap-4 rounded-xl border border-navy-100/40 bg-white/60 p-4 opacity-60"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${calc.color} shrink-0`}>
                  <calc.icon className={`h-5 w-5 ${calc.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-navy">{calc.title}</h3>
                  <p className="text-xs text-graphite-400">{calc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      <CtaSection />
    </MarketingShell>
  );
}
