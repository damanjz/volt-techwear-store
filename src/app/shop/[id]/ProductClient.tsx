"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductBreadcrumb from "./components/ProductBreadcrumb";
import ProductImage from "./components/ProductImage";
import ProductInfo from "./components/ProductInfo";
import RelatedProducts from "./components/RelatedProducts";
import type { Product } from "./components/types";

export type { Product };

interface ProductClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductClient({
  product,
  relatedProducts,
}: ProductClientProps) {
  return (
    <main className="min-h-screen pt-24 bg-transparent">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <ProductBreadcrumb
          category={product.category}
          productName={product.name}
        />

        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
          <ProductImage
            imageUrl={product.imageUrl}
            name={product.name}
            isNew={product.isNew}
          />
          <ProductInfo product={product} />
        </div>

        <RelatedProducts products={relatedProducts} />
      </div>

      <Footer />
    </main>
  );
}
