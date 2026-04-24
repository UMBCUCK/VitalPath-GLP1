import type { Metadata } from "next";
import {
  Check,
  Star,
  Clock,
  AlertTriangle,
  Users,
  Sparkles,
  Target,
  Calendar,
  Award,
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
// "Editorial photograph of a confident person in their 40s walking into a
//  brightly lit reunion venue, head turning slightly, slight assured smile,
//  warm amber palette, shallow depth of field. Body language: ready,
//  unrecognizable, owning the room. No logos."
// ============================================================================

export const metadata: Metadata = {
  // Primary keywords: class reunion weight loss, lose weight before reunion,
  // high school reunion glow up, college reunion weight loss, GLP-1 transformation
  title: "Reunion Weight Loss | GLP-1 Transformation | From $179/mo",
  description:
    "Show up unrecognizable. Prescribed GLP-1 may help you lose up to 8 lbs in your first month* and 15-20% body weight over 6-12 months. Same active ingredient as Ozempic. From $179/mo.",
  openGraph: {
    title: "Reunion-Ready in 6 Months — GLP-1 from $179/mo",
    description:
      "Show up as someone unrecognizable. Prescribed GLP-1 from licensed US providers. Same active ingredient as Ozempic. Individual results vary.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/reunion",
  },
};

const heroStats = [
  { value: "Unrecognizable", label: "Target" },
  { value: "15-20%*", label: "Avg weight loss" },
  { value: "$179/mo", label: "Starting at" },
  { value: "18,000+", label: "Members" },
];

const outcomeStats = [
  {
    value: "18,000+",
    label: "Members on program",
    sublabel: "A community using a real deadline as their catalyst.",
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
    title: "Reunion season is 6 months away",
    description:
      "Crash diets fail in that exact window. Hard cardio injures out. You need a biological tool that works on the timeline you actually have.",
  },
  {
    icon: AlertTriangle,
    title: "You've spent years avoiding the mirror",
    description:
      "Not because you didn't care — because nothing worked. That's the biology of weight regain, not lack of discipline.",
  },
  {
    icon: Users,
    title: "You know who'll be there",
    description:
      "Half the class is on GLP-1. The other half wonders how. Same active molecule as Ozempic, prescribed online, at $179/mo.",
  },
] as const;

const problemCards = [
  {
    icon: Calendar,
    title: "A real deadline forces action",
    description:
      "A reunion is one of the few self-improvement deadlines that doesn't move. Date locked. Outcome visible. That structure is rocket fuel for adherence.",
  },
  {
    icon: Target,
    title: "Emotional investment = higher adherence",
    description:
      "When the stakes feel personal, the daily injection becomes easier, not harder. Reunion-driven members consistently stick longer than open-ended starters.",
  },
  {
    icon: Award,
    title: "Social accountability (visible goal)",
    description:
      "Posting a photo with old friends is real visible accountability. The biology of GLP-1 plus the psychology of a fixed deadline is a powerful combination.",
  },
];

const solutionCards = [
  {
    title: "6-month window = ~15% body weight loss typical",
    description:
      "Most members on GLP-1 lose 12-18% body weight in 6 months. For a 200-lb starting point, that's ~30 lbs by reunion night. Individual results vary.",
  },
  {
    title: "Steady, sustainable, not crash",
    description:
      "GLP-1 doesn't starve you to a number you can't keep. Loss is gradual and biologically supported — not the spring-back trap of a crash diet.",
  },
  {
    title: "Keeps working past the reunion",
    description:
      "After the event, your provider transitions you to a maintenance plan. The reunion catalyzed it; the protocol carries it forward indefinitely.",
  },
];

const journeyMilestones = [
  {
    month: "Month 1",
    label: "Titration + first 4-8 lbs",
    description:
      "Dose starts low. GI tract adjusts. Cravings quiet within weeks. The countdown starts visibly.",
  },
  {
    month: "Month 3",
    label: "10-15 lbs. Clothes noticeably different.",
    description:
      "Friends start asking what you're doing. Your old jeans are loose. The shape of the goal is taking form.",
  },
  {
    month: "Month 6",
    label: "15-20% body weight. Reunion-ready.",
    description:
      "You've reached the typical 6-month milestone. If your reunion is here, you walk in unrecognizable.",
  },
  {
    month: "Month 9",
    label: "Past the event. Still losing or maintaining.",
    description:
      "The reunion came and went. The progress didn't stop. Many members continue loss past the event with the dose holding.",
  },
  {
    month: "Month 12+",
    label: "This is who you are now.",
    description:
      "Maintenance dose tailored by your provider. The reunion was a catalyst — the new baseline is yours.",
  },
  {
    month: "Beyond",
    label: "Long-term sustainability",
    description:
      "Most members stay on a lower dose long-term. Sustained weight, sustained energy, sustained confidence — long after the reunion is a memory.",
  },
];

const provider = {
  name: "Dr. Marcus Whitfield, MD",
  credentials: "Family Medicine · Obesity Medicine Board · 12 years practice",
  bio: "People come to me with reunion deadlines thinking they need a miracle. They don't — they need 6 months and the right tool. GLP-1 makes the math finally work for a deadline audience. The hardest part is showing up for the first provider visit.",
  imagePrompt:
    "Professional editorial headshot of a 44-year-old Black male physician, close-cropped beard, confident warm smile, white coat over navy shirt, modern clinic background softly blurred, natural daylight, Hasselblad quality, 1:1 aspect ratio.",
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
      { label: "6-month reunion timeline support", included: false },
      { label: "30-day money-back guarantee", included: false },
    ],
  },
  {
    name: "Nature's Journey Reunion Plan",
    price: "$179/mo",
    priceSubtext: "no insurance needed",
    highlight: true,
    features: [
      { label: "Same active semaglutide molecule", included: true },
      { label: "Compounded by US 503A pharmacy", included: true },
      { label: "No insurance hurdles — flat monthly price", included: true },
      { label: "Ongoing provider + care-team support", included: true },
      { label: "6-month reunion timeline support", included: true },
      { label: "30-day money-back guarantee", included: true },
    ],
    ctaLabel: "See If I Qualify →",
    ctaHref: "/qualify",
  },
];

const testimonials = [
  {
    name: "Anthony M.",
    age: 46,
    location: "Boston",
    lbs: 48,
    months: 9,
    quote:
      "25-year reunion. Three people didn't recognize me. Best feeling ever.",
  },
  {
    name: "Leah R.",
    age: 38,
    location: "Atlanta",
    lbs: 34,
    months: 7,
    quote:
      "10-year reunion. Wore the outfit I swore I would wear someday.",
  },
  {
    name: "Chris V.",
    age: 54,
    location: "Minneapolis",
    lbs: 52,
    months: 10,
    quote:
      "30-year reunion. The teacher I had a crush on actually asked for my number.",
  },
  {
    name: "Nina S.",
    age: 43,
    location: "Denver",
    lbs: 29,
    months: 6,
    quote:
      "Going to my sorority reunion next month. Feels like a victory lap.",
  },
];

const faqs = [
  {
    question: "My reunion is in 3 months — is it too late?",
    answer:
      "Not at all. Three months is enough for a meaningful, visible change — typically 8-15 lbs lost depending on starting weight. Friends will notice. Your goal posture matters more than the final number; clothes fitting differently and energy returning are visible at 90 days. Individual results vary.",
  },
  {
    question: "Do I stop after the reunion?",
    answer:
      "Most members continue on a maintenance dose to protect the loss. Stopping abruptly often leads to regain. Your provider builds a long-term plan — sometimes lower dose, sometimes periodic pauses — to sustain results past the event. The reunion is the catalyst, not the endpoint.",
  },
  {
    question: "Is this the same as Ozempic?",
    answer:
      "Compounded semaglutide contains the same active ingredient as Ozempic and Wegovy, prepared by a state-licensed compounding pharmacy under an individual prescription. It is not FDA-approved as a branded drug product. Our program is for patients for whom this is medically appropriate as determined by a licensed provider.",
  },
  {
    question: "Cost?",
    answer:
      "$179/month flat. That includes the compounded medication, ongoing provider oversight, care-team messaging, and shipping. No insurance hoops, no surprise copays. Six months of reunion prep at this rate runs about $1,074 total — far less than brand-name retail at the same duration.",
  },
  {
    question: "Side effects?",
    answer:
      "Most common are mild gastrointestinal symptoms (nausea, constipation, reflux) during dose titration, usually resolving in 2-3 weeks. Your provider starts low and steps up slowly specifically to minimize these. Hydration, fiber, and electrolytes help. Persistent issues are reviewed promptly.",
  },
  {
    question: "Can I drink at the reunion?",
    answer:
      "Many members find they want less alcohol on GLP-1 — the medication appears to reduce reward signals around drinking for some people. Moderate alcohol is generally fine; heavy drinking is not recommended. Your provider reviews your specific situation. The reunion will land just fine with a glass or two.",
  },
  {
    question: "What if I gain it back after?",
    answer:
      "Weight regain after stopping GLP-1 is common — it's a chronic-condition treatment. Most members stay on a lower maintenance dose to protect results. Your provider builds the maintenance plan with you, including dose adjustments, periodic pauses, and habit work to sustain the new baseline.",
  },
  {
    question: "How much will I lose in 6 months?",
    answer:
      "Published clinical ranges suggest 12-18% body weight loss at 6 months for many GLP-1 patients. For a 200-lb starting weight, that's typically 24-36 lbs. Individual results vary based on starting weight, dose, adherence, and biology. Your provider tracks and adjusts to your response.",
  },
  {
    question: "Is this for men and women?",
    answer:
      "Yes. GLP-1 works on the same hunger and insulin pathways for both. We prescribe for men and women across the full reunion-age range, from 10-year reunions in your late 20s to 50-year reunions in your late 60s. Your licensed provider tailors the protocol to your health history.",
  },
  {
    question: "What if I want to lose more after?",
    answer:
      "Many members do. The 6-month window is rarely the full goal — it's just the trigger. Most members continue loss past the reunion at a slower pace, then transition to maintenance once they reach their target. Your provider adjusts dose and timing as you go.",
  },
];

const internalLinks = [
  {
    title: "Post-Breakup Glow-Up",
    description: "Same emotional catalyst, different deadline — turning a transition into a transformation.",
    href: "/lp/after-breakup",
  },
  {
    title: "Post-Divorce Reset",
    description: "Reinvention after the hardest year — with a tool that matches your biology.",
    href: "/lp/after-divorce",
  },
  {
    title: "Pre-Wedding Weight Loss",
    description: "The other big-deadline LP — same playbook, different outfit.",
    href: "/lp/before-wedding",
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

export default function ReunionLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="Reunion-Ready"
        badgeIcon={Sparkles}
        badgeIconColor="text-orange-500"
      />

      {/* ======================================================================
          HERO
          AI-IMAGE PROMPT (hero right-side portrait — optional enhancement)
          Aspect ratio: 4:5
          "Editorial portrait of a confident person in their 40s arriving
           at a softly-lit reunion venue, knowing half-smile, warm amber
           palette, slight forward motion, shallow depth of field. Body
           language: ready, owning the room. No logos."
          ====================================================================== */}
      <LpHeroBlock
        badge="Reunion-Ready"
        headline="Show up unrecognizable by May."
        headlineAccent="Same active ingredient as Ozempic."
        subtitle="A reunion is a deadline most people ignore — and regret for years after. Doctor-prescribed GLP-1 may help you lose up to 8 lbs in your first month* and 15-20% of body weight over 6-12 months. Same active molecule as Ozempic and Wegovy. From $179/mo. Individual results vary."
        stats={heroStats}
        ctaLocation="hero-reunion"
      />

      <LpSocialProofBar />

      <LpOutcomeStats
        stats={outcomeStats}
        heading="What members actually see"
        subheading="Program outcomes, not marketing numbers."
      />

      <LpProblemSection
        eyebrow="WHY REUNIONS HIT DIFFERENT"
        heading="A real deadline most people regret ignoring."
        cards={lpProblemCards}
        transitionText="A real deadline deserves a real biological tool — not another crash diet."
        ctaLocation="problem-reunion"
      />

      {/* Why Reunions Are a Great Catalyst */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            Why reunions are a great catalyst
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            The structure of a fixed date is rocket fuel for adherence.
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

      {/* How GLP-1 Works on a Reunion Timeline */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            How GLP-1 works on a reunion timeline
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Steady, sustainable loss that lands the deadline — and keeps going past it.
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
        headline="Ready to be the story of the night?"
        subtext="Free 2-minute assessment. Licensed providers. No commitment."
        location="mid-reunion"
      />

      <LpJourneyRoadmap
        milestones={journeyMilestones}
        heading="What to expect — month by month, deadline-paced"
        subheading="A 6-month arc your provider builds with you, with maintenance past the event."
      />

      <LpPriceCompare
        columns={priceColumns}
        heading="Same active ingredient. Plans from $179/mo."
        subheading="Access to GLP-1 shouldn't depend on insurance — or a six-figure brand-name retail bill."
      />

      <LpProviderCredential
        provider={provider}
        heading="Every plan is overseen by a real clinician"
      />

      {/* Testimonials */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-8">
            Members who showed up unrecognizable
          </h2>
          {/* AI-IMAGE PROMPT (optional — testimonial avatars)
              Aspect ratio: 1:1
              "Four photorealistic headshot portraits of adults ages 38-54,
               confident proud expressions, soft natural lighting, warm
               amber palette, editorial photojournalism style, candid not
               posed, Sony A7R 85mm f/1.8. No logos."
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
        heading="Reunion weight loss & GLP-1: your questions"
        subheading="Everything you need to know about a 6-month transformation arc."
      />

      <LpInternalLinks heading="Keep exploring" links={internalLinks} />

      <LpCtaSection
        headline="Show up as someone unrecognizable."
        bgClassName="bg-gradient-to-br from-orange-50 to-amber-50"
      />

      <LpFooter />

      {/* JSON-LD */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Reunion Weight Loss", href: "/lp/reunion" },
        ]}
      />
      <MedicalWebPageJsonLd
        name="Reunion Weight Loss with GLP-1"
        description="Show up unrecognizable. Doctor-prescribed GLP-1 may help you lose 15-20% of body weight over 6-12 months. Licensed US providers. From $179/mo. Individual results vary."
        url="/lp/reunion"
      />
      <FAQPageJsonLd faqs={faqs} />
      <LpConversionWidgets />
    </div>
  );
}
