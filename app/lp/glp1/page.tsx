import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, Star, Clock, Users, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LpFaq } from "@/components/lp/lp-faq";
import { LpConversionWidgets } from "@/components/lp/lp-conversion-widgets";
import { MedicalWebPageJsonLd, FAQPageJsonLd, ProductJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Provider-Guided GLP-1 Weight Management from $279/mo | Nature's Journey",
  description: "Compounded GLP-1 medication prescribed online by licensed providers. Provider evaluation included. Free 2-day shipping. 30-day satisfaction guarantee. Individual results vary.",
  openGraph: {
    title: "Provider-Guided GLP-1 Weight Management from $279/mo",
    description: "Compounded GLP-1 medication prescribed online by licensed providers. 79% less than retail. Free 2-day shipping.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/glp1",
  },
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
          <div className="flex items-center gap-4 text-xs text-graphite-400">
            <a href="tel:18885092745" className="flex items-center gap-1.5 hover:text-navy transition-colors">
              <span className="font-medium">(888) 509-2745</span>
            </a>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>HIPAA Compliant</span>
            </div>
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

      {/* Testimonials */}
      <section className="bg-navy-50/30 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-8">What Our Members Say</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { name: "Marcus D.", age: 44, location: "Atlanta, GA", lbs: 39, months: 5, quote: "My provider adjusts my plan every month. The meal plans made the biggest difference — I actually know what to eat now." },
              { name: "Jennifer L.", age: 38, location: "Austin, TX", lbs: 28, months: 4, quote: "I was skeptical about telehealth, but my provider is more attentive than any doctor I've seen in person." },
              { name: "Robert K.", age: 52, location: "Denver, CO", lbs: 47, months: 6, quote: "The all-inclusive pricing sealed it for me. No hidden fees, no insurance battles. Just results." },
            ].map((t) => (
              <div key={t.name} className="rounded-xl border border-navy-100/40 bg-white p-5 shadow-sm">
                <div className="flex gap-0.5 mb-2">
                  {[1,2,3,4,5].map((i) => <Star key={i} className="h-3.5 w-3.5 text-gold fill-gold" />)}
                </div>
                <p className="text-xs text-graphite-600 italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-navy">{t.name}, {t.age}</p>
                    <p className="text-[10px] text-graphite-400">{t.location}</p>
                  </div>
                  <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal">-{t.lbs} lbs</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-[10px] text-graphite-400">Verified members. Individual results vary.</p>
        </div>
      </section>

      {/* FAQ */}
      <LpFaq
        faqs={[
          { question: "How does GLP-1 medication work?", answer: "GLP-1 receptor agonists mimic a natural hormone that regulates appetite and blood sugar. They help you feel satisfied with less food, reduce cravings, and support sustained weight management when combined with lifestyle changes." },
          { question: "What does the $279/mo include?", answer: "Everything. Provider evaluation and ongoing monitoring, GLP-1 medication (if prescribed), personalized meal plans, progress tracking, care team messaging, and free 2-day shipping. No hidden fees." },
          { question: "How quickly will I see results?", answer: "Most members notice reduced appetite within 1-2 weeks. Visible weight loss typically begins within 4-6 weeks. Average weight loss in clinical studies is 15-20% of body weight over the treatment period." },
          { question: "Is it safe?", answer: "GLP-1 medications have been extensively studied. Common side effects are mild and temporary: nausea, decreased appetite, and digestive changes during the initial titration period. Your provider monitors your progress throughout." },
          { question: "What if I don't qualify?", answer: "Not everyone is a candidate for GLP-1 medication. If our providers determine it's not right for you, you won't be charged. The initial assessment is completely free." },
        ]}
      />

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

      <MedicalWebPageJsonLd name="GLP-1 Weight Management Program" description="Provider-guided GLP-1 weight loss medication prescribed online. All-inclusive from $279/mo." url="/lp/glp1" />
      <FAQPageJsonLd faqs={[
        { question: "How does GLP-1 medication work?", answer: "GLP-1 receptor agonists mimic a natural hormone that regulates appetite and blood sugar." },
        { question: "What does the $279/mo include?", answer: "Provider evaluation, medication if prescribed, meal plans, progress tracking, and free shipping." },
        { question: "How quickly will I see results?", answer: "Most members notice reduced appetite within 1-2 weeks. Visible weight loss typically begins within 4-6 weeks." },
        { question: "Is it safe?", answer: "GLP-1 medications have been extensively studied. Common side effects are mild and temporary." },
        { question: "What if I don't qualify?", answer: "If our providers determine it's not right for you, you won't be charged. The assessment is free." },
      ]} />
      <ProductJsonLd name="GLP-1 Weight Management Program" description="All-inclusive GLP-1 weight loss program with provider, medication, and support" price={279} url="/lp/glp1" />
      <LpConversionWidgets />
    </div>
  );
}
