import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Star,
  Zap,
  Brain,
  Activity,
  TrendingDown,
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
  DrugJsonLd,
  FAQPageJsonLd,
  MedicalWebPageJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Tirzepatide Weight Loss Online from $379/mo | Nature's Journey",
  description:
    "Tirzepatide — dual GLP-1/GIP agonist, the active ingredient in Mounjaro and Zepbound. Prescribed online by licensed providers. From $379/mo.",
  openGraph: {
    title: "Tirzepatide Weight Loss Online from $379/mo | Nature's Journey",
    description:
      "Tirzepatide — dual GLP-1/GIP agonist, the active ingredient in Mounjaro and Zepbound. Prescribed online by licensed providers. From $379/mo.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/tirzepatide",
  },
};

/* ─── DATA ────────────────────────────────────────────────── */

const trustStats = [
  { value: "Up to 21%", label: "Body weight loss*" },
  { value: "Dual Action", label: "GLP-1 + GIP" },
  { value: "$379/mo", label: "From" },
  { value: "Licensed", label: "Providers" },
];

const mechanismCards = [
  {
    title: "GLP-1 Activation",
    description:
      "Reduces appetite signals and slows gastric emptying, helping you feel satisfied with less food.",
    icon: Brain,
  },
  {
    title: "GIP Activation",
    description:
      "Enhances insulin sensitivity and improves how your body processes and stores fat.",
    icon: Activity,
  },
  {
    title: "Combined Effect",
    description:
      "The dual mechanism may produce more significant results than single-receptor medications for some patients.",
    icon: TrendingDown,
  },
];

const comparisonRows = [
  { label: "Mechanism", semaglutide: "Single GLP-1", tirzepatide: "Dual GLP-1/GIP" },
  { label: "Clinical weight loss*", semaglutide: "15\u201320%", tirzepatide: "Up to 21%" },
  { label: "Dosing", semaglutide: "Weekly injection", tirzepatide: "Weekly injection" },
  { label: "Starting price", semaglutide: "$279/mo", tirzepatide: "$379/mo" },
  { label: "Side effects", semaglutide: "Similar GI effects", tirzepatide: "Similar GI effects" },
];

const includedItems = [
  "Provider evaluation + ongoing monitoring",
  "Tirzepatide medication if prescribed",
  "Personalized meal plans",
  "Weekly dose management",
  "Care team messaging",
  "30-day satisfaction guarantee",
];

const testimonials = [
  {
    name: "Patricia K.",
    age: 44,
    location: "Chicago",
    lbs: 38,
    months: 5,
    quote:
      "Tried semaglutide first, then my provider switched me to tirzepatide. The difference was noticeable within weeks.",
  },
  {
    name: "Michael R.",
    age: 49,
    location: "Austin",
    lbs: 51,
    months: 7,
    quote:
      "The dual-action approach made sense to me as an engineer. Down 51 lbs and my A1C improved significantly.",
  },
  {
    name: "Dana S.",
    age: 36,
    location: "Miami",
    lbs: 29,
    months: 4,
    quote:
      "I was paying $1,500/mo for brand-name. Same ingredient here for a quarter of the price.",
  },
];

const faqs = [
  {
    question: "How is tirzepatide different from semaglutide?",
    answer:
      "Tirzepatide activates both GLP-1 and GIP receptors, while semaglutide activates only GLP-1. Clinical studies suggest this dual mechanism may lead to greater weight loss for some patients. Your provider will recommend the best option for your health profile.",
  },
  {
    question: "Which should I choose \u2014 semaglutide or tirzepatide?",
    answer:
      "Your provider will evaluate your health history, goals, and any prior treatment experience to recommend the most appropriate medication. Some patients start with semaglutide and transition to tirzepatide if needed.",
  },
  {
    question: "Why does tirzepatide cost more?",
    answer:
      "Tirzepatide is a newer, more complex molecule to compound. The $379/mo price includes the medication (if prescribed), provider evaluation, meal plans, and ongoing support \u2014 still significantly less than the $1,500+/mo retail price.",
  },
  {
    question: "What are the side effects?",
    answer:
      "Side effects are similar to other GLP-1 medications: mild nausea, decreased appetite, and digestive changes during titration. These typically resolve as your body adjusts. Your provider manages dosing carefully.",
  },
  {
    question: "Is compounded tirzepatide the same as Mounjaro?",
    answer:
      "Compounded tirzepatide contains the same active ingredient as Mounjaro and Zepbound. It is prepared by licensed 503A/503B pharmacies. Compounded medications are not FDA-approved brand-name drugs.",
  },
] as const;

/* ─── PAGE ────────────────────────────────────────────────── */

export default function TirzepatideLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <DrugJsonLd
        name="Compounded Tirzepatide"
        alternateName="Dual GLP-1/GIP Receptor Agonist"
        description="Compounded tirzepatide for weight management"
        url="/lp/tirzepatide"
        administrationRoute="Subcutaneous injection"
      />
      <FAQPageJsonLd faqs={faqs} />
      <MedicalWebPageJsonLd
        name="Tirzepatide Weight Loss Online"
        description="Tirzepatide — dual GLP-1/GIP agonist prescribed online by licensed providers. From $379/mo."
        url="/lp/tirzepatide"
      />

      <LpHeader badgeText="Dual-Action GLP-1/GIP" badgeIcon={Zap} badgeIconColor="text-indigo-500" />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-indigo-50/30 via-cloud to-white py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Badge className="mb-4 bg-indigo-50 text-indigo-700 border-indigo-200">
            <Zap className="mr-1 h-3 w-3" /> Dual-Action GLP-1/GIP Medication
          </Badge>

          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
            Tirzepatide for Weight Loss
            <br />
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              The Next Generation of GLP-1
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-graphite-500">
            Tirzepatide targets two hormone receptors (GLP-1 and GIP) for enhanced
            weight management. Available as a compounded formulation from licensed
            pharmacies.
          </p>

          {/* Price anchor */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-navy-50 px-6 py-2">
            <span className="text-sm text-graphite-400 line-through">$1,349/mo retail</span>
            <span className="text-lg font-bold text-navy">$379/mo</span>
            <span className="rounded-full bg-indigo-500 px-2.5 py-0.5 text-xs font-bold text-white">
              Save 72%
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
                className="rounded-xl border border-indigo-100 bg-white p-3 text-center shadow-sm"
              >
                <p className="text-lg font-bold text-navy">{s.value}</p>
                <p className="text-[10px] text-graphite-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LpSocialProofBar />

      {/* ── How Tirzepatide Works ── */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-2">
            How Tirzepatide Works
          </h2>
          <p className="text-center text-sm text-graphite-500 mb-10">
            The only weight-loss medication that activates two metabolic pathways
            simultaneously.
          </p>
          <div className="grid gap-5 sm:grid-cols-3">
            {mechanismCards.map((c) => (
              <Card key={c.title}>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                    <c.icon className="h-6 w-6 text-indigo-500" />
                  </div>
                  <h3 className="text-sm font-bold text-navy">{c.title}</h3>
                  <p className="mt-2 text-xs text-graphite-500 leading-relaxed">
                    {c.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="bg-navy-50/30 py-14">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-2">
            Tirzepatide vs. Semaglutide
          </h2>
          <p className="text-center text-sm text-graphite-500 mb-8">
            Both are effective GLP-1 medications. Here&apos;s how they compare.
          </p>
          <div className="overflow-hidden rounded-xl border border-navy-100/60 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/60 bg-navy-50/50">
                  <th className="p-4 text-left font-semibold text-navy" />
                  <th className="p-4 text-center font-semibold text-navy">Semaglutide</th>
                  <th className="p-4 text-center font-semibold text-indigo-600">
                    Tirzepatide
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.label}
                    className={
                      i < comparisonRows.length - 1 ? "border-b border-navy-100/40" : ""
                    }
                  >
                    <td className="p-4 font-medium text-navy">{row.label}</td>
                    <td className="p-4 text-center text-graphite-500">{row.semaglutide}</td>
                    <td className="p-4 text-center font-medium text-indigo-600">
                      {row.tirzepatide}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-center text-[10px] text-graphite-400">
            *Based on published clinical trial data. Individual results vary. Your
            provider will recommend the best option for you.
          </p>
        </div>
      </section>

      {/* ── What's Included ── */}
      <section className="py-14">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-8">
            What&apos;s Included
          </h2>
          <div className="space-y-3">
            {includedItems.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl bg-indigo-50/30 p-4"
              >
                <Check className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                <span className="text-sm text-navy">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-navy-50/30 py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-8">
            Real Results with Tirzepatide
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
                    <Badge className="bg-indigo-100 text-indigo-700 text-[10px]">
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

      {/* ── FAQ ── */}
      <LpFaq
        faqs={[...faqs]}
        heading="Tirzepatide FAQs"
        subheading="Common questions about tirzepatide for weight loss."
      />

      {/* ── Final CTA ── */}
      <LpCtaSection headline="Experience the next generation of weight management" />

      <LpFooter />
      <LpConversionWidgets />
    </div>
  );
}
