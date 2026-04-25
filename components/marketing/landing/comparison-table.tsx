import { Check, X, Minus } from "lucide-react";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";

type Cell = boolean | "partial" | string;

interface Row {
  feature: string;
  us: Cell;
  ro: Cell;
  hims: Cell;
  medvi: Cell;
  brand: Cell;
  highlight?: boolean;
}

interface Props {
  eyebrow?: string;
  title?: string;
  description?: string;
  rows?: Row[];
}

const defaultRows: Row[] = [
  {
    feature: "Starting price",
    us: "$179/mo",
    ro: "$299/mo",
    hims: "$199/mo",
    medvi: "$249/mo",
    brand: "$1,349/mo",
    highlight: true,
  },
  {
    feature: "Compounded semaglutide",
    us: true,
    ro: true,
    hims: true,
    medvi: true,
    brand: false,
  },
  {
    feature: "Compounded tirzepatide",
    us: true,
    ro: "partial",
    hims: true,
    medvi: true,
    brand: false,
  },
  {
    feature: "Segment-specific care protocols (PCOS, menopause, men's)",
    us: true,
    ro: "partial",
    hims: false,
    medvi: false,
    brand: false,
    highlight: true,
  },
  {
    feature: "Unlimited provider messaging",
    us: true,
    ro: false,
    hims: "partial",
    medvi: "partial",
    brand: false,
  },
  {
    feature: "Hormone / metabolic lab monitoring",
    us: true,
    ro: false,
    hims: false,
    medvi: "partial",
    brand: false,
    highlight: true,
  },
  {
    feature: "Free 2-day shipping",
    us: true,
    ro: true,
    hims: true,
    medvi: "partial",
    brand: false,
  },
  {
    feature: "30-day money-back guarantee",
    us: true,
    ro: false,
    hims: false,
    medvi: false,
    brand: false,
    highlight: true,
  },
  {
    feature: "Nutrition + training coaching included",
    us: true,
    ro: false,
    hims: false,
    medvi: false,
    brand: false,
  },
  {
    feature: "Cancel anytime · no lock-in",
    us: true,
    ro: true,
    hims: true,
    medvi: true,
    brand: false,
  },
];

function Cell({ value, us }: { value: Cell; us?: boolean }) {
  if (value === "partial") {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-700">
        <Minus className="h-4 w-4 stroke-[3]" />
      </span>
    );
  }
  if (typeof value === "string") {
    return <span className={us ? "font-bold text-emerald-700" : "text-navy"}>{value}</span>;
  }
  if (value === true) {
    return (
      <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${us ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-700"}`}>
        <Check className="h-4 w-4 stroke-[3]" />
      </span>
    );
  }
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-50 text-rose-500">
      <X className="h-4 w-4 stroke-[3]" />
    </span>
  );
}

export function LandingComparisonTable({
  eyebrow = "How we compare",
  title = "Nature's Journey vs the big names",
  description = "Not all telehealth weight-loss programs are the same. Here's what's actually included at each tier.",
  rows = defaultRows,
}: Props) {
  return (
    <section className="relative bg-gradient-to-b from-cloud/30 to-white py-20">
      <SectionShell>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        {/* Mobile: compact per-feature cards with Nature's Journey prominent and a competitor summary chip */}
        <div className="mx-auto mt-12 max-w-xl space-y-3 md:hidden">
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Swipe the table to compare competitors →
            </div>
          </div>
          {rows.map((row) => {
            const othersIncluded = [row.ro, row.hims, row.medvi, row.brand].filter((v) => v === true).length;
            const othersPartial = [row.ro, row.hims, row.medvi, row.brand].filter((v) => v === "partial").length;
            return (
              <div
                key={row.feature}
                className={`rounded-2xl border p-4 shadow-sm ${row.highlight ? "border-emerald-200 bg-emerald-50/40" : "border-navy-100/50 bg-white"}`}
              >
                <div className="text-sm font-semibold text-navy leading-snug">
                  {row.highlight && <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 align-middle" aria-hidden />}
                  {row.feature}
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Cell value={row.us} us />
                    <span className="text-xs font-semibold text-navy">Nature&apos;s Journey</span>
                  </div>
                  <span className="text-[11px] text-graphite-400">
                    {typeof row.us === "string"
                      ? "vs competitors"
                      : othersIncluded === 4
                        ? "All 4 others also offer"
                        : othersIncluded + othersPartial === 0
                          ? "None of the others offer"
                          : `${othersIncluded}/4 others · ${othersPartial} partial`}
                  </span>
                </div>
              </div>
            );
          })}
          <details className="rounded-2xl border border-navy-100/50 bg-white p-4 text-sm">
            <summary className="cursor-pointer font-semibold text-navy">
              See full competitor grid →
            </summary>
            <div className="-mx-4 mt-3 overflow-x-auto [-webkit-overflow-scrolling:touch]">
              <div className="min-w-[640px] overflow-hidden rounded-xl border border-navy-100/40">
                {/* Header */}
                <div className="grid grid-cols-[1.4fr_1fr_0.9fr_0.9fr_0.9fr_0.9fr] gap-0 bg-gradient-to-r from-navy via-atlantic to-teal text-white">
                  <div className="px-3 py-3 text-[11px] font-bold uppercase tracking-wider">Feature</div>
                  <div className="px-2 py-3 text-center text-xs font-bold">NJ</div>
                  <div className="px-2 py-3 text-center text-xs text-white/70">Ro</div>
                  <div className="px-2 py-3 text-center text-xs text-white/70">Hims</div>
                  <div className="px-2 py-3 text-center text-xs text-white/70">Medvi</div>
                  <div className="px-2 py-3 text-center text-xs text-white/70">Brand</div>
                </div>
                {rows.map((row, i) => (
                  <div
                    key={row.feature}
                    className={`grid grid-cols-[1.4fr_1fr_0.9fr_0.9fr_0.9fr_0.9fr] items-center border-t border-navy-100/30 ${i % 2 === 0 ? "bg-white" : "bg-cloud/20"}`}
                  >
                    <div className="px-3 py-3 text-[11px] leading-snug text-navy">{row.feature}</div>
                    <div className="px-1 py-3 text-center"><Cell value={row.us} us /></div>
                    <div className="px-1 py-3 text-center"><Cell value={row.ro} /></div>
                    <div className="px-1 py-3 text-center"><Cell value={row.hims} /></div>
                    <div className="px-1 py-3 text-center"><Cell value={row.medvi} /></div>
                    <div className="px-1 py-3 text-center"><Cell value={row.brand} /></div>
                  </div>
                ))}
              </div>
            </div>
          </details>
        </div>

        {/* Desktop / tablet: full grid */}
        <div className="mx-auto mt-12 hidden max-w-5xl overflow-hidden rounded-3xl border border-navy-100/50 bg-white shadow-premium-lg md:block">
          {/* Header row */}
          <div className="grid grid-cols-[1.6fr_1fr_0.9fr_0.9fr_0.9fr_0.9fr] gap-0 border-b border-navy-100/40 bg-gradient-to-r from-navy via-atlantic to-teal text-white">
            <div className="px-5 py-5 text-xs font-bold uppercase tracking-wider">Feature</div>
            <div className="relative px-3 py-5 text-center">
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-gold px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
                Best value
              </span>
              <span className="text-sm font-bold">Nature's Journey</span>
            </div>
            <div className="px-2 py-5 text-center text-xs font-medium text-white/70">Ro</div>
            <div className="px-2 py-5 text-center text-xs font-medium text-white/70">Hims &amp; Hers</div>
            <div className="px-2 py-5 text-center text-xs font-medium text-white/70">Medvi</div>
            <div className="px-2 py-5 text-center text-xs font-medium text-white/70">Brand-name</div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-[1.6fr_1fr_0.9fr_0.9fr_0.9fr_0.9fr] gap-0 items-center transition-colors ${
                i % 2 === 0 ? "bg-white" : "bg-cloud/20"
              } ${row.highlight ? "bg-emerald-50/40" : ""} hover:bg-emerald-50/60`}
            >
              <div className="px-5 py-4 text-sm font-medium text-navy leading-snug">
                {row.highlight && <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 align-middle" aria-hidden />}
                {row.feature}
              </div>
              <div className="px-3 py-4 text-center text-sm">
                <Cell value={row.us} us />
              </div>
              <div className="px-2 py-4 text-center text-sm text-graphite-500">
                <Cell value={row.ro} />
              </div>
              <div className="px-2 py-4 text-center text-sm text-graphite-500">
                <Cell value={row.hims} />
              </div>
              <div className="px-2 py-4 text-center text-sm text-graphite-500">
                <Cell value={row.medvi} />
              </div>
              <div className="px-2 py-4 text-center text-sm text-graphite-500">
                <Cell value={row.brand} />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-graphite-400">
          Competitor pricing and feature data compiled from publicly available sources as of {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}. Brand-name pricing reflects U.S. cash-pay retail for FDA-approved GLP-1s.
        </p>
      </SectionShell>
    </section>
  );
}
