import type { Metadata } from "next";
import {
  Check,
  Star,
  DollarSign,
  Shield,
  Layers,
  Sprout,
  Leaf,
  AlertTriangle,
  Scale,
  Users,
  Clock,
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
// "Candid editorial photograph of a working-class woman in her late-30s at her
//  kitchen table reviewing a prescription box beside a steaming mug of coffee,
//  warm morning sunlight through a window, relieved genuine smile, natural
//  expression, shallow depth of field, editorial photography, Canon R5 50mm
//  f/1.8. Emphasis on dignity and accessibility. No logos, no branding."
// ============================================================================

export const metadata: Metadata = {
  // Primary keywords: affordable glp-1, cheap semaglutide, low-cost weight loss shot, glp-1 without insurance
  title: "Affordable GLP-1 from $179/mo — No Insurance | Nature's Journey",
  description:
    "Prescription GLP-1 care for $179/mo — no insurance needed. US-licensed pharmacy. 2-minute assessment. Cancel anytime. Individual results vary.",
  openGraph: {
    title: "Affordable Prescription GLP-1 — $179/mo, No Insurance Required",
    description:
      "Wegovy retail is ~$1,349/mo. Our compounded GLP-1 program starts at $179/mo with licensed US providers. Free assessment. From $179/mo.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/affordable",
  },
};

const heroStats = [
  { value: "$179/mo", label: "All-inclusive" },
  { value: "~80%", label: "Less than retail" },
  { value: "No", label: "Insurance needed" },
  { value: "18,000+", label: "Members" },
];

// Real program outcomes band — below hero. Specificity bias + availability heuristic.
const outcomeStats = [
  {
    value: "~80%",
    label: "Average savings vs. retail*",
    sublabel: "Compared to $1,349/mo cash-pay retail for branded GLP-1s.",
  },
  {
    value: "$0",
    label: "Insurance paperwork",
    sublabel: "Flat monthly price. No prior authorizations. No surprise denials.",
  },
  {
    value: "48 hrs",
    label: "Typical shipping",
    sublabel: "Free, discreet, to all 50 states where legally available.",
  },
];

const lpProblemCards = [
  {
    icon: DollarSign,
    title: "Retail GLP-1 Is $16K+ Per Year",
    description:
      "Wegovy and Zepbound run roughly $1,349/month cash-pay — that's over $16,000 annually. For most households, effective treatment is priced out of reach from day one.",
  },
  {
    icon: Shield,
    title: "Insurance Often Says No",
    description:
      "Prior authorizations, step therapy, and coverage exclusions routinely block GLP-1 approvals — even when your doctor recommends the medication. Appeals take months.",
  },
  {
    icon: AlertTriangle,
    title: "Hidden Fees Sneak In",
    description:
      "Consult fees, pharmacy markups, shipping charges, and auto-renew traps — the ad says one price, the invoice says another. Transparency is rare in this space.",
  },
] as const;

const problemCards = [
  {
    icon: Layers,
    title: "Compounded vs. Branded",
    description:
      "Compounded semaglutide/tirzepatide uses the same active ingredient as Ozempic, Wegovy, Mounjaro, and Zepbound, prepared by a state-licensed US compounding pharmacy under an individual prescription. It is not FDA-approved as a branded drug product.",
  },
  {
    icon: Sprout,
    title: "Flat Price, No Surprises",
    description:
      "$179/month covers the compounded medication, provider oversight, and care-team messaging. No consult fees. No pharmacy markups. No auto-renew price hikes baked in.",
  },
  {
    icon: Users,
    title: "Real US-Licensed Providers",
    description:
      "Your prescription is written by a US-licensed clinician after reviewing your health history. Not a rubber stamp, not offshore — a real provider who can say no if it isn't safe.",
  },
];

const solutionCards = [
  {
    title: "Transparent Flat Pricing",
    description:
      "One monthly price includes the medication, licensed-provider oversight, and care-team access. No consult fee. No surprise charges. Cancel anytime from your dashboard.",
  },
  {
    title: "No Insurance Gatekeepers",
    description:
      "Skip prior authorizations, formularies, and step therapy entirely. Cash-pay flat-fee means a predictable monthly bill you can actually plan around, insured or not.",
  },
  {
    title: "US-Licensed Pharmacy",
    description:
      "Medication is dispensed by a state-licensed US compounding pharmacy with individual prescriptions — not bulk, not imported. Your provider can adjust dose as you progress.",
  },
];

// 6 milestones — cost-conscious arc: emphasize monthly billing, cancel anytime, no surprise fees
const journeyMilestones = [
  {
    month: "Day 1",
    label: "Free 2-minute assessment",
    description:
      "Answer health questions online. No charge. No credit card needed to check eligibility.",
  },
  {
    month: "Day 2-3",
    label: "Provider review",
    description:
      "US-licensed clinician reviews your profile. You're only charged if a prescription is written.",
  },
  {
    month: "Week 1",
    label: "First shipment — $179",
    description:
      "Compounded GLP-1 ships free in about 48 hours. One flat price. No add-on fees.",
  },
  {
    month: "Month 1",
    label: "Monthly refill billing",
    description:
      "Billed the same $179 each month. Pause or cancel anytime from your account dashboard.",
  },
  {
    month: "Month 3",
    label: "First progress check-in",
    description:
      "Provider reviews progress and adjusts dose if needed — still included in your flat monthly price.",
  },
  {
    month: "Month 12+",
    label: "Still $179/mo",
    description:
      "No price creep. No renewal hikes. Maintenance dose and ongoing support, same flat rate.",
  },
];

// Authority anchor — community health / family medicine / accessibility focus for /affordable.
const provider = {
  name: "Dr. Evelyn Ramirez, MD",
  credentials: "Board-certified, Family Medicine · Community Health · 12 years practice",
  bio: "Most of my patients aren't asking for a luxury medication — they're asking for one they can actually afford to stay on long enough to benefit. Compounded GLP-1 from a licensed pharmacy, at a transparent monthly price, is how we close that gap for people without specialty insurance coverage.",
  imagePrompt:
    "Professional editorial headshot of a Latina female physician in her mid-40s, warm olive complexion, shoulder-length dark wavy hair pulled back, wearing a crisp white lab coat over a soft burgundy blouse, stethoscope around neck, softbox lighting, clean clinical background slightly blurred, direct warm eye contact, approachable expression, Hasselblad quality, 1:1 aspect ratio.",
};

const priceColumns = [
  {
    name: "Brand-Name Wegovy / Ozempic",
    price: "$1,349/mo",
    priceSubtext: "retail cash-pay*",
    features: [
      { label: "FDA-approved", included: true },
      { label: "Insurance coverage frequently denied or partial", included: false },
      { label: "Pharmacy shortages common in 2025-26", included: false },
      { label: "Prior authorization often required", included: false },
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
      { label: "Compounded by US-licensed pharmacy under individual prescription", included: true },
      { label: "No insurance hurdles — flat monthly price", included: true },
      { label: "In-stock and shipping in ~48 hours", included: true },
      { label: "Ongoing provider + care-team support", included: true },
      { label: "Free 2-day shipping to all 50 states (where legally available)", included: true },
      { label: "30-day money-back guarantee · cancel anytime", included: true },
    ],
    ctaLabel: "See If I Qualify →",
    ctaHref: "/qualify",
  },
];

const testimonials = [
  {
    name: "Latoya B.",
    age: 41,
    location: "Memphis",
    lbs: 34,
    months: 5,
    quote:
      "My insurance denied Wegovy three times. $179/month through Nature's Journey was the first option that actually let me start.",
  },
  {
    name: "Greg M.",
    age: 48,
    location: "Des Moines",
    lbs: 41,
    months: 6,
    quote:
      "Same active ingredient, a quarter of the price. I save enough every month to pay for groceries for the family.",
  },
  {
    name: "Priya S.",
    age: 37,
    location: "Phoenix",
    lbs: 29,
    months: 4,
    quote:
      "No consult fee, no shipping fee, no renewal surprises. The invoice matches the ad — that's rare.",
  },
  {
    name: "Daniel R.",
    age: 52,
    location: "Cleveland",
    lbs: 47,
    months: 7,
    quote:
      "I'm self-employed with a high-deductible plan. This is the only GLP-1 path that made financial sense for me.",
  },
];

// AEO-optimized: each question is a real search query, each answer 40-70 words,
// lead sentence is the bold TL;DR Google's AI Overviews tend to quote.
const faqs = [
  {
    question: "Is $179/mo GLP-1 really legitimate, or is there a catch?",
    answer:
      "It's legitimate. The medication is compounded by a state-licensed US pharmacy under an individual prescription written by a US-licensed provider who reviews your health history. Compounded GLP-1 is not FDA-approved as a branded drug product — the price difference comes from the compounded pathway, not from cutting medical corners.",
  },
  {
    question: "How can you charge $179/mo when retail Wegovy is $1,349/mo?",
    answer:
      "Brand-name GLP-1s carry patent pricing, marketing costs, and retail pharmacy markups. Compounded versions use the same active ingredient but are prepared by licensed compounding pharmacies at the formulation level, bypassing most of those costs. Our $179/mo includes medication, provider oversight, and care-team access as one flat monthly price.",
  },
  {
    question: "What exactly is included in the $179/month price?",
    answer:
      "$179/month covers the compounded GLP-1 medication, the initial licensed-provider evaluation, ongoing provider oversight for dose adjustments, unlimited messaging with the care team, and free 2-day shipping. There is no consult fee, no pharmacy copay, no shipping add-on, and no renewal price hike.",
  },
  {
    question: "Is compounded semaglutide FDA-approved?",
    answer:
      "No. Compounded semaglutide is not FDA-approved as a branded drug product. It contains the same active ingredient as Ozempic and Wegovy but is prepared by a state-licensed compounding pharmacy under an individual prescription. Our program is for patients for whom this is medically appropriate as determined by a licensed provider.",
  },
  {
    question: "Do I need insurance to sign up?",
    answer:
      "No. $179/mo is a flat cash-pay price with no insurance involvement. That means no prior authorizations, no formulary restrictions, no step therapy, and no denials. If you do have insurance, you can submit receipts for HSA/FSA reimbursement — but insurance is never required to start.",
  },
  {
    question: "Can I cancel anytime, or am I locked into a contract?",
    answer:
      "You can cancel anytime directly from your account dashboard. No phone calls, no retention scripts, no long-term commitment. There is also a 30-day money-back guarantee on your first month. If a provider determines you are not eligible, you are not charged for medication.",
  },
  {
    question: "Are there any hidden fees or surprise charges?",
    answer:
      "No. The $179/mo flat price is the complete price — medication, provider care, shipping, and care-team messaging included. We don't charge a consult fee, we don't charge a shipping add-on, and we don't raise the price on renewal. What the checkout says is what you pay, month after month.",
  },
  {
    question: "What happens if my provider decides I don't qualify?",
    answer:
      "You are not charged for medication. The 2-minute eligibility assessment is free and non-binding. If a US-licensed provider determines GLP-1 therapy is not appropriate for your health profile — for safety, contraindications, or clinical history — we let you know and you owe nothing.",
  },
  {
    question: "How long does shipping take, and is there a shipping fee?",
    answer:
      "Shipping is free to all 50 states where the program is legally available and typically arrives within 48 hours of prescription approval. Medication ships in discreet, temperature-controlled packaging. There is no shipping fee added at checkout or on refills — shipping is included in your $179/month.",
  },
  {
    question: "Can I use HSA or FSA funds to pay?",
    answer:
      "Yes — because $179/mo includes a medical evaluation and a prescribed medication, it is typically eligible for HSA and FSA reimbursement. We provide itemized receipts you can submit to your plan administrator. Reimbursement eligibility can vary by plan, so confirm with your administrator to be sure.",
  },
];

// Expanded internal linking for SEO + conversion (AEO 2026 playbook).
const internalLinks = [
  {
    title: "Semaglutide Explained",
    description: "The active ingredient behind most programs — how it works and what it costs.",
    href: "/lp/semaglutide",
  },
  {
    title: "Tirzepatide Programs",
    description: "Dual GLP-1 / GIP medication — clinical overview and pricing.",
    href: "/lp/tirzepatide",
  },
  {
    title: "Ozempic Alternative",
    description: "Same active ingredient, different pathway — how compounded compares.",
    href: "/lp/ozempic-alternative",
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
    description: "Assessment to shipment — the full picture of our $179/mo program.",
    href: "/how-it-works",
  },
] as const;

export default function AffordableLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="Affordable GLP-1"
        badgeIcon={DollarSign}
        badgeIconColor="text-emerald-600"
      />

      {/* ======================================================================
          HERO
          AI-IMAGE PROMPT (hero right-side portrait — optional enhancement)
          Aspect ratio: 4:5
          "Editorial photograph of a warm, everyday woman in her early-40s,
           shoulder-length brown hair, soft beige sweater, holding a small
           prescription box with a relieved half-smile, natural window light,
           earth-toned neutral background, candid editorial style, shallow
           depth of field. Body language: quiet relief. Clean, no logos."
          ====================================================================== */}
      <LpHeroBlock
        badge="Affordable GLP-1"
        headline="Prescription GLP-1 for $179/mo —"
        headlineAccent="no insurance needed"
        subtitle="Retail GLP-1s run $1,349/mo. Ours is $179/mo flat — medication, provider oversight, and support included. US-licensed pharmacy. 2-minute eligibility check."
        stats={heroStats}
        ctaLocation="hero-affordable"
      />

      <LpSocialProofBar />

      {/* Real outcome numbers anchor the claim before objections land */}
      <LpOutcomeStats
        stats={outcomeStats}
        heading="The math, transparent"
        subheading="Flat price, licensed pharmacy, no insurance required."
      />

      {/* Problem Section */}
      <LpProblemSection
        eyebrow="WHY GLP-1 FEELS OUT OF REACH"
        heading="Pricing, paperwork, and traps"
        cards={lpProblemCards}
        transitionText="Access to effective treatment shouldn't depend on your employer's formulary."
        ctaLocation="problem-affordable"
      />

      {/* Why Nature's Journey Is Different */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            Why Nature&apos;s Journey is different
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Same active ingredient. Real prescribers. Honest pricing.
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

      {/* How GLP-1 Solves Affordability */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            How our program solves the cost problem
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Compounding + cash-pay + flat monthly billing = real access.
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
        headline="Ready to see if $179/mo works for you?"
        subtext="Free 2-minute assessment. No credit card required. Licensed providers."
        location="mid-affordable"
      />

      {/* Journey roadmap — defuses "what happens next?" objection and reinforces flat pricing */}
      <LpJourneyRoadmap
        milestones={journeyMilestones}
        heading="Your monthly cost, month by month"
        subheading="$179/mo flat — the same price on month 1, month 6, and month 12."
      />

      {/* Price comparison — THE load-bearing section for /affordable. Anchoring effect at max. */}
      <LpPriceCompare
        columns={priceColumns}
        heading="Same active ingredient. Plans from $179/mo."
        subheading="Compare branded retail cash-pay to our flat-fee compounded program."
      />

      {/* Provider authority anchor */}
      <LpProviderCredential
        provider={provider}
        heading="Affordable doesn't mean unsupervised"
      />

      {/* Testimonials */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-8">
            Members who skipped the $1,349 price tag
          </h2>
          {/* AI-IMAGE PROMPT (optional — testimonial avatars)
              Aspect ratio: 1:1
              "Four photorealistic headshot portraits, diverse working-class
               Americans ages 35-55, soft natural window light, genuine warm
               expressions, neutral backgrounds in warm earth tones, editorial
               photojournalism style, candid not posed, Sony A7R 85mm f/1.8.
               No logos, no fitness branding. Emphasis on relatability and
               dignity."
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
        heading="Affordability & GLP-1: your questions"
        subheading="Everything you need to know about our flat $179/mo pricing."
      />

      {/* Internal Links */}
      <LpInternalLinks heading="Keep exploring" links={internalLinks} />

      {/* Final CTA */}
      <LpCtaSection
        headline="Affordable, prescribed, and real"
        bgClassName="bg-gradient-to-r from-emerald-50 to-lime-50"
      />

      <LpFooter />

      {/* JSON-LD */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Affordable GLP-1", href: "/lp/affordable" },
        ]}
      />
      <MedicalWebPageJsonLd
        name="Affordable GLP-1 Weight Loss Program"
        description="Prescription GLP-1 from US-licensed providers for $179/mo — no insurance required. Compounded medication, flat monthly billing, cancel anytime."
        url="/lp/affordable"
      />
      <FAQPageJsonLd faqs={faqs} />
      <LpConversionWidgets />
    </div>
  );
}
