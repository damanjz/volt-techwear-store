import Navbar from "@/components/Navbar";
import { Lock, Zap, Shield, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function Membership() {
  return (
    <main className="min-h-screen pt-20 bg-[#080808] text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden flex justify-center items-center flex-col text-center min-h-[50vh]">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-cyber-red/10 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-96 bg-cyber-red/5 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-3xl border border-cyber-red/30 bg-black/50 backdrop-blur-md p-8 md:p-12">
          <div className="mx-auto w-16 h-16 flex items-center justify-center border-2 border-cyber-red text-cyber-red mb-6 animate-pulse">
             <Shield size={32} />
          </div>
          <h1 className="font-display font-black text-4xl md:text-6xl tracking-tighter uppercase mb-4 text-glow-red">
            The Syndicate
          </h1>
          <p className="font-sans text-lg text-foreground/70 mb-8">
            Access restricted drops, earn encrypted points on every transaction, and unlock tiers of exclusivity.
          </p>

          {/* Login/Join Form Mockup */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-cyber-red text-white font-mono font-bold uppercase tracking-widest hover:bg-white hover:text-cyber-red transition-all">
              Initialize Account
            </button>
            <button className="px-8 py-4 border border-white/20 font-mono font-bold uppercase tracking-widest hover:border-volt hover:text-volt transition-all">
              Login // Authenticate
            </button>
          </div>
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
