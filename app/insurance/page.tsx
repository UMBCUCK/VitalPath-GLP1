import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, AlertCircle, FileText, DollarSign, Clock, Shield, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { MarketingShell } from "@/components/layout/marketing-shell";

export const metadata: Metadata = {
  title: "GLP-1 Insurance Coverage Guide 2026 | Reimbursement Steps | Nature's Journey",
  description: "Complete guide to GLP-1 insurance coverage in 2026. Learn which plans cover Wegovy, Ozempic, and compounded semaglutide. Step-by-step reimbursement instructions.",
};

const coverageStats = [
  { stat: "~25%", label: "of employer plans cover GLP-1 for weight loss", icon: Shield },
  { stat: "42%", label: "of initial prior authorization claims are denied", icon: AlertCircle },
  { stat: "6-12 weeks", label: "typical prior authorization timeline", icon: Clock },
  { stat: "$150-300", label: "average monthly copay even with coverage", icon: DollarSign },
];

const reimbursementSteps = [
  { step: 1, title: "Check your plan's formulary", description: "Call the number on your insurance card or log into your portal. Ask: 'Is semaglutide (Wegovy) or tirzepatide (Zepbound) covered for weight management under my plan?' Note the tier and any prior authorization requirements." },
  { step: 2, title: "Request a Letter of Medical Necessity", description: "Your Nature's Journey provider can write a Letter of Medical Necessity documenting your BMI, comorbidities, and treatment history. This is required for most prior authorizations." },
  { step: 3, title: "Submit prior authorization", description: "Your provider submits the prior auth to your insurer. This typically takes 2-4 weeks for initial review. If denied, an appeal can be filed with additional clinical documentation." },
  { step: 4, title: "Appeal if denied (42% are initially denied)", description: "Most denials can be overturned on appeal. Your provider can submit peer-to-peer review requests and additional clinical evidence. The appeal process typically takes 2-4 additional weeks." },
  { step: 5, title: "Submit for HSA/FSA reimbursement", description: "Even without insurance coverage, GLP-1 weight loss medication is typically HSA/FSA eligible. Submit your Nature's Journey receipts to your HSA/FSA administrator for tax-advantaged reimbursement." },
];

const hsaFsaInfo = [
  "GLP-1 weight loss medication prescribed by a licensed provider is typically HSA/FSA eligible",
  "Nature's Journey provides itemized receipts suitable for HSA/FSA submission",
  "Your monthly membership fee ($179-$599) can be paid directly from your HSA/FSA card",
  "Pre-tax savings of 25-35% depending on your tax bracket",
  "No prior authorization or insurance approval needed for HSA/FSA",
];

export default function InsurancePage() {
  return (
    <MarketingShell>
      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/20 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6"><FileText className="mr-1 h-3 w-3" /> Insurance Guide</Badge>
          <h1 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
            GLP-1 Insurance Coverage &amp; Reimbursement Guide
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">
            Everything you need to know about getting GLP-1 weight loss covered by insurance,
            HSA/FSA reimbursement, and why most members start with compounded medication.
          </p>
        </SectionShell>
      </section>

      {/* Coverage reality */}
      <section className="py-16">
        <SectionShell>
          <h2 className="text-2xl font-bold text-navy text-center mb-2">The Insurance Reality in 2026</h2>
          <p className="text-center text-sm text-graphite-500 mb-10">Most people pay out of pocket — here&apos;s why</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {coverageStats.map((s) => (
              <Card key={s.label}>
                <CardContent className="p-5 text-center">
                  <s.icon className="mx-auto h-6 w-6 text-navy mb-2" />
                  <p className="text-2xl font-bold text-navy">{s.stat}</p>
                  <p className="mt-1 text-xs text-graphite-500">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Nature's Journey alternative */}
      <section className="bg-gradient-to-r from-teal-50 to-sage/30 py-12">
        <SectionShell className="max-w-3xl">
          <div className="rounded-2xl border-2 border-teal bg-white p-6 sm:p-8 text-center">
            <h3 className="text-xl font-bold text-navy">Why Members Choose Compounded Medication</h3>
            <p className="mt-3 text-sm text-graphite-500 max-w-lg mx-auto">
              While you pursue insurance coverage, start treatment immediately with compounded
              semaglutide at a fraction of the brand-name cost.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 text-left max-w-md mx-auto">
              <div>
                <p className="text-xs text-graphite-400 mb-1">Brand-name (with insurance)</p>
                <p className="text-lg font-bold text-graphite-500">$150-300/mo copay</p>
                <p className="text-[10px] text-graphite-400">+ 6-12 week approval wait</p>
              </div>
              <div>
                <p className="text-xs text-teal mb-1">Nature&apos;s Journey</p>
                <p className="text-lg font-bold text-teal">$179/mo all-in</p>
                <p className="text-[10px] text-teal-600">Start within 24-48 hours</p>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/qualify">
                <Button size="lg" className="gap-2">Start Treatment Now — Skip the Wait <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Step-by-step reimbursement */}
      <section className="py-16">
        <SectionShell className="max-w-3xl">
          <h2 className="text-2xl font-bold text-navy text-center mb-2">Step-by-Step Reimbursement Guide</h2>
          <p className="text-center text-sm text-graphite-500 mb-10">If you want to pursue insurance coverage, follow these steps</p>
          <div className="space-y-4">
            {reimbursementSteps.map((s) => (
              <Card key={s.step}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-sm font-bold text-white">
                      {s.step}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-navy">{s.title}</h3>
                      <p className="mt-1 text-xs text-graphite-500 leading-relaxed">{s.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* HSA/FSA section */}
      <section className="bg-emerald-50/30 py-16">
        <SectionShell className="max-w-3xl">
          <h2 className="text-2xl font-bold text-navy text-center mb-2">HSA/FSA Reimbursement</h2>
          <p className="text-center text-sm text-graphite-500 mb-8">The fastest path to tax-advantaged savings — no approval needed</p>
          <Card className="border-2 border-emerald-200">
            <CardContent className="p-6">
              <div className="space-y-3">
                {hsaFsaInfo.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-graphite-600">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-center">
                <p className="text-sm text-navy">
                  <strong>Example savings:</strong> $179/mo paid from HSA/FSA saves you
                  <strong className="text-emerald-600"> $83-$98/mo in taxes</strong> (25-35% bracket)
                </p>
              </div>
            </CardContent>
          </Card>
        </SectionShell>
      </section>

      {/* CTA */}
      <section className="py-16">
        <SectionShell className="text-center max-w-xl">
          <h2 className="text-2xl font-bold text-navy">Don&apos;t wait for insurance. Start today.</h2>
          <p className="mt-3 text-sm text-graphite-500">
            Most members save more with compounded medication than they would with insurance copays.
            You can always switch to brand-name if coverage is approved later.
          </p>
          <div className="mt-6">
            <Link href="/qualify"><Button size="xl" className="gap-2 h-14 text-lg">See If I Qualify <ArrowRight className="h-5 w-5" /></Button></Link>
          </div>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
