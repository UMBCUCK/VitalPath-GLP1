import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { computeChurnRisk } from "@/lib/admin-churn";

export async function POST() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get all users with active subscriptions
  const subscriptions = await db.subscription.findMany({
    where: { status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] } },
    select: { userId: true },
  });

  const userIds = [...new Set(subscriptions.map((s) => s.userId))];
  let processed = 0;
  let errors = 0;

  for (const userId of userIds) {
    try {
      await computeChurnRisk(userId);
      processed++;
    } catch {
      errors++;
    }
  }

  return NextResponse.json({ processed, errors, total: userIds.length });
}
