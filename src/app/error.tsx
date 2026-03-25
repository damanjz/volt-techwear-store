"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="min-h-screen pt-24 bg-transparent">
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-24 relative z-10 text-center">
        <div className="font-mono text-xs text-cyber-red uppercase tracking-widest mb-4 animate-pulse">
          {"// SYSTEM_FAULT_DETECTED"}
        </div>
        <h1 className="font-display font-black text-5xl uppercase tracking-tighter mb-6 text-cyber-red">
          ERROR
        </h1>
        <p className="font-sans text-foreground/60 mb-8">
          An unexpected error occurred. Our operatives have been notified.
        </p>
        <button
          onClick={reset}
          className="bg-foreground text-background font-mono font-bold uppercase tracking-widest px-8 py-4 hover:bg-volt hover:text-background transition-colors"
        >
          Retry Operation
        </button>
      </div>
    </main>
  );
}
