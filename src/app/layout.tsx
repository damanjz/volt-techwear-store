import type { Metadata, Viewport } from "next";
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
  metadataBase: new URL("https://volt-techwear-store.vercel.app"),
  title: {
    default: "VOLT | Techwear & Streetwear",
    template: "%s | VOLT",
  },
  description: "High-performance tactical techwear and streetwear. Engineered materials meet cyberpunk aesthetics.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "VOLT Techwear",
    title: "VOLT | Techwear & Streetwear",
    description: "High-performance tactical techwear and streetwear. Engineered materials meet cyberpunk aesthetics.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VOLT | Techwear & Streetwear",
    description: "High-performance tactical techwear and streetwear.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

import CrosshairCursor from "@/components/CrosshairCursor";
import TerminalToasts from "@/components/TerminalToast";
import dynamic from "next/dynamic";
const CyberBackground = dynamic(() => import("@/components/CyberBackground"), { ssr: false });
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
