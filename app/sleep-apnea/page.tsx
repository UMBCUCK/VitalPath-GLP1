export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Shield,
  Moon,
  Activity,
  Users,
  AlertCircle,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { siteConfig } from "@/lib/site";
import { FAQPageJsonLd, MedicalConditionJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "GLP-1 Medication for Sleep Apnea & Weight Loss | VitalPath",
  description:
    "GLP-1 medications like tirzepatide are now FDA-approved to treat obesity-related sleep apnea. Clinical trials show significant AHI reduction with weight loss. Get evaluated online.",
  openGraph: {
    title: "GLP-1 Medication for Sleep Apnea & Weight Loss | VitalPath",
    description:
      "GLP-1 medications like tirzepatide are now FDA-approved to treat obesity-related sleep apnea. Clinical trials show significant AHI reduction with weight loss. Get evaluated online.",
  },
};

const stats = [
  { stat: "63%", label: "Reduction in AHI events (tirzepatide, SURMOUNT-OSA trial)" },
  { stat: "FDA approved", label: "2024 — first drug ever approved specifically for OSA" },
  { stat: "~20%", label: "Body weight loss achieved in SURMOUNT-OSA trials" },
  { stat: "Root cause", label: "Treats obesity-related OSA, not just symptoms" },
];

const mechanisms = [
  {
    icon: Moon,
    title: "Airway anatomy changes",
    description:
      "Excess fat deposits around the throat and neck narrow the upper airway during sleep, causing the repetitive collapse that defines obstructive sleep apnea. As GLP-1 treatment reduces overall body fat — particularly visceral and neck fat — the airway widens. This mechanical change directly reduces the number of apnea and hypopnea events per hour, the measure captured by the apnea-hypopnea index (AHI).",
  },
  {
    icon: Activity,
    title: "Inflammation reduction",
    description:
      "Adipose tissue — especially visceral fat — is metabolically active and secretes pro-inflammatory cytokines including TNF-α, IL-6, and leptin. These inflammatory mediators increase upper airway muscle instability and reduce the arousal threshold that protects against complete airway obstruction. GLP-1 medications reduce circulating inflammatory markers significantly, contributing to improved airway muscle tone and reduced OSA severity beyond what weight loss alone predicts.",
  },
  {
    icon: TrendingDown,
    title: "Direct GLP-1 receptor effects on breathing",
    description:
      "GLP-1 receptors are present in brainstem regions that regulate breathing, including the nucleus tractus solitarius. Pre-clinical data suggests direct GLP-1 receptor activation may improve ventilatory control and reduce the loop gain (respiratory instability) that amplifies obstructive events. This may partly explain why improvements in OSA in the SURMOUNT-OSA trials exceeded what would be predicted by weight loss alone.",
  },
];

const faqs = [
  {
    question: "Is GLP-1 medication FDA-approved for sleep apnea?",
    answer:
      "Yes. In June 2024, the FDA approved tirzepatide (Zepbound) for the treatment of moderate-to-severe obstructive sleep apnea (OSA) in adults with obesity. This was the first drug ever approved specifically for OSA. The approval was based on the SURMOUNT-OSA trials showing 63% reduction in apnea-hypopnea index (AHI) events.",
  },
  {
    question: "Do I need to stop using my CPAP machine if I start GLP-1 treatment?",
    answer:
      "No — never stop prescribed sleep apnea treatment without your provider's guidance. GLP-1 treatment and CPAP therapy can be used simultaneously. As weight loss progresses, your sleep specialist may recommend a reassessment of your CPAP settings or whether CPAP is still needed. Many patients experience significant improvement in OSA severity.",
  },
  {
    question: "How much does sleep apnea improve with GLP-1 weight loss?",
    answer:
      "The SURMOUNT-OSA trials showed tirzepatide reduced AHI events by an average of 63% in patients not using PAP therapy. In patients using PAP therapy, the reduction was similar. Some patients achieved complete resolution of sleep apnea. The magnitude of improvement correlated strongly with the degree of weight loss achieved.",
  },
  {
    question: "Can I qualify for GLP-1 treatment if I have sleep apnea but my BMI is between 27-30?",
    answer:
      "Yes. Sleep apnea is a weight-related comorbidity that qualifies adults with BMI 27+ for GLP-1 treatment per FDA labeling. A licensed medical provider will evaluate your eligibility based on your full health history, including sleep apnea diagnosis and BMI.",
  },
];

const furtherReading = [
  { label: "Is Semaglutide Safe Long-Term?", href: "/blog/is-semaglutide-safe-long-term", tag: "Safety" },
  { label: "Tirzepatide vs Semaglutide (2026)", href: "/blog/tirzepatide-vs-semaglutide-2026", tag: "Comparison" },
  { label: "Semaglutide: First 3 Months", href: "/blog/semaglutide-timeline-first-3-months", tag: "Timeline" },
  { label: "Obesity & GLP-1 Treatment", href: "/obesity", tag: "Condition" },
  { label: "GLP-1 & Heart Health", href: "/heart-health", tag: "Condition" },
  { label: "GLP-1 for Adults Over 50", href: "/over-50", tag: "Condition" },
  { label: "GLP-1 Cost & Coverage", href: "/glp1-cost", tag: "Cost" },
  { label: "Eligibility Requirements", href: "/eligibility", tag: "Eligibility" },
];

export default function SleepApneaPage() {
  return (
    <MarketingShell>
      <MedicalConditionJsonLd
        name="Obstructive Sleep Apnea"
        description="Obstructive sleep apnea (OSA) is a condition in which excess weight causes repeated airway collapse during sleep, resulting in disrupted breathing and reduced oxygen levels."
        url="/sleep-apnea"
        possibleTreatment="GLP-1 receptor agonist therapy — tirzepatide FDA-approved for moderate-to-severe OSA in adults with obesity (June 2024)"
      />
      <FAQPageJsonLd faqs={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Sleep Apnea & Obesity", href: "/sleep-apnea" },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6">FDA-Approved for Sleep Apnea</Badge>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-navy sm:text-5xl lg:text-6xl">
            Treating sleep apnea through weight loss
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500 leading-relaxed">
            In June 2024, the FDA approved tirzepatide (Zepbound) as the first medication ever
            specifically indicated for moderate-to-severe obstructive sleep apnea in adults with
            obesity. Clinical trials showed a 63% reduction in apnea events — and some patients
            achieved complete resolution. GLP-1 treatment addresses the root cause, not just the
            symptoms.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/qualify">
              <Button size="xl" className="gap-2 px-10">
                See if I Qualify <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-graphite-400">2-minute assessment · No commitment</p>
          </div>
        </SectionShell>
      </section>

      {/* Stats bar */}
      <section className="border-y border-navy-100/40 bg-white py-10">
        <SectionShell>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-teal">{s.stat}</div>
                <div className="mt-1 text-sm text-graphite-500">{s.label}</div>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* How weight loss treats sleep apnea */}
      <section className="py-20">
        <SectionShell>
          <SectionHeading
            eyebrow="Mechanisms"
            title="How weight loss treats sleep apnea"
            description="Obstructive sleep apnea in people with obesity isn't just correlated with weight — it's caused by it. GLP-1 treatment acts on three distinct pathways to reduce OSA severity."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {mechanisms.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-navy-100/40 bg-white p-6 shadow-premium"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10">
                  <item.icon className="h-5 w-5 text-teal" />
                </div>
                <h3 className="font-bold text-navy mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed text-graphite-600">{item.description}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* What the research shows */}
      <section className="bg-teal-50/30 py-20">
        <SectionShell>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Clinical Evidence"
                title="What the research shows"
                description="The SURMOUNT-OSA trials are the largest and most rigorous clinical evidence ever assembled specifically for a drug treatment of obstructive sleep apnea."
                align="left"
              />
              <div className="mt-8 space-y-5 text-graphite-600 leading-relaxed text-sm">
                <p>
                  The <strong className="text-navy">SURMOUNT-OSA program</strong> consisted of two
                  parallel Phase 3 randomized controlled trials — one in patients not using PAP
                  therapy, and one in patients who were using PAP therapy concurrently. Both trials
                  evaluated tirzepatide (the dual GIP/GLP-1 receptor agonist) versus placebo over
                  52 weeks in adults with moderate-to-severe OSA and obesity.
                </p>
                <p>
                  <strong className="text-navy">Primary results:</strong> In the non-PAP trial,
                  tirzepatide reduced the apnea-hypopnea index (AHI) by a mean of 27.4 events per
                  hour — a 63% reduction from baseline — compared to 4.8 events per hour in the
                  placebo group. In the PAP-using trial, reductions were similarly robust.
                </p>
                <p>
                  <strong className="text-navy">Complete resolution:</strong> A meaningful
                  proportion of tirzepatide-treated patients achieved AHI below the threshold for
                  mild sleep apnea (&lt;5 events/hour), representing effective clinical resolution
                  of their OSA. This was virtually unheard of with prior pharmacological
                  interventions.
                </p>
                <p>
                  <strong className="text-navy">Weight loss achieved:</strong> Participants lost
                  approximately 18–20% of body weight over 52 weeks. The magnitude of AHI
                  improvement tracked closely with weight loss, confirming obesity as the primary
                  driver of OSA severity in this population.
                </p>
                <p>
                  <strong className="text-navy">Additional improvements:</strong> Patients also
                  showed significant improvements in hypoxic burden (time spent at low oxygen
                  saturation), patient-reported sleep quality, and inflammatory markers — all
                  independently associated with cardiovascular and metabolic risk.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-teal/20 bg-white p-8 shadow-premium">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="h-5 w-5 text-teal" />
                <h3 className="font-bold text-navy">SURMOUNT-OSA: key results</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-navy-100/30 pb-3">
                  <span className="text-sm text-graphite-600">AHI reduction (non-PAP group)</span>
                  <span className="text-sm font-bold text-teal">−63%</span>
                </div>
                <div className="flex items-center justify-between border-b border-navy-100/30 pb-3">
                  <span className="text-sm text-graphite-600">AHI reduction (PAP group)</span>
                  <span className="text-sm font-bold text-teal">~63%</span>
                </div>
                <div className="flex items-center justify-between border-b border-navy-100/30 pb-3">
                  <span className="text-sm text-graphite-600">Body weight reduction</span>
                  <span className="text-sm font-bold text-teal">18–20%</span>
                </div>
                <div className="flex items-center justify-between border-b border-navy-100/30 pb-3">
                  <span className="text-sm text-graphite-600">Patients achieving OSA resolution</span>
                  <span className="text-sm font-bold text-teal">Significant proportion</span>
                </div>
                <div className="flex items-center justify-between border-b border-navy-100/30 pb-3">
                  <span className="text-sm text-graphite-600">Trial duration</span>
                  <span className="text-sm font-bold text-teal">52 weeks</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-graphite-600">FDA approval (OSA indication)</span>
                  <span className="text-sm font-bold text-teal">June 2024</span>
                </div>
              </div>
              <div className="mt-5 rounded-xl bg-teal-50 px-4 py-3">
                <p className="text-xs text-teal-700 font-medium">
                  <Check className="inline h-3.5 w-3.5 mr-1" />
                  Source: Malhotra A, et al. NEJM 2024 (SURMOUNT-OSA). Tirzepatide (Zepbound) FDA
                  approval June 21, 2024 for OSA with obesity.
                </p>
              </div>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Safety callout */}
      <section className="py-12">
        <SectionShell>
          <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <h3 className="font-bold text-navy text-sm">If you have diagnosed sleep apnea</h3>
                <ul className="mt-2 space-y-1.5 text-xs text-graphite-600 leading-relaxed">
                  <li>• Do not stop CPAP or other prescribed PAP therapy without your sleep specialist's guidance. GLP-1 treatment and PAP therapy are complementary, not mutually exclusive.</li>
                  <li>• As your weight decreases, CPAP pressure settings may need adjustment — work with your sleep specialist to monitor and reassess.</li>
                  <li>• Share your sleep apnea diagnosis with your VitalPath provider during intake. It is a qualifying comorbidity for treatment and relevant to your clinical plan.</li>
                </ul>
              </div>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* FAQ */}
      <section className="bg-gradient-to-b from-sage/10 to-white py-20">
        <SectionShell>
          <SectionHeading
            eyebrow="Common Questions"
            title="Sleep apnea questions, answered"
            description="Straightforward answers to what patients with sleep apnea actually ask about GLP-1 treatment."
          />
          <div className="mx-auto mt-12 max-w-3xl divide-y divide-navy-100/40">
            {faqs.map((item) => (
              <div key={item.question} className="py-6">
                <h3 className="font-bold text-navy">{item.question}</h3>
                <p className="mt-3 text-sm leading-relaxed text-graphite-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Trust signals */}
      <section className="py-12 border-t border-navy-100/40">
        <SectionShell>
          <div className="grid gap-6 sm:grid-cols-3 text-center">
            <div className="flex flex-col items-center gap-2">
              <Shield className="h-8 w-8 text-teal" />
              <h3 className="font-bold text-navy text-sm">HIPAA-compliant care</h3>
              <p className="text-xs text-graphite-500">Your health data is encrypted and protected</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Moon className="h-8 w-8 text-teal" />
              <h3 className="font-bold text-navy text-sm">Sleep apnea-aware intake</h3>
              <p className="text-xs text-graphite-500">OSA history reviewed as part of every evaluation</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Users className="h-8 w-8 text-teal" />
              <h3 className="font-bold text-navy text-sm">Licensed providers</h3>
              <p className="text-xs text-graphite-500">Board-certified physicians evaluate every patient</p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Further reading */}
      <section className="py-12 bg-cloud/40 border-y border-sage/20">
        <SectionShell>
          <h2 className="text-lg font-semibold text-navy mb-2">Further reading</h2>
          <p className="text-sm text-graphite-500 mb-6">
            Clinical evidence and practical guides for GLP-1 and sleep apnea
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {furtherReading.map((article) => (
              <Link
                key={article.href}
                href={article.href}
                className="group flex items-start justify-between gap-2 rounded-xl border border-navy-100/40 bg-white p-4 hover:border-teal/30 hover:shadow-premium transition-all"
              >
                <div>
                  <span className="text-xs font-medium text-teal">{article.tag}</span>
                  <p className="mt-0.5 text-sm font-medium text-navy group-hover:text-teal transition-colors leading-snug">
                    {article.label}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-graphite-300 group-hover:text-teal transition-colors mt-0.5" />
              </Link>
            ))}
          </div>
        </SectionShell>
      </section>

      <CtaSection />

      <section className="py-8 border-t border-navy-100/40">
        <SectionShell>
          <p className="mx-auto max-w-3xl text-center text-xs text-graphite-300 leading-relaxed">
            {siteConfig.compliance.shortDisclaimer} Clinical data cited from published peer-reviewed
            research including Malhotra A et al., NEJM 2024 (SURMOUNT-OSA trials). Tirzepatide
            (Zepbound) FDA-approved for moderate-to-severe OSA with obesity June 2024. Individual
            results vary. Treatment eligibility determined by a licensed medical provider. Do not
            discontinue any prescribed sleep apnea therapy without consulting your physician or
            sleep specialist.
          </p>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
