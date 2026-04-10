export const dynamic = "force-static";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, Droplets, Target, Flame, BookOpen, Scale, FileText, Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { WebPageJsonLd } from "@/components/seo/json-ld";

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
];

export default function ToolsPage() {
  return (
    <MarketingShell>
      <WebPageJsonLd
        title="Free Health & Weight Loss Tools"
        description="Free calculators, guides, and nutrition resources for weight management."
        path="/tools"
      />

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

      <CtaSection />
    </MarketingShell>
  );
}
