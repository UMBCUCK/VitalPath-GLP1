export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getResellerSession } from "@/lib/reseller-auth";
import { db } from "@/lib/db";
import { MarketingContentClient } from "./marketing-content-client";

export default async function ResellerMarketingPage() {
  const session = await getResellerSession();
  if (!session) redirect("/reseller/login");

  const submissions = await db.marketingContentSubmission.findMany({
    where: { resellerId: session.resellerId },
    orderBy: { submittedAt: "desc" },
    take: 50,
  });

  return (
    <MarketingContentClient
      submissions={JSON.parse(JSON.stringify(submissions))}
    />
  );
}
