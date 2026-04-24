import type { Metadata } from "next";
import {
  Check,
  Star,
  AlertTriangle,
  Moon,
  Wind,
  Activity,
  Stethoscope,
  Clock,
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
// "Candid photograph of a man in his 50s resting peacefully in bed at dawn
//  with soft morning light streaming through curtains, CPAP machine visible
//  but dormant on the bedside table, calm serene expression, warm neutral
//  tones, editorial healthcare photography, 16:9 aspect ratio."
// ============================================================================

export const metadata: Metadata = {
  // Primary keywords: sleep apnea weight loss, CPAP weight loss, OSA GLP-1,
  // reduce sleep apnea severity, tirzepatide sleep apnea, Zepbound alternative sleep apnea
  title: "Sleep Apnea Weight Loss with GLP-1 | From $179/mo | Nature's Journey",
  description:
    "Losing weight may reduce sleep apnea severity. Prescribed GLP-1 — same active ingredient as Ozempic — may help you lose up to 8 lbs in your first month.* From $179/mo.",
  openGraph: {
    title: "Sleep Apnea Weight Loss — GLP-1 from $179/mo",
    description:
      "Weight loss may reduce OSA severity. Prescribed GLP-1 from licensed US providers, coordinated with your sleep specialist. Same active ingredient as Ozempic.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/sleep-apnea",
  },
};

const heroStats = [
  { value: "OSA-aware", label: "Protocol" },
  { value: "15-20%*", label: "Avg weight loss" },
  { value: "$179/mo", label: "Starting at" },
  { value: "18,000+", label: "Members" },
];

const outcomeStats = [
  {
    value: "18,000+",
    label: "Members on program",
    sublabel: "Including many managing obstructive sleep apnea alongside CPAP.",
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
    icon: Moon,
    title: "Your CPAP isn't the cure — it's a workaround",
    description:
      "It treats the symptom nightly, but the cause (excess weight pressing on the airway) keeps the cycle going.",
  },
  {
    icon: Wind,
    title: "Sleep-deprived people gain weight faster",
    description:
      "Disrupted sleep raises cortisol and hunger hormones. You're fighting both conditions at once.",
  },
  {
    icon: AlertTriangle,
    title: "Sleep apnea surgery is invasive and often incomplete",
    description:
      "UPPP, maxillomandibular advancement — high risk, long recovery, mixed outcomes. Most patients need weight loss anyway.",
  },
] as const;

const problemCards = [
  {
    icon: Wind,
    title: "Fatty tissue around the airway",
    description:
      "Excess weight at the neck and throat physically narrows the airway. Every pound lost in that zone gives your breathing room back.",
  },
  {
    icon: Activity,
    title: "Weight-driven inflammation narrows airway",
    description:
      "Systemic inflammation from excess body fat swells soft tissue around the upper airway, making collapse during sleep more likely.",
  },
  {
    icon: Moon,
    title: "Poor sleep drives more weight gain",
    description:
      "Fragmented sleep raises ghrelin, drops leptin, and spikes cortisol. The vicious cycle of apnea and weight gain feeds itself.",
  },
];

const solutionCards = [
  {
    title: "Clinical studies show significant AHI reduction",
    description:
      "Published research (including SURMOUNT-OSA) demonstrates meaningful apnea-hypopnea index reductions with GLP-1-assisted weight loss. Individual results vary.",
  },
  {
    title: "Many members use CPAP at lower pressure settings",
    description:
      "As weight drops, many members report their sleep specialists reassessing CPAP needs — sometimes lowering pressure, occasionally retiring the machine.",
  },
  {
    title: "Sleep quality typically improves as weight drops",
    description:
      "Even before formal AHI changes, members often report waking more refreshed within weeks. Better sleep then supports further weight loss.",
  },
];

const journeyMilestones = [
  {
    month: "Day 1",
    label: "Eligibility + sleep history",
    description:
      "Provider reviews your OSA/CPAP context during intake. Share any recent sleep study for coordinated care.",
  },
  {
    month: "Week 1",
    label: "Medication ships",
    description:
      "Discreet delivery. Keep using your CPAP as prescribed — do not stop without your sleep specialist's sign-off.",
  },
  {
    month: "Month 1",
    label: "First 4-8 lbs",
    description:
      "Cravings quiet. Initial energy boost from combined better sleep and early weight loss.",
  },
  {
    month: "Month 3",
    label: "10-15 lbs down",
    description:
      "Discuss sleep study re-check timing with your sleep specialist. Many see early symptom improvement.",
  },
  {
    month: "Month 6",
    label: "15-20% body weight lost*",
    description:
      "Many members see reduced CPAP pressure needs after follow-up sleep studies at this stage.",
  },
  {
    month: "Month 12+",
    label: "Maintenance",
    description:
      "Long-term sleep + weight management in one plan. Annual sleep reassessment recommended.",
  },
];

const provider = {
  name: "Dr. Raymond Patel, MD",
  credentials: "Pulmonology · Sleep Medicine · Obesity Medicine · 19 years practice",
  bio: "Weight loss remains the single most impactful intervention for obstructive sleep apnea. For patients with a BMI over 30, every 10% body weight drop can meaningfully reduce apnea events. GLP-1 now makes that weight loss actually achievable.",
  imagePrompt:
    "Professional editorial headshot of a 52-year-old South Asian male physician, short black-gray hair, warm authoritative smile, white coat over pale blue shirt, modern sleep clinic softly blurred behind, natural daylight, Hasselblad quality, 1:1 aspect ratio.",
};

const priceColumns = [
  {
    name: "Brand-Name Wegovy / Zepbound",
    price: "$1,349/mo",
    priceSubtext: "retail cash-pay*",
    features: [
      { label: "FDA-approved", included: true },
      { label: "Insurance denials + partial coverage common", included: false },
      { label: "Pharmacy shortages in 2025–26", included: false },
      { label: "Ongoing provider support", included: false },
      { label: "Coordinates with your sleep specialist", included: false },
      { label: "30-day money-back guarantee", included: false },
    ],
  },
  {
    name: "Nature's Journey OSA-Aware Plan",
    price: "$179/mo",
    priceSubtext: "no insurance needed",
    highlight: true,
    features: [
      { label: "Same active semaglutide molecule", included: true },
      { label: "Compounded by US 503A pharmacy", included: true },
      { label: "No insurance hurdles — flat monthly price", included: true },
      { label: "Ongoing provider + care-team support", included: true },
      { label: "Coordinates with your sleep specialist", included: true },
      { label: "30-day money-back guarantee", included: true },
    ],
    ctaLabel: "See If I Qualify →",
    ctaHref: "/qualify",
  },
];

const testimonials = [
  {
    name: "Ron M.",
    age: 54,
    location: "Charlotte",
    lbs: 42,
    months: 8,
    quote:
      "Dropped 42 lbs. My sleep doctor lowered my CPAP pressure twice.",
  },
  {
    name: "Janelle T.",
    age: 48,
    location: "Memphis",
    lbs: 28,
    months: 6,
    quote:
      "Stopped snoring according to my husband. First time in 15 years.",
  },
  {
    name: "Victor S.",
    age: 61,
    location: "Denver",
    lbs: 37,
    months: 9,
    quote:
      "Sleep study showed AHI went from 34 to 12. My cardiologist is thrilled.",
  },
  {
    name: "Priya K.",
    age: 45,
    location: "Seattle",
    lbs: 24,
    months: 5,
    quote:
      "Wake up feeling rested. I forgot what that felt like.",
  },
];

const faqs = [
  {
    question: "Can losing weight really reduce sleep apnea?",
    answer:
      "Yes, for many patients. Clinical trials — including the landmark SURMOUNT-OSA study — show significant AHI reductions with meaningful weight loss. Severity depends on anatomy, weight distribution, and age, so response is individual. Any formal change should be confirmed by your sleep specialist via a repeat sleep study. Individual results vary.",
  },
  {
    question: "Do I stop using my CPAP?",
    answer:
      "No. Continue using CPAP exactly as prescribed by your sleep specialist. Pressure settings or the ongoing need for CPAP may be reassessed only after a repeat sleep study following significant weight loss. Stopping CPAP prematurely can be dangerous — work only with your sleep specialist on any changes to therapy.",
  },
  {
    question: "Is GLP-1 approved for sleep apnea?",
    answer:
      "Zepbound (tirzepatide) received FDA approval for moderate-to-severe obstructive sleep apnea in adults with obesity in December 2024. Compounded semaglutide and tirzepatide contain the same active ingredients but are prepared by state-licensed pharmacies and are not themselves FDA-approved drug products.",
  },
  {
    question: "How fast will I see improvement?",
    answer:
      "Most members notice better sleep quality within a few weeks as weight begins to drop and inflammation eases. Formal AHI improvements typically require 10-15% total body weight loss, which most members reach between months 3 and 9. Your sleep specialist confirms changes via repeat sleep study.",
  },
  {
    question: "Is this covered by insurance?",
    answer:
      "Compounded GLP-1 is typically not covered by insurance. Our flat $179/month plan is often less than OSA-related copays and specialist fees combined. No pre-authorizations, no coverage fights. Brand-name Zepbound may be covered for OSA after FDA approval — check with your insurer for specifics.",
  },
  {
    question: "Side effects?",
    answer:
      "Most common are mild gastrointestinal symptoms (nausea, constipation, reflux) during dose titration, usually resolving in 2-3 weeks. Notify your provider promptly if any sleep symptoms worsen. Your provider starts low and steps up slowly specifically to minimize side effects, and dosing is paused or adjusted as needed.",
  },
  {
    question: "Can I take this with my BP meds?",
    answer:
      "Yes, commonly. Many OSA patients also have hypertension, and the two are often treated in parallel. Weight loss often improves blood pressure, and your telehealth provider coordinates with your PCP on any medication dose adjustments. Share your full medication list during the eligibility assessment.",
  },
  {
    question: "What if I have central (not obstructive) sleep apnea?",
    answer:
      "Central sleep apnea has different underlying causes — typically neurological or cardiac — and weight loss may not resolve it. Discuss with your sleep specialist before starting any weight-loss therapy. Our program is designed around obstructive sleep apnea where weight is a primary driver. Mixed apnea should also be evaluated by a sleep specialist.",
  },
  {
    question: "Should I get another sleep study after losing weight?",
    answer:
      "Often recommended at the 10-15% weight loss milestone. A repeat polysomnogram or home sleep test allows your sleep specialist to formally reassess AHI and consider CPAP pressure changes or — in some cases — therapy reduction. Ask your sleep specialist about timing during your next visit.",
  },
  {
    question: "What about long-term?",
    answer:
      "Many members stay on a maintenance GLP-1 dose long-term. Weight regain can mean apnea severity returns, so sustained weight management matters for sustained sleep health. Your provider tailors the maintenance plan — often a lower dose — and coordinates with your sleep specialist for periodic reassessment.",
  },
];

const internalLinks = [
  {
    title: "Blood Pressure + GLP-1",
    description: "Weight loss is the most evidence-backed non-drug BP lever.",
    href: "/lp/blood-pressure",
  },
  {
    title: "Pre-Diabetes Reversal",
    description: "Bring A1C back toward normal with provider-guided GLP-1.",
    href: "/lp/pre-diabetes",
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
  {
    title: "Weight Loss Over 50",
    description: "Protocols tuned for metabolic change in the second half of life.",
    href: "/lp/over50",
  },
] as const;

export default function SleepApneaLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="Sleep-Informed Care"
        badgeIcon={Moon}
        badgeIconColor="text-teal-500"
      />

      {/* ======================================================================
          HERO
          AI-IMAGE PROMPT (hero right-side portrait — optional enhancement)
          Aspect ratio: 4:5
          "Editorial portrait of a man in his early 50s waking calmly at dawn,
           soft morning window light across a neutral bedroom, CPAP machine
           on the nightstand, slight peaceful smile, shallow depth of field.
           Body language: rested, unburdened. No logos."
          ====================================================================== */}
      <LpHeroBlock
        badge="Sleep-Informed Care"
        headline="Sleep better by May."
        headlineAccent="Same active ingredient as Ozempic."
        subtitle="Weight loss may reduce sleep apnea severity. Doctor-prescribed GLP-1 may help you lose up to 8 lbs in your first month* while supporting healthier sleep. Same active molecule as Ozempic and Wegovy. From $179/mo. Individual results vary."
        stats={heroStats}
        ctaLocation="hero-sleep-apnea"
      />

      <LpSocialProofBar />

      <LpOutcomeStats
        stats={outcomeStats}
        heading="What members actually see"
        subheading="Program outcomes, not marketing numbers."
      />

      <LpProblemSection
        eyebrow="WHY SLEEP APNEA PERSISTS"
        heading="Your CPAP keeps you safe. Weight loss treats the cause."
        cards={lpProblemCards}
        transitionText="Address the weight driving the airway collapse — while your CPAP keeps you safe tonight."
        ctaLocation="problem-sleep-apnea"
      />

      {/* Why Sleep Apnea + Weight Are Linked */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            Why sleep apnea + weight are linked
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Excess weight and OSA feed each other — breaking one breaks the cycle.
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

      {/* How GLP-1 May Reduce OSA Severity */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            How GLP-1 may reduce OSA severity
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            A weight-loss tool with sleep-adjacent benefits — coordinated with your specialist.
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
        headline="Ready to sleep through the night?"
        subtext="Free 2-minute assessment. Licensed providers. No commitment."
        location="mid-sleep-apnea"
      />

      <LpJourneyRoadmap
        milestones={journeyMilestones}
        heading="What to expect, month by month"
        subheading="An OSA-aware treatment arc your provider coordinates with your sleep specialist."
      />

      <LpPriceCompare
        columns={priceColumns}
        heading="Same active ingredient. Plans from $179/mo."
        subheading="Access to GLP-1 shouldn't depend on your insurance — or an OSA diagnosis gate."
      />

      <LpProviderCredential
        provider={provider}
        heading="Every plan is overseen by a real clinician"
      />

      {/* Testimonials */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-8">
            Members who found their rest again
          </h2>
          {/* AI-IMAGE PROMPT (optional — testimonial avatars)
              Aspect ratio: 1:1
              "Four photorealistic headshot portraits of people ages 45-65
               looking well-rested and content, soft natural lighting, warm
               palettes, editorial photojournalism style, 1:1 aspect ratio."
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
            Individual experiences. Results not typical. Sleep apnea severity is a complex condition — any changes should be confirmed by your sleep specialist with a repeat sleep study.
          </p>
        </div>
      </section>

      <LpFaq
        faqs={faqs}
        heading="Sleep apnea & GLP-1: your questions"
        subheading="What to know about weight-loss therapy alongside OSA and CPAP care."
      />

      <LpInternalLinks heading="Keep exploring" links={internalLinks} />

      <LpCtaSection
        headline="Sleep better. Live better. Start tonight."
        bgClassName="bg-gradient-to-br from-sky-50 to-teal-50"
      />

      <LpFooter />

      {/* JSON-LD */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Sleep Apnea Weight Loss", href: "/lp/sleep-apnea" },
        ]}
      />
      <MedicalWebPageJsonLd
        name="Sleep Apnea Weight Loss with GLP-1"
        description="Weight loss may reduce sleep apnea severity. Doctor-prescribed GLP-1 may help you lose up to 8 lbs in your first month. Licensed US providers, coordinated with your sleep specialist. From $179/mo. Individual results vary."
        url="/lp/sleep-apnea"
      />
      <FAQPageJsonLd faqs={faqs} />
      <MedicalConditionJsonLd
        name="Obstructive Sleep Apnea"
        alternateName="OSA"
        description="Obstructive sleep apnea is a sleep disorder in which breathing repeatedly stops and starts during sleep, often caused by relaxation of throat muscles combined with excess weight around the neck and airway. Weight loss can significantly reduce apnea severity for many patients."
        url="/lp/sleep-apnea"
        possibleTreatment="Weight-management therapy with compounded GLP-1 medications, coordinated with ongoing CPAP use and sleep specialist oversight."
      />
      <LpConversionWidgets />
    </div>
  );
}
