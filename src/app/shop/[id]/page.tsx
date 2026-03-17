import { prisma } from "@/lib/prisma";
import ProductClient from "./ProductClient";
import Navbar from "@/components/Navbar";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: any }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    return (
      <main className="min-h-screen pt-24 bg-transparent flex items-center justify-center">
        <Navbar />
        <div className="text-center font-mono">
          <h1 className="text-4xl text-cyber-red mb-4 uppercase">ERR: ASSET_NOT_FOUND</h1>
        </div>
      </main>
    );
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id }
    },
    take: 4
  });

  return <ProductClient product={product} relatedProducts={relatedProducts} />;
}
