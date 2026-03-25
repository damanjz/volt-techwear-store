import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hardware & Merch",
  description: "VOLT accessories and collectibles. Sticker packs, bottles, bags, and limited-edition drops.",
  openGraph: {
    title: "Hardware & Merch | VOLT",
    description: "VOLT accessories and collectibles.",
  },
};

export const dynamic = "force-dynamic";

export default async function Merch() {
  const merchProducts = await prisma.product.findMany({
    where: {
      category: "Merch"
    }
  });

  return (
    <main className="min-h-screen pt-24 bg-transparent">
      <Navbar />
      
      <section className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col mb-12 border-b border-cyber-red/20 pb-8 bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center relative overflow-hidden p-8">
           <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-0"></div>
           <div className="relative z-10">
            <h1 className="font-display font-black text-5xl md:text-7xl uppercase tracking-tighter mb-4 text-cyber-red text-glow-red">
              Hardware
            </h1>
            <p className="font-mono text-sm text-foreground/80 tracking-widest uppercase bg-black/60 inline-block px-3 py-1">
              {"// Accessories & Collectibles"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {merchProducts.map((product: any) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
