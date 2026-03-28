"use server";

import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdmin, logActivity } from "./helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const ALLOWED_DISCOUNT_TYPES = ["PERCENT", "FLAT"] as const;
const ALLOWED_SCOPES = ["SITE", "CATEGORY"] as const;

export async function createCoupon(formData: FormData) {
  const admin = await requireAdmin();

  const code = (formData.get("code") as string || "").trim().toUpperCase().slice(0, 50);
  if (!code) throw new Error("Coupon code is required.");

  const discountType = formData.get("discountType") as string;
  if (!ALLOWED_DISCOUNT_TYPES.includes(discountType as (typeof ALLOWED_DISCOUNT_TYPES)[number])) {
    throw new Error("Invalid discount type. Must be PERCENT or FLAT.");
  }

  const value = parseFloat(formData.get("value") as string);
  if (isNaN(value) || value <= 0) throw new Error("Discount value must be positive.");
  if (discountType === "PERCENT" && value > 100) throw new Error("Percentage discount cannot exceed 100%.");
  if (discountType === "FLAT" && value > 999999) throw new Error("Flat discount is too large.");

  const scope = formData.get("scope") as string || "SITE";
  if (!ALLOWED_SCOPES.includes(scope as (typeof ALLOWED_SCOPES)[number])) {
    throw new Error("Invalid coupon scope.");
  }

  const coupon = await prisma.coupon.create({
    data: {
      code,
      description: (formData.get("description") as string || "").trim().slice(0, 500),
      discountType,
      value: discountType === "FLAT" ? Math.round(value * 100) : Math.round(value),
      scope,
      category: formData.get("category") as string || null,
      usageLimit: Math.max(0, parseInt(formData.get("usageLimit") as string) || 0),
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

export async function internalValidateCoupon(code: string, cartTotal: number, tx: Prisma.TransactionClient | typeof prisma) {
  const coupon = await tx.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!coupon) return { valid: false, error: "Coupon not found" };
  if (!coupon.isActive) return { valid: false, error: "Coupon is inactive" };
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return { valid: false, error: "Coupon expired" };
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) return { valid: false, error: "Coupon usage limit reached" };

  let discount = 0;
  if (coupon.discountType === "PERCENT") {
    // value is an integer percentage (e.g. 20 for 20%), total in cents
    discount = Math.floor((cartTotal * coupon.value) / 100);
  } else {
    // value is in cents, discount cannot exceed cartTotal
    discount = Math.min(coupon.value, cartTotal);
  }

  return {
    valid: true,
    discount,
    couponId: coupon.id,
    code: coupon.code,
    description: coupon.description,
  };
}

export async function validateCoupon(code: string, cartTotal: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { valid: false, error: "Authentication required" };
  }
  return internalValidateCoupon(code, cartTotal, prisma);
}

const ALLOWED_CONFIG_KEYS = new Set([
  "theme.volt", "theme.cyber-red", "theme.background", "theme.foreground",
  "feature.blacksite", "feature.banner.active", "feature.banner.text",
]);

export async function upsertConfig(key: string, value: string) {
  const admin = await requireAdmin();

  if (!ALLOWED_CONFIG_KEYS.has(key)) {
    throw new Error("Invalid config key.");
  }

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
