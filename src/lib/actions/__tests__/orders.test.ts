import { describe, it, expect, vi, beforeEach } from "vitest";
import { createOrder } from "../orders";
import { getServerSession } from "next-auth";
import { internalValidateCoupon } from "@/lib/admin-actions/orders";
import { validateCartItems } from "../cart-validation";
import { prisma } from "../../prisma";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/admin-actions/orders", () => ({
  internalValidateCoupon: vi.fn(),
}));

vi.mock("../cart-validation", () => ({
  validateCartItems: vi.fn(),
}));

const mockTx = {
  product: {
    findMany: vi.fn(),
    updateMany: vi.fn(),
  },
  coupon: {
    updateMany: vi.fn(),
  },
  order: {
    create: vi.fn(),
  },
  user: {
    update: vi.fn(),
  },
};

vi.mock("../../prisma", () => ({
  prisma: {
    $transaction: vi.fn().mockImplementation(async (cb) => cb(mockTx)),
  },
}));

describe("Actions - Orders", () => {
  const mockUserId = "user1";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: mockUserId } } as any);
  });

  describe("createOrder", () => {
    it("throws if not authenticated", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce(null);
      await expect(createOrder([], 100)).rejects.toThrow("Authentication required for checkout.");
    });

    it("throws if total is invalid", async () => {
      await expect(createOrder([], -5)).rejects.toThrow("Invalid order total.");
      await expect(createOrder([], "100" as any)).rejects.toThrow("Invalid order total.");
    });

    it("throws if a product is no longer available", async () => {
      const cartItems = [{ id: "p1", name: "P1", quantity: 1, price: 50, category: "Tops", imageUrl: "", stock: 10 }];
      mockTx.product.findMany.mockResolvedValueOnce([]); // Empty means not found

      await expect(createOrder(cartItems, 50)).rejects.toThrow('Product "P1" is no longer available.');
    });

    it("throws if a product has insufficient stock at validation", async () => {
      const cartItems = [{ id: "p1", name: "P1", quantity: 5, price: 50, category: "Tops", imageUrl: "", stock: 10 }];
      mockTx.product.findMany.mockResolvedValueOnce([{ id: "p1", name: "P1", stock: 2, price: 50 }]); 

      await expect(createOrder(cartItems, 50)).rejects.toThrow('Insufficient stock for "P1". Only 2 remaining.');
    });

    it("throws if stock update atomic operation fails", async () => {
      const cartItems = [{ id: "p1", name: "P1", quantity: 2, price: 50, category: "Tops", imageUrl: "", stock: 10 }];
      mockTx.product.findMany.mockResolvedValueOnce([{ id: "p1", name: "P1", stock: 10, price: 50 }]);
      mockTx.product.updateMany.mockResolvedValueOnce({ count: 0 }); // simulate atomic failure

      await expect(createOrder(cartItems, 100)).rejects.toThrow('Insufficient stock for "P1". Another order claimed it first.');
    });

    it("creates an order successfully with no coupon", async () => {
      const cartItems = [{ id: "p1", name: "P1", quantity: 2, price: 50, category: "Tops", imageUrl: "", stock: 10 }];
      
      mockTx.product.findMany.mockResolvedValueOnce([{ id: "p1", name: "P1", stock: 10, price: 50 }]);
      mockTx.product.updateMany.mockResolvedValueOnce({ count: 1 });
      mockTx.order.create.mockResolvedValueOnce({ id: "order1" });
      mockTx.user.update.mockResolvedValueOnce({ voltPoints: 100, clearanceLevel: 1 });

      const result = await createOrder(cartItems, 100);

      expect(mockTx.order.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          total: 100,
          discount: 0,
          couponCode: null,
          status: "PAID",
          items: {
            create: [
              { productId: "p1", name: "P1", quantity: 2, price: 50 },
            ],
          },
        },
        include: { items: true },
      });

      expect(result.success).toBe(true);
      expect(result.orderId).toBe("order1");
      expect(result.discount).toBe(0);
    });

    it("creates an order successfully with a coupon", async () => {
      const cartItems = [{ id: "p1", name: "P1", quantity: 2, price: 50, category: "Tops", imageUrl: "", stock: 10 }];
      
      mockTx.product.findMany.mockResolvedValueOnce([{ id: "p1", name: "P1", stock: 10, price: 50 }]);
      mockTx.product.updateMany.mockResolvedValueOnce({ count: 1 });
      mockTx.order.create.mockResolvedValueOnce({ id: "order2" });
      mockTx.user.update.mockResolvedValueOnce({ voltPoints: 100, clearanceLevel: 1 });
      
      vi.mocked(internalValidateCoupon).mockResolvedValueOnce({ valid: true, discount: 20, couponId: "c1", code: "SAVE20" } as any);

      const result = await createOrder(cartItems, 100, "SAVE20");

      expect(internalValidateCoupon).toHaveBeenCalledWith("SAVE20", 100, mockTx);
      
      expect(mockTx.order.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          total: 80,
          discount: 20,
          couponCode: "SAVE20",
        }),
      }));

      expect(mockTx.coupon.updateMany).toHaveBeenCalledWith({
        where: { code: "SAVE20" },
        data: { usedCount: { increment: 1 } },
      });

      expect(result.success).toBe(true);
      expect(result.orderId).toBe("order2");
      expect(result.discount).toBe(20);
    });
  });
});
