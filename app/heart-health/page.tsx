export const dynamic = "force-dynamic";

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
  TrendingDown,
  Users,
  FlaskConical,
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
  title: "GLP-1 Medication and Heart Health | SELECT Trial Results Explained",
  description:
    "The SELECT trial showed semaglutide reduced heart attack, stroke, and cardiovascular death by 20% in people with obesity — the first weight management drug ever to demonstrate this. Here's what it means for you.",
  openGraph: {
    title: "GLP-1 Medication and Heart Health | SELECT Trial Results Explained | Nature's Journey",
    description:
      "The SELECT trial showed semaglutide reduced heart attack, stroke, and cardiovascular death by 20% in people with obesity — the first weight management drug ever to demonstrate this. Here's what it means for you.",
  },
};

const stats = [
  { stat: "20%", label: "Reduction in MACE events (SELECT trial, HR 0.80)" },
  { stat: "17,604", label: "Participants — one of the largest CV outcome trials ever" },
  { stat: "3.3 years", label: "Mean follow-up period in the SELECT trial" },
  { stat: "No diabetes", label: "Required — obesity alone qualified participants" },
];

const cardiovascularMarkers = [
  { marker: "Systolic blood pressure", change: "−3 to −4 mmHg avg reduction", direction: "down" },
  { marker: "CRP (inflammatory marker)", change: "−40% reduction from baseline", direction: "down" },
  { marker: "Triglycerides", change: "−20 to −30% reduction", direction: "down" },
  { marker: "HDL cholesterol (protective)", change: "+5 to +10% increase", direction: "up" },
  { marker: "LDL cholesterol", change: "Modest reduction (-5-10%)", direction: "down" },
  { marker: "eGFR (kidney function)", change: "Preserved or improved in early data", direction: "up" },
];

const beneficiaryGroups = [
  {
    icon: Heart,
    title: "People with existing CVD",
    description:
      "The SELECT trial enrolled adults with established cardiovascular disease — prior heart attack, stroke, or peripheral arterial disease. This population showed the clearest benefit. If you have any of these in your history, GLP-1 treatment now has direct cardiovascular evidence, not just metabolic evidence.",
  },
  {
    icon: Activity,
    title: "People with heart failure",
    description:
      "Preliminary data from the STEP-HFpEF trial shows semaglutide improves symptoms, exercise capacity, and quality of life in heart failure with preserved ejection fraction (HFpEF). This is a historically difficult-to-treat condition, and GLP-1 represents a meaningful new option.",
  },
  {
    icon: TrendingDown,
    title: "People with hypertension + obesity",
    description:
      "The 3–4 mmHg systolic blood pressure reduction seen in GLP-1 trials is clinically meaningful — roughly equivalent to a dose increase in an antihypertensive medication. Combined with weight loss, the blood pressure benefit compounds over time.",
  },
  {
    icon: FlaskConical,
    title: "People with metabolic syndrome",
    description:
      "Metabolic syndrome — the cluster of high blood pressure, high triglycerides, low HDL, high fasting glucose, and central obesity — responds to GLP-1 therapy across all components simultaneously. No other single intervention addresses all five criteria as effectively.",
  },
];

const faqs = [
  {
    q: "Do I need to have existing heart disease to benefit from GLP-1 medications?",
    a: "No. The SELECT trial required established CVD as an entry criterion because that population has the highest baseline event rate — making it easier to detect a benefit. But the mechanisms that reduce cardiovascular risk (improved blood pressure, lipids, inflammation, insulin resistance, and weight) are present in everyone who takes GLP-1 medications. People without existing CVD are reducing future risk, not reversing existing disease — but the underlying biology is the same.",
  },
  {
    q: "Does tirzepatide (Mounjaro/Zepbound) have similar cardiovascular data?",
    a: "The SURPASS-CVOT trial (tirzepatide's cardiovascular outcomes trial) results were published in 2024 and showed a 15% reduction in MACE events, comparable to the SELECT results for semaglutide. Both drugs reduce cardiovascular risk, with tirzepatide showing potentially larger metabolic effects due to its dual GIP/GLP-1 mechanism. Your Nature's Journey provider can discuss which medication is appropriate for your clinical profile.",
  },
  {
    q: "Can GLP-1 medication replace my statin?",
    a: "No — and you should not stop any prescribed medication without discussing it with your doctor. GLP-1 medications and statins work through different mechanisms and are frequently used together. Statins primarily reduce LDL cholesterol and are among the most evidence-supported CVD prevention medications. GLP-1 medications add additional benefit on top of statins. The combination may be particularly powerful: in SELECT, most participants were already on statins, and the GLP-1 benefit was additive.",
  },
  {
    q: "I have heart failure. Is GLP-1 safe for me?",
    a: "It depends on the type. For heart failure with preserved ejection fraction (HFpEF), the STEP-HFpEF trial showed benefit — improved symptoms, reduced weight, better exercise capacity. For heart failure with reduced ejection fraction (HFrEF), the evidence is more mixed — earlier small studies with older GLP-1 agents showed neutral or negative signals in severe HFrEF, though newer agents appear safer. This is a clinical decision that requires your Nature's Journey provider to review your cardiology records and current medications. Heart failure history does not automatically exclude you, but requires careful evaluation.",
  },
  {
    q: "How long before I might see cardiovascular benefit?",
    a: "In the SELECT trial, separation of the MACE curves between semaglutide and placebo began appearing within the first 6 months — notably before significant weight loss had occurred in most participants. This early divergence supports the hypothesis that direct cardiac and anti-inflammatory mechanisms contribute to the benefit, not just weight loss. Metabolic markers (blood pressure, CRP, triglycerides) often show measurable improvements within 8–12 weeks of starting treatment. The full cardiovascular benefit accrues over years of consistent treatment.",
  },
];

export default function HeartHealthPage() {
  return (
    <MarketingShell>
      <MedicalConditionJsonLd
        name="Cardiovascular Disease and Obesity"
        description="Obesity-related cardiovascular disease including increased risk of heart attack, stroke, and heart failure driven by visceral adiposity and metabolic dysfunction."
        url="/heart-health"
        possibleTreatment="GLP-1 receptor agonist therapy with demonstrated 20% MACE reduction (SELECT trial)"
      />
      <FAQPageJsonLd faqs={faqs.map((f) => ({ question: f.q, answer: f.a }))} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "GLP-1 & Heart Health", href: "/heart-health" },
        ]}
      />
      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6">Cardiovascular Health</Badge>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-navy sm:text-5xl lg:text-6xl">
            GLP-1 medication and cardiovascular health: what the SELECT trial actually proved
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500 leading-relaxed">
            For the first time in history, a weight management medication has demonstrated a statistically significant reduction in heart attacks, strokes, and cardiovascular death in a pre-specified outcomes trial. Here is what that means.
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

      {/* What the SELECT trial was */}
      <section className="py-20">
        <SectionShell>
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="The Evidence"
              title="What the SELECT trial was — and why it matters"
              description="Not all clinical trials are equal. The SELECT trial was designed from the start to answer one specific question: does semaglutide reduce cardiovascular events in people with obesity?"
              align="left"
            />
            <div className="mt-8 space-y-5 text-graphite-600 leading-relaxed">
              <p>
                The <strong className="text-navy">Semaglutide and Cardiovascular Outcomes (SELECT) trial</strong> was a landmark randomized controlled trial funded by Novo Nordisk and published in the <em>New England Journal of Medicine</em> in November 2023. It enrolled 17,604 adults across 41 countries over six years — one of the largest cardiovascular outcomes trials ever conducted for an anti-obesity medication.
              </p>
              <p>
                <strong className="text-navy">Enrollment criteria:</strong> Adults aged 45 or older with obesity (BMI ≥27 kg/m²) and established cardiovascular disease — defined as a prior heart attack, non-fatal stroke, or symptomatic peripheral arterial disease. Crucially: <em>participants were required to have no diabetes at baseline</em>. This was a deliberate design choice to isolate the cardiovascular effect of the medication independent of its blood sugar effects.
              </p>
              <p>
                <strong className="text-navy">Primary endpoint:</strong> Time to first major adverse cardiovascular event (MACE) — a composite of cardiovascular death, non-fatal heart attack, or non-fatal stroke. This is the gold-standard endpoint for cardiovascular outcomes research.
              </p>
              <p>
                <strong className="text-navy">Results:</strong> After a mean follow-up of 34 months (approximately 3 years), semaglutide produced a hazard ratio of 0.80 — a 20% relative risk reduction in the primary endpoint. The absolute risk reduction was 1.5 percentage points (8% vs 6.5%). The number needed to treat (NNT) to prevent one major cardiovascular event was approximately 67 over 3 years.
              </p>
              <p>
                <strong className="text-navy">Why this is historic:</strong> Every prior weight management medication approved by the FDA was evaluated on weight loss efficacy and metabolic safety — not cardiovascular outcomes. SELECT was the first pre-specified cardiovascular outcomes trial for any anti-obesity agent to show a statistically significant benefit. Anti-obesity medication has now entered the same evidence class as statins and aspirin for cardiovascular risk reduction.
              </p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* How GLP-1 protects the heart — beyond weight loss */}
      <section className="bg-teal-50/30 py-20">
        <SectionShell>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Mechanisms"
                title="How GLP-1 protects the heart — beyond weight loss"
                description="The cardiovascular benefit appears to involve direct cardiac mechanisms, not just the downstream effects of losing weight."
                align="left"
              />
              <div className="mt-8 space-y-5 text-graphite-600 leading-relaxed text-sm">
                <p>
                  One of the most striking findings in SELECT was that the separation between the semaglutide and placebo MACE curves began within the first 6 months — before most participants had achieved significant weight loss. This temporal pattern suggests mechanisms beyond weight reduction alone.
                </p>
                <p>
                  <strong className="text-navy">Direct cardiac GLP-1 receptor effects:</strong> GLP-1 receptors are expressed in cardiomyocytes (heart muscle cells) and coronary arteries. Animal and human studies have shown GLP-1 agonists have direct cardioprotective effects including reduced ischemia-reperfusion injury, improved heart rate variability, and reduced apoptosis (cell death) in cardiac tissue following ischemic events.
                </p>
                <p>
                  <strong className="text-navy">Anti-inflammatory effects:</strong> High-sensitivity CRP — one of the most predictive inflammatory markers for cardiovascular events — decreased by approximately 40% in semaglutide-treated patients in SELECT. This reduction in systemic inflammation reduces atherosclerotic plaque instability, one of the primary mechanisms of acute heart attacks.
                </p>
                <p>
                  <strong className="text-navy">Blood pressure reduction:</strong> An average systolic blood pressure reduction of 3–4 mmHg was observed across GLP-1 trials. While this sounds modest, even a 2 mmHg reduction in population systolic blood pressure is estimated to reduce stroke risk by 10% and cardiovascular disease risk by 7%.
                </p>
                <p>
                  <strong className="text-navy">Lipid profile improvement:</strong> Triglycerides fell 20–30% and HDL cholesterol increased 5–10% in GLP-1 trial participants. Both changes are independently associated with reduced cardiovascular risk.
                </p>
                <p>
                  <strong className="text-navy">Reduced oxidative stress:</strong> GLP-1 receptors in endothelial cells (lining blood vessels) reduce reactive oxygen species production and improve endothelial function — a key early step in atherosclerosis. Better endothelial function means healthier, more flexible vessels.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-teal/20 bg-white p-8 shadow-premium">
              <div className="flex items-center gap-2 mb-6">
                <FlaskConical className="h-5 w-5 text-teal" />
                <h3 className="font-bold text-navy">SELECT trial: by the numbers</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-navy-100/30 pb-3">
                  <span className="text-sm text-graphite-600">Primary endpoint (MACE)</span>
                  <span className="text-sm font-bold text-teal">−20% (HR 0.80)</span>
                </div>
                <div className="flex items-center justify-between border-b border-navy-100/30 pb-3">
                  <span className="text-sm text-graphite-600">CV death</span>
                  <span className="text-sm font-bold text-teal">−15% (HR 0.85)</span>
                </div>
                <div className="flex items-center justify-between border-b border-navy-100/30 pb-3">
                  <span className="text-sm text-graphite-600">Non-fatal heart attack</span>
                  <span className="text-sm font-bold text-teal">−28% (HR 0.72)</span>
                </div>
                <div className="flex items-center justify-between border-b border-navy-100/30 pb-3">
                  <span className="text-sm text-graphite-600">Non-fatal stroke</span>
                  <span className="text-sm font-bold text-teal">−7% (HR 0.93)</span>
                </div>
                <div className="flex items-center justify-between border-b border-navy-100/30 pb-3">
                  <span className="text-sm text-graphite-600">Heart failure hospitalization</span>
                  <span className="text-sm font-bold text-teal">−18% (HR 0.82)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-graphite-600">All-cause mortality</span>
                  <span className="text-sm font-bold text-teal">−19% (HR 0.81)</span>
                </div>
              </div>
              <div className="mt-5 rounded-xl bg-teal-50 px-4 py-3">
                <p className="text-xs text-teal-700 font-medium">
                  <Info className="inline h-3.5 w-3.5 mr-1" />
                  Source: Lincoff AM, et al. NEJM 2023. All figures are hazard ratios vs placebo.
                </p>
              </div>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Who benefits most */}
      <section className="py-20">
        <SectionShell>
          <SectionHeading
            eyebrow="Who Benefits"
            title="Who benefits most from GLP-1 cardiovascular effects"
            description="The cardiovascular data is most robust in specific populations — though the underlying mechanisms apply broadly."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {beneficiaryGroups.map((group) => (
              <div
                key={group.title}
                className="rounded-2xl border border-navy-100/40 bg-white p-6 shadow-premium"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10">
                  <group.icon className="h-5 w-5 text-teal" />
                </div>
                <h3 className="font-bold text-navy mb-2">{group.title}</h3>
                <p className="text-sm leading-relaxed text-graphite-600">{group.description}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Cardiovascular markers table */}
      <section className="bg-gradient-to-b from-cloud to-white py-20">
        <SectionShell>
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="Lab Values"
              title="Other cardiovascular markers that improve"
              description="Beyond the primary trial endpoint, GLP-1 medications improve a wide range of cardiovascular risk markers measurable in standard blood tests."
              align="left"
            />
            <div className="mt-8 overflow-hidden rounded-2xl border border-navy-100/40 bg-white shadow-premium">
              <div className="grid grid-cols-2 gap-0 border-b border-navy-100/40 bg-cloud px-6 py-3">
                <span className="text-xs font-bold uppercase tracking-wide text-graphite-500">Marker</span>
                <span className="text-xs font-bold uppercase tracking-wide text-graphite-500">Typical Change with GLP-1 Therapy</span>
              </div>
              {cardiovascularMarkers.map((row, i) => (
                <div
                  key={row.marker}
                  className={`grid grid-cols-2 gap-0 px-6 py-4 ${
                    i < cardiovascularMarkers.length - 1 ? "border-b border-navy-100/30" : ""
                  }`}
                >
                  <span className="text-sm font-medium text-navy">{row.marker}</span>
                  <span
                    className={`text-sm font-semibold ${
                      row.direction === "down" ? "text-teal" : "text-emerald-600"
                    }`}
                  >
                    {row.change}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-graphite-400">
              Values represent ranges from published clinical trials. Individual results vary. Data from SELECT, STEP, and SURMOUNT trial programs.
            </p>
          </div>
        </SectionShell>
      </section>

      {/* What this means practically */}
      <section className="py-20">
        <SectionShell>
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="Clinical Perspective"
              title="What this means for real patients"
              description="How cardiovascular medicine is changing in response to the SELECT data — and what it means for your treatment decision."
              align="left"
            />
            <div className="mt-8 space-y-5 text-graphite-600 leading-relaxed">
              <p>
                Before SELECT, GLP-1 medications were classified as weight management drugs that happened to have cardiovascular benefits. After SELECT, that classification has shifted. The American College of Cardiology and the Obesity Medicine Association have both updated their guidance to reflect that semaglutide and related GLP-1 agonists should be considered as cardiovascular risk-reduction therapies for patients with obesity and established CVD.
              </p>
              <p>
                <strong className="text-navy">The framing has changed.</strong> Cardiologists who once referred patients to weight management programs are now directly prescribing GLP-1 medications as part of cardiovascular treatment plans. The MACE reduction data puts semaglutide in a similar evidence tier to some established cardiovascular medications — not as a replacement, but as an addition.
              </p>
              <p>
                <strong className="text-navy">If you have obesity and any cardiovascular history</strong> — including a prior heart attack, stroke, peripheral arterial disease, coronary artery disease, or heart failure — GLP-1 treatment is now closer to a medical imperative than a cosmetic choice. The risk-benefit calculus is strongly in favor of treatment for this population.
              </p>
              <p>
                <strong className="text-navy">If you have obesity without established CVD</strong>, the primary benefit is risk reduction: improving blood pressure, lipids, inflammation, and insulin sensitivity before cardiovascular disease develops. The data here comes from extrapolation of mechanism and intermediate endpoints rather than a completed outcomes trial in this specific group — but the biological rationale is sound.
              </p>
              <p>
                Nature's Journey providers review your cardiovascular history as part of intake. If you have CVD in your history, this will be noted and factored into your clinical management plan.
              </p>
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
                <h3 className="font-bold text-navy text-sm">If you have cardiovascular disease</h3>
                <ul className="mt-2 space-y-1.5 text-xs text-graphite-600 leading-relaxed">
                  <li>• Do not stop any prescribed cardiovascular medications without discussing with your cardiologist. GLP-1 treatment is additive, not a replacement.</li>
                  <li>• Share your complete medication list with your Nature's Journey provider — some interactions with antihypertensives and antidiabetics require monitoring.</li>
                  <li>• If you have heart failure with reduced ejection fraction (HFrEF), your provider will need your cardiology records before approving GLP-1 treatment.</li>
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
            title="Heart health questions, answered"
            description="Straightforward answers to what patients with cardiovascular concerns actually ask."
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
              <Users className="h-8 w-8 text-teal" />
              <h3 className="font-bold text-navy text-sm">Cardiovascular-aware protocols</h3>
              <p className="text-xs text-graphite-500">Providers review cardiac history as part of intake</p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Further reading */}
      <section className="py-12 bg-cloud/40 border-y border-sage/20">
        <SectionShell>
          <h2 className="text-lg font-semibold text-navy mb-2">Further reading</h2>
          <p className="text-sm text-graphite-500 mb-6">Clinical evidence and practical guides for GLP-1 and cardiovascular health</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "How GLP-1 Medications Work", href: "/blog/understanding-glp1", tag: "Science" },
              { label: "Semaglutide Mechanism of Action", href: "/blog/semaglutide-mechanism-of-action-explained", tag: "Clinical" },
              { label: "GLP-1 & Prediabetes", href: "/prediabetes", tag: "Metabolic Health" },
              { label: "Semaglutide vs Tirzepatide (2026)", href: "/blog/tirzepatide-vs-semaglutide-2026", tag: "Comparison" },
            ].map((article) => (
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
            {siteConfig.compliance.shortDisclaimer} Clinical data cited from published peer-reviewed research including Lincoff AM et al., NEJM 2023 (SELECT trial). Individual results vary. Treatment eligibility determined by a licensed medical provider. Do not discontinue any prescribed cardiovascular medications without consulting your physician.
          </p>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
