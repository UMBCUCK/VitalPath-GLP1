/**
 * LpOutcomeStats — horizontal band of 3-4 big program-outcome numbers.
 * Place BELOW the hero + social-proof bar, BEFORE the problem section.
 *
 * Why it converts: anchors the audience with concrete outcomes before they
 * scroll into objections. "Real numbers" overrides generic claims.
 * (Psychology: availability heuristic + specificity bias.)
 */

interface OutcomeStat {
  value: string;
  label: string;
  sublabel?: string;
}

interface LpOutcomeStatsProps {
  stats: OutcomeStat[];
  heading?: string;
  subheading?: string;
  footnote?: string;
}

export function LpOutcomeStats({
  stats,
  heading = "Real Program Outcomes",
  subheading = "Based on our members, tracked monthly.",
  footnote = "*Individual results vary. Compounded medications are not FDA-approved.",
}: LpOutcomeStatsProps) {
  return (
    <section
      className="py-12"
      style={{ backgroundColor: "var(--lp-section-alt)" }}
    >
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-lp-heading sm:text-2xl">
            {heading}
          </h2>
          {subheading && (
            <p className="mt-1 text-sm text-lp-body-muted">{subheading}</p>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border bg-white p-6 text-center shadow-sm"
              style={{ borderColor: "var(--lp-stat-border)" }}
            >
              <p className="text-3xl font-bold text-lp-heading sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-semibold text-lp-heading">
                {stat.label}
              </p>
              {stat.sublabel && (
                <p className="mt-1 text-xs text-lp-body-muted leading-relaxed">
                  {stat.sublabel}
                </p>
              )}
            </div>
          ))}
        </div>
        {footnote && (
          <p className="mt-5 text-center text-[10px] text-lp-body-muted">
            {footnote}
          </p>
        )}
      </div>
    </section>
  );
}
