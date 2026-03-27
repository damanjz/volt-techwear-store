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
  const [isLogin, setIsLogin] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setSuccessMsg("");

    if (!isLogin) {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Registration failed.");
        } else {
          setSuccessMsg(data.message);
          setIsLogin(true);
        }
      } catch {
        setError("Connection failed. Try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

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
    <div className="max-w-md mx-auto w-full">
      <div className="border border-cyber-red/30 bg-black/60 backdrop-blur-sm p-8">
        <div className="flex items-center gap-2 mb-6">
          <Shield size={18} className="text-cyber-red" />
          <h2 className="font-mono text-sm uppercase tracking-widest text-cyber-red">
            {isLogin ? "Operative Authentication" : "New Operative Registration"}
          </h2>
        </div>

        {successMsg && (
          <div className="mb-4 text-green-400 text-xs font-mono bg-green-400/10 border border-green-400/20 px-3 py-2">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                {isLogin ? "Authenticating..." : "Registering..."}
              </>
            ) : (
              <>
                <Shield size={16} />
                {isLogin ? "Initialize / Login" : "Initialize / Register"}
              </>
            )}
          </button>

          <p className="font-mono text-[10px] text-foreground/40 text-center mt-1">
            {isLogin ? (
              <>
                New operative?{" "}
                <button type="button" onClick={() => { setIsLogin(false); setError(""); setSuccessMsg(""); }} className="text-cyber-red hover:underline">
                  Register here
                </button>
              </>
            ) : (
              <>
                Already an operative?{" "}
                <button type="button" onClick={() => { setIsLogin(true); setError(""); setSuccessMsg(""); }} className="text-cyber-red hover:underline">
                  Login here
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
