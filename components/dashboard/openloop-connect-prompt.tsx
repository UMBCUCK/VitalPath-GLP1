"use client";

/**
 * OpenLoopConnectPrompt
 * ─────────────────────────────────────────────────────────────
 * Tier 13.6 — Surfaces on the dashboard when a logged-in member has
 * no `telehealthPatientId` on their PatientProfile yet. One click
 * attempts to match the user to an existing OpenLoop patient by
 * their email address; if matched, persists the link so all
 * downstream provider views (treatment, messages, refills) light up.
 *
 * Self-fetches its own state from /api/auth/me on mount. Renders
 * nothing if the user is already linked or if a match isn't found
 * after they've explicitly tried to connect (we then suggest the
 * intake path instead).
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plug, Check, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { track } from "@/lib/analytics";

type ConnectState = "loading" | "connect" | "connecting" | "linked" | "no_match" | "hidden";

export function OpenLoopConnectPrompt() {
  const [state, setState] = useState<ConnectState>("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) {
          if (!cancelled) setState("hidden");
          return;
        }
        const data = (await res.json()) as {
          openloop?: { linked?: boolean };
        };
        if (cancelled) return;
        if (data.openloop?.linked) {
          setState("linked");
        } else {
          setState("connect");
        }
      } catch {
        if (!cancelled) setState("hidden");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleConnect() {
    setState("connecting");
    track("openloop_link_attempt");
    try {
      const res = await fetch("/api/auth/openloop-link", { method: "POST" });
      const data = (await res.json()) as { linked?: boolean; already_linked?: boolean };
      if (res.ok && (data.linked || data.already_linked)) {
        track("openloop_link_success");
        setState("linked");
        return;
      }
      track("openloop_link_no_match");
      setState("no_match");
    } catch {
      setState("no_match");
    }
  }

  // Don't show once linked — the dashboard will reflect the connection
  // through other components (treatment plan, messages, etc.)
  if (state === "loading" || state === "linked" || state === "hidden") {
    return null;
  }

  if (state === "no_match") {
    return (
      <Card className="border-amber-200 bg-amber-50/40">
        <CardContent className="flex items-start gap-4 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100">
            <AlertCircle className="h-5 w-5 text-amber-700" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-navy">
              We didn&apos;t find a matching provider record
            </p>
            <p className="mt-1 text-sm text-graphite-500 leading-relaxed">
              Your email isn&apos;t connected to an active OpenLoop patient yet.
              If you haven&apos;t completed an intake, that&apos;s the next step
              — your provider needs a profile before they can prescribe.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/qualify">
                <Button size="sm" variant="emerald" className="gap-1.5">
                  Complete intake
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link
                href="/dashboard/messages"
                className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold text-teal hover:underline"
              >
                Or message support
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // "connect" or "connecting"
  return (
    <Card className="border-teal-100 bg-gradient-to-r from-teal-50/40 to-sage/20">
      <CardContent className="flex items-start gap-4 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal text-white">
          <Plug className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-navy">
            Connect your provider record
          </p>
          <p className="mt-1 text-sm text-graphite-500 leading-relaxed">
            Link your member dashboard to your OpenLoop patient record so
            prescriptions, messages, and refill statuses sync automatically.
            One click — we match you by email.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <Button
              size="sm"
              variant="emerald"
              className="gap-1.5"
              onClick={handleConnect}
              disabled={state === "connecting"}
            >
              {state === "connecting" ? (
                "Connecting..."
              ) : (
                <>
                  Connect to OpenLoop
                  <Check className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
            <span className="text-[11px] text-graphite-400">
              HIPAA-compliant · 256-bit encrypted
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
