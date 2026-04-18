import type { Metadata } from "next";
import {
  Check,
  Star,
  FlaskConical,
  Shield,
  Scale,
  Heart,
  DollarSign,
  Stethoscope,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  DrugJsonLd,
  FAQPageJsonLd,
  MedicalWebPageJsonLd,
  BreadcrumbJsonLd,
  HowToJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title:
    "Mounjaro Alternative from $379/mo — Same Active Ingredient | Nature's Journey",
  description:
    "Looking for a Mounjaro alternative? Compounded tirzepatide — the same dual-action GLP-1/GIP — prescribed online by licensed providers. 72% less than retail. Free shipping.",
  openGraph: {
    title:
      "Mounjaro Alternative from $379/mo — Same Active Ingredient | Nature's Journey",
    description:
      "Compounded tirzepatide — the same dual-action GLP-1/GIP as Mounjaro — prescribed online by licensed providers. 72% less than retail.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/lp/mounjaro-alternative" },
};

/* --- DATA ----------------------------------------------------------- */

const heroStats = [
  { value: "Up to 21%", label: "Body weight loss*" },
  { value: "18,000+", label: "Members served" },
  { value: "4.9", label: "Average rating", suffix: "/5" },
  { value: "Dual", label: "GLP-1/GIP action" },
] as const;

const problemCards = [
  {
    icon: Clock,
    title: "Mounjaro Shortages Continue",
    description:
      "Demand for tirzepatide has outpaced supply since launch. Patients face unpredictable waits and dose interruptions that undermine treatment progress.",
  },
  {
    icon: AlertTriangle,
    title: "Insurance Rarely Covers Weight Loss",
    description:
      "Mounjaro is FDA-approved for type 2 diabetes, not weight management. Most insurers deny off-label weight-loss coverage, leaving patients without options.",
  },
  {
    icon: DollarSign,
    title: "$1,500/mo Retail Price",
    description:
      "Without insurance, Mounjaro costs approximately $1,349-$1,500/mo. Effective weight management requires months of consistent treatment at that cost.",
  },
] as const;

const explainerCards = [
  {
    icon: Zap,
    title: "Same Dual-Action Ingredient",
    description:
      "Compounded tirzepatide contains the identical active ingredient as Mounjaro, targeting both GLP-1 and GIP receptors for enhanced appetite regulation and metabolic support.",
  },
  {
    icon: FlaskConical,
    title: "Licensed 503A/503B Pharmacies",
    description:
      "Prepared by licensed compounding pharmacies that follow strict quality and safety standards. Compounded medications are not FDA-approved brand-name drugs.",
  },
  {
    icon: Stethoscope,
    title: "Provider-Prescribed",
    description:
      "A licensed provider evaluates your health history, current medications, and goals before determining if compounded tirzepatide is right for you.",
  },
];

const comparisonRows = [
  { feature: "Monthly cost", us: "From $379", them: "$1,349+" },
  { feature: "Insurance required", us: "No", them: "Usually yes" },
  { feature: "Provider included", us: true, them: false },
  { feature: "Meal plans included", us: true, them: false },
  { feature: "Free 2-day shipping", us: true, them: false },
  { feature: "30-day guarantee", us: true, them: false },
] as const;

const objections = [
  {
    icon: Zap,
    question: "Is it really the same ingredient as Mounjaro?",
    answer:
      "Yes. Mounjaro's active ingredient is tirzepatide, a dual GLP-1/GIP receptor agonist. Our compounded formulations contain the same active ingredient, prepared by licensed 503A/503B pharmacies. Compounded medications are not FDA-approved brand-name drugs.",
    stat: "Same",
    statLabel: "active ingredient (tirzepatide)",
  },
  {
    icon: Shield,
    question: "Is compounded tirzepatide safe?",
    answer:
      "Tirzepatide has been studied in the SURMOUNT clinical trial program. Our medications are prepared by licensed pharmacies and prescribed by licensed providers who evaluate your complete health profile before prescribing.",
    stat: "SURMOUNT",
    statLabel: "clinical trial program",
  },
  {
    icon: Scale,
    question: "What results can I expect?",
    answer:
      "In the SURMOUNT-1 clinical trial, participants taking tirzepatide at the highest dose lost an average of up to 21% of body weight over 72 weeks. Individual results vary based on dosage, adherence, diet, and other factors.",
    stat: "Up to 21%",
    statLabel: "body weight lost in SURMOUNT-1",
  },
  {
    icon: Heart,
    question: "Can I switch from Mounjaro to this?",
    answer:
      "Many of our members transitioned from brand Mounjaro. Your provider will review your current dosage, treatment history, and health profile to create a seamless transition plan at the equivalent dose.",
    stat: "Seamless",
    statLabel: "transition with provider guidance",
  },
];

const testimonials = [
  {
    quote:
      "Mounjaro was back-ordered for weeks. My provider here had me on compounded tirzepatide within days. Same results, no supply issues.",
    name: "James W.",
    age: 46,
    location: "Nashville, TN",
  },
  {
    quote:
      "The dual-action formula is what convinced me. Down 52 lbs in 7 months and my A1C improved too. My doctor is thrilled.",
    name: "Priya N.",
    age: 42,
    location: "San Diego, CA",
  },
  {
    quote:
      "I couldn't justify $1,500/month for Mounjaro. At $379, I can commit to the full treatment timeline my provider recommended.",
    name: "Karen B.",
    age: 55,
    location: "Columbus, OH",
  },
];

const faqs = [
  {
    question: "Is compounded tirzepatide the same as Mounjaro?",
    answer:
      "Compounded tirzepatide contains the same active ingredient (tirzepatide) as Mounjaro. However, compounded medications are prepared by licensed 503A/503B pharmacies and are not FDA-approved brand-name drugs. Your provider determines if compounded tirzepatide is appropriate for you.",
  },
  {
    question: "How much does a Mounjaro alternative cost?",
    answer:
      "Our compounded tirzepatide program starts at $379/mo, compared to approximately $1,349/mo for brand-name Mounjaro without insurance. Your membership includes provider evaluation, medication if prescribed, personalized meal plans, and ongoing support.",
  },
  {
    question: "What is the difference between GLP-1 and GLP-1/GIP?",
    answer:
      "Semaglutide (Wegovy/Ozempic) targets only GLP-1 receptors. Tirzepatide (Mounjaro) targets both GLP-1 and GIP receptors, providing dual-action appetite regulation and metabolic support. Clinical trials suggest the dual mechanism may support greater average weight loss.",
  },
  {
    question: "Can I get tirzepatide online without insurance?",
    answer:
      "Yes. Our program requires no insurance. Your $379/mo membership covers provider evaluation, compounded tirzepatide if prescribed, meal plans, and ongoing support. The initial assessment is free.",
  },
  {
    question: "How much weight can I lose with tirzepatide?",
    answer:
      "In the SURMOUNT-1 clinical trial, participants lost an average of up to 21% of body weight over 72 weeks at the highest dose. Individual results vary based on starting weight, dose, adherence, diet, exercise, and other factors.",
  },
  {
    question: "What are the side effects of tirzepatide?",
    answer:
      "The most common side effects are mild and temporary: nausea, decreased appetite, and digestive changes. These typically resolve during the titration period as your body adjusts. Your provider manages dosing to minimize side effects.",
  },
  {
    question: "Is there a Mounjaro shortage?",
    answer:
      "Yes, Mounjaro (tirzepatide) has experienced significant supply constraints since its launch. Compounded tirzepatide offers an alternative pathway to the same active ingredient without the supply disruptions affecting the brand-name product.",
  },
];

const internalLinks = [
  {
    title: "Zepbound Alternative",
    description:
      "Same active ingredient as Zepbound (tirzepatide) at 72% less.",
    href: "/lp/zepbound-alternative",
  },
  {
    title: "Tirzepatide Weight Loss",
    description:
      "Learn about tirzepatide for weight management prescribed online.",
    href: "/lp/tirzepatide",
  },
  {
    title: "Affordable Weight Loss Plans",
    description:
      "Compare our plans and find the right option for your budget.",
    href: "/lp/affordable",
  },
];

/* --- PAGE ----------------------------------------------------------- */

export default function MounjaroAlternativePage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="Same Active Ingredient as Mounjaro"
        badgeIcon={Zap}
        badgeIconColor="text-teal"
      />

      {/* 1. HERO */}
      <LpHeroBlock
        badge="Accepting new patients — same-day evaluation"
        headline="The Mounjaro alternative, available by May."
        headlineAccent="Same active ingredient (tirzepatide). Less cost."
        subtitle="Compounded tirzepatide — dual GLP-1/GIP, prescribed online by US-licensed providers. May help you lose up to 10 lbs in your first month.* From $379/mo. Individual results vary."
        stats={heroStats}
        ctaLocation="mounjaro-alternative-hero"
      />

      {/* 2. SOCIAL PROOF BAR */}
      <LpSocialProofBar />

      {/* 3. PROBLEM SECTION */}
      <LpProblemSection
        cards={problemCards}
        heading="Why Getting Mounjaro Feels Impossible"
        transitionText="There's a clinically comparable path — without the barriers."
        ctaLocation="mounjaro-alternative-problem"
      />

      {/* 4. EXPLAINER: What Is Compounded Tirzepatide? */}
      <section
        className="py-14 sm:py-16"
        style={{ backgroundColor: "var(--lp-section-alt, #f8fbfd)" }}
      >
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-3">
            What Makes This a True Mounjaro Alternative?
          </h2>
          <p className="text-center text-sm text-lp-body mb-10 max-w-2xl mx-auto">
            The same dual-action active ingredient used in Mounjaro, prepared by
            licensed pharmacies and prescribed by licensed providers.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {explainerCards.map((card, i) => (
              <Card
                key={card.title}
                className="rounded-xl border bg-[var(--lp-card-bg,#fff)] opacity-0 animate-fade-in-up"
                style={{
                  borderColor: "var(--lp-card-border)",
                  animationDelay: `${0.1 + i * 0.1}s`,
                  animationFillMode: "forwards",
                }}
              >
                <CardContent className="p-6">
                  <div
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "var(--lp-icon-bg)" }}
                  >
                    <card.icon
                      className="h-5 w-5"
                      style={{ color: "var(--lp-icon)" }}
                    />
                  </div>
                  <h3 className="text-base font-semibold text-lp-heading mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-lp-body leading-relaxed">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MID-PAGE CTA */}
      <LpMidCta
        headline="See if you qualify for the Mounjaro alternative"
        subtext="Free 2-minute assessment. Provider reviews within 1 business day."
        location="mounjaro-alternative-mid"
      />

      {/* 6. COMPARISON TABLE */}
      <LpComparisonTable
        heading="Nature's Journey vs. Brand Mounjaro"
        themLabel="Brand Mounjaro"
        rows={comparisonRows}
      />

      {/* 7. OBJECTION HANDLER */}
      <section
        className="py-14"
        style={{ backgroundColor: "var(--lp-section-alt, #f8fbfd)" }}
      >
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-3">
            Your Questions, Answered Honestly
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            We hear these concerns every day. Here&apos;s the evidence.
          </p>
          <div className="space-y-4">
            {objections.map((obj, i) => (
              <div
                key={i}
                className="rounded-xl border bg-[var(--lp-card-bg,#fff)] p-5 opacity-0 animate-fade-in-up"
                style={{
                  borderColor: "var(--lp-card-border)",
                  animationDelay: `${0.1 + i * 0.08}s`,
                  animationFillMode: "forwards",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "var(--lp-icon-bg)" }}
                  >
                    <obj.icon
                      className="h-5 w-5"
                      style={{ color: "var(--lp-icon)" }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-lp-heading mb-1">
                      {obj.question}
                    </h3>
                    <p className="text-sm text-lp-body leading-relaxed">
                      {obj.answer}
                    </p>
                    <div
                      className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-1.5"
                      style={{ backgroundColor: "var(--lp-icon-bg)" }}
                    >
                      <span
                        className="text-sm font-bold"
                        style={{ color: "var(--lp-icon)" }}
                      >
                        {obj.stat}
                      </span>
                      <span className="text-xs text-lp-body-muted">
                        {obj.statLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-10">
            Members Who Switched from Mounjaro
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card
                key={t.name}
                className="rounded-xl border bg-[var(--lp-card-bg,#fff)]"
                style={{ borderColor: "var(--lp-card-border)" }}
              >
                <CardContent className="p-6">
                  <div className="flex gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-gold fill-gold"
                      />
                    ))}
                  </div>
                  <blockquote className="text-sm text-lp-body italic leading-relaxed mb-4">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="text-sm font-semibold text-lp-heading">
                    {t.name}, {t.age}
                  </div>
                  <div className="text-xs text-lp-body-muted">
                    {t.location}
                  </div>
                  <p className="mt-2 text-[10px] text-lp-body-muted">
                    Verified member. Individual results vary.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ */}
      <LpFaq
        faqs={faqs}
        subheading="Common questions about Mounjaro alternatives and compounded tirzepatide."
      />

      {/* 10. INTERNAL LINKS */}
      <LpInternalLinks
        links={internalLinks}
        heading="Explore Related Programs"
      />

      {/* 11. FINAL CTA */}
      <LpCtaSection headline="Get the Mounjaro alternative — starting at $379/mo" />

      <LpFooter />

      {/* JSON-LD */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Mounjaro Alternative", href: "/lp/mounjaro-alternative" },
        ]}
      />
      <HowToJsonLd
        name="How to Get a Mounjaro Alternative Online"
        description="Three simple steps to get compounded tirzepatide — the same active ingredient as Mounjaro — prescribed online through Nature's Journey."
        steps={[
          {
            title: "Complete a Free Assessment",
            description:
              "Answer a 2-minute health questionnaire. No payment required.",
          },
          {
            title: "Provider Evaluation",
            description:
              "A licensed provider reviews your profile within 1 business day.",
          },
          {
            title: "Medication Delivered",
            description:
              "If prescribed, compounded tirzepatide ships to your door with free 2-day delivery.",
          },
        ]}
      />
      <DrugJsonLd
        name="Compounded Tirzepatide"
        alternateName="Dual GLP-1/GIP Receptor Agonist (Mounjaro Alternative)"
        description="Compounded tirzepatide for provider-guided weight management, containing the same active ingredient as Mounjaro. Prescribed online by licensed providers."
        url="/lp/mounjaro-alternative"
        administrationRoute="Subcutaneous injection"
      />
      <FAQPageJsonLd faqs={faqs} />
      <MedicalWebPageJsonLd
        name="Mounjaro Alternative — Compounded Tirzepatide Online"
        description="Looking for a Mounjaro alternative? Compounded tirzepatide — the same dual-action GLP-1/GIP — prescribed online at 72% less than retail."
        url="/lp/mounjaro-alternative"
      />
      <LpConversionWidgets />
    </div>
  );
}
