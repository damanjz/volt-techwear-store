"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";

interface ProductBreadcrumbProps {
  category: string;
  productName: string;
}

export default function ProductBreadcrumb({
  category,
  productName,
}: ProductBreadcrumbProps) {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-foreground/40 mb-8">
        <Link href="/shop" className="hover:text-volt transition-colors">
          Archive
        </Link>
        <ChevronRight size={12} />
        <span className="text-foreground/50">{category}</span>
        <ChevronRight size={12} />
        <span className="text-foreground/70 truncate max-w-[200px]">
          {productName}
        </span>
      </div>

      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-foreground/50 hover:text-volt transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Back to Archive
      </button>
    </>
  );
}
