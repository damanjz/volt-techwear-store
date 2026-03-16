"use client";

import Navbar from "@/components/Navbar";
import { User, ShieldAlert, Award, LogOut, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession, signOut, signIn } from "next-auth/react";

interface ProfileClientProps {
  initialOrders: any[];
}

export default function ProfileClient({ initialOrders }: ProfileClientProps) {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  const isLoggedIn = status === "authenticated";
  const voltPoints = session?.user?.voltPoints || 0;
  const clearanceLevel = session?.user?.clearanceLevel || 1;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen pt-24 bg-transparent">
        <Navbar />
        <div className="max-w-md mx-auto px-6 py-24 relative z-10 flex flex-col justify-center text-center">
          <ShieldAlert size={48} className="text-cyber-red mx-auto mb-6 opacity-80" />
          <h1 className="font-display font-black text-3xl uppercase tracking-tighter mb-4 text-glow-cyber-red">
            Unauthenticated Entity
          </h1>
          <p className="font-mono text-sm text-foreground/60 mb-8">
            You must initialize a secure session to access Syndicate records and deployment clearances.
          </p>
          <button 
            onClick={() => signIn("credentials", { callbackUrl: "/profile" })}
            className="w-full bg-volt text-background font-mono font-bold uppercase tracking-widest py-4 hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all"
          >
            Initialize Session
          </button>
        </div>
      </main>
    );
  }

  const nextTierPoints = clearanceLevel === 1 ? 500 : clearanceLevel === 2 ? 2000 : 5000;
  const progressPercent = Math.min(100, Math.max(0, (voltPoints / nextTierPoints) * 100));

  return (
    <main className="min-h-screen pt-24 bg-transparent">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          <div className="w-full md:w-1/3 bg-[#111]/80 backdrop-blur-md border border-white/10 p-6 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <User size={120} />
            </div>
            
            <div className="w-24 h-24 rounded-full bg-white/5 border border-volt/30 flex items-center justify-center mb-6 relative z-10">
              <User size={40} className="text-volt" />
            </div>
            
            <h2 className="font-display font-bold text-2xl uppercase tracking-wider mb-1 relative z-10">
              {session?.user?.name || "Operative_094"}
            </h2>
            <div className="font-mono text-[10px] text-foreground/50 uppercase tracking-widest mb-8 relative z-10">
              Status: Active // Since 2026
            </div>

            <div className="w-full space-y-4 mb-8 relative z-10">
              <div className="bg-black/50 border border-white/5 p-4 flex justify-between items-center">
                <span className="font-mono text-xs uppercase text-foreground/60">Clearance Lvl</span>
                <span className="font-heading font-black text-xl text-volt">{clearanceLevel}</span>
              </div>
              <div className="bg-black/50 border border-white/5 p-4 flex justify-between items-center">
                <span className="font-mono text-xs uppercase text-foreground/60">Volt Points</span>
                <span className="font-heading font-black text-xl text-cyber-red">{voltPoints}</span>
              </div>
            </div>

            <button 
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-2 font-mono text-sm border border-cyber-red/30 text-cyber-red py-3 hover:bg-cyber-red hover:text-white transition-all relative z-10"
            >
              <LogOut size={16} /> Terminate Session
            </button>
          </div>

          <div className="w-full md:w-2/3 flex flex-col gap-8">
            <div className="bg-background/40 backdrop-blur-sm border border-white/10 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Award className="text-volt" />
                <h3 className="font-display font-bold text-xl uppercase tracking-widest">Syndicate Ranking</h3>
              </div>

              <div className="mb-2 flex justify-between font-mono text-xs text-foreground/60">
                <span>Current: Level {clearanceLevel}</span>
                <span>Next: Level {clearanceLevel < 3 ? clearanceLevel + 1 : 'MAX'} ({nextTierPoints} PTS)</span>
              </div>
              <div className="w-full h-2 bg-black border border-white/10 overflow-hidden mb-6">
                <div 
                  className="h-full bg-volt transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="font-mono text-sm text-foreground/60">
                Accumulate VOLT points through acquisitions to unlock classified gear vaults and early-access drop frequencies.
              </p>
            </div>

            <div className="bg-background/40 backdrop-blur-sm border border-white/10 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Package className="text-foreground/80" />
                <h3 className="font-display font-bold text-xl uppercase tracking-widest">Acquisition Log</h3>
              </div>
              
              <div className="space-y-4">
                {initialOrders.length === 0 ? (
                  <p className="font-mono text-xs text-foreground/40 italic">No historical data found for this operative.</p>
                ) : (
                  initialOrders.map((order) => (
                    <div key={order.id} className="border border-white/5 bg-black/50 p-4 flex justify-between items-center">
                      <div>
                        <div className="font-mono text-[10px] text-volt mb-1">REQ_ID: #{order.id.slice(-8).toUpperCase()}</div>
                        <div className="font-sans font-medium">
                          {order.items.map((i: any) => i.name).join(", ")}
                        </div>
                        <div className="font-mono text-xs text-foreground/50 mt-1">
                          Status: {order.status} // {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="font-mono font-bold">${order.total.toFixed(2)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
