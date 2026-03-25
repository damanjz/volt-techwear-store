"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldAlert, LockKeyhole, Zap, ShieldCheck, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { upgradeClearance } from "@/lib/actions";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";

interface BlackSiteProps {
  initialProducts: any[];
  clearanceLevel: number;
  voltPoints: number;
  isLoggedIn: boolean;
}

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
    perks: ["24hr early access to drops", "5% member discount", "Priority support", "Exclusive colorways"],
  },
  {
    level: 3,
    name: "Black Site Agent",
    description: "Full vault access",
    cost: 2000,
    perks: ["Black Site Vault access", "1-of-1 experimental gear", "10% member discount", "Private drops channel"],
  },
];

export default function BlackSiteClient({ initialProducts, clearanceLevel: serverClearance, voltPoints: serverPoints, isLoggedIn: serverLoggedIn }: BlackSiteProps) {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState("");
  const addToCart = useStore((s) => s.addToCart);
  const toggleCart = useStore((s) => s.toggleCart);

  const isLoggedIn = status === "authenticated" || serverLoggedIn;
  const clearanceLevel = session?.user?.clearanceLevel ?? serverClearance;
  const voltPoints = session?.user?.voltPoints ?? serverPoints;
  const hasBlackSiteAccess = clearanceLevel >= 3;

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) return null;

  return (
    <main className="min-h-screen pt-20 bg-transparent relative z-10 text-foreground">
      <Navbar />

      {/* Hero — always visible */}
      <section className="relative py-20 md:py-28 px-6 overflow-hidden border-b border-cyber-red/20">
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-red/8 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_3px] pointer-events-none opacity-40" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyber-red/15 border border-cyber-red/30 text-cyber-red text-[10px] font-mono uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 bg-cyber-red rounded-full animate-pulse" />
            Encrypted Endpoint // Restricted
          </div>

          <h1 className="font-display font-black text-5xl md:text-8xl uppercase tracking-tighter mb-4 text-glow-cyber-red">
            Black Site<span className="text-white">.</span>
          </h1>
          <p className="font-mono text-sm text-foreground/50 uppercase tracking-widest max-w-xl mx-auto">
            Unsanctioned prototypes & 1-of-1 experimental hardware.
            {!hasBlackSiteAccess && " Tier 3 clearance required for full access."}
          </p>

          {mounted && isLoggedIn && (
            <div className="mt-6 flex items-center justify-center gap-6 font-mono text-xs uppercase tracking-widest">
              <span className="text-foreground/40">
                Clearance: <span className={clearanceLevel >= 3 ? "text-volt" : "text-cyber-red"}>{`LVL ${clearanceLevel}`}</span>
              </span>
              <span className="text-foreground/20">|</span>
              <span className="text-foreground/40">
                Volt Points: <span className="text-volt">{voltPoints.toLocaleString()}</span>
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Not logged in — teaser */}
      {!isLoggedIn && (
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Blurred product teaser grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative aspect-[4/5] bg-[#0a0a0a] border border-cyber-red/15 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-cyber-red/5 to-black/80" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <LockKeyhole size={40} className="text-cyber-red/60 mb-4" />
                    <span className="font-mono text-xs uppercase tracking-widest text-cyber-red/50">Classified</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/80 border-t border-cyber-red/10">
                    <div className="h-3 bg-white/5 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center">
              <ShieldAlert size={48} className="text-cyber-red mx-auto mb-4 opacity-70" />
              <h2 className="font-display font-black text-3xl uppercase tracking-tighter mb-3 text-cyber-red">
                Authentication Required
              </h2>
              <p className="font-mono text-sm text-foreground/50 mb-8 max-w-md mx-auto">
                Initialize your operative account to begin clearance progression and unlock the vault.
              </p>
              <Link
                href="/membership"
                className="inline-flex items-center gap-2 bg-cyber-red text-white font-mono font-bold text-sm uppercase px-8 py-4 tracking-widest hover:bg-white hover:text-cyber-red transition-colors"
              >
                <ShieldCheck size={16} />
                Join The Syndicate
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Logged in but no access — upgrade path */}
      {isLoggedIn && !hasBlackSiteAccess && (
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            {/* Blurred product teaser */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {initialProducts.length > 0
                ? initialProducts.map((item) => (
                    <div key={item.id} className="relative aspect-[4/5] bg-[#0a0a0a] border border-cyber-red/20 overflow-hidden group">
                      <Image
                        src={item.imageUrl}
                        alt="Classified"
                        fill
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
                        <div className="font-mono text-sm text-cyber-red/40 mt-1">ERR_PRICE</div>
                      </div>
                    </div>
                  ))
                : [1, 2, 3].map((i) => (
                    <div key={i} className="relative aspect-[4/5] bg-[#0a0a0a] border border-cyber-red/15 overflow-hidden">
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <LockKeyhole size={40} className="text-cyber-red/50 mb-4" />
                        <span className="font-mono text-xs uppercase tracking-widest text-cyber-red/40">Classified</span>
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
                  Spend your Volt Points to escalate your operative clearance. Tier 3 unlocks full Black Site access.
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
                          <li key={perk} className="font-mono text-xs text-foreground/60 flex items-start gap-2">
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
                                (need {(tier.cost - voltPoints).toLocaleString()} more)
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
                            {upgrading ? "Processing..." : isNextTier && canAfford ? "Upgrade Now" : !isNextTier ? `Unlock Tier ${tier.level - 1} First` : "Insufficient Points"}
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
      )}

      {/* Full access — show products */}
      {isLoggedIn && hasBlackSiteAccess && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-volt/20 pb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-volt/10 text-volt text-[10px] font-mono uppercase tracking-widest mb-4 border border-volt/30">
                <ShieldCheck size={12} />
                Full Access Granted
              </div>
              <p className="font-mono text-foreground/50 text-sm uppercase tracking-widest">
                {initialProducts.length} classified asset{initialProducts.length !== 1 ? "s" : ""} available
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initialProducts.map((item) => (
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
      )}

      <Footer />
    </main>
  );
}
