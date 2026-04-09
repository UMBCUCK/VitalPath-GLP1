"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionShell } from "@/components/shared/section-shell";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const passwordChecks = [
    { label: "At least 8 characters", valid: form.password.length >= 8 },
    { label: "Contains a number", valid: /\d/.test(form.password) },
    { label: "Contains uppercase", valid: /[A-Z]/.test(form.password) },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      router.push("/dashboard");
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal to-atlantic">
              <span className="text-sm font-bold text-white">VP</span>
            </div>
            <span className="text-xl font-bold text-navy tracking-tight">VitalPath</span>
          </Link>
          <h1 className="text-2xl font-bold text-navy">Create your account</h1>
          <p className="mt-2 text-sm text-graphite-400">
            Join 18,000+ members on their weight management journey.
          </p>
          <div className="mt-3 flex items-center justify-center gap-1">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className="h-4 w-4 fill-gold text-gold" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ))}
            <span className="ml-1 text-xs text-graphite-400">4.9/5 from 2,400+ reviews</span>
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">First Name</label>
                <Input
                  value={form.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  placeholder="Jordan"
                  required
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">Last Name</label>
                <Input
                  value={form.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  placeholder="Smith"
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy mb-2">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
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
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="Create a password"
                  required
                  autoComplete="new-password"
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

              {form.password.length > 0 && (
                <div className="mt-2 space-y-1">
                  {passwordChecks.map((check) => (
                    <div key={check.label} className="flex items-center gap-2">
                      <div className={`flex h-4 w-4 items-center justify-center rounded-full ${
                        check.valid ? "bg-teal" : "bg-navy-200"
                      }`}>
                        {check.valid && <Check className="h-2.5 w-2.5 text-white" />}
                      </div>
                      <span className={`text-xs ${check.valid ? "text-teal-700" : "text-graphite-400"}`}>
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full mt-6 gap-2" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </Button>

          <p className="mt-4 text-center text-xs text-graphite-300">
            By creating an account, you agree to our{" "}
            <Link href="/legal/terms" className="underline hover:text-navy">Terms</Link> and{" "}
            <Link href="/legal/privacy" className="underline hover:text-navy">Privacy Policy</Link>.
          </p>

          <p className="mt-4 text-center text-sm text-graphite-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-teal hover:underline">
              Sign In
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
