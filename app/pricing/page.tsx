import type { Metadata } from "next";
import Link from "next/link";
import { PricingSection } from "@/components/marketing/pricing-section";
import { TrustBar } from "@/components/marketing/trust-bar";
import { FaqSection } from "@/components/marketing/faq-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { SectionShell } from "@/components/shared/section-shell";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/section-heading";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { ProductJsonLd, FAQPageJsonLd } from "@/components/seo/json-ld";
import { fetchDbPlans, fetchDbAddOns } from "@/lib/pricing-server";
import { faqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Plans & Pricing",
  description:
    "Explore Nature's Journey membership plans. Provider-guided treatment with medication if prescribed, plus nutrition, coaching, and tracking tools.",
};

export default async function PricingPage() {
  const [plans, addOns] = await Promise.all([fetchDbPlans(), fetchDbAddOns()]);
  return (
    <MarketingShell>
      {plans.map((plan) => (
        <ProductJsonLd
          key={plan.id}
          name={`Nature's Journey ${plan.name} Plan`}
          description={plan.description}
          price={plan.priceMonthly / 100}
          url={`/quiz?plan=${plan.slug}`}
        />
      ))}
      <FAQPageJsonLd faqs={faqs.slice(0, 4)} />
      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6">
            Pricing
          </Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Transparent pricing, no hidden costs
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">
            Every plan includes provider evaluation and personalized treatment. Choose the level
            of support that fits your lifestyle and goals.
          </p>
        </SectionShell>
      </section>

      <PricingSection plans={plans} />

      {/* Add-ons */}
      <section className="bg-premium-gradient py-20">
        <SectionShell>
          <SectionHeading
            eyebrow="Add-On Support"
            title="Customize your program with add-ons"
            description="Available with any plan. Add or remove anytime from your dashboard."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {addOns.map((addon) => (
              <div
                key={addon.id}
                className="flex items-start gap-4 rounded-2xl border border-navy-100/60 bg-white p-5 shadow-premium"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                  <Check className="h-5 w-5 text-teal" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-sm font-bold text-navy">{addon.name}</h3>
                    <span className="text-sm font-semibold text-teal">
                      {formatPrice(addon.priceMonthly)}/mo
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-graphite-400">
                    {addon.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Comparison table */}
      <section className="py-20">
        <SectionShell>
          <SectionHeading title="Compare plans at a glance" />
          <div className="overflow-x-auto rounded-2xl border border-navy-100/60 bg-white shadow-premium">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40">
                  <th className="px-6 py-4 text-left font-semibold text-navy">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold text-navy">Essential</th>
                  <th className="px-6 py-4 text-center font-semibold text-teal">Premium</th>
                  <th className="px-6 py-4 text-center font-semibold text-navy">Complete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {[
                  ["Provider evaluation & treatment plan", true, true, true],
                  ["Medication, if prescribed", true, true, true],
                  ["24-48hr pharmacy shipping", true, true, true],
                  ["Care team messaging", true, true, true],
                  ["Basic progress tracking", true, true, true],
                  ["Weekly meal plans & recipes", false, true, true],
                  ["Grocery list generator", false, true, true],
                  ["Body measurements & photo vault", false, true, true],
                  ["Coaching check-ins", "Monthly", "Bi-weekly", "Weekly"],
                  ["Hydration & protein tracking", false, true, true],
                  ["Supplement bundles included", false, false, true],
                  ["Lab work coordination", false, false, true],
                  ["Maintenance transition planning", false, false, true],
                  ["Priority support", false, true, true],
                ].map(([feature, essential, premium, complete], i) => (
                  <tr key={i} className="hover:bg-navy-50/30 transition-colors">
                    <td className="px-6 py-3 text-graphite-600">{feature as string}</td>
                    {[essential, premium, complete].map((val, j) => (
                      <td key={j} className="px-6 py-3 text-center">
                        {val === true ? (
                          <Check className="mx-auto h-4 w-4 text-teal" />
                        ) : val === false ? (
                          <span className="text-graphite-300">&mdash;</span>
                        ) : (
                          <span className="text-xs font-medium text-graphite-500">{val as string}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionShell>
      </section>

      {/* Related resources */}
      <section className="py-12">
        <SectionShell>
          <h2 className="text-lg font-bold text-navy mb-4">Learn more before you decide</h2>
          <div className="flex flex-wrap gap-3 text-xs">
            <Link href="/medications" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
              GLP-1 medications guide →
            </Link>
            <Link href="/blog/glp1-weight-loss-cost-without-insurance" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
              Cost without insurance →
            </Link>
            <Link href="/eligibility" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
              Who qualifies? →
            </Link>
            <Link href="/blog/glp1-weight-loss-timeline-results" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
              Results timeline →
            </Link>
            <Link href="/compare" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
              Compare programs →
            </Link>
            <Link href="/guide" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
              Complete GLP-1 guide →
            </Link>
          </div>
        </SectionShell>
      </section>

      <TrustBar />
      <FaqSection limit={4} />
      <CtaSection />
    </MarketingShell>
  );
}
