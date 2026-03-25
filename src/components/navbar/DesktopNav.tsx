"use client";

import Link from "next/link";
import {
  ShoppingCart,
  User,
  Sun,
  Moon,
  Shield,
  Menu,
} from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  classified?: boolean;
}

interface DesktopNavProps {
  navLinks: readonly NavLink[];
  mounted: boolean;
  isAdmin: boolean;
  isLoggedIn: boolean;
  theme: string;
  cartCount: number;
  toggleTheme: () => void;
  toggleCart: () => void;
  onOpenMobileMenu: () => void;
}

export default function DesktopNav({
  navLinks,
  mounted,
  isAdmin,
  isLoggedIn,
  theme,
  cartCount,
  toggleTheme,
  toggleCart,
  onOpenMobileMenu,
}: DesktopNavProps) {
  return (
    <>
      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-8 font-mono text-sm uppercase tracking-widest text-foreground/80">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              link.classified
                ? "hover:text-cyber-red transition-colors flex items-center gap-1.5 text-cyber-red/70"
                : "hover:text-volt transition-colors"
            }
          >
            {link.classified && (
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
          {mounted && cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-volt text-background text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
              {cartCount}
            </span>
          )}
        </button>
        <button
          className="md:hidden hover:text-volt transition-colors"
          aria-label="Menu"
          onClick={onOpenMobileMenu}
        >
          <Menu size={24} />
        </button>
      </div>
    </>
  );
}
