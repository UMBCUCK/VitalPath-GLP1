import type { Metadata } from "next";
import {
  Check,
  Star,
  AlertTriangle,
  Droplet,
  Activity,
  Shield,
  TrendingDown,
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
  FAQPageJsonLd,
  MedicalWebPageJsonLd,
  MedicalConditionJsonLd,
  BreadcrumbJsonLd,
} from "@/components/seo/json-ld";

// ============================================================================
// AI-IMAGE PROMPT (hero background — optional, wire into LpHeroBlock when ready)
// Aspect ratio: 16:9
// "Editorial photograph of a person in their 50s reviewing a lab printout
//  at a sunlit kitchen table, thoughtful resolved expression, warm neutral
//  tones, shallow depth of field, Canon R5 50mm f/1.8. Emphasis on
//  agency and informed action. No logos."
// ============================================================================

export const metadata: Metadata = {
  // Primary keywords: fatty liver weight loss, NAFLD GLP-1, MASH semaglutide,
  // liver weight loss program, non-alcoholic fatty liver treatment
  title: "Fatty Liver Weight Loss Support | GLP-1 | From $179/mo",
  description:
    "Weight loss may support liver health in NAFLD/MASH. Prescribed GLP-1 — same active ingredient as Ozempic — may help you lose up to 8 lbs in your first month.* From $179/mo.",
  openGraph: {
    title: "Fatty Liver Support — GLP-1 from $179/mo",
    description:
      "Weight loss is the most evidence-backed intervention for fatty liver. Prescribed GLP-1 from licensed US providers, with lab monitoring. Same active ingredient as Ozempic.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/fatty-liver",
  },
};

const heroStats = [
  { value: "Liver-aware", label: "Protocol" },
  { value: "15-20%*", label: "Avg weight loss" },
  { value: "$179/mo", label: "Starting at" },
  { value: "18,000+", label: "Members" },
];

const outcomeStats = [
  {
    value: "18,000+",
    label: "Members on program",
    sublabel: "Including many managing NAFLD or elevated liver enzymes.",
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
    icon: Droplet,
    title: "Most people don't know they have it",
    description:
      "1 in 3 US adults has NAFLD or MASH, most undiagnosed. A routine liver enzyme elevation is often the first clue — and it's commonly brushed aside.",
  },
  {
    icon: AlertTriangle,
    title: "There's no FDA-approved drug for most stages",
    description:
      "Until 2024, diet + weight loss was all we had. That advice, with no mechanism, rarely worked. Resmetirom helps for MASH with fibrosis only.",
  },
  {
    icon: Activity,
    title: "Progression is silent until it's not",
    description:
      "NAFLD → NASH/MASH → fibrosis → cirrhosis. The window to reverse is while it's still 'just fatty liver' — before the damage becomes permanent.",
  },
] as const;

const problemCards = [
  {
    icon: TrendingDown,
    title: "Liver fat reduces proportionally",
    description:
      "Clinical studies show liver-fat content drops with bodyweight loss in direct proportion. 5-10% body weight loss often normalizes hepatic steatosis.",
  },
  {
    icon: Shield,
    title: "Improves insulin resistance (MASH driver)",
    description:
      "Insulin resistance is the metabolic core of NAFLD/MASH. Addressing it with GLP-1 addresses the upstream cause, not just the downstream fat accumulation.",
  },
  {
    icon: Activity,
    title: "Reduces inflammation markers",
    description:
      "Weight loss lowers systemic inflammation — CRP, ferritin, and liver-specific markers often improve in parallel with ALT and AST normalization.",
  },
];

const solutionCards = [
  {
    title: "Clinical studies show significant liver-fat reduction",
    description:
      "Published GLP-1 trials demonstrate meaningful reductions in hepatic steatosis with sustained weight loss. Individual results vary.",
  },
  {
    title: "Improves ALT/AST in many patients",
    description:
      "Many members see liver enzyme panels trend back toward normal range at the 3-6 month repeat lab — confirming the underlying improvement.",
  },
  {
    title: "Semaglutide received FDA Fast Track for MASH",
    description:
      "In 2024, semaglutide received FDA Fast Track designation for MASH — a regulatory signal that the clinical evidence is strong and research continues.",
  },
];

const journeyMilestones = [
  {
    month: "Day 1",
    label: "Baseline labs (ALT, AST, GGT)",
    description:
      "Provider reviews recent liver panel, metabolic workup, and imaging (FibroScan if available). Establish your baseline before starting.",
  },
  {
    month: "Month 1",
    label: "First 4-8 lbs",
    description:
      "Dose titration begins. GI tract adjusts. Early weight loss starts reducing hepatic fat load even before enzymes shift.",
  },
  {
    month: "Month 3",
    label: "Repeat labs + 10-15 lbs",
    description:
      "Liver enzymes are rechecked through your PCP or hepatologist. Many members see early ALT/AST improvement by this point.",
  },
  {
    month: "Month 6",
    label: "15-20% loss + enzyme reassessment",
    description:
      "Repeat comprehensive panel. Many members see enzymes move meaningfully toward normal. FibroScan may be considered.",
  },
  {
    month: "Month 9",
    label: "Maintenance",
    description:
      "Provider tailors dose for long-term sustainability. Continued lab monitoring confirms sustained improvement.",
  },
  {
    month: "Month 12+",
    label: "Annual liver check",
    description:
      "Annual liver reassessment with your PCP or hepatologist. Sustained weight becomes sustained liver health.",
  },
];

const provider = {
  name: "Dr. Elena Vargas, MD",
  credentials: "Hepatology · Internal Medicine · 15 years practice",
  bio: "Fatty liver is one of the most treatable conditions in medicine — if you catch it early and lose weight. GLP-1 now gives us a tool patients can actually sustain. I've seen enzyme panels normalize in 6 months that spent the prior 10 years drifting worse.",
  imagePrompt:
    "Professional editorial headshot of a 44-year-old Latina female physician, warm serious smile, dark hair pulled back, white coat over emerald scrubs, hepatology clinic softly blurred, natural daylight, Hasselblad quality, 1:1 aspect ratio.",
};

const priceColumns = [
  {
    name: "Brand-Name Wegovy / Ozempic",
    price: "$1,349/mo",
    priceSubtext: "retail cash-pay*",
    features: [
      { label: "FDA-approved", included: true },
      { label: "Insurance typically denies without T2D", included: false },
      { label: "Pharmacy shortages in 2025–26", included: false },
      { label: "Ongoing provider support", included: false },
      { label: "Liver-aware lab guidance", included: false },
      { label: "30-day money-back guarantee", included: false },
    ],
  },
  {
    name: "Nature's Journey Liver-Aware Plan",
    price: "$179/mo",
    priceSubtext: "no insurance needed",
    highlight: true,
    features: [
      { label: "Same active semaglutide molecule", included: true },
      { label: "Compounded by US 503A pharmacy", included: true },
      { label: "No insurance hurdles — flat monthly price", included: true },
      { label: "Ongoing provider + care-team support", included: true },
      { label: "Liver-aware lab guidance", included: true },
      { label: "30-day money-back guarantee", included: true },
    ],
    ctaLabel: "See If I Qualify →",
    ctaHref: "/qualify",
  },
];

const testimonials = [
  {
    name: "Thomas H.",
    age: 52,
    location: "Columbus",
    lbs: 41,
    months: 8,
    quote:
      "ALT dropped from 72 to 28. My hepatologist used the word 'resolution'.",
  },
  {
    name: "Rachel M.",
    age: 48,
    location: "Nashville",
    lbs: 30,
    months: 7,
    quote:
      "FibroScan score improved two stages. I cried in the parking lot.",
  },
  {
    name: "Miguel D.",
    age: 56,
    location: "Tampa",
    lbs: 35,
    months: 9,
    quote:
      "GGT normalized. My doctor said keep doing whatever I'm doing.",
  },
  {
    name: "Karen B.",
    age: 60,
    location: "Madison",
    lbs: 27,
    months: 6,
    quote:
      "My fatty liver diagnosis is being reversed. I didn't know that was possible.",
  },
];

const faqs = [
  {
    question: "What is NAFLD/MASH?",
    answer:
      "NAFLD (non-alcoholic fatty liver disease), now often called MASLD, is the accumulation of fat in the liver not caused by alcohol. MASH (the inflammatory form) involves liver cell damage and can progress to fibrosis and cirrhosis. About 1 in 3 US adults has some form — and most don't know it.",
  },
  {
    question: "Does weight loss actually reverse fatty liver?",
    answer:
      "For many patients, yes. Published research shows 5-10% body weight loss often normalizes liver fat in NAFLD and can reduce liver inflammation in MASH. 10%+ loss is associated with fibrosis improvement for some patients. Individual results vary. Formal reversal requires confirmation via your hepatologist's labs or imaging.",
  },
  {
    question: "What about Rezdiffra (resmetirom)?",
    answer:
      "Resmetirom (Rezdiffra) received FDA approval in 2024 specifically for MASH with moderate-to-advanced fibrosis. It's a different drug class and often used alongside weight loss. GLP-1 and resmetirom target different mechanisms — your hepatologist determines the right approach for your stage.",
  },
  {
    question: "Can I take GLP-1 with other liver meds?",
    answer:
      "Generally yes, but share your full medication list during intake. Your telehealth provider coordinates with your hepatologist on any combination therapy. Some medications (statins, metformin, resmetirom) are commonly combined with GLP-1 for metabolic patients. Always confirm with your liver specialist.",
  },
  {
    question: "Should I get a FibroScan?",
    answer:
      "If you have NAFLD or elevated liver enzymes, a FibroScan (or MRE) from a hepatologist is the gold standard for non-invasive liver stiffness and fat assessment. Ask your PCP for a referral if you haven't had one. Baseline + 6-month follow-up gives you concrete evidence of change.",
  },
  {
    question: "How much weight loss is needed for liver improvement?",
    answer:
      "Published evidence: 5% body weight loss often reduces liver fat. 7-10% can reduce NASH inflammation. 10%+ may improve early fibrosis. Bigger losses (15-20%, the typical GLP-1 range) tend to produce more consistent, measurable liver improvements. Individual response varies.",
  },
  {
    question: "Is alcohol out?",
    answer:
      "Strongly recommended to avoid or minimize. Alcohol directly damages liver tissue, and combined with NAFLD/MASH it accelerates progression. Many members find GLP-1 naturally reduces alcohol cravings. Discuss your specific situation with your provider and hepatologist.",
  },
  {
    question: "Side effects on the liver?",
    answer:
      "GLP-1 is generally well-tolerated for patients with NAFLD and, in published studies, often improves liver enzymes rather than worsening them. Mild GI side effects (nausea, constipation) during titration are most common. Report any new yellowing, severe abdominal pain, or enzyme spikes to your provider immediately.",
  },
  {
    question: "How fast do enzymes improve?",
    answer:
      "Many members see early ALT/AST improvement at the 3-month repeat lab, with more substantial change by month 6 as weight loss reaches 10-15%. GGT and ferritin often move in parallel. Your provider coordinates follow-up labs through your PCP or hepatologist.",
  },
  {
    question: "Long-term?",
    answer:
      "Many members stay on a maintenance GLP-1 dose. Weight regain correlates with liver-fat regain, so sustained weight management matters for sustained liver health. Annual liver reassessment by your hepatologist or PCP ensures the improvement holds. This is a long-game condition with a long-game tool.",
  },
];

const internalLinks = [
  {
    title: "Pre-Diabetes Reversal",
    description: "A1C-focused protocol — metabolic syndrome often overlaps with NAFLD.",
    href: "/lp/pre-diabetes",
  },
  {
    title: "Blood Pressure + GLP-1",
    description: "The third leg of metabolic syndrome, often treated in parallel.",
    href: "/lp/blood-pressure",
  },
  {
    title: "Weight Loss Over 50",
    description: "Protocols tuned for metabolic change in the second half of life.",
    href: "/lp/over50",
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

export default function FattyLiverLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="Liver-Aware Care"
        badgeIcon={Droplet}
        badgeIconColor="text-teal-500"
      />

      {/* ======================================================================
          HERO
          AI-IMAGE PROMPT (hero right-side portrait — optional enhancement)
          Aspect ratio: 4:5
          "Editorial portrait of an adult in their early 50s holding a lab
           printout, morning kitchen light, quiet resolve in expression,
           shallow depth of field, Canon R5 85mm f/1.4. Body language:
           informed, determined. No logos."
          ====================================================================== */}
      <LpHeroBlock
        badge="Liver-Aware Care"
        headline="Help that liver heal by May."
        headlineAccent="Same active ingredient as Ozempic."
        subtitle="Fatty liver is quietly the most common liver disease in America. Doctor-prescribed GLP-1 may help you lose up to 8 lbs in your first month* — and weight loss is the single best-evidenced support for liver health. Same active molecule as Ozempic. From $179/mo. Individual results vary."
        stats={heroStats}
        ctaLocation="hero-fatty-liver"
      />

      <LpSocialProofBar />

      <LpOutcomeStats
        stats={outcomeStats}
        heading="What members actually see"
        subheading="Program outcomes, not marketing numbers."
      />

      <LpProblemSection
        eyebrow="WHY FATTY LIVER GOES UNTREATED"
        heading="The most common liver disease no one talks about."
        cards={lpProblemCards}
        transitionText="A metabolic problem deserves a metabolic tool — while the window is open."
        ctaLocation="problem-fatty-liver"
      />

      {/* Why Weight Matters Most for Liver */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            Why weight matters most for liver
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Liver fat is proportional to body weight — and reversible in the early stages.
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

      {/* How GLP-1 May Support Liver Health */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            How GLP-1 may support liver health
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Multiple mechanisms converge on the liver — and the clinical evidence keeps growing.
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
        headline="Ready to give your liver a chance?"
        subtext="Free 2-minute assessment. Licensed providers. No commitment."
        location="mid-fatty-liver"
      />

      <LpJourneyRoadmap
        milestones={journeyMilestones}
        heading="What to expect — with lab check-ins"
        subheading="A liver-aware treatment arc with quarterly enzyme monitoring."
      />

      <LpPriceCompare
        columns={priceColumns}
        heading="Same active ingredient. Plans from $179/mo."
        subheading="Access to GLP-1 shouldn't depend on your insurance — or a T2D diagnosis gate."
      />

      <LpProviderCredential
        provider={provider}
        heading="Every plan is overseen by a real clinician"
      />

      {/* Testimonials */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-8">
            Members whose livers are healing
          </h2>
          {/* AI-IMAGE PROMPT (optional — testimonial avatars)
              Aspect ratio: 1:1
              "Four photorealistic headshot portraits of adults ages 48-62,
               warm reflective expressions, soft natural lighting, neutral
               palettes, editorial photojournalism style, candid not posed,
               Sony A7R 85mm f/1.8. No logos."
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
            Individual experiences. Results not typical. Compounded medications are not FDA-approved. Liver enzyme changes require confirmatory testing through your PCP or hepatologist.
          </p>
        </div>
      </section>

      <LpFaq
        faqs={faqs}
        heading="Fatty liver & GLP-1: your questions"
        subheading="What to know about weight-loss therapy alongside NAFLD/MASH care."
      />

      <LpInternalLinks heading="Keep exploring" links={internalLinks} />

      <LpCtaSection
        headline="Help your liver heal. Start tonight."
        bgClassName="bg-gradient-to-r from-teal-50 to-sky-50"
      />

      <LpFooter />

      {/* JSON-LD */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Fatty Liver Weight Loss", href: "/lp/fatty-liver" },
        ]}
      />
      <MedicalWebPageJsonLd
        name="Fatty Liver Weight Loss Support with GLP-1"
        description="Weight loss may support liver health in NAFLD/MASH. Doctor-prescribed GLP-1 may help you lose up to 8 lbs in your first month. Licensed US providers with liver-aware lab monitoring. From $179/mo. Individual results vary."
        url="/lp/fatty-liver"
      />
      <FAQPageJsonLd faqs={faqs} />
      <MedicalConditionJsonLd
        name="Non-Alcoholic Fatty Liver Disease"
        alternateName="NAFLD / MASH / MASLD"
        description="NAFLD (now often termed MASLD) is the accumulation of fat in the liver in the absence of significant alcohol use. It affects approximately 1 in 3 US adults. MASH (the inflammatory form) can progress to fibrosis and cirrhosis. Weight loss of 5-10% of body weight is the most evidence-backed intervention for liver-fat reduction."
        url="/lp/fatty-liver"
        possibleTreatment="Weight-management therapy with compounded GLP-1 medications, with quarterly liver enzyme monitoring and coordination with a hepatologist where appropriate."
      />
      <LpConversionWidgets />
    </div>
  );
}
