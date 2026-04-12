export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Shield,
  TrendingDown,
  Activity,
  Users,
  AlertCircle,
  Heart,
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
  title: "GLP-1 Medication for Type 2 Diabetes & Weight Loss | VitalPath",
  description:
    "GLP-1 medications like semaglutide and tirzepatide treat type 2 diabetes while producing 15-21% weight loss. Get online evaluation by a licensed provider.",
  openGraph: {
    title: "GLP-1 Medication for Type 2 Diabetes & Weight Loss | VitalPath",
    description:
      "GLP-1 medications like semaglutide and tirzepatide treat type 2 diabetes while producing 15-21% weight loss. Get online evaluation by a licensed provider.",
  },
};

const stats = [
  { stat: "15–21%", label: "Body weight loss in clinical trials with GLP-1 therapy" },
  { stat: "1.5–2.0%", label: "Average A1c reduction across STEP-2 and SURPASS trials" },
  { stat: "FDA-approved", label: "For both type 2 diabetes and obesity management" },
  { stat: "2× lower", label: "Cardiovascular risk reduction (SELECT trial)" },
];

const mechanismCards = [
  {
    icon: TrendingDown,
    title: "Blood sugar control",
    description:
      "GLP-1 agonists stimulate insulin secretion from pancreatic beta cells only when blood glucose is elevated — eliminating the hypoglycemia risk seen with older diabetes drugs. They also suppress glucagon, the hormone that drives liver glucose production, reducing fasting blood sugar. The net result: A1c improvements of 1.5–2.3 percentage points in people with type 2 diabetes.",
  },
  {
    icon: Activity,
    title: "Weight loss effect",
    description:
      "Originally developed as diabetes medications, GLP-1 agonists produce weight loss far beyond what was expected from a glucose-lowering drug. Semaglutide 2.4mg (Wegovy) produces ~15% average weight loss; tirzepatide 15mg (Zepbound) achieves ~21% in SURMOUNT-1. For people with T2D, this weight loss is itself therapeutic — visceral fat reduction dramatically improves insulin sensitivity independent of the drug's direct glycemic effects.",
  },
  {
    icon: Heart,
    title: "Cardiovascular protection",
    description:
      "The SELECT trial (17,604 participants, 3.3 years) demonstrated a 20% reduction in major cardiovascular events with semaglutide in people with obesity — even without diabetes. For people with T2D, SUSTAIN-6 showed a 26% MACE reduction, and tirzepatide's SURPASS-CVOT confirmed comparable benefit. This makes GLP-1 medications uniquely positioned to address the cardiovascular burden that type 2 diabetes carries.",
  },
];

const trialData = [
  {
    trial: "STEP-2 (semaglutide in T2D)",
    drug: "Semaglutide 2.4mg",
    finding:
      "In patients with type 2 diabetes and obesity, semaglutide 2.4mg produced 9.6% weight loss vs 3.4% with placebo at 68 weeks. A1c was reduced by 1.6 percentage points. 68% of participants achieved A1c below 7.0% (the standard diabetes control target).",
    source: "Davies M et al., Lancet 2021",
  },
  {
    trial: "SURPASS-2 (tirzepatide in T2D)",
    drug: "Tirzepatide 5/10/15mg",
    finding:
      "Tirzepatide produced A1c reductions of 2.01–2.30 percentage points vs 1.86 with semaglutide 1mg, with weight loss of 7.6–11.2 kg. Over 90% of tirzepatide-treated patients achieved A1c below 7.0%. This trial established tirzepatide as the most effective approved T2D medication for combined glucose and weight outcomes.",
    source: "Frías JP et al., NEJM 2021",
  },
  {
    trial: "SELECT trial (cardiovascular outcomes)",
    drug: "Semaglutide 2.4mg",
    finding:
      "17,604 adults with obesity and established cardiovascular disease — no diabetes required. Hazard ratio for MACE: 0.80 (20% relative risk reduction). Curves began separating within 6 months, suggesting cardiovascular mechanisms beyond weight loss alone. All-cause mortality was reduced by 19%.",
    source: "Lincoff AM et al., NEJM 2023",
  },
  {
    trial: "SURPASS-CVOT (tirzepatide CVD outcomes)",
    drug: "Tirzepatide 10/15mg",
    finding:
      "Published 2024. Showed a 15% reduction in MACE events in people with T2D and high cardiovascular risk. Tirzepatide's dual GIP/GLP-1 mechanism provides comparable cardiovascular protection to semaglutide, with greater weight loss and glycemic efficacy.",
    source: "Bhatt DL et al., NEJM 2024",
  },
];

const faqs = [
  {
    q: "Can I take GLP-1 medication if I already have type 2 diabetes?",
    a: "Yes — GLP-1 medications were originally developed as diabetes treatments. Semaglutide (Ozempic) and tirzepatide (Mounjaro) are FDA-approved specifically for type 2 diabetes management. The weight loss benefit was discovered during diabetes trials, leading to the development of higher-dose formulations (Wegovy, Zepbound) for obesity. If you have T2D, you may qualify for GLP-1 treatment even at a lower BMI.",
  },
  {
    q: "How much does GLP-1 medication lower A1c?",
    a: "Clinical trials show semaglutide reduces A1c by an average of 1.5–1.8 percentage points in patients with type 2 diabetes (STEP-2 trial). Tirzepatide achieves even greater A1c reductions — up to 2.0–2.3 points in SURPASS trials — making it one of the most effective diabetes medications available.",
  },
  {
    q: "Can GLP-1 help reverse type 2 diabetes?",
    a: "Some patients achieve A1c levels in the normal range with GLP-1 treatment combined with weight loss — a state sometimes called 'diabetes remission.' This is more likely in patients who have had diabetes for fewer years and achieve significant weight loss. However, GLP-1 medication does not cure diabetes; stopping treatment typically causes A1c to return toward previous levels.",
  },
  {
    q: "Is GLP-1 medication safe to take with metformin?",
    a: "Yes. GLP-1 medications and metformin are frequently prescribed together as combination therapy for type 2 diabetes. They work through different mechanisms and complement each other well. Your provider will review all current medications during intake and create an appropriate treatment plan.",
  },
];

export default function Type2DiabetesPage() {
  return (
    <MarketingShell>
      <MedicalConditionJsonLd
        name="Type 2 Diabetes"
        description="A metabolic disorder characterized by elevated blood glucose due to insulin resistance and progressive beta cell dysfunction, affecting approximately 37 million Americans."
        url="/type-2-diabetes"
        possibleTreatment="GLP-1 receptor agonist therapy, metformin, lifestyle intervention"
      />
      <FAQPageJsonLd faqs={faqs.map((f) => ({ question: f.q, answer: f.a }))} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Type 2 Diabetes", href: "/type-2-diabetes" },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6">Dual-Action Treatment</Badge>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-navy sm:text-5xl lg:text-6xl">
            Treating type 2 diabetes and obesity together
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500 leading-relaxed">
            GLP-1 medications address both conditions simultaneously — lowering A1c by 1.5–2.3 points while producing 15–21% body weight loss. Originally developed for diabetes, these medications are now transforming how both conditions are treated.
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

      {/* Why GLP-1 is the preferred treatment */}
      <section className="bg-teal-50/30 py-20">
        <SectionShell>
          <SectionHeading
            eyebrow="Mechanism"
            title="Why GLP-1 is the preferred treatment for T2D with obesity"
            description="GLP-1 agonists work through three simultaneous mechanisms that address the root causes of type 2 diabetes and weight gain at once."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
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
              title="What the trials show"
              description="STEP-2, SURPASS, and SELECT trials together establish GLP-1 medications as the most clinically impactful treatment available for type 2 diabetes with obesity."
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
                Trial data cited as reported in original publications. Individual results vary. STEP-2 used semaglutide 2.4mg; SURPASS-2 used tirzepatide 5/10/15mg vs semaglutide 1mg; SELECT enrolled participants without diabetes at baseline.
              </p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* What to expect */}
      <section className="bg-gradient-to-b from-cloud to-white py-20">
        <SectionShell>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Treatment Timeline"
                title="What to expect during treatment"
                description="GLP-1 therapy follows a structured titration schedule designed to improve tolerability and optimize outcomes over time."
                align="left"
              />
              <div className="mt-8 space-y-5 text-sm text-graphite-600 leading-relaxed">
                <p>
                  GLP-1 medications are started at a low dose and titrated upward over several weeks. This gradual increase reduces nausea and other gastrointestinal side effects while allowing your body to adapt.
                </p>
                <p>
                  <strong className="text-navy">Weeks 1–4:</strong> Low starting dose. Mild appetite reduction may begin. Some patients experience nausea that typically improves within 1–2 weeks. Blood sugar improvements can appear within the first month as the incretin mechanism takes effect.
                </p>
                <p>
                  <strong className="text-navy">Months 2–4:</strong> Dose increases toward therapeutic range. A1c reductions of 0.5–1.0 percentage points are commonly observed by the 3-month mark. Weight loss accelerates — most patients begin to notice meaningful changes in this period.
                </p>
                <p>
                  <strong className="text-navy">Months 4–12:</strong> Continuation at maintenance dose. The majority of A1c improvement and weight loss occurs in this window. Clinical trials measure primary endpoints at 68 weeks (semaglutide STEP trials) or 40–76 weeks (SURPASS trials).
                </p>
                <p>
                  <strong className="text-navy">Ongoing:</strong> Continued treatment maintains metabolic improvements. Stopping the medication typically reverses A1c and weight loss benefits within 12 months. Your VitalPath provider will discuss long-term treatment planning during your follow-ups.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-teal/20 bg-white p-7 shadow-premium">
                <div className="flex items-center gap-2 mb-5">
                  <Activity className="h-5 w-5 text-teal" />
                  <h3 className="font-bold text-navy">Typical A1c trajectory</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Baseline: A1c 8.0–9.0% (typical T2D at start)", width: "85%", color: "bg-red-400", text: "text-red-500" },
                    { label: "3 months: ~0.6–0.8% reduction", width: "70%", color: "bg-amber-400", text: "text-amber-600" },
                    { label: "6 months: ~1.0–1.5% reduction", width: "55%", color: "bg-teal-400", text: "text-teal" },
                    { label: "12 months: ~1.5–2.3% reduction (at goal for many)", width: "38%", color: "bg-emerald-500", text: "text-emerald-600" },
                  ].map((row) => (
                    <div key={row.label} className="relative">
                      <div className="text-xs text-graphite-500 mb-1">{row.label}</div>
                      <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                        <div className={`h-full ${row.color} rounded-full`} style={{ width: row.width }} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-graphite-400">
                  Illustrative ranges based on STEP-2 and SURPASS trial data. Individual results vary. A1c goal (typically &lt;7.0%) should be set with your provider.
                </p>
              </div>
              <div className="rounded-2xl border border-navy-100/40 bg-white p-6 shadow-premium">
                <h3 className="font-bold text-navy text-sm mb-3">What to tell your VitalPath provider</h3>
                {[
                  "Most recent A1c and fasting glucose values",
                  "Current diabetes medications (metformin, insulin, SGLT-2, etc.)",
                  "How long you have had a type 2 diabetes diagnosis",
                  "Any history of pancreatitis, thyroid cancer, or kidney disease",
                  "Current blood pressure, cholesterol, and cardiovascular history",
                  "Any history of diabetic neuropathy, retinopathy, or nephropathy",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 mt-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                    <span className="text-sm leading-relaxed text-graphite-600">{item}</span>
                  </div>
                ))}
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
                <h3 className="font-bold text-navy text-sm">Important notes for patients with type 2 diabetes</h3>
                <ul className="mt-2 space-y-1.5 text-xs text-graphite-600 leading-relaxed">
                  <li>• Do not stop metformin, insulin, or other prescribed diabetes medications without discussing with your provider — GLP-1 medications are frequently used in combination.</li>
                  <li>• A personal or family history of medullary thyroid carcinoma (MTC) or MEN2 is a contraindication for all GLP-1 agonists.</li>
                  <li>• History of pancreatitis requires disclosure and careful provider evaluation before starting GLP-1 therapy.</li>
                  <li>• If you take insulin or sulfonylureas alongside GLP-1 medications, your provider may need to reduce those doses to prevent hypoglycemia as A1c improves.</li>
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
            title="Type 2 diabetes questions, answered"
            description="What patients with type 2 diabetes actually ask about GLP-1 medications — eligibility, A1c targets, remission, and combination therapy."
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
              <h3 className="font-bold text-navy text-sm">Licensed providers</h3>
              <p className="text-xs text-graphite-500">Board-certified physicians evaluate every patient</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Activity className="h-8 w-8 text-teal" />
              <h3 className="font-bold text-navy text-sm">Metabolic expertise</h3>
              <p className="text-xs text-graphite-500">Providers experienced with diabetes and GLP-1 therapy</p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Further reading */}
      <section className="py-12 bg-cloud/40 border-y border-sage/20">
        <SectionShell>
          <h2 className="text-lg font-semibold text-navy mb-2">Further reading</h2>
          <p className="text-sm text-graphite-500 mb-6">Clinical context and practical guides for GLP-1 and type 2 diabetes</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Metformin + Semaglutide Together?", href: "/blog/metformin-and-semaglutide-can-you-take-together", tag: "Medications" },
              { label: "Semaglutide Mechanism of Action", href: "/blog/semaglutide-mechanism-of-action-explained", tag: "Science" },
              { label: "Tirzepatide vs Semaglutide (2026)", href: "/blog/tirzepatide-vs-semaglutide-2026", tag: "Comparison" },
              { label: "Is Semaglutide Safe Long-Term?", href: "/blog/is-semaglutide-safe-long-term", tag: "Safety" },
              { label: "GLP-1 for Prediabetes", href: "/prediabetes", tag: "Condition" },
              { label: "GLP-1 & Heart Health", href: "/heart-health", tag: "Condition" },
              { label: "GLP-1 Cost Guide", href: "/glp1-cost", tag: "Cost" },
              { label: "Check Your Eligibility", href: "/eligibility", tag: "Eligibility" },
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
            {siteConfig.compliance.shortDisclaimer} Clinical data cited from published peer-reviewed research including Davies M et al. (STEP-2, Lancet 2021), Frías JP et al. (SURPASS-2, NEJM 2021), and Lincoff AM et al. (SELECT, NEJM 2023). Individual results vary. Treatment eligibility determined by a licensed medical provider. GLP-1 medications do not replace prescribed diabetes medications without provider approval — do not discontinue any current medication without consulting your physician.
          </p>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
