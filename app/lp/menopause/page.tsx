import type { Metadata } from "next";
import {
  Check,
  Star,
  Moon,
  Flame,
  Activity,
  AlertTriangle,
  TrendingDown,
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
  MedicalConditionJsonLd,
  BreadcrumbJsonLd,
} from "@/components/seo/json-ld";

// ============================================================================
// AI-IMAGE PROMPT (hero background — optional)
// Aspect ratio: 16:9
// "Editorial photograph of a woman in her early-50s walking on a coastal
//  trail at sunrise, wearing cream linen activewear, natural silver
//  highlights in her hair, soft golden backlight, relaxed confident posture,
//  Canon R5 85mm f/1.4. Emphasis on strength and calm, no fitness branding,
//  no logos."
// ============================================================================

export const metadata: Metadata = {
  // Primary keywords: menopause weight gain, perimenopause glp-1, hormone weight gain, estrogen belly fat
  title: "Menopause Weight Loss with GLP-1 | From $179/mo | Nature's Journey",
  description:
    "Menopause stole your metabolism. GLP-1 targets hormonal belly fat driven by estrogen decline. 2-minute assessment. From $179/mo. Individual results vary.",
  openGraph: {
    title: "Menopause Weight Loss — GLP-1 Care From Licensed Providers",
    description:
      "Menopause doesn't have to mean 20 extra pounds. Hormone-aware GLP-1 care. 2-minute eligibility. From $179/mo.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/menopause",
  },
};

const heroStats = [
  { value: "Hormonal", label: "Root cause" },
  { value: "15-20%*", label: "Avg weight loss" },
  { value: "$179/mo", label: "Starting at" },
  { value: "3,100+", label: "Menopause members" },
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
    value: "3,100+",
    label: "Menopause members",
    sublabel: "Perimenopausal and postmenopausal women on active treatment.",
  },
];

const lpProblemCards = [
  {
    icon: TrendingDown,
    title: "Estrogen Decline Shifts Fat Storage",
    description:
      "As estrogen drops, your body redirects fat storage to the midsection. This visceral fat is hormonally driven — and resistant to diet alone.",
  },
  {
    icon: Activity,
    title: "Metabolism Slows 200-300 Cal/Day",
    description:
      "Menopause can lower your basal metabolic rate meaningfully. You gain weight eating the exact same foods you always have.",
  },
  {
    icon: Moon,
    title: "Sleep and Cortisol Compound It",
    description:
      "Hot flashes and disrupted sleep elevate cortisol, which drives belly fat storage. The cycle reinforces itself.",
  },
] as const;

const problemCards = [
  {
    icon: TrendingDown,
    title: "Hormonally Driven Storage",
    description:
      "Lower estrogen changes where your body stores fat — more visceral, more abdominal, more metabolically risky than pre-menopause weight.",
  },
  {
    icon: Flame,
    title: "Muscle Loss Accelerates",
    description:
      "Sarcopenia speeds up at menopause, dropping your resting metabolism further. Protecting lean mass matters more than ever.",
  },
  {
    icon: AlertTriangle,
    title: "Standard Diets Don't Account For It",
    description:
      "Advice written for 30-year-olds fails at 50. Menopause needs a plan that respects the endocrine shift — not ignores it.",
  },
];

const solutionCards = [
  {
    title: "Targets Visceral Fat",
    description:
      "Clinical data suggests GLP-1 reduces visceral (belly) fat more than subcutaneous fat — exactly the fat pattern menopause creates.",
  },
  {
    title: "Appetite Regulation",
    description:
      "GLP-1 quiets the constant low-grade hunger that comes with hormonal shift, making a sustainable deficit actually possible.",
  },
  {
    title: "Muscle-Preservation Protocol",
    description:
      "Your care team emphasizes protein targets and resistance training alongside medication — critical for women over 45.",
  },
];

const journeyMilestones = [
  {
    month: "Day 1",
    label: "Eligibility in 2 minutes",
    description:
      "Online assessment reviewed by a US-licensed provider. Menopause-aware intake.",
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
      "Start low, step up slowly. Appetite signals soften. Midsection bloat often eases.",
  },
  {
    month: "Month 3",
    label: "First 10–15 lbs",
    description:
      "Clothes fit differently. Many members report improved sleep and steadier energy.",
  },
  {
    month: "Month 6",
    label: "Composition shift",
    description:
      "Visceral fat trends down. Bloodwork often improves (A1C, triglycerides, BP).",
  },
  {
    month: "Month 12+",
    label: "Maintenance plan",
    description:
      "Your provider tailors dose for long-term sustainability through this life phase.",
  },
];

const provider = {
  name: "Dr. Helen Marquez, MD",
  credentials: "Board-certified, Internal Medicine · NAMS Certified Menopause Practitioner · 18 years practice",
  bio: "Menopause is not the end of metabolic health — but it is a turning point. Most women I see have been told for years to 'eat less.' That advice stopped working at perimenopause because the biology changed. GLP-1 therapy, paired with muscle-preserving nutrition, is the most meaningful shift I've seen in menopause weight care in my career.",
  imagePrompt:
    "Professional editorial headshot of a Latina female physician in her early-50s, shoulder-length dark hair with subtle silver streaks, warm trustworthy smile, wearing a crisp white lab coat over a soft navy top, stethoscope, softbox lighting, clean clinical background slightly blurred, direct warm eye contact, Hasselblad quality, 1:1 aspect ratio.",
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
      { label: "Menopause-informed provider matching", included: false },
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
      { label: "Menopause-aware intake and HRT review", included: true },
      { label: "Free 2-day shipping to all 50 states (where legally available)", included: true },
      { label: "30-day money-back guarantee", included: true },
    ],
    ctaLabel: "See If I Qualify →",
    ctaHref: "/qualify",
  },
];

const testimonials = [
  {
    name: "Patricia L.",
    age: 54,
    location: "Sarasota",
    lbs: 34,
    months: 7,
    quote:
      "I gained 22 pounds in two years and couldn't figure out why — I hadn't changed anything. GLP-1 finally moved the scale after three diets failed.",
  },
  {
    name: "Renée T.",
    age: 49,
    location: "Minneapolis",
    lbs: 29,
    months: 5,
    quote:
      "Perimenopause hit like a truck. The belly fat I couldn't touch is actually gone, and I sleep through the night for the first time in years.",
  },
  {
    name: "Donna S.",
    age: 58,
    location: "Nashville",
    lbs: 41,
    months: 9,
    quote:
      "My provider coordinated with my HRT specialist from day one. That level of coordination was worth everything — I felt actually supported.",
  },
  {
    name: "Maria C.",
    age: 52,
    location: "San Diego",
    lbs: 37,
    months: 6,
    quote:
      "I felt invisible in my old doctor's office the minute I turned 50. Here, they actually listened to what menopause did to my body.",
  },
];

const faqs = [
  {
    question: "Does GLP-1 work for menopause weight gain?",
    answer:
      "GLP-1 is often highly effective for menopause weight gain because it targets the visceral fat that estrogen decline drives. Standard diets fail in menopause because they ignore the hormonal shift; GLP-1 addresses both the appetite dysregulation and the metabolic slowdown that come with the transition. Individual results vary.",
  },
  {
    question: "Will GLP-1 interact with my HRT (hormone replacement therapy)?",
    answer:
      "No known direct interaction exists between GLP-1 medications and standard HRT formulations. Our intake form flags current HRT use, and your provider will review your full medication list during evaluation. GLP-1 therapy is weight-focused care; it does not replace hormone replacement therapy — the two address different needs.",
  },
  {
    question: "Is this safe if I'm perimenopausal?",
    answer:
      "Yes, for most perimenopausal women. GLP-1 is prescribed based on your health history, BMI, and current medications — your age and menopausal status are considered but aren't by themselves disqualifying. The 2-minute eligibility assessment captures what your provider needs to decide if this is appropriate for you.",
  },
  {
    question: "Will this affect my hormones or hot flashes?",
    answer:
      "GLP-1 is a weight-management medication and does not directly change estrogen or progesterone levels. Some members report improved sleep and reduced hot-flash intensity as their weight trends down — a well-documented secondary effect of weight loss — but this is not guaranteed. Individual results vary.",
  },
  {
    question: "Why do standard diets stop working in menopause?",
    answer:
      "Menopause lowers your basal metabolic rate by roughly 200-300 calories per day, accelerates muscle loss, and shifts fat storage toward the midsection. Diets written around younger metabolism don't account for any of that. You need a plan that respects the endocrine change — which is exactly what a provider-guided GLP-1 protocol does.",
  },
  {
    question: "How does GLP-1 target belly fat specifically?",
    answer:
      "GLP-1 reduces overall body fat, and clinical trials suggest it reduces visceral (belly) fat more than subcutaneous fat. Because menopause preferentially adds visceral fat, GLP-1 tends to work on exactly the pattern menopause created. Your provider can discuss expected body-composition changes during evaluation.",
  },
  {
    question: "What about muscle loss — will GLP-1 make it worse?",
    answer:
      "Any weight loss risks some lean-mass loss. That's why our menopause protocol emphasizes high-protein nutrition, resistance training, and a slow, sustainable loss rate rather than rapid drops. Your care team actively coaches on protecting muscle — especially important for women over 45.",
  },
  {
    question: "How much does the program cost? Is insurance required?",
    answer:
      "Plans start at $179/month — no insurance required. That includes the compounded medication, ongoing provider oversight, and care-team messaging. You can cancel anytime. There is a 30-day money-back guarantee on your first month. Compare that to roughly $1,349/mo retail cash-pay for brand-name GLP-1 medications.",
  },
  {
    question: "Is compounded semaglutide as effective as Ozempic in menopause?",
    answer:
      "Compounded semaglutide contains the same active ingredient as Ozempic and Wegovy but is prepared by a state-licensed compounding pharmacy under an individual prescription. It is not FDA-approved as a branded drug product. Our program is for patients for whom this is medically appropriate as determined by a licensed provider.",
  },
  {
    question: "Can I cancel anytime, and what if I don't qualify?",
    answer:
      "You can cancel anytime with no long-term commitment. If a licensed provider determines you are not eligible — for safety, contraindications, or health history — you are not charged for medication. The 2-minute eligibility assessment is free and non-binding.",
  },
];

const internalLinks = [
  {
    title: "PCOS Weight Loss",
    description: "Insulin-aware GLP-1 protocols for women with PCOS.",
    href: "/lp/pcos",
  },
  {
    title: "Weight Loss After 50",
    description: "Age-appropriate GLP-1 protocols for metabolic change at midlife.",
    href: "/lp/over50",
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
    description: "From online intake to delivery — the full menopause-informed care path.",
    href: "/how-it-works",
  },
  {
    title: "Menopause Belly Fat (Blog)",
    description: "Why midlife weight gain is different — and what the evidence shows.",
    href: "/blog/menopause-belly-fat",
  },
] as const;

export default function MenopauseLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="Menopause-Informed Care"
        badgeIcon={Moon}
        badgeIconColor="text-purple-500"
      />

      {/* ======================================================================
          HERO
          AI-IMAGE PROMPT (hero right-side portrait — optional enhancement)
          Aspect ratio: 4:5
          "Editorial photograph of a confident woman in her early-50s, natural
           silver streaks in dark hair, wearing a soft cashmere sweater, warm
           neutral background, natural side light, genuine relaxed laugh,
           shallow depth of field, editorial style. Body language: hand gently
           to chin, grounded. Clean, warm palette, no logos, no overt
           medical iconography."
          ====================================================================== */}
      <LpHeroBlock
        badge="Menopause-Aware GLP-1 Care"
        headline="Lose that stubborn menopause weight by May."
        headlineAccent="Same active ingredient as Ozempic."
        subtitle="Hormone-aware GLP-1 care — may help you lose up to 7 lbs in your first month.* Works with estrogen shifts, not against them. From $179/mo. Individual results vary."
        stats={heroStats}
        ctaLocation="hero-menopause"
      />

      <LpSocialProofBar />

      <LpOutcomeStats
        stats={outcomeStats}
        heading="What members actually see"
        subheading="Program outcomes, not marketing numbers."
      />

      <LpProblemSection
        eyebrow="WHY MENOPAUSE CHANGED YOUR BODY"
        heading="Menopause stole your metabolism"
        cards={lpProblemCards}
        transitionText="A hormonal shift needs a hormonally informed plan — that's where GLP-1 fits."
        ctaLocation="problem-menopause"
      />

      {/* Why Menopause Is Different */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            Why menopause weight loss is different
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Your body changed. Your plan should, too.
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

      {/* How GLP-1 Solves Menopause Weight Gain */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            How GLP-1 addresses menopause weight gain
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            It works <em>with</em> the hormonal shift, not against it.
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
            GLP-1 therapy is weight-focused care; it does not replace hormone replacement therapy. Individual results vary. Compounded medications are not FDA-approved.
          </p>
        </div>
      </section>

      <LpMidCta
        headline="Ready to work with your biology instead of fighting it?"
        subtext="Free 2-minute assessment. Menopause-aware providers. No commitment."
        location="mid-menopause"
      />

      <LpJourneyRoadmap
        milestones={journeyMilestones}
        heading="What to expect, month by month"
        subheading="The realistic menopause treatment arc your provider will build with you."
      />

      <LpPriceCompare
        columns={priceColumns}
        heading="Same active ingredient. Plans from $179/mo."
        subheading="We think menopause-aware GLP-1 care shouldn't depend on your insurer."
      />

      <LpProviderCredential
        provider={provider}
        heading="Every plan is overseen by a real clinician"
      />

      {/* Testimonials */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-8">
            Members rewriting the menopause weight-gain story
          </h2>
          {/* AI-IMAGE PROMPT (optional — testimonial avatars)
              Aspect ratio: 1:1
              "Four photorealistic headshot portraits, diverse women ages
               46-60, natural aging skin, soft window light, genuine relaxed
               expressions, neutral warm backgrounds, editorial
               photojournalism style, candid not posed, Sony A7R 85mm f/1.8.
               No logos, no anti-aging marketing aesthetic."
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
        heading="Menopause & GLP-1: your questions"
        subheading="Everything you need to know about GLP-1 through the menopause transition."
      />

      <LpInternalLinks heading="Keep exploring" links={internalLinks} />

      <LpCtaSection
        headline="Menopause changed the rules. GLP-1 rewrites them."
        bgClassName="bg-gradient-to-r from-sky-50 to-purple-50"
      />

      <LpFooter />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Menopause Weight Loss", href: "/lp/menopause" },
        ]}
      />
      <MedicalWebPageJsonLd
        name="GLP-1 for Menopause Weight Gain"
        description="Menopause-aware GLP-1 care from licensed US providers. Targets hormonal belly fat and metabolic slowdown. From $179/mo."
        url="/lp/menopause"
        medicalAudience="Patient"
      />
      <FAQPageJsonLd faqs={faqs} />
      <MedicalConditionJsonLd
        name="Menopausal Weight Gain"
        alternateName="Perimenopausal Weight Gain"
        description="Weight gain during perimenopause and menopause is driven by declining estrogen, shifting fat storage toward the abdomen, a measurable drop in resting metabolic rate, and sleep disruption. Traditional caloric restriction underperforms in this life stage. GLP-1 receptor agonists may help by improving satiety and insulin sensitivity."
        url="/lp/menopause"
        possibleTreatment="Hormone-aware weight-management therapy using compounded GLP-1 medications (semaglutide or tirzepatide) prescribed by a licensed provider, coordinated with any current HRT and paired with muscle-preservation guidance."
      />
      <LpConversionWidgets />
    </div>
  );
}
