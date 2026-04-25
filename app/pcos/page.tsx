export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  AlertCircle,
  Heart,
  Activity,
  Flower2,
  Brain,
  Zap,
  Smile,
  Sparkles,
  Droplet,
  LineChart,
  Users,
} from "lucide-react";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { MedicalConditionJsonLd } from "@/components/seo/json-ld";
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
  title: "GLP-1 for PCOS Weight Loss | Insulin Resistance & Hormonal Treatment",
  description:
    "PCOS causes insulin resistance that makes conventional weight loss nearly impossible. GLP-1 medications target the metabolic root of PCOS — with clinical evidence for weight, testosterone, and cycle regularity.",
  openGraph: {
    title: "GLP-1 for PCOS Weight Loss | Nature's Journey",
    description:
      "PCOS causes insulin resistance that makes conventional weight loss nearly impossible. GLP-1 medications target the metabolic root of PCOS directly.",
  },
};

const mechanismPoints = [
  {
    title: "Improves insulin sensitivity",
    description:
      "GLP-1 agonists enhance insulin receptor signaling, directly addressing the root driver of PCOS-related fat storage and hormonal dysregulation.",
  },
  {
    title: "Reduces androgen production",
    description:
      "By improving insulin sensitivity, GLP-1 medications reduce the excess LH signaling that drives ovarian androgen (testosterone) overproduction.",
  },
  {
    title: "Restores ovulation in many patients",
    description:
      "Cycle normalization occurs in a significant proportion of anovulatory PCOS patients — often before full weight loss goals are reached.",
  },
  {
    title: "Reduces inflammatory markers",
    description:
      "GLP-1 therapy reduces CRP and other inflammatory cytokines independent of weight loss — important for PCOS-related systemic inflammation.",
  },
];

const beyondWeightCards = [
  {
    icon: Activity,
    title: "Menstrual regularity",
    description:
      "60–70% of anovulatory patients achieving ≥5% weight loss report cycle normalization as insulin resistance improves and LH pulsatility normalizes.",
  },
  {
    icon: Zap,
    title: "Androgen levels",
    description:
      "Elevated testosterone drives acne, hirsutism, and scalp hair loss. GLP-1-mediated insulin reduction decreases ovarian testosterone production — symptom improvement typically 3–6 months.",
  },
  {
    icon: Flower2,
    title: "Fertility outcomes",
    description:
      "GLP-1 must be stopped before conception, but improving metabolic health beforehand is linked to better ovulation rates, higher IVF response, and improved pregnancy outcomes.",
  },
  {
    icon: Smile,
    title: "Skin & hair changes",
    description:
      "Androgen-driven acne often improves significantly as testosterone normalizes. Hirsutism improves more slowly — well-documented over 6–12 months of sustained treatment.",
  },
];

const checklist = [
  "A formal PCOS diagnosis helps your provider, but isn't required to start — metabolic eligibility is based on BMI and comorbidities.",
  "Tell your provider about fertility plans. GLP-1 medications must be stopped at least 2 months before attempting conception.",
  "If you take oral contraceptives, take them 1 hour before or 4 hours after your semaglutide dose. IUDs, implants, and patches have no interaction.",
  "Monitoring during treatment: fasting glucose, insulin, testosterone, and LH/FSH ratios every 3–6 months.",
  "Just 5–10% body weight loss can produce disproportionate hormonal improvements in PCOS — no need to reach 'goal weight' for benefits.",
];

const faqs = [
  {
    q: "Will my period change when I start GLP-1 medication?",
    a: "It depends on your baseline. If you have irregular or absent periods due to PCOS, they may actually become more regular as insulin sensitivity improves — this is one of the documented benefits. If your cycles are currently regular, disruption is uncommon. Some women experience temporary cycle changes in the first 1–2 months as the body adapts.",
  },
  {
    q: "I want to get pregnant. Should I take GLP-1 medication first?",
    a: "GLP-1 medications are contraindicated during pregnancy and should be stopped at least 2 months before attempting conception. However, using GLP-1 treatment to achieve metabolic improvements before stopping can actually improve fertility outcomes in PCOS. Women who achieve 5–10% weight loss show improved ovulation rates and better IVF response.",
  },
  {
    q: "Do I need to change my birth control while on GLP-1?",
    a: "Oral contraceptives should be taken 1 hour before or 4 hours after your weekly semaglutide injection. Non-oral forms — IUDs, implants, patches, rings, and injections — have no absorption interaction. Your overall contraceptive effectiveness is maintained when timing is followed.",
  },
  {
    q: "My weight gain is from PCOS — will standard GLP-1 dosing still work?",
    a: "Research suggests it works particularly well. PCOS-related weight gain is insulin-resistance-driven, and GLP-1 medications directly address insulin resistance. The 2023 meta-analysis in Diabetes, Obesity and Metabolism found GLP-1 agonists produced significant improvements in weight, testosterone, and menstrual regularity specifically in PCOS populations.",
  },
  {
    q: "What if I have both PCOS and a thyroid condition?",
    a: "Hashimoto's and subclinical hypothyroidism co-occur with PCOS at higher rates. GLP-1 medications are generally safe with levothyroxine. Ensure thyroid is well-controlled before starting. A personal or family history of MTC or MEN2 is a contraindication — your provider will screen for this.",
  },
  {
    q: "How quickly will I see results?",
    a: "Most PCOS patients notice reduced food noise and appetite within 2–3 weeks. Scale movement typically begins weeks 3–6. Cycle improvements often appear by month 3. Androgen-driven skin changes (acne) improve around months 3–6. Hair changes (hirsutism, scalp regrowth) take longer — 6–12 months.",
  },
];

const testimonials = [
  {
    initials: "M.R.",
    name: "Maya R.",
    location: "Austin, TX",
    outcome: "Lost 38 lbs",
    outcomeDetail: "Cycles regular for the first time in 6 years",
    quote: "I'd tried keto, Whole30, intermittent fasting — all of it. Three months in, I'd gained weight. PCOS was stealing everything. This is the first thing that's actually worked with my biology, not against it.",
    highlight: "the first thing that's actually worked with my biology",
    duration: "6 months",
  },
  {
    initials: "J.P.",
    name: "Jessica P.",
    location: "Denver, CO",
    outcome: "Lost 24 lbs",
    outcomeDetail: "Testosterone dropped from 78 → 42 ng/dL",
    quote: "My acne finally cleared, my scalp stopped shedding, and for the first time I have energy at 3pm that isn't from caffeine. The hormonal changes surprised me more than the scale did.",
    highlight: "hormonal changes surprised me more than the scale did",
    duration: "5 months",
  },
  {
    initials: "A.K.",
    name: "Ashley K.",
    location: "Nashville, TN",
    outcome: "Lost 31 lbs",
    outcomeDetail: "A1c 5.9 → 5.3, regular ovulation restored",
    quote: "My endocrinologist told me weight loss would fix everything — without explaining how you're supposed to lose weight with insulin resistance. This actually made it possible.",
    highlight: "actually made it possible",
    duration: "7 months",
  },
];

export default function PcosPage() {
  return (
    <MarketingShell>
      <MedicalConditionJsonLd
        name="Polycystic Ovary Syndrome (PCOS)"
        alternateName="PCOS"
        description="A hormonal disorder characterized by insulin resistance, androgen excess, and irregular menstrual cycles, affecting approximately 1 in 10 women of reproductive age."
        url="/pcos"
        possibleTreatment="GLP-1 receptor agonist therapy (semaglutide, tirzepatide)"
      />

      <LandingStickyCta label="Treatment for PCOS" analyticsPage="pcos" />

      <LandingHero
        badge="PCOS & Hormonal Health"
        badgeIcon="Flower2"
        accent="lavender"
        headlineStart="The PCOS treatment that"
        headlineAccent="works with your biology"
        headlineEnd="— not against it."
        subhead={
          <>
            PCOS isn't a calorie problem — it's an <strong className="text-navy">insulin problem</strong>. Conventional diet advice wasn't designed for it. GLP-1 medications target the metabolic root of PCOS, with clinical evidence for weight loss, testosterone, and cycle regularity.
          </>
        }
        analyticsPage="pcos"
        cardTitle="What PCOS patients see on GLP-1"
        cardIcon="LineChart"
        cardMetrics={[
          { label: "Body weight lost (avg, ≥5%)", value: "13–17%", direction: "down" },
          { label: "Menstrual cycle regularization", value: "60–70%", direction: "up" },
          { label: "Free testosterone reduction", value: "–25%", direction: "down" },
          { label: "Fasting insulin improvement", value: "–35%", direction: "down" },
        ]}
        cardFootnote="Ranges from published peer-reviewed PCOS sub-analyses (STEP, SURMOUNT, 2023 Diabetes Obesity & Metabolism meta-analysis). Individual results vary."
        testimonial={{
          initials: "M.R.",
          name: "Maya R.",
          outcome: "Lost 38 lbs in 6 months",
          quote: "First thing that's ever actually worked with my PCOS.",
        }}
      />

      <LandingTrustStrip />

      <LandingPressBar />

      <LandingStatsRow
        eyebrow="PCOS by the numbers"
        stats={[
          { value: "1 in 10", label: "Women of reproductive age have PCOS", icon: "Users", tone: "lavender" },
          { value: "75%", label: "Of women with PCOS have insulin resistance", icon: "Droplet", tone: "teal" },
          { value: "60–70%", label: "See cycle regularization with GLP-1 therapy", icon: "Activity", tone: "emerald" },
          { value: "$0 extra", label: "PCOS-related care included in your plan", icon: "Sparkles", tone: "gold" },
        ]}
      />

      {/* Why PCOS makes weight loss harder */}
      <section className="py-20">
        <SectionShell>
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="The Biology"
              title="Why PCOS makes weight loss genuinely harder"
              description="This is not a motivation problem. PCOS creates a self-reinforcing metabolic cycle that works against conventional approaches at every step."
              align="left"
            />
            <div className="mt-8 space-y-5 text-graphite-600 leading-relaxed">
              <p>
                Polycystic ovary syndrome affects approximately 1 in 10 women of reproductive age. But the name is misleading. PCOS is not primarily an ovarian problem — it is a metabolic disorder with reproductive consequences.
              </p>
              <p>
                The central driver is <strong className="text-navy">insulin resistance</strong>. When cells stop responding efficiently to insulin, the pancreas produces more. This chronic hyperinsulinemia signals the ovaries to produce excess androgens, disrupts LH/FSH ratios needed for ovulation, and actively promotes abdominal fat storage — regardless of caloric intake.
              </p>
              <p>
                The excess androgens then <strong className="text-navy">disrupt hunger hormone regulation</strong>. Elevated testosterone blunts leptin sensitivity, meaning the brain receives weaker satiety signals. Ghrelin (hunger hormone) runs higher in PCOS. The result is a neurological hunger drive that calorie restriction simply cannot overcome.
              </p>
              <p>
                <strong className="text-navy">Leptin resistance</strong> creates the feedback loop that makes the system self-sustaining. More fat stored → more leptin produced → less response from the brain → worsening hunger and metabolic suppression. Standard calorie restriction makes this worse.
              </p>
              <p>
                GLP-1 medications intervene at the insulin resistance level — the starting point of this entire cascade. By improving insulin sensitivity and directly reducing appetite through CNS GLP-1 receptors, they work <em>with</em> PCOS biology.
              </p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Mechanism + evidence */}
      <section className="bg-gradient-to-b from-violet-50/40 to-white py-20">
        <SectionShell>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Mechanism"
                title="What GLP-1 does for PCOS"
                description="GLP-1 agonists work differently from any prior weight management medication — and that difference matters specifically for PCOS."
                align="left"
              />
              <div className="mt-6 space-y-5">
                {mechanismPoints.map((p, i) => (
                  <div key={p.title} className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-400 text-white text-sm font-bold shadow-premium">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-navy">{p.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-graphite-600">{p.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-violet-200 bg-white p-8 shadow-premium">
              <div className="mb-5 flex items-center gap-2">
                <Brain className="h-5 w-5 text-violet-600" />
                <h3 className="font-bold text-navy">What the clinical evidence shows</h3>
              </div>
              <div className="space-y-4 text-sm text-graphite-600 leading-relaxed">
                <p>
                  A <strong>2023 meta-analysis in <em>Diabetes, Obesity and Metabolism</em></strong> examined GLP-1 receptor agonists specifically in women with PCOS. Across multiple trials, GLP-1 therapy produced significant improvements not just in weight, but in the full hormonal profile of PCOS.
                </p>
                <p>
                  Key findings: measurable reductions in <strong>total testosterone and free androgen index</strong>, improvements in LH/FSH ratio, and normalization of fasting insulin. Most striking: <strong>menstrual cycle normalization in 60–70% of anovulatory patients</strong> achieving ≥5% body weight loss.
                </p>
                <p>
                  Some patients reported cycle restoration before reaching their therapeutic target dose — suggesting the direct insulin-sensitizing mechanism, not weight loss alone, drives part of the hormonal benefit.
                </p>
              </div>
              <div className="mt-5 rounded-xl bg-violet-50 px-4 py-3 text-xs font-medium text-violet-700">
                Clinical data cited from published peer-reviewed research. Individual results vary.
              </div>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Beyond weight cards */}
      <section className="py-20">
        <SectionShell>
          <SectionHeading
            eyebrow="Beyond the Scale"
            title="The PCOS benefits that aren't about weight"
            description="For most PCOS patients, the non-scale wins are the most life-changing."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {beyondWeightCards.map((card) => (
              <div
                key={card.title}
                className="group relative overflow-hidden rounded-2xl border border-navy-100/50 bg-white p-6 shadow-premium transition-all hover:-translate-y-1 hover:shadow-premium-lg hover:border-violet-300"
              >
                <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-400 opacity-[0.05] blur-2xl transition-opacity group-hover:opacity-[0.1]" />
                <div className="relative mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-400 text-white shadow-premium">
                  <card.icon className="h-5 w-5" />
                </div>
                <h3 className="relative font-bold text-navy mb-2">{card.title}</h3>
                <p className="relative text-sm leading-relaxed text-graphite-600">{card.description}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      <LandingJourneyTimeline
        eyebrow="The PCOS journey"
        title="Your hormonal restoration — month by month"
        description="Based on PCOS sub-analyses of GLP-1 trials and consistent patient reports."
        accent="lavender"
        milestones={[
          { when: "Day 1", label: "Provider approves treatment", metric: "Meds shipping" },
          { when: "Week 2", label: "Food noise quiets", metric: "Leptin sensitivity ↑" },
          { when: "Month 1", label: "First scale movement", metric: "3–6 lbs" },
          { when: "Month 3", label: "Cycle + androgen shifts", metric: "Testosterone ↓" },
          { when: "Month 6", label: "Skin + hair improvements", metric: "~10% weight loss" },
          { when: "Month 12", label: "Cycles regular · new baseline", metric: "13–17% loss" },
        ]}
      />

      <LandingComparisonTable />

      <LandingTestimonials
        eyebrow="PCOS patient stories"
        title="What PCOS patients are saying"
        description="Hormonal weight loss that finally works — in their words."
        items={testimonials}
        accent="lavender"
      />

      <LandingGuaranteeMedallion accent="lavender" />

      <LandingProviderTeam accent="lavender" />

      <LandingHowItWorks
        accent="lavender"
        segmentLabel="Your first dose ships within 48 hours of provider approval."
      />

      <LandingPricingAnchor
        eyebrow="Transparent PCOS pricing"
        headline="PCOS-aware treatment. One monthly price. No surprises."
        subhead="Everything you need for metabolic + hormonal care — provider visits, hormone monitoring, medication, coaching, and shipping."
        includes={[
          "Board-certified provider with hormonal health experience",
          "Compounded semaglutide or tirzepatide — dose adjusted monthly",
          "Hormone monitoring: testosterone, LH/FSH, fasting insulin",
          "Unlimited provider messaging — response within hours",
          "PCOS-specific meal plans & coaching",
          "Free 2-day shipping · Cancel anytime",
        ]}
        primaryCtaLabel="See If I Qualify — 2 min"
        accent="lavender"
      />

      {/* Before you start checklist */}
      <section className="bg-gradient-to-b from-white to-violet-50/30 py-20">
        <SectionShell>
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="Before You Start"
              title="What you need to know"
              description="GLP-1 treatment for PCOS works well, but there are important considerations specific to hormonal health and reproductive planning."
              align="left"
            />
            <ul className="mt-8 space-y-4">
              {checklist.map((item, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl border border-violet-100 bg-white p-4 shadow-sm">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-400 text-white">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm leading-relaxed text-graphite-600">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <h3 className="font-bold text-navy text-sm">Important contraindications</h3>
                  <ul className="mt-2 space-y-1.5 text-xs text-graphite-600 leading-relaxed">
                    <li>• GLP-1 medications are <strong>contraindicated during pregnancy</strong>. Stop at least 2 months before trying to conceive and use reliable contraception during treatment.</li>
                    <li>• Personal or family history of medullary thyroid carcinoma (MTC) or MEN2 is a contraindication. Your provider will screen for this.</li>
                    <li>• If you have pancreatitis history, discuss with your provider before starting.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </SectionShell>
      </section>

      <LandingFaq
        eyebrow="PCOS-specific questions"
        title="PCOS-specific questions, answered honestly"
        description="The questions women with PCOS actually ask — cycles, fertility, birth control, and what makes their situation different."
        items={faqs}
      />

      {/* Further reading */}
      <section className="py-14 bg-cloud/50 border-t border-navy-100/40">
        <SectionShell>
          <h2 className="text-xl font-bold text-navy mb-6 text-center">Further reading</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/blog/glp1-pcos-weight-loss-guide", tag: "PCOS", title: "GLP-1 for PCOS: Complete Weight Loss Guide" },
              { href: "/blog/semaglutide-birth-control-interaction", tag: "Safety", title: "Semaglutide and Birth Control Interactions" },
              { href: "/blog/metformin-and-semaglutide-can-you-take-together", tag: "Medications", title: "Can You Take Metformin and Semaglutide Together?" },
              { href: "/blog/is-semaglutide-safe-long-term", tag: "Safety", title: "Is Semaglutide Safe for Long-Term Use?" },
              { href: "/blog/glp1-mental-health-food-noise", tag: "Lifestyle", title: "How GLP-1 Reduces Food Noise" },
              { href: "/blog/what-to-eat-on-semaglutide", tag: "Nutrition", title: "Best Foods for Hormonal Health on GLP-1" },
              { href: "/prediabetes", tag: "Condition", title: "GLP-1 for Prediabetes & Insulin Resistance" },
              { href: "/eligibility", tag: "Eligibility", title: "Check Your Eligibility for GLP-1 Treatment" },
            ].map(({ href, tag, title }) => (
              <Link key={href} href={href} className="group flex flex-col gap-2 rounded-xl border border-navy-100/60 bg-white p-4 shadow-sm hover:shadow-premium hover:border-violet-300/60 transition-all">
                <span className="text-xs font-semibold uppercase tracking-wide text-violet-600">{tag}</span>
                <span className="text-sm font-medium text-navy leading-snug group-hover:text-violet-700 transition-colors">{title}</span>
                <ArrowRight className="h-3.5 w-3.5 text-graphite-300 group-hover:text-violet-600 mt-auto transition-colors" />
              </Link>
            ))}
          </div>
        </SectionShell>
      </section>

      <CtaSection />

      <section className="py-8 border-t border-navy-100/40">
        <SectionShell>
          <p className="mx-auto max-w-3xl text-center text-xs text-graphite-400 leading-relaxed">
            {siteConfig.compliance.shortDisclaimer} Clinical data cited from published peer-reviewed research. Individual results vary. Treatment eligibility determined by a licensed medical provider. GLP-1 medications are contraindicated during pregnancy.
          </p>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
