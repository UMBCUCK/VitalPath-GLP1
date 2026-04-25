"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/utils";

// Routes where users are already in a conversion flow — a generic
// "Start Free Assessment" CTA confuses or conflicts with the page's own
// primary action (order summary, payment submit, login, etc).
const HIDDEN_PATHS = [
  "/checkout",
  "/qualify",
  "/quiz",
  "/intake",
  "/success",
  "/login",
  "/register",
  "/dashboard",
  "/admin",
  "/provider",
  "/reseller",
];

function MobileStickyCtaInner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // rAF-throttled scroll listener — coalesces multiple scroll events into
    // one paint frame, preventing setState storms during fast scroll on
    // mobile (the kind that drop frames on iOS Safari).
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > 200);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname && HIDDEN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 border-t border-navy-100/40 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-all duration-300 md:hidden",
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      )}
    >
      <div className="flex items-center gap-3 max-w-full">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-navy truncate">From $179/mo</p>
          <p className="text-[11px] text-graphite-400 truncate">
            <span className="line-through">$1,349</span> retail &middot; Save 79%
          </p>
        </div>
        <Link
          href="/qualify"
          onClick={() => track(ANALYTICS_EVENTS.CTA_CLICK, { location: "mobile_sticky", target: "/qualify" })}
          className="shrink-0"
        >
          <Button variant="emerald" size="default" className="shrink-0 gap-1.5 px-4 rounded-full whitespace-nowrap active:scale-[0.97]">
            Start Free
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export const MobileStickyCta = memo(MobileStickyCtaInner);
