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
    "Free health calculators: BMI, TDEE, protein intake, hydration, goal timeline, and more. Evidence-based tools to support your health decisions.",
};

const calculators = [
  {
    icon: Scale,
    title: "BMI Calculator",
    description: "Calculate your body mass index and understand what it means for your health profile.",
    href: "/calculators/bmi",
    color: "from-teal-50 to-sage",
    iconColor: "text-teal",
    tag: "Most Popular",
  },
  {
    icon: Flame,
    title: "TDEE Calculator",
    description: "Estimate your total daily energy expenditure based on your activity level and metabolism.",
    href: "/calculators/tdee",
    color: "from-gold-50 to-linen",
    iconColor: "text-gold-600",
    tag: null,
  },
  {
    icon: Target,
    title: "Protein Calculator",
    description: "Find your ideal daily protein range based on body weight, activity, and goals.",
    href: "/calculators/protein",
    color: "from-atlantic/5 to-navy-50",
    iconColor: "text-atlantic",
    tag: null,
  },
  {
    icon: Droplets,
    title: "Hydration Calculator",
    description: "Calculate optimal daily water intake based on your weight and activity level.",
    href: "/calculators/hydration",
    color: "from-blue-50 to-teal-50",
    iconColor: "text-blue-500",
    tag: null,
  },
  {
    icon: TrendingUp,
    title: "Goal Timeline Estimator",
    description: "Estimate a realistic timeline to reach your goal weight based on healthy, sustainable progress.",
    href: "/calculators/timeline",
    color: "from-emerald-50 to-sage",
    iconColor: "text-emerald-600",
    tag: "Coming Soon",
  },
  {
    icon: DollarSign,
    title: "Subscription Value Calculator",
    description: "See the total value of what's included in each membership plan.",
    href: "/calculators/value",
    color: "from-gold-50 to-linen-100",
    iconColor: "text-gold-700",
    tag: "Coming Soon",
  },
  {
    icon: Users,
    title: "Referral Earnings Calculator",
    description: "Estimate how much you can earn by sharing VitalPath with friends and family.",
    href: "/calculators/referrals",
    color: "from-teal-50 to-blue-50",
    iconColor: "text-teal-600",
    tag: "Coming Soon",
  },
  {
    icon: Calculator,
    title: "Maintenance Cost Estimator",
    description: "Plan your budget for the maintenance phase of your weight management program.",
    href: "/calculators/maintenance",
    color: "from-navy-50 to-sage/50",
    iconColor: "text-navy-500",
    tag: "Coming Soon",
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

      <section className="py-16">
        <SectionShell>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {calculators.map((calc) => {
              const isComingSoon = calc.tag === "Coming Soon";
              const classes = `group flex flex-col rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium transition-all duration-300 ${
                isComingSoon ? "opacity-60 cursor-default" : "hover:shadow-premium-lg hover:-translate-y-0.5"
              }`;

              const cardContent = (
                <>
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
                  {!isComingSoon && (
                    <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-teal">
                      Calculate now <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  )}
                </>
              );

              return isComingSoon ? (
                <div key={calc.title} className={classes}>{cardContent}</div>
              ) : (
                <Link key={calc.title} href={calc.href} className={classes}>{cardContent}</Link>
              );
            })}
          </div>
        </SectionShell>
      </section>

      <CtaSection />
    </MarketingShell>
  );
}
