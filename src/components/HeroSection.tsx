"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background Graphic elements */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-volt/30 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyber-red/20 blur-[120px] rounded-full"></div>
        {/* Tech Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6 inline-block border border-volt/50 bg-volt/10 text-volt px-4 py-1.5 text-xs font-mono tracking-widest uppercase"
        >
          System Update: Phase 01 // Drop 04
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="font-display font-black text-6xl md:text-8xl lg:text-9xl tracking-tighter uppercase leading-none mb-6"
        >
          Defy <span className="text-transparent bg-clip-text bg-gradient-to-r from-volt to-white">Limits</span>.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="font-sans text-lg md:text-xl text-foreground/70 max-w-2xl mb-10"
        >
          High-performance techwear engineered for the modern dystopian landscape. Seamless utility meets uncompromising aesthetics.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-6"
        >
          <Link 
            href="/shop" 
            className="group relative px-8 py-4 bg-foreground text-background font-mono font-bold uppercase tracking-widest overflow-hidden"
          >
            <span className="relative z-10 transition-colors group-hover:text-background">Shop the Drop</span>
            <div className="absolute inset-0 bg-volt transform scale-x-0 origin-left transition-transform group-hover:scale-x-100 z-0"></div>
          </Link>
          <Link 
            href="/membership" 
            className="group relative px-8 py-4 border border-white/20 text-foreground font-mono font-bold uppercase tracking-widest hover:border-cyber-red transition-colors"
          >
            <span className="group-hover:text-cyber-red transition-colors">Join The Syndicate</span>
          </Link>
        </motion.div>
      </div>
      
      {/* Decorative HUD Elements */}
      <div className="absolute bottom-6 left-6 font-mono text-[10px] text-white/30 hidden md:block">
        SYS.REQ // HIGH_IMPACT<br/>
        LAT: 47.6062° N<br/>
        LONG: 122.3321° W
      </div>
    </section>
  );
}
