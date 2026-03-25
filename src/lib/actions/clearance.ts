"use server";

import { prisma } from "../prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CLEARANCE_TIERS } from "./constants";

export async function upgradeClearance(targetLevel: number) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Authentication required.");
  }

  const tier = CLEARANCE_TIERS.find((t) => t.level === targetLevel);
  if (!tier) {
    throw new Error("Invalid clearance tier.");
  }

  // Atomic conditional update — prevents double-spend race condition
  const result = await prisma.user.updateMany({
    where: {
      id: session.user.id,
      voltPoints: { gte: tier.cost },
      clearanceLevel: targetLevel - 1,
    },
    data: {
      voltPoints: { decrement: tier.cost },
      clearanceLevel: targetLevel,
    },
  });

  if (result.count === 0) {
    // Determine why it failed for a clear error message
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { clearanceLevel: true, voltPoints: true },
    });

    if (!user) throw new Error("User not found.");
    if (user.clearanceLevel >= targetLevel) throw new Error("You already have this clearance level.");
    if (user.clearanceLevel < targetLevel - 1) throw new Error("You must upgrade to the previous tier first.");
    throw new Error(`Insufficient Volt Points. Need ${tier.cost}, have ${user.voltPoints}.`);
  }

  const updated = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { clearanceLevel: true, voltPoints: true },
  });

  return {
    success: true,
    newClearanceLevel: updated!.clearanceLevel,
    remainingPoints: updated!.voltPoints,
  };
}
