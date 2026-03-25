"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { useToastStore } from "@/components/TerminalToast";
import { Check, Share2 } from "lucide-react";
import ProductSpecs from "./ProductSpecs";
import type { Product } from "./types";

const SIZES = ["S", "M", "L", "XL"];

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const { addToCart, isLoggedIn, addPoints } = useStore();
  const { addToast } = useToastStore();

  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [isAdded, setIsAdded] = useState(false);

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      quantity: 1,
      size: selectedSize,
    });

    addToast(`[LOADOUT_UPDATED]: ${product.name} appended.`, "success");

    if (isLoggedIn) {
      addPoints(Math.floor(product.price));
      addToast(
        `[SYNDICATE_LINK]: +${Math.floor(product.price)} Volt Points verified.`,
        "system"
      );
    }

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        text: product.description,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      addToast("[LINK_COPIED]: Asset URL copied to clipboard.", "success");
    }
  };

  return (
    <div className="flex flex-col justify-center bg-background/40 backdrop-blur-md p-8 md:p-12 border border-foreground/5 h-fit">
      {/* Header: Category, Price, Share */}
      <div className="mb-8 border-b border-foreground/10 pb-8">
        <div className="flex justify-between items-start mb-4">
          <span className="font-mono text-[10px] text-foreground/50 uppercase tracking-widest border border-foreground/10 px-2 py-1">
            {product.category}
          </span>
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-volt text-2xl">
              ${product.price.toFixed(2)}
            </span>
            <button
              onClick={handleShare}
              className="text-foreground/30 hover:text-volt transition-colors"
              aria-label="Share product"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
        <h1 className="font-display font-black text-4xl lg:text-5xl uppercase tracking-tighter leading-tight">
          {product.name}
        </h1>
      </div>

      {/* Stock Indicator */}
      <div className="mb-6 flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            isOutOfStock
              ? "bg-cyber-red"
              : isLowStock
                ? "bg-yellow-400 animate-pulse"
                : "bg-volt"
          }`}
        />
        <span className="font-mono text-xs uppercase tracking-widest text-foreground/60">
          {isOutOfStock
            ? "Out of Stock"
            : isLowStock
              ? `Low Stock (${product.stock} left)`
              : "In Stock"}
        </span>
      </div>

      {/* Description */}
      <div className="mb-10">
        <p className="font-sans text-foreground/70 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Specifications */}
      <ProductSpecs tags={product.tags} />

      {/* Size Selector */}
      {product.category !== "Merch" && product.category !== "Accessories" && (
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <span className="font-mono uppercase text-xs tracking-widest text-foreground/50">
              Select Size
            </span>
            <button className="font-mono uppercase text-[10px] tracking-widest text-foreground/30 hover:text-volt underline transition-colors">
              Size Guide
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-4 font-mono text-sm border transition-all ${
                  selectedSize === size
                    ? "border-volt text-volt bg-volt/10 font-bold"
                    : "border-foreground/10 text-foreground/60 hover:border-foreground/30"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isAdded || isOutOfStock}
        className={`w-full py-6 font-mono font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${
          isAdded
            ? "bg-volt text-background"
            : isOutOfStock
              ? "bg-foreground/20 text-foreground/40"
              : "bg-foreground text-background hover:bg-volt hover:text-background"
        }`}
      >
        {isAdded ? (
          <>
            <Check size={20} /> Requisition SECURED
          </>
        ) : isOutOfStock ? (
          "Currently Unavailable"
        ) : (
          "Add to Loadout"
        )}
      </button>

      {/* Volt Points Notice */}
      {isLoggedIn && !isOutOfStock && (
        <div className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-cyber-red/80">
          + {Math.floor(product.price)} VOLT POINTS UPON ACQUISITION
        </div>
      )}
    </div>
  );
}
