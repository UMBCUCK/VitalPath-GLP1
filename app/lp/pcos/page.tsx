import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

const ObjectionHandler = dynamic(
  () => import("@/components/marketing/objection-handler").then((m) => m.ObjectionHandler),
  { loading: () => null }
);
import {
  ArrowRight,
  Check,
  Star,
  Heart,
  Activity,
  TrendingUp,
  Flame,
  BarChart3,
  AlertTriangle,
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
  MedicalWebPageJsonLd,
  MedicalConditionJsonLd,
  FAQPageJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title:
    "PCOS Weight Loss | GLP-1 for Insulin Resistance | Nature's Journey",
  description:
    "GLP-1 medication addresses the insulin resistance that makes PCOS weight loss so difficult. Providers who understand PCOS. Specialized protocols. From $279/mo.",
  openGraph: {
    title:
      "PCOS Weight Loss | GLP-1 for Insulin Resistance | Nature's Journey",
    description:
      "GLP-1 medication addresses the insulin resistance that makes PCOS weight loss so difficult. Providers who understand PCOS. Specialized protocols. From $279/mo.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/pcos",
  },
};

/* ─── DATA ─────────────────────────────────────────────────── */

const heroStats = [
  { value: "2,800+", label: "PCOS Members" },
  { value: "4.9/5", label: "Rating" },
  { value: "Insulin-Aware", label: "Protocols" },
  { value: "$279/mo", label: "From" },
];

const problemCards = [
  {
    icon: Activity,
    title: "Insulin Resistance",
    description:
      "Up to 70% of women with PCOS have insulin resistance. Your body stores more fat and resists burning it, regardless of calorie intake.",
  },
  {
    icon: TrendingUp,
    title: "Elevated Androgens",
    description:
      "Higher androgen levels promote visceral fat storage, particularly around the midsection, making belly fat a hallmark of PCOS.",
  },
  {
    icon: BarChart3,
    title: "Metabolic Disruption",
    description:
      "PCOS disrupts the hormones that regulate hunger and satiety. You feel hungrier and less satisfied, even when eating enough.",
  },
  {
    icon: Flame,
    title: "Inflammation Cycle",
    description:
      "Excess weight increases inflammation, which worsens PCOS symptoms, which makes weight loss harder \u2014 a frustrating biological loop.",
  },
];

const solutionPoints = [
  "Improves insulin sensitivity \u2014 directly addressing the root metabolic cause of PCOS weight gain",
  "Reduces appetite signals and cravings that PCOS amplifies through hormonal disruption",
  "Supports steady weight loss that may help improve cycle regularity and reduce androgen levels*",
];

const beyondScaleBenefits = [
  "Improved cycle regularity",
  "Reduced androgen-related symptoms",
  "Better energy and mood",
  "Improved metabolic markers",
];

const testimonials = [
  {
    name: "Amara K.",
    age: 34,
    location: "Houston",
    condition: "PCOS",
    lbs: 36,
    quote:
      "20 years of PCOS and nothing worked. My provider here actually understood insulin resistance. Down 36 lbs.",
  },
  {
    name: "Jessica M.",
    age: 29,
    location: "Phoenix",
    condition: "PCOS + Fertility",
    lbs: 28,
    quote:
      "My cycles became more regular after losing weight on the program. My OBGYN was thrilled.",
  },
  {
    name: "Taylor R.",
    age: 31,
    location: "Denver",
    condition: "PCOS",
    lbs: 33,
    quote:
      "I was told to \u2018just lose weight\u2019 for my PCOS. This is the first program that actually helped me do it.",
  },
];

const faqs = [
  {
    question: "How does GLP-1 help PCOS specifically?",
    answer:
      "GLP-1 medication improves insulin sensitivity \u2014 the primary metabolic driver of PCOS weight gain. By addressing insulin resistance directly, GLP-1 helps your body stop storing excess fat and start responding to weight loss efforts.",
  },
  {
    question: "Will it help my insulin resistance?",
    answer:
      "Clinical evidence suggests GLP-1 receptor agonists improve insulin sensitivity. Many members with PCOS and insulin resistance see improvements in metabolic markers. Your provider will monitor your progress.",
  },
  {
    question: "Can I take GLP-1 while trying to conceive?",
    answer:
      "GLP-1 medication is NOT recommended during pregnancy or while actively trying to conceive. Your provider will discuss timing and planning. Many women use GLP-1 to reach a healthier weight before beginning fertility treatment.",
  },
  {
    question: "What about metformin?",
    answer:
      "Many PCOS patients take metformin for insulin resistance. Your provider will evaluate whether GLP-1 medication can complement or replace your current treatment. Never stop or change medications without provider guidance.",
  },
  {
    question:
      "How is this different from other PCOS weight loss programs?",
    answer:
      "Most programs focus on diet and exercise, which address symptoms but not the hormonal root cause. GLP-1 medication works at the metabolic level to improve insulin sensitivity and regulate appetite \u2014 the biological factors that make PCOS weight loss so difficult.",
  },
] as const;

/* ─── PAGE ─────────────────────────────────────────────────── */

export default function PcosWeightLossPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="PCOS-Informed Treatment"
        badgeIcon={Heart}
        badgeIconColor="text-pink-500"
      />

      {/* ───── Hero ───── */}
      <section className="bg-gradient-to-b from-pink-50/30 via-cloud to-white py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Badge className="mb-6 bg-pink-50 text-pink-700 border-pink-200 gap-1.5 px-4 py-1.5 text-sm">
            <Heart className="h-3.5 w-3.5" /> PCOS-Informed Treatment
          </Badge>

          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl xl:text-6xl">
            PCOS Weight Loss That{" "}
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Works With Your Biology
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500 leading-relaxed sm:text-xl">
            Insulin resistance makes conventional diets fail for PCOS. GLP-1
            medication targets the metabolic root cause &mdash; not just
            calories.
          </p>

          {/* Price anchor */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-navy-50 px-6 py-2.5">
            <span className="text-sm text-graphite-400 line-through">
              $1,349/mo retail
            </span>
            <span className="text-xl font-bold text-navy">$279/mo</span>
            <span className="rounded-full bg-pink-500 px-3 py-0.5 text-xs font-bold text-white">
              Save 79%
            </span>
          </div>

          {/* CTA */}
          <div className="mt-8">
            <Link href="/qualify">
              <Button
                size="xl"
                className="gap-2 px-12 h-16 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                See If I Qualify &mdash; Free Assessment{" "}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <p className="mt-3 text-xs text-graphite-400">
              Free 2-minute assessment. HIPAA protected. Cancel anytime.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-pink-100 bg-white p-4 text-center shadow-sm"
              >
                <p className="text-2xl font-bold text-navy sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-[11px] text-graphite-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-3 text-[10px] text-graphite-300">
            *Based on published clinical data for GLP-1 medications combined
            with diet and exercise. Individual results vary. Compounded
            medications are not FDA-approved.
          </p>
        </div>
      </section>

      {/* ───── Social Proof Bar ───── */}
      <LpSocialProofBar />

      {/* ───── Why PCOS Makes Weight Loss Different ───── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-pink-50 text-pink-700 border-pink-200">
              The Challenge
            </Badge>
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">
              Why PCOS Makes Weight Loss Different
            </h2>
            <p className="mt-3 text-sm text-graphite-500 max-w-xl mx-auto">
              PCOS creates biological barriers that diet and exercise alone
              cannot overcome.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {problemCards.map((card) => (
              <Card key={card.title} className="border-t-2 border-t-pink-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-50">
                      <card.icon className="h-5 w-5 text-pink-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-navy">
                        {card.title}
                      </h3>
                      <p className="mt-1.5 text-xs text-graphite-500 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ───── How GLP-1 Addresses PCOS ───── */}
      <section className="bg-navy-50/30 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-pink-50 text-pink-700 border-pink-200">
              The Solution
            </Badge>
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">
              How GLP-1 Addresses PCOS
            </h2>
          </div>

          <div className="mx-auto max-w-2xl space-y-4">
            {solutionPoints.map((point, idx) => (
              <Card key={idx} className="bg-white">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-100 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-pink-600" />
                    </div>
                    <p className="text-sm text-graphite-600 leading-relaxed">
                      {point}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="mt-4 text-center text-[10px] text-graphite-300">
            *Some patients report improvements. Individual results vary. GLP-1
            is prescribed for weight management.
          </p>
        </div>
      </section>

      {/* ───── Beyond the Scale ───── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-pink-50 text-pink-700 border-pink-200">
              Potential Benefits
            </Badge>
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">
              Beyond the Scale
            </h2>
            <p className="mt-3 text-sm text-graphite-500 max-w-lg mx-auto">
              Some PCOS members report additional improvements as they lose
              weight.
            </p>
          </div>

          <Card className="bg-gradient-to-br from-pink-50/50 to-rose-50/50 border-pink-100">
            <CardContent className="p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                {beyondScaleBenefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-100">
                      <Check className="h-3.5 w-3.5 text-pink-600" />
                    </div>
                    <span className="text-sm text-navy font-medium">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-white/80 p-4 border border-pink-100">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-graphite-500 leading-relaxed">
                  GLP-1 medication is prescribed for weight management.
                  Secondary benefits are not guaranteed and vary by individual.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ───── Testimonials ───── */}
      <section className="bg-pink-50/30 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-pink-50 text-pink-700 border-pink-200">
              Member Stories
            </Badge>
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">
              PCOS Members Who Found What Works
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 text-gold fill-gold"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-graphite-500 leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-4 pt-4 border-t border-navy-100/40">
                    <p className="text-sm font-semibold text-navy">
                      {t.name}, {t.age}
                    </p>
                    <p className="text-xs text-graphite-400">
                      {t.location} &middot; {t.condition} &middot; -{t.lbs} lbs
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="mt-6 text-center text-[10px] text-graphite-300">
            Verified members. Individual results vary. Compounded medications are
            not FDA-approved.
          </p>
        </div>
      </section>

      {/* Objection Handler */}
      <ObjectionHandler />

      {/* ───── FAQ ───── */}
      <LpFaq faqs={faqs} heading="PCOS & GLP-1: Your Questions Answered" />

      {/* ───── Final CTA ───── */}
      <LpCtaSection
        headline="Your PCOS doesn't define your weight. Get the right treatment."
        bgClassName="bg-gradient-to-r from-pink-50 to-rose-50"
      />

      {/* ───── Footer ───── */}
      <LpFooter />

      {/* ───── JSON-LD ───── */}
      <MedicalWebPageJsonLd
        name="PCOS Weight Loss | GLP-1 for Insulin Resistance"
        description="GLP-1 medication addresses the insulin resistance that makes PCOS weight loss so difficult. Providers who understand PCOS."
        url="/lp/pcos"
        medicalAudience="Patient"
      />
      <MedicalConditionJsonLd
        name="Polycystic Ovary Syndrome"
        alternateName="PCOS"
        description="Weight management for women with PCOS and insulin resistance"
        url="/lp/pcos"
        possibleTreatment="GLP-1 Receptor Agonist Therapy"
      />
      <FAQPageJsonLd faqs={faqs} />
      <LpConversionWidgets />
    </div>
  );
}
