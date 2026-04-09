"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/shared/section-shell";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Error Boundary]", error);
  }, [error]);

  return (
    <section className="min-h-[60vh] flex items-center justify-center py-20">
      <SectionShell className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-8 w-8 text-red-400" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-navy">Something went wrong</h1>
        <p className="mt-3 text-sm text-graphite-400">
          We encountered an unexpected error. Our team has been notified.
          Please try again or return to the homepage.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Go Home
            </Button>
          </Link>
        </div>
        {error.digest && (
          <p className="mt-6 text-xs text-graphite-300">Error ID: {error.digest}</p>
        )}
      </SectionShell>
    </section>
  );
}
