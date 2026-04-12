import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, Star, Clock, Users, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "GLP-1 Weight Loss from $279/mo — Same Active Ingredient, 79% Less",
  description: "Get GLP-1 weight loss medication prescribed online by licensed providers. Same active ingredient as Ozempic & Wegovy. Free 2-day shipping. 30-day guarantee.",
};

const trustStats = [
  { value: "18,000+", label: "Members served" },
  { value: "4.9/5", label: "Average rating" },
  { value: "79%", label: "Less than retail" },
  { value: "1 biz day", label: "Typical provider review" },
];

const benefits = [
  "Board-certified providers typically evaluate your profile within 1 business day",
  "Medication ships free with 2-day delivery if prescribed",
  "All-inclusive pricing — no hidden consult or pharmacy fees",
  "Structured meal plans, progress tracking, and care team messaging included",
  "Cancel, pause, or change plan anytime — no contracts",
  "30-day money-back guarantee if you're not satisfied",
];

export default function GLP1LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Minimal header — no navigation to reduce distraction */}
      <header className="border-b border-navy-100/40 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal to-atlantic">
              <span className="text-xs font-bold text-white">NJ</span>
            </div>
            <span className="text-sm font-bold text-navy">Nature&apos;s Journey</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-graphite-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>HIPAA Compliant</span>
          </div>
        </div>
      </header>

      {/* Hero — conversion focused, single CTA */}
      <section className="bg-gradient-to-b from-cloud to-white py-12 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5">
            <Clock className="h-3.5 w-3.5 text-teal" />
            <span className="text-xs font-semibold text-teal">Same-day provider evaluations available</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
            GLP-1 Weight Loss Medication
            <br />
            <span className="bg-gradient-to-r from-teal to-atlantic bg-clip-text text-transparent">
              From $279/month
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-graphite-500">
            Same active ingredient as Ozempic &amp; Wegovy — prescribed online by licensed
            providers. Free 2-day shipping. Cancel anytime.
          </p>

          {/* Price anchor */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-navy-50 px-6 py-2">
            <span className="text-sm text-graphite-400 line-through">$1,349/mo retail</span>
            <span className="text-lg font-bold text-navy">$279/mo</span>
            <span className="rounded-full bg-teal px-2.5 py-0.5 text-xs font-bold text-white">Save 79%</span>
          </div>

          <div className="mt-8">
            <Link href="/qualify">
              <Button size="xl" className="gap-2 px-12 h-16 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                See If I Qualify — Free Assessment
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <p className="mt-3 text-xs text-graphite-400">Takes 2 minutes. No commitment. HIPAA protected.</p>
          </div>

          {/* Trust stats */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {trustStats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-navy-100/40 bg-white p-3 text-center shadow-sm">
                <p className="text-lg font-bold text-navy">{stat.value}</p>
                <p className="text-[10px] text-graphite-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="border-y border-navy-100/40 bg-navy-50/30 py-3">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 px-4 text-xs text-graphite-500">
          <span className="flex items-center gap-1"><Star className="h-3 w-3 text-gold fill-gold" /> Rated 4.9/5 by 2,400+ members</span>
          <span className="flex items-center gap-1"><Users className="h-3 w-3 text-teal" /> 142 started this week</span>
          <span className="flex items-center gap-1"><Truck className="h-3 w-3 text-navy" /> Free 2-day shipping</span>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-8">Everything included in your membership</h2>
          <div className="space-y-3">
            {benefits.map((b) => (
              <div key={b} className="flex items-start gap-3 rounded-xl bg-teal-50/30 p-4">
                <Check className="h-5 w-5 text-teal shrink-0 mt-0.5" />
                <span className="text-sm text-navy">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-navy-50/30 py-12">
        <div className="mx-auto max-w-xl px-4 text-center">
          <div className="flex justify-center gap-0.5 mb-3">
            {[1,2,3,4,5].map((i) => <Star key={i} className="h-5 w-5 text-gold fill-gold" />)}
          </div>
          <blockquote className="text-lg text-graphite-600 italic leading-relaxed">
            &ldquo;Down 39 lbs in 5 months. My provider adjusts my plan every month. The meal plans
            made the biggest difference — I actually know what to eat now.&rdquo;
          </blockquote>
          <p className="mt-3 text-sm font-semibold text-navy">— Marcus D., Atlanta, GA</p>
          <p className="text-[10px] text-graphite-400">Verified member. Individual results vary.</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h2 className="text-2xl font-bold text-navy">
            Start losing weight with medical support
          </h2>
          <p className="mt-3 text-sm text-graphite-500">
            Free 2-minute assessment. Provider typically reviews within 1 business day.
            Medication ships free if prescribed.
          </p>
          <div className="mt-6">
            <Link href="/qualify">
              <Button size="xl" className="gap-2 px-12 h-14 text-lg">
                See If I Qualify <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-graphite-400">
            <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> 30-day money-back guarantee</span>
            <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-teal" /> No commitment required</span>
            <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-teal" /> HIPAA protected</span>
          </div>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="border-t border-navy-100/40 py-6 text-center text-[10px] text-graphite-400">
        <p>Nature&apos;s Journey Health &middot; Compounded medications from licensed 503A/503B pharmacies &middot; Not FDA-approved</p>
        <p className="mt-1">Eligibility determined by licensed providers. Individual results vary.</p>
      </footer>
    </div>
  );
}
