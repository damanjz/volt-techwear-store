import Navbar from "@/components/Navbar";

export default function ProductLoading() {
  return (
    <main className="min-h-screen pt-24 bg-transparent">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="animate-pulse">
          <div className="h-4 bg-foreground/5 w-32 mb-12" />
          <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
            <div className="aspect-[4/5] bg-foreground/5 border border-foreground/5" />
            <div className="space-y-6 py-8">
              <div className="h-4 bg-foreground/5 w-24" />
              <div className="h-12 bg-foreground/5 w-3/4" />
              <div className="h-20 bg-foreground/5" />
              <div className="h-16 bg-foreground/5" />
              <div className="h-16 bg-foreground/5" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
