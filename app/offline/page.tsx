import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff, RefreshCw } from "lucide-react";

export const metadata: Metadata = {
  title: "You're offline",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b from-cloud to-white px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-50">
        <WifiOff className="h-8 w-8 text-navy" aria-hidden="true" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-navy sm:text-3xl">You&apos;re offline</h1>
      <p className="mt-3 max-w-md text-sm text-graphite-500 sm:text-base">
        We can&apos;t reach the network right now. Check your connection and try
        again — pages you&apos;ve already visited may still be available.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald px-8 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(5,150,105,0.35)] hover:brightness-110"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Try again
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex h-12 items-center justify-center rounded-full border border-navy-200 px-8 text-sm font-semibold text-navy hover:bg-navy-50"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
