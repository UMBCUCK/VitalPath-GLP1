export const dynamic = "force-static";

import type { Metadata } from "next";
import Link from "next/link";
import { ProcessSection } from "@/components/marketing/process-section";
import { TrustBar } from "@/components/marketing/trust-bar";
import { FaqSection } from "@/components/marketing/faq-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock, Stethoscope, Package, HeartPulse, BarChart3 } from "lucide-react";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { HowToJsonLd } from "@/components/seo/json-ld";
import { processSteps } from "@/lib/content";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how Nature's Journey delivers provider-guided weight management with personalized treatment plans, medication if prescribed, and ongoing support.",
};

const details = [
  {
    icon: Stethoscope,
    title: "Provider evaluation, not a sales funnel",
    body: "Every treatment plan is evaluated by a licensed medical provider. This is a clinical process, not an automated approval. Your provider reviews your health history, current medications, and goals to determine if medication-based treatment is appropriate for you.",
  },
  {
    icon: Shield,
    title: "Eligibility is provider-determined",
    body: "Not everyone qualifies for GLP-1 medication. That's by design. Our providers follow established clinical guidelines. If you're not eligible for medication, we'll discuss alternative support options during your evaluation.",
  },
  {
    icon: Package,
    title: "Licensed pharmacy fulfillment",
    body: "Medication, if prescribed, is prepared by a state-licensed pharmacy and shipped discreetly with temperature-controlled packaging. Most shipments arrive within 3-5 business days of provider approval.",
  },
  {
    icon: Clock,
    title: "Ongoing care, not just a prescription",
    body: "Regular check-ins with your care team, dose adjustments as needed, and continuous access to your provider through secure messaging. Your treatment plan evolves as your needs change.",
  },
  {
    icon: HeartPulse,
    title: "Tools that support consistency",
    body: "Progress tracking, meal plans, protein and hydration goals, recipes, and coaching check-ins. These aren't afterthoughts — they're core to how our members build real, lasting habits.",
  },
  {
    icon: BarChart3,
    title: "Built for long-term success",
    body: "We include maintenance transition planning because the goal isn't to keep you on medication forever. It's to help you reach your goals and build the habits to maintain them.",
  },
];

export default function HowItWorksPage() {
  return (
    <MarketingShell>
      <HowToJsonLd
        name="How to Start GLP-1 Weight Management with Nature's Journey"
        description="A four-step process from initial assessment to ongoing provider-guided care with personalized treatment plans."
        steps={processSteps.map((s) => ({ title: s.title, description: s.description }))}
      />
      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6">
            How It Works
          </Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            A straightforward process from assessment to progress
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">
            No hidden requirements, no confusing fine print. Here's exactly what happens when you
            start with Nature's Journey.
          </p>
        </SectionShell>
      </section>

      <ProcessSection />

      {/* Detail blocks */}
      <section className="bg-premium-gradient py-20">
        <SectionShell>
          <SectionHeading
            eyebrow="What Makes Us Different"
            title="Clinical-grade care meets everyday support"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {details.map((d) => (
              <div
                key={d.title}
                className="rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50">
                  <d.icon className="h-5 w-5 text-teal" />
                </div>
                <h3 className="mt-4 text-base font-bold text-navy">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite-500">{d.body}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Related resources */}
      <section className="py-12">
        <SectionShell>
          <h2 className="text-lg font-bold text-navy mb-4">Dive deeper</h2>
          <div className="flex flex-wrap gap-3 text-xs">
            <Link href="/medications" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
              GLP-1 medications guide →
            </Link>
            <Link href="/blog/what-to-expect-first-month-glp1" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
              First month expectations →
            </Link>
            <Link href="/pricing" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
              Plans & pricing →
            </Link>
            <Link href="/blog/compounded-glp1-safety-evidence" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
              Compounded medication safety →
            </Link>
            <Link href="/guide" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
              Complete GLP-1 guide →
            </Link>
          </div>
        </SectionShell>
      </section>

      <TrustBar />
      <FaqSection limit={5} />
      <CtaSection />
    </MarketingShell>
  );
}
