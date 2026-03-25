"use server";

import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin, logActivity } from "./helpers";

export async function updateUserRole(userId: string, role: string) {
  const admin = await requireAdmin();

  if (!["USER", "ADMIN"].includes(role)) throw new Error("Invalid role");

  await prisma.user.update({ where: { id: userId }, data: { role } });
  await logActivity(admin.id, "USER_ROLE_CHANGED", userId, `Role set to ${role}`);
  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUserPoints(userId: string, points: number) {
  const admin = await requireAdmin();

  if (!Number.isInteger(points) || points < 0 || points > 1_000_000) {
    throw new Error("Invalid points value. Must be 0–1,000,000.");
  }

  await prisma.user.update({ where: { id: userId }, data: { voltPoints: points } });
  await logActivity(admin.id, "USER_POINTS_UPDATED", userId, `Points set to ${points}`);
  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUserClearance(userId: string, level: number) {
  const admin = await requireAdmin();

  if (level < 1 || level > 3) throw new Error("Invalid clearance level");

  await prisma.user.update({ where: { id: userId }, data: { clearanceLevel: level } });
  await logActivity(admin.id, "USER_CLEARANCE_CHANGED", userId, `Clearance set to ${level}`);
  revalidatePath("/admin/users");
  return { success: true };
}

export async function toggleUserBan(userId: string) {
  const admin = await requireAdmin();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  await prisma.user.update({
    where: { id: userId },
    data: { isBanned: !user.isBanned },
  });

  await logActivity(admin.id, user.isBanned ? "USER_UNBANNED" : "USER_BANNED", userId, user.email || "");
  revalidatePath("/admin/users");
  return { success: true };
}
