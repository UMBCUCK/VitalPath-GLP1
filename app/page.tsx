// Note: Do NOT add force-dynamic here — Railway standalone mode requires
// server rendering for pages with next/dynamic imports.

import type { Metadata } from "next";
import dynamic_import from "next/dynamic";
import { HeroSection } from "@/components/marketing/hero-section";
import { TrustBar } from "@/components/marketing/trust-bar";
import { MedicationStrip } from "@/components/marketing/medication-strip";
import { ProblemSection } from "@/components/marketing/problem-section";
import { SolutionSection } from "@/components/marketing/solution-section";
import { ProcessSection } from "@/components/marketing/process-section";
import { Disclaimer } from "@/components/shared/disclaimer";
import { OrganizationJsonLd, FAQPageJsonLd, HowToJsonLd, ProductJsonLd, MedicalWebPageJsonLd, SiteLinksSearchBoxJsonLd } from "@/components/seo/json-ld";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { siteConfig } from "@/lib/site";
import { faqs } from "@/lib/content";
import { fetchDbPlans } from "@/lib/pricing-server";

// Lazy load below-fold sections to reduce initial JS bundle (~40% faster LCP)
const MedicationShowcase = dynamic_import(() => import("@/components/marketing/medication-showcase").then(m => ({ default: m.MedicationShowcase })));
const EligibilityChecker = dynamic_import(() => import("@/components/marketing/eligibility-checker").then(m => ({ default: m.EligibilityChecker })));
const ResultsSection = dynamic_import(() => import("@/components/marketing/results-section").then(m => ({ default: m.ResultsSection })));
const TestimonialSection = dynamic_import(() => import("@/components/marketing/testimonial-section").then(m => ({ default: m.TestimonialSection })));
const GuaranteeSection = dynamic_import(() => import("@/components/marketing/guarantee-section").then(m => ({ default: m.GuaranteeSection })));
const PricingSection = dynamic_import(() => import("@/components/marketing/pricing-section").then(m => ({ default: m.PricingSection })));
const FaqSection = dynamic_import(() => import("@/components/marketing/faq-section").then(m => ({ default: m.FaqSection })));
const CtaSection = dynamic_import(() => import("@/components/marketing/cta-section").then(m => ({ default: m.CtaSection })));
const ObjectionHandler = dynamic_import(() => import("@/components/marketing/objection-handler").then(m => ({ default: m.ObjectionHandler })));

// SEO metadata optimized for GLP-1 weight loss keywords
export const metadata: Metadata = {
  title: "GLP-1 Weight Loss Program Online | From $179/mo | Nature's Journey",
  description:
    "Get compounded GLP-1 medication prescribed online by licensed providers. Provider-guided weight management starting from $179/mo. Free shipping. Cancel anytime. Individual results vary.",
  keywords: [
    "GLP-1 weight loss",
    "semaglutide online",
    "GLP-1 medication online",
    "weight loss medication",
    "compounded semaglutide",
    "telehealth weight loss",
    "online weight loss program",
    "GLP-1 prescription online",
    "compounded tirzepatide",
    "telehealth weight management",
  ],
  openGraph: {
    title: "GLP-1 Weight Loss Program | From $179/mo | Nature's Journey",
    description:
      "Compounded GLP-1 medication prescribed online by licensed providers. Starting from $179/mo with free shipping. Join 18,000+ members. See if you qualify in 2 minutes.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "GLP-1 Weight Loss Program From $179/mo | Nature's Journey",
    description:
      "Compounded GLP-1 medication prescribed by licensed providers. Free shipping. See if you qualify in 2 minutes. Individual results vary.",
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export default async function HomePage() {
  const plans = await fetchDbPlans();
  return (
    <MarketingShell>
      {/* Rich structured data for SEO — 7 schema types for maximum SERP features */}
      <OrganizationJsonLd />
      <SiteLinksSearchBoxJsonLd />
      <MedicalWebPageJsonLd
        name="GLP-1 Weight Loss Medication Online — Nature's Journey"
        description="Provider-guided GLP-1 weight management with personalized treatment plans, medication if prescribed, and ongoing support. From $179/mo."
        url="/"
        medicalAudience="Patient"
      />
      <FAQPageJsonLd faqs={faqs} />
      <HowToJsonLd
        name="How to Get GLP-1 Weight Loss Medication Online"
        description="Get prescribed GLP-1 medication through Nature's Journey's telehealth platform in 3 simple steps."
        steps={[
          { title: "Complete online assessment", description: "Answer questions about your health goals and history. Takes about 2 minutes." },
          { title: "Get evaluated by a provider", description: "A board-certified provider reviews your health profile and determines eligibility." },
          { title: "Receive medication at your door", description: "If prescribed, medication ships from a licensed pharmacy with free 2-day delivery." },
        ]}
      />
      {plans.map((plan) => (
        <ProductJsonLd
          key={plan.id}
          name={`Nature's Journey ${plan.name} Plan`}
          description={plan.description}
          price={plan.priceMonthly / 100}
          url={`/qualify?plan=${plan.slug}`}
        />
      ))}

      {/* === PHASE 1: HOOK — above the fold === */}
      <HeroSection />
      <TrustBar />
      <MedicationStrip />

      {/* COMPLIANCE: FDA disclosure — required above primary content */}
      <div className="border-b border-navy-100/40 bg-linen/60 py-3">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <p className="text-xs leading-relaxed text-graphite-500">
            <strong className="text-graphite-600">Important:</strong> Compounded semaglutide and tirzepatide are <strong>not FDA-approved drug products</strong>. They are prepared by state-licensed compounding pharmacies under individual prescriptions. Medication is only available to eligible patients as determined by a licensed provider. Individual results vary.
          </p>
        </div>
      </div>

      {/* === PHASE 2: PROVE — early social proof === */}
      <TestimonialSection />
      <ResultsSection />

      {/* === PHASE 3: EXPLAIN — what it is, how it works === */}
      <ProblemSection />
      <SolutionSection />
      <MedicationShowcase />

      {/* === PHASE 4: CONVERT — pricing and action === */}
      <ProcessSection />
      <PricingSection plans={plans} />
      <EligibilityChecker />

      {/* === PHASE 5: REASSURE — handle objections and close === */}
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
