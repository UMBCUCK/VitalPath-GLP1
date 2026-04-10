import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { safeError } from "@/lib/logger";

const saveSchema = z.object({
  weightLbs: z.number().min(50).max(700),
  heightInches: z.number().min(36).max(96),
  goalWeightLbs: z.number().min(50).max(700).optional(),
  bmi: z.number().optional(),
  tdee: z.number().optional(),
  proteinMin: z.number().optional(),
  proteinMax: z.number().optional(),
  waterOz: z.number().optional(),
  macros: z.object({
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
  }).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const parsed = saveSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { weightLbs, heightInches, goalWeightLbs, bmi, tdee, proteinMin, proteinMax, waterOz, macros } = parsed.data;

    // Build notes JSON with calculator data that doesn't have dedicated columns
    const calculatorData = {
      source: "health-profile-calculator",
      tdee,
      proteinRange: proteinMin && proteinMax ? { min: proteinMin, max: proteinMax } : undefined,
      macros,
    };

    // Save as a progress entry + update profile
    const [entry] = await Promise.all([
      db.progressEntry.create({
        data: {
          userId: session.userId,
          weightLbs,
          bmi,
          waterOz,
          proteinG: proteinMin ? Math.round((proteinMin + (proteinMax || proteinMin)) / 2) : undefined,
          notes: JSON.stringify(calculatorData),
        },
      }),
      db.patientProfile.upsert({
        where: { userId: session.userId },
        update: {
          weightLbs,
          heightInches,
          ...(goalWeightLbs ? { goalWeightLbs } : {}),
        },
        create: {
          userId: session.userId,
          weightLbs,
          heightInches,
          goalWeightLbs,
          contraindications: false,
        },
      }),
    ]);

    return NextResponse.json({ saved: true, entryId: entry.id });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    safeError("[Health Profile API]", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ profile: null });
    }

    const [profile, latestEntry] = await Promise.all([
      db.patientProfile.findUnique({
        where: { userId: session.userId },
        select: {
          heightInches: true,
          weightLbs: true,
          goalWeightLbs: true,
        },
      }),
      db.progressEntry.findFirst({
        where: {
          userId: session.userId,
          notes: { contains: "health-profile-calculator" },
        },
        orderBy: { date: "desc" },
      }),
    ]);

    let savedResults: Record<string, unknown> | null = null;
    if (latestEntry?.notes) {
      try {
        const data = JSON.parse(latestEntry.notes);
        savedResults = {
          date: latestEntry.date,
          weightLbs: latestEntry.weightLbs,
          bmi: latestEntry.bmi,
          waterOz: latestEntry.waterOz,
          proteinG: latestEntry.proteinG,
          tdee: data.tdee,
          proteinRange: data.proteinRange,
          macros: data.macros,
        };
      } catch { /* ignore parse errors */ }
    }

    return NextResponse.json({ profile, savedResults });
  } catch (error) {
    safeError("[Health Profile API]", error);
    return NextResponse.json({ profile: null });
  }
}
