import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProfileClient from "./ProfileClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Operative Profile",
  description: "View your Syndicate profile, order history, and Volt Points balance.",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <ProfileClient initialOrders={[]} />;
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      items: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return <ProfileClient initialOrders={orders} />;
}
