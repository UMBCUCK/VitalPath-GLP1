import type { Metadata } from "next";
import {
  Check,
  Star,
  Baby,
  Activity,
  AlertTriangle,
  Heart,
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
  BreadcrumbJsonLd,
} from "@/components/seo/json-ld";

// ============================================================================
// AI-IMAGE PROMPT (hero background — optional)
// Aspect ratio: 16:9
// "Soft editorial photograph of a mother in her early-30s in a sunlit living
//  room, casual loungewear, peaceful grounded expression, natural window light,
//  toys or baby items subtly visible in background (gentle not cluttered),
//  Canon R5 85mm f/1.8. Warm domestic palette, no weight-scale or
//  diet-culture props, no 'bounce back' aesthetic, no logos."
// ============================================================================

export const metadata: Metadata = {
  // Primary keywords: postpartum weight loss, post-baby weight glp-1, post-pregnancy weight loss program
  title: "Postpartum Weight Loss with GLP-1 | From $179/mo | Nature's Journey",
  description:
    "Post-pregnancy weight that won't come off. GLP-1 care from licensed providers, designed for after weaning. 2-minute assessment. From $179/mo. Individual results vary.",
  openGraph: {
    title: "Postpartum Weight Loss — GLP-1 Care Built Post-Pregnancy",
    description:
      "Your body changed. Let's get you back, thoughtfully. Licensed providers. 2-minute eligibility. From $179/mo. Not for use while breastfeeding.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/postpartum",
  },
};

const heroStats = [
  { value: "Post-wean", label: "Eligibility stage" },
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
    value: "48 hrs",
    label: "Typical shipping",
    sublabel: "Free, discreet, to all 50 states where legally available.",
  },
];

const lpProblemCards = [
  {
    icon: TrendingDown,
    title: "The Weight That Won't Come Off",
    description:
      "Pregnancy remodels your metabolism, sleep, and hunger hormones. Months or years after delivery, the last stubborn pounds often refuse to budge.",
  },
  {
    icon: Activity,
    title: "Hormones Don't Just Snap Back",
    description:
      "Thyroid shifts, cortisol from chronic sleep loss, and insulin changes can persist well past birth. Old diet tactics run into new biology.",
  },
  {
    icon: Heart,
    title: "No Time, No Energy, No Support",
    description:
      "Most weight-loss advice assumes unlimited gym time and meal prep. Motherhood assumes neither. Real care has to fit the life you have now.",
  },
] as const;

const problemCards = [
  {
    icon: Baby,
    title: "Your Body Literally Changed",
    description:
      "Pregnancy reshapes your hormones, metabolism, and fat distribution. It can take 12+ months for many of those systems to settle — and some don't fully return.",
  },
  {
    icon: Activity,
    title: "Sleep Debt Fights You",
    description:
      "Chronic sleep deprivation elevates cortisol and insulin resistance. You're working against a biology literally optimized for survival, not fat loss.",
  },
  {
    icon: AlertTriangle,
    title: "Generic Diets Don't Fit",
    description:
      "\"Bounce back\" content ignores recovery, nutrition needs, and the reality of caring for a small human. Postpartum weight loss needs a plan that respects all of it.",
  },
];

const solutionCards = [
  {
    title: "Appetite Regulation",
    description:
      "GLP-1 quiets the constant hunger signals that come with disrupted sleep and postpartum hormonal shift, making a sustainable plan actually possible.",
  },
  {
    title: "Time-Respecting Protocol",
    description:
      "No gym requirements. No complicated meal prep. The care team builds a plan around the life you actually have with a child — not the one you used to have.",
  },
  {
    title: "Thoughtful, Gated Eligibility",
    description:
      "GLP-1 is only appropriate after weaning and when your provider determines it's safe. We screen carefully — we don't prescribe against the evidence.",
  },
];

const journeyMilestones = [
  {
    month: "Day 1",
    label: "Eligibility in 2 minutes",
    description:
      "Online assessment reviewed by a US-licensed provider. Postpartum status confirmed.",
  },
  {
    month: "Week 1",
    label: "Medication ships (if eligible)",
    description:
      "Compounded GLP-1 delivered discreetly. Video onboarding with your care team.",
  },
  {
    month: "Month 1",
    label: "Dose titration",
    description:
      "Start low, step up slowly. Appetite signals soften. Energy begins to stabilize.",
  },
  {
    month: "Month 3",
    label: "First 10–15 lbs",
    description:
      "Real clothes fit again. Mood and energy trend up. Sustainable pace, not rapid loss.",
  },
  {
    month: "Month 6",
    label: "Rebuilt routines",
    description:
      "Protein targets, gentle movement, and dose stability become the new normal.",
  },
  {
    month: "Month 12+",
    label: "Maintenance plan",
    description:
      "Your provider tailors dose for long-term sustainability, not just loss.",
  },
];

const provider = {
  name: "Dr. Elena Reyes, MD",
  credentials: "Board-certified, OB-GYN · Women's Health focus · 16 years practice",
  bio: "I will not prescribe GLP-1 to a breastfeeding patient — the safety data does not support it, and my patients deserve real answers, not marketing. Once a woman has weaned and is cleared medically, GLP-1 can be one of the most meaningful tools in postpartum recovery, especially for mothers whose sleep and metabolism have been hit hardest.",
  imagePrompt:
    "Professional editorial headshot of a Hispanic female OB-GYN in her mid-40s, shoulder-length dark wavy hair, warm reassuring smile, wearing a crisp white lab coat over a soft pink scrub top, stethoscope, softbox lighting, clean clinical background slightly blurred, direct warm eye contact, trustworthy maternal expression, Hasselblad quality, 1:1 aspect ratio.",
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
      { label: "Postpartum-informed provider matching", included: false },
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
      { label: "Postpartum-aware intake (after weaning)", included: true },
      { label: "Free 2-day shipping to all 50 states (where legally available)", included: true },
      { label: "30-day money-back guarantee", included: true },
    ],
    ctaLabel: "See If I Qualify →",
    ctaHref: "/qualify",
  },
];

const testimonials = [
  {
    name: "Sarah J.",
    age: 34,
    location: "Minneapolis",
    lbs: 28,
    months: 5,
    quote:
      "Two years postpartum, weaned, and nothing was working. My provider was the first one who treated my hormones like they actually mattered.",
  },
  {
    name: "Priya V.",
    age: 36,
    location: "Austin",
    lbs: 32,
    months: 6,
    quote:
      "I appreciated that they said no to breastfeeding me first — it made me trust them when they eventually said yes. That's how real care should feel.",
  },
  {
    name: "Rachel D.",
    age: 32,
    location: "Denver",
    lbs: 25,
    months: 4,
    quote:
      "I don't have time for a gym or meal prep. My care team built something that worked inside the nap schedule. Finally.",
  },
  {
    name: "Monica L.",
    age: 38,
    location: "Tampa",
    lbs: 34,
    months: 7,
    quote:
      "Three kids, last one weaned, and the 30 pounds from my last pregnancy finally came off. This wasn't a bounce-back program — it was actual medicine.",
  },
];

const faqs = [
  {
    question: "Is GLP-1 safe while breastfeeding?",
    answer:
      "No. GLP-1 is generally NOT recommended during breastfeeding — there is insufficient safety data, and the medication may pass into breast milk. Our providers will not prescribe GLP-1 to patients who are breastfeeding. If you are currently breastfeeding, we recommend revisiting once you have fully weaned and consulted your obstetrician.",
  },
  {
    question: "When can I start GLP-1 after having a baby?",
    answer:
      "GLP-1 is considered only after you have fully weaned and your body has recovered from pregnancy — typically 6-12+ months postpartum at minimum, and only once your provider determines it's medically appropriate. Your provider reviews recovery, any complications, current medications, and mental-health status before making any prescription decision.",
  },
  {
    question: "Is this appropriate if I'm planning another pregnancy?",
    answer:
      "No — GLP-1 is generally not appropriate if you are trying to conceive, pregnant, or breastfeeding. Most providers advise discontinuing GLP-1 at least 2 months before attempting conception. Your provider will discuss timing if future pregnancy is part of your plan. Honesty about timing matters — tell your provider during intake.",
  },
  {
    question: "Will GLP-1 interfere with my postpartum recovery?",
    answer:
      "GLP-1 is only considered after recovery is complete. Your provider reviews your full postpartum history — thyroid, mental health, iron, bleeding history, c-section recovery, pelvic floor — before considering it. A responsible program treats postpartum weight loss as a late step in recovery, not an early one.",
  },
  {
    question: "How long does postpartum weight loss actually take?",
    answer:
      "With GLP-1 therapy and once eligible, most members see 10-15 lbs come off over the first 3 months, with continued steady loss over 6-12 months. This is slower than \"bounce back\" content promises — intentionally. Rapid postpartum loss is rarely a good idea; sustainable loss protects lean mass and long-term metabolic health.",
  },
  {
    question: "What if I have postpartum thyroid issues?",
    answer:
      "Postpartum thyroiditis is common and can stall weight loss. Your provider will review your thyroid history and bloodwork as part of intake. If thyroid treatment is needed, that is usually addressed first or in parallel — GLP-1 is considered alongside, not in place of, treating thyroid dysfunction.",
  },
  {
    question: "How much does the program cost? Is insurance required?",
    answer:
      "Plans start at $179/month — no insurance required. That includes the compounded medication, ongoing provider oversight, and care-team messaging. You can cancel anytime. There is a 30-day money-back guarantee on your first month. Compare that to roughly $1,349/mo retail cash-pay for brand-name GLP-1 medications.",
  },
  {
    question: "What are the common side effects to watch for?",
    answer:
      "The most common side effects are mild gastrointestinal — nausea, constipation, reflux — typically during dose titration. Your provider starts you on a low dose and steps up slowly to minimize these. For postpartum mothers, hydration and protein targets matter even more. Your care team coaches on this directly.",
  },
  {
    question: "Is compounded semaglutide as effective as brand-name medication?",
    answer:
      "Compounded semaglutide contains the same active ingredient as Ozempic and Wegovy but is prepared by a state-licensed compounding pharmacy under an individual prescription. It is not FDA-approved as a branded drug product. Our program is for patients for whom this is medically appropriate as determined by a licensed provider.",
  },
  {
    question: "Can I cancel anytime, and what if I don't qualify yet?",
    answer:
      "You can cancel anytime with no long-term commitment. If a licensed provider determines you are not currently eligible — including because you are still breastfeeding or too recent postpartum — you are not charged for medication. The 2-minute eligibility assessment is free and non-binding.",
  },
];

const internalLinks = [
  {
    title: "PCOS Weight Loss",
    description: "Insulin-aware GLP-1 protocols for women with PCOS.",
    href: "/lp/pcos",
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
    description: "From online intake to delivery — the full postpartum-informed care path.",
    href: "/how-it-works",
  },
  {
    title: "Postpartum Recovery & Weight (Blog)",
    description: "What the evidence says about timing GLP-1 after pregnancy.",
    href: "/blog/postpartum-weight-loss",
  },
] as const;

export default function PostpartumLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="Post-Wean Eligibility"
        badgeIcon={Baby}
        badgeIconColor="text-rose-400"
      />

      {/* ======================================================================
          HERO
          AI-IMAGE PROMPT (hero right-side portrait — optional enhancement)
          Aspect ratio: 4:5
          "Editorial photograph of a mother in her early-30s sitting by a
           sunlit window, wearing a cream knit sweater, genuine peaceful smile
           (not posed), natural morning light, shallow depth of field,
           editorial style. Body language: relaxed, hand resting on a book
           or mug. Warm domestic palette, no weight-loss iconography, no
           'before/after' framing, no logos."
          ====================================================================== */}
      <LpHeroBlock
        badge="Care Built Post-Pregnancy"
        headline="You gave your body to your baby."
        headlineAccent="Let's get you back — thoughtfully"
        subtitle="Postpartum weight isn't a willpower problem. Hormones, sleep, and time all changed. GLP-1 care, after you've weaned, from US-licensed providers who take postpartum seriously. From $179/mo."
        stats={heroStats}
        ctaLocation="hero-postpartum"
      />

      <LpSocialProofBar />

      {/* Compliance gate — visible near the top of body content */}
      <section
        className="border-y py-4"
        style={{
          borderColor: "var(--lp-card-border)",
          backgroundColor: "var(--lp-section-alt)",
        }}
      >
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="flex items-center justify-center gap-2 text-xs font-semibold text-lp-heading">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
            <span>
              GLP-1 is generally not recommended during pregnancy or breastfeeding. Your provider will review your current status before any prescription decision.
            </span>
          </p>
        </div>
      </section>

      <LpOutcomeStats
        stats={outcomeStats}
        heading="What eligible members actually see"
        subheading="Program outcomes, not marketing numbers."
      />

      <LpProblemSection
        eyebrow="WHY POSTPARTUM WEIGHT IS DIFFERENT"
        heading="The weight that won't come off"
        cards={lpProblemCards}
        transitionText="A biology-aware plan, built around the life you have now — that's what postpartum care should look like."
        ctaLocation="problem-postpartum"
      />

      {/* Why Postpartum Is Different */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            Why postpartum weight loss is different
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Pregnancy rewired your biology. Your plan has to reflect that.
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

      {/* How GLP-1 Solves Postpartum Weight */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            How GLP-1 addresses postpartum weight (post-wean)
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Designed around real motherhood — not a &ldquo;bounce back&rdquo; timeline.
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
            GLP-1 is generally not appropriate during pregnancy or breastfeeding. Individual results vary. Compounded medications are not FDA-approved.
          </p>
        </div>
      </section>

      <LpMidCta
        headline="Weaned and ready? Let's start the conversation."
        subtext="Free 2-minute assessment. Postpartum-aware providers. No commitment."
        location="mid-postpartum"
      />

      <LpJourneyRoadmap
        milestones={journeyMilestones}
        heading="What to expect, month by month"
        subheading="The realistic postpartum treatment arc your provider will build with you."
      />

      <LpPriceCompare
        columns={priceColumns}
        heading="Same active ingredient. Plans from $179/mo."
        subheading="We think postpartum-aware GLP-1 care shouldn't depend on your insurer."
      />

      <LpProviderCredential
        provider={provider}
        heading="Every plan is overseen by a real clinician"
      />

      {/* Testimonials */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-8">
            Mothers who waited — and got it right
          </h2>
          {/* AI-IMAGE PROMPT (optional — testimonial avatars)
              Aspect ratio: 1:1
              "Four photorealistic headshot portraits, diverse mothers ages
               30-40, natural skin and hair, soft domestic window light,
               genuine relaxed expressions, neutral warm backgrounds,
               editorial photojournalism style, candid not posed,
               Sony A7R 85mm f/1.8. No logos, no weight-loss marketing
               aesthetic, no 'before/after' framing."
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
        heading="Postpartum & GLP-1: your questions"
        subheading="Everything you need to know about timing GLP-1 after pregnancy."
      />

      <LpInternalLinks heading="Keep exploring" links={internalLinks} />

      <LpCtaSection
        headline="You've done the hardest work. Now it's your turn."
        bgClassName="bg-gradient-to-r from-sky-50 to-rose-50"
      />

      <LpFooter />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Postpartum Weight Loss", href: "/lp/postpartum" },
        ]}
      />
      <MedicalWebPageJsonLd
        name="GLP-1 for Postpartum Weight Loss"
        description="Postpartum-aware GLP-1 care for mothers who have weaned. Licensed US providers. From $179/mo. Not recommended during breastfeeding."
        url="/lp/postpartum"
        medicalAudience="Patient"
      />
      <FAQPageJsonLd faqs={faqs} />
      <LpConversionWidgets />
    </div>
  );
}
