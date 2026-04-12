import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Building2, Users, TrendingDown, Shield, BarChart3, Heart, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { MarketingShell } from "@/components/layout/marketing-shell";

export const metadata: Metadata = {
  title: "Corporate Wellness GLP-1 Program | Employee Weight Management | Nature's Journey",
  description: "Offer GLP-1 weight management as an employee benefit. Reduce healthcare costs, improve productivity. HIPAA compliant. Volume pricing. Dedicated account manager.",
};

const benefits = [
  { icon: DollarSign, title: "Reduce Healthcare Costs", description: "Obesity-related conditions cost employers $3,600+ per employee per year. GLP-1 programs show 30-40% reduction in weight-related claims within 12 months." },
  { icon: TrendingDown, title: "Measurable Outcomes", description: "Real-time employer dashboard showing aggregate program participation, average weight loss, and engagement metrics — all HIPAA compliant with no individual data exposed." },
  { icon: Users, title: "Employee Engagement", description: "Members report 94% satisfaction. Meal plans, coaching, and progress tracking keep participation high beyond medication alone." },
  { icon: Shield, title: "Full Compliance", description: "HIPAA-compliant platform, SOC 2 Type II ready, BAA available. Individual health data is never shared with employers." },
];

const pricingTiers = [
  { size: "10-49", discount: "10%", label: "Small Business" },
  { size: "50-199", discount: "15%", label: "Mid-Market" },
  { size: "200-999", discount: "20%", label: "Enterprise" },
  { size: "1,000+", discount: "Custom", label: "Strategic" },
];

const roi = [
  { metric: "$3,600", label: "Annual per-employee obesity cost savings" },
  { metric: "3.4x", label: "Average ROI within first year" },
  { metric: "28%", label: "Reduction in sick days" },
  { metric: "94%", label: "Employee satisfaction rate" },
];

export default function EnterprisePage() {
  return (
    <MarketingShell>
      <section className="bg-gradient-to-b from-navy to-atlantic py-20 text-white">
        <SectionShell className="text-center">
          <Badge className="mb-6 bg-white/10 text-white border-white/20">
            <Building2 className="mr-1 h-3 w-3" /> Corporate Wellness
          </Badge>
          <h1 className="mx-auto max-w-4xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            GLP-1 Weight Management<br />
            <span className="text-teal-300">As an Employee Benefit</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-navy-300">
            Reduce healthcare costs, improve productivity, and offer your team access to
            the most effective weight management treatment available — at volume pricing.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="mailto:enterprise@naturesjourneyhealth.com">
              <Button size="xl" variant="gold" className="gap-2 h-14 text-lg">Request a Demo <ArrowRight className="h-5 w-5" /></Button>
            </Link>
            <Link href="/pricing">
              <Button size="xl" variant="outline" className="gap-2 h-14 text-lg border-white/20 text-white hover:bg-white/10">View Pricing</Button>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {roi.map((r) => (
              <div key={r.label} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{r.metric}</p>
                <p className="text-[10px] text-navy-300">{r.label}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      <section className="py-16">
        <SectionShell>
          <h2 className="text-2xl font-bold text-navy text-center mb-10">Why Employers Choose Nature&apos;s Journey</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {benefits.map((b) => (
              <Card key={b.title}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-50">
                      <b.icon className="h-6 w-6 text-navy" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-navy">{b.title}</h3>
                      <p className="mt-2 text-sm text-graphite-500 leading-relaxed">{b.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionShell>
      </section>

      <section className="bg-navy-50/30 py-16">
        <SectionShell>
          <h2 className="text-2xl font-bold text-navy text-center mb-2">Volume Pricing</h2>
          <p className="text-center text-sm text-graphite-500 mb-10">Discount scales with team size. All plans include medication, provider access, and support.</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pricingTiers.map((t) => (
              <Card key={t.size} className={t.label === "Enterprise" ? "border-2 border-teal ring-4 ring-teal/10" : ""}>
                <CardContent className="p-5 text-center">
                  {t.label === "Enterprise" && <Badge variant="gold" className="mb-2 text-[10px]">Most Popular</Badge>}
                  <p className="text-xs text-graphite-400">{t.label}</p>
                  <p className="mt-1 text-lg font-bold text-navy">{t.size} employees</p>
                  <p className="mt-2 text-2xl font-bold text-teal">{t.discount}<span className="text-xs font-normal text-graphite-400"> off</span></p>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionShell>
      </section>

      <section className="py-16">
        <SectionShell className="max-w-3xl">
          <h2 className="text-2xl font-bold text-navy text-center mb-8">What&apos;s Included for Every Employee</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Licensed provider evaluation within 24 hours",
              "GLP-1 medication if prescribed (compounded)",
              "Free 2-day shipping to employee's address",
              "Structured weekly meal plans and recipes",
              "Progress tracking with weight and nutrition logs",
              "Coaching check-ins (frequency depends on plan)",
              "Care team messaging (4-hour avg response)",
              "HIPAA-compliant — employer never sees health data",
            ].map((f) => (
              <div key={f} className="flex items-start gap-2 rounded-xl bg-teal-50/30 p-3">
                <Check className="h-4 w-4 text-teal shrink-0 mt-0.5" />
                <span className="text-sm text-navy">{f}</span>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      <section className="bg-gradient-to-r from-navy to-atlantic py-16 text-white text-center">
        <SectionShell className="max-w-xl">
          <Heart className="mx-auto h-8 w-8 text-teal-300 mb-4" />
          <h2 className="text-2xl font-bold">Invest in your team&apos;s health</h2>
          <p className="mt-3 text-sm text-navy-300">
            Schedule a 15-minute demo to see the employer dashboard and discuss volume pricing.
          </p>
          <div className="mt-6">
            <Link href="mailto:enterprise@naturesjourneyhealth.com">
              <Button size="xl" variant="gold" className="gap-2 h-14 text-lg">Request Enterprise Demo <ArrowRight className="h-5 w-5" /></Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-navy-400">Or email enterprise@naturesjourneyhealth.com directly</p>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
