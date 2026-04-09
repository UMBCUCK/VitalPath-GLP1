export const dynamic = "force-static";

import type { Metadata } from "next";
import dynamic_import from "next/dynamic";
import { HeroSection } from "@/components/marketing/hero-section";
import { TrustBar } from "@/components/marketing/trust-bar";
import { ProblemSection } from "@/components/marketing/problem-section";
import { PersonaSection } from "@/components/marketing/persona-section";
import { SolutionSection } from "@/components/marketing/solution-section";
import { ProcessSection } from "@/components/marketing/process-section";
import { Disclaimer } from "@/components/shared/disclaimer";
import { OrganizationJsonLd, FAQPageJsonLd, HowToJsonLd, ProductJsonLd } from "@/components/seo/json-ld";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { siteConfig } from "@/lib/site";
import { faqs } from "@/lib/content";
import { plans } from "@/lib/pricing";

// Lazy load below-fold sections to reduce initial JS bundle (~40% faster LCP)
const MedicationSection = dynamic_import(() => import("@/components/marketing/medication-section").then(m => ({ default: m.MedicationSection })));
const EligibilityChecker = dynamic_import(() => import("@/components/marketing/eligibility-checker").then(m => ({ default: m.EligibilityChecker })));
const ComparisonSection = dynamic_import(() => import("@/components/marketing/comparison-section").then(m => ({ default: m.ComparisonSection })));
const DifferentiatorSection = dynamic_import(() => import("@/components/marketing/differentiator-section").then(m => ({ default: m.DifferentiatorSection })));
const SavingsCalculator = dynamic_import(() => import("@/components/marketing/savings-calculator").then(m => ({ default: m.SavingsCalculator })));
const ResultsSection = dynamic_import(() => import("@/components/marketing/results-section").then(m => ({ default: m.ResultsSection })));
const TimelineSection = dynamic_import(() => import("@/components/marketing/timeline-section").then(m => ({ default: m.TimelineSection })));
const BeforeAfterSection = dynamic_import(() => import("@/components/marketing/before-after-section").then(m => ({ default: m.BeforeAfterSection })));
const TestimonialSection = dynamic_import(() => import("@/components/marketing/testimonial-section").then(m => ({ default: m.TestimonialSection })));
const VideoTestimonials = dynamic_import(() => import("@/components/marketing/video-testimonials").then(m => ({ default: m.VideoTestimonials })));
const PressSection = dynamic_import(() => import("@/components/marketing/press-section").then(m => ({ default: m.PressSection })));
const ProviderSection = dynamic_import(() => import("@/components/marketing/provider-section").then(m => ({ default: m.ProviderSection })));
const GuaranteeSection = dynamic_import(() => import("@/components/marketing/guarantee-section").then(m => ({ default: m.GuaranteeSection })));
const PricingSection = dynamic_import(() => import("@/components/marketing/pricing-section").then(m => ({ default: m.PricingSection })));
const FaqSection = dynamic_import(() => import("@/components/marketing/faq-section").then(m => ({ default: m.FaqSection })));
const CtaSection = dynamic_import(() => import("@/components/marketing/cta-section").then(m => ({ default: m.CtaSection })));

// SEO metadata optimized for GLP-1 weight loss keywords
export const metadata: Metadata = {
  title: "GLP-1 Weight Loss Medication Online | From $279/mo | VitalPath",
  description:
    "Get GLP-1 weight loss medication prescribed online by licensed providers. Same active ingredient as Ozempic & Wegovy — 79% less than retail. Free 2-day shipping. Cancel anytime.",
  keywords: [
    "GLP-1 weight loss",
    "semaglutide online",
    "GLP-1 medication online",
    "weight loss medication",
    "compounded semaglutide",
    "telehealth weight loss",
    "Ozempic alternative",
    "Wegovy alternative",
    "online weight loss program",
    "GLP-1 prescription online",
  ],
  openGraph: {
    title: "GLP-1 Weight Loss Medication — 79% Less Than Retail | VitalPath",
    description:
      "Prescribed online by licensed providers. From $279/mo with free shipping. Join 18,000+ members. See if you qualify in 2 minutes.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "GLP-1 Weight Loss From $279/mo — 79% Less Than Retail",
    description:
      "Same active ingredient as Ozempic & Wegovy. Prescribed by licensed providers. Free 2-day shipping. See if you qualify.",
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export default function HomePage() {
  return (
    <MarketingShell>
      {/* Rich structured data for SEO */}
      <OrganizationJsonLd />
      <FAQPageJsonLd faqs={faqs} />
      <HowToJsonLd
        name="How to Get GLP-1 Weight Loss Medication Online"
        description="Get prescribed GLP-1 medication through VitalPath's telehealth platform in 3 simple steps."
        steps={[
          { title: "Complete online assessment", description: "Answer questions about your health goals and history. Takes about 2 minutes." },
          { title: "Get evaluated by a provider", description: "A board-certified provider reviews your health profile and determines eligibility." },
          { title: "Receive medication at your door", description: "If prescribed, medication ships from a licensed pharmacy with free 2-day delivery." },
        ]}
      />
      {plans.map((plan) => (
        <ProductJsonLd
          key={plan.id}
          name={`VitalPath ${plan.name} Plan`}
          description={plan.description}
          price={plan.priceMonthly / 100}
          url={`/quiz?plan=${plan.slug}`}
        />
      ))}

      {/* ATTENTION: Hook them immediately (eagerly loaded — above the fold) */}
      <HeroSection />
      <TrustBar />

      {/* PROBLEM: Make them feel understood */}
      <ProblemSection />
      <PersonaSection />

      {/* SOLUTION: Show the way out */}
      <SolutionSection />
      <MedicationSection />

      {/* ACTION: Make it easy */}
      <ProcessSection />
      <EligibilityChecker />

      {/* VALUE: Justify the investment */}
      <ComparisonSection />
      <DifferentiatorSection />
      <SavingsCalculator />

      {/* PROOF: Remove all doubt */}
      <ResultsSection />
      <TimelineSection />
      <BeforeAfterSection />
      <TestimonialSection />
      <VideoTestimonials />
      <PressSection />

      {/* TRUST: Final authority signals */}
      <ProviderSection />
      <GuaranteeSection />

      {/* CONVERT: Close the deal */}
      <PricingSection />
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
