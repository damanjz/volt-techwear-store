"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import BlackSiteHero from "./components/BlackSiteHero";
import BlackSiteTeaser from "./components/BlackSiteTeaser";
import ClearanceUpgrade from "./components/ClearanceUpgrade";
import BlackSiteProducts from "./components/BlackSiteProducts";
import type { Product } from "@prisma/client";

interface BlackSiteProps {
  initialProducts: Product[];
  clearanceLevel: number;
  voltPoints: number;
  isLoggedIn: boolean;
}

export default function BlackSiteClient({
  initialProducts,
  clearanceLevel: serverClearance,
  voltPoints: serverPoints,
  isLoggedIn: serverLoggedIn,
}: BlackSiteProps) {
  const { data: session, status, update: updateSession } = useSession();
  const [mounted, setMounted] = useState(false);

  const isLoggedIn = status === "authenticated" || serverLoggedIn;
  const clearanceLevel = session?.user?.clearanceLevel ?? serverClearance;
  const voltPoints = session?.user?.voltPoints ?? serverPoints;
  const hasBlackSiteAccess = clearanceLevel >= 3;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen pt-20 bg-transparent relative z-10 text-foreground">
      <Navbar />

      <BlackSiteHero
        isLoggedIn={isLoggedIn}
        hasBlackSiteAccess={hasBlackSiteAccess}
        clearanceLevel={clearanceLevel}
        voltPoints={voltPoints}
      />

      {!isLoggedIn && <BlackSiteTeaser />}

      {isLoggedIn && !hasBlackSiteAccess && (
        <ClearanceUpgrade
          initialProducts={initialProducts}
          clearanceLevel={clearanceLevel}
          voltPoints={voltPoints}
          updateSession={updateSession}
        />
      )}

      {isLoggedIn && hasBlackSiteAccess && (
        <BlackSiteProducts products={initialProducts} />
      )}

      <Footer />
    </main>
  );
}
