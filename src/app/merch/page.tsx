import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";

const merchProducts = [
  {
    id: "m-01",
    name: "Volt Schematic Sticker Pack",
    price: 15.0,
    category: "Merch",
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop",
    isNew: true
  },
  {
    id: "m-02",
    name: "Syndicate Nalgene Bottle 32oz",
    price: 35.0,
    category: "Merch",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "ax-09",
    name: "Modular Sling Rig",
    price: 85.0,
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "m-04",
    name: "Cyber Beanie",
    price: 45.0,
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=800&auto=format&fit=crop",
  }
];

export default function Merch() {
  return (
    <main className="min-h-screen pt-24 bg-background">
      <Navbar />
      
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col mb-12 border-b border-cyber-red/20 pb-8 bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center relative overflow-hidden p-8">
           <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-0"></div>
           <div className="relative z-10">
            <h1 className="font-display font-black text-5xl md:text-7xl uppercase tracking-tighter mb-4 text-cyber-red text-glow-red">
              Hardware
            </h1>
            <p className="font-mono text-sm text-foreground/80 tracking-widest uppercase bg-black/60 inline-block px-3 py-1">
              // Accessories & Collectibles
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {merchProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>
    </main>
  );
}
