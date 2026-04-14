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
  Sparkles,
  TrendingDown,
  Activity,
  Moon,
  Stethoscope,
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
    "Menopause Weight Loss | GLP-1 for Hormonal Weight Gain | Nature's Journey",
  description:
    "GLP-1 weight loss prescribed by providers who understand menopause. Target hormonal belly fat, manage metabolic slowdown. Board-certified providers. From $279/mo.",
  openGraph: {
    title:
      "Menopause Weight Loss | GLP-1 for Hormonal Weight Gain | Nature's Journey",
    description:
      "GLP-1 weight loss prescribed by providers who understand menopause. Target hormonal belly fat, manage metabolic slowdown. Board-certified providers. From $279/mo.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/menopause",
  },
};

/* ─── DATA ─────────────────────────────────────────────────── */

const heroStats = [
  { value: "3,100+", label: "Menopause members" },
  { value: "4.9/5", label: "Rating" },
  { value: "94%", label: "Recommend" },
  { value: "17%", label: "Avg loss*" },
];

const problemCards = [
  {
    icon: TrendingDown,
    color: "bg-purple-50",
    iconColor: "text-purple-500",
    title: "Estrogen Decline",
    description:
      "As estrogen drops, your body shifts fat storage to your midsection. This visceral fat is hormonally driven and resistant to diet alone.",
  },
  {
    icon: Activity,
    color: "bg-purple-50",
    iconColor: "text-purple-500",
    title: "Metabolic Slowdown",
    description:
      "Menopause can reduce your basal metabolic rate by 200-300 calories per day. You gain weight eating the same foods you always have.",
  },
  {
    icon: Moon,
    color: "bg-purple-50",
    iconColor: "text-purple-500",
    title: "Sleep & Stress Changes",
    description:
      "Hot flashes disrupt sleep. Poor sleep increases cortisol. Elevated cortisol drives belly fat storage. It\u2019s a hormonal cycle.",
  },
];

const solutionCards = [
  {
    title: "Appetite Regulation",
    description:
      "GLP-1 restores appetite signals that menopause disrupts, reducing cravings and overeating without relying on willpower.",
  },
  {
    title: "Visceral Fat Targeting",
    description:
      "GLP-1 medication has been shown to reduce visceral fat \u2014 the dangerous midsection fat that increases during menopause.",
  },
  {
    title: "Metabolic Support",
    description:
      "By improving insulin sensitivity and glucose metabolism, GLP-1 helps compensate for the metabolic slowdown of menopause.",
  },
];

const testimonials = [
  {
    name: "Linda R.",
    age: 52,
    location: "Dallas",
    condition: "Menopause",
    lbs: 34,
    quote:
      "The menopause weight came on fast and nothing worked. Down 34 lbs and my hot flashes improved too.",
  },
  {
    name: "Catherine M.",
    age: 48,
    location: "Boston",
    condition: "Perimenopause",
    lbs: 27,
    quote:
      "My provider understood that this wasn\u2019t about willpower. She adjusted my protocol for my hormone profile.",
  },
  {
    name: "Barbara J.",
    age: 55,
    location: "San Diego",
    condition: "Menopause",
    lbs: 41,
    quote:
      "I\u2019d accepted that menopause meant gaining weight. This proved me wrong. Best decision at 55.",
  },
];

const faqs = [
  {
    question: "Can I take GLP-1 during HRT?",
    answer:
      "Many members use GLP-1 medication alongside hormone replacement therapy. Your provider will evaluate your specific HRT regimen and health profile to ensure safe, effective combination treatment.",
  },
  {
    question: "Is menopause weight different from regular weight?",
    answer:
      "Yes. Menopause weight is largely driven by hormonal changes \u2014 declining estrogen, increased cortisol, and insulin resistance. These biological factors make menopause weight resistant to traditional diet and exercise approaches.",
  },
  {
    question: "How long until I see results?",
    answer:
      "Most members notice reduced appetite within the first 1-2 weeks. Visible weight loss typically begins within 4-6 weeks. Menopause-related belly fat may take slightly longer to respond but typically shows significant improvement by month 3.",
  },
  {
    question: "Will GLP-1 help with other menopause symptoms?",
    answer:
      "While GLP-1 is prescribed for weight management, some members report improvements in energy, sleep quality, and overall well-being as they lose weight. These are secondary benefits, not guaranteed outcomes.",
  },
  {
    question: "What if I\u2019ve already tried everything?",
    answer:
      "Menopause weight is biologically different. If diet, exercise, and other approaches haven\u2019t worked, it\u2019s likely because they don\u2019t address the hormonal root cause. GLP-1 medication works at the level where menopause actually affects your body.",
  },
] as const;

/* ─── PAGE ─────────────────────────────────────────────────── */

export default function MenopauseWeightLossPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="Menopause-Informed Treatment"
        badgeIcon={Sparkles}
        badgeIconColor="text-purple-500"
      />

      {/* ───── Hero ───── */}
      <section className="bg-gradient-to-b from-purple-50/50 via-cloud to-white py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Badge className="mb-6 bg-purple-50 text-purple-700 border-purple-200 gap-1.5 px-4 py-1.5 text-sm">
            <Sparkles className="h-3.5 w-3.5" /> Menopause-Informed Treatment
          </Badge>

          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl xl:text-6xl">
            Menopause Changed Your Body.{" "}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              GLP-1 Can Help Change It Back.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500 leading-relaxed sm:text-xl">
            Estrogen decline causes metabolic slowdown and visceral fat storage.
            GLP-1 medication works at the hormonal level &mdash; where willpower
            cannot reach.
          </p>

          {/* Price anchor */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-navy-50 px-6 py-2.5">
            <span className="text-sm text-graphite-400 line-through">
              $1,349/mo retail
            </span>
            <span className="text-xl font-bold text-navy">$279/mo</span>
            <span className="rounded-full bg-purple-500 px-3 py-0.5 text-xs font-bold text-white">
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
                className="rounded-2xl border border-purple-100 bg-white p-4 text-center shadow-sm"
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

      {/* ───── Why Menopause Makes Weight Loss So Hard ───── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-50 text-purple-700 border-purple-200">
              The Challenge
            </Badge>
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">
              Why Menopause Makes Weight Loss So Hard
            </h2>
            <p className="mt-3 text-sm text-graphite-500 max-w-xl mx-auto">
              It&apos;s not a lack of discipline. It&apos;s a fundamental shift
              in your hormonal biology.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {problemCards.map((card) => (
              <Card key={card.title} className="border-t-2 border-t-purple-200">
                <CardContent className="p-6">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl mb-4 ${card.color}`}>
                    <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                  </div>
                  <h3 className="text-sm font-bold text-navy">{card.title}</h3>
                  <p className="mt-1.5 text-xs text-graphite-500 leading-relaxed">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ───── How GLP-1 Addresses Menopause Weight ───── */}
      <section className="bg-navy-50/30 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-50 text-purple-700 border-purple-200">
              The Solution
            </Badge>
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">
              How GLP-1 Addresses Menopause Weight
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {solutionCards.map((card) => (
              <Card key={card.title} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100">
                      <Check className="h-3.5 w-3.5 text-purple-600" />
                    </div>
                    <h3 className="text-sm font-bold text-navy">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-xs text-graphite-500 leading-relaxed">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Provider Spotlight ───── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-purple-50 text-purple-700 border-purple-200">
              Your Provider
            </Badge>
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">
              Providers Who Understand Menopause
            </h2>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Avatar */}
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white text-xl font-bold">
                  SN
                </div>

                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold text-navy">
                    Dr. Sarah Novak, MD
                  </h3>
                  <p className="text-sm text-graphite-500">
                    Johns Hopkins &middot; 14 years experience
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-1 mt-1">
                    <Stethoscope className="h-3.5 w-3.5 text-purple-500" />
                    <span className="text-xs text-purple-600 font-medium">
                      Women&apos;s Metabolic Health &amp; Menopause
                    </span>
                  </div>

                  <blockquote className="mt-4 text-sm text-graphite-500 leading-relaxed italic border-l-2 border-purple-200 pl-4">
                    &ldquo;Menopause weight management requires understanding the
                    hormonal shifts that drive metabolic change. GLP-1 medication
                    is one of the most effective tools we have because it works
                    at the biological level &mdash; addressing insulin resistance
                    and appetite dysregulation that estrogen decline creates.&rdquo;
                  </blockquote>

                  <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-4">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 text-gold fill-gold"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-graphite-400">
                      4.9/5 (487 reviews)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ───── Testimonials ───── */}
      <section className="bg-purple-50/30 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-50 text-purple-700 border-purple-200">
              Member Stories
            </Badge>
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">
              Women Who Took Back Control
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
      <LpFaq
        faqs={faqs}
        heading="Menopause & GLP-1: Your Questions Answered"
      />

      {/* ───── Final CTA ───── */}
      <LpCtaSection
        headline="Your body changed. Your treatment should too."
        bgClassName="bg-gradient-to-r from-purple-50 to-pink-50"
      />

      {/* ───── Footer ───── */}
      <LpFooter />

      {/* ───── JSON-LD ───── */}
      <MedicalWebPageJsonLd
        name="Menopause Weight Loss | GLP-1 Treatment"
        description="GLP-1 weight loss prescribed by providers who understand menopause. Target hormonal belly fat, manage metabolic slowdown."
        url="/lp/menopause"
        medicalAudience="Patient"
      />
      <MedicalConditionJsonLd
        name="Menopause-Related Weight Gain"
        description="Weight gain associated with hormonal changes during menopause"
        url="/lp/menopause"
        possibleTreatment="GLP-1 Receptor Agonist Therapy"
      />
      <FAQPageJsonLd faqs={faqs} />
      <LpConversionWidgets />
    </div>
  );
}
