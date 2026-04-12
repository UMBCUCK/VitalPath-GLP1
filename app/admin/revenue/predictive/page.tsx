export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getTopDownVsBottomUp } from "@/lib/admin-predictive-revenue";
import { PredictiveClient } from "./predictive-client";

export default async function PredictiveRevenuePage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const { topDown, bottomUp } = await getTopDownVsBottomUp();

  return (
    <PredictiveClient
      topDown={topDown}
      bottomUp={bottomUp}
    />
  );
}
