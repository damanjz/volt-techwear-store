"use client";

import { ShieldAlert, LockKeyhole, ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function BlackSiteTeaser() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Blurred product teaser grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="relative aspect-[4/5] bg-[#0a0a0a] border border-cyber-red/15 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-cyber-red/5 to-black/80" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <LockKeyhole size={40} className="text-cyber-red/60 mb-4" />
                <span className="font-mono text-xs uppercase tracking-widest text-cyber-red/50">
                  Classified
                </span>
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
  );
}
