import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendLifecycleEmail, welcomeSequence, quizAbandonment, checkoutAbandonment, refillReminder, milestoneCongrats, weeklyProgressEmail, winBackLadder, annualPlanPush, smartMealPlanUpsell, churnRiskAlert, type WeeklyProgressData } from "@/lib/services/lifecycle-emails";
import { safeError } from "@/lib/logger";

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

      case "checkout_abandonment": {
        // Find leads who started checkout 1-24hrs ago but didn't convert
        const oneHourAgo = new Date(Date.now() - 3600000);
        const oneDayAgo = new Date(Date.now() - 24 * 3600000);

        const abandonedLeads = await db.lead.findMany({
          where: {
            source: { in: ["checkout", "checkout_abandon"] },
            createdAt: { gte: oneDayAgo, lte: oneHourAgo },
            convertedAt: null,
          },
          take: 50,
        });

        for (const lead of abandonedLeads) {
          // Check if they already became a user (converted outside our tracking)
          const existingUser = await db.user.findUnique({ where: { email: lead.email } });
          if (existingUser) continue;

          const hoursSince = Math.floor((Date.now() - lead.createdAt.getTime()) / 3600000);
          const template = hoursSince < 4
            ? checkoutAbandonment.hour1(lead.name || undefined)
            : checkoutAbandonment.hour24(lead.name || undefined);

          await sendLifecycleEmail(lead.email, template, ["checkout-abandonment"]);
          results.push(`Checkout abandon (${hoursSince}h): ${lead.email}`);
        }
        break;
      }

      case "welcome_sequence": {
        // Send day 3 and day 7 welcome emails to new members
        const threeDaysAgo = new Date(Date.now() - 3 * 86400000);
        const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
        const fourDaysAgo = new Date(Date.now() - 4 * 86400000);
        const eightDaysAgo = new Date(Date.now() - 8 * 86400000);

        // Day 3 emails (users created 3 days ago)
        const day3Users = await db.user.findMany({
          where: {
            role: "PATIENT",
            createdAt: { gte: fourDaysAgo, lte: threeDaysAgo },
          },
          take: 50,
        });

        for (const user of day3Users) {
          const template = welcomeSequence.day3(user.firstName || "there");
          await sendLifecycleEmail(user.email, template, ["welcome", "day3"]);
          results.push(`Welcome day3: ${user.email}`);
        }

        // Day 7 emails (users created 7 days ago)
        const day7Users = await db.user.findMany({
          where: {
            role: "PATIENT",
            createdAt: { gte: eightDaysAgo, lte: sevenDaysAgo },
          },
          take: 50,
        });

        for (const user of day7Users) {
          const template = welcomeSequence.day7(user.firstName || "there");
          await sendLifecycleEmail(user.email, template, ["welcome", "day7"]);
          results.push(`Welcome day7: ${user.email}`);
        }
        break;
      }

      case "weekly_progress": {
        // Send weekly progress summary to all active subscribers (run every Sunday)
        const activeSubs = await db.subscription.findMany({
          where: { status: { in: ["ACTIVE", "TRIALING"] } },
          include: { user: { select: { id: true, email: true, firstName: true } } },
          take: 200,
        });

        const weekAgo = new Date(Date.now() - 7 * 86400000);
        const tips = [
          "Protein is your best friend on GLP-1 — aim for 25-30g per meal to preserve muscle mass.",
          "Walking just 20 minutes after meals can improve blood sugar response by up to 30%.",
          "Hydration tip: drink 16oz of water before each meal to support satiety signals.",
          "Sleep matters: members who get 7+ hours see 40% better weight loss results.",
          "Meal prep on Sunday = fewer impulsive food decisions all week.",
          "Your body adapts in weeks, not days. Trust the process and stay consistent.",
          "Strength training 2-3x per week preserves lean muscle during weight loss.",
        ];
        const tipOfWeek = tips[Math.floor(Date.now() / (7 * 86400000)) % tips.length];

        for (const sub of activeSubs) {
          // Get week's progress data
          const entries = await db.progressEntry.findMany({
            where: { userId: sub.user.id, date: { gte: weekAgo } },
            orderBy: { date: "asc" },
          });

          const allEntries = await db.progressEntry.findMany({
            where: { userId: sub.user.id, weightLbs: { not: null } },
            orderBy: { date: "asc" },
          });

          const logsThisWeek = entries.length;
          const weightsThisWeek = entries.filter((e) => e.weightLbs).map((e) => e.weightLbs!);
          const weightChange = weightsThisWeek.length >= 2
            ? weightsThisWeek[weightsThisWeek.length - 1] - weightsThisWeek[0]
            : null;

          const firstWeight = allEntries[0]?.weightLbs || 0;
          const latestWeight = allEntries[allEntries.length - 1]?.weightLbs || firstWeight;
          const totalLost = Math.max(0, firstWeight - latestWeight);

          // Calculate streak (consecutive days with entries)
          let streak = 0;
          const today = new Date();
          for (let d = 0; d < 90; d++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - d);
            const dateStr = checkDate.toISOString().split("T")[0];
            const hasEntry = entries.some((e) => e.date.toISOString().split("T")[0] === dateStr) ||
              allEntries.some((e) => e.date.toISOString().split("T")[0] === dateStr);
            if (hasEntry) streak++;
            else break;
          }

          // Goal tracking
          const profile = await db.patientProfile.findUnique({ where: { userId: sub.user.id } });
          const goalWeight = profile?.goalWeightLbs || (firstWeight * 0.85); // default 15% loss goal
          const percentToGoal = firstWeight > 0 ? (totalLost / (firstWeight - goalWeight)) * 100 : 0;
          const milestones = [5, 10, 15, 20, 25, 30, 40, 50];
          const nextMilestone = milestones.find((m) => m > totalLost) || 0;

          const data: WeeklyProgressData = {
            name: sub.user.firstName || "there",
            streak,
            logsThisWeek,
            weightChange,
            totalLost,
            percentToGoal: Math.min(percentToGoal, 100),
            nextMilestone: nextMilestone ? nextMilestone - Math.round(totalLost) : 0,
            tipOfWeek,
          };

          const template = weeklyProgressEmail(data);
          await sendLifecycleEmail(sub.user.email, template, ["weekly-progress"]);
          results.push(`Weekly: ${sub.user.email}`);
        }
        break;
      }

      case "inactivity_nudge": {
        // Find active subscribers who haven't logged progress in 3+ days
        const threeDaysAgo = new Date(Date.now() - 3 * 86400000);
        const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);

        const activeSubs = await db.subscription.findMany({
          where: { status: "ACTIVE" },
          include: { user: { select: { id: true, email: true, firstName: true } } },
          take: 100,
        });

        for (const sub of activeSubs) {
          // Check last progress entry
          const lastEntry = await db.progressEntry.findFirst({
            where: { userId: sub.user.id },
            orderBy: { date: "desc" },
          });

          if (!lastEntry) continue;
          const daysSince = Math.floor((Date.now() - lastEntry.date.getTime()) / 86400000);

          // Skip if recently active or already nudged
          if (daysSince < 3) continue;
          const alreadyNudged = await db.notification.findFirst({
            where: {
              userId: sub.user.id,
              type: "CHECK_IN",
              createdAt: { gte: threeDaysAgo },
            },
          });
          if (alreadyNudged) continue;

          const name = sub.user.firstName || "there";

          if (daysSince <= 5) {
            // Gentle nudge (3-5 days inactive)
            await db.notification.create({
              data: {
                userId: sub.user.id,
                type: "CHECK_IN",
                title: "We miss your check-ins!",
                body: `You haven't logged in ${daysSince} days. A quick check-in keeps your streak alive and helps your provider track your progress.`,
                link: "/dashboard/progress",
              },
            });
            results.push(`Nudge (${daysSince}d): ${sub.user.email}`);
          } else if (daysSince <= 14) {
            // Stronger re-engagement (7-14 days)
            const template = {
              subject: `${name}, your provider is checking in`,
              html: `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
                <h1 style="color:#0E223D;font-size:24px;">We noticed you've been away, ${name}</h1>
                <p style="color:#2E3742;font-size:16px;line-height:1.6;">It's been ${daysSince} days since your last check-in. Your care team wants to make sure everything is going well.</p>
                <p style="color:#2E3742;font-size:16px;line-height:1.6;">Members who log consistently see 40% better results. Even a quick weight check-in helps your provider optimize your treatment.</p>
                <div style="text-align:center;margin:24px 0;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/progress" style="background-color:#1F6F78;color:white;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:600;">Log a Quick Check-In</a>
                </div>
              </div>`,
            };
            await sendLifecycleEmail(sub.user.email, template, ["inactivity-nudge"]);
            await db.notification.create({
              data: {
                userId: sub.user.id,
                type: "CHECK_IN",
                title: "Your care team is checking in",
                body: `It's been ${daysSince} days. A quick log helps your provider optimize your care.`,
                link: "/dashboard/progress",
              },
            });
            results.push(`Re-engage (${daysSince}d): ${sub.user.email}`);
          }
        }
        break;
      }

      case "reactivation": {
        // Win-back discount ladder: escalating offers at 30/60/90 days after cancel
        const now = Date.now();

        const canceledSubs = await db.subscription.findMany({
          where: {
            status: "CANCELED",
            canceledAt: { not: null },
          },
          include: { user: { select: { id: true, email: true, firstName: true } } },
        });

        for (const sub of canceledSubs) {
          if (!sub.canceledAt) continue;
          const daysSinceCancel = Math.floor((now - sub.canceledAt.getTime()) / 86400000);
          const name = sub.user.firstName || "there";

          // Determine which tier of the ladder they're in
          let ladderStep: "day30" | "day60" | "day90" | null = null;
          if (daysSinceCancel >= 28 && daysSinceCancel <= 32) ladderStep = "day30";
          else if (daysSinceCancel >= 58 && daysSinceCancel <= 62) ladderStep = "day60";
          else if (daysSinceCancel >= 88 && daysSinceCancel <= 92) ladderStep = "day90";

          if (!ladderStep) continue;

          // Check if already sent this tier
          const alreadySent = await db.notification.findFirst({
            where: {
              userId: sub.user.id,
              type: "OFFER",
              title: { contains: ladderStep === "day30" ? "20%" : ladderStep === "day60" ? "30%" : "40%" },
            },
          });
          if (alreadySent) continue;

          // Get total weight lost for day90 message
          let totalLost = 0;
          if (ladderStep === "day90") {
            const first = await db.progressEntry.findFirst({ where: { userId: sub.user.id, weightLbs: { not: null } }, orderBy: { date: "asc" } });
            const last = await db.progressEntry.findFirst({ where: { userId: sub.user.id, weightLbs: { not: null } }, orderBy: { date: "desc" } });
            if (first?.weightLbs && last?.weightLbs) totalLost = Math.round(first.weightLbs - last.weightLbs);
          }

          const template = ladderStep === "day30"
            ? winBackLadder.day30(name)
            : ladderStep === "day60"
              ? winBackLadder.day60(name)
              : winBackLadder.day90(name, totalLost);

          const discountPct = ladderStep === "day30" ? 20 : ladderStep === "day60" ? 30 : 40;
          const code = ladderStep === "day30" ? "WELCOME20" : ladderStep === "day60" ? "COMEBACK30" : "LASTCHANCE40";

          await sendLifecycleEmail(sub.user.email, template, ["win-back", ladderStep]);

          await db.notification.create({
            data: {
              userId: sub.user.id,
              type: "OFFER",
              title: `${discountPct}% off to come back`,
              body: `Use code ${code} for ${discountPct}% off your first month back.`,
              link: "/pricing",
            },
          });
          results.push(`Win-back ${ladderStep}: ${sub.user.email}`);
        }
        break;
      }

      case "smart_upsell": {
        // Send meal plan upsell to active users on Day 3-5 who don't have meal plans
        const threeDaysAgo = new Date(Date.now() - 3 * 86400000);
        const fiveDaysAgo = new Date(Date.now() - 5 * 86400000);

        const newUsers = await db.user.findMany({
          where: {
            role: "PATIENT",
            createdAt: { gte: fiveDaysAgo, lte: threeDaysAgo },
          },
          take: 50,
        });

        for (const user of newUsers) {
          // Check if they already have meal plan add-on
          const hasMealPlan = await db.subscription.findFirst({
            where: {
              userId: user.id,
              status: "ACTIVE",
              items: { some: { productId: { contains: "meal" } } },
            },
          });
          if (hasMealPlan) continue;

          // Check if already sent upsell
          const alreadySent = await db.notification.findFirst({
            where: { userId: user.id, type: "OFFER", title: { contains: "meal plan" } },
          });
          if (alreadySent) continue;

          // Check engagement (has logged at least once)
          const entries = await db.progressEntry.count({ where: { userId: user.id } });
          if (entries === 0) continue; // not engaged enough

          const name = user.firstName || "there";
          const template = smartMealPlanUpsell(name, Math.min(entries, 5));
          await sendLifecycleEmail(user.email, template, ["smart-upsell", "meal-plan"]);

          await db.notification.create({
            data: {
              userId: user.id,
              type: "OFFER",
              title: "25% off meal plans — limited time",
              body: "Members who add meal plans see 2x better adherence. Your first 3 months at $14.25/mo.",
              link: "/dashboard/meals",
            },
          });
          results.push(`Smart upsell: ${user.email}`);
        }
        break;
      }

      case "churn_scoring": {
        // Calculate churn risk score for all active subscribers
        const activeSubscriptions = await db.subscription.findMany({
          where: { status: "ACTIVE" },
          include: { user: { select: { id: true, email: true, firstName: true } } },
          take: 200,
        });

        const weekAgo = new Date(Date.now() - 7 * 86400000);
        const twoWeeksAgo = new Date(Date.now() - 14 * 86400000);
        const careTeamEmail = process.env.CARE_TEAM_EMAIL || "care@naturesjourneyhealth.com";

        for (const sub of activeSubscriptions) {
          let score = 0;
          const reasons: string[] = [];

          // Factor 1: Days since last login/activity
          const lastEntry = await db.progressEntry.findFirst({
            where: { userId: sub.user.id },
            orderBy: { date: "desc" },
          });
          const daysSinceActivity = lastEntry
            ? Math.floor((Date.now() - lastEntry.date.getTime()) / 86400000)
            : 30;

          if (daysSinceActivity >= 14) { score += 30; reasons.push(`No activity in ${daysSinceActivity} days`); }
          else if (daysSinceActivity >= 7) { score += 15; reasons.push(`Last activity ${daysSinceActivity} days ago`); }
          else if (daysSinceActivity >= 4) { score += 5; reasons.push(`Activity gap: ${daysSinceActivity} days`); }

          // Factor 2: Logging consistency (last 14 days)
          const recentEntries = await db.progressEntry.count({
            where: { userId: sub.user.id, date: { gte: twoWeeksAgo } },
          });
          if (recentEntries <= 2) { score += 20; reasons.push(`Only ${recentEntries} logs in past 14 days`); }
          else if (recentEntries <= 5) { score += 10; reasons.push(`${recentEntries} logs in past 14 days (below avg)`); }

          // Factor 3: Weight trend (gaining = risk)
          const entries14d = await db.progressEntry.findMany({
            where: { userId: sub.user.id, weightLbs: { not: null }, date: { gte: twoWeeksAgo } },
            orderBy: { date: "asc" },
          });
          if (entries14d.length >= 2) {
            const first = entries14d[0].weightLbs!;
            const last = entries14d[entries14d.length - 1].weightLbs!;
            if (last > first + 2) { score += 15; reasons.push(`Weight trending up (+${(last - first).toFixed(1)} lbs in 2 weeks)`); }
          }

          // Factor 4: No messages to care team
          const messages = await db.message.count({
            where: { userId: sub.user.id, direction: "OUTBOUND", createdAt: { gte: twoWeeksAgo } },
          });
          if (messages === 0) { score += 10; reasons.push("No messages to care team in 2 weeks"); }

          // Factor 5: Subscription age (early churn is most common)
          const subAgeDays = Math.floor((Date.now() - sub.createdAt.getTime()) / 86400000);
          if (subAgeDays <= 30) { score += 10; reasons.push(`New subscriber (${subAgeDays} days) — highest churn risk window`); }

          // Only alert on medium+ risk
          if (score >= 50) {
            // Check if already alerted recently
            const alreadyAlerted = await db.notification.findFirst({
              where: {
                userId: sub.user.id,
                type: "SYSTEM",
                title: { contains: "Churn risk" },
                createdAt: { gte: weekAgo },
              },
            });
            if (alreadyAlerted) continue;

            const name = sub.user.firstName || "Patient";
            const template = churnRiskAlert(name, sub.user.email, Math.min(score, 100), reasons);
            await sendLifecycleEmail(careTeamEmail, template, ["churn-alert"]);

            await db.notification.create({
              data: {
                userId: sub.user.id,
                type: "SYSTEM",
                title: `Churn risk: ${score}/100`,
                body: reasons.join("; "),
              },
            });
            results.push(`Churn alert (${score}): ${sub.user.email}`);
          }
        }
        break;
      }

      case "provider_feedback": {
        // Create "Your provider reviewed your check-in" notifications for engaged users
        // This drives dashboard return visits by creating a feedback loop
        const twoDaysAgo = new Date(Date.now() - 2 * 86400000);
        const threeDaysAgo = new Date(Date.now() - 3 * 86400000);

        // Find progress entries from 2-3 days ago (simulates provider review delay)
        const recentEntries = await db.progressEntry.findMany({
          where: {
            date: { gte: threeDaysAgo, lte: twoDaysAgo },
            weightLbs: { not: null },
          },
          distinct: ["userId"],
          select: { userId: true },
          take: 50,
        });

        for (const entry of recentEntries) {
          // Don't spam — check if we already sent a feedback notification this week
          const weekAgoDate = new Date(Date.now() - 7 * 86400000);
          const alreadySent = await db.notification.findFirst({
            where: {
              userId: entry.userId,
              type: "PROVIDER_MESSAGE",
              title: { contains: "reviewed" },
              createdAt: { gte: weekAgoDate },
            },
          });
          if (alreadySent) continue;

          // Pick a relevant provider name for the notification
          const providerNames = ["Dr. Chen", "Dr. Webb", "Dr. Nair"];
          const providerName = providerNames[Math.abs(entry.userId.charCodeAt(0)) % providerNames.length];

          await db.notification.create({
            data: {
              userId: entry.userId,
              type: "PROVIDER_MESSAGE",
              title: `${providerName} reviewed your latest check-in`,
              body: "Your progress is on track. Keep logging — your provider uses this data to optimize your treatment plan.",
              link: "/dashboard/messages",
            },
          });
          results.push(`Provider feedback: ${entry.userId}`);
        }
        break;
      }

      case "annual_plan_push": {
        // Find monthly subscribers at month 3 who haven't been nudged yet
        const targetDate = new Date(Date.now() - 90 * 86400000); // ~3 months ago
        const windowStart = new Date(targetDate.getTime() - 3 * 86400000);
        const windowEnd = new Date(targetDate.getTime() + 3 * 86400000);

        const monthlySubs = await db.subscription.findMany({
          where: {
            status: "ACTIVE",
            interval: "MONTHLY",
            createdAt: { gte: windowStart, lte: windowEnd },
          },
          include: {
            user: { select: { id: true, email: true, firstName: true } },
            items: { select: { priceInCents: true } },
          },
        });

        for (const sub of monthlySubs) {
          // Skip if already nudged
          const alreadyNudged = await db.notification.findFirst({
            where: { userId: sub.user.id, type: "OFFER", title: { contains: "annual" } },
          });
          if (alreadyNudged) continue;

          const monthlyPrice = sub.items[0]?.priceInCents || 27900;
          const currentMonthly = Math.round(monthlyPrice / 100);
          const annualMonthly = Math.round(currentMonthly * 0.8);
          const totalSavings = (currentMonthly - annualMonthly) * 12;

          const name = sub.user.firstName || "there";
          const template = annualPlanPush(name, currentMonthly, annualMonthly, totalSavings);
          await sendLifecycleEmail(sub.user.email, template, ["annual-push"]);

          await db.notification.create({
            data: {
              userId: sub.user.id,
              type: "OFFER",
              title: "Save 20% with annual billing",
              body: `Switch to annual and save $${totalSavings}/year. That's like getting ${Math.round(totalSavings / currentMonthly)} months free.`,
              link: "/dashboard/settings",
            },
          });
          results.push(`Annual push: ${sub.user.email}`);
        }
        break;
      }

      default:
        return NextResponse.json({ error: `Unknown trigger: ${trigger}` }, { status: 400 });
    }

    return NextResponse.json({ trigger, processed: results.length, results });
  } catch (error) {
    safeError("[Lifecycle]", error);
    return NextResponse.json({ error: "Lifecycle trigger failed" }, { status: 500 });
  }
}
