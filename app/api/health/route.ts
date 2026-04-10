import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Health check endpoint — reports DB connectivity and data status.
 * GET /api/health
 */
export async function GET() {
  const checks: Record<string, unknown> = {
    status: "ok",
    timestamp: new Date().toISOString(),
  };

  try {
    // Check DB connectivity
    const productCount = await db.product.count();
    const userCount = await db.user.count();
    const blogPostCount = await db.blogPost.count();

    checks.database = "connected";
    checks.products = productCount;
    checks.users = userCount;
    checks.blogPosts = blogPostCount;
    checks.seeded = productCount > 0;
  } catch (error) {
    checks.database = "error";
    checks.error = error instanceof Error ? error.message : "Unknown error";
  }

  return NextResponse.json(checks);
}
