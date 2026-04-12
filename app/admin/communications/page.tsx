export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getThreads, getThreadMetrics, getMessageTemplates } from "@/lib/admin-communications";
import { db } from "@/lib/db";
import { CommunicationsClient } from "./communications-client";

export default async function CommunicationsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [threadsData, metrics, admins] = await Promise.all([
    getThreads(1, 50),
    getThreadMetrics(),
    db.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true, firstName: true, lastName: true, email: true },
    }),
  ]);

  const templates = getMessageTemplates();

  return (
    <CommunicationsClient
      initialThreads={JSON.parse(JSON.stringify(threadsData.threads))}
      initialTotal={threadsData.total}
      initialMetrics={JSON.parse(JSON.stringify(metrics))}
      admins={JSON.parse(JSON.stringify(admins))}
      templates={templates}
    />
  );
}
