export const dynamic = "force-static";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { faqTopics } from "@/lib/faq-content";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { SectionShell } from "@/components/shared/section-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site";
import { FaqAccordion } from "./faq-accordion";

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
