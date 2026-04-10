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
  Dumbbell,
  TrendingUp,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "GLP-1 Weight Loss After 50 | Menopause, Testosterone & Metabolic Changes",
  description:
    "Weight loss after 50 is harder — slower metabolism, hormonal changes, muscle loss, and years of diet failures. GLP-1 medications work differently from calorie restriction and are equally effective in older adults. Here's what to know.",
  openGraph: {
    title: "GLP-1 Weight Loss After 50 | Menopause, Testosterone & Metabolic Changes | VitalPath",
    description:
      "Weight loss after 50 is harder — slower metabolism, hormonal changes, muscle loss, and years of diet failures. GLP-1 medications work differently from calorie restriction and are equally effective in older adults. Here's what to know.",
  },
};

const stats = [
  { stat: "Equivalent", label: "Weight loss outcomes in adults 50+ vs younger adults in trial subanalyses" },
  { stat: "0.5–1%", label: "Muscle mass lost per year after age 40 without intervention (sarcopenia)" },
  { stat: "~35%", label: "Lower free testosterone in men 50–70 with obesity vs healthy weight peers" },
  { stat: "3–5×", label: "Higher visceral fat accumulation in postmenopausal vs premenopausal women" },
];

const musclePreservationSteps = [
  {
    title: "Protein: 0.7–1g per pound of body weight daily",
    description:
      "This is the single most important factor in muscle preservation during weight loss. Older adults have higher protein needs than younger adults for the same amount of lean mass preservation — a phenomenon called 'anabolic resistance.' Distribute intake across 3–4 meals rather than concentrating it in one sitting.",
  },
  {
    title: "Resistance training: 2–3 sessions per week minimum",
    description:
      "Progressive resistance exercise provides the mechanical signal for muscle protein synthesis. Without this signal, even adequate protein intake is less effective at maintaining lean mass. Compound movements (squats, rows, presses, deadlifts) recruit the most muscle and provide the strongest anabolic stimulus.",
  },
  {
    title: "Time protein around workouts",
    description:
      "20–40g of high-quality protein within 2 hours of resistance training sessions maximizes the muscle protein synthesis window. Leucine content matters — whey, eggs, and meat are high-leucine sources; plant proteins may need to be consumed in higher quantities to match.",
  },
  {
    title: "Consider creatine monohydrate: 5g/day",
    description:
      "Creatine is one of the most well-researched supplements available, and its benefits in older adults are particularly well-supported. A 2021 meta-analysis found creatine supplementation in adults over 50 combined with resistance training produced significantly greater lean mass gains than training alone. It is safe, inexpensive, and consistently beneficial.",
  },
  {
    title: "Track lean mass, not just total weight",
    description:
      "Your VitalPath plan includes body composition guidance. The scale alone does not tell the full story — losing 20 lbs of fat while maintaining or gaining 2 lbs of muscle is an excellent outcome that a simple scale would report as losing only 18 lbs. Dual-energy X-ray absorptiometry (DEXA) scans or bioelectrical impedance scales with lean mass tracking are useful tools.",
  },
];

const timelineExpectations = [
  {
    period: "Weeks 1–4",
    expectation: "Side effect adjustment (nausea typically peaks and subsides), initial appetite suppression noticeable, early weight loss often 2–5 lbs including water weight.",
  },
  {
    period: "Months 2–4",
    expectation: "Metabolic adaptation begins — fat loss becomes the primary mechanism. Blood pressure, triglycerides, and fasting glucose often show measurable improvements by month 3. Weight loss rate: 0.5–1.5 lbs per week on average in this population.",
  },
  {
    period: "Months 4–9",
    expectation: "Consistent fat loss phase. Energy levels often improve significantly. Sleep quality improvement common as sleep apnea markers reduce. Non-scale victories — joint pain reduction, mobility improvement, better blood pressure control — become more pronounced.",
  },
  {
    period: "Months 9–18",
    expectation: "Approaching plateau. Total weight loss in adults over 50 in trial subanalyses: 13–16% of body weight on average at one year, slightly below the 15–21% seen in younger adults, but in the same therapeutic range. Maintenance planning becomes the focus.",
  },
];

const faqs = [
  {
    q: "Is GLP-1 medication safe for people over 60 or 70?",
    a: "Clinical trials included adults up to age 75 in meaningful numbers. The STEP and SURMOUNT trial populations included a substantial over-60 cohort, and safety and efficacy outcomes were broadly consistent with the overall trial population. The main considerations for older adults include: starting at lower doses and titrating more slowly to minimize GI side effects, monitoring kidney function (GLP-1 medications are generally renal-protective but hydration matters more with age), and assessing for sarcopenia risk to ensure protein and exercise guidance is followed. Age alone is not a contraindication.",
  },
  {
    q: "I'm worried about losing muscle — is that a real risk?",
    a: "It is a real concern, not a reason to avoid treatment. Some lean mass loss occurs with any significant caloric deficit — this is unavoidable biology. In the STEP-1 trial, approximately 10% of total weight loss was lean mass (vs 38% in purely calorie-restricted populations), which is favorable but not zero. The combination of adequate protein (0.7–1g/lb/day), resistance training, and GLP-1 treatment produces significantly better lean mass preservation than calorie restriction alone. Your VitalPath plan includes protein targets and resistance training guidance specifically optimized for this.",
  },
  {
    q: "I take statins and blood pressure medications. Any interactions?",
    a: "GLP-1 medications have no direct pharmacokinetic interactions with statins. The blood pressure reduction associated with GLP-1 therapy can compound with antihypertensive medications — meaning your blood pressure medication dose may need to be reduced over time as your weight and blood pressure improve. This is a good problem to have, but it requires monitoring. Some diabetes medications (sulfonylureas, insulin) combined with GLP-1 agonists carry a higher hypoglycemia risk — though this primarily applies to people with diabetes. Your provider will review your complete medication list and monitor appropriately.",
  },
  {
    q: "Should I be concerned about bone density?",
    a: "Bone density is a legitimate consideration with significant weight loss at any age, and particularly relevant post-menopause in women. Weight loss of any kind can reduce bone mineral density, as mechanical loading on bones decreases. The mitigation strategy: resistance training (which provides direct osteogenic stimulus to bones), adequate calcium (1,200mg/day for adults over 50) and vitamin D (1,500–2,000 IU/day), and a baseline DEXA scan if you have not had one. GLP-1 medications themselves do not appear to have direct negative effects on bone — the density concern is related to weight loss generally, not the medication mechanism.",
  },
  {
    q: "My kidney function is reduced (CKD stage 2–3). Is GLP-1 safe?",
    a: "Early data from the FLOW trial (semaglutide in chronic kidney disease) published in 2024 showed that semaglutide reduced kidney disease progression by 24% and reduced the risk of kidney failure in people with CKD and type 2 diabetes. For people without diabetes but with moderate CKD, renal safety appears favorable — GLP-1 medications may actually be renoprotective through reduced inflammation, blood pressure improvement, and reduced kidney hyperfiltration. However, GI side effects (nausea, reduced appetite) require careful monitoring for adequate hydration in CKD patients. Your provider will review your eGFR and creatinine before and during treatment.",
  },
];

export default function Over50Page() {
  return (
    <MarketingShell>
      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6">Weight Loss After 50</Badge>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-navy sm:text-5xl lg:text-6xl">
            Weight loss after 50 with GLP-1 medication — what actually changes, and what doesn&apos;t
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500 leading-relaxed">
            The metabolic changes that come with age are real. But clinical trial data shows GLP-1 medications are equally effective in adults over 50 — and the non-scale benefits are often even more pronounced.
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
                Adults over 50 who struggle to lose weight despite "doing everything right" are not wrong — the biology genuinely changes in ways that conventional diet advice does not account for. Understanding these changes is the first step to understanding why GLP-1 medications work when calorie restriction alone has failed.
              </p>
              <p>
                <strong className="text-navy">Sarcopenia</strong> — age-related muscle loss — progresses at approximately 0.5–1% per year after age 40, accelerating after 60. This matters for weight management because muscle tissue is metabolically active: it burns calories at rest. Each pound of muscle lost reduces basal metabolic rate by approximately 6 calories per day. Over 10–15 years of adult aging, this accumulates to a meaningful reduction in daily caloric expenditure — which means the same food intake that maintained your weight at 35 promotes weight gain at 55.
              </p>
              <p>
                <strong className="text-navy">Hormonal changes</strong> compound this at a biological level. In women, perimenopause and menopause involve declining estrogen, which shifts fat storage away from the hips and thighs (peripheral fat, which is metabolically less harmful) toward the abdomen and visceral compartment (which is metabolically active in a harmful way — secreting inflammatory cytokines and worsening insulin resistance). In men, testosterone levels decline approximately 1–2% per year after age 30, with obesity itself reducing free testosterone by up to 35% in some studies — creating a bidirectional relationship where low testosterone promotes abdominal fat gain, and abdominal fat reduces testosterone further.
              </p>
              <p>
                <strong className="text-navy">Insulin resistance accumulation</strong> is another key mechanism. Insulin sensitivity naturally declines with age due to reduced mitochondrial function in muscle cells, even in the absence of weight gain. When combined with the visceral fat accumulation of midlife hormonal changes, insulin resistance can become the dominant driver of weight management difficulty — and it does not respond well to calorie restriction.
              </p>
              <p>
                <strong className="text-navy">Sleep quality decline</strong> plays a role that is often underestimated. Adults over 50 experience less deep (slow-wave) sleep, more fragmented sleep, and higher rates of sleep disorders including sleep apnea. Poor sleep acutely increases ghrelin (hunger hormone) by 24% and reduces leptin (satiety hormone) by 18%, according to research from the University of Chicago. The result: greater hunger, less control over appetite, and reduced metabolic rate — all compounding the other age-related changes.
              </p>
              <p>
                <strong className="text-navy">Metabolic adaptation</strong> to previous dieting also accumulates. Years or decades of calorie restriction cycles produce a progressively more adaptive metabolic response — the body becomes better at conserving energy during restriction, making successive diet attempts produce diminishing returns. This is not failure; it is biology doing exactly what it evolved to do.
              </p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* GLP-1 vs calorie restriction */}
      <section className="bg-teal-50/30 py-20">
        <SectionShell>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeading
                eyebrow="What's Different"
                title="What GLP-1 does differently than calorie restriction"
                description="This distinction matters especially for adults over 50 — where the side effects of conventional dieting are most harmful."
                align="left"
              />
              <div className="mt-8 space-y-5 text-graphite-600 leading-relaxed text-sm">
                <p>
                  <strong className="text-navy">Calorie restriction worsens sarcopenia.</strong> When you lose weight through pure calorie deficit, approximately 20–40% of the weight lost is lean mass (muscle, bone mineral, organ tissue), depending on protein intake and exercise. This is particularly damaging in adults over 50, where baseline muscle mass is already declining. Every pound of muscle lost further reduces metabolic rate and functional capacity.
                </p>
                <p>
                  <strong className="text-navy">GLP-1 medications preferentially reduce fat mass</strong> with a better lean mass ratio when protein intake and resistance training are maintained. In STEP-1 trial body composition data, approximately 85–90% of total weight loss was fat mass. This profile is significantly more favorable than calorie restriction alone.
                </p>
                <p>
                  <strong className="text-navy">GLP-1 directly addresses insulin resistance</strong> — the core metabolic problem in most adults over 50 with obesity. Calorie restriction reduces insulin resistance secondarily, through weight loss. GLP-1 agonists improve insulin sensitivity directly, including through mechanisms independent of weight change. This makes them more effective for the underlying biology.
                </p>
                <p>
                  <strong className="text-navy">GLP-1 preferentially reduces visceral fat</strong> — the most dangerous type, clustered around organs in the abdomen. This matters more in older adults, where visceral fat accumulation is the primary driver of cardiometabolic risk. The fat that comes off first with GLP-1 therapy tends to be visceral, which means cardiovascular risk markers improve disproportionately to the amount of total weight lost.
                </p>
                <p>
                  <strong className="text-navy">GLP-1 does not require willpower against hunger.</strong> The central nervous system mechanism of GLP-1 agonists reduces appetite and food reward signaling at the hypothalamic level. This is not discipline — it is pharmacology. Adults over 50 who have "tried everything" are not lacking willpower; they are lacking the pharmacological tools to overcome the compounded metabolic resistance their body has developed.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-teal/20 bg-white p-8 shadow-premium">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-teal" />
                <h3 className="font-bold text-navy">Trial data: adults 50+</h3>
              </div>
              <div className="space-y-5 text-sm text-graphite-600">
                <p>
                  Subgroup analyses from the STEP-1 and SURMOUNT-1 trials examined weight loss outcomes by age group. The key finding: <strong className="text-navy">adults over 50 achieved weight loss outcomes within the same range as younger adults</strong> — approximately 13–16% of body weight at 68 weeks on semaglutide, compared to 15–17% in younger participants. The difference was not statistically significant in most analyses.
                </p>
                <p>
                  What differed was the non-scale benefit profile. Older adults showed proportionally greater improvements in:
                </p>
                <ul className="space-y-2 mt-3">
                  {[
                    "Blood pressure control (larger absolute reduction from higher baseline)",
                    "Sleep apnea severity scores",
                    "Joint pain and mobility",
                    "Fasting glucose and insulin sensitivity",
                    "Quality of life and physical function measures",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 rounded-xl bg-teal-50 px-4 py-3">
                  <p className="text-xs text-teal-700 font-medium">
                    <Info className="inline h-3.5 w-3.5 mr-1" />
                    Source: STEP-1 subgroup analyses. Wilding JP et al., NEJM 2021.
                  </p>
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
            title="Different hormonal challenges, same effective solution"
            description="The metabolic changes of aging differ by sex — but GLP-1 therapy addresses both effectively."
          />
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {/* Women */}
            <div className="rounded-2xl border border-teal/20 bg-white p-8 shadow-premium">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10">
                  <Heart className="h-5 w-5 text-teal" />
                </div>
                <h3 className="font-bold text-navy text-lg">Women over 50</h3>
              </div>
              <div className="space-y-4 text-sm text-graphite-600 leading-relaxed">
                <p>
                  <strong className="text-navy">Menopause and estrogen decline</strong> produce the most dramatic metabolic shift most women experience in their lives. As estrogen drops, fat redistribution from the hips and thighs to the abdomen is rapid — some women report gaining visceral fat within months of menopause onset even with unchanged diet and exercise habits.
                </p>
                <p>
                  <strong className="text-navy">Visceral fat is not just cosmetic</strong> — it is metabolically active tissue that secretes inflammatory cytokines, disrupts insulin signaling, and increases cardiovascular risk. The 3–5x higher visceral fat burden in postmenopausal women vs premenopausal women represents a significant metabolic load that GLP-1 medications address directly and preferentially.
                </p>
                <p>
                  <strong className="text-navy">Hot flashes often improve</strong> with weight loss — obese women experience more frequent and severe vasomotor symptoms, and weight reduction of 5% or more has been shown to improve hot flash frequency. GLP-1-mediated weight loss may provide this benefit as part of the overall metabolic improvement.
                </p>
                <p>
                  <strong className="text-navy">Joint pain reduction</strong> is frequently among the most life-changing outcomes for women over 50. Each pound of body weight reduction removes approximately 4 lbs of force from the knee joint — significant pain reduction often begins at 10–15 lbs of weight loss.
                </p>
              </div>
            </div>

            {/* Men */}
            <div className="rounded-2xl border border-navy-100/40 bg-gradient-to-br from-cloud to-white p-8 shadow-premium">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10">
                  <Activity className="h-5 w-5 text-teal" />
                </div>
                <h3 className="font-bold text-navy text-lg">Men over 50</h3>
              </div>
              <div className="space-y-4 text-sm text-graphite-600 leading-relaxed">
                <p>
                  <strong className="text-navy">The testosterone-visceral fat cycle</strong> is one of the most clinically significant and underdiagnosed issues in men over 50 with obesity. Visceral fat contains high concentrations of aromatase, an enzyme that converts testosterone to estradiol (estrogen). Men with obesity and low testosterone are often in a self-reinforcing cycle: low testosterone reduces muscle mass and promotes fat storage, more fat storage further reduces testosterone.
                </p>
                <p>
                  <strong className="text-navy">GLP-1 therapy breaks this cycle.</strong> As visceral fat reduces, aromatase activity decreases, testosterone-to-estradiol ratio improves, and free testosterone levels rise. Studies show 15–20% improvements in free testosterone in men with obesity following significant GLP-1-mediated weight loss — without testosterone supplementation.
                </p>
                <p>
                  <strong className="text-navy">Sleep apnea reduction</strong> is often dramatic in men over 50, where sleep apnea prevalence exceeds 40% in those with obesity. Weight loss of 10–15% reduces apnea-hypopnea index (AHI) by 40–50% in many patients. Improved sleep has cascading benefits: better testosterone production, improved insulin sensitivity, lower cortisol, and more energy for exercise.
                </p>
                <p>
                  <strong className="text-navy">Erectile function improvement</strong> with significant weight loss is well-documented — the mechanism involves improved vascular endothelial function, reduced inflammation, and restored testosterone balance. Men who lose 10–15% of body weight show measurable improvements in International Index of Erectile Function scores independent of testosterone treatment.
                </p>
              </div>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Muscle preservation */}
      <section className="bg-gradient-to-b from-sage/10 to-white py-20">
        <SectionShell>
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="Muscle First"
              title="Muscle preservation — the most important consideration"
              description="For adults over 50, protecting muscle mass during weight loss is as important as the weight loss itself. Here is exactly what that requires."
              align="left"
            />
            <div className="mt-8 space-y-5">
              {musclePreservationSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal text-white text-sm font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-navy text-sm">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-graphite-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-teal/20 bg-teal-50/30 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Dumbbell className="h-4 w-4 text-teal" />
                <span className="font-bold text-navy text-sm">The bottom line on muscle</span>
              </div>
              <p className="text-sm text-graphite-600 leading-relaxed">
                GLP-1 medication + adequate protein + resistance training is the evidence-based combination for adults over 50. No single element works as well alone. Patients who follow this protocol consistently report better energy, better function, and better long-term outcomes than weight loss alone would predict.
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
            description="A practical timeline adjusted for the biology of adults over 50. Progress is real; the pace differs from younger adults."
          />
          <div className="mt-12 mx-auto max-w-3xl space-y-4">
            {timelineExpectations.map((item) => (
              <div
                key={item.period}
                className="flex items-start gap-5 rounded-2xl border border-navy-100/40 bg-white p-6 shadow-premium"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal/10">
                  <Clock className="h-5 w-5 text-teal" />
                </div>
                <div>
                  <h3 className="font-bold text-navy">{item.period}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-graphite-600">{item.expectation}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Safety */}
      <section className="py-12">
        <SectionShell>
          <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <h3 className="font-bold text-navy text-sm">Important monitoring notes for adults over 50</h3>
                <ul className="mt-2 space-y-1.5 text-xs text-graphite-600 leading-relaxed">
                  <li>• If you take blood pressure medications, your provider will monitor for hypotension as weight loss proceeds — dose reductions are common and expected.</li>
                  <li>• If you take metformin or insulin for diabetes, monitoring for hypoglycemia is important, especially during the first 3 months.</li>
                  <li>• Adequate hydration is particularly important for kidney function. GLP-1-related reduced appetite can also reduce fluid intake — aim for 6–8 glasses of water daily.</li>
                  <li>• Baseline and annual DEXA scans are recommended for postmenopausal women to monitor bone density during significant weight loss.</li>
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
            title="Questions from adults over 50, answered"
            description="Specific answers to the concerns that matter most at this stage of life."
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
              <Dumbbell className="h-8 w-8 text-teal" />
              <h3 className="font-bold text-navy text-sm">Age-appropriate protocols</h3>
              <p className="text-xs text-graphite-500">Care plans that account for muscle preservation and age-related factors</p>
            </div>
          </div>
        </SectionShell>
      </section>

      <CtaSection />

      <section className="py-8 border-t border-navy-100/40">
        <SectionShell>
          <p className="mx-auto max-w-3xl text-center text-xs text-graphite-300 leading-relaxed">
            {siteConfig.compliance.shortDisclaimer} Clinical data cited from published peer-reviewed research. Individual results vary. Treatment eligibility determined by a licensed medical provider. Do not discontinue any prescribed medications without consulting your physician.
          </p>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
