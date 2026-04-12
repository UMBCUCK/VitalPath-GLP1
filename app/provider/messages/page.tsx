export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProviderMessagesClient } from "./messages-client";

export default async function ProviderMessagesPage() {
  const session = await getSession();
  if (!session || (session.role !== "PROVIDER" && session.role !== "ADMIN")) redirect("/login");

  // Get all patient messages grouped by user
  const messages = await db.message.findMany({
    where: { channel: "APP" },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
  });

  // Group by userId
  const threads: Record<string, { user: { id: string; firstName: string | null; lastName: string | null; email: string }; messages: typeof messages; unread: number }> = {};
  for (const m of messages) {
    if (!threads[m.userId]) {
      threads[m.userId] = { user: m.user, messages: [], unread: 0 };
    }
    threads[m.userId].messages.push(m);
    if (!m.isRead && m.direction === "OUTBOUND") threads[m.userId].unread++;
  }

  return <ProviderMessagesClient threads={Object.values(threads)} />;
}
