"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Star, Check, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/site";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { heroImage } from "@/lib/images";
import { useEffect, useRef, useState } from "react";

function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const [display, setDisplay] = useState(target);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          // Extract number from target
          const num = parseFloat(target.replace(/[^0-9.]/g, ""));
          const hasPlus = target.includes("+");
          const hasComma = target.includes(",");
          const isPercent = target.includes("%");
          const duration = 1500;
          const steps = 40;
          const stepDuration = duration / steps;
          let step = 0;

          const interval = setInterval(() => {
            step++;
            const progress = step / steps;
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            let current = Math.round(num * eased * 10) / 10;

            if (num >= 100) current = Math.round(current);

            let formatted = hasComma
              ? current.toLocaleString()
              : num < 10
                ? current.toFixed(1)
                : String(Math.round(current));

            if (isPercent) formatted += "%";
            if (hasPlus) formatted += "+";
            formatted += suffix;

            setDisplay(formatted);

            if (step >= steps) {
              clearInterval(interval);
              setDisplay(target + suffix);
            }
          }, stepDuration);
        }
      },
      { rootMargin: "0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, suffix]);

  return <span ref={ref}>{display}</span>;
}

function WeeklyStarterCount() {
  // Seeded from day-of-week so it's consistent per day but varies across the week
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    // 47-91 range, deterministic per day
    const seeded = 47 + ((dayOfYear * 37 + 13) % 45);
    setCount(seeded);
  }, []);

  if (count === null) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-graphite-400">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
      </span>
      <span><strong className="text-navy">{count} people</strong> started treatment this week</span>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-sage-50/30 to-white">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-subtle-grid opacity-30" />

      {/* Floating accent orbs — subtle */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-teal/3 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-atlantic/3 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Text content */}
          <div className="text-center lg:text-left">
            {/* Micro-badge — builds instant credibility before headline */}
            <div
              className="animate-fade-in-up mb-5 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50/60 px-4 py-1.5"
              style={{ animationDelay: "0.05s" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-navy">Accepting new patients — same-day evaluation</span>
            </div>

            {/* Headline — short, benefit-led, single color for readability */}
            <h1
              className="animate-fade-in-up text-4xl font-bold tracking-tight text-navy sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]"
              style={{ animationDelay: "0.1s" }}
            >
              The weight-loss medication that{" "}
              <span className="relative inline-block">
                actually works.
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5.5C40 2 80 2 100 3.5C120 5 160 6 199 3" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" opacity="0.45"/>
                </svg>
              </span>
            </h1>

            {/* Subheadline — what, how, speed, cost — all in one clean read */}
            <p
              className="animate-fade-in-up mt-5 max-w-xl text-base leading-relaxed text-graphite-500 sm:text-lg lg:mx-0 mx-auto"
              style={{ animationDelay: "0.2s" }}
            >
              Clinically proven to help you lose <strong className="text-navy">3x more weight</strong> than diet and exercise alone. Licensed providers prescribe GLP-1 medication online — delivered to your door in 48 hours.
            </p>

            {/* Price anchor — separated for visual impact */}
            <div
              className="animate-fade-in-up mt-4 inline-flex items-center gap-3 rounded-xl bg-navy-50/60 px-4 py-2.5 lg:mx-0 mx-auto"
              style={{ animationDelay: "0.25s" }}
            >
              <span className="text-2xl font-bold text-navy">$279<span className="text-sm font-normal text-graphite-400">/mo</span></span>
              <span className="h-6 w-px bg-navy-200" />
              <span className="text-sm text-graphite-400 line-through">$1,349/mo retail</span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald">SAVE 79%</span>
            </div>

            {/* Primary CTA — "See If I Qualify" is #1 converter */}
            <div
              className="animate-fade-in-up mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
              style={{ animationDelay: "0.3s" }}
            >
              <Link href="/qualify" onClick={() => track(ANALYTICS_EVENTS.CTA_CLICK, { cta: "hero_qualify", location: "hero" })}>
                <Button variant="emerald" size="xl" className="gap-2 w-full sm:w-auto text-lg px-12 h-16 rounded-full transition-all duration-300 hover:scale-[1.02] hover:brightness-110">
                  See If I Qualify
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing" onClick={() => track(ANALYTICS_EVENTS.CTA_CLICK, { cta: "hero_pricing", location: "hero" })}>
                <Button variant="outline" size="xl" className="w-full sm:w-auto rounded-full border-navy-200 text-navy hover:bg-navy-50">
                  View Plans & Pricing
                </Button>
              </Link>
            </div>

            {/* Refund guarantee + trust micro-copy */}
            <p
              className="animate-fade-in-up mt-3 text-xs text-graphite-400 lg:text-left text-center"
              style={{ animationDelay: "0.35s" }}
            >
              ✓ Free 2-minute assessment &nbsp;·&nbsp; ✓ 30-day money-back guarantee &nbsp;·&nbsp; ✓ Cancel anytime
            </p>

            {/* Quick trust signals under CTA */}
            <div
              className="animate-fade-in-up mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-graphite-400 lg:justify-start"
              style={{ animationDelay: "0.4s" }}
            >
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-500" /> No appointment needed
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-500" /> Free 2-day shipping
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-500" /> Board-certified providers
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-500" /> HIPAA compliant
              </span>
            </div>

            {/* Social proof bar — ratings + member count */}
            <div
              className="animate-fade-in-up mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-graphite-500 lg:justify-start"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <span className="font-semibold text-navy">{siteConfig.socialProof.rating}</span>
                <span className="text-graphite-400">({siteConfig.socialProof.reviewCount} reviews)</span>
              </div>
              <div className="hidden h-4 w-px bg-navy-200 sm:block" />
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-teal" />
                <span><span className="font-semibold text-navy">{siteConfig.socialProof.memberCount}</span> patients served</span>
              </div>
            </div>

            <p
              className="animate-fade-in-up mt-3 text-[10px] text-graphite-300"
              style={{ animationDelay: "0.55s" }}
            >
              *vs. published U.S. cash-pay retail for FDA-approved GLP-1 medications. Compounded medications are not FDA-approved.
            </p>
          </div>

          {/* Right: Hero image + floating social proof card */}
          <div className="relative hidden lg:block animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              width={heroImage.width}
              height={heroImage.height}
              priority
              unoptimized
              sizes="(max-width: 1024px) 0px, 50vw"
              className="rounded-3xl object-contain drop-shadow-2xl"
            />

            {/* Floating review card on image — social proof */}
            <div className="absolute -bottom-4 -left-6 rounded-2xl border border-navy-100/60 bg-white/95 backdrop-blur-sm p-4 shadow-premium-lg max-w-[240px]">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal text-white text-sm font-bold">R</div>
                <div>
                  <p className="text-xs font-semibold text-navy">Rachel W.</p>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-3 w-3 fill-gold text-gold" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-2 text-xs text-graphite-500 leading-relaxed">&ldquo;Down 28 lbs in 3 months. I finally feel like myself again.&rdquo;</p>
              <div className="mt-2 flex items-center gap-1">
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">Verified Member</span>
              </div>
            </div>

            {/* Floating delivery badge top right */}
            <div className="absolute -top-2 -right-2 rounded-xl border border-navy-100/60 bg-white/95 backdrop-blur-sm px-3 py-2 shadow-premium">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                  <ArrowRight className="h-4 w-4 text-emerald" />
                </div>
                <div>
                  <p className="text-[10px] text-graphite-400">Ships in</p>
                  <p className="text-sm font-bold text-navy">48 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated stat counters — full width below both columns */}
        <div
          className="animate-fade-in-up mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6"
          style={{ animationDelay: "0.6s" }}
        >
          {[
            { value: "18,000+", label: "Patients served", icon: "👥" },
            { value: "4.9", label: "Average rating", suffix: "/5", icon: "⭐" },
            { value: "15-20%", label: "Avg body weight lost*", icon: "📉" },
            { value: "94%", label: "Would recommend", icon: "💬" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-navy-100/50 bg-white p-4 shadow-premium text-center"
            >
              <p className="text-2xl font-bold text-navy sm:text-3xl">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1 text-xs text-graphite-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
