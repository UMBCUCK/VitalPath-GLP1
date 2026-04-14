import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Star,
  Flame,
  Layers,
  Brain,
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
  FAQPageJsonLd,
  MedicalWebPageJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title:
    "Lose Stubborn Belly Fat | GLP-1 Targets Visceral Fat | Nature's Journey",
  description:
    "Belly fat is hormonally driven — that's why crunches don't work. GLP-1 medication targets visceral fat at the source. Licensed providers. From $279/mo.",
  openGraph: {
    title:
      "Lose Stubborn Belly Fat | GLP-1 Targets Visceral Fat | Nature's Journey",
    description:
      "Belly fat is hormonally driven — that's why crunches don't work. GLP-1 medication targets visceral fat at the source. Licensed providers. From $279/mo.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/belly-fat",
  },
};

const heroStats = [
  { value: "#1", label: "Fat concern" },
  { value: "Hormonal", label: "Solution" },
  { value: "$279/mo", label: "From" },
  { value: "18,000+", label: "Members" },
];

const problemCards = [
  {
    icon: Layers,
    title: "Visceral vs. Subcutaneous",
    description:
      "Belly fat wraps around your organs (visceral fat). It's metabolically active, increases inflammation, and resists traditional fat-loss methods.",
  },
  {
    icon: Brain,
    title: "Hormonal Drivers",
    description:
      "Cortisol, insulin resistance, and declining sex hormones all drive belly fat storage. Sit-ups can't override your hormones.",
  },
  {
    icon: AlertTriangle,
    title: "Health Risk Factor",
    description:
      "Visceral fat is linked to heart disease, type 2 diabetes, and metabolic syndrome. Losing it isn't just cosmetic — it's critical for health.",
  },
];

const solutionCards = [
  {
    title: "Appetite Regulation",
    description:
      "GLP-1 reduces the hunger signals that lead to overeating. Less excess energy means less fat stored in your midsection.",
  },
  {
    title: "Insulin Sensitivity",
    description:
      "By improving how your body processes glucose, GLP-1 helps break the insulin-resistance cycle that drives visceral fat storage.",
  },
  {
    title: "Preferential Fat Loss",
    description:
      "Clinical studies suggest GLP-1 medications may reduce visceral fat more significantly than subcutaneous fat, targeting the most dangerous stores first.",
  },
];

const scienceStats = [
  {
    value: "15-20%",
    label: "Average total body weight loss in clinical studies*",
  },
  {
    value: "Visceral",
    label: "GLP-1 shown to reduce dangerous visceral fat stores*",
  },
  {
    value: "94%",
    label: "Of our members would recommend the program",
  },
];

const testimonials = [
  {
    name: "Mike D.",
    age: 45,
    location: "Chicago",
    lbs: 38,
    months: 5,
    quote:
      "My belly was the last thing to go on every diet. With GLP-1, it was actually the first area I noticed changes.",
  },
  {
    name: "Rachel S.",
    age: 39,
    location: "Atlanta",
    lbs: 31,
    months: 4,
    quote:
      "I finally fit into jeans I'd given up on. The belly fat that survived 3 diet programs is gone.",
  },
  {
    name: "James K.",
    age: 57,
    location: "Portland",
    lbs: 44,
    months: 6,
    quote:
      "My doctor said my visceral fat score dropped from high risk to normal. That's worth more than any number on a scale.",
  },
];

const faqs = [
  {
    question: "Can GLP-1 medication target belly fat specifically?",
    answer:
      "GLP-1 medication promotes overall weight loss, but clinical evidence suggests it may reduce visceral (belly) fat more significantly than subcutaneous fat. Your provider will track your progress including body composition changes.",
  },
  {
    question: "How long until I see results in my midsection?",
    answer:
      "Most members notice changes within 6-8 weeks, though individual timelines vary. Belly fat that's been resistant to diet and exercise may respond differently to GLP-1 because the medication addresses the hormonal drivers.",
  },
  {
    question: "Do I need to exercise too?",
    answer:
      "Exercise supports overall health and can enhance results, but GLP-1 medication works independently of exercise. Your provider and meal plan will include activity recommendations appropriate for your fitness level.",
  },
  {
    question:
      "Why don't crunches and ab workouts work for belly fat?",
    answer:
      "Spot reduction is a myth. Ab exercises strengthen muscles but don't target the visceral fat covering them. Belly fat is driven by hormones (cortisol, insulin) — that's why a hormonal approach like GLP-1 is more effective.",
  },
  {
    question: "Is belly fat actually dangerous?",
    answer:
      "Yes. Visceral belly fat is metabolically active and linked to increased risk of heart disease, type 2 diabetes, and metabolic syndrome. Reducing visceral fat is one of the most impactful things you can do for long-term health.",
  },
];

export default function BellyFatLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="Target Visceral Fat"
        badgeIcon={Flame}
        badgeIconColor="text-orange-500"
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-orange-50/30 via-cloud to-white py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Badge className="mb-4 bg-orange-50 text-orange-700 border-orange-200">
            <Flame className="mr-1 h-3 w-3" /> Targets Stubborn Visceral
            Fat
          </Badge>

          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
            Belly Fat Won&apos;t Budge?
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              GLP-1 Targets It at the Source
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-graphite-500">
            Visceral belly fat is hormonally driven — that&apos;s why
            crunches and calorie counting don&apos;t work. GLP-1
            medication addresses the hormonal root cause.
          </p>

          {/* Price anchor */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-navy-50 px-6 py-2">
            <span className="text-sm text-graphite-400 line-through">
              $1,349/mo retail
            </span>
            <span className="text-lg font-bold text-navy">$279/mo</span>
            <span className="rounded-full bg-orange-500 px-2.5 py-0.5 text-xs font-bold text-white">
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
                className="rounded-xl border border-orange-100 bg-white p-3 text-center shadow-sm"
              >
                <p className="text-lg font-bold text-navy">{s.value}</p>
                <p className="text-[10px] text-graphite-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LpSocialProofBar />

      {/* Why Belly Fat Is Different */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-2">
            Why Belly Fat Is Different
          </h2>
          <p className="text-center text-sm text-graphite-500 mb-10">
            Belly fat isn&apos;t a willpower problem — it&apos;s a
            hormonal one.
          </p>
          <div className="grid gap-5 sm:grid-cols-3">
            {problemCards.map((card) => (
              <Card key={card.title}>
                <CardContent className="p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 mb-3">
                    <card.icon className="h-5 w-5 text-orange-500" />
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

      {/* How GLP-1 Targets Belly Fat */}
      <section className="bg-navy-50/30 py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-2">
            How GLP-1 Targets Belly Fat
          </h2>
          <p className="text-center text-sm text-graphite-500 mb-10">
            A hormonal problem requires a hormonal solution.
          </p>
          <div className="grid gap-5 sm:grid-cols-3">
            {solutionCards.map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-navy-100/60 bg-white p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-50">
                    <Check className="h-3.5 w-3.5 text-teal" />
                  </div>
                  <h3 className="text-sm font-bold text-navy">
                    {card.title}
                  </h3>
                </div>
                <p className="text-xs text-graphite-500 leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Science Is Clear */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-10">
            The Science Is Clear
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {scienceStats.map((stat) => (
              <div
                key={stat.value}
                className="rounded-xl border border-navy-100/60 bg-white p-6 text-center shadow-sm"
              >
                <p className="text-3xl font-bold text-navy">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs text-graphite-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-[10px] text-graphite-400">
            *Based on published clinical trial data for GLP-1 receptor
            agonists. Individual results vary. Compounded medications are
            not FDA-approved.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-navy-50/30 py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-8">
            Members Who Beat Belly Fat
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
                    <Badge className="bg-orange-100 text-orange-700 text-[10px]">
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

      {/* FAQ */}
      <LpFaq
        faqs={faqs}
        heading="Belly Fat & GLP-1: Your Questions"
        subheading="Everything you need to know about targeting visceral fat."
      />

      {/* Final CTA */}
      <LpCtaSection
        headline="Target the fat that matters most"
        bgClassName="bg-gradient-to-r from-orange-50 to-amber-50"
      />

      <LpFooter />

      {/* JSON-LD */}
      <MedicalWebPageJsonLd
        name="GLP-1 for Stubborn Belly Fat"
        description="Belly fat is hormonally driven — GLP-1 medication targets visceral fat at the source. Licensed providers. From $279/mo."
        url="/lp/belly-fat"
      />
      <FAQPageJsonLd faqs={faqs} />
      <LpConversionWidgets />
    </div>
  );
}
