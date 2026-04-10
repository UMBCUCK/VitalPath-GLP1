import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getApiKeys, createApiKey, revokeApiKey } from "@/lib/admin-api-keys";

// ─── GET: List all API keys ────────────────────────────────

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keys = await getApiKeys();
  return NextResponse.json({ keys });
}

// ─── POST: Create a new API key ────────────────────────────

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, scopes, rateLimit, expiresAt } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  if (!scopes || !Array.isArray(scopes) || scopes.length === 0) {
    return NextResponse.json(
      { error: "At least one scope is required" },
      { status: 400 }
    );
  }

  const result = await createApiKey(
    name.trim(),
    scopes,
    rateLimit || 1000,
    expiresAt ? new Date(expiresAt) : null,
    session.userId
  );

  return NextResponse.json({ key: result }, { status: 201 });
}

// ─── DELETE: Revoke an API key ─────────────────────────────

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Key ID is required" }, { status: 400 });
  }

  await revokeApiKey(id);

  return NextResponse.json({ success: true });
}
