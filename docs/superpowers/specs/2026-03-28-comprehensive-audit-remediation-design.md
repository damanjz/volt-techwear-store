# VOLT Techwear Store - Comprehensive Audit Remediation Design

**Date:** 2026-03-28
**Status:** Approved
**Approach:** Surgical Sprints (6 phases, ordered by blast radius)
**Context:** App is deployed on Vercel and under active development

## Audit Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 10 |
| HIGH | 19 |
| MEDIUM | 21 |
| LOW | 13 |
| INFO | 4 |
| **TOTAL** | **67** |

Findings span 5 dimensions: Security, Performance, Code Quality, TypeScript/Frontend, and Database/API.

---

## Phase 1: Security Hotfixes (CRITICAL - Deploy First)

**Goal:** Eliminate all live vulnerabilities. This phase MUST be deployed before any other work.

### 1.1 - Secret & Auth Hardening

| # | Fix | File | Change |
|---|-----|------|--------|
| 1 | Validate NEXTAUTH_SECRET at startup | `src/lib/auth.ts` | Add guard that throws if secret is missing or contains "change-in-production" |
| 2 | Add max password length to registration | `src/app/api/auth/register/route.ts` | Mirror auth.ts's 128-char max: `if (password.length > 128)` |
| 3 | Remove demo password fallback | `src/app/api/debug/seed/route.ts` | Remove `\|\| "password123"`, require `SEED_ADMIN_PASSWORD` env var or throw |
| 4 | Gate debug seed in-handler | `src/app/api/debug/seed/route.ts` | Add `requireAdmin()` + `NODE_ENV` check inside the handler itself, not just middleware |

### 1.2 - Rate Limiting & IP

| # | Fix | File | Change |
|---|-----|------|--------|
| 5 | Require Redis in production OR add in-memory fallback | `src/middleware.ts` | Add `Map`-based sliding window fallback when Upstash is absent |
| 6 | Fix IP source | `src/middleware.ts` | Use `request.headers.get("x-real-ip")` primary, `x-forwarded-for` fallback |
| 7 | Add stricter per-route rate limits on auth | `src/middleware.ts` | 5 req/10s for `/api/auth/register` and `/api/auth/verify` |

### 1.3 - Authorization Gaps

| # | Fix | File | Change |
|---|-----|------|--------|
| 8 | Block BANNED users in middleware | `src/middleware.ts` | Add `token.role === "BANNED"` redirect for all authenticated routes |
| 9 | Add auth to validateCoupon | `src/lib/admin-actions/orders.ts` | Require session before coupon validation, or rate-limit unauthenticated path |
| 10 | Exclude password hash from admin users query | `src/app/admin/users/page.tsx` | Add explicit `select` that omits `password` |

### 1.4 - Verification Race Condition

| # | Fix | File | Change |
|---|-----|------|--------|
| 11 | Wrap verify in transaction | `src/app/api/auth/verify/route.ts` | Delete-first pattern inside `$transaction`: delete token atomically, then update user |

### 1.5 - Last-Admin Race Condition

| # | Fix | File | Change |
|---|-----|------|--------|
| 12 | Atomic admin count guard | `src/lib/admin-actions/users.ts` | Wrap role change + ban in `$transaction` with re-count inside transaction |

**Deliverable:** 12 fixes. Deploy immediately after verification.

---

## Phase 2: Data Integrity Bugs

**Goal:** Fix all data corruption, logic bugs, and type safety issues.

### 2.1 - Price System

| # | Fix | File | Change |
|---|-----|------|--------|
| 13 | Fix validatePrice double-multiplication | `src/lib/admin-actions/validation.ts` | Return `Math.round(parseFloat(value) * 100)` directly. Document: DB stores cents. |
| 14 | Fix seed.mjs to use cent integers | `prisma/seed.mjs` | Change `345.0` to `34500`, etc. Match debug/seed route format |
| 15 | Fix JSON-LD price in product page | `src/app/shop/[id]/page.tsx` | `price: (product.price / 100).toFixed(2)` in structured data |

### 2.2 - Volt Points

| # | Fix | File | Change |
|---|-----|------|--------|
| 16 | Fix 10x points display | `src/app/shop/[id]/components/ProductInfo.tsx:190` | Import `VOLT_POINTS_RATE`, use `Math.floor(product.price * VOLT_POINTS_RATE)` |
| 17 | Fix inconsistent estimatedPoints formula | `src/app/shop/[id]/components/ProductInfo.tsx:45` | Use same `VOLT_POINTS_RATE` constant |
| 18 | Fix nextTierPoints magic numbers | `src/app/profile/ProfileClient.tsx:52` | Import from `CLEARANCE_TIERS` / `CLEARANCE_THRESHOLDS` |
| 19 | Fix auto-promotion free vs manual paid conflict | `src/lib/actions/orders.ts:106-122` | Auto-promotion should deduct points same as manual upgrade |

### 2.3 - Non-null Assertions

| # | Fix | File | Change |
|---|-----|------|--------|
| 20 | Guard `updated!` after findUnique | `src/lib/actions/clearance.ts:53` | Explicit null check, throw descriptive error |
| 21 | Guard `productMap.get(item.id)!` | `src/lib/actions/orders.ts:83` | Explicit null check with error message |

### 2.4 - TOCTOU Toggles

| # | Fix | File | Change |
|---|-----|------|--------|
| 22 | Atomic toggle for products | `src/lib/admin-actions/products.ts:89-104` | Use raw SQL `SET "isActive" = NOT "isActive"` or wrap in transaction |
| 23 | Atomic toggle for coupons | `src/lib/admin-actions/orders.ts:60-74` | Same atomic pattern |

### 2.5 - Config & Form Mismatches

| # | Fix | File | Change |
|---|-----|------|--------|
| 24 | Sync ALLOWED_CONFIG_KEYS with PRESET_KEYS | `src/lib/admin-actions/orders.ts` + `src/app/admin/config/ConfigEditor.tsx` | Remove dead presets (`store.pricing.multiplier`), add `feature.banner.color` to server allowlist if needed |
| 25 | Remove PRODUCT scope from CouponForm | `src/app/admin/coupons/CouponForm.tsx` | Remove `<option value="PRODUCT">` not in server ALLOWED_SCOPES |
| 26 | Fix isActive default asymmetry | `src/lib/admin-actions/products.ts` | Both create and update use `=== "true"` with explicit comment documenting behavior |

### 2.6 - Coupon Logic

| # | Fix | File | Change |
|---|-----|------|--------|
| 27 | Category-scoped coupon applies only to matching items | `src/lib/admin-actions/orders.ts:76-101` | Filter cartItems by coupon's target category before computing discount subtotal |

### 2.7 - Related Products Filter

| # | Fix | File | Change |
|---|-----|------|--------|
| 28 | Add isActive/isClassified filter | `src/app/shop/[id]/page.tsx:61-66` | Add `isActive: true, isClassified: false` to related products where clause |

**Deliverable:** 16 fixes. All data paths produce correct values.

---

## Phase 3: Performance Foundations

**Goal:** Lighthouse Performance >90. TTFB <200ms on cached pages. Bundle <100KB first-load JS per route.

### 3.1 - Database Performance

| # | Fix | File | Change |
|---|-----|------|--------|
| 29 | Add composite index | `prisma/schema.prisma` | `@@index([isActive, isClassified, category])` on Product |
| 30 | Add select to shop page query | `src/app/shop/page.tsx` | Only fetch id, name, price, imageUrl, category, isNew, tags |
| 31 | Add select to admin products query | `src/app/admin/products/page.tsx` | Exclude description, tags |
| 32 | Add pagination to admin pages | `src/app/admin/products/page.tsx`, `src/app/admin/users/page.tsx` | `take: 50` with cursor-based pagination |
| 33 | Add pagination to profile orders | `src/app/profile/page.tsx` | `take: 20` with load-more |
| 34 | Fix duplicate product query | `src/app/shop/[id]/page.tsx` | Use cached `getProduct()` instead of raw `prisma.product.findUnique` |
| 35 | Add Prisma query logging in dev | `src/lib/prisma.ts` | `log: ['query', 'warn', 'error']` in development |

### 3.2 - Caching Strategy

| # | Fix | File | Change |
|---|-----|------|--------|
| 36 | Replace force-dynamic with ISR | `src/app/shop/page.tsx`, `src/app/shop/[id]/page.tsx`, `src/app/merch/page.tsx`, `src/app/black-site/page.tsx` | `export const revalidate = 60` |
| 37 | Cache ThemeLoader query | `src/components/ThemeLoader.tsx` | Use `unstable_cache` with 5-minute revalidation |
| 38 | Add generateStaticParams | `src/app/shop/[id]/page.tsx` | Pre-render popular products at build time |

### 3.3 - Bundle & Code Splitting

| # | Fix | File | Change |
|---|-----|------|--------|
| 39 | Replace framer-motion in ProductCard with CSS | `src/components/ProductCard.tsx` | CSS `transition: transform 0.2s` + `:hover { transform: translateY(-5px) }` |
| 40 | Use LazyMotion + domAnimation | Root or shared wrapper | Reduces framer-motion bundle by ~60% for remaining usages |
| 41 | Lazy-load CartDrawer | `src/components/Navbar.tsx` | `next/dynamic({ ssr: false })` |
| 42 | Lazy-load MobileMenu | `src/components/Navbar.tsx` | `next/dynamic({ ssr: false })` |
| 43 | Lazy-load CyberBackground | `src/app/layout.tsx` | `next/dynamic({ ssr: false })` |

### 3.4 - Rendering Optimization

| # | Fix | File | Change |
|---|-----|------|--------|
| 44 | Convert HeroSection to server component | `src/components/HeroSection.tsx` | Extract session link into tiny `HeroCtaButton` client component |
| 45 | Split Zustand store into cart + theme slices | `src/lib/store.ts` | Separate `useCartStore` and `useThemeStore` with selectors |
| 46 | Remove unnecessary mounted guard | `src/app/profile/ProfileClient.tsx` | Delete `useEffect/setMounted` pattern |
| 47 | Throttle CrosshairCursor with rAF | `src/components/CrosshairCursor.tsx` | Use `requestAnimationFrame` + `useRef` instead of setState per mousemove |
| 48 | Debounce CyberBackground resize | `src/components/CyberBackground.tsx` | Add 200ms debounce on resizeCanvas |
| 49 | Remove getComputedStyle from CrosshairCursor | `src/components/CrosshairCursor.tsx` | Use `data-cursor` attribute or CSS class check instead |

### 3.5 - Image & Font

| # | Fix | File | Change |
|---|-----|------|--------|
| 50 | Add sizes prop to all next/image | Multiple components | Appropriate responsive sizes per context |
| 51 | Self-host noise SVG | `src/components/HeroSection.tsx`, `src/components/CyberBackground.tsx` | Move from external URL to `public/noise.svg` |
| 52 | Remove maximumScale: 1 | `src/app/layout.tsx` | Allow pinch-to-zoom (WCAG 1.4.4) |
| 53 | Add priority to hero image | `src/components/HeroSection.tsx` | Improves LCP metric |

**Deliverable:** 25 fixes. Measurable improvement in TTFB, LCP, INP, bundle size.

---

## Phase 4: Architecture Cleanup

**Goal:** Unified types, consistent error handling, clean component boundaries.

### 4.1 - Type Unification

| # | Fix | File | Change |
|---|-----|------|--------|
| 54 | Create shared Product types | New: `src/types/product.ts` | `Product` (full) and `ProductListItem` (subset for grids), with `parseTags()` helper |
| 55 | Type updateSession prop | `src/app/black-site/components/ClearanceUpgrade.tsx` | `Promise<Session \| null>` instead of `Promise<unknown>` |
| 56 | Fix JWT type augmentation | `src/types/next-auth.d.ts` | Extend JWT type to include custom fields, remove `as` casts from auth.ts |
| 57 | Add noUncheckedIndexedAccess | `tsconfig.json` | Catches unsafe array/map access at compile time |

### 4.2 - Error Handling

| # | Fix | File | Change |
|---|-----|------|--------|
| 58 | Show actual error messages in admin forms | `ProductForm.tsx`, `CouponForm.tsx`, `ConfigEditor.tsx` | Extract `error.message` in catch blocks |
| 59 | Make logActivity fire-and-forget | `src/lib/admin-actions/helpers.ts` | Wrap in try/catch that logs to console.error but doesn't throw |
| 60 | Add error logging to ThemeLoader | `src/components/ThemeLoader.tsx` | `console.error` in catch block |
| 61 | Fix demo error message | `src/lib/auth.ts:60` | "Check your email for a verification link" |
| 62 | Sanitize all server action errors | All server actions | Generic client messages, detailed server-side logs |

### 4.3 - Homepage

| # | Fix | File | Change |
|---|-----|------|--------|
| 63 | Fetch New Arrivals from database | `src/app/page.tsx` | Replace hardcoded products with `prisma.product.findMany({ where: { isNew: true }, take: 3 })` |

### 4.4 - Misc Cleanup

| # | Fix | File | Change |
|---|-----|------|--------|
| 64 | Remove JSON.parse(JSON.stringify()) | `shop/page.tsx`, `shop/[id]/page.tsx`, `black-site/page.tsx` | Map dates explicitly or use superjson |
| 65 | Add isActive filter to merch page | `src/app/merch/page.tsx` | Add `isActive: true` to where clause |
| 66 | Remove duplicate getToken calls | `src/middleware.ts` | Fetch token once at top, reuse for all route checks |
| 67 | Upgrade ESLint no-explicit-any to error | `eslint.config.mjs` | `"error"` instead of `"warn"` |
| 68 | Add bulkUpdateProducts max-IDs guard | `src/lib/admin-actions/products.ts` | `if (ids.length > 500) throw new Error("Too many IDs")` |

**Deliverable:** 15 fixes. Cleaner architecture, better DX.

---

## Phase 5: UX & Accessibility

**Goal:** WCAG 2.1 AA compliance, zero UI bugs.

### 5.1 - Accessibility

| # | Fix | File | Change |
|---|-----|------|--------|
| 69 | Add aria-label with product name to quick-add buttons | `BlackSiteProducts.tsx`, `ProductCard.tsx` | `aria-label={\`Add ${name} to cart\`}` |
| 70 | Fix button inside Link (invalid HTML) | `src/components/ProductCard.tsx` | Move button outside Link, position with CSS absolute |
| 71 | Add role="list" to footer ul | `src/components/footer/FooterLinks.tsx` | Restore list semantics for screen readers |
| 72 | Add focus trap to CartDrawer | `src/components/cart/CartDrawer.tsx` | Trap focus when open, restore on close |
| 73 | Add focus trap to MobileMenu | `src/components/navbar/MobileMenu.tsx` | Same pattern |
| 74 | Remove `* { cursor: none !important }` | `src/app/globals.css` | Move cursor hiding to specific interactive elements only |
| 75 | Add aria-expanded to cart/menu toggles | `src/components/Navbar.tsx` | Dynamic attribute based on open state |

### 5.2 - Loading States

| # | Fix | File | Change |
|---|-----|------|--------|
| 76 | Add loading.tsx for merch | New: `src/app/merch/loading.tsx` | Skeleton loader matching page layout |
| 77 | Add loading.tsx for black-site | New: `src/app/black-site/loading.tsx` | Skeleton loader |
| 78 | Add loading.tsx for admin sub-routes | New: `src/app/admin/*/loading.tsx` | Skeleton loaders for products, users, orders, coupons |
| 79 | Add loading.tsx for profile | New: `src/app/profile/loading.tsx` | Skeleton loader |
| 80 | Add Suspense boundaries | Multiple server component pages | Wrap data-dependent client components in `<Suspense>` |

### 5.3 - UI Bugs

| # | Fix | File | Change |
|---|-----|------|--------|
| 81 | Coordinate body scroll lock | `Navbar.tsx` + `CartDrawer.tsx` | Shared ref-counted `useScrollLock()` utility |
| 82 | Fix router.back() going off-site | `src/app/shop/[id]/components/ProductBreadcrumb.tsx` | Replace with `<Link href="/shop">Back to Archive</Link>` |
| 83 | Clean up setTimeout in ProductCard/ProductInfo | Both files | Store timer ID in ref, clear on unmount via useEffect cleanup |
| 84 | Fix TerminalToast timer leak | `src/components/TerminalToast.tsx` | Clear timeout on manual dismiss |
| 85 | Fix CyberBackground theme-change particle flash | `src/components/CyberBackground.tsx` | Separate color config from particle state; only update colors on theme change |
| 86 | Fix CrosshairCursor flash on first move | `src/components/CrosshairCursor.tsx` | Render at `opacity: 0` initially, animate in on first position update |
| 87 | Use low-res placeholders in LockedVault | `src/app/membership/components/LockedVault.tsx` | Replace full-res Unsplash with blurred thumbnails or CSS gradients |

### 5.4 - Theme Consistency

| # | Fix | File | Change |
|---|-----|------|--------|
| 88 | Replace hardcoded hex colors with design tokens | `MembershipPerks.tsx`, `LockedVault.tsx`, `BlackSiteProducts.tsx`, `ClearanceUpgrade.tsx`, `LoginForm.tsx` | Use `bg-background` variants or CSS custom properties that respond to theme |

**Deliverable:** 20 fixes. Accessible, consistent UI.

---

## Phase 6: Testing & CI Hardening

**Goal:** 80%+ coverage on critical paths, automated quality gates in CI.

### 6.1 - Unit Tests (Highest Priority)

| # | Test Target | File | What to Test |
|---|-------------|------|-------------|
| 89 | validatePrice | `src/lib/admin-actions/__tests__/validation.test.ts` | Cents conversion, edge cases ($0, $0.01, $999999.99), NaN, negative |
| 90 | validateCartItems | `src/lib/actions/__tests__/cart-validation.test.ts` | Empty cart, negative qty, zero qty, max qty, missing fields |
| 91 | createOrder | `src/lib/actions/__tests__/orders.test.ts` | Stock decrement atomicity, coupon application, points earning, insufficient stock |
| 92 | upgradeClearance | `src/lib/actions/__tests__/clearance.test.ts` | Point deduction, race condition guard, tier thresholds, insufficient points |
| 93 | validateCoupon | `src/lib/admin-actions/__tests__/orders.test.ts` | Expired, usage limit hit, wrong scope, valid |
| 94 | requireAdmin | `src/lib/admin-actions/__tests__/helpers.test.ts` | No session, non-admin role, admin passes |

### 6.2 - Integration Tests

| # | Test Target | What to Test |
|---|-------------|-------------|
| 95 | Registration flow | Email validation, password rules, duplicate email, rate limiting |
| 96 | Verification flow | Valid token, expired token, double-click race condition |
| 97 | Login flow | Correct credentials, banned user, unverified email |
| 98 | Admin RBAC | Non-admin blocked from admin actions, admin passes |

### 6.3 - CI Pipeline

| # | Addition | Tool | Purpose |
|---|----------|------|---------|
| 99 | Add typecheck script | `tsc --noEmit` in package.json | Pre-commit type validation |
| 100 | Install bundle analyzer | `@next/bundle-analyzer` | Track bundle size regression per PR |
| 101 | Set up Lighthouse CI | `@lhci/cli` | Gates: Performance >90, A11y >90, SEO >90 |
| 102 | ESLint strict mode already covered | Phase 4 fix #67 | `no-explicit-any: error` |

### 6.4 - Cleanup

| # | Fix | File | Change |
|---|-----|------|--------|
| 103 | Add dev.db and *.log to .gitignore | `.gitignore` | Prevent committing database files and logs |
| 104 | Document OrderItem.name denormalization | `prisma/schema.prisma` | Add `/// Snapshot at purchase time` comments |
| 105 | Add role/status enums prep | `prisma/schema.prisma` | Add comments noting these should be Postgres enums on migration |
| 106 | Remove db-toggle.mjs | `scripts/db-toggle.mjs` | Replace with DATABASE_URL env var approach, document in README |

**Deliverable:** 18 items. Automated quality gates, test safety net.

---

## Cross-Phase Dependencies

```
Phase 1 (Security) -----> Phase 2 (Data Integrity) -----> Phase 3 (Performance)
                                                                    |
                                                                    v
Phase 6 (Testing) <----- Phase 5 (UX/A11y) <------------ Phase 4 (Architecture)
```

- Phase 1 MUST complete before all others (live vulnerabilities)
- Phase 2 must complete before Phase 3 (correct data before optimizing queries)
- Phase 3 and Phase 4 can partially overlap (different files)
- Phase 5 depends on Phase 4 type changes
- Phase 6 should be last (tests validate all prior changes)

## Total Fix Count: 106 items across 6 phases

## Benchmark Targets

| Metric | Tool | Target | Measured After |
|--------|------|--------|----------------|
| Lighthouse Performance | lighthouse / lhci | >90 | Phase 3 |
| Lighthouse Accessibility | lighthouse / lhci | >90 | Phase 5 |
| Lighthouse SEO | lighthouse / lhci | >90 | Phase 4 |
| First Load JS per route | @next/bundle-analyzer | <100KB gzipped | Phase 3 |
| LCP | Chrome DevTools / web.dev | <2.5s | Phase 3 |
| INP | Chrome DevTools / web.dev | <200ms | Phase 3 |
| CLS | Chrome DevTools / web.dev | <0.1 | Phase 5 |
| TTFB (cached) | Vercel Analytics | <200ms | Phase 3 |
| TTFB (uncached) | Vercel Analytics | <800ms | Phase 3 |
| Database query time | Prisma query logs | <100ms per query | Phase 3 |
| Test coverage (critical paths) | vitest --coverage | >80% | Phase 6 |
| axe-core violations | axe-core / pa11y | 0 critical/serious | Phase 5 |
| Type errors | tsc --noEmit | 0 | Phase 4 |
