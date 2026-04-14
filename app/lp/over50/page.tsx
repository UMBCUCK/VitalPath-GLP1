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
  Star,
  Shield,
  Activity,
  ShieldCheck,
  Heart,
  Dumbbell,
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
import { MedicalWebPageJsonLd, FAQPageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title:
    "Weight Loss After 50 | GLP-1 Programs for Adults 50+ | Nature's Journey",
  description:
    "Medically supervised weight loss for adults over 50. Providers experienced with metabolic changes, medication interactions, joint protection, and muscle preservation. From $279/mo.",
  openGraph: {
    title:
      "Weight Loss After 50 | GLP-1 Programs for Adults 50+ | Nature's Journey",
    description:
      "Medically supervised weight loss for adults over 50. Providers experienced with metabolic changes, medication interactions, joint protection, and muscle preservation. From $279/mo.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/over50",
  },
};

/* ─── DATA ────────────────────────────────────────────────── */

const trustStats = [
  { value: "4,800+", label: "Members 50+" },
  { value: "4.9/5", label: "Rating" },
  { value: "Joint-Safe", label: "Approach" },
  { value: "Muscle", label: "Preservation" },
];

const challengeCards = [
  {
    title: "Metabolic Slowdown",
    description:
      "Your metabolism has declined 10%+ since your 30s. GLP-1 medication works at the hormonal level to counteract this biological shift.",
    icon: Activity,
  },
  {
    title: "Medication Interactions",
    description:
      "Taking other medications? Your provider reviews your complete medication list to ensure safe, effective treatment.",
    icon: ShieldCheck,
  },
  {
    title: "Joint Health Priority",
    description:
      "Every pound lost reduces 4 pounds of stress on your knees. GLP-1 helps you lose weight without high-impact exercise.",
    icon: Heart,
  },
  {
    title: "Muscle Preservation",
    description:
      "After 50, muscle loss accelerates. Our protein-optimized meal plans and provider guidance help preserve lean muscle mass.",
    icon: Dumbbell,
  },
];

const safetyPoints = [
  "Complete health history review",
  "Medication interaction screening",
  "Regular provider check-ins",
  "Gradual dose titration",
  "Ongoing monitoring",
];

const steps = [
  {
    title: "Free Assessment",
    description: "Answer a few health questions \u2014 takes just 2 minutes.",
    icon: ClipboardCheck,
  },
  {
    title: "Provider Review",
    description:
      "A licensed provider evaluates your profile, typically within 24 hours.",
    icon: Stethoscope,
  },
  {
    title: "Treatment Begins",
    description:
      "If prescribed, medication ships free to your door with ongoing support.",
    icon: Package,
  },
];

const testimonials = [
  {
    name: "Robert M.",
    age: 58,
    location: "Phoenix",
    lbs: 43,
    months: 6,
    quote:
      "At 58, I\u2019d tried everything. Down 43 lbs in 6 months. My doctor says my bloodwork hasn\u2019t looked this good in a decade.",
  },
  {
    name: "Sandra K.",
    age: 63,
    location: "Nashville",
    lbs: 31,
    months: 5,
    quote:
      "My provider checked every one of my medications before prescribing. That level of care matters at our age.",
  },
  {
    name: "William T.",
    age: 56,
    location: "Seattle",
    lbs: 37,
    months: 5,
    quote:
      "Knees feel 20 years younger. I can play with my grandkids again without pain.",
  },
];

const faqs = [
  {
    question: "Am I too old for GLP-1 medication?",
    answer:
      "Age alone is not a disqualifying factor. Many of our most successful members are over 50 and 60. Your provider evaluates your complete health picture \u2014 including other medications, conditions, and goals \u2014 to determine if GLP-1 is appropriate.",
  },
  {
    question: "What about my other medications?",
    answer:
      "Your provider conducts a thorough medication review before prescribing. GLP-1 medications are generally well-tolerated alongside common medications for blood pressure, cholesterol, and other conditions. Always disclose your full medication list.",
  },
  {
    question: "Will it affect my joints?",
    answer:
      "Weight loss typically improves joint health. Every pound lost reduces approximately 4 pounds of pressure on your knees. Many members over 50 report significant improvements in joint comfort and mobility.",
  },
  {
    question: "How is this different from diet programs?",
    answer:
      "GLP-1 medication addresses the hormonal and metabolic factors that make weight loss increasingly difficult after 50. Unlike diet programs alone, it works at the biological level to reduce appetite signals and improve metabolic function.",
  },
  {
    question: "What about muscle loss?",
    answer:
      "We take muscle preservation seriously. Your plan includes protein-optimized meal guidance and your provider monitors your progress to ensure you\u2019re losing fat, not muscle. Strength training recommendations are included.",
  },
] as const;

/* ─── PAGE ────────────────────────────────────────────────── */

export default function Over50LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <MedicalWebPageJsonLd
        name="GLP-1 Weight Loss for Adults Over 50"
        description="Medically supervised weight loss for adults over 50. From $279/mo."
        url="/lp/over50"
        medicalAudience="Patient"
      />
      <FAQPageJsonLd faqs={faqs} />

      <LpHeader
        badgeText="Designed for Adults 50+"
        badgeIcon={Shield}
        badgeIconColor="text-teal"
      />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-sage/30 via-cloud to-white py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Badge className="mb-4 bg-emerald-50 text-emerald-700 border-emerald-200">
            <Shield className="mr-1 h-3 w-3" /> Designed for Adults 50+
          </Badge>

          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
            Weight Loss That Works
            <br />
            <span className="bg-gradient-to-r from-teal to-emerald-600 bg-clip-text text-transparent">
              Even After 50
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-graphite-500">
            After 50, your metabolism, hormones, and muscle mass all change. Our
            providers specialize in weight management that accounts for every one
            of those factors.
          </p>

          {/* Price anchor */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-navy-50 px-6 py-2">
            <span className="text-sm text-graphite-400 line-through">$1,349/mo retail</span>
            <span className="text-lg font-bold text-navy">$279/mo</span>
            <span className="rounded-full bg-teal px-2.5 py-0.5 text-xs font-bold text-white">
              Save 79%
            </span>
          </div>

          <div className="mt-8">
            <Link href="/qualify">
              <Button
                size="xl"
                className="gap-2 px-12 h-16 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
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
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {trustStats.map((s) => (
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

      {/* ── Why Weight Loss Is Different After 50 ── */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-2">
            Why Weight Loss Is Different After 50
          </h2>
          <p className="text-center text-sm text-graphite-500 mb-10">
            Your body has changed. Your weight-loss approach should too.
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {challengeCards.map((c) => (
              <Card key={c.title}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                      <c.icon className="h-5 w-5 text-teal" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-navy">{c.title}</h3>
                      <p className="mt-1 text-xs text-graphite-500 leading-relaxed">
                        {c.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comprehensive Safety First ── */}
      <section className="bg-gradient-to-r from-emerald-50/60 to-teal-50/60 py-14">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-teal to-emerald-600">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-navy mb-2">
            Comprehensive Safety First
          </h2>
          <p className="text-sm text-graphite-500 mb-8">
            Every treatment plan starts with a thorough safety evaluation.
          </p>
          <div className="mx-auto max-w-md space-y-3">
            {safetyPoints.map((point) => (
              <div
                key={point}
                className="flex items-center gap-3 rounded-xl bg-white/80 p-4 shadow-sm"
              >
                <Check className="h-5 w-5 text-teal shrink-0" />
                <span className="text-sm font-medium text-navy">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-10">
            How It Works
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-lg font-bold text-teal">
                  {i + 1}
                </div>
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                  <step.icon className="h-5 w-5 text-teal" />
                </div>
                <h3 className="text-sm font-bold text-navy">{step.title}</h3>
                <p className="mt-1 text-xs text-graphite-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SavingsCalculator />

      {/* ── Testimonials ── */}
      <section className="bg-navy-50/30 py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-8">
            Real Results After 50
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <CardContent className="p-5">
                  <div className="flex gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-3.5 w-3.5 text-gold fill-gold" />
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

      {/* ── FAQ ── */}
      <LpFaq
        faqs={[...faqs]}
        heading="Questions About Weight Loss After 50"
        subheading="Common concerns from adults over 50 considering GLP-1 medication."
      />

      {/* ── Final CTA ── */}
      <LpCtaSection headline="It's not too late — it's actually the perfect time" />

      <LpFooter />
      <LpConversionWidgets />
    </div>
  );
}
