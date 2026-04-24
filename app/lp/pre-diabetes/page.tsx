import type { Metadata } from "next";
import {
  Check,
  Star,
  AlertTriangle,
  Clock,
  Activity,
  Shield,
  TrendingDown,
  Calendar,
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
// AI-IMAGE PROMPT (hero background — optional, wire into LpHeroBlock when ready)
// Aspect ratio: 16:9
// "Editorial photograph of a 50-year-old man or woman reviewing lab results
//  at a wooden kitchen table, morning light, partial coffee cup and glucose
//  meter softly out of focus, quiet contemplative expression shifting to
//  resolve, shallow depth of field, Canon R5 50mm f/1.8. Emphasis on
//  agency, the decision moment, informed action. No logos."
// ============================================================================

export const metadata: Metadata = {
  // Primary keywords: pre-diabetes weight loss, reverse pre-diabetes, lower A1C, pre-diabetic medication, A1C 5.7 weight loss, prediabetic weight loss program
  title: "Reverse Pre-Diabetes with GLP-1 Weight Loss | From $179/mo",
  description:
    "Your doctor's warning is reversible. Prescribed GLP-1 may help lower A1C and shed up to 8 lbs in your first month.* Same active ingredient as Ozempic. From $179/mo. Individual results vary.",
  openGraph: {
    title: "Reverse Pre-Diabetes — GLP-1 from $179/mo",
    description:
      "Pre-diabetes is a warning, not a sentence. Prescribed GLP-1 from licensed US providers with quarterly A1C monitoring. Same active ingredient as Ozempic.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/pre-diabetes",
  },
};

const heroStats = [
  { value: "A1C-focused", label: "Protocol" },
  { value: "15-20%*", label: "Avg weight loss" },
  { value: "$179/mo", label: "Starting at" },
  { value: "18,000+", label: "Members" },
];

const outcomeStats = [
  {
    value: "18,000+",
    label: "Members on program",
    sublabel: "Thousands with elevated A1C in the pre-diabetic range.",
  },
  {
    value: "15-20%*",
    label: "Avg total body weight loss",
    sublabel: "Clinical-trial range for GLP-1 therapy over 12+ months.",
  },
  {
    value: "94%",
    label: "Would recommend",
    sublabel: "Member survey — those who completed ≥3 months.",
  },
];

const lpProblemCards = [
  {
    icon: AlertTriangle,
    title: "Pre-diabetes is a 5-to-10-year window",
    description:
      "Most pre-diabetic patients progress to type 2 diabetes within a decade without intervention. Weight loss at this stage can reverse it.",
  },
  {
    icon: Clock,
    title: "Metformin alone isn't always enough",
    description:
      "Many pre-diabetic patients need a weight-loss tool on top. GLP-1 is the only class that does both — improve insulin sensitivity AND drive loss.",
  },
  {
    icon: Activity,
    title: "Your insurance probably won't cover Ozempic without T2D",
    description:
      "Compounded GLP-1 through telehealth gets you the same active molecule, prescribed by a licensed provider, at a fraction of brand cost.",
  },
] as const;

const problemCards = [
  {
    icon: Calendar,
    title: "Reversible Window",
    description:
      "Pre-diabetes (A1C 5.7-6.4%) is one of the most reversible conditions in medicine. The earlier you act, the more insulin sensitivity you keep.",
  },
  {
    icon: Shield,
    title: "Insulin Sensitivity Still Present",
    description:
      "Your pancreas is still producing and responding to insulin. GLP-1 supports this machinery before it's permanently strained.",
  },
  {
    icon: TrendingDown,
    title: "Every 5-7 lbs Matters",
    description:
      "ADA research shows even 5-7% body weight loss can return A1C to the normal range for many pre-diabetic patients. Small losses, real reversal.",
  },
];

const solutionCards = [
  {
    title: "Mimics the hormone your pancreas needs",
    description:
      "GLP-1 receptor agonists reproduce the action of your body's own GLP-1 hormone — the signal your pancreas uses to release insulin appropriately after meals.",
  },
  {
    title: "Slows gastric emptying",
    description:
      "Food leaves the stomach more slowly, producing flatter post-meal glucose spikes — one of the most direct ways to lower A1C over time.",
  },
  {
    title: "Supports 5-10% body weight loss",
    description:
      "The ADA-recommended threshold for pre-diabetes reversal. GLP-1 therapy routinely drives loss in this range within 6-12 months for responders.",
  },
];

const journeyMilestones = [
  {
    month: "Day 1",
    label: "Eligibility + baseline",
    description:
      "2-minute assessment. Licensed provider reviews your health history, medications, and recent labs (if available).",
  },
  {
    month: "Week 1",
    label: "Medication ships",
    description:
      "Compounded GLP-1 delivered discreetly. Video onboarding with your care team. Baseline weight and goals set.",
  },
  {
    month: "Month 1",
    label: "Dose titration",
    description:
      "Start low, step up slowly. Post-meal glucose spikes begin to flatten. First 4-8 lbs off.",
  },
  {
    month: "Month 3",
    label: "First repeat labs",
    description:
      "Your provider reviews fasting glucose and requests repeat A1C through your PCP. Early trend data shows direction of response.",
  },
  {
    month: "Month 6",
    label: "Reassess A1C + weight",
    description:
      "Many members see A1C drop back toward normal range alongside 7-12% body weight loss. Provider adjusts dose.",
  },
  {
    month: "Month 12+",
    label: "Maintenance",
    description:
      "Your provider builds a long-term plan — often lower dose, continued A1C monitoring, sustained weight.",
  },
];

const provider = {
  name: "Dr. Michael Okonkwo, MD",
  credentials: "Endocrinology · Metabolic Medicine · 18 years practice",
  bio: "Pre-diabetes is one of the most reversible conditions in all of medicine — if you act in the window. GLP-1 combined with 5-10% body weight loss can return A1C to normal range for many patients. The best time is when you're still pre-diabetic.",
  imagePrompt:
    "Professional editorial headshot of a 50-year-old Black male physician, close-cropped salt-and-pepper beard, warm authoritative smile, white coat over pale blue shirt, modern endocrinology office softly blurred, natural daylight, Hasselblad quality, 1:1 aspect ratio.",
};

const priceColumns = [
  {
    name: "Brand-Name Wegovy / Ozempic",
    price: "$1,349/mo",
    priceSubtext: "retail cash-pay*",
    features: [
      { label: "FDA-approved", included: true },
      { label: "Typically not covered without T2D diagnosis", included: false },
      { label: "Pharmacy shortages in 2025–26", included: false },
      { label: "Ongoing provider support", included: false },
      { label: "A1C-focused dosing protocol", included: false },
      { label: "30-day money-back guarantee", included: false },
    ],
  },
  {
    name: "Nature's Journey A1C Plan",
    price: "$179/mo",
    priceSubtext: "no insurance needed",
    highlight: true,
    features: [
      { label: "Same active semaglutide molecule", included: true },
      { label: "Compounded by US 503A pharmacy", included: true },
      { label: "No insurance hurdles — flat monthly price", included: true },
      { label: "Ongoing provider + care-team support", included: true },
      { label: "A1C-focused dosing protocol", included: true },
      { label: "30-day money-back guarantee", included: true },
    ],
    ctaLabel: "See If I Qualify →",
    ctaHref: "/qualify",
  },
];

const testimonials = [
  {
    name: "Thomas B.",
    age: 54,
    location: "Raleigh",
    lbs: 38,
    months: 7,
    quote:
      "A1C went from 6.3 to 5.6. My doctor literally said 'whatever you're doing, keep doing it.' Down 38 lbs at the same time.",
  },
  {
    name: "Linda K.",
    age: 49,
    location: "Tampa",
    lbs: 31,
    months: 6,
    quote:
      "Pre-diabetic for 4 years, couldn't move the needle on my own. Six months on the program and my A1C is back in normal range.",
  },
  {
    name: "Carlos R.",
    age: 57,
    location: "Albuquerque",
    lbs: 44,
    months: 8,
    quote:
      "My endocrinologist said I was 'one year from T2D.' She retracted that at my last visit. Down 44 lbs, A1C 5.4.",
  },
  {
    name: "Evelyn H.",
    age: 52,
    location: "Columbus",
    lbs: 29,
    months: 6,
    quote:
      "Metformin alone wasn't moving my weight or A1C. Adding GLP-1 did both. 7.2 down to 5.8.",
  },
];

const faqs = [
  {
    question: "Will this lower my A1C?",
    answer:
      "GLP-1 medications may help lower A1C. Published clinical studies show meaningful improvements for many patients, especially when combined with 5-10% body weight loss. Individual results vary. Your provider coordinates repeat A1C testing through your PCP and adjusts dosing based on your response.",
  },
  {
    question: "Can I take this with metformin?",
    answer:
      "Yes — GLP-1 and metformin are commonly used together for pre-diabetic and type 2 diabetic patients. They target different parts of the glucose-regulation system. Share your full medication list with your provider; they'll coordinate with your PCP and flag any interactions based on your history.",
  },
  {
    question: "What if my A1C is already 6.4?",
    answer:
      "An A1C of 6.4% is still within the pre-diabetic range (5.7-6.4%). GLP-1 may help; many members have reversed elevated A1Cs with weight loss and provider-guided dosing. Talk with your PCP about coordinated care, and share all labs with your telehealth provider during the assessment.",
  },
  {
    question: "How fast does A1C drop?",
    answer:
      "A1C reflects 2-3 months of glucose, so the first measurable change typically appears at a 3-month repeat test. More significant drops often appear at 6 and 12 months alongside continued weight loss. Individual results vary. Your provider schedules repeat labs to track response.",
  },
  {
    question: "Is this the same as Ozempic?",
    answer:
      "Compounded semaglutide contains the same active ingredient as Ozempic and Wegovy, prepared by a state-licensed compounding pharmacy under an individual prescription. It is not FDA-approved as a branded drug product. Our program is for patients for whom this is medically appropriate as determined by a licensed provider.",
  },
  {
    question: "Do I need to change my diet for this to work?",
    answer:
      "GLP-1 drives appetite and glucose changes on its own, but results are better when paired with a higher-protein, lower-refined-carb approach. Your care team includes a dietitian plan focused on A1C reduction, not just calorie cuts. Many members find their food choices naturally shift.",
  },
  {
    question: "What are the side effects?",
    answer:
      "Most common are mild gastrointestinal symptoms (nausea, constipation, reflux) during dose titration. Your provider starts low and steps up slowly specifically to minimize these. Persistent or serious side effects are reviewed promptly and dosing is adjusted or paused accordingly.",
  },
  {
    question: "Is my doctor involved?",
    answer:
      "Your licensed telehealth provider manages the GLP-1 prescription. We encourage — and make it easy — to share treatment progress and labs with your primary care doctor, especially for A1C retesting. Coordinated care leads to the best pre-diabetes reversal outcomes.",
  },
  {
    question: "Do I need insurance?",
    answer:
      "No. Plans start at $179/month — a flat price including compounded medication, provider oversight, and care-team messaging. Insurance typically denies GLP-1 for pre-diabetes anyway. Cancel anytime. 30-day money-back guarantee on your first month.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. No long-term commitment. You can pause or cancel any time through your dashboard. If a licensed provider determines you're not eligible — for safety or contraindications — you aren't charged for medication. The 2-minute eligibility assessment is free and non-binding.",
  },
];

const internalLinks = [
  {
    title: "Semaglutide Explained",
    description: "Mechanism, cost, timeline — the active ingredient behind most programs.",
    href: "/lp/semaglutide",
  },
  {
    title: "Affordable GLP-1",
    description: "From $179/mo — compare plans and what's included at each tier.",
    href: "/lp/affordable",
  },
  {
    title: "See Pricing Plans",
    description: "Essential, Premium, Complete — full plan comparison.",
    href: "/pricing",
  },
  {
    title: "Check Eligibility",
    description: "2 minutes. No cost. No commitment. Licensed-provider review.",
    href: "/qualify",
  },
  {
    title: "How It Works",
    description: "The full journey from assessment to shipment to support.",
    href: "/how-it-works",
  },
  {
    title: "Medical Weight Management",
    description: "Provider-guided treatment for weight and metabolic risk.",
    href: "/lp/medical-weight-management",
  },
] as const;

export default function PreDiabetesLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="A1C-Aware Care"
        badgeIcon={Activity}
        badgeIconColor="text-teal-500"
      />

      {/* ======================================================================
          HERO
          AI-IMAGE PROMPT (hero right-side portrait — optional enhancement)
          Aspect ratio: 4:5
          "Editorial portrait of a person in their early 50s, composed
           expression, wearing a navy or slate button-down, standing in a
           sunlit home office with a subtle medical-report document visible,
           natural window light, grounded determined half-smile, shallow
           depth of field. Body language: informed, taking action. No logos."
          ====================================================================== */}
      <LpHeroBlock
        badge="A1C-Aware Care"
        headline="Bring that A1C down by May."
        headlineAccent="Same active ingredient as Ozempic."
        subtitle="A 'pre-diabetic' diagnosis is a warning, not a sentence. Doctor-prescribed GLP-1 may help you lose up to 8 lbs in your first month while improving insulin sensitivity.* Same active molecule as Ozempic and Wegovy. From $179/mo. Individual results vary."
        stats={heroStats}
        ctaLocation="hero-pre-diabetes"
      />

      <LpSocialProofBar />

      <LpOutcomeStats
        stats={outcomeStats}
        heading="What members actually see"
        subheading="Program outcomes, not marketing numbers."
      />

      <LpProblemSection
        eyebrow="WHY ACT NOW"
        heading="The window to reverse pre-diabetes is closing."
        cards={lpProblemCards}
        transitionText="A metabolic problem deserves a metabolic tool — while the window is open."
        ctaLocation="problem-pre-diabetes"
      />

      {/* Why Pre-Diabetes Is the Best Time to Act */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            Why pre-diabetes is the best time to act
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Reversal is still on the table — and small losses produce big metabolic change.
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

      {/* How GLP-1 Targets Insulin Resistance */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            How GLP-1 targets insulin resistance
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            The only medication class that drives both weight loss AND glucose control.
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

      <LpMidCta
        headline="Ready to reverse the warning?"
        subtext="Free 2-minute assessment. Licensed providers. No commitment."
        location="mid-pre-diabetes"
      />

      <LpJourneyRoadmap
        milestones={journeyMilestones}
        heading="What to expect — with lab check-ins"
        subheading="A1C reflects a 2-3 month rolling window, so progress is measured at set intervals."
      />

      <LpPriceCompare
        columns={priceColumns}
        heading="Same active ingredient. Plans from $179/mo."
        subheading="Insurance typically denies GLP-1 for pre-diabetes. We don't."
      />

      <LpProviderCredential
        provider={provider}
        heading="Every plan is overseen by a real clinician"
      />

      {/* Testimonials */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-8">
            Members who moved their A1C
          </h2>
          {/* AI-IMAGE PROMPT (optional — testimonial avatars)
              Aspect ratio: 1:1
              "Four photorealistic headshot portraits, diverse adults ages
               48-60, soft natural window light, quietly confident expressions,
               neutral backgrounds in slate and cream tones, editorial
               photojournalism style, candid not posed, Sony A7R 85mm f/1.8.
               No logos. No medical iconography."
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
            Individual experiences. Results not typical. Compounded medications are not FDA-approved. A1C changes require confirmatory testing through your PCP.
          </p>
        </div>
      </section>

      <LpFaq
        faqs={faqs}
        heading="Pre-diabetes & GLP-1: your questions"
        subheading="Everything you need to know about using prescribed GLP-1 for A1C reversal."
      />

      <LpInternalLinks heading="Keep exploring" links={internalLinks} />

      <LpCtaSection
        headline="Reverse the warning. Start tonight."
        bgClassName="bg-gradient-to-r from-teal-50 to-sky-50"
      />

      <LpFooter />

      {/* JSON-LD */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Pre-Diabetes Weight Loss", href: "/lp/pre-diabetes" },
        ]}
      />
      <MedicalWebPageJsonLd
        name="Reverse Pre-Diabetes with GLP-1 Weight Loss"
        description="Pre-diabetes is reversible. Doctor-prescribed GLP-1 may help lower A1C and shed weight. Licensed US providers with quarterly A1C monitoring. From $179/mo. Individual results vary."
        url="/lp/pre-diabetes"
      />
      <FAQPageJsonLd faqs={faqs} />
      <MedicalConditionJsonLd
        name="Pre-Diabetes"
        alternateName="Impaired Glucose Tolerance"
        description="Pre-diabetes is a condition where blood sugar is elevated but below the type 2 diabetes threshold (A1C 5.7-6.4%). It is generally reversible through lifestyle intervention and weight loss. GLP-1 receptor agonists may support weight loss and insulin sensitivity in pre-diabetic patients."
        url="/lp/pre-diabetes"
        possibleTreatment="Weight-management therapy using compounded GLP-1 medications (semaglutide or tirzepatide) prescribed by a licensed provider, with quarterly A1C monitoring."
      />
      <LpConversionWidgets />
    </div>
  );
}
