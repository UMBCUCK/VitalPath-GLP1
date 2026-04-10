import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

// ─── Types ──────────────────────────────────────────────────

interface Variant {
  id: string;
  name: string;
  weight: number;
}

interface VariantResult {
  variantId: string;
  variantName: string;
  assignments: number;
  conversions: number;
  conversionRate: number;
  totalRevenue: number;
  confidence: number;
}

// ─── Get experiments with assignment counts ─────────────────

export async function getExperiments(page = 1, limit = 20) {
  const [experiments, total] = await Promise.all([
    db.experiment.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: { select: { assignments: true } },
      },
    }),
    db.experiment.count(),
  ]);

  const enriched = experiments.map((exp) => {
    const variants = exp.variants as unknown as Variant[];
    const conversions = (exp._count as { assignments: number }).assignments;
    return {
      id: exp.id,
      name: exp.name,
      description: exp.description,
      status: exp.status,
      metric: exp.metric,
      variants,
      variantCount: variants.length,
      totalAssignments: conversions,
      results: exp.results,
      startedAt: exp.startedAt,
      endedAt: exp.endedAt,
      createdBy: exp.createdBy,
      createdAt: exp.createdAt,
      updatedAt: exp.updatedAt,
    };
  });

  return { experiments: enriched, total, page, limit };
}

// ─── Create experiment ──────────────────────────────────────

export async function createExperiment(data: {
  name: string;
  description?: string;
  metric: string;
  variants: Variant[];
  createdBy: string;
}) {
  return db.experiment.create({
    data: {
      name: data.name,
      description: data.description || null,
      metric: data.metric,
      variants: data.variants as unknown as Prisma.InputJsonValue,
      status: "DRAFT",
      createdBy: data.createdBy,
    },
  });
}

// ─── Update experiment ──────────────────────────────────────

export async function updateExperiment(
  id: string,
  data: {
    name?: string;
    description?: string;
    status?: string;
    metric?: string;
    variants?: Variant[];
  }
) {
  const updateData: Record<string, unknown> = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.metric !== undefined) updateData.metric = data.metric;
  if (data.variants !== undefined) updateData.variants = data.variants;

  if (data.status !== undefined) {
    updateData.status = data.status;
    if (data.status === "RUNNING" && !updateData.startedAt) {
      updateData.startedAt = new Date();
    }
    if (data.status === "COMPLETED") {
      updateData.endedAt = new Date();
    }
  }

  return db.experiment.update({
    where: { id },
    data: updateData,
  });
}

// ─── Compute experiment results with statistical significance

export async function getExperimentResults(
  experimentId: string
): Promise<VariantResult[]> {
  const experiment = await db.experiment.findUnique({
    where: { id: experimentId },
  });
  if (!experiment) throw new Error("Experiment not found");

  const variants = experiment.variants as unknown as Variant[];
  const assignments = await db.experimentAssignment.findMany({
    where: { experimentId },
  });

  // Group assignments by variant
  const variantStats = new Map<
    string,
    { assignments: number; conversions: number; revenue: number }
  >();

  for (const v of variants) {
    variantStats.set(v.id, { assignments: 0, conversions: 0, revenue: 0 });
  }

  for (const a of assignments) {
    const stats = variantStats.get(a.variantId);
    if (stats) {
      stats.assignments++;
      if (a.convertedAt) stats.conversions++;
      if (a.revenue) stats.revenue += a.revenue;
    }
  }

  // Find control variant (first one)
  const controlId = variants[0]?.id;
  const controlStats = variantStats.get(controlId || "");

  const results: VariantResult[] = variants.map((v) => {
    const stats = variantStats.get(v.id) || {
      assignments: 0,
      conversions: 0,
      revenue: 0,
    };
    const rate =
      stats.assignments > 0 ? stats.conversions / stats.assignments : 0;

    // Z-test for statistical significance against control
    let confidence = 0;
    if (controlStats && v.id !== controlId && stats.assignments > 0 && controlStats.assignments > 0) {
      const pControl =
        controlStats.assignments > 0
          ? controlStats.conversions / controlStats.assignments
          : 0;
      const pVariant = rate;
      const nControl = controlStats.assignments;
      const nVariant = stats.assignments;

      // Pooled proportion
      const pPooled =
        (controlStats.conversions + stats.conversions) / (nControl + nVariant);

      if (pPooled > 0 && pPooled < 1) {
        const se = Math.sqrt(
          pPooled * (1 - pPooled) * (1 / nControl + 1 / nVariant)
        );
        if (se > 0) {
          const z = Math.abs(pVariant - pControl) / se;
          // Convert z-score to approximate confidence
          // z=1.645 => 90%, z=1.96 => 95%, z=2.576 => 99%
          if (z >= 2.576) confidence = 99;
          else if (z >= 1.96) confidence = 95;
          else if (z >= 1.645) confidence = 90;
          else if (z >= 1.28) confidence = 80;
          else confidence = Math.round(z * 50);
        }
      }
    }

    return {
      variantId: v.id,
      variantName: v.name,
      assignments: stats.assignments,
      conversions: stats.conversions,
      conversionRate: Math.round(rate * 10000) / 100,
      totalRevenue: stats.revenue,
      confidence: v.id === controlId ? -1 : confidence, // -1 = control (baseline)
    };
  });

  // Save computed results back to experiment
  await db.experiment.update({
    where: { id: experimentId },
    data: { results: results as unknown as Prisma.InputJsonValue },
  });

  return results;
}

// ─── Assign a user/session to an experiment variant ────────

export async function assignToExperiment(
  experimentId: string,
  userId?: string,
  sessionId?: string
) {
  const experiment = await db.experiment.findUnique({
    where: { id: experimentId },
  });
  if (!experiment || experiment.status !== "RUNNING") {
    return null;
  }

  // Check for existing assignment
  if (userId) {
    const existing = await db.experimentAssignment.findFirst({
      where: { experimentId, userId },
    });
    if (existing) return existing;
  }

  const variants = experiment.variants as unknown as Variant[];
  const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);

  // Weighted random selection
  let random = Math.random() * totalWeight;
  let selectedVariant = variants[0];
  for (const v of variants) {
    random -= v.weight;
    if (random <= 0) {
      selectedVariant = v;
      break;
    }
  }

  return db.experimentAssignment.create({
    data: {
      experimentId,
      userId: userId || null,
      sessionId: sessionId || null,
      variantId: selectedVariant.id,
    },
  });
}
