import type { Metadata } from "next";
import {
  Check,
  Star,
  Flower,
  Activity,
  AlertTriangle,
  TrendingDown,
  Heart,
  Shield,
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
// AI-IMAGE PROMPT (hero background — optional)
// Aspect ratio: 16:9
// "Editorial photograph of three diverse women in their 30s-40s sharing a
//  quiet morning walk in a park, athleisure in muted earth tones, genuine
//  unposed laughter, natural golden-hour backlight, Canon R5 85mm f/1.4.
//  Friendship and strength emphasized. No logos, no overt fitness
//  iconography, no 'transformation' framing."
// ============================================================================

export const metadata: Metadata = {
  // Primary keywords: glp-1 for women, women's weight loss telehealth, prescription weight loss women
  title: "GLP-1 Weight Loss for Women | From $179/mo | Nature's Journey",
  description:
    "The scale stopped moving years ago. Weight-loss care designed by women, prescribed for women. 2-minute assessment. From $179/mo. Individual results vary.",
  openGraph: {
    title: "Weight-Loss Care Designed by Women, Prescribed for Women",
    description:
      "Generic diets were built around male metabolism. GLP-1 care built around yours. 2-minute eligibility. From $179/mo.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/women",
  },
};

const heroStats = [
  { value: "Women-led", label: "Care team" },
  { value: "15-20%*", label: "Avg weight loss" },
  { value: "$179/mo", label: "Starting at" },
  { value: "18,000+", label: "Members" },
];

const outcomeStats = [
  {
    value: "15-20%",
    label: "Avg total body weight loss*",
    sublabel: "Clinical-trial range for GLP-1 therapy over 12+ months.",
  },
  {
    value: "4.9/5",
    label: "Member rating",
    sublabel: "From 2,400+ verified women across our program.",
  },
  {
    value: "94%",
    label: "Would recommend",
    sublabel: "Member survey — those who completed ≥3 months.",
  },
];

const lpProblemCards = [
  {
    icon: TrendingDown,
    title: "The Scale Stopped Moving Years Ago",
    description:
      "You've tried every protocol — most written around male metabolism. Women's hormones, cycles, and life phases don't fit that blueprint.",
  },
  {
    icon: Activity,
    title: "Hormones Shift the Goalposts",
    description:
      "Cycles, pregnancy, perimenopause, menopause — your hormonal picture changes every decade. Generic advice doesn't keep up.",
  },
  {
    icon: AlertTriangle,
    title: "You're Told It's Willpower",
    description:
      "It's not. Women face structural metabolic challenges that most weight-loss programs quietly ignore — then blame you when they fail.",
  },
] as const;

const problemCards = [
  {
    icon: Flower,
    title: "Hormonal Reality",
    description:
      "Estrogen, progesterone, thyroid, and insulin all influence where and how you store fat. A plan that ignores any of them is already incomplete.",
  },
  {
    icon: Heart,
    title: "Life Phase Matters",
    description:
      "What works at 28 doesn't work at 42. What works at 42 doesn't work at 55. Care should be calibrated to the phase you're actually in.",
  },
  {
    icon: TrendingDown,
    title: "Muscle Protection",
    description:
      "Women lose muscle faster with age. Any weight-loss plan that doesn't prioritize lean mass is quietly setting up a harder decade ahead.",
  },
];

const solutionCards = [
  {
    title: "Tuned to Women's Biology",
    description:
      "Our providers account for cycle phase, life stage, and hormone profile — not just BMI. Dosing and lifestyle guidance reflect that.",
  },
  {
    title: "Muscle-Preservation Focus",
    description:
      "Protein targets, resistance training, and a sustainable loss rate are built into the protocol — critical for long-term metabolic health.",
  },
  {
    title: "Built for Sustainability",
    description:
      "GLP-1 isn't a crash diet. Your provider builds a loss phase, then a maintenance phase, so what you lose doesn't come roaring back.",
  },
];

const journeyMilestones = [
  {
    month: "Day 1",
    label: "Eligibility in 2 minutes",
    description:
      "Online assessment reviewed by a US-licensed provider. No waiting rooms.",
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
      "Start low, step up slowly. Appetite signals soften. Cravings quiet down.",
  },
  {
    month: "Month 3",
    label: "First 10–15 lbs",
    description:
      "Clothes fit differently. Energy more stable. Confidence often returns first.",
  },
  {
    month: "Month 6",
    label: "Body composition shift",
    description:
      "Muscle preserved alongside fat loss. Bloodwork often improves.",
  },
  {
    month: "Month 12+",
    label: "Maintenance plan",
    description:
      "Your provider tailors dose for long-term sustainability — not rebound.",
  },
];

const provider = {
  name: "Dr. Sarah Whitfield, MD",
  credentials: "Board-certified, Family Medicine · Obesity Medicine diplomate · 15 years practice",
  bio: "Most weight-loss advice was engineered around a 180-pound man in his thirties. My patients are women. They have cycles, pregnancies, perimenopause, thyroid histories, and careers. When care actually accounts for that — and pairs it with medication when appropriate — the results look very different from anything conventional dieting ever delivered.",
  imagePrompt:
    "Professional editorial headshot of a white female physician in her late-40s, shoulder-length chestnut hair with warm highlights, gentle confident smile, wearing a crisp white lab coat over a soft cream blouse, stethoscope, softbox lighting, clean clinical background slightly blurred, direct warm eye contact, competent approachable expression, Hasselblad quality, 1:1 aspect ratio.",
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
      { label: "Women-informed provider matching", included: false },
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
      { label: "Women-led care team and hormone-aware intake", included: true },
      { label: "Free 2-day shipping to all 50 states (where legally available)", included: true },
      { label: "30-day money-back guarantee", included: true },
    ],
    ctaLabel: "See If I Qualify →",
    ctaHref: "/qualify",
  },
];

const testimonials = [
  {
    name: "Jen R.",
    age: 41,
    location: "Seattle",
    lbs: 38,
    months: 6,
    quote:
      "Every program I tried assumed I was a smaller man. This was the first one that asked about my cycle, my thyroid, and my stress — before it prescribed anything.",
  },
  {
    name: "Kiara B.",
    age: 36,
    location: "Atlanta",
    lbs: 31,
    months: 5,
    quote:
      "No 'bikini body' talk. No shame. Just a plan that actually worked around my cycle and my work-travel schedule. That's so rare.",
  },
  {
    name: "Allison D.",
    age: 48,
    location: "Boston",
    lbs: 42,
    months: 7,
    quote:
      "I was worried I'd gain it back when I stopped. My provider walked me through a maintenance plan on day one. That's what made me trust this.",
  },
  {
    name: "Lupe M.",
    age: 33,
    location: "Phoenix",
    lbs: 29,
    months: 4,
    quote:
      "Being coached by a woman who understood what hormone-driven hunger feels like — that alone changed how I see my body.",
  },
];

const faqs = [
  {
    question: "Is GLP-1 effective for women's weight loss?",
    answer:
      "Yes — GLP-1 is one of the most effective weight-loss interventions documented in modern medicine, and clinical trials include large numbers of women. The medication works with your hormones rather than ignoring them, which is why it often succeeds where generic diet programs, written around male metabolism, have stalled for years. Individual results vary.",
  },
  {
    question: "Will I gain all the weight back when I stop taking GLP-1?",
    answer:
      "This is the most common concern — and a legitimate one. Research does show weight regain is likely if GLP-1 is stopped abruptly with no plan. Our providers build a structured maintenance phase — often a lower dose, combined with muscle-preservation habits built during the loss phase — so results are more durable. Individual results vary.",
  },
  {
    question: "How does GLP-1 account for my menstrual cycle?",
    answer:
      "GLP-1 itself works independently of your cycle, but our providers factor cycle-related appetite shifts, fluid retention, and energy changes into guidance. Expect weight to fluctuate a few pounds across your cycle — this is normal water weight, not fat, and the medication's effect is still cumulative month over month.",
  },
  {
    question: "Is this appropriate during pregnancy or breastfeeding?",
    answer:
      "No. GLP-1 is generally not appropriate if you are trying to conceive, pregnant, or breastfeeding. Your provider will review your status during intake. If future pregnancy is part of your plan, your provider will discuss timing — most advise stopping GLP-1 at least 2 months before attempting conception.",
  },
  {
    question: "How is this different from my doctor just prescribing Ozempic?",
    answer:
      "Many primary-care providers prescribe GLP-1 but aren't trained specifically in obesity medicine or women's health. Our care team specializes in weight management and coordinates with your OB-GYN, endocrinologist, or PCP when relevant. You also get ongoing provider messaging — not one appointment and a prescription.",
  },
  {
    question: "Will GLP-1 make me lose muscle?",
    answer:
      "Any weight loss risks some lean-mass loss. That's why our protocol emphasizes protein targets (typically 0.7-1g per pound of goal weight), resistance training, and a sustainable loss rate rather than rapid drops. Your care team actively coaches on protecting muscle — this is especially critical for women long-term.",
  },
  {
    question: "What about side effects specific to women?",
    answer:
      "The most common side effects — mild nausea, constipation, reflux — are not sex-specific. Some women report slight cycle changes during initial titration; these typically normalize. If you have a thyroid, gallbladder, or pancreatic history, your provider will review carefully during intake — those warrant extra attention regardless of sex.",
  },
  {
    question: "How much does the program cost? Is insurance required?",
    answer:
      "Plans start at $179/month — no insurance required. That includes the compounded medication, ongoing provider oversight, and care-team messaging. You can cancel anytime. There is a 30-day money-back guarantee on your first month. Compare that to roughly $1,349/mo retail cash-pay for brand-name GLP-1 medications.",
  },
  {
    question: "Is compounded semaglutide as effective as brand-name Ozempic?",
    answer:
      "Compounded semaglutide contains the same active ingredient as Ozempic and Wegovy but is prepared by a state-licensed compounding pharmacy under an individual prescription. It is not FDA-approved as a branded drug product. Our program is for patients for whom this is medically appropriate as determined by a licensed provider.",
  },
  {
    question: "Can I cancel anytime, and what if I don't qualify?",
    answer:
      "You can cancel anytime with no long-term commitment. If a licensed provider determines you are not eligible — for safety, contraindications, or pregnancy status — you are not charged for medication. The 2-minute eligibility assessment is free and non-binding.",
  },
];

const internalLinks = [
  {
    title: "PCOS Weight Loss",
    description: "Insulin-aware GLP-1 protocols for women with PCOS.",
    href: "/lp/pcos",
  },
  {
    title: "Menopause Weight Loss",
    description: "Hormone-aware GLP-1 protocols for perimenopause and menopause.",
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
    title: "How It Works",
    description: "From online intake to delivery — the full women-informed care path.",
    href: "/how-it-works",
  },
  {
    title: "Why Women's Weight Loss Is Different (Blog)",
    description: "The hormone biology most diet programs quietly ignore.",
    href: "/blog/womens-weight-loss-biology",
  },
] as const;

export default function WomenLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="Women-Led Care"
        badgeIcon={Flower}
        badgeIconColor="text-pink-500"
      />

      {/* ======================================================================
          HERO
          AI-IMAGE PROMPT (hero right-side portrait — optional enhancement)
          Aspect ratio: 4:5
          "Editorial photograph of a confident woman in her late-30s, natural
           untouched skin, shoulder-length brown hair, wearing a soft cream
           sweater, standing relaxed against a warm neutral wall, natural
           window light, genuine mid-conversation expression, shallow depth
           of field, editorial style. Body language: arms folded easily,
           slight angle. No logos, no overt 'before/after' aesthetic."
          ====================================================================== */}
      <LpHeroBlock
        badge="Designed By Women, For Women"
        headline="Lose that stubborn weight by May."
        headlineAccent="Same active ingredient as Ozempic and Wegovy."
        subtitle="Female-designed GLP-1 care that works with your biology — may help you lose up to 7 lbs in your first month.* From $179/mo. 2-minute assessment. Individual results vary."
        stats={heroStats}
        ctaLocation="hero-women"
      />

      <LpSocialProofBar />

      <LpOutcomeStats
        stats={outcomeStats}
        heading="What members actually see"
        subheading="Program outcomes, not marketing numbers."
      />

      <LpProblemSection
        eyebrow="WHY WOMEN'S WEIGHT LOSS IS DIFFERENT"
        heading="The scale stopped moving years ago"
        cards={lpProblemCards}
        transitionText="It's not willpower. It's biology most programs quietly ignore — and GLP-1 works with it."
        ctaLocation="problem-women"
      />

      {/* Why Women's Weight Loss Is Different */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            Why women&apos;s weight loss is different
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Your body doesn&apos;t work like a smaller man&apos;s. Your plan shouldn&apos;t either.
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

      {/* How GLP-1 Solves It For Women */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            How our GLP-1 program is built around women
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Medication plus a care model tuned to your biology and life phase.
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
            Individual results vary. Compounded medications are not FDA-approved. GLP-1 is not appropriate during pregnancy or breastfeeding.
          </p>
        </div>
      </section>

      <LpMidCta
        headline="Ready for a plan that actually fits your body?"
        subtext="Free 2-minute assessment. Women-led care team. No commitment."
        location="mid-women"
      />

      <LpJourneyRoadmap
        milestones={journeyMilestones}
        heading="What to expect, month by month"
        subheading="The realistic treatment arc your provider will build with you."
      />

      <LpPriceCompare
        columns={priceColumns}
        heading="Same active ingredient. Plans from $179/mo."
        subheading="We think women-centered GLP-1 care shouldn't depend on your insurer."
      />

      <LpProviderCredential
        provider={provider}
        heading="Every plan is overseen by a real clinician"
      />

      {/* Testimonials */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-8">
            Women who finally got care that fit
          </h2>
          {/* AI-IMAGE PROMPT (optional — testimonial avatars)
              Aspect ratio: 1:1
              "Four photorealistic headshot portraits, diverse women ages
               32-50, natural unretouched skin, soft window light, genuine
               relaxed expressions, neutral warm backgrounds, editorial
               photojournalism style, candid not posed, Sony A7R 85mm f/1.8.
               No logos, no diet-culture marketing aesthetic."
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
        heading="GLP-1 for women: your questions"
        subheading="Everything you need to know about care that fits your body."
      />

      <LpInternalLinks heading="Keep exploring" links={internalLinks} />

      <LpCtaSection
        headline="Care designed around your body, not the other way around."
        bgClassName="bg-gradient-to-r from-sky-50 to-pink-50"
      />

      <LpFooter />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Weight Loss for Women", href: "/lp/women" },
        ]}
      />
      <MedicalWebPageJsonLd
        name="GLP-1 Weight Loss for Women"
        description="Women-led GLP-1 care from licensed US providers. Hormone-aware, life-phase-aware, sustainable. From $179/mo."
        url="/lp/women"
        medicalAudience="Patient"
      />
      <FAQPageJsonLd faqs={faqs} />
      <LpConversionWidgets />
    </div>
  );
}
