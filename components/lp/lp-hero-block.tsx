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
        {/* Badge — no fade-in: it sits above the LCP H1 and any opacity
            transition delays paint of the headline below it. */}
        <div className="mb-6 flex justify-center">
          <LpThemedBadge>
            <span className="relative mr-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {badge}
          </LpThemedBadge>
        </div>

        {/* Headline — LCP candidate. NO opacity-0/fade animation here:
            the H1 is the largest text and acts as the LCP element. Hiding it
            behind opacity-0 + animation-delay forces LCP to wait for the
            animation to run, which costs ~100-300ms of LCP. We render it
            visible from first paint. */}
        <h1 className="text-3xl font-bold tracking-tight text-lp-heading sm:text-4xl lg:text-5xl">
          {headline}{" "}
          {headlineAccent && <LpGradientText>{headlineAccent}</LpGradientText>}
        </h1>

        {/* Subtitle — also above-the-fold, no fade delay. */}
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-lp-body sm:text-lg">
          {subtitle}
        </p>

        {/* Price anchor — text colors reference --lp-price-text so they
            always contrast against --lp-price-bg (fixes the old black-on-black
            bug when --lp-heading happened to match --lp-price-bg).
            CLS fix: removed opacity-0/fade delay — the pill always renders at
            its final visual position so it doesn't cause a layout shift when
            the animation flips opacity. */}
        <div
          className="mt-6 inline-flex items-center gap-3 rounded-xl border px-5 py-2.5"
          style={{
            backgroundColor: "var(--lp-price-bg)",
            borderColor: "var(--lp-stat-border)",
          }}
        >
          <span
            className="text-sm line-through"
            style={{ color: "var(--lp-price-text)", opacity: 0.55 }}
          >
            {retailPrice} retail
          </span>
          <span
            className="text-2xl font-bold"
            style={{ color: "var(--lp-price-text)" }}
          >
            {memberPrice}
            <span
              className="text-sm font-normal"
              style={{ color: "var(--lp-price-text)", opacity: 0.7 }}
            >
              /mo
            </span>
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-xs font-bold"
            style={{ backgroundColor: "var(--lp-btn-bg)", color: "var(--lp-btn-text)" }}
          >
            Save {savingsPercent}
          </span>
        </div>

        {/* CTA — no fade-in. Above the fold; opacity animations on
            interactive elements also hurt INP since the first click can land
            during the fade and feel laggy. */}
        <div className="mt-8">
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
