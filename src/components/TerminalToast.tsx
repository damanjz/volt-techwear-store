"use client";

import { create } from "zustand";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "alert" | "system";
}

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type?: "success" | "alert" | "system") => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = "system") => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export default function TerminalToasts() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto w-80 bg-black/90 backdrop-blur-md border flex flex-col p-4 shadow-2xl relative overflow-hidden ${
              toast.type === "success" ? "border-volt/50" : toast.type === "alert" ? "border-cyber-red/50" : "border-white/20"
            }`}
          >
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>

            <div className="flex justify-between items-start mb-2 relative z-10">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-foreground/50">
                <Terminal size={12} />
                <span>Transmission_Intercept</span>
              </div>
              <button 
                onClick={() => removeToast(toast.id)}
                className="text-foreground/30 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className={`font-mono text-sm uppercase relative z-10 ${
              toast.type === "success" ? "text-volt" : toast.type === "alert" ? "text-cyber-red" : "text-white"
            }`}>
               {toast.message}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
