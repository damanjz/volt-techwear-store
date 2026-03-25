import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent">
      <Navbar />
      <HeroSection />

      {/* New Arrivals Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 bg-background/30 backdrop-blur-md p-6 rounded-2xl border border-white/5">
          <div>
            <h2 className="font-display font-black text-4xl md:text-5xl uppercase tracking-tighter mb-2">
              New Arrivals
            </h2>
            <p className="font-mono text-foreground/50 text-sm uppercase tracking-widest">
              Latest Hardware Drops
            </p>
          </div>
          <Link href="/shop" className="mt-4 md:mt-0 font-mono text-xs uppercase tracking-widest border-b border-volt text-volt hover:text-background hover:bg-volt px-2 py-1 transition-all">
            View Archive
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mock Products injected here via ProductCard component mapping */}
          <ProductCard 
            id="tx-01"
            name="Aegis Utility Jacket // V2" 
            price={345.00} 
            category="Outerwear" 
            imageUrl="/products/tx-01.png"
            isNew={true}
          />
          <ProductCard 
            id="px-04"
            name="Carbon Parachute Cargo" 
            price={185.00} 
            category="Bottoms" 
            imageUrl="/products/px-04.png"
            isNew={true}
          />
          <ProductCard 
            id="hx-02"
            name="Volt Schematic Hoodie" 
            price={120.00} 
            category="Tops" 
            imageUrl="/products/hx-02.png"
          />
        </div>
      </section>

      {/* Membership Teaser */}
      <section className="py-24 border-t border-white/5 bg-cyber-red/5 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Shield size={48} className="mx-auto text-cyber-red mb-6" />
          <h2 className="font-display font-black text-5xl uppercase tracking-tighter mb-6 text-glow-cyber-red">
            Enter The Syndicate
          </h2>
          <p className="font-sans text-xl text-foreground/80 mb-10 max-w-2xl mx-auto">
            Authorized operatives gain access to encrypted drops, accumulated Volt Points, and the restricted Black Site Vault. 
          </p>
          <Link href="/membership" className="inline-flex items-center gap-2 bg-cyber-red text-white font-mono font-bold uppercase tracking-widest px-8 py-4 hover:bg-background hover:text-cyber-red hover:border hover:border-cyber-red transition-all">
            Request Clearance <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
