export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Heart,
  Activity,
  Info,
  AlertCircle,
  TrendingDown,
  FlaskConical,
  Clock,
  Lightbulb,
  Droplet,
  LineChart,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { MedicalConditionJsonLd, BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site";
import { LandingHero } from "@/components/marketing/landing/hero";
import { LandingStatsRow } from "@/components/marketing/landing/stats-row";
import { LandingFaq } from "@/components/marketing/landing/faq";
import { LandingTestimonials } from "@/components/marketing/landing/testimonials";
import { LandingPricingAnchor } from "@/components/marketing/landing/pricing-anchor";
import { LandingStickyCta } from "@/components/marketing/landing/sticky-cta";
import { LandingTrustStrip } from "@/components/marketing/landing/trust-strip";
import { LandingPressBar } from "@/components/marketing/landing/press-bar";
import { LandingHowItWorks } from "@/components/marketing/landing/how-it-works";
import { LandingComparisonTable } from "@/components/marketing/landing/comparison-table";
import { LandingProviderTeam } from "@/components/marketing/landing/provider-team";
import { LandingGuaranteeMedallion } from "@/components/marketing/landing/guarantee-medallion";
import { LandingJourneyTimeline } from "@/components/marketing/landing/journey-timeline";

export const metadata: Metadata = {
  title: "GLP-1 for Prediabetes | Can Semaglutide Reverse the Diagnosis?",
  description:
    "Prediabetes affects 88 million Americans — 70-80% will develop type 2 diabetes without intervention. GLP-1 medications can reverse prediabetes. Here's what the clinical evidence shows.",
  openGraph: {
    title: "GLP-1 for Prediabetes | Nature's Journey",
    description:
      "Prediabetes affects 88 million Americans — 70-80% progress without intervention. GLP-1 medications can reverse prediabetes. Here's the clinical evidence.",
  },
};

const incrementEffects = [
  {
    icon: TrendingDown,
    title: "Glucose-dependent insulin stimulation",
    description:
      "GLP-1 stimulates insulin secretion only when blood glucose is elevated — no hypoglycemia when glucose is normal. Fundamentally different from older diabetes medications.",
  },
  {
    icon: Activity,
    title: "Glucagon suppression",
    description:
      "GLP-1 suppresses glucagon from pancreatic alpha cells. Glucagon drives glucose production by the liver — reducing it is like turning off a glucose-producing tap.",
  },
  {
    icon: FlaskConical,
    title: "Beta cell function improvement",
    description:
      "GLP-1 therapy may help preserve and partially restore beta cell function — evidenced by improved first-phase insulin response in trial participants with baseline glucose impairment.",
  },
  {
    icon: Heart,
    title: "Weight loss-driven insulin sensitivity",
    description:
      "Beyond direct glucose mechanisms, GLP-1-mediated weight loss (primarily visceral fat reduction) significantly improves insulin sensitivity. Dual mechanism for glucose normalization.",
  },
];

const trialData = [
  {
    trial: "STEP-1 prediabetes subgroup",
    drug: "Semaglutide 2.4mg",
    finding: "A significant proportion of participants with baseline prediabetes achieved normoglycemia (A1c < 5.7%) at 68 weeks. Mean A1c reduction ~0.5–0.8% in prediabetic subgroup.",
    source: "Wilding JP et al., NEJM 2021",
  },
  {
    trial: "SCALE Prediabetes trial",
    drug: "Liraglutide 3.0mg",
    finding: "66% of liraglutide-treated participants with prediabetes converted to normal glycemia at 160 weeks, vs 36% placebo. 3-year T2D conversion: 2% (liraglutide) vs 6% (placebo).",
    source: "le Roux CW et al., Lancet 2017",
  },
  {
    trial: "SURMOUNT-1 prediabetes subgroup",
    drug: "Tirzepatide (5/10/15mg)",
    finding: "Similar pattern to semaglutide: high proportion of prediabetic participants achieved A1c normalization. Higher weight loss correlated with greater glycemic improvement.",
    source: "Jastreboff AM et al., NEJM 2022",
  },
  {
    trial: "2021 Lancet meta-analysis",
    drug: "GLP-1 agonists (pooled)",
    finding: "Approximately 40% of GLP-1-treated patients with prediabetes achieved normal A1c (<5.7%) at 12 months across multiple agents.",
    source: "The Lancet Diabetes & Endocrinology, 2021",
  },
];

const faqs = [
  {
    q: "Will GLP-1 work for prediabetes if I'm not obese?",
    a: "The BMI eligibility threshold is 27+ with a comorbidity like prediabetes. You do not need to meet traditional obesity criteria (BMI 30+) to qualify if you have prediabetes. For people below BMI 27, GLP-1 is not FDA-approved, though some providers may consider off-label use.",
  },
  {
    q: "How often should I check my A1c while on GLP-1 treatment for prediabetes?",
    a: "Standard practice is every 3 months during the first year to assess response, then every 6 months once stable. The goal is A1c below 5.7% (normoglycemia) or at minimum below 6.4%. Your provider will integrate A1c monitoring into your follow-up.",
  },
  {
    q: "Can I take GLP-1 with metformin? I was already prescribed it.",
    a: "Yes — they work through different mechanisms and are commonly used together. Metformin reduces hepatic glucose production and improves insulin sensitivity. GLP-1 improves incretin function, beta cell response, and glucagon suppression. No meaningful interaction concern. Combination is often more effective than either alone.",
  },
  {
    q: "If my A1c normalizes, can I stop the GLP-1?",
    a: "A1c normalization during treatment represents genuine biological improvement, but prediabetes involves underlying beta cell dysfunction and insulin resistance that persist. The medication addresses them, not cures them. Use the treatment window to establish lifestyle habits. After 12–18 months, this is a conversation to have with your provider.",
  },
  {
    q: "I also have NAFLD (fatty liver). Is that related, and does GLP-1 help?",
    a: "NAFLD, prediabetes, and obesity form a common metabolic triad — same root cause in insulin resistance and visceral fat accumulation. NAFLD affects ~50–75% of people with prediabetes. The NEJM 2021 NASH trial showed 59% of semaglutide-treated patients experienced NASH resolution vs 17% placebo. Strong additional indication for treatment.",
  },
];

const testimonials = [
  {
    initials: "J.A.",
    name: "Jamal A.",
    location: "Atlanta, GA",
    outcome: "Lost 33 lbs",
    outcomeDetail: "A1c 6.1 → 5.4 in 6 months",
    quote: "My dad died of diabetes complications at 62. My A1c was climbing. I wasn't going to let the same thing happen. Three months in, my fasting glucose was already normal.",
    highlight: "I wasn't going to let the same thing happen",
    duration: "6 months",
  },
  {
    initials: "P.G.",
    name: "Priya G.",
    location: "Dallas, TX",
    outcome: "Lost 27 lbs",
    outcomeDetail: "A1c 6.3 → 5.5 · Off metformin",
    quote: "My endocrinologist added GLP-1 when metformin alone wasn't moving the needle. Six months later my A1c is normal and we dropped the metformin entirely.",
    highlight: "my A1c is normal",
    duration: "6 months",
  },
  {
    initials: "E.C.",
    name: "Eric C.",
    location: "Denver, CO",
    outcome: "Lost 41 lbs",
    outcomeDetail: "A1c 6.4 → 5.2 · NAFLD improving",
    quote: "Both prediabetes and fatty liver. I was told to 'just lose weight' like I hadn't been trying. Actually addressing insulin resistance at the root was the difference.",
    highlight: "Actually addressing insulin resistance at the root",
    duration: "9 months",
  },
];

export default function PrediabetesPage() {
  return (
    <MarketingShell>
      <MedicalConditionJsonLd
        name="Prediabetes"
        alternateName="Impaired Glucose Tolerance"
        description="A metabolic condition characterized by blood glucose levels higher than normal but below the threshold for type 2 diabetes (HbA1c 5.7-6.4%)."
        url="/prediabetes"
        possibleTreatment="GLP-1 receptor agonist therapy, lifestyle intervention"
      />
      <FAQPageJsonLd faqs={faqs.map((f) => ({ question: f.q, answer: f.a }))} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Prediabetes & GLP-1", href: "/prediabetes" },
        ]}
      />

      <LandingStickyCta label="Reverse prediabetes" analyticsPage="prediabetes" />

      <LandingHero
        badge="Prediabetes & Metabolic Health"
        badgeIcon="Droplet"
        accent="teal"
        headlineStart="Prediabetes isn't a life sentence —"
        headlineAccent="it's a window"
        headlineEnd="that won't stay open forever."
        subhead={
          <>
            Clinical evidence shows GLP-1 medications can <strong className="text-navy">normalize A1c in a significant proportion</strong> of prediabetic patients. Here's what the research actually demonstrates — and why intervening now matters.
          </>
        }
        analyticsPage="prediabetes"
        cardTitle="Your A1c on GLP-1 vs without"
        cardIcon="LineChart"
        cardMetrics={[
          { label: "Without intervention (10-year T2D rate)", value: "70–80%", direction: "up" },
          { label: "Metformin alone (DPP risk reduction)", value: "–31%", direction: "down" },
          { label: "Intensive lifestyle (DPP risk reduction)", value: "–58%", direction: "down" },
          { label: "GLP-1 therapy (achieve normoglycemia)", value: "~66%", direction: "up" },
        ]}
        cardFootnote="Figures from DPP (NEJM 2002), SCALE Prediabetes (Lancet 2017), and STEP-1 (NEJM 2021). Approximate; trials differ in population and endpoints."
        testimonial={{
          initials: "J.A.",
          name: "Jamal A.",
          outcome: "A1c 6.1 → 5.4",
          quote: "Not going to let what happened to dad happen to me.",
        }}
      />

      <LandingTrustStrip />

      <LandingPressBar />

      <LandingStatsRow
        eyebrow="Prediabetes in numbers"
        stats={[
          { value: "88M", label: "Americans currently have prediabetes", icon: "Users", tone: "atlantic" },
          { value: "70–80%", label: "Progress to T2D without intervention", icon: "TrendingDown", tone: "rose" },
          { value: "~1%", label: "A1c reduction in prediabetic STEP-1 patients", icon: "LineChart", tone: "teal" },
          { value: "58%", label: "T2D risk reduction with 5–7% weight loss (DPP)", icon: "Activity", tone: "emerald" },
        ]}
      />

      {/* What prediabetes actually means */}
      <section className="py-20">
        <SectionShell>
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="Understanding the Diagnosis"
              title="What prediabetes actually means"
              description="The name 'prediabetes' understates the urgency — but it also correctly suggests this is the optimal time to intervene."
              align="left"
            />
            <div className="mt-8 space-y-5 text-graphite-600 leading-relaxed">
              <p>
                Prediabetes is defined by fasting glucose <strong className="text-navy">100–125 mg/dL</strong>, or A1c <strong className="text-navy">5.7–6.4%</strong>. These thresholds represent glucose levels associated with significantly elevated risk of progression to T2D and with early microvascular changes that precede overt diabetes by years.
              </p>
              <p>
                <strong className="text-navy">What's happening physiologically:</strong> Insulin resistance develops first. The pancreas compensates by producing more insulin (hyperinsulinemia), keeping glucose in the normal range initially. Over years, <strong>beta cell dysfunction</strong> develops — cells begin to fail at keeping up with insulin demand. Glucose rises into the prediabetic range, eventually T2D.
              </p>
              <p>
                <strong className="text-navy">Prediabetes represents the last window where beta cell reserve is sufficient to restore normal function</strong>. Once significant beta cell loss has occurred (which accelerates in overt T2D), normalization becomes progressively harder — even with the best treatments.
              </p>
              <p>
                The gold standard evidence for prediabetes intervention is the <strong className="text-navy">Diabetes Prevention Program (DPP)</strong> — 3,234 adults randomized to intensive lifestyle, metformin, or placebo. Lifestyle achieved <strong>58% risk reduction</strong>; metformin <strong>31%</strong>. Weight loss of just 5–7% was the primary driver.
              </p>
              <p>
                GLP-1 medications produce weight loss of 13–21% in clinical trials — far beyond the 5–7% threshold. They also improve glucose metabolism through direct mechanisms independent of weight. The combination makes GLP-1 therapy one of the most powerful prediabetes interventions available.
              </p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* How GLP-1 affects glucose */}
      <section className="bg-gradient-to-b from-teal-50/30 to-white py-20">
        <SectionShell>
          <SectionHeading
            eyebrow="Mechanism"
            title="How GLP-1 affects glucose metabolism"
            description="GLP-1 agonists work through multiple simultaneous mechanisms on blood sugar — beyond weight loss alone."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {incrementEffects.map((effect, i) => (
              <div
                key={effect.title}
                className="group relative overflow-hidden rounded-2xl border border-navy-100/50 bg-white p-6 shadow-premium transition-all hover:-translate-y-1 hover:shadow-premium-lg hover:border-teal/30"
              >
                <div className="absolute top-0 right-0 h-28 w-28 rounded-full bg-teal opacity-[0.05] blur-2xl transition-opacity group-hover:opacity-[0.1]" />
                <div className="relative">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal to-atlantic text-white shadow-premium">
                    <effect.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-navy mb-2">{effect.title}</h3>
                  <p className="text-sm leading-relaxed text-graphite-600">{effect.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 mx-auto max-w-3xl rounded-2xl border border-teal/30 bg-gradient-to-br from-navy to-atlantic p-6 text-white shadow-premium-lg">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-5 w-5 text-gold" />
              <span className="font-bold text-sm">Why low hypoglycemia risk matters for prediabetes</span>
            </div>
            <p className="text-sm text-white/85 leading-relaxed">
              Unlike sulfonylureas or insulin, GLP-1 agonists only stimulate insulin secretion when glucose is elevated. At normal glucose, the insulinotropic effect essentially turns off. For prediabetic patients without diabetes medications, monitoring requirements are simpler and the safety margin is wider.
            </p>
          </div>
        </SectionShell>
      </section>

      {/* Clinical trial data */}
      <section className="py-20">
        <SectionShell>
          <div className="mx-auto max-w-4xl">
            <SectionHeading
              eyebrow="Clinical Evidence"
              title="What clinical trials show for prediabetes"
              description="Multiple major trials have examined GLP-1 medications specifically in prediabetic populations. The evidence is consistent."
              align="left"
            />
            <div className="mt-10 space-y-4">
              {trialData.map((trial, i) => (
                <div
                  key={trial.trial}
                  className="group relative overflow-hidden rounded-2xl border border-navy-100/50 bg-white p-6 shadow-premium transition-all hover:shadow-premium-lg hover:border-teal/30"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal to-atlantic text-white text-sm font-bold shadow-premium">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-navy">{trial.trial}</h3>
                        <span className="text-xs text-teal font-medium">{trial.drug}</span>
                      </div>
                    </div>
                    <Badge variant="default" className="shrink-0 text-xs">{trial.source.split(",")[0]}</Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-graphite-600">{trial.finding}</p>
                  <p className="mt-2 text-xs text-graphite-400">{trial.source}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-teal/20 bg-teal-50/30 p-5">
              <p className="text-xs text-teal-700 leading-relaxed">
                <Info className="inline h-3.5 w-3.5 mr-1" />
                Trial data cited as reported in original publications. Subgroup analyses involve smaller samples than primary endpoints. Individual results vary. SCALE used liraglutide 3.0mg; STEP used semaglutide 2.4mg; SURMOUNT used tirzepatide.
              </p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Progression chart */}
      <section className="bg-gradient-to-b from-cloud/50 to-white py-20">
        <SectionShell>
          <div className="mx-auto max-w-4xl">
            <SectionHeading
              eyebrow="Your Path Forward"
              title="A1c progression — with treatment vs without"
              description="What happens to your glucose in the next 3 years depends on what you do right now."
              align="left"
            />
            <div className="mt-10 rounded-3xl border border-teal/20 bg-white p-8 shadow-premium-lg sm:p-10">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="h-5 w-5 text-teal" />
                <h3 className="font-bold text-navy">3-year progression: 4 paths</h3>
              </div>
              <div className="space-y-5">
                {[
                  { label: "Without intervention", subtitle: "70–80% progress to T2D within 10 years", pct: 75, bar: "bg-gradient-to-r from-rose-400 to-red-500", bg: "bg-rose-100", outcome: "75% convert", color: "text-rose-600" },
                  { label: "Metformin alone", subtitle: "~31% risk reduction (DPP trial)", pct: 52, bar: "bg-gradient-to-r from-amber-400 to-orange-400", bg: "bg-amber-100", outcome: "~52% convert", color: "text-amber-600" },
                  { label: "Intensive lifestyle", subtitle: "58% risk reduction (DPP trial)", pct: 32, bar: "bg-gradient-to-r from-teal-400 to-cyan-400", bg: "bg-teal-100", outcome: "~32% convert", color: "text-teal" },
                  { label: "GLP-1 therapy", subtitle: "~66% achieve normoglycemia (SCALE)", pct: 15, bar: "bg-gradient-to-r from-emerald-400 to-teal-500", bg: "bg-emerald-100", outcome: "~2–4% convert", color: "text-emerald-600" },
                ].map((row, i) => (
                  <div key={row.label}>
                    <div className="mb-2 flex items-baseline justify-between gap-2">
                      <div>
                        <span className="text-sm font-bold text-navy">{row.label}</span>
                        <span className="ml-2 text-xs text-graphite-500">{row.subtitle}</span>
                      </div>
                      <span className={`text-sm font-bold ${row.color}`}>{row.outcome}</span>
                    </div>
                    <div className={`h-4 overflow-hidden rounded-full ${row.bg}`}>
                      <div className={`h-full rounded-full ${row.bar} transition-all duration-1000`} style={{ width: `${row.pct}%`, animationDelay: `${i * 200}ms` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs text-graphite-400">
                Approximate figures from multiple trials. Direct comparison requires caution — trials differ in population, duration, and endpoints. Individual results vary.
              </p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Eligibility pathway */}
      <section className="py-20">
        <SectionShell>
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="Eligibility"
              title="Prediabetes + obesity = strongest case for GLP-1"
              description="BMI of 27+ with prediabetes is one of the strongest clinical indications for GLP-1 treatment — and may be the most compelling case for early intervention."
              align="left"
            />
            <div className="mt-8 space-y-5 text-graphite-600 leading-relaxed">
              <p>
                GLP-1 medications are FDA-approved for adults with BMI ≥30, or BMI ≥27 with at least one weight-related comorbidity. Prediabetes qualifies — meaning a BMI of just 27+ with a prediabetes diagnosis meets the threshold for treatment.
              </p>
              <p>
                <strong className="text-navy">This combination is the strongest clinical case for early GLP-1 intervention.</strong> You're at high risk of T2D, your risk responds to weight loss, and GLP-1 medications are the most effective weight loss interventions available while also directly improving glucose metabolism. Waiting for an A1c of 6.5% before intervening means allowing continued beta cell stress during the window when intervention is most effective.
              </p>
              <p>
                Many endocrinologists now recommend GLP-1 for prediabetes with obesity <em>without</em> waiting for a formal T2D diagnosis — reinforced by the 2023 ADA guidelines.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "BMI ≥27 + prediabetes", desc: "Meets FDA eligibility" },
                  { label: "A1c 5.7–6.4%", desc: "Prediabetes range" },
                  { label: "Fasting glucose 100–125", desc: "Impaired fasting glucose" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-teal/30 bg-gradient-to-br from-teal-50/40 to-white p-4 text-center shadow-sm">
                    <div className="font-bold text-teal text-sm">{item.label}</div>
                    <div className="mt-1 text-xs text-graphite-500">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <h3 className="font-bold text-navy">What to tell your provider:</h3>
              {[
                "Your most recent A1c and fasting glucose (date and value)",
                "How long you've had a prediabetes diagnosis",
                "Whether you've been prescribed metformin or made specific lifestyle changes",
                "Any symptoms of low blood sugar (rare with GLP-1 alone)",
                "Family history of type 2 diabetes or pancreatitis",
                "Any liver condition (NAFLD/NASH often co-occurs with prediabetes)",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                  <span className="text-sm leading-relaxed text-graphite-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionShell>
      </section>

      <LandingJourneyTimeline
        accent="teal"
        title="Your A1c trajectory — reversed"
        description="How glucose, insulin, and weight move month-by-month on GLP-1."
        milestones={[
          { when: "Day 1", label: "Provider approves · ships", metric: "Labs ordered" },
          { when: "Week 2", label: "Glucose variability drops", metric: "Fasting ↓" },
          { when: "Month 1", label: "First weight + glucose shift", metric: "3–5 lbs" },
          { when: "Month 3", label: "First A1c recheck", metric: "A1c –0.5% avg" },
          { when: "Month 6", label: "Normoglycemia within reach", metric: "A1c < 5.7% common" },
          { when: "Month 12", label: "Reversed prediabetes", metric: "~66% normalize" },
        ]}
      />

      <LandingComparisonTable />

      <LandingTestimonials
        eyebrow="Prediabetes · Real results"
        title="Patients who reversed their trajectory"
        description="Three real stories of A1c normalization and stopped progression."
        items={testimonials}
        accent="teal"
      />

      <LandingGuaranteeMedallion accent="teal" />

      <LandingProviderTeam accent="teal" />

      <LandingHowItWorks
        accent="teal"
        segmentLabel="Quarterly A1c monitoring + coordination with metformin or other glucose meds."
      />

      <LandingPricingAnchor
        eyebrow="Prediabetes pricing"
        headline="Reverse your A1c trajectory — one monthly price."
        subhead="Everything you need for metabolic recovery: provider care, glucose monitoring, medication, and coaching."
        includes={[
          "Provider experienced with metabolic health",
          "Compounded semaglutide or tirzepatide",
          "Quarterly A1c monitoring included",
          "Coordination with metformin or other glucose meds",
          "Prediabetes-specific meal plans & coaching",
          "Free 2-day shipping · Cancel anytime",
        ]}
        primaryCtaLabel="See If I Qualify"
        accent="teal"
      />

      {/* Safety callout */}
      <section className="py-12">
        <SectionShell>
          <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <h3 className="font-bold text-navy text-sm">Important notes for prediabetes patients</h3>
                <ul className="mt-2 space-y-1.5 text-xs text-graphite-600 leading-relaxed">
                  <li>• Do not stop metformin or other prescribed glucose-lowering medications without discussing with your provider — combination with GLP-1 is often additive and beneficial.</li>
                  <li>• Personal or family history of MTC or MEN2 is a contraindication for all GLP-1 agonists.</li>
                  <li>• History of pancreatitis requires disclosure and careful evaluation before starting.</li>
                  <li>• Routine A1c monitoring every 3 months is recommended for the first year.</li>
                </ul>
              </div>
            </div>
          </div>
        </SectionShell>
      </section>

      <LandingFaq
        eyebrow="Prediabetes FAQ"
        title="Prediabetes questions, answered"
        description="What patients actually ask — about monitoring, medications, stopping treatment, and conditions that often coexist."
        items={faqs}
      />

      {/* Further reading */}
      <section className="py-12 bg-cloud/40 border-y border-sage/20">
        <SectionShell>
          <h2 className="text-lg font-semibold text-navy mb-2 text-center">Further reading</h2>
          <p className="text-sm text-graphite-500 mb-6 text-center">Clinical context and practical guides</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "How GLP-1 Medications Work", href: "/blog/understanding-glp1", tag: "Science" },
              { label: "Semaglutide Mechanism of Action", href: "/blog/semaglutide-mechanism-of-action-explained", tag: "Clinical" },
              { label: "Metformin + Semaglutide Together?", href: "/blog/metformin-and-semaglutide-can-you-take-together", tag: "Medication" },
              { label: "GLP-1 Weight Loss Timeline", href: "/blog/semaglutide-timeline-first-3-months", tag: "Results" },
            ].map((article) => (
              <Link
                key={article.href}
                href={article.href}
                className="group flex items-start justify-between gap-2 rounded-xl border border-navy-100/40 bg-white p-4 hover:border-teal/40 hover:shadow-premium transition-all"
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
          <p className="mx-auto max-w-3xl text-center text-xs text-graphite-400 leading-relaxed">
            {siteConfig.compliance.shortDisclaimer} Clinical data cited from published peer-reviewed research including DPP, SCALE Prediabetes (le Roux CW et al., Lancet 2017), STEP-1 (Wilding JP et al., NEJM 2021), and SURMOUNT-1 (Jastreboff AM et al., NEJM 2022). Individual results vary. Treatment eligibility determined by a licensed medical provider.
          </p>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
