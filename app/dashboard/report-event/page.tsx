import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ReportEventClient } from "./report-event-client";

export default async function ReportEventPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // Try to pre-fill medication name from active treatment
  const treatment = await db.treatmentPlan.findFirst({
    where: { userId: session.userId, status: { in: ["ACTIVE", "PRESCRIBED"] } },
    orderBy: { createdAt: "desc" },
    select: { medicationName: true },
  });

  return <ReportEventClient medicationName={treatment?.medicationName || ""} />;
}
