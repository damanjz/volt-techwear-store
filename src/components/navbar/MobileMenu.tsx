"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  mounted: boolean;
  isAdmin: boolean;
  voltPoints?: number;
}

const mobileLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Merch", href: "/merch" },
  { label: "Membership", href: "/membership" },
  { label: "Black Site", href: "/black-site" },
  { label: "Profile", href: "/profile" },
];

export default function MobileMenu({
  isOpen,
  onClose,
  mounted,
  isAdmin,
  voltPoints,
}: MobileMenuProps) {
  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        onClose();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [onClose]);

  const links = [
    ...mobileLinks,
    ...(mounted && isAdmin
      ? [{ label: "Admin Panel", href: "/admin" }]
      : []),
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 right-0 w-full max-w-sm h-full bg-background border-l border-foreground/10 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-foreground/10">
              <span className="font-display font-black text-xl uppercase tracking-tighter">
                VOLT<span className="text-volt">.</span>
              </span>
              <div className="flex items-center gap-4">
                {mounted && voltPoints !== undefined && (
                  <span className="font-mono text-xs text-volt tracking-widest bg-volt/10 px-2 py-1 rounded">
                    {voltPoints} VP
                  </span>
                )}
                <button
                  onClick={onClose}
                  className="text-foreground/50 hover:text-cyber-red transition-colors p-2"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Links */}
            <div className="flex-1 flex flex-col justify-center px-8 gap-2">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="block py-4 font-display font-bold text-3xl uppercase tracking-tight text-foreground/80 hover:text-volt transition-colors border-b border-foreground/5"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-foreground/10">
              <div className="font-mono text-[10px] text-foreground/30 uppercase tracking-widest text-center">
                VOLT System // Secure Channel
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
