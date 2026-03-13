# VOLT | Techwear & Streetwear

An upbeat, advanced techwear and streetwear e-commerce platform built with **Next.js 15**, **Tailwind CSS v4**, and **Framer Motion**.

## Project Overview
This project serves as the digital storefront and membership portal for VOLT, a cyberpunk/techwear apparel brand. Designed to be performant, highly stylized, and immersive, the architecture leverages modern Server-Side Rendering (SSR) via the Next.js App Router.

### Core Features
- **Dynamic Aesthetic:** Deep industrial matte themes with `VOLT` neon-yellow and `Cyber Red` alert accents.
- **Hardware & Merch:** Categorized storefront spanning outerwear, bottoms, footwear, and brand accessories.
- **The Syndicate (Membership Platform):** 
  - Powered by **NextAuth (v4)** for secure credentials JWT handling.
  - User identity, Clearance Levels, and Volt Points are securely persisted via **Prisma ORM** connecting directly to a **PostgreSQL** database (Vercel Postgres).
  - **Black Site Vault:** Restricted storefront rendering experimental 1-of-1 items, visually locked until clearance (points) are acquired.
  - Early access to new drops.

## Repository Structure
- `src/app/page.tsx` - Initial Landing/Hero Page
- `src/app/shop/page.tsx` - Main Apparel Storefront
- `src/app/merch/page.tsx` - Accessories & Hardware Storefront
- `src/app/membership/page.tsx` - "The Syndicate" Membership Portal
- `src/components/` - Reusable UI elements (Navbar, Product Cards, Hero Section)

## Running Locally

1. Create a `.env` file at the root with standard connection parameters:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/volt_db"
   NEXTAUTH_SECRET="your_secret_key"
   NEXTAUTH_URL="http://localhost:3000"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Push the Prisma Schema to your database:
   ```bash
   npx prisma db push
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Collaboration Log
This system was architected collaboratively via **Antigravity** (acting as lead developer) and a local **120B LLM (gpt-oss:120b)** acting as the lead systems architect and UX visionary. The integration ensures sophisticated, unbottlenecked feature generation entirely localized on the user's hardware.

*End of Transmission.*
