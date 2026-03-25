"use client";

import { User, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface ProfileHeaderProps {
  readonly name: string;
  readonly clearanceLevel: number;
  readonly voltPoints: number;
}

export default function ProfileHeader({ name, clearanceLevel, voltPoints }: ProfileHeaderProps) {
  return (
    <div className="w-full md:w-1/3 bg-[#111]/80 backdrop-blur-md border border-white/10 p-6 flex flex-col items-center text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <User size={120} />
      </div>

      <div className="w-24 h-24 rounded-full bg-white/5 border border-volt/30 flex items-center justify-center mb-6 relative z-10">
        <User size={40} className="text-volt" />
      </div>

      <h2 className="font-display font-bold text-2xl uppercase tracking-wider mb-1 relative z-10">
        {name}
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
  );
}
