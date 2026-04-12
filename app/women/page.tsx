export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, Check, AlertCircle, Heart, Activity,
  Shield, Star, Info,
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
  title: "GLP-1 for Women | PCOS, Menopause & Hormonal Weight Loss",
  description:
    "GLP-1 medications like semaglutide and tirzepatide address the hormonal roots of weight gain in women — including insulin resistance, PCOS, and menopause-related metabolic changes. Learn what the research actually says.",
  openGraph: {
    title: "GLP-1 for Women: PCOS, Menopause & Hormonal Weight Loss | Nature's Journey",
    description:
      "Evidence-informed guide to GLP-1 weight loss for women. Covers PCOS, perimenopause, insulin resistance, clinical trial data, and what to realistically expect.",
  },
};

const stats = [
  { stat: "~15–21%", label: "Average body weight lost in pivotal trials (sema/tirz)" },
  { stat: "54%", label: "Of STEP-1 trial participants were women" },
  { stat: "~75%", label: "Of women with PCOS have insulin resistance" },
  { stat: "3–5×", label: "Higher visceral fat accumulation after menopause" },
];

const pcosPoints = [
  "Insulin resistance drives fat storage even when calories are controlled",
  "Elevated androgens disrupt hunger hormones (leptin, ghrelin) at the brain level",
  "Chronic low-grade inflammation makes conventional dieting less effective",
  "GLP-1 receptors are expressed in ovarian tissue — early research suggests hormonal downstream effects",
  "Studies show GLP-1 agonists can restore menstrual regularity in anovulatory PCOS",
];

const menopausePoints = [
  "Declining estrogen shifts fat storage from hips/thighs to visceral (abdominal) tissue",
  "Visceral fat is metabolically active — it worsens insulin resistance and inflammation",
  "Resting metabolic rate drops ~2–3% per decade; muscle loss accelerates this",
  "GLP-1 agonists show equivalent or better weight loss in postmenopausal women vs premenopausal in trial subgroup analyses",
  "Sleep disruption (common in perimenopause) worsens hunger hormone regulation — GLP-1 dampens this signal",
];

const concerns = [
  {
    q: "Will GLP-1 medication affect my menstrual cycle?",
    a: "In women with PCOS and irregular cycles, GLP-1 agonists often improve cycle regularity as insulin sensitivity improves. In women with regular cycles, disruption is uncommon. Weight loss itself can affect hormones — your provider will monitor this.",
  },
  {
    q: "Can I take GLP-1 medication if I'm on birth control?",
    a: "Oral contraceptives should be taken 1 hour before or 4 hours after semaglutide injection to avoid any absorption effects from slower gastric motility. This is specific to oral medications — no interaction concern with IUDs, implants, or patches.",
  },
  {
    q: "I'm in perimenopause — will GLP-1 still work for me?",
    a: "Yes. Subgroup analyses from the STEP and SURMOUNT trials show weight loss outcomes are comparable across menopausal status. The metabolic changes of menopause respond to GLP-1 therapy — particularly visceral fat reduction, which is the most medically important change.",
  },
  {
    q: "What about fertility? I'm trying to conceive.",
    a: "GLP-1 medications are contraindicated during pregnancy and should be stopped at least 2 months before attempting conception. However, if you have PCOS and are struggling to conceive, achieving a healthier BMI through GLP-1 treatment before stopping the medication may improve fertility outcomes.",
  },
  {
    q: "Will I lose muscle along with fat?",
    a: "Some muscle loss occurs with any significant caloric deficit — this is not unique to GLP-1 medications. Adequate protein intake (0.7–1g per pound of body weight) and resistance training substantially reduce lean mass loss. Your Nature's Journey plan includes protein targets and exercise guidance specifically for this.",
  },
  {
    q: "I've heard GLP-1 causes hair loss — is that true for women?",
    a: "Telogen effluvium — temporary hair shedding — can occur with rapid weight loss. It's caused by the caloric deficit and rapid body change, not the medication itself. It typically begins 2–4 months into significant weight loss and resolves within 6 months. Iron, biotin, and zinc levels should be checked if shedding is severe.",
  },
];

export default function WomenPage() {
  const faqJsonLd = concerns.map((c) => ({ question: c.q, answer: c.a }));

  return (
    <MarketingShell>
      <FAQPageJsonLd faqs={faqJsonLd} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Women's Health", href: "/women" },
        ]}
      />
      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6">Women&apos;s Health</Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl lg:text-6xl">
            GLP-1 weight loss for women — including PCOS and menopause
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500 leading-relaxed">
            Hormonal factors make weight loss harder for many women — and conventional diet advice often misses this entirely. GLP-1 medications work at a biological level that addresses some of the root causes.
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

      {/* Why hormones matter */}
      <section className="py-20">
        <SectionShell>
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="The Biology"
              title="Why weight loss is harder for many women — and it's not willpower"
              description="Female physiology is genuinely different when it comes to fat storage, hunger signaling, and metabolic adaptation."
              align="left"
            />
            <div className="mt-8 space-y-5 text-graphite-600 leading-relaxed">
              <p>
                Women have roughly 6–11% more body fat than men at equivalent BMIs — this is biologically normal and serves reproductive functions. But it also means that fat-storage hormones like estrogen and progesterone interact with insulin, leptin, and ghrelin in ways that complicate weight management.
              </p>
              <p>
                <strong className="text-navy">Insulin resistance</strong> is the central driver for the two most common hormonal weight challenges: PCOS and menopause-related metabolic changes. When cells stop responding to insulin efficiently, the pancreas produces more — and elevated insulin promotes fat storage, particularly around the abdomen. Standard calorie restriction doesn&apos;t fix insulin resistance. GLP-1 agonists do.
              </p>
              <p>
                <strong className="text-navy">Hunger hormone dysregulation</strong> compounds this. Ghrelin (the "hunger hormone") tends to run higher in women, and leptin resistance (where the brain ignores satiety signals) is more pronounced in obesity. GLP-1 medication directly suppresses ghrelin and restores leptin sensitivity.
              </p>
              <p>
                None of this is a character flaw or a lack of effort. It's physiology. And it's exactly what GLP-1 medications were designed to address.
              </p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* PCOS section */}
      <section className="bg-teal-50/30 py-20">
        <SectionShell>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading
                eyebrow="PCOS"
                title="Polycystic ovary syndrome and GLP-1 therapy"
                description="PCOS is the most common endocrine disorder in reproductive-age women. Its metabolic effects make conventional weight loss approaches especially frustrating."
                align="left"
              />
              <ul className="mt-6 space-y-3">
                {pcosPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                    <span className="text-sm leading-relaxed text-graphite-600">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-teal/20 bg-white p-8 shadow-premium">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-teal" />
                <h3 className="font-bold text-navy">What the research shows</h3>
              </div>
              <div className="space-y-4 text-sm text-graphite-600">
                <p>
                  A 2023 meta-analysis in <em>Diabetes, Obesity and Metabolism</em> found that GLP-1 agonists produced significantly greater weight loss in women with PCOS compared to placebo — and also improved testosterone levels, LH/FSH ratios, and insulin sensitivity markers.
                </p>
                <p>
                  Menstrual regularity improved in 60–70% of anovulatory PCOS patients who lost ≥5% of body weight on GLP-1 therapy. Some patients reported cycle normalization before reaching the therapeutic dose.
                </p>
                <p>
                  These outcomes make GLP-1 treatment particularly valuable for PCOS — you&apos;re not just losing weight, you&apos;re addressing the hormonal cascade.
                </p>
              </div>
              <div className="mt-4 rounded-xl bg-teal-50 px-4 py-3">
                <p className="text-xs text-teal-700 font-medium">
                  <Info className="inline h-3.5 w-3.5 mr-1" />
                  Individual results vary. All clinical data cited from published peer-reviewed research.
                </p>
              </div>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Menopause section */}
      <section className="py-20">
        <SectionShell>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1 rounded-2xl border border-navy-100/60 bg-gradient-to-br from-cloud to-white p-8 shadow-premium">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-atlantic" />
                <h3 className="font-bold text-navy">Perimenopause &amp; menopause</h3>
              </div>
              <div className="space-y-3 text-sm text-graphite-600">
                <p>
                  The typical menopause transition involves a 5–8 lb weight gain even without changes in diet or activity — driven by visceral fat redistribution as estrogen drops. This isn&apos;t calories in/calories out. It&apos;s hormonal.
                </p>
                <p>
                  Visceral fat (deep abdominal fat around organs) is metabolically active in a harmful way — it secretes inflammatory cytokines and worsens insulin resistance, creating a cycle that&apos;s hard to break with diet alone.
                </p>
                <p>
                  Clinical trial subgroup analyses show postmenopausal women respond to GLP-1 therapy comparably to premenopausal women in terms of percentage body weight lost. The absolute benefit in cardiovascular risk reduction may be even greater, given the elevated baseline cardiovascular risk after menopause.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <SectionHeading
                eyebrow="Menopause"
                title="How menopause changes metabolism — and what GLP-1 does about it"
                description="Visceral fat, insulin resistance, and sleep disruption converge during the menopause transition in ways that make standard weight management advice nearly useless."
                align="left"
              />
              <ul className="mt-6 space-y-3">
                {menopausePoints.map((point) => (
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

      {/* Concerns / FAQ */}
      <section className="bg-gradient-to-b from-sage/10 to-white py-20">
        <SectionShell>
          <SectionHeading
            eyebrow="Common Questions"
            title="Answers to what women actually ask"
            description="Questions about cycles, fertility, hair, and hormone interactions — answered honestly."
          />
          <div className="mx-auto mt-12 max-w-3xl divide-y divide-navy-100/40">
            {concerns.map((item) => (
              <div key={item.q} className="py-6">
                <h3 className="font-bold text-navy">{item.q}</h3>
                <p className="mt-3 text-sm leading-relaxed text-graphite-600">{item.a}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Safety note */}
      <section className="py-12">
        <SectionShell>
          <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <h3 className="font-bold text-navy text-sm">Important safety notes for women</h3>
                <ul className="mt-2 space-y-1 text-xs text-graphite-600 leading-relaxed">
                  <li>• GLP-1 medications are <strong>contraindicated during pregnancy</strong>. Stop at least 2 months before trying to conceive.</li>
                  <li>• If breastfeeding, discuss with your provider — data on transfer to breast milk is limited.</li>
                  <li>• Oral contraceptives should be taken 1 hour before or 4 hours after a semaglutide dose.</li>
                  <li>• A personal or family history of medullary thyroid carcinoma is a contraindication.</li>
                </ul>
              </div>
            </div>
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
              <h3 className="font-bold text-navy text-sm">Women-informed protocols</h3>
              <p className="text-xs text-graphite-500">Care plans account for hormonal health and cycle patterns</p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Further reading */}
      <section className="py-12 bg-cloud/40 border-y border-sage/20">
        <SectionShell>
          <h2 className="text-lg font-semibold text-navy mb-2">Further reading</h2>
          <p className="text-sm text-graphite-500 mb-6">Articles on GLP-1, hormones, and women&apos;s weight loss</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Semaglutide Birth Control Interactions", href: "/blog/semaglutide-birth-control-interaction", tag: "Women's Health" },
              { label: "Ozempic Face: What It Is & Prevention", href: "/blog/ozempic-face-what-is-it", tag: "Appearance" },
              { label: "What to Eat on Semaglutide", href: "/blog/what-to-eat-on-semaglutide", tag: "Nutrition" },
              { label: "GLP-1 & PCOS: How It Helps", href: "/pcos", tag: "PCOS" },
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
            {siteConfig.compliance.shortDisclaimer} Clinical data cited from published peer-reviewed research. Individual results vary. Treatment eligibility determined by a licensed medical provider.
          </p>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
