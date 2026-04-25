"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Shield, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionShell } from "@/components/shared/section-shell";
import { LeafIcon } from "@/components/layout/brand-logo";
import { siteConfig } from "@/lib/site";

// Tier 13.4 — error-message map for failed magic-link redirects from
// /api/auth/magic-link/verify. Friendly copy keeps users from refreshing
// and burning through magic links.
const ERROR_COPY: Record<string, string> = {
  link_invalid: "That sign-in link looks malformed. Please request a new one.",
  link_expired: "That sign-in link has expired. Sign-in links are valid for 15 minutes — please request a new one.",
  link_user_missing: "We couldn't find your account. If you completed an intake recently, try the email-link option below.",
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect") || "/dashboard";

  // Tier 13.4 — tabbed login: password (default) vs magic-link
  const [mode, setMode] = useState<"password" | "magic">("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [magicSent, setMagicSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Surface verify-flow error messages in the UI (e.g. ?error=link_expired)
  useEffect(() => {
    const e = searchParams?.get("error");
    if (e && ERROR_COPY[e]) setError(ERROR_COPY[e]);
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "magic") {
      try {
        await fetch("/api/auth/magic-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, redirect }),
        });
        // Always show success state — anti-enumeration design
        setMagicSent(true);
      } catch {
        setError("Couldn't send the link right now. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      const destination = data.user?.role === "ADMIN" ? "/admin" : redirect;
      router.push(destination);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-cloud to-sage/20 flex items-center justify-center py-12">
      <SectionShell className="max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <LeafIcon className="h-10 w-10" />
            <span className="text-xl font-bold text-navy tracking-tight">{siteConfig.name}</span>
          </Link>
          <h1 className="text-2xl font-bold text-navy">Welcome back</h1>
          <p className="mt-2 text-sm text-graphite-400">
            Sign in to access your dashboard and treatment plan.
          </p>
          <div className="mt-3 flex items-center justify-center gap-1">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className="h-4 w-4 fill-gold text-gold" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ))}
            <span className="ml-1 text-xs text-graphite-400">Trusted by 18,000+ members</span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium-md sm:p-8"
        >
          {/* Tier 13.4 — tab switcher: passwordless (default, OpenLoop-aware) vs password */}
          <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-navy-50/50 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("magic");
                setError("");
                setMagicSent(false);
              }}
              className={`rounded-lg py-2 text-sm font-semibold transition-all ${
                mode === "magic"
                  ? "bg-white text-navy shadow-sm"
                  : "text-graphite-400 hover:text-navy"
              }`}
            >
              Email me a link
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("password");
                setError("");
                setMagicSent(false);
              }}
              className={`rounded-lg py-2 text-sm font-semibold transition-all ${
                mode === "password"
                  ? "bg-white text-navy shadow-sm"
                  : "text-graphite-400 hover:text-navy"
              }`}
            >
              Password
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {magicSent ? (
            // Magic-link sent confirmation — anti-enumeration: always shown,
            // even if the email isn't recognized.
            <div className="rounded-xl border border-teal-100 bg-teal-50/60 px-5 py-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal">
                <Check className="h-6 w-6 text-white" />
              </div>
              <p className="mt-3 text-sm font-bold text-navy">Check your inbox</p>
              <p className="mt-1 text-xs text-graphite-500 leading-relaxed">
                If <strong>{email}</strong> is connected to a Nature&apos;s Journey
                or OpenLoop patient record, a sign-in link is on the way.
                Links expire in 15 minutes.
              </p>
              <button
                type="button"
                onClick={() => {
                  setMagicSent(false);
                  setError("");
                }}
                className="mt-4 text-xs font-semibold text-teal hover:underline"
              >
                Didn&apos;t get it? Send another
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                  />
                </div>

                {mode === "password" && (
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">Password</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        autoComplete="current-password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-graphite-400 hover:text-navy transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full mt-6 gap-2" disabled={loading || !email}>
                {loading
                  ? mode === "magic" ? "Sending link..." : "Signing in..."
                  : mode === "magic" ? "Email Me a Sign-in Link" : "Sign In"}
                {!loading && (mode === "magic" ? <Mail className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />)}
              </Button>

              {mode === "magic" && (
                <p className="mt-3 text-center text-[11px] text-graphite-400 leading-relaxed">
                  Works whether or not you&apos;ve set a password. We&apos;ll match your
                  email to your Nature&apos;s Journey + OpenLoop patient record.
                </p>
              )}
            </>
          )}

          <p className="mt-6 text-center text-sm text-graphite-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-teal hover:underline">
              Get Started
            </Link>
          </p>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-graphite-300">
          <Shield className="h-3.5 w-3.5" />
          <span>HIPAA-compliant &middot; 256-bit encrypted</span>
        </div>
      </SectionShell>
    </div>
  );
}
