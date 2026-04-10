import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Public GET — returns active medications sorted by sortOrder
// Requires: npx prisma db push to create the MedicationCatalog table
export async function GET() {
  try {
    const medications = await (db as any).medicationCatalog.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        type: true,
        form: true,
      },
    });
    return NextResponse.json({ medications });
  } catch {
    // Return empty array if table doesn't exist yet (pre-migration)
    return NextResponse.json({ medications: [] });
  }
}
