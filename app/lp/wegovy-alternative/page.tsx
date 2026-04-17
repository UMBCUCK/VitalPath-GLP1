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
    "Wegovy Alternative from $179/mo — Same Active Ingredient | Nature's Journey",
  description:
    "A clinically comparable alternative to Wegovy at 79% less. Compounded semaglutide prescribed by licensed providers. Free 2-day shipping. 30-day guarantee.",
  openGraph: {
    title:
      "Wegovy Alternative from $179/mo — Same Active Ingredient | Nature's Journey",
    description:
      "A clinically comparable alternative to Wegovy at 79% less. Compounded semaglutide prescribed by licensed providers. Free 2-day shipping.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/lp/wegovy-alternative" },
};

/* --- DATA ----------------------------------------------------------- */

const heroStats = [
  { value: "15-20%", label: "Avg weight loss*" },
  { value: "18,000+", label: "Members served" },
  { value: "4.9", label: "Average rating", suffix: "/5" },
  { value: "94%", label: "Would recommend" },
] as const;

const problemCards = [
  {
    icon: AlertTriangle,
    title: "Insurance Denials Are the Norm",
    description:
      "Most commercial insurers deny coverage for Wegovy, leaving patients to pay $1,349/mo out of pocket or abandon treatment entirely.",
  },
  {
    icon: Clock,
    title: "Wegovy Shortages Persist",
    description:
      "Ongoing supply constraints mean even patients with insurance face months-long waits for their next dose, disrupting treatment continuity.",
  },
  {
    icon: DollarSign,
    title: "$1,349/mo Is Unsustainable",
    description:
      "Effective weight management requires consistent, long-term treatment. At brand-name prices, most people cannot maintain therapy long enough to see lasting results.",
  },
] as const;

const explainerCards = [
  {
    icon: ShieldCheck,
    title: "Same Active Ingredient",
    description:
      "Compounded semaglutide contains the identical active ingredient prescribed in Wegovy. Your provider determines if it is appropriate for your health profile.",
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
      "A licensed provider evaluates your health history, current medications, and goals before determining if compounded semaglutide is right for you.",
  },
];

const comparisonRows = [
  { feature: "Monthly cost", us: "From $179", them: "$1,349+" },
  { feature: "Insurance required", us: "No", them: "Usually yes" },
  { feature: "Provider included", us: true, them: false },
  { feature: "Meal plans included", us: true, them: false },
  { feature: "Free 2-day shipping", us: true, them: false },
  { feature: "30-day guarantee", us: true, them: false },
] as const;

const objections = [
  {
    icon: FlaskConical,
    question: "Is it really the same ingredient as Wegovy?",
    answer:
      "Yes. Wegovy's active ingredient is semaglutide. Our compounded formulations contain the same active ingredient, prepared by licensed 503A/503B pharmacies. Compounded medications are not FDA-approved brand-name drugs.",
    stat: "Same",
    statLabel: "active ingredient (semaglutide)",
  },
  {
    icon: Shield,
    question: "Is compounded semaglutide safe?",
    answer:
      "Semaglutide has been studied in the STEP clinical trial program with over 25,000 participants. Our medications are prepared by licensed pharmacies and prescribed by licensed providers who evaluate your complete health profile.",
    stat: "25,000+",
    statLabel: "clinical trial participants (STEP trials)",
  },
  {
    icon: Scale,
    question: "Is it FDA approved?",
    answer:
      "Semaglutide (the active ingredient) is FDA-approved under the brand names Wegovy and Ozempic. Compounded semaglutide is prepared by licensed pharmacies but is not itself an FDA-approved brand-name drug.",
    stat: "FDA",
    statLabel: "approved active ingredient",
  },
  {
    icon: Heart,
    question: "Can I switch from Wegovy to this?",
    answer:
      "Many of our members transitioned from brand Wegovy. Your provider will review your current dosage, treatment history, and health profile to create a seamless transition plan.",
    stat: "Seamless",
    statLabel: "transition with provider guidance",
  },
];

const testimonials = [
  {
    quote:
      "My insurance stopped covering Wegovy. Found Nature's Journey and had my medication in 5 days. Same results, fraction of the price.",
    name: "Rachel K.",
    age: 44,
    location: "Austin, TX",
  },
  {
    quote:
      "Wegovy was back-ordered for 3 months at my pharmacy. Switched here and never looked back. Down 38 lbs total.",
    name: "Michael D.",
    age: 51,
    location: "Charlotte, NC",
  },
  {
    quote:
      "Paying $179 instead of $1,349 means I can actually stick with treatment long enough to see real results. 47 lbs down.",
    name: "Laura S.",
    age: 39,
    location: "Phoenix, AZ",
  },
];

const faqs = [
  {
    question: "Is compounded semaglutide the same as Wegovy?",
    answer:
      "Compounded semaglutide contains the same active ingredient (semaglutide) as Wegovy. However, compounded medications are prepared by licensed 503A/503B pharmacies and are not FDA-approved brand-name drugs. Your provider determines if compounded semaglutide is appropriate for you.",
  },
  {
    question: "How much does a Wegovy alternative cost?",
    answer:
      "Our compounded semaglutide program starts at $179/mo, compared to approximately $1,349/mo for brand-name Wegovy without insurance. Your membership includes provider evaluation, medication if prescribed, personalized meal plans, and ongoing support.",
  },
  {
    question: "Can I get Wegovy without insurance?",
    answer:
      "Brand-name Wegovy without insurance costs approximately $1,349/mo. Our compounded semaglutide program requires no insurance and starts at $179/mo, making GLP-1 treatment accessible regardless of your insurance status.",
  },
  {
    question: "What is the difference between Wegovy and compounded semaglutide?",
    answer:
      "Both contain the same active ingredient, semaglutide. Wegovy is the FDA-approved brand manufactured by Novo Nordisk. Compounded semaglutide is prepared by licensed pharmacies and is not an FDA-approved brand-name product. The clinical mechanism is the same.",
  },
  {
    question: "How much weight can I lose with semaglutide?",
    answer:
      "In the STEP clinical trial program, participants taking semaglutide lost an average of 15-20% of their body weight over 68 weeks. Individual results vary based on starting weight, adherence, diet, exercise, and other factors.",
  },
  {
    question: "Is there a Wegovy shortage?",
    answer:
      "Yes, Wegovy has experienced ongoing supply constraints. Compounded semaglutide offers an alternative pathway to the same active ingredient without the supply disruptions affecting the brand-name product.",
  },
  {
    question: "How do I switch from Wegovy to compounded semaglutide?",
    answer:
      "Start with our free 2-minute assessment. Your provider will review your current dosage and treatment history to create a transition plan that maintains your progress. Most members transition seamlessly.",
  },
];

const internalLinks = [
  {
    title: "Ozempic Alternative",
    description:
      "Same active ingredient as Ozempic at 79% less than retail.",
    href: "/lp/ozempic-alternative",
  },
  {
    title: "Semaglutide Weight Loss",
    description:
      "Learn about semaglutide for weight management prescribed online.",
    href: "/lp/semaglutide",
  },
  {
    title: "Affordable Weight Loss Plans",
    description:
      "Compare our plans and find the right option for your budget.",
    href: "/lp/affordable",
  },
];

/* --- PAGE ----------------------------------------------------------- */

export default function WegovyAlternativePage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="Same Active Ingredient as Wegovy"
        badgeIcon={FlaskConical}
        badgeIconColor="text-teal"
      />

      {/* 1. HERO */}
      <LpHeroBlock
        badge="Accepting new patients — same-day evaluation"
        headline="A Clinically Comparable Alternative to Wegovy —"
        headlineAccent="79% Less"
        subtitle="Same active ingredient (semaglutide) prescribed by licensed providers. From $179/mo with free 2-day shipping."
        stats={heroStats}
        ctaLocation="wegovy-alternative-hero"
      />

      {/* 2. SOCIAL PROOF BAR */}
      <LpSocialProofBar />

      {/* 3. PROBLEM SECTION */}
      <LpProblemSection
        cards={problemCards}
        heading="Why Getting Wegovy Is So Difficult"
        transitionText="There's a clinically comparable path — without the barriers."
        ctaLocation="wegovy-alternative-problem"
      />

      {/* 4. EXPLAINER: What Is Compounded Semaglutide? */}
      <section
        className="py-14 sm:py-16"
        style={{ backgroundColor: "var(--lp-section-alt, #f8fbfd)" }}
      >
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-3">
            What Makes This a True Wegovy Alternative?
          </h2>
          <p className="text-center text-sm text-lp-body mb-10 max-w-2xl mx-auto">
            The same active ingredient used in Wegovy, prepared by licensed
            pharmacies and prescribed by licensed providers.
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
        headline="See if you qualify for the Wegovy alternative"
        subtext="Free 2-minute assessment. Provider reviews within 1 business day."
        location="wegovy-alternative-mid"
      />

      {/* 6. COMPARISON TABLE */}
      <LpComparisonTable
        heading="Nature's Journey vs. Brand Wegovy"
        themLabel="Brand Wegovy"
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
            Members Who Switched from Wegovy
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
        subheading="Common questions about Wegovy alternatives and compounded semaglutide."
      />

      {/* 10. INTERNAL LINKS */}
      <LpInternalLinks
        links={internalLinks}
        heading="Explore Related Programs"
      />

      {/* 11. FINAL CTA */}
      <LpCtaSection headline="Get the Wegovy alternative — starting at $179/mo" />

      <LpFooter />

      {/* JSON-LD */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Wegovy Alternative", href: "/lp/wegovy-alternative" },
        ]}
      />
      <HowToJsonLd
        name="How to Get a Wegovy Alternative Online"
        description="Three simple steps to get compounded semaglutide — the same active ingredient as Wegovy — prescribed online through Nature's Journey."
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
              "If prescribed, compounded semaglutide ships to your door with free 2-day delivery.",
          },
        ]}
      />
      <DrugJsonLd
        name="Compounded Semaglutide"
        alternateName="GLP-1 Receptor Agonist (Wegovy Alternative)"
        description="Compounded semaglutide for provider-guided weight management, containing the same active ingredient as Wegovy. Prescribed online by licensed providers."
        url="/lp/wegovy-alternative"
        administrationRoute="Subcutaneous injection"
      />
      <FAQPageJsonLd faqs={faqs} />
      <MedicalWebPageJsonLd
        name="Wegovy Alternative — Compounded Semaglutide Online"
        description="A clinically comparable alternative to Wegovy at 79% less. Compounded semaglutide prescribed by licensed providers with free 2-day shipping."
        url="/lp/wegovy-alternative"
      />
      <LpConversionWidgets />
    </div>
  );
}
