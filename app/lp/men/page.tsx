import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ShieldCheck,
  Star,
  ChevronDown,
  Stethoscope,
  Heart,
  Activity,
  Dumbbell,
  Flame,
  Shield,
  Brain,
  Users,
  Clock,
  Truck,
  X,
  Minus,
  Zap,
  TrendingDown,
  ClipboardList,
  Package,
  AlertTriangle,
  Syringe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MobileStickyCta } from "@/components/layout/mobile-sticky-cta";
import dynamic from "next/dynamic";
import { MedicalWebPageJsonLd } from "@/components/seo/json-ld";

const ExitIntentModal = dynamic(
  () => import("@/components/marketing/exit-intent-modal").then((m) => m.ExitIntentModal),
  { loading: () => null }
);
const SocialProofToasts = dynamic(
  () => import("@/components/marketing/social-proof-toasts").then((m) => m.SocialProofToasts),
  { loading: () => null }
);

export const metadata: Metadata = {
  title:
    "GLP-1 Weight Loss for Men | Visceral Fat, Testosterone, Muscle | Nature's Journey",
  description:
    "GLP-1 medication designed for men's biology. Target visceral belly fat, support testosterone levels, preserve muscle mass. Board-certified providers. From $279/mo.",
  openGraph: {
    title: "GLP-1 Weight Loss for Men | Visceral Fat, Testosterone, Muscle",
    description: "Target visceral belly fat, support testosterone levels, preserve muscle mass. Board-certified providers. From $279/mo.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/men",
  },
};

/* ─── DATA ────────────────────────────────────────────────── */

const trustStats = [
  { value: "8,400+", label: "Men enrolled" },
  { value: "4.9/5", label: "Member rating" },
  { value: "22%", label: "Avg body weight lost" },
  { value: "93%", label: "Would recommend" },
];

const problemCards = [
  {
    icon: Flame,
    title: "Visceral Fat Is Killing You Silently",
    body: "Men store fat viscerally — around organs, not under skin. This belly fat is the most dangerous type, directly linked to heart disease, type 2 diabetes, stroke, and shortened lifespan. Diet and exercise alone rarely eliminate it.",
  },
  {
    icon: TrendingDown,
    title: "Testosterone Drops as Weight Climbs",
    body: "Excess weight lowers testosterone 10–15% per decade after 30. Low T causes fatigue, brain fog, muscle loss, and more fat storage — a vicious cycle. GLP-1 medication helps break it by targeting the root cause.",
  },
  {
    icon: Brain,
    title: "Stress & Cortisol Drive Belly Fat",
    body: "High-pressure careers flood your body with cortisol, which signals abdominal fat storage. Willpower cannot override hormonal biology. GLP-1 works at the hormonal level where willpower fails.",
  },
];

const steps = [
  {
    icon: ClipboardList,
    number: "01",
    title: "Complete a 2-minute health assessment",
    body: "Answer questions about your health, goals, and lifestyle from your phone or computer. No appointment needed.",
  },
  {
    icon: Stethoscope,
    number: "02",
    title: "Get evaluated by a licensed provider",
    body: "A board-certified physician reviews your profile within 1 business day and determines if GLP-1 treatment is right for you.",
  },
  {
    icon: Package,
    number: "03",
    title: "Your treatment ships to your door",
    body: "If prescribed, your medication ships free with 2-day delivery in discreet, temperature-controlled packaging.",
  },
];

const menBenefits = [
  {
    icon: Flame,
    title: "Visceral Fat Reduction",
    description:
      "GLP-1 medication preferentially targets visceral belly fat — the type wrapping your organs that drives heart disease, diabetes, and metabolic syndrome in men.",
  },
  {
    icon: Heart,
    title: "Cardiovascular Protection",
    description:
      "Clinical studies show GLP-1 reduces blood pressure, LDL cholesterol, and inflammatory markers. Members see an average 12-point systolic BP improvement.",
  },
  {
    icon: Activity,
    title: "Testosterone Support",
    description:
      "Losing visceral fat naturally increases free testosterone. Members report improved energy, focus, and vitality within the first 8 weeks of treatment.",
  },
  {
    icon: Dumbbell,
    title: "Muscle Preservation",
    description:
      "Protein-optimized meal plans and strength guidance preserve lean muscle mass — critical for maintaining a strong metabolism during weight loss.",
  },
  {
    icon: Zap,
    title: "Energy & Performance",
    description:
      "Reduced inflammation, better sleep, and improved metabolic function. Members report sustained energy throughout the day — not just post-coffee.",
  },
  {
    icon: Brain,
    title: "Mental Clarity",
    description:
      "Reduced brain fog, sharper focus, better sleep quality. Weight loss through GLP-1 has downstream cognitive benefits that compound over time.",
  },
];

const doseSchedule = [
  { weeks: "Weeks 1–4", dose: "0.25 mg", note: "Adjustment period" },
  { weeks: "Weeks 5–8", dose: "0.5 mg", note: "Building efficacy" },
  { weeks: "Weeks 9–12", dose: "1.0 mg", note: "Therapeutic range" },
  { weeks: "Week 13+", dose: "Up to 2.4 mg", note: "Provider-guided" },
];

const comparisonRows = [
  {
    feature: "Monthly cost",
    nj: "$279/mo",
    brand: "$1,349+/mo",
    competitor: "$399–599/mo",
  },
  {
    feature: "Provider evaluation",
    nj: "Included",
    brand: "Separate ($300+)",
    competitor: "Included",
  },
  {
    feature: "Meal plans & nutrition",
    nj: "Included",
    brand: "Not included",
    competitor: "Basic only",
  },
  {
    feature: "Ongoing care team",
    nj: "Included",
    brand: "Not included",
    competitor: "Email only",
  },
  {
    feature: "Free 2-day shipping",
    njCheck: true,
    brandX: true,
    competitorMinus: true,
  },
  {
    feature: "Muscle preservation plan",
    njCheck: true,
    brandX: true,
    competitorX: true,
  },
  {
    feature: "Men's-specific protocols",
    njCheck: true,
    brandX: true,
    competitorX: true,
  },
  {
    feature: "Cancel anytime",
    njCheck: true,
    brandNA: true,
    competitorMinus: true,
  },
  {
    feature: "Money-back guarantee",
    nj: "30 days",
    brand: "No",
    competitor: "Varies",
  },
];

const testimonials = [
  {
    name: "Marcus D.",
    age: 41,
    lbs: 39,
    months: 5,
    location: "Atlanta, GA",
    quote:
      "I'd tried every diet for 10 years. Down 39 lbs and my blood pressure is normal for the first time since my 20s. My doctor is genuinely impressed.",
  },
  {
    name: "David R.",
    age: 52,
    lbs: 47,
    months: 7,
    location: "Denver, CO",
    quote:
      "At 52, I expected to feel tired forever. I have more energy than I did at 35. My wife says I look 10 years younger. The meal plans made it easy.",
  },
  {
    name: "Chris T.",
    age: 36,
    lbs: 31,
    months: 4,
    location: "Austin, TX",
    quote:
      "The belly fat was the first to go. My confidence at work, in the gym — everything changed. Wish I'd started sooner.",
  },
];

const resultStats = [
  { value: "22%", label: "Average body weight lost" },
  { value: '8.3"', label: "Average waist reduction" },
  { value: "94%", label: "Report increased energy" },
  { value: "87%", label: "See improved blood pressure" },
];

const faqs = [
  {
    q: "Is GLP-1 medication safe for men?",
    a: "Yes. Semaglutide is FDA-approved for weight management in adults. In clinical trials, men tolerated the medication well. Common side effects like mild nausea typically resolve within the first 1–2 weeks as your body adjusts. Your provider monitors you throughout treatment.",
  },
  {
    q: "Will this affect my testosterone levels?",
    a: "Positively. Visceral fat actively converts testosterone to estrogen. By reducing visceral fat, GLP-1 treatment typically increases free testosterone levels. Many male members report improved energy, mood, and libido as they lose weight.",
  },
  {
    q: "Can I still work out and build muscle?",
    a: "Absolutely — strength training is encouraged. Our protein-optimized meal plans are designed to preserve and build lean muscle mass during weight loss. Many members find they perform better in the gym as they lose visceral fat and inflammation decreases.",
  },
  {
    q: "How fast will I see results?",
    a: "Most men notice reduced appetite within the first week. Visible changes typically appear by month 2. Significant, measurable results — including waist reduction and improved blood markers — usually occur by months 4–6. Individual timelines vary.",
  },
  {
    q: "What if I'm on blood pressure or cholesterol medication?",
    a: "Your provider evaluates all current medications before prescribing. GLP-1 treatment often improves cardiovascular markers. Many members, under provider guidance, are able to reduce their blood pressure or statin medications over time.",
  },
  {
    q: "Is this the same as Ozempic?",
    a: "Our compounded medication contains semaglutide — the same active ingredient as Ozempic and Wegovy. It is prepared by state-licensed 503A/503B pharmacies. Compounded medications are not FDA-approved drug products and are not the same as brand-name medications.",
  },
  {
    q: "Can I drink alcohol on GLP-1?",
    a: "Moderate alcohol consumption is typically fine. Most men find they naturally drink less due to appetite and craving changes. Your provider can discuss specific guidance based on your health profile.",
  },
  {
    q: "What happens when I stop the medication?",
    a: "Maintenance transition planning is included in your program. Throughout treatment, you build sustainable nutrition and lifestyle habits. Your provider works with you on a gradual tapering strategy when you're ready, to help maintain your results long-term.",
  },
];

const commonSideEffects = [
  { effect: "Mild nausea", note: "Usually first 1–2 weeks only" },
  { effect: "Reduced appetite", note: "This is the mechanism working" },
  { effect: "Mild digestive changes", note: "Temporary during adjustment" },
  { effect: "Fatigue", note: "Brief adjustment period" },
];

const mitigations = [
  { action: "Gradual dose escalation", detail: "Start low, increase slowly" },
  {
    action: "Monthly provider check-ins",
    detail: "Continuous monitoring",
  },
  { action: "Dose adjustments as needed", detail: "Personalized to you" },
  { action: "Care team messaging", detail: "Reach us anytime" },
];

/* ─── HELPERS ─────────────────────────────────────────────── */

function ComparisonIcon({
  type,
}: {
  type: "check" | "x" | "minus" | "na";
}) {
  if (type === "check")
    return <Check className="mx-auto h-4 w-4 text-teal" />;
  if (type === "x") return <X className="mx-auto h-4 w-4 text-red-400" />;
  if (type === "minus")
    return <Minus className="mx-auto h-4 w-4 text-graphite-300" />;
  return <span className="text-xs text-graphite-400">N/A</span>;
}

/* ─── PAGE ────────────────────────────────────────────────── */

export default function MenLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── 1. STICKY HEADER ─────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-navy-100/40 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal to-atlantic">
              <span className="text-xs font-bold text-white">NJ</span>
            </div>
            <span className="text-sm font-bold text-navy">
              Nature&apos;s Journey
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:18885092745"
              className="hidden items-center gap-1.5 text-xs font-medium text-graphite-500 transition-colors hover:text-navy sm:flex"
            >
              (888) 509-2745
            </a>
            <Badge variant="outline" className="gap-1 text-xs">
              <Shield className="h-3 w-3 text-teal" /> Men&apos;s Health
            </Badge>
            <div className="flex items-center gap-1.5 text-xs text-graphite-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span className="hidden sm:inline">HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── 2. HERO ──────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-navy-50 via-cloud to-white py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Badge className="mb-4 border-navy-200 bg-navy-100 text-navy">
            <Shield className="mr-1 h-3 w-3" /> Built for Men&apos;s Biology
          </Badge>

          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
            Lose the Gut. Keep the Muscle.
            <br />
            <span className="bg-gradient-to-r from-teal to-atlantic bg-clip-text text-transparent">
              GLP-1 Weight Loss for Men
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-graphite-500">
            Men carry weight differently — and lose it differently. GLP-1
            medication targets visceral belly fat, supports testosterone levels,
            and preserves lean muscle. Prescribed by providers who understand
            men&apos;s metabolic health.
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
                className="h-16 gap-2 rounded-2xl px-12 text-lg shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
              >
                See If I Qualify — Free Assessment
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <p className="mt-3 text-xs text-graphite-400">
              Takes 2 minutes &middot; No commitment &middot; HIPAA protected
            </p>
          </div>

          {/* Trust stats */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {trustStats.map((stat) => (
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

      {/* ── 3. SOCIAL PROOF BAR ──────────────────────────── */}
      <section className="border-y border-navy-100/40 bg-navy-50/30 py-3">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 px-4 text-xs text-graphite-500">
          <span className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
            Rated 4.9/5 by 1,800+ male members
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-teal" />
            87 men started this week
          </span>
          <span className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-navy" />
            Free 2-day discreet shipping
          </span>
        </div>
      </section>

      {/* ── 4. THE PROBLEM — WHY MEN STRUGGLE DIFFERENTLY ─ */}
      <section className="bg-navy py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">
            Why Men&apos;s Weight Loss Is Different
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-teal-200">
            Biology, not willpower, is the problem. Here&apos;s what&apos;s
            working against you — and why GLP-1 changes the equation.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {problemCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal/20">
                  <card.icon className="h-6 w-6 text-teal-300" />
                </div>
                <h3 className="font-semibold text-white">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite-300">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. HOW IT WORKS ──────────────────────────────── */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center text-2xl font-bold text-navy sm:text-3xl">
            How it works
          </h2>
          <p className="mt-3 text-center text-sm text-graphite-500">
            Three steps. No office visits. No waiting rooms.
          </p>

          <div className="mt-10 space-y-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex items-start gap-5 rounded-2xl border border-navy-100/40 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-teal/20 bg-gradient-to-br from-teal/10 to-atlantic/10">
                  <step.icon className="h-5 w-5 text-teal" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-graphite-300">
                    Step {step.number}
                  </p>
                  <h3 className="mt-0.5 font-semibold text-navy">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-graphite-500">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. MEN-SPECIFIC BENEFITS ─────────────────────── */}
      <section className="bg-linen/40 py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-2 text-center text-2xl font-bold text-navy">
            Built for the Male Body
          </h2>
          <p className="mb-10 text-center text-sm text-graphite-500">
            Your biology is different. Your treatment should be too.
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {menBenefits.map((b) => (
              <Card key={b.title}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-50">
                      <b.icon className="h-5 w-5 text-teal" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-navy">{b.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-graphite-500">
                        {b.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. MEDICATION INFO ───────────────────────────── */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold text-navy">
            How GLP-1 Medication Works
          </h2>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left — mechanism */}
            <div>
              <p className="mb-5 text-sm leading-relaxed text-graphite-500">
                GLP-1 (glucagon-like peptide-1) is a naturally occurring hormone
                that regulates appetite and blood sugar. Our compounded
                semaglutide medication amplifies this signal, helping you feel
                satisfied with less food while your body burns stored visceral
                fat.
              </p>
              <div className="space-y-3">
                {[
                  {
                    icon: Syringe,
                    text: "Same active ingredient as Ozempic & Wegovy (semaglutide)",
                  },
                  {
                    icon: Clock,
                    text: "Once-weekly self-injection — takes under 30 seconds",
                  },
                  {
                    icon: Activity,
                    text: "Gradual dose escalation minimizes side effects",
                  },
                  {
                    icon: Truck,
                    text: "Temperature-controlled shipping from licensed pharmacies",
                  },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50">
                      <item.icon className="h-4 w-4 text-teal" />
                    </div>
                    <span className="text-sm text-navy">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — dose schedule */}
            <div className="rounded-2xl border border-navy-100/40 bg-navy-50/30 p-6">
              <h3 className="mb-4 text-sm font-bold text-navy">
                Typical Dose Escalation Schedule
              </h3>
              <div className="space-y-3">
                {doseSchedule.map((d, i) => (
                  <div
                    key={d.weeks}
                    className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal to-atlantic text-xs font-bold text-white">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-navy">
                        {d.weeks}
                      </p>
                      <p className="text-[10px] text-graphite-400">{d.note}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {d.dose}
                    </Badge>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[10px] text-graphite-400">
                Dosing is individualized by your provider based on your response
                and tolerability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. COST COMPARISON TABLE ─────────────────────── */}
      <section className="bg-navy-50/30 py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-2 text-center text-2xl font-bold text-navy">
            How We Compare
          </h2>
          <p className="mb-8 text-center text-sm text-graphite-500">
            All-inclusive pricing. No hidden fees. No surprises.
          </p>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-navy-100/40 bg-white shadow-sm md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40 bg-navy-50/50">
                  <th className="px-5 py-4 text-left font-semibold text-navy">
                    Feature
                  </th>
                  <th className="px-5 py-4 text-center font-semibold text-teal">
                    Nature&apos;s Journey
                  </th>
                  <th className="px-5 py-4 text-center font-semibold text-graphite-400">
                    Brand-Name GLP-1
                  </th>
                  <th className="px-5 py-4 text-center font-semibold text-graphite-400">
                    Other Telehealth
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={
                      i % 2 === 0 ? "bg-white" : "bg-navy-50/20"
                    }
                  >
                    <td className="px-5 py-3 font-medium text-navy">
                      {row.feature}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {row.nj ? (
                        <span className="font-semibold text-teal">
                          {row.nj}
                        </span>
                      ) : row.njCheck ? (
                        <ComparisonIcon type="check" />
                      ) : null}
                    </td>
                    <td className="px-5 py-3 text-center text-graphite-500">
                      {row.brand ? (
                        row.brand
                      ) : row.brandX ? (
                        <ComparisonIcon type="x" />
                      ) : row.brandNA ? (
                        <ComparisonIcon type="na" />
                      ) : null}
                    </td>
                    <td className="px-5 py-3 text-center text-graphite-500">
                      {row.competitor ? (
                        row.competitor
                      ) : row.competitorX ? (
                        <ComparisonIcon type="x" />
                      ) : row.competitorMinus ? (
                        <ComparisonIcon type="minus" />
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-4 md:hidden">
            {comparisonRows.map((row) => (
              <div
                key={row.feature}
                className="rounded-xl border border-navy-100/40 bg-white p-4"
              >
                <p className="mb-2 text-xs font-semibold text-graphite-400">
                  {row.feature}
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg bg-teal-50 p-2 text-center">
                    <p className="text-[10px] text-teal-600">
                      Nature&apos;s Journey
                    </p>
                    <p className="font-semibold text-teal">
                      {row.nj ||
                        (row.njCheck ? (
                          <Check className="mx-auto h-4 w-4" />
                        ) : (
                          "—"
                        ))}
                    </p>
                  </div>
                  <div className="rounded-lg bg-graphite-50 p-2 text-center">
                    <p className="text-[10px] text-graphite-400">Brand-Name</p>
                    <p className="text-graphite-500">
                      {row.brand ||
                        (row.brandX ? (
                          <X className="mx-auto h-4 w-4 text-red-400" />
                        ) : row.brandNA ? (
                          "N/A"
                        ) : (
                          "—"
                        ))}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Savings banner */}
          <div className="mt-8 rounded-2xl bg-gradient-to-r from-teal to-atlantic p-6 text-center text-white">
            <p className="text-lg font-bold">
              Save up to $12,840/year vs. brand-name retail
            </p>
            <p className="mt-1 text-sm text-teal-100">
              Same active ingredient. Licensed providers. Fraction of the cost.
            </p>
          </div>

          <p className="mt-4 text-center text-[10px] text-graphite-400">
            Brand-name retail price based on published U.S. cash-pay pricing as
            of 2025. Compounded medications are not FDA-approved drug products.
          </p>
        </div>
      </section>

      {/* ── 9. PROVIDER SECTION ──────────────────────────── */}
      <section className="py-14">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="mb-8 text-2xl font-bold text-navy">
            Your Provider Understands Men&apos;s Health
          </h2>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-navy to-atlantic text-xl font-bold text-white">
            JW
          </div>
          <h3 className="text-lg font-bold text-navy">
            Dr. James Walker, DO
          </h3>
          <p className="text-sm text-graphite-500">
            Johns Hopkins University &middot; Board-Certified Family Medicine
            &middot; 14 years experience
          </p>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-graphite-600">
            &ldquo;Men&apos;s weight management requires understanding visceral
            fat distribution, testosterone dynamics, and cardiovascular risk.
            GLP-1 medication is remarkably effective when the protocol accounts
            for these factors — and that&apos;s what we specialize
            in.&rdquo;
          </p>
          <div className="mt-3 flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-4 w-4 fill-gold text-gold" />
            ))}
            <span className="ml-1 text-xs text-graphite-400">
              4.9/5 (847 reviews)
            </span>
          </div>
          <p className="mt-4 text-xs text-graphite-400">
            All providers licensed in all 50 states &middot;{" "}
            <Link
              href="/providers"
              className="text-teal hover:underline"
            >
              View full credentials &rarr;
            </Link>
          </p>
        </div>
      </section>

      {/* ── 10. TESTIMONIALS ─────────────────────────────── */}
      <section className="bg-linen/40 py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold text-navy">
            Real Men, Real Results
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <CardContent className="p-5">
                  <div className="mb-2 flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-gold text-gold"
                      />
                    ))}
                  </div>
                  <p className="text-xs italic leading-relaxed text-graphite-600">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-navy">
                        {t.name}, {t.age}
                      </p>
                      <p className="text-[10px] text-graphite-400">
                        {t.location}
                      </p>
                    </div>
                    <Badge className="bg-teal text-[10px] text-white">
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

      {/* ── 11. RESULTS STATS ────────────────────────────── */}
      <section className="bg-gradient-to-r from-navy to-atlantic py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-center text-xl font-bold text-white">
            Average Results for Male Members
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {resultStats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-white/10 bg-white/10 p-4 text-center backdrop-blur-sm"
              >
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <p className="mt-1 text-xs text-teal-200">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-[10px] text-teal-300/60">
            Based on male members completing 6+ months of treatment. Individual
            results vary.
          </p>
        </div>
      </section>

      {/* ── 12. FAQ ACCORDION ────────────────────────────── */}
      <section className="py-14">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold text-navy">
            Questions Men Ask Most
          </h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-navy-100/40 bg-white shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-navy">
                  {faq.q}
                  <ChevronDown className="h-4 w-4 shrink-0 text-graphite-400 transition-transform group-open:rotate-180" />
                </summary>
                <div className="border-t border-navy-100/30 px-5 py-4">
                  <p className="text-sm leading-relaxed text-graphite-600">
                    {faq.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 13. SAFETY & SIDE EFFECTS ────────────────────── */}
      <section className="bg-linen/40 py-14">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-2 text-center text-2xl font-bold text-navy">
            Side Effects &amp; Safety
          </h2>
          <p className="mb-8 text-center text-sm text-graphite-500">
            We believe in full transparency. Here&apos;s what to expect.
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Common side effects */}
            <div className="rounded-2xl border border-navy-100/40 bg-white p-6">
              <h3 className="mb-4 text-sm font-bold text-navy">
                Common side effects
              </h3>
              <p className="mb-4 text-xs text-graphite-400">
                Mild and typically temporary during the adjustment period.
              </p>
              <div className="space-y-3">
                {commonSideEffects.map((s) => (
                  <div
                    key={s.effect}
                    className="flex items-start gap-3 rounded-lg bg-navy-50/30 p-3"
                  >
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-navy">
                        {s.effect}
                      </p>
                      <p className="text-xs text-graphite-400">{s.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mitigations */}
            <div className="rounded-2xl border border-navy-100/40 bg-white p-6">
              <h3 className="mb-4 text-sm font-bold text-navy">
                How we minimize them
              </h3>
              <p className="mb-4 text-xs text-graphite-400">
                Your provider actively manages your experience.
              </p>
              <div className="space-y-3">
                {mitigations.map((m) => (
                  <div
                    key={m.action}
                    className="flex items-start gap-3 rounded-lg bg-teal-50/30 p-3"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                    <div>
                      <p className="text-sm font-medium text-navy">
                        {m.action}
                      </p>
                      <p className="text-xs text-graphite-400">{m.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Serious side effects callout */}
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
            <p className="text-xs font-semibold text-amber-800">
              Important safety information
            </p>
            <p className="mt-1 text-xs leading-relaxed text-amber-700">
              Serious side effects are rare. Your provider reviews your full
              medical history before prescribing. Contraindications include
              personal or family history of medullary thyroid carcinoma or
              Multiple Endocrine Neoplasia syndrome type 2 (MEN2). Do not use if
              you have a known hypersensitivity to semaglutide.
            </p>
          </div>
        </div>
      </section>

      {/* ── 14. FINAL CTA ────────────────────────────────── */}
      <section className="bg-gradient-to-r from-navy-50 to-atlantic-50 py-14">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h2 className="text-2xl font-bold text-navy">
            Take back control of your health
          </h2>
          <p className="mt-3 text-sm text-graphite-500">
            Free 2-minute assessment. Provider reviews typically within 1
            business day. Medication ships free if prescribed.
          </p>
          <div className="mt-6">
            <Link href="/qualify">
              <Button size="xl" className="h-14 gap-2 px-12 text-lg">
                See If I Qualify <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-graphite-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> 30-day
              money-back guarantee
            </span>
            <span className="flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-teal" /> No commitment
              required
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-teal" /> Same-day evaluation
              available
            </span>
          </div>
        </div>
      </section>

      {/* ── 15. STICKY MOBILE CTA ────────────────────────── */}
      <MobileStickyCta />

      {/* ── 16. FOOTER ───────────────────────────────────── */}
      <footer className="border-t border-navy-100/40 py-8">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-[11px] leading-relaxed text-graphite-400">
            Nature&apos;s Journey Health facilitates access to independently
            licensed healthcare providers and does not practice medicine.
            Treatment eligibility is determined solely by a licensed provider
            based on a clinical evaluation. Prescription treatment is not
            guaranteed. Individual results vary.
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-graphite-400">
            Compounded medications dispensed through licensed 503A/503B
            pharmacies are{" "}
            <strong>not FDA-approved drug products</strong> and are not the same
            as brand-name medications. Prescriptions are issued only when
            clinically appropriate.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] text-graphite-400">
            <Link
              href="/legal/terms"
              className="transition-colors hover:text-navy"
            >
              Terms
            </Link>
            <span>&middot;</span>
            <Link
              href="/legal/privacy"
              className="transition-colors hover:text-navy"
            >
              Privacy
            </Link>
            <span>&middot;</span>
            <Link
              href="/legal/hipaa"
              className="transition-colors hover:text-navy"
            >
              HIPAA Notice
            </Link>
            <span>&middot;</span>
            <Link
              href="/providers"
              className="transition-colors hover:text-navy"
            >
              Provider Credentials
            </Link>
          </div>
          <p className="mt-3 text-[10px] text-graphite-300">
            &copy; {new Date().getFullYear()} Nature&apos;s Journey Health, LLC.
            1209 Orange St, Wilmington, DE 19801. All rights reserved.
          </p>
        </div>
      </footer>

      <MedicalWebPageJsonLd name="GLP-1 Weight Loss for Men" description="GLP-1 medication designed for men's biology. Target visceral fat, support testosterone, preserve muscle." url="/lp/men" />
      <ExitIntentModal />
      <SocialProofToasts />
    </div>
  );
}
