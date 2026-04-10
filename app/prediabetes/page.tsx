export const dynamic = "force-static";

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Heart,
  Activity,
  Shield,
  Star,
  Info,
  AlertCircle,
  TrendingDown,
  FlaskConical,
  Clock,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "GLP-1 for Prediabetes | Can Semaglutide Reverse the Diagnosis?",
  description:
    "Prediabetes affects 88 million Americans, and 70-80% will develop type 2 diabetes without intervention. GLP-1 medications can reverse prediabetes — here's what the clinical evidence shows.",
  openGraph: {
    title: "GLP-1 for Prediabetes | Can Semaglutide Reverse the Diagnosis? | VitalPath",
    description:
      "Prediabetes affects 88 million Americans, and 70-80% will develop type 2 diabetes without intervention. GLP-1 medications can reverse prediabetes — here's what the clinical evidence shows.",
  },
};

const stats = [
  { stat: "88M", label: "Americans currently have prediabetes — most don't know it" },
  { stat: "70–80%", label: "Will develop type 2 diabetes without intervention" },
  { stat: "~1%", label: "A1c improvement in prediabetic GLP-1 users in STEP-1 data" },
  { stat: "58%", label: "T2D risk reduction with just 5–7% weight loss (DPP trial)" },
];

const incrementEffects = [
  {
    icon: TrendingDown,
    title: "Glucose-dependent insulin stimulation",
    description:
      "GLP-1 stimulates insulin secretion from pancreatic beta cells only when blood glucose is elevated — meaning it does not cause hypoglycemia when glucose is normal. This is fundamentally different from older diabetes medications and is why GLP-1 is safe in prediabetes without tight glucose monitoring.",
  },
  {
    icon: Activity,
    title: "Glucagon suppression",
    description:
      "GLP-1 agonists suppress glucagon release from pancreatic alpha cells. Glucagon drives glucose production by the liver — reducing it is like turning off a glucose-producing tap. In prediabetes, glucagon dysregulation is a significant driver of elevated fasting glucose.",
  },
  {
    icon: FlaskConical,
    title: "Beta cell function improvement",
    description:
      "Prediabetes involves progressive beta cell dysfunction — the cells that produce insulin become less efficient. GLP-1 therapy may help preserve and partially restore beta cell function, as evidenced by improved first-phase insulin response in trial participants with baseline glucose impairment.",
  },
  {
    icon: Heart,
    title: "Weight loss-driven insulin sensitivity",
    description:
      "Beyond direct glucose mechanisms, GLP-1-mediated weight loss (primarily visceral fat reduction) significantly improves insulin sensitivity. The combination of direct beta cell support and improved insulin receptor response creates a dual mechanism for glucose normalization.",
  },
];

const trialData = [
  {
    trial: "STEP-1 prediabetes subgroup",
    drug: "Semaglutide 2.4mg",
    finding: "A significant proportion of participants with baseline prediabetes achieved normoglycemia (A1c < 5.7%) at 68 weeks. Mean A1c reduction of approximately 0.5–0.8% in prediabetic subgroup.",
    source: "Wilding JP et al., NEJM 2021",
  },
  {
    trial: "SCALE Prediabetes trial",
    drug: "Liraglutide 3.0mg",
    finding: "66% of liraglutide-treated participants with prediabetes converted to normal glycemia at 160 weeks, vs 36% in the placebo group. 3-year T2D conversion rate: 2% (liraglutide) vs 6% (placebo).",
    source: "le Roux CW et al., Lancet 2017",
  },
  {
    trial: "SURMOUNT-1 prediabetes subgroup",
    drug: "Tirzepatide (5/10/15mg)",
    finding: "Similar pattern to semaglutide: high proportion of prediabetic participants achieved A1c normalization. Higher weight loss in tirzepatide group correlated with greater glycemic improvement.",
    source: "Jastreboff AM et al., NEJM 2022",
  },
  {
    trial: "2021 Lancet study",
    drug: "GLP-1 agonists (pooled)",
    finding: "Approximately 40% of GLP-1-treated patients with prediabetes achieved normal A1c (<5.7%) at 12 months across multiple agents.",
    source: "Published in The Lancet Diabetes & Endocrinology, 2021",
  },
];

const faqs = [
  {
    q: "Will GLP-1 work for prediabetes if I'm not obese?",
    a: "The BMI eligibility threshold for GLP-1 medications is 27+ with a comorbidity like prediabetes. This means you do not need to meet traditional obesity criteria (BMI 30+) to qualify if you have prediabetes — a BMI of 27 or above is sufficient. For people below BMI 27 with prediabetes, GLP-1 medications are not currently FDA-approved, though some providers may consider off-label use. The DPP trial showed that lifestyle intervention is effective across all weight categories for prediabetes — your VitalPath provider can help you understand which approach is most appropriate for your specific situation.",
  },
  {
    q: "How often should I check my A1c while on GLP-1 treatment for prediabetes?",
    a: "Standard practice is to check A1c every 3 months during the first year of treatment to assess response, then every 6 months once stable. Fasting glucose can be monitored more frequently at home with an inexpensive glucose meter. The goal is A1c below 5.7% (normoglycemia) or at minimum below 6.4% (remaining in prediabetes range vs converting to T2D). Your VitalPath provider will integrate A1c monitoring into your follow-up schedule.",
  },
  {
    q: "Can I take GLP-1 with metformin? I was already prescribed it for prediabetes.",
    a: "Yes — GLP-1 medications and metformin work through different mechanisms and are commonly used together. Metformin reduces hepatic glucose production and improves insulin sensitivity. GLP-1 agonists improve incretin function, beta cell response, and glucagon suppression, plus produce significant weight loss that metformin alone does not. The combination is often more effective than either alone. There is no meaningful interaction concern. The main consideration: if you are already on metformin and A1c has not improved, adding a GLP-1 agent may be a more effective next step than increasing metformin dose.",
  },
  {
    q: "If my A1c normalizes, can I stop the GLP-1 medication?",
    a: "This is an honest question that deserves an honest answer. A1c normalization during GLP-1 treatment is common and represents a genuine biological improvement. However, prediabetes involves underlying beta cell dysfunction and insulin resistance that persist even when glucose is normalized — the medication is addressing them, not curing them. When GLP-1 treatment is stopped without substantial lifestyle change, the underlying dysfunction often resurfaces and glucose levels may return toward the prediabetic range within 6–12 months. The goal of treatment is to use the metabolic improvement window to establish lifestyle habits — diet, exercise, sleep, stress management — that support continued glucose control independently. Some patients maintain normal A1c after stopping; many benefit from continued treatment. This is a conversation to have with your provider after 12–18 months of successful treatment.",
  },
  {
    q: "I also have non-alcoholic fatty liver disease (NAFLD). Is that related, and does GLP-1 help?",
    a: "NAFLD, prediabetes, and obesity form a common metabolic triad — they share the same root cause in insulin resistance and visceral fat accumulation. NAFLD affects approximately 50–75% of people with prediabetes. GLP-1 medications address all three simultaneously. Clinical trials of semaglutide in NASH (the advanced form of NAFLD) — specifically the NASH trial published in NEJM 2021 — showed that 59% of semaglutide-treated patients experienced NASH resolution vs 17% of placebo patients, and significant fibrosis improvement was also observed. GLP-1 therapy reduces hepatic fat content through both weight loss and direct hepatic GLP-1 receptor effects. If you have known NAFLD, this is an additional strong indication for GLP-1 treatment, and your provider should know this as part of your intake.",
  },
];

export default function PrediabetesPage() {
  return (
    <MarketingShell>
      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6">Prediabetes &amp; Metabolic Health</Badge>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-navy sm:text-5xl lg:text-6xl">
            GLP-1 medication for prediabetes: reversing the diagnosis before it becomes type 2 diabetes
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500 leading-relaxed">
            Prediabetes is not a life sentence — it is a window. Clinical evidence shows GLP-1 medications can normalize A1c in a significant proportion of prediabetic patients. Here is what the research actually demonstrates.
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
                Prediabetes is defined by fasting glucose between <strong className="text-navy">100–125 mg/dL</strong> (impaired fasting glucose), or hemoglobin A1c between <strong className="text-navy">5.7–6.4%</strong>, or both. These thresholds are not arbitrary — they represent glucose levels associated with significantly elevated risk of progression to type 2 diabetes and with early microvascular changes that precede overt diabetes by years.
              </p>
              <p>
                <strong className="text-navy">What is happening physiologically</strong> at the prediabetes stage is important to understand. Insulin resistance develops first — cells in muscle, fat, and liver become less responsive to insulin signaling. The pancreas compensates by producing more insulin (hyperinsulinemia), which initially keeps glucose in the normal range. Over years, as insulin resistance worsens and beta cells are subjected to the stress of overproduction, <strong>beta cell dysfunction</strong> develops — the cells begin to fail at keeping up with insulin demand. Glucose starts to rise into the prediabetic range, and eventually the type 2 diabetic range, as both resistance and secretory failure compound.
              </p>
              <p>
                The critical insight is that <strong className="text-navy">prediabetes represents the last window where beta cell reserve is sufficient to restore normal function</strong>. Once significant beta cell loss has occurred (which accelerates in overt T2D), normalization becomes progressively harder even with the best treatments. Intervening at the prediabetes stage — before substantial beta cell loss — is the optimal strategy.
              </p>
              <p>
                The gold standard of evidence for prediabetes intervention is the <strong className="text-navy">Diabetes Prevention Program (DPP)</strong> trial — a landmark NIH-funded study of 3,234 adults with prediabetes randomly assigned to intensive lifestyle intervention, metformin, or placebo. The lifestyle group achieved a 58% reduction in T2D conversion; the metformin group achieved 31%. These results established intensive lifestyle modification as the standard of care. What the DPP also showed: weight loss of just 5–7% of body weight was the primary driver of the lifestyle intervention benefit — not the specific diet or exercise program.
              </p>
              <p>
                GLP-1 medications produce weight loss of 13–21% in clinical trials — far beyond the 5–7% threshold the DPP identified as protective. They also improve glucose metabolism through direct beta cell and glucagon mechanisms independent of weight. The combination makes GLP-1 therapy one of the most powerful prediabetes interventions available.
              </p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* How GLP-1 affects glucose metabolism */}
      <section className="bg-teal-50/30 py-20">
        <SectionShell>
          <SectionHeading
            eyebrow="Mechanism"
            title="How GLP-1 medication affects glucose metabolism"
            description="GLP-1 agonists work through multiple simultaneous mechanisms on blood sugar — beyond the indirect effect of weight loss alone."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {incrementEffects.map((effect) => (
              <div
                key={effect.title}
                className="rounded-2xl border border-navy-100/40 bg-white p-6 shadow-premium"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10">
                  <effect.icon className="h-5 w-5 text-teal" />
                </div>
                <h3 className="font-bold text-navy mb-2">{effect.title}</h3>
                <p className="text-sm leading-relaxed text-graphite-600">{effect.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 mx-auto max-w-3xl rounded-2xl border border-teal/20 bg-white p-6 shadow-premium">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-teal" />
              <span className="font-bold text-navy text-sm">Why low hypoglycemia risk matters for prediabetes</span>
            </div>
            <p className="text-sm text-graphite-600 leading-relaxed">
              Unlike sulfonylureas or insulin, GLP-1 agonists only stimulate insulin secretion when blood glucose is elevated. At normal glucose levels, the insulinotropic effect essentially turns off. This means the risk of hypoglycemia (dangerously low blood sugar) is very low in people with prediabetes who are not also taking insulin or sulfonylureas. For prediabetic patients without diabetes medications, monitoring requirements are simpler and the safety margin is wider.
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
              description="Multiple major trials have examined GLP-1 medications specifically in prediabetic populations. The evidence is consistent and compelling."
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
                Trial data cited as reported in original publications. Subgroup analyses involve smaller samples than primary endpoints and should be interpreted accordingly. Individual results vary. The SCALE Prediabetes trial used liraglutide 3.0mg; STEP trials used semaglutide 2.4mg; SURMOUNT trials used tirzepatide.
              </p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Does it reverse permanently? */}
      <section className="bg-gradient-to-b from-cloud to-white py-20">
        <SectionShell>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Honest Answer"
                title="Does GLP-1 treatment permanently reverse prediabetes?"
                description="This deserves a nuanced, honest answer — not an oversimplification in either direction."
                align="left"
              />
              <div className="mt-8 space-y-4 text-sm text-graphite-600 leading-relaxed">
                <p>
                  The short answer: <strong className="text-navy">A1c frequently normalizes during treatment — and may or may not remain normal after stopping.</strong>
                </p>
                <p>
                  Here is the more complete picture. Prediabetes involves two underlying problems: insulin resistance (addressable through weight loss and lifestyle) and beta cell dysfunction (partially addressable, but not fully curable with current treatments). GLP-1 therapy dramatically addresses insulin resistance and helps preserve beta cell function — but the genetic and cellular predisposition to insulin secretory insufficiency does not disappear.
                </p>
                <p>
                  The SCALE Prediabetes trial (liraglutide, 3 years) found that among participants who achieved normoglycemia during treatment and then stopped the medication, many remained in the normal range for a period — but a meaningful proportion drifted back toward prediabetic values within 12–24 months of stopping, particularly those who did not maintain lifestyle changes.
                </p>
                <p>
                  <strong className="text-navy">What GLP-1 treatment creates is a metabolic window</strong> — a period of normalized glucose that allows for two important things: first, reduction in glucotoxicity (the ongoing damage that elevated glucose causes to beta cells); and second, an opportunity to establish lifestyle habits that maintain metabolic health. Patients who use the treatment window to build sustainable exercise habits, improve dietary patterns, and manage sleep and stress are more likely to maintain normalized A1c after eventually tapering or stopping GLP-1 therapy.
                </p>
                <p>
                  For many patients, the honest framing is: GLP-1 treatment for prediabetes is likely to be long-term, similar to treating hypertension or dyslipidemia. The underlying risk does not disappear; treatment manages it effectively.
                </p>
              </div>
            </div>
            <div className="space-y-5">
              <div className="rounded-2xl border border-teal/20 bg-white p-7 shadow-premium">
                <div className="flex items-center gap-2 mb-5">
                  <Clock className="h-5 w-5 text-teal" />
                  <h3 className="font-bold text-navy">A1c progression with treatment vs without</h3>
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <div className="flex justify-between text-xs text-graphite-500 mb-1">
                      <span>Without intervention: 70–80% progress to T2D within 10 years</span>
                    </div>
                    <div className="h-3 rounded-full bg-red-100 overflow-hidden">
                      <div className="h-full bg-red-400 rounded-full" style={{ width: "75%" }} />
                    </div>
                    <span className="text-xs font-bold text-red-500">75%</span>
                  </div>
                  <div className="relative">
                    <div className="flex justify-between text-xs text-graphite-500 mb-1">
                      <span>Metformin alone: ~31% risk reduction (DPP trial)</span>
                    </div>
                    <div className="h-3 rounded-full bg-amber-100 overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: "52%" }} />
                    </div>
                    <span className="text-xs font-bold text-amber-600">~52% convert</span>
                  </div>
                  <div className="relative">
                    <div className="flex justify-between text-xs text-graphite-500 mb-1">
                      <span>Intensive lifestyle: 58% risk reduction (DPP trial)</span>
                    </div>
                    <div className="h-3 rounded-full bg-teal-100 overflow-hidden">
                      <div className="h-full bg-teal-400 rounded-full" style={{ width: "32%" }} />
                    </div>
                    <span className="text-xs font-bold text-teal">~32% convert</span>
                  </div>
                  <div className="relative">
                    <div className="flex justify-between text-xs text-graphite-500 mb-1">
                      <span>GLP-1 therapy: ~66% achieve normoglycemia (SCALE Prediabetes)</span>
                    </div>
                    <div className="h-3 rounded-full bg-emerald-100 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: "15%" }} />
                    </div>
                    <span className="text-xs font-bold text-emerald-600">~2–4% convert</span>
                  </div>
                </div>
                <p className="mt-4 text-xs text-graphite-400">
                  Approximate figures from multiple trials. Direct comparison requires caution — trials differ in population, duration, and endpoints.
                </p>
              </div>
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
              title="Prediabetes + obesity as a GLP-1 eligibility pathway"
              description="Prediabetes with a BMI of 27+ is one of the strongest clinical indications for GLP-1 treatment — and may be the most compelling case for early intervention."
              align="left"
            />
            <div className="mt-8 space-y-5 text-graphite-600 leading-relaxed">
              <p>
                GLP-1 medications are FDA-approved for adults with BMI ≥30, or BMI ≥27 with at least one weight-related comorbidity. Prediabetes qualifies as a weight-related comorbidity — meaning a BMI of just 27 or above with a prediabetes diagnosis meets the threshold for treatment.
              </p>
              <p>
                <strong className="text-navy">This combination — prediabetes + overweight — is the strongest clinical case for early GLP-1 intervention.</strong> The calculus is straightforward: you are at high risk of T2D, your risk responds to weight loss, and GLP-1 medications are the most effective weight loss interventions available while also directly improving glucose metabolism. Waiting for an A1c of 6.5% before intervening means allowing continued beta cell stress and microvascular damage during the window when intervention is most effective.
              </p>
              <p>
                Many endocrinologists and diabetologists now recommend GLP-1 treatment for prediabetes with obesity <em>without</em> waiting for a formal T2D diagnosis — a shift in practice that reflects both the SELECT cardiovascular data and the growing body of prediabetes-specific evidence. The 2023 American Diabetes Association guidelines reinforced this, recommending consideration of GLP-1 agonists for high-risk prediabetes.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "BMI ≥27 + prediabetes", desc: "Meets FDA eligibility criteria" },
                  { label: "A1c 5.7–6.4%", desc: "The prediabetes diagnostic range" },
                  { label: "Fasting glucose 100–125", desc: "Impaired fasting glucose (IFG)" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-teal/20 bg-teal-50/40 p-4 text-center">
                    <div className="font-bold text-teal text-sm">{item.label}</div>
                    <div className="mt-1 text-xs text-graphite-500">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <h3 className="font-bold text-navy">What to tell your VitalPath provider</h3>
              {[
                "Your most recent A1c and fasting glucose results (date and value)",
                "How long you have had a prediabetes diagnosis",
                "Whether you have been prescribed metformin or made specific lifestyle changes",
                "Any symptoms of low blood sugar (though rare with GLP-1 alone)",
                "Any family history of type 2 diabetes or pancreatitis",
                "Any liver condition (NAFLD/NASH, which often co-occurs with prediabetes)",
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

      {/* Safety callout */}
      <section className="py-12">
        <SectionShell>
          <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <h3 className="font-bold text-navy text-sm">Important notes for prediabetes patients</h3>
                <ul className="mt-2 space-y-1.5 text-xs text-graphite-600 leading-relaxed">
                  <li>• Do not stop metformin or other prescribed glucose-lowering medications without discussing with your provider — the combination with GLP-1 is often additive and beneficial.</li>
                  <li>• A personal or family history of medullary thyroid carcinoma (MTC) or MEN2 is a contraindication for all GLP-1 agonists.</li>
                  <li>• History of pancreatitis requires disclosure and careful provider evaluation before starting GLP-1 therapy.</li>
                  <li>• Routine A1c monitoring every 3 months is recommended for the first year to assess response.</li>
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
            title="Prediabetes questions, answered"
            description="What patients with prediabetes actually ask — about monitoring, medications, stopping treatment, and conditions that often coexist."
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
              <Star className="h-8 w-8 text-gold" />
              <h3 className="font-bold text-navy text-sm">Licensed providers</h3>
              <p className="text-xs text-graphite-500">Board-certified physicians evaluate every patient</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Activity className="h-8 w-8 text-teal" />
              <h3 className="font-bold text-navy text-sm">Metabolic health expertise</h3>
              <p className="text-xs text-graphite-500">Providers experienced with glucose management and prediabetes</p>
            </div>
          </div>
        </SectionShell>
      </section>

      <CtaSection />

      <section className="py-8 border-t border-navy-100/40">
        <SectionShell>
          <p className="mx-auto max-w-3xl text-center text-xs text-graphite-300 leading-relaxed">
            {siteConfig.compliance.shortDisclaimer} Clinical data cited from published peer-reviewed research including the Diabetes Prevention Program (DPP), SCALE Prediabetes (le Roux CW et al., Lancet 2017), STEP-1 (Wilding JP et al., NEJM 2021), and SURMOUNT-1 (Jastreboff AM et al., NEJM 2022). Individual results vary. Treatment eligibility determined by a licensed medical provider. Do not discontinue any prescribed medications without consulting your physician.
          </p>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
