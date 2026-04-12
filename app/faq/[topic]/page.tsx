export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight, BookOpen } from "lucide-react";
import { faqTopics } from "@/lib/faq-content";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { SectionShell } from "@/components/shared/section-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site";
import { FaqAccordion } from "./faq-accordion";

const topicBlogMap: Record<string, { href: string; tag: string; title: string }[]> = {
  semaglutide: [
    { href: "/blog/semaglutide-timeline-first-3-months", tag: "Timeline", title: "Semaglutide Weight Loss Timeline: What to Expect" },
    { href: "/blog/semaglutide-dosing-schedule-guide", tag: "Dosing", title: "GLP-1 Dosing Schedule: Week-by-Week Guide" },
    { href: "/blog/is-semaglutide-safe-long-term", tag: "Safety", title: "Is Semaglutide Safe for Long-Term Use?" },
    { href: "/blog/semaglutide-mechanism-of-action-explained", tag: "Science", title: "How Semaglutide Works: Mechanism of Action" },
    { href: "/blog/ozempic-vs-wegovy-difference", tag: "Comparison", title: "Ozempic vs. Wegovy: What's the Difference?" },
    { href: "/semaglutide", tag: "Guide", title: "Complete Semaglutide Treatment Guide" },
  ],
  tirzepatide: [
    { href: "/blog/tirzepatide-vs-semaglutide-2026", tag: "Comparison", title: "Tirzepatide vs. Semaglutide: Best in 2026?" },
    { href: "/blog/tirzepatide-vs-ozempic-comparison", tag: "Comparison", title: "Tirzepatide vs. Ozempic: Head-to-Head" },
    { href: "/blog/tirzepatide-side-effects-week-by-week", tag: "Side Effects", title: "Tirzepatide Side Effects: Week-by-Week" },
    { href: "/blog/mounjaro-vs-zepbound-difference", tag: "Comparison", title: "Mounjaro vs. Zepbound: Same Drug?" },
    { href: "/blog/semaglutide-dosing-schedule-guide", tag: "Dosing", title: "GLP-1 Dosing Schedule Guide" },
    { href: "/tirzepatide", tag: "Guide", title: "Complete Tirzepatide Treatment Guide" },
  ],
  cost: [
    { href: "/blog/does-insurance-cover-wegovy-ozempic-2026", tag: "Insurance", title: "Does Insurance Cover GLP-1 Medication in 2026?" },
    { href: "/blog/semaglutide-insurance-prior-authorization", tag: "Insurance", title: "How to Get Prior Authorization" },
    { href: "/blog/compounded-semaglutide-safety", tag: "Compounded", title: "Is Compounded Semaglutide Safe?" },
    { href: "/blog/how-to-get-glp1-without-insurance", tag: "Cost", title: "How to Get GLP-1 Without Insurance" },
    { href: "/glp1-cost", tag: "Pricing", title: "GLP-1 Cost Guide: Full 2026 Breakdown" },
    { href: "/compare", tag: "Compare", title: "VitalPath vs. Other GLP-1 Programs" },
  ],
  "side-effects": [
    { href: "/blog/managing-side-effects", tag: "Guide", title: "Managing GLP-1 Side Effects: Complete Guide" },
    { href: "/blog/tirzepatide-side-effects-week-by-week", tag: "Timeline", title: "Tirzepatide Side Effects Week-by-Week" },
    { href: "/blog/glp1-nausea-remedies", tag: "Nausea", title: "GLP-1 Nausea: 8 Proven Remedies" },
    { href: "/blog/semaglutide-hair-loss", tag: "Side Effects", title: "GLP-1 and Hair Loss: Causes & Prevention" },
    { href: "/blog/glp1-mental-health-food-noise", tag: "Mindset", title: "How GLP-1 Reduces Food Noise" },
    { href: "/blog/alcohol-and-glp1-medications", tag: "Lifestyle", title: "Alcohol and GLP-1: What You Need to Know" },
  ],
  "getting-started": [
    { href: "/blog/semaglutide-timeline-first-3-months", tag: "Timeline", title: "Your First 3 Months on GLP-1 Medication" },
    { href: "/blog/semaglutide-injection-guide", tag: "How-To", title: "How to Inject Semaglutide: Step-by-Step" },
    { href: "/blog/what-to-eat-on-semaglutide", tag: "Nutrition", title: "What to Eat on GLP-1 for Best Results" },
    { href: "/blog/protein-intake-guide", tag: "Nutrition", title: "Protein Intake Guide for GLP-1 Patients" },
    { href: "/how-it-works", tag: "Process", title: "How the VitalPath Program Works" },
    { href: "/eligibility", tag: "Eligibility", title: "Check Your Eligibility" },
  ],
  nutrition: [
    { href: "/blog/what-to-eat-on-semaglutide", tag: "Nutrition", title: "What to Eat on GLP-1 for Best Results" },
    { href: "/blog/protein-intake-guide", tag: "Protein", title: "Protein Intake Guide for GLP-1 Patients" },
    { href: "/blog/high-protein-recipes-appetite-changes", tag: "Recipes", title: "High-Protein Recipes for Reduced Appetite" },
    { href: "/blog/what-to-eat-first-week-semaglutide", tag: "Week 1", title: "What to Eat in Your First Week" },
    { href: "/blog/glp1-nausea-remedies", tag: "Nausea", title: "GLP-1 Nausea: 8 Proven Remedies" },
    { href: "/meals", tag: "Meal Plans", title: "GLP-1 Meal Plans & Recipes" },
  ],
  exercise: [
    { href: "/blog/exercise-during-treatment", tag: "Exercise", title: "Exercise During GLP-1 Treatment" },
    { href: "/blog/glp1-weight-loss-plateau", tag: "Plateau", title: "Breaking a Weight Loss Plateau on GLP-1" },
    { href: "/blog/semaglutide-muscle-loss-prevention", tag: "Muscle", title: "Preventing Muscle Loss on Semaglutide" },
    { href: "/blog/protein-intake-guide", tag: "Protein", title: "Protein Intake Guide for GLP-1 Patients" },
    { href: "/calculators/tdee", tag: "Tools", title: "TDEE Calculator — Find Your Daily Calories" },
    { href: "/faq/nutrition", tag: "Related", title: "Nutrition FAQ for GLP-1 Patients" },
  ],
};

export function generateStaticParams() {
  return faqTopics.map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic: topicSlug } = await params;
  const topic = faqTopics.find((t) => t.slug === topicSlug);
  if (!topic) return {};
  return {
    title: topic.title,
    description: topic.description,
  };
}

export default async function FaqTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic: topicSlug } = await params;
  const topic = faqTopics.find((t) => t.slug === topicSlug);
  if (!topic) notFound();

  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "FAQ", href: "/faq" },
    { name: topic.eyebrow, href: `/faq/${topic.slug}` },
  ];

  return (
    <MarketingShell>
      <FAQPageJsonLd faqs={topic.faqs} />
      <BreadcrumbJsonLd items={breadcrumbItems} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          {/* Breadcrumb nav */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center justify-center gap-1 text-sm text-graphite-400"
          >
            <Link href="/" className="hover:text-navy transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/faq" className="hover:text-navy transition-colors">
              FAQ
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-navy font-medium">{topic.eyebrow}</span>
          </nav>

          <Badge variant="default" className="mb-6">
            {topic.eyebrow}
          </Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            {topic.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500 leading-relaxed">
            {topic.description}
          </p>
          <div className="mt-8">
            <Link href="/qualify">
              <Button size="lg" variant="default" className="gap-2">
                See If I Qualify
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </SectionShell>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 sm:py-24 bg-white">
        <SectionShell>
          <div className="mx-auto max-w-3xl">
            <FaqAccordion faqs={topic.faqs} />
          </div>
        </SectionShell>
      </section>

      {/* Browse other topics */}
      <section className="py-10 bg-cloud/30 border-t border-sage/20">
        <SectionShell>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-graphite-400 mb-4">Browse other FAQ topics</h2>
            <div className="flex flex-wrap gap-2">
              {faqTopics
                .filter((t) => t.slug !== topic.slug)
                .map((t) => (
                  <Link
                    key={t.slug}
                    href={`/faq/${t.slug}`}
                    className="inline-flex items-center gap-1 rounded-full border border-navy-100/40 bg-white px-4 py-1.5 text-sm font-medium text-navy hover:border-teal hover:text-teal transition-colors"
                  >
                    {t.eyebrow}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                ))}
              <Link
                href="/faq"
                className="inline-flex items-center gap-1 rounded-full border border-navy-100/40 bg-navy-50/20 px-4 py-1.5 text-sm font-medium text-navy hover:border-teal hover:text-teal transition-colors"
              >
                All FAQs
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* From the blog */}
      {topicBlogMap[topic.slug] && (
        <section className="py-14 bg-navy-50/40 border-t border-navy-100/40">
          <SectionShell>
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="h-4 w-4 text-teal" />
              <h2 className="text-lg font-semibold text-navy">From the blog</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topicBlogMap[topic.slug].map(({ href, tag, title }) => (
                <Link key={href} href={href} className="group flex flex-col gap-2 rounded-xl border border-navy-100/60 bg-white p-4 shadow-sm hover:shadow-md hover:border-teal/40 transition-all">
                  <span className="text-xs font-semibold uppercase tracking-wide text-teal">{tag}</span>
                  <span className="text-sm font-medium text-navy leading-snug group-hover:text-teal transition-colors">{title}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-graphite-300 group-hover:text-teal mt-auto transition-colors" />
                </Link>
              ))}
            </div>
          </SectionShell>
        </section>
      )}

      {/* Related Resources */}
      <section className="py-12 bg-cloud/50 border-y border-sage/20">
        <SectionShell>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-lg font-semibold text-navy mb-4">Related Resources</h2>
            <div className="flex flex-wrap gap-3">
              {topic.relatedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-sage/40 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-teal-500 hover:text-teal-600 transition-colors"
                >
                  {link.label}
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 sm:py-20 bg-white">
        <SectionShell className="text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-graphite-500">
            Take a 2-minute assessment to see if you qualify for a Nature's Journey weight
            management program.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/qualify">
              <Button size="lg" variant="default" className="gap-2 px-8">
                See If I Qualify
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                View Plans &amp; Pricing
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-xs text-graphite-400 max-w-lg mx-auto">
            {siteConfig.compliance.shortDisclaimer}
          </p>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
