import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Heart,
  Star,
  AlertTriangle,
  Activity,
  TrendingDown,
  Moon,
  Clock,
  ClipboardList,
  Stethoscope,
  ShieldCheck,
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
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title:
    "Postpartum Weight Loss | Safe, Provider-Guided GLP-1 | Nature's Journey",
  description:
    "Lose pregnancy weight safely with provider-guided GLP-1 treatment. Comprehensive postpartum screening. Board-certified providers. From $279/mo.",
  robots: { index: true, follow: true },
  openGraph: {
    title:
      "Postpartum Weight Loss | Safe, Provider-Guided GLP-1",
    description:
      "Lose pregnancy weight safely with provider-guided GLP-1 treatment. Comprehensive postpartum screening. Board-certified providers. From $279/mo.",
    type: "website",
  },
  alternates: {
    canonical: "/lp/postpartum",
  },
};

/* ─── DATA ─────────────────────────────────────────────────── */

const heroStats = [
  { value: "Safety First", label: "Our Priority" },
  { value: "Provider-Guided", label: "Every Step" },
  { value: "From $279/mo", label: "All-Inclusive" },
  { value: "Cancel Anytime", label: "No Contracts" },
];

const whyDifferentCards = [
  {
    icon: Activity,
    title: "Hormonal Recovery",
    description:
      "After pregnancy, your hormones don't snap back immediately. Elevated cortisol and shifting estrogen/progesterone can promote fat storage for months.",
  },
  {
    icon: TrendingDown,
    title: "Metabolic Adaptation",
    description:
      "Your body adapted to pregnancy by becoming more efficient at storing energy. This metabolic adaptation can persist long after delivery.",
  },
  {
    icon: Moon,
    title: "Sleep Deprivation Impact",
    description:
      "New parent sleep deprivation increases cortisol and ghrelin (hunger hormone), making weight loss biologically harder — not a willpower issue.",
  },
  {
    icon: Clock,
    title: "Time & Energy Constraints",
    description:
      "Between feeding schedules and recovery, intensive diet programs are impractical. GLP-1 works without requiring hours at the gym.",
  },
];

const safetyPoints = [
  {
    text: "NOT safe during pregnancy or breastfeeding",
    bold: true,
    icon: AlertTriangle,
  },
  {
    text: "Comprehensive postpartum health screening before prescribing",
    bold: false,
    icon: ClipboardList,
  },
  {
    text: "Providers review delivery history, recovery status, and feeding method",
    bold: false,
    icon: Stethoscope,
  },
  {
    text: "Typically recommended after weaning is complete",
    bold: false,
    icon: Clock,
  },
  {
    text: "Regular monitoring throughout treatment",
    bold: false,
    icon: ShieldCheck,
  },
];

const howItWorksSteps = [
  {
    step: "01",
    title: "Postpartum Assessment",
    description:
      "Comprehensive health review including delivery history, recovery status, current feeding method, and overall readiness for treatment.",
  },
  {
    step: "02",
    title: "Provider Evaluation",
    description:
      "Your provider follows a specialized postpartum protocol to determine if and when GLP-1 treatment is safe and appropriate for you.",
  },
  {
    step: "03",
    title: "Treatment Begins",
    description:
      "If appropriate and safe, your personalized plan starts with medication, meal guidance, and ongoing monitoring tailored to your postpartum journey.",
  },
];

const testimonials = [
  {
    quote:
      "Waited until I finished breastfeeding, then started at 8 months postpartum. Down 34 lbs by my son's first birthday.",
    name: "Ashley M.",
    age: 32,
    city: "Austin",
    result: "-34 lbs / 4 months",
  },
  {
    quote:
      "My provider made sure I was fully ready before starting. That care and patience meant everything as a new mom.",
    name: "Brittany K.",
    age: 28,
    city: "Nashville",
    result: "-27 lbs / 3 months",
  },
  {
    quote:
      "Three pregnancies and 60 extra pounds. My provider built a plan that worked with my life as a mom of three.",
    name: "Melissa R.",
    age: 35,
    city: "Denver",
    result: "-48 lbs / 6 months",
  },
];

const faqs = [
  {
    question: "Can I take GLP-1 while breastfeeding?",
    answer:
      "No. GLP-1 medication is NOT recommended during breastfeeding. The safety of GLP-1 receptor agonists during lactation has not been established. Our providers will not prescribe until breastfeeding is complete and your body has had time to recover.",
  },
  {
    question: "When can I start after delivery?",
    answer:
      "Timing depends on your individual recovery, feeding method, and overall health. Most providers recommend waiting until breastfeeding is complete and your body has recovered from delivery. Your provider will determine the right timing during your assessment.",
  },
  {
    question: "Is it safe for new mothers?",
    answer:
      "When started at the appropriate time (after weaning and recovery), GLP-1 medication is prescribed under the same safety standards as for any adult patient. Your provider conducts a thorough postpartum health evaluation before prescribing.",
  },
  {
    question: "Will it affect future pregnancies?",
    answer:
      "GLP-1 medication should be discontinued before attempting to conceive. It is not approved for use during pregnancy. Your provider will discuss family planning as part of your treatment plan.",
  },
  {
    question: "I'm exhausted — do I need to exercise too?",
    answer:
      "GLP-1 medication works independently of exercise. While gentle activity supports overall health, we understand the demands of new parenthood. Your treatment plan and meal guidance are designed to fit your life as a new parent.",
  },
] as const;

/* ─── PAGE ─────────────────────────────────────────────────── */

export default function PostpartumLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <MedicalWebPageJsonLd
        name="Postpartum Weight Loss with GLP-1"
        description="Safe, provider-guided GLP-1 weight loss for postpartum mothers. Comprehensive screening and ongoing support."
        url="/lp/postpartum"
        medicalAudience="Patient"
      />
      <FAQPageJsonLd faqs={faqs} />

      <LpHeader
        badgeText="Postpartum Care"
        badgeIcon={Heart}
        badgeIconColor="text-rose-500"
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-rose-50/30 via-cloud to-white py-12 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Badge
            variant="outline"
            className="mb-4 gap-1.5 border-rose-200 bg-rose-50 px-4 py-1.5 text-rose-700"
          >
            <Heart className="h-3.5 w-3.5" />
            Provider-Guided Postpartum Care
          </Badge>

          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
            Lose the Baby Weight
            <br />
            <span className="bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">
              With Medical Support You Trust
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-graphite-500">
            Pregnancy changes your body in ways that make weight loss harder. Our
            providers specialize in helping new mothers lose weight safely — with
            comprehensive screening and ongoing support.
          </p>

          {/* Price anchor */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-rose-50 px-6 py-2">
            <span className="text-sm text-graphite-400 line-through">
              $1,349/mo retail
            </span>
            <span className="text-lg font-bold text-navy">$279/mo</span>
            <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-bold text-white">
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

      {/* ── CRITICAL SAFETY CALLOUT ──────────────────────────── */}
      <div className="border-y border-amber-200 bg-amber-50 py-3">
        <div className="mx-auto max-w-3xl px-4 text-center text-xs text-amber-800">
          <strong>Important:</strong> GLP-1 medication is not recommended during
          pregnancy or breastfeeding. Our providers conduct comprehensive
          screening to ensure treatment is safe and appropriate for your
          postpartum stage.
        </div>
      </div>

      <LpSocialProofBar />

      {/* ── Why Postpartum Weight Is Different ────────────────── */}
      <section className="py-14">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-2">
            Why Postpartum Weight Is Different
          </h2>
          <p className="text-center text-sm text-graphite-500 mb-8">
            Your body changed to grow a baby. Losing that weight requires
            understanding why it&apos;s there.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {whyDifferentCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card
                  key={card.title}
                  className="border border-navy-100/60 bg-white"
                >
                  <CardContent className="p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 mb-3">
                      <Icon className="h-5 w-5 text-rose-500" />
                    </div>
                    <p className="text-sm font-semibold text-navy mb-1">
                      {card.title}
                    </p>
                    <p className="text-xs text-graphite-500 leading-relaxed">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Safety Section ───────────────────────────────────── */}
      <section className="py-14 bg-navy-50/30">
        <div className="mx-auto max-w-2xl px-4">
          <div className="rounded-2xl border-2 border-rose-200 bg-white p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
                <ShieldCheck className="h-6 w-6 text-rose-500" />
              </div>
              <h2 className="text-2xl font-bold text-navy">
                Safety Is Our First Priority
              </h2>
              <p className="text-sm text-graphite-500 mt-1">
                We will never rush your treatment. Your safety — and your
                baby&apos;s — comes first.
              </p>
            </div>

            <div className="space-y-4">
              {safetyPoints.map((point) => {
                const Icon = point.icon;
                return (
                  <div key={point.text} className="flex items-start gap-3">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                        point.bold
                          ? "bg-red-50"
                          : "bg-rose-50"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          point.bold
                            ? "text-red-500"
                            : "text-rose-500"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-sm ${
                        point.bold
                          ? "font-bold text-red-700"
                          : "text-navy"
                      }`}
                    >
                      {point.text}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-xl bg-rose-50 p-4 text-center">
              <p className="text-xs text-rose-700 font-medium">
                Your provider will determine the right timing based on YOUR
                postpartum journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section className="py-14">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-8">
            How It Works
          </h2>

          <div className="space-y-4">
            {howItWorksSteps.map((step) => (
              <div
                key={step.step}
                className="flex items-start gap-4 rounded-xl bg-rose-50/30 p-5 border border-navy-100/40"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-sm font-bold text-rose-600">
                  {step.step}
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">
                    {step.title}
                  </p>
                  <p className="text-xs text-graphite-500 mt-1 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="bg-navy-50/30 py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-2">
            Mothers Who Started After Weaning
          </h2>
          <p className="text-center text-sm text-graphite-500 mb-8">
            Real stories from moms who waited for the right time — and got real
            results.
          </p>

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
                    <p className="text-xs text-rose-500 font-medium">
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
        heading="Postpartum GLP-1 Questions"
        subheading="Safety, timing, and what to expect as a new parent."
      />

      {/* ── Final CTA ────────────────────────────────────────── */}
      <LpCtaSection
        headline="You took care of your baby. Now let us help take care of you."
        bgClassName="bg-gradient-to-r from-rose-50 to-pink-50"
      />

      <LpFooter />
      <LpConversionWidgets />
    </div>
  );
}
