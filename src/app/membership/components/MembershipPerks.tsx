"use client";

import { Lock, Shield, Zap } from "lucide-react";

export default function MembershipPerks() {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-16">
      <div className="border border-white/10 bg-[#111] p-8 flex flex-col gap-4">
        <Zap className="text-volt" size={32} />
        <h3 className="font-mono font-bold uppercase text-xl">Earn & Burn</h3>
        <p className="font-sans text-sm text-foreground/60">
          Generate 1 Volt Point for every $1 spent. Redeem points directly on
          exclusive drops and accessories.
        </p>
      </div>
      <div className="border border-white/10 bg-[#111] p-8 flex flex-col gap-4">
        <Lock className="text-volt" size={32} />
        <h3 className="font-mono font-bold uppercase text-xl">Secured Drops</h3>
        <p className="font-sans text-sm text-foreground/60">
          Level 2 clearance members receive 24hr early access to all
          limited-edition capsule collections.
        </p>
      </div>
      <div className="border border-white/10 bg-[#111] p-8 flex flex-col gap-4">
        <Shield className="text-cyber-red" size={32} />
        <h3 className="font-mono font-bold uppercase text-xl">
          Black Site Store
        </h3>
        <p className="font-sans text-sm text-foreground/60">
          A hidden storefront accessible only to Tier 3 members. Features 1-of-1
          experimental garments.
        </p>
      </div>
    </div>
  );
}
