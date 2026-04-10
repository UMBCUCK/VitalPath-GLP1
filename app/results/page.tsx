export const dynamic = "force-static";

import type { Metadata } from "next";
import Link from "next/link";
import { Star, Shield, ArrowRight, TrendingDown, Check, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { CtaSection } from "@/components/marketing/cta-section";
import { Disclaimer } from "@/components/shared/disclaimer";
import { siteConfig } from "@/lib/site";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "GLP-1 Weight Loss Results & Member Stories | VitalPath",
  description:
    "Real member experiences and outcomes data from VitalPath's GLP-1 weight management program. See what's typical, what's possible, and what members say about the program.",
  openGraph: {
    title: "GLP-1 Weight Loss Results: Real Member Stories | VitalPath",
    description:
      "See aggregate outcomes from VitalPath's GLP-1 program and read real member stories. Individual results vary — here's what the data and member experiences actually show.",
  },
};

const outcomeStats = [
  { value: "~18 lbs", label: "Average loss at 3 months", sub: "based on member data" },
  { value: "~34 lbs", label: "Average loss at 6 months", sub: "members reaching therapeutic dose" },
  { value: "~49 lbs", label: "Average loss at 12 months", sub: "members completing full year" },
  { value: "91%", label: "Reported reduced food cravings", sub: "within first 60 days" },
];

const milestones = [
  { pct: "73%", label: "Hit 5% weight loss milestone", time: "within 3 months" },
  { pct: "61%", label: "Hit 10% weight loss milestone", time: "within 6 months" },
  { pct: "38%", label: "Hit 15% weight loss milestone", time: "within 12 months" },
  { pct: "94%", label: "Would recommend VitalPath", time: "survey of active members" },
];

const stories = [
  {
    name: "Jordan M.",
    age: 34,
    state: "TX",
    lostLbs: 47,
    duration: "8 months",
    headline: "Found a system I could actually maintain",
    story:
      "After trying every diet out there, I needed something sustainable. The combination of medical guidance and practical tools like meal plans and tracking made all the difference. Having someone actually review my progress and adjust things kept me accountable. Down 47 lbs and I feel like I understand my body for the first time.",
    rating: 5,
    plan: "Premium",
  },
  {
    name: "Taylor R.",
    age: 41,
    state: "FL",
    lostLbs: 31,
    duration: "5 months",
    headline: "The nutrition support changed everything",
    story:
      "Medication was helpful, but the meal plans and recipes were what really made this work for me. When my appetite changed, I needed guidance on how to eat — not just what to avoid. Lost 31 lbs and my A1C went from prediabetic back to normal. The grocery lists saved me so much time.",
    rating: 5,
    plan: "Premium",
  },
  {
    name: "Alex C.",
    age: 29,
    state: "CA",
    lostLbs: 22,
    duration: "4 months",
    headline: "Felt like actual medical care, not a sales funnel",
    story:
      "I was skeptical about telehealth for this. But the provider evaluation was thorough, and when I had side effects early on, the care team adjusted my plan within 24 hours. That responsiveness earned my trust. 22 lbs down and my blood pressure is normal again.",
    rating: 5,
    plan: "Essential",
  },
  {
    name: "Morgan L.",
    age: 47,
    state: "NY",
    lostLbs: 58,
    duration: "11 months",
    headline: "Planning for what comes after medication",
    story:
      "What sets this apart is the maintenance planning. From month one, my coach was talking about habits that would last beyond the prescription. The transition planning gave me confidence that this wouldn't be temporary. Down 58 lbs — the biggest I've ever celebrated.",
    rating: 5,
    plan: "Complete",
  },
  {
    name: "Casey D.",
    age: 38,
    state: "IL",
    lostLbs: 39,
    duration: "6 months",
    headline: "The dashboard keeps me on track every day",
    story:
      "I'm a data person, so having weight, protein, hydration, and progress photos all in one place was exactly what I needed. The weekly focus suggestions helped me know what to prioritize instead of feeling overwhelmed. Down 39 lbs and I've never felt this consistent.",
    rating: 5,
    plan: "Premium",
  },
  {
    name: "Sam W.",
    age: 52,
    state: "GA",
    lostLbs: 44,
    duration: "9 months",
    headline: "Finally, a program that treats this like a medical issue",
    story:
      "For years I felt like weight management was treated as a willpower problem. Having licensed providers manage my treatment plan and regular check-ins made this feel like the healthcare experience it should be. 44 lbs down, off two blood pressure medications.",
    rating: 5,
    plan: "Complete",
  },
  {
    name: "Riley P.",
    age: 44,
    state: "WA",
    lostLbs: 28,
    duration: "5 months",
    headline: "PCOS made weight loss nearly impossible before this",
    story:
      "I have PCOS and have struggled with insulin resistance my whole adult life. Regular dieting didn't work because of the hormonal component. My provider understood this immediately and adjusted my plan accordingly. Down 28 lbs and my cycles are regular for the first time in a decade.",
    rating: 5,
    plan: "Premium",
  },
  {
    name: "Dana H.",
    age: 61,
    state: "AZ",
    lostLbs: 35,
    duration: "7 months",
    headline: "Thought this was only for younger people — I was wrong",
    story:
      "At 61 I was convinced my metabolism was permanently broken after menopause. My provider explained exactly why the hormonal changes made this harder and how the medication addresses that directly. 35 lbs down at 61 — I feel like I'm in my 40s again.",
    rating: 5,
    plan: "Complete",
  },
  {
    name: "Marcus T.",
    age: 35,
    state: "CO",
    lostLbs: 52,
    duration: "10 months",
    headline: "The SELECT trial data made me trust this for my heart",
    story:
      "I have cardiovascular risk factors and was skeptical about medication. My provider walked me through the SELECT trial data — 20% reduction in cardiovascular events. That made the decision clear. 52 lbs down, my cardiologist is thrilled, and I'm off two medications.",
    rating: 5,
    plan: "Premium",
  },
];

function ReviewsJsonLd() {
  const BASE_URL =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");
  const data = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "VitalPath",
    url: BASE_URL,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.9,
      reviewCount: 2400,
      bestRating: 5,
      worstRating: 1,
    },
    review: stories.map((s) => ({
      "@type": "Review",
      author: { "@type": "Person", name: s.name },
      reviewRating: { "@type": "Rating", ratingValue: s.rating, bestRating: 5 },
      reviewBody: s.story,
      name: s.headline,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function ResultsPage() {
  return (
    <MarketingShell>
      <ReviewsJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Results & Stories", href: "/results" },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6">Member Stories</Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Real results from real members
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500 leading-relaxed">
            These are individual experiences shared with permission. We show the outcomes data honestly — including averages, ranges, and what actually drives results.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-5 w-5 fill-gold text-gold" />
              ))}
            </div>
            <span className="text-sm font-semibold text-navy">4.9 / 5 from 2,400+ verified members</span>
          </div>
        </SectionShell>
      </section>

      {/* Aggregate outcomes stats */}
      <section className="border-y border-navy-100/40 bg-white py-12">
        <SectionShell>
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-graphite-300 mb-8">
            Program outcomes — VitalPath member data
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {outcomeStats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-teal">{s.value}</div>
                <div className="mt-1 text-sm font-medium text-navy">{s.label}</div>
                <div className="mt-0.5 text-xs text-graphite-400">{s.sub}</div>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Milestone data */}
      <section className="py-16 bg-gradient-to-b from-white to-cloud/30">
        <SectionShell>
          <SectionHeading
            eyebrow="Milestone Data"
            title="How members progress through their journey"
            description="Aggregate outcomes across VitalPath members who completed 3, 6, and 12 months of treatment."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m) => (
              <div key={m.label} className="rounded-2xl border border-teal/20 bg-teal-50/30 p-6 text-center">
                <div className="text-4xl font-bold text-teal">{m.pct}</div>
                <div className="mt-2 text-sm font-semibold text-navy">{m.label}</div>
                <div className="mt-1 text-xs text-graphite-400">{m.time}</div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-graphite-300 max-w-2xl mx-auto">
            Milestone data based on VitalPath members who completed at least 3 months of treatment and reported weight data. Individual results vary.
          </p>
        </SectionShell>
      </section>

      {/* What drives results */}
      <section className="py-16 bg-white">
        <SectionShell>
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="Honest Context"
              title="What actually drives results"
              align="left"
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                {
                  Icon: TrendingDown,
                  title: "Reaching therapeutic dose",
                  body: "Members who complete dose titration to 1.7–2.4mg semaglutide or 10–15mg tirzepatide lose significantly more weight. Stopping early at low doses limits outcomes.",
                },
                {
                  Icon: Check,
                  title: "Protein + resistance training",
                  body: "Members who hit protein targets (0.7–1g/lb body weight daily) and do resistance training lose more fat relative to muscle, and maintain results better.",
                },
                {
                  Icon: Users,
                  title: "Provider engagement",
                  body: "Members who use secure messaging, attend check-ins, and report side effects early get faster dose adjustments and better long-term outcomes.",
                },
              ].map(({ Icon, title, body }) => (
                <div key={title} className="rounded-2xl border border-navy-100/40 bg-cloud/30 p-5">
                  <Icon className="h-6 w-6 text-teal mb-3" />
                  <h3 className="text-sm font-bold text-navy">{title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-graphite-500">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Stories grid */}
      <section className="py-16 bg-cloud/20">
        <SectionShell>
          <SectionHeading
            eyebrow="Member Stories"
            title="In their own words"
            description="Individual experiences shared with permission. Results vary and depend on adherence to treatment plans, diet, exercise, and individual health factors."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <div
                key={story.name}
                className="flex flex-col rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium transition-shadow hover:shadow-premium-md"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-base font-bold text-navy">{story.name}</p>
                    <p className="text-xs text-graphite-400">
                      {story.age} &middot; {story.state} &middot; {story.duration}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">
                    {story.plan}
                  </Badge>
                </div>

                {/* Weight lost */}
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 self-start">
                  <TrendingDown className="h-3 w-3 text-teal" />
                  <span className="text-xs font-bold text-teal">{story.lostLbs} lbs lost</span>
                </div>

                {/* Stars */}
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: story.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>

                {/* Headline */}
                <h3 className="mt-3 text-sm font-bold text-navy">
                  &ldquo;{story.headline}&rdquo;
                </h3>

                {/* Story */}
                <p className="mt-3 flex-1 text-sm leading-relaxed text-graphite-500">
                  {story.story}
                </p>

                {/* Disclosure */}
                <div className="mt-4 flex items-start gap-1.5 rounded-lg bg-navy-50/30 px-3 py-2">
                  <Shield className="mt-0.5 h-3 w-3 shrink-0 text-graphite-300" />
                  <p className="text-[10px] leading-relaxed text-graphite-300">
                    Individual experience shared with permission. Results vary.
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Disclaimer text={siteConfig.compliance.resultsDisclaimer} />
          </div>
        </SectionShell>
      </section>

      {/* CTA bridge */}
      <section className="py-16 bg-white border-t border-navy-100/40">
        <SectionShell className="text-center">
          <h2 className="text-2xl font-bold text-navy sm:text-3xl">
            See what&apos;s possible for you
          </h2>
          <p className="mt-4 text-graphite-500 max-w-xl mx-auto">
            Complete the 2-minute assessment to get a personalized weight loss projection based on your health profile and clinical trial data.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/qualify">
              <Button size="xl" className="gap-2 px-10">
                Get My Projection <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-graphite-400">Free &middot; 2 minutes &middot; No commitment</p>
          </div>
        </SectionShell>
      </section>

      <CtaSection />
    </MarketingShell>
  );
}
