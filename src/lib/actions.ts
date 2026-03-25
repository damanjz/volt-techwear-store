"use server";

import { prisma } from "./prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { validateCoupon } from "./admin-actions";

interface CartItemInput {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
}

function validateCartItems(items: CartItemInput[]): void {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Cart is empty.");
  }
  if (items.length > 50) {
    throw new Error("Too many items in cart.");
  }
  for (const item of items) {
    if (!item.id || typeof item.id !== "string") {
      throw new Error("Invalid item in cart.");
    }
    if (typeof item.quantity !== "number" || item.quantity < 1 || item.quantity > 99) {
      throw new Error(`Invalid quantity for ${item.name || "item"}.`);
    }
    if (typeof item.price !== "number" || item.price < 0) {
      throw new Error(`Invalid price for ${item.name || "item"}.`);
    }
  }
}

export async function createOrder(cartItems: CartItemInput[], total: number, couponCode?: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Authentication required for checkout.");
  }

  // Validate inputs
  validateCartItems(cartItems);
  if (typeof total !== "number" || total < 0) {
    throw new Error("Invalid order total.");
  }

  // Sanitize coupon code
  const sanitizedCoupon = couponCode?.trim().toUpperCase().slice(0, 50);

  try {
    // Verify stock availability and prices from database (prevent client-side tampering)
    const productIds = cartItems.map((item) => item.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // Validate all products exist, are active, and have stock
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

    let discount = 0;
    let appliedCoupon: string | null = null;

    // Validate and apply coupon if provided
    if (sanitizedCoupon) {
      const result = await validateCoupon(sanitizedCoupon, serverTotal);
      if (result.valid && result.discount) {
        discount = result.discount;
        appliedCoupon = result.code || null;
      }
    }

    const finalTotal = Math.max(0, serverTotal - discount);

    const order = await prisma.order.create({
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Loadout processing failure.";
    console.error("Order creation failed:", message);
    throw new Error(message);
  }
}

// Clearance upgrade tiers
const CLEARANCE_TIERS = [
  { level: 2, cost: 500, label: "Tier 2 — Field Operative" },
  { level: 3, cost: 2000, label: "Tier 3 — Black Site Access" },
] as const;

export async function upgradeClearance(targetLevel: number) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Authentication required.");
  }

  const tier = CLEARANCE_TIERS.find((t) => t.level === targetLevel);
  if (!tier) {
    throw new Error("Invalid clearance tier.");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.clearanceLevel >= targetLevel) {
    throw new Error("You already have this clearance level.");
  }

  if (user.clearanceLevel < targetLevel - 1) {
    throw new Error("You must upgrade to the previous tier first.");
  }

  if (user.voltPoints < tier.cost) {
    throw new Error(`Insufficient Volt Points. Need ${tier.cost}, have ${user.voltPoints}.`);
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      voltPoints: { decrement: tier.cost },
      clearanceLevel: targetLevel,
    },
  });

  return {
    success: true,
    newClearanceLevel: updated.clearanceLevel,
    remainingPoints: updated.voltPoints,
  };
}
