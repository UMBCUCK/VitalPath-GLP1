import { Star, Users, Truck } from "lucide-react";

export function LpSocialProofBar() {
  return (
    <section
      className="border-y py-3"
      style={{
        borderColor: "var(--lp-card-border)",
        backgroundColor: "var(--lp-section-alt)",
      }}
    >
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 px-4 text-xs text-lp-body">
        <span className="flex items-center gap-1">
          <Star className="h-3 w-3 text-gold fill-gold" /> Rated 4.9/5 by
          2,400+ members
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3" style={{ color: "var(--lp-icon)" }} /> 142
          started this week
        </span>
        <span className="flex items-center gap-1">
          <Truck className="h-3 w-3 text-lp-heading" /> Free 2-day shipping
        </span>
      </div>
    </section>
  );
}
