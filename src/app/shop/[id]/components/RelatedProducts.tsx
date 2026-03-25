"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Product } from "./types";

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const router = useRouter();

  if (products.length === 0) return null;

  return (
    <div className="mt-32 border-t border-foreground/10 pt-16">
      <h2 className="font-display font-bold text-3xl uppercase tracking-tighter mb-8">
        Related Assets<span className="text-volt">.</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            onClick={() => router.push(`/shop/${p.id}`)}
            className="cursor-pointer group relative bg-background/80 backdrop-blur-md border border-foreground/5 hover:border-volt/30 transition-colors"
          >
            <div className="relative aspect-square">
              <Image
                src={p.imageUrl}
                alt={p.name}
                fill
                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="p-4 bg-background transition-colors duration-500">
              <div className="font-mono text-[10px] text-foreground/50 uppercase tracking-widest mb-1">
                {p.category}
              </div>
              <div className="font-sans font-medium text-sm truncate">
                {p.name}
              </div>
              <div className="font-mono text-volt text-xs mt-1">
                ${p.price.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
