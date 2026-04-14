"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function MobileStickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 border-t border-navy-100/40 bg-white/95 backdrop-blur-xl px-4 py-3 transition-all duration-300 md:hidden",
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-navy">From $279/mo</p>
          <p className="text-xs text-graphite-400">
            <span className="line-through">$1,349</span> retail &middot; Save 79%
          </p>
        </div>
        <Link href="/qualify" onClick={() => track(ANALYTICS_EVENTS.CTA_CLICK, { location: "mobile_sticky", target: "/qualify" })}>
          <Button variant="emerald" size="sm" className="shrink-0 gap-1.5 px-5 rounded-full">
            Start Free Assessment
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
