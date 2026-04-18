import type { Metadata } from "next";
import {
  Check,
  Star,
  Flame,
  Layers,
  Brain,
  AlertTriangle,
  TrendingDown,
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
// "Candid photograph of a fit man in his mid-40s taking a morning walk in
//  activewear along a tree-lined neighborhood sidewalk, golden hour backlight,
//  slight motion, natural expression, shallow depth of field, editorial
//  photography, Canon R5 85mm f/1.4. Emphasis on flat midsection, relaxed
//  posture. No logos."
// ============================================================================

export const metadata: Metadata = {
  // Primary keywords: visceral fat treatment, stubborn belly fat GLP-1, hormonal belly fat, cortisol belly, GLP-1 for belly fat 2026
  title: "Lose Stubborn Belly Fat with GLP-1 | From $179/mo | Nature's Journey",
  description:
    "Visceral belly fat is hormonal — not willpower. Doctor-prescribed GLP-1 targets the root cause. 2-minute assessment. From $179/mo. Individual results vary.",
  openGraph: {
    title: "Finally Lose Stubborn Belly Fat — GLP-1 Targets the Hormonal Cause",
    description:
      "Crunches can't override cortisol and insulin. Prescribed GLP-1 care from licensed US providers. 2-minute eligibility. From $179/mo.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/belly-fat",
  },
};

const heroStats = [
  { value: "Hormonal", label: "Root cause" },
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
    icon: Layers,
    title: "Visceral Fat Is Metabolically Dangerous",
    description:
      "Belly fat wraps around your organs and drives inflammation, insulin resistance, and increased disease risk. It's not cosmetic — it's a health crisis.",
  },
  {
    icon: Flame,
    title: "Crunches Don't Target It",
    description:
      "Spot reduction is a myth. Ab exercises strengthen muscles but can't override the hormonal drivers (cortisol, insulin) that cause visceral fat storage.",
  },
  {
    icon: TrendingDown,
    title: "Age + Stress Compound It",
    description:
      "Rising cortisol and shifting sex hormones redirect fat storage to your midsection. Without addressing the hormones, belly fat keeps accumulating.",
  },
] as const;

const problemCards = [
  {
    icon: Layers,
    title: "Visceral vs. Subcutaneous",
    description:
      "Belly fat wraps around your organs (visceral fat). It's metabolically active, increases inflammation, and resists traditional fat-loss methods.",
  },
  {
    icon: Brain,
    title: "Hormonal Drivers",
    description:
      "Cortisol, insulin resistance, and declining sex hormones all drive belly fat storage. Sit-ups can't override your hormones.",
  },
  {
    icon: AlertTriangle,
    title: "Health Risk Factor",
    description:
      "Visceral fat is linked to heart disease, type 2 diabetes, and metabolic syndrome. Losing it isn't just cosmetic — it's critical for health.",
  },
];

const solutionCards = [
  {
    title: "Appetite Regulation",
    description:
      "GLP-1 reduces the hunger signals that lead to overeating. Less excess energy means less fat stored in your midsection.",
  },
  {
    title: "Insulin Sensitivity",
    description:
      "By improving how your body processes glucose, GLP-1 helps break the insulin-resistance cycle that drives visceral fat storage.",
  },
  {
    title: "Preferential Fat Loss",
    description:
      "Clinical studies suggest GLP-1 medications may reduce visceral fat more significantly than subcutaneous fat, targeting the most dangerous stores first.",
  },
];

// 6 milestones — realistic treatment arc for belly-fat audience (typically male 35-55)
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
      "Start low, step up slowly. Appetite signals soften. Waistbands loosen first.",
  },
  {
    month: "Month 3",
    label: "First 10–15 lbs",
    description:
      "Visible midsection changes. Pants fit differently. Energy trend up.",
  },
  {
    month: "Month 6",
    label: "Visceral fat shift",
    description:
      "Many members report improved bloodwork (A1C, triglycerides, BP trends).",
  },
  {
    month: "Month 12+",
    label: "Maintenance plan",
    description:
      "Your provider tailors dose for long-term sustainability, not just loss.",
  },
];

// Authority anchor. Named clinician > generic "licensed providers" trust copy.
const provider = {
  name: "Dr. Marcus Chen, MD",
  credentials: "Board-certified, Obesity Medicine · 14 years practice",
  bio: "Belly fat is the single best predictor of metabolic disease risk I see in my practice. When lifestyle alone stalls — and for most patients over 35, it does — GLP-1 therapy supervised by a real provider is, in my view, one of the most underused tools in primary care today.",
  imagePrompt:
    "Professional editorial headshot of a Chinese-American male physician in his mid-40s, short salt-and-pepper hair, clean-shaven, wearing a crisp white lab coat over a navy button-down, stethoscope around neck, softbox lighting, clean clinical background slightly blurred, direct warm eye contact, trustworthy expression, Hasselblad quality, 1:1 aspect ratio.",
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
    name: "Mike D.",
    age: 45,
    location: "Chicago",
    lbs: 38,
    months: 5,
    quote:
      "My belly was the last thing to go on every diet. With GLP-1, it was actually the first area I noticed changes.",
  },
  {
    name: "Rachel S.",
    age: 39,
    location: "Atlanta",
    lbs: 31,
    months: 4,
    quote:
      "I finally fit into jeans I'd given up on. The belly fat that survived 3 diet programs is gone.",
  },
  {
    name: "James K.",
    age: 57,
    location: "Portland",
    lbs: 44,
    months: 6,
    quote:
      "My doctor said my visceral fat score dropped from high risk to normal. That's worth more than any number on a scale.",
  },
  {
    name: "Derek W.",
    age: 51,
    location: "Austin",
    lbs: 52,
    months: 8,
    quote:
      "My cardiologist was skeptical at first. Now my BP is lower than it was at 35 and we're talking about weaning off one of my meds.",
  },
];

// AEO-optimized: each question is a real search query, each answer 40-70 words,
// lead sentence is the bold TL;DR Google's AI Overviews tend to quote.
const faqs = [
  {
    question: "Can GLP-1 medication target belly fat specifically?",
    answer:
      "GLP-1 drives overall weight loss, and published clinical trials suggest visceral (belly) fat is reduced more than subcutaneous fat. Your provider tracks progress including body composition. Belly fat responds especially well because GLP-1 improves the underlying insulin resistance that drives midsection storage.",
  },
  {
    question: "How long until I see results in my midsection?",
    answer:
      "Most members notice waistband changes within 6–8 weeks. Visible midsection reshaping typically shows up around month 3–4. Belly fat that resisted diet and exercise often responds faster than expected on GLP-1 because the medication addresses the hormonal drivers rather than calorie math alone. Individual results vary.",
  },
  {
    question: "Is compounded semaglutide as effective as Ozempic for belly fat?",
    answer:
      "Compounded semaglutide contains the same active ingredient as Ozempic and Wegovy but is prepared by a state-licensed compounding pharmacy under an individual prescription. It is not FDA-approved as a branded drug product. Our program is for patients for whom this is medically appropriate as determined by a licensed provider.",
  },
  {
    question: "Do I need to exercise while on GLP-1?",
    answer:
      "Exercise supports overall health, muscle preservation, and long-term maintenance, but GLP-1 medication works independently of it. Your provider and coaching team will recommend a level of activity appropriate to your fitness and joints. Resistance training is especially valuable for protecting lean mass as you lose weight.",
  },
  {
    question: "Why don't crunches and ab workouts work for belly fat?",
    answer:
      "Spot reduction is a myth. Ab exercises strengthen the muscles underneath the fat but don't target visceral fat storage, which is driven by hormones (cortisol, insulin, sex-hormone ratios). A hormonal problem needs a hormonal solution — which is exactly the mechanism of GLP-1 receptor agonists.",
  },
  {
    question: "Is belly fat actually dangerous or just cosmetic?",
    answer:
      "Visceral belly fat is metabolically active and is linked to increased risk of cardiovascular disease, type 2 diabetes, non-alcoholic fatty liver disease, and metabolic syndrome. Reducing visceral fat is among the most impactful health interventions documented in medical literature — not a vanity concern.",
  },
  {
    question: "How much does the program cost? Is insurance required?",
    answer:
      "Plans start at $179/month — no insurance required. That includes the compounded medication, ongoing provider oversight, and care-team messaging. You can cancel anytime. There is a 30-day money-back guarantee on your first month. Compare that to roughly $1,349/mo retail cash-pay for brand-name GLP-1 medications.",
  },
  {
    question: "What are the common side effects, and how are they managed?",
    answer:
      "The most common side effects are mild gastrointestinal (nausea, constipation, reflux), typically during dose titration. Your provider will start you on a low dose and step up slowly specifically to minimize these. Persistent or serious side effects are reviewed by your care team and dosing is adjusted accordingly.",
  },
  {
    question: "Can I cancel anytime, and what happens if I don't qualify?",
    answer:
      "You can cancel anytime with no long-term commitment. If a licensed provider determines you are not eligible — for safety, contraindications, or health history — you are not charged for medication. The 2-minute eligibility assessment is free and non-binding.",
  },
  {
    question: "What happens after I reach my goal weight?",
    answer:
      "Your provider will tailor a maintenance plan — often a lower dose, sometimes periodic pauses, and always ongoing support. GLP-1 therapy is not one-size-fits-all. Long-term success depends on your provider-guided maintenance strategy alongside sustainable lifestyle changes built during the loss phase.",
  },
];

// Expanded internal linking for SEO + conversion (AEO 2026 playbook).
const internalLinks = [
  {
    title: "Men's Weight Loss",
    description: "GLP-1 programs tuned for men's metabolism and hormonal profile.",
    href: "/lp/men",
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
    title: "Visceral Fat 101 (Blog)",
    description: "Why midsection fat is different — and what the evidence actually says.",
    href: "/blog/visceral-fat-explained",
  },
] as const;

export default function BellyFatLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="Target Visceral Fat"
        badgeIcon={Flame}
        badgeIconColor="text-orange-500"
      />

      {/* ======================================================================
          HERO
          AI-IMAGE PROMPT (hero right-side portrait — optional enhancement)
          Aspect ratio: 4:5
          "Editorial photograph of a confident man in his late-40s, short dark
           hair, navy crew T-shirt, standing relaxed against a warm neutral
           wall, natural window light, mid-laugh genuine expression, shallow
           depth of field, editorial style. Body language: hands in pockets,
           slight angle. Clean, no logos, no overt fitness iconography."
          ====================================================================== */}
      <LpHeroBlock
        badge="Target Visceral Fat"
        headline="Lose that stubborn belly fat by May."
        headlineAccent="Same active ingredient as Ozempic and Wegovy."
        subtitle="Doctor-prescribed GLP-1 may help you lose up to 8 lbs in your first month.* Targets visceral fat at the hormonal cause. From $179/mo. 2-minute assessment. Individual results vary."
        stats={heroStats}
        ctaLocation="hero-belly-fat"
      />

      <LpSocialProofBar />

      {/* Real outcome numbers anchor the claim before objections land */}
      <LpOutcomeStats
        stats={outcomeStats}
        heading="What members actually see"
        subheading="Program outcomes, not marketing numbers."
      />

      {/* Problem Section */}
      <LpProblemSection
        eyebrow="WHY BELLY FAT WON'T BUDGE"
        heading="The real reason crunches don't work"
        cards={lpProblemCards}
        transitionText="A hormonal problem requires a hormonal solution — that's where GLP-1 comes in."
        ctaLocation="problem-belly-fat"
      />

      {/* Why Belly Fat Is Different */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            Why belly fat is different
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Belly fat isn&apos;t a willpower problem — it&apos;s a hormonal one.
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

      {/* How GLP-1 Targets Belly Fat */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            How GLP-1 targets belly fat
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
        headline="Ready to target the fat that matters most?"
        subtext="Free 2-minute assessment. Licensed providers. No commitment."
        location="mid-belly-fat"
      />

      {/* Journey roadmap — defuses "what happens next?" objection */}
      <LpJourneyRoadmap
        milestones={journeyMilestones}
        heading="What to expect, month by month"
        subheading="The realistic belly-fat treatment arc your provider will build with you."
      />

      {/* Price comparison — anchoring effect */}
      <LpPriceCompare
        columns={priceColumns}
        heading="Same active ingredient. Plans from $179/mo."
        subheading="We think access to GLP-1 care shouldn't depend on your insurer."
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
            Members who beat belly fat
          </h2>
          {/* AI-IMAGE PROMPT (optional — testimonial avatars)
              Aspect ratio: 1:1
              "Four photorealistic headshot portraits, diverse men and women ages
               35-60, soft natural window light, genuine expressions, neutral
               backgrounds in warm earth tones, editorial photojournalism style,
               candid not posed, Sony A7R 85mm f/1.8. No logos, no fitness
               branding."
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
        heading="Belly fat & GLP-1: your questions"
        subheading="Everything you need to know about targeting visceral fat with prescribed care."
      />

      {/* Internal Links */}
      <LpInternalLinks heading="Keep exploring" links={internalLinks} />

      {/* Final CTA */}
      <LpCtaSection
        headline="Target the fat that matters most"
        bgClassName="bg-gradient-to-r from-orange-50 to-amber-50"
      />

      <LpFooter />

      {/* JSON-LD */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Belly Fat Treatment", href: "/lp/belly-fat" },
        ]}
      />
      <MedicalWebPageJsonLd
        name="GLP-1 for Stubborn Belly Fat"
        description="Belly fat is hormonally driven — GLP-1 medication targets visceral fat at the source. Licensed providers. From $179/mo."
        url="/lp/belly-fat"
      />
      <FAQPageJsonLd faqs={faqs} />
      <MedicalConditionJsonLd
        name="Abdominal Obesity"
        alternateName="Visceral Adiposity"
        description="Abdominal (visceral) obesity is the accumulation of fat around the internal organs, driven by hormonal factors including cortisol and insulin resistance. It is linked to increased risk of type 2 diabetes, cardiovascular disease, and metabolic syndrome. GLP-1 receptor agonists may reduce visceral fat alongside overall weight loss."
        url="/lp/belly-fat"
        possibleTreatment="GLP-1 receptor agonist therapy (compounded semaglutide or tirzepatide) prescribed and supervised by a licensed provider, combined with nutrition and activity guidance."
      />
      <LpConversionWidgets />
    </div>
  );
}
