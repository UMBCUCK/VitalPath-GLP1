"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionShell } from "@/components/shared/section-shell";
import { LeafIcon } from "@/components/layout/brand-logo";
import { siteConfig } from "@/lib/site";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

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
    <div className="min-h-screen bg-gradient-to-b from-cloud to-sage/20 flex items-center justify-center py-12">
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
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

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
          </div>

          <Button type="submit" size="lg" className="w-full mt-6 gap-2" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </Button>

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
