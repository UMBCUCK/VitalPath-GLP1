export const dynamic = "force-dynamic";

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
import { FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Free GLP-1 Health Calculators: BMI, TDEE, Protein & More | VitalPath",
  description:
    "Free evidence-based health calculators for GLP-1 weight loss: BMI, TDEE, protein intake, hydration, and weight loss timeline. Know your numbers before starting treatment.",
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
  {
    icon: DollarSign,
    title: "GLP-1 Cost Calculator",
    description: "Compare brand vs. compounded pricing and see exactly how much you'll save.",
    href: "/calculators/cost",
    color: "from-gold-50 to-linen",
    iconColor: "text-gold-600",
    tag: "New",
  },
];

const comingSoon = [
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

const calcFaqs = [
  { question: "What is a healthy BMI for starting GLP-1 treatment?", answer: "GLP-1 medications are typically prescribed for adults with a BMI of 30 or higher, or BMI 27+ with a weight-related condition such as type 2 diabetes, hypertension, or high cholesterol. Use the BMI calculator above to check your number." },
  { question: "How many calories should I eat on semaglutide or tirzepatide?", answer: "Most providers recommend eating at a modest deficit (300–500 calories below your TDEE) rather than extreme restriction. GLP-1 medication reduces appetite significantly — the TDEE calculator helps you find a starting target to avoid under-eating." },
  { question: "How much protein do I need while on GLP-1 medication?", answer: "Most clinical guidelines recommend 1.2–1.6g of protein per kg of body weight during active weight loss to preserve lean muscle. Since GLP-1 medications suppress appetite, it's easy to under-eat protein — the protein calculator gives you a personalized target." },
  { question: "How much water should I drink on GLP-1 medication?", answer: "Nausea and reduced food intake can both decrease fluid consumption. A general target is body weight (lbs) ÷ 2 = ounces of water per day, adjusted for activity. The hydration calculator provides a personalized goal with a time-of-day schedule." },
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

      {/* FAQ section */}
      <section className="py-16 border-t border-navy-100/40 bg-navy-50/30">
        <SectionShell className="max-w-3xl">
          <FAQPageJsonLd faqs={calcFaqs.map((f) => ({ question: f.question, answer: f.answer }))} />
          <BreadcrumbJsonLd items={[{ name: "Home", href: "/" }, { name: "Health Calculators", href: "/calculators" }]} />
          <h2 className="text-xl font-bold text-navy mb-6">Frequently asked questions</h2>
          <div className="divide-y divide-navy-100/40">
            {calcFaqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-navy text-sm list-none">
                  {faq.question}
                  <span className="shrink-0 text-graphite-300 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-graphite-500">{faq.answer}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {[
              { href: "/eligibility", label: "Eligibility criteria" },
              { href: "/guide", label: "GLP-1 complete guide" },
              { href: "/blog/what-to-eat-on-semaglutide", label: "What to eat on GLP-1" },
              { href: "/blog/protein-intake-guide", label: "Protein guide" },
              { href: "/blog/hydration-guide", label: "Hydration tips" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="rounded-full border border-navy-100/60 bg-white px-3.5 py-1.5 text-xs font-medium text-teal hover:bg-teal hover:text-white transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </SectionShell>
      </section>

      <CtaSection />
    </MarketingShell>
  );
}
