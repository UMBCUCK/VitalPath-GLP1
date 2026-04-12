export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { StatesClient } from "./states-client";

export default async function AdminStatesPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const states = await db.stateAvailability.findMany({
    orderBy: { stateCode: "asc" },
    select: {
      id: true,
      stateCode: true,
      stateName: true,
      isAvailable: true,
      requiresPhysicalExam: true,
      requiresPreexistingRelationship: true,
      informedConsentRequirement: true,
      cpomRestrictions: true,
    },
  });

  return <StatesClient states={states} />;
}
