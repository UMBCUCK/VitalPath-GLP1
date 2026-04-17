import { Check, X } from "lucide-react";

interface ComparisonRow {
  feature: string;
  us: boolean | string;
  them: boolean | string;
}

interface LpComparisonTableProps {
  heading?: string;
  usLabel?: string;
  themLabel: string;
  rows: readonly ComparisonRow[];
  className?: string;
}

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="mx-auto h-5 w-5" style={{ color: "var(--lp-icon)" }} />
    ) : (
      <X className="mx-auto h-5 w-5 text-red-400" />
    );
  }
  return <span className="text-sm font-medium text-lp-heading">{value}</span>;
}

export function LpComparisonTable({
  heading = "How We Compare",
  usLabel = "Nature's Journey",
  themLabel,
  rows,
  className,
}: LpComparisonTableProps) {
  return (
    <section className={`py-14 ${className ?? ""}`}>
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="mb-8 text-center text-2xl font-bold text-lp-heading sm:text-3xl">
          {heading}
        </h2>

        <div
          className="overflow-hidden rounded-xl border"
          style={{ borderColor: "var(--lp-card-border)" }}
        >
          {/* Header row */}
          <div
            className="grid grid-cols-3 border-b text-center text-xs font-semibold uppercase tracking-wider"
            style={{
              borderColor: "var(--lp-card-border)",
              backgroundColor: "var(--lp-section-alt)",
            }}
          >
            <div className="p-3 text-left text-lp-body-muted">Feature</div>
            <div className="p-3" style={{ color: "var(--lp-icon)" }}>{usLabel}</div>
            <div className="p-3 text-lp-body-muted">{themLabel}</div>
          </div>

          {/* Data rows */}
          {rows.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-3 border-b text-center last:border-b-0"
              style={{
                borderColor: "var(--lp-card-border)",
                backgroundColor: i % 2 === 0 ? "var(--lp-card-bg, #fff)" : "var(--lp-section-alt)",
              }}
            >
              <div className="p-3 text-left text-sm text-lp-body">{row.feature}</div>
              <div className="flex items-center justify-center p-3">
                <CellValue value={row.us} />
              </div>
              <div className="flex items-center justify-center p-3">
                <CellValue value={row.them} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
