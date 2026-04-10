export const dynamic = "force-static";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Pill, Utensils, Activity, Scale, DollarSign, Users, Shield, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { CtaSection } from "@/components/marketing/cta-section";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { WebPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "The Complete Guide to GLP-1 Weight Loss (2026)",
  description:
    "Everything you need to know about GLP-1 weight loss medication. How it works, cost, results timeline, side effects, diet tips, exercise, and choosing a provider. Free comprehensive guide.",
  openGraph: {
    title: "The Complete Guide to GLP-1 Weight Loss | VitalPath",
    description: "The most comprehensive GLP-1 weight loss guide online. Medication science, cost breakdown, meal plans, exercise tips, and provider selection — all in one place.",
  },
};

const chapters = [
  {
    icon: BookOpen,
    number: "01",
    title: "What Are GLP-1 Medications?",
    description: "How GLP-1 receptor agonists work, the science behind appetite suppression, and why they're different from every diet you've tried.",
    links: [
      { label: "How GLP-1 Medications Work", href: "/blog/understanding-glp1" },
      { label: "Semaglutide vs Tirzepatide", href: "/blog/semaglutide-vs-tirzepatide" },
      { label: "Why Diets Fail (Biology)", href: "/blog/why-diets-fail-biology-weight-regain" },
    ],
  },
  {
    icon: DollarSign,
    number: "02",
    title: "Cost & Accessibility",
    description: "What GLP-1 medications cost with and without insurance, how compounded alternatives work, and how to find affordable treatment.",
    links: [
      { label: "GLP-1 Cost Without Insurance", href: "/blog/glp1-weight-loss-cost-without-insurance" },
      { label: "Are Compounded Medications Safe?", href: "/blog/compounded-glp1-safety-evidence" },
      { label: "Compounded vs Brand-Name GLP-1", href: "/compare/compounded-vs-brand-glp1" },
      { label: "VitalPath Plans & Pricing", href: "/pricing" },
    ],
  },
  {
    icon: Scale,
    number: "03",
    title: "Results & Timeline",
    description: "What to realistically expect month by month, how much weight you can lose, and what affects your personal results.",
    links: [
      { label: "Month-by-Month Weight Loss Timeline", href: "/blog/glp1-weight-loss-timeline-results" },
      { label: "Your First Month on GLP-1", href: "/blog/what-to-expect-first-month-glp1" },
      { label: "How to Lose 30 Pounds", href: "/blog/how-to-lose-30-pounds" },
      { label: "Member Results & Stories", href: "/results" },
    ],
  },
  {
    icon: Pill,
    number: "04",
    title: "Side Effects & Safety",
    description: "Common side effects, how to manage them, what's normal vs concerning, and safety considerations for specific situations.",
    links: [
      { label: "Managing Common Side Effects", href: "/blog/managing-side-effects" },
      { label: "GLP-1 and Alcohol", href: "/blog/glp1-alcohol-safety" },
      { label: "Ozempic Face: Prevention Guide", href: "/blog/ozempic-face-prevention" },
    ],
  },
  {
    icon: Utensils,
    number: "05",
    title: "Nutrition & Meal Planning",
    description: "What to eat during treatment, protein targets, meal plans, recipes, and strategies for when your appetite is reduced.",
    links: [
      { label: "What to Eat Week 1", href: "/blog/what-to-eat-first-week-glp1" },
      { label: "20 Best High-Protein Foods", href: "/blog/best-high-protein-foods-weight-loss" },
      { label: "7-Day High-Protein Meal Plan", href: "/blog/7-day-high-protein-meal-plan-weight-loss" },
      { label: "10 Easy Meal Prep Recipes", href: "/blog/glp1-meal-prep-easy-recipes" },
      { label: "Protein Calculator", href: "/calculators/protein" },
      { label: "All GLP-1 Recipes", href: "/meals" },
    ],
  },
  {
    icon: Activity,
    number: "06",
    title: "Exercise & Movement",
    description: "The best exercises during treatment, how many steps you need, what to avoid early on, and how to preserve muscle.",
    links: [
      { label: "Exercise During GLP-1 Treatment", href: "/blog/exercise-during-treatment" },
      { label: "Walking for Weight Loss", href: "/blog/walking-for-weight-loss-steps" },
      { label: "Breaking Weight Loss Plateaus", href: "/blog/break-weight-loss-plateau" },
    ],
  },
  {
    icon: Shield,
    number: "07",
    title: "Long-Term Success",
    description: "Building habits that last, transitioning to maintenance, and what happens when you stop medication.",
    links: [
      { label: "Building Lasting Habits", href: "/blog/building-habits" },
      { label: "Transitioning to Maintenance", href: "/blog/transitioning-to-maintenance" },
      { label: "Hydration Guide", href: "/blog/hydration-guide" },
      { label: "Hydration Calculator", href: "/calculators/hydration" },
    ],
  },
  {
    icon: Users,
    number: "08",
    title: "Choosing a Program",
    description: "How to evaluate telehealth weight loss programs, what to look for in a provider, and how VitalPath compares.",
    links: [
      { label: "VitalPath vs Hims", href: "/compare/vitalpath-vs-hims" },
      { label: "VitalPath vs WeightWatchers", href: "/compare/vitalpath-vs-weightwatchers" },
      { label: "VitalPath vs Ro", href: "/compare/vitalpath-vs-ro" },
      { label: "GLP-1 vs Bariatric Surgery", href: "/compare/glp1-vs-bariatric-surgery" },
      { label: "Check Your Eligibility", href: "/eligibility" },
    ],
  },
  {
    icon: Calculator,
    number: "09",
    title: "Health Tools",
    description: "Free calculators to support your weight loss journey — BMI, daily calories, protein intake, and hydration targets.",
    links: [
      { label: "BMI Calculator", href: "/calculators/bmi" },
      { label: "TDEE Calculator", href: "/calculators/tdee" },
      { label: "Protein Calculator", href: "/calculators/protein" },
      { label: "Hydration Calculator", href: "/calculators/hydration" },
    ],
  },
];

export default function GuidePage() {
  return (
    <MarketingShell>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "GLP-1 Weight Loss Guide", href: "/guide" },
        ]}
      />
      <WebPageJsonLd
        title="The Complete Guide to GLP-1 Weight Loss"
        description="Comprehensive guide covering everything about GLP-1 weight loss medication, nutrition, exercise, cost, and choosing the right program."
        path="/guide"
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6 gap-1.5">
            <BookOpen className="h-3.5 w-3.5" /> Comprehensive Guide
          </Badge>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-navy sm:text-5xl lg:text-6xl">
            The complete guide to{" "}
            <span className="bg-gradient-to-r from-teal to-atlantic bg-clip-text text-transparent">
              GLP-1 weight loss
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">
            Everything you need to know about GLP-1 medication for weight management — from how it
            works and what it costs to meal plans, exercise tips, and choosing the right program.
            Written by our clinical team, updated for 2026.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-graphite-400">
            <span>9 chapters</span>
            <span>&middot;</span>
            <span>40+ resources</span>
            <span>&middot;</span>
            <span>Free to read</span>
          </div>
        </SectionShell>
      </section>

      {/* Chapter grid */}
      <section className="py-16">
        <SectionShell>
          <div className="space-y-8">
            {chapters.map((chapter) => (
              <div
                key={chapter.number}
                className="rounded-2xl border border-navy-100/60 bg-white p-6 sm:p-8 shadow-premium"
              >
                <div className="flex items-start gap-5">
                  <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal to-atlantic text-white font-bold text-lg shadow-glow">
                    {chapter.number}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <chapter.icon className="h-5 w-5 text-teal sm:hidden" />
                      <h2 className="text-xl font-bold text-navy">
                        <span className="text-teal sm:hidden">{chapter.number}. </span>
                        {chapter.title}
                      </h2>
                    </div>
                    <p className="text-sm text-graphite-500 leading-relaxed">{chapter.description}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {chapter.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="inline-flex items-center gap-1 rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-1.5 text-xs font-medium text-navy hover:border-teal hover:text-teal transition-colors"
                        >
                          {link.label}
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Quick start CTA */}
      <section className="bg-premium-gradient py-16">
        <SectionShell className="text-center max-w-2xl">
          <h2 className="text-2xl font-bold text-navy sm:text-3xl">
            Ready to start your weight loss journey?
          </h2>
          <p className="mt-4 text-graphite-500">
            Take a 2-minute assessment to see if you qualify for GLP-1 treatment.
            Plans start at $279/month — up to 79% less than brand-name retail.
          </p>
          <div className="mt-8">
            <Link href="/qualify">
              <Button size="xl" className="gap-2 px-10">
                See If I Qualify
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </SectionShell>
      </section>

      <CtaSection />
    </MarketingShell>
  );
}
