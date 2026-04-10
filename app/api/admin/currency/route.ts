import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getCurrencies,
  createCurrency,
  updateCurrency,
  getTaxRules,
  createTaxRule,
  updateTaxRule,
  deleteTaxRule,
  calculateTax,
  convertPrice,
} from "@/lib/admin-currency";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl.searchParams;
  const section = url.get("section"); // "currencies" | "tax-rules" | "calculate" | "convert"

  if (section === "calculate") {
    const amount = parseInt(url.get("amount") ?? "0");
    const jurisdiction = url.get("jurisdiction") ?? "";
    const productType = url.get("productType") ?? "ALL";
    const result = await calculateTax(amount, jurisdiction, productType);
    return NextResponse.json(result);
  }

  if (section === "convert") {
    const amount = parseInt(url.get("amount") ?? "0");
    const from = url.get("from") ?? "USD";
    const to = url.get("to") ?? "USD";
    const converted = await convertPrice(amount, from, to);
    return NextResponse.json({ converted, from, to, original: amount });
  }

  const jurisdiction = url.get("jurisdiction") ?? undefined;

  const [currencies, taxRules] = await Promise.all([
    getCurrencies(),
    getTaxRules(jurisdiction),
  ]);

  return NextResponse.json({ currencies, taxRules });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { type } = body; // "currency" | "tax-rule"

  if (type === "currency") {
    const { currencyCode, symbol, exchangeRate, isActive } = body;
    if (!currencyCode || !symbol) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const currency = await createCurrency({
      currencyCode,
      symbol,
      exchangeRate: exchangeRate ?? 1.0,
      isActive: isActive ?? true,
    });
    return NextResponse.json(currency, { status: 201 });
  }

  if (type === "tax-rule") {
    const { jurisdiction, taxRate, taxName, appliesTo, isActive } = body;
    if (!jurisdiction || taxRate == null || !taxName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const rule = await createTaxRule({
      jurisdiction,
      taxRate,
      taxName,
      appliesTo: appliesTo ?? "ALL",
      isActive: isActive ?? true,
    });
    return NextResponse.json(rule, { status: 201 });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { type, id, ...data } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  if (type === "currency") {
    const currency = await updateCurrency(id, data);
    return NextResponse.json(currency);
  }

  if (type === "tax-rule") {
    const rule = await updateTaxRule(id, data);
    return NextResponse.json(rule);
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl.searchParams;
  const id = url.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  await deleteTaxRule(id);
  return NextResponse.json({ success: true });
}
