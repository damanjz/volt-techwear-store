"use client";

import { Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import type { CartItem as CartItemType } from "@/lib/store";

interface CartItemProps {
  readonly item: CartItemType;
  readonly onUpdateQuantity: (id: string, quantity: number, size?: string) => void;
  readonly onRemove: (id: string, size?: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex gap-4 p-4 border border-foreground/5 bg-foreground/5">
      <div className="relative w-24 h-32 bg-foreground/10 border border-foreground/10 overflow-hidden flex-shrink-0">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, 20vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col flex-1 justify-between py-1">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-sans font-medium text-lg leading-tight pr-4">
              {item.name}
            </h3>
            <button
              onClick={() => onRemove(item.id, item.size)}
              className="text-foreground/30 hover:text-cyber-red transition-colors"
              aria-label="Remove item"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <p className="font-mono text-[10px] text-foreground/50 uppercase tracking-widest mt-1">
            {item.category}{" "}
            {item.size ? `// Size: ${item.size}` : ""}
          </p>
        </div>

        <div className="flex items-end justify-between mt-4">
          <div className="font-mono font-bold text-volt">
            ${((item.price * item.quantity) / 100).toFixed(2)}
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center border border-foreground/20 bg-foreground/5">
            <button
              onClick={() =>
                onUpdateQuantity(item.id, item.quantity - 1, item.size)
              }
              className="p-2 text-foreground/70 hover:text-volt hover:bg-foreground/5 transition-colors disabled:opacity-30"
              disabled={item.quantity <= 1}
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center font-mono text-sm">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                onUpdateQuantity(item.id, item.quantity + 1, item.size)
              }
              className="p-2 text-foreground/70 hover:text-volt hover:bg-foreground/5 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
