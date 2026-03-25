"use client";

import { ShieldCheck } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";

interface BlackSiteProductsProps {
  products: any[];
}

export default function BlackSiteProducts({ products }: BlackSiteProductsProps) {
  const addToCart = useStore((s) => s.addToCart);
  const toggleCart = useStore((s) => s.toggleCart);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-volt/20 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-volt/10 text-volt text-[10px] font-mono uppercase tracking-widest mb-4 border border-volt/30">
            <ShieldCheck size={12} />
            Full Access Granted
          </div>
          <p className="font-mono text-foreground/50 text-sm uppercase tracking-widest">
            {products.length} classified asset{products.length !== 1 ? "s" : ""}{" "}
            available
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative flex flex-col bg-[#0a0a0a] border border-volt/20 hover:border-volt/60 overflow-hidden transition-all duration-500 shadow-[0_0_20px_rgba(212,255,51,0.03)] hover:shadow-[0_0_30px_rgba(212,255,51,0.12)]"
          >
            {/* Image */}
            <div className="relative aspect-[4/5] bg-black overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <button
                className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 z-20 font-mono font-bold text-xs uppercase px-8 py-4 bg-volt text-background tracking-widest transition-all shadow-[0_0_15px_rgba(212,255,51,0.4)] whitespace-nowrap hover:bg-[#b0d925]"
                onClick={() => {
                  addToCart({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    imageUrl: item.imageUrl,
                    category: item.category,
                    quantity: 1,
                  });
                  toggleCart();
                }}
              >
                Secure Asset
              </button>
              {/* Scanline overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none z-30 opacity-20" />
            </div>

            {/* Info */}
            <div className="p-6 bg-[#0a0a0a]">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest bg-white/5 px-2 py-1">
                  {item.category}
                </span>
                <span className="font-mono font-bold text-sm text-volt">
                  ${item.price.toFixed(2)}
                </span>
              </div>
              <h3 className="font-mono font-medium text-lg uppercase tracking-wider text-foreground">
                {item.name}
              </h3>
              <p className="font-mono text-xs text-foreground/40 mt-2 line-clamp-2">
                {item.description}
              </p>
              {item.stock <= 5 && (
                <div className="mt-3 font-mono text-[10px] text-cyber-red uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-cyber-red rounded-full animate-pulse" />
                  Only {item.stock} remaining
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
