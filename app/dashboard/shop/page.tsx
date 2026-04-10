import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ShopClient } from "./shop-client";

export default async function ShopPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // Parallel fetch: eligibility + products + active items
  const [intake, subscription, products] = await Promise.all([
    db.intakeSubmission.findFirst({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      select: { status: true },
    }),
    db.subscription.findFirst({
      where: { userId: session.userId, status: "ACTIVE" },
      include: {
        items: {
          select: {
            productId: true,
            product: { select: { slug: true, name: true, priceMonthly: true } },
          },
        },
      },
    }),
    db.product.findMany({
      where: { isMarketplace: true, isActive: true },
      orderBy: [{ isFeatured: "desc" }, { marketplaceOrder: "asc" }, { name: "asc" }],
    }),
  ]);

  const isApproved = intake?.status === "APPROVED";
  const isSubscribed = !!subscription;
  const activeProductSlugs = subscription?.items.map((i) => i.product.slug) || [];

  return (
    <ShopClient
      eligible={isApproved && isSubscribed}
      reason={!isSubscribed ? "no_subscription" : !isApproved ? "not_approved" : undefined}
      products={products}
      activeProductSlugs={activeProductSlugs}
      activeItems={subscription?.items.map((i) => ({
        slug: i.product.slug,
        name: i.product.name,
        price: i.product.priceMonthly,
      })) || []}
    />
  );
}
