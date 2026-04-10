import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  parseNaturalQuery,
  executeNaturalQuery,
  saveQuery,
  getRecentQueries,
} from "@/lib/admin-nl-query";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const parsed = parseNaturalQuery(query.trim());
    const { results, count } = await executeNaturalQuery(parsed);

    // Save the query for history
    await saveQuery(query.trim(), parsed.filters, count, session.userId);

    return NextResponse.json({
      parsed: {
        entity: parsed.entity,
        description: parsed.description,
      },
      results,
      count,
    });
  } catch (error) {
    console.error("Query execution error:", error);
    return NextResponse.json(
      { error: "Failed to execute query" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const recentQueries = await getRecentQueries(session.userId, 10);

  return NextResponse.json({ recentQueries });
}
