import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Scale, DollarSign, Users, Shield, Activity, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { CalculatorLeadCapture } from "@/components/calculators/calculator-lead-capture";
import { ViewContentTracker } from "@/components/shared/view-content-tracker";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "GLP-1 Weight Loss Program Comparisons (2026) | Nature's Journey vs Competitors",
  description:
    "Honest side-by-side comparisons of GLP-1 telehealth programs. Compare Nature's Journey vs Hims, Ro, WeightWatchers, and others on cost, clinical support, and medication access.",
  openGraph: {
    title: "GLP-1 Program Comparisons | Nature's Journey",
    description: "How does Nature's Journey compare to other GLP-1 programs? Side-by-side breakdowns on price, clinical support, and what's included.",
  },
};

const criteria = [
  {
    icon: DollarSign,
    title: "Monthly cost",
    description: "Total out-of-pocket — including medication, consultations, and any add-ons. Hidden fees matter.",
  },
  {
    icon: Activity,
    title: "Clinical outcomes",
    description: "Average weight loss backed by published data. Programs using the same medication can still produce different results.",
  },
  {
    icon: Users,
    title: "Provider access",
    description: "Are providers licensed physicians or PAs? How quickly do they respond? What happens if you have a side effect?",
  },
  {
    icon: Shield,
    title: "What's included",
    description: "Meal guidance, coaching, check-ins, calculators, and long-term maintenance support — not just medication.",
  },
];

const compareFaqs = [
  {
    question: "How is Nature's Journey different from Hims & Hers or Ro?",
    answer: "The main differences are clinical depth and support model. Hims and Ro operate primarily as prescription delivery platforms. Nature's Journey pairs medication with ongoing clinical oversight, personalized dose adjustments, nutrition guidance, and a patient dashboard — positioning it as a managed weight loss program rather than a prescription service.",
  },
  {
    question: "Is compounded semaglutide as safe as Ozempic or Wegovy?",
    answer: "Compounded semaglutide contains the same active molecule. The safety difference lies in sourcing — state-licensed 503A and 503B compounding pharmacies are regulated and inspected, while unregulated online sources are not. All medications prescribed through Nature's Journey are sourced from licensed pharmacies under provider supervision.",
  },
  {
    question: "How do GLP-1 telehealth programs compare to WeightWatchers?",
    answer: "WeightWatchers is a behavioral change program without prescription medication. GLP-1 programs address the neurological drivers of appetite and metabolic set point — producing 3–5× greater average weight loss in head-to-head comparisons. They serve different patients: GLP-1 is most appropriate for BMI ≥27 with a weight-related condition, or BMI ≥30.",
  },
  {
    question: "Is GLP-1 treatment worth it compared to bariatric surgery?",
    answer: "Bariatric surgery produces greater total weight loss (~25–35% of body weight) but carries significant surgical risk, recovery time, and lifelong dietary restrictions. GLP-1 produces 15–21% loss with a much better safety profile and is reversible. Most clinical guidelines now consider GLP-1 a first-line option before surgery for appropriate candidates.",
  },
];

export default async function ComparePage() {
  const comparisons = await db.comparisonPage.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <MarketingShell>
      <FAQPageJsonLd faqs={compareFaqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Compare Programs", href: "/compare" },
        ]}
      />
      {/* Tier 7.2 — retarget high-intent competitor searchers */}
      <ViewContentTracker contentName="Compare Programs Hub" contentCategory="compare" />

      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6">Comparisons</Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            How Nature&apos;s Journey compares to other GLP-1 programs
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">
            Honest, fact-based comparisons so you can evaluate your options with confidence.
            We include our own program in every comparison — where a competitor does something better, we say so.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-graphite-400">
            <span>{comparisons.length} programs compared</span>
            <span>&middot;</span>
            <span>Updated 2026</span>
            <span>&middot;</span>
            <span>Verified pricing data</span>
          </div>
        </SectionShell>
      </section>

      {/* What we evaluate */}
      <section className="py-14 border-b border-navy-100/40 bg-white">
        <SectionShell>
          <h2 className="text-xl font-bold text-navy mb-2 text-center">What we evaluate in every comparison</h2>
          <p className="text-graphite-500 text-center text-sm mb-8 max-w-xl mx-auto">
            Five criteria that actually predict long-term outcomes — not just the ones programs like to advertise.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {criteria.map((c) => (
              <div key={c.title} className="rounded-xl border border-navy-100/40 bg-cloud/30 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 mb-3">
                  <c.icon className="h-5 w-5 text-teal" />
                </div>
                <h3 className="text-sm font-bold text-navy">{c.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-graphite-500">{c.description}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Comparison cards */}
      <section className="py-16">
        <SectionShell>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {comparisons.map((page) => (
              <Link key={page.id} href={`/compare/${page.slug}`} className="group">
                <div className="flex flex-col h-full rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium transition-all hover:shadow-premium-lg hover:-translate-y-0.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50">
                    <Scale className="h-6 w-6 text-teal" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-navy group-hover:text-teal transition-colors">{page.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-graphite-500">{page.heroDescription || page.heroHeadline}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-teal">
                    Read comparison <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {comparisons.length === 0 && (
            <p className="py-12 text-center text-graphite-400">No comparisons published yet.</p>
          )}
        </SectionShell>
      </section>

      {/* Why GLP-1 first */}
      <section className="py-14 bg-premium-gradient">
        <SectionShell className="max-w-3xl">
          <h2 className="text-2xl font-bold text-navy mb-2 text-center">Why GLP-1 outperforms behavioral programs</h2>
          <p className="text-graphite-500 text-center text-sm mb-8">The mechanism difference — not marketing</p>
          <div className="space-y-3">
            {[
              "GLP-1 medications reduce hunger by acting on hypothalamic appetite centers — behavioral programs cannot replicate this neurological effect",
              "Average weight loss with semaglutide: 15–17% of body weight (STEP-1 trial). Average with diet + exercise alone: 2–4% sustained at 1 year",
              "GLP-1 treatment improves metabolic markers (blood pressure, triglycerides, A1C, insulin resistance) independent of weight loss",
              "STEP-4 trial: continued GLP-1 maintained 88% of weight loss vs 65% regain in placebo group — demonstrating true biological mechanism, not willpower",
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm">
                <Check className="h-4 w-4 text-teal shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed text-graphite-600">{point}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link href="/blog/semaglutide-vs-diet-exercise-alone" className="inline-flex items-center gap-1.5 rounded-full border border-sage/40 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-teal hover:text-teal transition-colors">
              GLP-1 vs Diet & Exercise Alone <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link href="/compare/glp1-vs-bariatric-surgery" className="inline-flex items-center gap-1.5 rounded-full border border-sage/40 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-teal hover:text-teal transition-colors">
              GLP-1 vs Bariatric Surgery <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link href="/glp1-cost" className="inline-flex items-center gap-1.5 rounded-full border border-sage/40 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-teal hover:text-teal transition-colors">
              Full Cost Breakdown <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </SectionShell>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white border-t border-navy-100/40">
        <SectionShell className="max-w-3xl">
          <h2 className="text-2xl font-bold text-navy mb-2 text-center">Common comparison questions</h2>
          <p className="text-graphite-500 text-center text-sm mb-8">Answers to the questions we hear most when people are evaluating programs</p>
          <div className="space-y-4">
            {compareFaqs.map((faq, i) => (
              <details key={i} className="group rounded-2xl border border-navy-100/40 bg-cloud/30 open:bg-white open:shadow-premium transition-all">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 text-sm font-semibold text-navy list-none">
                  {faq.question}
                  <ArrowRight className="h-4 w-4 shrink-0 text-graphite-400 transition-transform group-open:rotate-90" />
                </summary>
                <p className="px-6 pb-5 text-sm leading-relaxed text-graphite-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Tier 7.2 — lead capture for comparison-shoppers who aren't ready to
          commit to /qualify yet. We email them a personalized program
          recommendation and a competitor breakdown. */}
      <section className="py-10 bg-gradient-to-br from-teal-50/40 to-white border-t border-navy-100/40">
        <SectionShell className="max-w-2xl">
          <CalculatorLeadCapture
            source="compare_hub"
            headline="Still comparing? We'll email a side-by-side for your situation."
            subCopy="Tell us your email — we'll send a 1-page comparison of Nature's Journey vs the top GLP-1 programs for your BMI and state, plus our $50-off welcome code."
          />
        </SectionShell>
      </section>

      <CtaSection />
    </MarketingShell>
  );
}
