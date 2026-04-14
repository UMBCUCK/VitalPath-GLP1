import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Star,
  FlaskConical,
  Brain,
  Activity,
  TrendingDown,
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
  title: "Semaglutide Weight Loss Online from $279/mo | Nature's Journey",
  description:
    "Get semaglutide prescribed online by board-certified providers. Compounded formulations from licensed pharmacies. Free 2-day shipping. 30-day guarantee.",
  openGraph: {
    title: "Semaglutide Weight Loss Online from $279/mo | Nature's Journey",
    description:
      "Get semaglutide prescribed online by board-certified providers. Compounded formulations from licensed pharmacies. Free 2-day shipping. 30-day guarantee.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/semaglutide",
  },
};

const heroStats = [
  { value: "15-20%", label: "Avg weight loss*" },
  { value: "18,000+", label: "Members served" },
  { value: "$279/mo", label: "All-inclusive" },
  { value: "Free", label: "2-day shipping" },
];

const mechanismCards = [
  {
    icon: Brain,
    title: "Reduces Appetite Signals",
    description:
      "Semaglutide mimics the GLP-1 hormone, helping regulate appetite signals in the brain so you feel satisfied with less food — naturally.",
  },
  {
    icon: Activity,
    title: "Improves Metabolic Function",
    description:
      "Supports improved insulin sensitivity and metabolic signaling, helping your body process glucose more efficiently and reduce fat storage.",
  },
  {
    icon: TrendingDown,
    title: "Sustained Weight Management",
    description:
      "Clinical studies have shown sustained weight management over time when combined with diet and lifestyle changes, under provider guidance.",
  },
];

const includedBenefits = [
  "Licensed provider evaluation and ongoing care",
  "Medication if prescribed by your provider",
  "Personalized meal plans for GLP-1 patients",
  "Progress tracking dashboard and tools",
  "Care team messaging — questions answered within 24 hrs",
  "30-day satisfaction guarantee",
];

const timelinePhases = [
  {
    phase: "Month 1-2",
    title: "Titration",
    description:
      "Your provider starts you on a low dose and gradually increases it. This phased approach minimizes side effects and allows your body to adjust comfortably.",
    color: "bg-teal-100 text-teal-700",
  },
  {
    phase: "Month 3-4",
    title: "Optimization",
    description:
      "You reach your therapeutic dose. Most members begin to see meaningful progress during this phase as appetite regulation and metabolic improvements take full effect.",
    color: "bg-atlantic/10 text-atlantic",
  },
  {
    phase: "Month 5+",
    title: "Maintenance",
    description:
      "Your provider works with you on a long-term plan for sustained results. This may include maintenance dosing, dietary adjustments, or a structured taper.",
    color: "bg-navy-100 text-navy",
  },
];

const testimonials = [
  {
    quote:
      "The gradual dose increase meant almost no side effects. Down 42 lbs in 6 months.",
    name: "Marcus T.",
    age: 48,
    location: "Atlanta",
  },
  {
    quote:
      "My provider adjusts my dose every month based on my progress. It's truly personalized.",
    name: "Angela R.",
    age: 35,
    location: "Denver",
  },
  {
    quote:
      "Semaglutide changed my relationship with food. I'm not constantly thinking about eating anymore.",
    name: "Chris P.",
    age: 52,
    location: "Portland",
  },
];

const faqs = [
  {
    question: "How much weight can I lose with semaglutide?",
    answer:
      "Clinical studies have shown average weight loss of 15-20% of body weight over 68 weeks. Individual results vary based on starting weight, adherence, diet, and other factors. Your provider will set realistic expectations based on your health profile.",
  },
  {
    question: "What are the side effects?",
    answer:
      "The most common side effects are mild and temporary: nausea, decreased appetite, and digestive changes. These typically resolve during the titration period as your body adjusts. Your provider manages dosing to minimize side effects.",
  },
  {
    question: "How long do I need to take it?",
    answer:
      "Treatment duration varies by individual. Many members see significant results within 3-6 months. Your provider will work with you on a long-term plan that may include maintenance dosing or a structured taper.",
  },
  {
    question: "Is semaglutide the same as Ozempic?",
    answer:
      "Semaglutide is the active ingredient in both Ozempic (approved for type 2 diabetes) and Wegovy (approved for weight management). Our compounded semaglutide contains the same active ingredient, prepared by licensed pharmacies.",
  },
  {
    question: "How is it administered?",
    answer:
      "Semaglutide is a once-weekly subcutaneous injection. We provide detailed instructions and your provider is available for questions. Most members find it quick and straightforward.",
  },
];

export default function SemaglutidePage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="Clinically Proven GLP-1"
        badgeIcon={FlaskConical}
        badgeIconColor="text-teal"
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-white py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5">
            <FlaskConical className="h-3.5 w-3.5 text-teal" />
            <span className="text-xs font-semibold text-teal">
              Clinically Proven GLP-1 Medication
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
            Semaglutide for Weight Loss
            <br />
            <span className="bg-gradient-to-r from-teal to-atlantic bg-clip-text text-transparent">
              Prescribed Online, Delivered Free
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-graphite-500">
            The same active ingredient in Wegovy — clinically studied for
            significant weight management. Prescribed by licensed providers
            after medical evaluation.
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
          <p className="mt-3 text-[10px] text-graphite-400">
            *Based on published clinical study data for semaglutide 2.4mg over
            68 weeks. Individual results vary.
          </p>
        </div>
      </section>

      <LpSocialProofBar />

      {/* How Semaglutide Works */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-3">
            How Semaglutide Works
          </h2>
          <p className="text-center text-sm text-graphite-500 mb-10 max-w-2xl mx-auto">
            Semaglutide is a GLP-1 receptor agonist that works with your
            body&apos;s natural systems to support weight management.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {mechanismCards.map((card) => (
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

      {/* What's Included */}
      <section className="bg-navy-50/30 py-14 sm:py-16">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-8">
            What&apos;s Included in Your Membership
          </h2>
          <div className="space-y-3">
            {includedBenefits.map((b) => (
              <div
                key={b}
                className="flex items-start gap-3 rounded-xl bg-white p-4 border border-navy-100/40"
              >
                <Check className="h-5 w-5 text-teal shrink-0 mt-0.5" />
                <span className="text-sm text-navy">{b}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/qualify">
              <Button
                size="xl"
                className="gap-2 px-12 h-14 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                See If I Qualify — Free Assessment
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Treatment Timeline */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-3">
            Your Treatment Timeline
          </h2>
          <p className="text-center text-sm text-graphite-500 mb-10">
            A phased approach designed for sustainable results with minimal side
            effects.
          </p>
          <div className="relative space-y-0">
            {timelinePhases.map((phase, i) => (
              <div key={phase.phase} className="relative flex gap-6">
                {/* Connecting line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${phase.color} font-bold text-sm`}
                  >
                    {i + 1}
                  </div>
                  {i < timelinePhases.length - 1 && (
                    <div className="w-0.5 flex-1 bg-navy-100/40 my-1" />
                  )}
                </div>
                <div className="pb-8">
                  <span
                    className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1 ${phase.color}`}
                  >
                    {phase.phase}
                  </span>
                  <h3 className="text-base font-semibold text-navy mb-1">
                    {phase.title}
                  </h3>
                  <p className="text-sm text-graphite-500 leading-relaxed">
                    {phase.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-[10px] text-graphite-400 mt-4">
            Timelines are approximate. Your provider personalizes your treatment
            plan based on your response and health profile.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-navy-50/30 py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-10">
            Real Members, Real Results
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
                  <div className="text-xs text-graphite-400">{t.location}</div>
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
        subheading="Common questions about semaglutide for weight management."
      />

      {/* Final CTA */}
      <LpCtaSection headline="Start your semaglutide journey today" />

      <LpFooter />

      {/* JSON-LD */}
      <DrugJsonLd
        name="Semaglutide"
        alternateName="GLP-1 Receptor Agonist"
        description="Semaglutide for provider-guided weight management, prescribed online by licensed providers."
        url="/lp/semaglutide"
        administrationRoute="Subcutaneous injection"
      />
      <FAQPageJsonLd faqs={faqs} />
      <MedicalWebPageJsonLd
        name="Semaglutide Weight Loss Online"
        description="Get semaglutide prescribed online by board-certified providers. Compounded formulations from licensed pharmacies."
        url="/lp/semaglutide"
      />
      <LpConversionWidgets />
    </div>
  );
}
