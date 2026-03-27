import { describe, it, expect, vi, beforeEach } from "vitest";
import { createProduct, updateProduct, deleteProduct, toggleProductActive, bulkUpdateProducts } from "../products";
import { requireAdmin, logActivity } from "../helpers";
import { prisma } from "../../prisma";
import { revalidatePath } from "next/cache";

vi.mock("../helpers", () => ({
  requireAdmin: vi.fn(),
  logActivity: vi.fn(),
}));

vi.mock("../../prisma", () => ({
  prisma: {
    product: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findUnique: vi.fn(),
      deleteMany: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Admin Products Actions", () => {
  const mockAdminId = "admin1id";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAdmin).mockResolvedValue({ id: mockAdminId } as any);
  });

  describe("createProduct", () => {
    it("throws if required fields are missing", async () => {
      const fd = new FormData();
      await expect(createProduct(fd)).rejects.toThrow("Product name is required.");
      
      fd.set("name", "Test Product");
      await expect(createProduct(fd)).rejects.toThrow("Product description is required.");
      
      fd.set("description", "Desc");
      await expect(createProduct(fd)).rejects.toThrow("Invalid category.");
    });

    it("creates a product and logs activity", async () => {
      const fd = new FormData();
      fd.set("name", "Test Armor");
      fd.set("description", "Heavy");
      fd.set("category", "Outerwear");
      fd.set("price", "99.99");
      fd.set("imageUrl", "/products/armor.png");
      fd.set("stock", "10");
      fd.set("isNew", "true");
      fd.set("isActive", "true");
      fd.set("isClassified", "false");
      fd.set("tags", "cyber,armor");

      vi.mocked(prisma.product.create).mockResolvedValueOnce({ id: "prod1", name: "Test Armor" } as any);

      const result = await createProduct(fd);

      expect(prisma.product.create).toHaveBeenCalled();
      expect(logActivity).toHaveBeenCalledWith(mockAdminId, "PRODUCT_CREATED", "prod1", "Test Armor");
      expect(revalidatePath).toHaveBeenCalledWith("/admin/products");
      expect(result.success).toBe(true);
    });
  });

  describe("deleteProduct", () => {
    it("deletes product and logs activity", async () => {
      vi.mocked(prisma.product.delete).mockResolvedValueOnce({ id: "prod1", name: "Robe" } as any);
      const result = await deleteProduct("prod1");

      expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: "prod1" } });
      expect(logActivity).toHaveBeenCalledWith(mockAdminId, "PRODUCT_DELETED", "prod1", "Robe");
      expect(result.success).toBe(true);
    });
  });

  describe("toggleProductActive", () => {
    it("throws if product not found", async () => {
      vi.mocked(prisma.product.findUnique).mockResolvedValueOnce(null);
      await expect(toggleProductActive("prod1")).rejects.toThrow("Product not found");
    });

    it("toggles product active status", async () => {
      vi.mocked(prisma.product.findUnique).mockResolvedValueOnce({ id: "p1", name: "P1", isActive: true } as any);
      vi.mocked(prisma.product.update).mockResolvedValueOnce({} as any);

      const result = await toggleProductActive("p1");

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: "p1" },
        data: { isActive: false },
      });
      expect(logActivity).toHaveBeenCalledWith(mockAdminId, "PRODUCT_DEACTIVATED", "p1", "P1");
      expect(result.success).toBe(true);
    });
  });

  describe("bulkUpdateProducts", () => {
    it("deletes multiple products", async () => {
      vi.mocked(prisma.product.deleteMany).mockResolvedValueOnce({ count: 2 } as any);
      
      const result = await bulkUpdateProducts(["p1", "p2"], "delete");
      
      expect(prisma.product.deleteMany).toHaveBeenCalledWith({ where: { id: { in: ["p1", "p2"] } } });
      expect(logActivity).toHaveBeenCalledWith(mockAdminId, "PRODUCTS_BULK_DELETED", "p1,p2", "2 products");
      expect(result.success).toBe(true);
    });

    it("activates multiple products", async () => {
      vi.mocked(prisma.product.updateMany).mockResolvedValueOnce({ count: 2 } as any);
      
      const result = await bulkUpdateProducts(["p1", "p2"], "activate");
      
      expect(prisma.product.updateMany).toHaveBeenCalledWith({
        where: { id: { in: ["p1", "p2"] } },
        data: { isActive: true },
      });
      expect(logActivity).toHaveBeenCalledWith(mockAdminId, "PRODUCTS_BULK_ACTIVATED", "p1,p2", "2 products");
      expect(result.success).toBe(true);
    });
  });
});
