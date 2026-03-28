import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Setup Redis-backed rate limiter (only if environment variables are present)
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
    })
  : null;

const ratelimit = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(40, "10 s"),
  analytics: true,
}) : null;

// Stricter rate limiter for auth endpoints (5 req / 10s)
const authRatelimit = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 s"),
  analytics: true,
  prefix: "auth_rl",
}) : null;

// In-memory rate limiter fallback when Redis is unavailable
const memoryStore = new Map<string, { count: number; resetAt: number }>();

function memoryRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = memoryStore.get(key);
  if (!entry || now > entry.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  entry.count += 1;
  return entry.count <= maxRequests;
}

// Resolve client IP from trusted headers (x-real-ip is Vercel-controlled)
function getClientIp(request: NextRequest): string {
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  return "127.0.0.1";
}

// Security headers applied to all responses
const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self' data:; connect-src 'self' https:;",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIp(request);

  // Stricter auth rate limiting for registration and verification endpoints
  const isAuthRoute = pathname === "/api/auth/register" || pathname === "/api/auth/verify";
  if (isAuthRoute) {
    if (authRatelimit) {
      try {
        const { success } = await authRatelimit.limit(`auth_${ip}`);
        if (!success) {
          return new NextResponse("Too Many Requests", { status: 429 });
        }
      } catch {
        // Redis failed — fall back to in-memory
        if (!memoryRateLimit(`auth_${ip}`, 5, 10_000)) {
          return new NextResponse("Too Many Requests", { status: 429 });
        }
      }
    } else {
      // No Redis configured — use in-memory
      if (!memoryRateLimit(`auth_${ip}`, 5, 10_000)) {
        return new NextResponse("Too Many Requests", { status: 429 });
      }
    }
  }

  // Global rate limiting
  if (ratelimit) {
    try {
      const { success, limit, remaining, reset } = await ratelimit.limit(`mw_${ip}`);
      if (!success) {
        return new NextResponse("Too Many Requests", {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        });
      }
    } catch {
      // Redis failed — fall back to in-memory
      if (!memoryRateLimit(`mw_${ip}`, 40, 10_000)) {
        return new NextResponse("Too Many Requests", { status: 429 });
      }
    }
  } else {
    // No Redis configured — use in-memory
    if (!memoryRateLimit(`mw_${ip}`, 40, 10_000)) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }
  }

  const response = NextResponse.next();

  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }

  // Block debug endpoints in production (no auth needed)
  if (pathname.startsWith("/api/debug") && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Fetch token once for all protected route checks
  const needsAuth = pathname.startsWith("/admin") || pathname === "/profile";
  const token = needsAuth
    ? await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    : null;

  // Block BANNED users from all authenticated routes
  if (token && token.role === "BANNED") {
    const url = request.nextUrl.clone();
    url.pathname = "/membership";
    url.searchParams.set("error", "suspended");
    return NextResponse.redirect(url);
  }

  // Protect /admin routes — ADMIN role ONLY
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/membership";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    if (token.role !== "ADMIN") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // Protect /profile — authenticated users only
  if (pathname === "/profile") {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/membership";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/profile", "/api/debug/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
