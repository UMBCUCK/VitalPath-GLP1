export const dynamic = "force-static";

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, Check, Shield, Clock, Star, TrendingDown,
  FlaskConical, Users, Award, AlertCircle,
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
  title: "Semaglutide for Weight Loss | How It Works, Dosing, and Results",
  description:
    "Semaglutide is the active ingredient in Wegovy and Ozempic. Learn how it works for weight loss, what clinical trials show, dosing schedules, side effects, and how to access it through VitalPath.",
  openGraph: {
    title: "Semaglutide for Weight Loss | VitalPath",
    description:
      "A complete guide to semaglutide weight loss treatment — clinical data, dosing, side effects, and how to get started with a licensed provider.",
  },
};

const results = [
  { stat: "~15%", label: "Average body weight lost in STEP-1 trial (68 weeks)" },
  { stat: "86%", label: "Of patients lost ≥5% of body weight on semaglutide" },
  { stat: "35%", label: "Reduction in cardiovascular events in SELECT trial" },
  { stat: "1,961", label: "Participants in the STEP-1 pivotal trial" },
];

const faqs = [
  {
    q: "Is semaglutide the same as Ozempic or Wegovy?",
    a: "Yes. Semaglutide is the active ingredient in both Ozempic (approved for type 2 diabetes) and Wegovy (approved specifically for weight management). The key difference is dose — Wegovy goes up to 2.4mg weekly while Ozempic's highest dose is 2mg. Compounded semaglutide contains the same active molecule.",
  },
  {
    q: "How long before semaglutide starts working?",
    a: "Most patients notice reduced appetite within the first few weeks. Meaningful weight loss typically begins in months one and two as the dose titrates upward. Maximum weight loss effect is usually seen between months 12 and 18 at therapeutic dosing.",
  },
  {
    q: "What is the dosing schedule for semaglutide?",
    a: "Semaglutide is injected once weekly. Treatment typically starts at 0.25mg for 4 weeks, then increases to 0.5mg. Subsequent increases occur every 4 weeks based on tolerability, with a target dose of 1.0–2.4mg for weight management.",
  },
  {
    q: "How is compounded semaglutide different from Ozempic?",
    a: "Compounded semaglutide contains the same active molecule as Ozempic but is produced by state-licensed compounding pharmacies rather than Novo Nordisk. It is not FDA-approved, but when sourced from a legitimate 503B outsourcing facility it meets the same manufacturing standards as commercial drugs. The primary advantage is significantly lower cost — typically $150–$400/month versus $1,000+ for brand-name products.",
  },
  {
    q: "Can I use semaglutide if I have type 2 diabetes?",
    a: "Yes — semaglutide was originally developed as a diabetes medication and is highly effective for patients with T2D. If you're on other diabetes medications, your prescribing provider will need to coordinate dosing to manage blood sugar safely, particularly if you're on sulfonylureas or insulin.",
  },
  {
    q: "What happens if I stop taking semaglutide?",
    a: "Hunger hormones that were suppressed by the medication return, and most patients experience increased appetite and some weight regain. Clinical trials show patients regain roughly two-thirds of lost weight within a year of stopping without behavioral support. This is why building habits during treatment — and having a maintenance plan — matters so much.",
  },
];

const doseSteps = [
  { dose: "0.25mg", duration: "Weeks 1–4", note: "Starting/calibration dose — not therapeutic, allows adjustment" },
  { dose: "0.5mg", duration: "Weeks 5–8", note: "First therapeutic dose — most patients notice appetite changes" },
  { dose: "1.0mg", duration: "Weeks 9–12", note: "Standard maintenance dose for many patients" },
  { dose: "1.7mg", duration: "Weeks 13–16", note: "Higher dose if additional efficacy needed and tolerated" },
  { dose: "2.4mg", duration: "Week 17+", note: "Maximum approved dose for weight management (Wegovy)" },
];

export default function SemaglutidePage() {
  const faqJsonLd = faqs.map((f) => ({ question: f.q, answer: f.a }));

  return (
    <MarketingShell>
      <FAQPageJsonLd faqs={faqJsonLd} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Semaglutide", href: "/semaglutide" },
        ]}
      />
      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-white py-20">
        <SectionShell className="max-w-4xl text-center">
          <Badge variant="default" className="mb-4">
            <FlaskConical className="mr-1.5 h-3 w-3" />
            GLP-1 Receptor Agonist
          </Badge>
          <h1 className="text-4xl font-bold text-navy sm:text-5xl lg:text-6xl">
            Semaglutide for Weight Loss
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-graphite-500 leading-relaxed">
            The active ingredient in Wegovy and Ozempic. Clinical trials show an average of 15% body weight
            loss over 68 weeks. Here&apos;s what that means for you — in plain language.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/qualify">
              <Button size="xl" className="gap-2 shadow-glow px-8">
                See If I Qualify <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="xl" className="px-8">
                View Plans &amp; Pricing
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-graphite-400">Provider evaluation required · Treatment not guaranteed</p>
        </SectionShell>
      </section>

      {/* Clinical stats */}
      <section className="border-y border-navy-100/40 bg-white py-12">
        <SectionShell>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {results.map((r) => (
              <div key={r.stat} className="text-center">
                <p className="text-3xl font-bold text-teal sm:text-4xl">{r.stat}</p>
                <p className="mt-2 text-sm text-graphite-500 leading-snug">{r.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-graphite-300">
            Data from STEP-1 and SELECT cardiovascular outcomes trial. Individual results vary.
          </p>
        </SectionShell>
      </section>

      {/* What is semaglutide */}
      <section className="py-20 bg-white">
        <SectionShell className="max-w-3xl">
          <SectionHeading
            eyebrow="The Science"
            title="What semaglutide actually does in your body"
            description="No jargon — just the mechanism, explained."
          />
          <div className="mt-12 space-y-8 text-graphite-600 leading-relaxed">
            <div>
              <h3 className="text-lg font-bold text-navy mb-2">It mimics a hormone you already make</h3>
              <p>
                GLP-1 (glucagon-like peptide 1) is a hormone naturally produced in your gut after eating.
                Its job is to signal the brain that you&apos;re full, slow the movement of food through your
                stomach, and prompt the pancreas to release insulin when blood sugar is elevated. The problem
                is that natural GLP-1 breaks down in about two minutes — not long enough for sustained effect.
              </p>
              <p className="mt-3">
                Semaglutide is engineered to bind GLP-1 receptors with a half-life of about a week,
                providing continuous activation of the same pathways. The result: persistent appetite
                suppression, slower gastric emptying, and improved insulin regulation — all maintained
                between weekly injections.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy mb-2">It quiets food noise, not just hunger</h3>
              <p>
                Many patients describe a reduction in &quot;food noise&quot; — the constant background preoccupation
                with food, the planning ahead about the next meal, the emotional pull toward certain foods
                that has nothing to do with actual hunger. GLP-1 receptors are present in the brain&apos;s
                reward system, not just in hunger-regulating areas. Activating them reduces the hedonic
                component of eating, which is often what dietary restriction approaches fail to address.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy mb-2">The weight loss comes from reduced energy intake, not magic</h3>
              <p>
                Semaglutide produces weight loss by creating a calorie deficit — it reduces appetite enough
                that most patients naturally eat 400–700 fewer calories per day without conscious restriction.
                What makes it different from traditional calorie restriction is that the appetite suppression
                addresses the hormonal mechanisms that make dieting hard, rather than requiring willpower
                to override persistent hunger signals.
              </p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Dosing schedule */}
      <section className="py-20 bg-cloud/40">
        <SectionShell className="max-w-3xl">
          <SectionHeading
            eyebrow="Dosing"
            title="The semaglutide titration schedule"
            description="Doses increase gradually over 16+ weeks to balance efficacy with tolerability."
          />
          <div className="mt-10 space-y-3">
            {doseSteps.map((d, i) => (
              <div key={d.dose} className="flex items-start gap-4 rounded-xl border border-navy-100/60 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-sm font-bold text-teal">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-navy">{d.dose}</span>
                    <Badge variant="default" className="text-xs">{d.duration}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-graphite-500">{d.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
            <p className="text-sm text-amber-800">
              Titration schedules are individualized based on tolerability and response. Your provider may
              adjust the pace or target dose based on how you&apos;re responding. Never adjust your dose
              without provider guidance.
            </p>
          </div>
        </SectionShell>
      </section>

      {/* What to expect */}
      <section className="py-20 bg-white">
        <SectionShell className="max-w-4xl">
          <SectionHeading
            eyebrow="Results"
            title="What weight loss on semaglutide realistically looks like"
            description="Clinical averages and what drives variation between individuals."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                period: "Month 1–2",
                headline: "4–12 lbs average",
                detail: "The starting dose isn't therapeutic — real appetite suppression builds as the dose titrates up. Most early weight loss includes water weight from reduced carbohydrate intake.",
              },
              {
                period: "Months 3–6",
                headline: "8–20+ lbs additional",
                detail: "The most active fat-loss phase for most patients. The medication is at or near therapeutic dose, appetite suppression is established, and behavioral patterns are forming.",
              },
              {
                period: "Months 6–18",
                headline: "Total 15–22% avg",
                detail: "Weight loss continues but at a slower rate as the body adapts. Total loss in clinical trials averaged 15% of body weight at 68 weeks — roughly 33 lbs for someone starting at 220 lbs.",
              },
            ].map((item) => (
              <div key={item.period} className="rounded-2xl border border-navy-100/60 bg-cloud/40 p-6">
                <Badge variant="default" className="mb-3">{item.period}</Badge>
                <p className="text-2xl font-bold text-teal mb-2">{item.headline}</p>
                <p className="text-sm text-graphite-500 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-gradient-to-r from-navy to-atlantic p-6 text-white">
            <div className="flex items-start gap-3">
              <TrendingDown className="h-6 w-6 text-teal-300 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">The SELECT cardiovascular outcomes trial (2023)</p>
                <p className="text-sm text-navy-300 leading-relaxed">
                  17,604 adults with obesity and established cardiovascular disease, no diabetes. Semaglutide 2.4mg
                  reduced the risk of major cardiovascular events (heart attack, stroke, cardiovascular death)
                  by 20% compared to placebo — independent of weight loss. This finding changed how
                  cardiologists think about obesity treatment.
                </p>
              </div>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Side effects */}
      <section className="py-20 bg-cloud/40">
        <SectionShell className="max-w-3xl">
          <SectionHeading
            eyebrow="Side Effects"
            title="What to expect, honestly"
            description="Most side effects are gastrointestinal and temporary. Here's the complete picture."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              { name: "Nausea", freq: "30–44% of patients", notes: "Usually peaks at dose initiation and increases, fades within 1–2 weeks. Manageable with meal size and food choices." },
              { name: "Constipation", freq: "24–30% of patients", notes: "Caused by slower gastric motility. Responds well to increased water intake and, if needed, MiraLax." },
              { name: "Diarrhea", freq: "15–20% of patients", notes: "More common at higher doses and dose increases. Usually transient." },
              { name: "Vomiting", freq: "8–14% of patients", notes: "Less common than nausea. Typically indicates eating too quickly, too much, or trigger foods." },
              { name: "Fatigue", freq: "Common early on", notes: "Often related to eating significantly less. Increases with inadequate protein intake. Usually improves by month two." },
              { name: "Hair shedding", freq: "~25% of patients", notes: "Caused by rapid weight loss triggering telogen effluvium, not the medication itself. Temporary — typically resolves within 6 months." },
            ].map((s) => (
              <div key={s.name} className="rounded-xl border border-navy-100/60 bg-white p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-navy text-sm">{s.name}</span>
                  <Badge variant="default" className="text-xs">{s.freq}</Badge>
                </div>
                <p className="text-xs text-graphite-500 leading-relaxed">{s.notes}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-navy-100/60 bg-white p-5">
            <p className="text-sm font-semibold text-navy mb-2">Serious adverse events (rare)</p>
            <p className="text-sm text-graphite-500 leading-relaxed">
              Pancreatitis, gallbladder disease, thyroid C-cell tumors (observed in rodent studies — not confirmed in humans at therapeutic doses), and hypoglycemia (primarily when combined with diabetes medications) are listed in the prescribing information.
              Your provider will review your personal risk factors as part of the evaluation.
            </p>
          </div>
        </SectionShell>
      </section>

      {/* Who qualifies */}
      <section className="py-20 bg-white">
        <SectionShell className="max-w-3xl">
          <SectionHeading
            eyebrow="Eligibility"
            title="Who typically qualifies for semaglutide"
            description="FDA indications and your provider's clinical judgment both factor in."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border-2 border-teal bg-teal-50/30 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Check className="h-5 w-5 text-teal" />
                <span className="font-semibold text-navy">Typically qualifies</span>
              </div>
              <ul className="space-y-2 text-sm text-graphite-600">
                <li>• BMI ≥ 30 (obesity)</li>
                <li>• BMI ≥ 27 with a weight-related condition (hypertension, type 2 diabetes, sleep apnea, high cholesterol, PCOS)</li>
                <li>• Previous unsuccessful attempts at weight loss through diet and exercise</li>
                <li>• No absolute contraindications to GLP-1 treatment</li>
              </ul>
            </div>
            <div className="rounded-xl border-2 border-red-200 bg-red-50/30 p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="font-semibold text-navy">Contraindicated</span>
              </div>
              <ul className="space-y-2 text-sm text-graphite-600">
                <li>• Personal or family history of medullary thyroid carcinoma</li>
                <li>• Multiple Endocrine Neoplasia type 2 (MEN2)</li>
                <li>• Pregnancy or planning to become pregnant</li>
                <li>• History of pancreatitis (relative — provider judgment)</li>
                <li>• Severe gastroparesis</li>
              </ul>
            </div>
          </div>
          <p className="mt-6 text-sm text-graphite-400">
            Final eligibility is determined by your licensed medical provider after reviewing your complete health history. This list is for general guidance only.
          </p>
        </SectionShell>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-cloud/40">
        <SectionShell className="max-w-3xl">
          <SectionHeading
            eyebrow="FAQ"
            title="Common questions about semaglutide"
          />
          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-navy-100/60 bg-white">
                <summary className="flex cursor-pointer items-start justify-between gap-4 p-5 text-sm font-semibold text-navy list-none">
                  {faq.q}
                  <span className="ml-auto shrink-0 text-graphite-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="border-t border-navy-100/40 px-5 pb-5 pt-4">
                  <p className="text-sm text-graphite-600 leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Trust bar */}
      <section className="border-y border-navy-100/40 bg-white py-8">
        <SectionShell>
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-graphite-400">
            <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-teal" /> HIPAA Compliant</span>
            <span className="flex items-center gap-2"><Award className="h-4 w-4 text-teal" /> Licensed Medical Providers</span>
            <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-teal" /> 24-Hour Provider Review</span>
            <span className="flex items-center gap-2"><Users className="h-4 w-4 text-teal" /> 18,000+ Patients</span>
            <span className="flex items-center gap-2">
              {[1,2,3,4,5].map((i) => <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />)}
              4.9/5 Rating
            </span>
          </div>
        </SectionShell>
      </section>

      <CtaSection />

      {/* Disclaimer */}
      <section className="py-6 bg-white">
        <SectionShell>
          <p className="text-center text-xs text-graphite-300 leading-relaxed max-w-3xl mx-auto">
            {siteConfig.compliance.eligibilityDisclaimer} Semaglutide clinical data referenced from the STEP-1 trial (Wilding et al., NEJM 2021) and SELECT trial (Lincoff et al., NEJM 2023). Individual results vary. Compounded semaglutide is not FDA-approved.
          </p>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
