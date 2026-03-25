"use server";

import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin, logActivity } from "./helpers";
import { sanitizeString, validatePrice, validateStock, validateImageUrl, ALLOWED_CATEGORIES } from "./validation";

export async function createProduct(formData: FormData) {
  const admin = await requireAdmin();

  const name = sanitizeString(formData.get("name") as string, 200);
  const description = sanitizeString(formData.get("description") as string, 2000);
  const category = sanitizeString(formData.get("category") as string, 50);

  if (!name) throw new Error("Product name is required.");
  if (!description) throw new Error("Product description is required.");
  if (!ALLOWED_CATEGORIES.includes(category)) {
    throw new Error("Invalid category.");
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: validatePrice(formData.get("price") as string),
      category,
      imageUrl: validateImageUrl(formData.get("imageUrl") as string),
      stock: validateStock(formData.get("stock") as string),
      isNew: formData.get("isNew") === "true",
      isActive: formData.get("isActive") !== "false",
      isClassified: formData.get("isClassified") === "true",
      tags: sanitizeString(formData.get("tags") as string, 500),
    },
  });

  await logActivity(admin.id, "PRODUCT_CREATED", product.id, product.name);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true, id: product.id };
}

export async function updateProduct(id: string, formData: FormData) {
  const admin = await requireAdmin();

  const name = sanitizeString(formData.get("name") as string, 200);
  const description = sanitizeString(formData.get("description") as string, 2000);
  const category = sanitizeString(formData.get("category") as string, 50);
  const imageUrl = validateImageUrl(formData.get("imageUrl") as string);

  if (!name) throw new Error("Product name is required.");
  if (!description) throw new Error("Product description is required.");
  if (!ALLOWED_CATEGORIES.includes(category)) {
    throw new Error("Invalid category.");
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price: validatePrice(formData.get("price") as string),
      category,
      imageUrl,
      stock: validateStock(formData.get("stock") as string),
      isNew: formData.get("isNew") === "true",
      isActive: formData.get("isActive") === "true",
      isClassified: formData.get("isClassified") === "true",
      tags: sanitizeString(formData.get("tags") as string, 500),
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
