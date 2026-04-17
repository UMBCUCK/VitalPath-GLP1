import { LpTrackedCta } from "./lp-tracked-cta";

interface LpMidCtaProps {
  headline?: string;
  subtext?: string;
  location?: string;
  ctaLabel?: string;
}

export function LpMidCta({
  headline = "Ready to see if you qualify?",
  subtext = "Free 2-minute assessment. No commitment required.",
  location = "mid-page",
  ctaLabel,
}: LpMidCtaProps) {
  return (
    <section
      className="py-10"
      style={{ backgroundColor: "var(--lp-section-alt)" }}
    >
      <div className="mx-auto max-w-xl px-4 text-center">
        <h3 className="text-xl font-bold text-lp-heading sm:text-2xl">
          {headline}
        </h3>
        <p className="mt-2 text-sm text-lp-body-muted">{subtext}</p>
        <div className="mt-5">
          <LpTrackedCta location={location} label={ctaLabel} />
        </div>
      </div>
    </section>
  );
}
