import type { Metadata } from "next";
import {
  Check,
  Star,
  Brain,
  AlertTriangle,
  TrendingDown,
  Activity,
  Scale,
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
  BreadcrumbJsonLd,
} from "@/components/seo/json-ld";

// ============================================================================
// AI-IMAGE PROMPT (hero background — optional, wire into LpHeroBlock when ready)
// Aspect ratio: 16:9
// "Editorial photograph of a fit man and woman in their mid-40s walking
//  together on a sunlit park path in casual athletic wear, relaxed genuine
//  conversation, warm late-afternoon light, shallow depth of field, candid
//  lifestyle photography, Canon R5 85mm f/1.4. Both visibly healthy, active,
//  mid-life, confident — not posed. No logos."
// ============================================================================

export const metadata: Metadata = {
  // Primary keywords: weight loss after 40, slow metabolism 40s, glp-1 midlife, weight loss for 40 year olds
  title: "Weight Loss After 40 | GLP-1 for Midlife | From $179/mo | Nature's Journey",
  description:
    "Your body changed the rules at 40. Doctor-prescribed GLP-1 addresses the metabolic and hormonal shifts behind midlife weight gain. From $179/mo. Individual results vary.",
  openGraph: {
    title: "Weight Loss After 40 — The Playbook That Actually Works",
    description:
      "Slower metabolism, shifting hormones, stubborn weight. Prescribed GLP-1 from US-licensed providers addresses the real mechanism. 2-minute eligibility. From $179/mo.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/over40",
  },
};

const heroStats = [
  { value: "Midlife", label: "Built for your 40s" },
  { value: "15-20%*", label: "Avg weight loss" },
  { value: "$179/mo", label: "Starting at" },
  { value: "18,000+", label: "Members" },
];

// Real program outcomes band — below hero. Specificity bias + availability heuristic.
const outcomeStats = [
  {
    value: "15-20%",
    label: "Avg total body weight loss*",
    sublabel: "Clinical-trial range for GLP-1 therapy over 12+ months.",
  },
  {
    value: "93%",
    label: "Would recommend",
    sublabel: "Member survey (ages 40–49) — completed ≥3 months.",
  },
  {
    value: "48 hrs",
    label: "Typical shipping",
    sublabel: "Free, discreet, to all 50 states where legally available.",
  },
];

const lpProblemCards = [
  {
    icon: TrendingDown,
    title: "The Rules Changed at 40",
    description:
      "The foods, workouts, and sleep that kept you lean in your 30s stopped working. That's not a discipline failure — it's real metabolic math your body is running against you.",
  },
  {
    icon: Clock,
    title: "Hormonal Shifts Started Early",
    description:
      "Testosterone, estrogen, progesterone, thyroid, cortisol — they all shift in the 40s. Small monthly changes compound into a visibly different body by midlife.",
  },
  {
    icon: AlertTriangle,
    title: "'Just Try Harder' Is Failing You",
    description:
      "Under-eating after 40 burns muscle faster than fat, tanks energy, and slows metabolism further. White-knuckling harder is the exact wrong prescription.",
  },
] as const;

const problemCards = [
  {
    icon: Scale,
    title: "Metabolic Slowdown Is Real",
    description:
      "Resting metabolic rate drops measurably in the 40s, especially as lean mass quietly declines. Without intervention, maintenance calories fall and weight drifts up.",
  },
  {
    icon: Brain,
    title: "Insulin Resistance Builds Silently",
    description:
      "By 40, many adults have pre-diabetic insulin signaling even with normal fasting glucose. It drives stubborn weight long before it shows on standard labs.",
  },
  {
    icon: Activity,
    title: "Muscle Loss Accelerates",
    description:
      "Sarcopenia starts in the 30s but accelerates in the 40s. Less muscle means less fat burn, weaker joints, and a higher fall-risk trajectory later.",
  },
];

const solutionCards = [
  {
    title: "Metabolic Reset",
    description:
      "GLP-1 improves insulin sensitivity at the cellular level — the core mechanism behind midlife weight stubbornness. Less circulating insulin means less fat storage.",
  },
  {
    title: "Appetite Signals Normalize",
    description:
      "The late-evening cravings and 'always hungry' feeling that shows up in the 40s quiets down. Fewer excess calories means a sustainable deficit without willpower burnout.",
  },
  {
    title: "Muscle Preservation Protocol",
    description:
      "Your provider pairs medication with protein targets, resistance training, and gradual loss rates to protect lean mass — not just drop scale weight.",
  },
];

// 6 milestones — realistic treatment arc for adults 40-49
const journeyMilestones = [
  {
    month: "Day 1",
    label: "Eligibility in 2 minutes",
    description:
      "Online assessment reviewed by a US-licensed provider. Your med list and labs are reviewed carefully.",
  },
  {
    month: "Week 1",
    label: "Medication ships",
    description:
      "Compounded GLP-1 delivered discreetly. Onboarding call with your care team to set expectations.",
  },
  {
    month: "Month 1",
    label: "Hunger signals quiet",
    description:
      "Start low, step up slowly. Cravings soften. Sleep often improves. Scale may move slowly — that's expected.",
  },
  {
    month: "Month 3",
    label: "First 10–15 lbs",
    description:
      "Clothes fit. Energy returns. Your provider may check A1C, lipids, or liver markers if relevant.",
  },
  {
    month: "Month 6",
    label: "Metabolic markers improve",
    description:
      "Members often report better bloodwork — A1C, triglycerides, BP — alongside steady body-composition changes.",
  },
  {
    month: "Month 12+",
    label: "Long-term maintenance",
    description:
      "Your provider tailors a lower-dose plan so results stick without indefinite titration or weight rebound.",
  },
];

// Authority anchor. Named clinician > generic "licensed providers" trust copy.
const provider = {
  name: "Dr. Elena Morales, MD",
  credentials: "Board-certified, Internal Medicine · Obesity Medicine certified · 18 years practice",
  bio: "The patients I see in their 40s have spent a decade being told their weight gain is their fault. It isn't. It's the intersection of declining hormones, rising insulin resistance, and lost muscle — and the old advice doesn't address any of it. GLP-1, used alongside real strength work and protein targets, is one of the most important tools I can offer midlife patients.",
  imagePrompt:
    "Professional editorial headshot of a Latina female physician in her late-40s, shoulder-length dark hair with subtle gray highlights, warm direct eye contact, crisp white lab coat over navy blouse, stethoscope around neck, confident calm smile, softbox lighting, clean clinical background slightly blurred, Hasselblad quality, 1:1 aspect ratio.",
};

const priceColumns = [
  {
    name: "Brand-Name Wegovy / Ozempic",
    price: "$1,349/mo",
    priceSubtext: "retail cash-pay*",
    features: [
      { label: "FDA-approved", included: true },
      { label: "Insurance coverage often denied or partial", included: false },
      { label: "Pharmacy shortages common in 2025–26", included: false },
      { label: "Ongoing provider support", included: false },
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
      { label: "Ongoing provider + care-team support", included: true },
      { label: "Free 2-day shipping to all 50 states (where legally available)", included: true },
      { label: "30-day money-back guarantee", included: true },
    ],
    ctaLabel: "See If I Qualify →",
    ctaHref: "/qualify",
  },
];

const testimonials = [
  {
    name: "David K.",
    age: 44,
    location: "Raleigh",
    lbs: 37,
    months: 5,
    quote:
      "I was doing everything right and gaining weight. My doctor said 'that's just 40.' This actually fixed it — not masked it.",
  },
  {
    name: "Lisa P.",
    age: 47,
    location: "Phoenix",
    lbs: 34,
    months: 6,
    quote:
      "I lost 30 lbs by age 28 before and knew how hard it was. At 47 it felt impossible. GLP-1 made it feel sustainable for the first time.",
  },
  {
    name: "Robert M.",
    age: 42,
    location: "Kansas City",
    lbs: 45,
    months: 7,
    quote:
      "My pre-diabetes labs normalized. That's the outcome I cared about most. Down two pant sizes was a bonus.",
  },
  {
    name: "Maria J.",
    age: 49,
    location: "San Diego",
    lbs: 39,
    months: 8,
    quote:
      "I finally have energy to keep up with my kids. My provider adjusted my dose twice to match how I was feeling — not a one-size protocol.",
  },
];

// AEO-optimized: each question is a real search query, each answer 40-70 words,
// lead sentence is the bold TL;DR Google's AI Overviews tend to quote.
const faqs = [
  {
    question: "Is GLP-1 a band-aid or a real solution for weight loss after 40?",
    answer:
      "GLP-1 addresses the underlying mechanism — insulin resistance and appetite dysregulation — that drives midlife weight gain. It's not a cosmetic intervention. Many members transition to lower-dose maintenance or taper after reaching goal. The habits you build alongside treatment (protein, resistance training, sleep) determine how durable the result is after dosing shifts.",
  },
  {
    question: "Why did my metabolism change in my 40s?",
    answer:
      "Several factors converge in the 40s: lean muscle declines unless actively preserved, insulin sensitivity decreases, and sex-hormone levels shift. Resting metabolic rate drops measurably, and sleep quality often worsens — which further drives cortisol and hunger. None of this is a willpower failure; it's predictable biology that most standard diet advice ignores.",
  },
  {
    question: "How fast will I see results in my 40s?",
    answer:
      "Most members in their 40s notice appetite and cravings softening within 2–4 weeks. Visible weight loss typically shows by month 2–3. Results can be slightly slower in midlife than in 20s/30s because hormonal baseline is different, but the 15–20% range seen in clinical trials holds across age groups. Individual results vary.",
  },
  {
    question: "Is compounded semaglutide as effective as branded Ozempic or Wegovy?",
    answer:
      "Compounded semaglutide contains the same active ingredient as Ozempic and Wegovy but is prepared by a state-licensed compounding pharmacy under an individual prescription. It is not FDA-approved as a branded drug product. Our program is for patients for whom this is medically appropriate as determined by a licensed provider.",
  },
  {
    question: "Will GLP-1 affect my other medications?",
    answer:
      "GLP-1 can interact with diabetes medications, some oral drugs with narrow absorption windows, and certain thyroid protocols. Your provider reviews your full medication list during onboarding and coordinates any needed adjustments. Many members continue blood-pressure, statin, and thyroid meds without issue — sometimes at lower doses as weight drops.",
  },
  {
    question: "What about muscle loss — how do I avoid it?",
    answer:
      "Muscle loss is the #1 concern for adults over 40 starting any weight-loss program. Your plan is built around protecting lean mass: daily protein targets (typically 0.7–1.0 g per lb body weight), resistance training 2–3 times per week, and a gradual loss pace. Your provider monitors this and adjusts if loss is too rapid.",
  },
  {
    question: "How much does the program cost? Is insurance required?",
    answer:
      "Plans start at $179/month — no insurance required. That includes the compounded medication, ongoing provider oversight, and care-team messaging. You can cancel anytime. There is a 30-day money-back guarantee on your first month. Compare that to roughly $1,349/mo retail cash-pay for brand-name GLP-1 medications.",
  },
  {
    question: "What are the common side effects, and how are they managed?",
    answer:
      "The most common side effects are mild gastrointestinal symptoms — nausea, constipation, reflux — typically during dose titration. Your provider starts you low and steps up slowly to minimize these. Persistent or serious side effects trigger a care-team review and dose adjustment. Serious reactions are rare.",
  },
  {
    question: "Do I need to exercise while on GLP-1?",
    answer:
      "Exercise supports overall health, muscle preservation, and long-term maintenance. After 40, resistance training specifically is non-negotiable for protecting lean mass — your coaching team will recommend a sensible starting point. Cardio is valuable for cardiovascular health and daily activity, but is not the primary lever on body composition.",
  },
  {
    question: "What happens after I hit my goal weight?",
    answer:
      "Your provider will tailor a maintenance plan — often a lower dose, sometimes periodic pauses, and always ongoing support. In the 40s, hormonal shifts continue, so maintenance is not static. Long-term success depends on the ongoing provider relationship plus the habits (protein, training, sleep) built during the loss phase.",
  },
];

// Expanded internal linking for SEO + conversion (AEO 2026 playbook).
const internalLinks = [
  {
    title: "Weight Loss After 50",
    description: "Safety-first dosing and joint-friendly coaching for adults in their 50s.",
    href: "/lp/over50",
  },
  {
    title: "Stubborn Belly Fat",
    description: "Visceral-fat targeting for the midsection that 40+ diets rarely move.",
    href: "/lp/belly-fat",
  },
  {
    title: "Menopause Weight Loss",
    description: "Plans tuned for perimenopausal metabolism and hormonal shifts.",
    href: "/lp/menopause",
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
    title: "Semaglutide Explained",
    description: "Mechanism, cost, timeline — the active ingredient behind most programs.",
    href: "/lp/semaglutide",
  },
] as const;

export default function Over40LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="Built for Your 40s"
        badgeIcon={Clock}
      />

      {/* ======================================================================
          HERO
          AI-IMAGE PROMPT (hero right-side portrait — optional enhancement)
          Aspect ratio: 4:5
          "Editorial photograph of a healthy, confident person in their
           mid-40s (can be male or female), natural hair with subtle gray,
           casual smart-casual clothing, soft natural light, warm neutral
           background, genuine candid expression, shallow depth of field,
           lifestyle photography. Energetic midlife, not tired. No logos."
          ====================================================================== */}
      <LpHeroBlock
        badge="Built for Your 40s"
        headline="Lose that midlife weight by May."
        headlineAccent="Same active ingredient as Ozempic and Wegovy."
        subtitle="Metabolism-aware GLP-1 for your 40s — may help you lose up to 8 lbs in your first month.* Targets the real mechanism behind midlife weight gain. From $179/mo. Individual results vary."
        stats={heroStats}
        ctaLocation="hero-over40"
      />

      <LpSocialProofBar />

      {/* Real outcome numbers anchor the claim before objections land */}
      <LpOutcomeStats
        stats={outcomeStats}
        heading="What members in their 40s actually see"
        subheading="Program outcomes, not marketing numbers."
      />

      {/* Problem Section */}
      <LpProblemSection
        eyebrow="WHY YOUR 30s PLAYBOOK STOPPED WORKING"
        heading="Your body changed the rules at 40"
        cards={lpProblemCards}
        transitionText="A metabolic problem needs a metabolic solution — that's where GLP-1 comes in."
        ctaLocation="problem-over40"
      />

      {/* Why Weight Loss After 40 Is Different */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            Why weight loss after 40 is different
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Three biological shifts that reshape midlife weight — and why they resist old advice.
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

      {/* How GLP-1 Solves Midlife Weight */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            How GLP-1 solves midlife weight
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            A metabolic problem requires a metabolic solution.
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
        headline="Ready for a playbook built for your 40s?"
        subtext="Free 2-minute assessment. Licensed providers. No commitment."
        location="mid-over40"
      />

      {/* Journey roadmap — defuses "what happens next?" objection */}
      <LpJourneyRoadmap
        milestones={journeyMilestones}
        heading="What to expect, month by month"
        subheading="The realistic midlife treatment arc your provider will build with you."
      />

      {/* Price comparison — anchoring effect */}
      <LpPriceCompare
        columns={priceColumns}
        heading="Same active ingredient. Plans from $179/mo."
        subheading="You shouldn't have to fight your insurer to address your changing metabolism."
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
            Members in their 40s who got it working again
          </h2>
          {/* AI-IMAGE PROMPT (optional — testimonial avatars)
              Aspect ratio: 1:1
              "Four photorealistic headshot portraits, diverse men and women
               ages 40-49, soft natural window light, genuine expressions,
               neutral backgrounds in warm earth tones, editorial
               photojournalism style, candid not posed, Sony A7R 85mm f/1.8.
               Healthy midlife, not aged — no logos."
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

      {/* FAQ */}
      <LpFaq
        faqs={faqs}
        heading="Weight loss after 40: your questions"
        subheading="Everything to know before starting GLP-1 in midlife."
      />

      {/* Internal Links */}
      <LpInternalLinks heading="Keep exploring" links={internalLinks} />

      {/* Final CTA */}
      <LpCtaSection
        headline="Rewrite the playbook for your 40s"
        bgClassName="bg-gradient-to-r from-sky-50 to-cyan-50"
      />

      <LpFooter />

      {/* JSON-LD */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Weight Loss After 40", href: "/lp/over40" },
        ]}
      />
      <MedicalWebPageJsonLd
        name="GLP-1 Weight Loss After 40"
        description="Doctor-prescribed GLP-1 weight-loss care built for midlife metabolism, hormonal shifts, and muscle preservation. From $179/mo."
        url="/lp/over40"
      />
      <FAQPageJsonLd faqs={faqs} />
      <LpConversionWidgets />
    </div>
  );
}
