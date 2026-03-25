import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen pt-24 bg-transparent flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 py-24 relative z-10 text-center">
          <div className="font-mono text-xs text-foreground/40 uppercase tracking-widest mb-4">
            {"// TARGET_COORDINATES_INVALID"}
          </div>
          <h1 className="font-display font-black text-8xl uppercase tracking-tighter mb-4 text-volt">
            404
          </h1>
          <p className="font-sans text-foreground/60 mb-8">
            This sector does not exist. The asset you are looking for may have
            been relocated or decommissioned.
          </p>
          <Link
            href="/"
            className="inline-block bg-foreground text-background font-mono font-bold uppercase tracking-widest px-8 py-4 hover:bg-volt hover:text-background transition-colors"
          >
            Return to Base
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
