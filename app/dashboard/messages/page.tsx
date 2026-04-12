export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { MessagesClient } from "./messages-client";

export default async function MessagesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const messages = await db.message.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      direction: true,
      subject: true,
      body: true,
      isRead: true,
      createdAt: true,
    },
  });

  // Mark inbound messages as read
  const unreadIds = messages
    .filter((m) => !m.isRead && m.direction === "INBOUND")
    .map((m) => m.id);

  if (unreadIds.length > 0) {
    await db.message.updateMany({
      where: { id: { in: unreadIds } },
      data: { isRead: true },
    });
  }

  const serialized = messages.map((m) => ({
    ...m,
    createdAt: m.createdAt.toISOString(),
  }));

  return <MessagesClient messages={serialized} />;
}
