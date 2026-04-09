import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { JWT_SECRET, COOKIE_NAME, SESSION_DURATION } from "@/lib/constants";
import type { UserRole } from "@prisma/client";

// ─── Password helpers ───────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ─── JWT helpers ────────────────────────────────────────────

interface SessionPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export async function createToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// ─── Session management ─────────────────────────────────────

export async function createSession(userId: string, email: string, role: UserRole): Promise<void> {
  const token = await createToken({ userId, email, role });
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ─── Auth actions ───────────────────────────────────────────

export async function registerUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  const existing = await db.user.findUnique({ where: { email: data.email } });
  if (existing) {
    return { error: "An account with this email already exists" };
  }

  const passwordHash = await hashPassword(data.password);

  const user = await db.user.create({
    data: {
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      role: "PATIENT",
    },
  });

  await createSession(user.id, user.email, user.role);

  return { user: { id: user.id, email: user.email, role: user.role } };
}

export async function loginUser(email: string, password: string) {
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
    return { error: "Invalid email or password" };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password" };
  }

  await createSession(user.id, user.email, user.role);

  return { user: { id: user.id, email: user.email, role: user.role } };
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
      profile: {
        select: {
          heightInches: true,
          weightLbs: true,
          goalWeightLbs: true,
          state: true,
          stripeCustomerId: true,
        },
      },
    },
  });

  return user;
}

// ─── Route protection helpers ───────────────────────────────

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return session;
}
