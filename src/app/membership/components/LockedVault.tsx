"use client";

import { Lock } from "lucide-react";

const LOCKED_PRODUCTS = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520975954732-57dd22299614?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542272201-b1ca555f8505?q=80&w=800&auto=format&fit=crop",
];

export default function LockedVault() {
  return (
    <div>
      <div className="flex justify-between items-end border-b border-cyber-red/20 pb-4 mb-8">
        <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tighter text-cyber-red">
          Black Site // Vault
        </h2>
        <span className="font-mono text-xs uppercase text-cyber-red px-2 py-1 bg-cyber-red/10 border border-cyber-red/30">
          Clearance Required
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6 opacity-30 select-none pointer-events-none">
        {LOCKED_PRODUCTS.map((imageUrl) => (
          <div
            key={imageUrl}
            className="bg-[#1a1a1a] border border-white/5 aspect-[4/5] relative flex items-center justify-center overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-cover opacity-20 filter blur-sm"
              style={{ backgroundImage: `url('${imageUrl}')` }}
            />
            <div className="relative z-10 flex flex-col items-center gap-4 border border-cyber-red/50 bg-black/80 px-8 py-6 backdrop-blur-sm">
              <Lock className="text-cyber-red" size={32} />
              <span className="font-mono uppercase text-xs tracking-widest text-cyber-red">
                Classified Asset
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
