/**
 * LpJourneyRoadmap — visual month-by-month treatment timeline.
 * Defuses the "what happens after month 1?" objection and anchors expectations.
 * (Psychology: goal gradient + peak-end rule — future pacing the user's journey.)
 *
 * Typical shape: 4-6 milestones across months 0-12. Desktop = horizontal,
 * mobile = vertical stacked.
 */

export interface JourneyMilestone {
  month: string;        // e.g. "Week 1", "Month 3", "Month 6"
  label: string;        // short headline (3-6 words)
  description: string;  // 12-20 words
}

interface LpJourneyRoadmapProps {
  milestones: JourneyMilestone[];
  eyebrow?: string;
  heading?: string;
  subheading?: string;
}

export function LpJourneyRoadmap({
  milestones,
  eyebrow = "YOUR JOURNEY",
  heading = "What to expect, month by month",
  subheading = "Treatment is not a sprint — here's the realistic path your provider will build with you.",
}: LpJourneyRoadmapProps) {
  return (
    <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-10 text-center">
          <p
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--lp-badge-text)" }}
          >
            {eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-lp-heading sm:text-3xl">
            {heading}
          </h2>
          {subheading && (
            <p className="mx-auto mt-2 max-w-2xl text-sm text-lp-body sm:text-base">
              {subheading}
            </p>
          )}
        </div>

        {/* Desktop: horizontal connected timeline */}
        <ol className="relative hidden md:grid md:grid-flow-col md:auto-cols-fr md:gap-4">
          {/* horizontal line behind dots */}
          <div
            className="absolute left-0 right-0 top-4 h-px"
            style={{ backgroundColor: "var(--lp-card-border)" }}
            aria-hidden="true"
          />
          {milestones.map((m, i) => (
            <li key={`${m.month}-${i}`} className="relative flex flex-col items-center text-center">
              <div
                className="relative z-[1] flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white text-xs font-bold"
                style={{
                  borderColor: "var(--lp-divider)",
                  color: "var(--lp-badge-text)",
                }}
              >
                {i + 1}
              </div>
              <p
                className="mt-3 text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--lp-badge-text)" }}
              >
                {m.month}
              </p>
              <p className="mt-1 text-sm font-bold text-lp-heading">{m.label}</p>
              <p className="mt-1 text-xs text-lp-body leading-relaxed">
                {m.description}
              </p>
            </li>
          ))}
        </ol>

        {/* Mobile: vertical timeline */}
        <ol className="md:hidden space-y-5">
          {milestones.map((m, i) => (
            <li
              key={`m-${m.month}-${i}`}
              className="relative pl-12"
            >
              {i < milestones.length - 1 && (
                <span
                  className="absolute left-4 top-8 bottom-[-20px] w-px"
                  style={{ backgroundColor: "var(--lp-card-border)" }}
                  aria-hidden="true"
                />
              )}
              <div
                className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white text-xs font-bold"
                style={{
                  borderColor: "var(--lp-divider)",
                  color: "var(--lp-badge-text)",
                }}
              >
                {i + 1}
              </div>
              <p
                className="text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--lp-badge-text)" }}
              >
                {m.month}
              </p>
              <p className="mt-0.5 text-sm font-bold text-lp-heading">
                {m.label}
              </p>
              <p className="mt-1 text-xs text-lp-body leading-relaxed">
                {m.description}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-center text-[10px] text-lp-body-muted">
          Journey is illustrative. Your provider will tailor dosing and pace to your
          health profile. Individual results vary.
        </p>
      </div>
    </section>
  );
}
