"use client";

import Navbar from "@/components/Navbar";
import { ShieldAlert, LockKeyhole } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const BLACK_SITE_DB = [
  {
    id: "bs-01",
    name: "0x_NIGHTFALL_RIG",
    price: 850.0,
    category: "EXO-WEAR",
    imageUrl: "https://images.unsplash.com/photo-1616885230919-b223049bb4aa?q=80&w=800&auto=format&fit=crop",
    reqClearance: 2,
  },
  {
    id: "bs-02",
    name: "PHANTOM_OPTICS_V4",
    price: 420.0,
    category: "HARDWARE",
    imageUrl: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=800&auto=format&fit=crop",
    reqClearance: 3,
  },
  {
    id: "bs-03",
    name: "SYNTH_LEATHER_TRENCH",
    price: 1200.0,
    category: "ARCHIVE",
    imageUrl: "https://images.unsplash.com/photo-1520975954732-57dd22299614?q=80&w=800&auto=format&fit=crop",
    reqClearance: 3,
  }
];

export default function BlackSite() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  const isLoggedIn = status === "authenticated";
  const clearanceLevel = session?.user?.clearanceLevel || 1;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen pt-24 bg-transparent flex flex-col items-center justify-center text-center px-6">
        <Navbar />
        <ShieldAlert size={64} className="text-cyber-red mx-auto mb-6 opacity-80 animate-pulse" />
        <h1 className="font-display font-black text-4xl uppercase tracking-tighter mb-4 text-glow-cyber-red">
          ACCESS DENIED
        </h1>
        <p className="font-mono text-foreground/60 mb-8 max-w-md">
          The Black Site is restricted to initialized operatives. Authenticate your session to proceed.
        </p>
        <Link href="/membership" className="bg-cyber-red text-white font-mono font-bold uppercase py-3 px-8 tracking-widest hover:bg-white hover:text-cyber-red transition-colors">
          Return to Entry Node
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 bg-transparent relative z-10 text-foreground">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-cyber-red/20 pb-8 bg-black/40 backdrop-blur-md p-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyber-red/20 text-cyber-red text-[10px] font-mono uppercase tracking-widest mb-4 border border-cyber-red/30">
              <span className="w-1.5 h-1.5 bg-cyber-red rounded-full animate-pulse"></span>
              Encrypted Server Endpoint // Tier {clearanceLevel} Access
            </div>
            <h1 className="font-display font-black text-5xl md:text-7xl uppercase tracking-tighter mb-2 text-cyber-red">
              Black Site Vault<span className="text-white">.</span>
            </h1>
            <p className="font-mono text-foreground/60 text-sm uppercase tracking-widest">
              Unsanctioned Prototypes & 1-of-1 Hardware
            </p>
          </div>
          
          <div className="mt-8 md:mt-0 text-right">
             <div className="font-mono text-xs text-foreground/50 uppercase tracking-widest mb-1">Your Clearance</div>
             <div className="font-display font-bold text-3xl text-volt">LEVEL {clearanceLevel}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLACK_SITE_DB.map((item) => {
            const isLocked = clearanceLevel < item.reqClearance;

            return (
              <div 
                key={item.id} 
                className={`group relative flex flex-col bg-[#0a0a0a] border overflow-hidden transition-all duration-500 ${
                  isLocked ? "border-cyber-red/20" : "border-volt/30 hover:border-volt/80 shadow-[0_0_20px_rgba(212,255,51,0.05)] hover:shadow-[0_0_30px_rgba(212,255,51,0.15)]"
                }`}
              >
                {/* Image Area */}
                <div className="relative aspect-[4/5] bg-black overflow-hidden flex items-center justify-center">
                  {isLocked ? (
                    // Locked State
                    <>
                      <div className="absolute inset-0 bg-cyber-red/5 z-20 backdrop-blur-[20px] pointer-events-none"></div>
                      <Image 
                        src={item.imageUrl} 
                        alt="Classified" 
                        fill 
                        className="object-cover opacity-20 filter grayscale"
                      />
                      <div className="relative z-30 flex flex-col items-center justify-center bg-black/80 border border-cyber-red/30 p-6">
                        <LockKeyhole size={32} className="text-cyber-red mb-4" />
                        <span className="font-display font-bold text-xl uppercase tracking-widest text-cyber-red mb-2">Classified Asset</span>
                        <span className="font-mono text-xs uppercase text-foreground/50 text-center">
                          Requires Lvl {item.reqClearance} Clearance
                        </span>
                      </div>
                    </>
                  ) : (
                    // Unlocked State
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      <Image 
                        src={item.imageUrl} 
                        alt={item.name} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      <button 
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 z-20 font-mono font-bold text-xs uppercase px-8 py-4 bg-volt text-background tracking-widest transition-all shadow-[0_0_15px_rgba(212,255,51,0.4)] whitespace-nowrap hover:bg-[#b0d925]"
                        onClick={() => alert("Acquiring Classified Asset...")}
                      >
                         Secure Asset
                      </button>
                    </>
                  )}
                  
                  {/* Decorative Scanline */}
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none z-30 opacity-30"></div>
                </div>

                {/* Info Area */}
                <div className="p-6 relative z-10 bg-[#0a0a0a]">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest bg-white/5 px-2 py-1">
                      {isLocked ? "DATA_CORRUPTED" : item.category}
                    </div>
                    <div className={`font-mono font-bold text-sm ${isLocked ? 'text-cyber-red/50' : 'text-volt'}`}>
                      {isLocked ? "ERR_PRICE" : `$${item.price.toFixed(2)}`}
                    </div>
                  </div>
                  <h3 className={`font-mono font-medium text-lg uppercase tracking-wider ${isLocked ? 'text-foreground/30 blur-[2px] select-none' : 'text-foreground'}`}>
                    {isLocked ? "XXXXXXXXXXXXXXXXX" : item.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
