"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  const { footer } = siteConfig.navigation;
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus("loading");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail, source: "footer_newsletter" }),
      });
      if (res.ok) {
        setNewsletterStatus("success");
        setNewsletterEmail("");
      } else {
        setNewsletterStatus("error");
      }
    } catch {
      setNewsletterStatus("error");
    }
  }

  return (
    <footer className="border-t border-navy-100/40 bg-navy">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal to-teal-500">
                <span className="text-sm font-bold text-white">VP</span>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">{siteConfig.name}</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-navy-300">
              {siteConfig.tagline}
            </p>
            <div className="mt-6 flex flex-col gap-2 text-sm text-navy-400">
              <a href={`mailto:${siteConfig.support.email}`} className="hover:text-white transition-colors">
                {siteConfig.support.email}
              </a>
              <a href={`tel:${siteConfig.support.phone}`} className="hover:text-white transition-colors">
                {siteConfig.support.phone}
              </a>
            </div>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-sm font-semibold text-white">Programs</h4>
            <ul className="mt-4 space-y-3">
              {footer.programs.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-navy-400 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white">Resources</h4>
            <ul className="mt-4 space-y-3">
              {footer.resources.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-navy-400 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white">Company</h4>
            <ul className="mt-4 space-y-3">
              {footer.company.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-navy-400 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white">Legal</h4>
            <ul className="mt-4 space-y-3">
              {footer.legal.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-navy-400 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter + CTA — captures non-buyer emails */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-teal/10 to-atlantic/10 border border-teal/20 p-8">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-lg font-bold text-white">Get the free GLP-1 Starter Guide</p>
              <p className="mt-2 text-sm text-navy-300">
                What to expect, foods that maximize results, and side effect tips — delivered to your inbox. Plus weekly weight loss insights.
              </p>
            </div>
            <div>
              {newsletterStatus === "success" ? (
                <div className="flex items-center gap-2 rounded-xl bg-teal/20 px-4 py-3">
                  <Check className="h-5 w-5 text-teal-300" />
                  <p className="text-sm text-white">Check your inbox! Your guide is on its way.</p>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 rounded-xl border border-teal/30 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal backdrop-blur-sm"
                  />
                  <Button type="submit" className="shrink-0 gap-1.5" disabled={newsletterStatus === "loading"}>
                    {newsletterStatus === "loading" ? "Sending..." : "Get Free Guide"}
                    {newsletterStatus !== "loading" && <ArrowRight className="h-4 w-4" />}
                  </Button>
                </form>
              )}
              {newsletterStatus === "error" && (
                <p className="mt-2 text-xs text-red-400">Something went wrong. Please try again.</p>
              )}
              <p className="mt-2 text-xs text-navy-500">
                No spam. Unsubscribe anytime. Or{" "}
                <Link href="/quiz" className="text-teal-400 hover:underline">
                  skip to the assessment &rarr;
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-16 border-t border-navy-700/50 pt-8">
          {/* Compliance disclaimer */}
          <p className="text-xs leading-relaxed text-navy-500 max-w-4xl">
            {siteConfig.compliance.shortDisclaimer}
          </p>

          {/* Bottom row */}
          <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-navy-500">
              &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-navy-500">
              <span>HIPAA Compliant</span>
              <span className="text-navy-700">|</span>
              <span>256-bit Encryption</span>
              <span className="text-navy-700">|</span>
              <span>Licensed Providers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
