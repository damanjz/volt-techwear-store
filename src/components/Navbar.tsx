import Link from "next/link";
import { ShoppingCart, User, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 top-0 border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-display font-black text-2xl tracking-tighter text-glow-volt uppercase">
          VOLT<span className="text-volt">.</span>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 font-mono text-sm uppercase tracking-widest text-foreground/80">
          <Link href="/shop" className="hover:text-volt transition-colors">Shop</Link>
          <Link href="/merch" className="hover:text-volt transition-colors">Merch</Link>
          <Link href="/membership" className="hover:text-cyber-red transition-colors flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-red animate-pulse"></span>
            Member App
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6 text-foreground">
          <button className="hover:text-volt transition-colors" aria-label="Profile">
            <User size={20} />
          </button>
          <button className="hover:text-volt transition-colors relative" aria-label="Cart">
            <ShoppingCart size={20} />
            <span className="absolute -top-2 -right-2 bg-volt text-background text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
              0
            </span>
          </button>
          <button className="md:hidden hover:text-volt transition-colors" aria-label="Menu">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}
