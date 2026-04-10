"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Shield, Lock, UserCheck, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeafIcon } from "@/components/layout/brand-logo";
import { siteConfig } from "@/lib/site";

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

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
    <footer className="border-t border-navy-100/40 bg-navy" aria-label="Site footer">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        {/* Top section */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand + Contact */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5" aria-label="Nature's Journey home">
              <LeafIcon className="h-9 w-9" />
              <span className="text-lg font-bold text-white tracking-tight">{siteConfig.name}</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-navy-300">{siteConfig.tagline}</p>

            <div className="mt-6 flex flex-col gap-2 text-sm text-navy-400">
              <a href={`mailto:${siteConfig.support.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {siteConfig.support.email}
              </a>
              <a href={`tel:${siteConfig.support.phone}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {siteConfig.support.phone}
              </a>
              <span className="flex items-start gap-2 text-navy-500">
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                <span>Nature&apos;s Journey Health, LLC<br />1209 Orange St, Wilmington, DE 19801</span>
              </span>
            </div>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href={siteConfig.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-navy-400 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Nature's Journey on X (Twitter)"
              >
                <TwitterIcon className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-navy-400 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Nature's Journey on Instagram"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com/naturesjourneyhealth"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-navy-400 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Nature's Journey on Facebook"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Programs */}
          <div>
            <h2 className="text-sm font-semibold text-white">Programs</h2>
            <ul className="mt-4 space-y-3" role="list">
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
            <h2 className="text-sm font-semibold text-white">Resources</h2>
            <ul className="mt-4 space-y-3" role="list">
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
            <h2 className="text-sm font-semibold text-white">Company</h2>
            <ul className="mt-4 space-y-3" role="list">
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
            <h2 className="text-sm font-semibold text-white">Legal & Privacy</h2>
            <ul className="mt-4 space-y-3" role="list">
              {footer.legal.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-navy-400 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/legal/baa" className="text-sm text-navy-400 transition-colors hover:text-white">
                  Business Associate Agreement
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-sm text-navy-400 transition-colors hover:text-white">
                  Accessibility
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="text-sm text-navy-400 transition-colors hover:text-white">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust badges row */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 border-y border-navy-700/50 py-8">
          <div className="flex items-center gap-2 text-xs text-navy-400">
            <Shield className="h-4 w-4 text-teal-400" aria-hidden="true" />
            <span>HIPAA Compliant</span>
          </div>
          <div className="h-4 w-px bg-navy-700 hidden sm:block" />
          <div className="flex items-center gap-2 text-xs text-navy-400">
            <Lock className="h-4 w-4 text-teal-400" aria-hidden="true" />
            <span>256-bit SSL Encryption</span>
          </div>
          <div className="h-4 w-px bg-navy-700 hidden sm:block" />
          <div className="flex items-center gap-2 text-xs text-navy-400">
            <UserCheck className="h-4 w-4 text-teal-400" aria-hidden="true" />
            <span>Board-Certified Providers</span>
          </div>
          <div className="h-4 w-px bg-navy-700 hidden sm:block" />
          <div className="flex items-center gap-2 text-xs text-navy-400">
            <svg className="h-4 w-4 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            <span>Licensed Compounding Pharmacies</span>
          </div>
          <div className="h-4 w-px bg-navy-700 hidden sm:block" />
          <div className="flex items-center gap-2 text-xs text-navy-400">
            <svg className="h-4 w-4 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
            <span>Secure Payment via Stripe</span>
          </div>
        </div>

        {/* Newsletter + CTA */}
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
                <form onSubmit={handleNewsletter} className="flex gap-2" aria-label="Newsletter signup">
                  <label htmlFor="footer-email" className="sr-only">Email address</label>
                  <input
                    id="footer-email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
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
                By subscribing you consent to receive marketing emails. Unsubscribe anytime.{" "}
                <Link href="/legal/privacy" className="text-teal-400 hover:underline">Privacy Policy</Link>.{" "}
                Or{" "}
                <Link href="/qualify" className="text-teal-400 hover:underline">
                  skip to the assessment &rarr;
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-navy-700/50 pt-8">
          {/* Compliance disclaimer */}
          <p className="text-xs leading-relaxed text-navy-500 max-w-4xl">
            {siteConfig.compliance.shortDisclaimer}{" "}
            Nature&apos;s Journey Health facilitates access to independent, licensed healthcare providers and does not practice medicine. GLP-1 medications are only dispensed pursuant to a valid prescription from a licensed provider following a clinical evaluation.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-navy-600 max-w-4xl">
            *Average weight loss based on clinical trial data for semaglutide and tirzepatide. Individual results vary significantly based on adherence, diet, exercise, and individual health factors. Not all patients achieve these results. Compounded medications are not FDA-approved drug products.
          </p>

          {/* Bottom row */}
          <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-xs text-navy-500">
              &copy; {new Date().getFullYear()} Nature&apos;s Journey Health, LLC. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-navy-500">
              <Link href="/legal/terms" className="hover:text-navy-300 transition-colors">Terms</Link>
              <span className="text-navy-700">·</span>
              <Link href="/legal/privacy" className="hover:text-navy-300 transition-colors">Privacy</Link>
              <span className="text-navy-700">·</span>
              <Link href="/legal/hipaa" className="hover:text-navy-300 transition-colors">HIPAA</Link>
              <span className="text-navy-700">·</span>
              <Link href="/accessibility" className="hover:text-navy-300 transition-colors">Accessibility</Link>
              <span className="text-navy-700">·</span>
              <Link href="/sitemap.xml" className="hover:text-navy-300 transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
