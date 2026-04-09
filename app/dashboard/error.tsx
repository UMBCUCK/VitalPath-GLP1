"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, MessageCircle } from "lucide-react";
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
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
          <AlertTriangle className="h-7 w-7 text-amber-500" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-navy">Dashboard Error</h2>
        <p className="mt-3 text-sm text-graphite-400">
          Something went wrong loading your dashboard. This is usually temporary.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Retry
          </Button>
          <Link href="/dashboard/messages">
            <Button variant="outline" className="gap-2">
              <MessageCircle className="h-4 w-4" /> Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
