export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { IntakeReviewClient } from "./intakes-client";

export default async function ProviderIntakesPage() {
  const session = await getSession();
  if (!session || (session.role !== "PROVIDER" && session.role !== "ADMIN")) redirect("/login");

  const intakes = await db.intakeSubmission.findMany({
    where: { status: { in: ["SUBMITTED", "NEEDS_INFO"] } },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
    },
  });

  return <IntakeReviewClient intakes={intakes} providerId={session.userId} />;
}
