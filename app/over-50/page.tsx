export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Heart,
  Activity,
  Dumbbell,
  TrendingUp,
  AlertCircle,
  Clock,
  Flame,
  Gauge,
  Leaf,
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

export const metadata: Metadata = {
  title: "GLP-1 Weight Loss After 50 | Menopause, Testosterone & Metabolic Changes",
  description:
    "Weight loss after 50 is harder — slower metabolism, hormonal changes, muscle loss. GLP-1 medications work differently from calorie restriction and are equally effective in older adults.",
  openGraph: {
    title: "GLP-1 Weight Loss After 50 | Nature's Journey",
    description:
      "Weight loss after 50 is harder — slower metabolism, hormonal changes, muscle loss, years of diet failures. GLP-1 medications work differently.",
  },
};

const musclePreservationSteps = [
  {
    title: "Protein: 0.7–1g per pound of body weight daily",
    description:
      "The single most important factor in muscle preservation during weight loss. Older adults have higher protein needs than younger adults for the same amount of lean mass preservation — 'anabolic resistance.' Distribute across 3–4 meals.",
  },
  {
    title: "Resistance training: 2–3 sessions per week minimum",
    description:
      "Progressive resistance provides the mechanical signal for muscle protein synthesis. Compound movements — squats, rows, presses, deadlifts — recruit the most muscle and provide the strongest anabolic stimulus.",
  },
  {
    title: "Time protein around workouts",
    description:
      "20–40g of high-quality protein within 2 hours of resistance training maximizes the muscle protein synthesis window. Leucine content matters — whey, eggs, and meat are high-leucine sources.",
  },
  {
    title: "Consider creatine monohydrate: 5g/day",
    description:
      "One of the most well-researched supplements. A 2021 meta-analysis found creatine + resistance training in adults over 50 produced significantly greater lean mass gains than training alone. Safe, inexpensive, consistently beneficial.",
  },
  {
    title: "Track lean mass, not just total weight",
    description:
      "The scale alone doesn't tell the full story — losing 20 lbs of fat while maintaining 2 lbs of muscle is excellent, but the scale only shows 18 lbs. DEXA scans or bioimpedance scales with lean mass tracking are useful.",
  },
];

const timelineExpectations = [
  {
    period: "Weeks 1–4",
    expectation: "Side effect adjustment (nausea typically peaks and subsides), appetite suppression noticeable, early weight loss often 2–5 lbs including water weight.",
  },
  {
    period: "Months 2–4",
    expectation: "Metabolic adaptation begins — fat loss becomes the primary mechanism. Blood pressure, triglycerides, and fasting glucose often show measurable improvements. Weight loss rate: 0.5–1.5 lbs/week.",
  },
  {
    period: "Months 4–9",
    expectation: "Consistent fat loss phase. Energy levels improve significantly. Sleep quality often improves as sleep apnea markers reduce. Non-scale wins — joint pain, mobility, blood pressure — become more pronounced.",
  },
  {
    period: "Months 9–18",
    expectation: "Approaching plateau. Total weight loss in 50+ in trial subanalyses: 13–16% of body weight at one year, slightly below but in the same range as younger adults. Maintenance planning becomes the focus.",
  },
];

const faqs = [
  {
    q: "Is GLP-1 medication safe for people over 60 or 70?",
    a: "Clinical trials included adults up to age 75 in meaningful numbers. The STEP and SURMOUNT trial populations included a substantial over-60 cohort, and safety and efficacy were broadly consistent with the overall trial population. Main considerations for older adults: starting at lower doses and titrating more slowly to minimize GI side effects, monitoring kidney function, and assessing for sarcopenia risk. Age alone is not a contraindication.",
  },
  {
    q: "I'm worried about losing muscle — is that a real risk?",
    a: "Real concern, not a reason to avoid treatment. Some lean mass loss occurs with any significant deficit. In STEP-1, approximately 10% of total weight loss was lean mass (vs 38% in purely calorie-restricted populations). The combination of adequate protein (0.7–1g/lb/day), resistance training, and GLP-1 produces significantly better lean mass preservation than calorie restriction alone.",
  },
  {
    q: "I take statins and blood pressure medications. Any interactions?",
    a: "GLP-1 medications have no direct pharmacokinetic interactions with statins. The blood pressure reduction associated with GLP-1 therapy can compound with antihypertensive medications — meaning your BP med dose may need to be reduced over time. This is a good problem, but requires monitoring.",
  },
  {
    q: "Should I be concerned about bone density?",
    a: "Legitimate consideration with any significant weight loss. Weight loss can reduce bone mineral density as mechanical loading decreases. Mitigation: resistance training (direct osteogenic stimulus), adequate calcium (1,200mg/day for adults over 50) and vitamin D (1,500–2,000 IU/day), and a baseline DEXA scan.",
  },
  {
    q: "My kidney function is reduced (CKD stage 2–3). Is GLP-1 safe?",
    a: "Early data from the FLOW trial (semaglutide in CKD, 2024) showed semaglutide reduced kidney disease progression by 24% in people with CKD and T2D. Renal safety appears favorable — GLP-1 may actually be renoprotective. However, GI side effects require careful monitoring for adequate hydration in CKD patients.",
  },
];

const testimonials = [
  {
    initials: "C.B.",
    name: "Carol B.",
    location: "Tampa, FL · Age 58",
    outcome: "Lost 46 lbs",
    outcomeDetail: "Joint pain gone · Off BP meds",
    quote: "My doctor said 'after 50 you just lose the battle.' I'd been carrying 40 extra pounds for 15 years. Now my knees don't hurt, my blood pressure is 118 over 72, and I can actually play with my grandkids.",
    highlight: "I can actually play with my grandkids",
    duration: "11 months",
  },
  {
    initials: "F.R.",
    name: "Frank R.",
    location: "Phoenix, AZ · Age 63",
    outcome: "Lost 58 lbs",
    outcomeDetail: "Sleep apnea resolved · Off CPAP",
    quote: "I'd been on a CPAP for 8 years. Three months in I was down 30 lbs and my AHI dropped below 5. My cardiologist didn't believe it was the same patient.",
    highlight: "cardiologist didn't believe it was the same patient",
    duration: "14 months",
  },
  {
    initials: "D.M.",
    name: "Diane M.",
    location: "Minneapolis, MN · Age 54",
    outcome: "Lost 34 lbs",
    outcomeDetail: "Post-menopause belly gone",
    quote: "I'd gained all of it in my midsection after menopause, and nothing worked. The fat that came off first was exactly the fat I was worried about.",
    highlight: "exactly the fat I was worried about",
    duration: "8 months",
  },
];

export default function Over50Page() {
  return (
    <MarketingShell>
      <FAQPageJsonLd faqs={faqs.map((f) => ({ question: f.q, answer: f.a }))} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Weight Loss After 50", href: "/over-50" },
        ]}
      />

      <LandingStickyCta label="Weight loss that works after 50" analyticsPage="over-50" />

      <LandingHero
        badge="Weight Loss After 50"
        badgeIcon="Leaf"
        accent="emerald"
        headlineStart="After 50, weight loss"
        headlineAccent="isn't about willpower —"
        headlineEnd="it's about biology."
        subhead={
          <>
            Sarcopenia, declining hormones, insulin resistance, decades of metabolic adaptation. The challenges are <strong className="text-navy">biological, not psychological</strong>. Clinical trial data shows GLP-1 medications are equally effective in adults over 50 — and the non-scale benefits are often more pronounced.
          </>
        }
        analyticsPage="over-50"
        cardTitle="Outcomes in adults 50+"
        cardIcon="Gauge"
        cardMetrics={[
          { label: "Avg body weight lost at 68 weeks", value: "13–16%", direction: "down" },
          { label: "Joint pain reduction (vs younger adults)", value: "Greater", direction: "up" },
          { label: "Sleep apnea severity reduction", value: "–40–50%", direction: "down" },
          { label: "Blood pressure reduction (absolute)", value: "Larger", direction: "down" },
        ]}
        cardFootnote="STEP-1 and SURMOUNT-1 subgroup analyses. Adults 50+ achieved outcomes in the same therapeutic range as younger adults, with greater absolute benefit on age-related conditions."
        testimonial={{
          initials: "C.B.",
          name: "Carol B., 58",
          outcome: "Lost 46 lbs",
          quote: "I can play with my grandkids again.",
        }}
      />

      <LandingTrustStrip />

      <LandingPressBar />

      <LandingStatsRow
        eyebrow="Weight loss after 50"
        stats={[
          { value: "Equal", label: "Outcomes in 50+ vs younger adults in trials", icon: "Gauge", tone: "emerald" },
          { value: "0.5–1%", label: "Muscle mass lost per year after 40 (sarcopenia)", icon: "Dumbbell", tone: "atlantic" },
          { value: "35%", label: "Lower free testosterone in men 50–70 w/ obesity", icon: "Flame", tone: "gold" },
          { value: "3–5×", label: "More visceral fat after menopause", icon: "Activity", tone: "rose" },
        ]}
      />

      {/* Why weight loss is harder after 50 */}
      <section className="py-20">
        <SectionShell>
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="The Biology"
              title="Why weight loss is genuinely harder after 50"
              description="The challenges are real, biological, and well-documented — not imagined, and not a willpower failure."
              align="left"
            />
            <div className="mt-8 space-y-5 text-graphite-600 leading-relaxed">
              <p>
                Adults over 50 who struggle to lose weight despite &ldquo;doing everything right&rdquo; are not wrong — the biology genuinely changes. Understanding this is the first step to understanding why GLP-1 medications work when calorie restriction has failed.
              </p>
              <p>
                <strong className="text-navy">Sarcopenia</strong> — age-related muscle loss — progresses at ~0.5–1% per year after 40, accelerating after 60. Muscle is metabolically active; each pound lost reduces basal metabolic rate by ~6 calories/day. Over 10–15 years this means the same food intake that maintained your weight at 35 promotes gain at 55.
              </p>
              <p>
                <strong className="text-navy">Hormonal changes</strong> compound this. In women, declining estrogen shifts fat from peripheral storage (hips, thighs) to visceral (abdomen) — metabolically active in a harmful way. In men, testosterone declines ~1–2%/year after 30, and obesity reduces free testosterone up to 35% — a self-reinforcing cycle.
              </p>
              <p>
                <strong className="text-navy">Insulin resistance accumulation</strong> and <strong className="text-navy">sleep quality decline</strong> further reinforce the loop. Poor sleep increases ghrelin by 24% and reduces leptin by 18% — greater hunger, less control, reduced metabolic rate.
              </p>
              <p>
                <strong className="text-navy">Metabolic adaptation</strong> from years of dieting also accumulates. The body becomes better at conserving energy during restriction — successive diet attempts produce diminishing returns. This is biology doing exactly what it evolved to do.
              </p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* GLP-1 vs calorie restriction */}
      <section className="bg-gradient-to-b from-emerald-50/40 to-white py-20">
        <SectionShell>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeading
                eyebrow="What's Different"
                title="GLP-1 vs calorie restriction — why it matters after 50"
                description="This distinction matters especially for adults over 50 — where the side effects of conventional dieting are most harmful."
                align="left"
              />
              <div className="mt-8 space-y-5 text-sm text-graphite-600 leading-relaxed">
                <p>
                  <strong className="text-navy">Calorie restriction worsens sarcopenia.</strong> When you lose weight through pure calorie deficit, 20–40% of the weight lost is lean mass. Particularly damaging in adults over 50, where baseline muscle is already declining.
                </p>
                <p>
                  <strong className="text-navy">GLP-1 medications preferentially reduce fat mass.</strong> In STEP-1 body composition data, ~85–90% of total weight loss was fat mass. Significantly more favorable than calorie restriction alone.
                </p>
                <p>
                  <strong className="text-navy">GLP-1 directly addresses insulin resistance</strong> — the core metabolic problem in most adults over 50 with obesity. Calorie restriction addresses it secondarily, through weight loss. GLP-1 does both.
                </p>
                <p>
                  <strong className="text-navy">GLP-1 preferentially reduces visceral fat</strong> — the most dangerous type. Cardiovascular risk markers improve disproportionately to the amount of total weight lost.
                </p>
                <p>
                  <strong className="text-navy">GLP-1 doesn't require willpower against hunger.</strong> Reduced appetite and food reward signaling at the hypothalamic level. This isn't discipline — it's pharmacology.
                </p>
              </div>
            </div>
            <div className="rounded-3xl border border-emerald-200 bg-white p-8 shadow-premium">
              <div className="mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                <h3 className="font-bold text-navy">Trial data: adults 50+</h3>
              </div>
              <div className="space-y-5 text-sm text-graphite-600">
                <p className="leading-relaxed">
                  Subgroup analyses from STEP-1 and SURMOUNT-1 examined outcomes by age group. Key finding: <strong className="text-navy">adults over 50 achieved weight loss in the same range as younger adults</strong> — approximately 13–16% at 68 weeks on semaglutide, compared to 15–17% in younger participants. Not statistically significant in most analyses.
                </p>
                <p className="leading-relaxed">What differed was the <strong>non-scale benefit profile</strong>. Older adults showed proportionally greater improvements in:</p>
                <ul className="space-y-2">
                  {[
                    "Blood pressure (larger absolute reduction from higher baseline)",
                    "Sleep apnea severity scores",
                    "Joint pain and mobility",
                    "Fasting glucose and insulin sensitivity",
                    "Quality of life and physical function",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="rounded-xl bg-emerald-50 p-3 text-xs font-medium text-emerald-700">
                  Source: STEP-1 subgroup analyses. Wilding JP et al., NEJM 2021.
                </div>
              </div>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Women vs Men two-column */}
      <section className="py-20">
        <SectionShell>
          <SectionHeading
            eyebrow="Men &amp; Women After 50"
            title="Different hormones, same effective solution"
            description="The metabolic changes of aging differ by sex — but GLP-1 therapy addresses both effectively."
          />
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-3xl border border-rose-200 bg-white p-8 shadow-premium">
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-rose-400 opacity-10 blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-400 text-white shadow-premium">
                    <Heart className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-navy text-lg">Women over 50</h3>
                </div>
                <div className="space-y-4 text-sm text-graphite-600 leading-relaxed">
                  <p><strong className="text-navy">Menopause and estrogen decline</strong> produce the most dramatic metabolic shift most women experience. Fat redistribution from hips/thighs to abdomen is rapid — some women gain visceral fat within months of menopause onset.</p>
                  <p><strong className="text-navy">Visceral fat is not cosmetic</strong> — it secretes inflammatory cytokines, disrupts insulin signaling, and increases CV risk. The 3–5× higher burden in postmenopausal vs premenopausal women is a significant metabolic load GLP-1 addresses directly.</p>
                  <p><strong className="text-navy">Hot flashes often improve</strong> with weight loss — 5%+ reduction has been shown to improve vasomotor symptoms.</p>
                  <p><strong className="text-navy">Joint pain reduction</strong> is frequently the most life-changing outcome. Each pound of body weight removes ~4 lbs of force from the knee. Pain reduction often begins at 10–15 lbs lost.</p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-atlantic/20 bg-white p-8 shadow-premium">
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-atlantic opacity-10 blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-atlantic to-teal text-white shadow-premium">
                    <Activity className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-navy text-lg">Men over 50</h3>
                </div>
                <div className="space-y-4 text-sm text-graphite-600 leading-relaxed">
                  <p><strong className="text-navy">The testosterone-visceral fat cycle</strong> is the most clinically significant underdiagnosed issue in men over 50 with obesity. Aromatase in visceral fat converts testosterone to estradiol — a self-reinforcing cycle.</p>
                  <p><strong className="text-navy">GLP-1 therapy breaks this cycle.</strong> As visceral fat reduces, aromatase activity decreases, and free testosterone rises. Studies show 15–20% improvements with significant GLP-1-mediated weight loss.</p>
                  <p><strong className="text-navy">Sleep apnea reduction</strong> is often dramatic. Weight loss of 10–15% reduces AHI by 40–50% in many patients. Better sleep → better testosterone → better insulin sensitivity.</p>
                  <p><strong className="text-navy">Erectile function improvement</strong> is well-documented with significant weight loss — improved vascular endothelial function, reduced inflammation, restored testosterone balance.</p>
                </div>
              </div>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Muscle preservation */}
      <section className="bg-gradient-to-b from-emerald-50/30 to-white py-20">
        <SectionShell>
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="Muscle First"
              title="Muscle preservation — the most important consideration"
              description="For adults over 50, protecting muscle during weight loss is as important as the weight loss itself."
              align="left"
            />
            <div className="mt-8 space-y-4">
              {musclePreservationSteps.map((step, i) => (
                <div key={i} className="group relative flex items-start gap-4 rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm transition-all hover:shadow-premium hover:-translate-y-0.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald to-teal text-white font-bold shadow-premium">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-navy">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-graphite-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl bg-gradient-to-br from-navy to-atlantic p-6 text-white shadow-premium-lg">
              <div className="flex items-center gap-2 mb-3">
                <Dumbbell className="h-5 w-5 text-teal-300" />
                <span className="font-bold text-sm">The bottom line on muscle</span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                GLP-1 + adequate protein + resistance training is the evidence-based combination for adults over 50. No single element works as well alone. Patients who follow this protocol consistently report better energy, better function, and better long-term outcomes.
              </p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Realistic timeline */}
      <section className="py-20">
        <SectionShell>
          <SectionHeading
            eyebrow="What to Expect"
            title="What to realistically expect — month by month"
            description="A practical timeline adjusted for the biology of adults over 50."
          />
          <div className="mt-12 mx-auto max-w-3xl space-y-4">
            {timelineExpectations.map((item, i) => (
              <div
                key={item.period}
                className="relative flex items-start gap-5 rounded-2xl border border-navy-100/50 bg-white p-6 shadow-premium"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald to-teal text-white shadow-premium">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Phase {i + 1}</span>
                    <h3 className="font-bold text-navy">{item.period}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-graphite-600">{item.expectation}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      <LandingComparisonTable />

      <LandingTestimonials
        eyebrow="Real results · Real people"
        title="Adults over 50 — in their words"
        description="What the numbers actually look like when you're starting later."
        items={testimonials}
        accent="emerald"
      />

      <LandingGuaranteeMedallion accent="emerald" />

      <LandingProviderTeam accent="emerald" />

      <LandingHowItWorks
        accent="emerald"
        segmentLabel="Age-appropriate dose titration + coordination with your existing PCP."
      />

      <LandingPricingAnchor
        eyebrow="Pricing designed for 50+"
        headline="Age-aware treatment at one monthly price."
        subhead="Everything you need for weight + metabolic health in your 50s, 60s, and beyond."
        includes={[
          "Provider evaluation + age-appropriate dose titration",
          "Compounded semaglutide or tirzepatide",
          "Muscle preservation protocol: protein, training, monitoring",
          "Unlimited messaging + monthly check-ins",
          "Coordination with your existing cardiologist / PCP",
          "Free 2-day shipping · Cancel anytime",
        ]}
        primaryCtaLabel="See If I Qualify"
        accent="emerald"
      />

      {/* Safety */}
      <section className="py-12">
        <SectionShell>
          <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <h3 className="font-bold text-navy text-sm">Important monitoring notes for adults over 50</h3>
                <ul className="mt-2 space-y-1.5 text-xs text-graphite-600 leading-relaxed">
                  <li>• If you take blood pressure medications, your provider will monitor for hypotension — dose reductions are common and expected.</li>
                  <li>• If you take metformin or insulin for diabetes, monitoring for hypoglycemia is important during the first 3 months.</li>
                  <li>• Adequate hydration is particularly important for kidney function — aim for 6–8 glasses of water daily.</li>
                  <li>• Baseline and annual DEXA scans are recommended for postmenopausal women to monitor bone density.</li>
                </ul>
              </div>
            </div>
          </div>
        </SectionShell>
      </section>

      <LandingFaq
        eyebrow="50+ FAQ"
        title="Questions from adults over 50, answered"
        description="Specific answers to the concerns that matter most at this stage of life."
        items={faqs}
      />

      {/* Further reading */}
      <section className="py-12 bg-cloud/40 border-y border-sage/20">
        <SectionShell>
          <h2 className="text-lg font-semibold text-navy mb-2 text-center">Further reading</h2>
          <p className="text-sm text-graphite-500 mb-6 text-center">Articles relevant to GLP-1 in older adults</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "GLP-1 Medications for Adults Over 65", href: "/blog/glp1-medications-for-seniors-over-65", tag: "Age 50+" },
              { label: "Exercise During GLP-1 Treatment", href: "/blog/exercise-during-treatment", tag: "Fitness" },
              { label: "Protein Intake Guide", href: "/blog/protein-intake-guide", tag: "Nutrition" },
              { label: "Long-Term Maintenance Program", href: "/maintenance", tag: "After Treatment" },
            ].map((article) => (
              <Link
                key={article.href}
                href={article.href}
                className="group flex items-start justify-between gap-2 rounded-xl border border-navy-100/40 bg-white p-4 hover:border-emerald-300/50 hover:shadow-premium transition-all"
              >
                <div>
                  <span className="text-xs font-medium text-emerald-600">{article.tag}</span>
                  <p className="mt-0.5 text-sm font-medium text-navy group-hover:text-emerald-700 transition-colors leading-snug">{article.label}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-graphite-300 group-hover:text-emerald-600 transition-colors mt-0.5" />
              </Link>
            ))}
          </div>
        </SectionShell>
      </section>

      <CtaSection />

      <section className="py-8 border-t border-navy-100/40">
        <SectionShell>
          <p className="mx-auto max-w-3xl text-center text-xs text-graphite-400 leading-relaxed">
            {siteConfig.compliance.shortDisclaimer} Clinical data cited from published peer-reviewed research. Individual results vary. Treatment eligibility determined by a licensed medical provider. Do not discontinue any prescribed medications without consulting your physician.
          </p>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
