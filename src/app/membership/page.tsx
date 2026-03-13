"use client";

import Navbar from "@/components/Navbar";
import { Lock, Shield, Zap, CircleDashed } from "lucide-react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Membership() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = status === "authenticated";

  return (
    <main className="min-h-screen pt-20 bg-transparent text-foreground relative z-10">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-32 px-6 flex flex-col items-center text-center overflow-hidden border-b border-cyber-red/20">
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-red/10 to-transparent pointer-events-none z-0"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyber-red/10 border border-cyber-red/30 text-cyber-red text-[10px] font-mono uppercase tracking-widest mb-8">
            <span className="w-1.5 h-1.5 bg-cyber-red rounded-full animate-pulse"></span>
            Restricted Access
          </div>
          
          <h1 className="font-display font-black text-6xl md:text-8xl uppercase tracking-tighter mb-6 text-glow-cyber-red">
            The Syndicate
          </h1>
          <p className="font-mono text-sm md:text-base text-foreground/70 leading-relaxed max-w-2xl mx-auto mb-12">
            Beyond the surface web lies The Syndicate. Our operative network gains access to heavily classified hardware drops, encrypted member pricing, and accumulated Volt points for deployment clearances.
          </p>
          
          {mounted && !isLoggedIn && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => signIn("credentials", { callbackUrl: "/profile" })}
                className="bg-cyber-red text-white font-mono font-bold text-sm uppercase px-8 py-4 tracking-widest hover:bg-white hover:text-cyber-red transition-colors flex items-center justify-center gap-2"
              >
                <Shield size={16} /> Initialize Account
              </button>
              <button 
                onClick={() => signIn("credentials", { callbackUrl: "/profile" })}
                className="bg-transparent border border-white/20 text-foreground font-mono font-bold text-sm uppercase px-8 py-4 tracking-widest hover:border-cyber-red hover:text-cyber-red transition-colors"
              >
                Operative Login
              </button>
            </div>
          )}

          {mounted && isLoggedIn && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/profile"
                className="bg-volt text-background font-mono font-bold text-sm uppercase px-8 py-4 tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                <Shield size={16} /> Access Profile Dashboard
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Membership Dashboard Teaser */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
         <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="border border-white/10 bg-[#111] p-8 flex flex-col gap-4">
               <Zap className="text-volt" size={32} />
               <h3 className="font-mono font-bold uppercase text-xl">Earn & Burn</h3>
               <p className="font-sans text-sm text-foreground/60">Generate 1 Volt Point for every $1 spent. Redeem points directly on exclusive drops and accessories.</p>
            </div>
            <div className="border border-white/10 bg-[#111] p-8 flex flex-col gap-4">
               <Lock className="text-volt" size={32} />
               <h3 className="font-mono font-bold uppercase text-xl">Secured Drops</h3>
               <p className="font-sans text-sm text-foreground/60">Level 2 clearance members receive 24hr early access to all limited-edition capsule collections.</p>
            </div>
            <div className="border border-white/10 bg-[#111] p-8 flex flex-col gap-4">
               <Shield className="text-cyber-red" size={32} />
               <h3 className="font-mono font-bold uppercase text-xl">Black Site Store</h3>
               <p className="font-sans text-sm text-foreground/60">A hidden storefront accessible only to Tier 3 members. Features 1-of-1 experimental garments.</p>
            </div>
         </div>

         {/* Mock Locked Storefront */}
         <div>
            <div className="flex justify-between items-end border-b border-cyber-red/20 pb-4 mb-8">
              <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tighter text-cyber-red">Black Site // Vault</h2>
              <span className="font-mono text-xs uppercase text-cyber-red px-2 py-1 bg-cyber-red/10 border border-cyber-red/30">Clearance Required</span>
            </div>

            <div className="grid md:grid-cols-3 gap-6 opacity-30 select-none pointer-events-none">
              {/* Locked Product 1 */}
               <div className="bg-[#1a1a1a] border border-white/5 aspect-[4/5] relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop')] bg-cover opacity-20 filter blur-sm"></div>
                  <div className="relative z-10 flex flex-col items-center gap-4 border border-cyber-red/50 bg-black/80 px-8 py-6 backdrop-blur-sm">
                    <Lock className="text-cyber-red" size={32} />
                    <span className="font-mono uppercase text-xs tracking-widest text-cyber-red">Classified Asset</span>
                  </div>
               </div>
              {/* Locked Product 2 */}
              <div className="bg-[#1a1a1a] border border-white/5 aspect-[4/5] relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1520975954732-57dd22299614?q=80&w=800&auto=format&fit=crop')] bg-cover opacity-20 filter blur-sm"></div>
                  <div className="relative z-10 flex flex-col items-center gap-4 border border-cyber-red/50 bg-black/80 px-8 py-6 backdrop-blur-sm">
                    <Lock className="text-cyber-red" size={32} />
                    <span className="font-mono uppercase text-xs tracking-widest text-cyber-red">Classified Asset</span>
                  </div>
               </div>
              {/* Locked Product 3 */}
              <div className="bg-[#1a1a1a] border border-white/5 aspect-[4/5] relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542272201-b1ca555f8505?q=80&w=800&auto=format&fit=crop')] bg-cover opacity-20 filter blur-sm"></div>
                  <div className="relative z-10 flex flex-col items-center gap-4 border border-cyber-red/50 bg-black/80 px-8 py-6 backdrop-blur-sm">
                    <Lock className="text-cyber-red" size={32} />
                    <span className="font-mono uppercase text-xs tracking-widest text-cyber-red">Classified Asset</span>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </main>
  );
}
