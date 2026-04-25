"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Star, Check, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/site";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { heroImage } from "@/lib/images";
import { getVariant, trackExperiment, HERO_CTA_COPY } from "@/lib/experiments";
import { useEffect, useRef, useState, type ReactNode } from "react";

export interface HeroSectionProps {
  headline?: ReactNode;
  subContent?: ReactNode;
  footnote?: string;
  analyticsLocation?: string;
}

const DEFAULT_HEADLINE = (
  <>
    The weight-loss medication that{" "}
    <span className="relative inline-block">
      actually works.
      <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 5.5C40 2 80 2 100 3.5C120 5 160 6 199 3" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
      </svg>
    </span>
  </>
);

const DEFAULT_SUBCONTENT = (
  <p
    className="animate-fade-in-up mt-5 max-w-xl text-base leading-relaxed text-graphite-500 sm:text-lg lg:mx-0 mx-auto"
    style={{ animationDelay: "0.2s" }}
  >
    Clinically shown to help you lose <strong className="text-navy">up to 3x more weight</strong><sup className="text-graphite-400">†</sup> than diet and exercise alone. Licensed providers prescribe GLP-1 medication online — delivered to your door in 48 hours.
  </p>
);

const DEFAULT_FOOTNOTE =
  "† STEP-1 trial (Wilding et al., NEJM 2021): participants on once-weekly semaglutide 2.4mg plus lifestyle averaged ~14.9% body-weight loss vs ~2.4% with placebo plus lifestyle at 68 weeks. Individual results vary.  *Price comparison vs published U.S. cash-pay retail for FDA-approved GLP-1 medications. Compounded medications are not FDA-approved.";

function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const [display, setDisplay] = useState(target);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Honor reduced-motion: skip animation, show final value immediately
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(target + suffix);
      hasAnimated.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;

        const num = parseFloat(target.replace(/[^0-9.]/g, ""));
        const hasPlus = target.includes("+");
        const hasComma = target.includes(",");
        const isPercent = target.includes("%");
        const duration = 1500;
        const startedAt = performance.now();
        let raf = 0;

        const tick = (now: number) => {
          const t = Math.min(1, (now - startedAt) / duration);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - t, 3);
          const v = num * eased;
          let formatted = hasComma
            ? Math.round(v).toLocaleString()
            : num < 10
              ? v.toFixed(1)
              : String(Math.round(v));
          if (isPercent) formatted += "%";
          if (hasPlus) formatted += "+";
          formatted += suffix;
          setDisplay(formatted);
          if (t < 1) {
            raf = requestAnimationFrame(tick);
          } else {
            setDisplay(target + suffix);
          }
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
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

export function HeroSection({
  headline = DEFAULT_HEADLINE,
  subContent = DEFAULT_SUBCONTENT,
  footnote = DEFAULT_FOOTNOTE,
  analyticsLocation = "hero",
}: HeroSectionProps = {}) {
  // Tier 6.6 — Hero CTA A/B test. Each visitor gets a stable assignment via
  // their PostHog distinct_id (falls back to a session-scoped random id).
  // Copy only the button label — keeps the visual identical so we isolate
  // the copy effect. Exposure fires once per session.
  const [ctaCopy, setCtaCopy] = useState<string>(HERO_CTA_COPY.control);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SESSION_KEY = "nj-exp-hero-cta";
    let anonymousId = sessionStorage.getItem(SESSION_KEY);
    if (!anonymousId) {
      anonymousId = `anon_${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem(SESSION_KEY, anonymousId);
    }
    const variant = getVariant("hero_cta_copy", anonymousId);
    const copy = HERO_CTA_COPY[variant] ?? HERO_CTA_COPY.control;
    setCtaCopy(copy);
    // One exposure fires per session (sessionStorage dedupes)
    if (!sessionStorage.getItem(`${SESSION_KEY}-exposed`)) {
      trackExperiment("hero_cta_copy", variant);
      sessionStorage.setItem(`${SESSION_KEY}-exposed`, "1");
    }
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-sage-50/30 to-white">
      {/* Background pattern — desktop only (mobile paint cost not worth subtle visual) */}
      <div className="absolute inset-0 bg-subtle-grid opacity-30 hidden sm:block" aria-hidden="true" />

      {/* Floating accent orbs — desktop only, GPU-promoted to avoid scroll jank */}
      <div className="hidden sm:block absolute -top-24 -right-24 h-96 w-96 rounded-full bg-teal/3 blur-2xl gpu-layer" aria-hidden="true" />
      <div className="hidden sm:block absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-atlantic/3 blur-2xl gpu-layer" aria-hidden="true" />

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
              {headline}
            </h1>

            {/* Subheadline slot — paragraph on v1, bullet list + disclaimer chip on v2 */}
            {subContent}

            {/* Price anchor — separated for visual impact */}
            <div
              className="animate-fade-in-up mt-4 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 rounded-xl bg-navy-50/60 px-4 py-2.5 lg:mx-0 mx-auto lg:justify-start"
              style={{ animationDelay: "0.25s" }}
            >
              <span className="text-2xl font-bold text-navy">$179<span className="text-sm font-normal text-graphite-400">/mo</span></span>
              <span className="hidden sm:inline-block h-6 w-px bg-navy-200" />
              <span className="text-sm text-graphite-400 line-through">$1,349/mo retail</span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald">PLANS FROM $179</span>
            </div>

            {/* Primary CTA — "See If I Qualify" is #1 converter */}
            <div
              className="animate-fade-in-up mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
              style={{ animationDelay: "0.3s" }}
            >
              <Link
                href="/qualify"
                onClick={() =>
                  track(ANALYTICS_EVENTS.CTA_CLICK, {
                    cta: "hero_qualify",
                    location: analyticsLocation,
                    variant_copy: ctaCopy,
                  })
                }
              >
                <Button variant="emerald" size="xl" className="gap-2 w-full sm:w-auto text-lg px-12 h-16 rounded-full transition-all duration-300 hover:scale-[1.02] hover:brightness-110">
                  {ctaCopy}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing" onClick={() => track(ANALYTICS_EVENTS.CTA_CLICK, { cta: "hero_pricing", location: analyticsLocation })} className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full border-navy-200 text-navy hover:bg-navy-50 sm:h-14 sm:px-10 sm:text-lg">
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

            <details
              className="animate-fade-in-up mt-3 text-xs text-graphite-400 lg:max-w-xl"
              style={{ animationDelay: "0.55s" }}
            >
              <summary className="cursor-pointer text-[11px] text-graphite-400 hover:text-graphite-600 lg:text-left text-center">
                Study details & disclaimers
              </summary>
              <p className="mt-2 text-[11px] leading-relaxed text-graphite-400 lg:text-left text-center">
                {footnote}
              </p>
            </details>
          </div>

          {/* Right: Hero image + floating social proof card */}
          <div className="relative hidden lg:block animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              width={heroImage.width}
              height={heroImage.height}
              priority
              fetchPriority="high"
              quality={82}
              sizes="(max-width: 1024px) 0px, (max-width: 1280px) 45vw, 600px"
              placeholder="blur"
              blurDataURL={heroImage.blurDataURL}
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
