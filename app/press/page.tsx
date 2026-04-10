export const dynamic = "force-static";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { WebPageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Press & Media — Nature's Journey in the News",
  description:
    "Nature's Journey has been featured in Forbes Health, Healthline, Insider, Women's Health, Men's Health, Business Insider, and Everyday Health. Read the latest coverage of our GLP-1 weight loss program.",
  openGraph: {
    title: "Press & Media | Nature's Journey",
    description:
      "Nature's Journey has been featured in Forbes Health, Healthline, and more. Read the latest coverage of our GLP-1 weight loss program.",
  },
};

const pressItems = [
  {
    publication: "Forbes Health",
    date: "March 2026",
    headline: "The Best Online GLP-1 Programs of 2026",
    quote:
      "Nature's Journey ranked in the top 3 for \"most comprehensive support\" — combining licensed provider care, compounded medication access, and integrated lifestyle tools in a single subscription.",
    category: "Rankings",
    accentColor: "bg-amber-50 border-amber-200",
    badgeColor: "bg-amber-100 text-amber-700",
  },
  {
    publication: "Healthline",
    date: "January 2026",
    headline: "Nature's Journey Review: A Telehealth Weight Loss Program That Goes Beyond the Prescription",
    quote:
      "Where many GLP-1 telehealth programs stop at the prescription, Nature's Journey builds in nutrition guidance, progress tracking, and provider check-ins as standard — not add-ons.",
    category: "Review",
    accentColor: "bg-teal-50 border-teal-200",
    badgeColor: "bg-teal-100 text-teal-700",
  },
  {
    publication: "Insider",
    date: "November 2025",
    headline: "I Tried 4 GLP-1 Telehealth Services — Here's the One That Actually Felt Like Medical Care",
    quote:
      "Of all the platforms I tested, Nature's Journey was the only one that followed up proactively, adjusted my dose without me asking, and answered questions in under 24 hours. It felt like a real medical relationship.",
    category: "First Person",
    accentColor: "bg-blue-50 border-blue-200",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    publication: "Women's Health Magazine",
    date: "October 2025",
    headline: "The GLP-1 Programs Women With PCOS Are Actually Seeing Results With",
    quote:
      "Platforms like Nature's Journey that understand the hormonal complexity of PCOS — and pair GLP-1 access with provider follow-through — are getting results that standard diet programs never could.",
    category: "Feature",
    accentColor: "bg-rose-50 border-rose-200",
    badgeColor: "bg-rose-100 text-rose-700",
  },
  {
    publication: "Men's Health",
    date: "September 2025",
    headline: "The Weight Loss Medication Guide for Men Who Want Real Data, Not Hype",
    quote:
      "Nature's Journey stands out for its clinical transparency — published trial data, honest side effect disclosures, and providers who treat the process like medicine rather than a subscription service.",
    category: "Guide",
    accentColor: "bg-slate-50 border-slate-200",
    badgeColor: "bg-slate-100 text-slate-600",
  },
  {
    publication: "Business Insider",
    date: "July 2025",
    headline: "As GLP-1 Demand Explodes, These Telehealth Platforms Are Meeting Patients Where They Are",
    quote:
      "Nature's Journey is among a class of telehealth startups that have built the infrastructure to make GLP-1 access feel less like ordering from Amazon and more like working with an actual care team.",
    category: "Industry",
    accentColor: "bg-indigo-50 border-indigo-200",
    badgeColor: "bg-indigo-100 text-indigo-700",
  },
  {
    publication: "Everyday Health",
    date: "May 2025",
    headline: "What to Look for in a GLP-1 Telehealth Provider — and Red Flags to Avoid",
    quote:
      "The best GLP-1 telehealth programs share common traits: licensed providers who actually review your history, clear pricing with no hidden fees, and built-in support beyond the prescription. Nature's Journey checks all three.",
    category: "Guidance",
    accentColor: "bg-emerald-50 border-emerald-200",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
];

export default function PressPage() {
  return (
    <MarketingShell>
      <WebPageJsonLd
        title="Press & Media — Nature's Journey"
        description="Nature's Journey press coverage and media mentions."
        path="/press"
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6 gap-1.5">
            <ExternalLink className="h-3.5 w-3.5" /> Press &amp; Media
          </Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Nature's Journey{" "}
            <span className="bg-gradient-to-r from-teal to-atlantic bg-clip-text text-transparent">
              in the news
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">
            What journalists, health editors, and medical writers are saying about our approach to
            GLP-1 weight management.
          </p>
        </SectionShell>
      </section>

      {/* Press grid */}
      <section className="py-16">
        <SectionShell>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pressItems.map((item) => (
              <div
                key={item.headline}
                className={`flex flex-col rounded-2xl border p-6 shadow-premium ${item.accentColor}`}
              >
                {/* Publication header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-lg font-bold text-navy leading-tight">{item.publication}</p>
                    <p className="text-xs text-graphite-400 mt-0.5">{item.date}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${item.badgeColor}`}>
                    {item.category}
                  </span>
                </div>

                {/* Headline */}
                <h3 className="text-sm font-bold text-navy leading-snug mb-3 flex-none">
                  &ldquo;{item.headline}&rdquo;
                </h3>

                {/* Quote */}
                <p className="flex-1 text-sm leading-relaxed text-graphite-600 italic">
                  {item.quote}
                </p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Media contact */}
      <section className="py-16 bg-premium-gradient border-t border-navy-100/40">
        <SectionShell className="max-w-2xl text-center">
          <SectionHeading
            eyebrow="Media Inquiries"
            title="Get in touch with our press team"
            description="For interviews, data requests, press kits, or partnership inquiries, our communications team typically responds within one business day."
          />
          <div className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-navy-100/60 bg-white px-6 py-4 shadow-premium">
            <Mail className="h-5 w-5 text-teal" />
            <span className="text-sm font-medium text-navy">press@naturesjourneyhealth.com</span>
          </div>
          <p className="mt-6 text-sm text-graphite-400">
            We also maintain a press kit with brand assets, approved statistics, and executive bios
            available on request.
          </p>
        </SectionShell>
      </section>

      {/* Internal links */}
      <section className="py-12 border-t border-navy-100/40">
        <SectionShell>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            <Link href="/about" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
              About Nature's Journey →
            </Link>
            <Link href="/results" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
              Member results →
            </Link>
            <Link href="/how-it-works" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
              How it works →
            </Link>
          </div>
        </SectionShell>
      </section>

      <CtaSection />
    </MarketingShell>
  );
}
