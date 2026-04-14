import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

const SavingsCalculator = dynamic(
  () => import("@/components/marketing/savings-calculator").then((m) => m.SavingsCalculator),
  { loading: () => null }
);
const ObjectionHandler = dynamic(
  () => import("@/components/marketing/objection-handler").then((m) => m.ObjectionHandler),
  { loading: () => null }
);
import {
  ArrowRight,
  Check,
  X,
  Star,
  Shield,
  UserCheck,
  Scale,
  RefreshCw,
  ClipboardCheck,
  Stethoscope,
  Package,
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
  MedicalWebPageJsonLd,
  ProductJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title:
    "Weight Loss Without Surgery | GLP-1 Alternative from $279/mo | Nature's Journey",
  description:
    "Lose significant weight without surgery, hospital stays, or recovery time. GLP-1 medication offers a medically supervised, non-invasive alternative. From $279/mo.",
  openGraph: {
    title:
      "Weight Loss Without Surgery | GLP-1 Alternative from $279/mo | Nature's Journey",
    description:
      "Lose significant weight without surgery, hospital stays, or recovery time. GLP-1 medication offers a medically supervised, non-invasive alternative. From $279/mo.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/no-surgery",
  },
};

const heroStats = [
  { value: "No Surgery", label: "Non-invasive" },
  { value: "No Recovery", label: "Time needed" },
  { value: "$279/mo", label: "From" },
  { value: "18,000+", label: "Members" },
];

const surgeryItems = [
  "$15,000 - $25,000 average cost",
  "2-4 week recovery period",
  "Surgical risks and complications",
  "Permanent anatomical changes",
  "Hospital stay required",
  "Dietary restrictions for life",
];

const glp1Items = [
  "From $279/month",
  "No recovery time needed",
  "Mild, manageable side effects",
  "Non-invasive, reversible",
  "Treatment from home",
  "Guided meal plans included",
];

const audienceCards = [
  {
    icon: UserCheck,
    title: "Considering Surgery",
    description:
      "If you're exploring bariatric options, GLP-1 medication may achieve similar results without the surgical risks, recovery time, or permanent changes.",
  },
  {
    icon: Scale,
    title: "BMI 27-40",
    description:
      "GLP-1 is typically prescribed for adults with BMI 27+ with weight-related conditions, or BMI 30+. Your provider determines eligibility.",
  },
  {
    icon: RefreshCw,
    title: "Post-Surgery Support",
    description:
      "Some patients who've had bariatric surgery and regained weight find GLP-1 medication helps them manage weight long-term.",
  },
];

const processSteps = [
  {
    icon: ClipboardCheck,
    step: "01",
    title: "Free Assessment",
    description:
      "Complete a 2-minute health questionnaire. No cost, no commitment. Your information is HIPAA-protected.",
  },
  {
    icon: Stethoscope,
    step: "02",
    title: "Provider Evaluation",
    description:
      "A licensed provider reviews your profile, typically within 1 business day, and determines if GLP-1 is right for you.",
  },
  {
    icon: Package,
    step: "03",
    title: "Medication Delivery",
    description:
      "If prescribed, your medication ships free with 2-day delivery. Ongoing provider support and meal plans included.",
  },
];

const testimonials = [
  {
    name: "Thomas R.",
    age: 48,
    location: "Houston",
    lbs: 52,
    months: 7,
    quote:
      "Was scheduled for gastric bypass. Tried GLP-1 first and lost 52 lbs. Cancelled the surgery.",
  },
  {
    name: "Maria G.",
    age: 43,
    location: "Orlando",
    lbs: 39,
    months: 5,
    quote:
      "After bariatric surgery 5 years ago, I'd regained 40 lbs. GLP-1 helped me lose it again — no second surgery needed.",
  },
  {
    name: "Steven P.",
    age: 51,
    location: "Minneapolis",
    lbs: 45,
    months: 6,
    quote:
      "The idea of surgery terrified me. GLP-1 gave me an alternative that actually worked. Zero regrets.",
  },
];

const faqs = [
  {
    question: "How much weight can I lose without surgery?",
    answer:
      "Clinical studies show GLP-1 medications can help patients lose 15-20% of body weight on average. For a 250-lb individual, that's 37-50 lbs. Individual results vary based on starting weight, adherence, and other factors.",
  },
  {
    question: "Is GLP-1 as effective as bariatric surgery?",
    answer:
      "Bariatric surgery may produce more dramatic initial weight loss (25-35%). However, GLP-1 medication offers significant weight loss (15-20%) without surgical risks, recovery time, or permanent anatomical changes. Your provider can discuss which approach fits your goals.",
  },
  {
    question: "What are the side effects compared to surgery?",
    answer:
      "GLP-1 side effects are typically mild and temporary: nausea, decreased appetite, and digestive changes during titration. These are significantly less severe than surgical complications, which can include infection, nutrient deficiency, and digestive issues.",
  },
  {
    question: "Can I switch to surgery later if needed?",
    answer:
      "Absolutely. GLP-1 medication doesn't preclude future surgical options. Many providers recommend trying GLP-1 first as a less invasive approach. If surgery is ultimately needed, you'll go in at a lower weight, which reduces surgical risk.",
  },
  {
    question: "Do I need a high BMI to qualify?",
    answer:
      "GLP-1 medication is typically prescribed for adults with BMI 30+ or BMI 27+ with at least one weight-related health condition. Your provider determines eligibility based on your complete health profile during the free assessment.",
  },
];

export default function NoSurgeryLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="No Surgery Required"
        badgeIcon={Shield}
        badgeIconColor="text-emerald-600"
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-emerald-50/30 via-cloud to-white py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Badge className="mb-4 bg-emerald-50 text-emerald-700 border-emerald-200">
            <Shield className="mr-1 h-3 w-3" /> No Surgery Required
          </Badge>

          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
            Significant Weight Loss
            <br />
            <span className="bg-gradient-to-r from-emerald-500 to-teal bg-clip-text text-transparent">
              Without Going Under the Knife
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-graphite-500">
            GLP-1 medication can help you lose significant weight —
            without surgery, hospital stays, or weeks of recovery.
            Medically supervised. Clinically studied.
          </p>

          {/* Price anchor */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-navy-50 px-6 py-2">
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
              Free 2-minute assessment. HIPAA protected. Cancel anytime.
            </p>
          </div>

          {/* Trust stats */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {heroStats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-emerald-100 bg-white p-3 text-center shadow-sm"
              >
                <p className="text-lg font-bold text-navy">{s.value}</p>
                <p className="text-[10px] text-graphite-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LpSocialProofBar />

      {/* Surgery vs. GLP-1 Comparison */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-2">
            Surgery vs. GLP-1: A Clear Comparison
          </h2>
          <p className="text-center text-sm text-graphite-500 mb-10">
            See how GLP-1 medication compares to bariatric surgery.
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Surgery column */}
            <div className="rounded-xl border border-red-200/60 bg-red-50/30 p-6">
              <h3 className="text-sm font-bold text-navy mb-4 text-center">
                Bariatric Surgery
              </h3>
              <div className="space-y-3">
                {surgeryItems.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 mt-0.5">
                      <X className="h-3 w-3 text-red-500" />
                    </div>
                    <span className="text-xs text-graphite-600">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* GLP-1 column */}
            <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/30 p-6">
              <h3 className="text-sm font-bold text-navy mb-4 text-center">
                GLP-1 with Nature&apos;s Journey
              </h3>
              <div className="space-y-3">
                {glp1Items.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 mt-0.5">
                      <Check className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-xs text-graphite-600">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is This For? */}
      <section className="bg-navy-50/30 py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-2">
            Who Is This For?
          </h2>
          <p className="text-center text-sm text-graphite-500 mb-10">
            GLP-1 medication may be right for you if any of these apply.
          </p>
          <div className="grid gap-5 sm:grid-cols-3">
            {audienceCards.map((card) => (
              <Card key={card.title}>
                <CardContent className="p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 mb-3">
                    <card.icon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-bold text-navy">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-xs text-graphite-500 leading-relaxed">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-2">
            How It Works
          </h2>
          <p className="text-center text-sm text-graphite-500 mb-10">
            Three simple steps. No hospital visit required.
          </p>
          <div className="grid gap-5 sm:grid-cols-3">
            {processSteps.map((step) => (
              <div
                key={step.step}
                className="rounded-xl border border-navy-100/60 bg-white p-5 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 mb-3">
                  <step.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  Step {step.step}
                </span>
                <h3 className="mt-1 text-sm font-bold text-navy">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs text-graphite-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SavingsCalculator />

      {/* Testimonials */}
      <section className="bg-navy-50/30 py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-8">
            Real Results Without Surgery
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
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
                  <p className="text-xs text-graphite-600 italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-navy">
                        {t.name}, {t.age}, {t.location}
                      </p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">
                      -{t.lbs} lbs / {t.months}mo
                    </Badge>
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

      {/* Objection Handler */}
      <ObjectionHandler />

      {/* FAQ */}
      <LpFaq
        faqs={faqs}
        heading="Surgery vs. GLP-1: Your Questions"
        subheading="Common questions about non-surgical weight loss with GLP-1."
      />

      {/* Final CTA */}
      <LpCtaSection
        headline="Lose the weight without the surgery"
        bgClassName="bg-gradient-to-r from-emerald-50 to-teal-50"
      />

      <LpFooter />

      {/* JSON-LD */}
      <MedicalWebPageJsonLd
        name="Non-Surgical Weight Loss with GLP-1"
        description="Lose significant weight without surgery, hospital stays, or recovery time. GLP-1 medication offers a medically supervised, non-invasive alternative."
        url="/lp/no-surgery"
      />
      <FAQPageJsonLd faqs={faqs} />
      <ProductJsonLd
        name="GLP-1 Weight Management Program"
        description="Non-surgical weight loss program with GLP-1 medication, provider evaluation, meal plans, and ongoing support."
        price={279}
        url="/lp/no-surgery"
      />
      <LpConversionWidgets />
    </div>
  );
}
