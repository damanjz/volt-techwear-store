import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";

// Mock Data
const newArrivals = [
  {
    id: "tx-01",
    name: "Aegis Utility Jacket // V2",
    price: 345.0,
    category: "Outerwear",
    imageUrl: "https://images.unsplash.com/photo-1550614000-4b95d4ebf5b4?q=80&w=800&auto=format&fit=crop",
    isNew: true
  },
  {
    id: "px-04",
    name: "Carbon Parachute Cargo",
    price: 185.0,
    category: "Bottoms",
    imageUrl: "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?q=80&w=800&auto=format&fit=crop",
    isNew: true
  },
  {
    id: "hx-02",
    name: "Volt Schematic Hoodie",
    price: 120.0,
    category: "Tops",
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
    isNew: true
  },
  {
    id: "ax-09",
    name: "Modular Sling Rig",
    price: 85.0,
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=800&auto=format&fit=crop",
    isNew: true
  }
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />

      {/* New Arrivals Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="font-display font-black text-4xl md:text-5xl uppercase tracking-tighter mb-2">
              New Arrivals
            </h2>
            <p className="font-mono text-sm text-foreground/50 tracking-widest uppercase">
              Phase 01 // Drop 04
            </p>
          </div>
          <a href="/shop" className="group font-mono text-sm uppercase tracking-widest flex items-center gap-2 mt-6 md:mt-0 text-volt hover:text-white transition-colors">
            View All <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* Syndicate Teaser */}
      <section className="py-24 border-y border-white/10 bg-[#080808] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="inline-block bg-cyber-red/20 text-cyber-red border border-cyber-red/50 px-3 py-1 text-xs font-mono uppercase tracking-widest mb-6">
              Restricted Access
            </div>
            <h2 className="font-display font-black text-5xl md:text-7xl uppercase tracking-tighter mb-6 leading-none">
              The Syndicate.
            </h2>
            <p className="font-sans text-xl text-foreground/70 mb-8 max-w-md">
              Earn status. Unlock encrypted drops. Gain access to the shadow store. Every purchase builds your clearance level.
            </p>
            <a href="/membership" className="inline-block px-8 py-4 bg-cyber-red text-white font-mono font-bold uppercase tracking-widest hover:bg-white hover:text-cyber-red transition-colors">
              Request Clearance
            </a>
          </div>
          
          {/* Aesthetic UI Element */}
          <div className="hidden md:flex flex-1 justify-center items-center">
             <div className="relative w-72 h-72 border border-cyber-red/30 rounded-full flex items-center justify-center animate-[spin_30s_linear_infinite]">
                <div className="absolute w-full h-[1px] bg-cyber-red/20"></div>
                <div className="absolute h-full w-[1px] bg-cyber-red/20"></div>
                <div className="w-56 h-56 border-2 border-dashed border-cyber-red/50 rounded-full animate-[spin_20s_linear_infinite_reverse]"></div>
                <div className="absolute bg-[#080808] font-mono text-cyber-red text-[10px] p-2">
                  SECURE_COMMS_ON
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 px-6 border-t border-white/10 text-center font-mono text-xs text-foreground/40 uppercase tracking-widest">
        <p>© 2026 VOLT TECHWEAR. END OF TRANSMISSION.</p>
      </footer>
    </main>
  );
}
