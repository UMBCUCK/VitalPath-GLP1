"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

interface Props {
  label: string;
  priceLabel?: string;
  href?: string;
  analyticsPage: string;
}

export function LandingStickyCta({
  label,
  priceLabel = "from $179/mo",
  href = "/qualify",
  analyticsPage,
}: Props) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const vh = window.innerHeight;
      setShow(scrolled > vh * 0.9);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-3 transition-all duration-300 lg:hidden ${
        show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
      aria-hidden={!show}
    >
      <div className="pointer-events-auto flex w-full max-w-md items-center gap-2 rounded-2xl border border-navy-100/60 bg-white/95 p-2.5 shadow-premium-lg backdrop-blur-md">
        <div className="flex-1 px-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-graphite-400">
            Plans {priceLabel}
          </div>
          <div className="text-sm font-bold text-navy leading-tight">{label}</div>
        </div>
        <Link
          href={href}
          onClick={() =>
            track(ANALYTICS_EVENTS.CTA_CLICK, { cta: "lp_sticky_cta", location: analyticsPage })
          }
          className="shrink-0"
        >
          <Button variant="emerald" className="gap-1.5 rounded-full px-5 h-11 text-sm">
            See If I Qualify
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-graphite-400 transition-colors hover:bg-navy-50 hover:text-navy"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
