export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getJourneyFlowData } from "@/lib/admin-journey";
import { JourneyClient } from "./journey-client";

export default async function JourneyPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const flowData = await getJourneyFlowData();

  return (
    <JourneyClient
      nodes={JSON.parse(JSON.stringify(flowData.nodes))}
      links={JSON.parse(JSON.stringify(flowData.links))}
      stageTable={JSON.parse(JSON.stringify(flowData.stageTable))}
    />
  );
}
