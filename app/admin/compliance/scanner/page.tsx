import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  getComplianceScanResults,
  getConsentExpiryTracker,
} from "@/lib/admin-compliance-scanner";
import { db } from "@/lib/db";
import { ScannerClient } from "./scanner-client";

export default async function ComplianceScannerPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [scanResults, consentExpiry, totalByStatus] = await Promise.all([
    getComplianceScanResults(1, 50),
    getConsentExpiryTracker(),
    db.complianceScanResult.groupBy({
      by: ["severity"],
      _count: { severity: true },
    }),
  ]);

  // Count resolved
  const resolvedCount = await db.complianceScanResult.count({
    where: { resolution: { not: null } },
  });

  // Build severity counts
  const severityCounts: Record<string, number> = {};
  for (const row of totalByStatus) {
    severityCounts[row.severity] = row._count.severity;
  }

  const totalFlags = Object.values(severityCounts).reduce((s, v) => s + v, 0);

  return (
    <ScannerClient
      scanResults={scanResults}
      consentExpiry={consentExpiry}
      kpis={{
        totalFlags,
        violations: severityCounts["VIOLATION"] ?? 0,
        warnings: severityCounts["WARNING"] ?? 0,
        info: severityCounts["INFO"] ?? 0,
        resolved: resolvedCount,
      }}
    />
  );
}
