"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, MessageCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Dashboard Error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
          <AlertTriangle className="h-8 w-8 text-amber-500" />
        </div>

        <h2 className="mt-6 text-xl font-bold text-navy">
          Something went wrong
        </h2>

        <p className="mt-3 text-sm text-graphite-400 leading-relaxed">
          We had trouble loading your dashboard. This is usually temporary and
          can be resolved by refreshing the page.
        </p>

        {error.digest && (
          <p className="mt-2 text-xs text-graphite-300">
            Error reference: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Link href="/dashboard/messages">
            <Button variant="outline" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Contact Support
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
