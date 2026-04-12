export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function IntakePage() {
  redirect("/qualify");
}
