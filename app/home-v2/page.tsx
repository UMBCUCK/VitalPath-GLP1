import type { Metadata } from "next";
import dynamic_import from "next/dynamic";
import { HeroSectionV2 } from "@/components/marketing/hero-section-v2";
import { TrustBar } from "@/components/marketing/trust-bar";
import { MedicationStrip } from "@/components/marketing/medication-strip";
import { ProblemSection } from "@/components/marketing/problem-section";
import { SolutionSection } from "@/components/marketing/solution-section";
import { ProcessSection } from "@/components/marketing/process-section";
import { Disclaimer } from "@/components/shared/disclaimer";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { siteConfig } from "@/lib/site";
import { fetchDbPlans } from "@/lib/pricing-server";

// Lazy-load below-fold sections (mirrors app/page.tsx:20-28)
const MedicationShowcase = dynamic_import(() => import("@/components/marketing/medication-showcase").then(m => ({ default: m.MedicationShowcase })));
const EligibilityChecker = dynamic_import(() => import("@/components/marketing/eligibility-checker").then(m => ({ default: m.EligibilityChecker })));
const ResultsSection = dynamic_import(() => import("@/components/marketing/results-section").then(m => ({ default: m.ResultsSection })));
const TestimonialSectionV2 = dynamic_import(() => import("@/components/marketing/testimonial-section-v2").then(m => ({ default: m.TestimonialSectionV2 })));
const GuaranteeSection = dynamic_import(() => import("@/components/marketing/guarantee-section").then(m => ({ default: m.GuaranteeSection })));
const PricingSection = dynamic_import(() => import("@/components/marketing/pricing-section").then(m => ({ default: m.PricingSection })));
const FaqSection = dynamic_import(() => import("@/components/marketing/faq-section").then(m => ({ default: m.FaqSection })));
const CtaSection = dynamic_import(() => import("@/components/marketing/cta-section").then(m => ({ default: m.CtaSection })));
const ObjectionHandler = dynamic_import(() => import("@/components/marketing/objection-handler").then(m => ({ default: m.ObjectionHandler })));

// Refresh at most hourly so the dynamic [Month] in the hero rolls over cleanly
// past midnight on the 20th without serving stale HTML.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "GLP-1 Weight Loss — Lose Belly Fat with Doctor-Prescribed Medicine",
  description:
    "Start losing stubborn belly fat with doctor-prescribed GLP-1 medicine. 2-minute approval, no insurance needed, fast 24–48 hour shipping. Individual results vary.",
  // Keep this variant out of search results — we have the canonical homepage at /
  robots: { index: false, follow: false },
  alternates: { canonical: `${siteConfig.url}/` },
};

export default async function HomeV2Page() {
  const plans = await fetchDbPlans();
  return (
    <MarketingShell>
      {/* === PHASE 1: HOOK — above the fold === */}
      <HeroSectionV2 />
      <TrustBar />
      <MedicationStrip />

      {/* COMPLIANCE: FDA disclosure — required above primary content */}
      <div className="border-b border-navy-100/40 bg-linen/60 py-3">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <p className="text-[11px] leading-relaxed text-graphite-400">
            <strong className="text-graphite-500">Important:</strong> Compounded semaglutide and tirzepatide are <strong>not FDA-approved drug products</strong>. They are prepared by state-licensed compounding pharmacies under individual prescriptions. Medication is only available to eligible patients as determined by a licensed provider. Individual results vary.
          </p>
        </div>
      </div>

      {/* === PHASE 2: PROVE — reviews with before/after carousel embedded === */}
      <TestimonialSectionV2 />
      <ResultsSection />

      {/* === PHASE 3: EXPLAIN === */}
      <ProblemSection />
      <SolutionSection />
      <MedicationShowcase />

      {/* === PHASE 4: CONVERT === */}
      <ProcessSection />
      <PricingSection plans={plans} />
      <EligibilityChecker />

      {/* === PHASE 5: REASSURE === */}
      <ObjectionHandler />
      <GuaranteeSection />
      <FaqSection limit={8} />
      <CtaSection />

      <section className="border-t border-navy-100/40 bg-linen/50 py-8">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Disclaimer text={siteConfig.compliance.shortDisclaimer} size="sm" />
        </div>
      </section>
    </MarketingShell>
  );
}
