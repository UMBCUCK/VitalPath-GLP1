import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendLifecycleEmail, welcomeSequence, quizAbandonment, checkoutAbandonment, refillReminder, milestoneCongrats } from "@/lib/services/lifecycle-emails";

/**
 * Lifecycle trigger endpoint.
 * Called by a cron job (e.g., Vercel Cron, GitHub Actions) to process automated emails.
 *
 * POST /api/lifecycle?trigger=quiz_abandonment
 * POST /api/lifecycle?trigger=refill_reminders
 * POST /api/lifecycle?trigger=milestone_check
 *
 * In production, protect with a secret header: X-Cron-Secret
 */
export async function POST(req: NextRequest) {
  const cronSecret = req.headers.get("x-cron-secret");
  if (process.env.NODE_ENV === "production" && cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const trigger = req.nextUrl.searchParams.get("trigger");
  const results: string[] = [];

  try {
    switch (trigger) {
      case "quiz_abandonment": {
        // Find leads from 24hrs ago who started quiz but didn't complete intake
        const oneDayAgo = new Date(Date.now() - 24 * 3600000);
        const twoDaysAgo = new Date(Date.now() - 48 * 3600000);

        const leads = await db.lead.findMany({
          where: {
            source: { in: ["quiz_abandon", "quiz"] },
            createdAt: { gte: twoDaysAgo, lte: oneDayAgo },
            convertedAt: null,
          },
          take: 50,
        });

        for (const lead of leads) {
          const template = quizAbandonment(lead.name || undefined);
          await sendLifecycleEmail(lead.email, template, ["quiz-abandonment"]);
          results.push(`Quiz abandon: ${lead.email}`);
        }
        break;
      }

      case "refill_reminders": {
        // Find treatment plans with refill in 7 days
        const sevenDaysOut = new Date(Date.now() + 7 * 86400000);
        const sixDaysOut = new Date(Date.now() + 6 * 86400000);

        const treatments = await db.treatmentPlan.findMany({
          where: {
            status: "ACTIVE",
            nextRefillDate: { gte: sixDaysOut, lte: sevenDaysOut },
          },
        });

        for (const treatment of treatments) {
          const user = await db.user.findUnique({ where: { id: treatment.userId } });
          if (!user) continue;

          const daysUntil = Math.ceil((treatment.nextRefillDate!.getTime() - Date.now()) / 86400000);
          const template = refillReminder(user.firstName || "there", daysUntil);
          await sendLifecycleEmail(user.email, template, ["refill-reminder"]);

          // Create notification
          await db.notification.create({
            data: {
              userId: user.id,
              type: "REFILL_REMINDER",
              title: `Refill ships in ${daysUntil} days`,
              body: "Make sure your shipping info and payment method are current.",
              link: "/dashboard/treatment",
            },
          });
          results.push(`Refill reminder: ${user.email}`);
        }
        break;
      }

      case "milestone_check": {
        // Check for users who've hit weight loss milestones
        const milestones = [5, 10, 15, 20, 25, 30, 40, 50];

        const activeUsers = await db.subscription.findMany({
          where: { status: "ACTIVE" },
          select: { userId: true },
        });

        for (const sub of activeUsers) {
          const profile = await db.patientProfile.findUnique({
            where: { userId: sub.userId },
            select: { weightLbs: true },
          });
          if (!profile?.weightLbs) continue;

          const firstEntry = await db.progressEntry.findFirst({
            where: { userId: sub.userId, weightLbs: { not: null } },
            orderBy: { date: "asc" },
          });
          const latestEntry = await db.progressEntry.findFirst({
            where: { userId: sub.userId, weightLbs: { not: null } },
            orderBy: { date: "desc" },
          });

          if (!firstEntry?.weightLbs || !latestEntry?.weightLbs) continue;
          const lost = Math.round(firstEntry.weightLbs - latestEntry.weightLbs);

          // Find the highest milestone reached
          const reached = milestones.filter((m) => lost >= m);
          if (reached.length === 0) continue;

          const highestMilestone = reached[reached.length - 1];

          // Check if we already notified for this milestone
          const existing = await db.notification.findFirst({
            where: {
              userId: sub.userId,
              type: "MILESTONE",
              title: { contains: `${highestMilestone} lbs` },
            },
          });
          if (existing) continue;

          const user = await db.user.findUnique({ where: { id: sub.userId } });
          if (!user) continue;

          const message = `You've lost ${highestMilestone} pounds! That's a major milestone.`;
          const template = milestoneCongrats(user.firstName || "there", message);
          await sendLifecycleEmail(user.email, template, ["milestone"]);

          await db.notification.create({
            data: {
              userId: sub.userId,
              type: "MILESTONE",
              title: `${highestMilestone} lbs lost!`,
              body: message,
              link: "/dashboard/progress",
            },
          });
          results.push(`Milestone ${highestMilestone}lb: ${user.email}`);
        }
        break;
      }

      case "reactivation": {
        // Find users who canceled 30-90 days ago
        const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
        const ninetyDaysAgo = new Date(Date.now() - 90 * 86400000);

        const canceledSubs = await db.subscription.findMany({
          where: {
            status: "CANCELED",
            canceledAt: { gte: ninetyDaysAgo, lte: thirtyDaysAgo },
          },
          include: { user: { select: { id: true, email: true, firstName: true } } },
        });

        for (const sub of canceledSubs) {
          // Check if they haven't already been sent a reactivation email
          const alreadySent = await db.notification.findFirst({
            where: { userId: sub.user.id, type: "OFFER", title: { contains: "come back" } },
          });
          if (alreadySent) continue;

          const name = sub.user.firstName || "there";
          const template = {
            subject: `${name}, we'd love to have you back`,
            html: `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
              <h1 style="color:#0E223D;font-size:24px;">We miss you, ${name}</h1>
              <p style="color:#2E3742;font-size:16px;line-height:1.6;">It's been a while since you've been active on VitalPath. We'd love to welcome you back with a special offer.</p>
              <div style="background:#F7FAF8;border-radius:12px;padding:20px;margin:20px 0;text-align:center;">
                <p style="font-size:24px;font-weight:700;color:#0E223D;">30% off your first month back</p>
                <p style="color:#677A8A;font-size:14px;">Use code <strong>COMEBACK30</strong> at checkout</p>
              </div>
              <div style="text-align:center;margin:24px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "")}/pricing" style="background-color:#1F6F78;color:white;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:600;">Reactivate Your Plan</a>
              </div>
              <p style="color:#97A5B0;font-size:12px;">VitalPath Health</p>
            </div>`,
          };

          await sendLifecycleEmail(sub.user.email, template, ["reactivation"]);

          await db.notification.create({
            data: {
              userId: sub.user.id,
              type: "OFFER",
              title: "We'd love to have you come back",
              body: "Get 30% off your first month back with code COMEBACK30",
              link: "/pricing",
            },
          });
          results.push(`Reactivation: ${sub.user.email}`);
        }
        break;
      }

      default:
        return NextResponse.json({ error: `Unknown trigger: ${trigger}` }, { status: 400 });
    }

    return NextResponse.json({ trigger, processed: results.length, results });
  } catch (error) {
    console.error("[Lifecycle]", error);
    return NextResponse.json({ error: "Lifecycle trigger failed" }, { status: 500 });
  }
}
