export const dynamic = "force-static";

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, Check, TrendingDown, Heart, Activity,
  Shield, Star, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { siteConfig } from "@/lib/site";
import { FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "GLP-1 for Men | Visceral Fat, Metabolic Health & Weight Loss",
  description:
    "Men store fat differently — especially visceral fat that surrounds organs and raises cardiovascular risk. GLP-1 medications are particularly effective at targeting visceral fat. Here's what the clinical data shows.",
  openGraph: {
    title: "GLP-1 for Men: Visceral Fat, Testosterone & Metabolic Health | Nature's Journey",
    description:
      "Evidence-informed guide to GLP-1 weight loss for men. Covers visceral fat, testosterone, cardiovascular outcomes from the SELECT trial, muscle preservation, and what to realistically expect.",
  },
};

const stats = [
  { stat: "~21%", label: "Average body weight lost by men on tirzepatide max dose (SURMOUNT-1)" },
  { stat: "70%", label: "Of SELECT cardiovascular outcomes trial participants were men" },
  { stat: "20%", label: "Reduction in MACE events in SELECT (semaglutide vs placebo)" },
  { stat: "~25%", label: "Increase in testosterone in obese men who lost ≥10% body weight" },
];

const visceralPoints = [
  "Men disproportionately accumulate visceral fat (deep abdominal fat around organs) compared to women",
  "Visceral fat is metabolically dangerous — it produces inflammatory cytokines and worsens insulin resistance",
  "Waist circumference above 40 inches in men is associated with significantly elevated cardiovascular risk",
  "GLP-1 agonists preferentially reduce visceral fat — clinical imaging studies show visceral fat loss exceeding overall weight loss percentage",
  "The SELECT trial (70% male, average BMI 33) showed 20% reduction in heart attack, stroke, and cardiovascular death",
];

const testosteronePoints = [
  "Obesity and visceral fat lower testosterone — adipose tissue converts testosterone to estradiol",
  "Low testosterone makes fat loss harder and muscle maintenance harder — a vicious cycle",
  "Weight loss of 10%+ body weight is associated with 25–30% increases in free testosterone",
  "GLP-1 treatment drives this cycle in reverse: less visceral fat → better testosterone → better body composition",
  "Studies show improved sexual function and libido in men who achieved significant weight loss on GLP-1 therapy",
];

const faqs = [
  {
    q: "Will I lose muscle on semaglutide or tirzepatide?",
    a: "Some lean mass loss occurs with any significant weight loss — this is unavoidable. But it can be minimized. Eating 0.7–1g of protein per pound of body weight daily and maintaining or adding resistance training preserves the majority of lean mass. Clinical data shows that men on GLP-1 therapy who exercise lose roughly 80% fat and 20% lean mass — better than the 60/40 split seen with diet alone.",
  },
  {
    q: "What's the difference between semaglutide and tirzepatide for men?",
    a: "Tirzepatide produces higher average weight loss (~21% vs ~15% for semaglutide) and a higher proportion of patients achieving significant weight loss goals. Both are once-weekly injections. Men in trials responded to both medications — tirzepatide had a slight additional advantage in visceral fat reduction in subgroup analyses.",
  },
  {
    q: "How does GLP-1 affect testosterone?",
    a: "GLP-1 medication doesn't directly affect testosterone. The effect is indirect: weight loss from GLP-1 therapy reduces visceral fat, which reduces the conversion of testosterone to estradiol, which raises free testosterone. The magnitude of the effect depends on how much weight is lost — typically meaningful improvement above 10% body weight lost.",
  },
  {
    q: "I have prediabetes. Does that affect anything?",
    a: "Having prediabetes or metabolic syndrome often strengthens the case for GLP-1 treatment. These medications improve insulin sensitivity directly and have shown HbA1c reductions of 1–2 points even in non-diabetic patients with elevated baseline glucose. Your provider will consider this in the evaluation.",
  },
  {
    q: "Will GLP-1 medication affect my workouts or athletic performance?",
    a: "During the dose titration phase (first 2–3 months), reduced appetite and caloric intake may affect performance-heavy training. Most men find they adapt by maintaining protein intake and pre-workout nutrition. Once on a stable dose, workout performance generally normalizes — and many find endurance improves as body weight decreases.",
  },
  {
    q: "Is there a cardiovascular benefit beyond weight loss?",
    a: "Yes. The SELECT trial enrolled 17,604 adults with obesity and established cardiovascular disease. It showed a 20% reduction in major cardiovascular events (heart attack, stroke, cardiovascular death) over about 3 years — with the benefit appearing before significant weight loss, suggesting direct cardiac effects beyond weight reduction alone.",
  },
];

export default function MenPage() {
  const faqJsonLd = faqs.map((f) => ({ question: f.q, answer: f.a }));

  return (
    <MarketingShell>
      <FAQPageJsonLd faqs={faqJsonLd} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Men's Health", href: "/men" },
        ]}
      />
      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6">Men&apos;s Health</Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl lg:text-6xl">
            GLP-1 weight loss for men — visceral fat, testosterone, and the heart
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500 leading-relaxed">
            Men store fat in ways that are particularly dangerous — and particularly responsive to GLP-1 treatment. Here&apos;s what the clinical evidence shows, without the marketing spin.
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

      {/* Visceral fat section */}
      <section className="py-20">
        <SectionShell>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Visceral Fat"
                title="The kind of fat that matters most in men"
                description="Not all fat is equal. Men disproportionately accumulate the type that causes the most metabolic and cardiovascular harm."
                align="left"
              />
              <ul className="mt-6 space-y-3">
                {visceralPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                    <span className="text-sm leading-relaxed text-graphite-600">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-navy to-atlantic p-8 text-white shadow-premium-lg">
              <div className="flex items-center gap-2 mb-5">
                <Heart className="h-5 w-5 text-teal-300" />
                <h3 className="font-bold">The SELECT trial — men and GLP-1</h3>
              </div>
              <div className="space-y-4 text-sm text-white/85 leading-relaxed">
                <p>
                  The SELECT cardiovascular outcomes trial enrolled 17,604 adults with obesity and established cardiovascular disease — no diabetes. Seventy percent were men.
                </p>
                <p>
                  After about 3 years, the semaglutide group had a <strong className="text-white">20% reduction</strong> in major adverse cardiovascular events (MACE): heart attack, stroke, and cardiovascular death.
                </p>
                <p>
                  This is the first trial to demonstrate that weight management medication reduces cardiovascular events in people with obesity but without diabetes. For men with abdominal obesity and any cardiovascular risk factors, this is clinically significant.
                </p>
                <div className="mt-5 border-t border-white/20 pt-4">
                  <p className="text-xs text-white/60">
                    Source: Lincoff AM, et al. NEJM 2023;389:2221-2232
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Testosterone section */}
      <section className="bg-gradient-to-b from-sage/10 to-white py-20">
        <SectionShell>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="rounded-2xl border border-teal/20 bg-teal-50/30 p-8 shadow-premium">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-teal" />
                <h3 className="font-bold text-navy">Testosterone and the weight-hormones cycle</h3>
              </div>
              <div className="space-y-3 text-sm text-graphite-600 leading-relaxed">
                <p>
                  Obesity reduces testosterone through a well-documented pathway: adipose (fat) tissue contains aromatase, an enzyme that converts testosterone to estradiol. More fat tissue = more aromatase = lower testosterone.
                </p>
                <p>
                  Lower testosterone then makes it harder to maintain muscle mass and easier to gain fat — reinforcing the cycle. Men with obesity and low testosterone often feel this as fatigue, reduced motivation, difficulty gaining or maintaining muscle, and reduced libido.
                </p>
                <p>
                  Meaningful weight loss breaks this cycle. Studies consistently show 25–30% increases in free testosterone in obese men who lose ≥10% body weight. GLP-1 therapy produces this degree of weight loss in most patients who reach therapeutic dosing.
                </p>
              </div>
            </div>
            <div>
              <SectionHeading
                eyebrow="Testosterone"
                title="How weight loss affects men&apos;s hormones"
                description="The relationship between obesity and testosterone is bidirectional — losing weight raises testosterone, which makes maintaining that weight loss easier."
                align="left"
              />
              <ul className="mt-6 space-y-3">
                {testosteronePoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                    <span className="text-sm leading-relaxed text-graphite-600">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Muscle preservation callout */}
      <section className="py-16">
        <SectionShell>
          <div className="rounded-2xl border border-teal/20 bg-gradient-to-r from-teal-50/30 to-white p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal text-white shadow-glow">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy">Preserving muscle while losing fat — the Nature's Journey approach</h3>
                <p className="mt-2 text-sm text-graphite-600 leading-relaxed">
                  Our treatment plans for men include specific protein targets (0.7–1g/lb body weight), guidance on resistance training timing relative to dose schedule, and monitoring for lean mass changes. You shouldn&apos;t have to choose between losing fat and keeping muscle — with the right support, you can accomplish both.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {["Protein target tracking", "Exercise programming", "Bi-weekly coaching", "Body composition monitoring"].map((f) => (
                    <span key={f} className="flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal">
                      <Check className="h-3 w-3" /> {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* FAQ */}
      <section className="bg-cloud py-20">
        <SectionShell>
          <SectionHeading
            eyebrow="Common Questions"
            title="What men actually ask about GLP-1 treatment"
            description="Honest answers to the questions about muscle, testosterone, performance, and cardiovascular health."
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

      {/* Trust */}
      <section className="py-12 border-t border-navy-100/40">
        <SectionShell>
          <div className="grid gap-6 sm:grid-cols-3 text-center">
            <div className="flex flex-col items-center gap-2">
              <TrendingDown className="h-8 w-8 text-teal" />
              <h3 className="font-bold text-navy text-sm">Visceral fat focus</h3>
              <p className="text-xs text-graphite-500">Treatment plans designed to target abdominal fat specifically</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Shield className="h-8 w-8 text-teal" />
              <h3 className="font-bold text-navy text-sm">Cardiovascular monitoring</h3>
              <p className="text-xs text-graphite-500">Providers track metabolic markers, not just the scale</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Star className="h-8 w-8 text-gold" />
              <h3 className="font-bold text-navy text-sm">Board-certified physicians</h3>
              <p className="text-xs text-graphite-500">Every patient evaluated and monitored by licensed MDs</p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Further reading */}
      <section className="py-12 bg-cloud/40 border-y border-sage/20">
        <SectionShell>
          <h2 className="text-lg font-semibold text-navy mb-2">Further reading</h2>
          <p className="text-sm text-graphite-500 mb-6">Articles on GLP-1 treatment, visceral fat, and cardiovascular health</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "GLP-1 and Alcohol", href: "/blog/alcohol-and-glp1", tag: "Lifestyle" },
              { label: "Exercise During GLP-1 Treatment", href: "/blog/exercise-during-treatment", tag: "Fitness" },
              { label: "Protein Intake Guide", href: "/blog/protein-intake-guide", tag: "Nutrition" },
              { label: "GLP-1 & Heart Health", href: "/heart-health", tag: "Cardiovascular" },
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
            {siteConfig.compliance.shortDisclaimer} Clinical data cited from published peer-reviewed research including SURMOUNT-1, STEP-1, and SELECT trials. Individual results vary. Treatment eligibility determined by a licensed medical provider.
          </p>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
