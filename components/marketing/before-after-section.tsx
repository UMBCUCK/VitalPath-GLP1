"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ShieldCheck, ArrowRight } from "lucide-react";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimateOnView } from "@/components/shared/animate-on-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { beforeAfterImages, beforeAfterBlur } from "@/lib/images";

// Before/after entries — placeholder images until real patient photos are collected
// Replace src paths with actual patient photos (with signed consent + HIPAA release)
const transformations = [
  {
    name: "Jessica T.",
    age: 38,
    location: "Austin, TX",
    startWeight: 234,
    currentWeight: 183,
    lbs: 51,
    months: 7,
    quote: "I don't think about food 24/7 anymore. That alone changed my life.",
    plan: "Premium",
    // Placeholder gradient backgrounds — replace with real patient photos
    beforeColor: "from-graphite-200 to-graphite-300",
    afterColor: "from-teal-200 to-teal-300",
  },
  {
    name: "David K.",
    age: 56,
    location: "Chicago, IL",
    startWeight: 312,
    currentWeight: 241,
    lbs: 71,
    months: 10,
    quote: "A1C went from 8.2 to 5.9. My doctor is talking about taking me off metformin.",
    plan: "Complete",
    beforeColor: "from-graphite-200 to-graphite-300",
    afterColor: "from-teal-200 to-teal-300",
  },
  {
    name: "Robert J.",
    age: 62,
    location: "Tampa, FL",
    startWeight: 289,
    currentWeight: 231,
    lbs: 58,
    months: 8,
    quote: "Returned my CPAP machine. Playing with my grandkids again.",
    plan: "Premium",
    beforeColor: "from-graphite-200 to-graphite-300",
    afterColor: "from-teal-200 to-teal-300",
  },
  {
    name: "Lisa C.",
    age: 52,
    location: "San Diego, CA",
    startWeight: 278,
    currentWeight: 211,
    lbs: 67,
    months: 9,
    quote: "Menopausal weight gain is real. This is the only thing that worked.",
    plan: "Complete",
    beforeColor: "from-graphite-200 to-graphite-300",
    afterColor: "from-teal-200 to-teal-300",
  },
  {
    name: "Rachel W.",
    age: 33,
    location: "Denver, CO",
    startWeight: 198,
    currentWeight: 170,
    lbs: 28,
    months: 4,
    quote: "Crying in the Target dressing room because my pre-pregnancy jeans fit.",
    plan: "Essential",
    beforeColor: "from-graphite-200 to-graphite-300",
    afterColor: "from-teal-200 to-teal-300",
  },
];

function WeightCard({
  type,
  weight,
  lbs,
  imageSrc,
  imageAlt,
}: {
  type: "before" | "after";
  weight: number;
  lbs: number;
  imageSrc?: string;
  imageAlt?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex aspect-[3/4] w-full flex-col items-center justify-center overflow-hidden rounded-2xl",
        !imageSrc && (type === "before"
          ? "bg-gradient-to-br from-graphite-100 to-graphite-200"
          : "bg-gradient-to-br from-teal-50 to-teal-100")
      )}
    >
      {/* Background image layer */}
      {imageSrc && (
        <>
          <Image
            src={imageSrc}
            alt={imageAlt || `${type} lifestyle photo`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 40vw, 220px"
            placeholder="blur"
            blurDataURL={type === "before" ? beforeAfterBlur.before : beforeAfterBlur.after}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/40 z-[1]" />
        </>
      )}

      {/* Content */}
      <div className="relative z-[2] flex flex-col items-center">
        <p className={cn(
          "text-4xl font-bold sm:text-5xl drop-shadow-md",
          imageSrc ? "text-white" : (type === "before" ? "text-graphite-500" : "text-teal")
        )}>
          {weight}
        </p>
        <p className={cn(
          "text-sm font-medium",
          imageSrc ? "text-white/80" : (type === "before" ? "text-graphite-400" : "text-teal-600")
        )}>lbs</p>
        {type === "after" && (
          <div className="mt-3 rounded-full bg-teal px-3 py-1">
            <span className="text-xs font-bold text-white">-{lbs} lbs</span>
          </div>
        )}
      </div>

      <div
        className={cn(
          "absolute top-3 left-3 z-[2] rounded-full px-3 py-1 text-xs font-bold",
          type === "before"
            ? "bg-graphite-600 text-white"
            : "bg-teal text-white"
        )}
      >
        {type === "before" ? "Before" : "After"}
      </div>
    </div>
  );
}

export function BeforeAfterSection() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const item = transformations[current];

  // Auto-advance every 6 seconds unless user interacts
  const advance = useCallback(() => {
    setCurrent((prev) => (prev + 1) % transformations.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(advance, 6000);
    return () => clearInterval(interval);
  }, [advance, paused]);

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-sage/20">
      <SectionShell>
        <SectionHeading
          eyebrow="Real Transformations"
          title="See what's possible"
          description="Real members, real results. Photos shared with written consent."
        />

        <div className="mx-auto max-w-5xl">
          <AnimateOnView>
            <div className="rounded-3xl border border-navy-100/60 bg-white p-6 shadow-premium-lg sm:p-10">
              <div className="grid gap-8 md:grid-cols-2">
                {/* Before / After photos */}
                <div className="grid grid-cols-2 gap-4">
                  <WeightCard
                    type="before"
                    weight={item.startWeight}
                    lbs={item.lbs}
                    imageSrc={beforeAfterImages[current]?.before.src}
                    imageAlt={beforeAfterImages[current]?.before.alt}
                  />
                  <WeightCard
                    type="after"
                    weight={item.currentWeight}
                    lbs={item.lbs}
                    imageSrc={beforeAfterImages[current]?.after.src}
                    imageAlt={beforeAfterImages[current]?.after.alt}
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col justify-center">
                  <Badge variant="success" className="mb-4 self-start">
                    Lost {item.lbs} lbs in {item.months} months
                  </Badge>

                  <h3 className="text-2xl font-bold text-navy">
                    {item.name}, age {item.age}
                  </h3>
                  <p className="mt-1 text-sm text-graphite-400">
                    {item.location} &middot; {item.plan} Plan
                  </p>

                  {/* Weight journey */}
                  <div className="mt-6 flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm text-graphite-400">Start</p>
                      <p className="text-2xl font-bold text-graphite-600">
                        {item.startWeight}
                      </p>
                      <p className="text-xs text-graphite-400">lbs</p>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-graphite-200 via-teal to-teal-300" />
                    <div className="text-center">
                      <p className="text-sm text-teal">Current</p>
                      <p className="text-2xl font-bold text-teal">
                        {item.currentWeight}
                      </p>
                      <p className="text-xs text-teal-600">lbs</p>
                    </div>
                    <div className="rounded-xl bg-teal-50 px-3 py-2 text-center">
                      <p className="text-lg font-bold text-teal">
                        -{item.lbs}
                      </p>
                      <p className="text-[10px] text-teal-600">lbs lost</p>
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="mt-6 text-base italic leading-relaxed text-graphite-600">
                    &ldquo;{item.quote}&rdquo;
                  </p>

                  {/* Verified badge */}
                  <div className="mt-4 flex items-center gap-2 text-xs text-graphite-400">
                    <ShieldCheck className="h-4 w-4 text-teal" />
                    Illustrative images &middot; Not actual member photos &middot; Individual results vary
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between border-t border-navy-100/40 pt-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPaused(true);
                    setCurrent(
                      (current - 1 + transformations.length) %
                        transformations.length
                    );
                  }}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                {/* Dots */}
                <div className="flex gap-2">
                  {transformations.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setPaused(true); setCurrent(i); }}
                      className={cn(
                        "h-2.5 w-2.5 rounded-full transition-all duration-200",
                        i === current
                          ? "bg-teal w-6"
                          : "bg-navy-100 hover:bg-navy-200"
                      )}
                      aria-label={`View transformation ${i + 1}`}
                    />
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPaused(true);
                    setCurrent((current + 1) % transformations.length);
                  }}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </AnimateOnView>

          {/* Post-carousel CTA */}
          <div className="mt-8 text-center">
            <Link href="/qualify">
              <Button className="gap-2">
                Start Your Transformation <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-center text-[10px] text-graphite-300">
            {siteConfig.compliance.resultsDisclaimer}
          </p>
        </div>
      </SectionShell>
    </section>
  );
}
