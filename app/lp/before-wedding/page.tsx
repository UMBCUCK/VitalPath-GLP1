import type { Metadata } from "next";
import {
  Check,
  Star,
  Flame,
  AlertTriangle,
  Clock,
  Calendar,
  Heart,
  Sparkles,
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
// "Editorial photograph of a woman in her late 20s in a bridal dress fitting,
//  standing before a trifold mirror in an ivory gown, seamstress adjusting
//  hemline, soft natural daylight pouring through tall windows, muted warm
//  palette, genuine smile, shallow depth of field, Canon R5 85mm f/1.4.
//  Emphasis on calm confidence, the dress fitting perfectly. No logos."
// ============================================================================

export const metadata: Metadata = {
  // Primary keywords: lose weight before wedding, bridal weight loss plan, wedding weight loss GLP-1, groom weight loss, dress alterations weight loss, wedding bootcamp alternative
  title: "Lose Weight Before Your Wedding | GLP-1 | From $179/mo",
  description:
    "Fit that dream dress by your big day. Prescribed GLP-1 may help you lose up to 8 lbs in your first month.* Same active ingredient as Ozempic. From $179/mo. 2-minute assessment.",
  openGraph: {
    title: "Wedding Weight Loss — GLP-1 from $179/mo",
    description:
      "Your big day deserves the body you've been working toward. Prescribed GLP-1 from licensed US providers. Same active ingredient as Ozempic.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/before-wedding",
  },
};

const heroStats = [
  { value: "Wedding-ready", label: "Timeline" },
  { value: "15-20%*", label: "Avg weight loss" },
  { value: "$179/mo", label: "Starting at" },
  { value: "18,000+", label: "Members" },
];

const outcomeStats = [
  {
    value: "18,000+",
    label: "Members on program",
    sublabel: "Brides, grooms, and wedding parties included.",
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
    title: "Wedding bootcamps burn you out",
    description:
      "Six weeks of brutal workouts you can't sustain after the honeymoon. The weight comes back by month three of marriage.",
  },
  {
    icon: Flame,
    title: "Your dress fitting is weeks away",
    description:
      "Crash diets fail at the exact moment the dress needs to fit. Your biology needs a better tool than starvation.",
  },
  {
    icon: AlertTriangle,
    title: "Your dream dress shouldn't require starving yourself",
    description:
      "GLP-1 quiets appetite at the hormonal level — you eat less without fighting constant hunger through planning season.",
  },
] as const;

const problemCards = [
  {
    icon: Calendar,
    title: "High Stakes + Hard Deadline",
    description:
      "The date is set. The dress is ordered. You can't negotiate your wedding timeline — you need a tool that works inside one.",
  },
  {
    icon: Flame,
    title: "Photo-Permanent",
    description:
      "Wedding photos are forever. You deserve to love how you look in them — not to wish later you'd started sooner.",
  },
  {
    icon: Heart,
    title: "Sustainable Past the Honeymoon",
    description:
      "Bootcamp weight comes back. GLP-1 builds habits through your biology that hold well past the honeymoon flight home.",
  },
];

const solutionCards = [
  {
    title: "Appetite regulation",
    description:
      "GLP-1 reduces constant hunger signals. Wedding-season stress eating quiets on its own — no willpower white-knuckle required.",
  },
  {
    title: "Insulin sensitivity",
    description:
      "Better glucose processing = less fat storage, especially in the midsection where wedding dresses are least forgiving.",
  },
  {
    title: "Steady loss on a deadline",
    description:
      "Clinical trials show consistent loss across months 1-12. Six months of engagement = meaningful, photo-ready results.",
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
    label: "First 4-8 lbs",
    description:
      "Appetite softens. Planning stress doesn't spiral into snacking the way it did.",
  },
  {
    month: "Month 3",
    label: "First dress fitting",
    description:
      "10-15 lbs down. Dress goes on easier than expected. Seamstress books alterations.",
  },
  {
    month: "Month 6",
    label: "Final alterations",
    description:
      "Dress comes in on the small side. The tailor takes it in — again.",
  },
  {
    month: "Month 9+",
    label: "Big day ready",
    description:
      "Your provider tailors the dose so you feel your best on the day — and well past the honeymoon.",
  },
];

const provider = {
  name: "Dr. Hannah Reyes, MD",
  credentials: "Family Medicine · Obesity Medicine Certified · 11 years practice",
  bio: "Brides and grooms come to me weeks before the wedding stressed and hungry. GLP-1 can't work miracles in 30 days — but it can turn a 6-month engagement into real, sustainable loss that still shows up on the honeymoon.",
  imagePrompt:
    "Professional editorial headshot of a 34-year-old mixed-race female physician, warm bright smile, white coat over blush blouse with gold pendant, bright clinic background softly blurred, natural daylight, Hasselblad quality, 1:1 aspect ratio.",
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
      { label: "Free 2-day shipping", included: false },
      { label: "30-day money-back guarantee", included: false },
    ],
  },
  {
    name: "Nature's Journey Bridal Plan",
    price: "$179/mo",
    priceSubtext: "no insurance needed",
    highlight: true,
    features: [
      { label: "Same active semaglutide molecule", included: true },
      { label: "Compounded by US 503A pharmacy", included: true },
      { label: "No insurance hurdles — flat monthly price", included: true },
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
    name: "Kaitlyn R.",
    age: 28,
    location: "Nashville",
    lbs: 24,
    months: 5,
    quote:
      "My dress came in three sizes too big. The seamstress said she'd never taken a wedding dress in that much. Worth every second.",
  },
  {
    name: "Daniel C.",
    age: 31,
    location: "San Diego",
    lbs: 36,
    months: 6,
    quote:
      "My fiancée cried when I tried on the tux. I'd been 'planning to lose weight' for three engagements' worth of time.",
  },
  {
    name: "Priya N.",
    age: 29,
    location: "Jersey City",
    lbs: 22,
    months: 5,
    quote:
      "Started 8 months before the wedding. Felt like myself in every photo for the first time since college.",
  },
  {
    name: "Marcus B.",
    age: 34,
    location: "Dallas",
    lbs: 41,
    months: 7,
    quote:
      "Groom's suit had to be re-fitted twice. Still on a maintenance dose — the goal is to stay here for the 10-year anniversary photos too.",
  },
];

const faqs = [
  {
    question: "My wedding is in 8 weeks — is it too late?",
    answer:
      "Full GLP-1 results take months, but many members still see meaningful loss in the first 4-8 weeks (often 4-10 lbs). You likely won't hit peak results by the date, but you'll typically arrive smaller than you started — and keep going on the honeymoon. Individual results vary.",
  },
  {
    question: "Can I keep taking it through the honeymoon?",
    answer:
      "Yes. Many members stay on GLP-1 through the wedding and honeymoon to avoid rebound. Your provider adjusts dose based on your goals and response. Traveling is common — compounded medication can ship to most addresses; plan refills a couple weeks ahead for international trips.",
  },
  {
    question: "Is this for grooms too?",
    answer:
      "Absolutely. Grooms are roughly a third of our wedding-timeline members. GLP-1 works on the same hunger and insulin pathways regardless of gender. Your provider tailors the protocol to men's typical metabolism and muscle composition.",
  },
  {
    question: "What about my bridesmaids or groomsmen?",
    answer:
      "Each person needs their own provider assessment and prescription — we can't bulk-enroll a wedding party. That said, plenty of members refer friends who also qualify individually. Each gets their own provider oversight, dosing, and shipments.",
  },
  {
    question: "Can I taper off after the wedding?",
    answer:
      "Yes. Your provider builds a post-wedding plan — often a lower maintenance dose, sometimes a gradual taper. Stopping cold-turkey risks rebound, which is why most obesity-medicine doctors recommend structured tapering or long-term maintenance instead.",
  },
  {
    question: "Is this the same as Ozempic?",
    answer:
      "Compounded semaglutide contains the same active ingredient as Ozempic and Wegovy, prepared by a state-licensed compounding pharmacy under an individual prescription. It is not FDA-approved as a branded drug product. Our program is for patients for whom this is medically appropriate as determined by a licensed provider.",
  },
  {
    question: "Will I lose muscle tone in my arms for the dress?",
    answer:
      "Resistance training during weight loss protects lean mass and keeps arms toned. Your care team includes activity guidance tailored to a wedding-ready silhouette. Many members pair GLP-1 with a simple strength routine 2-3 days per week.",
  },
  {
    question: "What side effects should I expect before the wedding?",
    answer:
      "Most common are mild gastrointestinal symptoms (nausea, constipation, reflux) during dose titration. Your provider starts low and steps up slowly specifically to minimize these. Most members stabilize within 4-6 weeks — well before the big day if you start now.",
  },
  {
    question: "Do I need insurance?",
    answer:
      "No. Plans start at $179/month — a flat price including compounded medication, provider oversight, and care-team messaging. Insurance never covered a dress fitting either. Cancel anytime. 30-day money-back guarantee on your first month.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. No long-term commitment. You can pause or cancel any time through your dashboard. If a licensed provider determines you're not eligible — for safety or contraindications — you aren't charged for medication. The 2-minute eligibility assessment is free and non-binding.",
  },
];

const internalLinks = [
  {
    title: "Women's Weight Loss",
    description: "Programs tuned for hormonal and life-stage changes women face.",
    href: "/lp/women",
  },
  {
    title: "Men's Weight Loss",
    description: "GLP-1 protocols adjusted for men's metabolism and body comp.",
    href: "/lp/men",
  },
  {
    title: "Affordable GLP-1",
    description: "From $179/mo — compare plans and what's included at each tier.",
    href: "/lp/affordable",
  },
  {
    title: "See Pricing Plans",
    description: "Essential, Premium, Complete — full plan comparison.",
    href: "/pricing",
  },
  {
    title: "Check Eligibility",
    description: "2 minutes. No cost. No commitment. Licensed-provider review.",
    href: "/qualify",
  },
  {
    title: "How It Works",
    description: "The full journey from assessment to shipment to support.",
    href: "/how-it-works",
  },
] as const;

export default function BeforeWeddingLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="Bridal Plan"
        badgeIcon={Sparkles}
      />

      {/* ======================================================================
          HERO
          AI-IMAGE PROMPT (hero right-side portrait — optional enhancement)
          Aspect ratio: 4:5
          "Editorial portrait of a woman in her late 20s trying on a white
           wedding gown in a bridal salon, trifold mirror softly blurred in
           background, natural daylight, genuine surprised-happy expression,
           hands resting on her waist, shallow depth of field. Body language:
           elated, confident. No logos. Dress unbranded."
          ====================================================================== */}
      <LpHeroBlock
        badge="Bridal Plan"
        headline="Fit that dream dress by May."
        headlineAccent="Same active ingredient as Ozempic."
        subtitle="Your big day deserves the body you've been working toward. Prescribed GLP-1 may help you lose up to 8 lbs in your first month.* Same active molecule as Ozempic and Wegovy. From $179/mo. 2-minute assessment. Individual results vary."
        stats={heroStats}
        ctaLocation="hero-before-wedding"
      />

      <LpSocialProofBar />

      <LpOutcomeStats
        stats={outcomeStats}
        heading="What members actually see"
        subheading="Program outcomes, not marketing numbers."
      />

      <LpProblemSection
        eyebrow="WHY BRIDAL BOOTCAMPS FAIL"
        heading="The wedding industry sold you the wrong tool."
        cards={lpProblemCards}
        transitionText="A biological problem deserves a biological solution — on your timeline."
        ctaLocation="problem-before-wedding"
      />

      {/* Why Wedding Weight Loss Is Different */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            Why wedding weight loss is different
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            You have a date, a dress, and photos that will live forever.
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

      {/* How GLP-1 Works for Brides (and Grooms) */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            How GLP-1 works for brides (and grooms)
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            A hormonal tool matched to a hormonal challenge — on your deadline.
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
        headline="Ready to love your dress fitting?"
        subtext="Free 2-minute assessment. Licensed providers. No commitment."
        location="mid-before-wedding"
      />

      <LpJourneyRoadmap
        milestones={journeyMilestones}
        heading="Your engagement timeline, month by month"
        subheading="Start now, arrive at the aisle smaller than you thought possible."
      />

      <LpPriceCompare
        columns={priceColumns}
        heading="Same active ingredient. Plans from $179/mo."
        subheading="Your insurance never covered a dress fitting either."
      />

      <LpProviderCredential
        provider={provider}
        heading="Every plan is overseen by a real clinician"
      />

      {/* Testimonials */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-8">
            Brides & grooms who showed up smaller
          </h2>
          {/* AI-IMAGE PROMPT (optional — testimonial avatars)
              Aspect ratio: 1:1
              "Four photorealistic headshot portraits, diverse brides and
               grooms ages 26-36, soft natural window light, radiant genuine
               smiles, neutral backgrounds in cream and blush tones, editorial
               photojournalism style, candid not posed, Sony A7R 85mm f/1.8.
               No logos, no wedding iconography."
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
        heading="Wedding weight loss & GLP-1: your questions"
        subheading="Everything you need to know before your first fitting."
      />

      <LpInternalLinks heading="Keep exploring" links={internalLinks} />

      <LpCtaSection
        headline="The dress fits. Your day begins."
        bgClassName="bg-gradient-to-r from-rose-50 to-amber-50"
      />

      <LpFooter />

      {/* JSON-LD */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Wedding Weight Loss", href: "/lp/before-wedding" },
        ]}
      />
      <MedicalWebPageJsonLd
        name="Lose Weight Before Your Wedding with GLP-1"
        description="Your big day deserves the body you've been working toward. Doctor-prescribed GLP-1 may help you lose up to 8 lbs in your first month. Licensed US providers. From $179/mo."
        url="/lp/before-wedding"
      />
      <FAQPageJsonLd faqs={faqs} />
      <LpConversionWidgets />
    </div>
  );
}
