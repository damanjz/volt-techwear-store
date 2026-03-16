# ⚡ VOLT | THE SYNDICATE HQ

[![Framework: Next.js 15](https://img.shields.io/badge/Framework-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Style: Tailwind CSS 4](https://img.shields.io/badge/Style-Tailwind%20CSS%204-06B6D4?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Database: Prisma + PostgreSQL](https://img.shields.io/badge/Database-Prisma%207%20%2B%20PostgreSQL-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Auth: NextAuth.js](https://img.shields.io/badge/Auth-NextAuth.js-5D5CDE?style=for-the-badge&logo=next.js)](https://next-auth.js.org/)

> **STATUS:** [ DEPLOYMENT_ACTIVE ]  
> **CLEARANCE:** [ NOCTRA_LEVEL_PROTOCOL ]  
> **ENCRYPTION:** [ AES-256_ACTIVE ]

**VOLT** is an advanced, high-fidelity techwear and streetwear e-commerce ecosystem. It isn't just a store; it's a membership-driven experience where user interactions, purchases, and "Syndicate" participation unlock classified hardware levels. Built for the era of deep industrial luxury and urban traversal.

---

## 🏗️ SYSTEM ARCHITECTURE OVERVIEW

### Core Engine (The Framework)
- **Next.js 15 (App Router)**: Utilizing **React 19 Server Components (RSC)** for ultra-fast, zero-JS-payload page loads.
- **Tailwind CSS v4 Engine**: Next-generation utility-first styling with high-performance design tokens and aggressive custom utility primitives.
- **Framer Motion**: Orchestrating complex layout transitions and industrial micro-animations for an immersive UI feel.

### Data Layer (The Intelligence)
- **Prisma 7 ORM**: Multi-provider data management. Configured with a sophisticated **Prisma 7 config** system for seamless environment switching.
- **Database Hybrid Support**:
  - **Local Development**: SQLite for instant, zero-setup local testing.
  - **Production Environment**: High-performance PostgreSQL via **Neon/Vercel Postgres**.
- **Server Actions**: Secure, authenticated checkout and order processing logic executing directly on the server to prevent client-side manipulation.

### Security & ID (The Syndicate)
- **NextAuth (v4) / Credentials Provider**: Secure, JWT-based authentication protocol.
- **Identity Progression System**: 
  - **Volt Points (VP)**: Every purchase earns VP, tracked in the user model.
  - **Clearance Level Tiering**: 
    - **Lvl 1 (Operative)**: Initial access.
    - **Lvl 2 (Elite)**: Unlocked at 500 VP. Access to premium apparel drops.
    - **Lvl 3 (Syndicate Leader)**: Unlocked at 2000 VP. Access to the **Black Site Vault**.

---

## 🎨 DESIGN SPECIFICATIONS

| CATEGORY | TOKEN / VALUE | DESCRIPTION |
| :--- | :--- | :--- |
| **PRIMARY** | `#CCFF00` (Volt Neon) | Used for primary action indicators and "scanned" elements. |
| **SECONDARY** | `#FF003C` (Cyber Red) | Used for restricted access, alerts, and destructive actions. |
| **NEUTRAL** | `#000103` (Matte Void) | High-contrast industrial black for depth and premium texturing. |
| **TYPOGRAPHY** | `Display: BigShoulders`, `Mono: JetBrains Mono`, `Sans: Inter` | A mix of aggressive headers and high-density technical mono. |
| **EFFECTS** | `Glassmorphism`, `Scanlines`, `Grain-Noise` | To create a "terminal interface" layer over the product imagery. |

---

## 📂 DIRECTORY STRUCTURE

```bash
📦 volt-techwear-store
 ┣ 📂 prisma
 ┃ ┣ 📜 schema.prisma      # Unified DB Schema (Standardized Models)
 ┃ ┣ 📜 prisma.config.ts   # Prisma 7 Multi-Environment Configuration
 ┃ ┗ 📜 seed.mjs           # Baseline Data Seeding Script
 ┣ 📂 src
 ┃ ┣ 📂 app
 ┃ ┃ ┣ 📂 api/debug/seed   # Internal API for Production Database Population
 ┃ ┃ ┣ 📂 shop             # Public Apparel Index (SSR)
 ┃ ┃ ┣ 📂 merch            # Accessories & Hardware Hub
 ┃ ┃ ┣ 📂 membership       # Syndicate Access Portal
 ┃ ┃ ┗ 📂 black-site       # Restricted Classified Assets Vault
 ┃ ┣ 📂 components         # Industrial UI Primitive Libraries
 ┃ ┣ 📂 lib
 ┃ ┃ ┣ 📜 actions.ts       # Secure Server Actions Core
 ┃ ┃ ┣ 📜 prisma.ts        # Global Database Client Initialization
 ┃ ┃ ┗ 📜 store.ts         # Zustand-based Global Client State
 ┗ 📜 package.json         # Automated Build & Post-install Orchestration
```

---

## 🛠️ DEPLOYMENT & OPERATION

### For Operatives (Local Setup)

1. **Clone the Link**:
   ```bash
   git clone https://github.com/damanjz/volt-techwear-store.git
   ```
2. **Configure Node Environment**:
   Initialize `.env` with your `DATABASE_URL` (Postgres or SQLite).
3. **Trigger Initialization**:
   ```bash
   npm install && npx prisma db push
   ```
4. **Boot Up System**:
   ```bash
   npm run dev
   ```

### Technical Notes for Maintainers
- **Build Script**: The project includes a `db-toggle.mjs` script that automatically switches the Prisma provider between SQLite and PostgreSQL during `npm run build` to ensure cloud-readiness.
- **Seeding**: To populate the product database, access the `/api/debug/seed` endpoint once after successful deployment.

---

## 🧬 COLLABORATION TRANSMISSION

This platform was developed as a hybrid architecture project. 

- **Lead Architect**: **Antigravity (Agentic AI Developer)**.
- **System Consultant**: **gpt-oss:120b** (Lead UX/UI Sensory Visionary).
- **Technician**: **Daman (Operative 094)**.

*NOCTRA PROTOCOLS ARE NOW ACTIVE.*  
🔥 **[ END_OF_TRANSMISSION ]** 🔥
