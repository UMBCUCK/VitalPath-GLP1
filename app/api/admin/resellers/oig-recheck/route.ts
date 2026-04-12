import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { runOIGCheckForReseller } from "@/lib/services/oig-check";
import { safeError, safeLog } from "@/lib/logger";

// POST — run OIG check for a specific reseller or batch of stale resellers
export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const { resellerId, batch } = await req.json() as {
      resellerId?: string;
      batch?: boolean; // if true, re-check all stale resellers
    };

    if (resellerId) {
      // Single reseller check
      const reseller = await db.resellerProfile.findUnique({
        where: { id: resellerId },
        select: { id: true, displayName: true, w9State: true },
      });
      if (!reseller) return NextResponse.json({ error: "Reseller not found" }, { status: 404 });

      const nameParts = reseller.displayName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const result = await runOIGCheckForReseller(resellerId, firstName, lastName, reseller.w9State || undefined);

      await db.adminAuditLog.create({
        data: {
          userId: session.userId,
          action: "reseller.oig_recheck",
          entity: "ResellerProfile",
          entityId: resellerId,
          details: result,
        },
      });

      return NextResponse.json({ result });
    }

    if (batch) {
      // Batch: re-check all stale resellers (OIG check > 90 days or never done)
      const ninetyDaysAgo = new Date(Date.now() - 90 * 86400000);
      const stale = await db.resellerProfile.findMany({
        where: {
          status: { in: ["ACTIVE", "PAUSED"] },
          OR: [
            { oigCheckPassedAt: null },
            { oigCheckPassedAt: { lt: ninetyDaysAgo } },
          ],
        },
        select: { id: true, displayName: true, w9State: true },
        take: 50, // process max 50 at a time to avoid timeout
      });

      const results: Array<{ id: string; name: string; result: string }> = [];
      let flaggedCount = 0;

      for (const reseller of stale) {
        const nameParts = reseller.displayName.split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        try {
          const result = await runOIGCheckForReseller(
            reseller.id, firstName, lastName, reseller.w9State || undefined
          );
          results.push({ id: reseller.id, name: reseller.displayName, result: result.oigResult });
          if (result.oigResult === "FLAGGED") flaggedCount++;
        } catch (err) {
          results.push({ id: reseller.id, name: reseller.displayName, result: "ERROR" });
        }

        // Rate limit: 500ms between calls to not hammer the API
        await new Promise((r) => setTimeout(r, 500));
      }

      safeLog("[OIG Batch]", `Checked ${stale.length} resellers, ${flaggedCount} flagged`);
      return NextResponse.json({
        checked: stale.length,
        flagged: flaggedCount,
        results,
      });
    }

    return NextResponse.json({ error: "Provide resellerId or batch:true" }, { status: 400 });
  } catch (err) {
    safeError("[OIG Recheck] Error", err);
    return NextResponse.json({ error: "OIG check failed" }, { status: 500 });
  }
}
