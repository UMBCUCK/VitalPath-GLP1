import type { Metadata } from "next";
import {
  Check,
  Star,
  Clock,
  Heart,
  Brain,
  Sparkles,
  Sun,
  Scale,
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
// "Editorial photograph of a confident woman in her mid-50s in a sunlit
//  home kitchen, warm dusty-rose palette, soft morning light, quiet smile,
//  empty bedrooms implied off-frame, self-possessed body language, Canon
//  R5 50mm f/1.8. Emphasis on the beginning of a new chapter. No logos."
// ============================================================================

export const metadata: Metadata = {
  // Primary keywords: empty nester weight loss, kids gone weight loss,
  // midlife reinvention, women 50 weight loss, GLP-1 post-parenting
  title: "Your Time Now | GLP-1 Weight Loss After the Kids | From $179/mo",
  description:
    "You spent 25 years on them. Now it's your turn. Prescribed GLP-1 may help you lose up to 8 lbs in your first month.* Same active ingredient as Ozempic. From $179/mo.",
  openGraph: {
    title: "Empty Nester Weight Loss — GLP-1 from $179/mo",
    description:
      "The chapter that's finally yours. Prescribed GLP-1 from licensed US providers. Same active ingredient as Ozempic. Individual results vary.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/empty-nester",
  },
};

const heroStats = [
  { value: "Your time", label: "Finally" },
  { value: "15-20%*", label: "Avg weight loss" },
  { value: "$179/mo", label: "Starting at" },
  { value: "4,200+", label: "50+ members" },
];

const outcomeStats = [
  {
    value: "4,200+",
    label: "50+ members",
    sublabel: "A community of women rewriting their next chapter.",
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
    icon: Clock,
    title: "You put yourself last for 25 years",
    description:
      "Now the kids are gone and the weight stayed. That's not your failure — it's what happens when nobody puts you first.",
  },
  {
    icon: Heart,
    title: "Menopause landed on top of it",
    description:
      "Shifting hormones change fat storage, slow metabolism, and make old diets useless. Timing conspired against you.",
  },
  {
    icon: Brain,
    title: "Your friends are on GLP-1. Your doctor won't prescribe it.",
    description:
      "Compounded GLP-1 through telehealth opens the door that a T2D-diagnosis gate keeps locked.",
  },
] as const;

const problemCards = [
  {
    icon: Clock,
    title: "A quarter-century of stress cortisol",
    description:
      "Twenty-five years of carpools, schedules, and sleepless worry leaves a biological signature — stored fat, especially at the waist. Your body adapted to crisis mode.",
  },
  {
    icon: Sun,
    title: "Hormone transition overlap",
    description:
      "Empty nest often coincides with perimenopause and menopause. Falling estrogen shifts where your body stores fat and how it responds to old diet tricks.",
  },
  {
    icon: Scale,
    title: "Muscle loss from years of no time for self",
    description:
      "Sarcopenia accelerates in the 40s and 50s — especially when exercise kept taking a back seat to family. Less muscle means slower metabolism, compounding the weight problem.",
  },
];

const solutionCards = [
  {
    title: "Targets insulin resistance",
    description:
      "Post-menopause, insulin resistance often worsens — driving belly fat and making losses harder. GLP-1 addresses this root driver, not just calories.",
  },
  {
    title: "Quiets stress grazing",
    description:
      "Decades of stress eating created neural patterns. GLP-1 quiets the appetite signals that drove those patterns, giving you space to build new ones.",
  },
  {
    title: "Steady loss you can sustain",
    description:
      "Not a crash diet. A steady, biological tool that works in the background — and keeps working into the next 30 years of your life.",
  },
];

const journeyMilestones = [
  {
    month: "Day 1",
    label: "Eligibility in 2 minutes",
    description:
      "Online assessment reviewed by a US-licensed provider. Share your full health history, including menopause status and any HRT.",
  },
  {
    month: "Week 1",
    label: "Medication ships",
    description:
      "Compounded GLP-1 delivered discreetly. Video onboarding with your care team. Baseline goals set.",
  },
  {
    month: "Month 1",
    label: "First 4-8 lbs",
    description:
      "Cravings quiet. Sleep improves. Early energy returns. The first physical signal that this chapter is different.",
  },
  {
    month: "Month 3",
    label: "First 10-15 lbs. Jeans buy. Friends comment.",
    description:
      "Clothes fit differently. Friends start asking what you're doing. Your body is shifting toward its new baseline.",
  },
  {
    month: "Month 6",
    label: "15-20% total loss. Strangers ask if you've lost weight.",
    description:
      "The cumulative change starts to be visible to everyone. Energy, mood, and confidence often follow.",
  },
  {
    month: "Month 12+",
    label: "Maintenance. New normal. This is who you are now.",
    description:
      "Your provider tailors a long-term dose. Sustained weight becomes sustained identity — the version of you that was always underneath.",
  },
];

const provider = {
  name: "Dr. Vivian Okonkwo, MD",
  credentials: "Internal Medicine · Women's Midlife Health · NAMS-Certified · 18 years practice",
  bio: "I see empty-nesters every week who've spent two decades not looking up. The weight isn't their fault; the tools they were given didn't match their biology. GLP-1 does. This chapter can genuinely be their best one — if they take the tool.",
  imagePrompt:
    "Professional editorial headshot of a 54-year-old Black female physician, natural gray-streaked curls, warm wise smile, white coat over blush blouse with gold pendant, softly lit women's health clinic, natural daylight, Hasselblad quality, 1:1 aspect ratio.",
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
      { label: "Midlife + menopause-aware dosing", included: false },
      { label: "30-day money-back guarantee", included: false },
    ],
  },
  {
    name: "Nature's Journey Your-Time Plan",
    price: "$179/mo",
    priceSubtext: "no insurance needed",
    highlight: true,
    features: [
      { label: "Same active semaglutide molecule", included: true },
      { label: "Compounded by US 503A pharmacy", included: true },
      { label: "No insurance hurdles — flat monthly price", included: true },
      { label: "Ongoing provider + care-team support", included: true },
      { label: "Midlife + menopause-aware dosing", included: true },
      { label: "30-day money-back guarantee", included: true },
    ],
    ctaLabel: "See If I Qualify →",
    ctaHref: "/qualify",
  },
];

const testimonials = [
  {
    name: "Caroline B.",
    age: 54,
    location: "Portland",
    lbs: 32,
    months: 7,
    quote:
      "Youngest left for college in August. Started this in September. I'm different now.",
  },
  {
    name: "Marion K.",
    age: 58,
    location: "Charleston",
    lbs: 38,
    months: 9,
    quote:
      "Twenty-five years of 'I'll start next Monday.' Finally did. Should've done it 20 years ago.",
  },
  {
    name: "Diana R.",
    age: 51,
    location: "Denver",
    lbs: 24,
    months: 5,
    quote:
      "Husband did a double-take last Tuesday. That felt really good.",
  },
  {
    name: "Patricia L.",
    age: 62,
    location: "Naples",
    lbs: 29,
    months: 8,
    quote:
      "Signed up for tennis. Actually play now. At 62. This is unfamiliar territory.",
  },
];

const faqs = [
  {
    question: "Is GLP-1 safe after 50?",
    answer:
      "For most healthy women, yes. GLP-1 is studied and prescribed widely for adults through their 70s. Your provider screens your health history during the eligibility assessment and flags any contraindications. Cardiovascular history, thyroid conditions, and GI conditions are specifically reviewed. Individual results vary.",
  },
  {
    question: "What about menopause?",
    answer:
      "GLP-1 is commonly prescribed for perimenopausal and postmenopausal women. It works independently of estrogen and often helps with menopause-associated weight and visceral fat gain. Your provider may coordinate with your gynecologist or menopause specialist on broader care. Share your full hormone history at intake.",
  },
  {
    question: "HRT compatibility?",
    answer:
      "Generally compatible. Many members are on hormone replacement therapy while using GLP-1. No known direct drug interactions, but share your full medication list during intake. Your provider coordinates with your prescribing clinician on any observations during treatment.",
  },
  {
    question: "Medication stack concerns?",
    answer:
      "Women in their 50s often take multiple medications (thyroid, statins, SSRIs, BP meds, HRT). GLP-1 generally works well alongside these, but your provider reviews the full list during intake. Any adjustments are coordinated with your prescribing clinicians.",
  },
  {
    question: "Muscle loss — how to protect?",
    answer:
      "Important at any age, critical over 50. Your care team includes protein-forward eating guidance (at least 0.8-1g protein per lb ideal bodyweight) and resistance training recommendations. Preserving muscle protects metabolism and mobility for the next 30+ years.",
  },
  {
    question: "Side effects post-50?",
    answer:
      "Most common are mild gastrointestinal symptoms (nausea, constipation, reflux) during dose titration. These usually resolve in 2-3 weeks. Your provider starts low and steps up slowly specifically to minimize side effects. Hydration, fiber, and electrolytes help. Persistent issues are reviewed promptly.",
  },
  {
    question: "Lifetime cost vs brand?",
    answer:
      "At $179/month, the annual cost is roughly $2,148 — compared to brand-name Wegovy or Ozempic at ~$16,000/year retail. Over a 10-year maintenance horizon, that's a meaningful difference. No insurance fights, no pharmacy shortages, no surprise copays.",
  },
  {
    question: "What if I gain the weight back?",
    answer:
      "Weight regain after stopping GLP-1 is common — it's a chronic-condition treatment, not a cure. Many members stay on a lower maintenance dose indefinitely. Your provider builds a maintenance plan that may include dose adjustments, periodic pauses, and habit work to sustain results.",
  },
  {
    question: "Social side of it (friends on it too)?",
    answer:
      "You're not alone. GLP-1 has quietly become mainstream for women 50+. Many members say having friends on the same program accelerated their decision — and their results. Your care team is there for the medical side; your friends can be there for the emotional arc.",
  },
  {
    question: "Long-term?",
    answer:
      "Many members stay on a maintenance GLP-1 dose for years. Sustained weight loss protects cardiovascular health, bone density (via movement), and metabolic health long-term. Your provider builds the long-arc plan with you. The next 30 years can genuinely be your best ones.",
  },
];

const internalLinks = [
  {
    title: "Menopause Weight Loss",
    description: "Hormone-aware GLP-1 protocol for perimenopause and beyond.",
    href: "/lp/menopause",
  },
  {
    title: "Weight Loss Over 50",
    description: "Clinical-focus protocol tuned for metabolic change in midlife+.",
    href: "/lp/over50",
  },
  {
    title: "Women's Weight Loss",
    description: "Programs tuned for hormonal and life-stage changes women face.",
    href: "/lp/women",
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

export default function EmptyNesterLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="Your Time Now"
        badgeIcon={Sparkles}
        badgeIconColor="text-rose-500"
      />

      {/* ======================================================================
          HERO
          AI-IMAGE PROMPT (hero right-side portrait — optional enhancement)
          Aspect ratio: 4:5
          "Editorial portrait of a woman in her mid-50s in a sunlit home,
           cashmere sweater, silver earrings, gentle knowing smile, warm
           dusty-rose palette, shallow depth of field. Body language:
           self-possessed, finally at rest. No logos."
          ====================================================================== */}
      <LpHeroBlock
        badge="Your Time Now"
        headline="Your time starts by May."
        headlineAccent="Same active ingredient as Ozempic."
        subtitle="The kids are launched. The weight you ignored for 25 years finally has your attention. Doctor-prescribed GLP-1 may help you lose up to 8 lbs in your first month.* Same active molecule as Ozempic and Wegovy. From $179/mo. Individual results vary."
        stats={heroStats}
        ctaLocation="hero-empty-nester"
      />

      <LpSocialProofBar />

      <LpOutcomeStats
        stats={outcomeStats}
        heading="What members actually see"
        subheading="Program outcomes, not marketing numbers."
      />

      <LpProblemSection
        eyebrow="WHY THIS CHAPTER, WHY NOW"
        heading="You spent 25 years on them. Now it's finally your turn."
        cards={lpProblemCards}
        transitionText="A biology-driven problem deserves a biological tool — and the time is finally yours."
        ctaLocation="problem-empty-nester"
      />

      {/* Why Empty-Nester Weight Is Different */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            Why empty-nester weight is different
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            It&apos;s not a willpower problem. It&apos;s decades of stacked biology.
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

      {/* How GLP-1 Fits This Chapter */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            How GLP-1 fits this chapter
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            A steady, biology-matched tool for the chapter that&apos;s finally yours.
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
        headline="Ready to finally make it about you?"
        subtext="Free 2-minute assessment. Licensed providers. No commitment."
        location="mid-empty-nester"
      />

      <LpJourneyRoadmap
        milestones={journeyMilestones}
        heading="What to expect, month by month"
        subheading="Your next chapter, paced by your biology — not a crash-diet calendar."
      />

      <LpPriceCompare
        columns={priceColumns}
        heading="Same active ingredient. Plans from $179/mo."
        subheading="Access to GLP-1 shouldn't depend on your insurance — or the kids' college bills."
      />

      <LpProviderCredential
        provider={provider}
        heading="Every plan is overseen by a real clinician"
      />

      {/* Testimonials */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-8">
            Members whose chapter finally started
          </h2>
          {/* AI-IMAGE PROMPT (optional — testimonial avatars)
              Aspect ratio: 1:1
              "Four photorealistic headshot portraits of women ages 51-62,
               warm confident expressions, soft natural window light,
               dusty-rose and cream palettes, editorial photojournalism
               style, candid not posed, Sony A7R 85mm f/1.8. No logos."
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
            Individual experiences. Results not typical. Compounded medications are not FDA-approved.
          </p>
        </div>
      </section>

      <LpFaq
        faqs={faqs}
        heading="Empty-nester weight & GLP-1: your questions"
        subheading="Everything you need to know about using prescribed GLP-1 in midlife."
      />

      <LpInternalLinks heading="Keep exploring" links={internalLinks} />

      <LpCtaSection
        headline="Make this the chapter that was yours."
        bgClassName="bg-gradient-to-br from-rose-50 to-amber-50"
      />

      <LpFooter />

      {/* JSON-LD */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Empty Nester Weight Loss", href: "/lp/empty-nester" },
        ]}
      />
      <MedicalWebPageJsonLd
        name="Empty Nester Weight Loss with GLP-1"
        description="The chapter that's finally yours. Doctor-prescribed GLP-1 may help you lose up to 8 lbs in your first month. Licensed US providers. From $179/mo. Individual results vary."
        url="/lp/empty-nester"
      />
      <FAQPageJsonLd faqs={faqs} />
      <LpConversionWidgets />
    </div>
  );
}
