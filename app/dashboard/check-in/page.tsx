export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CheckInClient } from "./check-in-client";

export default async function CheckInPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // Load last check-in for context
  const lastEntry = await db.progressEntry.findFirst({
    where: { userId: session.userId },
    orderBy: { date: "desc" },
    select: {
      date: true,
      weightLbs: true,
      moodRating: true,
      energyRating: true,
      medicationTaken: true,
    },
  });

  const lastEntryData = lastEntry
    ? {
        date: lastEntry.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        daysAgo: Math.floor((Date.now() - lastEntry.date.getTime()) / 86400000),
        weightLbs: lastEntry.weightLbs,
        moodRating: lastEntry.moodRating,
        medicationTaken: lastEntry.medicationTaken,
      }
    : null;

  return <CheckInClient lastEntry={lastEntryData} />;
}
