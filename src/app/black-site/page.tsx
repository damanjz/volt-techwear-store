import { prisma } from "@/lib/prisma";
import BlackSiteClient from "./BlackSiteClient";

export default async function BlackSitePage() {
  const products = await prisma.product.findMany({
    where: {
      id: {
        startsWith: 'bs-'
      }
    }
  });

  return <BlackSiteClient initialProducts={products} />;
}
