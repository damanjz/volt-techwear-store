"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useStore();

  // Sync theme class to DOM — ThemeLoader handles SSR defaults
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
}
