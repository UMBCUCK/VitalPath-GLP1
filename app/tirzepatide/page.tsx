export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, Check, Shield, Clock, Star, TrendingDown,
  FlaskConical, Users, Award, AlertCircle, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { siteConfig } from "@/lib/site";
import { FAQPageJsonLd, BreadcrumbJsonLd, DrugJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Tirzepatide for Weight Loss | How It Works, Results, and Access",
  description:
    "Tirzepatide is the active ingredient in Zepbound and Mounjaro — a dual GIP/GLP-1 agonist that outperforms semaglutide in head-to-head trials. Learn how it works, what results to expect, and how to get started.",
  openGraph: {
    title: "Tirzepatide for Weight Loss | Nature's Journey",
    description:
      "A complete guide to tirzepatide — clinical data from the SURMOUNT trials, how it compares to semaglutide, dosing, side effects, and how to access it.",
  },
};

const results = [
  { stat: "~21%", label: "Average body weight lost in SURMOUNT-1 at max dose (72 weeks)" },
  { stat: "63%", label: "Of patients lost ≥20% body weight at 15mg dose" },
  { stat: "96%", label: "Of patients on tirzepatide outperformed placebo on weight loss" },
  { stat: "2,539", label: "Participants in the SURMOUNT-1 pivotal trial" },
];

const comparison = [
  { metric: "Average weight loss (max dose)", tirzepatide: "~21%", semaglutide: "~15%" },
  { metric: "Patients losing ≥20% body weight", tirzepatide: "63%", semaglutide: "33%" },
  { metric: "Mechanism", tirzepatide: "Dual GIP + GLP-1", semaglutide: "GLP-1 only" },
  { metric: "Injection frequency", tirzepatide: "Once weekly", semaglutide: "Once weekly" },
  { metric: "FDA approval (weight mgmt)", tirzepatide: "Zepbound (2023)", semaglutide: "Wegovy (2021)" },
  { metric: "Brand name (diabetes)", tirzepatide: "Mounjaro", semaglutide: "Ozempic" },
];

const doseSteps = [
  { dose: "2.5mg", duration: "Weeks 1–4", note: "Starting dose — body adjustment period, not therapeutic" },
  { dose: "5mg", duration: "Weeks 5–8", note: "First maintenance dose — most patients begin feeling meaningful appetite suppression" },
  { dose: "7.5mg", duration: "Weeks 9–12", note: "Mid-range dose — continued weight loss and tolerance assessment" },
  { dose: "10mg", duration: "Weeks 13–16", note: "Higher efficacy — many patients achieve significant results at this dose" },
  { dose: "12.5mg", duration: "Weeks 17–20", note: "Near-maximum dose range" },
  { dose: "15mg", duration: "Week 21+", note: "Maximum approved dose — associated with highest average weight loss in trials" },
];

const faqs = [
  {
    q: "Is tirzepatide better than semaglutide for weight loss?",
    a: "On average, yes — tirzepatide produces greater weight loss in clinical trials. SURMOUNT-1 showed average losses of 20.9% at 15mg versus approximately 15% for semaglutide in the STEP-1 trial. However, individual responses vary significantly. Some patients respond better to semaglutide; others to tirzepatide. Your provider will consider your history and medical profile in recommending one over the other.",
  },
  {
    q: "What is the difference between GIP and GLP-1?",
    a: "GLP-1 (glucagon-like peptide 1) and GIP (glucose-dependent insulinotropic polypeptide) are both gut hormones released after eating that regulate insulin and appetite. Tirzepatide activates both receptors simultaneously. The addition of GIP receptor agonism appears to amplify weight loss and metabolic effects beyond what GLP-1 alone produces — exactly how is still being studied.",
  },
  {
    q: "Is compounded tirzepatide available?",
    a: "Yes. Like semaglutide, tirzepatide was on the FDA shortage list, which permitted compounding pharmacies to produce it. Compounded tirzepatide is available through telehealth providers and offers significant cost savings over brand-name Zepbound or Mounjaro. Quality varies by pharmacy — sourcing from a 503B-registered outsourcing facility matters.",
  },
  {
    q: "What is Mounjaro vs Zepbound — same medication?",
    a: "Yes — both contain tirzepatide. Mounjaro is FDA-approved for type 2 diabetes management. Zepbound is FDA-approved specifically for weight management. The mechanism, molecule, and doses are identical. Zepbound's approval for weight management came in late 2023.",
  },
  {
    q: "How does tirzepatide work for insulin resistance and PCOS?",
    a: "Tirzepatide's dual mechanism provides particularly strong insulin-sensitizing effects. GIP receptor activation, combined with GLP-1's glucose regulation, produces significant improvements in insulin sensitivity that are relevant for patients with type 2 diabetes, prediabetes, and PCOS. Studies in PCOS patients show improvements in androgen levels and menstrual regularity alongside weight loss.",
  },
  {
    q: "How long does it take to see results on tirzepatide?",
    a: "The titration period (months 1–5) is largely about adjustment. Most patients see meaningful weight loss beginning at months 2–3 as doses reach therapeutic range. Maximum weight loss in clinical trials was observed between months 12 and 18 at the highest doses.",
  },
];

export default function TirzepatidePage() {
  const faqJsonLd = faqs.map((f) => ({ question: f.q, answer: f.a }));

  return (
    <MarketingShell>
      <DrugJsonLd
        name="Tirzepatide"
        alternateName="Zepbound, Mounjaro"
        description="A dual GIP and GLP-1 receptor agonist approved for chronic weight management (Zepbound) and type 2 diabetes (Mounjaro), administered as a once-weekly subcutaneous injection."
        url="/tirzepatide"
        administrationRoute="Subcutaneous injection"
        pregnancyCategory="Contraindicated during pregnancy"
      />
      <FAQPageJsonLd faqs={faqJsonLd} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Tirzepatide", href: "/tirzepatide" },
        ]}
      />
      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-white py-20">
        <SectionShell className="max-w-4xl text-center">
          <Badge variant="gold" className="mb-4 shadow-gold-glow">
            <Zap className="mr-1.5 h-3 w-3" />
            Dual GIP/GLP-1 Agonist
          </Badge>
          <h1 className="text-4xl font-bold text-navy sm:text-5xl lg:text-6xl">
            Tirzepatide for Weight Loss
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-graphite-500 leading-relaxed">
            The active ingredient in Zepbound and Mounjaro. The most effective weight loss medication
            in clinical trials — with average losses of 20% body weight over 72 weeks.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/qualify">
              <Button size="xl" className="gap-2 shadow-glow px-8">
                See If I Qualify <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="xl" className="px-8">
                View Plans &amp; Pricing
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-graphite-400">Provider evaluation required · Treatment not guaranteed</p>
        </SectionShell>
      </section>

      {/* Clinical stats */}
      <section className="border-y border-navy-100/40 bg-white py-12">
        <SectionShell>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {results.map((r) => (
              <div key={r.stat} className="text-center">
                <p className="text-3xl font-bold text-gold sm:text-4xl">{r.stat}</p>
                <p className="mt-2 text-sm text-graphite-500 leading-snug">{r.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-graphite-300">
            Data from SURMOUNT-1 trial (Jastreboff et al., NEJM 2022). Individual results vary.
          </p>
        </SectionShell>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <SectionShell className="max-w-3xl">
          <SectionHeading
            eyebrow="The Science"
            title="Why tirzepatide is different from other GLP-1 medications"
            description="The dual-agonist mechanism — and why it produces larger average weight loss."
          />
          <div className="mt-12 space-y-8 text-graphite-600 leading-relaxed">
            <div>
              <h3 className="text-lg font-bold text-navy mb-2">Two hormones, not one</h3>
              <p>
                Semaglutide works by activating GLP-1 receptors. Tirzepatide activates both GLP-1
                receptors and GIP (glucose-dependent insulinotropic polypeptide) receptors simultaneously.
                GIP is another gut hormone released after eating — it enhances the insulin response,
                regulates fat storage, and appears to amplify the appetite-suppressing effects of GLP-1
                when both are activated together.
              </p>
              <p className="mt-3">
                This dual mechanism is why tirzepatide produces larger average weight loss than semaglutide
                in clinical trials. The exact mechanisms are still being studied — the relationship between
                GIP and GLP-1 signaling is more complex than originally thought — but the clinical result
                is consistent across multiple trials.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy mb-2">Stronger insulin sensitivity effects</h3>
              <p>
                The combination of GIP and GLP-1 receptor activation produces significantly greater
                improvements in insulin sensitivity than GLP-1 alone. This is particularly relevant for
                patients with type 2 diabetes, prediabetes, or conditions like PCOS that involve
                insulin resistance. A1c reductions in tirzepatide diabetes trials have exceeded those
                seen with semaglutide in comparable populations.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy mb-2">What "21% body weight loss" actually means</h3>
              <p>
                At the highest dose (15mg) in SURMOUNT-1, the average weight loss was 20.9% of
                starting body weight over 72 weeks. For someone starting at 250 pounds, that&apos;s
                approximately 52 pounds. For someone starting at 200 pounds, roughly 42 pounds.
                These are averages across a diverse population with significant variation — some patients
                lost considerably more, others less. But the average effect size is genuinely unprecedented
                for a non-surgical weight loss intervention.
              </p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Comparison table */}
      <section className="py-20 bg-cloud/40">
        <SectionShell className="max-w-3xl">
          <SectionHeading
            eyebrow="Comparison"
            title="Tirzepatide vs Semaglutide"
            description="Key differences between the two leading GLP-1 medications."
          />
          <div className="mt-10 overflow-x-auto rounded-2xl border border-navy-100/60">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="p-2.5 sm:p-4 text-left text-xs sm:text-sm font-semibold">Metric</th>
                  <th className="p-2.5 sm:p-4 text-center text-xs sm:text-sm font-semibold text-gold">Tirzepatide</th>
                  <th className="p-2.5 sm:p-4 text-center text-xs sm:text-sm font-semibold text-teal-300">Semaglutide</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={row.metric} className={i % 2 === 0 ? "bg-white" : "bg-cloud/40"}>
                    <td className="p-2.5 sm:p-4 text-xs sm:text-sm font-medium text-navy">{row.metric}</td>
                    <td className="p-2.5 sm:p-4 text-center text-xs sm:text-sm text-graphite-600">{row.tirzepatide}</td>
                    <td className="p-2.5 sm:p-4 text-center text-xs sm:text-sm text-graphite-600">{row.semaglutide}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-graphite-400 text-center">
            Trial data comparison — SURMOUNT-1 (tirzepatide) vs STEP-1 (semaglutide). Note: not a head-to-head trial.
            Direct comparison trial (SURPASS-CVOT) ongoing.
          </p>
        </SectionShell>
      </section>

      {/* Dosing */}
      <section className="py-20 bg-white">
        <SectionShell className="max-w-3xl">
          <SectionHeading
            eyebrow="Dosing"
            title="The tirzepatide titration schedule"
            description="Six dose levels over 20+ weeks — the longest titration of any GLP-1 medication."
          />
          <div className="mt-10 space-y-3">
            {doseSteps.map((d, i) => (
              <div key={d.dose} className="flex items-start gap-4 rounded-xl border border-navy-100/60 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/10 text-sm font-bold text-gold">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-navy">{d.dose}</span>
                    <Badge variant="gold" className="text-xs">{d.duration}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-graphite-500">{d.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
            <p className="text-sm text-amber-800">
              Not all patients need to reach 15mg. Many achieve excellent results at 10mg or 12.5mg.
              Your provider will titrate based on your response and tolerability.
            </p>
          </div>
        </SectionShell>
      </section>

      {/* Who's a good candidate */}
      <section className="py-20 bg-cloud/40">
        <SectionShell className="max-w-3xl">
          <SectionHeading
            eyebrow="Candidacy"
            title="Is tirzepatide right for you?"
            description="Factors your provider will consider when evaluating tirzepatide specifically."
          />
          <div className="mt-10 space-y-4">
            <div className="rounded-xl border border-navy-100/60 bg-white p-5">
              <h3 className="font-semibold text-navy mb-2">Patients who may do especially well on tirzepatide</h3>
              <ul className="space-y-2 text-sm text-graphite-600">
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-teal shrink-0 mt-0.5" /> Type 2 diabetes or significant insulin resistance (strong dual glucose-lowering mechanism)</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-teal shrink-0 mt-0.5" /> PCOS with elevated androgen levels (significant insulin-sensitizing effect)</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-teal shrink-0 mt-0.5" /> Patients who tried semaglutide and had suboptimal response (some non-responders to GLP-1 alone respond to dual agonism)</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-teal shrink-0 mt-0.5" /> Higher BMI patients for whom the larger average effect size of tirzepatide is more relevant</li>
              </ul>
            </div>
            <div className="rounded-xl border border-navy-100/60 bg-white p-5">
              <h3 className="font-semibold text-navy mb-2">Same contraindications as semaglutide</h3>
              <p className="text-sm text-graphite-500 leading-relaxed">
                Tirzepatide shares the same primary contraindications: personal or family history of medullary
                thyroid carcinoma, Multiple Endocrine Neoplasia type 2 (MEN2), pregnancy, and severe
                gastroparesis. Your provider will review your complete medical history during evaluation.
              </p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <SectionShell className="max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Common questions about tirzepatide" />
          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-navy-100/60 bg-white">
                <summary className="flex cursor-pointer items-start justify-between gap-4 p-5 text-sm font-semibold text-navy list-none">
                  {faq.q}
                  <span className="ml-auto shrink-0 text-graphite-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="border-t border-navy-100/40 px-5 pb-5 pt-4">
                  <p className="text-sm text-graphite-600 leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Trust bar */}
      <section className="border-y border-navy-100/40 bg-white py-8">
        <SectionShell>
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-graphite-400">
            <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-teal" /> HIPAA Compliant</span>
            <span className="flex items-center gap-2"><Award className="h-4 w-4 text-teal" /> Licensed Medical Providers</span>
            <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-teal" /> Fast Provider Review</span>
            <span className="flex items-center gap-2"><Users className="h-4 w-4 text-teal" /> 18,000+ Patients</span>
            <span className="flex items-center gap-2">
              {[1,2,3,4,5].map((i) => <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />)}
              4.9/5 Rating
            </span>
          </div>
        </SectionShell>
      </section>

      <CtaSection />

      <section className="py-14 bg-navy-50/40 border-t border-navy-100/40">
        <SectionShell>
          <h2 className="text-xl font-bold text-navy mb-6 text-center">Further reading</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/blog/tirzepatide-vs-semaglutide-2026", tag: "Comparison", title: "Tirzepatide vs. Semaglutide: Which Is Better in 2026?" },
              { href: "/blog/tirzepatide-vs-ozempic-comparison", tag: "Comparison", title: "Tirzepatide vs. Ozempic — Head-to-Head Results" },
              { href: "/blog/tirzepatide-side-effects-week-by-week", tag: "Side Effects", title: "Tirzepatide Side Effects: Week-by-Week Breakdown" },
              { href: "/blog/semaglutide-dosing-schedule-guide", tag: "Dosing", title: "GLP-1 Dosing Schedule: What to Expect Each Week" },
              { href: "/blog/compounded-semaglutide-safety", tag: "Safety", title: "Is Compounded GLP-1 Medication Safe?" },
              { href: "/glp1-cost", tag: "Cost", title: "How Much Does Tirzepatide Cost Without Insurance?" },
              { href: "/blog/what-to-eat-on-semaglutide", tag: "Nutrition", title: "Best Foods to Eat While on GLP-1 Medication" },
              { href: "/eligibility", tag: "Eligibility", title: "Who Qualifies for GLP-1 Weight Loss Treatment?" },
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

      <section className="py-6 bg-white">
        <SectionShell>
          <p className="text-center text-xs text-graphite-300 leading-relaxed max-w-3xl mx-auto">
            {siteConfig.compliance.eligibilityDisclaimer} Tirzepatide clinical data referenced from the SURMOUNT-1 trial (Jastreboff et al., NEJM 2022). Individual results vary. Compounded tirzepatide is not FDA-approved.
          </p>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
