"use client";

import { Shield, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        setError("Invalid credentials. Please try again.");
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
            <label htmlFor="login-email" className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 mb-1 block text-left">
              Syndicate ID (Email)
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operative@volt.sys"
              required
              className="w-full bg-white/5 border border-white/10 px-4 py-3 font-mono text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-cyber-red/50 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 mb-1 block text-left">
              Access Key (Password)
            </label>
            <div className="relative">
              <input
                id="login-password"
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
                aria-label={showPassword ? "Hide password" : "Show password"}
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
  );
}
