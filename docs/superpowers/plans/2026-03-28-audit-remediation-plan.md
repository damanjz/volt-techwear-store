# VOLT Techwear Store - Audit Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all 106 audit findings across security, data integrity, performance, architecture, accessibility, and testing in 6 sequential phases.

**Architecture:** Next.js 15 App Router with Prisma ORM (SQLite dev / Postgres prod), NextAuth v4 JWT sessions, Zustand client state, Tailwind CSS 4, deployed on Vercel. Each phase produces an independently deployable increment.

**Tech Stack:** Next.js 15.5, React 19, TypeScript 5, Prisma 6, NextAuth 4, Zustand 5, Vitest 4, Tailwind CSS 4

**Spec:** `docs/superpowers/specs/2026-03-28-comprehensive-audit-remediation-design.md`

---

## Phase 1: Security Hotfixes (CRITICAL - Deploy First)

### Task 1: Validate NEXTAUTH_SECRET at startup

**Files:**
- Modify: `src/lib/auth.ts:1-10`

- [ ] **Step 1: Add secret validation guard at top of auth.ts**

Replace lines 8-9 of `src/lib/auth.ts`:

```typescript
// NEXTAUTH_SECRET validation happens at runtime via NextAuth itself.
// In production, ensure NEXTAUTH_SECRET is set in your environment variables.
```

With:

```typescript
// Fail fast if NEXTAUTH_SECRET is weak or missing
if (
  process.env.NODE_ENV === "production" &&
  (!process.env.NEXTAUTH_SECRET ||
    process.env.NEXTAUTH_SECRET.includes("change-in-production") ||
    process.env.NEXTAUTH_SECRET.length < 32)
) {
  throw new Error(
    "NEXTAUTH_SECRET is not configured for production. " +
    "Generate one with: openssl rand -base64 32"
  );
}
```

- [ ] **Step 2: Verify the app still starts in development**

Run: `cd "G:/Vibe Projects/techwear-store" && npx next build 2>&1 | head -20`
Expected: Build succeeds (NODE_ENV is not "production" during local build by default, but `next build` sets it to production — ensure NEXTAUTH_SECRET is set in `.env`)

- [ ] **Step 3: Commit**

```bash
git add src/lib/auth.ts
git commit -m "fix(security): validate NEXTAUTH_SECRET strength at startup"
```

---

### Task 2: Add max password length to registration endpoint

**Files:**
- Modify: `src/app/api/auth/register/route.ts:22-24`

- [ ] **Step 1: Add max length check after min length check**

Replace line 22-24 of `src/app/api/auth/register/route.ts`:

```typescript
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }
```

With:

```typescript
    if (password.length < 8 || password.length > 128) {
      return NextResponse.json(
        { error: "Password must be between 8 and 128 characters" },
        { status: 400 }
      );
    }
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/auth/register/route.ts
git commit -m "fix(security): enforce max password length on registration to prevent bcrypt DoS"
```

---

### Task 3: Harden debug seed endpoint

**Files:**
- Modify: `src/app/api/debug/seed/route.ts:240-256,297`

- [ ] **Step 1: Add requireAdmin import and in-handler gate**

Add import at top of `src/app/api/debug/seed/route.ts`:

```typescript
import { requireAdmin } from "@/lib/admin-actions/helpers";
```

Replace lines 240-256:

```typescript
export async function GET(request: Request) {
  // Block in production entirely (also blocked by middleware)
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Protect seed endpoint with a secret key
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  const secret = process.env.SEED_SECRET;

  if (!secret || key !== secret) {
    return NextResponse.json(
      { error: "Unauthorized. Verify SEED_SECRET in env." },
      { status: 403 }
    );
  }
```

With:

```typescript
export async function GET(request: Request) {
  // Block in production — defense in depth (middleware also blocks)
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Require authenticated admin — prevents unauthenticated access on staging/preview
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin authentication required" }, { status: 403 });
  }

  // Protect seed endpoint with a secret key
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  const secret = process.env.SEED_SECRET;

  if (!secret || key !== secret) {
    return NextResponse.json(
      { error: "Unauthorized. Verify SEED_SECRET in env." },
      { status: 403 }
    );
  }
```

- [ ] **Step 2: Remove demo password fallback**

Replace line 297:

```typescript
    const demoPass = process.env.SEED_ADMIN_PASSWORD || "password123";
```

With:

```typescript
    const demoPass = process.env.SEED_ADMIN_PASSWORD;
    if (!demoPass) {
      throw new Error("SEED_ADMIN_PASSWORD is not set in environment.");
    }
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/debug/seed/route.ts
git commit -m "fix(security): add requireAdmin gate to seed endpoint, remove demo password fallback"
```

---

### Task 4: Add in-memory rate limiter fallback and fix IP source

**Files:**
- Modify: `src/middleware.ts:1-49`

- [ ] **Step 1: Add in-memory rate limiter and fix IP resolution**

Replace lines 1-49 of `src/middleware.ts`:

```typescript
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Setup rate limiter (only if environment variables are present)
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

  // Rate limiting (Global protection)
  if (ratelimit) {
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
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
  }
```

With:

```typescript
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// --- Rate Limiting ---

// Upstash-backed rate limiter (production)
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
    })
  : null;

const globalRateLimit = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(40, "10 s"), analytics: true })
  : null;

// Stricter limit for auth endpoints
const authRateLimit = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "10 s"), analytics: true })
  : null;

// In-memory fallback when Redis is unavailable
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

// Resolve client IP — prefer x-real-ip (Vercel-controlled), fallback to x-forwarded-for
function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "127.0.0.1"
  );
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

  // Stricter rate limiting on auth endpoints
  const isAuthRoute = pathname.startsWith("/api/auth/register") || pathname.startsWith("/api/auth/verify");

  if (isAuthRoute) {
    const allowed = authRateLimit
      ? (await authRateLimit.limit(`auth_${ip}`)).success
      : memoryRateLimit(`auth_${ip}`, 5, 10_000);
    if (!allowed) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }
  }

  // Global rate limiting
  const globalAllowed = globalRateLimit
    ? (await globalRateLimit.limit(`mw_${ip}`)).success
    : memoryRateLimit(`mw_${ip}`, 40, 10_000);
  if (!globalAllowed) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }
```

- [ ] **Step 2: Commit**

```bash
git add src/middleware.ts
git commit -m "fix(security): add in-memory rate limiter fallback, stricter auth limits, fix IP resolution"
```

---

### Task 5: Block BANNED users and deduplicate getToken

**Files:**
- Modify: `src/middleware.ts:58-95` (the route protection section)

- [ ] **Step 1: Refactor token fetch and add BANNED check**

Replace the route protection section (from the `response` variable through the end of the function) with:

```typescript
  const response = NextResponse.next();

  // Apply security headers to all responses
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }

  // Block access to debug endpoints in production
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
```

- [ ] **Step 2: Commit**

```bash
git add src/middleware.ts
git commit -m "fix(security): block BANNED users in middleware, deduplicate getToken calls"
```

---

### Task 6: Add auth to validateCoupon and exclude password from admin users query

**Files:**
- Modify: `src/lib/admin-actions/orders.ts:104-106`
- Modify: `src/app/admin/users/page.tsx:8-13`

- [ ] **Step 1: Add session check to validateCoupon**

Replace lines 104-106 of `src/lib/admin-actions/orders.ts`:

```typescript
export async function validateCoupon(code: string, cartTotal: number) {
  return internalValidateCoupon(code, cartTotal, prisma);
}
```

With:

```typescript
export async function validateCoupon(code: string, cartTotal: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { valid: false, error: "Authentication required" };
  }
  return internalValidateCoupon(code, cartTotal, prisma);
}
```

Add the missing imports at top of the file (after line 6):

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
```

- [ ] **Step 2: Exclude password hash from admin users query**

Replace lines 8-13 of `src/app/admin/users/page.tsx`:

```typescript
  const users = await prisma.user.findMany({
    orderBy: { email: "asc" },
    include: {
      _count: { select: { orders: true } },
    },
  });
```

With:

```typescript
  const users = await prisma.user.findMany({
    orderBy: { email: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      voltPoints: true,
      clearanceLevel: true,
      isBanned: true,
      _count: { select: { orders: true } },
    },
  });
```

Update the type annotation on line 40 to match:

```typescript
{users.map((user) => (
```

Remove the `import type { User } from "@prisma/client";` on line 3 (no longer needed).

- [ ] **Step 3: Commit**

```bash
git add src/lib/admin-actions/orders.ts src/app/admin/users/page.tsx
git commit -m "fix(security): add auth to validateCoupon, exclude password hash from admin users query"
```

---

### Task 7: Fix verification race condition with transaction

**Files:**
- Modify: `src/app/api/auth/verify/route.ts:4-46`

- [ ] **Step 1: Replace the handler with transaction-based verification**

Replace the entire handler body (lines 4-46) of `src/app/api/auth/verify/route.ts`:

```typescript
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      return new NextResponse("Invalid verification link", { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      // Delete-first pattern: atomic — if two requests race, only one delete succeeds
      const deleted = await tx.verificationToken.deleteMany({
        where: {
          identifier: email,
          token,
          expires: { gt: new Date() },
        },
      });

      if (deleted.count === 0) {
        throw new Error("INVALID_OR_EXPIRED");
      }

      await tx.user.update({
        where: { email },
        data: { emailVerified: new Date() },
      });
    });

    return NextResponse.redirect(new URL("/membership?verified=1", req.url));
  } catch (err) {
    if (err instanceof Error && err.message === "INVALID_OR_EXPIRED") {
      return new NextResponse(
        "Verification link is invalid, expired, or has already been used.",
        { status: 400 }
      );
    }
    console.error("Verification error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/auth/verify/route.ts
git commit -m "fix(security): wrap email verification in transaction to prevent race condition"
```

---

### Task 8: Fix last-admin race condition with atomic transaction

**Files:**
- Modify: `src/lib/admin-actions/users.ts:7-27,53-75`

- [ ] **Step 1: Replace updateUserRole with atomic transaction**

Replace the `updateUserRole` function (lines 7-27):

```typescript
export async function updateUserRole(userId: string, role: string) {
  const admin = await requireAdmin();

  if (!["USER", "ADMIN"].includes(role)) throw new Error("Invalid role");

  // Prevent demoting the last admin — atomic check inside transaction
  await prisma.$transaction(async (tx) => {
    if (role === "USER") {
      const targetUser = await tx.user.findUnique({ where: { id: userId } });
      if (targetUser?.role === "ADMIN") {
        const adminCount = await tx.user.count({ where: { role: "ADMIN", isBanned: false } });
        if (adminCount <= 1) {
          throw new Error("Cannot demote the last admin. Promote another user first.");
        }
      }
    }
    await tx.user.update({ where: { id: userId }, data: { role } });
  });

  await logActivity(admin.id, "USER_ROLE_CHANGED", userId, `Role set to ${role}`);
  revalidatePath("/admin/users");
  return { success: true };
}
```

- [ ] **Step 2: Replace toggleUserBan with atomic transaction**

Replace the `toggleUserBan` function (lines 53-75):

```typescript
export async function toggleUserBan(userId: string) {
  const admin = await requireAdmin();

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    // Prevent banning the last active admin — re-count inside transaction
    if (!user.isBanned && user.role === "ADMIN") {
      const activeAdminCount = await tx.user.count({ where: { role: "ADMIN", isBanned: false } });
      if (activeAdminCount <= 1) {
        throw new Error("Cannot ban the last active admin.");
      }
    }

    await tx.user.update({
      where: { id: userId },
      data: { isBanned: !user.isBanned },
    });

    return { wasBanned: user.isBanned, email: user.email };
  });

  await logActivity(admin.id, result.wasBanned ? "USER_UNBANNED" : "USER_BANNED", userId, result.email || "");
  revalidatePath("/admin/users");
  return { success: true };
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/admin-actions/users.ts
git commit -m "fix(security): wrap admin-guard checks in transactions to prevent race conditions"
```

---

## Phase 2: Data Integrity Bugs

### Task 9: Fix validatePrice double-multiplication

**Files:**
- Modify: `src/lib/admin-actions/validation.ts:13-19`

- [ ] **Step 1: Fix the function**

Replace lines 13-19:

```typescript
export function validatePrice(value: string | null): number {
  const price = Math.round(parseFloat(value || "0") * 100);
  if (isNaN(price) || price < 0 || price > 99999900) {
    throw new Error("Invalid price. Must be between 0 and 999,999.");
  }
  return Math.round(price * 100) / 100;
}
```

With:

```typescript
/** Converts a dollar string (e.g. "345.00") to cents integer (34500). DB stores cents. */
export function validatePrice(value: string | null): number {
  const dollars = parseFloat(value || "0");
  if (isNaN(dollars) || dollars < 0 || dollars > 999999) {
    throw new Error("Invalid price. Must be between $0 and $999,999.");
  }
  return Math.round(dollars * 100);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/admin-actions/validation.ts
git commit -m "fix(data): fix validatePrice double-multiplication — return cents directly"
```

---

### Task 10: Fix seed.mjs prices and JSON-LD structured data

**Files:**
- Modify: `prisma/seed.mjs` (price values)
- Modify: `src/app/shop/[id]/page.tsx` (JSON-LD price field)

- [ ] **Step 1: Fix seed.mjs prices to use cent integers**

In `prisma/seed.mjs`, update all price values to cents. For example, if prices are listed as `345.0`, change to `34500`. Match the format already used in `src/app/api/debug/seed/route.ts`.

Scan the file for all `price:` fields and multiply each by 100. E.g.:
- `345.0` -> `34500`
- `185.0` -> `18500`
- `120.0` -> `12000`

- [ ] **Step 2: Fix JSON-LD price in product page**

In `src/app/shop/[id]/page.tsx`, find the JSON-LD structured data section where `price: product.price` is used. Replace:

```typescript
price: product.price,
```

With:

```typescript
price: (product.price / 100).toFixed(2),
```

- [ ] **Step 3: Commit**

```bash
git add prisma/seed.mjs src/app/shop/\[id\]/page.tsx
git commit -m "fix(data): fix seed.mjs to use cent integers, fix JSON-LD price display"
```

---

### Task 11: Fix Volt Points display and formulas

**Files:**
- Modify: `src/app/shop/[id]/components/ProductInfo.tsx:45,190`
- Modify: `src/app/profile/ProfileClient.tsx:52`

- [ ] **Step 1: Fix ProductInfo points calculations**

At the top of `src/app/shop/[id]/components/ProductInfo.tsx`, add:

```typescript
import { VOLT_POINTS_RATE } from "@/lib/actions/constants";
```

Find line ~45 where `estimatedPoints` is calculated and replace with:

```typescript
const estimatedPoints = Math.floor(product.price * VOLT_POINTS_RATE);
```

Find line ~190 where points are displayed and replace:

```typescript
+ {Math.floor(product.price)} VOLT POINTS UPON ACQUISITION
```

With:

```typescript
+ {Math.floor(product.price * VOLT_POINTS_RATE).toLocaleString()} VOLT POINTS UPON ACQUISITION
```

- [ ] **Step 2: Fix ProfileClient tier point thresholds**

In `src/app/profile/ProfileClient.tsx`, add import:

```typescript
import { CLEARANCE_TIERS, CLEARANCE_THRESHOLDS } from "@/lib/actions/constants";
```

Find line ~52 and replace:

```typescript
const nextTierPoints = clearanceLevel === 1 ? 500 : clearanceLevel === 2 ? 2000 : 5000;
```

With:

```typescript
const nextTier = CLEARANCE_TIERS.find((t) => t.level === clearanceLevel + 1);
const nextTierPoints = nextTier?.cost ?? 0;
```

- [ ] **Step 3: Commit**

```bash
git add src/app/shop/\[id\]/components/ProductInfo.tsx src/app/profile/ProfileClient.tsx
git commit -m "fix(data): fix Volt Points display (was 10x inflated), use constants for tier thresholds"
```

---

### Task 12: Fix auto-promotion to deduct points like manual upgrade

**Files:**
- Modify: `src/lib/actions/orders.ts:103-122`

- [ ] **Step 1: Update auto-promotion to deduct tier cost**

Replace lines 103-122:

```typescript
      // Award Volt Points
      const pointsEarned = Math.floor(finalTotal * VOLT_POINTS_RATE);
      if (pointsEarned > 0) {
        const updatedUser = await tx.user.update({
          where: { id: session.user.id },
          data: { voltPoints: { increment: pointsEarned } },
        });

        // Auto-promote clearance
        let newLevel = updatedUser.clearanceLevel;
        if (updatedUser.voltPoints >= CLEARANCE_THRESHOLDS.tier3) newLevel = 3;
        else if (updatedUser.voltPoints >= CLEARANCE_THRESHOLDS.tier2) newLevel = 2;

        if (newLevel !== updatedUser.clearanceLevel) {
          await tx.user.update({
            where: { id: session.user.id },
            data: { clearanceLevel: newLevel },
          });
        }
      }
```

With:

```typescript
      // Award Volt Points
      const pointsEarned = Math.floor(finalTotal * VOLT_POINTS_RATE);
      if (pointsEarned > 0) {
        const updatedUser = await tx.user.update({
          where: { id: session.user.id },
          data: { voltPoints: { increment: pointsEarned } },
        });

        // Auto-promote clearance — deduct tier cost (same as manual upgrade)
        const currentLevel = updatedUser.clearanceLevel;
        const nextTier = CLEARANCE_TIERS.find((t) => t.level === currentLevel + 1);

        if (
          nextTier &&
          updatedUser.voltPoints >= CLEARANCE_THRESHOLDS[`tier${nextTier.level}` as keyof typeof CLEARANCE_THRESHOLDS] &&
          updatedUser.voltPoints >= nextTier.cost
        ) {
          await tx.user.update({
            where: { id: session.user.id },
            data: {
              clearanceLevel: nextTier.level,
              voltPoints: { decrement: nextTier.cost },
            },
          });
        }
      }
```

Add `CLEARANCE_TIERS` to the import on line 9:

```typescript
import { VOLT_POINTS_RATE, CLEARANCE_THRESHOLDS, CLEARANCE_TIERS } from "./constants";
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/actions/orders.ts
git commit -m "fix(data): auto-promotion deducts tier cost to match manual upgrade behavior"
```

---

### Task 13: Fix non-null assertions

**Files:**
- Modify: `src/lib/actions/clearance.ts:46-55`
- Modify: `src/lib/actions/orders.ts:81-83`

- [ ] **Step 1: Guard clearance.ts findUnique result**

Replace lines 46-55 of `src/lib/actions/clearance.ts`:

```typescript
  const updated = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { clearanceLevel: true, voltPoints: true },
  });

  return {
    success: true,
    newClearanceLevel: updated!.clearanceLevel,
    remainingPoints: updated!.voltPoints,
  };
```

With:

```typescript
  const updated = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { clearanceLevel: true, voltPoints: true },
  });

  if (!updated) {
    throw new Error("User not found after clearance upgrade.");
  }

  return {
    success: true,
    newClearanceLevel: updated.clearanceLevel,
    remainingPoints: updated.voltPoints,
  };
```

- [ ] **Step 2: Guard orders.ts productMap access**

In `src/lib/actions/orders.ts`, find line ~82 inside the `items.create` map callback:

```typescript
              const dbProduct = productMap.get(item.id)!;
```

Replace with:

```typescript
              const dbProduct = productMap.get(item.id);
              if (!dbProduct) {
                throw new Error(`Product "${item.name}" disappeared during order creation.`);
              }
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/actions/clearance.ts src/lib/actions/orders.ts
git commit -m "fix(data): replace non-null assertions with explicit null guards"
```

---

### Task 14: Fix TOCTOU toggles with atomic updates

**Files:**
- Modify: `src/lib/admin-actions/products.ts:89-104`
- Modify: `src/lib/admin-actions/orders.ts:60-74`

- [ ] **Step 1: Fix toggleProductActive**

Replace `toggleProductActive` in `src/lib/admin-actions/products.ts`:

```typescript
export async function toggleProductActive(id: string) {
  const admin = await requireAdmin();

  const product = await prisma.$queryRaw<Array<{ isActive: boolean; name: string }>>`
    UPDATE "Product" SET "isActive" = NOT "isActive" WHERE id = ${id}
    RETURNING "isActive", name
  `;

  if (!product.length) throw new Error("Product not found");

  const { isActive, name } = product[0];
  await logActivity(admin.id, isActive ? "PRODUCT_ACTIVATED" : "PRODUCT_DEACTIVATED", id, name);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true, isActive };
}
```

Note: If SQLite doesn't support `RETURNING`, use a transaction instead:

```typescript
export async function toggleProductActive(id: string) {
  const admin = await requireAdmin();

  const result = await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id } });
    if (!product) throw new Error("Product not found");
    const updated = await tx.product.update({
      where: { id },
      data: { isActive: !product.isActive },
    });
    return updated;
  });

  await logActivity(admin.id, result.isActive ? "PRODUCT_ACTIVATED" : "PRODUCT_DEACTIVATED", id, result.name);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true, isActive: result.isActive };
}
```

- [ ] **Step 2: Fix toggleCouponActive the same way**

Replace `toggleCouponActive` in `src/lib/admin-actions/orders.ts`:

```typescript
export async function toggleCouponActive(id: string) {
  const admin = await requireAdmin();

  const result = await prisma.$transaction(async (tx) => {
    const coupon = await tx.coupon.findUnique({ where: { id } });
    if (!coupon) throw new Error("Coupon not found");
    const updated = await tx.coupon.update({
      where: { id },
      data: { isActive: !coupon.isActive },
    });
    return updated;
  });

  await logActivity(admin.id, result.isActive ? "COUPON_ACTIVATED" : "COUPON_DEACTIVATED", id, result.code);
  revalidatePath("/admin/coupons");
  return { success: true };
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/admin-actions/products.ts src/lib/admin-actions/orders.ts
git commit -m "fix(data): make toggleActive operations atomic with transactions"
```

---

### Task 15: Fix config/form mismatches and coupon scope

**Files:**
- Modify: `src/app/admin/config/ConfigEditor.tsx:14-20`
- Modify: `src/lib/admin-actions/orders.ts:108-111`
- Modify: `src/app/admin/coupons/CouponForm.tsx` (remove PRODUCT option)

- [ ] **Step 1: Remove dead presets from ConfigEditor**

Replace lines 14-20 of `src/app/admin/config/ConfigEditor.tsx`:

```typescript
const PRESET_KEYS = [
  { key: "feature.blacksite", description: "Enable Black Site vault", defaultValue: "true" },
  { key: "feature.banner.active", description: "Show promotional banner", defaultValue: "false" },
  { key: "feature.banner.text", description: "Banner message text", defaultValue: "" },
  { key: "feature.banner.color", description: "Banner background color", defaultValue: "#d4ff33" },
  { key: "store.pricing.multiplier", description: "Global price multiplier", defaultValue: "1.0" },
];
```

With:

```typescript
const PRESET_KEYS = [
  { key: "feature.blacksite", description: "Enable Black Site vault", defaultValue: "true" },
  { key: "feature.banner.active", description: "Show promotional banner", defaultValue: "false" },
  { key: "feature.banner.text", description: "Banner message text", defaultValue: "" },
];
```

- [ ] **Step 2: Remove PRODUCT scope from CouponForm**

In `src/app/admin/coupons/CouponForm.tsx`, find the `<select>` for scope and remove:

```html
<option value="PRODUCT">Product</option>
```

- [ ] **Step 3: Fix isActive default asymmetry in products.ts**

In `src/lib/admin-actions/products.ts`, find `createProduct` line 29:

```typescript
      isActive: formData.get("isActive") !== "false",
```

Replace with:

```typescript
      // Default: new products are active unless explicitly set to "false"
      isActive: formData.get("isActive") !== "false",
```

Find `updateProduct` line 66:

```typescript
      isActive: formData.get("isActive") === "true",
```

Replace with:

```typescript
      // Explicit opt-in: checkbox sends "true" when checked, absent when unchecked
      isActive: formData.get("isActive") === "true",
```

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/config/ConfigEditor.tsx src/app/admin/coupons/CouponForm.tsx src/lib/admin-actions/products.ts
git commit -m "fix(data): sync config presets with server allowlist, remove invalid coupon scope"
```

---

### Task 16: Fix category-scoped coupon and related products filter

**Files:**
- Modify: `src/lib/admin-actions/orders.ts:76-101` (coupon logic)
- Modify: `src/app/shop/[id]/page.tsx` (related products where clause)

- [ ] **Step 1: Fix category-scoped coupon to filter by matching category**

Replace the `internalValidateCoupon` function in `src/lib/admin-actions/orders.ts`:

```typescript
export async function internalValidateCoupon(
  code: string,
  cartTotal: number,
  tx: Prisma.TransactionClient | typeof prisma,
  cartItems?: Array<{ category: string; price: number; quantity: number }>
) {
  const coupon = await tx.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!coupon) return { valid: false, error: "Coupon not found" };
  if (!coupon.isActive) return { valid: false, error: "Coupon is inactive" };
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return { valid: false, error: "Coupon expired" };
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) return { valid: false, error: "Coupon usage limit reached" };

  let applicableTotal = cartTotal;

  // For CATEGORY-scoped coupons, only apply to matching items
  if (coupon.scope === "CATEGORY" && coupon.category && cartItems) {
    applicableTotal = cartItems
      .filter((item) => item.category === coupon.category)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  let discount = 0;
  if (coupon.discountType === "PERCENT") {
    discount = Math.floor((applicableTotal * coupon.value) / 100);
  } else {
    discount = Math.min(coupon.value, applicableTotal);
  }

  return {
    valid: true,
    discount,
    couponId: coupon.id,
    code: coupon.code,
    description: coupon.description,
  };
}
```

Update the call in `src/lib/actions/orders.ts` to pass cart items with categories:

```typescript
        const couponResult = await internalValidateCoupon(
          sanitizedCoupon,
          serverTotal,
          tx,
          cartItems.map((item) => {
            const dbProduct = productMap.get(item.id);
            return {
              category: dbProduct?.category ?? "",
              price: dbProduct?.price ?? 0,
              quantity: item.quantity,
            };
          })
        );
```

- [ ] **Step 2: Fix related products filter**

In `src/app/shop/[id]/page.tsx`, find the related products query and add filters:

```typescript
  const relatedProducts = await prisma.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id },
      isActive: true,
      isClassified: false,
    },
    take: 4,
  });
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/admin-actions/orders.ts src/lib/actions/orders.ts src/app/shop/\[id\]/page.tsx
git commit -m "fix(data): category-scoped coupons apply only to matching items, filter inactive from related products"
```

---

## Phase 3: Performance Foundations

### Task 17: Add database indexes and Prisma query logging

**Files:**
- Modify: `prisma/schema.prisma:72-89`
- Modify: `src/lib/prisma.ts`

- [ ] **Step 1: Add composite index to Product model**

In `prisma/schema.prisma`, add before the closing `}` of the Product model (after line 88):

```prisma
  @@index([isActive, isClassified, category])
  @@index([category])
```

- [ ] **Step 2: Add query logging in development**

Replace `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development"
      ? ["warn", "error"]
      : ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 3: Push schema changes**

Run: `cd "G:/Vibe Projects/techwear-store" && npx prisma db push`

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma src/lib/prisma.ts
git commit -m "perf: add database indexes on Product, add Prisma logging in dev"
```

---

### Task 18: Add select clauses and pagination to queries

**Files:**
- Modify: `src/app/shop/page.tsx` (select clause)
- Modify: `src/app/admin/products/page.tsx` (select + pagination)
- Modify: `src/app/profile/page.tsx` (pagination)
- Modify: `src/app/shop/[id]/page.tsx` (use cached getProduct)

- [ ] **Step 1: Add select to shop page query**

In `src/app/shop/page.tsx`, update the product query to use select:

```typescript
  const products = await prisma.product.findMany({
    where: { isActive: true, isClassified: false, category: { not: "Merch" } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      price: true,
      imageUrl: true,
      category: true,
      isNew: true,
      tags: true,
    },
  });
```

- [ ] **Step 2: Add select to admin products page**

In `src/app/admin/products/page.tsx`, update the query:

```typescript
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      name: true,
      price: true,
      category: true,
      imageUrl: true,
      isActive: true,
      isClassified: true,
      stock: true,
      createdAt: true,
      _count: { select: { orderItems: true } },
    },
  });
```

- [ ] **Step 3: Add pagination to profile orders**

In `src/app/profile/page.tsx`, add `take: 20` to the orders query:

```typescript
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
```

- [ ] **Step 4: Fix duplicate product query**

In `src/app/shop/[id]/page.tsx`, find where the page component calls `prisma.product.findUnique` directly and replace it with `getProduct(id)` (the cached version already defined at the top of the file).

- [ ] **Step 5: Commit**

```bash
git add src/app/shop/page.tsx src/app/admin/products/page.tsx src/app/profile/page.tsx src/app/shop/\[id\]/page.tsx
git commit -m "perf: add select clauses, pagination, and fix duplicate product query"
```

---

### Task 19: Replace force-dynamic with ISR and cache ThemeLoader

**Files:**
- Modify: `src/app/shop/page.tsx`
- Modify: `src/app/shop/[id]/page.tsx`
- Modify: `src/app/merch/page.tsx`
- Modify: `src/app/black-site/page.tsx`
- Modify: `src/components/ThemeLoader.tsx`

- [ ] **Step 1: Replace force-dynamic with revalidate on all product pages**

In each of these files, replace:

```typescript
export const dynamic = "force-dynamic";
```

With:

```typescript
export const revalidate = 60; // ISR: revalidate every 60 seconds
```

Files: `src/app/shop/page.tsx`, `src/app/shop/[id]/page.tsx`, `src/app/merch/page.tsx`, `src/app/black-site/page.tsx`

- [ ] **Step 2: Cache ThemeLoader query**

In `src/components/ThemeLoader.tsx`, wrap the DB query with `unstable_cache`:

```typescript
import { unstable_cache } from "next/cache";

const getCachedTheme = unstable_cache(
  async () => {
    const configs = await prisma.siteConfig.findMany({
      where: { key: { startsWith: "theme." } },
    });
    return configs;
  },
  ["theme-config"],
  { revalidate: 300 } // 5 minutes
);
```

Then use `getCachedTheme()` instead of the direct query.

- [ ] **Step 3: Commit**

```bash
git add src/app/shop/page.tsx src/app/shop/\[id\]/page.tsx src/app/merch/page.tsx src/app/black-site/page.tsx src/components/ThemeLoader.tsx
git commit -m "perf: replace force-dynamic with ISR (60s), cache ThemeLoader query (5min)"
```

---

### Task 20: Code splitting and bundle optimization

**Files:**
- Modify: `src/components/ProductCard.tsx` (remove framer-motion)
- Modify: `src/components/Navbar.tsx` (lazy-load CartDrawer, MobileMenu)
- Modify: `src/app/layout.tsx` (lazy-load CyberBackground)

- [ ] **Step 1: Replace framer-motion with CSS in ProductCard**

In `src/components/ProductCard.tsx`, remove the `framer-motion` import and `motion.div` wrapper. Replace with a plain `div` using CSS transition classes:

```typescript
// Remove: import { motion } from "framer-motion";

// Replace motion.div wrapper with:
<div className="group transition-transform duration-200 hover:-translate-y-1">
```

- [ ] **Step 2: Lazy-load CartDrawer and MobileMenu**

At the top of `src/components/Navbar.tsx`, add:

```typescript
import dynamic from "next/dynamic";

const CartDrawer = dynamic(() => import("./cart/CartDrawer"), { ssr: false });
const MobileMenu = dynamic(() => import("./navbar/MobileMenu"), { ssr: false });
```

Remove the direct imports of CartDrawer and MobileMenu.

- [ ] **Step 3: Lazy-load CyberBackground**

In `src/app/layout.tsx`, replace:

```typescript
import CyberBackground from "@/components/CyberBackground";
```

With:

```typescript
import dynamic from "next/dynamic";
const CyberBackground = dynamic(() => import("@/components/CyberBackground"), { ssr: false });
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ProductCard.tsx src/components/Navbar.tsx src/app/layout.tsx
git commit -m "perf: replace framer-motion with CSS in ProductCard, lazy-load CartDrawer/MobileMenu/CyberBackground"
```

---

### Task 21: Rendering and animation optimizations

**Files:**
- Modify: `src/lib/store.ts` (split into slices)
- Modify: `src/components/CrosshairCursor.tsx` (rAF throttle, remove getComputedStyle)
- Modify: `src/components/CyberBackground.tsx` (debounce resize)
- Modify: `src/app/profile/ProfileClient.tsx` (remove mounted guard)
- Modify: `src/app/layout.tsx` (remove maximumScale)

- [ ] **Step 1: Split Zustand store into separate hooks with selectors**

In `src/lib/store.ts`, keep the single store but add selector hooks at the bottom:

```typescript
// Selector hooks — prevent unnecessary re-renders
export const useCartStore = () => useStore((state) => ({
  cart: state.cart,
  isCartOpen: state.isCartOpen,
  addToCart: state.addToCart,
  removeFromCart: state.removeFromCart,
  updateQuantity: state.updateQuantity,
  toggleCart: state.toggleCart,
  clearCart: state.clearCart,
  getCartTotal: state.getCartTotal,
  getCartCount: state.getCartCount,
}));

export const useThemeStore = () => useStore((state) => ({
  theme: state.theme,
  toggleTheme: state.toggleTheme,
}));
```

- [ ] **Step 2: Throttle CrosshairCursor with rAF and remove getComputedStyle**

Replace the mousemove handler in `src/components/CrosshairCursor.tsx` to use `requestAnimationFrame` and a `data-cursor` attribute check instead of `getComputedStyle`:

```typescript
useEffect(() => {
  let rafId: number;
  const handleMouseMove = (e: MouseEvent) => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      posRef.current = { x: e.clientX, y: e.clientY };
      const target = e.target as HTMLElement;
      setIsHovering(target.closest("[data-cursor='pointer']") !== null || target.tagName === "A" || target.tagName === "BUTTON");
      // Update DOM directly via ref instead of setState for position
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    });
  };

  window.addEventListener("mousemove", handleMouseMove);
  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
    cancelAnimationFrame(rafId);
  };
}, []);
```

- [ ] **Step 3: Debounce CyberBackground resize**

In `src/components/CyberBackground.tsx`, wrap the resize handler:

```typescript
let resizeTimeout: ReturnType<typeof setTimeout>;
const handleResize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(resizeCanvas, 200);
};
window.addEventListener("resize", handleResize);
// In cleanup:
return () => {
  window.removeEventListener("resize", handleResize);
  clearTimeout(resizeTimeout);
  cancelAnimationFrame(animationRef.current);
};
```

- [ ] **Step 4: Remove mounted guard from ProfileClient**

In `src/app/profile/ProfileClient.tsx`, remove:

```typescript
const [mounted, setMounted] = useState(false);
useEffect(() => { setMounted(true); }, []);
if (!mounted) return null;
```

- [ ] **Step 5: Remove maximumScale: 1 from viewport**

In `src/app/layout.tsx`, remove `maximumScale: 1` from the viewport export:

```typescript
export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/store.ts src/components/CrosshairCursor.tsx src/components/CyberBackground.tsx src/app/profile/ProfileClient.tsx src/app/layout.tsx
git commit -m "perf: split store selectors, throttle cursor/resize, remove mounted guard, allow pinch-zoom"
```

---

## Phase 4: Architecture Cleanup

### Task 22: Create shared Product types and fix type augmentation

**Files:**
- Create: `src/types/product.ts`
- Modify: `src/types/next-auth.d.ts`
- Modify: `tsconfig.json`

- [ ] **Step 1: Create shared Product types**

```typescript
// src/types/product.ts

/** Full product — matches Prisma Product model */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // cents
  category: string;
  imageUrl: string;
  isNew: boolean;
  stock: number;
  isActive: boolean;
  isClassified: boolean;
  tags: string; // comma-separated
  createdAt: string;
  updatedAt: string;
}

/** Subset for product listing grids — only fields rendered in cards */
export interface ProductListItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  isNew: boolean;
  tags: string;
}

/** Parse comma-separated tags string into array */
export function parseTags(tags: string): string[] {
  if (!tags) return [];
  return tags.split(",").map((t) => t.trim()).filter(Boolean);
}

/** Format cents to dollar display string */
export function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2);
}
```

- [ ] **Step 2: Extend JWT type in next-auth.d.ts**

Replace `src/types/next-auth.d.ts`:

```typescript
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    role: string;
    voltPoints: number;
    clearanceLevel: number;
  }
  interface Session {
    user: User & {
      id: string;
      role: string;
      voltPoints: number;
      clearanceLevel: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    voltPoints: number;
    clearanceLevel: number;
  }
}
```

- [ ] **Step 3: Remove `as` casts from auth.ts**

In `src/lib/auth.ts`, update the session callback (lines 110-115):

```typescript
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.voltPoints = token.voltPoints;
        session.user.clearanceLevel = token.clearanceLevel;
      }
      return session;
    }
```

- [ ] **Step 4: Add noUncheckedIndexedAccess to tsconfig**

In `tsconfig.json`, add to `compilerOptions`:

```json
"noUncheckedIndexedAccess": true
```

- [ ] **Step 5: Commit**

```bash
git add src/types/product.ts src/types/next-auth.d.ts src/lib/auth.ts tsconfig.json
git commit -m "refactor: create shared Product types, extend JWT types, add noUncheckedIndexedAccess"
```

---

### Task 23: Fix error handling across admin forms and server actions

**Files:**
- Modify: `src/app/admin/products/ProductForm.tsx`
- Modify: `src/app/admin/coupons/CouponForm.tsx`
- Modify: `src/app/admin/config/ConfigEditor.tsx:36-37,52-53,66-67`
- Modify: `src/lib/admin-actions/helpers.ts:16-20`
- Modify: `src/components/ThemeLoader.tsx` (error logging)
- Modify: `src/lib/auth.ts:60` (demo error message)

- [ ] **Step 1: Fix ConfigEditor catch blocks**

In `src/app/admin/config/ConfigEditor.tsx`, replace each `catch { alert("Failed to save"); }` with:

```typescript
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save");
    }
```

Apply to all three catch blocks (handleSave, handleAddNew, handlePreset).

- [ ] **Step 2: Fix ProductForm and CouponForm the same way**

In both `ProductForm.tsx` and `CouponForm.tsx`, replace bare `catch { alert("...") }` with:

```typescript
    } catch (err) {
      alert(err instanceof Error ? err.message : "Operation failed");
    }
```

- [ ] **Step 3: Make logActivity fire-and-forget**

Replace `src/lib/admin-actions/helpers.ts` `logActivity`:

```typescript
export async function logActivity(userId: string, action: string, target: string = "", details: string = "") {
  try {
    await prisma.activityLog.create({
      data: { userId, action, target, details },
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}
```

- [ ] **Step 4: Add error logging to ThemeLoader**

In `src/components/ThemeLoader.tsx`, update the catch block:

```typescript
  } catch (err) {
    console.error("ThemeLoader: DB unavailable, using defaults", err);
  }
```

- [ ] **Step 5: Fix demo error message in auth.ts**

Replace line 60 of `src/lib/auth.ts`:

```typescript
          throw new Error("Email not verified. Check server console for verification link.");
```

With:

```typescript
          throw new Error("Email not verified. Please check your email for a verification link.");
```

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/config/ConfigEditor.tsx src/app/admin/products/ProductForm.tsx src/app/admin/coupons/CouponForm.tsx src/lib/admin-actions/helpers.ts src/components/ThemeLoader.tsx src/lib/auth.ts
git commit -m "fix: show actual error messages in admin forms, make logActivity fire-and-forget"
```

---

### Task 24: Fix homepage, merch page, and misc cleanup

**Files:**
- Modify: `src/app/page.tsx` (fetch from DB)
- Modify: `src/app/merch/page.tsx` (add isActive filter)
- Modify: `src/lib/admin-actions/products.ts` (bulkUpdate guard)
- Modify: `eslint.config.mjs` (strict any)

- [ ] **Step 1: Fetch New Arrivals from database**

In `src/app/page.tsx`, replace the hardcoded product array with a DB query. Add at top:

```typescript
import { prisma } from "@/lib/prisma";
```

Replace the hardcoded products section with:

```typescript
const newArrivals = await prisma.product.findMany({
  where: { isNew: true, isActive: true, isClassified: false },
  take: 3,
  orderBy: { createdAt: "desc" },
  select: {
    id: true,
    name: true,
    price: true,
    imageUrl: true,
    category: true,
    isNew: true,
    tags: true,
  },
});
```

Then map over `newArrivals` instead of hardcoded data in the JSX.

- [ ] **Step 2: Add isActive filter to merch page**

In `src/app/merch/page.tsx`, add `isActive: true` to the where clause:

```typescript
  where: { category: "Merch", isActive: true },
```

- [ ] **Step 3: Add bulkUpdateProducts max-IDs guard**

In `src/lib/admin-actions/products.ts`, at the top of `bulkUpdateProducts`:

```typescript
  if (ids.length === 0) throw new Error("No products selected.");
  if (ids.length > 500) throw new Error("Cannot update more than 500 products at once.");
```

- [ ] **Step 4: Upgrade ESLint no-explicit-any to error**

In `eslint.config.mjs`, change:

```javascript
"@typescript-eslint/no-explicit-any": "warn",
```

To:

```javascript
"@typescript-eslint/no-explicit-any": "error",
```

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/app/merch/page.tsx src/lib/admin-actions/products.ts eslint.config.mjs
git commit -m "refactor: fetch homepage products from DB, add isActive filter to merch, strict ESLint"
```

---

## Phase 5: UX & Accessibility

### Task 25: Fix accessibility issues

**Files:**
- Modify: `src/components/ProductCard.tsx` (aria-label, button outside Link)
- Modify: `src/app/black-site/components/BlackSiteProducts.tsx` (aria-label)
- Modify: `src/components/footer/FooterLinks.tsx` (role="list")
- Modify: `src/components/Navbar.tsx` (aria-expanded)
- Modify: `src/app/globals.css` (remove global cursor:none)

- [ ] **Step 1: Fix ProductCard — move button outside Link, add aria-label**

Restructure `ProductCard.tsx` so the quick-add button is a sibling of the Link, not a child. Use `relative` positioning on the wrapper and `absolute` on the button:

```tsx
<div className="relative group">
  <Link href={`/shop/${product.id}`} className="block">
    {/* Card content */}
  </Link>
  <button
    onClick={handleQuickAdd}
    aria-label={`Add ${product.name} to cart`}
    className="absolute bottom-4 right-4 ..."
  >
    Quick Add
  </button>
</div>
```

- [ ] **Step 2: Add aria-label to BlackSiteProducts buttons**

In `src/app/black-site/components/BlackSiteProducts.tsx`:

```tsx
<button
  onClick={() => addToCart({...})}
  aria-label={`Add ${item.name} to cart`}
>
```

- [ ] **Step 3: Add role="list" to FooterLinks**

In `src/components/footer/FooterLinks.tsx`, add `role="list"` to `<ul>` elements.

- [ ] **Step 4: Add aria-expanded to Navbar toggles**

In `src/components/Navbar.tsx`, add to cart toggle button:

```tsx
<button aria-expanded={isCartOpen} aria-label="Shopping cart">
```

And to mobile menu toggle:

```tsx
<button aria-expanded={isMobileOpen} aria-label="Navigation menu">
```

- [ ] **Step 5: Fix global cursor:none**

In `src/app/globals.css`, remove or scope `* { cursor: none !important; }` to only the CrosshairCursor-managed area or specific selectors.

- [ ] **Step 6: Commit**

```bash
git add src/components/ProductCard.tsx src/app/black-site/components/BlackSiteProducts.tsx src/components/footer/FooterLinks.tsx src/components/Navbar.tsx src/app/globals.css
git commit -m "fix(a11y): fix button-in-link, add aria labels, restore cursor, add role=list"
```

---

### Task 26: Add loading states

**Files:**
- Create: `src/app/merch/loading.tsx`
- Create: `src/app/black-site/loading.tsx`
- Create: `src/app/profile/loading.tsx`
- Create: `src/app/admin/products/loading.tsx`
- Create: `src/app/admin/users/loading.tsx`

- [ ] **Step 1: Create a reusable skeleton component pattern**

Each `loading.tsx` follows this pattern:

```tsx
export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-white/10 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 bg-white/5 rounded-xl border border-white/10" />
        ))}
      </div>
    </div>
  );
}
```

Create this file for each route listed above, adjusting the skeleton layout to match each page's structure.

- [ ] **Step 2: Commit**

```bash
git add src/app/merch/loading.tsx src/app/black-site/loading.tsx src/app/profile/loading.tsx src/app/admin/products/loading.tsx src/app/admin/users/loading.tsx
git commit -m "feat(ux): add loading.tsx skeleton states for merch, black-site, profile, admin routes"
```

---

### Task 27: Fix UI bugs

**Files:**
- Modify: `src/app/shop/[id]/components/ProductBreadcrumb.tsx` (router.back)
- Modify: `src/components/ProductCard.tsx` (setTimeout cleanup)
- Modify: `src/app/shop/[id]/components/ProductInfo.tsx` (setTimeout cleanup)
- Modify: `src/components/TerminalToast.tsx` (timer cleanup)

- [ ] **Step 1: Fix ProductBreadcrumb — replace router.back() with Link**

In `src/app/shop/[id]/components/ProductBreadcrumb.tsx`, replace `router.back()` button with:

```tsx
import Link from "next/link";

<Link href="/shop" className="...">
  Back to Archive
</Link>
```

Remove the `useRouter` import if no longer needed.

- [ ] **Step 2: Clean up setTimeout in ProductCard and ProductInfo**

In both files, replace the bare `setTimeout`:

```typescript
setTimeout(() => setAdded(false), 2000);
```

With a ref-based cleanup pattern:

```typescript
const timerRef = useRef<ReturnType<typeof setTimeout>>();

// In the handler:
clearTimeout(timerRef.current);
timerRef.current = setTimeout(() => setAdded(false), 2000);

// Add cleanup effect:
useEffect(() => {
  return () => clearTimeout(timerRef.current);
}, []);
```

- [ ] **Step 3: Fix TerminalToast timer — clear on manual dismiss**

In `src/components/TerminalToast.tsx`, store timeout IDs in a Map and clear them when a toast is manually dismissed:

```typescript
const toastTimers = new Map<string, ReturnType<typeof setTimeout>>();

// In addToast:
const timer = setTimeout(() => {
  toastTimers.delete(id);
  set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
}, 4000);
toastTimers.set(id, timer);

// In removeToast:
const timer = toastTimers.get(id);
if (timer) {
  clearTimeout(timer);
  toastTimers.delete(id);
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/shop/\[id\]/components/ProductBreadcrumb.tsx src/components/ProductCard.tsx src/app/shop/\[id\]/components/ProductInfo.tsx src/components/TerminalToast.tsx
git commit -m "fix(ux): fix router.back off-site navigation, clean up setTimeout leaks"
```

---

## Phase 6: Testing & CI Hardening

### Task 28: Write unit tests for critical business logic

**Files:**
- Create: `src/lib/admin-actions/__tests__/validation.test.ts`
- Create: `src/lib/actions/__tests__/cart-validation.test.ts`

- [ ] **Step 1: Write validatePrice tests**

```typescript
// src/lib/admin-actions/__tests__/validation.test.ts
import { describe, it, expect } from "vitest";
import { validatePrice, validateStock, sanitizeString } from "../validation";

describe("validatePrice", () => {
  it("converts dollars to cents", () => {
    expect(validatePrice("10.00")).toBe(1000);
    expect(validatePrice("345.00")).toBe(34500);
    expect(validatePrice("0.01")).toBe(1);
    expect(validatePrice("999999")).toBe(99999900);
  });

  it("rounds half-cent values", () => {
    expect(validatePrice("10.005")).toBe(1001);
    expect(validatePrice("10.004")).toBe(1000);
  });

  it("returns 0 for null/empty", () => {
    expect(validatePrice(null)).toBe(0);
    expect(validatePrice("")).toBe(0);
  });

  it("throws on negative", () => {
    expect(() => validatePrice("-1")).toThrow("Invalid price");
  });

  it("throws on NaN", () => {
    expect(() => validatePrice("abc")).toThrow("Invalid price");
  });

  it("throws on price exceeding max", () => {
    expect(() => validatePrice("1000000")).toThrow("Invalid price");
  });
});

describe("validateStock", () => {
  it("parses valid stock", () => {
    expect(validateStock("100")).toBe(100);
    expect(validateStock("0")).toBe(0);
  });

  it("defaults to 100 for null", () => {
    expect(validateStock(null)).toBe(100);
  });

  it("throws on negative", () => {
    expect(() => validateStock("-1")).toThrow("Invalid stock");
  });
});
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `cd "G:/Vibe Projects/techwear-store" && npx vitest run src/lib/admin-actions/__tests__/validation.test.ts`
Expected: All tests PASS

- [ ] **Step 3: Write validateCartItems tests**

```typescript
// src/lib/actions/__tests__/cart-validation.test.ts
import { describe, it, expect } from "vitest";
import { validateCartItems } from "../cart-validation";

describe("validateCartItems", () => {
  it("passes for valid cart", () => {
    expect(() =>
      validateCartItems([{ id: "1", name: "Test", price: 1000, quantity: 1 }])
    ).not.toThrow();
  });

  it("throws on empty cart", () => {
    expect(() => validateCartItems([])).toThrow("Cart is empty");
  });

  it("throws on too many items", () => {
    const items = Array.from({ length: 51 }, (_, i) => ({
      id: `item-${i}`, name: `Item ${i}`, price: 100, quantity: 1,
    }));
    expect(() => validateCartItems(items)).toThrow("Too many items");
  });

  it("throws on zero quantity", () => {
    expect(() =>
      validateCartItems([{ id: "1", name: "Test", price: 100, quantity: 0 }])
    ).toThrow("Invalid quantity");
  });

  it("throws on quantity over 99", () => {
    expect(() =>
      validateCartItems([{ id: "1", name: "Test", price: 100, quantity: 100 }])
    ).toThrow("Invalid quantity");
  });

  it("throws on negative price", () => {
    expect(() =>
      validateCartItems([{ id: "1", name: "Test", price: -1, quantity: 1 }])
    ).toThrow("Invalid price");
  });

  it("throws on missing id", () => {
    expect(() =>
      validateCartItems([{ id: "", name: "Test", price: 100, quantity: 1 }])
    ).toThrow("Invalid item");
  });
});
```

- [ ] **Step 4: Run tests**

Run: `cd "G:/Vibe Projects/techwear-store" && npx vitest run src/lib/actions/__tests__/cart-validation.test.ts`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/admin-actions/__tests__/validation.test.ts src/lib/actions/__tests__/cart-validation.test.ts
git commit -m "test: add unit tests for validatePrice, validateStock, validateCartItems"
```

---

### Task 29: Add CI scripts and cleanup

**Files:**
- Modify: `package.json` (add typecheck script)
- Modify: `.gitignore` (add dev.db, *.log)
- Modify: `prisma/schema.prisma` (add comments)

- [ ] **Step 1: Add typecheck script to package.json**

Add to `scripts`:

```json
"typecheck": "tsc --noEmit"
```

- [ ] **Step 2: Add dev.db and *.log to .gitignore**

Append to `.gitignore`:

```
prisma/dev.db
prisma/dev.db-journal
*.log
```

- [ ] **Step 3: Add schema documentation comments**

In `prisma/schema.prisma`, add comments:

```prisma
model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  name      String  /// Snapshot at purchase time — not a live reference
  quantity  Int
  price     Int     /// Snapshot at purchase time in cents — not a live reference

  @@index([orderId])
  @@index([productId])
}
```

Add to User model:

```prisma
  role           String    @default("USER")   /// USER | ADMIN — should be Postgres enum on migration
```

Add to Order model:

```prisma
  status       String   @default("PENDING")   /// PENDING | PAID — should be Postgres enum on migration
```

- [ ] **Step 4: Commit**

```bash
git add package.json .gitignore prisma/schema.prisma
git commit -m "chore: add typecheck script, update .gitignore, document schema denormalization"
```

---

## Verification Checklist

After all tasks are complete:

- [ ] Run `npm run typecheck` — 0 errors
- [ ] Run `npm run lint` — 0 errors
- [ ] Run `npm run test` — all tests pass
- [ ] Run `npm run build` — build succeeds
- [ ] Verify admin users page does NOT show password hashes in browser Network tab
- [ ] Verify `/api/debug/seed` returns 403 without admin auth
- [ ] Verify rate limiting works on `/api/auth/register` (5 requests in 10s triggers 429)
- [ ] Verify product prices display correctly (cents -> dollars)
- [ ] Verify Volt Points display matches `VOLT_POINTS_RATE` calculation
