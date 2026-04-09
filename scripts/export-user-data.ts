/**
 * HIPAA Data Export Script
 * Exports all data for a given user email (data portability requirement).
 *
 * Usage: npx tsx scripts/export-user-data.ts user@example.com
 */

import { PrismaClient } from "@prisma/client";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const db = new PrismaClient();

async function exportUserData(email: string) {
  console.log(`Exporting data for: ${email}\n`);

  const user = await db.user.findUnique({
    where: { email },
    include: {
      profile: true,
      intakeSubmission: true,
      subscriptions: { include: { items: { include: { product: true } } } },
      orders: { include: { items: { include: { product: true } } } },
      progressEntries: { orderBy: { date: "desc" } },
      progressPhotos: true,
      messages: { orderBy: { createdAt: "desc" } },
      notifications: { orderBy: { createdAt: "desc" } },
      referralCode: { include: { referrals: true } },
      quizSubmission: true,
    },
  });

  if (!user) {
    console.error(`User not found: ${email}`);
    process.exit(1);
  }

  // Get treatment plans
  const treatmentPlans = await db.treatmentPlan.findMany({
    where: { userId: user.id },
  });

  const exportData = {
    exportDate: new Date().toISOString(),
    exportedFor: email,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    },
    profile: user.profile,
    intakeSubmission: user.intakeSubmission,
    quizSubmission: user.quizSubmission,
    treatmentPlans,
    subscriptions: user.subscriptions,
    orders: user.orders,
    progressEntries: user.progressEntries,
    progressPhotos: user.progressPhotos.map((p) => ({
      ...p,
      imageUrl: "[photo file — request separately]",
    })),
    messages: user.messages,
    notifications: user.notifications,
    referralCode: user.referralCode,
  };

  // Save to file
  const dir = join(process.cwd(), "exports");
  mkdirSync(dir, { recursive: true });
  const filename = `export_${email.replace("@", "_at_")}_${Date.now()}.json`;
  const filepath = join(dir, filename);
  writeFileSync(filepath, JSON.stringify(exportData, null, 2));

  console.log(`✅ Export saved to: ${filepath}`);
  console.log(`   Records: ${user.progressEntries.length} progress, ${user.messages.length} messages, ${user.orders.length} orders`);

  await db.$disconnect();
}

const email = process.argv[2];
if (!email) {
  console.error("Usage: npx tsx scripts/export-user-data.ts user@example.com");
  process.exit(1);
}

exportUserData(email);
