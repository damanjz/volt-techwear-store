"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import DesktopNav from "./navbar/DesktopNav";
const CartDrawer = dynamic(() => import("./cart/CartDrawer"), { ssr: false });
const MobileMenu = dynamic(() => import("./navbar/MobileMenu"), { ssr: false });

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Merch", href: "/merch" },
  { label: "Black Site", href: "/black-site", classified: true },
] as const;

export default function Navbar() {
  const { toggleCart, getCartCount, theme, toggleTheme } = useStore();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isLoggedIn = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";
  const voltPoints = session?.user?.voltPoints;

  useEffect(() => {
    setMounted(true);
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

  const handleCloseMobileMenu = () => setIsMobileMenuOpen(false);

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

          <DesktopNav
            navLinks={navLinks}
            mounted={mounted}
            isAdmin={isAdmin}
            isLoggedIn={isLoggedIn}
            theme={theme}
            cartCount={mounted ? getCartCount() : 0}
            voltPoints={voltPoints}
            toggleTheme={toggleTheme}
            toggleCart={toggleCart}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          />
        </div>
      </nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={handleCloseMobileMenu}
        mounted={mounted}
        isAdmin={isAdmin}
        voltPoints={voltPoints}
      />

      <CartDrawer />
    </>
  );
}
