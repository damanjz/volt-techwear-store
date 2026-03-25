import Navbar from "@/components/Navbar";

export default function ShopLoading() {
  return (
    <main className="min-h-screen pt-24 bg-transparent">
      <Navbar />
      <section className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="animate-pulse">
          <div className="h-48 bg-foreground/5 rounded-xl mb-12 border border-foreground/5" />
          <div className="h-4 bg-foreground/5 w-48 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] bg-foreground/5 border border-foreground/5"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
