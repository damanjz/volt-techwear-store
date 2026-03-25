"use client";

import { useStore } from "@/lib/store";
import { useToastStore } from "@/components/TerminalToast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Check, ChevronRight, Share2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isNew: boolean;
  stock: number;
  tags: string;
}

interface ProductClientProps {
  product: Product;
  relatedProducts: Product[];
}

const SIZES = ["S", "M", "L", "XL"];

export default function ProductClient({
  product,
  relatedProducts,
}: ProductClientProps) {
  const router = useRouter();
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
    <main className="min-h-screen pt-24 bg-transparent">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-foreground/40 mb-8">
          <Link href="/shop" className="hover:text-volt transition-colors">
            Archive
          </Link>
          <ChevronRight size={12} />
          <span className="text-foreground/50">{product.category}</span>
          <ChevronRight size={12} />
          <span className="text-foreground/70 truncate max-w-[200px]">
            {product.name}
          </span>
        </div>

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-foreground/50 hover:text-volt transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to Archive
        </button>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
          <div className="relative aspect-[4/5] bg-foreground/5 border border-foreground/10 p-4">
            <div className="absolute inset-0 m-4 bg-foreground/10">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover opacity-90"
                priority
              />
            </div>

            {/* Badges */}
            {product.isNew && (
              <div className="absolute top-8 left-8 bg-volt text-background px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest z-10">
                NEW DROP
              </div>
            )}

            <div className="absolute top-8 right-8 font-mono text-[10px] text-volt border border-volt/30 bg-volt/10 backdrop-blur-sm px-2 py-1 rotate-90 origin-right tracking-widest uppercase">
              {"// SCANNED_ASSET"}
            </div>
          </div>

          <div className="flex flex-col justify-center bg-background/40 backdrop-blur-md p-8 md:p-12 border border-foreground/5 h-fit">
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

            <div className="mb-10">
              <p className="font-sans text-foreground/70 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            {product.tags && (
              <div className="mb-10 border-t border-foreground/10 pt-6">
                <h3 className="font-mono text-xs uppercase tracking-widest text-foreground/50 mb-3">
                  Specifications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags
                    .split(",")
                    .filter(Boolean)
                    .map((tag: string) => (
                      <span
                        key={tag.trim()}
                        className="font-mono text-xs uppercase px-3 py-1 border border-foreground/10 text-foreground/60"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {product.category !== "Merch" &&
              product.category !== "Accessories" && (
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

            {isLoggedIn && !isOutOfStock && (
              <div className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-cyber-red/80">
                + {Math.floor(product.price)} VOLT POINTS UPON ACQUISITION
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 border-t border-foreground/10 pt-16">
            <h2 className="font-display font-bold text-3xl uppercase tracking-tighter mb-8">
              Related Assets<span className="text-volt">.</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => router.push(`/shop/${p.id}`)}
                  className="cursor-pointer group relative bg-background/80 backdrop-blur-md border border-foreground/5 hover:border-volt/30 transition-colors"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="p-4 bg-background transition-colors duration-500">
                    <div className="font-mono text-[10px] text-foreground/50 uppercase tracking-widest mb-1">
                      {p.category}
                    </div>
                    <div className="font-sans font-medium text-sm truncate">
                      {p.name}
                    </div>
                    <div className="font-mono text-volt text-xs mt-1">
                      ${p.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
