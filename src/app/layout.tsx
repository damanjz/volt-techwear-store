import type { Metadata } from "next";
import { Inter, Outfit, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VOLT | Techwear & Streetwear",
  description: "Upbeat techwear and streetwear for men and women.",
};

import CrosshairCursor from "@/components/CrosshairCursor";
import TerminalToasts from "@/components/TerminalToast";
import CyberBackground from "@/components/CyberBackground";
import ThemeProvider from "@/components/ThemeProvider";
import AuthProvider from "@/components/AuthProvider";
import ThemeLoader from "@/components/ThemeLoader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} ${robotoMono.variable} antialiased bg-background text-foreground transition-colors duration-500`}
      >
        <ThemeLoader />
        <AuthProvider>
          <ThemeProvider>
            <CrosshairCursor />
            <CyberBackground />
            {children}
            <TerminalToasts />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
