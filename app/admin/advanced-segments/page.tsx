export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSegments } from "@/lib/admin-advanced-segments";
import { AdvancedSegmentsClient } from "./advanced-segments-client";

export default async function AdvancedSegmentsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const data = await getSegments(1, 50);

  const segments = JSON.parse(JSON.stringify(data.segments));
  return <AdvancedSegmentsClient initialSegments={segments} initialTotal={data.total} />;
}
