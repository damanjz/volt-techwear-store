import { cache } from "react";
import { prisma } from "@/lib/prisma";
import ProductClient from "./ProductClient";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const getProduct = cache(async (id: string) =>
  prisma.product.findUnique({ where: { id } })
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | VOLT`,
      description: product.description,
      images: [{ url: product.imageUrl }],
      type: "article",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return (
      <main className="min-h-screen pt-24 bg-transparent flex items-center justify-center">
        <Navbar />
        <div className="text-center font-mono">
          <h1 className="text-4xl text-cyber-red mb-4 uppercase">
            ERR: ASSET_NOT_FOUND
          </h1>
        </div>
      </main>
    );
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id },
    },
    take: 4,
  });

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.imageUrl,
    category: product.category,
    offers: {
      "@type": "Offer",
      price: (product.price / 100).toFixed(2),
      priceCurrency: "USD",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026") }}
      />
      <ProductClient
        product={JSON.parse(JSON.stringify(product))}
        relatedProducts={JSON.parse(JSON.stringify(relatedProducts))}
      />
    </>
  );
}
