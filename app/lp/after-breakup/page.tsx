import type { Metadata } from "next";
import {
  Check,
  Star,
  Flame,
  Brain,
  AlertTriangle,
  Clock,
  Scale,
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
// "Candid editorial photograph of a confident woman in her early 30s walking
//  alone through a softly-lit city park at golden hour, wearing a caramel
//  trench coat over athletic wear, earbuds in, chin up, slight confident
//  smile, shallow depth of field, Canon R5 85mm f/1.4. Emphasis on forward
//  motion, self-possession, the beginning of a new chapter. No logos."
// ============================================================================

export const metadata: Metadata = {
  // Primary keywords: post-breakup weight loss, lose weight after breakup, breakup glow up, revenge body GLP-1, post-breakup transformation, breakup weight gain
  title: "Lose Breakup Weight with GLP-1 | From $179/mo | Nature's Journey",
  description:
    "Turn the breakup into your transformation. Doctor-prescribed GLP-1 may help you lose up to 8 lbs in your first month.* Same active ingredient as Ozempic. From $179/mo. 2-min assessment.",
  openGraph: {
    title: "Lose Breakup Weight — GLP-1 Glow-Up from $179/mo",
    description:
      "Take your power back. Prescribed GLP-1 from licensed US providers. Same active ingredient as Ozempic. 2-minute eligibility. Individual results vary.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/after-breakup",
  },
};

const heroStats = [
  { value: "Glow-up", label: "Ready" },
  { value: "15-20%*", label: "Avg weight loss" },
  { value: "$179/mo", label: "Starting at" },
  { value: "18,000+", label: "Members" },
];

const outcomeStats = [
  {
    value: "18,000+",
    label: "Members on program",
    sublabel: "A community of people rewriting their next chapter.",
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
    icon: AlertTriangle,
    title: "Stress eating is real",
    description:
      "Breakups spike cortisol — the same hormone that parks fat at your waist. It's not weakness; it's biology.",
  },
  {
    icon: Brain,
    title: "You don't have time for the gym right now",
    description:
      "You're healing. GLP-1 works with your biology while life is upside-down — no hours of cardio required.",
  },
  {
    icon: Clock,
    title: "The 'glow-up' shouldn't cost $1,349/mo",
    description:
      "Compounded GLP-1 is the same active molecule as Ozempic at a fraction of the price. No insurance fight.",
  },
] as const;

const problemCards = [
  {
    icon: Flame,
    title: "Cortisol Fat Storage",
    description:
      "Breakup stress keeps cortisol elevated for weeks — and cortisol tells your body to store fat centrally, right around your waistline.",
  },
  {
    icon: Scale,
    title: "Sleep-Deprived Overeating",
    description:
      "Two weeks of bad sleep raises ghrelin (hunger) and drops leptin (fullness). You reach for comfort food because your hormones demand it.",
  },
  {
    icon: Heart,
    title: "Emotional Grazing",
    description:
      "Loneliness and sadness drive unconscious snacking — bites that never register but absolutely add up. Willpower alone can't out-feel emotion.",
  },
];

const solutionCards = [
  {
    title: "Quiets cortisol-driven cravings",
    description:
      "GLP-1 mutes the appetite signals that spike hardest during stress. Less reaching for comfort food. More time to actually heal.",
  },
  {
    title: "Improves insulin sensitivity",
    description:
      "By normalizing how your body processes glucose, GLP-1 breaks the stress-eating-storage cycle that adds breakup pounds.",
  },
  {
    title: "Steady loss while you heal",
    description:
      "This isn't a crash diet on top of heartbreak. It's a sustainable tool that works in the background while you rebuild.",
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
      "Cravings quiet. Waistband loosens. Sleep improves.",
  },
  {
    month: "Month 3",
    label: "10-15 lbs down",
    description:
      "Friends start noticing. Clothes fit differently. Your energy comes back.",
  },
  {
    month: "Month 6",
    label: "15-20% body weight",
    description:
      "This is the version of you you've been waiting to meet.",
  },
  {
    month: "Month 12+",
    label: "Maintenance",
    description:
      "Your provider tailors the dose for long-term sustainability.",
  },
];

const provider = {
  name: "Dr. Sarah Kim, MD",
  credentials: "Women's Health · Obesity Medicine · 12 years practice",
  bio: "Breakup weight is stress weight — cortisol, sleep loss, emotional eating all compound. Adding a tool like GLP-1 isn't giving up on willpower; it's addressing the biology your willpower has been fighting alone.",
  imagePrompt:
    "Professional editorial headshot of a Korean-American female physician in her late 30s, warm empathetic smile, white coat over dusty rose blouse, soft clinic background, natural daylight, Hasselblad quality, 1:1 aspect ratio.",
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
    name: "Nature's Journey Glow-Up Plan",
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
    name: "Morgan R.",
    age: 32,
    location: "Austin",
    lbs: 27,
    months: 5,
    quote:
      "Six months after my breakup, I don't even recognize the version of me that stayed.",
  },
  {
    name: "James L.",
    age: 38,
    location: "Chicago",
    lbs: 34,
    months: 6,
    quote:
      "My ex-wife moved on. So did I — just in a different direction.",
  },
  {
    name: "Alyssa T.",
    age: 29,
    location: "Seattle",
    lbs: 22,
    months: 4,
    quote:
      "I stopped crying into pizza. That was the first win.",
  },
  {
    name: "Raj P.",
    age: 35,
    location: "Boston",
    lbs: 31,
    months: 5,
    quote:
      "Started this the week the divorce finalized. Best decision I made in a year.",
  },
];

const faqs = [
  {
    question: "Is GLP-1 emotional eating?",
    answer:
      "No — GLP-1 is a prescription medication that regulates the hormones driving hunger and fullness. It quiets the biological pull toward food that stress and emotion amplify, which is different from 'willpower.' It gives your rational brain room to lead again while you heal. Individual results vary.",
  },
  {
    question: "How fast will I see results?",
    answer:
      "Many members notice softer cravings within the first two weeks. Visible weight loss typically shows up around weeks 4-8 as your dose is titrated up. Published trials show 15-20% body weight loss over 12+ months for many patients. Everyone is different — your provider tracks and adjusts to your response.",
  },
  {
    question: "Is this for men and women?",
    answer:
      "Yes. GLP-1 works on the same hunger and insulin pathways in everyone. We prescribe for men and women going through breakups, divorces, and life transitions in their 20s through 60s. Your licensed provider tailors dose and protocol to your specific health history.",
  },
  {
    question: "Is this the same as Ozempic?",
    answer:
      "Compounded semaglutide contains the same active ingredient as Ozempic and Wegovy, prepared by a state-licensed compounding pharmacy under an individual prescription. It is not FDA-approved as a branded drug product. Our program is for patients for whom this is medically appropriate as determined by a licensed provider.",
  },
  {
    question: "Do I need insurance?",
    answer:
      "No. Plans start at $179/month and include the compounded medication, ongoing provider oversight, and messaging with your care team. No insurance hoops, no pre-authorizations, no surprise co-pays. You can cancel anytime. There's a 30-day money-back guarantee on your first month.",
  },
  {
    question: "What side effects should I expect?",
    answer:
      "The most common side effects are mild gastrointestinal symptoms (nausea, constipation, reflux) during dose titration. Your provider starts you on a low dose and steps up slowly specifically to minimize these. Persistent or serious side effects are reviewed promptly and dosing is adjusted or paused accordingly.",
  },
  {
    question: "Can I drink alcohol while on this?",
    answer:
      "Moderate alcohol is generally okay but many members find they naturally want less — GLP-1 appears to reduce reward signals around alcohol for some people. Heavy drinking is not recommended. Your provider will review your specific situation and flag any interactions based on your health history.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. No long-term commitment. You can pause or cancel any time through your dashboard. If a licensed provider determines you aren't eligible — for safety or contraindications — you're not charged for medication. The 2-minute eligibility assessment is free and non-binding.",
  },
  {
    question: "What happens after I reach my goal?",
    answer:
      "Your provider builds a maintenance plan — often a lower dose, sometimes periodic pauses — to protect your progress long-term. GLP-1 therapy is not one-size-fits-all. Long-term success depends on provider-guided maintenance alongside the sustainable habits built during the loss phase.",
  },
  {
    question: "What if I'm already in therapy?",
    answer:
      "Even better. GLP-1 addresses the biological side of stress eating while therapy addresses the emotional drivers. Many members tell us the two together are what finally worked. Share your full health history with your provider so your care plan accounts for any medications or treatments.",
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

export default function AfterBreakupLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="Glow-Up Ready"
        badgeIcon={Sparkles}
        badgeIconColor="text-cerulean-500"
      />

      {/* ======================================================================
          HERO
          AI-IMAGE PROMPT (hero right-side portrait — optional enhancement)
          Aspect ratio: 4:5
          "Editorial portrait of a woman in her early 30s, shoulder-length hair
           with fresh highlights, cream cashmere sweater, sitting at a sunlit
           café window, holding a matcha, looking out with quiet confidence
           and the ghost of a smile. Natural window light. Shallow depth of
           field. Body language: chin up, posture open. No logos."
          ====================================================================== */}
      <LpHeroBlock
        badge="Glow-Up Ready"
        headline="Lose that breakup weight by May."
        headlineAccent="Same active ingredient as Ozempic."
        subtitle="Take your power back. Doctor-prescribed GLP-1 may help you lose up to 8 lbs in your first month.* Same active molecule as Ozempic and Wegovy. From $179/mo. 2-minute assessment. Individual results vary."
        stats={heroStats}
        ctaLocation="hero-after-breakup"
      />

      <LpSocialProofBar />

      <LpOutcomeStats
        stats={outcomeStats}
        heading="What members actually see"
        subheading="Program outcomes, not marketing numbers."
      />

      <LpProblemSection
        eyebrow="WHY BREAKUP WEIGHT STICKS"
        heading="The scale moved. The relationship didn't save it."
        cards={lpProblemCards}
        transitionText="Stress shifted your biology. A biological tool can shift it back."
        ctaLocation="problem-after-breakup"
      />

      {/* Why Breakup Weight Is Different */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            Why breakup weight is different
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            It&apos;s not a willpower problem. It&apos;s cortisol, sleep, and emotional biology.
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

      {/* How GLP-1 Helps You Reset */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            How GLP-1 helps you reset
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            A hormonal tool for a hormonal problem — while you heal.
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
        headline="Ready to make this the best chapter yet?"
        subtext="Free 2-minute assessment. Licensed providers. No commitment."
        location="mid-after-breakup"
      />

      <LpJourneyRoadmap
        milestones={journeyMilestones}
        heading="What to expect, month by month"
        subheading="The realistic post-breakup treatment arc your provider will build with you."
      />

      <LpPriceCompare
        columns={priceColumns}
        heading="Same active ingredient. Plans from $179/mo."
        subheading="Access to GLP-1 shouldn't depend on your insurance — or a breakup budget."
      />

      <LpProviderCredential
        provider={provider}
        heading="Every plan is overseen by a real clinician"
      />

      {/* Testimonials */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-8">
            Members who wrote a new chapter
          </h2>
          {/* AI-IMAGE PROMPT (optional — testimonial avatars)
              Aspect ratio: 1:1
              "Four photorealistic headshot portraits, diverse men and women
               ages 28-40, soft natural window light, genuine mid-smile
               expressions, neutral backgrounds in warm dusty-rose and cream
               tones, editorial photojournalism style, candid not posed, Sony
               A7R 85mm f/1.8. No logos."
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
        heading="Breakup weight & GLP-1: your questions"
        subheading="Everything you need to know about using prescribed GLP-1 as part of your reset."
      />

      <LpInternalLinks heading="Keep exploring" links={internalLinks} />

      <LpCtaSection
        headline="Make this the chapter that changed everything."
        bgClassName="bg-gradient-to-r from-sky-50 to-rose-50"
      />

      <LpFooter />

      {/* JSON-LD */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Post-Breakup Weight Loss", href: "/lp/after-breakup" },
        ]}
      />
      <MedicalWebPageJsonLd
        name="Post-Breakup Weight Loss with GLP-1"
        description="Breakup weight is stress weight. Doctor-prescribed GLP-1 may help you lose up to 8 lbs in your first month. Licensed US providers. From $179/mo. Individual results vary."
        url="/lp/after-breakup"
      />
      <FAQPageJsonLd faqs={faqs} />
      <LpConversionWidgets />
    </div>
  );
}
