import { Check, X as XIcon, Sparkles } from "lucide-react";

/**
 * LpPriceCompare — side-by-side comparison table, typically Brand vs. Nature's Journey.
 * Place MID-PAGE, before testimonials. The visual shock of 4-5x savings drives more
 * conversion than any testimonial (anchoring + contrast effect).
 *
 * Each column is a value proposition. Set `highlight: true` on your preferred column —
 * it gets the theme accent color + "Recommended" corner flag.
 */

export interface PriceCompareColumn {
  name: string;
  price: string;
  priceSubtext?: string;
  features: Array<{ label: string; included: boolean }>;
  highlight?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
}

interface LpPriceCompareProps {
  columns: PriceCompareColumn[];
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  footnote?: string;
}

export function LpPriceCompare({
  columns,
  eyebrow = "TRANSPARENT PRICING",
  heading = "Same active ingredient. A fraction of the price.",
  subheading = "Compare compounded GLP-1 care with brand-name retail pricing.",
  footnote = "*Retail pricing reflects published U.S. cash-pay prices for FDA-approved GLP-1 medications. Compounded medications are prepared by state-licensed pharmacies under individual prescriptions and are not FDA-approved drug products. Individual results vary.",
}: LpPriceCompareProps) {
  return (
    <section className="py-14">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-8 text-center">
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
            <p className="mt-2 text-sm text-lp-body sm:text-base">
              {subheading}
            </p>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {columns.map((col) => (
            <div
              key={col.name}
              className="relative flex flex-col overflow-hidden rounded-2xl border bg-white p-6 sm:p-8"
              style={{
                borderColor: col.highlight
                  ? "var(--lp-divider)"
                  : "var(--lp-card-border)",
                borderWidth: col.highlight ? 2 : 1,
                boxShadow: col.highlight
                  ? "0 8px 32px rgba(0,0,0,0.08)"
                  : "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              {col.highlight && (
                <div
                  className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold"
                  style={{
                    backgroundColor: "var(--lp-badge-bg)",
                    color: "var(--lp-badge-text)",
                  }}
                >
                  <Sparkles className="h-3 w-3" />
                  RECOMMENDED
                </div>
              )}

              <h3 className="text-lg font-bold text-lp-heading">{col.name}</h3>

              <div className="mt-4 flex items-baseline gap-2">
                <span
                  className={
                    col.highlight
                      ? "text-4xl font-bold text-lp-heading"
                      : "text-4xl font-bold text-lp-body-muted line-through"
                  }
                >
                  {col.price}
                </span>
                {col.priceSubtext && (
                  <span className="text-sm text-lp-body-muted">
                    {col.priceSubtext}
                  </span>
                )}
              </div>

              <ul className="mt-6 flex-1 space-y-2.5">
                {col.features.map((feature) => (
                  <li
                    key={feature.label}
                    className="flex items-start gap-2 text-sm"
                  >
                    {feature.included ? (
                      <Check
                        className="h-4 w-4 shrink-0 mt-0.5"
                        style={{ color: "var(--lp-icon)" }}
                      />
                    ) : (
                      <XIcon className="h-4 w-4 shrink-0 mt-0.5 text-lp-body-muted" />
                    )}
                    <span
                      className={
                        feature.included ? "text-lp-body" : "text-lp-body-muted"
                      }
                    >
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>

              {col.highlight && col.ctaLabel && (
                <a
                  href={col.ctaHref ?? "/qualify"}
                  className="mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: "var(--lp-btn-bg)",
                    color: "var(--lp-btn-text)",
                  }}
                >
                  {col.ctaLabel}
                </a>
              )}
            </div>
          ))}
        </div>

        {footnote && (
          <p className="mt-6 text-center text-[10px] text-lp-body-muted">
            {footnote}
          </p>
        )}
      </div>
    </section>
  );
}
