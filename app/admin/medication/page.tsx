import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  getDosageOverview,
  getDosageSchedules,
  getDosageAnalytics,
  getMedicationAdherenceCorrelation,
} from "@/lib/admin-medication";
import { db } from "@/lib/db";
import { MedicationClient } from "./medication-client";

async function getCatalog() {
  try {
    return await (db as any).medicationCatalog.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  } catch {
    return [];
  }
}

export default async function MedicationPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [overview, schedules, analytics, correlation, catalog] = await Promise.all([
    getDosageOverview(),
    getDosageSchedules(1, 25),
    getDosageAnalytics(),
    getMedicationAdherenceCorrelation(),
    getCatalog(),
  ]);

  return (
    <MedicationClient
      overview={overview}
      initialSchedules={JSON.parse(JSON.stringify(schedules.rows))}
      initialTotal={schedules.total}
      analytics={analytics}
      correlation={correlation}
      initialCatalog={JSON.parse(JSON.stringify(catalog))}
    />
  );
}
