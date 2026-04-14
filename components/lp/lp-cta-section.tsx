import Link from "next/link";
import { ArrowRight, ShieldCheck, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LpCtaSectionProps {
  headline: string;
  description?: string;
  bgClassName?: string;
}

export function LpCtaSection({
  headline,
  description = "Free 2-minute assessment. Provider reviews typically within 1 business day. Medication ships free if prescribed.",
  bgClassName,
}: LpCtaSectionProps) {
  return (
    <section
      className={`py-14 ${bgClassName ?? ""}`}
      style={
        bgClassName
          ? undefined
          : {
              background:
                "linear-gradient(to right, var(--lp-cta-from), var(--lp-cta-to))",
            }
      }
    >
      <div className="mx-auto max-w-xl px-4 text-center">
        <h2 className="text-2xl font-bold text-lp-heading">{headline}</h2>
        <p className="mt-3 text-sm text-lp-body-muted">{description}</p>
        <div className="mt-6">
          <Link href="/qualify">
            <Button
              size="xl"
              className="gap-2 px-12 h-14 text-lg"
              style={{
                backgroundColor: "var(--lp-btn-bg)",
                color: "var(--lp-btn-text)",
              }}
            >
              See If I Qualify <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-lp-body-muted">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> 30-day
            money-back guarantee
          </span>
          <span className="flex items-center gap-1">
            <Check className="h-3.5 w-3.5" style={{ color: "var(--lp-icon)" }} />{" "}
            No commitment required
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" style={{ color: "var(--lp-icon)" }} />{" "}
            Same-day evaluation
          </span>
        </div>
      </div>
    </section>
  );
}
