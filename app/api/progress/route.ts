import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";

const progressSchema = z.object({
  weightLbs: z.number().optional(),
  waistInches: z.number().optional(),
  hipsInches: z.number().optional(),
  chestInches: z.number().optional(),
  armInches: z.number().optional(),
  thighInches: z.number().optional(),
  waterOz: z.number().optional(),
  proteinG: z.number().optional(),
  steps: z.number().optional(),
  sleepHours: z.number().optional(),
  moodRating: z.number().min(1).max(5).optional(),
  energyRating: z.number().min(1).max(5).optional(),
  medicationTaken: z.boolean().optional(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const parsed = progressSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Calculate BMI if weight provided
    let bmi: number | undefined;
    if (parsed.data.weightLbs) {
      const profile = await db.patientProfile.findUnique({
        where: { userId: session.userId },
        select: { heightInches: true },
      });
      if (profile?.heightInches) {
        bmi = (parsed.data.weightLbs / (profile.heightInches * profile.heightInches)) * 703;
      }
    }

    const [entry] = await Promise.all([
      db.progressEntry.create({
        data: {
          userId: session.userId,
          ...parsed.data,
          bmi,
        },
      }),
      // Update profile weight if provided
      ...(parsed.data.weightLbs
        ? [db.patientProfile.update({
            where: { userId: session.userId },
            data: { weightLbs: parsed.data.weightLbs },
          })]
        : []),
    ]);

    return NextResponse.json({ entry });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[Progress API]", error);
    return NextResponse.json({ error: "Failed to log progress" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const url = new URL(req.url);
    const days = parseInt(url.searchParams.get("days") || "90");

    const since = new Date();
    since.setDate(since.getDate() - days);

    const entries = await db.progressEntry.findMany({
      where: {
        userId: session.userId,
        date: { gte: since },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ entries });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[Progress API]", error);
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}
