export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo/json-ld";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { Disclaimer } from "@/components/shared/disclaimer";
import { siteConfig } from "@/lib/site";
import { FreeGuideForm } from "./free-guide-form";
import {
  BookOpen,
  Clock,
  Apple,
  MessageCircle,
  DollarSign,
  Activity,
} from "lucide-react";
import { LeafIcon } from "@/components/layout/brand-logo";

export const metadata: Metadata = {
  title: "Free GLP-1 Starter Guide — Download | Nature's Journey",
  description:
    "Download our free GLP-1 Starter Guide: what to expect, how to prepare, what questions to ask your provider, and what results look like in the first 90 days.",
  openGraph: {
    title: "Free GLP-1 Starter Guide — Download | Nature's Journey",
    description:
      "Everything you need before your first appointment. Download free.",
    url: `${siteConfig.url}/free-guide`,
    siteName: siteConfig.name,
    type: "website",
  },
  alternates: {
    canonical: `${siteConfig.url}/free-guide`,
  },
};

const guideContents = [
  {
    icon: Activity,
    title: "What semaglutide & tirzepatide actually do",
    description:
      "Plain-English explanation of GLP-1 mechanism, appetite regulation, and why these medications work when dieting alone hasn't.",
  },
  {
    icon: Clock,
    title: "Week-by-week timeline: months 1–6",
    description:
      "Realistic expectations for each phase — titration, plateau management, and what milestones to look forward to.",
  },
  {
    icon: MessageCircle,
    title: "Side effects & how to manage them",
    description:
      "The most common side effects, when they peak, and provider-approved strategies to reduce nausea and GI discomfort.",
  },
  {
    icon: Apple,
    title: "Protein targets and meal planning basics",
    description:
      "Why protein intake is critical on GLP-1s, how to hit your targets, and simple meal templates that work.",
  },
  {
    icon: BookOpen,
    title: "Questions to ask your provider",
    description:
      "A ready-to-use list of questions for your first consultation — dosing, titration schedule, what labs to request.",
  },
  {
    icon: DollarSign,
    title: "Cost comparison: brand vs compounded",
    description:
      "A clear breakdown of brand-name vs compounded pricing, insurance considerations, and what to watch out for.",
  },
];

const guidePageFaqs = [
  { question: "What is in the free GLP-1 Starter Guide?", answer: "The guide covers: how semaglutide and tirzepatide work in plain English, a week-by-week timeline for months 1-6, side effect management strategies, protein intake and meal planning basics, questions to ask your provider at your first visit, and a cost comparison between brand-name and compounded GLP-1 medications." },
  { question: "Is the GLP-1 Starter Guide really free?", answer: "Yes — the guide is completely free. No credit card required. You'll receive it instantly after submitting your email address." },
  { question: "Who is the guide designed for?", answer: "The guide is designed for adults considering GLP-1 weight management treatment for the first time. It's written in plain language — not clinical jargon — and focuses on practical, actionable information for the first 90 days of treatment." },
  { question: "What are GLP-1 medications?", answer: "GLP-1 (glucagon-like peptide-1) receptor agonists are a class of injectable medications that mimic a natural gut hormone to suppress appetite and reduce food cravings. They include semaglutide (Ozempic, Wegovy) and tirzepatide (Mounjaro, Zepbound). Clinical trials show average weight loss of 15-21% of body weight over 68-72 weeks." },
];

export default function FreeGuidePage() {
  return (
    <MarketingShell>
      <BreadcrumbJsonLd items={[{ name: "Home", href: "/" }, { name: "Free GLP-1 Starter Guide", href: "/free-guide" }]} />
      <FAQPageJsonLd faqs={guidePageFaqs} />
      {/* Hero + Form */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cloud via-sage/20 to-white py-16 lg:py-24">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-teal/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-atlantic/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="mb-6 text-center lg:text-left">
            <span className="inline-flex items-center rounded-full bg-teal/10 px-4 py-1.5 text-sm font-semibold text-teal ring-1 ring-teal/20">
              Free Resource
            </span>
          </div>

          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left column: heading + form */}
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl">
                The Complete GLP-1 Starter Guide —{" "}
                <span className="bg-gradient-to-r from-teal to-atlantic bg-clip-text text-transparent">
                  Free Download
                </span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-graphite-500">
                Everything you need before your first appointment: what to expect, how to
                prepare, what questions to ask your provider, and what results look like
                in the first 90 days.
              </p>

              <div className="mt-10">
                <FreeGuideForm />
              </div>
            </div>

            {/* Right column: guide preview visual */}
            <div className="hidden lg:flex lg:items-center lg:justify-center">
              <div className="relative w-72">
                {/* Book shadow */}
                <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl bg-navy/10 blur-sm" />
                {/* Guide cover card */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal to-atlantic p-8 shadow-premium-xl">
                  {/* Logo mark */}
                  <div className="mb-6 flex items-center gap-2">
                    <LeafIcon className="h-8 w-8" />
                    <span className="text-sm font-semibold text-white/90">
                      {siteConfig.name}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold leading-tight text-white">
                    GLP-1 Starter Guide
                  </h2>
                  <p className="mt-1 text-sm font-medium text-white/70">2026 Edition</p>

                  <div className="mt-6 space-y-2.5">
                    {[
                      "What semaglutide & tirzepatide actually do",
                      "Week-by-week timeline: months 1–6",
                      "Side effects, how to manage them",
                      "Protein targets & meal planning",
                      "Questions to ask your provider",
                      "Cost: brand vs compounded",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/20">
                          <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        </div>
                        <span className="text-xs leading-relaxed text-white/85">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 rounded-xl bg-white/15 px-4 py-3 text-center">
                    <p className="text-xs font-semibold text-white">
                      Free — No Credit Card Required
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's inside section */}
      <section className="py-20 lg:py-28 bg-white">
        <SectionShell>
          <SectionHeading
            eyebrow="What's Inside"
            title="6 chapters. Everything you need to start."
            description="Written by our clinical team, reviewed by licensed providers, and updated for 2026 with the latest research on GLP-1 medications."
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guideContents.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium transition-shadow hover:shadow-premium-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50">
                  <item.icon className="h-5 w-5 text-teal" />
                </div>
                <h3 className="mt-4 text-base font-bold text-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Social proof bar */}
      <section className="border-t border-navy-100/40 bg-cloud py-10 text-center">
        <p className="text-sm text-graphite-500">
          Join{" "}
          <span className="font-bold text-navy">18,000+</span>{" "}
          members who&apos;ve started their journey
        </p>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-navy-100/40 bg-linen/50 py-8">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Disclaimer text={siteConfig.compliance.shortDisclaimer} size="sm" />
        </div>
      </section>
    </MarketingShell>
  );
}
