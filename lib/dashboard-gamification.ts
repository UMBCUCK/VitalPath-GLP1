/**
 * Gamification computations for the patient dashboard.
 * All functions run server-side and return data for client components.
 */

import { db } from "@/lib/db";

// ─── Types ──────────────────────────────────────────────────

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name or emoji
  earned: boolean;
  earnedAt?: Date;
}

export interface WeeklyProgress {
  thisWeek: number | null;
  lastWeek: number | null;
  change: number | null; // negative = lost weight (good)
}

// ─── Streak ─────────────────────────────────────────────────

export async function computeStreak(userId: string): Promise<number> {
  const entries = await db.progressEntry.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 120,
    select: { date: true },
  });

  if (entries.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayMs = 24 * 60 * 60 * 1000;

  // Deduplicate by calendar date
  const seenDates = new Set<string>();
  const uniqueDays: Date[] = [];
  for (const entry of entries) {
    const d = new Date(entry.date);
    d.setHours(0, 0, 0, 0);
    const key = d.toISOString();
    if (!seenDates.has(key)) {
      seenDates.add(key);
      uniqueDays.push(d);
    }
  }

  let streak = 0;
  for (let i = 0; i < uniqueDays.length; i++) {
    const expected = new Date(today.getTime() - i * dayMs);
    expected.setHours(0, 0, 0, 0);
    if (uniqueDays[i].getTime() === expected.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// ─── Badges ─────────────────────────────────────────────────

const BADGE_DEFINITIONS = [
  { id: "first_log", name: "First Log", description: "Logged your first progress entry", icon: "ClipboardCheck" },
  { id: "week_warrior", name: "Week Warrior", description: "7-day logging streak", icon: "Flame" },
  { id: "ten_lb_club", name: "10 lb Club", description: "Lost 10+ pounds", icon: "TrendingDown" },
  { id: "twenty_five_lb_club", name: "25 lb Club", description: "Lost 25+ pounds", icon: "Award" },
  { id: "protein_pro", name: "Protein Pro", description: "Hit protein target 7 days in a row", icon: "Target" },
  { id: "hydration_hero", name: "Hydration Hero", description: "Hit water target 7 days in a row", icon: "Droplets" },
  { id: "month_strong", name: "Month Strong", description: "Active for 30+ days", icon: "Calendar" },
  { id: "quarter_champion", name: "Quarter Champion", description: "Active for 90+ days", icon: "Trophy" },
] as const;

export async function computeBadges(userId: string): Promise<Badge[]> {
  const [entries, profile, user] = await Promise.all([
    db.progressEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 180,
      select: {
        date: true,
        weightLbs: true,
        proteinG: true,
        waterOz: true,
      },
    }),
    db.patientProfile.findUnique({
      where: { userId },
      select: { weightLbs: true, goalWeightLbs: true },
    }),
    db.user.findUnique({
      where: { id: userId },
      select: { createdAt: true },
    }),
  ]);

  const now = new Date();
  const daysActive = user ? Math.floor((now.getTime() - user.createdAt.getTime()) / (24 * 60 * 60 * 1000)) : 0;

  // First weight from earliest entry
  const startWeight = entries.length > 0
    ? entries[entries.length - 1].weightLbs || profile?.weightLbs || 0
    : profile?.weightLbs || 0;
  const currentWeight = entries.length > 0
    ? entries[0].weightLbs || profile?.weightLbs || 0
    : profile?.weightLbs || 0;
  const weightLost = startWeight - currentWeight;

  // Streak computation (for week warrior)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayMs = 24 * 60 * 60 * 1000;
  const seenDates = new Set<string>();
  const uniqueDays: Date[] = [];
  for (const entry of entries) {
    const d = new Date(entry.date);
    d.setHours(0, 0, 0, 0);
    const key = d.toISOString();
    if (!seenDates.has(key)) {
      seenDates.add(key);
      uniqueDays.push(d);
    }
  }
  let streak = 0;
  for (let i = 0; i < uniqueDays.length; i++) {
    const expected = new Date(today.getTime() - i * dayMs);
    expected.setHours(0, 0, 0, 0);
    if (uniqueDays[i].getTime() === expected.getTime()) {
      streak++;
    } else break;
  }

  // Protein streak (consecutive days hitting >=140g target)
  const PROTEIN_TARGET = 140;
  let proteinStreak = 0;
  for (const entry of entries) {
    if (entry.proteinG && entry.proteinG >= PROTEIN_TARGET) {
      proteinStreak++;
    } else break;
  }

  // Water streak (consecutive days hitting >=100oz target)
  const WATER_TARGET = 100;
  let waterStreak = 0;
  for (const entry of entries) {
    if (entry.waterOz && entry.waterOz >= WATER_TARGET) {
      waterStreak++;
    } else break;
  }

  // Find earned date helpers
  function firstEntryDate(): Date | undefined {
    return entries.length > 0 ? new Date(entries[entries.length - 1].date) : undefined;
  }

  function dateNDaysAgo(n: number): Date {
    return new Date(now.getTime() - n * dayMs);
  }

  const badges: Badge[] = BADGE_DEFINITIONS.map((def) => {
    let earned = false;
    let earnedAt: Date | undefined;

    switch (def.id) {
      case "first_log":
        earned = entries.length > 0;
        earnedAt = firstEntryDate();
        break;
      case "week_warrior":
        earned = streak >= 7;
        if (earned) earnedAt = dateNDaysAgo(0); // earned "today" or when streak reached 7
        break;
      case "ten_lb_club":
        earned = weightLost >= 10;
        break;
      case "twenty_five_lb_club":
        earned = weightLost >= 25;
        break;
      case "protein_pro":
        earned = proteinStreak >= 7;
        break;
      case "hydration_hero":
        earned = waterStreak >= 7;
        break;
      case "month_strong":
        earned = daysActive >= 30;
        if (earned) earnedAt = new Date(user!.createdAt.getTime() + 30 * dayMs);
        break;
      case "quarter_champion":
        earned = daysActive >= 90;
        if (earned) earnedAt = new Date(user!.createdAt.getTime() + 90 * dayMs);
        break;
    }

    return {
      id: def.id,
      name: def.name,
      description: def.description,
      icon: def.icon,
      earned,
      earnedAt,
    };
  });

  return badges;
}

// ─── Weekly Progress ────────────────────────────────────────

export async function computeWeeklyProgress(userId: string): Promise<WeeklyProgress> {
  const now = new Date();
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() - now.getDay()); // Sunday
  startOfThisWeek.setHours(0, 0, 0, 0);

  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

  const twoWeeksAgo = new Date(startOfLastWeek);

  const entries = await db.progressEntry.findMany({
    where: {
      userId,
      date: { gte: twoWeeksAgo },
      weightLbs: { not: null },
    },
    orderBy: { date: "desc" },
    select: { date: true, weightLbs: true },
  });

  // Average weight this week
  const thisWeekEntries = entries.filter((e) => new Date(e.date) >= startOfThisWeek);
  const lastWeekEntries = entries.filter(
    (e) => new Date(e.date) >= startOfLastWeek && new Date(e.date) < startOfThisWeek
  );

  const avg = (arr: Array<{ weightLbs: number | null }>) => {
    const valid = arr.filter((e) => e.weightLbs !== null);
    if (valid.length === 0) return null;
    return valid.reduce((sum, e) => sum + (e.weightLbs || 0), 0) / valid.length;
  };

  const thisWeek = avg(thisWeekEntries);
  const lastWeek = avg(lastWeekEntries);

  return {
    thisWeek: thisWeek !== null ? Math.round(thisWeek * 10) / 10 : null,
    lastWeek: lastWeek !== null ? Math.round(lastWeek * 10) / 10 : null,
    change: thisWeek !== null && lastWeek !== null ? Math.round((thisWeek - lastWeek) * 10) / 10 : null,
  };
}
