import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes — ADMIN role ONLY (not clearance-based)
  if (pathname.startsWith("/admin")) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET || "fallback_volt_secret_key_123" });

    // Not authenticated at all
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/membership";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    // Only role = "ADMIN" can access the admin panel
    const role = token.role as string;

    if (role !== "ADMIN") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // Protect /api/debug routes — only accessible in dev or by ADMIN
  if (pathname.startsWith("/api/debug")) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET || "fallback_volt_secret_key_123" });

    if (!token || (token.role as string) !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/debug/:path*"],
};
