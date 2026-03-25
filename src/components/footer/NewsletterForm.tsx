"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight, Check } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubscribed(true);
    setEmail("");
    timerRef.current = setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="operative@volt.sys"
        aria-label="Email for newsletter"
        className="flex-1 bg-foreground/5 border border-foreground/10 px-4 py-3 font-mono text-xs text-foreground placeholder:text-foreground/30 focus:border-volt focus:outline-none transition-colors"
        required
      />
      <button
        type="submit"
        className={`px-4 py-3 transition-colors ${
          isSubscribed
            ? "bg-volt/50 text-background"
            : "bg-volt text-background hover:bg-volt/80"
        }`}
        aria-label="Subscribe"
      >
        {isSubscribed ? <Check size={16} /> : <ArrowRight size={16} />}
      </button>
    </form>
  );
}
