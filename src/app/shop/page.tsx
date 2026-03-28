import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShopClient from "./ShopClient";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop Archive",
  description:
    "Browse VOLT's full tactical techwear collection. High-performance outerwear, tops, bottoms, footwear, and accessories.",
  openGraph: {
    title: "Shop Archive | VOLT",
    description: "Browse VOLT's full tactical techwear collection.",
  },
};

export default async function Shop() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      isClassified: false,
      category: { not: "Merch" },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      price: true,
      imageUrl: true,
      category: true,
      isNew: true,
      tags: true,
    },
  });

  return (
    <main className="min-h-screen pt-24 bg-transparent">
      <Navbar />
      <ShopClient products={JSON.parse(JSON.stringify(products))} />
      <Footer />
    </main>
  );
}
