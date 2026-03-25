"use client";

import { Shield } from "lucide-react";
import Link from "next/link";
import LoginForm from "./LoginForm";

interface MembershipHeroProps {
  readonly isLoggedIn: boolean;
  readonly mounted: boolean;
}

export default function MembershipHero({
  isLoggedIn,
  mounted,
}: MembershipHeroProps) {
  return (
    <section className="relative py-24 md:py-32 px-6 flex flex-col items-center text-center overflow-hidden border-b border-cyber-red/20">
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-red/10 to-transparent pointer-events-none z-0" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyber-red/10 border border-cyber-red/30 text-cyber-red text-[10px] font-mono uppercase tracking-widest mb-8">
          <span className="w-1.5 h-1.5 bg-cyber-red rounded-full animate-pulse" />
          Restricted Access
        </div>

        <h1 className="font-display font-black text-6xl md:text-8xl uppercase tracking-tighter mb-6 text-glow-cyber-red">
          The Syndicate
        </h1>
        <p className="font-mono text-sm md:text-base text-foreground/70 leading-relaxed max-w-2xl mx-auto mb-12">
          Beyond the surface web lies The Syndicate. Our operative network gains
          access to heavily classified hardware drops, encrypted member pricing,
          and accumulated Volt points for deployment clearances.
        </p>

        {mounted && !isLoggedIn && <LoginForm />}

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
  );
}
