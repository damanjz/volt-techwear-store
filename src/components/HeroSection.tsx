"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";

export default function HeroSection() {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Dynamic Background Noise Overlay */}
      <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        <div className="inline-block bg-volt text-background px-3 py-1 font-mono text-sm font-bold uppercase tracking-widest mb-6">
          {"// Drop 02: Neon District Now Live"}
        </div>
        
        <h1 className="font-display font-black text-6xl md:text-8xl lg:text-9xl uppercase tracking-tighter leading-[0.9] text-glow-volt mb-6">
          Defy Limits<span className="text-volt">.</span>
        </h1>
        
        <p className="font-sans text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          High-performance tactical apparel built for the urban grid. Engineered materials meet cyberpunk aesthetics.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
          <Link 
            href="/shop"
            className="flex items-center justify-center gap-2 bg-foreground text-background font-mono font-bold uppercase tracking-widest px-8 py-4 hover:bg-volt hover:text-background transition-all"
          >
            Shop the Drop <ArrowRight size={18} />
          </Link>
          <Link
            href={isLoggedIn ? "/profile" : "/membership"}
            className="flex items-center justify-center gap-2 border border-foreground/20 bg-background/50 backdrop-blur-sm text-foreground font-mono font-bold uppercase tracking-widest px-8 py-4 hover:border-volt hover:text-volt transition-all"
          >
            {isLoggedIn ? "My Profile" : "Join The Syndicate"}
          </Link>
        </div>
      </div>
    </section>
  );
}
