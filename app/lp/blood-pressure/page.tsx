import type { Metadata } from "next";
import {
  Check,
  Star,
  AlertTriangle,
  Heart,
  Pill,
  Activity,
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
// AI-IMAGE PROMPT (hero background — optional, wire into LpHeroBlock when ready)
// Aspect ratio: 16:9
// "Editorial photograph of a middle-aged adult taking a home blood-pressure
//  reading at a sunlit kitchen table, coffee and a BP monitor in focus,
//  calm confident expression, shallow depth of field, Canon R5 50mm f/1.8.
//  Emphasis on agency and informed action. No logos."
// ============================================================================

export const metadata: Metadata = {
  // Primary keywords: high blood pressure weight loss, hypertension GLP-1,
  // lower blood pressure medication, BP weight loss program, hypertension semaglutide
  title: "Lower Blood Pressure with GLP-1 Weight Loss | From $179/mo",
  description:
    "Weight loss can meaningfully reduce blood pressure. Prescribed GLP-1 may help you lose up to 8 lbs in your first month.* Same active ingredient as Ozempic. From $179/mo.",
  openGraph: {
    title: "Lower Blood Pressure — GLP-1 from $179/mo",
    description:
      "Weight loss is the #1 non-drug BP intervention. Prescribed GLP-1 from licensed US providers, coordinated with your PCP. Same active ingredient as Ozempic.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/blood-pressure",
  },
};

const heroStats = [
  { value: "BP-aware", label: "Protocol" },
  { value: "15-20%*", label: "Avg weight loss" },
  { value: "$179/mo", label: "Starting at" },
  { value: "18,000+", label: "Members" },
];

const outcomeStats = [
  {
    value: "18,000+",
    label: "Members on program",
    sublabel: "Including many managing hypertension alongside BP medication.",
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
    icon: Heart,
    title: "More BP meds ≠ fewer problems",
    description:
      "Each pill added is a workaround. The underlying weight issue keeps driving the BP up — and medications carry their own side effects.",
  },
  {
    icon: Pill,
    title: "Dietary sodium cuts only go so far",
    description:
      "For weight-driven hypertension, DASH + exercise alone often can't close the gap. You need a biological tool that your body responds to.",
  },
  {
    icon: AlertTriangle,
    title: "Your doctor said 'lose 20 lbs' — but how?",
    description:
      "That advice, repeated for years, without a real mechanism to follow through. GLP-1 changes the 'how' — not just the 'what'.",
  },
] as const;

const problemCards = [
  {
    icon: TrendingDown,
    title: "5-10 lbs lost often drops SBP 5+ mmHg",
    description:
      "Published research shows even modest weight loss meaningfully reduces systolic blood pressure. Every pound works — and the effect compounds.",
  },
  {
    icon: Activity,
    title: "Reduces nighttime BP dipping issues",
    description:
      "Weight loss helps restore healthy overnight blood pressure patterns, which matter as much as daytime readings for long-term heart health.",
  },
  {
    icon: Heart,
    title: "Improves heart structure over time",
    description:
      "Echocardiogram studies show left ventricular wall thickness can improve with sustained weight loss — a structural change, not just a number on the cuff.",
  },
];

const solutionCards = [
  {
    title: "Weight loss reduces vascular resistance",
    description:
      "As body weight drops, the work your heart does each beat decreases — systemic vascular resistance falls, and BP follows. This is the primary mechanism.",
  },
  {
    title: "Improves insulin sensitivity (metabolic syndrome reversal)",
    description:
      "Many hypertensive patients also have insulin resistance. GLP-1 addresses both — hitting the metabolic syndrome core, not just one branch.",
  },
  {
    title: "Clinical trials show BP drops of 5-8 mmHg",
    description:
      "Published GLP-1 trials consistently report systolic BP reductions of 5-8 mmHg with significant weight loss. Individual results vary.",
  },
];

const journeyMilestones = [
  {
    month: "Day 1",
    label: "Lab baselines + BP log",
    description:
      "Provider reviews your recent labs, current BP readings, and medication list. Start a home BP log if you don't already have one.",
  },
  {
    month: "Month 1",
    label: "First 4-8 lbs + BP trend",
    description:
      "Dose titration begins. Log morning + evening BP readings. Early trend data starts to emerge.",
  },
  {
    month: "Month 3",
    label: "Dose review + PCP check-in",
    description:
      "Provider reviews BP log and weight. Coordinate with your PCP on any medication adjustments based on readings.",
  },
  {
    month: "Month 6",
    label: "Discuss med reduction with PCP",
    description:
      "Many members reach 15% body weight loss and systolic drops of 5-10 mmHg. Your PCP may consider tapering a medication.",
  },
  {
    month: "Month 9",
    label: "Maintenance dose",
    description:
      "Provider adjusts dose for long-term sustainability. Continued BP monitoring ensures stability.",
  },
  {
    month: "Month 12+",
    label: "Long-term cardiometabolic health",
    description:
      "Annual cardiovascular reassessment with your PCP. Sustained weight + BP gains become your new baseline.",
  },
];

const provider = {
  name: "Dr. Susan Chen, MD",
  credentials: "Cardiology · Preventive Medicine · 17 years practice",
  bio: "Every patient I start on GLP-1 gets a baseline BP log. By month 3 most are seeing systolic drops of 5-10 points. That often means their PCP can taper one medication. That's not a side effect — that's the mechanism working.",
  imagePrompt:
    "Professional editorial headshot of a 47-year-old Asian female physician, shoulder-length dark hair, warm authoritative smile, white coat over coral blouse, cardiology clinic softly blurred, natural daylight, Hasselblad quality, 1:1 aspect ratio.",
};

const priceColumns = [
  {
    name: "Brand-Name Wegovy / Ozempic",
    price: "$1,349/mo",
    priceSubtext: "retail cash-pay*",
    features: [
      { label: "FDA-approved", included: true },
      { label: "Insurance denials + partial coverage common", included: false },
      { label: "Pharmacy shortages in 2025–26", included: false },
      { label: "Ongoing provider support", included: false },
      { label: "Coordinates with your PCP on BP med adjustments", included: false },
      { label: "30-day money-back guarantee", included: false },
    ],
  },
  {
    name: "Nature's Journey BP-Aware Plan",
    price: "$179/mo",
    priceSubtext: "no insurance needed",
    highlight: true,
    features: [
      { label: "Same active semaglutide molecule", included: true },
      { label: "Compounded by US 503A pharmacy", included: true },
      { label: "No insurance hurdles — flat monthly price", included: true },
      { label: "Ongoing provider + care-team support", included: true },
      { label: "Coordinates with your PCP on BP med adjustments", included: true },
      { label: "30-day money-back guarantee", included: true },
    ],
    ctaLabel: "See If I Qualify →",
    ctaHref: "/qualify",
  },
];

const testimonials = [
  {
    name: "Frank R.",
    age: 58,
    location: "Pittsburgh",
    lbs: 38,
    months: 8,
    quote:
      "BP went from 148/92 to 124/78. Cardiologist halved one of my meds.",
  },
  {
    name: "Marjorie T.",
    age: 62,
    location: "Phoenix",
    lbs: 29,
    months: 7,
    quote:
      "Off one BP medication. My pharmacy copays dropped too.",
  },
  {
    name: "Anthony L.",
    age: 44,
    location: "Orlando",
    lbs: 35,
    months: 6,
    quote:
      "Family history is scary. This is the first thing that actually worked.",
  },
  {
    name: "Denise P.",
    age: 51,
    location: "Richmond",
    lbs: 31,
    months: 7,
    quote:
      "BP down, energy up, and my doctor is finally smiling at me.",
  },
];

const faqs = [
  {
    question: "Does weight loss actually reduce blood pressure?",
    answer:
      "Yes. Weight loss is the single most evidence-backed non-drug BP intervention. Published research shows each 5-10 lbs lost can reduce systolic BP by 5+ mmHg for many patients. With GLP-1-assisted weight loss of 15-20%, drops of 5-10 mmHg systolic are commonly reported. Individual results vary.",
  },
  {
    question: "Will I still need my BP meds?",
    answer:
      "Probably at first — do not stop or change BP medications without your PCP's guidance. As you lose weight and BP readings drop, your PCP may taper or reduce dose. Many members end up on fewer medications by month 6-9. Your telehealth provider coordinates with your PCP throughout.",
  },
  {
    question: "Can I take this with my current BP medication?",
    answer:
      "Yes, GLP-1 is generally safe to combine with common BP medications (ACE inhibitors, ARBs, beta blockers, calcium channel blockers, diuretics). Your provider reviews your full medication list during intake and flags any interactions based on your specific history.",
  },
  {
    question: "Is this covered by insurance?",
    answer:
      "Compounded GLP-1 is typically not covered. Our flat $179/month plan — including medication, provider oversight, and care-team messaging — is often less than specialist copays for hypertension management. No pre-authorizations and no coverage appeals needed.",
  },
  {
    question: "Side effects that could affect BP?",
    answer:
      "GLP-1 can cause mild GI symptoms during titration. As BP drops with weight loss, some members on existing BP medication may feel lightheaded from over-treatment. Report any dizziness or fainting to your PCP and telehealth provider — a medication adjustment may be needed.",
  },
  {
    question: "What if I have heart disease?",
    answer:
      "Established cardiovascular disease needs cardiologist coordination. Share your full cardiac history during intake. GLP-1 is studied in high-risk patients and may have cardiovascular benefits, but your case must be evaluated by your cardiologist before starting. Some conditions are contraindications.",
  },
  {
    question: "Is this the same as Ozempic?",
    answer:
      "Compounded semaglutide contains the same active ingredient as Ozempic and Wegovy, prepared by a state-licensed compounding pharmacy under an individual prescription. It is not FDA-approved as a branded drug product. Our program is for patients for whom this is medically appropriate as determined by a licensed provider.",
  },
  {
    question: "How fast will BP drop?",
    answer:
      "Many members see home-BP log improvements within 4-6 weeks as the first 5-8 lbs come off. More significant drops align with 10-15% body weight loss (months 3-6). A clinic reading confirms sustained change — work with your PCP to interpret trends meaningfully.",
  },
  {
    question: "Should I check BP at home?",
    answer:
      "Yes — a validated upper-arm cuff used twice daily (morning + evening) gives a much better picture than a single clinic reading. Log the numbers. Share trends with your PCP. Home monitoring is the gold standard for tracking response to weight-loss + medication adjustments.",
  },
  {
    question: "Long-term outlook?",
    answer:
      "Many members stay on a maintenance GLP-1 dose long-term. Weight regain can mean BP returns to higher levels, so sustained weight management matters for sustained cardiovascular health. Your provider tailors the maintenance plan and coordinates ongoing care with your PCP.",
  },
];

const internalLinks = [
  {
    title: "Sleep Apnea + GLP-1",
    description: "Weight loss may reduce OSA severity — often linked with hypertension.",
    href: "/lp/sleep-apnea",
  },
  {
    title: "Pre-Diabetes Reversal",
    description: "A1C-focused protocol for the other half of metabolic syndrome.",
    href: "/lp/pre-diabetes",
  },
  {
    title: "Weight Loss Over 50",
    description: "Protocols tuned for cardiometabolic change in the second half of life.",
    href: "/lp/over50",
  },
  {
    title: "See Pricing Plans",
    description: "Essential, Premium, Complete — full plan comparison.",
    href: "/pricing",
  },
  {
    title: "Check Eligibility",
    description: "2 minutes. No cost. No commitment. Licensed-provider review.",
    href: "/eligibility",
  },
  {
    title: "How It Works",
    description: "The full journey from assessment to shipment to support.",
    href: "/how-it-works",
  },
] as const;

export default function BloodPressureLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="BP-Aware Care"
        badgeIcon={Heart}
        badgeIconColor="text-teal-500"
      />

      {/* ======================================================================
          HERO
          AI-IMAGE PROMPT (hero right-side portrait — optional enhancement)
          Aspect ratio: 4:5
          "Editorial portrait of an adult in their late 40s-50s checking a
           home BP cuff at a sunlit kitchen table, composed expression,
           soft neutral palette, natural window light, Canon R5 85mm f/1.4.
           Body language: informed, taking action. No logos."
          ====================================================================== */}
      <LpHeroBlock
        badge="BP-Aware Care"
        headline="Bring that blood pressure down by May."
        headlineAccent="Same active ingredient as Ozempic."
        subtitle="Weight loss is the single most evidence-backed non-drug BP intervention. Doctor-prescribed GLP-1 may help you lose up to 8 lbs in your first month* and often lowers blood pressure alongside it. Same active molecule as Ozempic and Wegovy. From $179/mo."
        stats={heroStats}
        ctaLocation="hero-blood-pressure"
      />

      <LpSocialProofBar />

      <LpOutcomeStats
        stats={outcomeStats}
        heading="What members actually see"
        subheading="Program outcomes, not marketing numbers."
      />

      <LpProblemSection
        eyebrow="WHY BP MEDS ALONE AREN'T ENOUGH"
        heading="Hypertension is a weight problem with a pill-shaped workaround."
        cards={lpProblemCards}
        transitionText="A metabolic problem deserves a metabolic tool — with your PCP in the loop."
        ctaLocation="problem-blood-pressure"
      />

      {/* Why Weight Is the #1 BP Lever */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            Why weight is the #1 BP lever
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Small losses, meaningful BP drops — and structural heart benefits over time.
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

      {/* How GLP-1 Lowers BP */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            How GLP-1 lowers BP
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Multiple mechanisms, one outcome — lower readings, sustained.
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
        headline="Ready to reduce the pill count?"
        subtext="Free 2-minute assessment. Licensed providers. No commitment."
        location="mid-blood-pressure"
      />

      <LpJourneyRoadmap
        milestones={journeyMilestones}
        heading="What to expect — with BP check-ins"
        subheading="A PCP-coordinated treatment arc with structured BP monitoring."
      />

      <LpPriceCompare
        columns={priceColumns}
        heading="Same active ingredient. Plans from $179/mo."
        subheading="Access to GLP-1 shouldn't depend on your insurance — or a BP-med track record."
      />

      <LpProviderCredential
        provider={provider}
        heading="Every plan is overseen by a real clinician"
      />

      {/* Testimonials */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-8">
            Members who moved their blood pressure
          </h2>
          {/* AI-IMAGE PROMPT (optional — testimonial avatars)
              Aspect ratio: 1:1
              "Four photorealistic headshot portraits of adults ages 44-65,
               healthy confident expressions, soft natural lighting, warm
               neutral tones, editorial photojournalism style, candid not
               posed, Sony A7R 85mm f/1.8. No logos."
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
            Individual experiences. Results not typical. Compounded medications are not FDA-approved. BP medication changes should always be made in coordination with your PCP.
          </p>
        </div>
      </section>

      <LpFaq
        faqs={faqs}
        heading="Blood pressure & GLP-1: your questions"
        subheading="What to know about weight-loss therapy alongside hypertension care."
      />

      <LpInternalLinks heading="Keep exploring" links={internalLinks} />

      <LpCtaSection
        headline="Lower BP. Fewer pills. Start tonight."
        bgClassName="bg-gradient-to-r from-teal-50 to-sky-50"
      />

      <LpFooter />

      {/* JSON-LD */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Blood Pressure Weight Loss", href: "/lp/blood-pressure" },
        ]}
      />
      <MedicalWebPageJsonLd
        name="Lower Blood Pressure with GLP-1 Weight Loss"
        description="Weight loss can meaningfully reduce blood pressure. Doctor-prescribed GLP-1 may help you lose up to 8 lbs in your first month. Licensed US providers, coordinated with your PCP. From $179/mo. Individual results vary."
        url="/lp/blood-pressure"
      />
      <FAQPageJsonLd faqs={faqs} />
      <MedicalConditionJsonLd
        name="Hypertension"
        alternateName="High Blood Pressure"
        description="Hypertension is a chronic condition where blood pressure in the arteries is persistently elevated, often driven or worsened by excess body weight. Weight loss of 5-10% of body weight is among the most effective non-pharmacological interventions for reducing blood pressure."
        url="/lp/blood-pressure"
        possibleTreatment="Weight-management therapy with compounded GLP-1 medications coordinated with the patient's primary care physician for BP medication adjustments."
      />
      <LpConversionWidgets />
    </div>
  );
}
