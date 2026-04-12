export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Pill, Utensils, Activity, Scale, DollarSign, Users, Shield, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { CtaSection } from "@/components/marketing/cta-section";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { WebPageJsonLd, BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "The Complete Guide to GLP-1 Weight Loss (2026)",
  description:
    "Everything you need to know about GLP-1 weight loss medication. How it works, cost, results timeline, side effects, diet tips, exercise, and choosing a provider. Free comprehensive guide.",
  openGraph: {
    title: "The Complete Guide to GLP-1 Weight Loss | Nature's Journey",
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
      { label: "Semaglutide vs Tirzepatide (2026)", href: "/blog/tirzepatide-vs-semaglutide-2026" },
      { label: "GLP-1 vs Diet & Exercise Alone", href: "/blog/semaglutide-vs-diet-exercise-alone" },
    ],
  },
  {
    icon: DollarSign,
    number: "02",
    title: "Cost & Accessibility",
    description: "What GLP-1 medications cost with and without insurance, how compounded alternatives work, and how to find affordable treatment.",
    links: [
      { label: "How to Get GLP-1 Without Insurance", href: "/blog/how-to-get-glp1-without-insurance" },
      { label: "Are Compounded Medications Safe?", href: "/blog/compounded-semaglutide-safety" },
      { label: "Compounded vs Brand-Name GLP-1", href: "/compare/compounded-vs-brand-glp1" },
      { label: "Nature's Journey Plans & Pricing", href: "/pricing" },
    ],
  },
  {
    icon: Scale,
    number: "03",
    title: "Results & Timeline",
    description: "What to realistically expect month by month, how much weight you can lose, and what affects your personal results.",
    links: [
      { label: "Month-by-Month Weight Loss Timeline", href: "/blog/semaglutide-timeline-first-3-months" },
      { label: "Your First Month on GLP-1", href: "/blog/first-month-on-semaglutide" },
      { label: "How to Lose 50 Pounds with GLP-1", href: "/blog/semaglutide-for-50-pounds-overweight" },
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
      { label: "GLP-1 and Alcohol", href: "/blog/alcohol-and-glp1" },
      { label: "Ozempic Face: What It Is & Prevention", href: "/blog/ozempic-face-what-is-it" },
    ],
  },
  {
    icon: Utensils,
    number: "05",
    title: "Nutrition & Meal Planning",
    description: "What to eat during treatment, protein targets, meal plans, recipes, and strategies for when your appetite is reduced.",
    links: [
      { label: "What to Eat Week 1", href: "/blog/what-to-eat-first-week-semaglutide" },
      { label: "High-Protein Foods Guide", href: "/blog/protein-intake-guide" },
      { label: "High-Protein Recipes for GLP-1", href: "/blog/high-protein-recipes-appetite-changes" },
      { label: "What to Eat on Semaglutide", href: "/blog/what-to-eat-on-semaglutide" },
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
      { label: "Exercise During GLP-1 Treatment", href: "/blog/exercise-during-treatment" },
      { label: "Breaking Weight Loss Plateaus", href: "/blog/glp1-weight-loss-plateau" },
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
    description: "How to evaluate telehealth weight loss programs, what to look for in a provider, and how Nature's Journey compares.",
    links: [
      { label: "Nature's Journey vs Hims", href: "/compare/vitalpath-vs-hims" },
      { label: "Nature's Journey vs WeightWatchers", href: "/compare/vitalpath-vs-weightwatchers" },
      { label: "Nature's Journey vs Ro", href: "/compare/vitalpath-vs-ro" },
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
      <FAQPageJsonLd faqs={[
        { question: "What are GLP-1 medications and how do they work for weight loss?", answer: "GLP-1 (glucagon-like peptide-1) receptor agonists mimic a natural gut hormone that regulates appetite and blood sugar. They slow gastric emptying, reduce hunger signals in the brain, and increase feelings of fullness. This combination leads to significant calorie reduction without willpower — resulting in 15-22% total body weight loss in clinical trials." },
        { question: "How much weight can you lose with semaglutide or tirzepatide?", answer: "Clinical trials show semaglutide produces ~15-17% total body weight loss over 68 weeks (STEP trials). Tirzepatide produces ~20-22% total body weight loss over 72 weeks (SURMOUNT trials). Combined with a structured program including nutrition and behavior support, results are often higher." },
        { question: "Is a GLP-1 program safe for long-term use?", answer: "GLP-1 medications have been studied for over a decade in diabetes management and more recently for obesity. Long-term data shows sustained safety and efficacy, with cardiovascular benefits observed in SELECT trial data. Your provider will monitor your health regularly during treatment." },
        { question: "What should I eat while on semaglutide or tirzepatide?", answer: "High-protein, nutrient-dense foods help preserve muscle while losing fat. Focus on lean proteins (chicken, fish, Greek yogurt), vegetables, and complex carbohydrates. Avoid high-fat, high-sugar processed foods which can worsen nausea. Meal timing and hydration are also important during dose escalation." },
      ]} />

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

      {/* Condition specialty links */}
      <section className="py-12 border-b border-sage/20 bg-cloud/30">
        <SectionShell>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-graphite-400">Condition-specific programs</p>
              <h2 className="text-lg font-bold text-navy mt-0.5">GLP-1 treatment for your situation</h2>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/obesity", label: "Obesity", sub: "FDA-approved GLP-1 for BMI 30+" },
              { href: "/type-2-diabetes", label: "Type 2 Diabetes", sub: "Dual blood sugar + weight benefit" },
              { href: "/sleep-apnea", label: "Sleep Apnea", sub: "2024 FDA indication — tirzepatide" },
              { href: "/pcos", label: "PCOS", sub: "Hormonal weight management" },
              { href: "/prediabetes", label: "Prediabetes", sub: "Prevent progression with GLP-1" },
              { href: "/heart-health", label: "Heart Health", sub: "SELECT trial cardiovascular data" },
              { href: "/women", label: "Women's Health", sub: "Perimenopause, hormones & weight" },
              { href: "/semaglutide", label: "Semaglutide", sub: "Ozempic & Wegovy active ingredient" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-start justify-between gap-2 rounded-xl border border-navy-100/40 bg-white p-4 hover:border-teal/30 hover:shadow-premium transition-all"
              >
                <div>
                  <p className="text-sm font-semibold text-navy group-hover:text-teal transition-colors">{item.label}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-graphite-500">{item.sub}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-graphite-300 group-hover:text-teal transition-colors mt-0.5" />
              </Link>
            ))}
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

      {/* FAQ cross-links */}
      <section className="py-12 bg-cloud/40 border-y border-sage/20">
        <SectionShell>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-graphite-400">Have questions?</p>
              <h2 className="text-lg font-bold text-navy mt-0.5">Browse the GLP-1 FAQ</h2>
            </div>
            <Link href="/faq" className="text-sm font-medium text-teal hover:underline shrink-0">
              View all FAQs &rarr;
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Semaglutide FAQ", sub: "15 questions about dosing, timeline & what to expect", href: "/faq/semaglutide" },
              { label: "Tirzepatide FAQ", sub: "How it compares to semaglutide and clinical data", href: "/faq/tirzepatide" },
              { label: "Cost & Insurance FAQ", sub: "What GLP-1 medications cost without insurance", href: "/faq/cost" },
              { label: "Side Effects FAQ", sub: "Common side effects and how to manage them", href: "/faq/side-effects" },
              { label: "Getting Started FAQ", sub: "How to qualify, what to expect in week 1", href: "/faq/getting-started" },
              { label: "Nutrition FAQ", sub: "What to eat, protein targets, and managing nausea", href: "/faq/nutrition" },
              { label: "Exercise FAQ", sub: "Best workouts, muscle preservation & plateaus", href: "/faq/exercise" },
              { label: "GLP-1 Cost Guide", sub: "Full 2026 pricing breakdown for all medications", href: "/glp1-cost" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-start justify-between gap-2 rounded-xl border border-navy-100/40 bg-white p-4 hover:border-teal/30 hover:shadow-premium transition-all"
              >
                <div>
                  <p className="text-sm font-semibold text-navy group-hover:text-teal transition-colors">{item.label}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-graphite-500">{item.sub}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-graphite-300 group-hover:text-teal transition-colors mt-0.5" />
              </Link>
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
