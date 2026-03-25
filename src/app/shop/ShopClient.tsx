"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
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

interface ShopClientProps {
  products: Product[];
}

type SortOption = "newest" | "price-asc" | "price-desc" | "name-az";

export default function ShopClient({ products }: ShopClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Extract unique categories from products
  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))];
    return ["All", ...cats.sort()];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const filtered = products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;

      return matchesSearch && matchesCategory;
    });

    const sorted = [...filtered];
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "name-az":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return sorted;
  }, [products, searchQuery, activeCategory, sortBy]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 relative z-10">
      {/* Header */}
      <div className="mb-12 bg-background/40 backdrop-blur-sm p-6 rounded-xl border border-foreground/5">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div>
            <h1 className="font-display font-black text-5xl md:text-7xl uppercase tracking-tighter mb-2">
              Archive <span className="text-volt">.</span>
            </h1>
            <p className="font-mono text-sm text-foreground/60 tracking-widest uppercase">
              {"// Primary Apparel Division"}
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-80">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search archive..."
              className="w-full bg-foreground/5 border border-foreground/10 pl-11 pr-4 py-3 font-mono text-xs text-foreground placeholder:text-foreground/30 focus:border-volt focus:outline-none transition-colors uppercase tracking-wider"
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-foreground/5">
          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto font-mono text-xs uppercase tracking-widest font-bold">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 whitespace-nowrap transition-colors ${
                  activeCategory === category
                    ? "bg-foreground text-background"
                    : "border border-foreground/20 hover:border-volt text-foreground/70 hover:text-volt"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort + Count */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-foreground/40" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-foreground/5 border border-foreground/10 px-3 py-2 font-mono text-xs text-foreground/70 uppercase tracking-wider focus:border-volt focus:outline-none cursor-pointer appearance-none"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="name-az">Name A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 font-mono text-xs text-foreground/40 uppercase tracking-widest">
        Showing {filteredProducts.length} of {products.length} assets
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => (
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
      {filteredProducts.length === 0 && (
        <div className="text-center py-24">
          <div className="font-display font-black text-3xl uppercase tracking-tighter text-foreground/20 mb-4">
            No Results
          </div>
          <p className="font-mono text-sm text-foreground/40 uppercase tracking-widest">
            No assets match your search criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("All");
            }}
            className="mt-6 border border-foreground/20 px-6 py-2 font-mono text-xs uppercase tracking-widest hover:border-volt hover:text-volt transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </section>
  );
}
