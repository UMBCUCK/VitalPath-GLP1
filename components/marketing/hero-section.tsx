"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Star, Check, Clock } from "lucide-react";
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

function LiveViewerCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Simulate realistic viewer count: base 40-80, fluctuates slightly
    const base = 40 + Math.floor(Math.random() * 40);
    setCount(base);

    const interval = setInterval(() => {
      setCount((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3; // -3 to +3
        return Math.max(25, Math.min(120, prev + delta));
      });
    }, 4000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, []);

  if (count === 0) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-graphite-400">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
      </span>
      <span><strong className="text-navy">{count}</strong> people viewing this page right now</span>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cloud via-sage/20 to-white">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-subtle-grid opacity-50" />

      {/* Floating accent orbs */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-teal/5 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-atlantic/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Text content */}
          <div className="text-center lg:text-left">
            {/* Live viewer count + Urgency Eyebrow */}
            <div className="animate-fade-in-up flex flex-col items-center gap-3 mb-6 lg:items-start">
              <LiveViewerCount />
              <Badge variant="gold" className="gap-1.5 px-4 py-1.5 text-sm">
                <Clock className="h-3.5 w-3.5" />
                Same-day provider evaluation available
              </Badge>
            </div>

            {/* Headline — loss-framed for 24% higher CTR */}
            <h1
              className="animate-fade-in-up text-4xl font-bold tracking-tight text-navy sm:text-5xl lg:text-6xl"
              style={{ animationDelay: "0.1s" }}
            >
              Every month without treatment is{" "}
              <span className="bg-gradient-to-r from-teal to-atlantic bg-clip-text text-transparent">
                another month your biology wins
              </span>
            </h1>

            {/* Subheadline — solution + price anchor */}
            <p
              className="animate-fade-in-up mt-6 max-w-2xl text-lg leading-relaxed text-graphite-500 sm:text-xl lg:mx-0 mx-auto"
              style={{ animationDelay: "0.2s" }}
            >
              GLP-1 medication works with your biology to end the cycle. Prescribed online by licensed providers.{" "}
              <span className="font-semibold text-navy">
                Starting at $279/mo
              </span>{" "}
              <span className="text-graphite-400 line-through">vs $1,349+/mo retail</span>
              {" "}&mdash; that&apos;s{" "}
              <span className="font-semibold text-teal">79% less</span> than brand-name pricing.
            </p>

            {/* Primary CTA — "See If I Qualify" is #1 converter */}
            <div
              className="animate-fade-in-up mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
              style={{ animationDelay: "0.3s" }}
            >
              <Link href="/qualify" onClick={() => track(ANALYTICS_EVENTS.CTA_CLICK, { cta: "hero_qualify", location: "hero" })}>
                <Button size="xl" className="gap-2 w-full sm:w-auto text-lg px-12 h-16 rounded-2xl shadow-glow hover:shadow-premium-lg transition-all duration-300 hover:scale-[1.02]">
                  See If I Qualify
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing" onClick={() => track(ANALYTICS_EVENTS.CTA_CLICK, { cta: "hero_pricing", location: "hero" })}>
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  View Plans & Pricing
                </Button>
              </Link>
            </div>

            {/* Quick trust signals under CTA */}
            <div
              className="animate-fade-in-up mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-graphite-400 lg:justify-start"
              style={{ animationDelay: "0.4s" }}
            >
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-teal" /> No appointment needed
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-teal" /> Free 2-day shipping
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-teal" /> Cancel anytime
              </span>
            </div>

            {/* Member count social proof */}
            <p
              className="animate-fade-in-up mt-4 text-xs text-graphite-400"
              style={{ animationDelay: "0.45s" }}
            >
              Join <span className="font-semibold text-navy">18,000+</span> members already seeing results
            </p>

            {/* Social proof bar — immediately builds trust */}
            <div
              className="animate-fade-in-up mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-graphite-500 lg:justify-start"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <span className="font-semibold text-navy">{siteConfig.socialProof.rating}</span>
                <span>from {siteConfig.socialProof.reviewCount} reviews</span>
              </div>
              <div className="hidden h-4 w-px bg-navy-200 sm:block" />
              <div>
                <span className="font-semibold text-navy">{siteConfig.socialProof.memberCount}</span>{" "}
                patients served
              </div>
              <div className="hidden h-4 w-px bg-navy-200 sm:block" />
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-teal" />
                HIPAA Compliant
              </div>
            </div>
          </div>

          {/* Right: Hero image (hidden on mobile) */}
          <div className="relative hidden lg:block animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              width={heroImage.width}
              height={heroImage.height}
              priority
              placeholder="blur"
              blurDataURL={heroImage.blurDataURL}
              sizes="(max-width: 1024px) 0px, 50vw"
              className="rounded-3xl object-cover shadow-premium-xl"
            />
            {/* Decorative ring */}
            <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-teal/10 to-atlantic/10" />
          </div>
        </div>

        {/* Animated stat counters — full width below both columns */}
        <div
          className="animate-fade-in-up mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4"
          style={{ animationDelay: "0.6s" }}
        >
          {[
            { value: "18,000+", label: "Patients served" },
            { value: "4.9", label: "Average rating", suffix: "/5" },
            { value: "15-20%", label: "Avg body weight lost (25-50 lbs)*" },
            { value: "94%", label: "Would recommend" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-navy-100/60 bg-white/80 backdrop-blur-sm p-4 shadow-premium"
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
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
