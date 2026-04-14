import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

interface LpHeaderProps {
  badgeText: string;
  badgeIcon: LucideIcon;
  badgeIconColor?: string;
}

export function LpHeader({ badgeText, badgeIcon: BadgeIcon, badgeIconColor }: LpHeaderProps) {
  return (
    <header
      className="border-b bg-[var(--lp-card-bg,#fff)]"
      style={{ borderColor: "var(--lp-card-border)" }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{
              background:
                "linear-gradient(to bottom right, var(--lp-logo-from), var(--lp-logo-to))",
            }}
          >
            <span className="text-xs font-bold text-white">NJ</span>
          </div>
          <span className="text-sm font-bold text-lp-heading">
            Nature&apos;s Journey
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <Badge
            variant="outline"
            className="text-xs gap-1"
            style={{
              backgroundColor: "var(--lp-badge-bg)",
              color: "var(--lp-badge-text)",
              borderColor: "var(--lp-badge-border)",
            }}
          >
            <BadgeIcon
              className={`h-3 w-3 ${badgeIconColor ?? ""}`}
              style={
                badgeIconColor
                  ? undefined
                  : { color: "var(--lp-icon)" }
              }
            />{" "}
            {badgeText}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-lp-body-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>HIPAA Compliant</span>
          </div>
        </div>
      </div>
    </header>
  );
}
