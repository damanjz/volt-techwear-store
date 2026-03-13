"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Sync initial state from store to DOM
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Prevent flash of incorrect theme
  if (!mounted) {
    return <div className="invisible">{children}</div>;
  }

  return <>{children}</>;
}
