/**
 * One-time script to create Stripe test products + prices.
 * Run: npx tsx scripts/create-stripe-products.ts
 *
 * Requires STRIPE_SECRET_KEY in .env
 * Creates products for all 3 plans + 6 add-ons with monthly/quarterly/annual prices.
 * Stores price IDs in the Product table.
 */

import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2025-03-31.basil" });
const db = new PrismaClient();

interface ProductDef {
  slug: string;
  name: string;
  description: string;
  monthlyPrice: number; // cents
}

const products: ProductDef[] = [
  { slug: "essential", name: "Nature's Journey Essential", description: "Provider-guided treatment with medication, if prescribed.", monthlyPrice: 29700 },
  { slug: "premium", name: "Nature's Journey Premium", description: "Treatment plus nutrition, tracking, and coaching.", monthlyPrice: 39700 },
  { slug: "complete", name: "Nature's Journey Complete", description: "The full system: treatment, nutrition, supplements, coaching.", monthlyPrice: 52900 },
  { slug: "metabolic-support", name: "Metabolic Support Bundle", description: "Targeted nutritional support for metabolic wellness.", monthlyPrice: 3900 },
  { slug: "protein-hydration", name: "Protein & Hydration Bundle", description: "Premium protein and electrolyte support.", monthlyPrice: 3400 },
  { slug: "digestive-comfort", name: "Digestive Comfort Bundle", description: "Gentle digestive support for GLP-1 patients.", monthlyPrice: 2900 },
  { slug: "meal-plans", name: "Meal Plans & Recipes", description: "Weekly meal plans, recipes, and grocery lists.", monthlyPrice: 1900 },
  { slug: "coaching-upgrade", name: "Premium Coaching", description: "Weekly 1-on-1 coaching sessions.", monthlyPrice: 4900 },
  { slug: "lab-membership", name: "Lab Membership", description: "Quarterly metabolic panels and biomarker tracking.", monthlyPrice: 2900 },
];

async function main() {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.log("⚠️  No STRIPE_SECRET_KEY found. Generating mock price IDs for local development.\n");

    for (const p of products) {
      const monthlyId = `price_${p.slug}_monthly_mock`;
      const quarterlyId = `price_${p.slug}_quarterly_mock`;
      const annualId = `price_${p.slug}_annual_mock`;

      await db.product.update({
        where: { slug: p.slug },
        data: {
          stripePriceIdMonthly: monthlyId,
          stripePriceIdQuarterly: quarterlyId,
          stripePriceIdAnnual: annualId,
          stripeProductId: `prod_${p.slug}_mock`,
        },
      });
      console.log(`  ${p.name}: ${monthlyId}`);
    }

    console.log("\n✅ Mock price IDs stored in database.");
    console.log("   Set STRIPE_SECRET_KEY and re-run to create real Stripe products.");
    await db.$disconnect();
    return;
  }

  console.log("Creating Stripe products and prices...\n");

  for (const p of products) {
    // Create Stripe product
    const stripeProduct = await stripe.products.create({
      name: p.name,
      description: p.description,
      metadata: { slug: p.slug },
    });

    // Create monthly price
    const monthlyPrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: p.monthlyPrice,
      currency: "usd",
      recurring: { interval: "month" },
      metadata: { slug: p.slug, interval: "monthly" },
    });

    // Create quarterly price (10% discount)
    const quarterlyAmount = Math.round(p.monthlyPrice * 3 * 0.9);
    const quarterlyPrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: quarterlyAmount,
      currency: "usd",
      recurring: { interval: "month", interval_count: 3 },
      metadata: { slug: p.slug, interval: "quarterly" },
    });

    // Create annual price (20% discount)
    const annualAmount = Math.round(p.monthlyPrice * 12 * 0.8);
    const annualPrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: annualAmount,
      currency: "usd",
      recurring: { interval: "year" },
      metadata: { slug: p.slug, interval: "annual" },
    });

    // Store in database
    await db.product.update({
      where: { slug: p.slug },
      data: {
        stripeProductId: stripeProduct.id,
        stripePriceIdMonthly: monthlyPrice.id,
        stripePriceIdQuarterly: quarterlyPrice.id,
        stripePriceIdAnnual: annualPrice.id,
        priceQuarterly: quarterlyAmount,
        priceAnnual: annualAmount,
      },
    });

    console.log(`  ✓ ${p.name}`);
    console.log(`    Product: ${stripeProduct.id}`);
    console.log(`    Monthly: ${monthlyPrice.id} ($${(p.monthlyPrice / 100).toFixed(2)}/mo)`);
    console.log(`    Quarterly: ${quarterlyPrice.id} ($${(quarterlyAmount / 100).toFixed(2)}/3mo)`);
    console.log(`    Annual: ${annualPrice.id} ($${(annualAmount / 100).toFixed(2)}/yr)\n`);
  }

  console.log("✅ All products and prices created and stored in database.");
  await db.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
