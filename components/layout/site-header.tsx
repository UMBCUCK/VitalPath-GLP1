"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchDialog } from "@/components/layout/search-dialog";
import { siteConfig } from "@/lib/site";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-navy-100/40 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal to-atlantic">
            <span className="text-sm font-bold text-white">VP</span>
          </div>
          <span className="text-lg font-bold text-navy tracking-tight">{siteConfig.name}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {siteConfig.navigation.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-graphite-600 transition-colors hover:bg-navy-50 hover:text-navy"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <SearchDialog />
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/quiz" onClick={() => track(ANALYTICS_EVENTS.CTA_CLICK, { location: "header", target: "/quiz" })}>
            <Button size="sm">Get Started</Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="flex items-center justify-center rounded-lg p-2 text-graphite-600 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      <div
        className={cn(
          "overflow-hidden border-t border-navy-100/40 bg-white transition-all duration-300 md:hidden",
          mobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4">
          {siteConfig.navigation.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-graphite-600 transition-colors hover:bg-navy-50"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-navy-100/40 pt-3">
            <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/quiz" onClick={() => { track(ANALYTICS_EVENTS.CTA_CLICK, { location: "header_mobile", target: "/quiz" }); setMobileOpen(false); }}>
              <Button className="w-full">Get Started</Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
