export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getExperiments } from "@/lib/admin-experiments";
import { ExperimentsClient } from "./experiments-client";

export default async function ExperimentsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const data = await getExperiments();

  return (
    <ExperimentsClient
      initialExperiments={data.experiments}
      initialTotal={data.total}
    />
  );
}
