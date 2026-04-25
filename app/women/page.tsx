export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, Check, AlertCircle, Heart, Activity,
  Flower2, Users, Droplet, Flame,
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
  title: "GLP-1 for Women | PCOS, Menopause & Hormonal Weight Loss",
  description:
    "GLP-1 medications like semaglutide and tirzepatide address the hormonal roots of weight gain in women — including insulin resistance, PCOS, and menopause-related metabolic changes.",
  openGraph: {
    title: "GLP-1 for Women: PCOS, Menopause & Hormonal Weight Loss | Nature's Journey",
    description:
      "Evidence-informed guide to GLP-1 weight loss for women. Covers PCOS, perimenopause, insulin resistance, and what to realistically expect.",
  },
};

const pcosPoints = [
  "Insulin resistance drives fat storage even when calories are controlled",
  "Elevated androgens disrupt hunger hormones (leptin, ghrelin) at the brain level",
  "Chronic low-grade inflammation makes conventional dieting less effective",
  "GLP-1 receptors are expressed in ovarian tissue — research suggests direct hormonal downstream effects",
  "Studies show GLP-1 agonists can restore menstrual regularity in anovulatory PCOS",
];

const menopausePoints = [
  "Declining estrogen shifts fat storage from hips/thighs to visceral (abdominal) tissue",
  "Visceral fat is metabolically active — it worsens insulin resistance and inflammation",
  "Resting metabolic rate drops ~2–3% per decade; muscle loss accelerates this",
  "GLP-1 shows equivalent or better weight loss in postmenopausal vs premenopausal women",
  "Sleep disruption (common in perimenopause) worsens hunger hormone regulation — GLP-1 dampens this",
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
    a: "GLP-1 medications are contraindicated during pregnancy and should be stopped at least 2 months before attempting conception. If you have PCOS and are struggling to conceive, achieving a healthier BMI through GLP-1 treatment before stopping may improve fertility outcomes.",
  },
  {
    q: "Will I lose muscle along with fat?",
    a: "Some muscle loss occurs with any significant caloric deficit — this is not unique to GLP-1. Adequate protein (0.7–1g per pound) and resistance training substantially reduce lean mass loss. Your plan includes protein targets and exercise guidance specifically for this.",
  },
  {
    q: "I've heard GLP-1 causes hair loss — is that true for women?",
    a: "Telogen effluvium — temporary hair shedding — can occur with rapid weight loss. It's caused by the caloric deficit and rapid body change, not the medication. It typically begins 2–4 months into significant weight loss and resolves within 6 months. Iron, biotin, and zinc levels should be checked if shedding is severe.",
  },
];

const testimonials = [
  {
    initials: "S.W.",
    name: "Sarah W.",
    location: "Charleston, SC",
    outcome: "Lost 42 lbs",
    outcomeDetail: "Perimenopause belly gone · Sleep restored",
    quote: "At 46 the belly fat appeared overnight and nothing would touch it. Six months on GLP-1 and I look like myself again — and I'm actually sleeping through the night.",
    highlight: "I look like myself again",
    duration: "6 months",
  },
  {
    initials: "T.L.",
    name: "Tanya L.",
    location: "Portland, OR",
    outcome: "Lost 29 lbs",
    outcomeDetail: "PCOS cycles regular · Acne cleared",
    quote: "The thing nobody tells you about PCOS is how loud the hunger is. It's constant. Food noise gone. For the first time I can just... live.",
    highlight: "Food noise gone",
    duration: "5 months",
  },
  {
    initials: "R.M.",
    name: "Rebecca M.",
    location: "Boston, MA",
    outcome: "Lost 35 lbs",
    outcomeDetail: "Hot flashes 80% reduced",
    quote: "My doctor said 'menopause weight is forever.' She was wrong. Everything — energy, mood, hot flashes, joint pain — changed with the weight.",
    highlight: "'menopause weight is forever.' She was wrong",
    duration: "8 months",
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

      <LandingStickyCta label="Hormonal weight loss for women" analyticsPage="women" />

      <LandingHero
        badge="Women's Health"
        badgeIcon="Flower2"
        accent="rose"
        headlineStart="GLP-1 weight loss"
        headlineAccent="built around your hormones"
        subhead={
          <>
            Hormonal factors make weight loss harder for many women — and conventional diet advice misses this entirely. GLP-1 medications work at a biological level that addresses <strong className="text-navy">PCOS, perimenopause, and menopause</strong> weight gain at the root.
          </>
        }
        analyticsPage="women"
        cardTitle="What the research shows for women"
        cardIcon="Heart"
        cardMetrics={[
          { label: "Average body weight lost (sema/tirz)", value: "15–21%", direction: "down" },
          { label: "Of STEP-1 trial participants were women", value: "54%", direction: "up" },
          { label: "Of women with PCOS have insulin resistance", value: "75%" },
          { label: "Higher visceral fat after menopause", value: "3–5×", direction: "up" },
        ]}
        cardFootnote="Data from STEP-1, SURMOUNT-1, and 2023 PCOS meta-analyses. Individual results vary."
        testimonial={{
          initials: "S.W.",
          name: "Sarah W.",
          outcome: "Lost 42 lbs in 6 months",
          quote: "I look like myself again.",
        }}
      />

      <LandingTrustStrip />

      <LandingPressBar />

      <LandingStatsRow
        eyebrow="Women on GLP-1"
        stats={[
          { value: "15–21%", label: "Average body weight lost", icon: "Flame", tone: "rose" },
          { value: "54%", label: "STEP-1 participants were women", icon: "Users", tone: "atlantic" },
          { value: "75%", label: "Of women with PCOS have insulin resistance", icon: "Droplet", tone: "lavender" },
          { value: "3–5×", label: "More visceral fat after menopause", icon: "Activity", tone: "emerald" },
        ]}
      />

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
                <strong className="text-navy">Hunger hormone dysregulation</strong> compounds this. Ghrelin (the &ldquo;hunger hormone&rdquo;) runs higher in women, and leptin resistance is more pronounced in obesity. GLP-1 directly suppresses ghrelin and restores leptin sensitivity.
              </p>
              <p>
                None of this is a character flaw or a lack of effort. It&apos;s physiology. And it&apos;s exactly what GLP-1 medications were designed to address.
              </p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* PCOS + Menopause dual column */}
      <section className="bg-gradient-to-b from-rose-50/30 to-white py-20">
        <SectionShell>
          <SectionHeading
            eyebrow="Two big cases for women"
            title="PCOS and menopause — where the evidence is strongest"
            description="The hormonal weight challenges where GLP-1 therapy has the most robust clinical research."
          />
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-3xl border border-violet-200 bg-white p-8 shadow-premium">
              <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-400 opacity-10 blur-2xl" />
              <div className="relative">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-400 text-white shadow-premium">
                    <Flower2 className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-navy text-lg">PCOS</h3>
                </div>
                <p className="text-sm text-graphite-600 leading-relaxed mb-4">
                  The most common endocrine disorder in reproductive-age women. Its metabolic effects make conventional weight loss approaches especially frustrating.
                </p>
                <ul className="space-y-2.5">
                  {pcosPoints.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                      <span className="text-sm leading-relaxed text-graphite-600">{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 rounded-xl bg-violet-50 p-4 text-xs text-violet-700 leading-relaxed">
                  <strong>60–70%</strong> of anovulatory PCOS patients regain cycle regularity on GLP-1 therapy after ≥5% body weight loss.
                </div>
                <Link href="/pcos" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-violet-700 hover:text-violet-900">
                  Full PCOS research <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-rose-200 bg-white p-8 shadow-premium">
              <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-gradient-to-br from-rose-500 to-pink-400 opacity-10 blur-2xl" />
              <div className="relative">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-400 text-white shadow-premium">
                    <Heart className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-navy text-lg">Menopause &amp; perimenopause</h3>
                </div>
                <p className="text-sm text-graphite-600 leading-relaxed mb-4">
                  The typical transition involves 5–8 lbs gained even without changes in diet or activity — driven by visceral fat redistribution as estrogen drops.
                </p>
                <ul className="space-y-2.5">
                  {menopausePoints.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                      <span className="text-sm leading-relaxed text-graphite-600">{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 rounded-xl bg-rose-50 p-4 text-xs text-rose-700 leading-relaxed">
                  Postmenopausal women respond <strong>comparably</strong> to premenopausal women in weight outcomes — and may see <strong>greater</strong> cardiovascular benefit.
                </div>
              </div>
            </div>
          </div>
        </SectionShell>
      </section>

      <LandingJourneyTimeline
        accent="rose"
        title="Your first year on GLP-1 — what to expect"
        description="Based on STEP-1, SURMOUNT-1, and PCOS sub-analyses with female-majority cohorts."
      />

      <LandingComparisonTable />

      <LandingTestimonials
        eyebrow="Real women · Real results"
        title="Women on GLP-1 — in their words"
        description="What women navigating PCOS, perimenopause, and menopause actually experience."
        items={testimonials}
        accent="rose"
      />

      <LandingGuaranteeMedallion accent="rose" />

      <LandingProviderTeam accent="rose" />

      <LandingHowItWorks
        accent="rose"
        segmentLabel="Women-informed intake + cycle-aware monitoring included."
      />

      <LandingPricingAnchor
        eyebrow="Transparent women's pricing"
        headline="Women-informed care at one monthly price."
        subhead="Everything you need for hormonal weight management — provider care, cycle-aware monitoring, medication, and coaching. No hidden fees."
        includes={[
          "Provider experienced with hormonal health (PCOS, menopause)",
          "Compounded semaglutide or tirzepatide",
          "Cycle- and menopause-aware monitoring included",
          "Unlimited provider messaging & dose adjustments",
          "Women's meal plans, protein targets, and coaching",
          "Free 2-day shipping · Cancel anytime",
        ]}
        primaryCtaLabel="See If I Qualify"
        accent="rose"
      />

      {/* Safety */}
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

      <LandingFaq
        eyebrow="Women's FAQ"
        title="Questions women actually ask"
        description="About cycles, fertility, hair, and hormone interactions — answered honestly."
        items={concerns}
      />

      {/* Further reading */}
      <section className="py-12 bg-cloud/40 border-y border-sage/20">
        <SectionShell>
          <h2 className="text-lg font-semibold text-navy mb-2 text-center">Further reading</h2>
          <p className="text-sm text-graphite-500 mb-6 text-center">Articles on GLP-1, hormones, and women&apos;s weight loss</p>
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
            {siteConfig.compliance.shortDisclaimer} Clinical data cited from published peer-reviewed research. Individual results vary. Treatment eligibility determined by a licensed medical provider.
          </p>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
