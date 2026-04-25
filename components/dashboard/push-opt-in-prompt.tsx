"use client";

/**
 * PushOptInPrompt
 * ─────────────────────────────────────────────────────────────
 * Tier 4.4 — Shown 10s after /success loads.
 * Offers text-speed notifications for: provider replies, shipping
 * updates, refill reminders, and check-in prompts.
 *
 * Flow:
 *   1. Check browser capability + current permission state
 *   2. Show card if permission == "default" and not dismissed
 *   3. On accept → request Notification permission → if granted,
 *      register the service worker subscription and POST to
 *      /api/push/subscribe (existing endpoint)
 *   4. Silent fallback: if anything fails, we just close the card.
 *      Push is a nice-to-have; we never block the page on it.
 */
import { useEffect, useState } from "react";
import { Bell, X, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";

export function PushOptInPrompt() {
  const [show, setShow] = useState(false);
  const [state, setState] = useState<"idle" | "requesting" | "granted" | "denied" | "unsupported">("idle");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("push-opt-in-dismissed")) return;

    // Feature detection — skip entirely if the browser doesn't support push
    if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      setState("unsupported");
      return;
    }
    // Already granted or denied — skip the prompt (don't ask again)
    if (Notification.permission !== "default") {
      setState(Notification.permission as "granted" | "denied");
      return;
    }

    // Don't ask on visit #1 or #2 (low yield + trains users to dismiss).
    // Persistent cooldown across sessions: 7 days between asks.
    const VISIT_KEY = "push-opt-in-visit-count";
    const LAST_SHOWN_KEY = "push-opt-in-last-shown-at";
    const VISITS_REQUIRED = 3;
    const COOLDOWN_DAYS = 7;
    const visits = parseInt(localStorage.getItem(VISIT_KEY) || "0", 10) + 1;
    localStorage.setItem(VISIT_KEY, String(visits));
    if (visits < VISITS_REQUIRED) return;
    const lastShownAt = parseInt(localStorage.getItem(LAST_SHOWN_KEY) || "0", 10);
    const daysSince = lastShownAt ? (Date.now() - lastShownAt) / 86_400_000 : Infinity;
    if (daysSince < COOLDOWN_DAYS) return;

    // Reveal after 10s
    const timer = setTimeout(() => {
      setShow(true);
      localStorage.setItem(LAST_SHOWN_KEY, String(Date.now()));
      track("push_opt_in_view", { visits });
    }, 10_000);
    return () => clearTimeout(timer);
  }, []);

  async function handleAccept() {
    setState("requesting");
    track("push_opt_in_accept");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState("denied");
        handleDismiss();
        return;
      }

      // Register service worker + subscribe to push
      // If no SW is registered yet, /sw.js should be wired by the app shell.
      // Gracefully swallow errors — success confirmation is what matters.
      const reg = await navigator.serviceWorker.ready.catch(() => null);
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (reg && vapidKey) {
        try {
          // Create a fresh ArrayBuffer-backed Uint8Array so the type aligns
          // with BufferSource (modern lib.dom.d.ts requires non-SAB buffers).
          const keyBytes = urlBase64ToUint8Array(vapidKey);
          const subscription = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: keyBytes.buffer.slice(
              keyBytes.byteOffset,
              keyBytes.byteOffset + keyBytes.byteLength,
            ) as ArrayBuffer,
          });
          await fetch("/api/push/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              endpoint: subscription.endpoint,
              keys: subscription.toJSON().keys,
              deviceInfo: navigator.userAgent,
            }),
          });
        } catch {
          // Continue — permission was granted, next load can complete subscription
        }
      }
      setState("granted");
      // Auto-hide after a short success state
      setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("push-opt-in-dismissed", "granted");
      }, 2500);
    } catch {
      setState("idle");
    }
  }

  function handleDismiss() {
    setShow(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("push-opt-in-dismissed", "1");
    }
    track("push_opt_in_dismiss");
  }

  if (!show || state === "unsupported") return null;

  return (
    <div
      role="region"
      aria-labelledby="push-opt-in-title"
      className="fixed left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md rounded-2xl border border-navy-100/60 bg-white shadow-premium-xl animate-fade-in-up bottom-[calc(env(safe-area-inset-bottom,0px)+6rem)] sm:bottom-6"
    >
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-3 rounded-lg p-1.5 text-graphite-400 hover:bg-navy-50 hover:text-navy transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
      {state === "granted" ? (
        <div className="p-5 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-teal">
            <Check className="h-5 w-5 text-white" />
          </div>
          <p className="mt-3 text-sm font-bold text-navy">You&apos;re all set</p>
          <p className="mt-1 text-xs text-graphite-500">
            We&apos;ll ping you the moment your provider replies or your medication ships.
          </p>
        </div>
      ) : (
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal to-atlantic text-white">
              <Bell className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p id="push-opt-in-title" className="text-sm font-bold text-navy">
                Text-speed updates from your care team
              </p>
              <p className="mt-1 text-xs text-graphite-500 leading-relaxed">
                Get push notifications the moment your provider replies, your
                medication ships, or your refill is due. No marketing spam.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] text-graphite-500">
                {["Provider replies", "Shipping updates", "Refill reminders", "Check-ins"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 rounded-full bg-navy-50 px-2 py-0.5">
                    <Zap className="h-2.5 w-2.5 text-teal" />
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="emerald"
                  className="gap-1"
                  disabled={state === "requesting"}
                  onClick={handleAccept}
                >
                  {state === "requesting" ? "Enabling..." : "Enable notifications"}
                </Button>
                <button
                  onClick={handleDismiss}
                  className="text-xs text-graphite-400 hover:text-navy transition-colors"
                >
                  Not now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Web Push helper ─────────────────────────────────────────
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = typeof window !== "undefined" ? window.atob(base64) : "";
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) output[i] = rawData.charCodeAt(i);
  return output;
}
