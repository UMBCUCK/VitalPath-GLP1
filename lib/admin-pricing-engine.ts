import { db } from "@/lib/db";

// ─── Types ──────────────────────────────────────────────────

interface PricingCondition {
  field: string;
  operator: string;
  value: string;
}

interface EvaluationContext {
  state?: string;
  segment?: string;
  quantity?: number;
}

interface AppliedRule {
  id: string;
  name: string;
  ruleType: string;
  adjustment: string;
  adjustmentValue: number;
  savedCents: number;
}

interface EvaluationResult {
  originalPrice: number;
  adjustedPrice: number;
  appliedRules: AppliedRule[];
}

interface SimulationResult {
  currentRevenue: number;
  projectedRevenue: number;
  affectedSubscribers: number;
  revenueImpact: number;
}

// ─── CRUD ───────────────────────────────────────────────────

export async function getPricingRules(page = 1, limit = 50) {
  const skip = (page - 1) * limit;

  const [rules, total] = await Promise.all([
    db.pricingRule.findMany({
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
    db.pricingRule.count(),
  ]);

  // Attach product names
  const productIds = rules
    .map((r) => r.productId)
    .filter((id): id is string => id !== null);

  const products =
    productIds.length > 0
      ? await db.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true, name: true },
        })
      : [];

  const productMap = new Map(products.map((p) => [p.id, p.name]));

  const rulesWithProducts = rules.map((r) => ({
    ...r,
    productName: r.productId ? productMap.get(r.productId) ?? "Unknown" : "All Products",
  }));

  return { rules: rulesWithProducts, total, page, limit };
}

export async function createPricingRule(data: {
  name: string;
  productId?: string | null;
  ruleType: string;
  conditions: PricingCondition[];
  adjustment: string;
  adjustmentValue: number;
  priority?: number;
  isActive?: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
}) {
  return db.pricingRule.create({
    data: {
      name: data.name,
      productId: data.productId || null,
      ruleType: data.ruleType,
      conditions: JSON.parse(JSON.stringify(data.conditions)),
      adjustment: data.adjustment,
      adjustmentValue: data.adjustmentValue,
      priority: data.priority ?? 0,
      isActive: data.isActive ?? true,
      startsAt: data.startsAt ? new Date(data.startsAt) : null,
      endsAt: data.endsAt ? new Date(data.endsAt) : null,
    },
  });
}

export async function updatePricingRule(
  id: string,
  data: Partial<{
    name: string;
    productId: string | null;
    ruleType: string;
    conditions: PricingCondition[];
    adjustment: string;
    adjustmentValue: number;
    priority: number;
    isActive: boolean;
    startsAt: string | null;
    endsAt: string | null;
  }>
) {
  const updateData: Record<string, unknown> = { ...data };

  if (data.startsAt !== undefined) {
    updateData.startsAt = data.startsAt ? new Date(data.startsAt) : null;
  }
  if (data.endsAt !== undefined) {
    updateData.endsAt = data.endsAt ? new Date(data.endsAt) : null;
  }

  return db.pricingRule.update({ where: { id }, data: updateData });
}

export async function deletePricingRule(id: string) {
  return db.pricingRule.delete({ where: { id } });
}

// ─── Evaluate Price ─────────────────────────────────────────

function matchCondition(
  condition: PricingCondition,
  context: EvaluationContext
): boolean {
  const contextValue = (context as Record<string, unknown>)[condition.field];
  if (contextValue === undefined || contextValue === null) return false;

  const val = String(contextValue).toLowerCase();
  const target = String(condition.value).toLowerCase();

  switch (condition.operator) {
    case "equals":
      return val === target;
    case "not_equals":
      return val !== target;
    case "contains":
      return val.includes(target);
    case "greater_than":
      return Number(contextValue) > Number(condition.value);
    case "less_than":
      return Number(contextValue) < Number(condition.value);
    case "greater_equal":
      return Number(contextValue) >= Number(condition.value);
    case "less_equal":
      return Number(contextValue) <= Number(condition.value);
    case "in":
      return condition.value
        .split(",")
        .map((v) => v.trim().toLowerCase())
        .includes(val);
    default:
      return false;
  }
}

export async function evaluatePrice(
  productId: string,
  context: EvaluationContext
): Promise<EvaluationResult> {
  const product = await db.product.findUnique({
    where: { id: productId },
    select: { priceMonthly: true },
  });

  if (!product) {
    return { originalPrice: 0, adjustedPrice: 0, appliedRules: [] };
  }

  const now = new Date();

  // Get active rules for this product (or all products), sorted by priority desc
  const rules = await db.pricingRule.findMany({
    where: {
      isActive: true,
      OR: [{ productId }, { productId: null }],
      AND: [
        { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
        { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
      ],
    },
    orderBy: { priority: "desc" },
  });

  let price = product.priceMonthly;
  const appliedRules: AppliedRule[] = [];

  for (const rule of rules) {
    const conditions = (rule.conditions as unknown as PricingCondition[]) || [];
    const allMatch =
      conditions.length === 0 ||
      conditions.every((c) => matchCondition(c, context));

    if (!allMatch) continue;

    const previousPrice = price;

    switch (rule.adjustment) {
      case "PERCENTAGE_OFF":
        price = Math.round(price * (1 - rule.adjustmentValue / 10000));
        break;
      case "FLAT_OFF":
        price = Math.max(0, price - rule.adjustmentValue);
        break;
      case "OVERRIDE":
        price = rule.adjustmentValue;
        break;
    }

    const savedCents = previousPrice - price;

    appliedRules.push({
      id: rule.id,
      name: rule.name,
      ruleType: rule.ruleType,
      adjustment: rule.adjustment,
      adjustmentValue: rule.adjustmentValue,
      savedCents,
    });

    // Increment usage count
    await db.pricingRule.update({
      where: { id: rule.id },
      data: { usageCount: { increment: 1 } },
    });
  }

  return {
    originalPrice: product.priceMonthly,
    adjustedPrice: price,
    appliedRules,
  };
}

// ─── Analytics ──────────────────────────────────────────────

export async function getPricingAnalytics() {
  const [totalRules, activeRules, allRules, products] = await Promise.all([
    db.pricingRule.count(),
    db.pricingRule.count({ where: { isActive: true } }),
    db.pricingRule.findMany({
      orderBy: { usageCount: "desc" },
    }),
    db.product.findMany({
      where: { isActive: true },
      select: { id: true, name: true, priceMonthly: true },
    }),
  ]);

  const totalUsage = allRules.reduce((sum, r) => sum + r.usageCount, 0);

  // Estimate revenue impact: sum of adjustmentValue * usageCount for percentage rules,
  // and adjustmentValue * usageCount for flat rules
  let estimatedSavingsCents = 0;
  const avgProductPrice =
    products.length > 0
      ? products.reduce((s, p) => s + p.priceMonthly, 0) / products.length
      : 29900; // fallback

  for (const rule of allRules) {
    if (rule.usageCount === 0) continue;
    switch (rule.adjustment) {
      case "PERCENTAGE_OFF":
        estimatedSavingsCents +=
          Math.round(avgProductPrice * (rule.adjustmentValue / 10000)) *
          rule.usageCount;
        break;
      case "FLAT_OFF":
        estimatedSavingsCents += rule.adjustmentValue * rule.usageCount;
        break;
      case "OVERRIDE": {
        const diff = avgProductPrice - rule.adjustmentValue;
        if (diff > 0) estimatedSavingsCents += diff * rule.usageCount;
        break;
      }
    }
  }

  const mostUsedRule =
    allRules.length > 0 ? allRules[0] : null;

  // Revenue by type
  const revenueByType: Record<string, number> = {};
  for (const rule of allRules) {
    const type = rule.ruleType;
    if (!revenueByType[type]) revenueByType[type] = 0;
    revenueByType[type] += rule.usageCount;
  }

  return {
    totalRules,
    activeRules,
    totalUsage,
    estimatedSavingsCents,
    mostUsedRule: mostUsedRule
      ? { id: mostUsedRule.id, name: mostUsedRule.name, usageCount: mostUsedRule.usageCount }
      : null,
    revenueByType,
  };
}

// ─── Simulate Price Change ──────────────────────────────────

export async function simulatePriceChange(
  productId: string,
  newPriceCents: number
): Promise<SimulationResult> {
  const product = await db.product.findUnique({
    where: { id: productId },
    select: { id: true, priceMonthly: true },
  });

  if (!product) {
    return {
      currentRevenue: 0,
      projectedRevenue: 0,
      affectedSubscribers: 0,
      revenueImpact: 0,
    };
  }

  // Count active subscribers for this product
  const affectedSubscribers = await db.subscriptionItem.count({
    where: {
      productId,
      subscription: { status: "ACTIVE" },
    },
  });

  const currentRevenue = product.priceMonthly * affectedSubscribers;
  const projectedRevenue = newPriceCents * affectedSubscribers;
  const revenueImpact = projectedRevenue - currentRevenue;

  return {
    currentRevenue,
    projectedRevenue,
    affectedSubscribers,
    revenueImpact,
  };
}
