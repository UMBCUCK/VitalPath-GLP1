export const dynamic = "force-static";

import type { Metadata } from "next";
import { FaqSection } from "@/components/marketing/faq-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { SectionShell } from "@/components/shared/section-shell";
import { Badge } from "@/components/ui/badge";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { FAQPageJsonLd } from "@/components/seo/json-ld";
import { faqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Find answers to common questions about VitalPath's weight management program, medication, eligibility, pricing, and more.",
};

export default function FaqPage() {
  return (
    <MarketingShell>
      <FAQPageJsonLd faqs={faqs} />
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6">
            FAQ
          </Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Frequently asked questions
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">
            Clear answers to the most common questions about our program, eligibility,
            medication, and how it all works.
          </p>
        </SectionShell>
      </section>

      <FaqSection showHeading={false} />
      <CtaSection />
    </MarketingShell>
  );
}
