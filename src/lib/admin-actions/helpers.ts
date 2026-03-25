"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "../prisma";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Authentication required");
  if (session.user.role !== "ADMIN") {
    throw new Error("Admin access required");
  }
  return session.user;
}

export async function logActivity(userId: string, action: string, target: string = "", details: string = "") {
  await prisma.activityLog.create({
    data: { userId, action, target, details },
  });
}
