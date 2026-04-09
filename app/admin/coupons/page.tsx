import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CouponsClient } from "./coupons-client";

export default async function CouponsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const coupons = await db.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return <CouponsClient coupons={coupons} />;
}
