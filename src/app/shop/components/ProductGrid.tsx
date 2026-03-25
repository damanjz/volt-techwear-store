"use client";

import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  isNew: boolean;
  description: string;
  tags: string;
  stock: number;
  createdAt: string;
}

interface ProductGridProps {
  readonly products: readonly Product[];
  readonly totalCount: number;
  readonly onClearFilters: () => void;
}

export default function ProductGrid({
  products,
  totalCount,
  onClearFilters,
}: ProductGridProps) {
  return (
    <>
      {/* Results Count */}
      <div className="mb-6 font-mono text-xs text-foreground/40 uppercase tracking-widest">
        Showing {products.length} of {totalCount} assets
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {products.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-24">
          <div className="font-display font-black text-3xl uppercase tracking-tighter text-foreground/20 mb-4">
            No Results
          </div>
          <p className="font-mono text-sm text-foreground/40 uppercase tracking-widest">
            No assets match your search criteria.
          </p>
          <button
            onClick={onClearFilters}
            className="mt-6 border border-foreground/20 px-6 py-2 font-mono text-xs uppercase tracking-widest hover:border-volt hover:text-volt transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </>
  );
}
