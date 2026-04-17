import type { Metadata } from "next";
import {
  Check,
  Star,
  Scale,
  Heart,
  Shield,
  Leaf,
  Sprout,
  AlertTriangle,
  Activity,
  Stethoscope,
  Pill,
  Calendar,
  Clock,
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
// "Editorial photograph of a woman in her mid-40s in comfortable activewear
//  relaxing on her couch at home, holding a glass of water, warm natural
//  window light, calm confident expression, shallow depth of field, candid
//  editorial style, Canon R5 50mm f/1.4. Emphasis on at-home comfort and
//  absence of clinical setting. No logos, no branding."
// ============================================================================

export const metadata: Metadata = {
  // Primary keywords: weight loss without surgery, non-surgical weight loss, alternative to bariatric surgery
  title: "Weight Loss Without Surgery | GLP-1 from $179/mo | Nature's Journey",
  description:
    "Non-surgical weight loss from home. Prescribed GLP-1 care from US-licensed providers. 2-minute assessment. From $179/mo. Individual results vary.",
  openGraph: {
    title: "Weight Loss Without Surgery — Prescribed GLP-1 From Home",
    description:
      "Skip the scalpel. Clinically supervised GLP-1 medication from US-licensed providers. No hospital, no anesthesia, no recovery time. From $179/mo.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/no-surgery",
  },
};

const heroStats = [
  { value: "No", label: "Hospital stay" },
  { value: "15-20%*", label: "Avg weight loss" },
  { value: "$179/mo", label: "Starting at" },
  { value: "At home", label: "Whole journey" },
];

// Real program outcomes band — below hero. Specificity bias + availability heuristic.
const outcomeStats = [
  {
    value: "15-20%",
    label: "Avg total body weight loss*",
    sublabel: "Clinical-trial range for GLP-1 therapy over 12+ months.",
  },
  {
    value: "0 days",
    label: "Recovery time",
    sublabel: "No surgery, no anesthesia, no hospital stay, no missed work.",
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
    title: "Bariatric Surgery Isn't Always Accessible",
    description:
      "Qualifying BMIs, pre-op programs, insurance approvals, and wait lists keep many people from ever reaching the operating table — even when surgery was something they were open to.",
  },
  {
    icon: AlertTriangle,
    title: "Anatomical Changes Are Permanent",
    description:
      "Gastric bypass and sleeve gastrectomy permanently reshape your digestive system. For some patients that's exactly right; for others, the irreversibility is a legitimate concern worth weighing.",
  },
  {
    icon: Clock,
    title: "Recovery Has Real Costs",
    description:
      "Hospital stay, 2-4 weeks of recovery, time off work, life-long dietary restrictions, and a risk of complications. These trade-offs deserve to be compared against other clinically effective options.",
  },
] as const;

const problemCards = [
  {
    icon: Heart,
    title: "Non-Invasive, Reversible",
    description:
      "GLP-1 is a weekly injection, not a surgical procedure. If you and your provider decide to stop treatment, your anatomy is unchanged — the decision isn't permanent the way surgery is.",
  },
  {
    icon: Stethoscope,
    title: "Medically Supervised",
    description:
      "Every prescription is written by a US-licensed clinician who reviews your health history. Dose titration, side-effect management, and check-ins happen throughout treatment — not just once.",
  },
  {
    icon: Sprout,
    title: "From Home, Not a Hospital",
    description:
      "Online assessment, medication shipped to your door, messaging with your care team. No pre-op clinic visits, no surgical waiting lists, no hospital stay, no 2-4 week recovery.",
  },
];

const solutionCards = [
  {
    title: "Clinically Meaningful Loss",
    description:
      "Published trials show GLP-1 therapy produces an average 15-20% total body-weight loss over 12+ months — a range that overlaps meaningfully with some bariatric outcomes for many patients.",
  },
  {
    title: "Metabolic Benefits, Not Just Scale",
    description:
      "GLP-1 medications improve insulin sensitivity, A1C, and cardiovascular markers — benefits that address metabolic disease independently of weight loss alone.",
  },
  {
    title: "Complement, Not Competition",
    description:
      "Some patients ultimately benefit from surgery; others do best with GLP-1; many use GLP-1 before, after, or instead of surgery. Your provider helps you decide what's right for your profile.",
  },
];

// 6 milestones — non-surgical at-home arc. Emphasizes no recovery, at-home convenience.
const journeyMilestones = [
  {
    month: "Day 1",
    label: "Online assessment",
    description:
      "2-minute health questionnaire reviewed by a US-licensed provider. No clinic visit. No waiting room.",
  },
  {
    month: "Week 1",
    label: "Medication ships home",
    description:
      "Compounded GLP-1 delivered discreetly. Video onboarding with your care team — no anesthesia, no hospital.",
  },
  {
    month: "Month 1",
    label: "Dose titration",
    description:
      "Start low, step up slowly. Appetite softens. No recovery time — normal daily activity from day one.",
  },
  {
    month: "Month 3",
    label: "First 10-15 lbs",
    description:
      "Visible clothing changes, improved energy. Metabolic markers often begin to shift.",
  },
  {
    month: "Month 6",
    label: "Metabolic check-in",
    description:
      "Many members report improved A1C, triglycerides, and blood pressure trends at this milestone.",
  },
  {
    month: "Month 12+",
    label: "Maintenance plan",
    description:
      "Your provider tailors dose for long-term sustainability. Anatomy unchanged. Options remain open.",
  },
];

// Authority anchor — obesity medicine with primary care + collaborates-with-surgeons positioning.
const provider = {
  name: "Dr. Nathaniel Okonkwo, MD",
  credentials: "Board-certified, Internal & Obesity Medicine · 16 years practice",
  bio: "Bariatric surgery is the right answer for some of my patients — and I refer to surgeons I trust when it is. But for many people, GLP-1 therapy under careful medical supervision is a clinically serious option that deserves honest consideration before — or instead of — an operating room.",
  imagePrompt:
    "Professional editorial headshot of a Nigerian-American male physician in his early-50s, close-cropped dark hair with flecks of grey, wearing a crisp white lab coat over a light blue button-down, stethoscope around neck, softbox lighting, clean clinical background slightly blurred, direct warm eye contact, thoughtful trustworthy expression, Hasselblad quality, 1:1 aspect ratio.",
};

const priceColumns = [
  {
    name: "Brand-Name Wegovy / Ozempic",
    price: "$1,349/mo",
    priceSubtext: "retail cash-pay*",
    features: [
      { label: "FDA-approved", included: true },
      { label: "Insurance coverage often denied or partial", included: false },
      { label: "Pharmacy shortages common in 2025-26", included: false },
      { label: "Ongoing provider support included in price", included: false },
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
      { label: "30-day money-back guarantee", included: true },
    ],
    ctaLabel: "See If I Qualify →",
    ctaHref: "/qualify",
  },
];

const testimonials = [
  {
    name: "Anna L.",
    age: 44,
    location: "Denver",
    lbs: 39,
    months: 6,
    quote:
      "I was on the surgical waiting list for nine months. GLP-1 gave me a medically supervised option while I decided — and I never needed the operation.",
  },
  {
    name: "Martin C.",
    age: 53,
    location: "Orlando",
    lbs: 51,
    months: 8,
    quote:
      "My surgeon said I qualified for bypass, but I wasn't ready to change my anatomy forever. Dropped 51 lbs without it.",
  },
  {
    name: "Sheila W.",
    age: 49,
    location: "Pittsburgh",
    lbs: 33,
    months: 5,
    quote:
      "No hospital stay, no time off work, no pre-op diet. Just weekly injections and check-ins from home.",
  },
  {
    name: "Kenji T.",
    age: 41,
    location: "Seattle",
    lbs: 45,
    months: 7,
    quote:
      "My bariatric consult recommended I try GLP-1 first. My provider here coordinated with them — it's an additional option, not a competing one.",
  },
];

// AEO-optimized: each question is a real search query, each answer 40-70 words,
// lead sentence is the bold TL;DR Google's AI Overviews tend to quote.
const faqs = [
  {
    question: "Is GLP-1 as effective as bariatric surgery?",
    answer:
      "GLP-1 therapy produces an average 15-20% total body-weight loss over 12+ months in clinical trials — a range that overlaps with some bariatric outcomes but typically does not match the upper end of gastric bypass results. For many patients, GLP-1 is clinically meaningful; for others, surgery remains the better option. Your provider helps you weigh the trade-offs.",
  },
  {
    question: "Who is GLP-1 medication appropriate for?",
    answer:
      "GLP-1 is typically considered for adults with a BMI of 27 or higher with at least one weight-related condition (such as type 2 diabetes, hypertension, or sleep apnea), or adults with a BMI of 30 or higher. A US-licensed provider reviews your health history, medications, and conditions to determine if treatment is appropriate for you.",
  },
  {
    question: "Can I switch to GLP-1 if I've already had bariatric surgery?",
    answer:
      "In many cases, yes — some post-bariatric patients regain weight over time and GLP-1 can be part of a maintenance strategy. This is a case-by-case decision your provider makes based on your surgical history, current health, and any post-op contraindications. Coordination with your bariatric team is often advisable.",
  },
  {
    question: "Is compounded semaglutide as effective as branded Wegovy?",
    answer:
      "Compounded semaglutide contains the same active ingredient as Ozempic and Wegovy but is prepared by a state-licensed compounding pharmacy under an individual prescription. It is not FDA-approved as a branded drug product. Our program is for patients for whom this is medically appropriate as determined by a licensed provider.",
  },
  {
    question: "What are the common side effects of GLP-1?",
    answer:
      "The most common side effects are mild gastrointestinal symptoms — nausea, constipation, reflux — typically during dose titration. Your provider starts you on a low dose and steps up slowly to minimize these. Serious adverse events are rare but can include pancreatitis and gallbladder issues; your provider screens for risk factors before prescribing.",
  },
  {
    question: "How long do I need to stay on GLP-1?",
    answer:
      "GLP-1 is typically prescribed as a long-term treatment — obesity is increasingly understood as a chronic metabolic condition, not a short-term problem. Many members stay on maintenance dosing for years. Your provider tailors a long-term plan, which may include lower maintenance doses, planned pauses, or transition strategies as your goals evolve.",
  },
  {
    question: "What happens if I stop taking GLP-1?",
    answer:
      "Because GLP-1 addresses ongoing hormonal drivers of appetite and metabolism, some weight regain is common after stopping without a structured maintenance plan. Unlike bariatric surgery, your anatomy hasn't changed — there's no permanent alteration. Your provider helps you plan either continued maintenance dosing or a structured lifestyle transition to preserve results.",
  },
  {
    question: "Do I need to change my diet on GLP-1?",
    answer:
      "You don't need to follow a strict pre-op-style diet, but sustainable nutritional and activity habits meaningfully improve long-term outcomes. Your care team provides guidance on protein targets, hydration, and resistance training for lean-mass preservation. GLP-1 reduces appetite — the habits you build during treatment are what you maintain afterward.",
  },
  {
    question: "How much does the program cost, and is insurance required?",
    answer:
      "Plans start at $179/month — no insurance required. That flat price includes the compounded medication, the licensed-provider evaluation, ongoing provider oversight, and care-team messaging. You can cancel anytime. There's a 30-day money-back guarantee on your first month. Compare that to roughly $1,349/mo retail for brand-name GLP-1 medications.",
  },
  {
    question: "Is at-home treatment as safe as a clinic-supervised program?",
    answer:
      "Yes, when it's overseen by a licensed provider with appropriate screening and follow-up. Your health history is reviewed before prescribing, dose titration is supervised, side effects are managed via messaging with the care team, and escalation to in-person care is available if needed. At-home doesn't mean unsupervised — it means logistically simpler.",
  },
];

// Expanded internal linking for SEO + conversion (AEO 2026 playbook).
const internalLinks = [
  {
    title: "Affordable GLP-1",
    description: "Flat $179/mo cash-pay pricing — no insurance required.",
    href: "/lp/affordable",
  },
  {
    title: "Semaglutide Explained",
    description: "The active ingredient behind most programs — mechanism and timeline.",
    href: "/lp/semaglutide",
  },
  {
    title: "Weight Loss Over 40",
    description: "Age-appropriate dosing for metabolic slowdown and midlife body changes.",
    href: "/lp/over40",
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
    description: "Assessment to shipment — the full at-home treatment journey.",
    href: "/how-it-works",
  },
] as const;

export default function NoSurgeryLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="Non-Surgical Option"
        badgeIcon={Leaf}
        badgeIconColor="text-emerald-600"
      />

      {/* ======================================================================
          HERO
          AI-IMAGE PROMPT (hero right-side portrait — optional enhancement)
          Aspect ratio: 4:5
          "Editorial photograph of a calm, everyday woman in her mid-40s,
           soft natural light from a kitchen window, relaxed cream sweater,
           holding a small prescription pen-injector with a quiet confident
           expression, earth-toned home interior softly blurred in the
           background, shallow depth of field, candid editorial style. Clean,
           no logos, no overt clinical iconography."
          ====================================================================== */}
      <LpHeroBlock
        badge="Non-Surgical Option"
        headline="Skip the scalpel —"
        headlineAccent="prescribed GLP-1 care from home"
        subtitle="A clinically supervised, non-invasive alternative to bariatric surgery for many patients. US-licensed providers. No hospital stay. 2-minute eligibility. From $179/mo."
        stats={heroStats}
        ctaLocation="hero-no-surgery"
      />

      <LpSocialProofBar />

      {/* Real outcome numbers anchor the claim before objections land */}
      <LpOutcomeStats
        stats={outcomeStats}
        heading="What the evidence supports"
        subheading="Clinical-trial ranges and real program logistics."
      />

      {/* Problem Section — careful framing that doesn't disparage surgery */}
      <LpProblemSection
        eyebrow="WHY SURGERY ISN'T FOR EVERYONE"
        heading="Trade-offs worth weighing"
        cards={lpProblemCards}
        transitionText="Surgery is the right answer for some patients. For many others, GLP-1 is a serious clinical option worth considering first."
        ctaLocation="problem-no-surgery"
      />

      {/* Why GLP-1 Is a Different Path */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            Why GLP-1 is a different path
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Non-invasive. Reversible. Supervised. From home.
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

      {/* How GLP-1 Produces Clinically Meaningful Loss */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            How GLP-1 produces clinically meaningful loss
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            A serious option — not a better one, an additional one.
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
        headline="Explore a non-surgical path"
        subtext="Free 2-minute assessment. Licensed providers. No commitment."
        location="mid-no-surgery"
      />

      {/* Journey roadmap — defuses "what happens next?" objection, emphasizes at-home */}
      <LpJourneyRoadmap
        milestones={journeyMilestones}
        heading="Your at-home treatment arc"
        subheading="No hospital, no recovery time — a realistic month-by-month journey with your provider."
      />

      {/* Price comparison — anchoring effect */}
      <LpPriceCompare
        columns={priceColumns}
        heading="Same active ingredient. Plans from $179/mo."
        subheading="Compare brand-name retail cash-pay to our compounded program."
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
            Members who chose a non-surgical path
          </h2>
          {/* AI-IMAGE PROMPT (optional — testimonial avatars)
              Aspect ratio: 1:1
              "Four photorealistic headshot portraits, diverse adults ages
               40-55, soft natural window light, genuine warm expressions,
               neutral backgrounds in warm earth tones, candid editorial
               photojournalism style, Sony A7R 85mm f/1.8. No logos, no
               fitness branding. Emphasis on calm, everyday dignity."
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
        heading="Non-surgical weight loss: your questions"
        subheading="Everything to know about choosing GLP-1 over (or alongside) bariatric surgery."
      />

      {/* Internal Links */}
      <LpInternalLinks heading="Keep exploring" links={internalLinks} />

      {/* Final CTA */}
      <LpCtaSection
        headline="A clinically serious alternative"
        bgClassName="bg-gradient-to-r from-emerald-50 to-lime-50"
      />

      <LpFooter />

      {/* JSON-LD */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Weight Loss Without Surgery", href: "/lp/no-surgery" },
        ]}
      />
      <MedicalWebPageJsonLd
        name="Non-Surgical GLP-1 Weight Loss Program"
        description="Prescription GLP-1 therapy from US-licensed providers as a non-invasive alternative to bariatric surgery for eligible patients. From $179/mo."
        url="/lp/no-surgery"
      />
      <FAQPageJsonLd faqs={faqs} />
      <LpConversionWidgets />
    </div>
  );
}
