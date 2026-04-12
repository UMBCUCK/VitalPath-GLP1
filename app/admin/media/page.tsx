export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { MediaLibraryClient } from "./media-client";

export default async function MediaLibraryPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");
  return <MediaLibraryClient />;
}
