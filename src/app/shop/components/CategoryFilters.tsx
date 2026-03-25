"use client";

interface CategoryFiltersProps {
  readonly categories: readonly string[];
  readonly activeCategory: string;
  readonly onCategoryChange: (category: string) => void;
}

export default function CategoryFilters({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto font-mono text-xs uppercase tracking-widest font-bold">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          aria-pressed={activeCategory === category}
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
  );
}
