import type { Metadata } from "next";
import {
  Check,
  Star,
  Pill,
  Brain,
  Activity,
  TrendingDown,
  Shield,
  Stethoscope,
  Scale,
  Target,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LpHeader } from "@/components/lp/lp-header";
import { LpFooter } from "@/components/lp/lp-footer";
import { LpFaq } from "@/components/lp/lp-faq";
import { LpCtaSection } from "@/components/lp/lp-cta-section";
import { LpSocialProofBar } from "@/components/lp/lp-social-proof-bar";
import { LpConversionWidgets } from "@/components/lp/lp-conversion-widgets";
import { LpHeroBlock } from "@/components/lp/lp-hero-block";
import { LpMidCta } from "@/components/lp/lp-mid-cta";
import { LpProblemSection } from "@/components/lp/lp-problem-section";
import { LpComparisonTable } from "@/components/lp/lp-comparison-table";
import { LpInternalLinks } from "@/components/lp/lp-internal-links";
import { LpOutcomeStats } from "@/components/lp/lp-outcome-stats";
import { LpPriceCompare } from "@/components/lp/lp-price-compare";
import { LpProviderCredential } from "@/components/lp/lp-provider-credential";
import { LpJourneyRoadmap } from "@/components/lp/lp-journey-roadmap";
import {
  DrugJsonLd,
  FAQPageJsonLd,
  MedicalWebPageJsonLd,
  BreadcrumbJsonLd,
  HowToJsonLd,
} from "@/components/seo/json-ld";

// ============================================================================
// AI-IMAGE PROMPT (hero background — optional enhancement)
// Aspect ratio: 16:9
// "Editorial photograph of a confident professional in their 40s holding a
//  sleek medication pen against a clean white kitchen counter, soft morning
//  window light, minimalist aesthetic, calm direct gaze, clinical white and
//  cool blue palette, Leica Q2 natural shot, no logos, no syringes visible."
// ============================================================================

export const metadata: Metadata = {
  // Keywords: semaglutide online, buy semaglutide, semaglutide weight loss, compounded semaglutide
  title: "Semaglutide Online from $179/mo | Nature's Journey",
  description:
    "Compounded semaglutide prescribed online by US-licensed providers. 15-20% avg weight loss*. 2-minute assessment. From $179/mo. Individual results vary.",
  openGraph: {
    title: "Compounded Semaglutide Online — Prescribed by Real Providers",
    description:
      "Compounded semaglutide from US-licensed pharmacies. 2-minute eligibility. From $179/mo. Individual results vary.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/semaglutide",
  },
};

const heroStats = [
  { value: "15-20%*", label: "Avg weight loss" },
  { value: "Weekly", label: "Single injection" },
  { value: "$179/mo", label: "Starting at" },
  { value: "18,000+", label: "Members" },
];

const outcomeStats = [
  {
    value: "15-20%",
    label: "Avg total body weight loss*",
    sublabel: "Clinical-trial range for semaglutide over 68 weeks.",
  },
  {
    value: "24 hrs",
    label: "Typical provider review",
    sublabel: "US-licensed providers review every assessment individually.",
  },
  {
    value: "48 hrs",
    label: "Typical shipping",
    sublabel: "Free, discreet, to all 50 states where legally available.",
  },
];

const lpProblemCards = [
  {
    icon: Scale,
    title: "Brand Semaglutide Costs $1,349/mo",
    description:
      "Retail cash-pay for Ozempic or Wegovy is out of reach for most patients. Insurance denies weight-loss indications more often than it approves them.",
  },
  {
    icon: Shield,
    title: "Sketchy Online 'Pharmacies' Aren't the Answer",
    description:
      "Unverified mail-order semaglutide without a real provider isn't safe — and it isn't legal in most states. The answer isn't cutting corners.",
  },
  {
    icon: Brain,
    title: "You Know It Works — Access Is the Gap",
    description:
      "Semaglutide is the most-studied GLP-1 in history. The problem isn't the molecule. The problem is that legitimate, affordable access has been nearly impossible.",
  },
] as const;

const differentCards = [
  {
    icon: Pill,
    title: "Same Active Ingredient",
    description:
      "Compounded semaglutide contains the same active ingredient prescribed in branded GLP-1s — semaglutide — prepared by a US-licensed compounding pharmacy under an individual prescription.",
  },
  {
    icon: Shield,
    title: "LegitScript-Certified Process",
    description:
      "Every prescription is issued by a US-licensed provider after medical review. Dispensed by a US state-licensed 503A/503B pharmacy. No gray market, no international shipping.",
  },
  {
    icon: Stethoscope,
    title: "Real Ongoing Care",
    description:
      "You're not buying a vial — you're joining a supervised treatment program with messaging access to your care team and dose-titration oversight by your provider.",
  },
];

const solutionCards = [
  {
    title: "GLP-1 Receptor Activation",
    description:
      "Semaglutide mimics the natural GLP-1 hormone. It slows gastric emptying, reduces appetite signals in the brain, and increases satiety — so calorie restriction stops feeling like a fight.",
  },
  {
    title: "Insulin & Blood-Sugar Support",
    description:
      "By improving how your body uses insulin, semaglutide reduces glucose spikes and may support metabolic health beyond the scale — a reason it was first studied for type 2 diabetes.",
  },
  {
    title: "Durability Built Into Dosing",
    description:
      "Your provider titrates slowly from 0.25mg up to 2.4mg over months, so your body adapts and side effects stay manageable. Once you reach goal, a maintenance plan is tailored to you.",
  },
];

// 6 milestones — dose titration arc
const journeyMilestones = [
  {
    month: "Day 1",
    label: "Eligibility in 2 minutes",
    description:
      "Online medical assessment reviewed by a US-licensed provider — typically within 24 hours.",
  },
  {
    month: "Week 1",
    label: "0.25 mg start dose ships",
    description:
      "Compounded semaglutide delivered discreetly. Video onboarding with your care team.",
  },
  {
    month: "Month 1",
    label: "Step up to 0.5 mg",
    description:
      "Appetite signals soften. Food noise quiets. Most members lose first pounds this month.",
  },
  {
    month: "Month 3",
    label: "Titrate toward 1.0–1.7 mg",
    description:
      "First 10–20 lbs for most members. Provider reviews side effects and adjusts pace.",
  },
  {
    month: "Month 6",
    label: "Therapeutic dose (up to 2.4 mg)",
    description:
      "Plateau-breaking phase. Many members report stable energy, meaningful body-composition changes.",
  },
  {
    month: "Month 12+",
    label: "Maintenance plan",
    description:
      "Your provider tailors a long-term dose for sustainability — not just more loss.",
  },
];

const provider = {
  name: "Dr. Sarah Thompson, MD",
  credentials: "Board-certified, Endocrinology · Obesity Medicine fellow · 16 years practice",
  bio: "Semaglutide is the most-studied weight-management medication of our lifetime. When a patient is an appropriate candidate, the clinical data simply speaks — but it only works well when it's paired with real provider oversight, honest titration, and ongoing support. That's the whole point of this program.",
  imagePrompt:
    "Professional editorial headshot of a Caucasian female physician in her late-40s, shoulder-length auburn hair, wearing a crisp white lab coat over a soft blue blouse, stethoscope around neck, warm confident smile, softbox lighting, clean clinical background slightly blurred, direct trustworthy eye contact, Hasselblad quality, 1:1 aspect ratio.",
};

const priceColumns = [
  {
    name: "Brand-Name Wegovy / Ozempic",
    price: "$1,349/mo",
    priceSubtext: "retail cash-pay*",
    features: [
      { label: "FDA-approved", included: true },
      { label: "Insurance coverage often denied for weight loss", included: false },
      { label: "Nationwide shortages still common in 2026", included: false },
      { label: "Ongoing provider support built-in", included: false },
      { label: "Free 2-day shipping", included: false },
      { label: "30-day money-back guarantee", included: false },
    ],
  },
  {
    name: "Nature's Journey Compounded Semaglutide",
    price: "$179/mo",
    priceSubtext: "no insurance needed",
    highlight: true,
    features: [
      { label: "Same active ingredient (semaglutide)", included: true },
      { label: "US-licensed pharmacy · individual prescription", included: true },
      { label: "In-stock and shipping in 48 hours", included: true },
      { label: "Ongoing provider + care-team messaging", included: true },
      { label: "Free 2-day shipping to all 50 states (where legally available)", included: true },
      { label: "30-day money-back guarantee", included: true },
    ],
    ctaLabel: "See If I Qualify →",
    ctaHref: "/qualify",
  },
];

// Feature comparison across plan tiers — uses LpComparisonTable for program feature clarity
const comparisonRows = [
  { feature: "Monthly cost", us: "From $179", them: "$1,349+" },
  { feature: "Insurance required", us: "No", them: "Usually yes" },
  { feature: "Provider included", us: true, them: false },
  { feature: "Dose titration managed", us: true, them: false },
  { feature: "Meal plans included", us: true, them: false },
  { feature: "Free 2-day shipping", us: true, them: false },
  { feature: "30-day guarantee", us: true, them: false },
] as const;

const testimonials = [
  {
    name: "Marcus T.",
    age: 48,
    location: "Atlanta",
    lbs: 42,
    months: 6,
    quote:
      "Gradual titration meant almost no side effects. Down 42 lbs and my provider actually adjusts my plan every month.",
  },
  {
    name: "Angela R.",
    age: 35,
    location: "Denver",
    lbs: 31,
    months: 5,
    quote:
      "I tried brand Wegovy through insurance for six months — denied twice. Four days after signing up here I had medication.",
  },
  {
    name: "Chris P.",
    age: 52,
    location: "Portland",
    lbs: 37,
    months: 6,
    quote:
      "Semaglutide changed my relationship with food. I'm not constantly thinking about eating — the food noise is gone.",
  },
  {
    name: "Diana W.",
    age: 44,
    location: "Nashville",
    lbs: 29,
    months: 4,
    quote:
      "I like that a real doctor looked at my file. It didn't feel transactional — it felt like care.",
  },
];

// 10 FAQs — AEO-optimized for search queries
const faqs = [
  {
    question: "Is online-prescribed semaglutide legitimate?",
    answer:
      "Yes, when prescribed properly. Our program uses US-licensed providers who issue individual prescriptions reviewed by a US state-licensed 503A/503B compounding pharmacy. That is legal and regulated in the states where we operate. Unverified international mail-order semaglutide is not the same thing and should be avoided.",
  },
  {
    question: "How much weight can I lose with semaglutide?",
    answer:
      "Clinical trials published for semaglutide show average weight loss of 15-20% of body weight over 68 weeks. Individual results vary based on starting weight, adherence, diet, and other factors. Your provider will set realistic expectations based on your individual health profile.",
  },
  {
    question: "Is compounded semaglutide the same as Ozempic or Wegovy?",
    answer:
      "Compounded semaglutide contains the same active ingredient (semaglutide) prescribed in Ozempic and Wegovy. It is prepared by a US state-licensed compounding pharmacy under an individual prescription. Compounded medications are not FDA-approved brand-name drugs. Your provider determines if it is appropriate for you.",
  },
  {
    question: "What are the common side effects of semaglutide?",
    answer:
      "The most common side effects are mild gastrointestinal issues — nausea, constipation, reflux — usually during dose titration. Your provider starts you low and steps up slowly specifically to minimize them. Persistent or serious side effects are reviewed by your care team and dosing is adjusted.",
  },
  {
    question: "How is semaglutide administered?",
    answer:
      "Semaglutide is a once-weekly subcutaneous injection (self-administered with a small needle). We provide detailed instructions and your provider is available for questions. Most members find it quick and straightforward after the first one or two doses.",
  },
  {
    question: "How long until I see results?",
    answer:
      "Most members notice reduced appetite and 'food noise' within 1-2 weeks. Visible weight loss typically begins within 4-6 weeks. Meaningful progress usually shows by month 3, and full therapeutic effect builds as your provider titrates you up toward 2.4mg. Individual results vary.",
  },
  {
    question: "How much does semaglutide cost with Nature's Journey?",
    answer:
      "From $179/month. That includes the compounded semaglutide, your provider's ongoing oversight, care-team messaging, and free 2-day shipping. Compare that to roughly $1,349/mo cash-pay for brand-name GLP-1. No insurance required. There is a 30-day money-back guarantee on your first month.",
  },
  {
    question: "Do I need insurance to get compounded semaglutide online?",
    answer:
      "No. Our $179/mo membership is all-inclusive — provider evaluation, medication if prescribed, meal plans, and ongoing support. No insurance. No prior authorizations. No pharmacy runs.",
  },
  {
    question: "How long do I need to take semaglutide?",
    answer:
      "Treatment duration varies. Many members see significant results within 3-6 months and continue on a maintenance dose thereafter. Your provider will work with you on a long-term plan that may include maintenance dosing or a structured taper. GLP-1 is typically a long-term treatment, not a short-course diet.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. You can cancel anytime with no long-term commitment. If a licensed provider determines you are not eligible, you are not charged for medication. The 2-minute eligibility assessment is free and non-binding.",
  },
];

const internalLinks = [
  {
    title: "Tirzepatide (Dual-Action GLP-1)",
    description: "The dual-receptor GLP-1/GIP option — for patients plateauing on single-action treatment.",
    href: "/lp/tirzepatide",
  },
  {
    title: "Ozempic Alternative",
    description: "Same active ingredient as Ozempic, prepared by a US-licensed compounding pharmacy.",
    href: "/lp/ozempic-alternative",
  },
  {
    title: "General GLP-1 Program",
    description: "Not sure which molecule is right? Start with our top-of-funnel GLP-1 overview.",
    href: "/lp/glp1",
  },
  {
    title: "See Pricing Plans",
    description: "Essential, Premium, Complete — compare what's included at each tier.",
    href: "/pricing",
  },
  {
    title: "Check Eligibility",
    description: "2-minute assessment. Free. Provider review within 1 business day.",
    href: "/qualify",
  },
  {
    title: "Affordable Weight Loss Plans",
    description: "Compare our plans and find the right option for your budget.",
    href: "/lp/affordable",
  },
] as const;

export default function SemaglutideLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="Clinically Proven GLP-1"
        badgeIcon={Pill}
        badgeIconColor="text-cyan-600"
      />

      {/* ======================================================================
          HERO
          AI-IMAGE PROMPT (hero right-side portrait — optional enhancement)
          Aspect ratio: 4:5
          "Editorial photograph of a confident woman in her late-30s, shoulder-
           length dark hair, cream cashmere sweater, holding a coffee mug,
           seated at a sunlit kitchen table, natural window light, clean
           minimalist aesthetic, genuine relaxed expression, shallow depth of
           field, editorial style. No logos, no fitness branding."
          ====================================================================== */}
      <LpHeroBlock
        badge="Accepting new patients — same-day evaluation"
        headline="Start compounded semaglutide by May."
        headlineAccent="Same molecule as Ozempic and Wegovy."
        subtitle="Prescribed by US-licensed providers, dispensed by a US-licensed compounding pharmacy — may help you lose up to 8 lbs in your first month.* From $179/mo. Individual results vary."
        stats={heroStats}
        ctaLocation="semaglutide-hero"
      />

      <LpSocialProofBar />

      {/* Real program-outcome numbers band */}
      <LpOutcomeStats
        stats={outcomeStats}
        heading="What members actually see"
        subheading="Program outcomes, not marketing numbers."
      />

      {/* Problem Section */}
      <LpProblemSection
        eyebrow="THE ACCESS GAP"
        heading="You know it works. It's getting it that's the problem."
        cards={lpProblemCards}
        transitionText="Our program closes the gap between the medicine and real patients — legitimately."
        ctaLocation="problem-semaglutide"
      />

      {/* Why Our Semaglutide Is Different */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            Why our compounded semaglutide is different
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Legitimate, licensed, supervised. Three reasons members trust this program.
          </p>
          <div className="grid gap-5 sm:grid-cols-3">
            {differentCards.map((card) => (
              <Card key={card.title}>
                <CardContent className="p-5">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl mb-3"
                    style={{ backgroundColor: "var(--lp-icon-bg)" }}
                  >
                    <card.icon className="h-5 w-5" style={{ color: "var(--lp-icon)" }} />
                  </div>
                  <h3 className="text-sm font-bold text-lp-heading">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-xs text-lp-body leading-relaxed">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How Semaglutide Works */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            How semaglutide works
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            GLP-1 receptor activation — the mechanism backed by the most clinical data of any weight-management medication.
          </p>
          <div className="grid gap-5 sm:grid-cols-3">
            {solutionCards.map((card) => (
              <div
                key={card.title}
                className="rounded-xl border bg-white p-5"
                style={{ borderColor: "var(--lp-card-border)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-full"
                    style={{ backgroundColor: "var(--lp-icon-bg)" }}
                  >
                    <Check className="h-3.5 w-3.5" style={{ color: "var(--lp-icon)" }} />
                  </div>
                  <h3 className="text-sm font-bold text-lp-heading">
                    {card.title}
                  </h3>
                </div>
                <p className="text-xs text-lp-body leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mid CTA */}
      <LpMidCta
        headline="See if compounded semaglutide is right for you"
        subtext="Free 2-minute assessment. Licensed providers. No commitment."
        location="mid-semaglutide"
      />

      {/* Journey roadmap — dose titration */}
      <LpJourneyRoadmap
        milestones={journeyMilestones}
        heading="What to expect, month by month"
        subheading="The realistic titration arc your provider will build with you — from 0.25 mg start dose toward the therapeutic 2.4 mg range."
      />

      {/* Price comparison */}
      <LpPriceCompare
        columns={priceColumns}
        heading="Same active ingredient. Plans from $179/mo."
        subheading="We think access to GLP-1 care shouldn't depend on your insurer."
      />

      {/* Feature comparison across plans */}
      <LpComparisonTable
        heading="Brand-Name vs. Nature's Journey"
        themLabel="Brand Ozempic/Wegovy"
        rows={comparisonRows}
      />

      {/* Provider authority anchor */}
      <LpProviderCredential
        provider={provider}
        heading="Every plan is overseen by a real clinician"
      />

      {/* Testimonials */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-8">
            Real members, real results on semaglutide
          </h2>
          {/* AI-IMAGE PROMPT (optional — testimonial avatars)
              Aspect ratio: 1:1
              "Four photorealistic headshot portraits, diverse men and women ages
               35-55, soft natural window light, genuine expressions, neutral
               backgrounds in cool clinical whites and light blues, editorial
               photojournalism style, candid not posed, Sony A7R 85mm f/1.8.
               No logos, no medical branding."
          */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <CardContent className="p-5">
                  <div className="flex gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 text-gold fill-gold"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-lp-body italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-lp-heading">
                        {t.name}, {t.age}
                      </p>
                      <p className="text-[10px] text-lp-body-muted">
                        {t.location}
                      </p>
                    </div>
                    <Badge
                      className="text-[10px]"
                      style={{
                        backgroundColor: "var(--lp-badge-bg)",
                        color: "var(--lp-badge-text)",
                      }}
                    >
                      -{t.lbs} lbs / {t.months}mo
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-center text-[10px] text-lp-body-muted">
            Verified members. Individual results vary. Compounded medications are not FDA-approved.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <LpFaq
        faqs={faqs}
        heading="Semaglutide online: your questions"
        subheading="Everything you need to know about compounded semaglutide and our program."
      />

      {/* Internal Links */}
      <LpInternalLinks heading="Keep exploring" links={internalLinks} />

      {/* Final CTA */}
      <LpCtaSection headline="Start your semaglutide journey today" />

      <LpFooter />

      {/* JSON-LD */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Semaglutide", href: "/lp/semaglutide" },
        ]}
      />
      <HowToJsonLd
        name="How to Get Semaglutide Online"
        description="Three simple steps to get compounded semaglutide prescribed online through Nature's Journey."
        steps={[
          { title: "Complete a Free Assessment", description: "Answer a 2-minute health questionnaire. No payment required." },
          { title: "Provider Evaluation", description: "A licensed provider reviews your profile within 1 business day." },
          { title: "Medication Delivered", description: "If prescribed, semaglutide ships to your door with free 2-day delivery." },
        ]}
      />
      <DrugJsonLd
        name="Compounded Semaglutide"
        alternateName="GLP-1 Receptor Agonist"
        description="Compounded semaglutide for provider-guided weight management, prescribed online by US-licensed providers."
        url="/lp/semaglutide"
        administrationRoute="Subcutaneous injection"
      />
      <MedicalWebPageJsonLd
        name="Compounded Semaglutide Online"
        description="Compounded semaglutide prescribed online by US-licensed providers. From $179/mo. Individual results vary."
        url="/lp/semaglutide"
      />
      <FAQPageJsonLd faqs={faqs} />
      <LpConversionWidgets />
    </div>
  );
}
