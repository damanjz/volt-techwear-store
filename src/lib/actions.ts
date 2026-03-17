"use server";

import { prisma } from "./prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { validateCoupon } from "./admin-actions";

export async function createOrder(cartItems: any[], total: number, couponCode?: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Authentication required for checkout.");
  }

  try {
    let discount = 0;
    let appliedCoupon: string | null = null;

    // Validate and apply coupon if provided
    if (couponCode) {
      const result = await validateCoupon(couponCode, total);
      if (result.valid && result.discount) {
        discount = result.discount;
        appliedCoupon = result.code || null;
      }
    }

    const finalTotal = Math.max(0, total - discount);

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: finalTotal,
        discount,
        couponCode: appliedCoupon,
        status: "PAID",
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

    // Increment coupon usage count
    if (appliedCoupon) {
      await prisma.coupon.updateMany({
        where: { code: appliedCoupon },
        data: { usedCount: { increment: 1 } },
      });
    }

    // Decrement product stock
    for (const item of cartItems) {
      await prisma.product.update({
        where: { id: item.id },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Award Volt Points (10% of final total)
    const pointsEarned = Math.floor(finalTotal * 0.1);
    if (pointsEarned > 0) {
      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: { voltPoints: { increment: pointsEarned } },
      });

      // Auto-promote clearance
      let newLevel = updatedUser.clearanceLevel;
      if (updatedUser.voltPoints >= 15000) newLevel = 3;
      else if (updatedUser.voltPoints >= 5000) newLevel = 2;

      if (newLevel !== updatedUser.clearanceLevel) {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { clearanceLevel: newLevel },
        });
      }
    }

    return { success: true, orderId: order.id, discount, pointsEarned };
  } catch (error) {
    console.error("Order creation failed:", error);
    throw new Error("Loadout processing failure.");
  }
}
