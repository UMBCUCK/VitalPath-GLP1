export const dynamic = "force-static";

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, Check, DollarSign, AlertCircle, Info,
  TrendingDown, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "How Much Does GLP-1 Medication Cost in 2026?",
  description:
    "Brand-name GLP-1 medications like Wegovy and Zepbound cost $1,000–$1,400/month. Compounded semaglutide and tirzepatide from licensed pharmacies cost $150–$450/month. Here's the honest breakdown.",
  openGraph: {
    title: "GLP-1 Medication Cost in 2026: Brand vs Compounded | VitalPath",
    description:
      "Complete breakdown of GLP-1 costs in 2026 — Wegovy, Zepbound, compounded options, insurance reality, and how to access affordable treatment through a licensed telehealth provider.",
  },
};

const brandCosts = [
  {
    name: "Wegovy (semaglutide)",
    manufacturer: "Novo Nordisk",
    monthlyList: "$1,349",
    withInsurance: "$0–$1,349",
    notes: "Covered by fewer than 25% of commercial plans for weight management. GoodRx doesn't help — no generic exists.",
  },
  {
    name: "Zepbound (tirzepatide)",
    manufacturer: "Eli Lilly",
    monthlyList: "$1,059",
    withInsurance: "$0–$1,059",
    notes: "Newer to market, slightly lower list price than Wegovy. Savings card available but income-limited.",
  },
  {
    name: "Ozempic (semaglutide, diabetes label)",
    manufacturer: "Novo Nordisk",
    monthlyList: "$935",
    withInsurance: "Often covered for T2D",
    notes: "Off-label prescribing for weight loss is legal but insurance rarely covers it for that indication. Supply shortages persist.",
  },
  {
    name: "Mounjaro (tirzepatide, diabetes label)",
    manufacturer: "Eli Lilly",
    monthlyList: "$1,023",
    withInsurance: "Often covered for T2D",
    notes: "Manufacturer savings card available for commercially insured patients. Still requires diabetes diagnosis for most coverage.",
  },
];

const compoundedCosts = [
  { tier: "Basic (semaglutide)", range: "$150–$250/mo", notes: "Titration dosing, no nutrition support" },
  { tier: "VitalPath Essential", range: "$279/mo", notes: "Provider eval, medication if prescribed, care team messaging, monthly check-ins" },
  { tier: "VitalPath Premium", range: "$379/mo", notes: "Everything in Essential + meal plans, recipes, coaching, progress tracking" },
  { tier: "VitalPath Complete", range: "$599/mo", notes: "Everything in Premium + supplements, weekly coaching, lab coordination" },
  { tier: "Compounded tirzepatide (range)", range: "$300–$500/mo", notes: "Higher cost than semaglutide due to compound complexity; still 50–70% below brand" },
];

const faqs = [
  {
    q: "Why is brand-name GLP-1 medication so expensive?",
    a: "Wegovy and Zepbound have patent protection, meaning no generic versions are legally available. Novo Nordisk and Eli Lilly set list prices knowing that insurance covers most costs for covered patients — but for the majority of people, insurance doesn't cover these medications for weight management. The FDA shortage list previously allowed compounders to legally produce these medications at scale, which is how the compounded market grew.",
  },
  {
    q: "Will my insurance cover GLP-1 medication?",
    a: "Fewer than 25% of commercial insurance plans cover GLP-1 medications specifically for weight management. Coverage is much more common for type 2 diabetes. If you don't have diabetes, assume you'll pay out-of-pocket unless your employer specifically opted into weight management coverage. Medicare Part D coverage for obesity is limited by federal statute (though this is being contested).",
  },
  {
    q: "Is compounded semaglutide safe?",
    a: "Compounded semaglutide produced by an FDA-registered 503B outsourcing facility meets the same manufacturing standards (sterility, potency, purity) as commercially produced drugs. The key distinction is the source. A legitimate 503B facility has federal oversight; a gray-market or unregulated source does not. VitalPath only works with licensed, inspected 503B pharmacies and provides certificates of analysis for every batch.",
  },
  {
    q: "What's the difference between 503A and 503B compounding pharmacies?",
    a: "503A pharmacies compound medications on a patient-by-patient basis for individual prescriptions — they have less federal oversight. 503B outsourcing facilities operate under FDA inspection and can produce larger batches meeting pharmaceutical-grade standards. For injectable medications like semaglutide, a 503B source is significantly safer. Always ask which type of facility your provider's pharmacy uses.",
  },
  {
    q: "Can I use GoodRx or manufacturer coupons?",
    a: "GoodRx doesn't help with Wegovy or Zepbound — there's no generic, so discount cards have nothing to apply to. Novo Nordisk and Eli Lilly both offer savings programs, but these are typically limited to commercially insured patients who still have high out-of-pocket costs after insurance applies. They don't help uninsured patients access the medication at an affordable price.",
  },
  {
    q: "Are there any other costs beyond the medication?",
    a: "At VitalPath, the monthly fee includes your provider evaluation, treatment plan, medication (if prescribed), shipping, and care team access — there are no hidden fees. Some programs charge separately for the provider visit ($150–$300) plus the medication cost. Always ask whether the quoted price is all-inclusive before starting.",
  },
];

export default function GLP1CostPage() {
  return (
    <MarketingShell>
      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6">Pricing Guide 2026</Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl lg:text-6xl">
            How much does GLP-1 medication actually cost?
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500 leading-relaxed">
            Brand-name Wegovy and Zepbound list at $1,000–$1,400/month. Most insurance won&apos;t cover it. Compounded GLP-1 from licensed pharmacies changes the math significantly.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/qualify">
              <Button size="xl" className="gap-2 px-10">
                See Pricing <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-graphite-400">From $279/mo · Free assessment · Cancel anytime</p>
          </div>
        </SectionShell>
      </section>

      {/* Quick comparison banner */}
      <section className="bg-navy py-10">
        <SectionShell>
          <div className="grid gap-6 sm:grid-cols-3 text-center">
            <div>
              <div className="text-3xl font-bold text-red-400">$1,349</div>
              <div className="mt-1 text-sm text-white/70">Wegovy list price/mo</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="rounded-full bg-teal/20 px-4 py-2">
                <TrendingDown className="inline h-5 w-5 text-teal mr-1" />
                <span className="text-teal font-bold text-sm">79% less</span>
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal">$279</div>
              <div className="mt-1 text-sm text-white/70">VitalPath Essential/mo</div>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Brand-name costs */}
      <section className="py-20">
        <SectionShell>
          <SectionHeading
            eyebrow="Brand-Name Costs"
            title="What Wegovy, Zepbound, and other brand medications actually cost"
            description="These are 2026 list prices. What you pay depends on insurance — and for most people, insurance doesn't cover weight management."
          />
          <div className="mt-10 overflow-hidden rounded-2xl border border-navy-100/60 bg-white shadow-premium">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-navy-100/40 bg-cloud text-left">
                    <th className="px-6 py-4 text-sm font-bold text-navy">Medication</th>
                    <th className="px-6 py-4 text-sm font-bold text-navy">Manufacturer</th>
                    <th className="px-6 py-4 text-sm font-bold text-navy">List Price/Mo</th>
                    <th className="px-6 py-4 text-sm font-bold text-navy">With Insurance</th>
                    <th className="px-6 py-4 text-sm font-bold text-navy">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100/30">
                  {brandCosts.map((drug) => (
                    <tr key={drug.name} className="hover:bg-cloud/50">
                      <td className="px-6 py-4 font-medium text-navy text-sm">{drug.name}</td>
                      <td className="px-6 py-4 text-sm text-graphite-500">{drug.manufacturer}</td>
                      <td className="px-6 py-4 text-sm font-bold text-red-500">{drug.monthlyList}</td>
                      <td className="px-6 py-4 text-sm text-graphite-600">{drug.withInsurance}</td>
                      <td className="px-6 py-4 text-xs text-graphite-400 max-w-xs">{drug.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-4 text-xs text-graphite-400 text-center">
            List prices as of early 2026. Actual out-of-pocket costs vary by insurance plan, deductible, and copay structure.
          </p>
        </SectionShell>
      </section>

      {/* Why insurance won't cover it */}
      <section className="bg-amber-50/30 py-16">
        <SectionShell>
          <div className="mx-auto max-w-3xl">
            <div className="flex items-start gap-4 rounded-2xl border border-amber-200 bg-white p-6 shadow-premium">
              <AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-amber-500" />
              <div>
                <h2 className="text-lg font-bold text-navy">The insurance reality for weight management</h2>
                <div className="mt-3 space-y-3 text-sm text-graphite-600 leading-relaxed">
                  <p>
                    Most commercial insurance plans cover GLP-1 medications <strong>only for type 2 diabetes</strong> — not for weight management, even with a BMI above 35. This is driven by cost: covering Wegovy for obesity costs payers approximately $1,200–$1,400 per member per month, compared to $0–$50 for older diabetes medications.
                  </p>
                  <p>
                    The Treat and Reduce Obesity Act (TROA) has been reintroduced in Congress multiple times to require Medicare coverage for obesity medications — but as of 2026, it has not passed. A handful of large employers have voluntarily added GLP-1 weight management coverage, particularly in tech and finance sectors.
                  </p>
                  <p>
                    <strong>What to do:</strong> Check your formulary specifically for "anti-obesity medications" or the specific drug names. Don&apos;t assume coverage based on your plan covering "prescription drugs" generally — weight management drugs are typically excluded in separate formulary language.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Compounded costs */}
      <section className="py-20">
        <SectionShell>
          <SectionHeading
            eyebrow="Compounded Options"
            title="What compounded GLP-1 medication costs — and what to look for"
            description="Compounded semaglutide and tirzepatide from licensed pharmacies cost 50–80% less than brand. Not all providers are equal."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {compoundedCosts.map((option) => (
              <div
                key={option.tier}
                className={`rounded-2xl border p-5 shadow-premium ${
                  option.tier.includes("Premium")
                    ? "border-teal/30 bg-teal-50/20 ring-1 ring-teal/20"
                    : "border-navy-100/60 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-navy text-sm">{option.tier}</h3>
                  {option.tier.includes("Premium") && (
                    <Badge variant="default" className="text-[10px]">Popular</Badge>
                  )}
                </div>
                <div className="text-2xl font-bold text-teal">{option.range}</div>
                <p className="mt-2 text-xs text-graphite-500 leading-relaxed">{option.notes}</p>
              </div>
            ))}
          </div>

          {/* What to look for */}
          <div className="mt-12 rounded-2xl border border-navy-100/60 bg-cloud p-8">
            <h3 className="font-bold text-navy mb-5 flex items-center gap-2">
              <Shield className="h-5 w-5 text-teal" />
              What to look for in a compounded GLP-1 provider
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { check: true, text: "Sources from FDA-registered 503B outsourcing facilities (not 503A compounding pharmacies)" },
                { check: true, text: "Provides Certificate of Analysis (COA) for every batch upon request" },
                { check: true, text: "Licensed physicians — not nurse practitioners or PAs — doing evaluations" },
                { check: true, text: "All-inclusive pricing with no hidden fees for provider visits or shipping" },
                { check: false, text: "Vague pharmacy sourcing with no facility name or registration number" },
                { check: false, text: "Extremely low prices ($50–$100/mo) that suggest unregulated sourcing" },
                { check: false, text: "No medical history review or questionnaire — anyone gets approved" },
                { check: false, text: "Uses 'semaglutide sodium' or 'semaglutide acetate' salt forms (not FDA-approved)" },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${item.check ? "bg-teal-100 text-teal" : "bg-red-100 text-red-500"}`}>
                    {item.check ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <span className="text-xs font-bold">✗</span>
                    )}
                  </div>
                  <span className="text-sm text-graphite-600">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionShell>
      </section>

      {/* FAQ */}
      <section className="bg-gradient-to-b from-sage/10 to-white py-20">
        <SectionShell>
          <SectionHeading
            eyebrow="Cost Questions"
            title="Common questions about GLP-1 pricing"
            description="Straight answers about insurance, compounding, hidden fees, and how pricing actually works."
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

      {/* VitalPath pricing CTA */}
      <section className="py-16">
        <SectionShell>
          <div className="mx-auto max-w-2xl rounded-3xl bg-gradient-to-br from-teal to-atlantic p-8 text-center text-white shadow-premium-lg sm:p-12">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">All-Inclusive Pricing</Badge>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Everything included. No surprises.
            </h2>
            <p className="mt-4 text-base text-white/80">
              VitalPath pricing covers your provider evaluation, treatment plan, medication (if prescribed), free 2-day shipping, and care team access. No separate visit fees. No pharmacy markups.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3 text-sm">
              {[
                { label: "Essential", price: "$279/mo" },
                { label: "Premium", price: "$379/mo" },
                { label: "Complete", price: "$599/mo" },
              ].map((p) => (
                <div key={p.label} className="rounded-xl bg-white/10 px-4 py-3">
                  <div className="font-bold text-white">{p.price}</div>
                  <div className="text-white/70 text-xs">{p.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link href="/qualify">
                <Button size="lg" className="bg-white text-teal hover:bg-white/90 gap-2 px-8">
                  Start Free Assessment <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <p className="mt-3 text-xs text-white/60">No commitment · Cancel anytime · Free 2-day shipping</p>
            </div>
          </div>
        </SectionShell>
      </section>

      <section className="py-8 border-t border-navy-100/40">
        <SectionShell>
          <p className="mx-auto max-w-3xl text-center text-xs text-graphite-300 leading-relaxed">
            <Info className="inline h-3.5 w-3.5 mr-1" />
            {siteConfig.compliance.shortDisclaimer} Pricing is subject to change. Brand-name drug prices from manufacturer websites as of early 2026. Treatment eligibility is determined by a licensed medical provider.
          </p>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
