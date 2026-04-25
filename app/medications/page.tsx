export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, Pill, Check, Shield, TrendingDown, DollarSign, Syringe,
  FlaskConical, Zap, Star, ShieldCheck, Clock, Users, Truck, Brain,
  Activity, Heart, Scale, Stethoscope, Package, ClipboardCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { WebPageJsonLd, MedicalWebPageJsonLd, FAQPageJsonLd, BreadcrumbJsonLd, HowToJsonLd } from "@/components/seo/json-ld";
import { medications } from "@/lib/medications";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "GLP-1 Medications for Weight Loss — Semaglutide & Tirzepatide | Nature's Journey",
  description:
    "Compare GLP-1 weight loss medications: semaglutide (Ozempic, Wegovy) vs tirzepatide (Mounjaro, Zepbound). Clinical results, cost from $179/mo, side effects, and how to get prescribed online.",
  openGraph: {
    title: "GLP-1 Weight Loss Medications Guide | Nature's Journey",
    description: "Everything about semaglutide and tirzepatide for weight loss. Compare results, cost, side effects, and get prescribed online from $179/mo.",
  },
};

/* ─── DATA ─────────────────────────────────────────────────── */

const heroStats = [
  { icon: TrendingDown, value: "15-22%", label: "Avg body weight loss*" },
  { icon: Users, value: "18,000+", label: "Members served" },
  { icon: Star, value: "4.9/5", label: "Average rating" },
  { icon: Truck, value: "Free", label: "2-day shipping" },
];

const trustBadges = [
  { icon: ShieldCheck, label: "Board-Certified Providers", color: "text-teal" },
  { icon: Shield, label: "HIPAA Compliant", color: "text-teal" },
  { icon: Pill, label: "Licensed Pharmacies", color: "text-teal" },
  { icon: Clock, label: "Same-Day Evaluation", color: "text-emerald-500" },
  { icon: Truck, label: "Free 2-Day Shipping", color: "text-emerald-500" },
];

const processSteps = [
  {
    icon: ClipboardCheck,
    step: "1",
    title: "Take a Free Assessment",
    time: "2 minutes",
    description: "Answer a brief health questionnaire about your weight, medical history, and goals. No payment required.",
  },
  {
    icon: Stethoscope,
    step: "2",
    title: "Provider Evaluates You",
    time: "Within 24 hours",
    description: "A board-certified provider reviews your profile and determines which medication — if any — is right for you.",
  },
  {
    icon: Package,
    step: "3",
    title: "Medication Ships Free",
    time: "2-day delivery",
    description: "If prescribed, your medication ships directly to your door with free 2-day delivery. Cold-chain packaging included.",
  },
];

const objections = [
  {
    icon: Shield,
    q: "Are GLP-1 medications safe?",
    a: "Semaglutide and tirzepatide have been studied in clinical trials with over 30,000 combined participants. Side effects are typically mild (nausea, digestive changes) and resolve within 2-4 weeks during titration.",
    stat: "30,000+", statLabel: "clinical trial participants",
  },
  {
    icon: DollarSign,
    q: "Why is it so much cheaper than brand-name?",
    a: "Brand-name pricing includes patents, marketing, and insurance middlemen. Compounded formulations use the same active ingredients, prepared by licensed pharmacies, without those costs.",
    stat: "79%", statLabel: "less than retail",
  },
  {
    icon: Scale,
    q: "Which medication is right for me?",
    a: "Your provider will recommend the best option based on your health profile, prior treatment history, and goals. Many start with semaglutide; some may benefit from tirzepatide's dual mechanism.",
    stat: "Personalized", statLabel: "provider recommendation",
  },
  {
    icon: Heart,
    q: "What if I get side effects?",
    a: "Your provider starts with a low dose and titrates gradually. Most side effects (mild nausea) resolve within the first 2 weeks. Your care team is available via messaging for any concerns.",
    stat: "85%", statLabel: "resolve in 2 weeks",
  },
];

const testimonials = [
  {
    quote: "My provider explained the difference between semaglutide and tirzepatide clearly. Started on semaglutide — down 38 lbs in 5 months.",
    name: "Angela R.", age: 41, location: "Denver",
  },
  {
    quote: "Switched from brand-name Ozempic. Same results, $1,000/mo less. My provider here is actually more responsive than my old PCP.",
    name: "David K.", age: 55, location: "Austin",
  },
  {
    quote: "Tirzepatide was a game-changer after plateauing on semaglutide. Down 51 lbs total. The dual mechanism really works differently.",
    name: "Patricia M.", age: 47, location: "Chicago",
  },
];

const pageFaqs = [
  { question: "What GLP-1 medications are available for weight loss?", answer: "The two primary GLP-1 medications are semaglutide (same active ingredient as Ozempic and Wegovy) and tirzepatide (same active ingredient as Mounjaro and Zepbound). Both are available as compounded formulations through licensed pharmacies at significantly lower cost." },
  { question: "What is the difference between semaglutide and tirzepatide?", answer: "Semaglutide activates the GLP-1 receptor to reduce appetite. Tirzepatide activates both GLP-1 and GIP receptors simultaneously. Clinical trials show tirzepatide may produce greater average weight loss (20-22% vs 15-16%), though individual results vary." },
  { question: "Do I need insurance for GLP-1 medication?", answer: "No. Our pricing is all-inclusive starting at $179/mo — provider evaluation, medication if prescribed, meal plans, and ongoing support. No insurance required, no prior authorization, no formulary restrictions." },
  { question: "Are compounded GLP-1 medications the same as brand-name?", answer: "Compounded formulations contain the same active ingredients as brand-name drugs but are prepared by licensed 503A/503B pharmacies. They are not FDA-approved brand-name drugs. Your provider determines if compounded medication is appropriate for you." },
  { question: "What are the most common side effects?", answer: "Mild nausea, decreased appetite, and digestive changes — especially during the first few weeks as your dose increases. Most patients find these resolve as their body adjusts. Your provider manages titration to minimize side effects." },
  { question: "How quickly will I see results?", answer: "Most members notice reduced appetite within the first 1-2 weeks. Meaningful weight loss typically begins during months 2-3 as you reach your therapeutic dose. Average results of 15-22% body weight loss are measured over 68-72 weeks in clinical trials." },
];

/* ─── PAGE ─────────────────────────────────────────────────── */

export default function MedicationsPage() {
  return (
    <MarketingShell>
      <WebPageJsonLd
        title="GLP-1 Medications for Weight Loss"
        description="Complete guide to GLP-1 weight loss medications including semaglutide and tirzepatide."
        path="/medications"
      />
      <MedicalWebPageJsonLd
        name="GLP-1 Medications for Weight Loss — Complete Guide"
        description="Provider-reviewed guide comparing semaglutide and tirzepatide for weight management."
        url="/medications"
        medicalAudience="Patient"
      />
      <FAQPageJsonLd faqs={pageFaqs} />
      <BreadcrumbJsonLd items={[{ name: "Home", href: "/" }, { name: "GLP-1 Medications", href: "/medications" }]} />
      <HowToJsonLd
        name="How to Get GLP-1 Weight Loss Medication Online"
        description="Three steps to get prescribed GLP-1 medication online through Nature's Journey."
        steps={processSteps.map((s) => ({ title: s.title, description: s.description }))}
      />

      {/* ═══════════════════ 1. HERO ═══════════════════ */}
      <section className="bg-gradient-to-b from-cloud via-sage/20 to-white py-16 sm:py-24">
        <SectionShell className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50/60 px-4 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-teal">
              Accepting new patients — same-day evaluations
            </span>
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            The weight-loss medications{" "}
            <span className="bg-gradient-to-r from-teal to-atlantic bg-clip-text text-transparent">
              that actually work
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500 leading-relaxed">
            Semaglutide and tirzepatide — clinically proven for 15-22% body weight loss.
            Prescribed by licensed providers. Delivered to your door. From $179/mo.
          </p>

          {/* Price anchor */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-navy-100/40 bg-navy-50/60 px-6 py-2.5">
            <span className="text-sm text-graphite-400 line-through">$1,349/mo retail</span>
            <span className="text-2xl font-bold text-navy">$179<span className="text-sm font-normal text-graphite-500">/mo</span></span>
            <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-bold text-white">
              Save 79%
            </span>
          </div>

          {/* CTA */}
          <div className="mt-8">
            <Link href="/qualify">
              <Button size="xl" variant="emerald" className="gap-2 px-12 h-16 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] hover:brightness-110">
                See If I Qualify — Free Assessment <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <p className="mt-3 text-xs text-graphite-400">
              Takes 2 minutes. No commitment. HIPAA protected.
            </p>
          </div>

          {/* Trust stats */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {heroStats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-navy-100/50 bg-white p-4 text-center shadow-premium">
                <stat.icon className="mx-auto mb-1 h-4 w-4 text-teal" />
                <p className="text-xl font-bold text-navy">{stat.value}</p>
                <p className="text-[10px] text-graphite-400">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-graphite-300">
            *Based on published clinical trial data (STEP/SURMOUNT). Individual results vary.
          </p>
        </SectionShell>
      </section>

      {/* ═══════════════════ 2. TRUST BAR ═══════════════════ */}
      <section className="border-y border-navy-100/40 bg-white py-4">
        <SectionShell>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {trustBadges.map((b) => (
              <div key={b.label} className="flex items-center gap-2 text-xs text-graphite-500">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50">
                  <b.icon className={`h-3.5 w-3.5 ${b.color}`} />
                </div>
                {b.label}
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* ═══════════════════ 3. MEDICATION DEEP-DIVE CARDS ═══════════════════ */}
      <section className="py-16">
        <SectionShell>
          <SectionHeading
            eyebrow="Two Proven Options"
            title="Compare the medications"
            description="Your provider will recommend the best option after evaluating your health profile."
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {medications.map((med, idx) => (
              <Link
                key={med.slug}
                href={`/medications/${med.slug}`}
                className="group rounded-2xl border border-navy-100/60 bg-white p-8 shadow-premium transition-all hover:shadow-premium-lg hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${idx === 0 ? "bg-teal-50" : "bg-indigo-50"}`}>
                    {idx === 0 ? <FlaskConical className="h-6 w-6 text-teal" /> : <Zap className="h-6 w-6 text-indigo-500" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-navy group-hover:text-teal transition-colors">
                      {med.genericName}
                    </h2>
                    <p className="text-sm text-graphite-400">{med.brandName}</p>
                  </div>
                  {idx === 1 && (
                    <Badge className="ml-auto bg-indigo-100 text-indigo-700 text-[10px]">Dual-Action</Badge>
                  )}
                </div>

                <p className="text-sm text-graphite-500 leading-relaxed mb-6">{med.mechanism}</p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="rounded-xl bg-navy-50/30 p-3">
                    <div className="flex items-center gap-1.5 text-xs text-graphite-400 mb-1">
                      <TrendingDown className="h-3 w-3" /> Avg Weight Loss
                    </div>
                    <p className="text-sm font-bold text-navy">{med.weightLoss.split('.')[0]}</p>
                  </div>
                  <div className="rounded-xl bg-navy-50/30 p-3">
                    <div className="flex items-center gap-1.5 text-xs text-graphite-400 mb-1">
                      <DollarSign className="h-3 w-3" /> Nature&apos;s Journey Price
                    </div>
                    <p className="text-sm font-bold text-teal">{med.vitalpathCost}</p>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {med.keyFacts.slice(0, 3).map((fact) => (
                    <li key={fact} className="flex items-start gap-2 text-xs text-graphite-500">
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-teal" /> {fact}
                    </li>
                  ))}
                </ul>

                <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal">
                  Read full guide <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* ═══════════════════ 4. PRODUCT SHOWCASE — SEMAGLUTIDE ═══════════════════ */}
      <section className="bg-gradient-to-b from-white to-sage/20 py-16">
        <SectionShell>
          <SectionHeading
            eyebrow="Available Formulations"
            title="Choose Your Medication"
            description="Brand-name and compounded formulations — all prescribed by licensed providers after medical evaluation."
          />

          {/* Semaglutide row */}
          <div className="mb-14">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-navy">
              <FlaskConical className="h-5 w-5 text-teal" /> Semaglutide (GLP-1)
              <span className="ml-2 text-xs font-normal text-graphite-400">— Ozempic / Wegovy active ingredient</span>
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Compounded Semaglutide Injection */}
              <div className="group relative overflow-hidden rounded-2xl border-2 border-teal/30 bg-white shadow-premium transition-all hover:shadow-premium-lg hover:-translate-y-1">
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="bg-emerald-500 text-white text-[10px] font-bold shadow-sm">BEST VALUE</Badge>
                </div>
                <div className="flex h-52 items-center justify-center bg-gradient-to-br from-teal-50 via-sage/30 to-teal-100/50 relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-teal/5" />
                  <div className="absolute -left-4 -bottom-4 h-20 w-20 rounded-full bg-atlantic/5" />
                  <div className="relative">
                    <div className="flex h-28 w-[72px] items-end justify-center rounded-t-2xl rounded-b-lg bg-gradient-to-b from-teal to-atlantic shadow-lg ring-1 ring-white/20">
                      <div className="mb-4 text-center">
                        <p className="text-[6px] font-bold uppercase tracking-widest text-white/70">PRESCRIPTION</p>
                        <p className="text-xs font-extrabold text-white leading-tight">GLP-1</p>
                        <p className="text-[7px] font-semibold text-teal-200 mt-0.5">MEDICATION</p>
                        <div className="mx-auto mt-1.5 h-px w-8 bg-white/30" />
                        <p className="mt-1 text-[5px] text-white/50">Rx ONLY</p>
                        <p className="text-[5px] text-white/50">Dose Varies</p>
                      </div>
                    </div>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-7 w-16 rounded-t-full bg-gradient-to-b from-graphite-400 to-graphite-600 shadow-md ring-1 ring-white/10" />
                  </div>
                </div>
                <div className="p-5 text-center">
                  <p className="text-xs font-semibold text-teal">Starting at $179</p>
                  <h4 className="mt-0.5 text-base font-bold text-navy">GLP-1 Injections</h4>
                  <p className="mt-1 text-xs text-graphite-400">One simple injection per week.</p>
                  <Link href="/qualify">
                    <Button size="sm" className="mt-4 w-full gap-1.5 rounded-xl bg-navy text-white hover:bg-navy/90 font-bold text-xs tracking-wide">
                      GET STARTED <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Ozempic */}
              <div className="group overflow-hidden rounded-2xl border border-navy-100/60 bg-white shadow-sm transition-all hover:shadow-premium hover:-translate-y-1">
                <div className="flex h-52 items-center justify-center bg-gradient-to-br from-blue-50/80 to-indigo-50/30">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-9 w-32 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 shadow-md">
                      <span className="text-xs font-extrabold tracking-widest text-white">OZEMPIC</span>
                    </div>
                    <div className="flex h-[72px] w-32 flex-col items-center justify-center rounded-xl border border-blue-100 bg-white shadow-sm">
                      <Syringe className="h-7 w-7 text-blue-500 mb-1" />
                      <p className="text-[8px] font-bold text-blue-600 uppercase tracking-wide">Injection Pen</p>
                      <p className="text-[7px] text-graphite-400 mt-0.5">Novo Nordisk</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 text-center">
                  <p className="text-xs font-semibold text-graphite-400">$935-$1,349+/mo</p>
                  <h4 className="mt-0.5 text-base font-bold text-navy">Ozempic<sup className="text-[8px]">&reg;</sup></h4>
                  <p className="mt-1 text-xs text-graphite-400">FDA-approved for type 2 diabetes.</p>
                  <Link href="/medications/semaglutide">
                    <Button variant="outline" size="sm" className="mt-4 w-full gap-1.5 rounded-xl text-xs">
                      Learn More <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Wegovy */}
              <div className="group overflow-hidden rounded-2xl border border-navy-100/60 bg-white shadow-sm transition-all hover:shadow-premium hover:-translate-y-1">
                <div className="flex h-52 items-center justify-center bg-gradient-to-br from-sky-50/80 to-cyan-50/30">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-9 w-32 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-cyan-600 shadow-md">
                      <span className="text-xs font-extrabold tracking-widest text-white">WEGOVY</span>
                    </div>
                    <div className="flex h-[72px] w-32 flex-col items-center justify-center rounded-xl border border-sky-100 bg-white shadow-sm">
                      <Syringe className="h-7 w-7 text-sky-500 mb-1" />
                      <p className="text-[8px] font-bold text-sky-600 uppercase tracking-wide">Injection Pen</p>
                      <p className="text-[7px] text-graphite-400 mt-0.5">Novo Nordisk</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 text-center">
                  <p className="text-xs font-semibold text-graphite-400">$1,349+/mo</p>
                  <h4 className="mt-0.5 text-base font-bold text-navy">Wegovy<sup className="text-[8px]">&reg;</sup></h4>
                  <p className="mt-1 text-xs text-graphite-400">FDA-approved for weight management.</p>
                  <Link href="/lp/wegovy-alternative">
                    <Button variant="outline" size="sm" className="mt-4 w-full gap-1.5 rounded-xl text-xs">
                      See Our Alternative <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Compounded Oral Tablets */}
              <div className="group relative overflow-hidden rounded-2xl border border-teal/20 bg-white shadow-sm transition-all hover:shadow-premium hover:-translate-y-1">
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="bg-teal text-white text-[10px] shadow-sm">NEW</Badge>
                </div>
                <div className="flex h-52 items-center justify-center bg-gradient-to-br from-teal-50/50 via-white to-sage/20 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-teal/5" />
                  <div className="relative">
                    <div className="flex h-28 w-[72px] items-end justify-center rounded-2xl bg-gradient-to-b from-teal/80 to-teal shadow-lg ring-1 ring-white/20">
                      <div className="mb-4 text-center">
                        <p className="text-[6px] font-bold uppercase tracking-widest text-white/70">PRESCRIPTION</p>
                        <p className="text-xs font-extrabold text-white leading-tight">GLP-1</p>
                        <p className="text-[7px] font-semibold text-teal-200 mt-0.5">MEDICATION</p>
                        <div className="mx-auto mt-1 h-px w-8 bg-white/30" />
                        <p className="mt-1 text-[5px] text-white/50">Oral Dissolving Tablets</p>
                      </div>
                    </div>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-16 rounded-t-xl bg-gradient-to-b from-teal-300 to-teal-500 shadow-sm" />
                  </div>
                </div>
                <div className="p-5 text-center">
                  <p className="text-xs font-semibold text-teal">Starting at $249</p>
                  <h4 className="mt-0.5 text-base font-bold text-navy">GLP-1 Tablets</h4>
                  <p className="mt-1 text-xs text-graphite-400">One dissolvable tablet per day.</p>
                  <Link href="/qualify">
                    <Button size="sm" className="mt-4 w-full gap-1.5 rounded-xl bg-navy text-white hover:bg-navy/90 font-bold text-xs tracking-wide">
                      GET STARTED <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Tirzepatide row */}
          <div>
            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-navy">
              <Zap className="h-5 w-5 text-indigo-500" /> Tirzepatide (Dual GLP-1/GIP)
              <span className="ml-2 text-xs font-normal text-graphite-400">— Mounjaro / Zepbound active ingredient</span>
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Compounded Tirzepatide */}
              <div className="group relative overflow-hidden rounded-2xl border-2 border-indigo-200/60 bg-white shadow-premium transition-all hover:shadow-premium-lg hover:-translate-y-1">
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="bg-indigo-500 text-white text-[10px] font-bold shadow-sm">MOST EFFECTIVE</Badge>
                </div>
                <div className="flex h-52 items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50/30 to-indigo-100/50 relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-500/5" />
                  <div className="absolute -left-4 -bottom-4 h-20 w-20 rounded-full bg-purple-500/5" />
                  <div className="relative">
                    <div className="flex h-28 w-[72px] items-end justify-center rounded-t-2xl rounded-b-lg bg-gradient-to-b from-indigo-500 to-purple-600 shadow-lg ring-1 ring-white/20">
                      <div className="mb-4 text-center">
                        <p className="text-[6px] font-bold uppercase tracking-widest text-white/70">DUAL-ACTION</p>
                        <p className="text-xs font-extrabold text-white leading-tight">GLP-1</p>
                        <p className="text-[7px] font-semibold text-indigo-200 mt-0.5">MEDICATION</p>
                        <div className="mx-auto mt-1.5 h-px w-8 bg-white/30" />
                        <p className="mt-1 text-[5px] text-white/50">Rx ONLY</p>
                        <p className="text-[5px] text-white/50">Dose Varies</p>
                      </div>
                    </div>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-7 w-16 rounded-t-full bg-gradient-to-b from-graphite-400 to-graphite-600 shadow-md ring-1 ring-white/10" />
                  </div>
                </div>
                <div className="p-5 text-center">
                  <p className="text-xs font-semibold text-indigo-600">Starting at $379</p>
                  <h4 className="mt-0.5 text-base font-bold text-navy">Dual-Action Injections</h4>
                  <p className="mt-1 text-xs text-graphite-400">Up to 21% body weight loss.</p>
                  <Link href="/qualify">
                    <Button size="sm" className="mt-4 w-full gap-1.5 rounded-xl bg-navy text-white hover:bg-navy/90 font-bold text-xs tracking-wide">
                      GET STARTED <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Mounjaro */}
              <div className="group overflow-hidden rounded-2xl border border-navy-100/60 bg-white shadow-sm transition-all hover:shadow-premium hover:-translate-y-1">
                <div className="flex h-52 items-center justify-center bg-gradient-to-br from-amber-50/80 to-orange-50/30">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-9 w-32 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-md">
                      <span className="text-[10px] font-extrabold tracking-widest text-white">MOUNJARO</span>
                    </div>
                    <div className="flex h-[72px] w-32 flex-col items-center justify-center rounded-xl border border-amber-100 bg-white shadow-sm">
                      <Syringe className="h-7 w-7 text-amber-500 mb-1" />
                      <p className="text-[8px] font-bold text-amber-600 uppercase tracking-wide">Injection Pen</p>
                      <p className="text-[7px] text-graphite-400 mt-0.5">Eli Lilly</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 text-center">
                  <p className="text-xs font-semibold text-graphite-400">$1,023-$1,200+/mo</p>
                  <h4 className="mt-0.5 text-base font-bold text-navy">Mounjaro<sup className="text-[8px]">&reg;</sup></h4>
                  <p className="mt-1 text-xs text-graphite-400">FDA-approved for type 2 diabetes.</p>
                  <Link href="/lp/mounjaro-alternative">
                    <Button variant="outline" size="sm" className="mt-4 w-full gap-1.5 rounded-xl text-xs">
                      See Our Alternative <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Zepbound */}
              <div className="group overflow-hidden rounded-2xl border border-navy-100/60 bg-white shadow-sm transition-all hover:shadow-premium hover:-translate-y-1">
                <div className="flex h-52 items-center justify-center bg-gradient-to-br from-violet-50/80 to-purple-50/30">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-9 w-32 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-purple-600 shadow-md">
                      <span className="text-[10px] font-extrabold tracking-widest text-white">ZEPBOUND</span>
                    </div>
                    <div className="flex h-[72px] w-32 flex-col items-center justify-center rounded-xl border border-violet-100 bg-white shadow-sm">
                      <Syringe className="h-7 w-7 text-violet-500 mb-1" />
                      <p className="text-[8px] font-bold text-violet-600 uppercase tracking-wide">Injection Pen</p>
                      <p className="text-[7px] text-graphite-400 mt-0.5">Eli Lilly</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 text-center">
                  <p className="text-xs font-semibold text-graphite-400">$1,060+/mo</p>
                  <h4 className="mt-0.5 text-base font-bold text-navy">Zepbound<sup className="text-[8px]">&reg;</sup></h4>
                  <p className="mt-1 text-xs text-graphite-400">FDA-approved for weight management.</p>
                  <Link href="/lp/zepbound-alternative">
                    <Button variant="outline" size="sm" className="mt-4 w-full gap-1.5 rounded-xl text-xs">
                      See Our Alternative <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Wegovy Pen */}
              <div className="group overflow-hidden rounded-2xl border border-navy-100/60 bg-white shadow-sm transition-all hover:shadow-premium hover:-translate-y-1">
                <div className="flex h-52 items-center justify-center bg-gradient-to-br from-emerald-50/50 to-teal-50/30">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-[88px] w-7 flex-col items-center rounded-full bg-gradient-to-b from-teal-400 to-teal-600 shadow-md">
                      <div className="mt-1.5 h-3.5 w-3.5 rounded-full bg-white/30" />
                      <div className="mt-auto mb-1.5 h-1 w-3 rounded-full bg-white/20" />
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-bold uppercase tracking-wide text-graphite-500">Wegovy<sup>&reg;</sup> Pen</p>
                      <p className="text-[7px] text-graphite-400">(semaglutide)</p>
                      <div className="mt-1.5 rounded-md bg-sky-100 px-2 py-0.5">
                        <p className="text-[7px] font-semibold text-sky-700">Brand-Name</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-5 text-center">
                  <p className="text-xs font-semibold text-graphite-400">$99/mo + medication cost</p>
                  <h4 className="mt-0.5 text-base font-bold text-navy">Wegovy<sup className="text-[8px]">&reg;</sup> Pen</h4>
                  <p className="mt-1 text-xs text-graphite-400">Availability is limited.</p>
                  <Link href="/lp/wegovy-alternative">
                    <Button variant="outline" size="sm" className="mt-4 w-full gap-1.5 rounded-xl text-xs">
                      Check Availability <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl bg-navy-50/30 p-4 text-center text-[10px] text-graphite-400">
            Compounded medications are not FDA-approved brand-name drugs. Brand names are trademarks of their respective manufacturers.
            Availability of brand-name medications may be subject to supply constraints. Your provider will recommend the best option for you.
          </div>
        </SectionShell>
      </section>

      {/* ═══════════════════ 5. MID-PAGE CTA ═══════════════════ */}
      <section className="bg-teal-50/30 py-10">
        <SectionShell className="text-center">
          <h3 className="text-xl font-bold text-navy sm:text-2xl">Not sure which medication is right for you?</h3>
          <p className="mt-2 text-sm text-graphite-500">Your provider will recommend the best option after your free assessment.</p>
          <div className="mt-5">
            <Link href="/qualify">
              <Button size="xl" variant="emerald" className="gap-2 px-12 h-14 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                See If I Qualify <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </SectionShell>
      </section>

      {/* ═══════════════════ 6. COMPARISON TABLE ═══════════════════ */}
      <section className="bg-premium-gradient py-16">
        <SectionShell>
          <SectionHeading eyebrow="Side by Side" title="Semaglutide vs Tirzepatide at a glance" />
          <div className="overflow-x-auto rounded-2xl border border-navy-100/60 bg-white shadow-premium">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40">
                  <th className="px-3 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-navy">Factor</th>
                  <th className="px-3 py-3 sm:px-6 sm:py-4 text-center text-xs sm:text-sm font-semibold text-teal">Semaglutide</th>
                  <th className="px-3 py-3 sm:px-6 sm:py-4 text-center text-xs sm:text-sm font-semibold text-indigo-600">Tirzepatide</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {[
                  ["Mechanism", "GLP-1 agonist", "Dual GLP-1/GIP agonist"],
                  ["Brand names", "Ozempic, Wegovy", "Mounjaro, Zepbound"],
                  ["Avg weight loss*", "15-16%", "20-22%"],
                  ["Dosing", "Weekly injection", "Weekly injection"],
                  ["Retail cost", "$935-$1,349+/mo", "$1,023-$1,200+/mo"],
                  ["Nature's Journey", "From $179/mo", "From $379/mo"],
                  ["Nausea rate", "44%", "31%"],
                  ["Clinical trial", "STEP (Novo Nordisk)", "SURMOUNT (Eli Lilly)"],
                ].map(([factor, sem, tir]) => (
                  <tr key={factor} className="hover:bg-navy-50/20 transition-colors">
                    <td className="px-3 py-3 sm:px-6 text-xs sm:text-sm font-medium text-navy">{factor}</td>
                    <td className="px-3 py-3 sm:px-6 text-center text-xs sm:text-sm text-graphite-600">{sem}</td>
                    <td className="px-3 py-3 sm:px-6 text-center text-xs sm:text-sm text-graphite-600">{tir}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-center text-xs text-graphite-400">
            *Based on published clinical trial data. Individual results vary. Your provider will recommend the best option for your health profile.
          </p>
        </SectionShell>
      </section>

      {/* ═══════════════════ 7. HOW IT WORKS ═══════════════════ */}
      <section className="py-16">
        <SectionShell>
          <SectionHeading eyebrow="How It Works" title="From assessment to delivery in 3 steps" />
          <div className="grid gap-6 md:grid-cols-3">
            {processSteps.map((s, i) => (
              <div key={s.title} className="relative rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                    <s.icon className="h-5 w-5 text-teal" />
                  </div>
                  <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal">
                    {s.time}
                  </span>
                </div>
                <div className="text-xs font-bold text-teal mb-1">Step {s.step}</div>
                <h3 className="text-base font-bold text-navy mb-2">{s.title}</h3>
                <p className="text-sm text-graphite-500 leading-relaxed">{s.description}</p>
                {i < processSteps.length - 1 && (
                  <ArrowRight className="absolute right-0 top-1/2 hidden h-5 w-5 translate-x-1/2 -translate-y-1/2 text-teal-300 md:block" />
                )}
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* ═══════════════════ 8. OBJECTION HANDLER ═══════════════════ */}
      <section className="bg-navy-50/20 py-16">
        <SectionShell>
          <SectionHeading eyebrow="Your Questions" title="Common concerns, straight answers" />
          <div className="mx-auto max-w-3xl space-y-4">
            {objections.map((obj, i) => (
              <div key={i} className="rounded-xl border border-navy-100/60 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                    <obj.icon className="h-5 w-5 text-teal" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-navy mb-1">{obj.q}</h3>
                    <p className="text-sm text-graphite-500 leading-relaxed">{obj.a}</p>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-teal-50 px-3 py-1.5">
                      <span className="text-sm font-bold text-teal">{obj.stat}</span>
                      <span className="text-xs text-graphite-400">{obj.statLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* ═══════════════════ 9. TESTIMONIALS ═══════════════════ */}
      <section className="py-16">
        <SectionShell>
          <SectionHeading eyebrow="Member Stories" title="Real members, real results" />
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 text-gold fill-gold" />
                  ))}
                </div>
                <blockquote className="text-sm text-graphite-600 italic leading-relaxed mb-4">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="text-sm font-semibold text-navy">{t.name}, {t.age}</div>
                <div className="text-xs text-graphite-400">{t.location}</div>
                <p className="mt-2 text-[10px] text-graphite-300">Verified member. Individual results vary.</p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* ═══════════════════ 10. COMPOUNDED EXPLAINER ═══════════════════ */}
      <section className="bg-navy-50/20 py-16">
        <SectionShell className="max-w-3xl">
          <h2 className="text-2xl font-bold text-navy">What about compounded GLP-1 medications?</h2>
          <p className="mt-4 text-sm leading-relaxed text-graphite-600">
            Compounded versions of semaglutide and tirzepatide contain the same active ingredients but
            are prepared by state-licensed pharmacies at a fraction of the brand-name cost. They are
            legal when prescribed by a licensed provider and prepared by a properly licensed pharmacy.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-graphite-600">
            Nature&apos;s Journey partners exclusively with state-licensed 503A and 503B compounding pharmacies
            that meet strict quality standards including sterility testing, potency verification, and
            proper cold-chain shipping.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs">
            {[
              { href: "/blog/compounded-glp1-safety-evidence", label: "Compounded medication safety" },
              { href: "/blog/understanding-compounded-medications", label: "What are compounded medications?" },
              { href: "/compare/compounded-vs-brand-glp1", label: "Compounded vs brand comparison" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="rounded-lg border border-navy-100/40 bg-white px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
                {link.label} &rarr;
              </Link>
            ))}
          </div>
          <div className="mt-8 rounded-xl bg-navy-50/30 p-4 text-xs leading-relaxed text-graphite-400">
            <strong>Important:</strong> {siteConfig.compliance.shortDisclaimer}
          </div>
        </SectionShell>
      </section>

      {/* ═══════════════════ 11. FAQ ═══════════════════ */}
      <section className="py-16">
        <SectionShell className="max-w-2xl">
          <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" />
          <div className="space-y-3">
            {pageFaqs.map((faq, i) => (
              <details key={i} className="group rounded-xl border border-navy-100/60 bg-white shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-semibold text-navy">
                  {faq.question}
                  <ArrowRight className="h-4 w-4 shrink-0 text-graphite-400 transition-transform duration-200 group-open:rotate-90" />
                </summary>
                <div className="px-4 pb-4 text-sm leading-relaxed text-graphite-500">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* ═══════════════════ 12. FURTHER READING ═══════════════════ */}
      <section className="py-12 border-t border-navy-100/40 bg-navy-50/30">
        <SectionShell>
          <p className="text-xs font-semibold uppercase tracking-wider text-graphite-400 mb-4">Further reading</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/semaglutide", tag: "Guide", title: "Semaglutide: Full Treatment Guide" },
              { href: "/tirzepatide", tag: "Guide", title: "Tirzepatide: Full Treatment Guide" },
              { href: "/blog/tirzepatide-vs-semaglutide-2026", tag: "Comparison", title: "Tirzepatide vs. Semaglutide in 2026" },
              { href: "/blog/managing-side-effects", tag: "Side Effects", title: "Managing GLP-1 Side Effects" },
              { href: "/blog/compounded-semaglutide-safety", tag: "Safety", title: "Is Compounded GLP-1 Safe?" },
              { href: "/blog/semaglutide-dosing-schedule-guide", tag: "Dosing", title: "GLP-1 Dosing Schedule Guide" },
              { href: "/glp1-cost", tag: "Cost", title: "GLP-1 Cost Without Insurance" },
              { href: "/eligibility", tag: "Eligibility", title: "Check Your Eligibility" },
            ].map(({ href, tag, title }) => (
              <Link key={href} href={href} className="group flex flex-col gap-2 rounded-xl border border-navy-100/60 bg-white p-4 shadow-sm hover:shadow-md hover:border-teal/40 transition-all">
                <span className="text-xs font-semibold uppercase tracking-wide text-teal">{tag}</span>
                <span className="text-sm font-medium text-navy leading-snug group-hover:text-teal transition-colors">{title}</span>
                <ArrowRight className="h-3.5 w-3.5 text-graphite-300 group-hover:text-teal mt-auto transition-colors" />
              </Link>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* ═══════════════════ 13. FINAL CTA ═══════════════════ */}
      <CtaSection />
    </MarketingShell>
  );
}
