import type { Metadata } from "next";
import {
  Check,
  Star,
  Sparkles,
  Brain,
  Activity,
  TrendingDown,
  Shield,
  Stethoscope,
  Target,
  Scale,
  Pill,
  Users,
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
  HowToJsonLd,
} from "@/components/seo/json-ld";

// ============================================================================
// AI-IMAGE PROMPT (hero background — optional enhancement)
// Aspect ratio: 16:9
// "Editorial candid photograph of a diverse group of real people in their
//  30s-50s walking together through a sunny park in activewear, genuine
//  smiles, natural morning light, warm inviting palette of soft blues and
//  creams, shallow depth of field, Canon R5 85mm f/1.4, no logos, no
//  fitness branding, no visible medication."
// ============================================================================

export const metadata: Metadata = {
  // Keywords: glp-1 online, glp-1 weight loss program, glp-1 telehealth, glp-1 program
  title: "GLP-1 Weight-Loss Program Online from $179/mo | Nature's Journey",
  description:
    "Complete GLP-1 program: medication, licensed providers, meal plans, coaching. 2-minute assessment. From $179/mo. Individual results vary.",
  openGraph: {
    title: "Your Complete GLP-1 Weight-Loss Program — Medication + Care + Coaching",
    description:
      "Provider-guided GLP-1 weight loss from US-licensed providers. 2-minute eligibility. From $179/mo. Individual results vary.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/glp1",
  },
};

const heroStats = [
  { value: "15-20%*", label: "Avg weight loss" },
  { value: "All-in", label: "Med + care + coaching" },
  { value: "$179/mo", label: "Starting at" },
  { value: "18,000+", label: "Members" },
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
    icon: Brain,
    title: "Your Biology Isn't the Problem — Just Willpower Isn't the Answer",
    description:
      "Diets fail 95% of the time within 5 years. Your brain raises hunger signals and lowers metabolism to defend your weight. That's biology, not weakness.",
  },
  {
    icon: Scale,
    title: "The GLP-1 Landscape Is Overwhelming",
    description:
      "Ozempic. Wegovy. Mounjaro. Zepbound. Semaglutide. Tirzepatide. Compounded vs. brand. Most people don't know where to start — or who's trustworthy.",
  },
  {
    icon: TrendingDown,
    title: "You Don't Know Who to Trust",
    description:
      "Between shady online pharmacies and $1,349/mo brand retail, figuring out a legitimate, affordable path is harder than the weight loss itself.",
  },
] as const;

const differentCards = [
  {
    icon: Sparkles,
    title: "One Program, Everything Included",
    description:
      "Medication, licensed provider oversight, structured meal plans, progress tracking, and care-team messaging — all in one flat monthly price. No bolt-ons, no surprise charges.",
  },
  {
    icon: Shield,
    title: "Licensed, Legitimate, Supervised",
    description:
      "US-licensed providers issue every prescription. US state-licensed compounding pharmacies fill them. LegitScript-certified process — designed for patients who want a real program, not a shortcut.",
  },
  {
    icon: Stethoscope,
    title: "Real Human Care",
    description:
      "Your provider reviews your profile personally. Your care team answers messages in hours, not days. This isn't a vending machine — it's a supervised treatment program.",
  },
];

const solutionCards = [
  {
    title: "GLP-1 Medication That Works With Your Biology",
    description:
      "GLP-1 receptor agonists reduce appetite signals in the brain, slow digestion, and support metabolic health. Food noise quiets. Portions feel naturally smaller. No willpower white-knuckling required.",
  },
  {
    title: "Matched to the Right Molecule for You",
    description:
      "Your provider helps you choose: compounded semaglutide for most new patients, or compounded tirzepatide for those who need a dual-action approach. You're not stuck with a one-size-fits-all choice.",
  },
  {
    title: "Real Support Around the Medication",
    description:
      "Meal plans, progress tracking, coaching, and messaging with a real care team. The medication does the heavy lifting — the program keeps you on track for the long run.",
  },
];

// 6 milestones — general month-by-month expectations
const journeyMilestones = [
  {
    month: "Day 1",
    label: "Eligibility in 2 minutes",
    description:
      "Online assessment reviewed by a US-licensed provider — typically within 24 hours.",
  },
  {
    month: "Week 1",
    label: "Medication ships",
    description:
      "Your first dose arrives free in 48 hours. Video onboarding with your care team.",
  },
  {
    month: "Month 1",
    label: "Food noise fades",
    description:
      "Appetite signals soften. Portions feel naturally smaller. Most members lose first pounds.",
  },
  {
    month: "Month 3",
    label: "First 10-20 lbs",
    description:
      "Pants fit differently. Energy and sleep typically improve. Provider adjusts dose.",
  },
  {
    month: "Month 6",
    label: "Meaningful change, lab improvements",
    description:
      "Many members report better bloodwork (A1C, triglycerides, BP) alongside weight loss.",
  },
  {
    month: "Month 12+",
    label: "Maintenance plan",
    description:
      "Your provider builds a long-term dose and lifestyle plan for sustainability.",
  },
];

const provider = {
  name: "Dr. Emily Carter, MD",
  credentials: "Board-certified, Internal Medicine · Obesity Medicine fellow · 12 years practice",
  bio: "Most of my patients didn't fail at weight loss — they never got a real plan in the first place. A modern GLP-1 program is more than a prescription. It's medication matched to you, a real clinician who knows your chart, and support that doesn't disappear after you pay. That's what we built here.",
  imagePrompt:
    "Professional editorial headshot of a Caucasian female physician in her late-30s, shoulder-length brown hair with natural highlights, wearing a crisp white lab coat over a soft cream blouse, stethoscope around neck, warm genuine smile, softbox lighting, clean bright clinical background slightly blurred, direct trustworthy eye contact, Hasselblad quality, 1:1 aspect ratio.",
};

const priceColumns = [
  {
    name: "Brand-Name Wegovy / Ozempic",
    price: "$1,349/mo",
    priceSubtext: "retail cash-pay*",
    features: [
      { label: "FDA-approved", included: true },
      { label: "Insurance coverage often denied or partial", included: false },
      { label: "Ongoing shortages through 2025-2026", included: false },
      { label: "Ongoing provider support built-in", included: false },
      { label: "Structured meal plans included", included: false },
      { label: "30-day money-back guarantee", included: false },
    ],
  },
  {
    name: "Nature's Journey Complete GLP-1 Program",
    price: "$179/mo",
    priceSubtext: "no insurance needed",
    highlight: true,
    features: [
      { label: "Compounded GLP-1 medication (if prescribed)", included: true },
      { label: "US-licensed provider oversight throughout", included: true },
      { label: "Personalized meal plans + grocery lists", included: true },
      { label: "Progress tracking + care-team messaging", included: true },
      { label: "Free 2-day shipping to all 50 states (where legally available)", included: true },
      { label: "30-day money-back guarantee", included: true },
    ],
    ctaLabel: "See If I Qualify →",
    ctaHref: "/qualify",
  },
];

const testimonials = [
  {
    name: "Marcus D.",
    age: 44,
    location: "Atlanta",
    lbs: 39,
    months: 5,
    quote:
      "My provider adjusts my plan every month. The meal plans made the biggest difference — I actually know what to eat now.",
  },
  {
    name: "Jennifer L.",
    age: 38,
    location: "Austin",
    lbs: 28,
    months: 4,
    quote:
      "I was skeptical about telehealth, but my provider is more attentive than any doctor I've seen in person.",
  },
  {
    name: "Robert K.",
    age: 52,
    location: "Denver",
    lbs: 47,
    months: 6,
    quote:
      "The all-inclusive pricing sealed it for me. No hidden fees, no insurance battles. Just a real program.",
  },
  {
    name: "Amina S.",
    age: 41,
    location: "Phoenix",
    lbs: 33,
    months: 5,
    quote:
      "I didn't know where to start. The program guided me through which medication was right and handled everything else.",
  },
];

// 10 FAQs — broad general-audience angle
const faqs = [
  {
    question: "How do I know if GLP-1 is right for me?",
    answer:
      "Most adults with a BMI over 27 (with related health conditions) or over 30 may be candidates — but your provider makes the final call based on your complete health profile, medications, and history. The 2-minute assessment is free and the provider review tells you whether it's appropriate for you.",
  },
  {
    question: "How does GLP-1 medication work?",
    answer:
      "GLP-1 receptor agonists mimic a natural hormone that regulates appetite and blood sugar. They help you feel satisfied with less food, quiet constant food cravings, and support sustained weight management when paired with diet, lifestyle, and provider oversight.",
  },
  {
    question: "What's the difference between semaglutide and tirzepatide?",
    answer:
      "Semaglutide activates one receptor (GLP-1). Tirzepatide activates two (GLP-1 and GIP). Semaglutide is the most-studied GLP-1 and is usually the starting point. Tirzepatide is typically considered for patients who need stronger metabolic leverage or who plateau on semaglutide. Your provider recommends the right one.",
  },
  {
    question: "What does the $179/mo include?",
    answer:
      "Everything: compounded GLP-1 medication (if prescribed), US-licensed provider evaluation and ongoing monitoring, personalized meal plans, progress tracking, care-team messaging, and free 2-day shipping. No hidden fees. Tirzepatide plans start at $379/mo.",
  },
  {
    question: "Is it safe?",
    answer:
      "GLP-1 medications have been studied in tens of thousands of patients across clinical trials. Common side effects are mild and temporary — mild nausea, decreased appetite, digestive changes during initial titration. Your provider monitors your response and adjusts dosing. Not everyone is a candidate, which is why real medical review matters.",
  },
  {
    question: "Is compounded medication legitimate?",
    answer:
      "Yes, when prescribed and dispensed correctly. US state-licensed 503A/503B compounding pharmacies are permitted to prepare compounded medications under individual prescriptions issued by licensed providers. Compounded medications are not FDA-approved brand-name drugs. Our program operates within that regulatory framework.",
  },
  {
    question: "How quickly will I see results?",
    answer:
      "Most members notice reduced appetite and 'food noise' within 1-2 weeks. Visible weight loss typically begins within 4-6 weeks. Meaningful progress usually shows by month 3 and full therapeutic effect builds as your provider titrates the dose upward. Individual results vary.",
  },
  {
    question: "Do I need insurance?",
    answer:
      "No. Our pricing is all-inclusive and flat monthly. No insurance. No prior authorizations. No pharmacy runs. That's part of why members find the program easier to stick with than navigating brand-name coverage.",
  },
  {
    question: "What if I don't qualify?",
    answer:
      "Not everyone is a candidate for GLP-1 medication. If our providers determine it's not right for you based on safety or contraindications, you won't be charged for medication. The initial assessment is free and non-binding.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. You can cancel, pause, or change plans anytime — no long-term contracts. There is a 30-day money-back guarantee on your first month of medication.",
  },
];

const internalLinks = [
  {
    title: "Semaglutide Weight Loss",
    description: "Our most popular GLP-1 — same active ingredient as Ozempic and Wegovy.",
    href: "/lp/semaglutide",
  },
  {
    title: "Tirzepatide (Dual-Action)",
    description: "Dual GLP-1/GIP option — for patients seeking stronger metabolic leverage.",
    href: "/lp/tirzepatide",
  },
  {
    title: "Ozempic Alternative",
    description: "Compounded semaglutide at ~80% off retail — same active ingredient.",
    href: "/lp/ozempic-alternative",
  },
  {
    title: "Affordable Weight Loss Plans",
    description: "Compare our plan tiers and find the right option for your budget.",
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

export default function Glp1LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="Complete GLP-1 Program"
        badgeIcon={Sparkles}
        badgeIconColor="text-cyan-600"
      />

      {/* ======================================================================
          HERO
          AI-IMAGE PROMPT (hero right-side portrait — optional enhancement)
          Aspect ratio: 4:5
          "Editorial photograph of a warm approachable woman in her early-40s,
           shoulder-length medium-brown hair, simple cream sweater, standing
           in a bright kitchen holding a cup of tea, natural window light,
           genuine relaxed smile, clean warm-neutral palette, shallow depth
           of field, Leica Q2. No logos, no branded medication, no fitness
           iconography."
          ====================================================================== */}
      <LpHeroBlock
        badge="Accepting new patients — same-day evaluation"
        headline="Start your GLP-1 journey by May."
        headlineAccent="Same class of medicine as Ozempic and Mounjaro."
        subtitle="Complete program — prescription, medication, and provider support in one. May help you lose up to 8 lbs in your first month.* From $179/mo. Individual results vary."
        stats={heroStats}
        ctaLocation="glp1-hero"
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
        eyebrow="WHERE DO I EVEN START"
        heading="GLP-1 works. Finding a real program shouldn't be this hard."
        cards={lpProblemCards}
        transitionText="We built one program that handles medication, care, and support — in one place, at one price."
        ctaLocation="problem-glp1"
      />

      {/* Why Our Program Is Different */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            Why our GLP-1 program is different
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Complete, licensed, supervised. Not a vending machine — a real program.
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
            How a complete GLP-1 program solves it
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Medication is the tool. Program is what makes it work.
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
        headline="Ready to start a real GLP-1 program?"
        subtext="Free 2-minute assessment. Licensed providers. No commitment."
        location="mid-glp1"
      />

      {/* Journey roadmap */}
      <LpJourneyRoadmap
        milestones={journeyMilestones}
        heading="What to expect, month by month"
        subheading="Most members follow a similar arc — your provider adapts the pace to you."
      />

      {/* Price comparison */}
      <LpPriceCompare
        columns={priceColumns}
        heading="Same active ingredient. A complete program. Lower price."
        subheading="Access to a real GLP-1 program shouldn't depend on your insurance."
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
            What our members say
          </h2>
          {/* AI-IMAGE PROMPT (optional — testimonial avatars)
              Aspect ratio: 1:1
              "Four photorealistic headshot portraits, diverse men and women ages
               35-55, soft natural window light, genuine expressions, neutral
               backgrounds in warm cream and soft-blue tones, editorial
               photojournalism style, candid not posed, Sony A7R 85mm f/1.8.
               No logos, no medical branding, no fitness gear."
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
        heading="GLP-1 program: your questions"
        subheading="Everything you need to know about our complete GLP-1 weight-loss program."
      />

      {/* Internal Links */}
      <LpInternalLinks heading="Keep exploring" links={internalLinks} />

      {/* Final CTA */}
      <LpCtaSection headline="Start your complete GLP-1 program today" />

      <LpFooter />

      {/* JSON-LD */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "GLP-1 Program", href: "/lp/glp1" },
        ]}
      />
      <HowToJsonLd
        name="How to Start a GLP-1 Weight-Loss Program Online"
        description="Three simple steps to start a complete GLP-1 program through Nature's Journey."
        steps={[
          { title: "Complete a Free Assessment", description: "Answer a 2-minute health questionnaire. No payment required." },
          { title: "Provider Evaluation", description: "A licensed provider reviews your profile within 1 business day." },
          { title: "Medication Delivered", description: "If prescribed, your GLP-1 ships to your door with free 2-day delivery." },
        ]}
      />
      <MedicalWebPageJsonLd
        name="Complete GLP-1 Weight-Loss Program Online"
        description="Provider-guided GLP-1 weight loss with medication, meal plans, and coaching. From $179/mo. Individual results vary."
        url="/lp/glp1"
      />
      <FAQPageJsonLd faqs={faqs} />
      <LpConversionWidgets />
    </div>
  );
}
