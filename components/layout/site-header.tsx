"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchDialog } from "@/components/layout/search-dialog";
import { BrandLogo } from "@/components/layout/brand-logo";
import { siteConfig } from "@/lib/site";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/utils";

// TEMP preview directory — all landing pages grouped for quick QA access.
// Remove (or gate behind ADMIN) before public launch.
const LP_GROUPS = [
  {
    category: "By Condition",
    pages: [
      { label: "Belly Fat", slug: "belly-fat" },
      { label: "PCOS", slug: "pcos" },
      { label: "Menopause", slug: "menopause" },
      { label: "Postpartum", slug: "postpartum" },
      { label: "Medical Weight Management", slug: "medical-weight-management" },
    ],
  },
  {
    category: "By Audience",
    pages: [
      { label: "Men", slug: "men" },
      { label: "Women", slug: "women" },
      { label: "Women (Every Phase)", slug: "women-weight-loss" },
      { label: "Over 40", slug: "over40" },
      { label: "Over 50", slug: "over50" },
    ],
  },
  {
    category: "By Medication",
    pages: [
      { label: "GLP-1 (Overview)", slug: "glp1" },
      { label: "Semaglutide", slug: "semaglutide" },
      { label: "Tirzepatide", slug: "tirzepatide" },
      { label: "Ozempic Alternative", slug: "ozempic-alternative" },
      { label: "Wegovy Alternative", slug: "wegovy-alternative" },
      { label: "Mounjaro Alternative", slug: "mounjaro-alternative" },
      { label: "Zepbound Alternative", slug: "zepbound-alternative" },
    ],
  },
  {
    category: "Life Events",
    pages: [
      { label: "After Breakup", slug: "after-breakup" },
      { label: "After Divorce", slug: "after-divorce" },
      { label: "Before Wedding", slug: "before-wedding" },
      { label: "Empty Nester", slug: "empty-nester" },
      { label: "Reunion", slug: "reunion" },
    ],
  },
  {
    category: "Clinical",
    pages: [
      { label: "Pre-Diabetes", slug: "pre-diabetes" },
      { label: "Sleep Apnea", slug: "sleep-apnea" },
      { label: "Blood Pressure", slug: "blood-pressure" },
      { label: "Fatty Liver", slug: "fatty-liver" },
    ],
  },
  {
    category: "Other Angles",
    pages: [
      { label: "Affordable", slug: "affordable" },
      { label: "No Surgery", slug: "no-surgery" },
      { label: "Telehealth", slug: "telehealth" },
    ],
  },
] as const;

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lpDesktopOpen, setLpDesktopOpen] = useState(false);
  const [lpMobileOpen, setLpMobileOpen] = useState(false);
  const lpDesktopRef = useRef<HTMLDivElement>(null);

  // Close desktop LP dropdown on click outside or Escape
  useEffect(() => {
    if (!lpDesktopOpen) return;
    function onDocClick(e: MouseEvent) {
      if (lpDesktopRef.current && !lpDesktopRef.current.contains(e.target as Node)) {
        setLpDesktopOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLpDesktopOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [lpDesktopOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-navy-100/40 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <BrandLogo />
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

          {/* TEMP: Landing Pages dropdown — QA preview directory */}
          <div className="relative" ref={lpDesktopRef}>
            <button
              type="button"
              onClick={() => setLpDesktopOpen((v) => !v)}
              aria-expanded={lpDesktopOpen}
              aria-haspopup="true"
              className={cn(
                "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-graphite-600 transition-colors hover:bg-navy-50 hover:text-navy",
                lpDesktopOpen && "bg-navy-50 text-navy"
              )}
            >
              Landing Pages
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform",
                  lpDesktopOpen && "rotate-180"
                )}
              />
            </button>

            {lpDesktopOpen && (
              <div className="absolute left-1/2 top-full mt-2 w-[min(980px,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-navy-100/60 bg-white p-5 shadow-2xl">
                <div className="grid grid-cols-2 gap-x-5 gap-y-5 md:grid-cols-3 lg:grid-cols-6">
                  {LP_GROUPS.map((group) => (
                    <div key={group.category}>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-graphite-400">
                        {group.category}
                      </p>
                      <ul className="space-y-1">
                        {group.pages.map((p) => (
                          <li key={p.slug}>
                            <Link
                              href={`/lp/${p.slug}`}
                              onClick={() => setLpDesktopOpen(false)}
                              className="block rounded-md px-2 py-1.5 text-sm text-graphite-600 transition-colors hover:bg-teal-50 hover:text-navy"
                            >
                              {p.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <p className="mt-4 border-t border-navy-100/40 pt-3 text-[10px] text-graphite-400">
                  QA preview directory — {LP_GROUPS.reduce((n, g) => n + g.pages.length, 0)} landing pages. Remove before public launch.
                </p>
              </div>
            )}
          </div>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <SearchDialog />
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/qualify" onClick={() => track(ANALYTICS_EVENTS.CTA_CLICK, { location: "header", target: "/qualify" })}>
            <Button variant="emerald" size="sm" className="rounded-full px-5">Get Started</Button>
          </Link>
        </div>

        {/* Mobile menu button — 44px touch target */}
        <button
          className="flex h-11 w-11 items-center justify-center rounded-lg text-graphite-600 hover:bg-navy-50 active:bg-navy-100 transition-colors md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav — iOS momentum scroll, no parent overflow-hidden fight */}
      <div
        className={cn(
          "border-t border-navy-100/40 bg-white transition-all duration-300 md:hidden [-webkit-overflow-scrolling:touch]",
          mobileOpen ? "max-h-[calc(100vh-4rem)] overflow-y-auto opacity-100" : "max-h-0 overflow-hidden opacity-0"
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

          {/* TEMP: Mobile Landing Pages collapsible */}
          <button
            type="button"
            onClick={() => setLpMobileOpen((v) => !v)}
            aria-expanded={lpMobileOpen}
            className="flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium text-graphite-600 transition-colors hover:bg-navy-50"
          >
            Landing Pages
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                lpMobileOpen && "rotate-180"
              )}
            />
          </button>
          {lpMobileOpen && (
            <div className="pl-3">
              {LP_GROUPS.map((group) => (
                <div key={group.category} className="mb-2">
                  <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-graphite-400">
                    {group.category}
                  </p>
                  {group.pages.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/lp/${p.slug}`}
                      onClick={() => {
                        setLpMobileOpen(false);
                        setMobileOpen(false);
                      }}
                      className="block rounded-md px-3 py-2.5 text-sm text-graphite-600 transition-colors hover:bg-teal-50"
                    >
                      {p.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 flex flex-col gap-2 border-t border-navy-100/40 pt-3">
            <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/qualify" onClick={() => { track(ANALYTICS_EVENTS.CTA_CLICK, { location: "header_mobile", target: "/qualify" }); setMobileOpen(false); }}>
              <Button variant="emerald" className="w-full rounded-full">Get Started</Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
