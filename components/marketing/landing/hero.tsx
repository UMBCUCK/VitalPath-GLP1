"use client";

import Link from "next/link";
import { ArrowRight, Check, Star, Users, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import type { ReactNode } from "react";
import { ICONS, type IconName } from "./icons";

type Accent = "teal" | "emerald" | "lavender" | "atlantic" | "gold" | "rose";

const accentMap: Record<Accent, { bg: string; text: string; border: string; glow: string; gradFrom: string; gradTo: string }> = {
  teal: {
    bg: "bg-teal/10",
    text: "text-teal",
    border: "border-teal/30",
    glow: "shadow-[0_0_60px_rgba(20,184,166,0.15)]",
    gradFrom: "from-teal",
    gradTo: "to-atlantic",
  },
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    glow: "shadow-[0_0_60px_rgba(16,185,129,0.18)]",
    gradFrom: "from-emerald",
    gradTo: "to-teal",
  },
  lavender: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    glow: "shadow-[0_0_60px_rgba(139,92,246,0.18)]",
    gradFrom: "from-violet-500",
    gradTo: "to-fuchsia-400",
  },
  atlantic: {
    bg: "bg-atlantic/10",
    text: "text-atlantic",
    border: "border-atlantic/30",
    glow: "shadow-[0_0_60px_rgba(29,78,216,0.15)]",
    gradFrom: "from-atlantic",
    gradTo: "to-teal",
  },
  gold: {
    bg: "bg-gold/10",
    text: "text-gold-700",
    border: "border-gold/30",
    glow: "shadow-[0_0_60px_rgba(202,138,4,0.15)]",
    gradFrom: "from-gold",
    gradTo: "to-amber-400",
  },
  rose: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    glow: "shadow-[0_0_60px_rgba(244,63,94,0.15)]",
    gradFrom: "from-rose-500",
    gradTo: "to-pink-400",
  },
};

export interface HeroMetric {
  label: string;
  value: string;
  delta?: string;
  direction?: "up" | "down";
}

export interface HeroTestimonial {
  initials: string;
  name: string;
  outcome: string;
  quote: string;
}

export interface LandingHeroProps {
  badge: string;
  badgeIcon?: IconName;
  accent?: Accent;
  headlineStart: string;
  headlineAccent: string;
  headlineEnd?: string;
  subhead: ReactNode;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  analyticsPage: string;
  cardTitle: string;
  cardIcon?: IconName;
  cardMetrics: HeroMetric[];
  cardFootnote?: string;
  testimonial?: HeroTestimonial;
  microcopy?: string[];
}

export function LandingHero({
  badge,
  badgeIcon,
  accent = "teal",
  headlineStart,
  headlineAccent,
  headlineEnd,
  subhead,
  primaryCtaLabel = "See If I Qualify",
  primaryCtaHref = "/qualify",
  secondaryCtaLabel = "View Plans & Pricing",
  secondaryCtaHref = "/pricing",
  analyticsPage,
  cardTitle,
  cardIcon,
  cardMetrics,
  cardFootnote,
  testimonial,
  microcopy = [
    "Free 2-minute assessment",
    "Same-day provider review",
    "30-day money-back guarantee",
    "Cancel anytime",
  ],
}: LandingHeroProps) {
  const a = accentMap[accent];
  const BadgeIcon = badgeIcon ? ICONS[badgeIcon] : undefined;
  const CardIcon = cardIcon ? ICONS[cardIcon] : undefined;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-sage-50/30 to-white">
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-subtle-grid opacity-30" />
      {/* Accent orbs */}
      <div className={`absolute -top-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br ${a.gradFrom} ${a.gradTo} opacity-[0.08] blur-3xl`} />
      <div className={`absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br ${a.gradFrom} ${a.gradTo} opacity-[0.06] blur-3xl`} />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
          {/* LEFT */}
          <div className="text-center lg:text-left">
            {/* Live patients ping */}
            <div className="animate-fade-in-up mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/70 px-3.5 py-1.5" style={{ animationDelay: "0.05s" }}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-navy">Accepting new patients · Provider review within 24h</span>
            </div>

            {/* Segment badge */}
            <div className={`animate-fade-in-up mb-5 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 ${a.bg} ${a.border}`} style={{ animationDelay: "0.08s" }}>
              {BadgeIcon && <BadgeIcon className={`h-3.5 w-3.5 ${a.text}`} />}
              <span className={`text-xs font-bold uppercase tracking-wider ${a.text}`}>{badge}</span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-up text-4xl font-bold tracking-tight text-navy leading-tight sm:text-5xl sm:leading-[1.05] lg:text-[3.25rem] lg:leading-[1.08]" style={{ animationDelay: "0.1s" }}>
              {headlineStart}{" "}
              <span className="relative inline-block">
                <span className={`bg-gradient-to-r ${a.gradFrom} ${a.gradTo} bg-clip-text text-transparent`}>{headlineAccent}</span>
                <svg className="absolute -bottom-1.5 left-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M1 5.5C40 2 80 2 100 3.5C120 5 160 6 199 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={`${a.text} opacity-40`} />
                </svg>
              </span>
              {headlineEnd ? <> {headlineEnd}</> : null}
            </h1>

            {/* Subhead */}
            <div className="animate-fade-in-up mt-6 max-w-xl text-base leading-relaxed text-graphite-500 sm:text-lg lg:mx-0 mx-auto" style={{ animationDelay: "0.2s" }}>
              {subhead}
            </div>

            {/* Price anchor */}
            <div className="animate-fade-in-up mt-5 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 rounded-xl border border-navy-100/50 bg-white/80 px-4 py-2.5 shadow-sm lg:justify-start" style={{ animationDelay: "0.25s" }}>
              <span className="text-2xl font-bold text-navy">
                $179<span className="text-sm font-normal text-graphite-400">/mo</span>
              </span>
              <span className="hidden sm:inline-block h-6 w-px bg-navy-200" />
              <span className="text-sm text-graphite-400 line-through">$1,349/mo retail</span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                Save 87%
              </span>
            </div>

            {/* CTAs */}
            <div className="animate-fade-in-up mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start" style={{ animationDelay: "0.3s" }}>
              <Link
                href={primaryCtaHref}
                onClick={() =>
                  track(ANALYTICS_EVENTS.CTA_CLICK, {
                    cta: "lp_hero_primary",
                    location: analyticsPage,
                    label: primaryCtaLabel,
                  })
                }
              >
                <Button variant="emerald" size="xl" className="gap-2 w-full sm:w-auto text-lg px-10 h-16 rounded-full transition-all duration-300 hover:scale-[1.02] hover:brightness-110">
                  {primaryCtaLabel}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link
                href={secondaryCtaHref}
                onClick={() =>
                  track(ANALYTICS_EVENTS.CTA_CLICK, {
                    cta: "lp_hero_secondary",
                    location: analyticsPage,
                    label: secondaryCtaLabel,
                  })
                }
              >
                <Button variant="outline" size="xl" className="w-full sm:w-auto rounded-full border-navy-200 text-navy hover:bg-navy-50">
                  {secondaryCtaLabel}
                </Button>
              </Link>
            </div>

            {/* Microcopy chips */}
            <div className="animate-fade-in-up mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-graphite-500 lg:justify-start" style={{ animationDelay: "0.35s" }}>
              {microcopy.map((m) => (
                <span key={m} className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-500" /> {m}
                </span>
              ))}
            </div>

            {/* Social proof bar */}
            <div className="animate-fade-in-up mt-5 flex flex-wrap items-center justify-center gap-4 text-sm lg:justify-start" style={{ animationDelay: "0.45s" }}>
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
                <span className="text-graphite-500">
                  <span className="font-semibold text-navy">{siteConfig.socialProof.memberCount}</span> patients served
                </span>
              </div>
              <div className="hidden h-4 w-px bg-navy-200 sm:block" />
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span className="text-graphite-500">HIPAA protected</span>
              </div>
            </div>
          </div>

          {/* RIGHT — Visual anchor card */}
          <div className="animate-fade-in-up relative" style={{ animationDelay: "0.3s" }}>
            <div className={`relative rounded-3xl border border-navy-100/60 bg-white p-6 shadow-premium-lg ${a.glow} sm:p-8`}>
              {/* Card header */}
              <div className="mb-5 flex items-center gap-3">
                {CardIcon && (
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.bg}`}>
                    <CardIcon className={`h-5 w-5 ${a.text}`} />
                  </div>
                )}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-graphite-400">Clinical snapshot</div>
                  <h3 className="font-bold text-navy">{cardTitle}</h3>
                </div>
              </div>

              {/* Metrics list */}
              <div className="space-y-4">
                {cardMetrics.map((m) => (
                  <div key={m.label} className="flex items-start justify-between gap-3 border-b border-navy-100/40 pb-3 last:border-b-0 last:pb-0">
                    <span className="text-sm text-graphite-600 leading-snug flex-1">{m.label}</span>
                    <div className="flex shrink-0 items-baseline gap-1">
                      {m.direction === "down" && <span className="text-emerald-500">↓</span>}
                      {m.direction === "up" && <span className="text-emerald-500">↑</span>}
                      <span className={`text-base font-bold ${m.direction ? "text-emerald-600" : a.text}`}>{m.value}</span>
                      {m.delta && <span className="text-xs text-graphite-400">{m.delta}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {cardFootnote && (
                <p className="mt-5 rounded-xl bg-navy-50/60 px-3 py-2 text-[11px] leading-relaxed text-graphite-500">
                  {cardFootnote}
                </p>
              )}
            </div>

            {/* Floating testimonial card — desktop only (prevents mobile overlap + overflow) */}
            {testimonial && (
              <div className="hidden lg:block absolute -bottom-6 -left-4 w-[260px] rounded-2xl border border-navy-100/60 bg-white/95 p-4 shadow-premium-lg backdrop-blur-sm sm:-left-8">
                <div className="flex items-center gap-2">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${a.gradFrom} ${a.gradTo} text-white text-sm font-bold`}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-navy">{testimonial.name}</p>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-3 w-3 fill-gold text-gold" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-graphite-600">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="mt-2 flex items-center gap-1">
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">{testimonial.outcome}</span>
                </div>
              </div>
            )}

            {/* Top right delivery badge — desktop only (mobile already shows stats card below) */}
            <div className="hidden lg:block absolute -top-3 -right-3 rounded-xl border border-navy-100/60 bg-white/95 px-3 py-2 shadow-premium backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                  <ArrowRight className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] text-graphite-400">Delivered in</p>
                  <p className="text-sm font-bold text-navy">48 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
