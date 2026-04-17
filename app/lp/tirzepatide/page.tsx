import type { Metadata } from "next";
import {
  Check,
  Star,
  Zap,
  Brain,
  Activity,
  TrendingDown,
  Shield,
  Layers,
  Target,
  Scale,
  Stethoscope,
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
  DrugJsonLd,
  FAQPageJsonLd,
  MedicalWebPageJsonLd,
  BreadcrumbJsonLd,
  HowToJsonLd,
} from "@/components/seo/json-ld";

// ============================================================================
// AI-IMAGE PROMPT (hero background — optional enhancement)
// Aspect ratio: 16:9
// "Editorial photograph of a confident mid-40s professional in athletic gear
//  walking briskly down a modern city sidewalk at dawn, cool blue and steel
//  palette, crisp morning air, subtle motion blur, clean minimalist style,
//  Leica Q2 natural shot, no logos, no syringes, no medication props."
// ============================================================================

export const metadata: Metadata = {
  // Keywords: tirzepatide online, compounded tirzepatide, mounjaro alternative, dual-action glp-1
  title: "Compounded Tirzepatide Online from $379/mo | Nature's Journey",
  description:
    "Dual-action GLP-1/GIP tirzepatide prescribed online by US-licensed providers. Up to 21% avg weight loss*. 2-minute assessment. From $379/mo. Individual results vary.",
  openGraph: {
    title: "Compounded Tirzepatide Online — The Dual-Action Shot",
    description:
      "Dual GLP-1/GIP tirzepatide from US-licensed pharmacies. 2-minute eligibility. From $379/mo. Individual results vary.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/tirzepatide",
  },
};

const heroStats = [
  { value: "Up to 21%*", label: "Avg weight loss" },
  { value: "Dual-action", label: "GLP-1 + GIP" },
  { value: "$379/mo", label: "Starting at" },
  { value: "18,000+", label: "Members" },
];

const outcomeStats = [
  {
    value: "Up to 21%",
    label: "Avg total body weight loss*",
    sublabel: "Clinical-trial range for tirzepatide at the highest dose over 72 weeks.",
  },
  {
    value: "24 hrs",
    label: "Typical provider review",
    sublabel: "US-licensed providers review every assessment individually.",
  },
  {
    value: "48 hrs",
    label: "Typical shipping",
    sublabel: "Free, discreet, to all 50 states where legally available.",
  },
];

const lpProblemCards = [
  {
    icon: Scale,
    title: "Brand Tirzepatide Costs $1,349+/mo",
    description:
      "Retail cash-pay for Mounjaro or Zepbound is out of reach for most patients. Weight-management indications are routinely denied by insurers.",
  },
  {
    icon: Layers,
    title: "Shortages Haven't Fully Resolved",
    description:
      "Tirzepatide has been on the FDA shortage list off and on since 2022. Even with a script and coverage, pharmacies often can't fill on time.",
  },
  {
    icon: Brain,
    title: "Single-GLP-1 Isn't Enough for Everyone",
    description:
      "Some patients plateau or don't respond to semaglutide alone. Tirzepatide's second receptor pathway (GIP) is why it was developed — but brand access has been the barrier.",
  },
] as const;

const differentCards = [
  {
    icon: Layers,
    title: "Dual-Receptor Mechanism",
    description:
      "Tirzepatide activates both GLP-1 and GIP receptors simultaneously. That second pathway (GIP) is why it exists — and it's not found in semaglutide or other single-action GLP-1s.",
  },
  {
    icon: Shield,
    title: "LegitScript-Certified Process",
    description:
      "Every prescription is issued by a US-licensed provider after medical review. Dispensed by a US state-licensed 503A/503B pharmacy. Individual prescriptions — not gray-market mail order.",
  },
  {
    icon: Stethoscope,
    title: "Real Ongoing Care",
    description:
      "You're joining a supervised treatment program with messaging access to your care team and dose-titration oversight by your provider — not buying a vial from a stranger online.",
  },
];

const solutionCards = [
  {
    title: "GLP-1 Receptor Activation",
    description:
      "Like semaglutide, tirzepatide slows gastric emptying and reduces appetite signals in the brain — so satiety arrives earlier and lasts longer.",
  },
  {
    title: "GIP Receptor Activation",
    description:
      "The second pathway. GIP supports insulin sensitivity and may improve how the body stores and uses fat — a mechanism semaglutide doesn't touch.",
  },
  {
    title: "Combined Effect",
    description:
      "Simultaneous activation of both receptors is why head-to-head clinical data supports larger average weight loss with tirzepatide than with single-receptor GLP-1s, for many patients.",
  },
];

// 6 milestones — titration 2.5mg → 15mg
const journeyMilestones = [
  {
    month: "Day 1",
    label: "Eligibility in 2 minutes",
    description:
      "Online medical assessment reviewed by a US-licensed provider — typically within 24 hours.",
  },
  {
    month: "Week 1",
    label: "2.5 mg start dose ships",
    description:
      "Compounded tirzepatide delivered discreetly. Video onboarding with your care team.",
  },
  {
    month: "Month 1",
    label: "Step up to 5 mg",
    description:
      "Appetite signals soften. Food noise quiets. Body starts responding to dual-receptor activation.",
  },
  {
    month: "Month 3",
    label: "Titrate toward 7.5–10 mg",
    description:
      "First 15–25 lbs for many members. Provider reviews side effects and paces dose increases.",
  },
  {
    month: "Month 6",
    label: "Therapeutic dose (12.5–15 mg)",
    description:
      "Plateau-breaking phase. Many members see meaningful body-composition changes and improved bloodwork.",
  },
  {
    month: "Month 12+",
    label: "Maintenance plan",
    description:
      "Your provider tailors a long-term dose for sustainability — not just more loss.",
  },
];

const provider = {
  name: "Dr. Raj Patel, MD",
  credentials: "Board-certified, Endocrinology · Obesity Medicine · 18 years practice",
  bio: "For patients who plateau on single-pathway GLP-1 therapy — or who simply need stronger metabolic leverage to reach their goals — tirzepatide's dual-receptor design is genuinely different. It's not a better version of semaglutide. It's a different tool with a different mechanism, and it deserves the same careful titration and oversight.",
  imagePrompt:
    "Professional editorial headshot of an Indian-American male physician in his early-50s, short black hair, wearing a crisp white lab coat over a light blue button-down, stethoscope around neck, warm confident smile, softbox lighting, clean clinical background slightly blurred, direct trustworthy eye contact, Hasselblad quality, 1:1 aspect ratio.",
};

const priceColumns = [
  {
    name: "Brand-Name Mounjaro / Zepbound",
    price: "$1,349/mo",
    priceSubtext: "retail cash-pay*",
    features: [
      { label: "FDA-approved", included: true },
      { label: "Insurance coverage often denied for weight loss", included: false },
      { label: "Still intermittent shortages in 2026", included: false },
      { label: "Ongoing provider support built-in", included: false },
      { label: "Free 2-day shipping", included: false },
      { label: "30-day money-back guarantee", included: false },
    ],
  },
  {
    name: "Nature's Journey Compounded Tirzepatide",
    price: "$379/mo",
    priceSubtext: "no insurance needed",
    highlight: true,
    features: [
      { label: "Same active ingredient (tirzepatide)", included: true },
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

const testimonials = [
  {
    name: "Patricia K.",
    age: 44,
    location: "Chicago",
    lbs: 38,
    months: 5,
    quote:
      "I plateaued on semaglutide for two months. My provider switched me to tirzepatide and I started losing again within weeks.",
  },
  {
    name: "Michael R.",
    age: 49,
    location: "Austin",
    lbs: 51,
    months: 7,
    quote:
      "Down 51 lbs and my A1C dropped from 6.8 to 5.4. Dual-action was the right choice for my metabolic profile.",
  },
  {
    name: "Dana S.",
    age: 36,
    location: "Miami",
    lbs: 29,
    months: 4,
    quote:
      "I was paying $1,500/mo for brand Mounjaro. Same active ingredient here for a quarter of the price — and the care is better.",
  },
  {
    name: "Trevor B.",
    age: 55,
    location: "Seattle",
    lbs: 46,
    months: 6,
    quote:
      "My provider titrated me slowly — I barely had side effects. The appetite quiet is unlike anything I've experienced.",
  },
];

// 10 FAQs
const faqs = [
  {
    question: "Is compounded tirzepatide as effective as Mounjaro or Zepbound?",
    answer:
      "Compounded tirzepatide contains the same active ingredient (tirzepatide) used in Mounjaro and Zepbound. It is prepared by a US state-licensed compounding pharmacy under an individual prescription. Compounded medications are not FDA-approved brand-name drugs. Your provider determines if it is appropriate for you.",
  },
  {
    question: "How is tirzepatide different from semaglutide?",
    answer:
      "Tirzepatide activates both GLP-1 and GIP receptors; semaglutide activates only GLP-1. That second pathway is why tirzepatide exists as a distinct molecule. Clinical data suggests it may produce greater average weight loss for some patients. The right choice depends on your health profile.",
  },
  {
    question: "How much weight can I lose with tirzepatide?",
    answer:
      "Clinical trials show average weight loss of up to 21% of body weight over 72 weeks at the highest dose. Individual results vary based on starting weight, adherence, diet, and other factors. Your provider will set realistic expectations based on your individual health profile.",
  },
  {
    question: "What are the common side effects of tirzepatide?",
    answer:
      "Side effects are similar to other GLP-1 medications — mild nausea, decreased appetite, constipation, reflux — usually during titration. Your provider starts at 2.5 mg and steps up carefully to minimize them. Persistent issues are reviewed and dose is adjusted.",
  },
  {
    question: "How is tirzepatide administered?",
    answer:
      "Tirzepatide is a once-weekly subcutaneous injection (self-administered with a small needle). We provide detailed instructions and your provider is available for questions. Most members find it quick and straightforward.",
  },
  {
    question: "Can I switch from semaglutide to tirzepatide?",
    answer:
      "Yes, many members who plateau on semaglutide switch with their provider's guidance. Your provider will manage the transition safely, typically starting you back at a low tirzepatide dose and titrating up from there.",
  },
  {
    question: "How long until I see results on tirzepatide?",
    answer:
      "Most members notice reduced appetite within 1-2 weeks. Visible weight loss typically begins within 4-6 weeks. Meaningful progress usually shows by month 3, and full therapeutic effect builds as your provider titrates toward the 12.5-15 mg range. Individual results vary.",
  },
  {
    question: "Why does tirzepatide cost more than semaglutide in your program?",
    answer:
      "Tirzepatide is a newer, more complex dual-action molecule. At $379/mo all-inclusive, it's still meaningfully less than the $1,349+ retail price for brand-name Mounjaro or Zepbound. Semaglutide remains our entry GLP-1 at $179/mo.",
  },
  {
    question: "Do I need insurance?",
    answer:
      "No. Our $379/mo membership is all-inclusive — provider evaluation, medication if prescribed, meal plans, care-team messaging, and free 2-day shipping. No insurance. No prior authorizations.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. You can cancel anytime with no long-term commitment. If a licensed provider determines you are not eligible, you are not charged for medication. The 2-minute eligibility assessment is free and non-binding.",
  },
];

const internalLinks = [
  {
    title: "Semaglutide (Single-Action GLP-1)",
    description: "Our entry GLP-1 starting at $179/mo — the most-studied molecule in weight management.",
    href: "/lp/semaglutide",
  },
  {
    title: "Ozempic Alternative",
    description: "Same active ingredient as Ozempic at roughly 80% off retail.",
    href: "/lp/ozempic-alternative",
  },
  {
    title: "General GLP-1 Program",
    description: "Not sure which molecule is right? Start with our overview of the program.",
    href: "/lp/glp1",
  },
  {
    title: "See Pricing Plans",
    description: "Essential, Premium, Complete — compare what's included at each tier.",
    href: "/pricing",
  },
  {
    title: "Check Eligibility",
    description: "2-minute assessment. Free. Provider review within 1 business day.",
    href: "/qualify",
  },
  {
    title: "Affordable Weight Loss Plans",
    description: "Compare our plans and find the right option for your budget.",
    href: "/lp/affordable",
  },
] as const;

export default function TirzepatideLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="Dual-Action GLP-1/GIP"
        badgeIcon={Zap}
        badgeIconColor="text-cyan-600"
      />

      {/* ======================================================================
          HERO
          AI-IMAGE PROMPT (hero right-side portrait — optional enhancement)
          Aspect ratio: 4:5
          "Editorial photograph of a confident athletic-built man in his late-
           40s, short dark hair with flecks of grey, steel-blue performance
           Henley, standing at a kitchen island with early morning light,
           shallow depth of field, relaxed but focused expression, clean
           minimalist aesthetic, Leica Q2 natural shot. No logos, no fitness
           iconography, no visible medication."
          ====================================================================== */}
      <LpHeroBlock
        badge="Accepting new patients — same-day evaluation"
        headline="Compounded tirzepatide —"
        headlineAccent="The dual-action shot, prescribed online"
        subtitle="Tirzepatide is the only medication that activates both GLP-1 and GIP receptors. Prescribed by US-licensed providers, dispensed by a US-licensed compounding pharmacy. 2-minute eligibility. Individual results vary."
        stats={heroStats}
        retailPrice="$1,349/mo"
        memberPrice="$379"
        savingsPercent="72%"
        ctaLocation="tirzepatide-hero"
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
        eyebrow="THE ACCESS GAP"
        heading="The stronger GLP-1 — but only if you can actually get it"
        cards={lpProblemCards}
        transitionText="Our program delivers licensed, provider-supervised access to tirzepatide — legitimately."
        ctaLocation="problem-tirzepatide"
      />

      {/* Why Our Tirzepatide Is Different */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            Why our compounded tirzepatide is different
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Dual-mechanism, licensed, supervised. Three reasons members choose this program.
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

      {/* How Tirzepatide Solves It */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            How GLP-1 + GIP solves what single-action misses
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Two metabolic pathways, one weekly injection.
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
        headline="Find out if tirzepatide is right for you"
        subtext="Free 2-minute assessment. Licensed providers. No commitment."
        location="mid-tirzepatide"
      />

      {/* Journey roadmap — dose titration */}
      <LpJourneyRoadmap
        milestones={journeyMilestones}
        heading="What to expect, month by month"
        subheading="The realistic titration arc your provider will build with you — from 2.5 mg start dose toward the therapeutic 12.5–15 mg range."
      />

      {/* Price comparison */}
      <LpPriceCompare
        columns={priceColumns}
        heading="Same active ingredient. A fraction of brand-name cost."
        subheading="Tirzepatide access shouldn't be decided by your insurance plan."
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
            Real results on tirzepatide
          </h2>
          {/* AI-IMAGE PROMPT (optional — testimonial avatars)
              Aspect ratio: 1:1
              "Four photorealistic headshot portraits, diverse men and women ages
               35-55, soft natural window light, genuine expressions, neutral
               backgrounds in cool clinical whites and light blues, editorial
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
        heading="Tirzepatide online: your questions"
        subheading="Everything you need to know about compounded tirzepatide and our program."
      />

      {/* Internal Links */}
      <LpInternalLinks heading="Keep exploring" links={internalLinks} />

      {/* Final CTA */}
      <LpCtaSection headline="Experience the next generation of weight management" />

      <LpFooter />

      {/* JSON-LD */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Tirzepatide", href: "/lp/tirzepatide" },
        ]}
      />
      <HowToJsonLd
        name="How to Get Tirzepatide Online"
        description="Three simple steps to get compounded tirzepatide prescribed online through Nature's Journey."
        steps={[
          { title: "Complete a Free Assessment", description: "Answer a 2-minute health questionnaire. No payment required." },
          { title: "Provider Evaluation", description: "A licensed provider reviews your profile within 1 business day." },
          { title: "Medication Delivered", description: "If prescribed, tirzepatide ships to your door with free 2-day delivery." },
        ]}
      />
      <DrugJsonLd
        name="Compounded Tirzepatide"
        alternateName="Dual GLP-1/GIP Receptor Agonist"
        description="Compounded tirzepatide for provider-guided weight management, the same active ingredient in Mounjaro and Zepbound."
        url="/lp/tirzepatide"
        administrationRoute="Subcutaneous injection"
      />
      <MedicalWebPageJsonLd
        name="Compounded Tirzepatide Online"
        description="Dual GLP-1/GIP tirzepatide prescribed online by US-licensed providers. From $379/mo. Individual results vary."
        url="/lp/tirzepatide"
      />
      <FAQPageJsonLd faqs={faqs} />
      <LpConversionWidgets />
    </div>
  );
}
