"use client";

import Link from "next/link";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import type { ReactNode } from "react";

interface TrackedLinkProps {
  href: string;
  cta: string;
  location: string;
  className?: string;
  children: ReactNode;
}

export function TrackedLink({ href, cta, location, className, children }: TrackedLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => track(ANALYTICS_EVENTS.CTA_CLICK, { cta, location })}
    >
      {children}
    </Link>
  );
}
