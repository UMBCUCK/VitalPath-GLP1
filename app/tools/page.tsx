export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, Droplets, Target, Flame, BookOpen, Scale, FileText, Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { WebPageJsonLd, BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Free Health & Weight Loss Tools",
  description:
    "Free weight loss tools: BMI calculator, TDEE calculator, protein calculator, hydration calculator, meal plans, GLP-1 guide, glossary, and more. Evidence-based resources from Nature's Journey.",
  openGraph: {
    title: "Free Weight Loss Tools & Calculators | Nature's Journey",
    description: "BMI, TDEE, protein, hydration calculators plus meal plans, guides, and glossary. All free.",
  },
};

const tools = [
  {
    category: "Calculators",
    items: [
      { icon: Calculator, title: "BMI Calculator", description: "Check your body mass index and understand what it means for treatment eligibility.", href: "/calculators/bmi" },
      { icon: Flame, title: "TDEE Calculator", description: "Find your daily calorie burn to set the right deficit for weight loss.", href: "/calculators/tdee" },
      { icon: Target, title: "Protein Calculator", description: "Calculate your daily protein target to preserve muscle during weight loss.", href: "/calculators/protein" },
      { icon: Droplets, title: "Hydration Calculator", description: "Find your optimal daily water intake based on weight and activity level.", href: "/calculators/hydration" },
    ],
  },
  {
    category: "Guides & Education",
    items: [
      { icon: BookOpen, title: "Complete GLP-1 Guide", description: "Everything you need to know about GLP-1 weight loss — 9 chapters, 40+ resources.", href: "/guide" },
      { icon: FileText, title: "Weight Loss Glossary", description: "40+ weight loss and medication terms explained in plain language.", href: "/glossary" },
      { icon: Scale, title: "Eligibility Checker", description: "Understand who qualifies for GLP-1 treatment and what providers look for.", href: "/eligibility" },
    ],
  },
  {
    category: "Nutrition Resources",
    items: [
      { icon: Utensils, title: "GLP-1-Friendly Recipes", description: "12 high-protein recipes designed for patients with reduced appetite.", href: "/meals" },
      { icon: Utensils, title: "7-Day Meal Plan", description: "Free weekly meal plan with 1,500 cal and 150g+ protein daily.", href: "/blog/7-day-high-protein-meal-plan-weight-loss" },
      { icon: Target, title: "Top 20 Protein Foods", description: "The best high-protein foods ranked by protein per calorie.", href: "/blog/best-high-protein-foods-weight-loss" },
    ],
  },
  {
    category: "Condition Guides",
    items: [
      { icon: BookOpen, title: "GLP-1 for Obesity", description: "FDA-approved treatment for adults with BMI 30+ — clinical data and what to expect.", href: "/obesity" },
      { icon: BookOpen, title: "GLP-1 for Type 2 Diabetes", description: "How GLP-1 medications improve blood sugar and produce weight loss simultaneously.", href: "/type-2-diabetes" },
      { icon: BookOpen, title: "GLP-1 for Sleep Apnea", description: "2024 FDA approval — tirzepatide reduces AHI events by 63% in clinical trials.", href: "/sleep-apnea" },
      { icon: BookOpen, title: "GLP-1 for PCOS", description: "How GLP-1 medications address insulin resistance and hormonal weight gain.", href: "/pcos" },
      { icon: BookOpen, title: "GLP-1 for Prediabetes", description: "Reverse prediabetes and prevent type 2 diabetes progression with GLP-1 therapy.", href: "/prediabetes" },
      { icon: BookOpen, title: "GLP-1 & Heart Health", description: "SELECT trial: 20% reduction in major cardiovascular events on semaglutide.", href: "/heart-health" },
    ],
  },
];

const toolsFaqs = [
  { question: "Are these health calculators free?", answer: "Yes — all calculators and tools on this page are completely free. No account required." },
  { question: "How accurate is the BMI calculator?", answer: "BMI is calculated using the standard formula: weight (lbs) ÷ height (in)² × 703. It is a screening tool, not a diagnostic measure. Two people with the same BMI can have very different body compositions." },
  { question: "How is TDEE calculated?", answer: "TDEE (Total Daily Energy Expenditure) is calculated using the Mifflin-St Jeor equation for resting metabolic rate, then multiplied by an activity factor. It estimates your total daily calorie burn based on age, sex, height, weight, and activity level." },
  { question: "How much protein do I need on GLP-1 medication?", answer: "Clinical guidelines recommend 1.2–1.6g of protein per kilogram of body weight (about 0.55–0.73g per pound) during active weight loss on GLP-1 medication. Use the protein calculator above for your personalized target." },
];

export default function ToolsPage() {
  return (
    <MarketingShell>
      <WebPageJsonLd
        title="Free Health & Weight Loss Tools"
        description="Free calculators, guides, and nutrition resources for weight management."
        path="/tools"
      />
      <BreadcrumbJsonLd items={[{ name: "Home", href: "/" }, { name: "Free Tools", href: "/tools" }]} />
      <FAQPageJsonLd faqs={toolsFaqs} />

      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6 gap-1.5">
            <Calculator className="h-3.5 w-3.5" /> Free Tools
          </Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Free weight loss tools & resources
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">
            Evidence-based calculators, guides, and nutrition resources to support your weight
            management journey. All free, no account required.
          </p>
        </SectionShell>
      </section>

      {tools.map((section) => (
        <section key={section.category} className="py-12 first:pt-16">
          <SectionShell>
            <h2 className="text-xl font-bold text-navy mb-6">{section.category}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group flex items-start gap-4 rounded-2xl border border-navy-100/60 bg-white p-5 shadow-premium transition-all hover:shadow-premium-lg hover:-translate-y-0.5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 group-hover:bg-teal-100 transition-colors">
                    <tool.icon className="h-5 w-5 text-teal" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy group-hover:text-teal transition-colors">{tool.title}</h3>
                    <p className="mt-1 text-xs text-graphite-400">{tool.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </SectionShell>
        </section>
      ))}

      {/* FAQ */}
      <section className="py-12 border-t border-navy-100/40 bg-cloud/30">
        <SectionShell className="max-w-3xl">
          <h2 className="text-xl font-bold text-navy mb-6">Frequently asked questions</h2>
          <div className="divide-y divide-navy-100/40">
            {toolsFaqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-navy text-sm list-none">
                  {faq.question}
                  <span className="shrink-0 text-graphite-300 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-graphite-500">{faq.answer}</p>
              </details>
            ))}
          </div>
        </SectionShell>
      </section>

      <CtaSection />
    </MarketingShell>
  );
}
