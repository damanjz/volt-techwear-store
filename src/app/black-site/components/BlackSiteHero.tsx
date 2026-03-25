"use client";

interface BlackSiteHeroProps {
  isLoggedIn: boolean;
  hasBlackSiteAccess: boolean;
  clearanceLevel: number;
  voltPoints: number;
}

export default function BlackSiteHero({
  isLoggedIn,
  hasBlackSiteAccess,
  clearanceLevel,
  voltPoints,
}: BlackSiteHeroProps) {
  return (
    <section className="relative py-20 md:py-28 px-6 overflow-hidden border-b border-cyber-red/20">
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-red/8 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_3px] pointer-events-none opacity-40" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyber-red/15 border border-cyber-red/30 text-cyber-red text-[10px] font-mono uppercase tracking-widest mb-6">
          <span className="w-1.5 h-1.5 bg-cyber-red rounded-full animate-pulse" />
          Encrypted Endpoint // Restricted
        </div>

        <h1 className="font-display font-black text-5xl md:text-8xl uppercase tracking-tighter mb-4 text-glow-cyber-red">
          Black Site<span className="text-white">.</span>
        </h1>
        <p className="font-mono text-sm text-foreground/50 uppercase tracking-widest max-w-xl mx-auto">
          Unsanctioned prototypes & 1-of-1 experimental hardware.
          {!hasBlackSiteAccess && " Tier 3 clearance required for full access."}
        </p>

        {isLoggedIn && (
          <div className="mt-6 flex items-center justify-center gap-6 font-mono text-xs uppercase tracking-widest">
            <span className="text-foreground/40">
              Clearance:{" "}
              <span className={clearanceLevel >= 3 ? "text-volt" : "text-cyber-red"}>
                {`LVL ${clearanceLevel}`}
              </span>
            </span>
            <span className="text-foreground/20">|</span>
            <span className="text-foreground/40">
              Volt Points: <span className="text-volt">{voltPoints.toLocaleString()}</span>
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
