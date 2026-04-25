export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, Check, TrendingDown, Heart, Activity,
  Zap, Dumbbell, Flame, Gauge, Target,
} from "lucide-react";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { siteConfig } from "@/lib/site";
import { FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
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
  title: "GLP-1 for Men | Visceral Fat, Testosterone & Cardiovascular Health",
  description:
    "Men store fat differently — especially visceral fat that surrounds organs and raises cardiovascular risk. GLP-1 medications are particularly effective at targeting visceral fat.",
  openGraph: {
    title: "GLP-1 for Men: Visceral Fat, Testosterone & Metabolic Health | Nature's Journey",
    description:
      "Evidence-informed guide to GLP-1 weight loss for men. Covers visceral fat, testosterone, cardiovascular outcomes, and muscle preservation.",
  },
};

const visceralPoints = [
  "Men disproportionately accumulate visceral fat (deep abdominal fat around organs)",
  "Visceral fat is metabolically dangerous — it produces inflammatory cytokines and worsens insulin resistance",
  "Waist circumference above 40 inches in men is associated with significantly elevated cardiovascular risk",
  "GLP-1 agonists preferentially reduce visceral fat — imaging shows visceral loss exceeding overall weight loss",
  "The SELECT trial (70% male) showed a 20% reduction in heart attack, stroke, and CV death",
];

const testosteronePoints = [
  "Obesity and visceral fat lower testosterone — adipose tissue converts testosterone to estradiol",
  "Low testosterone makes fat loss and muscle maintenance harder — a vicious cycle",
  "Weight loss of 10%+ is associated with 25–30% increases in free testosterone",
  "GLP-1 treatment drives this cycle in reverse: less visceral fat → better testosterone → better body composition",
  "Studies show improved sexual function and libido with significant GLP-1-mediated weight loss",
];

const faqs = [
  {
    q: "Will I lose muscle on semaglutide or tirzepatide?",
    a: "Some lean mass loss occurs with any significant weight loss — unavoidable biology. But it can be minimized. Eating 0.7–1g protein per pound of body weight daily and maintaining resistance training preserves the majority of lean mass. Men on GLP-1 who exercise lose roughly 80% fat and 20% lean mass — better than the 60/40 split seen with diet alone.",
  },
  {
    q: "What's the difference between semaglutide and tirzepatide for men?",
    a: "Tirzepatide produces higher average weight loss (~21% vs ~15% for semaglutide) and a higher proportion of patients achieving significant goals. Both are once-weekly injections. Tirzepatide had a slight advantage in visceral fat reduction in subgroup analyses.",
  },
  {
    q: "How does GLP-1 affect testosterone?",
    a: "GLP-1 doesn't directly affect testosterone. The effect is indirect: weight loss reduces visceral fat, which reduces conversion of testosterone to estradiol, which raises free testosterone. Typically meaningful improvement above 10% body weight lost.",
  },
  {
    q: "I have prediabetes. Does that affect anything?",
    a: "Prediabetes or metabolic syndrome often strengthens the case for GLP-1 treatment. These medications improve insulin sensitivity directly and have shown HbA1c reductions of 1–2 points even in non-diabetic patients with elevated baseline glucose.",
  },
  {
    q: "Will GLP-1 affect my workouts or athletic performance?",
    a: "During dose titration (first 2–3 months), reduced appetite and caloric intake may affect performance-heavy training. Most men adapt by maintaining protein intake and pre-workout nutrition. Once stable, workout performance generally normalizes — many find endurance improves as body weight decreases.",
  },
  {
    q: "Is there a cardiovascular benefit beyond weight loss?",
    a: "Yes. The SELECT trial (17,604 adults with obesity and CVD) showed a 20% reduction in major cardiovascular events over ~3 years — with benefit appearing before significant weight loss, suggesting direct cardiac effects beyond weight reduction alone.",
  },
];

const testimonials = [
  {
    initials: "D.K.",
    name: "David K.",
    location: "Austin, TX",
    outcome: "Lost 52 lbs",
    outcomeDetail: "Waist 42 → 36 · BP 140/92 → 118/76",
    quote: "Down 52 lbs, six inches off my waist, and my cardiologist cut my blood pressure med in half. My last A1c was 5.4.",
    highlight: "cardiologist cut my blood pressure med in half",
    duration: "9 months",
  },
  {
    initials: "M.T.",
    name: "Marcus T.",
    location: "Chicago, IL",
    outcome: "Lost 38 lbs",
    outcomeDetail: "Sleep apnea gone · Testosterone +31%",
    quote: "I was on a CPAP and tanking on energy. Lost the weight, lost the CPAP, and my labs came back with testosterone 280 higher than baseline. I finally feel like myself.",
    highlight: "I finally feel like myself",
    duration: "7 months",
  },
  {
    initials: "R.H.",
    name: "Ryan H.",
    location: "Seattle, WA",
    outcome: "Lost 44 lbs",
    outcomeDetail: "Kept strength gains with protein + lifting",
    quote: "Everyone told me I'd lose muscle. I followed the protein protocol and kept lifting. Down 44 lbs, still deadlifting 405. The visceral fat went first — that's the part you can't see but you feel.",
    highlight: "Down 44 lbs, still deadlifting 405",
    duration: "8 months",
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

      <LandingStickyCta label="Weight loss built for men" analyticsPage="men" />

      <LandingHero
        badge="Men's Health"
        badgeIcon="Target"
        accent="atlantic"
        headlineStart="Target the fat that"
        headlineAccent="actually threatens"
        headlineEnd="your heart and your T."
        subhead={
          <>
            Men store fat differently — especially <strong className="text-navy">visceral fat</strong> that surrounds organs and drives heart disease. GLP-1 medications preferentially reduce visceral fat and have documented benefits for testosterone, cardiovascular risk, and sleep apnea.
          </>
        }
        analyticsPage="men"
        cardTitle="What trials show for men"
        cardIcon="Gauge"
        cardMetrics={[
          { label: "Avg weight lost (tirzepatide max dose)", value: "~21%", direction: "down" },
          { label: "MACE reduction (SELECT trial, 70% male)", value: "–20%", direction: "down" },
          { label: "Free testosterone increase (≥10% weight loss)", value: "+25–30%", direction: "up" },
          { label: "Fat-to-lean-mass loss ratio (w/ protein + lifting)", value: "~80/20" },
        ]}
        cardFootnote="Data from SURMOUNT-1, SELECT, and published men's health sub-analyses. Individual results vary."
        testimonial={{
          initials: "D.K.",
          name: "David K.",
          outcome: "Lost 52 lbs",
          quote: "Cardiologist cut my BP med in half.",
        }}
      />

      <LandingTrustStrip />

      <LandingPressBar />

      <LandingStatsRow
        eyebrow="Men's health on GLP-1"
        stats={[
          { value: "~21%", label: "Avg body weight lost on tirzepatide (SURMOUNT-1)", icon: "Flame", tone: "atlantic" },
          { value: "20%", label: "Reduction in MACE events (SELECT trial)", icon: "Heart", tone: "emerald" },
          { value: "70%", label: "Of SELECT CV outcomes participants were men", icon: "Activity", tone: "teal" },
          { value: "+25%", label: "Free testosterone increase with ≥10% weight loss", icon: "Zap", tone: "gold" },
        ]}
      />

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
                  <li key={point} className="flex items-start gap-3 rounded-xl border border-atlantic/20 bg-white p-4 shadow-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-atlantic" />
                    <span className="text-sm leading-relaxed text-graphite-600">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-navy via-atlantic to-teal p-8 text-white shadow-premium-lg relative overflow-hidden">
              <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" aria-hidden />
              <div className="relative">
                <div className="flex items-center gap-2 mb-5">
                  <Heart className="h-5 w-5 text-teal-300" />
                  <h3 className="font-bold">The SELECT trial — men and GLP-1</h3>
                </div>
                <div className="space-y-4 text-sm text-white/85 leading-relaxed">
                  <p>
                    The SELECT cardiovascular outcomes trial enrolled <strong className="text-white">17,604 adults</strong> with obesity and established CVD — no diabetes. Seventy percent were men.
                  </p>
                  <p>
                    After about 3 years, the semaglutide group had a <strong className="text-white">20% reduction</strong> in MACE: heart attack, stroke, and cardiovascular death.
                  </p>
                  <p>
                    First trial to demonstrate weight management medication reduces cardiovascular events in people with obesity but without diabetes.
                  </p>

                  {/* Sparkline representation */}
                  <div className="mt-5 space-y-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                    {[
                      { label: "Non-fatal heart attack", pct: 72, showAs: "–28%" },
                      { label: "CV death", pct: 85, showAs: "–15%" },
                      { label: "Non-fatal stroke", pct: 93, showAs: "–7%" },
                      { label: "Heart failure hosp.", pct: 82, showAs: "–18%" },
                    ].map((r) => (
                      <div key={r.label}>
                        <div className="mb-1 flex justify-between text-[11px]">
                          <span className="text-white/70">{r.label}</span>
                          <span className="font-bold text-teal-300">{r.showAs}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-gradient-to-r from-teal-300 to-emerald-300" style={{ width: `${r.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
      <section className="bg-gradient-to-b from-atlantic/5 to-white py-20">
        <SectionShell>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="rounded-3xl border border-atlantic/20 bg-white p-8 shadow-premium">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-atlantic/10">
                  <Zap className="h-5 w-5 text-atlantic" />
                </div>
                <h3 className="font-bold text-navy">Testosterone &amp; the weight-hormone cycle</h3>
              </div>
              <div className="space-y-3 text-sm text-graphite-600 leading-relaxed">
                <p>
                  Obesity reduces testosterone via aromatase — an enzyme in adipose tissue that converts testosterone to estradiol. More fat tissue = more aromatase = lower testosterone.
                </p>
                <p>
                  Lower testosterone then makes it harder to maintain muscle mass and easier to gain fat — reinforcing the cycle. Men often feel this as fatigue, reduced motivation, difficulty maintaining muscle, and reduced libido.
                </p>
                <p>
                  Meaningful weight loss <strong className="text-navy">breaks this cycle</strong>. Studies consistently show 25–30% increases in free testosterone in obese men who lose ≥10% body weight. GLP-1 therapy produces this degree of weight loss in most patients who reach therapeutic dosing.
                </p>
              </div>
            </div>
            <div>
              <SectionHeading
                eyebrow="Testosterone"
                title="How weight loss affects men's hormones"
                description="The relationship between obesity and testosterone is bidirectional — losing weight raises testosterone, which makes maintaining that weight loss easier."
                align="left"
              />
              <ul className="mt-6 space-y-3">
                {testosteronePoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-atlantic" />
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
          <div className="rounded-3xl bg-gradient-to-r from-navy to-atlantic p-8 text-white shadow-premium-lg relative overflow-hidden">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-teal/30 blur-3xl" aria-hidden />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal/20 backdrop-blur-sm">
                <Dumbbell className="h-7 w-7 text-teal-200" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold">Preserving muscle while losing fat</h3>
                <p className="mt-2 text-sm text-white/80 leading-relaxed">
                  Your treatment plan includes specific protein targets (0.7–1g/lb body weight), guidance on resistance training timing, and monitoring for lean mass changes. You shouldn&apos;t have to choose between losing fat and keeping muscle — with the right support, you can accomplish both.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Protein target tracking", "Training programming", "Bi-weekly coaching", "Body composition monitoring"].map((f) => (
                    <span key={f} className="flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white border border-white/20">
                      <Check className="h-3 w-3 text-teal-300" /> {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SectionShell>
      </section>

      <LandingJourneyTimeline
        accent="atlantic"
        title="Year one on GLP-1 for men"
        description="What fat loss, testosterone, and cardiovascular markers actually do month-by-month."
        milestones={[
          { when: "Day 1", label: "Provider approves · ships", metric: "48h delivery" },
          { when: "Week 2", label: "Appetite settles", metric: "Hunger ↓" },
          { when: "Month 1", label: "Waist starts dropping", metric: "3–8 lbs · visceral first" },
          { when: "Month 3", label: "BP + lipids improve", metric: "Systolic –4 mmHg avg" },
          { when: "Month 6", label: "Testosterone climbs", metric: "+15–25% free T" },
          { when: "Month 12", label: "New body comp baseline", metric: "15–21% loss" },
        ]}
      />

      <LandingComparisonTable />

      <LandingTestimonials
        eyebrow="Real men · Real results"
        title="Men on GLP-1 — the numbers and the feel"
        description="Weight, waist, testosterone, BP, sleep — what actually changes."
        items={testimonials}
        accent="atlantic"
      />

      <LandingGuaranteeMedallion accent="atlantic" />

      <LandingProviderTeam accent="atlantic" />

      <LandingHowItWorks
        accent="atlantic"
        segmentLabel="Built around men's physiology — visceral fat + testosterone + CV risk."
      />

      <LandingPricingAnchor
        eyebrow="Men's pricing"
        headline="Visceral fat. Testosterone. Heart. One plan, one price."
        subhead="Everything you need for men's weight + metabolic health — provider care, medication, muscle-preserving coaching, and shipping."
        includes={[
          "Board-certified provider review + CV risk assessment",
          "Compounded semaglutide or tirzepatide — dose adjusted monthly",
          "Protein targets, resistance training guidance, body composition tracking",
          "Unlimited messaging + dose adjustments",
          "Lab orders for metabolic panel + testosterone (when indicated)",
          "Free 2-day shipping · Cancel anytime",
        ]}
        primaryCtaLabel="See If I Qualify"
        accent="atlantic"
      />

      <LandingFaq
        eyebrow="Men's FAQ"
        title="What men actually ask about GLP-1"
        description="Honest answers about muscle, testosterone, performance, and cardiovascular health."
        items={faqs}
      />

      {/* Further reading */}
      <section className="py-12 bg-cloud/40 border-y border-sage/20">
        <SectionShell>
          <h2 className="text-lg font-semibold text-navy mb-2 text-center">Further reading</h2>
          <p className="text-sm text-graphite-500 mb-6 text-center">Articles on GLP-1 treatment, visceral fat, and cardiovascular health</p>
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
                className="group flex items-start justify-between gap-2 rounded-xl border border-navy-100/40 bg-white p-4 hover:border-atlantic/40 hover:shadow-premium transition-all"
              >
                <div>
                  <span className="text-xs font-medium text-atlantic">{article.tag}</span>
                  <p className="mt-0.5 text-sm font-medium text-navy group-hover:text-atlantic transition-colors leading-snug">{article.label}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-graphite-300 group-hover:text-atlantic transition-colors mt-0.5" />
              </Link>
            ))}
          </div>
        </SectionShell>
      </section>

      <CtaSection />

      <section className="py-8 border-t border-navy-100/40">
        <SectionShell>
          <p className="mx-auto max-w-3xl text-center text-xs text-graphite-400 leading-relaxed">
            {siteConfig.compliance.shortDisclaimer} Clinical data cited from published peer-reviewed research including SURMOUNT-1, STEP-1, and SELECT trials. Individual results vary. Treatment eligibility determined by a licensed medical provider.
          </p>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
