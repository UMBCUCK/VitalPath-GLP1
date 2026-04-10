import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const RESELLER_COOKIE = "vp-reseller-session";
const RESELLER_SESSION_DURATION = 7 * 24 * 60 * 60; // 7 days

const secret = process.env.NEXTAUTH_SECRET;
const RESELLER_JWT_SECRET = new TextEncoder().encode(
  (secret || "vitalpath-dev-secret-change-in-production") + "-reseller"
);

// ─── Types ──────────────────────────────────────────────────────

interface ResellerPayload {
  resellerId: string;
  userId: string;
  email: string;
}

export interface ResellerSessionData {
  resellerId: string;
  userId: string;
  email: string;
  displayName: string;
  companyName: string | null;
  tier: string;
  status: string;
}

// ─── Token helpers ─────────────────────────────────────────────

export async function createResellerToken(
  resellerId: string
): Promise<string> {
  const reseller = await db.resellerProfile.findUnique({
    where: { id: resellerId },
    include: {
      commissions: false,
    },
  });

  if (!reseller) throw new Error("Reseller not found");

  const user = await db.user.findUnique({
    where: { id: reseller.userId },
    select: { email: true },
  });

  if (!user) throw new Error("Reseller user not found");

  const payload: ResellerPayload = {
    resellerId,
    userId: reseller.userId,
    email: user.email,
  };

  const token = await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${RESELLER_SESSION_DURATION}s`)
    .sign(RESELLER_JWT_SECRET);

  // Store session in DB
  await db.resellerSession.create({
    data: {
      resellerId,
      token,
      expiresAt: new Date(Date.now() + RESELLER_SESSION_DURATION * 1000),
    },
  });

  return token;
}

export async function verifyResellerToken(
  token: string
): Promise<ResellerPayload | null> {
  try {
    const { payload } = await jwtVerify(token, RESELLER_JWT_SECRET);

    // Also check DB session is valid
    const session = await db.resellerSession.findUnique({
      where: { token },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    return payload as unknown as ResellerPayload;
  } catch {
    return null;
  }
}

// ─── Session management ────────────────────────────────────────

export async function createResellerSession(
  resellerId: string
): Promise<void> {
  const token = await createResellerToken(resellerId);
  const cookieStore = await cookies();

  cookieStore.set(RESELLER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: RESELLER_SESSION_DURATION,
    path: "/",
  });
}

export async function getResellerSession(): Promise<ResellerSessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(RESELLER_COOKIE)?.value;
  if (!token) return null;

  const payload = await verifyResellerToken(token);
  if (!payload) return null;

  const reseller = await db.resellerProfile.findUnique({
    where: { id: payload.resellerId },
    select: {
      id: true,
      userId: true,
      displayName: true,
      companyName: true,
      tier: true,
      status: true,
    },
  });

  if (!reseller || reseller.status !== "ACTIVE") return null;

  return {
    resellerId: reseller.id,
    userId: reseller.userId,
    email: payload.email,
    displayName: reseller.displayName,
    companyName: reseller.companyName,
    tier: reseller.tier,
    status: reseller.status,
  };
}

export async function destroyResellerSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(RESELLER_COOKIE)?.value;

  if (token) {
    // Clean up DB session
    try {
      await db.resellerSession.delete({ where: { token } });
    } catch {
      // Token may not exist in DB, that's fine
    }
  }

  cookieStore.delete(RESELLER_COOKIE);
}
