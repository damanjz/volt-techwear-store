"use server";

import { prisma } from "../prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { validateCoupon } from "@/lib/admin-actions";
import { validateCartItems } from "./cart-validation";
import type { CartItemInput } from "./cart-validation";
import { VOLT_POINTS_RATE, CLEARANCE_THRESHOLDS } from "./constants";

export async function createOrder(cartItems: CartItemInput[], total: number, couponCode?: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Authentication required for checkout.");
  }

  validateCartItems(cartItems);
  if (typeof total !== "number" || total < 0) {
    throw new Error("Invalid order total.");
  }

  const sanitizedCoupon = couponCode?.trim().toUpperCase().slice(0, 50);

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Verify products and compute server-side total
      const productIds = cartItems.map((item) => item.id);
      const dbProducts = await tx.product.findMany({
        where: { id: { in: productIds }, isActive: true },
      });

      const productMap = new Map(dbProducts.map((p) => [p.id, p]));

      let serverTotal = 0;
      for (const item of cartItems) {
        const dbProduct = productMap.get(item.id);
        if (!dbProduct) {
          throw new Error(`Product "${item.name}" is no longer available.`);
        }
        if (dbProduct.stock < item.quantity) {
          throw new Error(`Insufficient stock for "${dbProduct.name}". Only ${dbProduct.stock} remaining.`);
        }
        serverTotal += dbProduct.price * item.quantity;
      }

      // Apply coupon discount
      let discount = 0;
      let appliedCoupon: string | null = null;

      if (sanitizedCoupon) {
        const couponResult = await validateCoupon(sanitizedCoupon, serverTotal);
        if (couponResult.valid && couponResult.discount) {
          discount = couponResult.discount;
          appliedCoupon = couponResult.code || null;
        }
      }

      const finalTotal = Math.max(0, serverTotal - discount);

      // Atomic stock decrement — fails if stock dropped below required quantity
      for (const item of cartItems) {
        const updated = await tx.product.updateMany({
          where: { id: item.id, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count === 0) {
          throw new Error(`Insufficient stock for "${item.name}". Another order claimed it first.`);
        }
      }

      // Create order
      const order = await tx.order.create({
        data: {
          userId: session.user.id,
          total: finalTotal,
          discount,
          couponCode: appliedCoupon,
          status: "PAID",
          items: {
            create: cartItems.map((item) => {
              const dbProduct = productMap.get(item.id)!;
              return {
                productId: item.id,
                name: dbProduct.name,
                quantity: item.quantity,
                price: dbProduct.price,
              };
            }),
          },
        },
        include: { items: true },
      });

      // Increment coupon usage
      if (appliedCoupon) {
        await tx.coupon.updateMany({
          where: { code: appliedCoupon },
          data: { usedCount: { increment: 1 } },
        });
      }

      // Award Volt Points
      const pointsEarned = Math.floor(finalTotal * VOLT_POINTS_RATE);
      if (pointsEarned > 0) {
        const updatedUser = await tx.user.update({
          where: { id: session.user.id },
          data: { voltPoints: { increment: pointsEarned } },
        });

        // Auto-promote clearance
        let newLevel = updatedUser.clearanceLevel;
        if (updatedUser.voltPoints >= CLEARANCE_THRESHOLDS.tier3) newLevel = 3;
        else if (updatedUser.voltPoints >= CLEARANCE_THRESHOLDS.tier2) newLevel = 2;

        if (newLevel !== updatedUser.clearanceLevel) {
          await tx.user.update({
            where: { id: session.user.id },
            data: { clearanceLevel: newLevel },
          });
        }
      }

      return { success: true, orderId: order.id, discount, pointsEarned };
    });

    return result;
  } catch (error: unknown) {
    if (error instanceof Error && error.message.startsWith("Insufficient stock")) {
      throw error;
    }
    if (error instanceof Error && error.message.includes("no longer available")) {
      throw error;
    }
    console.error("Unexpected order failure:", error);
    throw new Error("Loadout processing failure. Please try again.");
  }
}
