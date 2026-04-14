export const dynamic = "force-dynamic";

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
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "GLP-1 Weight Management Member Stories | Nature's Journey",
  description:
    "Read individual member experiences from Nature's Journey's provider-guided GLP-1 weight management program. Individual results vary. Not a guarantee of outcomes.",
  openGraph: {
    title: "Member Stories | Nature's Journey GLP-1 Program",
    description:
      "Individual member experiences from Nature's Journey. Results are not typical and vary based on adherence, health factors, and lifestyle. Shared with permission.",
  },
};

const outcomeStats = [
  { value: "~18 lbs", label: "Average loss at 3 months", sub: "members who reported weight data†" },
  { value: "~34 lbs", label: "Average loss at 6 months", sub: "members at therapeutic dose†" },
  { value: "~49 lbs", label: "Average loss at 12 months", sub: "members completing full year†" },
  { value: "Most", label: "Report reduced appetite", sub: "within first 60 days (member survey)†" },
];

const milestones = [
  { pct: "73%", label: "Hit 5% weight loss milestone", time: "within 3 months†" },
  { pct: "61%", label: "Hit 10% weight loss milestone", time: "within 6 months†" },
  { pct: "38%", label: "Hit 15% weight loss milestone", time: "within 12 months†" },
  { pct: "94%", label: "Would recommend Nature's Journey", time: "post-program member survey†" },
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
      "Medication was helpful, but the meal plans and recipes were what really made this work for me. When my appetite changed, I needed guidance on how to eat — not just what to avoid. Lost 31 lbs and I feel completely different. The grocery lists saved me so much time.",
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
      "I was skeptical about telehealth for this. But the provider evaluation was thorough, and when I had side effects early on, the care team adjusted my plan within 24 hours. That responsiveness earned my trust. 22 lbs down and I feel genuinely great.",
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
      "For years I felt like weight management was treated as a willpower problem. Having licensed providers manage my treatment plan and regular check-ins made this feel like the healthcare experience it should be. 44 lbs down and I feel healthier than I have in years.",
    rating: 5,
    plan: "Complete",
  },
  {
    name: "Riley P.",
    age: 44,
    state: "WA",
    lostLbs: 28,
    duration: "5 months",
    headline: "Finally making progress after years of struggling",
    story:
      "I've struggled with hormonal factors my whole adult life that made weight loss incredibly difficult. Regular dieting didn't address the underlying issues. My provider understood this immediately and built a plan specifically for me. Down 28 lbs and I feel like myself again.",
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
    headline: "My provider helped me make a confident, informed decision",
    story:
      "I had questions about whether this was right for me and my provider took the time to walk through the clinical evidence and what it meant for my situation. That transparency made the decision clear. 52 lbs down over 10 months and I feel genuinely confident about where I'm headed.",
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
      description: "Average rating from post-program member survey",
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
      <FAQPageJsonLd
        faqs={[
          { question: "What kind of weight loss results can I expect with GLP-1 medication?", answer: "Clinical trials show an average of 15–22% total body weight loss over 68–72 weeks. VitalPath members average ~18 lbs at 3 months, ~34 lbs at 6 months, and ~49 lbs at 12 months. Individual results vary based on starting weight, adherence, and lifestyle factors." },
          { question: "How long does it take to see results on semaglutide or tirzepatide?", answer: "Most members notice appetite suppression within the first 1–2 weeks. Visible weight loss typically begins in weeks 4–8 as the dose escalates. Significant results are most commonly seen at the 3-month mark." },
          { question: "Are these results typical or cherry-picked?", answer: "The outcomes data shown reflects aggregate member data, not selected success stories. Individual results vary, and all member stories are shared with consent. Clinical trial averages (STEP and SURMOUNT trials) are disclosed alongside member data for full transparency." },
          { question: "What percentage of VitalPath members lose 10% or more of their body weight?", answer: "Based on member data, the majority of active members who complete 6+ months of treatment achieve 10% or greater total body weight loss. Completion of the full treatment course significantly correlates with better outcomes." },
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
            <span className="text-sm font-semibold text-navy">4.9 / 5 from 2,400+ members</span>
            <span className="text-xs text-graphite-400 ml-1">(post-program survey)</span>
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
          <p className="mt-6 text-center text-[10px] text-graphite-300 max-w-3xl mx-auto">
            † Outcomes data based on Nature&apos;s Journey member records for members who actively reported weight or survey data within each timeframe. Not all members report data. Members who discontinued treatment early are not included in completion-based figures. Individual results vary based on adherence, starting weight, dose achieved, diet, exercise, and health factors. This data has not been independently verified.
          </p>
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
            † Milestone data based on Nature&apos;s Journey members who completed at least 3 months of treatment and reported weight data. Members who did not report data or discontinued early are not included. Individual results vary significantly.
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
                  <Shield className="mt-0.5 h-3 w-3 shrink-0 text-graphite-400" />
                  <p className="text-xs leading-relaxed text-graphite-400">
                    Individual experience. <strong>Results not typical.</strong> Shared with permission. Your results will vary.
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

      <section className="py-14 bg-navy-50/40 border-t border-navy-100/40">
        <SectionShell>
          <h2 className="text-xl font-bold text-navy mb-6 text-center">Further reading</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/blog/semaglutide-timeline-first-3-months", tag: "Timeline", title: "Semaglutide Weight Loss Timeline: What to Expect" },
              { href: "/blog/tirzepatide-vs-semaglutide-2026", tag: "Comparison", title: "Tirzepatide vs. Semaglutide: Which Works Better?" },
              { href: "/blog/is-semaglutide-safe-long-term", tag: "Safety", title: "Is GLP-1 Medication Safe for Long-Term Use?" },
              { href: "/blog/glp1-mental-health-food-noise", tag: "Lifestyle", title: "How GLP-1 Reduces Food Noise & Cravings" },
              { href: "/blog/what-to-eat-on-semaglutide", tag: "Nutrition", title: "What to Eat on GLP-1 for Fastest Results" },
              { href: "/blog/semaglutide-hair-loss", tag: "Side Effects", title: "GLP-1 and Hair Loss: Causes and Prevention" },
              { href: "/glp1-cost", tag: "Cost", title: "How Much Does GLP-1 Treatment Cost?" },
              { href: "/qualify", tag: "Get Started", title: "Check Your Eligibility & See Your Projection" },
            ].map(({ href, tag, title }) => (
              <Link key={href} href={href} className="group flex flex-col gap-2 rounded-xl border border-navy-100/60 bg-white p-4 shadow-sm hover:shadow-md hover:border-teal/40 transition-all">
                <span className="text-xs font-semibold uppercase tracking-wide text-teal">{tag}</span>
                <span className="text-sm font-medium text-navy leading-snug group-hover:text-teal transition-colors">{title}</span>
                <ArrowRight className="h-3.5 w-3.5 text-graphite-300 group-hover:text-teal mt-auto transition-colors" />
              </Link>
            ))}
          </div>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
