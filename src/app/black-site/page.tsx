import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import BlackSiteClient from "./BlackSiteClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Black Site Vault",
  description: "Classified VOLT prototypes and experimental gear. Tier 3 clearance required.",
};

export default async function BlackSitePage() {
  // Server-side access control - don't leak classified product data
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/membership");
  }
  const products = await prisma.product.findMany({
    where: {
      id: {
        startsWith: 'bs-'
      }
    }
  });

  return <BlackSiteClient initialProducts={products} />;
}
