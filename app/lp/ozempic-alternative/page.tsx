import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

const SavingsCalculator = dynamic(
  () => import("@/components/marketing/savings-calculator").then((m) => m.SavingsCalculator),
  { loading: () => null }
);
import {
  ArrowRight,
  Check,
  Star,
  Zap,
  ShieldCheck,
  FlaskConical,
  Stethoscope,
  ClipboardCheck,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LpHeader } from "@/components/lp/lp-header";
import { LpFooter } from "@/components/lp/lp-footer";
import { LpFaq } from "@/components/lp/lp-faq";
import { LpCtaSection } from "@/components/lp/lp-cta-section";
import { LpSocialProofBar } from "@/components/lp/lp-social-proof-bar";
import { LpConversionWidgets } from "@/components/lp/lp-conversion-widgets";
import {
  DrugJsonLd,
  FAQPageJsonLd,
  MedicalWebPageJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title:
    "Affordable Ozempic & Wegovy Alternative from $279/mo | Nature's Journey",
  description:
    "Compounded semaglutide — the same active ingredient as Ozempic and Wegovy — prescribed by licensed providers. 79% less than retail. Free shipping.",
  openGraph: {
    title:
      "Affordable Ozempic & Wegovy Alternative from $279/mo | Nature's Journey",
    description:
      "Compounded semaglutide — the same active ingredient as Ozempic and Wegovy — prescribed by licensed providers. 79% less than retail. Free shipping.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/ozempic-alternative",
  },
};

const heroStats = [
  { value: "18,000+", label: "Members served" },
  { value: "4.9/5", label: "Average rating" },
  { value: "79%", label: "Less than retail" },
  { value: "Free", label: "2-day shipping" },
];

const explainerCards = [
  {
    icon: ShieldCheck,
    title: "Same Active Ingredient",
    description:
      "Compounded semaglutide contains the same active ingredient prescribed in Ozempic and Wegovy. Your provider determines if it is appropriate for your health profile.",
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
  {
    label: "Monthly cost",
    brand: "$1,349+",
    nj: "From $279",
  },
  {
    label: "Insurance required?",
    brand: "Usually yes",
    nj: "No insurance needed",
  },
  {
    label: "Typical wait time",
    brand: "Weeks to months",
    nj: "Provider review within 24 hrs",
  },
  {
    label: "Provider included",
    brand: "Separate PCP visit",
    nj: "Included in membership",
  },
  {
    label: "Meal plans included",
    brand: "No",
    nj: "Yes, personalized",
  },
  {
    label: "Shipping",
    brand: "Pharmacy pickup",
    nj: "Free 2-day delivery",
  },
];

const steps = [
  {
    icon: ClipboardCheck,
    step: "1",
    title: "Free Assessment",
    time: "2 minutes",
    description:
      "Answer a brief health questionnaire. No payment required to see if you qualify.",
  },
  {
    icon: Stethoscope,
    step: "2",
    title: "Provider Review",
    time: "Within 24 hours",
    description:
      "A licensed provider evaluates your profile and determines if compounded semaglutide is appropriate.",
  },
  {
    icon: Package,
    step: "3",
    title: "Medication Ships",
    time: "2-day delivery",
    description:
      "If prescribed, your medication ships directly to your door with free 2-day delivery.",
  },
];

const testimonials = [
  {
    quote:
      "Spent 6 months fighting my insurance for Ozempic. Started here and had medication in 4 days.",
    name: "Sarah M.",
    age: 41,
    detail: "Switched from retail",
  },
  {
    quote:
      "Same ingredient, fraction of the price. My provider is more attentive than my old PCP ever was.",
    name: "David R.",
    age: 55,
    detail: "Former Ozempic user",
  },
  {
    quote:
      "I couldn't afford $1,300/month. At $279, I can actually commit to the full treatment.",
    name: "Jennifer L.",
    age: 38,
    detail: "Price-conscious",
  },
];

const faqs = [
  {
    question: "Is compounded semaglutide the same as Ozempic?",
    answer:
      "Compounded semaglutide contains the same active ingredient (semaglutide) as Ozempic and Wegovy. However, compounded medications are prepared by licensed 503A/503B pharmacies and are not FDA-approved brand-name drugs. Your provider will determine if compounded semaglutide is appropriate for you.",
  },
  {
    question: "Why is it so much less expensive?",
    answer:
      "Brand-name drugs include costs for patents, marketing, and insurance negotiations. Compounded formulations use the same active ingredient but are prepared by licensed pharmacies at a fraction of the cost, without insurance intermediaries.",
  },
  {
    question: "Is it safe?",
    answer:
      "Compounded semaglutide is prescribed by licensed providers and prepared by licensed pharmacies that follow strict quality standards. Your provider evaluates your complete health history before prescribing.",
  },
  {
    question: "Do I need insurance?",
    answer:
      "No. Our pricing is all-inclusive with no insurance required. Your $279/mo covers the provider evaluation, medication (if prescribed), meal plans, and ongoing support.",
  },
  {
    question: "What if I don't qualify?",
    answer:
      "Not everyone is a candidate for GLP-1 medication. If our providers determine it's not right for you, you won't be charged. The initial assessment is free.",
  },
];

export default function OzempicAlternativePage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="Same Active Ingredient"
        badgeIcon={Zap}
        badgeIconColor="text-teal"
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-teal-50/50 via-cloud to-white py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5">
            <Zap className="h-3.5 w-3.5 text-teal" />
            <span className="text-xs font-semibold text-teal">
              Same Active Ingredient, 79% Less
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
            The Same GLP-1 Medication
            <br />
            <span className="bg-gradient-to-r from-teal to-atlantic bg-clip-text text-transparent">
              Without the $1,349 Price Tag
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-graphite-500">
            Compounded semaglutide contains the same active ingredient
            prescribed in Ozempic and Wegovy. Licensed providers. Licensed
            pharmacies. A fraction of the cost.
          </p>

          {/* Price anchor */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-navy-50 px-6 py-2">
            <span className="text-sm text-graphite-400 line-through">
              $1,349/mo retail
            </span>
            <span className="text-lg font-bold text-navy">$279/mo</span>
            <span className="rounded-full bg-teal px-2.5 py-0.5 text-xs font-bold text-white">
              Save 79%
            </span>
          </div>

          <div className="mt-8">
            <Link href="/qualify">
              <Button
                size="xl"
                className="gap-2 px-12 h-16 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                See If I Qualify — Free Assessment
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <p className="mt-3 text-xs text-graphite-400">
              Takes 2 minutes. No commitment. HIPAA protected.
            </p>
          </div>

          {/* Trust stats */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-navy-100/40 bg-white p-3 text-center shadow-sm"
              >
                <p className="text-lg font-bold text-navy">{stat.value}</p>
                <p className="text-[10px] text-graphite-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LpSocialProofBar />

      {/* What Is Compounded Semaglutide? */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-3">
            What Is Compounded Semaglutide?
          </h2>
          <p className="text-center text-sm text-graphite-500 mb-10 max-w-2xl mx-auto">
            The same active ingredient used in brand-name GLP-1 medications,
            prepared by licensed pharmacies at a fraction of the cost.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {explainerCards.map((card) => (
              <Card
                key={card.title}
                className="rounded-xl border border-navy-100/60 bg-white"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
                    <card.icon className="h-5 w-5 text-teal" />
                  </div>
                  <h3 className="text-base font-semibold text-navy mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-graphite-500 leading-relaxed">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Side-by-Side Comparison */}
      <section className="bg-navy-50/30 py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-10">
            Brand Ozempic vs. Nature&apos;s Journey
          </h2>
          <div className="overflow-hidden rounded-xl border border-navy-100/60 bg-white">
            {/* Column headers */}
            <div className="grid grid-cols-3 border-b border-navy-100/40 bg-navy-50/50">
              <div className="p-4" />
              <div className="p-4 text-center text-xs font-semibold text-graphite-400 uppercase tracking-wide">
                Brand Ozempic
              </div>
              <div className="p-4 text-center text-xs font-semibold text-teal uppercase tracking-wide">
                Nature&apos;s Journey
              </div>
            </div>
            {comparisonRows.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-3 ${i < comparisonRows.length - 1 ? "border-b border-navy-100/30" : ""}`}
              >
                <div className="p-4 text-sm font-medium text-navy">
                  {row.label}
                </div>
                <div className="p-4 text-center text-sm text-graphite-400">
                  {row.brand}
                </div>
                <div className="p-4 text-center text-sm font-medium text-navy flex items-center justify-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-teal shrink-0" />
                  {row.nj}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-[10px] text-graphite-400">
            Compounded semaglutide is not an FDA-approved brand-name drug.
            Pricing based on published retail costs at time of writing.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-3">
            How It Works
          </h2>
          <p className="text-center text-sm text-graphite-500 mb-10">
            Three simple steps from assessment to delivery.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <Card
                key={s.title}
                className="rounded-xl border border-navy-100/60 bg-white relative overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
                      <s.icon className="h-5 w-5 text-teal" />
                    </div>
                    <span className="text-xs font-semibold text-teal bg-teal-50 px-2 py-0.5 rounded-full">
                      {s.time}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-teal mb-1">
                    Step {s.step}
                  </div>
                  <h3 className="text-base font-semibold text-navy mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-graphite-500 leading-relaxed">
                    {s.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <SavingsCalculator />

      {/* Testimonials */}
      <section className="bg-navy-50/30 py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-10">
            Why Members Switch
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card
                key={t.name}
                className="rounded-xl border border-navy-100/60 bg-white"
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
                  <blockquote className="text-sm text-graphite-600 italic leading-relaxed mb-4">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="text-sm font-semibold text-navy">
                    {t.name}, {t.age}
                  </div>
                  <div className="text-xs text-graphite-400">{t.detail}</div>
                  <p className="mt-2 text-[10px] text-graphite-400">
                    Verified member. Individual results vary.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <LpFaq
        faqs={faqs}
        subheading="Common questions about compounded semaglutide and our program."
      />

      {/* Final CTA */}
      <LpCtaSection headline="Stop overpaying for the same active ingredient" />

      <LpFooter />

      {/* JSON-LD */}
      <DrugJsonLd
        name="Compounded Semaglutide"
        alternateName="GLP-1 Receptor Agonist"
        description="Compounded semaglutide for provider-guided weight management, containing the same active ingredient as Ozempic and Wegovy."
        url="/lp/ozempic-alternative"
        administrationRoute="Subcutaneous injection"
      />
      <FAQPageJsonLd faqs={faqs} />
      <MedicalWebPageJsonLd
        name="Affordable Ozempic & Wegovy Alternative"
        description="Compounded semaglutide — the same active ingredient as Ozempic and Wegovy — prescribed by licensed providers at 79% less than retail."
        url="/lp/ozempic-alternative"
      />
      <LpConversionWidgets />
    </div>
  );
}
