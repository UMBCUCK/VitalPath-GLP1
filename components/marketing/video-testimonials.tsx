"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, Star, BadgeCheck, Quote, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimateOnView } from "@/components/shared/animate-on-view";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Video testimonial placeholders — replace with real video URLs when available
const videos = [
  {
    name: "Jessica T.",
    age: 38,
    location: "Austin, TX",
    weightLost: "51 lbs",
    duration: "1:42",
    quote: "I've tried every diet. This is the first thing that actually changed how my body processes hunger.",
    thumbnail: "from-navy-600 to-atlantic",
  },
  {
    name: "David K.",
    age: 56,
    location: "Chicago, IL",
    weightLost: "71 lbs",
    duration: "2:15",
    quote: "My A1C went from 8.2 to 5.9. My doctor is talking about taking me off metformin.",
    thumbnail: "from-atlantic to-teal-800",
  },
  {
    name: "Amanda R.",
    age: 29,
    location: "Nashville, TN",
    weightLost: "35 lbs",
    duration: "1:58",
    quote: "I have PCOS. For the first time in a decade, my doctor isn't telling me to just eat less.",
    thumbnail: "from-teal-800 to-navy",
  },
];

export function VideoTestimonials() {
  const [activeVideo, setActiveVideo] = useState(0);
  const active = videos[activeVideo];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-navy to-atlantic overflow-hidden">
      <SectionShell>
        <div className="text-center mb-12">
          <Badge variant="default" className="mb-4 border-teal-400/30 bg-teal/20 text-teal-200">
            Video Stories
          </Badge>
          <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Hear it directly from our members
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-navy-300">
            Real people sharing their unfiltered experience.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Main video player area */}
          <div className="lg:col-span-3">
            <AnimateOnView>
              <div className={cn(
                "relative aspect-video w-full rounded-2xl bg-gradient-to-br overflow-hidden cursor-pointer group",
                active.thumbnail
              )}>
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 shadow-premium-xl group-hover:scale-110 transition-transform">
                    <Play className="h-8 w-8 text-navy ml-1" />
                  </div>
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-4 right-4 rounded-lg bg-black/60 px-2.5 py-1">
                  <span className="text-xs font-medium text-white">{active.duration}</span>
                </div>

                {/* Name overlay */}
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center gap-2 rounded-lg bg-black/60 px-3 py-2">
                    <BadgeCheck className="h-4 w-4 text-teal-300" />
                    <span className="text-sm font-semibold text-white">
                      {active.name}, {active.age}
                    </span>
                    <Badge variant="success" className="text-[10px]">
                      -{active.weightLost}
                    </Badge>
                  </div>
                </div>
              </div>
            </AnimateOnView>

            {/* Quote below video */}
            <div className="mt-4 flex gap-3">
              <Quote className="h-6 w-6 shrink-0 text-teal-400/50" />
              <div>
                <p className="text-base italic text-white/80">
                  &ldquo;{active.quote}&rdquo;
                </p>
                <Link href="/quiz" className="mt-3 inline-block">
                  <Button variant="gold" size="sm" className="gap-1.5">
                    Start Your Story <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Thumbnail selection */}
          <div className="lg:col-span-2 flex flex-row lg:flex-col gap-3">
            {videos.map((video, i) => (
              <button
                key={video.name}
                onClick={() => setActiveVideo(i)}
                className={cn(
                  "flex-1 flex items-center gap-3 rounded-xl p-3 text-left transition-all duration-200",
                  i === activeVideo
                    ? "bg-white/15 ring-1 ring-teal/40"
                    : "bg-white/5 hover:bg-white/10"
                )}
              >
                {/* Mini thumbnail */}
                <div className={cn(
                  "relative h-16 w-24 shrink-0 rounded-lg bg-gradient-to-br overflow-hidden",
                  video.thumbnail
                )}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="h-5 w-5 text-white/80" />
                  </div>
                  <div className="absolute bottom-1 right-1 rounded bg-black/60 px-1 py-0.5">
                    <span className="text-[10px] text-white">{video.duration}</span>
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{video.name}</p>
                  <p className="text-xs text-white/50">{video.location}</p>
                  <div className="mt-1 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-3 w-3 fill-gold text-gold" />
                    ))}
                    <span className="ml-1 text-xs text-teal-300">-{video.weightLost}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-[10px] text-white/30">
          Individual experiences. Results vary based on adherence to treatment plans, diet, exercise, and individual factors.
        </p>
      </SectionShell>
    </section>
  );
}
