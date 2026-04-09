import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { JWT_SECRET, COOKIE_NAME } from "@/lib/constants";

const protectedRoutes = ["/dashboard"];
const adminRoutes = ["/admin"];
const providerRoutes = ["/provider"];
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
  if (providerRoutes.some((r) => pathname.startsWith(r))) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (session.role !== "PROVIDER" && session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)).*)"],
};
