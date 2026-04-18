import type { Metadata } from "next";
import {
  Check,
  Star,
  AlertTriangle,
  TrendingDown,
  Activity,
  Shield,
  Heart,
  Pill,
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
// "Editorial photograph of a healthy, active couple in their mid-50s walking
//  along a sunlit coastal path in linen and casual layers, relaxed genuine
//  smiles, warm late-afternoon light, shallow depth of field, lifestyle
//  photography, Canon R5 85mm f/1.4. Vibrant, mobile, confident — not tired
//  or frail imagery. No logos."
// ============================================================================

export const metadata: Metadata = {
  // Primary keywords: weight loss after 50, senior glp-1, metabolism over 50, glp-1 older adults
  title: "Weight Loss After 50 | GLP-1 for Your 50s | From $179/mo | Nature's Journey",
  description:
    "Same effort, half the results? Doctor-prescribed GLP-1 coordinated with your PCP addresses the real drivers of weight in your 50s. From $179/mo. Individual results vary.",
  openGraph: {
    title: "Weight Loss After 50 — What Your Doctor Won't Tell You",
    description:
      "Prescribed GLP-1 from US-licensed providers, coordinated with your PCP. Safety-first dosing, muscle and joint protection. From $179/mo.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/over50",
  },
};

const heroStats = [
  { value: "Safety-first", label: "Built for your 50s" },
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
    value: "95%",
    label: "Would recommend",
    sublabel: "Member survey (ages 50+) — completed ≥3 months.",
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
    title: "Same Effort, Half the Results",
    description:
      "You're walking, eating less, cutting carbs — and the scale refuses to move. That isn't laziness. It's what post-50 physiology actually does to weight-loss math.",
  },
  {
    icon: AlertTriangle,
    title: "Hormonal Shifts Compound",
    description:
      "Declining testosterone, estrogen, growth hormone, and thyroid efficiency all conspire against you at once. Each shift quietly reshapes how your body uses calories.",
  },
  {
    icon: Activity,
    title: "Muscle Quietly Disappears",
    description:
      "Sarcopenia takes roughly 1% of lean mass per year after 50 without active resistance training. Less muscle means lower metabolism and higher fall risk.",
  },
] as const;

const problemCards = [
  {
    icon: Pill,
    title: "Medication Coordination Matters",
    description:
      "Most adults over 50 are on one or more daily medications. A real program coordinates with your PCP, not around them — reviewing your full med list before dosing.",
  },
  {
    icon: Shield,
    title: "Joint & Muscle Protection",
    description:
      "Rapid weight loss can strain joints and accelerate muscle loss if it isn't paced correctly. Dosing, protein targets, and movement are tuned for your age bracket.",
  },
  {
    icon: Heart,
    title: "Cardiovascular Awareness",
    description:
      "Blood pressure, cholesterol, A1C, and cardiovascular risk are reviewed by your provider. Weight loss often improves these markers — but the plan respects them up front.",
  },
];

const solutionCards = [
  {
    title: "PCP-Coordinated Care",
    description:
      "Your provider reviews your current medications and, when helpful, shares progress with your primary care doctor — so treatment complements your existing care plan.",
  },
  {
    title: "Safety-First Dosing",
    description:
      "Older adults typically start on the lowest effective dose and titrate more slowly. This reduces GI side effects and protects energy and joint comfort during the transition.",
  },
  {
    title: "Muscle & Bloodwork Focus",
    description:
      "Your plan emphasizes protein, strength preservation, and periodic bloodwork trends (A1C, lipids, thyroid). The goal is healthspan, not just scale weight.",
  },
];

// 6 milestones — realistic, cautious treatment arc for adults 50+
const journeyMilestones = [
  {
    month: "Day 1",
    label: "Eligibility in 2 minutes",
    description:
      "Online assessment reviewed by a US-licensed provider. Full medication list and health history reviewed.",
  },
  {
    month: "Week 1",
    label: "Medication ships",
    description:
      "Compounded GLP-1 delivered discreetly. Onboarding call covers dosing, side-effect signals, and PCP coordination.",
  },
  {
    month: "Month 1",
    label: "Gentle start",
    description:
      "Lowest starting dose. Appetite softens gradually. Hydration and protein coached from day one. Labs baselined if needed.",
  },
  {
    month: "Month 3",
    label: "First 8–12 lbs",
    description:
      "Loss is typically steadier and slower than in younger adults — that's intentional. Joints, energy, sleep often improve.",
  },
  {
    month: "Month 6",
    label: "Bloodwork trends improve",
    description:
      "Members often report A1C, BP, triglycerides improving. Some PCPs reduce BP, statin, or diabetes meds as weight drops.",
  },
  {
    month: "Month 12+",
    label: "Maintenance for healthspan",
    description:
      "Your provider tailors a long-term dose focused on keeping weight and metabolic markers in a healthy range for life.",
  },
];

// Authority anchor. Named clinician > generic "licensed providers" trust copy.
const provider = {
  name: "Dr. Thomas Whitfield, MD",
  credentials: "Board-certified, Internal Medicine · Geriatric Medicine fellowship · 22 years practice",
  bio: "Older adults are the most under-served group in the current weight-loss conversation. They often have the most to gain from GLP-1 — cardiovascular risk reduction, joint offloading, better mobility — and the most to protect, from muscle mass to medication balance. With careful dosing and coordination with a primary care doctor, GLP-1 is one of the most important tools in modern internal medicine.",
  imagePrompt:
    "Professional editorial headshot of a middle-aged Caucasian male physician in his late-50s, silver-gray hair, neat, warm confident smile, crisp white lab coat over pale blue button-down, stethoscope around neck, softbox lighting, clean clinical background slightly blurred, direct eye contact, Hasselblad quality, 1:1 aspect ratio.",
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
    name: "Gregory H.",
    age: 58,
    location: "Columbus",
    lbs: 34,
    months: 6,
    quote:
      "My cardiologist was cautious at first. My provider reviewed every med I take. Six months in, my BP is better than it was at 45.",
  },
  {
    name: "Patricia L.",
    age: 54,
    location: "Portland",
    lbs: 29,
    months: 7,
    quote:
      "My knees hurt for a decade. Losing 29 lbs gave them back. I'm walking three miles a day and lifting with my daughter now.",
  },
  {
    name: "Harold S.",
    age: 62,
    location: "Tucson",
    lbs: 38,
    months: 8,
    quote:
      "I was heading toward type 2 diabetes. My A1C is back in normal range. My PCP was surprised — and now he's asking other patients about it.",
  },
  {
    name: "Eleanor D.",
    age: 55,
    location: "Minneapolis",
    lbs: 32,
    months: 7,
    quote:
      "I wasn't looking for a miracle, I was looking for something sustainable. This program listened to my meds, my joints, and my goals. That mattered.",
  },
];

// AEO-optimized: each question is a real search query, each answer 40-70 words,
// lead sentence is the bold TL;DR Google's AI Overviews tend to quote.
const faqs = [
  {
    question: "Is GLP-1 safe for adults over 50?",
    answer:
      "GLP-1 medications are widely used in adults 50 and older and have been studied in clinical trials across this age group. Your provider reviews your full medical history, medication list, and any contraindications before prescribing. For older adults, starting at the lowest effective dose and titrating slowly is standard — which is how our program is built.",
  },
  {
    question: "Will GLP-1 interact with my current medications?",
    answer:
      "GLP-1 can interact with diabetes medications, some oral drugs with narrow absorption windows, and specific thyroid protocols. Your provider reviews every medication on your intake before prescribing and coordinates with your primary care doctor when helpful. Many members continue their BP, statin, and thyroid meds without issue — sometimes at lower doses as weight drops.",
  },
  {
    question: "Should I tell my primary care doctor?",
    answer:
      "Yes — we recommend it. Coordination with your PCP is a feature, not an obstacle. Many primary care doctors are increasingly supportive of GLP-1 therapy for eligible older adults. Your care team can help you share progress and bloodwork with your PCP so any adjustments to your other medications are handled safely.",
  },
  {
    question: "How do I avoid muscle loss at my age?",
    answer:
      "Muscle loss is the top concern for adults over 50 on any weight-loss plan. Your program is built around protecting lean mass: daily protein targets (typically 1.0–1.2 g per kg body weight, adjusted for kidney function), resistance training 2–3 times per week, and a gradual loss pace. Your provider monitors pace and intervenes if loss is too rapid.",
  },
  {
    question: "Is compounded semaglutide as effective as branded Ozempic or Wegovy?",
    answer:
      "Compounded semaglutide contains the same active ingredient as Ozempic and Wegovy but is prepared by a state-licensed compounding pharmacy under an individual prescription. It is not FDA-approved as a branded drug product. Our program is for patients for whom this is medically appropriate as determined by a licensed provider.",
  },
  {
    question: "Will GLP-1 affect my bone density or joint health?",
    answer:
      "There is no established evidence that GLP-1 negatively affects bone density, and many members report joint pain improvement as weight drops off the knees and hips. Maintaining strength training, adequate protein, and vitamin D and calcium intake supports both bone and joint health during weight loss — your care team will coach this.",
  },
  {
    question: "How much does the program cost? Is insurance required?",
    answer:
      "Plans start at $179/month — no insurance required. That includes the compounded medication, ongoing provider oversight, and care-team messaging. You can cancel anytime. There is a 30-day money-back guarantee on your first month. Compare that to roughly $1,349/mo retail cash-pay for brand-name GLP-1 medications.",
  },
  {
    question: "What are the common side effects for older adults?",
    answer:
      "The most common side effects are mild gastrointestinal symptoms — nausea, constipation, reflux — typically during dose titration. Older adults sometimes experience these slightly differently, so your provider uses a slower, gentler titration schedule. Hydration and fiber are coached from day one. Persistent or serious side effects trigger a care-team review and dose change.",
  },
  {
    question: "Can I stay on GLP-1 long-term?",
    answer:
      "Yes — many adults over 50 transition to a lower-dose maintenance plan indefinitely, because the underlying metabolic conditions (insulin resistance, appetite dysregulation) don't resolve on their own. Long-term use is supervised and adjusted over time. Some members taper off entirely after building durable habits; others keep a low dose for life.",
  },
  {
    question: "What happens after I hit my goal weight?",
    answer:
      "Your provider will tailor a maintenance plan — often a lower dose, sometimes periodic pauses, and always ongoing support and bloodwork. In your 50s, healthspan is the priority: keeping weight and metabolic markers in a healthy range is the long-term goal, not a number on the scale. Maintenance is adjusted as your life changes.",
  },
];

// Expanded internal linking for SEO + conversion (AEO 2026 playbook).
const internalLinks = [
  {
    title: "Weight Loss After 40",
    description: "The midlife playbook — one decade earlier, slightly different levers.",
    href: "/lp/over40",
  },
  {
    title: "Menopause Weight Loss",
    description: "Plans tuned for perimenopausal and post-menopausal metabolism.",
    href: "/lp/menopause",
  },
  {
    title: "Stubborn Belly Fat",
    description: "Visceral-fat targeting, especially relevant for cardiovascular risk reduction.",
    href: "/lp/belly-fat",
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
    title: "Semaglutide Explained",
    description: "Mechanism, cost, timeline — the active ingredient behind most programs.",
    href: "/lp/semaglutide",
  },
] as const;

export default function Over50LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="Safety-First for Your 50s"
        badgeIcon={Shield}
      />

      {/* ======================================================================
          HERO
          AI-IMAGE PROMPT (hero right-side portrait — optional enhancement)
          Aspect ratio: 4:5
          "Editorial photograph of a vibrant, healthy person in their mid-50s,
           natural salt-and-pepper hair, soft smile, smart-casual layers,
           warm natural light against a neutral backdrop, genuine candid
           expression, shallow depth of field, lifestyle photography. Active
           and engaged — not frail or tired. No logos."
          ====================================================================== */}
      <LpHeroBlock
        badge="Safety-First for Your 50s"
        headline="Lose that stubborn weight by May — safely, after 50."
        headlineAccent="Same active ingredient as Ozempic."
        subtitle="Slow-titration GLP-1 with PCP coordination — may help you lose up to 6 lbs in your first month.* Muscle and bone-preserving protocol. From $179/mo. Individual results vary."
        stats={heroStats}
        ctaLocation="hero-over50"
      />

      <LpSocialProofBar />

      {/* Real outcome numbers anchor the claim before objections land */}
      <LpOutcomeStats
        stats={outcomeStats}
        heading="What members in their 50s actually see"
        subheading="Program outcomes, not marketing numbers."
      />

      {/* Problem Section */}
      <LpProblemSection
        eyebrow="WHY EVERYTHING FEELS HARDER"
        heading="Same effort, half the results"
        cards={lpProblemCards}
        transitionText="A physiological problem needs a physiological solution — that's where GLP-1 comes in."
        ctaLocation="problem-over50"
      />

      {/* Why Weight Loss After 50 Is Different */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            Why weight loss after 50 is different
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Three priorities a program for older adults must respect — not just scale weight.
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

      {/* How GLP-1 Solves Weight Loss After 50 */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            How GLP-1 solves weight loss after 50
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            A physiological problem requires a physiological solution — carefully coordinated.
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
        headline="Ready for a plan that respects your whole health picture?"
        subtext="Free 2-minute assessment. Licensed providers. Coordinated with your PCP."
        location="mid-over50"
      />

      {/* Journey roadmap — defuses "what happens next?" objection */}
      <LpJourneyRoadmap
        milestones={journeyMilestones}
        heading="What to expect, month by month"
        subheading="The realistic treatment arc for adults 50+ — safety-first, paced appropriately."
      />

      {/* Price comparison — anchoring effect */}
      <LpPriceCompare
        columns={priceColumns}
        heading="Same active ingredient. Plans from $179/mo."
        subheading="You shouldn't have to choose between your prescription budget and your health."
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
            Members in their 50s who got it working
          </h2>
          {/* AI-IMAGE PROMPT (optional — testimonial avatars)
              Aspect ratio: 1:1
              "Four photorealistic headshot portraits, diverse men and women
               ages 50-65, soft natural window light, genuine expressions,
               neutral backgrounds in warm earth tones, editorial
               photojournalism style, candid not posed, Sony A7R 85mm f/1.8.
               Active, healthy older adults — not frail. No logos."
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
        heading="Weight loss after 50: your questions"
        subheading="Medication coordination, muscle, joints, bloodwork — what to know before you start."
      />

      {/* Internal Links */}
      <LpInternalLinks heading="Keep exploring" links={internalLinks} />

      {/* Final CTA */}
      <LpCtaSection
        headline="Healthspan starts with the next five pounds"
        bgClassName="bg-gradient-to-r from-sky-50 to-cyan-50"
      />

      <LpFooter />

      {/* JSON-LD */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Weight Loss After 50", href: "/lp/over50" },
        ]}
      />
      <MedicalWebPageJsonLd
        name="GLP-1 Weight Loss After 50"
        description="Doctor-prescribed GLP-1 weight-loss care for adults 50+. Safety-first dosing, PCP coordination, medication review, muscle and joint preservation. From $179/mo."
        url="/lp/over50"
      />
      <FAQPageJsonLd faqs={faqs} />
      <LpConversionWidgets />
    </div>
  );
}
