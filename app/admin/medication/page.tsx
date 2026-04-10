import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  getDosageOverview,
  getDosageSchedules,
  getDosageAnalytics,
  getMedicationAdherenceCorrelation,
} from "@/lib/admin-medication";
import { MedicationClient } from "./medication-client";

export default async function MedicationPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [overview, schedules, analytics, correlation] = await Promise.all([
    getDosageOverview(),
    getDosageSchedules(1, 25),
    getDosageAnalytics(),
    getMedicationAdherenceCorrelation(),
  ]);

  return (
    <MedicationClient
      overview={overview}
      initialSchedules={JSON.parse(JSON.stringify(schedules.rows))}
      initialTotal={schedules.total}
      analytics={analytics}
      correlation={correlation}
    />
  );
}
