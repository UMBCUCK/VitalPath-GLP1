import { Check, ShieldCheck, Star } from "lucide-react";
import { LpHeroSection, LpThemedBadge, LpGradientText } from "./lp-themed";
import { LpTrackedCta } from "./lp-tracked-cta";
import { LpAnimatedStats } from "./lp-animated-stats";

interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

interface LpHeroBlockProps {
  badge: string;
  headline: string;
  headlineAccent?: string;
  subtitle: string;
  stats: readonly Stat[];
  retailPrice?: string;
  memberPrice?: string;
  savingsPercent?: string;
  ctaLabel?: string;
  ctaLocation?: string;
  variant?: "centered" | "split" | "compact";
  className?: string;
}

export function LpHeroBlock({
  badge,
  headline,
  headlineAccent,
  subtitle,
  stats,
  retailPrice = "$1,349/mo",
  memberPrice = "$179",
  savingsPercent = "79%",
  ctaLabel,
  ctaLocation = "hero",
  variant = "centered",
  className,
}: LpHeroBlockProps) {
  return (
    <LpHeroSection className={className}>
      <div className="mx-auto max-w-4xl px-4 text-center">
        {/* Badge */}
        <div className="mb-6 flex justify-center opacity-0 animate-fade-in-up" style={{ animationDelay: "0.05s", animationFillMode: "forwards" }}>
          <LpThemedBadge>
            <span className="relative mr-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {badge}
          </LpThemedBadge>
        </div>

        {/* Headline */}
        <h1
          className="text-3xl font-bold tracking-tight text-lp-heading sm:text-4xl lg:text-5xl opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
        >
          {headline}{" "}
          {headlineAccent && <LpGradientText>{headlineAccent}</LpGradientText>}
        </h1>

        {/* Subtitle */}
        <p
          className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-lp-body sm:text-lg opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
          {subtitle}
        </p>

        {/* Price anchor */}
        <div
          className="mt-6 inline-flex items-center gap-3 rounded-xl border px-5 py-2.5 opacity-0 animate-fade-in-up"
          style={{
            backgroundColor: "var(--lp-price-bg)",
            borderColor: "var(--lp-stat-border)",
            animationDelay: "0.2s",
            animationFillMode: "forwards",
          }}
        >
          <span className="text-sm text-lp-body-muted line-through">{retailPrice} retail</span>
          <span className="text-2xl font-bold text-lp-heading">{memberPrice}<span className="text-sm font-normal text-lp-body">/mo</span></span>
          <span
            className="rounded-full px-2 py-0.5 text-xs font-bold"
            style={{ backgroundColor: "var(--lp-btn-bg)", color: "var(--lp-btn-text)" }}
          >
            Save {savingsPercent}
          </span>
        </div>

        {/* CTA */}
        <div className="mt-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}>
          <LpTrackedCta location={ctaLocation} label={ctaLabel} />
        </div>

        {/* Trust micro-copy */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-lp-body-muted opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> 30-day money-back guarantee
          </span>
          <span className="flex items-center gap-1">
            <Check className="h-3.5 w-3.5" style={{ color: "var(--lp-icon)" }} /> Board-certified providers
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-gold fill-gold" /> Rated 4.9/5 by 2,400+ members
          </span>
        </div>

        {/* Animated stats */}
        <div className="mt-10">
          <LpAnimatedStats stats={stats} />
        </div>
      </div>
    </LpHeroSection>
  );
}
