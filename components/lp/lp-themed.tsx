/**
 * LP Themed Helper Components
 * Small utility components that consume LP theme CSS variables.
 */

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Gradient text span using --lp-accent-from/to */
export function LpGradientText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn("bg-clip-text text-transparent", className)}
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--lp-accent-from), var(--lp-accent-to))",
      }}
    >
      {children}
    </span>
  );
}

/** Hero section with themed gradient background */
export function LpHeroSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn("py-14 sm:py-20", className)}
      style={{
        background:
          "linear-gradient(to bottom, var(--lp-hero-from), var(--lp-hero-via), var(--lp-hero-to))",
      }}
    >
      {children}
    </section>
  );
}

/** CTA section with themed gradient background */
export function LpCtaBgSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn("py-14", className)}
      style={{
        background:
          "linear-gradient(to right, var(--lp-cta-from), var(--lp-cta-to))",
      }}
    >
      {children}
    </section>
  );
}

/** Themed badge component */
export function LpThemedBadge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
        className
      )}
      style={{
        backgroundColor: "var(--lp-badge-bg)",
        color: "var(--lp-badge-text)",
        borderWidth: "1px",
        borderColor: "var(--lp-badge-border)",
      }}
    >
      {children}
    </span>
  );
}

/** Icon container with themed background */
export function LpIconBox({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-xl",
        className
      )}
      style={{ backgroundColor: "var(--lp-icon-bg)" }}
    >
      {children}
    </div>
  );
}
