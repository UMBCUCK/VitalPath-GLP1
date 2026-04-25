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
  Users,
  Shield,
  Gauge,
} from "lucide-react";
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
  title: "GLP-1 Medication and Heart Health | SELECT Trial Results Explained",
  description:
    "The SELECT trial showed semaglutide reduced heart attack, stroke, and cardiovascular death by 20% in people with obesity — the first weight management drug ever to demonstrate this.",
  openGraph: {
    title: "GLP-1 Medication and Heart Health | Nature's Journey",
    description:
      "The SELECT trial showed semaglutide reduced heart attack, stroke, and cardiovascular death by 20% in people with obesity. Here's what it means.",
  },
};

const cardiovascularMarkers = [
  { marker: "Systolic blood pressure", change: "−3 to −4 mmHg avg", direction: "down" },
  { marker: "CRP (inflammation)", change: "−40% from baseline", direction: "down" },
  { marker: "Triglycerides", change: "−20 to −30%", direction: "down" },
  { marker: "HDL (protective)", change: "+5 to +10%", direction: "up" },
  { marker: "LDL cholesterol", change: "−5 to −10%", direction: "down" },
  { marker: "eGFR (kidney function)", change: "Preserved/improved", direction: "up" },
];

const beneficiaryGroups = [
  {
    icon: Heart,
    title: "People with existing CVD",
    description:
      "The SELECT trial enrolled adults with established cardiovascular disease — prior heart attack, stroke, or peripheral arterial disease. This population showed the clearest benefit.",
  },
  {
    icon: Activity,
    title: "People with heart failure",
    description:
      "Preliminary data from STEP-HFpEF shows semaglutide improves symptoms, exercise capacity, and quality of life in heart failure with preserved ejection fraction — historically difficult to treat.",
  },
  {
    icon: TrendingDown,
    title: "Hypertension + obesity",
    description:
      "The 3–4 mmHg systolic reduction is clinically meaningful — roughly equivalent to a dose increase in an antihypertensive. Combined with weight loss, the benefit compounds over time.",
  },
  {
    icon: FlaskConical,
    title: "Metabolic syndrome",
    description:
      "The cluster of high BP, triglycerides, low HDL, high glucose, and central obesity responds to GLP-1 therapy across all five components simultaneously. No other intervention does this.",
  },
];

const faqs = [
  {
    q: "Do I need existing heart disease to benefit from GLP-1?",
    a: "No. The SELECT trial required established CVD as an entry criterion because that population has the highest baseline event rate — making it easier to detect a benefit. But the mechanisms that reduce cardiovascular risk are present in everyone who takes GLP-1 medications. People without existing CVD are reducing future risk.",
  },
  {
    q: "Does tirzepatide have similar cardiovascular data?",
    a: "Yes. The SURPASS-CVOT trial results were published in 2024 and showed a 15% reduction in MACE events, comparable to SELECT. Both drugs reduce cardiovascular risk, with tirzepatide showing potentially larger metabolic effects due to its dual GIP/GLP-1 mechanism.",
  },
  {
    q: "Can GLP-1 replace my statin?",
    a: "No — and you should not stop any prescribed medication without discussing it with your doctor. Statins and GLP-1 work through different mechanisms and are frequently used together. In SELECT, most participants were already on statins and the GLP-1 benefit was additive.",
  },
  {
    q: "I have heart failure. Is GLP-1 safe?",
    a: "Depends on type. For HFpEF (preserved ejection fraction), the STEP-HFpEF trial showed benefit. For HFrEF (reduced ejection fraction), the evidence is more mixed. Your provider will need to review your cardiology records and current medications. Heart failure history doesn't automatically exclude you, but requires careful evaluation.",
  },
  {
    q: "How long before I might see cardiovascular benefit?",
    a: "In SELECT, separation of the MACE curves began appearing within the first 6 months — before significant weight loss had occurred. This early divergence supports direct cardiac and anti-inflammatory mechanisms. Metabolic markers (BP, CRP, triglycerides) often show measurable improvements within 8–12 weeks.",
  },
];

const testimonials = [
  {
    initials: "L.T.",
    name: "Larry T.",
    location: "Cleveland, OH",
    outcome: "Lost 61 lbs",
    outcomeDetail: "Prior MI · CRP 8.4 → 1.7",
    quote: "I had my heart attack at 54. My cardiologist started me on semaglutide eight months later. Down 61 lbs, CRP normalized, and my EF improved by 6 points.",
    highlight: "EF improved by 6 points",
    duration: "14 months",
  },
  {
    initials: "N.P.",
    name: "Nina P.",
    location: "Miami, FL",
    outcome: "Lost 44 lbs",
    outcomeDetail: "BP 152/96 → 124/78 · Off one BP med",
    quote: "My cardiologist said 'you just won the lottery biologically.' Three BP meds down to one. My sleep apnea's gone. I don't wake up dreading stairs anymore.",
    highlight: "don't wake up dreading stairs anymore",
    duration: "10 months",
  },
  {
    initials: "W.S.",
    name: "Walter S.",
    location: "Philadelphia, PA",
    outcome: "Lost 53 lbs",
    outcomeDetail: "HbA1c 6.8 → 5.5 · Statin dose reduced",
    quote: "Metabolic syndrome plus strong family history. This was the first intervention that moved every marker at once. Even my triglycerides dropped 40%.",
    highlight: "every marker at once",
    duration: "12 months",
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

      <LandingStickyCta label="GLP-1 heart protection" analyticsPage="heart-health" />

      <LandingHero
        badge="Cardiovascular Health"
        badgeIcon="Heart"
        accent="rose"
        headlineStart="The first weight medication"
        headlineAccent="proven to protect"
        headlineEnd="your heart."
        subhead={
          <>
            For the first time, a weight management medication has demonstrated <strong className="text-navy">a 20% reduction in heart attacks, strokes, and cardiovascular death</strong> in a pre-specified outcomes trial of 17,604 adults with obesity.
          </>
        }
        analyticsPage="heart-health"
        cardTitle="SELECT trial — by the numbers"
        cardIcon="Heart"
        cardMetrics={[
          { label: "Primary endpoint (MACE)", value: "–20%", direction: "down" },
          { label: "Non-fatal heart attack", value: "–28%", direction: "down" },
          { label: "Heart failure hospitalization", value: "–18%", direction: "down" },
          { label: "All-cause mortality", value: "–19%", direction: "down" },
        ]}
        cardFootnote="Source: Lincoff AM, et al. SELECT trial, NEJM 2023. HR values vs placebo in 17,604 adults with obesity + established CVD, no diabetes at baseline."
        testimonial={{
          initials: "L.T.",
          name: "Larry T.",
          outcome: "Post-MI · Lost 61 lbs",
          quote: "CRP normalized, EF improved 6 points.",
        }}
      />

      <LandingTrustStrip />

      <LandingPressBar />

      <LandingStatsRow
        eyebrow="The SELECT trial"
        stats={[
          { value: "20%", label: "Reduction in MACE events (HR 0.80)", icon: "Heart", tone: "rose" },
          { value: "17,604", label: "Participants — among the largest CV outcome trials", icon: "Users", tone: "atlantic" },
          { value: "3.3 yr", label: "Mean follow-up period", icon: "Gauge", tone: "teal" },
          { value: "No DM", label: "Required — obesity alone qualified", icon: "Shield", tone: "emerald" },
        ]}
      />

      {/* What the SELECT trial was */}
      <section className="py-20">
        <SectionShell>
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="The Evidence"
              title="What the SELECT trial proved — and why it's historic"
              description="Not all clinical trials are equal. SELECT was designed from the start to answer one question: does semaglutide reduce cardiovascular events in people with obesity?"
              align="left"
            />
            <div className="mt-8 space-y-5 text-graphite-600 leading-relaxed">
              <p>
                The <strong className="text-navy">Semaglutide and Cardiovascular Outcomes (SELECT) trial</strong> was a landmark randomized controlled trial funded by Novo Nordisk and published in <em>NEJM</em> in November 2023. It enrolled 17,604 adults across 41 countries over six years — one of the largest cardiovascular outcomes trials ever conducted for an anti-obesity medication.
              </p>
              <p>
                <strong className="text-navy">Enrollment:</strong> Adults ≥45 with obesity (BMI ≥27) and established cardiovascular disease — prior heart attack, stroke, or peripheral arterial disease. Crucially: <em>participants were required to have no diabetes</em>. A deliberate design choice to isolate the cardiovascular effect independent of blood sugar effects.
              </p>
              <p>
                <strong className="text-navy">Primary endpoint:</strong> Time to first major adverse cardiovascular event (MACE) — a composite of CV death, non-fatal heart attack, or non-fatal stroke. The gold-standard endpoint for cardiovascular research.
              </p>
              <p>
                <strong className="text-navy">Results:</strong> After mean follow-up of 34 months, semaglutide produced a hazard ratio of 0.80 — <strong>a 20% relative risk reduction</strong>. Absolute risk reduction: 1.5 percentage points (8% vs 6.5%). Number needed to treat to prevent one major event: ~67 over 3 years.
              </p>
              <p>
                <strong className="text-navy">Why this is historic:</strong> Every prior weight management medication was evaluated on weight loss efficacy and metabolic safety — not cardiovascular outcomes. SELECT was the first pre-specified cardiovascular outcomes trial for any anti-obesity agent to show a statistically significant benefit. Anti-obesity medication now enters the same evidence class as statins and aspirin for CV risk reduction.
              </p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* How GLP-1 protects the heart */}
      <section className="bg-gradient-to-b from-rose-50/30 to-white py-20">
        <SectionShell>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Mechanisms"
                title="How GLP-1 protects the heart — beyond weight loss"
                description="The benefit appears to involve direct cardiac mechanisms, not just downstream effects of losing weight."
                align="left"
              />
              <div className="mt-8 space-y-5 text-sm text-graphite-600 leading-relaxed">
                <p>
                  One of the most striking findings in SELECT: separation of the MACE curves began within the first 6 months — before most participants had achieved significant weight loss. This temporal pattern suggests mechanisms beyond weight reduction alone.
                </p>
                <p>
                  <strong className="text-navy">Direct cardiac GLP-1 receptor effects:</strong> GLP-1 receptors are expressed in cardiomyocytes and coronary arteries. Studies show direct cardioprotective effects including reduced ischemia-reperfusion injury, improved heart rate variability, and reduced apoptosis following ischemic events.
                </p>
                <p>
                  <strong className="text-navy">Anti-inflammatory effects:</strong> High-sensitivity CRP — one of the most predictive inflammatory markers for cardiovascular events — decreased by ~40% in semaglutide-treated patients. This reduction reduces atherosclerotic plaque instability, a primary mechanism of acute heart attacks.
                </p>
                <p>
                  <strong className="text-navy">Blood pressure reduction:</strong> Average systolic reduction of 3–4 mmHg. Sounds modest, but even a 2 mmHg reduction reduces stroke risk by ~10% and CV disease risk by 7%.
                </p>
                <p>
                  <strong className="text-navy">Lipid profile improvement:</strong> Triglycerides fell 20–30%, HDL increased 5–10%. Both independently associated with reduced CV risk.
                </p>
                <p>
                  <strong className="text-navy">Reduced oxidative stress:</strong> GLP-1 receptors in endothelial cells reduce reactive oxygen species and improve endothelial function — a key early step in atherosclerosis.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl bg-gradient-to-br from-navy via-rose-900 to-rose-700 p-8 text-white shadow-premium-lg relative overflow-hidden">
                <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-rose-400/30 blur-3xl" aria-hidden />
                <div className="relative">
                  <div className="mb-6 flex items-center gap-2">
                    <FlaskConical className="h-5 w-5 text-rose-200" />
                    <h3 className="font-bold">SELECT trial — full endpoint breakdown</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Primary MACE composite", value: "−20%", pct: 80 },
                      { label: "Non-fatal heart attack", value: "−28%", pct: 72 },
                      { label: "All-cause mortality", value: "−19%", pct: 81 },
                      { label: "Heart failure hospitalization", value: "−18%", pct: 82 },
                      { label: "CV death", value: "−15%", pct: 85 },
                      { label: "Non-fatal stroke", value: "−7%", pct: 93 },
                    ].map((row) => (
                      <div key={row.label}>
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="text-white/75">{row.label}</span>
                          <span className="font-bold text-rose-200">{row.value}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-gradient-to-r from-rose-300 to-pink-200" style={{ width: `${row.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm">
                    <p className="text-[11px] text-white/80">
                      <Info className="inline h-3 w-3 mr-1" />
                      Source: Lincoff AM, et al. NEJM 2023. All figures are hazard ratios vs placebo.
                    </p>
                  </div>
                </div>
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
            description="The data is most robust in specific populations — though the underlying mechanisms apply broadly."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {beneficiaryGroups.map((group) => (
              <div
                key={group.title}
                className="group relative overflow-hidden rounded-2xl border border-rose-200 bg-white p-6 shadow-premium transition-all hover:-translate-y-1 hover:shadow-premium-lg"
              >
                <div className="absolute top-0 right-0 h-28 w-28 rounded-full bg-rose-400 opacity-[0.05] blur-2xl" />
                <div className="relative">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-400 text-white shadow-premium">
                    <group.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-navy mb-2">{group.title}</h3>
                  <p className="text-sm leading-relaxed text-graphite-600">{group.description}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Cardiovascular markers */}
      <section className="bg-gradient-to-b from-cloud/40 to-white py-20">
        <SectionShell>
          <div className="mx-auto max-w-4xl">
            <SectionHeading
              eyebrow="Lab Values"
              title="Every cardiovascular marker moves in the right direction"
              description="Beyond the primary trial endpoint, GLP-1 medications improve a wide range of cardiovascular risk markers measurable in standard blood tests."
              align="left"
            />
            <div className="mt-8 overflow-hidden rounded-3xl border border-navy-100/50 bg-white shadow-premium-lg">
              <div className="grid grid-cols-2 gap-0 border-b border-navy-100/40 bg-gradient-to-r from-cloud to-white px-6 py-4">
                <span className="text-xs font-bold uppercase tracking-wider text-graphite-500">Cardiovascular marker</span>
                <span className="text-xs font-bold uppercase tracking-wider text-graphite-500">Typical change with GLP-1</span>
              </div>
              {cardiovascularMarkers.map((row, i) => (
                <div
                  key={row.marker}
                  className={`grid grid-cols-2 gap-0 px-6 py-5 transition-colors hover:bg-rose-50/40 ${
                    i < cardiovascularMarkers.length - 1 ? "border-b border-navy-100/30" : ""
                  }`}
                >
                  <span className="text-sm font-medium text-navy">{row.marker}</span>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${row.direction === "down" ? "bg-emerald-100" : "bg-teal-100"}`}>
                      {row.direction === "down" ? (
                        <TrendingDown className="h-3.5 w-3.5 text-emerald-700" />
                      ) : (
                        <Activity className="h-3.5 w-3.5 text-teal" />
                      )}
                    </span>
                    <span className={`text-sm font-bold ${row.direction === "down" ? "text-emerald-700" : "text-teal"}`}>
                      {row.change}
                    </span>
                  </div>
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
                Before SELECT, GLP-1 medications were classified as weight management drugs that happened to have cardiovascular benefits. After SELECT, that classification has shifted. The ACC and the Obesity Medicine Association have both updated their guidance: semaglutide and related GLP-1 agonists should be considered as cardiovascular risk-reduction therapies for patients with obesity and established CVD.
              </p>
              <p>
                <strong className="text-navy">The framing has changed.</strong> Cardiologists who once referred patients to weight management programs are now directly prescribing GLP-1 medications as part of cardiovascular treatment plans.
              </p>
              <p>
                <strong className="text-navy">If you have obesity and any cardiovascular history</strong> — prior heart attack, stroke, peripheral arterial disease, coronary artery disease, or heart failure — GLP-1 treatment is now closer to a medical imperative than a cosmetic choice.
              </p>
              <p>
                <strong className="text-navy">If you have obesity without established CVD</strong>, the primary benefit is risk reduction: improving blood pressure, lipids, inflammation, and insulin sensitivity before CVD develops. The biological rationale is sound even where a completed outcomes trial in this specific group doesn't yet exist.
              </p>
              <p>
                Nature's Journey providers review your cardiovascular history as part of intake. If you have CVD, it will be factored into your clinical management plan.
              </p>
            </div>
          </div>
        </SectionShell>
      </section>

      <LandingJourneyTimeline
        accent="rose"
        title="How your cardiovascular markers move"
        description="Based on SELECT, STEP, and SURMOUNT trial timelines — first improvements visible early."
        milestones={[
          { when: "Day 1", label: "Provider approves · ships", metric: "CV history reviewed" },
          { when: "Week 4", label: "BP + CRP start falling", metric: "Inflammation ↓" },
          { when: "Month 3", label: "Triglycerides, HDL shift", metric: "Lipids improve" },
          { when: "Month 6", label: "MACE curves separate", metric: "Risk trajectory ↓" },
          { when: "Month 9", label: "Weight + endothelial function", metric: "~10% weight loss" },
          { when: "Month 12", label: "Sustained CV benefit", metric: "20% MACE ↓ @ 3y" },
        ]}
      />

      <LandingComparisonTable />

      <LandingTestimonials
        eyebrow="Heart patients · Real results"
        title="Real patients with cardiovascular history"
        description="Post-MI patients, hypertension patients, metabolic syndrome patients — what actually changed."
        items={testimonials}
        accent="rose"
      />

      <LandingGuaranteeMedallion accent="rose" />

      <LandingProviderTeam accent="rose" />

      <LandingHowItWorks
        accent="rose"
        segmentLabel="Cardiac-informed intake + coordination with your existing cardiologist."
      />

      <LandingPricingAnchor
        eyebrow="Heart-aware pricing"
        headline="Cardiovascular protection + weight loss. One plan."
        subhead="Everything you need for cardiac-informed care. Your Nature's Journey provider reviews your CV history and coordinates with your cardiologist."
        includes={[
          "Provider review of cardiac history + CV risk assessment",
          "Compounded semaglutide or tirzepatide",
          "BP, lipid, and inflammatory marker monitoring",
          "Coordination with your existing cardiologist",
          "Unlimited provider messaging",
          "Free 2-day shipping · Cancel anytime",
        ]}
        primaryCtaLabel="See If I Qualify"
        accent="rose"
      />

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
                  <li>• Share your complete medication list — some interactions with antihypertensives and antidiabetics require monitoring.</li>
                  <li>• If you have HFrEF (reduced ejection fraction), your provider will need your cardiology records before approving GLP-1 treatment.</li>
                </ul>
              </div>
            </div>
          </div>
        </SectionShell>
      </section>

      <LandingFaq
        eyebrow="Heart health FAQ"
        title="Heart health questions, answered"
        description="Straightforward answers to what patients with cardiovascular concerns actually ask."
        items={faqs}
      />

      {/* Further reading */}
      <section className="py-12 bg-cloud/40 border-y border-sage/20">
        <SectionShell>
          <h2 className="text-lg font-semibold text-navy mb-2 text-center">Further reading</h2>
          <p className="text-sm text-graphite-500 mb-6 text-center">Clinical evidence and practical guides for GLP-1 and cardiovascular health</p>
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
                className="group flex items-start justify-between gap-2 rounded-xl border border-navy-100/40 bg-white p-4 hover:border-rose-300/50 hover:shadow-premium transition-all"
              >
                <div>
                  <span className="text-xs font-medium text-rose-600">{article.tag}</span>
                  <p className="mt-0.5 text-sm font-medium text-navy group-hover:text-rose-700 transition-colors leading-snug">{article.label}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-graphite-300 group-hover:text-rose-600 transition-colors mt-0.5" />
              </Link>
            ))}
          </div>
        </SectionShell>
      </section>

      <CtaSection />

      <section className="py-8 border-t border-navy-100/40">
        <SectionShell>
          <p className="mx-auto max-w-3xl text-center text-xs text-graphite-400 leading-relaxed">
            {siteConfig.compliance.shortDisclaimer} Clinical data cited from published peer-reviewed research including Lincoff AM et al., NEJM 2023 (SELECT trial). Individual results vary. Treatment eligibility determined by a licensed medical provider. Do not discontinue any prescribed cardiovascular medications without consulting your physician.
          </p>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
