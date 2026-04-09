"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function StickyDesktopCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show after scrolling past hero (~700px)
      setVisible(window.scrollY > 700);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-30 hidden border-b border-navy-100/40 bg-white/95 backdrop-blur-xl transition-all duration-300 md:block",
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}
      // Sits behind the main header (z-50) but above content
      style={{ top: "64px" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
            ))}
            <span className="ml-1 text-xs font-semibold text-navy">4.9</span>
            <span className="text-xs text-graphite-400">(2,400+ reviews)</span>
          </div>
          <div className="h-4 w-px bg-navy-100" />
          <span className="text-xs text-graphite-500">
            GLP-1 weight loss from{" "}
            <span className="font-bold text-navy">$279/mo</span>
            <span className="ml-1 text-graphite-400 line-through">$1,349</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-teal">Save 79%</span>
          <Link href="/quiz" onClick={() => track(ANALYTICS_EVENTS.CTA_CLICK, { location: "sticky_desktop", target: "/quiz" })}>
            <Button size="sm" className="gap-1.5 shadow-glow">
              See If I Qualify
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
