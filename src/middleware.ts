import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const rawSecret = process.env.AUTH_SECRET;
if (!rawSecret) throw new Error("AUTH_SECRET must be set");
const SECRET = new TextEncoder().encode(rawSecret);

const PROTECTED = ["/dashboard", "/onboarding"];
const AUTH_ROUTES = ["/auth/login", "/auth/signup", "/auth"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"));

  const token = req.cookies.get("buildr_session")?.value;
  let valid = false;

  if (token) {
    try {
      await jwtVerify(token, SECRET);
      valid = true;
    } catch {
      valid = false;
    }
  }

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !valid) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && valid) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/auth",
    "/auth/:path*",
  ],
};
