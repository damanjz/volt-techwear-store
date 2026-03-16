"use client";


import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useStore } from "@/lib/store";
import { useState } from "react";

interface ProductProps {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  isNew?: boolean;
}

export default function ProductCard({ id, name, price, category, imageUrl, isNew }: ProductProps) {
  const { addToCart } = useStore();
  const [added, setAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id,
      name,
      price,
      category,
      imageUrl,
      quantity: 1,
      size: "M" // Default mock size for quick add
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group relative flex flex-col bg-background/80 backdrop-blur-md overflow-hidden border border-foreground/5 hover:border-volt/30 transition-colors"
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {isNew && (
          <div className="bg-volt text-background px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-widest">
            NEW DROP
          </div>
        )}
      </div>
      
      {/* Image Area */}
      <Link href={`/shop/${id}`} className="relative aspect-[4/5] bg-foreground/5 overflow-hidden block">
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        
        {/* Quick Add Button */}
        <button 
          onClick={handleQuickAdd}
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 z-20 flex items-center gap-2 font-mono font-bold text-xs uppercase px-6 py-3 tracking-widest transition-all duration-300 whitespace-nowrap ${added ? 'bg-volt text-background' : 'bg-foreground text-background hover:bg-volt'}`}
        >
          <ShoppingBag size={14} /> {added ? "ADDED" : "Quick Add"}
        </button>
      </Link>

      {/* Info Area */}
      <div className="p-4 flex flex-col gap-2 relative z-10 bg-background transition-colors duration-500">
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
