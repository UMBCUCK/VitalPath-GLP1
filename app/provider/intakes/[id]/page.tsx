export const dynamic = "force-dynamic";
import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { HealthReportClient } from "./health-report-client";

export default async function IntakeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session || (session.role !== "PROVIDER" && session.role !== "ADMIN")) redirect("/login");

  const intake = await db.intakeSubmission.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          createdAt: true,
        },
      },
    },
  });

  if (!intake) notFound();

  // Fetch consent records for this intake
  const consents = await db.consentRecord.findMany({
    where: { intakeId: id },
  });

  return (
    <HealthReportClient
      intake={JSON.parse(JSON.stringify(intake))}
      consents={JSON.parse(JSON.stringify(consents))}
      providerId={session.userId}
    />
  );
}
