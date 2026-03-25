"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full lg:w-80">
      <Search
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search archive..."
        aria-label="Search products"
        className="w-full bg-foreground/5 border border-foreground/10 pl-11 pr-4 py-3 font-mono text-xs text-foreground placeholder:text-foreground/30 focus:border-volt focus:outline-none transition-colors uppercase tracking-wider"
      />
    </div>
  );
}
