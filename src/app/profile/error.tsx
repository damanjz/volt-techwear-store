"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("VOLT SYSTEM FAILURE [PROFILE]:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center z-50">
      <AlertTriangle size={48} className="text-cyber-red mb-6" />
      <h1 className="font-display font-black text-4xl uppercase tracking-tighter text-glow-cyber-red mb-4">
        SYSTEM_PANIC_ENCOUNTERED
      </h1>
      <p className="font-mono text-sm text-foreground/70 mb-8 max-w-md">
        An unexpected runtime exception has destabilized the current layout node. 
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 border border-cyber-red/30 bg-cyber-red/10 text-cyber-red font-mono font-bold text-xs uppercase px-6 py-3 tracking-widest hover:bg-cyber-red hover:text-white transition-colors"
      >
        <RefreshCcw size={14} /> [REBOOT_NODE]
      </button>
    </div>
  );
}
