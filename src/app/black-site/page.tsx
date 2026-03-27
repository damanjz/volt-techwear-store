import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import BlackSiteClient from "./BlackSiteClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Black Site Vault",
  description: "Classified VOLT prototypes and experimental gear. Tier 3 clearance required.",
};

export default async function BlackSitePage() {
  const session = await getServerSession(authOptions);

  const clearanceLevel = session?.user?.clearanceLevel ?? 0;
  const voltPoints = session?.user?.voltPoints ?? 0;
  const isLoggedIn = !!session?.user;

  const hasClearance = clearanceLevel >= 3;

  // Only fetch products if user has Tier 3 clearance
  const products = hasClearance
    ? await prisma.product.findMany({
        where: { isClassified: true, isActive: true },
      })
    : [];

  return (
    <BlackSiteClient
      initialProducts={JSON.parse(JSON.stringify(products))}
      clearanceLevel={clearanceLevel}
      voltPoints={voltPoints}
      isLoggedIn={isLoggedIn}
    />
  );
}
