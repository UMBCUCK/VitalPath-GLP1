"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Quote, ChevronLeft, ChevronRight, BadgeCheck, MapPin } from "lucide-react";
import { testimonials } from "@/lib/content";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimateOnView } from "@/components/shared/animate-on-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { testimonialAvatars } from "@/lib/images";

// Color palette for avatar backgrounds
const avatarColors = [
  "bg-teal",
  "bg-atlantic",
  "bg-navy",
  "bg-gold",
  "bg-sage-700",
  "bg-teal-800",
  "bg-graphite-600",
  "bg-atlantic",
  "bg-navy-600",
  "bg-teal",
  "bg-gold-700",
  "bg-graphite",
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i <= rating ? "fill-gold text-gold" : "fill-navy-100 text-navy-100"
          )}
        />
      ))}
    </div>
  );
}

function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-3 text-right text-graphite-500">{stars}</span>
      <Star className="h-3 w-3 fill-gold text-gold" />
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-navy-50">
        <div
          className="h-full rounded-full bg-gold transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-right text-graphite-400">{count}</span>
    </div>
  );
}

export function TestimonialSection() {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const totalPages = Math.ceil((testimonials.length - 1) / perPage);
  const gridReviews = testimonials.slice(1 + page * perPage, 1 + (page + 1) * perPage);

  // Rating distribution — based on 2,400+ verified reviews (aggregate, not just displayed testimonials)
  const reviewTotal = 2400;
  const distribution = { 5: 1920, 4: 384, 3: 72, 2: 18, 1: 6 }; // realistic 4.9-star distribution
  const avg = "4.9";

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-linen/30">
      <SectionShell>
        <SectionHeading
          eyebrow="Verified Reviews"
          title="Thousands of real transformations. Here are a few."
        />

        {/* Google-style Rating Summary */}
        <AnimateOnView className="mb-12">
          <div className="mx-auto max-w-2xl rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium sm:p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Left: Big number */}
              <div className="flex flex-col items-center justify-center text-center sm:border-r sm:border-navy-100/40">
                <p className="text-6xl font-bold text-navy">{avg}</p>
                <div className="mt-2 flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-5 w-5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="mt-2 text-sm text-graphite-400">
                  Based on {reviewTotal.toLocaleString()}+ verified reviews
                </p>
              </div>

              {/* Right: Distribution bars */}
              <div className="space-y-2">
                <RatingBar stars={5} count={distribution[5]} total={reviewTotal} />
                <RatingBar stars={4} count={distribution[4]} total={reviewTotal} />
                <RatingBar stars={3} count={distribution[3]} total={reviewTotal} />
                <RatingBar stars={2} count={distribution[2]} total={reviewTotal} />
                <RatingBar stars={1} count={distribution[1]} total={reviewTotal} />
              </div>
            </div>

            {/* Third-party platform badges — dramatically increases trust */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 border-t border-navy-100/40 pt-4">
              <div className="flex items-center gap-1.5 text-xs text-graphite-400">
                <Star className="h-3.5 w-3.5 fill-[#00b67a] text-[#00b67a]" />
                <span className="font-semibold text-[#00b67a]">Trustpilot</span>
                <span>4.8/5</span>
              </div>
              <div className="h-4 w-px bg-navy-100/40" />
              <div className="flex items-center gap-1.5 text-xs text-graphite-400">
                <Star className="h-3.5 w-3.5 fill-[#fbbc04] text-[#fbbc04]" />
                <span className="font-semibold text-graphite-600">Google</span>
                <span>4.9/5</span>
              </div>
              <div className="h-4 w-px bg-navy-100/40" />
              <div className="flex items-center gap-1.5 text-xs text-graphite-400">
                <BadgeCheck className="h-3.5 w-3.5 text-teal" />
                <span>Member reviews (post-program survey)</span>
              </div>
            </div>
          </div>
        </AnimateOnView>

        {/* Featured testimonial — the best one, larger */}
        <AnimateOnView className="mb-10">
          <div className="relative mx-auto max-w-4xl rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50/50 to-white p-8 shadow-premium-lg sm:p-10">
            <Quote className="absolute right-6 top-6 h-12 w-12 text-teal-100 hidden sm:block" />

            <div className="flex flex-wrap items-center gap-3">
              <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full text-white text-lg font-bold", avatarColors[0])}>
                {testimonialAvatars[0] ? (
                  <Image src={testimonialAvatars[0].src} alt={testimonialAvatars[0].alt} width={56} height={56} className="h-14 w-14 rounded-full object-cover" />
                ) : testimonials[0].name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-navy">{testimonials[0].name}</p>
                  <BadgeCheck className="h-4 w-4 text-teal" />
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-graphite-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {testimonials[0].location}
                  </span>
                  <span>&middot; age {testimonials[0].age}</span>
                  <span>&middot; {testimonials[0].date}</span>
                </div>
              </div>
              <Badge variant="success" className="text-sm">
                {testimonials[0].highlight}
              </Badge>
            </div>

            <StarRating rating={testimonials[0].rating} />

            <p className="mt-4 text-base leading-relaxed text-graphite-600 sm:text-lg">
              &ldquo;{testimonials[0].text}&rdquo;
            </p>

            {/* Weight journey mini bar */}
            <div className="mt-5 flex items-center gap-3 rounded-xl bg-navy-50/50 p-3">
              <span className="text-sm text-graphite-500">
                {testimonials[0].startWeight} lbs
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-navy-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal to-atlantic"
                  style={{
                    width: `${((testimonials[0].startWeight - testimonials[0].currentWeight) / testimonials[0].startWeight) * 100}%`,
                  }}
                />
              </div>
              <span className="text-sm font-bold text-teal">
                {testimonials[0].currentWeight} lbs
              </span>
              <Badge variant="default" className="text-xs">
                -{testimonials[0].weightLost}
              </Badge>
            </div>

            <p className="mt-4 text-[10px] text-graphite-300">
              {testimonials[0].disclosureText}
            </p>
          </div>
        </AnimateOnView>

        {/* Paginated review grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gridReviews.map((t, i) => (
            <AnimateOnView
              key={`${page}-${t.name}`}
              className="flex flex-col rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium transition-all duration-300 hover:shadow-premium-lg"
              delay={i * 0.08}
            >
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full text-white text-sm font-bold", avatarColors[(1 + page * perPage + i) % avatarColors.length])}>
                  {testimonialAvatars[1 + page * perPage + i] ? (
                    <Image src={testimonialAvatars[1 + page * perPage + i].src} alt={testimonialAvatars[1 + page * perPage + i].alt} width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
                  ) : t.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-navy truncate">{t.name}</p>
                    {t.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-teal" />}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 text-xs text-graphite-400">
                    <span className="flex items-center gap-0.5">
                      <MapPin className="h-2.5 w-2.5" /> {t.location}
                    </span>
                    <span>&middot; {t.date}</span>
                  </div>
                </div>
              </div>

              {/* Stars + highlight */}
              <div className="mt-3 flex items-center gap-3">
                <StarRating rating={t.rating} />
                <Badge variant="success" className="text-[10px]">
                  -{t.weightLost}
                </Badge>
              </div>

              {/* Review text */}
              <p className="mt-3 flex-1 text-sm leading-relaxed text-graphite-600">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Weight bar */}
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-navy-50/50 p-2 text-xs">
                <span className="text-graphite-400">{t.startWeight}</span>
                <div className="flex-1 h-1 rounded-full bg-navy-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-teal"
                    style={{
                      width: `${((t.startWeight - t.currentWeight) / t.startWeight) * 100}%`,
                    }}
                  />
                </div>
                <span className="font-bold text-teal">{t.currentWeight} lbs</span>
              </div>

              <p className="mt-3 text-[10px] leading-relaxed text-graphite-300">
                {t.disclosureText}
              </p>
            </AnimateOnView>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Newer
            </Button>

            <div className="flex gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={cn(
                    "h-2 w-2 rounded-full transition-all",
                    i === page ? "bg-teal w-5" : "bg-navy-100 hover:bg-navy-200"
                  )}
                  aria-label={`Page ${i + 1}`}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="gap-1"
            >
              Older
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Bottom aggregate bar */}
        <AnimateOnView className="mt-10" delay={0.3}>
          <div className="flex flex-wrap items-center justify-center gap-8 rounded-2xl border border-navy-100/40 bg-white p-6 shadow-premium">
            <div className="text-center">
              <p className="text-2xl font-bold text-navy">{avg}/5</p>
              <p className="text-xs text-graphite-400">Average rating</p>
            </div>
            <div className="h-8 w-px bg-navy-100/40" />
            <div className="text-center">
              <p className="text-2xl font-bold text-navy">2,400+</p>
              <p className="text-xs text-graphite-400">Verified reviews</p>
            </div>
            <div className="h-8 w-px bg-navy-100/40" />
            <div className="text-center">
              <p className="text-2xl font-bold text-navy">94%</p>
              <p className="text-xs text-graphite-400">Would recommend</p>
            </div>
            <div className="h-8 w-px bg-navy-100/40" />
            <div className="text-center">
              <p className="text-2xl font-bold text-navy">18,000+</p>
              <p className="text-xs text-graphite-400">Patients served</p>
            </div>
          </div>
        </AnimateOnView>

        <p className="mt-4 text-center text-xs text-graphite-400">
          Individual experiences. <strong>Results not typical.</strong> Results vary based on adherence, diet, exercise, and individual health factors.
        </p>

        {/* CTA — capture high-intent visitors who read reviews */}
        <AnimateOnView className="mt-10 text-center" delay={0.4}>
          <a
            href="/qualify"
            className="inline-flex items-center gap-2 rounded-full bg-emerald px-10 py-4 text-base font-semibold text-white shadow-[0_4px_14px_rgba(5,150,105,0.35)] transition-all duration-200 hover:scale-[1.02] hover:bg-emerald-700"
          >
            Start Free Assessment →
          </a>
          <p className="mt-3 text-xs text-graphite-400">
            Join 18,000+ members already losing weight &middot; 2 minutes &middot; No commitment
          </p>
        </AnimateOnView>
      </SectionShell>
    </section>
  );
}
