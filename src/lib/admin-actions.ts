"use server";

import { prisma } from "./prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// ─── Auth Helper ────────────────────────────────────────────

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Authentication required");
  if (session.user.role !== "ADMIN") {
    throw new Error("Admin access required");
  }
  return session.user;
}

// ─── Activity Logging ───────────────────────────────────────

async function logActivity(userId: string, action: string, target: string = "", details: string = "") {
  await prisma.activityLog.create({
    data: { userId, action, target, details },
  });
}

// ─── Product Actions ────────────────────────────────────────

export async function createProduct(formData: FormData) {
  const admin = await requireAdmin();

  const product = await prisma.product.create({
    data: {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      category: formData.get("category") as string,
      imageUrl: formData.get("imageUrl") as string || "/products/default.png",
      stock: parseInt(formData.get("stock") as string) || 100,
      isNew: formData.get("isNew") === "true",
      isActive: formData.get("isActive") !== "false",
      isClassified: formData.get("isClassified") === "true",
      tags: formData.get("tags") as string || "",
    },
  });

  await logActivity(admin.id, "PRODUCT_CREATED", product.id, product.name);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true, id: product.id };
}

export async function updateProduct(id: string, formData: FormData) {
  const admin = await requireAdmin();

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      category: formData.get("category") as string,
      imageUrl: formData.get("imageUrl") as string,
      stock: parseInt(formData.get("stock") as string),
      isNew: formData.get("isNew") === "true",
      isActive: formData.get("isActive") === "true",
      isClassified: formData.get("isClassified") === "true",
      tags: formData.get("tags") as string || "",
    },
  });

  await logActivity(admin.id, "PRODUCT_UPDATED", id, product.name);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath(`/shop/${id}`);
  return { success: true };
}

export async function deleteProduct(id: string) {
  const admin = await requireAdmin();

  const product = await prisma.product.delete({ where: { id } });
  await logActivity(admin.id, "PRODUCT_DELETED", id, product.name);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

export async function toggleProductActive(id: string) {
  const admin = await requireAdmin();

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error("Product not found");

  await prisma.product.update({
    where: { id },
    data: { isActive: !product.isActive },
  });

  await logActivity(admin.id, product.isActive ? "PRODUCT_DEACTIVATED" : "PRODUCT_ACTIVATED", id, product.name);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true, isActive: !product.isActive };
}

export async function bulkUpdateProducts(ids: string[], action: "activate" | "deactivate" | "delete") {
  const admin = await requireAdmin();

  if (action === "delete") {
    await prisma.product.deleteMany({ where: { id: { in: ids } } });
    await logActivity(admin.id, "PRODUCTS_BULK_DELETED", ids.join(","), `${ids.length} products`);
  } else {
    await prisma.product.updateMany({
      where: { id: { in: ids } },
      data: { isActive: action === "activate" },
    });
    await logActivity(admin.id, `PRODUCTS_BULK_${action.toUpperCase()}D`, ids.join(","), `${ids.length} products`);
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

// ─── Coupon Actions ─────────────────────────────────────────

export async function createCoupon(formData: FormData) {
  const admin = await requireAdmin();

  const coupon = await prisma.coupon.create({
    data: {
      code: (formData.get("code") as string).toUpperCase(),
      description: formData.get("description") as string || "",
      discountType: formData.get("discountType") as string,
      value: parseFloat(formData.get("value") as string),
      scope: formData.get("scope") as string || "SITE",
      category: formData.get("category") as string || null,
      usageLimit: parseInt(formData.get("usageLimit") as string) || 0,
      isActive: formData.get("isActive") !== "false",
      expiresAt: formData.get("expiresAt") ? new Date(formData.get("expiresAt") as string) : null,
    },
  });

  await logActivity(admin.id, "COUPON_CREATED", coupon.id, coupon.code);
  revalidatePath("/admin/coupons");
  return { success: true, id: coupon.id };
}

export async function deleteCoupon(id: string) {
  const admin = await requireAdmin();

  const coupon = await prisma.coupon.delete({ where: { id } });
  await logActivity(admin.id, "COUPON_DELETED", id, coupon.code);
  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function toggleCouponActive(id: string) {
  const admin = await requireAdmin();

  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) throw new Error("Coupon not found");

  await prisma.coupon.update({
    where: { id },
    data: { isActive: !coupon.isActive },
  });

  await logActivity(admin.id, coupon.isActive ? "COUPON_DEACTIVATED" : "COUPON_ACTIVATED", id, coupon.code);
  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function validateCoupon(code: string, cartTotal: number) {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!coupon) return { valid: false, error: "Coupon not found" };
  if (!coupon.isActive) return { valid: false, error: "Coupon is inactive" };
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return { valid: false, error: "Coupon expired" };
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) return { valid: false, error: "Coupon usage limit reached" };

  let discount = 0;
  if (coupon.discountType === "PERCENT") {
    discount = (cartTotal * coupon.value) / 100;
  } else {
    discount = Math.min(coupon.value, cartTotal);
  }

  return {
    valid: true,
    discount: Math.round(discount * 100) / 100,
    couponId: coupon.id,
    code: coupon.code,
    description: coupon.description,
  };
}

// ─── User Actions ───────────────────────────────────────────

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

// ─── Config Actions ─────────────────────────────────────────

export async function upsertConfig(key: string, value: string) {
  const admin = await requireAdmin();

  await prisma.siteConfig.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });

  await logActivity(admin.id, "CONFIG_UPDATED", key, value);
  revalidatePath("/admin/config");
  revalidatePath("/admin/theme");
  revalidatePath("/");
  revalidatePath("/shop");
  return { success: true };
}

export async function getConfigs() {
  const configs = await prisma.siteConfig.findMany();
  const map: Record<string, string> = {};
  for (const c of configs) {
    map[c.key] = c.value;
  }
  return map;
}
