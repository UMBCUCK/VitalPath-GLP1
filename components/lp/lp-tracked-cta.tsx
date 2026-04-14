"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

interface LpTrackedCtaProps {
  location: string;
  label?: string;
  href?: string;
  variant?: "default" | "outline";
  className?: string;
}

export function LpTrackedCta({
  location,
  label = "See If I Qualify — Free Assessment",
  href = "/qualify",
  variant = "default",
  className,
}: LpTrackedCtaProps) {
  return (
    <Link
      href={href}
      onClick={() =>
        track(ANALYTICS_EVENTS.CTA_CLICK, {
          cta: "qualify",
          location,
          target: href,
        })
      }
    >
      <Button
        size="xl"
        variant={variant}
        className={`gap-2 px-12 h-16 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] ${className || ""}`}
      >
        {label} <ArrowRight className="h-5 w-5" />
      </Button>
    </Link>
  );
}
