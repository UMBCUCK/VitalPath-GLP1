export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PhotosClient } from "./photos-client";

export default async function PhotosPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const photos = await db.progressPhoto.findMany({
    where: { userId: session.userId },
    orderBy: { date: "desc" },
    select: { id: true, imageUrl: true, type: true, date: true, consentGiven: true },
  });

  const serialized = photos.map((p) => ({
    ...p,
    date: p.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  }));

  return <PhotosClient photos={serialized} />;
}
