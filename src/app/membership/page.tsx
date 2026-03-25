"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Lock, Shield, Zap, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Membership() {
  const { status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = status === "authenticated";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/profile");
        router.refresh();
      }
    } catch {
      setError("Connection failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen pt-20 bg-transparent text-foreground relative z-10">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-6 flex flex-col items-center text-center overflow-hidden border-b border-cyber-red/20">
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-red/10 to-transparent pointer-events-none z-0"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyber-red/10 border border-cyber-red/30 text-cyber-red text-[10px] font-mono uppercase tracking-widest mb-8">
            <span className="w-1.5 h-1.5 bg-cyber-red rounded-full animate-pulse"></span>
            Restricted Access
          </div>

          <h1 className="font-display font-black text-6xl md:text-8xl uppercase tracking-tighter mb-6 text-glow-cyber-red">
            The Syndicate
          </h1>
          <p className="font-mono text-sm md:text-base text-foreground/70 leading-relaxed max-w-2xl mx-auto mb-12">
            Beyond the surface web lies The Syndicate. Our operative network gains access to heavily classified hardware drops, encrypted member pricing, and accumulated Volt points for deployment clearances.
          </p>

          {/* Login Form */}
          {mounted && !isLoggedIn && (
            <div className="max-w-md mx-auto w-full">
              <div className="border border-cyber-red/30 bg-black/60 backdrop-blur-sm p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Shield size={18} className="text-cyber-red" />
                  <h2 className="font-mono text-sm uppercase tracking-widest text-cyber-red">
                    Operative Authentication
                  </h2>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 mb-1 block text-left">
                      Syndicate ID (Email)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="operative@volt.sys"
                      required
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 font-mono text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-cyber-red/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 mb-1 block text-left">
                      Access Key (Password)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 8 characters"
                        required
                        minLength={8}
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 font-mono text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-cyber-red/50 transition-colors pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-cyber-red text-xs font-mono bg-cyber-red/10 border border-cyber-red/20 px-3 py-2">
                      <AlertCircle size={14} />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-cyber-red text-white font-mono font-bold text-sm uppercase px-8 py-4 tracking-widest hover:bg-white hover:text-cyber-red transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <Shield size={16} />
                        Initialize / Login
                      </>
                    )}
                  </button>

                  <p className="font-mono text-[10px] text-foreground/40 text-center mt-1">
                    New operatives are auto-registered on first login
                  </p>
                </form>
              </div>
            </div>
          )}

          {mounted && isLoggedIn && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/profile"
                className="bg-volt text-background font-mono font-bold text-sm uppercase px-8 py-4 tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                <Shield size={16} /> Access Profile Dashboard
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Membership Dashboard Teaser */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
         <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="border border-white/10 bg-[#111] p-8 flex flex-col gap-4">
               <Zap className="text-volt" size={32} />
               <h3 className="font-mono font-bold uppercase text-xl">Earn & Burn</h3>
               <p className="font-sans text-sm text-foreground/60">Generate 1 Volt Point for every $1 spent. Redeem points directly on exclusive drops and accessories.</p>
            </div>
            <div className="border border-white/10 bg-[#111] p-8 flex flex-col gap-4">
               <Lock className="text-volt" size={32} />
               <h3 className="font-mono font-bold uppercase text-xl">Secured Drops</h3>
               <p className="font-sans text-sm text-foreground/60">Level 2 clearance members receive 24hr early access to all limited-edition capsule collections.</p>
            </div>
            <div className="border border-white/10 bg-[#111] p-8 flex flex-col gap-4">
               <Shield className="text-cyber-red" size={32} />
               <h3 className="font-mono font-bold uppercase text-xl">Black Site Store</h3>
               <p className="font-sans text-sm text-foreground/60">A hidden storefront accessible only to Tier 3 members. Features 1-of-1 experimental garments.</p>
            </div>
         </div>

         {/* Mock Locked Storefront */}
         <div>
            <div className="flex justify-between items-end border-b border-cyber-red/20 pb-4 mb-8">
              <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tighter text-cyber-red">Black Site // Vault</h2>
              <span className="font-mono text-xs uppercase text-cyber-red px-2 py-1 bg-cyber-red/10 border border-cyber-red/30">Clearance Required</span>
            </div>

            <div className="grid md:grid-cols-3 gap-6 opacity-30 select-none pointer-events-none">
              {/* Locked Product 1 */}
               <div className="bg-[#1a1a1a] border border-white/5 aspect-[4/5] relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop')] bg-cover opacity-20 filter blur-sm"></div>
                  <div className="relative z-10 flex flex-col items-center gap-4 border border-cyber-red/50 bg-black/80 px-8 py-6 backdrop-blur-sm">
                    <Lock className="text-cyber-red" size={32} />
                    <span className="font-mono uppercase text-xs tracking-widest text-cyber-red">Classified Asset</span>
                  </div>
               </div>
              {/* Locked Product 2 */}
              <div className="bg-[#1a1a1a] border border-white/5 aspect-[4/5] relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1520975954732-57dd22299614?q=80&w=800&auto=format&fit=crop')] bg-cover opacity-20 filter blur-sm"></div>
                  <div className="relative z-10 flex flex-col items-center gap-4 border border-cyber-red/50 bg-black/80 px-8 py-6 backdrop-blur-sm">
                    <Lock className="text-cyber-red" size={32} />
                    <span className="font-mono uppercase text-xs tracking-widest text-cyber-red">Classified Asset</span>
                  </div>
               </div>
              {/* Locked Product 3 */}
              <div className="bg-[#1a1a1a] border border-white/5 aspect-[4/5] relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542272201-b1ca555f8505?q=80&w=800&auto=format&fit=crop')] bg-cover opacity-20 filter blur-sm"></div>
                  <div className="relative z-10 flex flex-col items-center gap-4 border border-cyber-red/50 bg-black/80 px-8 py-6 backdrop-blur-sm">
                    <Lock className="text-cyber-red" size={32} />
                    <span className="font-mono uppercase text-xs tracking-widest text-cyber-red">Classified Asset</span>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <Footer />
    </main>
  );
}
