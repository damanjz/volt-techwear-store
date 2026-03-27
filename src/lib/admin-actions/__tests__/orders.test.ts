import { describe, it, expect, vi, beforeEach } from "vitest";
import { createCoupon, deleteCoupon, validateCoupon, upsertConfig, getConfigs } from "../orders";
import { requireAdmin, logActivity } from "../helpers";
import { prisma } from "../../prisma";
import { revalidatePath } from "next/cache";
import type { Session } from "next-auth";
import type { Coupon, SiteConfig } from "@prisma/client";

vi.mock("../helpers", () => ({
  requireAdmin: vi.fn(),
  logActivity: vi.fn(),
}));

vi.mock("../../prisma", () => ({
  prisma: {
    coupon: {
      create: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
    },
    siteConfig: {
      upsert: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Admin Orders/Coupons Actions", () => {
  const mockAdminId = "admin1id";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAdmin).mockResolvedValue({ id: mockAdminId } as Session["user"]);
  });

  describe("createCoupon", () => {
    it("throws if code is missing", async () => {
      const fd = new FormData();
      await expect(createCoupon(fd)).rejects.toThrow("Coupon code is required.");
    });

    it("throws if discount type is invalid", async () => {
      const fd = new FormData();
      fd.set("code", "SAVE20");
      fd.set("discountType", "INVALID");
      await expect(createCoupon(fd)).rejects.toThrow("Invalid discount type. Must be PERCENT or FLAT.");
    });

    it("creates coupon and logs activity", async () => {
      const fd = new FormData();
      fd.set("code", "SAVE20");
      fd.set("discountType", "PERCENT");
      fd.set("value", "20");
      fd.set("scope", "SITE");

      vi.mocked(prisma.coupon.create).mockResolvedValueOnce({ id: "c1", code: "SAVE20" } as Coupon);

      const result = await createCoupon(fd);

      expect(prisma.coupon.create).toHaveBeenCalled();
      expect(logActivity).toHaveBeenCalledWith(mockAdminId, "COUPON_CREATED", "c1", "SAVE20");
      expect(revalidatePath).toHaveBeenCalledWith("/admin/coupons");
      expect(result.success).toBe(true);
    });
  });

  describe("deleteCoupon", () => {
    it("deletes a coupon and logs activity", async () => {
      vi.mocked(prisma.coupon.delete).mockResolvedValueOnce({ id: "c1", code: "DEL1" } as Coupon);

      const result = await deleteCoupon("c1");

      expect(prisma.coupon.delete).toHaveBeenCalledWith({ where: { id: "c1" } });
      expect(logActivity).toHaveBeenCalledWith(mockAdminId, "COUPON_DELETED", "c1", "DEL1");
      expect(result.success).toBe(true);
    });
  });

  describe("validateCoupon", () => {
    it("returns invalid if coupon not found", async () => {
      vi.mocked(prisma.coupon.findUnique).mockResolvedValueOnce(null);
      const res = await validateCoupon("NONEXISTENT", 100);
      expect(res.valid).toBe(false);
      expect(res.error).toBe("Coupon not found");
    });

    it("calculates flat discount correctly", async () => {
      vi.mocked(prisma.coupon.findUnique).mockResolvedValueOnce({
        id: "c1",
        code: "FLAT10",
        isActive: true,
        discountType: "FLAT",
        value: 10,
        usageLimit: 0,
        usedCount: 0,
        expiresAt: null,
      } as Coupon);

      const res = await validateCoupon("FLAT10", 50);
      expect(res.valid).toBe(true);
      expect(res.discount).toBe(10);
    });

    it("calculates percent discount correctly", async () => {
      vi.mocked(prisma.coupon.findUnique).mockResolvedValueOnce({
        id: "c2",
        code: "PCT20",
        isActive: true,
        discountType: "PERCENT",
        value: 20,
        usageLimit: 0,
        usedCount: 0,
        expiresAt: null,
      } as Coupon);

      const res = await validateCoupon("PCT20", 50);
      expect(res.valid).toBe(true);
      expect(res.discount).toBe(10);
    });
  });

  describe("upsertConfig", () => {
    it("throws if config key is invalid", async () => {
      await expect(upsertConfig("invalid.key", "value")).rejects.toThrow("Invalid config key.");
    });

    it("upserts config and logs activity", async () => {
      vi.mocked(prisma.siteConfig.upsert).mockResolvedValueOnce({} as SiteConfig);

      const result = await upsertConfig("theme.volt", "true");

      expect(prisma.siteConfig.upsert).toHaveBeenCalledWith({
        where: { key: "theme.volt" },
        update: { value: "true" },
        create: { key: "theme.volt", value: "true" },
      });
      expect(logActivity).toHaveBeenCalledWith(mockAdminId, "CONFIG_UPDATED", "theme.volt", "true");
      expect(revalidatePath).toHaveBeenCalledWith("/admin/config");
      expect(result.success).toBe(true);
    });
  });

  describe("getConfigs", () => {
    it("returns a mapped object of configs", async () => {
      vi.mocked(prisma.siteConfig.findMany).mockResolvedValueOnce([
        { key: "theme.volt", value: "true", id: "1", updatedAt: new Date() },
        { key: "feature.banner.active", value: "false", id: "2", updatedAt: new Date() },
      ]);

      const map = await getConfigs();
      expect(map).toEqual({
        "theme.volt": "true",
        "feature.banner.active": "false",
      });
    });
  });
});
