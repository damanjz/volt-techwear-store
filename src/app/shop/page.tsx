import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function Shop() {
  const products = await prisma.product.findMany({
    where: {
      category: {
        not: "Merch"
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Filter out the Black Site products if they shouldn't show here
  const shopProducts = products.filter((p: any) => !p.id.startsWith('bs-'));

  return (
    <main className="min-h-screen pt-24 bg-transparent">
      <Navbar />
      
      <section className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-8 bg-background/40 backdrop-blur-sm p-4 rounded-xl">
          <div>
            <h1 className="font-display font-black text-5xl md:text-7xl uppercase tracking-tighter mb-4">
              Archive <span className="text-volt">.</span>
            </h1>
            <p className="font-mono text-sm text-foreground/60 tracking-widest uppercase">
              {"// Primary Apparel Division"}
            </p>
          </div>
          
          <div className="flex gap-4 mt-8 md:mt-0 overflow-x-auto pb-2 w-full md:w-auto font-mono text-xs uppercase tracking-widest font-bold">
            <button className="px-4 py-2 bg-foreground text-background whitespace-nowrap">All</button>
            <button className="px-4 py-2 border border-white/20 hover:border-volt text-foreground/70 hover:text-volt whitespace-nowrap transition-colors">Tops</button>
            <button className="px-4 py-2 border border-white/20 hover:border-volt text-foreground/70 hover:text-volt whitespace-nowrap transition-colors">Bottoms</button>
            <button className="px-4 py-2 border border-white/20 hover:border-volt text-foreground/70 hover:text-volt whitespace-nowrap transition-colors">Footwear</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shopProducts.map((product: any) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>
    </main>
  );
}
