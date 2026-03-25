"use client";

interface ProductSpecsProps {
  tags: string;
}

export default function ProductSpecs({ tags }: ProductSpecsProps) {
  if (!tags) return null;

  const tagList = tags.split(",").filter(Boolean);

  if (tagList.length === 0) return null;

  return (
    <div className="mb-10 border-t border-foreground/10 pt-6">
      <h3 className="font-mono text-xs uppercase tracking-widest text-foreground/50 mb-3">
        Specifications
      </h3>
      <div className="flex flex-wrap gap-2">
        {tagList.map((tag: string) => (
          <span
            key={tag.trim()}
            className="font-mono text-xs uppercase px-3 py-1 border border-foreground/10 text-foreground/60"
          >
            {tag.trim()}
          </span>
        ))}
      </div>
    </div>
  );
}
