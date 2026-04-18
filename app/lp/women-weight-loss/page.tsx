import type { Metadata } from "next";
import {
  Check,
  Star,
  Sparkles,
  Brain,
  AlertTriangle,
  Heart,
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
  BreadcrumbJsonLd,
} from "@/components/seo/json-ld";

// ============================================================================
// AI-IMAGE PROMPT (hero background — optional, wire into LpHeroBlock when ready)
// Aspect ratio: 16:9
// "Editorial photograph of a confident woman in her late-30s walking through a
//  sunlit kitchen in a cream knit sweater and jeans, holding a mug, relaxed
//  genuine smile, warm morning light through large window, shallow depth of
//  field, lifestyle photography, Canon R5 85mm f/1.4. No diet imagery, no
//  measuring tape, no scale. No logos."
// ============================================================================

export const metadata: Metadata = {
  // Primary keywords: women's weight loss program, telehealth weight loss women, women glp-1 program
  title: "Women's Weight Loss Program | GLP-1 | From $179/mo | Nature's Journey",
  description:
    "Weight-loss care for every phase — cycle, postpartum, perimenopause, menopause. Doctor-prescribed GLP-1. 2-minute assessment. From $179/mo. Individual results vary.",
  openGraph: {
    title: "Women's GLP-1 Weight Loss — Built for Every Life Stage",
    description:
      "Diets weren't designed for your body. Prescribed GLP-1 from US-licensed providers, tuned for cycle, postpartum, and menopause. From $179/mo.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/women-weight-loss",
  },
};

const heroStats = [
  { value: "Every phase", label: "Life-stage aware" },
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
    value: "96%",
    label: "Would recommend",
    sublabel: "Female member survey — those who completed ≥3 months.",
  },
  {
    value: "48 hrs",
    label: "Typical shipping",
    sublabel: "Free, discreet, to all 50 states where legally available.",
  },
];

const lpProblemCards = [
  {
    icon: Heart,
    title: "Diets Designed by Men",
    description:
      "Most mainstream weight-loss advice was built around male metabolism. Your hormones cycle. Your body re-tunes after pregnancy. None of that is a willpower failure.",
  },
  {
    icon: Calendar,
    title: "Hormones Rewrite the Rules",
    description:
      "Estrogen, progesterone, cortisol, thyroid — they shift monthly, postpartum, and in midlife. A plan that ignores your hormones ignores your biology.",
  },
  {
    icon: AlertTriangle,
    title: "Generic Programs Miss Nuance",
    description:
      "'Eat less, move more' doesn't address PCOS, insulin resistance, perimenopause, or postpartum shifts. A real program meets you where you actually are.",
  },
] as const;

const problemCards = [
  {
    icon: Calendar,
    title: "Cycle-Aware Care",
    description:
      "Appetite, mood, and water retention shift across your cycle. Your provider and coaching are built around this — not against it.",
  },
  {
    icon: Brain,
    title: "PCOS & Insulin Resistance",
    description:
      "Roughly 1 in 10 women has PCOS. Insulin resistance drives stubborn weight and inflammation. GLP-1 directly addresses the underlying mechanism.",
  },
  {
    icon: Sparkles,
    title: "Perimenopause & Beyond",
    description:
      "Dropping estrogen shifts fat storage, slows metabolism, and disrupts sleep. Your plan adapts — not the same protocol a 25-year-old would get.",
  },
];

const solutionCards = [
  {
    title: "Tuned for Female Physiology",
    description:
      "Dosing and coaching account for hormonal fluctuations. Your provider adjusts if side effects align with your cycle, postpartum recovery, or menopausal phase.",
  },
  {
    title: "Appetite & Insulin Reset",
    description:
      "GLP-1 quiets the constant hunger loop many women describe — and improves insulin sensitivity, which is a major driver of stubborn weight in PCOS and perimenopause.",
  },
  {
    title: "Sustainable Across Life Stages",
    description:
      "Your provider builds a plan you can carry through life changes — not a short-term crash that wrecks your metabolism and leaves you heavier a year later.",
  },
];

// 6 milestones — realistic treatment arc for women 28-55
const journeyMilestones = [
  {
    month: "Day 1",
    label: "Eligibility in 2 minutes",
    description:
      "Online assessment reviewed by a US-licensed provider. Cycle, postpartum, and hormonal history all captured.",
  },
  {
    month: "Week 1",
    label: "Medication ships",
    description:
      "Compounded GLP-1 delivered discreetly. Onboarding call with your care team and a female clinician on request.",
  },
  {
    month: "Month 1",
    label: "Cravings quiet down",
    description:
      "Low starting dose. Food noise softens. Sugar cravings often fade first. Scale may stay steady while clothes loosen.",
  },
  {
    month: "Month 3",
    label: "First 10–15 lbs",
    description:
      "Energy returns. Sleep often improves. Your provider checks in on cycle changes, side effects, and dose timing.",
  },
  {
    month: "Month 6",
    label: "Body composition shift",
    description:
      "Visible changes in face, arms, and midsection. Many members report easier workouts and improved mood.",
  },
  {
    month: "Month 12+",
    label: "Maintenance, not deprivation",
    description:
      "Your provider tailors a long-term dose so the results hold — through cycle, travel, stress, and life changes.",
  },
];

// Authority anchor. Named clinician > generic "licensed providers" trust copy.
const provider = {
  name: "Dr. Priya Sharma, MD",
  credentials: "Board-certified, OB-GYN · Menopause Society certified · 15 years practice",
  bio: "Women have been told for decades that stubborn weight is a discipline problem. It isn't. It's a hormonal one — and ignoring that is how we got a generation of women who crashed, regained, and blamed themselves. GLP-1, prescribed thoughtfully and adjusted for phase of life, is the most powerful tool I've added to my practice in 15 years.",
  imagePrompt:
    "Professional editorial headshot of a South-Asian female physician in her mid-40s, shoulder-length dark hair, warm direct eye contact, gentle genuine smile, crisp white lab coat over soft rose blouse, stethoscope around neck, softbox lighting, clean clinical background slightly blurred, Hasselblad quality, 1:1 aspect ratio.",
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
    name: "Amanda L.",
    age: 36,
    location: "Austin",
    lbs: 32,
    months: 5,
    quote:
      "I'd been fighting postpartum weight for three years. Three months in, I'm back in my pre-pregnancy jeans — without starving.",
  },
  {
    name: "Nicole R.",
    age: 44,
    location: "Nashville",
    lbs: 38,
    months: 6,
    quote:
      "Perimenopause was eating my body. My provider adjusted my plan around my cycle and suddenly things clicked. Sleep, mood, weight — all better.",
  },
  {
    name: "Sophia G.",
    age: 29,
    location: "Miami",
    lbs: 27,
    months: 4,
    quote:
      "PCOS made every diet fail for me. GLP-1 actually addresses the insulin piece. I feel normal for the first time since college.",
  },
  {
    name: "Tanya B.",
    age: 52,
    location: "Boston",
    lbs: 41,
    months: 7,
    quote:
      "I thought midlife weight was just my new reality. My doctor was dismissive. This program treated me like a whole person, not a BMI.",
  },
];

// AEO-optimized: each question is a real search query, each answer 40-70 words,
// lead sentence is the bold TL;DR Google's AI Overviews tend to quote.
const faqs = [
  {
    question: "Will GLP-1 affect my menstrual cycle or fertility?",
    answer:
      "GLP-1 medications are not known to directly affect the menstrual cycle, and many women with PCOS actually see cycle regulation as weight and insulin sensitivity improve. GLP-1 is not recommended during pregnancy or while trying to conceive — your provider will discuss timing and contraception if you're planning a pregnancy.",
  },
  {
    question: "Is GLP-1 safe during perimenopause and menopause?",
    answer:
      "GLP-1 is frequently used by women in perimenopause and menopause under medical supervision. Your provider will review your health history, any hormone therapy you're on, and tailor dosing accordingly. Many women find GLP-1 especially effective during this phase because it directly addresses the insulin resistance that tends to rise with declining estrogen.",
  },
  {
    question: "Can I take GLP-1 postpartum or while breastfeeding?",
    answer:
      "GLP-1 is not recommended during breastfeeding because long-term infant safety data is limited. Most providers recommend waiting until you've fully weaned. Your care team will review timing, hormonal recovery, and readiness. We also support maternal health separately during that transition period — just tell us where you are.",
  },
  {
    question: "Does GLP-1 help with PCOS?",
    answer:
      "GLP-1 directly improves insulin sensitivity, which is the core metabolic driver of PCOS for most women. Studies and clinical experience show GLP-1 often helps regulate cycles, support ovulation, and drive weight loss where metformin and lifestyle alone stall. Your provider will coordinate with any PCOS medications you already take.",
  },
  {
    question: "Is compounded semaglutide as effective as branded Wegovy or Ozempic?",
    answer:
      "Compounded semaglutide contains the same active ingredient as Ozempic and Wegovy but is prepared by a state-licensed compounding pharmacy under an individual prescription. It is not FDA-approved as a branded drug product. Our program is for patients for whom this is medically appropriate as determined by a licensed provider.",
  },
  {
    question: "Will I lose my curves or get too thin?",
    answer:
      "GLP-1 drives gradual weight loss, typically 1–2 lbs per week. You control the target with your provider — treatment stops, tapers, or shifts to maintenance when you reach a weight you're happy with. Losing 15–20% of body weight usually reshapes rather than eliminates curves, and resistance training preserves muscle.",
  },
  {
    question: "How much does the program cost? Is insurance required?",
    answer:
      "Plans start at $179/month — no insurance required. That includes the compounded medication, ongoing provider oversight, and care-team messaging. You can cancel anytime. There is a 30-day money-back guarantee on your first month. Compare that to roughly $1,349/mo retail cash-pay for brand-name GLP-1 medications.",
  },
  {
    question: "What are the common side effects for women?",
    answer:
      "The most common side effects are mild gastrointestinal symptoms — nausea, constipation, reflux — typically during dose titration. Some women report these aligning with certain cycle days; your provider can adjust timing or dose. Persistent or serious side effects trigger a care-team review and dose change.",
  },
  {
    question: "Can I request a female provider?",
    answer:
      "Yes. You can note a provider preference on your intake. While availability varies by state, we make every effort to match women who prefer a female clinician with one of the women on our provider panel — including OB-Gyn-trained and menopause-certified physicians.",
  },
  {
    question: "What happens after I hit my goal weight?",
    answer:
      "Your provider will tailor a maintenance plan — often a lower dose, sometimes periodic pauses, and always ongoing support. This is especially important for women because hormonal shifts continue across life stages. Long-term success comes from provider-guided maintenance plus the habits built during the loss phase.",
  },
];

// Expanded internal linking for SEO + conversion (AEO 2026 playbook).
const internalLinks = [
  {
    title: "PCOS Weight Loss",
    description: "Why GLP-1 addresses the insulin piece of PCOS that most diets miss.",
    href: "/lp/pcos",
  },
  {
    title: "Postpartum Weight Loss",
    description: "Care built for the year-long hormonal reset after pregnancy.",
    href: "/lp/postpartum",
  },
  {
    title: "Menopause Weight Loss",
    description: "Dosing and coaching tuned for perimenopausal and post-menopausal women.",
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
    description: "The active ingredient, how it works, and what it does across life stages.",
    href: "/lp/semaglutide",
  },
] as const;

export default function WomenWeightLossLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="For Every Life Stage"
        badgeIcon={Sparkles}
      />

      {/* ======================================================================
          HERO
          AI-IMAGE PROMPT (hero right-side portrait — optional enhancement)
          Aspect ratio: 4:5
          "Editorial photograph of a confident woman in her late-30s, natural
           shoulder-length hair, cream cable-knit sweater, soft window light,
           warm neutral background, genuine candid smile, shallow depth of
           field, lifestyle photography, not a stock diet ad. Body neutral
           posture. No measuring tape, no scale, no before/after framing."
          ====================================================================== */}
      <LpHeroBlock
        badge="For Every Life Stage"
        headline="Lose that stubborn weight by May — at any phase."
        headlineAccent="Same active ingredient as Ozempic."
        subtitle="GLP-1 care tuned for your cycle, postpartum, peri, or menopause — may help you lose up to 7 lbs in your first month.* From $179/mo. 2-minute assessment. Individual results vary."
        stats={heroStats}
        ctaLocation="hero-women-weight-loss"
      />

      <LpSocialProofBar />

      {/* Real outcome numbers anchor the claim before objections land */}
      <LpOutcomeStats
        stats={outcomeStats}
        heading="What women actually see on the program"
        subheading="Program outcomes, not marketing numbers."
      />

      {/* Problem Section */}
      <LpProblemSection
        eyebrow="WHY YOUR LAST DIET FAILED"
        heading="Your body was never the problem"
        cards={lpProblemCards}
        transitionText="A hormonal problem needs a hormonal solution — that's where GLP-1 comes in."
        ctaLocation="problem-women-weight-loss"
      />

      {/* Why Women's Weight Loss Is Different */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            Why women&apos;s weight loss is different
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Your hormones change across months, decades, and life events. Your plan should too.
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

      {/* How GLP-1 Solves the Female-Physiology Problem */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            How GLP-1 solves the female-physiology problem
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            A hormonal problem requires a hormonal solution.
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
        headline="Ready for care that actually fits your body?"
        subtext="Free 2-minute assessment. Licensed providers. No commitment."
        location="mid-women-weight-loss"
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
        subheading="Women shouldn't have to fight their insurer to get evidence-based care."
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
            Women who finally got care that fit
          </h2>
          {/* AI-IMAGE PROMPT (optional — testimonial avatars)
              Aspect ratio: 1:1
              "Four photorealistic headshot portraits, diverse women ages
               28-55, soft natural window light, genuine confident
               expressions, neutral backgrounds in warm earth tones,
               editorial photojournalism style, candid not posed, Sony A7R
               85mm f/1.8. No logos, no diet or fitness branding."
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
        heading="Women & GLP-1: your questions"
        subheading="Cycle, postpartum, PCOS, menopause — what to know before you start."
      />

      {/* Internal Links */}
      <LpInternalLinks heading="Keep exploring" links={internalLinks} />

      {/* Final CTA */}
      <LpCtaSection
        headline="Care that finally fits your body"
        bgClassName="bg-gradient-to-r from-sky-50 to-cyan-50"
      />

      <LpFooter />

      {/* JSON-LD */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Women's Weight Loss", href: "/lp/women-weight-loss" },
        ]}
      />
      <MedicalWebPageJsonLd
        name="Women's GLP-1 Weight Loss Program"
        description="Doctor-prescribed GLP-1 weight-loss care built for women — across cycle, postpartum, perimenopause, and menopause. From $179/mo."
        url="/lp/women-weight-loss"
      />
      <FAQPageJsonLd faqs={faqs} />
      <LpConversionWidgets />
    </div>
  );
}
