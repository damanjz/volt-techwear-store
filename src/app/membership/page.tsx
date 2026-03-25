"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import MembershipHero from "./components/MembershipHero";
import MembershipPerks from "./components/MembershipPerks";
import LockedVault from "./components/LockedVault";

export default function Membership() {
  const { status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = status === "authenticated";

  return (
    <main className="min-h-screen pt-20 bg-transparent text-foreground relative z-10">
      <Navbar />

      <MembershipHero isLoggedIn={isLoggedIn} mounted={mounted} />

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <MembershipPerks />
        <LockedVault />
      </section>

      <Footer />
    </main>
  );
}
