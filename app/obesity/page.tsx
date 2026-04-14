export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Shield,
  TrendingDown,
  Scale,
  Users,
  Stethoscope,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { MedicalConditionJsonLd, BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "GLP-1 Medication for Obesity | FDA-Approved Weight Loss Treatment | Nature's Journey",
  description:
    "GLP-1 medications are FDA-approved for obesity (BMI 30+). Semaglutide and tirzepatide produce 15-22% total body weight loss in clinical trials. Get provider-evaluated treatment online.",
  openGraph: {
    title: "GLP-1 Medication for Obesity | FDA-Approved Weight Loss Treatment | Nature's Journey",
    description:
      "GLP-1 medications are FDA-approved for obesity (BMI 30+). Semaglutide and tirzepatide produce 15-22% total body weight loss in clinical trials. Get provider-evaluated treatment online.",
  },
};

const stats = [
  { stat: "~21%", label: "Avg weight loss with tirzepatide (SURMOUNT-1 trial, max dose)" },
  { stat: "FDA-approved", label: "For adults with BMI 30+ for chronic weight management" },
  { stat: "18,000+", label: "Members served" },
  { stat: "Board-certified", label: "Physicians evaluate every patient" },
];

const mechanismCards = [
  {
    icon: TrendingDown,
    title: "Appetite regulation",
    description:
      "GLP-1 receptors in the hypothalamus modulate hunger and satiety signals. GLP-1 agonists reduce appetite by slowing gastric emptying and activating hypothalamic satiety centers — reducing both meal-time hunger and between-meal cravings. In clinical practice this translates to eating less without willpower-dependent restriction.",
  },
  {
    icon: Scale,
    title: "Metabolic adaptation",
    description:
      "Conventional caloric restriction triggers compensatory metabolic slowing — the body reduces energy expenditure as weight falls. GLP-1 medications appear to partially blunt this adaptation, allowing sustained weight loss without the metabolic compensation that causes plateau and regain in traditional dieting.",
  },
  {
    icon: Stethoscope,
    title: "Insulin sensitivity",
    description:
      "Obesity-driven insulin resistance creates a self-reinforcing cycle of fat storage and metabolic dysfunction. GLP-1 agonists improve insulin sensitivity both through weight loss and through direct metabolic effects on liver and muscle tissue — breaking this cycle and improving overall metabolic health alongside weight.",
  },
];

const trialData = [
  {
    trial: "STEP-1",
    drug: "Semaglutide 2.4mg weekly",
    result: "15% average total body weight loss",
    detail:
      "Adults with obesity (BMI ≥30) or overweight (BMI ≥27) with a weight-related comorbidity. 68-week trial. 1,961 participants. Published NEJM 2021 (Wilding JP et al.).",
  },
  {
    trial: "SURMOUNT-1",
    drug: "Tirzepatide 5/10/15mg weekly",
    result: "15–21% average total body weight loss",
    detail:
      "Adults with obesity (BMI ≥30) or overweight (BMI ≥27) with a comorbidity. 72-week trial. 2,519 participants. Max-dose (15mg) arm achieved 21% average loss. Published NEJM 2022 (Jastreboff AM et al.).",
  },
];

const qualifiesCriteria = [
  "BMI of 30 or higher (obesity classification)",
  "BMI of 27 or higher with at least one weight-related comorbidity",
  "Weight-related comorbidities include: type 2 diabetes, hypertension, dyslipidemia, sleep apnea, or cardiovascular disease",
  "No personal or family history of medullary thyroid carcinoma (MTC) or MEN2 syndrome",
  "No history of pancreatitis requiring careful provider evaluation",
  "Final eligibility determined by a licensed medical provider reviewing your complete health history",
];

const faqs = [
  {
    q: "Is GLP-1 medication FDA-approved for obesity?",
    a: "Yes. Semaglutide (brand name Wegovy) received FDA approval in 2021 for chronic weight management in adults with a BMI of 30 or higher, or 27+ with a weight-related condition. Tirzepatide (brand name Zepbound) received FDA approval in 2023 for the same indications. Nature's Journey uses compounded versions of these active ingredients at significantly lower cost.",
  },
  {
    q: "What BMI is required to get GLP-1 medication for obesity?",
    a: "FDA labeling specifies BMI ≥30 for obesity treatment, or BMI ≥27 with at least one weight-related comorbidity (type 2 diabetes, hypertension, dyslipidemia, sleep apnea, or cardiovascular disease). Eligibility is ultimately determined by a licensed medical provider reviewing your full health history.",
  },
  {
    q: "How much weight can someone with obesity lose on GLP-1 medication?",
    a: "Clinical trials show that adults with obesity lose an average of 15% (semaglutide, STEP-1 trial) to 21% (tirzepatide at max dose, SURMOUNT-1 trial) of their starting body weight over approximately 68-72 weeks. For someone starting at 280 lbs, that's 42-59 lbs on average. Individual results vary significantly.",
  },
  {
    q: "Is obesity a medical condition that warrants medication?",
    a: "Yes. The American Medical Association, the Obesity Society, and major medical organizations recognize obesity as a chronic disease requiring long-term medical management. GLP-1 medications are now considered first-line pharmacological treatment for obesity by most major clinical guidelines.",
  },
];

const furtherReading = [
  { label: "GLP-1 Weight Loss Timeline: First 3 Months", href: "/blog/semaglutide-timeline-first-3-months", tag: "Timeline" },
  { label: "Tirzepatide vs Semaglutide: 2026 Comparison", href: "/blog/tirzepatide-vs-semaglutide-2026", tag: "Comparison" },
  { label: "Is Semaglutide Safe Long-Term?", href: "/blog/is-semaglutide-safe-long-term", tag: "Safety" },
  { label: "What to Eat on Semaglutide", href: "/blog/what-to-eat-on-semaglutide", tag: "Nutrition" },
  { label: "Compounded Semaglutide Safety", href: "/blog/compounded-semaglutide-safety", tag: "Safety" },
  { label: "GLP-1 Cost & Insurance Guide", href: "/glp1-cost", tag: "Cost" },
  { label: "Check Your Eligibility", href: "/eligibility", tag: "Eligibility" },
  { label: "Real Patient Results", href: "/results", tag: "Results" },
];

export default function ObesityPage() {
  return (
    <MarketingShell>
      <MedicalConditionJsonLd
        name="Obesity"
        alternateName="Class I, II, and III Obesity"
        description="A chronic disease characterized by excess body fat accumulation (BMI ≥30) that presents a risk to health, recognized by major medical organizations as requiring long-term medical management."
        url="/obesity"
        possibleTreatment="GLP-1 receptor agonist therapy, semaglutide, tirzepatide"
      />
      <FAQPageJsonLd faqs={faqs.map((f) => ({ question: f.q, answer: f.a }))} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Obesity", href: "/obesity" },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6">FDA-Approved Obesity Treatment</Badge>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-navy sm:text-5xl lg:text-6xl">
            GLP-1 treatment for obesity: FDA-approved medication with 15–22% weight loss in clinical trials
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500 leading-relaxed">
            Semaglutide and tirzepatide are the first medications to produce meaningful, sustained weight loss in people with obesity. The STEP and SURMOUNT trials established a new standard — these are not appetite suppressants, they are metabolic treatments that address the biology of obesity directly.
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

      {/* How GLP-1 treats obesity */}
      <section className="bg-teal-50/30 py-20">
        <SectionShell>
          <SectionHeading
            eyebrow="Mechanism"
            title="How GLP-1 treats obesity"
            description="GLP-1 medications do not work through willpower or restriction — they change the metabolic environment that drives obesity in the first place."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {mechanismCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-navy-100/40 bg-white p-6 shadow-premium"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10">
                  <card.icon className="h-5 w-5 text-teal" />
                </div>
                <h3 className="font-bold text-navy mb-2">{card.title}</h3>
                <p className="text-sm leading-relaxed text-graphite-600">{card.description}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Clinical evidence */}
      <section className="py-20">
        <SectionShell>
          <div className="mx-auto max-w-4xl">
            <SectionHeading
              eyebrow="Clinical Evidence"
              title="What the clinical trials show"
              description="The STEP and SURMOUNT trials are the largest weight loss medication trials ever conducted. The results established a new category of obesity treatment."
              align="left"
            />
            <div className="mt-10 space-y-4">
              {trialData.map((trial) => (
                <div
                  key={trial.trial}
                  className="rounded-2xl border border-navy-100/40 bg-white p-6 shadow-premium"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-bold text-navy">{trial.trial}</h3>
                      <span className="text-xs text-teal font-medium">{trial.drug}</span>
                    </div>
                    <Badge variant="default" className="shrink-0 text-xs">{trial.result}</Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-graphite-600">{trial.detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-teal/20 bg-teal-50/30 p-5">
              <p className="text-xs text-teal-700 leading-relaxed">
                Trial data cited from original publications. Results represent average weight loss in the full trial population; individual results vary. Nature's Journey uses compounded semaglutide and tirzepatide — not FDA-approved branded products. Compounded medications are not FDA-approved.
              </p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Who qualifies */}
      <section className="bg-gradient-to-b from-cloud to-white py-20">
        <SectionShell>
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="Eligibility"
              title="Who qualifies for GLP-1 treatment for obesity"
              description="FDA labeling sets minimum criteria, but final eligibility is always determined by a licensed medical provider reviewing your individual health history."
              align="left"
            />
            <div className="mt-8 space-y-3">
              {qualifiesCriteria.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                  <span className="text-sm leading-relaxed text-graphite-600">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { label: "BMI ≥30", desc: "Primary obesity eligibility threshold" },
                { label: "BMI ≥27 + comorbidity", desc: "Overweight with qualifying condition" },
                { label: "Provider-evaluated", desc: "All cases reviewed by a licensed clinician" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-teal/20 bg-teal-50/40 p-4 text-center">
                  <div className="font-bold text-teal text-sm">{item.label}</div>
                  <div className="mt-1 text-xs text-graphite-500">{item.desc}</div>
                </div>
              ))}
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
                <h3 className="font-bold text-navy text-sm">Important safety information</h3>
                <ul className="mt-2 space-y-1.5 text-xs text-graphite-600 leading-relaxed">
                  <li>• A personal or family history of medullary thyroid carcinoma (MTC) or Multiple Endocrine Neoplasia syndrome type 2 (MEN2) is a contraindication for all GLP-1 agonists.</li>
                  <li>• History of pancreatitis requires disclosure and careful provider evaluation before starting GLP-1 therapy.</li>
                  <li>• Common side effects include nausea, vomiting, and gastrointestinal discomfort — usually temporary and dose-dependent.</li>
                  <li>• Discuss all current medications with your provider before starting — GLP-1 medications can affect the absorption of oral medications.</li>
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
            title="GLP-1 for obesity, answered"
            description="What patients with obesity most commonly ask about FDA approval, eligibility, and expected weight loss outcomes."
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
              <Users className="h-8 w-8 text-teal" />
              <h3 className="font-bold text-navy text-sm">18,000+ members treated</h3>
              <p className="text-xs text-graphite-500">Real outcomes from a growing patient community</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Stethoscope className="h-8 w-8 text-teal" />
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
          <p className="text-sm text-graphite-500 mb-6">Clinical context, cost guides, and practical resources for GLP-1 obesity treatment</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {furtherReading.map((article) => (
              <Link
                key={article.href}
                href={article.href}
                className="group flex items-start justify-between gap-2 rounded-xl border border-navy-100/40 bg-white p-4 hover:border-teal/30 hover:shadow-premium transition-all"
              >
                <div>
                  <span className="text-xs font-medium text-teal">{article.tag}</span>
                  <p className="mt-0.5 text-sm font-medium text-navy group-hover:text-teal transition-colors leading-snug">{article.label}</p>
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
            {siteConfig.compliance.shortDisclaimer} Clinical data cited from published peer-reviewed research including STEP-1 (Wilding JP et al., NEJM 2021) and SURMOUNT-1 (Jastreboff AM et al., NEJM 2022). Individual results vary. Treatment eligibility determined by a licensed medical provider. Nature's Journey uses compounded semaglutide and tirzepatide, which are not FDA-approved branded medications.
          </p>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
