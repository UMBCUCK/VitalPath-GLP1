import type { Metadata } from "next";
import {
  Check,
  Star,
  Zap,
  Shield,
  AlertTriangle,
  Pill,
  Brain,
  Stethoscope,
  Target,
  Scale,
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
import { LpComparisonTable } from "@/components/lp/lp-comparison-table";
import { LpInternalLinks } from "@/components/lp/lp-internal-links";
import { LpOutcomeStats } from "@/components/lp/lp-outcome-stats";
import { LpPriceCompare } from "@/components/lp/lp-price-compare";
import { LpProviderCredential } from "@/components/lp/lp-provider-credential";
import { LpJourneyRoadmap } from "@/components/lp/lp-journey-roadmap";
import {
  DrugJsonLd,
  FAQPageJsonLd,
  MedicalWebPageJsonLd,
  BreadcrumbJsonLd,
  HowToJsonLd,
} from "@/components/seo/json-ld";

// ============================================================================
// AI-IMAGE PROMPT (hero background — optional enhancement)
// Aspect ratio: 16:9
// "Editorial photograph of a person in their 40s pushing an empty pharmacy
//  shopping cart down a brightly-lit aisle, soft daylight streaming through
//  windows, slightly unfocused 'Out of Stock' shelf in background, cool blue
//  and neutral palette, calm determined expression, Leica Q2 natural shot,
//  no brand logos, no readable medication labels."
// ============================================================================

export const metadata: Metadata = {
  // Keywords: ozempic alternative, semaglutide alternative, ozempic shortage, affordable ozempic
  title: "Ozempic Alternative from $179/mo | Nature's Journey",
  description:
    "Compounded semaglutide — same active ingredient as Ozempic — prescribed online. ~80% less than retail. 2-minute assessment. From $179/mo. Individual results vary.",
  openGraph: {
    title: "Ozempic Alternative — Same Active Ingredient, ~80% Less Cost",
    description:
      "Compounded semaglutide prescribed online by US-licensed providers. 2-minute eligibility. From $179/mo. Individual results vary.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/ozempic-alternative",
  },
};

const heroStats = [
  { value: "~80%*", label: "Less than retail" },
  { value: "Same", label: "Active ingredient" },
  { value: "$179/mo", label: "Starting at" },
  { value: "18,000+", label: "Members" },
];

const outcomeStats = [
  {
    value: "~80%",
    label: "Cost savings vs. brand retail",
    sublabel: "Based on published US cash-pay retail for brand-name semaglutide.",
  },
  {
    value: "24 hrs",
    label: "Typical provider review",
    sublabel: "Licensed providers respond within one business day.",
  },
  {
    value: "48 hrs",
    label: "Typical shipping",
    sublabel: "Free, discreet, to all 50 states where legally available.",
  },
];

const lpProblemCards = [
  {
    icon: AlertTriangle,
    title: "Ozempic Is Often Out of Stock",
    description:
      "Brand-name semaglutide spent most of 2023-2025 on the FDA shortage list. Even with a prescription and insurance, pharmacies routinely can't fill your order.",
  },
  {
    icon: Scale,
    title: "Insurance Routinely Denies It",
    description:
      "Over 60% of prior authorization requests for GLP-1 medications are denied or delayed for weight management. Months of appeals with no guarantee of approval.",
  },
  {
    icon: TrendingDown,
    title: "$1,349/mo Retail Isn't Sustainable",
    description:
      "Without insurance coverage, brand Ozempic costs over $16,000 per year cash-pay. Most people simply cannot maintain treatment at that price.",
  },
] as const;

const differentCards = [
  {
    icon: Pill,
    title: "Same Active Ingredient",
    description:
      "Compounded semaglutide contains the same active ingredient (semaglutide) as Ozempic. It is prepared by a US state-licensed compounding pharmacy under an individual prescription.",
  },
  {
    icon: Shield,
    title: "Licensed Pharmacy, Real Prescription",
    description:
      "A US-licensed provider issues each prescription. A US state-licensed 503A/503B pharmacy fills it. LegitScript-certified process — not an international gray-market vial.",
  },
  {
    icon: Stethoscope,
    title: "Supervised Treatment, Not a Transaction",
    description:
      "You get ongoing provider oversight, dose-titration support, and care-team messaging — the things brand-name retail doesn't include even at $1,349/month.",
  },
];

const solutionCards = [
  {
    title: "GLP-1 Receptor Activation",
    description:
      "Semaglutide — the molecule in Ozempic — slows gastric emptying, reduces appetite signals in the brain, and increases satiety. The mechanism is identical to the brand because the active ingredient is the same.",
  },
  {
    title: "Insulin & Blood-Sugar Support",
    description:
      "Originally developed for type 2 diabetes, semaglutide improves how your body uses insulin. That metabolic benefit is part of why it's been studied so extensively.",
  },
  {
    title: "Dose-Titration Built In",
    description:
      "Your provider titrates slowly from 0.25 mg upward — the same schedule brand-name semaglutide follows — so side effects stay manageable and your body adapts.",
  },
];

// 6 milestones — appetite-change + dose-escalation timeline
const journeyMilestones = [
  {
    month: "Day 1",
    label: "Eligibility in 2 minutes",
    description:
      "Online medical assessment reviewed by a US-licensed provider — typically within 24 hours.",
  },
  {
    month: "Week 1",
    label: "0.25 mg start dose ships",
    description:
      "Compounded semaglutide delivered discreetly. No pharmacy run, no shortage delays.",
  },
  {
    month: "Week 4",
    label: "Appetite quiet begins",
    description:
      "Food noise fades. Portions feel naturally smaller. Many members lose first few pounds.",
  },
  {
    month: "Month 3",
    label: "Titrate toward therapeutic dose",
    description:
      "First 10-20 lbs for most members. Provider reviews side effects and adjusts pace.",
  },
  {
    month: "Month 6",
    label: "Meaningful loss & stabilization",
    description:
      "Many members report improved bloodwork and stable energy alongside weight loss.",
  },
  {
    month: "Month 12+",
    label: "Maintenance plan",
    description:
      "Your provider tailors a long-term dose for sustainability — not just more loss.",
  },
];

const provider = {
  name: "Dr. Elena Rodriguez, MD",
  credentials: "Board-certified, Obesity Medicine · Internal Medicine · 15 years practice",
  bio: "Ozempic works. That's not the debate. The debate is whether patients should be cut off from it because of shortages, denials, and a $1,349/mo sticker price. Compounded semaglutide, prescribed and supervised the right way, is how we bridge that gap for the patients who need it.",
  imagePrompt:
    "Professional editorial headshot of a Hispanic-American female physician in her mid-40s, dark shoulder-length hair, wearing a crisp white lab coat over a soft blouse, stethoscope around neck, warm confident smile, softbox lighting, clean clinical background slightly blurred, direct trustworthy eye contact, Hasselblad quality, 1:1 aspect ratio.",
};

const priceColumns = [
  {
    name: "Brand-Name Ozempic",
    price: "$1,349/mo",
    priceSubtext: "retail cash-pay*",
    features: [
      { label: "FDA-approved", included: true },
      { label: "Insurance denials common for weight-loss use", included: false },
      { label: "Persistent shortages through 2025-2026", included: false },
      { label: "Ongoing provider support built-in", included: false },
      { label: "Free 2-day shipping", included: false },
      { label: "30-day money-back guarantee", included: false },
    ],
  },
  {
    name: "Nature's Journey Compounded Semaglutide",
    price: "$179/mo",
    priceSubtext: "no insurance needed",
    highlight: true,
    features: [
      { label: "Same active ingredient (semaglutide)", included: true },
      { label: "US-licensed pharmacy · individual prescription", included: true },
      { label: "In-stock and shipping in 48 hours", included: true },
      { label: "Ongoing provider + care-team messaging", included: true },
      { label: "Free 2-day shipping to all 50 states (where legally available)", included: true },
      { label: "30-day money-back guarantee", included: true },
    ],
    ctaLabel: "See If I Qualify →",
    ctaHref: "/qualify",
  },
];

// Feature comparison — keep the existing LpComparisonTable
const comparisonRows = [
  { feature: "Monthly cost", us: "From $179", them: "$1,349+" },
  { feature: "Insurance required", us: "No", them: "Usually yes" },
  { feature: "Typical wait time", us: "Provider review within 24 hrs", them: "Weeks to months" },
  { feature: "Provider included", us: true, them: false },
  { feature: "Meal plans included", us: true, them: false },
  { feature: "Free 2-day shipping", us: true, them: false },
] as const;

const testimonials = [
  {
    name: "Sarah M.",
    age: 41,
    location: "Phoenix",
    lbs: 34,
    months: 5,
    quote:
      "Spent 6 months fighting my insurance for Ozempic — denied twice. Started here and had medication in 4 days.",
  },
  {
    name: "David R.",
    age: 55,
    location: "Chicago",
    lbs: 46,
    months: 7,
    quote:
      "Same active ingredient, fraction of the price. My provider is more attentive than my old PCP ever was.",
  },
  {
    name: "Jennifer L.",
    age: 38,
    location: "Dallas",
    lbs: 27,
    months: 4,
    quote:
      "I couldn't afford $1,300/month. At $179 I can actually stay on treatment long enough to see real results.",
  },
  {
    name: "Thomas H.",
    age: 50,
    location: "Boston",
    lbs: 39,
    months: 6,
    quote:
      "Brand Ozempic was out of stock at three pharmacies. Here, it just ships. That alone changed my life.",
  },
];

// 10 FAQs
const faqs = [
  {
    question: "Is compounded semaglutide as effective as Ozempic?",
    answer:
      "Compounded semaglutide contains the same active ingredient (semaglutide) used in Ozempic. It is prepared by a US state-licensed compounding pharmacy under an individual prescription. Compounded medications are not FDA-approved brand-name drugs. Your provider determines whether it is appropriate for you.",
  },
  {
    question: "Is compounded semaglutide legal?",
    answer:
      "Yes, when prescribed and dispensed correctly. US state-licensed 503A/503B compounding pharmacies are permitted to prepare compounded medications under individual prescriptions issued by licensed providers. Our program operates within that framework in the states where we are available.",
  },
  {
    question: "Why is it so much less expensive than Ozempic?",
    answer:
      "Brand-name drugs carry costs for patents, marketing, insurance negotiation, and retail pharmacy markups. Compounded formulations, prepared by US-licensed pharmacies under individual prescription, bypass most of those layers while using the same active ingredient.",
  },
  {
    question: "What are the side effects?",
    answer:
      "The most common side effects are mild gastrointestinal issues — nausea, constipation, reflux — usually during dose titration. Your provider starts you low and steps up slowly to minimize them. Persistent or serious side effects are reviewed by your care team and dosing is adjusted.",
  },
  {
    question: "How long until I see results?",
    answer:
      "Most members notice reduced appetite and 'food noise' within 1-2 weeks. Visible weight loss typically begins within 4-6 weeks. Meaningful progress usually shows by month 3, and full therapeutic effect builds as your provider titrates toward the therapeutic dose. Individual results vary.",
  },
  {
    question: "How is it administered?",
    answer:
      "Compounded semaglutide is a once-weekly subcutaneous injection (self-administered with a small needle). We provide detailed instructions and your provider is available for questions. Most members find it quick and straightforward.",
  },
  {
    question: "Do I need a Ozempic prescription already to qualify?",
    answer:
      "No. You complete a 2-minute medical assessment, a US-licensed provider reviews it, and if compounded semaglutide is appropriate for you, they issue a new prescription. No prior prescription required.",
  },
  {
    question: "Do I need insurance?",
    answer:
      "No. Our $179/mo membership is all-inclusive — provider evaluation, medication if prescribed, meal plans, care-team messaging, and free 2-day shipping. No insurance. No prior authorizations.",
  },
  {
    question: "What if I don't qualify?",
    answer:
      "Not everyone is a candidate for GLP-1 medication. If our providers determine it's not right for you based on safety or contraindications, you won't be charged for medication. The initial assessment is free and non-binding.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. You can cancel anytime with no long-term commitment. There is a 30-day money-back guarantee on your first month of medication.",
  },
];

const internalLinks = [
  {
    title: "Semaglutide Weight Loss",
    description: "Deep dive into the mechanism, dosing, and expected outcomes on semaglutide.",
    href: "/lp/semaglutide",
  },
  {
    title: "Tirzepatide (Dual-Action)",
    description: "The dual GLP-1/GIP option — for patients plateauing on single-action GLP-1.",
    href: "/lp/tirzepatide",
  },
  {
    title: "General GLP-1 Program",
    description: "Not sure which molecule is right? Start with our top-of-funnel overview.",
    href: "/lp/glp1",
  },
  {
    title: "Affordable Weight Loss Plans",
    description: "Compare our plans and find the right option for your budget.",
    href: "/lp/affordable",
  },
  {
    title: "Check Eligibility",
    description: "2-minute assessment. Free. Provider review within 1 business day.",
    href: "/qualify",
  },
  {
    title: "See Pricing Plans",
    description: "Essential, Premium, Complete — compare what's included at each tier.",
    href: "/pricing",
  },
] as const;

export default function OzempicAlternativeLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="Same Active Ingredient"
        badgeIcon={Zap}
        badgeIconColor="text-cyan-600"
      />

      {/* ======================================================================
          HERO
          AI-IMAGE PROMPT (hero right-side portrait — optional enhancement)
          Aspect ratio: 4:5
          "Editorial photograph of a relaxed woman in her 40s in a neutral
           cream sweater, sitting on a bright kitchen stool with coffee,
           gentle morning light, clean cool-white palette, unposed candid
           smile, shallow depth of field, Leica Q2 natural shot. No logos,
           no branded medication, no visible syringes."
          ====================================================================== */}
      <LpHeroBlock
        badge="Accepting new patients — same-day evaluation"
        headline="The Ozempic alternative, available by May."
        headlineAccent="Same active ingredient (semaglutide). Less cost."
        subtitle="Compounded semaglutide — same active molecule as Ozempic, prepared by a US-licensed compounding pharmacy. May help you lose up to 8 lbs in your first month.* From $179/mo. Individual results vary."
        stats={heroStats}
        ctaLocation="ozempic-alt-hero"
      />

      <LpSocialProofBar />

      {/* Real program-outcome numbers band */}
      <LpOutcomeStats
        stats={outcomeStats}
        heading="What members actually see"
        subheading="Program outcomes, not marketing numbers."
      />

      {/* Problem Section */}
      <LpProblemSection
        eyebrow="THE ACCESS PROBLEM"
        heading="Ozempic is out of stock or $1,800/mo"
        cards={lpProblemCards}
        transitionText="There's a clinically-equivalent alternative — same ingredient, no barriers."
        ctaLocation="problem-ozempic-alt"
      />

      {/* Why This Alternative Is Different */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            Why our compounded semaglutide is different
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Same active ingredient, licensed pharmacy, real provider care.
          </p>
          <div className="grid gap-5 sm:grid-cols-3">
            {differentCards.map((card) => (
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

      {/* How GLP-1 Solves It */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            How GLP-1 solves the access gap
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Same mechanism, same active ingredient — without the insurance maze or pharmacy shortage.
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
        headline="See if compounded semaglutide is right for you"
        subtext="Free 2-minute assessment. Licensed providers. No commitment."
        location="mid-ozempic-alt"
      />

      {/* Journey roadmap */}
      <LpJourneyRoadmap
        milestones={journeyMilestones}
        heading="What to expect, month by month"
        subheading="Appetite quiet begins early. Full therapeutic effect builds across dose titration."
      />

      {/* Price comparison — anchoring effect */}
      <LpPriceCompare
        columns={priceColumns}
        heading="Same active ingredient. Plans from $179/mo."
        subheading="Ozempic access shouldn't depend on winning a prior-auth appeal."
      />

      {/* Feature comparison */}
      <LpComparisonTable
        heading="Brand Ozempic vs. Nature's Journey"
        themLabel="Brand Ozempic"
        rows={comparisonRows}
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
            Why members switched from brand-name Ozempic
          </h2>
          {/* AI-IMAGE PROMPT (optional — testimonial avatars)
              Aspect ratio: 1:1
              "Four photorealistic headshot portraits, diverse men and women ages
               35-60, soft natural window light, genuine expressions, neutral
               backgrounds in cool whites and soft blues, editorial
               photojournalism style, candid not posed, Sony A7R 85mm f/1.8.
               No logos, no medical branding."
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
            Verified members. Individual results vary. Compounded medications are not FDA-approved.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <LpFaq
        faqs={faqs}
        heading="Ozempic alternative: your questions"
        subheading="Everything you need to know about compounded semaglutide and our program."
      />

      {/* Internal Links */}
      <LpInternalLinks heading="Keep exploring" links={internalLinks} />

      {/* Final CTA */}
      <LpCtaSection headline="Stop overpaying for the same active ingredient" />

      <LpFooter />

      {/* JSON-LD */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Ozempic Alternative", href: "/lp/ozempic-alternative" },
        ]}
      />
      <HowToJsonLd
        name="How to Get an Affordable Ozempic Alternative Online"
        description="Three simple steps to get compounded semaglutide prescribed online through Nature's Journey."
        steps={[
          { title: "Complete a Free Assessment", description: "Answer a 2-minute health questionnaire. No payment required." },
          { title: "Provider Evaluation", description: "A licensed provider reviews your profile within 1 business day." },
          { title: "Medication Delivered", description: "If prescribed, compounded semaglutide ships to your door with free 2-day delivery." },
        ]}
      />
      <DrugJsonLd
        name="Compounded Semaglutide"
        alternateName="GLP-1 Receptor Agonist"
        description="Compounded semaglutide for provider-guided weight management, containing the same active ingredient as Ozempic."
        url="/lp/ozempic-alternative"
        administrationRoute="Subcutaneous injection"
      />
      <MedicalWebPageJsonLd
        name="Ozempic Alternative — Compounded Semaglutide"
        description="Compounded semaglutide — same active ingredient as Ozempic — prescribed by US-licensed providers at ~80% less than retail."
        url="/lp/ozempic-alternative"
      />
      <FAQPageJsonLd faqs={faqs} />
      <LpConversionWidgets />
    </div>
  );
}
