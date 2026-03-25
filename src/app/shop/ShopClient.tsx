"use client";

import { useState, useMemo, useCallback } from "react";
import SearchBar from "./components/SearchBar";
import CategoryFilters from "./components/CategoryFilters";
import SortDropdown from "./components/SortDropdown";
import ProductGrid from "./components/ProductGrid";
import type { SortOption } from "./components/SortDropdown";

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

export default function ShopClient({ products }: ShopClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))];
    return ["All", ...cats.sort()];
  }, [products]);

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

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setActiveCategory("All");
  }, []);

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

          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Filters Row */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-foreground/5">
          <CategoryFilters
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      <ProductGrid
        products={filteredProducts}
        totalCount={products.length}
        onClearFilters={handleClearFilters}
      />
    </section>
  );
}
