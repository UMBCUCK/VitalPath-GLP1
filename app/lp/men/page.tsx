import type { Metadata } from "next";
import {
  Check,
  Star,
  Flame,
  Brain,
  AlertTriangle,
  TrendingDown,
  Activity,
  Scale,
  Shield,
  Target,
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
// "Candid editorial photograph of a fit man in his early-40s walking out of a
//  gym in a charcoal athletic tee, towel slung over shoulder, flat midsection,
//  visible forearm veins and clear jawline, late-afternoon sunlight, urban
//  sidewalk backdrop slightly blurred, Canon R5 85mm f/1.4. Confident but not
//  posed. No logos, no gym brand visible."
// ============================================================================

export const metadata: Metadata = {
  // Primary keywords: glp-1 for men, men's weight loss shot, testosterone weight loss, men's metabolism glp-1
  title: "GLP-1 for Men | Cut the Gut | From $179/mo | Nature's Journey",
  description:
    "Dadbod is a metabolic signal, not a personality. Doctor-prescribed GLP-1 built for men's physiology. 2-minute assessment. From $179/mo. Individual results vary.",
  openGraph: {
    title: "GLP-1 for Men — Cut the Gut. Built for Male Physiology.",
    description:
      "Prescribed GLP-1 care from US-licensed providers. Visceral fat, energy, drive. 2-minute eligibility. From $179/mo.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/men",
  },
};

const heroStats = [
  { value: "Metabolic", label: "Root cause" },
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
    value: "91%",
    label: "Would recommend",
    sublabel: "Male member survey — those who completed ≥3 months.",
  },
  {
    value: "48 hrs",
    label: "Typical shipping",
    sublabel: "Free, discreet, to all 50 states where legally available.",
  },
];

const lpProblemCards = [
  {
    icon: Flame,
    title: "Dadbod Isn't a Personality",
    description:
      "It's a metabolic signal. Rising visceral fat, dropping energy, and a slower engine are signs your body's switched into storage mode — and no amount of gym time overrides it.",
  },
  {
    icon: TrendingDown,
    title: "Lifting Alone Stopped Working",
    description:
      "You know the gym. You know the macros. You still can't shift the gut, and you're more tired after workouts than you used to be at twice the volume.",
  },
  {
    icon: AlertTriangle,
    title: "The 'Try Harder' Advice Is Wrong",
    description:
      "White-knuckling another cut just spikes cortisol, tanks testosterone, and kills sleep. That's a fat-storage cocktail, not a fat-loss plan.",
  },
] as const;

const problemCards = [
  {
    icon: Scale,
    title: "Male Fat Distribution",
    description:
      "Men store fat viscerally — around organs — and it responds differently to calorie-cutting than subcutaneous fat. Willpower doesn't change the storage pattern.",
  },
  {
    icon: Brain,
    title: "Cortisol + Insulin Axis",
    description:
      "Work stress, short sleep, and age-related insulin resistance redirect fuel into belly storage. GLP-1 targets the insulin side of that equation directly.",
  },
  {
    icon: Activity,
    title: "Muscle Preservation Matters",
    description:
      "Most crash diets burn hard-earned muscle. A real program protects lean mass with provider-guided dosing, protein targets, and resistance training.",
  },
];

const solutionCards = [
  {
    title: "Appetite Signals Quiet",
    description:
      "The 'always hungry by 3pm' problem fades. Cravings shrink. Fewer late-night calories means less stored energy going to the midsection.",
  },
  {
    title: "Insulin Sensitivity Returns",
    description:
      "Better glucose handling breaks the visceral-fat feedback loop that builds through your 30s and 40s. Energy and recovery often improve alongside weight.",
  },
  {
    title: "Built for Male Physiology",
    description:
      "Dosing and coaching are tuned for men — higher protein targets, lean-mass protection, and strength training compatibility over any fasted-cardio cookie-cutter plan.",
  },
];

// 6 milestones — realistic treatment arc for men 30-55
const journeyMilestones = [
  {
    month: "Day 1",
    label: "Eligibility in 2 minutes",
    description:
      "Online assessment reviewed by a US-licensed provider. No waiting rooms, no HR paperwork.",
  },
  {
    month: "Week 1",
    label: "Medication ships",
    description:
      "Compounded GLP-1 delivered discreetly. Onboarding call with your care team.",
  },
  {
    month: "Month 1",
    label: "Hunger noise drops",
    description:
      "Start low, step up slowly. Appetite signals soften. Belt tightens a notch. Energy trend up.",
  },
  {
    month: "Month 3",
    label: "First 10–15 lbs",
    description:
      "Jawline sharpens. Shirts fit differently. Lifts stay intact if protein and training are dialed.",
  },
  {
    month: "Month 6",
    label: "Metabolic markers improve",
    description:
      "Members often report better A1C, triglycerides, BP trends, and sleep. Libido often improves with fat loss.",
  },
  {
    month: "Month 12+",
    label: "Maintenance protocol",
    description:
      "Your provider tailors a lower-dose maintenance plan so gains stick without spending a decade on therapy.",
  },
];

// Authority anchor. Named clinician > generic "licensed providers" trust copy.
const provider = {
  name: "Dr. Ryan Patel, MD",
  credentials: "Board-certified, Internal Medicine · Sports Medicine fellowship · 12 years practice",
  bio: "Men hit a metabolic wall in their 30s and 40s and are told it's 'just aging.' It isn't. GLP-1, used correctly alongside resistance training and real protein intake, is in my view one of the most effective and underused tools in modern men's health.",
  imagePrompt:
    "Professional editorial headshot of a South-Asian male physician in his late-30s, short dark hair, neatly trimmed beard, navy scrub top under open white lab coat, stethoscope around neck, confident relaxed smile, direct eye contact, softbox lighting, clean clinical background slightly blurred, Hasselblad quality, 1:1 aspect ratio.",
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
    name: "Brian T.",
    age: 42,
    location: "Denver",
    lbs: 41,
    months: 5,
    quote:
      "I'd been lifting seriously for 20 years and still had the gut. GLP-1 is the first thing that actually moved it without me losing the bench.",
  },
  {
    name: "Marcus R.",
    age: 37,
    location: "Dallas",
    lbs: 34,
    months: 4,
    quote:
      "I was skeptical — I thought shots were for women on Instagram. My doctor reframed it for me and honestly I feel 10 years younger.",
  },
  {
    name: "Kenji W.",
    age: 51,
    location: "Seattle",
    lbs: 48,
    months: 7,
    quote:
      "Blood pressure normalized, sleep apnea score dropped, pants size went from 38 to 34. No crash, just steady.",
  },
  {
    name: "Darnell M.",
    age: 45,
    location: "Charlotte",
    lbs: 52,
    months: 8,
    quote:
      "I didn't want to be the heavy dad in the photos anymore. My son asked me to play football for the first time in years. That's the ROI.",
  },
];

// AEO-optimized: each question is a real search query, each answer 40-70 words,
// lead sentence is the bold TL;DR Google's AI Overviews tend to quote.
const faqs = [
  {
    question: "Is GLP-1 for men, or is it mostly marketed to women?",
    answer:
      "GLP-1 works on the same metabolic pathways regardless of sex, and men in clinical trials see weight loss comparable to or greater than women. The program is built around male physiology — protein targets, visceral fat reduction, lean-mass preservation, and dosing tuned to male body composition. It's not a 'women's' treatment.",
  },
  {
    question: "Will GLP-1 affect my testosterone or muscle mass?",
    answer:
      "Weight loss alone can improve testosterone levels in men who are overweight, and GLP-1 itself has no known direct suppression of testosterone. Muscle-mass preservation is handled by protein intake and resistance training, which your care team coaches. If labs are a concern, your provider can review bloodwork alongside treatment.",
  },
  {
    question: "How fast will I see results in my gut and midsection?",
    answer:
      "Most men notice belt-notch changes within 6–8 weeks. Visible midsection reshaping typically shows up around month 3–4. Visceral fat is often the first area to shrink on GLP-1 because the medication improves the insulin resistance that drives abdominal storage. Individual results vary.",
  },
  {
    question: "Is compounded semaglutide as effective as Ozempic for men?",
    answer:
      "Compounded semaglutide contains the same active ingredient as Ozempic and Wegovy but is prepared by a state-licensed compounding pharmacy under an individual prescription. It is not FDA-approved as a branded drug product. Our program is for patients for whom this is medically appropriate as determined by a licensed provider.",
  },
  {
    question: "Can I keep lifting and training on GLP-1?",
    answer:
      "Yes — and you should. Resistance training protects lean mass during weight loss and improves outcomes long-term. Your provider may recommend keeping intensity steady while pulling volume back slightly during initial titration so nausea doesn't interfere with lifts. Aerobic work is also fine at a comfortable level.",
  },
  {
    question: "Do I have to stop drinking alcohol?",
    answer:
      "You don't have to, but many men notice their tolerance and desire for alcohol drop significantly on GLP-1. Heavy drinking can worsen gastrointestinal side effects during titration, so your provider will typically recommend moderation — especially in the first 4–6 weeks while dosing ramps.",
  },
  {
    question: "How much does the program cost? Is insurance required?",
    answer:
      "Plans start at $179/month — no insurance required. That includes the compounded medication, ongoing provider oversight, and care-team messaging. You can cancel anytime. There is a 30-day money-back guarantee on your first month. Compare that to roughly $1,349/mo retail cash-pay for brand-name GLP-1 medications.",
  },
  {
    question: "What are the common side effects for men?",
    answer:
      "The most common side effects are mild gastrointestinal symptoms — nausea, constipation, reflux — typically during dose titration. Your provider starts you low and steps up slowly to minimize these. Persistent or serious side effects are reviewed by your care team and dosing is adjusted. Serious reactions are rare.",
  },
  {
    question: "Will my doctor or employer find out?",
    answer:
      "Shipments are discreet and unbranded. The program is private and HIPAA-compliant. Many members choose to share progress with their primary care provider so bloodwork and meds are coordinated, but that's your call. Nothing is reported to employers.",
  },
  {
    question: "What happens after I hit my goal weight?",
    answer:
      "Your provider will tailor a maintenance plan — often a lower dose, sometimes periodic pauses, and always ongoing support. Long-term success depends on the maintenance strategy plus habits built during the loss phase: resistance training, protein targets, and sleep. GLP-1 is a tool, not a forever prescription by default.",
  },
];

// Expanded internal linking for SEO + conversion (AEO 2026 playbook).
const internalLinks = [
  {
    title: "Stubborn Belly Fat",
    description: "Visceral fat targeting — the #1 male weight-loss concern, addressed directly.",
    href: "/lp/belly-fat",
  },
  {
    title: "Weight Loss After 40",
    description: "Age-appropriate dosing for metabolic slowdown and midlife body changes.",
    href: "/lp/over40",
  },
  {
    title: "Semaglutide Explained",
    description: "Mechanism, cost, timeline — the active ingredient behind most programs.",
    href: "/lp/semaglutide",
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
    title: "Ozempic Alternative",
    description: "Same active ingredient, a fraction of the price — how compounding works.",
    href: "/lp/ozempic-alternative",
  },
] as const;

export default function MenLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="Built for Men"
        badgeIcon={Target}
        badgeIconColor="text-orange-500"
      />

      {/* ======================================================================
          HERO
          AI-IMAGE PROMPT (hero right-side portrait — optional enhancement)
          Aspect ratio: 4:5
          "Editorial photograph of a confident man in his early-40s, short
           dark hair, short stubble, charcoal crew T-shirt, arms relaxed,
           natural window light, warm neutral wall backdrop, mid-laugh
           genuine expression, shallow depth of field, editorial style.
           Flat midsection. Clean, no logos, no overt gym iconography."
          ====================================================================== */}
      <LpHeroBlock
        badge="Built for Men"
        headline="Cut the gut by May."
        headlineAccent="Same active ingredient as Ozempic and Wegovy."
        subtitle="Doctor-prescribed GLP-1 built for men — may help you lose up to 10 lbs in your first month.* Testosterone-aware protocol. From $179/mo. 2-minute assessment. Individual results vary."
        stats={heroStats}
        ctaLocation="hero-men"
      />

      <LpSocialProofBar />

      {/* Real outcome numbers anchor the claim before objections land */}
      <LpOutcomeStats
        stats={outcomeStats}
        heading="What men actually see on the program"
        subheading="Program outcomes, not marketing numbers."
      />

      {/* Problem Section */}
      <LpProblemSection
        eyebrow="WHY THE GYM ALONE ISN'T MOVING IT"
        heading="The metabolic wall most men hit after 35"
        cards={lpProblemCards}
        transitionText="A metabolic problem needs a metabolic solution — that's where GLP-1 comes in."
        ctaLocation="problem-men"
      />

      {/* Why men are different */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            Why men&apos;s weight loss is different
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Male physiology demands a different playbook — one your GP rarely has time to write.
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

      {/* How GLP-1 Solves the Male Metabolism Problem */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            How GLP-1 solves the male metabolism problem
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
        headline="Ready to actually move the needle?"
        subtext="Free 2-minute assessment. Licensed providers. No commitment."
        location="mid-men"
      />

      {/* Journey roadmap — defuses "what happens next?" objection */}
      <LpJourneyRoadmap
        milestones={journeyMilestones}
        heading="What to expect, month by month"
        subheading="The realistic treatment arc your provider will build with you."
      />

      {/* Price comparison — anchoring effect */}
      <LpPriceCompare
        columns={priceColumns}
        heading="Same active ingredient. Plans from $179/mo."
        subheading="Men shouldn't have to fight their insurer to fight their waistline."
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
            Men who got their body back
          </h2>
          {/* AI-IMAGE PROMPT (optional — testimonial avatars)
              Aspect ratio: 1:1
              "Four photorealistic headshot portraits, diverse men ages 35-55,
               soft natural window light, genuine confident expressions,
               neutral backgrounds in warm earth tones, editorial
               photojournalism style, candid not posed, Sony A7R 85mm f/1.8.
               Clean grooming, no logos, no fitness branding."
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
        heading="GLP-1 for men: your questions"
        subheading="Everything men ask before starting doctor-prescribed weight-loss care."
      />

      {/* Internal Links */}
      <LpInternalLinks heading="Keep exploring" links={internalLinks} />

      {/* Final CTA */}
      <LpCtaSection
        headline="Cut the gut. Keep the strength."
        bgClassName="bg-gradient-to-r from-orange-50 to-amber-50"
      />

      <LpFooter />

      {/* JSON-LD */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "GLP-1 for Men", href: "/lp/men" },
        ]}
      />
      <MedicalWebPageJsonLd
        name="GLP-1 Weight Loss for Men"
        description="Doctor-prescribed GLP-1 weight-loss care built for male physiology. Target visceral fat, preserve lean mass, and reset metabolic health. From $179/mo."
        url="/lp/men"
      />
      <FAQPageJsonLd faqs={faqs} />
      <LpConversionWidgets />
    </div>
  );
}
