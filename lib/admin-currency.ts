import { db } from "@/lib/db";

// ─── Currency CRUD ──────────────────────────────────────────

export async function getCurrencies() {
  return db.currencyConfig.findMany({
    orderBy: { currencyCode: "asc" },
  });
}

export async function createCurrency(data: {
  currencyCode: string;
  symbol: string;
  exchangeRate: number;
  isActive: boolean;
}) {
  return db.currencyConfig.create({
    data: {
      currencyCode: data.currencyCode.toUpperCase(),
      symbol: data.symbol,
      exchangeRate: data.exchangeRate,
      isActive: data.isActive,
    },
  });
}

export async function updateCurrency(
  id: string,
  data: { exchangeRate?: number; isActive?: boolean; symbol?: string }
) {
  return db.currencyConfig.update({
    where: { id },
    data,
  });
}

// ─── Tax Rule CRUD ──────────────────────────────────────────

export async function getTaxRules(jurisdiction?: string) {
  const where = jurisdiction ? { jurisdiction } : {};
  return db.taxRule.findMany({
    where,
    orderBy: [{ jurisdiction: "asc" }, { appliesTo: "asc" }],
  });
}

export async function createTaxRule(data: {
  jurisdiction: string;
  taxRate: number;
  taxName: string;
  appliesTo: string;
  isActive: boolean;
}) {
  return db.taxRule.create({
    data: {
      jurisdiction: data.jurisdiction.toUpperCase(),
      taxRate: data.taxRate,
      taxName: data.taxName,
      appliesTo: data.appliesTo,
      isActive: data.isActive,
    },
  });
}

export async function updateTaxRule(
  id: string,
  data: { taxRate?: number; taxName?: string; appliesTo?: string; isActive?: boolean }
) {
  return db.taxRule.update({
    where: { id },
    data,
  });
}

export async function deleteTaxRule(id: string) {
  return db.taxRule.delete({ where: { id } });
}

// ─── Tax calculation ─────────────────────────────────────────

export async function calculateTax(
  amountCents: number,
  jurisdiction: string,
  productType: string
): Promise<{ taxAmount: number; taxRate: number; taxName: string }> {
  // Find applicable tax rule — try specific appliesTo first, then ALL
  const rule = await db.taxRule.findFirst({
    where: {
      jurisdiction: jurisdiction.toUpperCase(),
      isActive: true,
      OR: [
        { appliesTo: productType.toUpperCase() },
        { appliesTo: "ALL" },
      ],
    },
    orderBy: { appliesTo: "desc" }, // specific type rules before ALL
  });

  if (!rule) {
    return { taxAmount: 0, taxRate: 0, taxName: "No Tax" };
  }

  const taxAmount = Math.round(amountCents * rule.taxRate);
  return {
    taxAmount,
    taxRate: rule.taxRate,
    taxName: rule.taxName,
  };
}

// ─── Currency conversion ─────────────────────────────────────

export async function convertPrice(
  amountCents: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  if (fromCurrency.toUpperCase() === toCurrency.toUpperCase()) {
    return amountCents;
  }

  const [from, to] = await Promise.all([
    db.currencyConfig.findUnique({ where: { currencyCode: fromCurrency.toUpperCase() } }),
    db.currencyConfig.findUnique({ where: { currencyCode: toCurrency.toUpperCase() } }),
  ]);

  if (!from || !to) {
    throw new Error(`Currency not found: ${!from ? fromCurrency : toCurrency}`);
  }

  // Convert: amount in fromCurrency → USD → toCurrency
  const amountInUSD = amountCents / from.exchangeRate;
  const converted = Math.round(amountInUSD * to.exchangeRate);
  return converted;
}
