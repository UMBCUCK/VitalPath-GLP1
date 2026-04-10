import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { loginUser } from "@/lib/auth";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { safeError } from "@/lib/logger";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  // Rate limit: 5 attempts per minute per IP
  const { success, remaining } = await rateLimit(getRateLimitKey(req, "auth-login"), {
    maxTokens: 5,
  });

  if (!success) {
    return NextResponse.json(
      { error: "Too many login attempts. Please wait a moment." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const result = await loginUser(parsed.data.email, parsed.data.password);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    const response = NextResponse.json({ user: result.user });
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    return response;
  } catch (error) {
    safeError("[Login API]", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
