"use server";

import { prisma } from "./prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createOrder(cartItems: any[], total: number) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Authentication required for checkout.");
  }

  try {
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        status: "PAID", // Simulating successful checkout for now
        items: {
          create: cartItems.map((item) => ({
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Order creation failed:", error);
    throw new Error("Loadout processing failure.");
  }
}
