"use client";

import Link from "next/link";
import { ShoppingCart, User, Menu, X, Sun, Moon, Shield } from "lucide-react";
import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import CartDrawer from "./cart/CartDrawer";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Merch", href: "/merch" },
  { label: "Black Site", href: "/black-site", classified: true },
];

export default function Navbar() {
  const { toggleCart, getCartCount, theme, toggleTheme } = useStore();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isLoggedIn = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className="fixed w-full z-40 top-0 border-b border-foreground/10 bg-background/80 backdrop-blur-md transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-display font-black text-2xl tracking-tighter text-glow-volt uppercase"
          >
            VOLT<span className="text-volt">.</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 font-mono text-sm uppercase tracking-widest text-foreground/80">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  (link as any).classified
                    ? "hover:text-cyber-red transition-colors flex items-center gap-1.5 text-cyber-red/70"
                    : "hover:text-volt transition-colors"
                }
              >
                {(link as any).classified && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-red animate-pulse" />
                )}
                {link.label}
              </Link>
            ))}
            <Link
              href="/membership"
              className="hover:text-cyber-red transition-colors flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-cyber-red animate-pulse" />
              Member App
            </Link>
            {mounted && isAdmin && (
              <Link
                href="/admin"
                className="hover:text-volt transition-colors flex items-center gap-2 text-volt/70"
              >
                <Shield size={14} />
                Admin
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 text-foreground">
            {mounted && (
              <button
                onClick={toggleTheme}
                className="hover:text-volt transition-colors relative"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            <Link
              href="/profile"
              className={`hover:text-volt transition-colors ${
                mounted && isLoggedIn ? "text-volt" : ""
              }`}
              aria-label="Profile"
            >
              <User size={20} />
            </Link>
            <button
              className="hover:text-volt transition-colors relative"
              aria-label="Cart"
              onClick={toggleCart}
            >
              <ShoppingCart size={20} />
              {mounted && getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-volt text-background text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                  {getCartCount()}
                </span>
              )}
            </button>
            <button
              className="md:hidden hover:text-volt transition-colors"
              aria-label="Menu"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
              onClick={() => setIsMobileMenuOpen(false)}
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
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-foreground/50 hover:text-cyber-red transition-colors p-2"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Links */}
              <div className="flex-1 flex flex-col justify-center px-8 gap-2">
                {[
                  { label: "Shop", href: "/shop" },
                  { label: "Merch", href: "/merch" },
                  { label: "Membership", href: "/membership" },
                  { label: "Black Site", href: "/black-site" },
                  { label: "Profile", href: "/profile" },
                  ...(mounted && isAdmin
                    ? [{ label: "Admin Panel", href: "/admin" }]
                    : []),
                ].map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
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

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
