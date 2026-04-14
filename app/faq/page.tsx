export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Pill, DollarSign, AlertCircle, Zap, Utensils, Activity } from "lucide-react";
import { FaqSection } from "@/components/marketing/faq-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { faqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Frequently Asked Questions About GLP-1 Weight Loss | Nature's Journey",
  description:
    "Answers to the most common questions about GLP-1 weight loss medication, semaglutide, tirzepatide, cost, eligibility, side effects, and getting started with Nature's Journey.",
  openGraph: {
    title: "GLP-1 Weight Loss FAQ | Nature's Journey",
    description:
      "Find clear, evidence-based answers to common questions about semaglutide, tirzepatide, cost without insurance, side effects, and how to get started.",
  },
};

const faqTopics = [
  {
    icon: Pill,
    title: "Semaglutide FAQ",
    description: "15 questions about how semaglutide works, dosing, timeline, and what to expect.",
    href: "/faq/semaglutide",
    count: 15,
  },
  {
    icon: Zap,
    title: "Tirzepatide FAQ",
    description: "How tirzepatide compares to semaglutide, its dual mechanism, and clinical data.",
    href: "/faq/tirzepatide",
    count: 15,
  },
  {
    icon: DollarSign,
    title: "Cost & Insurance FAQ",
    description: "What GLP-1 medications cost without insurance and how compounded options work.",
    href: "/faq/cost",
    count: 10,
  },
  {
    icon: AlertCircle,
    title: "Side Effects FAQ",
    description: "What side effects are common, how to manage them, and what requires attention.",
    href: "/faq/side-effects",
    count: 12,
  },
  {
    icon: BookOpen,
    title: "Getting Started FAQ",
    description: "How to qualify, what to expect in the first weeks, and how to prepare.",
    href: "/faq/getting-started",
    count: 10,
  },
  {
    icon: Utensils,
    title: "Nutrition FAQ",
    description: "What to eat, how much protein, foods to avoid, and managing nausea through diet.",
    href: "/faq/nutrition",
    count: 8,
  },
  {
    icon: Activity,
    title: "Exercise FAQ",
    description: "Best workouts, muscle preservation, energy levels, and breaking plateaus.",
    href: "/faq/exercise",
    count: 8,
  },
];

export default function FaqPage() {
  return (
    <MarketingShell>
      <FAQPageJsonLd faqs={faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "FAQ", href: "/faq" },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6">FAQ</Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            GLP-1 weight loss — frequently asked questions
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500 leading-relaxed">
            Clear, evidence-based answers to the most common questions about semaglutide, tirzepatide, cost, eligibility, and how to get started.
          </p>
        </SectionShell>
      </section>

      {/* Topic navigation */}
      <section className="py-12 bg-white border-y border-navy-100/40">
        <SectionShell>
          <SectionHeading
            eyebrow="Deep Dive Topics"
            title="Browse by category"
            description="Each topic page has 10–15 detailed questions and answers organized by category."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {faqTopics.map((topic) => (
              <Link
                key={topic.href}
                href={topic.href}
                className="group flex items-start gap-4 rounded-2xl border border-navy-100/40 bg-cloud/30 p-5 transition-all hover:border-teal/30 hover:bg-teal-50/20 hover:shadow-premium"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 group-hover:bg-teal">
                  <topic.icon className="h-5 w-5 text-teal group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-navy group-hover:text-teal transition-colors">{topic.title}</h3>
                    <span className="text-xs text-graphite-300">{topic.count} Q&A</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-graphite-500">{topic.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-graphite-300 group-hover:text-teal transition-colors mt-0.5" />
              </Link>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* General FAQ */}
      <section className="py-4">
        <SectionShell>
          <SectionHeading
            eyebrow="General FAQ"
            title="Common questions about Nature's Journey"
          />
        </SectionShell>
      </section>
      <FaqSection showHeading={false} />

      <section className="py-14 bg-navy-50/40 border-t border-navy-100/40">
        <SectionShell>
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="h-4 w-4 text-teal" />
            <h2 className="text-lg font-semibold text-navy">Dive deeper in the blog</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/blog/semaglutide-timeline-first-3-months", tag: "Timeline", title: "Semaglutide Weight Loss Timeline: First 3 Months" },
              { href: "/blog/tirzepatide-vs-semaglutide-2026", tag: "Comparison", title: "Tirzepatide vs. Semaglutide: Which Wins in 2026?" },
              { href: "/blog/managing-side-effects", tag: "Side Effects", title: "Managing GLP-1 Side Effects: Complete Guide" },
              { href: "/blog/does-insurance-cover-wegovy-ozempic-2026", tag: "Insurance", title: "Does Insurance Cover GLP-1 in 2026?" },
              { href: "/blog/what-to-eat-on-semaglutide", tag: "Nutrition", title: "What to Eat on GLP-1 for Best Results" },
              { href: "/blog/is-semaglutide-safe-long-term", tag: "Safety", title: "Is Semaglutide Safe for Long-Term Use?" },
            ].map(({ href, tag, title }) => (
              <Link key={href} href={href} className="group flex flex-col gap-2 rounded-xl border border-navy-100/60 bg-white p-4 shadow-sm hover:shadow-md hover:border-teal/40 transition-all">
                <span className="text-xs font-semibold uppercase tracking-wide text-teal">{tag}</span>
                <span className="text-sm font-medium text-navy leading-snug group-hover:text-teal transition-colors">{title}</span>
                <ArrowRight className="h-3.5 w-3.5 text-graphite-300 group-hover:text-teal mt-auto transition-colors" />
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-teal hover:underline">
              Browse all articles <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </SectionShell>
      </section>

      <CtaSection />
    </MarketingShell>
  );
}
