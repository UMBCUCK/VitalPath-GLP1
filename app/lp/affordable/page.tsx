import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  DollarSign,
  Star,
  ShieldCheck,
  X,
  Lock,
  Truck,
  Stethoscope,
  UtensilsCrossed,
  BarChart3,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LpHeader } from "@/components/lp/lp-header";
import { LpFooter } from "@/components/lp/lp-footer";
import { LpFaq } from "@/components/lp/lp-faq";
import { LpCtaSection } from "@/components/lp/lp-cta-section";
import { LpSocialProofBar } from "@/components/lp/lp-social-proof-bar";
import { LpConversionWidgets } from "@/components/lp/lp-conversion-widgets";
import {
  FAQPageJsonLd,
  ProductJsonLd,
  MedicalWebPageJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title:
    "Affordable GLP-1 Weight Loss from $279/mo | No Insurance Needed | Nature's Journey",
  description:
    "GLP-1 weight loss from $279/mo — 79% less than retail. Provider evaluation, medication, meal plans, and support included. No insurance needed. No hidden fees.",
  robots: { index: true, follow: true },
  openGraph: {
    title:
      "Affordable GLP-1 Weight Loss from $279/mo | No Insurance Needed",
    description:
      "GLP-1 weight loss from $279/mo — 79% less than retail. Provider evaluation, medication, meal plans, and support included. No insurance needed. No hidden fees.",
    type: "website",
  },
  alternates: {
    canonical: "/lp/affordable",
  },
};

/* ─── DATA ─────────────────────────────────────────────────── */

const heroStats = [
  { value: "$279/mo", label: "All-In" },
  { value: "79%", label: "Less Than Retail" },
  { value: "No Insurance", label: "Required" },
  { value: "Free", label: "Shipping" },
];

const priceComparisons = [
  {
    name: "Brand-Name GLP-1",
    subtitle: "Ozempic / Wegovy",
    price: "$1,349/mo",
    note: "Requires insurance or full retail price. Often on backorder.",
    highlight: false,
  },
  {
    name: "Insurance Copay",
    subtitle: "If approved",
    price: "$300–$500/mo",
    note: "Requires prior authorization. Denials are common. Months of appeals.",
    highlight: false,
  },
  {
    name: "Other Telehealth Programs",
    subtitle: "Competitors",
    price: "$399–$599/mo",
    note: "Higher prices. Some charge separately for consults and medication.",
    highlight: false,
  },
  {
    name: "Nature's Journey",
    subtitle: "All-Inclusive",
    price: "$279/mo",
    note: "All-inclusive. Provider + medication + meal plans + support. No insurance needed.",
    highlight: true,
  },
];

const includedItems = [
  {
    icon: Stethoscope,
    title: "Provider Evaluation & Ongoing Care",
    value: "~$200/mo value",
  },
  {
    icon: DollarSign,
    title: "GLP-1 Medication (if prescribed)",
    value: "~$1,349/mo retail",
  },
  {
    icon: UtensilsCrossed,
    title: "Personalized Meal Plans",
    value: "~$50/mo value",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking Dashboard",
    value: "Included",
  },
  {
    icon: MessageCircle,
    title: "Care Team Messaging",
    value: "Included",
  },
  {
    icon: Truck,
    title: "Free 2-Day Shipping",
    value: "~$15/shipment value",
  },
];

const noInsurancePoints = [
  "No insurance required or accepted",
  "No prior authorization or appeals",
  "No surprise bills or copay changes",
  "Price locked for your plan duration",
  "30-day money-back guarantee",
];

const testimonials = [
  {
    quote:
      "I was spending $400/mo at another program. Same medication here for $279 with better support.",
    name: "Nicole T.",
    age: 37,
    city: "Tampa",
    result: "-33 lbs / 4 months",
  },
  {
    quote:
      "No insurance meant Ozempic was impossible. Nature's Journey made GLP-1 accessible at a price I can afford.",
    name: "Derek M.",
    age: 44,
    city: "Phoenix",
    result: "-41 lbs / 5 months",
  },
  {
    quote:
      "The all-inclusive pricing sealed the deal. No hidden fees, no surprises. Just results.",
    name: "Tanya R.",
    age: 42,
    city: "Charlotte",
    result: "-29 lbs / 4 months",
  },
];

const faqs = [
  {
    question: "What does $279/mo include?",
    answer:
      "Everything. Provider evaluation and ongoing monitoring, GLP-1 medication (if prescribed), personalized meal plans, progress tracking, care team messaging, and free 2-day shipping. There are no hidden consult fees, pharmacy fees, or surprise charges.",
  },
  {
    question: "Are there hidden fees?",
    answer:
      "No. Your monthly membership covers all aspects of your treatment. There are no sign-up fees, cancellation fees, or separate pharmacy charges. The price you see is the price you pay.",
  },
  {
    question: "Do I need insurance?",
    answer:
      "No. Our program operates independently of insurance. You pay one flat monthly rate that covers everything. No prior authorization, no appeals, no denied claims.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. There are no contracts or commitments. Cancel anytime through your dashboard or by contacting our care team. We also offer a 30-day money-back guarantee for new members.",
  },
  {
    question: "Why is it so much less than retail?",
    answer:
      "Brand-name drugs like Ozempic include costs for patents, marketing, and insurance negotiations. Our compounded formulations use the same active ingredient prepared by licensed pharmacies, without those added costs.",
  },
] as const;

/* ─── PAGE ─────────────────────────────────────────────────── */

export default function AffordableLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <MedicalWebPageJsonLd
        name="Affordable GLP-1 Weight Loss Program"
        description="All-inclusive GLP-1 weight loss program from $279/mo. No insurance needed."
        url="/lp/affordable"
        medicalAudience="Patient"
      />
      <ProductJsonLd
        name="GLP-1 Weight Management Program"
        description="All-inclusive GLP-1 weight loss program including provider, medication, and support"
        price={279}
        url="/lp/affordable"
      />
      <FAQPageJsonLd faqs={faqs} />

      <LpHeader
        badgeText="All-Inclusive Pricing"
        badgeIcon={DollarSign}
        badgeIconColor="text-emerald-600"
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-emerald-50/30 via-cloud to-white py-12 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Badge
            variant="outline"
            className="mb-4 gap-1.5 border-emerald-200 bg-emerald-50 px-4 py-1.5 text-emerald-700"
          >
            <DollarSign className="h-3.5 w-3.5" />
            All-Inclusive Pricing, No Surprises
          </Badge>

          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
            GLP-1 Weight Loss
            <br />
            <span className="bg-gradient-to-r from-emerald-500 to-teal bg-clip-text text-transparent">
              Without the Premium Price Tag
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-graphite-500">
            Everything included for $279/mo. No surprise fees, no insurance
            battles, no separate consult charges. Straightforward pricing for
            real results.
          </p>

          {/* Price anchor */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-emerald-50 px-6 py-2">
            <span className="text-sm text-graphite-400 line-through">
              $1,349/mo retail
            </span>
            <span className="text-lg font-bold text-navy">$279/mo</span>
            <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-bold text-white">
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

      {/* ── Price Comparison ─────────────────────────────────── */}
      <section className="py-14">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-2">
            See How We Compare
          </h2>
          <p className="text-center text-sm text-graphite-500 mb-8">
            The same active ingredient — without the premium markup.
          </p>

          <div className="space-y-3">
            {priceComparisons.map((item) => (
              <Card
                key={item.name}
                className={
                  item.highlight
                    ? "border-2 border-emerald-400 bg-emerald-50/40 shadow-md"
                    : "border border-navy-100/60"
                }
              >
                <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-navy">
                        {item.name}
                      </p>
                      {item.highlight && (
                        <Badge className="bg-emerald-500 text-white text-[10px]">
                          Best Value
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-graphite-400 mt-0.5">
                      {item.subtitle}
                    </p>
                    <p className="text-xs text-graphite-500 mt-1">
                      {item.note}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={`text-lg font-bold ${
                        item.highlight ? "text-emerald-600" : "text-navy"
                      }`}
                    >
                      {item.price}
                    </p>
                    {!item.highlight && (
                      <X className="h-4 w-4 text-red-400 ml-auto" />
                    )}
                    {item.highlight && (
                      <Check className="h-4 w-4 text-emerald-500 ml-auto" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's Included ──────────────────────────────────── */}
      <section className="bg-navy-50/30 py-14">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-2">
            What&apos;s Included in $279/mo
          </h2>
          <p className="text-center text-sm text-graphite-500 mb-8">
            No hidden charges. No separate bills. Everything in one membership.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {includedItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="border border-navy-100/60">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                      <Icon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy">
                        {item.title}
                      </p>
                      <p className="text-xs text-graphite-400 mt-0.5">
                        {item.value}
                      </p>
                    </div>
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 ml-auto" />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Value callout */}
          <div className="mt-6 rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-5 text-center">
            <p className="text-sm text-graphite-500">Total estimated value</p>
            <p className="text-2xl font-bold text-navy mt-1">
              Over $1,600/mo in value for{" "}
              <span className="text-emerald-600">$279</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── No Insurance Section ─────────────────────────────── */}
      <section className="py-14">
        <div className="mx-auto max-w-2xl px-4">
          <div className="rounded-2xl border-2 border-emerald-200 bg-white p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-navy mb-2">
              No Insurance? No Problem.
            </h2>
            <p className="text-sm text-graphite-500 mb-6">
              Skip the paperwork, denials, and surprise bills. One price covers
              everything.
            </p>

            <div className="space-y-3 text-left max-w-md mx-auto">
              {noInsurancePoints.map((point) => (
                <div key={point} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="text-sm text-navy">{point}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-graphite-400">
              <Lock className="h-3.5 w-3.5" />
              <span>Price guaranteed for your plan duration</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="bg-navy-50/30 py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-8">
            Real Members, Real Savings
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            {testimonials.map((t) => (
              <Card
                key={t.name}
                className="border border-navy-100/60 bg-white"
              >
                <CardContent className="p-5">
                  <div className="flex gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 text-gold fill-gold"
                      />
                    ))}
                  </div>
                  <blockquote className="text-sm text-graphite-600 italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="mt-4 border-t border-navy-100/40 pt-3">
                    <p className="text-xs font-semibold text-navy">
                      {t.name}, {t.age}, {t.city}
                    </p>
                    <p className="text-xs text-emerald-600 font-medium">
                      {t.result}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-center text-[10px] text-graphite-400">
            Verified members. Individual results vary.
          </p>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <LpFaq
        faqs={[...faqs]}
        heading="Pricing Questions"
        subheading="Transparent answers about what you pay — and what you get."
      />

      {/* ── Final CTA ────────────────────────────────────────── */}
      <LpCtaSection headline="Premium weight loss doesn't require a premium price" />

      <LpFooter />
      <LpConversionWidgets />
    </div>
  );
}
