export const dynamic = "force-static";

import type { Metadata } from "next";
import { Star, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { Disclaimer } from "@/components/shared/disclaimer";
import { siteConfig } from "@/lib/site";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { WebPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Results & Stories",
  description:
    "Read real member experiences with VitalPath's weight management program. Individual results vary.",
};

const stories = [
  {
    name: "Jordan M.",
    age: 34,
    state: "TX",
    headline: "Found a system I could actually maintain",
    story: "After trying every diet out there, I needed something sustainable. The combination of medical guidance and practical tools like meal plans and tracking made all the difference. Having someone actually review my progress and adjust things kept me accountable.",
    duration: "6 months",
    rating: 5,
    plan: "Premium",
  },
  {
    name: "Taylor R.",
    age: 41,
    state: "FL",
    headline: "The nutrition support changed everything",
    story: "Medication was helpful, but the meal plans and recipes were what really made this work for me. When my appetite changed, I needed guidance on how to eat, not just what to avoid. The grocery lists saved me so much time.",
    duration: "4 months",
    rating: 5,
    plan: "Premium",
  },
  {
    name: "Alex C.",
    age: 29,
    state: "CA",
    headline: "Felt like actual medical care, not a sales funnel",
    story: "I was skeptical about telehealth for this. But the provider evaluation was thorough, and when I had side effects early on, the care team adjusted my plan within 24 hours. That responsiveness earned my trust.",
    duration: "3 months",
    rating: 5,
    plan: "Essential",
  },
  {
    name: "Morgan L.",
    age: 47,
    state: "NY",
    headline: "Planning for what comes after medication",
    story: "What sets this apart is the maintenance planning. From month one, my coach was talking about habits that would last beyond the prescription. The transition planning gave me confidence that this wouldn't be temporary.",
    duration: "8 months",
    rating: 5,
    plan: "Complete",
  },
  {
    name: "Casey D.",
    age: 38,
    state: "IL",
    headline: "The dashboard keeps me on track every day",
    story: "I'm a data person, so having weight, protein, hydration, and progress photos all in one place was exactly what I needed. The weekly focus suggestions helped me know what to prioritize instead of feeling overwhelmed.",
    duration: "5 months",
    rating: 5,
    plan: "Premium",
  },
  {
    name: "Sam W.",
    age: 52,
    state: "GA",
    headline: "Finally, a program that treats this like a medical issue",
    story: "For years I felt like weight management was treated as a willpower problem. Having licensed providers manage my treatment plan and regular check-ins made this feel like the healthcare experience it should be.",
    duration: "7 months",
    rating: 5,
    plan: "Complete",
  },
];

function ReviewsJsonLd() {
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");
  const data = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "VitalPath",
    url: BASE_URL,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.9,
      reviewCount: stories.length,
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
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6">
            Member Stories
          </Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Real experiences from real members
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">
            These are individual experiences shared with permission. Results vary based on
            adherence to treatment plans, diet, exercise, and individual health factors.
          </p>
        </SectionShell>
      </section>

      <section className="py-16">
        <SectionShell>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                    Individual experience shared with permission. Results vary and depend on
                    adherence to treatment plans, diet, exercise, and individual factors.
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

      <CtaSection />
    </MarketingShell>
  );
}
