"use client";

import Image from "next/image";

interface ProductImageProps {
  imageUrl: string;
  name: string;
  isNew: boolean;
}

export default function ProductImage({
  imageUrl,
  name,
  isNew,
}: ProductImageProps) {
  return (
    <div className="relative aspect-[4/5] bg-foreground/5 border border-foreground/10 p-4">
      <div className="absolute inset-0 m-4 bg-foreground/10">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover opacity-90"
          priority
        />
      </div>

      {/* NEW DROP Badge */}
      {isNew && (
        <div className="absolute top-8 left-8 bg-volt text-background px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest z-10">
          NEW DROP
        </div>
      )}

      {/* Scanned Asset Overlay */}
      <div className="absolute top-8 right-8 font-mono text-[10px] text-volt border border-volt/30 bg-volt/10 backdrop-blur-sm px-2 py-1 rotate-90 origin-right tracking-widest uppercase">
        {"// SCANNED_ASSET"}
      </div>
    </div>
  );
}
