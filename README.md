# ⚡ VOLT | THE SYNDICATE HQ

[![Framework: Next.js 15](https://img.shields.io/badge/Framework-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Style: Tailwind CSS 4](https://img.shields.io/badge/Style-Tailwind%20CSS%204-06B6D4?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Database: Prisma 6 + PostgreSQL](https://img.shields.io/badge/Database-Prisma%206%20%2B%20PostgreSQL-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Auth: NextAuth.js](https://img.shields.io/badge/Auth-NextAuth.js-5D5CDE?style=for-the-badge&logo=next.js)](https://next-auth.js.org/)
[![Deployed: Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel)](https://volt-techwear-store.vercel.app)

> **STATUS:** [ DEPLOYMENT_ACTIVE ]  
> **LIVE:** [ https://volt-techwear-store.vercel.app ]  
> **ADMIN:** [ ROLE_LOCKED // ADMIN_ONLY ]

**VOLT** is a production-grade techwear e-commerce platform with a cyberpunk identity system. Beyond a store, it's a membership-driven experience where purchases unlock "Syndicate" clearance levels, classified hardware drops, and Volt Points progression — all managed through a complete internal admin control system.

---

## 🏗️ SYSTEM ARCHITECTURE

### Core Engine
| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 15 (App Router) | React 19 RSC, SSR, dynamic rendering |
| **Styling** | Tailwind CSS v4 | Custom design tokens (`--volt`, `--cyber-red`) |
| **Animation** | Framer Motion | Industrial micro-animations, layout transitions |
| **State** | Zustand (persisted) | Client-side cart, theme, user state |
| **Database** | Prisma 6 ORM | PostgreSQL (prod) / SQLite (dev) via `db-toggle.mjs` |
| **Auth** | NextAuth.js v4 | JWT strategy, Credentials provider, role-based access |
| **Deploy** | Vercel | Auto-deploy from `master` branch |

### Data Models (11 total)
| Model | Purpose |
|-------|---------|
| `User` | Accounts with `role`, `voltPoints`, `clearanceLevel`, `isBanned` |
| `Product` | Inventory with `isActive`, `isClassified`, `tags`, stock tracking |
| `Order` / `OrderItem` | Purchase records with discount + coupon tracking |
| `Coupon` / `CouponProduct` | Discount engine (% or flat, scoped, limited, expirable) |
| `SiteConfig` | Live key-value config for theme, feature flags, banners |
| `ActivityLog` | Audit trail of all admin mutations |
| `Account` / `Session` / `VerificationToken` | NextAuth internals |

---

## 🔐 SECURITY ARCHITECTURE

### Middleware Protection (3 Zones)
| Route | Protection | Details |
|-------|-----------|---------|
| `/admin/*` | **ADMIN role only** | JWT token checked, non-admins redirected to `/` |
| `/profile` | **Authenticated users** | Unauthenticated redirected to `/membership` |
| `/api/debug/*` | **Blocked in production** | Returns 404 in `NODE_ENV=production` |

### Security Headers (Applied Globally)
- `Strict-Transport-Security` (HSTS with 2-year max-age)
- `X-Frame-Options: DENY` (clickjacking prevention)
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### SEO Protection
- `robots.ts` disallows `/admin/`, `/api/`, `/profile`, `/black-site/`
- Dynamic `sitemap.ts` includes only active, non-classified products

### 🔒 Audit Compliance & Hardening
Following a deep architectural review, VOLT represents tier-one e-commerce standards:
- **Financial Precision:** All financial datasets rigorously process deterministic integer cents scaling (`$12.50` -> `1250`) eradicating floating-point arithmetic vulnerabilities.
- **Atomic Concurrency:** High-concurrency cart processing, inventory tracking, and valid coupon redemptions process asynchronously within isolated Prisma `$transaction` boundaries.
- **DDoS/Brute Force Mitigation:** Global application and API ingestion is organically rate-limited via Upstash Redis edge capabilities.
- **Server Authority:** Operator clearance levels, sessions, and multi-tier authentication strictly re-fetch securely server-side per network request, preventing token spoofing intercepting.
- **Next.js 15 Rigor:** Complete CSP header implementation, structured `error.tsx` Catch-all route bounds, decoupled viewport meta-protocols, layout responsiveness (`sizes`), and dedicated SEO crawlers mappings.
- **RSC & Caching:** Leverages React 19 `cache()` for DB call deduplication and utilizes pure Server Components for static asset rendering to minimize client-side bundle weight.
- **A11y Engineering:** Rigorous ARIA-compliant overlays (Cart/Navigation) with full keyboard (Escape key) support and semantic radiogroup interactions.

---

## 🛡️ ADMIN CONTROL SYSTEM (`/admin`)

A complete internal dashboard accessible **only** to users with `role = "ADMIN"`.

| Panel | Capabilities |
|-------|-------------|
| **Dashboard** | Revenue, order count, product count, user count, low stock alerts, recent orders |
| **Products** | Full CRUD, toggle active/inactive, stock monitoring with low-stock warnings, classified (Black Site) flag |
| **Coupons** | Create/delete/toggle coupons — supports PERCENT/FLAT, site-wide/category/product scope, usage limits, expiry dates |
| **Users** | Promote/demote roles, adjust clearance levels, edit Volt Points, ban/unban users |
| **Theme** | Live color editor with instant preview — changes `--volt`, `--cyber-red`, background, foreground via DB-driven CSS variables |
| **Config** | Key-value editor for feature flags, promotional banners, pricing multipliers — preset shortcuts for common configs |

All admin mutations are logged in the `ActivityLog` table with user ID, action, target, and details.

---

## ⚡ SYNDICATE IDENTITY SYSTEM

| Mechanic | Details |
|----------|---------|
| **Volt Points** | Earned at 10% of order total, tracked per user |
| **Clearance Levels** | Lvl 1 (default) → Lvl 2 (5,000 VP) → Lvl 3 (15,000 VP) |
| **Black Site** | Classified product vault accessible to Lvl 3+ operatives |
| **Auto-Registration** | First login auto-creates account with 1,500 VP starting bonus |

---

## 🎨 DESIGN SYSTEM

| Token | Light Mode | Dark Mode | Purpose |
|-------|-----------|-----------|---------|
| `--volt` | `#a3cc00` | `#d4ff33` | Primary accent (CTAs, highlights) |
| `--cyber-red` | `#e11d48` | `#ff1a4f` | Alerts, restricted access, destructive actions |
| `--background` | `#f4f4f5` | `#0a0a0a` | Page background |
| `--foreground` | `#18181b` | `#ffffff` | Text color |

**Typography:** Inter (sans), Outfit (display), Roboto Mono (code/labels)  
**Effects:** Glassmorphism, particle network background, crosshair cursor, terminal-style toasts

> Theme colors can be overridden at runtime via the Admin Theme Editor (stored in `SiteConfig`, injected via `ThemeLoader` component).

---

## 📂 PROJECT STRUCTURE

```
volt-techwear-store/
├── prisma/
│   └── schema.prisma           # 11 models — User, Product, Order, Coupon, SiteConfig, ActivityLog, etc.
├── scripts/
│   └── db-toggle.mjs           # Switches datasource between SQLite (dev) and PostgreSQL (prod)
├── src/
│   ├── app/
│   │   ├── page.tsx            # Homepage — hero, new arrivals, syndicate teaser
│   │   ├── shop/               # Product archive (force-dynamic, ShopClient)
│   │   │   ├── [id]/           # Individual product pages with loading states
│   │   │   └── loading.tsx     # Skeleton loading UI
│   │   ├── merch/              # Accessories & hardware hub
│   │   ├── membership/         # Syndicate sign-up/login portal
│   │   ├── profile/            # User profile (Volt Points, clearance)
│   │   ├── black-site/         # Classified vault (Lvl 3+ only)
│   │   ├── admin/              # Admin dashboard (ADMIN role only)
│   │   │   ├── products/       # Product CRUD + bulk actions
│   │   │   ├── coupons/        # Coupon engine management
│   │   │   ├── users/          # User management + ban system
│   │   │   ├── theme/          # Live theme color editor
│   │   │   ├── config/         # Feature flags + site config
│   │   │   └── components/     # AdminSidebar
│   │   ├── api/
│   │   │   ├── auth/           # NextAuth handler
│   │   │   └── debug/seed/     # Database seeding endpoint (dev only)
│   │   ├── error.tsx           # On-brand error page
│   │   ├── not-found.tsx       # Custom 404 page
│   │   ├── sitemap.ts          # Dynamic sitemap (active products only)
│   │   └── robots.ts           # Search engine directives
│   ├── components/
│   │   ├── Navbar.tsx          # Navigation with cart badge + auth status
│   │   ├── HeroSection.tsx     # Animated hero with particle network
│   │   ├── Footer.tsx          # Site footer with newsletter + links
│   │   ├── ProductCard.tsx     # Product card with "Quick Add" hover
│   │   ├── CartDrawer.tsx      # Slide-out cart with checkout
│   │   ├── TerminalToast.tsx   # Terminal-style notifications
│   │   ├── ThemeLoader.tsx     # DB → CSS variable injection (RSC)
│   │   ├── CrosshairCursor.tsx # Custom cursor
│   │   ├── CyberBackground.tsx # Animated background
│   │   ├── NewsletterForm.tsx  # Email subscription form
│   │   └── ThemeProvider.tsx   # Dark/light mode provider
│   ├── lib/
│   │   ├── prisma.ts           # PrismaClient singleton
│   │   ├── auth.ts             # NextAuth config (JWT + role in session)
│   │   ├── actions.ts          # Checkout with coupon + stock + Volt Points
│   │   ├── admin-actions.ts    # All admin CRUD + activity logging
│   │   └── store.ts            # Zustand store (cart, theme, user state)
│   ├── middleware.ts           # Route protection + security headers
│   └── types/next-auth.d.ts    # Extended session types (role, voltPoints)
├── next.config.mjs             # Image domains + security headers
└── package.json                # Production build utilizes structured migrate deploy
```

---

## 🛠️ LOCAL DEVELOPMENT

1. **Clone:**
   ```bash
   git clone https://github.com/damanjz/volt-techwear-store.git
   cd volt-techwear-store
   ```

2. **Install & Setup:**
   ```bash
   npm install
   npm run db:dev          # Switch to SQLite for local dev
   npx prisma migrate dev  # Execute schema migrations locally
   npx prisma generate     # Rebuild the local types
   ```

3. **Environment (`.env`):**
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Run:**
   ```bash
   npm run dev
   ```

5. **Seed data (dev only):**
   Send a POST request to `/api/debug/seed` sending the internal `SEED_SECRET` to securely populate mock products, admin users, and configurations.

6. **Admin access:**
   Login as `admin@volt.sys` / `admin123` → navigate to `/admin`

---

## 🚀 PRODUCTION (VERCEL)

**Environment Variables Required:**
| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `NEXTAUTH_SECRET` | JWT signing secret |
| `NEXTAUTH_URL` | Production URL (`https://volt-techwear-store.vercel.app`) |

The build script automatically switches to PostgreSQL, pushes schema changes, generates the Prisma client, and builds Next.js.

---

## 🧬 COLLABORATION

- **Lead Architect:** Antigravity (Agentic AI Developer)
- **System Consultant:** gpt-oss:120b (Lead UX/UI Visionary)
- **Technician:** Daman (Operative 094)

🔥 **[ END_OF_TRANSMISSION ]** 🔥
