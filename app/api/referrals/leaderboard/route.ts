import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { safeError } from "@/lib/logger";

export async function GET() {
  try {
    const session = await requireAuth();

    // Top 10 referrers by totalReferred
    const top = await db.referralCode.findMany({
      where: { totalReferred: { gt: 0 }, isActive: true },
      orderBy: { totalReferred: "desc" },
      take: 10,
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    // Find user's own code rank (even if outside top 10)
    const myCode = await db.referralCode.findFirst({
      where: { userId: session.userId, isActive: true },
      select: { id: true, totalReferred: true, totalEarned: true, tier: true },
    });

    let myRank: number | null = null;
    let myEntry: {
      rank: number;
      name: string;
      isMe: true;
      totalReferred: number;
      totalEarned: number;
      tier: string;
    } | null = null;

    if (myCode && myCode.totalReferred > 0) {
      // Count how many codes have more referrals (rank = count + 1)
      const ahead = await db.referralCode.count({
        where: { totalReferred: { gt: myCode.totalReferred }, isActive: true },
      });
      myRank = ahead + 1;

      // Only build myEntry if NOT already in top 10
      const alreadyInTop = top.some((rc) => rc.userId === session.userId);
      if (!alreadyInTop) {
        myEntry = {
          rank: myRank,
          name: "You",
          isMe: true,
          totalReferred: myCode.totalReferred,
          totalEarned: myCode.totalEarned,
          tier: myCode.tier,
        };
      }
    }

    return NextResponse.json({
      leaderboard: top.map((rc, i) => {
        const isMe = rc.userId === session.userId;
        const first = rc.user.firstName || "";
        const last = rc.user.lastName || "";
        const name = isMe
          ? "You"
          : first
          ? `${first.charAt(0).toUpperCase()}. ${last ? last.charAt(0).toUpperCase() + "." : ""}`.trim()
          : `Member`;

        return {
          rank: i + 1,
          name,
          isMe,
          totalReferred: rc.totalReferred,
          totalEarned: rc.totalEarned,
          tier: rc.tier,
        };
      }),
      myRank,
      myEntry,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    safeError("[Leaderboard API]", error);
    return NextResponse.json({ leaderboard: [], myRank: null, myEntry: null });
  }
}
