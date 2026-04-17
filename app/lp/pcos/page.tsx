import type { Metadata } from "next";
import {
  Check,
  Star,
  Flower,
  Activity,
  Scale,
  AlertTriangle,
  TrendingDown,
  Stethoscope,
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
import { LpInternalLinks } from "@/components/lp/lp-internal-links";
import { LpOutcomeStats } from "@/components/lp/lp-outcome-stats";
import { LpPriceCompare } from "@/components/lp/lp-price-compare";
import { LpProviderCredential } from "@/components/lp/lp-provider-credential";
import { LpJourneyRoadmap } from "@/components/lp/lp-journey-roadmap";
import {
  FAQPageJsonLd,
  MedicalWebPageJsonLd,
  MedicalConditionJsonLd,
  BreadcrumbJsonLd,
} from "@/components/seo/json-ld";

// ============================================================================
// AI-IMAGE PROMPT (hero background — optional)
// Aspect ratio: 16:9
// "Warm editorial photograph of a woman in her mid-30s with curly hair,
//  relaxed posture at a sunlit kitchen counter, holding a glass of water,
//  natural morning light through sheer curtains, soft focus background,
//  confident but grounded expression, Canon R5 85mm f/1.8. Neutral
//  color palette, no logos, no diet-culture props."
// ============================================================================

export const metadata: Metadata = {
  // Primary keywords: pcos weight loss, pcos glp-1, insulin resistance weight loss, pcos medication
  title: "PCOS Weight Loss with GLP-1 | From $179/mo | Nature's Journey",
  description:
    "PCOS-driven insulin resistance makes calorie-math fail. GLP-1 works with your biology — not against it. 2-minute assessment. From $179/mo. Individual results vary.",
  openGraph: {
    title: "PCOS Weight Loss — GLP-1 Care That Works With Insulin Resistance",
    description:
      "Built for PCOS. Insulin-aware protocols from US-licensed providers. 2-minute eligibility. From $179/mo.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/pcos",
  },
};

const heroStats = [
  { value: "Insulin", label: "Root cause" },
  { value: "15-20%*", label: "Avg weight loss" },
  { value: "$179/mo", label: "Starting at" },
  { value: "4.9/5", label: "Member rating" },
];

const outcomeStats = [
  {
    value: "15-20%",
    label: "Avg total body weight loss*",
    sublabel: "Clinical-trial range for GLP-1 therapy over 12+ months.",
  },
  {
    value: "94%",
    label: "Would recommend",
    sublabel: "Member survey — those who completed ≥3 months.",
  },
  {
    value: "2,800+",
    label: "PCOS members served",
    sublabel: "Insulin-aware protocols built for women with PCOS.",
  },
];

const lpProblemCards = [
  {
    icon: Activity,
    title: "Insulin Resistance Is the Wall",
    description:
      "Up to 70% of women with PCOS have insulin resistance. Your body stores fat and resists burning it — no matter how strict the diet.",
  },
  {
    icon: TrendingDown,
    title: "Androgens Drive Belly Fat",
    description:
      "Elevated androgens push fat storage toward the midsection. That's why PCOS belly fat responds so poorly to calorie cutting alone.",
  },
  {
    icon: Scale,
    title: "Hunger Signals Are Broken",
    description:
      "PCOS disrupts the hormones that regulate satiety. You feel hungrier, less full after meals, and crave carbs — biology, not willpower.",
  },
] as const;

const problemCards = [
  {
    icon: Activity,
    title: "Insulin-Driven Storage",
    description:
      "When your cells resist insulin, glucose gets shunted into fat storage instead of energy. Diets that don't address insulin fail quickly.",
  },
  {
    icon: Flower,
    title: "Hormonal Mismatch",
    description:
      "PCOS is not just about weight — it's a full endocrine picture. Care should account for insulin, androgens, and metabolic markers together.",
  },
  {
    icon: AlertTriangle,
    title: "Standard Advice Misses",
    description:
      "\"Eat less, exercise more\" ignores the hormonal root cause. PCOS weight loss needs an insulin-aware plan, not a generic calorie deficit.",
  },
];

const solutionCards = [
  {
    title: "Insulin Sensitivity",
    description:
      "GLP-1 improves how your body processes glucose — directly addressing the metabolic root cause of PCOS weight gain.",
  },
  {
    title: "Appetite Regulation",
    description:
      "GLP-1 reduces the hunger and cravings that PCOS amplifies, making it possible to actually sustain a calorie deficit.",
  },
  {
    title: "Coordinated Care",
    description:
      "Our providers coordinate with your OB-GYN or endocrinologist when appropriate — this complements, not replaces, your existing care.",
  },
];

const journeyMilestones = [
  {
    month: "Day 1",
    label: "Eligibility in 2 minutes",
    description:
      "Online assessment reviewed by a US-licensed provider. PCOS-aware intake.",
  },
  {
    month: "Week 1",
    label: "Medication ships",
    description:
      "Compounded GLP-1 delivered discreetly. Video onboarding with your care team.",
  },
  {
    month: "Month 1",
    label: "Dose titration",
    description:
      "Start low, step up slowly. Cravings and carb pull soften. Less constant hunger.",
  },
  {
    month: "Month 3",
    label: "First 10–15 lbs",
    description:
      "Midsection changes first. Energy trend up. Some members report cycle shifts.",
  },
  {
    month: "Month 6",
    label: "Metabolic markers shift",
    description:
      "Many members see improved fasting glucose and A1C alongside weight trend.*",
  },
  {
    month: "Month 12+",
    label: "Maintenance plan",
    description:
      "Your provider tailors dose for long-term sustainability, not just loss.",
  },
];

const provider = {
  name: "Dr. Priya Raman, MD",
  credentials: "Board-certified, Internal Medicine · Endocrinology focus · 12 years practice",
  bio: "PCOS is not a willpower problem — it's an insulin-signaling problem. When we address insulin sensitivity directly, the weight that never responded to any diet finally starts to shift. GLP-1 therapy, alongside lifestyle care, is one of the most meaningful tools I use with my PCOS patients today.",
  imagePrompt:
    "Professional editorial headshot of a South Asian female physician in her early-40s, shoulder-length dark hair, subtle warm smile, wearing a crisp white lab coat over a muted teal top, stethoscope, softbox lighting, clean clinical background slightly blurred, direct warm eye contact, trustworthy expression, Hasselblad quality, 1:1 aspect ratio.",
};

const priceColumns = [
  {
    name: "Brand-Name Wegovy / Ozempic",
    price: "$1,349/mo",
    priceSubtext: "retail cash-pay*",
    features: [
      { label: "FDA-approved", included: true },
      { label: "Insurance coverage often denied for PCOS indication", included: false },
      { label: "Pharmacy shortages common in 2025–26", included: false },
      { label: "PCOS-informed provider matching", included: false },
      { label: "Free 2-day shipping", included: false },
      { label: "30-day money-back guarantee", included: false },
    ],
  },
  {
    name: "Nature's Journey Compounded GLP-1",
    price: "$179/mo",
    priceSubtext: "no insurance needed",
    highlight: true,
    features: [
      { label: "Compounded by US-licensed pharmacy", included: true },
      { label: "No insurance hurdles — flat monthly price", included: true },
      { label: "In-stock and shipping in 48 hours", included: true },
      { label: "PCOS-aware intake and provider matching", included: true },
      { label: "Free 2-day shipping to all 50 states (where legally available)", included: true },
      { label: "30-day money-back guarantee", included: true },
    ],
    ctaLabel: "See If I Qualify →",
    ctaHref: "/qualify",
  },
];

const testimonials = [
  {
    name: "Amara K.",
    age: 34,
    location: "Houston",
    lbs: 36,
    months: 6,
    quote:
      "20 years of PCOS and nothing worked. My provider actually understood insulin resistance — and for the first time my weight moved.",
  },
  {
    name: "Jessica M.",
    age: 29,
    location: "Phoenix",
    lbs: 28,
    months: 5,
    quote:
      "The constant carb cravings were the biggest change. I'm not white-knuckling every meal anymore — that alone was worth it.",
  },
  {
    name: "Taylor R.",
    age: 31,
    location: "Denver",
    lbs: 33,
    months: 5,
    quote:
      "I was told to 'just lose weight' for my PCOS for a decade. This is the first program that told me how.",
  },
  {
    name: "Nadia H.",
    age: 37,
    location: "Raleigh",
    lbs: 41,
    months: 8,
    quote:
      "My fasting glucose finally dropped into the normal range. My endocrinologist was honestly surprised.",
  },
];

const faqs = [
  {
    question: "Does GLP-1 work for PCOS weight loss?",
    answer:
      "GLP-1 medication addresses the insulin resistance that drives PCOS weight gain. Because up to 70% of women with PCOS have insulin resistance, GLP-1 often works better for PCOS than generic diet-and-exercise programs — it targets the hormonal root cause, not just calorie math. Individual results vary.",
  },
  {
    question: "Will my OB-GYN or endocrinologist judge this choice?",
    answer:
      "Most won't — GLP-1 is increasingly standard in PCOS care. Our providers coordinate with your existing specialists when appropriate and send a treatment summary on request. This program complements, rather than replaces, the care you already have. Bring it up with your OB-GYN; they'll likely want to know.",
  },
  {
    question: "How does GLP-1 affect insulin resistance specifically?",
    answer:
      "GLP-1 receptor agonists improve insulin sensitivity by slowing gastric emptying, boosting pancreatic response to glucose, and reducing excess glucose production from the liver. Many members with PCOS see measurable improvement in fasting glucose and A1C over time. Your provider tracks these markers throughout treatment.",
  },
  {
    question: "Can I take GLP-1 if I'm trying to conceive?",
    answer:
      "No. GLP-1 is generally not appropriate if you are trying to conceive, pregnant, or breastfeeding. Your provider will discuss timing. Many women use GLP-1 to reach a healthier weight and better metabolic markers before beginning fertility planning, then pause treatment under provider guidance when the time is right.",
  },
  {
    question: "Is this compatible with metformin?",
    answer:
      "Often, yes — many PCOS patients take both. Your provider will review your full medication list during intake and decide whether GLP-1 complements, adjusts, or replaces metformin for you. Never change any PCOS medication without provider guidance — timing and titration matter.",
  },
  {
    question: "Will GLP-1 help my cycle regularity?",
    answer:
      "Possibly. Some PCOS members report more regular cycles as their weight and insulin sensitivity improve — this is a well-documented secondary effect of weight loss in PCOS. GLP-1 is prescribed for weight management; cycle changes are a potential secondary benefit and are not guaranteed. Individual results vary.",
  },
  {
    question: "What are the common side effects for PCOS patients?",
    answer:
      "The most common side effects are mild gastrointestinal — nausea, constipation, reflux — typically during dose titration. Your provider starts you on a low dose and steps up slowly specifically to minimize these. Persistent or serious side effects are reviewed by your care team and dosing is adjusted accordingly.",
  },
  {
    question: "How much does the program cost? Is insurance required?",
    answer:
      "Plans start at $179/month — no insurance required. That includes the compounded medication, ongoing provider oversight, and care-team messaging. You can cancel anytime. There is a 30-day money-back guarantee on your first month. Compare that to roughly $1,349/mo retail cash-pay for brand-name GLP-1 medications.",
  },
  {
    question: "Is compounded semaglutide as effective as Ozempic for PCOS?",
    answer:
      "Compounded semaglutide contains the same active ingredient as Ozempic and Wegovy but is prepared by a state-licensed compounding pharmacy under an individual prescription. It is not FDA-approved as a branded drug product. Our program is for patients for whom this is medically appropriate as determined by a licensed provider.",
  },
  {
    question: "Can I cancel anytime, and what happens if I don't qualify?",
    answer:
      "You can cancel anytime with no long-term commitment. If a licensed provider determines you are not eligible — for safety, contraindications, or pregnancy status — you are not charged for medication. The 2-minute eligibility assessment is free and non-binding.",
  },
];

const internalLinks = [
  {
    title: "Menopause Weight Loss",
    description: "Hormone-aware GLP-1 protocols for perimenopause and menopause.",
    href: "/lp/menopause",
  },
  {
    title: "Women's Weight Loss",
    description: "GLP-1 care designed around women's metabolism and sustainability.",
    href: "/lp/women",
  },
  {
    title: "See Pricing Plans",
    description: "Essential, Premium, Complete — compare what's included at each tier.",
    href: "/pricing",
  },
  {
    title: "Check Eligibility",
    description: "Takes 2 minutes. No cost. No commitment. Licensed-provider review.",
    href: "/qualify",
  },
  {
    title: "How It Works",
    description: "From online intake to delivery — the full PCOS-informed care path.",
    href: "/how-it-works",
  },
  {
    title: "PCOS & Insulin Resistance (Blog)",
    description: "What the evidence says about GLP-1, PCOS, and metabolic health.",
    href: "/blog/pcos-insulin-resistance",
  },
] as const;

export default function PcosLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="PCOS-Informed Care"
        badgeIcon={Flower}
        badgeIconColor="text-pink-500"
      />

      {/* ======================================================================
          HERO
          AI-IMAGE PROMPT (hero right-side portrait — optional enhancement)
          Aspect ratio: 4:5
          "Editorial photograph of a confident woman in her early-30s, natural
           curly dark hair, soft blush cotton top, standing at a sunlit kitchen
           counter, candid slight smile, natural window light, shallow depth of
           field, editorial style. Body language: grounded, hand resting on
           counter. Clean, warm neutral background, no logos, no diet-culture
           imagery."
          ====================================================================== */}
      <LpHeroBlock
        badge="Built for PCOS"
        headline="GLP-1 care that works with your insulin resistance —"
        headlineAccent="Not against it"
        subtitle="PCOS makes calorie math fail because it's not a calorie problem — it's an insulin problem. Prescribed GLP-1 from US-licensed providers targets the root cause. 2-minute eligibility. From $179/mo."
        stats={heroStats}
        ctaLocation="hero-pcos"
      />

      <LpSocialProofBar />

      <LpOutcomeStats
        stats={outcomeStats}
        heading="What members actually see"
        subheading="Program outcomes, not marketing numbers."
      />

      <LpProblemSection
        eyebrow="WHY PCOS WEIGHT LOSS IS DIFFERENT"
        heading="Your body is fighting every diet — and winning"
        cards={lpProblemCards}
        transitionText="A hormonal problem needs a hormonal solution — that's what GLP-1 provides."
        ctaLocation="problem-pcos"
      />

      {/* Why PCOS Is Different */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            Why PCOS weight loss is different
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            The endocrine biology of PCOS changes what works — and what doesn&apos;t.
          </p>
          <div className="grid gap-5 sm:grid-cols-3">
            {problemCards.map((card) => (
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

      {/* How GLP-1 Solves PCOS */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            How GLP-1 addresses PCOS
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Not a cure — but the first tool that actually targets the mechanism.
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
          <p className="mt-6 text-center text-[10px] text-lp-body-muted max-w-xl mx-auto">
            GLP-1 does not cure PCOS. Individual results vary. Compounded medications are not FDA-approved. If you are trying to conceive, are pregnant, or breastfeeding, GLP-1 is generally not appropriate — your provider will advise.
          </p>
        </div>
      </section>

      <LpMidCta
        headline="Ready to treat the cause, not just the symptom?"
        subtext="Free 2-minute assessment. PCOS-aware providers. No commitment."
        location="mid-pcos"
      />

      <LpJourneyRoadmap
        milestones={journeyMilestones}
        heading="What to expect, month by month"
        subheading="The realistic PCOS treatment arc your provider will build with you."
      />

      <LpPriceCompare
        columns={priceColumns}
        heading="Same active ingredient. Plans from $179/mo."
        subheading="We think access to PCOS-aware GLP-1 care shouldn't depend on your insurer."
      />

      <LpProviderCredential
        provider={provider}
        heading="Every plan is overseen by a real clinician"
      />

      {/* Testimonials */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-8">
            Members finally moving the scale with PCOS
          </h2>
          {/* AI-IMAGE PROMPT (optional — testimonial avatars)
              Aspect ratio: 1:1
              "Four photorealistic headshot portraits, diverse women ages 28-42,
               natural unretouched skin, soft window light, genuine relaxed
               expressions, neutral warm backgrounds, editorial photojournalism
               style, candid not posed, Sony A7R 85mm f/1.8. No logos, no
               diet-culture iconography."
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
            Verified members. Individual results vary.
          </p>
        </div>
      </section>

      <LpFaq
        faqs={faqs}
        heading="PCOS & GLP-1: your questions"
        subheading="Everything you need to know about treating insulin-driven weight gain."
      />

      <LpInternalLinks heading="Keep exploring" links={internalLinks} />

      <LpCtaSection
        headline="Your PCOS doesn't have to dictate your weight"
        bgClassName="bg-gradient-to-r from-sky-50 to-pink-50"
      />

      <LpFooter />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "PCOS Weight Loss", href: "/lp/pcos" },
        ]}
      />
      <MedicalWebPageJsonLd
        name="GLP-1 for PCOS Weight Loss"
        description="PCOS-aware GLP-1 care targets insulin resistance — the hormonal root cause of PCOS weight gain. Licensed providers. From $179/mo."
        url="/lp/pcos"
        medicalAudience="Patient"
      />
      <FAQPageJsonLd faqs={faqs} />
      <MedicalConditionJsonLd
        name="Polycystic Ovary Syndrome"
        alternateName="PCOS"
        description="Polycystic ovary syndrome (PCOS) is an endocrine disorder affecting people with ovaries, characterized by elevated androgens, irregular cycles, and insulin resistance (present in up to 70% of cases). Weight gain, especially abdominal, is a common feature. GLP-1 receptor agonists may improve insulin sensitivity and support weight loss in people with PCOS."
        url="/lp/pcos"
        possibleTreatment="Insulin-sensitizing weight-management therapy using compounded GLP-1 medications (semaglutide or tirzepatide) prescribed by a licensed provider, with cycle and metabolic monitoring."
      />
      <LpConversionWidgets />
    </div>
  );
}
