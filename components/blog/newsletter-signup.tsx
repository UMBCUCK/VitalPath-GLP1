"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "blog_lead_magnet" }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || "Something went wrong");
      }

      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  return (
    <section className="py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-teal to-atlantic px-8 py-10 sm:px-12 flex flex-col sm:flex-row items-center gap-6">
          {/* Copy */}
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-100 mb-1">Free Resource</p>
            <h3 className="text-xl font-bold text-white sm:text-2xl">Get our free GLP-1 Starter Guide</h3>
            <p className="mt-1 text-sm text-teal-100">Everything you need to know before starting — in one clear PDF.</p>
          </div>

          {/* Form */}
          <div className="w-full sm:w-auto sm:min-w-[340px]">
            {status === "success" ? (
              <div className="flex items-center gap-2 rounded-xl bg-white/20 px-5 py-3 text-sm font-semibold text-white">
                <CheckCircle className="h-5 w-5 text-teal-200" />
                Guide sent! Check your inbox.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 rounded-xl border-0 bg-white/20 px-4 py-3 text-sm text-white placeholder:text-teal-200 focus:outline-none focus:ring-2 focus:ring-white/40"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-5 py-3 text-sm font-bold text-teal hover:bg-teal-50 transition-colors disabled:opacity-60 shrink-0"
                >
                  {status === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>Send me the guide <ArrowRight className="h-3.5 w-3.5" /></>
                  )}
                </button>
              </form>
            )}
            {status === "error" && (
              <p className="mt-1.5 text-xs text-red-200">{errorMsg}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
