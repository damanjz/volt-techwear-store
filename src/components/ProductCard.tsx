"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

interface ProductProps {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  isNew?: boolean;
}

export default function ProductCard({ id, name, price, category, imageUrl, isNew }: ProductProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group relative flex flex-col bg-[#111111] overflow-hidden border border-white/5 hover:border-volt/30 transition-colors"
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {isNew && (
          <div className="bg-volt text-background px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-widest">
            NEW DROP
          </div>
        )}
      </div>
      
      {/* Members-only overlay effect (just decorative for now) */}
      
      {/* Image Area */}
      <Link href={`/shop/${id}`} className="relative aspect-[4/5] bg-[#1a1a1a] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Mock Image Placeholder using abstract gradient/pattern since we don't have actual images */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ backgroundImage: `url(${imageUrl})`, backgroundColor: '#222' }}
        />
        
        {/* Quick Add Button */}
        <button 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 z-20 flex items-center gap-2 bg-foreground text-background font-mono font-bold text-xs uppercase px-6 py-3 tracking-widest hover:bg-volt transition-all duration-300 whitespace-nowrap"
          onClick={(e) => e.preventDefault()}
        >
          <ShoppingBag size={14} /> Quick Add
        </button>
      </Link>

      {/* Info Area */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div className="font-mono text-[10px] text-foreground/50 uppercase tracking-widest">{category}</div>
          <div className="font-mono font-bold text-volt text-sm">${price.toFixed(2)}</div>
        </div>
        <Link href={`/shop/${id}`}>
          <h3 className="font-sans font-medium text-lg leading-tight group-hover:text-volt transition-colors">{name}</h3>
        </Link>
      </div>
    </motion.div>
  );
}
