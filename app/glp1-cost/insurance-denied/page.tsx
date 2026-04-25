/**
 * /glp1-cost/insurance-denied — long-tail SEO cost page
 * ─────────────────────────────────────────────────────────────
 * Tier 10.4 — Captures high-intent "my insurance denied Wegovy/Zepbound"
 * searches. These visitors are mid-funnel, frustrated, and primed for a
 * cash-pay compounded alternative — among the highest-converting
 * segments in GLP-1 telehealth.
 *
 * Static page (not under the [state] dynamic segment's match because
 * Next.js resolves static → dynamic). Includes structured data for
 * rich results + ViewContent tracking.
 */
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  X,
  ShieldCheck,
  Stethoscope,
  Truck,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { SectionShell } from "@/components/shared/section-shell";
import { Disclaimer } from "@/components/shared/disclaimer";
import {
  MedicalWebPageJsonLd,
  BreadcrumbJsonLd,
  FAQPageJsonLd,
} from "@/components/seo/json-ld";
import { ViewContentTracker } from "@/components/shared/view-content-tracker";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "GLP-1 Cost When Insurance Denied Wegovy / Zepbound — From $279/mo",
  description:
    "Insurance denied your Wegovy, Zepbound, or Ozempic claim? Here's what compounded GLP-1 actually costs without insurance in 2026 — and how to start for $279/mo in most US states.",
  keywords: [
    "GLP-1 insurance denied",
    "Wegovy not covered",
    "Zepbound insurance denied",
    "Ozempic not covered for weight loss",
    "compounded semaglutide without insurance",
    "affordable GLP-1 cash pay",
    "weight loss medication no insurance",
  ],
  openGraph: {
    title: "GLP-1 Cost When Insurance Denies Coverage — From $279/mo",
    description:
      "Your path forward when Wegovy / Zepbound / Ozempic is denied. Compounded GLP-1 from $279/mo, prescribed online, no insurance required.",
    type: "website",
  },
  alternates: { canonical: `${siteConfig.url}/glp1-cost/insurance-denied` },
};

const faqs = [
  {
    question: "Why does insurance deny GLP-1 medications for weight loss?",
    answer:
      "Most commercial plans cover GLP-1 medications only when the patient meets specific BMI + comorbidity thresholds (e.g. BMI ≥30, or ≥27 with diabetes/hypertension). Even when thresholds are met, many plans require prior authorization, step-therapy (trying older drugs first), or have explicit weight-loss drug exclusions. For the branded medications — Wegovy, Zepbound, Saxenda — denial rates are reported at 40–60% in recent analyses.",
  },
  {
    question: "Can I appeal a GLP-1 denial?",
    answer:
      "Yes, but success rates depend on your specific plan. A physician's letter of medical necessity showing documented failed attempts at lifestyle intervention, obesity-related comorbidities, and medical appropriateness is the strongest lever. Appeals typically take 30–60 days. Many patients choose to start on a cash-pay compounded alternative while the appeal is in process.",
  },
  {
    question: "How much does compounded semaglutide actually cost?",
    answer:
      "Nature's Journey cash-pay pricing starts at $279/mo for compounded semaglutide, and that's all-inclusive — licensed provider evaluation, medication if prescribed, free 2-day shipping, and ongoing care-team support are bundled. That's about 79% less than the cash-pay retail price of brand-name Wegovy ($1,349/mo).",
  },
  {
    question: "Is compounded semaglutide as effective as Wegovy?",
    answer:
      "Compounded semaglutide contains the same active ingredient as Wegovy and Ozempic. The published STEP-1 trial efficacy data applies to the molecule, not the brand name. The key safety difference is sourcing — state-licensed 503A/503B compounding pharmacies are regulated and inspected. Unregulated online sources are not and should be avoided.",
  },
  {
    question: "Can I use my HSA or FSA for compounded GLP-1?",
    answer:
      "Most HSA/FSA plans do cover prescription medications — including compounded medications — when prescribed by a licensed provider for a qualifying medical condition. Check with your plan administrator. We provide an itemized receipt compatible with HSA/FSA reimbursement.",
  },
  {
    question: "What if I've already tried Wegovy and it worked — can I switch to compounded?",
    answer:
      "Yes. Compounded semaglutide contains the same active ingredient you already know works for you. Many patients switch when insurance coverage changes or their pharmacy faces a shortage. Your provider on Nature's Journey will review your treatment history and continue your care at an appropriate dose.",
  },
];

export default function InsuranceDeniedPage() {
  return (
    <MarketingShell>
      <MedicalWebPageJsonLd
        name="GLP-1 Cost When Insurance Denied — Nature's Journey"
        description="Next-step guide and cash-pay pricing for patients whose insurance has denied Wegovy, Zepbound, or Ozempic coverage."
        url="/glp1-cost/insurance-denied"
        medicalAudience="Patient"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "GLP-1 Cost", href: "/glp1-cost" },
          { name: "Insurance denied", href: "/glp1-cost/insurance-denied" },
        ]}
      />
      <FAQPageJsonLd faqs={faqs} />
      <ViewContentTracker
        contentName="GLP-1 Cost: Insurance Denied"
        contentCategory="cost-long-tail"
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-14 sm:py-20">
        <SectionShell className="max-w-3xl text-center">
          <Badge variant="default" className="mb-4 gap-1.5">
            <AlertCircle className="h-3 w-3" />
            Insurance denied? Read this first.
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Insurance denied your GLP-1?
            <br />
            <span className="bg-gradient-to-r from-teal to-atlantic bg-clip-text text-transparent">
              Here&apos;s your $279/mo path forward.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-graphite-500">
            Most commercial plans deny Wegovy, Zepbound, or Ozempic for weight loss — 40–60% of
            the time. You don&apos;t have to wait through a 60-day appeal. Compounded semaglutide
            contains the same active ingredient, is prescribed by a licensed provider, and starts
            at $279/mo cash-pay.
          </p>

          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-white border border-navy-100/60 px-5 py-2.5 shadow-premium-sm">
            <span className="text-sm text-graphite-400 line-through">$1,349/mo retail</span>
            <span className="text-xl font-bold text-navy">$279/mo</span>
            <span className="rounded-full bg-teal px-2.5 py-0.5 text-xs font-bold text-white">
              Save 79%
            </span>
          </div>

          <div className="mt-8">
            <Link href="/qualify?ref=ins-denied">
              <Button variant="emerald" size="xl" className="gap-2 rounded-full px-10">
                See If I Qualify
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <p className="mt-3 text-xs text-graphite-400">
              No insurance required · Same active ingredient as Wegovy · Cancel anytime
            </p>
          </div>
        </SectionShell>
      </section>

      {/* Trust bar */}
      <section className="border-y border-navy-100/40 bg-linen py-4">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 px-4 text-xs text-graphite-500">
          <span className="flex items-center gap-1.5">
            <Stethoscope className="h-3.5 w-3.5 text-teal" /> US-licensed providers
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-teal" /> 503A/503B pharmacy
          </span>
          <span className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-teal" /> Free 2-day shipping
          </span>
          <span className="flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-teal" /> HSA/FSA eligible
          </span>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-14 bg-white">
        <SectionShell className="max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-navy">
            Denied brand vs. cash-pay compounded
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-graphite-500">
            Side-by-side comparison of the path most patients face after an insurance denial.
          </p>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40 text-left text-xs text-graphite-400">
                  <th className="py-3 font-semibold"></th>
                  <th className="py-3 font-semibold text-center">
                    Appeal denial + wait
                  </th>
                  <th className="py-3 font-semibold text-center text-teal">
                    Start compounded now
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {[
                  ["Time to start treatment", "30–60 days (appeal)", "1–2 business days"],
                  ["Monthly cost if approved", "$0–$100 copay*", "$279 all-in"],
                  ["Monthly cost if denied again", "$1,349 retail", "$279 cash-pay"],
                  ["Prior authorization required", true, false],
                  ["Pharmacy shortage risk", true, false],
                  ["Active ingredient", "Semaglutide", "Semaglutide (same molecule)"],
                  ["Licensed provider care", true, true],
                  ["HSA/FSA eligible", true, true],
                  ["Cancel anytime", false, true],
                ].map(([feature, left, right], i) => (
                  <tr key={i}>
                    <td className="py-3 font-medium text-navy">{String(feature)}</td>
                    <td className="py-3 text-center text-sm">
                      {typeof left === "boolean" ? (
                        left ? (
                          <Check className="mx-auto h-4 w-4 text-graphite-400" />
                        ) : (
                          <X className="mx-auto h-4 w-4 text-graphite-300" />
                        )
                      ) : (
                        <span className="text-graphite-500">{left}</span>
                      )}
                    </td>
                    <td className="py-3 text-center text-sm">
                      {typeof right === "boolean" ? (
                        right ? (
                          <Check className="mx-auto h-4 w-4 text-teal" />
                        ) : (
                          <X className="mx-auto h-4 w-4 text-graphite-300" />
                        )
                      ) : (
                        <span className="font-semibold text-navy">{right}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-[11px] text-graphite-400">
              *Copay assumes successful appeal outcome, which is not guaranteed. Compounded
              medications are not FDA-approved drug products.
            </p>
          </div>
        </SectionShell>
      </section>

      {/* Action steps */}
      <section className="py-14 bg-cloud">
        <SectionShell className="max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-navy">
            What to do right now
          </h2>
          <div className="mt-6 space-y-3">
            {[
              {
                step: "1",
                title: "Complete our 2-minute assessment",
                desc: "A licensed provider reviews your profile and confirms if compounded semaglutide (or tirzepatide) is appropriate. No charge until a prescription is issued.",
              },
              {
                step: "2",
                title: "File your appeal in parallel (optional)",
                desc: "Ask your doctor for a letter of medical necessity documenting your BMI, comorbidities, and failed lifestyle attempts. Appeals take weeks; you don't have to wait.",
              },
              {
                step: "3",
                title: "Start treatment in 1–2 business days",
                desc: "If prescribed, medication ships free within 48 hours from a state-licensed compounding pharmacy. Month-to-month — cancel if your appeal comes through.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="flex items-start gap-4 rounded-2xl border border-navy-100/60 bg-white p-5 shadow-premium-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal text-white font-bold">
                  {s.step}
                </div>
                <div>
                  <p className="text-sm font-bold text-navy">{s.title}</p>
                  <p className="mt-1 text-sm text-graphite-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-white">
        <SectionShell className="max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-navy">Insurance-denial FAQs</h2>
          <div className="mt-6 space-y-3">
            {faqs.map((f) => (
              <details
                key={f.question}
                className="group rounded-2xl border border-navy-100/60 bg-white p-5 shadow-premium-sm"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-navy">{f.question}</span>
                  <span className="text-graphite-400 group-open:rotate-180 transition-transform">
                    ⌄
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-graphite-500">{f.answer}</p>
              </details>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Final CTA */}
      <section className="py-14 bg-gradient-to-br from-navy to-atlantic text-white text-center">
        <SectionShell className="max-w-2xl">
          <h2 className="text-3xl font-bold sm:text-4xl">Don't wait 60 days for an appeal</h2>
          <p className="mt-3 text-white/80">
            Start compounded GLP-1 in days, not weeks. $279/mo, same active ingredient, cancel anytime.
          </p>
          <div className="mt-6">
            <Link href="/qualify?ref=ins-denied">
              <Button variant="gold" size="xl" className="gap-2 rounded-full px-10">
                Start Free Assessment
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </SectionShell>
      </section>

      {/* Disclaimer */}
      <section className="bg-linen/60 py-8">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Disclaimer text={siteConfig.compliance.shortDisclaimer} size="sm" />
          <p className="mt-3 text-[11px] text-graphite-400">
            Compounded GLP-1 medications are not FDA-approved drug products. Prepared by
            state-licensed compounding pharmacies under individual prescription. Eligibility,
            protocol, and pricing determined at provider evaluation. Individual results vary.
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}
