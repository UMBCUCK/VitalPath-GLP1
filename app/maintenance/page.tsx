export const dynamic = "force-static";

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, Shield, TrendingUp, Heart, Utensils, BarChart3, Users,
  Check, AlertCircle, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { CtaSection } from "@/components/marketing/cta-section";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { siteConfig } from "@/lib/site";
import { FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "GLP-1 Weight Loss Maintenance Program | Keeping Weight Off After Treatment",
  description:
    "The STEP-4 trial showed 2/3 of weight returns within a year of stopping semaglutide without a maintenance plan. Here's how VitalPath's maintenance program prevents that — and what the science says actually works.",
  openGraph: {
    title: "GLP-1 Maintenance Program: How to Keep the Weight Off | VitalPath",
    description:
      "Clinical data shows most people regain weight after stopping GLP-1 medication without a structured plan. VitalPath's maintenance program is built around the biology that makes keeping weight off hard.",
  },
};

const features = [
  {
    icon: TrendingUp,
    title: "Progress monitoring",
    description: "Continue tracking weight, measurements, and habits with the same tools you've been using. Your data history carries over seamlessly.",
  },
  {
    icon: Users,
    title: "Coaching support",
    description: "Regular check-ins with your health coach to navigate the transition, adjust strategies, and stay accountable during this critical phase.",
  },
  {
    icon: Utensils,
    title: "Adapted nutrition plans",
    description: "Meal plans adjust as your caloric needs change. Recipes and grocery lists recalibrated for maintenance-level nutrition.",
  },
  {
    icon: Heart,
    title: "Habit reinforcement",
    description: "Weekly focus modules shift from active weight loss to sustaining the habits that got you here. Built to prevent the common regression patterns.",
  },
  {
    icon: BarChart3,
    title: "Biomarker tracking",
    description: "Optional lab work coordination to monitor metabolic markers and ensure your health improvements are holding steady.",
  },
  {
    icon: Shield,
    title: "Provider oversight",
    description: "Your care team remains available for medication tapering guidance, dose adjustments, and clinical questions throughout the transition.",
  },
];

const pillarsOfMaintenance = [
  {
    number: "01",
    title: "Protein-anchored eating",
    body: "Maintaining 0.7–1g of protein per pound of goal body weight daily is the single most important dietary variable for preventing regain. High protein preserves muscle mass (which keeps resting TDEE higher), increases satiety, and reduces the thermal efficiency of calories consumed.",
  },
  {
    number: "02",
    title: "Resistance training as medicine",
    body: "Building and maintaining lean muscle is the most effective long-term metabolism lever. Resting metabolic rate scales with lean mass — people who maintain strength training after significant weight loss burn more calories at rest than those who don't.",
  },
  {
    number: "03",
    title: "Sleep and stress management",
    body: "Chronic sleep deprivation raises ghrelin (the hunger hormone) by 24% and lowers leptin (the satiety hormone) by 18%. These hormonal changes directly undermine maintenance. Sleep is not optional support — it's core biological infrastructure.",
  },
  {
    number: "04",
    title: "Provider-guided medication taper",
    body: "Many patients maintain results at a lower maintenance dose rather than stopping medication entirely. Your provider can help you find the minimum effective dose for maintenance — often significantly lower than the weight loss dose, with better tolerability and lower cost.",
  },
];

const faqs = [
  {
    q: "Do I have to stay on semaglutide forever to keep the weight off?",
    a: "Not necessarily — but the STEP-4 trial data is honest: without medication, about two-thirds of lost weight returns within 12 months for most people. However, some patients maintain results well after stopping. The key factors: how long you were on medication (longer treatment = more durable habit formation), what lifestyle infrastructure you've built during treatment, and whether an underlying metabolic condition (like PCOS or hypothyroidism) has been addressed. Many patients find a low maintenance dose is sufficient and significantly more affordable.",
  },
  {
    q: "When should I start thinking about maintenance?",
    a: "From day one, ideally. VitalPath's care approach builds maintenance habits in parallel with active weight loss — not as an afterthought when you're near your goal. The resistance training, protein targets, and sleep habits you build during the active phase are the foundation for maintenance. Starting to think about it only when you're about to stop medication is too late.",
  },
  {
    q: "What's the lowest dose I can maintain on?",
    a: "This is individual and needs to be worked out with your provider. Some patients maintain results on 0.5mg semaglutide weekly (about a third of the maximum weight loss dose). Others find 1.0mg is needed. Tirzepatide patients sometimes maintain on 5–7.5mg. There's no universal answer — your provider will help you find the minimum effective dose through gradual reduction while monitoring weight trends.",
  },
  {
    q: "Is weight regain inevitable if I stop GLP-1 medication?",
    a: "Not inevitable, but statistically probable without intentional planning. The patients who maintain results after stopping share specific characteristics: they built genuine lifestyle habits (not just followed meal plans during treatment), they maintained or increased resistance training, they kept protein high, and they addressed any underlying conditions that contributed to weight gain. The medication window is most valuable as a habit-building period, not just a weight loss intervention.",
  },
  {
    q: "What's different about VitalPath's maintenance program vs just stopping treatment?",
    a: "The maintenance program includes continued provider access for medication tapering guidance, adapted nutrition plans calibrated for your new maintenance caloric needs (which are different from both your pre-treatment baseline and your active weight loss phase), ongoing body composition monitoring, and coaching focused specifically on the psychological and behavioral challenges of the transition. Most of the structural support continues — the focus shifts from losing to holding.",
  },
];

export default function MaintenancePage() {
  const faqJsonLd = faqs.map((f) => ({ question: f.q, answer: f.a }));

  return (
    <MarketingShell>
      <FAQPageJsonLd faqs={faqJsonLd} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Maintenance Program", href: "/maintenance" },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="gold" className="mb-6">Maintenance Program</Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl lg:text-6xl">
            Losing weight is the hard part. Keeping it off is harder.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500 leading-relaxed">
            The STEP-4 trial showed that most people regain the majority of lost weight within a year of stopping GLP-1 medication — without a plan. VitalPath&apos;s maintenance program is built around the biology of what actually prevents that.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/qualify">
              <Button size="xl" className="gap-2 px-10">
                Start with Maintenance in Mind <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-graphite-400">Free assessment · No commitment</p>
          </div>
        </SectionShell>
      </section>

      {/* The clinical reality */}
      <section className="border-y border-navy-100/40 bg-white py-12">
        <SectionShell>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-graphite-300 mb-4">The STEP-4 Trial</p>
              <h2 className="text-2xl font-bold text-navy sm:text-3xl">
                What the withdrawal data actually shows
              </h2>
              <p className="mt-4 text-graphite-600 leading-relaxed">
                The STEP-4 trial (Wilding et al., NEJM 2022) was designed specifically to answer the maintenance question. After 20 weeks on semaglutide, participants either continued or were randomized to placebo. The results were stark: the withdrawal group regained approximately <strong>two-thirds of lost weight</strong> over the following 48 weeks.
              </p>
              <p className="mt-4 text-graphite-600 leading-relaxed">
                This is not a medication failure. It&apos;s the underlying biology of obesity reasserting itself when the hormonal compensation of GLP-1 is removed. Ghrelin rises. Leptin signaling returns to prior patterns. The defended weight set point begins pulling back toward its original position.
              </p>
              <p className="mt-4 text-graphite-600 leading-relaxed">
                The question isn&apos;t whether regain happens — it&apos;s how much, and what structural factors determine who maintains more.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { stat: "~2/3", label: "Weight regained within 12 months of stopping", color: "border-amber-200 bg-amber-50/40 text-amber-700" },
                { stat: "~1/3", label: "Weight maintained at 12 months post-discontinuation", color: "border-teal/20 bg-teal-50/30 text-teal" },
                { stat: "48 wks", label: "Follow-up period in STEP-4 withdrawal study", color: "border-navy-100/40 bg-cloud/30 text-graphite-500" },
                { stat: "Better", label: "Biomarkers vs baseline even with partial regain", color: "border-teal/20 bg-teal-50/30 text-teal" },
              ].map((item) => (
                <div key={item.label} className={`rounded-2xl border p-5 text-center ${item.color}`}>
                  <p className="text-3xl font-bold">{item.stat}</p>
                  <p className="mt-1 text-xs leading-relaxed">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 text-xs text-graphite-300">
            Source: Wilding JPH, et al. Weight regain and cardiometabolic effects after withdrawal of semaglutide. Diabetes Obes Metab. 2022.
          </div>
        </SectionShell>
      </section>

      {/* Four pillars */}
      <section className="py-20">
        <SectionShell>
          <SectionHeading
            eyebrow="The Science of Maintenance"
            title="What actually determines whether weight stays off"
            description="Four evidence-based pillars that differentiate patients who maintain results from those who regain — independent of whether they stay on medication."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {pillarsOfMaintenance.map((pillar) => (
              <div key={pillar.number} className="flex gap-5 rounded-2xl border border-navy-100/40 bg-white p-6 shadow-premium">
                <span className="text-3xl font-bold text-navy/20 leading-none shrink-0">{pillar.number}</span>
                <div>
                  <h3 className="font-bold text-navy">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-graphite-600">{pillar.body}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* What's included */}
      <section className="bg-gradient-to-b from-sage/10 to-white py-20">
        <SectionShell>
          <SectionHeading
            eyebrow="What's Included"
            title="Support that evolves with you"
            description="Maintenance isn't the end of your program — it's the phase where habits become permanent."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-navy-100/40 bg-white p-6 shadow-premium">
                <f.icon className="h-6 w-6 text-teal" />
                <h3 className="mt-4 text-base font-bold text-navy">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite-500">{f.description}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Maintenance timeline */}
      <section className="py-16 bg-white">
        <SectionShell>
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="How It Works"
              title="The maintenance transition timeline"
              align="left"
            />
            <div className="mt-8 space-y-6">
              {[
                {
                  phase: "Months 1–3 of treatment",
                  focus: "Build foundation habits",
                  actions: ["Establish protein targets and hit them consistently", "Begin or increase resistance training", "Optimize sleep routine"],
                  note: "Maintenance thinking starts here — habits built now determine outcomes later.",
                },
                {
                  phase: "Months 4–9 of treatment",
                  focus: "Weight loss + habit reinforcement",
                  actions: ["Track body composition, not just scale weight", "Expand recipe and nutrition fluency", "Identify and address any metabolic barriers"],
                  note: "The longer you maintain habits at therapeutic dose, the more durable they become.",
                },
                {
                  phase: "Months 9–12 of treatment",
                  focus: "Transition planning",
                  actions: ["Work with provider on dose taper options", "Shift coaching focus to maintenance psychology", "Establish goal weight maintenance range (+/- 5 lbs)"],
                  note: "Provider-guided taper vs. abrupt stop produces meaningfully different outcomes.",
                },
                {
                  phase: "Maintenance phase",
                  focus: "Long-term sustainability",
                  actions: ["Continue quarterly check-ins with care team", "Adjust nutrition plan to maintenance calories", "Monitor and respond to early drift signals"],
                  note: "Most regain happens in months 3–9 post-discontinuation. Early detection matters.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal text-white text-xs font-bold">
                      {i + 1}
                    </div>
                    {i < 3 && <div className="mt-2 h-full w-px bg-teal/20" />}
                  </div>
                  <div className="pb-6">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold uppercase tracking-widest text-graphite-300">{item.phase}</span>
                      <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal">{item.focus}</span>
                    </div>
                    <ul className="mt-3 space-y-1">
                      {item.actions.map((action) => (
                        <li key={action} className="flex items-start gap-2 text-sm text-graphite-600">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
                          {action}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-cloud/50 px-3 py-2">
                      <Clock className="mt-0.5 h-3 w-3 shrink-0 text-graphite-300" />
                      <p className="text-xs text-graphite-400">{item.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Built into every plan */}
      <section className="bg-gradient-to-b from-cloud to-white py-12">
        <SectionShell>
          <div className="mx-auto max-w-2xl rounded-2xl border border-teal/20 bg-gradient-to-r from-teal-50/30 to-white p-8 text-center shadow-premium">
            <AlertCircle className="h-8 w-8 text-teal mx-auto mb-4" />
            <h2 className="text-xl font-bold text-navy">Built into every plan from day one</h2>
            <p className="mt-3 text-sm leading-relaxed text-graphite-600">
              Maintenance transition planning is included in VitalPath&apos;s Premium and Complete plans from the start — not added on at the end. Your care team discusses maintenance strategy at your first provider visit and continues throughout treatment.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/pricing">
                <Button variant="outline" className="gap-2">View Plans <ArrowRight className="h-4 w-4" /></Button>
              </Link>
              <Link href="/qualify">
                <Button className="gap-2">See if I Qualify <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20">
        <SectionShell>
          <SectionHeading
            eyebrow="Common Questions"
            title="About maintenance and staying on track"
            description="Honest answers to the questions most people have about what happens after active weight loss."
          />
          <div className="mx-auto mt-12 max-w-3xl divide-y divide-navy-100/40">
            {faqs.map((item) => (
              <div key={item.q} className="py-6">
                <h3 className="font-bold text-navy">{item.q}</h3>
                <p className="mt-3 text-sm leading-relaxed text-graphite-600">{item.a}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      <CtaSection />

      <section className="py-8 border-t border-navy-100/40">
        <SectionShell>
          <p className="mx-auto max-w-3xl text-center text-xs text-graphite-300 leading-relaxed">
            {siteConfig.compliance.shortDisclaimer} Clinical data cited from published peer-reviewed research including the STEP-4 withdrawal trial. Individual results vary. Treatment eligibility determined by a licensed medical provider.
          </p>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
