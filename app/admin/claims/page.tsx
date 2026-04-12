export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ClaimsClient } from "./claims-client";

export default async function ClaimsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [claims, total] = await Promise.all([
    db.claim.findMany({
      orderBy: { updatedAt: "desc" },
      take: 50,
    }),
    db.claim.count(),
  ]);

  // Compute summary stats server-side
  const stats = {
    total,
    approved: await db.claim.count({ where: { status: "APPROVED" } }),
    pendingReview: await db.claim.count({ where: { status: "PENDING_REVIEW" } }),
    highRisk: await db.claim.count({
      where: { riskLevel: { in: ["HIGH", "CRITICAL"] } },
    }),
  };

  return (
    <ClaimsClient
      initialClaims={JSON.parse(JSON.stringify(claims))}
      initialTotal={total}
      stats={stats}
    />
  );
}
