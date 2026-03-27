"use client";

import { ShieldAlert, LockKeyhole, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { upgradeClearance } from "@/lib/actions";
import { motion } from "framer-motion";

const TIERS = [
  {
    level: 1,
    name: "Civilian",
    description: "Basic store access",
    cost: 0,
    perks: ["Shop access", "Merch access", "Earn Volt Points"],
  },
  {
    level: 2,
    name: "Field Operative",
    description: "Early drop access & discounts",
    cost: 500,
    perks: [
      "24hr early access to drops",
      "5% member discount",
      "Priority support",
      "Exclusive colorways",
    ],
  },
  {
    level: 3,
    name: "Black Site Agent",
    description: "Full vault access",
    cost: 2000,
    perks: [
      "Black Site Vault access",
      "1-of-1 experimental gear",
      "10% member discount",
      "Private drops channel",
    ],
  },
];

interface ClearanceUpgradeProps {
  initialProducts: any[];
  clearanceLevel: number;
  voltPoints: number;
  updateSession: (data: {
    clearanceLevel: number;
    voltPoints: number;
  }) => Promise<any>;
}

export default function ClearanceUpgrade({
  initialProducts,
  clearanceLevel,
  voltPoints,
  updateSession,
}: ClearanceUpgradeProps) {
  const router = useRouter();
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpgrade(targetLevel: number) {
    setError("");
    setUpgrading(true);
    try {
      const result = await upgradeClearance(targetLevel);
      if (result.success) {
        await updateSession({
          clearanceLevel: result.newClearanceLevel,
          voltPoints: result.remainingPoints,
        });
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upgrade failed.");
    } finally {
      setUpgrading(false);
    }
  }

  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Blurred product teaser */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {initialProducts.length > 0
            ? initialProducts.map((item) => (
                <div
                  key={item.id}
                  className="relative aspect-[4/5] bg-[#0a0a0a] border border-cyber-red/20 overflow-hidden group"
                >
                  <Image
                    src={item.imageUrl}
                    alt="Classified"
                    fill
                    sizes="(max-width: 768px) 100vw, 20vw"
                    className="object-cover opacity-15 blur-sm grayscale"
                  />
                  <div className="absolute inset-0 bg-cyber-red/5 backdrop-blur-[12px]" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <div className="bg-black/70 border border-cyber-red/30 p-6 flex flex-col items-center">
                      <LockKeyhole size={32} className="text-cyber-red mb-3" />
                      <span className="font-display font-bold text-base uppercase tracking-widest text-cyber-red mb-1">
                        Classified
                      </span>
                      <span className="font-mono text-[10px] uppercase text-foreground/40">
                        Requires Tier 3
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/90 border-t border-cyber-red/10 z-10">
                    <div className="font-mono text-xs text-foreground/20 uppercase tracking-wider blur-[3px] select-none">
                      XXXX_REDACTED_XXXX
                    </div>
                    <div className="font-mono text-sm text-cyber-red/40 mt-1">
                      ERR_PRICE
                    </div>
                  </div>
                </div>
              ))
            : [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="relative aspect-[4/5] bg-[#0a0a0a] border border-cyber-red/15 overflow-hidden"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <LockKeyhole size={40} className="text-cyber-red/50 mb-4" />
                    <span className="font-mono text-xs uppercase tracking-widest text-cyber-red/40">
                      Classified
                    </span>
                  </div>
                </div>
              ))}
        </div>

        {/* Clearance upgrade section */}
        <div className="border border-cyber-red/20 bg-black/40 backdrop-blur-sm p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="font-display font-black text-3xl md:text-4xl uppercase tracking-tighter text-cyber-red mb-3">
              Upgrade Clearance
            </h2>
            <p className="font-mono text-sm text-foreground/50 max-w-lg mx-auto">
              Spend your Volt Points to escalate your operative clearance. Tier
              3 unlocks full Black Site access.
            </p>
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 text-cyber-red text-xs font-mono bg-cyber-red/10 border border-cyber-red/20 px-4 py-3 mb-8 max-w-md mx-auto">
              <ShieldAlert size={14} />
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            {TIERS.map((tier) => {
              const isCurrentTier = clearanceLevel === tier.level;
              const isUnlocked = clearanceLevel >= tier.level;
              const isNextTier = tier.level === clearanceLevel + 1;
              const canAfford = voltPoints >= tier.cost;

              return (
                <motion.div
                  key={tier.level}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: tier.level * 0.1 }}
                  className={`border p-6 flex flex-col ${
                    isCurrentTier
                      ? "border-volt/50 bg-volt/5"
                      : isUnlocked
                      ? "border-white/10 bg-white/3"
                      : isNextTier
                      ? "border-cyber-red/40 bg-cyber-red/5"
                      : "border-white/5 bg-white/2 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
                      Tier {tier.level}
                    </span>
                    {isCurrentTier && (
                      <span className="font-mono text-[10px] uppercase tracking-widest text-volt bg-volt/10 px-2 py-0.5 border border-volt/20">
                        Current
                      </span>
                    )}
                    {isUnlocked && !isCurrentTier && (
                      <ShieldCheck size={14} className="text-volt/60" />
                    )}
                  </div>

                  <h3 className="font-display font-bold text-xl uppercase tracking-tight mb-1">
                    {tier.name}
                  </h3>
                  <p className="font-mono text-xs text-foreground/40 mb-4">
                    {tier.description}
                  </p>

                  <ul className="flex-1 space-y-2 mb-6">
                    {tier.perks.map((perk) => (
                      <li
                        key={perk}
                        className="font-mono text-xs text-foreground/60 flex items-start gap-2"
                      >
                        <Zap size={10} className="text-volt mt-0.5 shrink-0" />
                        {perk}
                      </li>
                    ))}
                  </ul>

                  {tier.cost > 0 && !isUnlocked && (
                    <div className="mt-auto">
                      <div className="font-mono text-xs text-foreground/40 mb-2 flex items-center gap-1">
                        <Zap size={10} className="text-volt" />
                        {tier.cost.toLocaleString()} Volt Points
                        {!canAfford && (
                          <span className="text-cyber-red/60 ml-1">
                            (need {(tier.cost - voltPoints).toLocaleString()}{" "}
                            more)
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleUpgrade(tier.level)}
                        disabled={!isNextTier || !canAfford || upgrading}
                        className={`w-full font-mono font-bold text-xs uppercase py-3 tracking-widest transition-colors ${
                          isNextTier && canAfford
                            ? "bg-cyber-red text-white hover:bg-white hover:text-cyber-red"
                            : "bg-white/5 text-foreground/20 cursor-not-allowed"
                        }`}
                      >
                        {upgrading
                          ? "Processing..."
                          : isNextTier && canAfford
                          ? "Upgrade Now"
                          : !isNextTier
                          ? `Unlock Tier ${tier.level - 1} First`
                          : "Insufficient Points"}
                      </button>
                    </div>
                  )}

                  {isUnlocked && tier.cost > 0 && (
                    <div className="mt-auto font-mono text-xs text-volt/60 uppercase tracking-widest text-center py-3 border border-volt/10 bg-volt/5">
                      Unlocked
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
