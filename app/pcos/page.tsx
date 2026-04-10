export const dynamic = "force-static";

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  AlertCircle,
  Heart,
  Activity,
  Shield,
  Star,
  Info,
  Flower2,
  Brain,
  Zap,
  Smile,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { MedicalConditionJsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "GLP-1 for PCOS Weight Loss | Insulin Resistance & Hormonal Treatment",
  description:
    "PCOS causes insulin resistance that makes conventional weight loss nearly impossible. GLP-1 medications target the metabolic root of PCOS directly — and clinical studies show improvements in weight, testosterone, and menstrual regularity.",
  openGraph: {
    title: "GLP-1 for PCOS Weight Loss | Insulin Resistance & Hormonal Treatment | Nature's Journey",
    description:
      "PCOS causes insulin resistance that makes conventional weight loss nearly impossible. GLP-1 medications target the metabolic root of PCOS directly — and clinical studies show improvements in weight, testosterone, and menstrual regularity.",
  },
};

const stats = [
  { stat: "1 in 10", label: "Women of reproductive age have PCOS" },
  { stat: "75%", label: "Of women with PCOS have insulin resistance" },
  { stat: "60–70%", label: "See menstrual improvement with GLP-1 therapy" },
  { stat: "$0 extra", label: "PCOS-related care included in your Nature's Journey plan" },
];

const mechanismPoints = [
  {
    title: "Improves insulin sensitivity",
    description:
      "GLP-1 agonists enhance insulin receptor signaling, directly addressing the root driver of PCOS-related fat storage and hormonal dysregulation.",
  },
  {
    title: "Reduces androgen production",
    description:
      "By improving insulin sensitivity, GLP-1 medications reduce the excess LH signaling that drives ovarian androgen (testosterone) overproduction in PCOS.",
  },
  {
    title: "Restores ovulation in some patients",
    description:
      "Cycle normalization occurs in a significant proportion of anovulatory PCOS patients — even before full weight loss goals are reached.",
  },
  {
    title: "Reduces inflammatory markers",
    description:
      "PCOS involves systemic low-grade inflammation. GLP-1 therapy reduces CRP and other inflammatory cytokines independent of weight loss.",
  },
];

const beyondWeightCards = [
  {
    icon: Activity,
    title: "Menstrual regularity",
    description:
      "Anovulation — absent or irregular periods — is a hallmark of PCOS. As insulin resistance improves with GLP-1 therapy, LH pulsatility normalizes and cycles often return. Studies report regularity improvement in 60–70% of anovulatory patients achieving ≥5% body weight loss.",
  },
  {
    icon: Zap,
    title: "Androgen levels",
    description:
      "Elevated testosterone and DHEA-S drive many PCOS symptoms including acne, hirsutism (facial hair), and scalp hair loss. GLP-1-mediated insulin reduction decreases ovarian testosterone production — patients often notice symptom improvement within 3–6 months.",
  },
  {
    icon: Flower2,
    title: "Fertility outcomes",
    description:
      "While GLP-1 medications are not fertility treatments and must be stopped before conception, improving metabolic health before attempting pregnancy is associated with better ovulation rates, higher IVF response, and improved pregnancy outcomes in PCOS patients.",
  },
  {
    icon: Smile,
    title: "Skin & hair changes",
    description:
      "Acne driven by androgen excess often improves significantly as testosterone levels normalize. Hirsutism (excess facial/body hair) typically improves more slowly — hair cycles are long — but improvement is well-documented over 6–12 months of sustained treatment.",
  },
];

const checklist = [
  "A formal PCOS diagnosis from a gynecologist or endocrinologist is helpful context for your provider — but it is not required to start treatment. Metabolic eligibility is based on BMI and comorbidities.",
  "Tell your Nature's Journey provider about any fertility plans. GLP-1 medications must be stopped at least 2 months before attempting conception. Your provider can help you plan the timing.",
  "If you take oral contraceptives, take them 1 hour before or 4 hours after your semaglutide dose to avoid any absorption effects from slowed gastric emptying. IUDs, implants, and patches have no interaction.",
  "Monitoring during treatment: fasting glucose, insulin, testosterone, and LH/FSH ratios every 3–6 months while your provider adjusts your protocol.",
  "Weight loss of just 5–10% of body weight can produce disproportionate hormonal improvements in PCOS — this is not a condition where you need to reach a 'goal weight' before seeing benefits.",
];

const faqs = [
  {
    q: "Will my period change when I start GLP-1 medication?",
    a: "It depends on your baseline. If you have irregular or absent periods due to PCOS, they may actually become more regular as insulin resistance improves — this is one of the documented benefits. If your cycles are currently regular, disruption is uncommon. Some women experience temporary cycle changes in the first 1–2 months as the body adapts. Report any significant changes to your provider.",
  },
  {
    q: "I want to get pregnant. Should I take GLP-1 medication first?",
    a: "GLP-1 medications are contraindicated during pregnancy and should be stopped at least 2 months before attempting conception. However, using GLP-1 treatment to achieve metabolic improvements before stopping can actually improve fertility outcomes in PCOS. Women with PCOS who achieve weight loss of 5–10% show improved ovulation rates, better IVF response, and improved egg quality. Talk to your Nature's Journey provider and your OB-GYN or reproductive endocrinologist to coordinate timing.",
  },
  {
    q: "Do I need to change my birth control while on GLP-1?",
    a: "GLP-1 medications slow gastric motility, which can theoretically reduce absorption of oral contraceptives if taken simultaneously. The recommendation is to take oral contraceptives 1 hour before or 4 hours after your weekly semaglutide injection. Non-oral forms of contraception — IUDs (hormonal or copper), implants, patches, rings, and injections — have no absorption interaction and are not affected. Your overall contraceptive effectiveness is maintained when timing is followed.",
  },
  {
    q: "My weight gain is from PCOS — does that mean standard GLP-1 dosing won't work as well?",
    a: "The opposite may be true. PCOS-related weight gain is insulin-resistance-driven, and GLP-1 medications directly address insulin resistance. Trial subanalyses suggest that women with PCOS may respond particularly well to GLP-1 therapy because the medication is targeting the actual biological mechanism causing the problem. The 2023 meta-analysis in Diabetes, Obesity and Metabolism found GLP-1 agonists produced significant improvements in weight, testosterone, menstrual regularity, and insulin markers specifically in PCOS populations.",
  },
  {
    q: "What if I have both PCOS and a thyroid condition?",
    a: "Hashimoto's thyroiditis and subclinical hypothyroidism co-occur with PCOS at higher rates than in the general population — both involve autoimmune and metabolic components. GLP-1 medications are generally safe with thyroid replacement therapy (levothyroxine). The key considerations: ensure your thyroid is well-controlled before starting, as hypothyroidism independently contributes to weight gain and insulin resistance; and note that a personal or family history of medullary thyroid carcinoma (MTC) or Multiple Endocrine Neoplasia type 2 (MEN2) is a contraindication for GLP-1 agonists — your provider will screen for this.",
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
      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6">PCOS &amp; Hormonal Health</Badge>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-navy sm:text-5xl lg:text-6xl">
            GLP-1 treatment for PCOS: addressing the insulin resistance at the root
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500 leading-relaxed">
            PCOS is not a calorie problem. It is an insulin problem — and conventional diet advice was not designed for it. GLP-1 medications work directly on the metabolic mechanism that makes PCOS weight management so difficult.
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

      {/* Why PCOS makes weight loss harder */}
      <section className="py-20">
        <SectionShell>
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="The Biology"
              title="Why PCOS makes weight loss genuinely harder"
              description="This is not a motivation problem. PCOS creates a self-reinforcing metabolic cycle that works against conventional weight loss approaches at every step."
              align="left"
            />
            <div className="mt-8 space-y-5 text-graphite-600 leading-relaxed">
              <p>
                Polycystic ovary syndrome affects approximately 1 in 10 women of reproductive age — making it the most common endocrine disorder in this population. But the name is misleading. PCOS is not primarily an ovarian problem. It is a metabolic disorder that happens to have reproductive consequences.
              </p>
              <p>
                The central driver in most PCOS cases is <strong className="text-navy">insulin resistance</strong>. When cells stop responding efficiently to insulin, the pancreas compensates by producing more. This chronic hyperinsulinemia has cascading effects: it signals the ovaries to produce excess androgens (testosterone and DHEA-S), it disrupts LH and FSH ratios needed for ovulation, and it actively promotes fat storage — particularly in the abdomen — regardless of caloric intake.
              </p>
              <p>
                The excess androgens then drive the next tier of the problem: <strong className="text-navy">hyperandrogenism disrupts hunger hormone regulation</strong>. Elevated testosterone blunts leptin sensitivity in the hypothalamus — meaning the brain receives weaker satiety signals, making it harder to recognize fullness. Ghrelin (the hunger hormone) runs higher in PCOS, particularly in the luteal phase. The result is a neurological hunger drive that calorie restriction simply cannot overcome in most affected women.
              </p>
              <p>
                This connects to <strong className="text-navy">anovulation</strong>: the disrupted LH/FSH ratio from hyperinsulinemia prevents normal follicle development and ovulation. Anovulation means no progesterone surge in the luteal phase — and progesterone has thermogenic effects that support metabolic rate. Women with anovulatory PCOS are effectively missing this metabolic boost every month.
              </p>
              <p>
                Finally, <strong className="text-navy">leptin resistance</strong> creates the feedback loop that makes the system nearly self-sustaining. Leptin resistance means adipose tissue can accumulate more without triggering the normal fat-loss hormonal cascade. The more fat stored, the more leptin produced — but the less the brain responds — worsening both hunger and metabolic suppression. Standard calorie restriction reduces leptin further, intensifying hunger and reducing metabolic rate. For PCOS patients, this is why dieting almost always fails long-term.
              </p>
              <p>
                GLP-1 medications intervene at the insulin resistance level — the starting point of this entire cascade. By improving insulin sensitivity and directly reducing appetite through central nervous system GLP-1 receptors, they work with PCOS biology rather than against it.
              </p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Mechanism section with callout */}
      <section className="bg-teal-50/30 py-20">
        <SectionShell>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Mechanism"
                title="What GLP-1 medication does for PCOS"
                description="GLP-1 agonists work differently from any prior weight management medication — and that difference matters specifically for PCOS."
                align="left"
              />
              <div className="mt-6 space-y-6">
                {mechanismPoints.map((point) => (
                  <div key={point.title} className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal/10">
                      <Check className="h-3.5 w-3.5 text-teal" />
                    </div>
                    <div>
                      <h3 className="font-bold text-navy text-sm">{point.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-graphite-600">{point.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl border border-teal/20 bg-white p-8 shadow-premium">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="h-5 w-5 text-teal" />
                  <h3 className="font-bold text-navy">What the clinical evidence shows</h3>
                </div>
                <div className="space-y-4 text-sm text-graphite-600">
                  <p>
                    A <strong>2023 meta-analysis published in <em>Diabetes, Obesity and Metabolism</em></strong> examined the effects of GLP-1 receptor agonists specifically in women with PCOS. Across multiple trials, GLP-1 therapy produced significant improvements not just in body weight, but in the full hormonal profile of PCOS.
                  </p>
                  <p>
                    Key findings included measurable reductions in <strong>total testosterone and free androgen index</strong>, improvements in LH/FSH ratio, and normalization of fasting insulin. Perhaps most striking: <strong>menstrual cycle normalization occurred in 60–70% of anovulatory PCOS patients</strong> who achieved ≥5% body weight loss during GLP-1 treatment.
                  </p>
                  <p>
                    Some patients reported cycle restoration before reaching their therapeutic target dose — suggesting that the direct insulin-sensitizing mechanism of GLP-1, not weight loss alone, drives part of the hormonal benefit.
                  </p>
                </div>
                <div className="mt-5 rounded-xl bg-teal-50 px-4 py-3">
                  <p className="text-xs text-teal-700 font-medium">
                    <Info className="inline h-3.5 w-3.5 mr-1" />
                    Clinical data cited from published peer-reviewed research. Individual results vary. All treatments are provider-evaluated.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Beyond weight loss: 4-card grid */}
      <section className="py-20">
        <SectionShell>
          <SectionHeading
            eyebrow="Beyond the Scale"
            title="Beyond weight loss: other PCOS improvements"
            description="For PCOS patients, GLP-1 treatment often produces a range of health improvements that extend well beyond the number on the scale."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {beyondWeightCards.map((card) => (
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

      {/* What to know before starting */}
      <section className="bg-gradient-to-b from-sage/10 to-white py-20">
        <SectionShell>
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="Before You Start"
              title="What you need to know before starting"
              description="GLP-1 treatment for PCOS works well, but there are important considerations specific to hormonal health and reproductive planning."
              align="left"
            />
            <ul className="mt-8 space-y-4">
              {checklist.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal/10">
                    <Check className="h-3.5 w-3.5 text-teal" />
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
                    <li>• A personal or family history of medullary thyroid carcinoma (MTC) or Multiple Endocrine Neoplasia syndrome type 2 (MEN2) is a contraindication. Your provider will screen for this.</li>
                    <li>• If you have pancreatitis history, discuss with your provider before starting.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <SectionShell>
          <SectionHeading
            eyebrow="Common Questions"
            title="PCOS-specific questions, answered honestly"
            description="The questions women with PCOS actually ask — about cycles, fertility, birth control, and what makes their situation different."
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
              <Heart className="h-8 w-8 text-teal" />
              <h3 className="font-bold text-navy text-sm">Hormonal health experience</h3>
              <p className="text-xs text-graphite-500">Providers experienced with PCOS and metabolic disorders</p>
            </div>
          </div>
        </SectionShell>
      </section>

      <CtaSection />

      <section className="py-8 border-t border-navy-100/40">
        <SectionShell>
          <p className="mx-auto max-w-3xl text-center text-xs text-graphite-300 leading-relaxed">
            {siteConfig.compliance.shortDisclaimer} Clinical data cited from published peer-reviewed research. Individual results vary. Treatment eligibility determined by a licensed medical provider. GLP-1 medications are contraindicated during pregnancy.
          </p>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
