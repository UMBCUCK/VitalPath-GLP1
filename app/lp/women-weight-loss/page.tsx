import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, Check, ShieldCheck, Star, Heart, Sparkles, Users, Clock,
  Brain, Stethoscope, Package, Truck, ClipboardList, Phone, ChevronRight,
  X, Zap, TrendingDown, DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { LpConversionWidgets } from "@/components/lp/lp-conversion-widgets";
import { MedicalWebPageJsonLd } from "@/components/seo/json-ld";
import {
  AnimatedCounter,
  WomenWeeklyStarters,
  WomenFaqAccordion,
  WomenPricingSection,
  TrackedCta,
} from "./client-sections";

export const metadata: Metadata = {
  title: "Women's Weight Loss | GLP-1 for PCOS, Perimenopause & Hormonal Weight | Nature's Journey",
  description:
    "Clinically guided GLP-1 weight loss designed for women's biology. Specialized protocols for PCOS, perimenopause, thyroid conditions, and hormonal weight gain. From $279/mo. Board-certified providers. HIPAA compliant.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Women's Weight Loss | GLP-1 for PCOS, Perimenopause & Hormonal Weight",
    description: "GLP-1 medication prescribed by providers who specialize in women's hormonal health. PCOS, perimenopause, thyroid-aware protocols. From $279/mo.",
    type: "website",
  },
  alternates: {
    canonical: "/lp/women-weight-loss",
  },
};

/* ─── DATA ─────────────────────────────────────────────────── */

const heroStats = [
  { value: "6,200+", label: "Women members" },
  { value: "4.9", label: "Average rating", suffix: "/5" },
  { value: "94%", label: "Would recommend" },
  { value: "18%", label: "Avg body weight loss*" },
];

const problems = [
  {
    icon: Heart,
    title: "PCOS Makes Weight Loss Feel Impossible",
    description: "Insulin resistance and elevated androgens create a metabolic wall. 1 in 10 women have PCOS, and standard diets completely ignore the hormonal component.",
  },
  {
    icon: Sparkles,
    title: "Perimenopause Changed Everything",
    description: "Estrogen decline after 40 slows your metabolism and increases visceral fat storage. The weight appeared — and nothing you've tried makes it leave.",
  },
  {
    icon: ShieldCheck,
    title: "Your Thyroid May Be Working Against You",
    description: "Hypothyroidism affects 1 in 8 women, causing fatigue, brain fog, and unexplained weight gain that's often dismissed by doctors as 'just eat less.'",
  },
  {
    icon: Brain,
    title: "You've Tried Everything. It's Not Willpower.",
    description: "The average woman spends $2,000+/year on diets, supplements, and gym memberships with a 95% long-term failure rate. The problem is biological, not behavioral.",
  },
];

const solutionPoints = [
  {
    title: "Reduces appetite at the hormonal level",
    description: "GLP-1 mimics a natural satiety hormone, reducing cravings and hunger signals that are amplified by PCOS, perimenopause, and thyroid conditions.",
  },
  {
    title: "Addresses insulin resistance directly",
    description: "Particularly effective for women with PCOS-related insulin resistance — the root cause of hormonal weight gain that diets can't touch.",
  },
  {
    title: "Works even when metabolism has slowed",
    description: "Perimenopause can drop your metabolic rate by 200-300 calories/day. GLP-1 medication works independently of metabolic rate.",
  },
  {
    title: "Sustained results with provider support",
    description: "Monthly check-ins, dose adjustments, and ongoing clinical guidance ensure your treatment evolves with your body.",
  },
];

const processSteps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Complete a 2-minute health assessment",
    description: "Answer questions about your health history, hormonal conditions, current medications, and weight loss goals. Includes PCOS, perimenopause, and thyroid screening.",
    time: "2 minutes",
  },
  {
    icon: Stethoscope,
    step: "02",
    title: "A women's health provider reviews your profile",
    description: "A board-certified provider who specializes in women's metabolic health evaluates your assessment and determines eligibility for GLP-1 treatment.",
    time: "Within 24 hours",
  },
  {
    icon: Package,
    step: "03",
    title: "Your personalized treatment ships to your door",
    description: "If prescribed, your medication ships free with 2-day delivery in discreet, temperature-controlled packaging. Your care team is available from day one.",
    time: "Free 2-day delivery",
  },
];

const membershipIncludes = [
  "Licensed provider evaluation — no separate consult fee",
  "PCOS, perimenopause, and thyroid screening included",
  "Ongoing provider access with monthly check-ins",
  "Personalized meal plans optimized for hormonal health",
  "Progress tracking with dose adjustments as needed",
  "HIPAA-compliant secure messaging with your care team",
  "Free 2-day discreet shipping on every order",
  "Cancel, pause, or adjust your plan anytime — no contracts",
  "30-day satisfaction guarantee",
];

const clinicalStats = [
  { value: "15-20%", label: "Average body weight lost", detail: "25-50 lbs for most women*" },
  { value: "87%", label: "Lost significant weight", detail: "On 6+ month protocols*" },
  { value: "72%", label: "Reduction in food cravings", detail: "Reported by participants*" },
  { value: "3x", label: "More effective than diet alone", detail: "In clinical trials*" },
];

const providers = [
  {
    initials: "PN",
    name: "Dr. Priya Nair, MD",
    credential: "UCLA School of Medicine",
    experience: "11 years experience",
    specialty: "Women's Metabolic Health",
    rating: 4.8,
    reviews: 612,
    quote: "Women's weight management requires understanding the hormonal landscape — PCOS, perimenopause, thyroid function. GLP-1 medication is remarkably effective when the protocol accounts for these factors.",
    featured: true,
  },
  {
    initials: "SC",
    name: "Dr. Sarah Chen, MD",
    credential: "Johns Hopkins",
    experience: "15 years experience",
    specialty: "Endocrinology & Obesity Medicine",
    rating: 4.9,
    reviews: 847,
    quote: "Every woman's metabolic profile is different. Personalized dosing and hormonal awareness are what separate effective treatment from generic prescriptions.",
    featured: false,
  },
  {
    initials: "MR",
    name: "Dr. Maria Rodriguez, DO",
    credential: "Stanford Medicine",
    experience: "9 years experience",
    specialty: "Women's Health & Nutrition",
    rating: 4.7,
    reviews: 438,
    quote: "The combination of GLP-1 medication with nutrition guidance designed for women's hormonal health is what drives lasting results.",
    featured: false,
  },
];

const testimonials = [
  { name: "Rachel K.", age: 38, location: "Dallas, TX", condition: "PCOS", lbs: 34, months: 5, rating: 5, quote: "After years of being told to 'just eat less,' finally a treatment that works with my PCOS — not against it. My provider actually understood insulin resistance." },
  { name: "Lisa M.", age: 47, location: "Portland, OR", condition: "Perimenopause", lbs: 28, months: 4, rating: 5, quote: "Perimenopause weight was the last straw. Down 28 lbs and sleeping better too. My provider adjusts my dose every month based on how I'm feeling." },
  { name: "Priya S.", age: 33, location: "Chicago, IL", condition: "Hormonal", lbs: 42, months: 6, rating: 5, quote: "My provider understood that my weight wasn't about willpower. The meal plans designed for hormonal health were a game-changer." },
  { name: "Amanda R.", age: 52, location: "Phoenix, AZ", condition: "Menopausal", lbs: 31, months: 5, rating: 5, quote: "At 52, I'd given up. My doctor here actually screens for thyroid issues and adjusts for menopause. I feel like myself again." },
  { name: "Nicole M.", age: 41, location: "Atlanta, GA", condition: "Thyroid", lbs: 25, months: 4, rating: 5, quote: "With Hashimoto's, my endocrinologist said weight loss would be 'very difficult.' Proven wrong. The thyroid-aware protocol made the difference." },
  { name: "Jessica T.", age: 36, location: "Denver, CO", condition: "PCOS", lbs: 38, months: 5, rating: 5, quote: "PCOS + birth control made me gain 40 lbs over 3 years. Down 38 lbs now. My A1C and testosterone levels have improved too." },
];

const comparisonRows = [
  { feature: "Monthly cost", nj: "$279", forhers: "$398+", noom: "$59", ww: "$23", clinic: "$500+" },
  { feature: "GLP-1 medication included", nj: true, forhers: true, noom: false, ww: false, clinic: true },
  { feature: "Women's health protocols", nj: true, forhers: false, noom: false, ww: false, clinic: "varies" },
  { feature: "PCOS/perimenopause screening", nj: true, forhers: false, noom: false, ww: false, clinic: "varies" },
  { feature: "Provider evaluation included", nj: true, forhers: "separate", noom: false, ww: false, clinic: true },
  { feature: "Personalized meal plans", nj: true, forhers: false, noom: "generic", ww: "generic", clinic: "sometimes" },
  { feature: "Cancel anytime", nj: true, forhers: true, noom: true, ww: true, clinic: false },
];

const faqs = [
  {
    question: "Is GLP-1 medication safe for women with PCOS?",
    answer: "GLP-1 medication has shown promising results for women with PCOS. It addresses insulin resistance — a core driver of PCOS-related weight gain — while helping reduce appetite. Your provider will evaluate your specific PCOS profile, current medications, and health history to determine if GLP-1 treatment is appropriate for you. Individual results vary.",
  },
  {
    question: "Can I take GLP-1 medication during perimenopause?",
    answer: "Many women in perimenopause are candidates for GLP-1 treatment. Our providers are trained to account for hormonal changes, metabolic shifts, and other perimenopause symptoms when creating your treatment plan. They'll adjust dosing and monitoring based on your specific needs. Eligibility is determined by your provider.",
  },
  {
    question: "Will GLP-1 interact with my thyroid medication?",
    answer: "Your provider will review all current medications, including thyroid prescriptions like levothyroxine, before determining treatment eligibility. GLP-1 medications can affect gastric emptying, which may influence thyroid medication absorption. Your provider will advise on any timing adjustments needed.",
  },
  {
    question: "What about pregnancy and fertility?",
    answer: "GLP-1 medications are not recommended during pregnancy or while planning to conceive. You should stop GLP-1 treatment at least 2 months before attempting pregnancy. Our intake includes comprehensive reproductive health screening, and your provider will discuss family planning considerations during your evaluation.",
  },
  {
    question: "How is Nature's Journey different from ForHers?",
    answer: "Nature's Journey offers women-specific protocols that screen for PCOS, perimenopause, and thyroid conditions — ForHers does not. Our all-inclusive pricing ($279/mo) includes provider evaluation, medication if prescribed, and ongoing care. ForHers charges separately for membership ($199/mo) plus medication, totaling $398+/mo. We also include personalized meal plans and monthly provider check-ins.",
  },
  {
    question: "How much weight can I expect to lose?",
    answer: "Clinical data shows GLP-1 medications can help patients lose 15-20% of their body weight (typically 25-50 lbs) over 6-12 months when combined with diet and lifestyle changes. Individual results vary significantly based on starting weight, adherence to treatment, diet, exercise, and individual health conditions. Your provider will discuss realistic expectations during your evaluation.",
  },
  {
    question: "Are compounded GLP-1 medications safe?",
    answer: "Compounded GLP-1 medications are prepared by state-licensed 503A and 503B pharmacies following strict quality standards. They contain the same active ingredient as brand-name medications. However, compounded medications are not FDA-approved as finished products. The FDA does not verify the safety or efficacy of compounded drugs. Your provider will explain the differences during your consultation.",
  },
  {
    question: "Can I cancel my membership at any time?",
    answer: "Yes. There are no long-term contracts or cancellation fees. You can cancel, pause, or adjust your plan at any time through your dashboard or by contacting our care team. If you cancel within 30 days and aren't satisfied, you're covered by our money-back guarantee.",
  },
  {
    question: "Is it safe to take GLP-1 while breastfeeding?",
    answer: "GLP-1 medications are generally not recommended while breastfeeding, as there is limited safety data in nursing mothers. Your provider will discuss alternative approaches if you are currently breastfeeding. Safety is always our priority — we never prescribe treatments that haven't been evaluated for your specific situation.",
  },
  {
    question: "How quickly will I see results?",
    answer: "Many women notice reduced appetite and early weight loss within the first 2-4 weeks. Clinically meaningful weight loss typically occurs over 3-6 months as your dose is gradually increased. Women with PCOS or thyroid conditions may see different timelines. Your provider will set realistic expectations during your evaluation. Individual results vary.",
  },
];

/* ─── PAGE ─────────────────────────────────────────────────── */

export default function WomenWeightLossPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ───── SECTION 1: Sticky Header ───── */}
      <header className="sticky top-0 z-50 border-b border-navy-100/40 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal to-atlantic">
              <span className="text-xs font-bold text-white">NJ</span>
            </div>
            <span className="text-sm font-bold text-navy">Nature&apos;s Journey</span>
          </div>
          <Badge className="hidden sm:inline-flex bg-pink-100 text-pink-700 border-pink-200 text-xs gap-1">
            <Heart className="h-3 w-3" /> Women&apos;s Health
          </Badge>
          <div className="flex items-center gap-4 text-xs text-graphite-400">
            <a href="tel:18885092745" className="hidden sm:flex items-center gap-1.5 hover:text-navy transition-colors">
              <Phone className="h-3 w-3" />
              <span className="font-medium">(888) 509-2745</span>
            </a>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </header>

      {/* ───── SECTION 2: Hero ───── */}
      <section className="bg-gradient-to-b from-pink-50/60 via-cloud to-white py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="flex flex-col items-center gap-3 mb-6">
            <WomenWeeklyStarters />
            <Badge className="bg-pink-100 text-pink-700 border-pink-200 gap-1.5 px-4 py-1.5 text-sm">
              <Heart className="h-3.5 w-3.5" /> Designed for Women&apos;s Biology
            </Badge>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl xl:text-6xl">
            Your hormones are working against you.{" "}
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Now there&apos;s a treatment that works with them.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500 leading-relaxed sm:text-xl">
            GLP-1 medication prescribed by providers who specialize in women&apos;s hormonal health.
            Specialized protocols for PCOS, perimenopause, thyroid conditions, and hormonal weight gain.
          </p>

          {/* Price anchor */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-navy-50 px-6 py-2.5">
            <span className="text-sm text-graphite-400 line-through">$1,349/mo retail</span>
            <span className="text-xl font-bold text-navy">$279/mo</span>
            <span className="rounded-full bg-pink-500 px-3 py-0.5 text-xs font-bold text-white">Save 79%</span>
          </div>

          {/* Primary CTA */}
          <div className="mt-8">
            <TrackedCta location="women_wl_hero" label="See If I'm Eligible — Free Assessment" className="bg-pink-500 hover:bg-pink-600" />
            <p className="mt-3 text-xs text-graphite-400">
              Free 2-minute assessment. HIPAA protected. Cancel anytime.
            </p>
          </div>

          {/* Animated stat counters */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {heroStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-pink-100 bg-white p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-navy sm:text-3xl">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-[11px] text-graphite-400">{stat.label}</p>
              </div>
            ))}
          </div>

          <p className="mt-3 text-[10px] text-graphite-300">
            *Based on published clinical data for GLP-1 medications combined with diet and exercise. Individual results vary. Compounded medications are not FDA-approved.
          </p>
        </div>
      </section>

      {/* ───── SECTION 3: Social Proof Bar ───── */}
      <section className="border-y border-pink-100 bg-pink-50/30 py-3">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 px-4 text-xs text-graphite-500">
          <span className="flex items-center gap-1"><Star className="h-3 w-3 text-gold fill-gold" /> Rated {siteConfig.socialProof.rating}/5 by {siteConfig.socialProof.reviewCount} members</span>
          <span className="flex items-center gap-1"><Users className="h-3 w-3 text-pink-500" /> 6,200+ women in the program</span>
          <span className="flex items-center gap-1"><Truck className="h-3 w-3 text-navy" /> Free 2-day shipping</span>
        </div>
      </section>

      {/* ───── SECTION 4: Problem Agitation ───── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-pink-100 text-pink-700 border-pink-200">The Real Problem</Badge>
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">Why weight loss is harder for women</h2>
            <p className="mt-3 text-sm text-graphite-500 max-w-xl mx-auto">
              It&apos;s not about discipline. It&apos;s about biology that most weight loss programs completely ignore.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {problems.map((p) => (
              <Card key={p.title} className="border-t-2 border-t-pink-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-50">
                      <p.icon className="h-5 w-5 text-pink-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-navy">{p.title}</h3>
                      <p className="mt-1.5 text-xs text-graphite-500 leading-relaxed">{p.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Transition CTA */}
          <div className="mt-12 text-center">
            <div className="mx-auto max-w-lg rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 p-6">
              <p className="text-lg font-bold text-navy">
                There&apos;s a medical breakthrough that works{" "}
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">with women&apos;s biology</span>
              </p>
              <p className="mt-2 text-sm text-graphite-500">GLP-1 medication addresses the hormonal root causes — not just the symptoms.</p>
              <div className="mt-4">
                <Link href="#how-it-works">
                  <Button variant="outline" size="sm" className="gap-1 text-pink-600 border-pink-200 hover:bg-pink-50">
                    See how it works <ChevronRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── SECTION 5: Solution — How GLP-1 Works for Women ───── */}
      <section className="bg-navy-50/30 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-pink-100 text-pink-700 border-pink-200">The Solution</Badge>
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">How GLP-1 works differently for women</h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 items-start">
            {/* Left: stat card */}
            <div className="rounded-2xl bg-gradient-to-br from-navy to-atlantic p-8 text-white">
              <p className="text-sm font-semibold text-teal-200 uppercase tracking-wider">Women-Specific Clinical Data</p>
              <p className="mt-4 text-5xl font-bold">15-20%</p>
              <p className="mt-1 text-lg text-white/80">average body weight lost</p>
              <p className="text-sm text-white/60">25-50 lbs for most women</p>
              <div className="mt-6 space-y-3">
                {[
                  "Addresses insulin resistance in PCOS",
                  "Effective during perimenopause",
                  "Works alongside thyroid treatment",
                  "Prescribed by women's health providers",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-teal-300 shrink-0" />
                    <span className="text-sm text-white/90">{item}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-[10px] text-white/40">
                *Combined with reduced-calorie diet and increased physical activity. Individual results vary.
              </p>
            </div>

            {/* Right: solution points */}
            <div className="space-y-5">
              {solutionPoints.map((s, i) => (
                <div key={s.title} className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-100 text-sm font-bold text-pink-600">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy">{s.title}</h3>
                    <p className="mt-1 text-xs text-graphite-500 leading-relaxed">{s.description}</p>
                  </div>
                </div>
              ))}

              <div className="mt-6 rounded-xl border border-pink-200 bg-pink-50/50 p-4">
                <p className="text-xs text-pink-700 font-semibold">
                  Women with PCOS showed comparable results to the general population when treated with hormonal-aware protocols.*
                </p>
                <p className="mt-1 text-[10px] text-graphite-400">*Based on published clinical research. Individual results vary.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── SECTION 6: How It Works (3 Steps) ───── */}
      <section id="how-it-works" className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-pink-100 text-pink-700 border-pink-200">3 Simple Steps</Badge>
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">How it works</h2>
            <p className="mt-3 text-sm text-graphite-500">100% online. No waiting rooms. No insurance needed.</p>
          </div>

          <div className="space-y-6">
            {processSteps.map((s) => (
              <div key={s.step} className="flex gap-5 rounded-2xl border border-navy-100/40 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 text-lg font-bold text-white">
                  {s.step}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-navy">{s.title}</h3>
                    <Badge variant="outline" className="text-[10px] text-pink-600 border-pink-200">{s.time}</Badge>
                  </div>
                  <p className="text-xs text-graphite-500 leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl bg-pink-50 border border-pink-100 p-4 text-center">
            <p className="text-sm font-semibold text-navy">
              <Zap className="inline h-4 w-4 text-pink-500 mr-1" />
              Assessment to medication: as little as 48 hours
            </p>
          </div>

          <div className="mt-8 text-center">
            <TrackedCta location="women_wl_process" className="bg-pink-500 hover:bg-pink-600" />
          </div>
        </div>
      </section>

      {/* ───── SECTION 7: Everything Included ───── */}
      <section className="bg-gradient-to-b from-pink-50/30 to-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-pink-100 text-pink-700 border-pink-200">All-Inclusive</Badge>
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">Everything included in your membership</h2>
            <p className="mt-3 text-sm text-graphite-500">What others charge separately, we include from day one.</p>
          </div>

          <div className="space-y-3">
            {membershipIncludes.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl bg-white border border-navy-100/30 p-4 shadow-sm">
                <Check className="h-5 w-5 text-pink-500 shrink-0 mt-0.5" />
                <span className="text-sm text-navy">{item}</span>
              </div>
            ))}
          </div>

          {/* ForHers comparison callout */}
          <div className="mt-8 rounded-2xl border border-pink-200 bg-pink-50 p-6">
            <h3 className="text-sm font-bold text-navy text-center mb-4">How we compare to ForHers</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="rounded-xl bg-white p-4 border border-navy-100/30">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-graphite-400">ForHers</p>
                <p className="mt-1 text-sm text-graphite-400 line-through">$199/mo membership</p>
                <p className="text-sm text-graphite-400 line-through">+ $199/mo medication</p>
                <p className="mt-2 text-lg font-bold text-graphite-600">$398+/mo</p>
              </div>
              <div className="rounded-xl bg-white p-4 border-2 border-pink-400">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-pink-600">Nature&apos;s Journey</p>
                <p className="mt-1 text-sm text-navy">Provider + medication*</p>
                <p className="text-sm text-navy">+ meal plans + support</p>
                <p className="mt-2 text-lg font-bold text-pink-600">$279/mo</p>
              </div>
            </div>
            <p className="mt-4 text-center text-[10px] text-graphite-400">
              *Medication included if prescribed. Membership fees cover program, provider evaluation, and care team access. Medication pricing may vary by dose and formulation.
            </p>
          </div>

          {/* Medication pricing transparency */}
          <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 p-4">
            <p className="text-xs text-amber-800">
              <strong>Medication pricing transparency:</strong> Your membership fee covers the program, provider evaluation, and care team access.
              Medication costs are determined at the time of prescribing based on your specific dose, formulation, and pharmacy.
              Your provider will discuss all costs before prescribing.
            </p>
          </div>
        </div>
      </section>

      {/* ───── SECTION 8: Clinical Results ───── */}
      <section className="bg-gradient-to-br from-navy via-navy to-atlantic py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-white/10 text-white border-white/20">Clinical Data</Badge>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">The science behind the results</h2>
            <p className="mt-3 text-sm text-white/60">Published clinical trial data for GLP-1 medications.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {clinicalStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 p-5 text-center">
                <p className="text-3xl font-bold text-white sm:text-4xl">
                  <AnimatedCounter target={stat.value} />
                </p>
                <p className="mt-1 text-xs font-semibold text-white/80">{stat.label}</p>
                <p className="mt-0.5 text-[10px] text-white/50">{stat.detail}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-[10px] text-white/40">
            {siteConfig.compliance.resultsDisclaimer} Combined with a reduced-calorie diet and increased physical activity.
            Compounded medications are not FDA-approved drug products.
          </p>
        </div>
      </section>

      {/* ───── SECTION 9: Pricing ───── */}
      <section className="py-16 sm:py-20" id="pricing">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-pink-100 text-pink-700 border-pink-200">Plans & Pricing</Badge>
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">Invest in your health for less than you think</h2>
            <p className="mt-3 text-sm text-graphite-500 max-w-xl mx-auto">
              Every plan includes provider evaluation, personalized treatment, and medication if prescribed. Up to 79% less than brand-name retail.
            </p>
          </div>
          <WomenPricingSection />
        </div>
      </section>

      {/* ───── SECTION 10: Provider Spotlight ───── */}
      <section className="bg-pink-50/30 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-pink-100 text-pink-700 border-pink-200">Your Care Team</Badge>
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">Providers who specialize in women&apos;s health</h2>
            <p className="mt-3 text-sm text-graphite-500">Board-certified physicians with expertise in hormonal health, PCOS, and perimenopause.</p>
          </div>

          {/* Featured provider */}
          {providers.filter((p) => p.featured).map((p) => (
            <div key={p.name} className="mx-auto max-w-2xl rounded-2xl bg-white border border-navy-100/40 p-8 shadow-sm mb-8">
              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-2xl font-bold text-white mb-4">
                  {p.initials}
                </div>
                <h3 className="text-lg font-bold text-navy">{p.name}</h3>
                <p className="text-sm text-graphite-500">{p.credential} &middot; {p.experience}</p>
                <Badge className="mt-2 bg-pink-100 text-pink-700 border-pink-200 text-xs">{p.specialty}</Badge>
                <p className="mt-4 text-sm text-graphite-600 leading-relaxed max-w-lg mx-auto italic">
                  &ldquo;{p.quote}&rdquo;
                </p>
                <div className="mt-3 flex justify-center items-center gap-1">
                  {[1,2,3,4,5].map((i) => <Star key={i} className="h-4 w-4 text-gold fill-gold" />)}
                  <span className="ml-1 text-xs text-graphite-400">{p.rating}/5 ({p.reviews} reviews)</span>
                </div>
              </div>
            </div>
          ))}

          {/* Supporting providers */}
          <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
            {providers.filter((p) => !p.featured).map((p) => (
              <Card key={p.name}>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-300 to-purple-400 text-lg font-bold text-white mb-3">
                    {p.initials}
                  </div>
                  <h3 className="text-sm font-bold text-navy">{p.name}</h3>
                  <p className="text-xs text-graphite-500">{p.credential} &middot; {p.experience}</p>
                  <Badge className="mt-2 bg-pink-50 text-pink-600 border-pink-200 text-[10px]">{p.specialty}</Badge>
                  <p className="mt-3 text-xs text-graphite-500 italic leading-relaxed">&ldquo;{p.quote}&rdquo;</p>
                  <div className="mt-2 flex justify-center gap-0.5">
                    {[1,2,3,4,5].map((i) => <Star key={i} className="h-3 w-3 text-gold fill-gold" />)}
                    <span className="ml-1 text-[10px] text-graphite-400">{p.rating}/5</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs text-graphite-400">
            <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> All providers licensed in your state</span>
            <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-pink-500" /> Board-certified physicians</span>
            <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5 text-pink-500" /> Women&apos;s metabolic health specialists</span>
          </div>
        </div>
      </section>

      {/* ───── SECTION 11: Testimonials ───── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-pink-100 text-pink-700 border-pink-200">Real Stories</Badge>
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">Real women, real results</h2>
            <p className="mt-3 text-sm text-graphite-500">Verified members sharing their experiences. Individual results vary.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <CardContent className="p-5">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 text-gold fill-gold" />
                    ))}
                  </div>
                  <p className="text-xs text-graphite-600 italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-navy">{t.name}, {t.age}</p>
                      <p className="text-[10px] text-graphite-400">{t.location}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge className="bg-pink-100 text-pink-700 text-[10px]">{t.condition}</Badge>
                      <Badge className="bg-emerald-50 text-emerald-700 text-[10px]">-{t.lbs} lbs</Badge>
                    </div>
                  </div>
                  {/* Weight progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-graphite-400 mb-1">
                      <span>Starting</span>
                      <span>-{t.lbs} lbs in {t.months} months</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-pink-100">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-pink-400 to-purple-500"
                        style={{ width: `${Math.min(100, (t.lbs / 50) * 100)}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="mt-6 text-center text-[10px] text-graphite-400">
            Verified members. {siteConfig.compliance.resultsDisclaimer}
          </p>
        </div>
      </section>

      {/* ───── SECTION 12: Comparison Table ───── */}
      <section className="bg-navy-50/30 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-pink-100 text-pink-700 border-pink-200">Compare</Badge>
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">How we compare</h2>
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40">
                  <th className="py-3 px-4 text-left text-xs font-semibold text-graphite-400 uppercase tracking-wider">Feature</th>
                  <th className="py-3 px-4 text-center text-xs font-bold text-pink-600 uppercase tracking-wider bg-pink-50/50 rounded-t-xl">Nature&apos;s Journey</th>
                  <th className="py-3 px-4 text-center text-xs font-semibold text-graphite-400 uppercase tracking-wider">ForHers</th>
                  <th className="py-3 px-4 text-center text-xs font-semibold text-graphite-400 uppercase tracking-wider">Noom</th>
                  <th className="py-3 px-4 text-center text-xs font-semibold text-graphite-400 uppercase tracking-wider">WW</th>
                  <th className="py-3 px-4 text-center text-xs font-semibold text-graphite-400 uppercase tracking-wider">In-Person Clinic</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.feature} className="border-b border-navy-100/20">
                    <td className="py-3 px-4 text-sm text-navy font-medium">{row.feature}</td>
                    {[row.nj, row.forhers, row.noom, row.ww, row.clinic].map((val, i) => (
                      <td key={i} className={cn("py-3 px-4 text-center", i === 0 && "bg-pink-50/50")}>
                        {val === true ? <Check className="h-4 w-4 text-pink-500 mx-auto" /> :
                         val === false ? <X className="h-4 w-4 text-graphite-300 mx-auto" /> :
                         <span className="text-xs text-graphite-500">{val}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: simplified cards */}
          <div className="lg:hidden space-y-3">
            {comparisonRows.map((row) => (
              <div key={row.feature} className="flex items-center justify-between rounded-xl bg-white border border-navy-100/30 p-4">
                <span className="text-xs font-medium text-navy">{row.feature}</span>
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <p className="text-[9px] text-pink-600 font-semibold">Us</p>
                    {row.nj === true ? <Check className="h-3.5 w-3.5 text-pink-500 mx-auto" /> :
                     <span className="text-[10px] text-pink-600 font-semibold">{String(row.nj)}</span>}
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] text-graphite-400">ForHers</p>
                    {row.forhers === true ? <Check className="h-3.5 w-3.5 text-graphite-400 mx-auto" /> :
                     row.forhers === false ? <X className="h-3.5 w-3.5 text-graphite-300 mx-auto" /> :
                     <span className="text-[10px] text-graphite-400">{String(row.forhers)}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Savings callout */}
          <div className="mt-8 rounded-2xl bg-gradient-to-r from-pink-100 to-purple-100 p-6 text-center">
            <p className="text-lg font-bold text-navy">
              Save up to <span className="text-pink-600">$1,428/year</span> vs ForHers
            </p>
            <p className="mt-1 text-xs text-graphite-500">With more women-specific features included.</p>
            <div className="mt-4">
              <TrackedCta location="women_wl_comparison" className="bg-pink-500 hover:bg-pink-600" />
            </div>
          </div>
        </div>
      </section>

      {/* ───── SECTION 13: FAQ ───── */}
      <section className="py-16 sm:py-20" id="faq">
        <div className="mx-auto max-w-2xl px-4">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-pink-100 text-pink-700 border-pink-200">FAQ</Badge>
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">Common questions from women</h2>
          </div>
          <WomenFaqAccordion faqs={faqs} />
          <div className="mt-8 text-center">
            <p className="text-sm text-graphite-500">Still have questions?</p>
            <a href="tel:18885092745" className="text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors">
              Call us at (888) 509-2745
            </a>
          </div>
        </div>
      </section>

      {/* ───── SECTION 14: Final CTA ───── */}
      <section className="bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 py-16 sm:py-20">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h2 className="text-2xl font-bold text-navy sm:text-3xl">
            Your body deserves a treatment{" "}
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">designed for it</span>
          </h2>
          <p className="mt-4 text-sm text-graphite-500">
            Free 2-minute assessment. Provider reviews within 1 business day. Medication ships free if prescribed.
          </p>
          <div className="mt-8">
            <TrackedCta location="women_wl_final" className="bg-pink-500 hover:bg-pink-600" />
          </div>

          {/* Price reminder */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-white px-5 py-2 shadow-sm border border-pink-100">
            <span className="text-sm text-graphite-400 line-through">$1,349/mo</span>
            <span className="font-bold text-navy">$279/mo</span>
            <Badge className="bg-pink-500 text-white text-[10px]">79% off</Badge>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-graphite-400">
            <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> 30-day guarantee</span>
            <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-pink-500" /> No commitment</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-pink-500" /> Same-day evaluation</span>
            <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> HIPAA protected</span>
          </div>
        </div>
      </section>

      {/* ───── SECTION 15: Compliance Footer ───── */}
      <footer className="border-t border-navy-100/40 bg-navy-50/20 py-8">
        <div className="mx-auto max-w-3xl px-4 text-center space-y-3">
          <p className="text-[10px] text-graphite-400">
            Nature&apos;s Journey Health is a telehealth platform that connects patients with licensed medical providers.
            Nature&apos;s Journey does not provide medical services directly. All medical decisions are made by your treating provider.
          </p>
          <p className="text-[10px] text-graphite-400">
            {siteConfig.compliance.shortDisclaimer}
          </p>
          <p className="text-[10px] text-graphite-400">
            {siteConfig.compliance.resultsDisclaimer}
          </p>
          <p className="text-[10px] text-graphite-400">
            {siteConfig.compliance.eligibilityDisclaimer}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-3 text-[10px]">
            <Link href="/legal/terms" className="text-graphite-400 hover:text-navy underline">Terms of Service</Link>
            <Link href="/legal/privacy" className="text-graphite-400 hover:text-navy underline">Privacy Policy</Link>
            <Link href="/legal/hipaa" className="text-graphite-400 hover:text-navy underline">HIPAA Notice</Link>
          </div>
          <p className="text-[10px] text-graphite-300 pt-2">
            &copy; {new Date().getFullYear()} Nature&apos;s Journey Health. All rights reserved.
          </p>
        </div>
      </footer>

      <MedicalWebPageJsonLd name="Women's GLP-1 Weight Loss Program" description="Clinically guided GLP-1 weight loss designed for women's biology. PCOS, perimenopause, thyroid-aware protocols." url="/lp/women-weight-loss" />
      <LpConversionWidgets />
    </div>
  );
}
