import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { JWT_SECRET, COOKIE_NAME } from "@/lib/constants";

const protectedRoutes = ["/dashboard"];
const adminRoutes = ["/admin"];
const providerRoutes = ["/provider"];
const resellerRoutes = ["/reseller"];
const resellerAuthRoutes = ["/reseller/login"];
const authRoutes = ["/login", "/register"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Trailing slash normalization — prevent duplicate content
  if (pathname !== "/" && pathname.endsWith("/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace(/\/+$/, "");
    return NextResponse.redirect(url, 308);
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;

  let session: { userId: string; role: string } | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      session = payload as unknown as { userId: string; role: string };
    } catch {
      // Invalid token — clear it
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  // Redirect authenticated users away from auth pages
  if (authRoutes.some((r) => pathname.startsWith(r)) && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protect dashboard routes
  if (protectedRoutes.some((r) => pathname.startsWith(r)) && !session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protect admin routes
  if (adminRoutes.some((r) => pathname.startsWith(r))) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Protect provider routes
  if (providerRoutes.some((r) => pathname === r || pathname.startsWith(r + "/"))) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (session.role !== "PROVIDER" && session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Protect reseller routes (uses separate cookie: vp-reseller-session)
  if (resellerRoutes.some((r) => pathname.startsWith(r)) && !resellerAuthRoutes.some((r) => pathname === r)) {
    const resellerToken = req.cookies.get("vp-reseller-session")?.value;
    if (!resellerToken) {
      return NextResponse.redirect(new URL("/reseller/login", req.url));
    }
    // Token validation happens at page level via getResellerSession()
    // Middleware just ensures the cookie exists
  }

  // Allow embed pages to be loaded in iframes from any origin
  const response = NextResponse.next();
  if (pathname.startsWith("/embed/")) {
    response.headers.set("X-Frame-Options", "ALLOWALL");
    response.headers.set("Content-Security-Policy", "frame-ancestors *");
  }

  // Tier 9.4 — Reseller click-attribution cookie.
  //
  // When a visitor lands with ?rx=CODE (distinct from ?ref= so the two
  // programs don't collide), we drop a 60-day first-touch cookie. The
  // cookie is read at checkout so the reseller gets commission credit
  // even if the visitor bounces and comes back weeks later.
  //
  // Separate ?ref= param is still used for the existing user-referral
  // program (Give $50 / Get $50) and flows through useFunnelStore.
  const resellerParam = req.nextUrl.searchParams.get("rx");
  if (resellerParam) {
    // Only accept slug-shaped codes, mirrors the existing reseller code
    // regex used in the admin reseller dashboard. Prevents cookie-stuffing
    // attempts from arbitrary URL garbage.
    const cleaned = resellerParam.trim().toLowerCase();
    if (/^[a-z0-9][a-z0-9_-]{1,39}$/.test(cleaned)) {
      const existing = req.cookies.get("nj-rx-attr")?.value;
      // Only set if not already present (first-touch attribution wins)
      if (!existing) {
        response.cookies.set("nj-rx-attr", cleaned, {
          maxAge: 60 * 24 * 60 * 60, // 60 days
          httpOnly: false, // readable by client analytics for display in UI
          sameSite: "lax",
          path: "/",
          secure: process.env.NODE_ENV === "production",
        });
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)).*)"],
};
