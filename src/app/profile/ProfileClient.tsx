"use client";

import Navbar from "@/components/Navbar";
import { ShieldAlert, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import ProfileHeader from "./components/ProfileHeader";
import OrderHistory from "./components/OrderHistory";

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

          <ProfileHeader
            name={session?.user?.name || "Operative_094"}
            clearanceLevel={clearanceLevel}
            voltPoints={voltPoints}
          />

          <div className="w-full md:w-2/3 flex flex-col gap-8">
            <div className="bg-background/40 backdrop-blur-sm border border-white/10 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Award className="text-volt" />
                <h3 className="font-display font-bold text-xl uppercase tracking-widest">Syndicate Ranking</h3>
              </div>

              <div className="mb-2 flex justify-between font-mono text-xs text-foreground/60">
                <span>Current: Level {clearanceLevel}</span>
                <span>Next: Level {clearanceLevel < 3 ? clearanceLevel + 1 : "MAX"} ({nextTierPoints} PTS)</span>
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

            <OrderHistory orders={initialOrders} />
          </div>

        </div>
      </div>
    </main>
  );
}
