"use client";

import { SlidersHorizontal } from "lucide-react";

export type SortOption = "newest" | "price-asc" | "price-desc" | "name-az";

const SORT_OPTIONS: SortOption[] = ["newest", "price-asc", "price-desc", "name-az"];

interface SortDropdownProps {
  readonly value: SortOption;
  readonly onChange: (value: SortOption) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={14} className="text-foreground/40" aria-hidden="true" />
        <select
          value={value}
          aria-label="Sort products"
          onChange={(e) => {
            const val = e.target.value;
            if (SORT_OPTIONS.includes(val as SortOption)) {
              onChange(val as SortOption);
            }
          }}
          className="bg-foreground/5 border border-foreground/10 px-3 py-2 font-mono text-xs text-foreground/70 uppercase tracking-wider focus:border-volt focus:outline-none cursor-pointer appearance-none"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="name-az">Name A-Z</option>
        </select>
      </div>
    </div>
  );
}
