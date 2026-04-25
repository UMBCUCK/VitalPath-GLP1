"use client";

/**
 * CommissionRowActions
 * ─────────────────────────────────────────────────────────────
 * Tier 11.2 — Inline approve / reject / mark-paid buttons for a single
 * Commission row in the admin ledger. Calls PUT /api/admin/commissions
 * (existing endpoint with full compliance gates).
 */
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CommissionRowActionsProps {
  id: string;
  status: string;
}

export function CommissionRowActions({ id, status }: CommissionRowActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<"" | "approve" | "reject" | "pay">("");

  async function call(action: "approve" | "reject" | "pay") {
    if (loading) return;
    setLoading(action);
    try {
      const res = await fetch("/api/admin/commissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed");
        return;
      }
      router.refresh();
    } finally {
      setLoading("");
    }
  }

  if (status === "PENDING") {
    return (
      <div className="flex justify-end gap-1.5">
        <Button
          size="sm"
          variant="emerald"
          className="h-7 px-2 text-[11px]"
          disabled={!!loading}
          onClick={() => call("approve")}
        >
          {loading === "approve" ? "…" : "Approve"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-7 px-2 text-[11px] border-red-300 text-red-700 hover:bg-red-50"
          disabled={!!loading}
          onClick={() => call("reject")}
        >
          {loading === "reject" ? "…" : "Reject"}
        </Button>
      </div>
    );
  }

  if (status === "APPROVED") {
    return (
      <div className="flex justify-end gap-1.5">
        <Button
          size="sm"
          variant="default"
          className="h-7 px-2 text-[11px]"
          disabled={!!loading}
          onClick={() => call("pay")}
        >
          {loading === "pay" ? "…" : "Mark paid"}
        </Button>
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <Button
        size="sm"
        variant="outline"
        className="h-7 px-2 text-[11px]"
        disabled={!!loading}
        onClick={() => call("approve")}
      >
        {loading === "approve" ? "…" : "Re-approve"}
      </Button>
    );
  }

  return <span className="text-[10px] text-graphite-300">—</span>;
}
