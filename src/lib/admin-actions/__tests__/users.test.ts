import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateUserRole, updateUserPoints, updateUserClearance, toggleUserBan } from "../users";
import { requireAdmin, logActivity } from "../helpers";
import { prisma } from "../../prisma";
import { revalidatePath } from "next/cache";

vi.mock("../helpers", () => ({
  requireAdmin: vi.fn(),
  logActivity: vi.fn(),
}));

vi.mock("../../prisma", () => ({
  prisma: {
    user: {
      update: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Admin Users Actions", () => {
  const mockAdminId = "admin1id";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAdmin).mockResolvedValue({ id: mockAdminId } as any);
  });

  describe("updateUserRole", () => {
    it("throws if role is invalid", async () => {
      await expect(updateUserRole("user1", "SUPERADMIN")).rejects.toThrow("Invalid role");
    });

    it("updates role and logs activity", async () => {
      vi.mocked(prisma.user.update).mockResolvedValueOnce({} as any);

      const result = await updateUserRole("user1", "ADMIN");

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user1" },
        data: { role: "ADMIN" },
      });
      expect(logActivity).toHaveBeenCalledWith(mockAdminId, "USER_ROLE_CHANGED", "user1", "Role set to ADMIN");
      expect(revalidatePath).toHaveBeenCalledWith("/admin/users");
      expect(result.success).toBe(true);
    });
  });

  describe("updateUserPoints", () => {
    it("throws if points are negative or not an integer", async () => {
      await expect(updateUserPoints("user1", -5)).rejects.toThrow("Invalid points value");
      await expect(updateUserPoints("user1", 10.5)).rejects.toThrow("Invalid points value");
      await expect(updateUserPoints("user1", 1000001)).rejects.toThrow("Invalid points value");
    });

    it("updates points and logs activity", async () => {
      vi.mocked(prisma.user.update).mockResolvedValueOnce({} as any);

      const result = await updateUserPoints("user1", 1500);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user1" },
        data: { voltPoints: 1500 },
      });
      expect(logActivity).toHaveBeenCalledWith(mockAdminId, "USER_POINTS_UPDATED", "user1", "Points set to 1500");
      expect(revalidatePath).toHaveBeenCalledWith("/admin/users");
      expect(result.success).toBe(true);
    });
  });

  describe("updateUserClearance", () => {
    it("throws if clearance is invalid", async () => {
      await expect(updateUserClearance("user1", 0)).rejects.toThrow("Invalid clearance level");
      await expect(updateUserClearance("user1", 4)).rejects.toThrow("Invalid clearance level");
    });

    it("updates clearance and logs activity", async () => {
      vi.mocked(prisma.user.update).mockResolvedValueOnce({} as any);

      const result = await updateUserClearance("user1", 2);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user1" },
        data: { clearanceLevel: 2 },
      });
      expect(logActivity).toHaveBeenCalledWith(mockAdminId, "USER_CLEARANCE_CHANGED", "user1", "Clearance set to 2");
      expect(revalidatePath).toHaveBeenCalledWith("/admin/users");
      expect(result.success).toBe(true);
    });
  });

  describe("toggleUserBan", () => {
    it("throws if user not found", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);
      await expect(toggleUserBan("user1")).rejects.toThrow("User not found");
    });

    it("toggles ban status and logs activity", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ id: "user1", email: "test@x.com", isBanned: false } as any);
      vi.mocked(prisma.user.update).mockResolvedValueOnce({} as any);

      const result = await toggleUserBan("user1");

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user1" },
        data: { isBanned: true },
      });
      expect(logActivity).toHaveBeenCalledWith(mockAdminId, "USER_BANNED", "user1", "test@x.com");
      expect(revalidatePath).toHaveBeenCalledWith("/admin/users");
      expect(result.success).toBe(true);
    });
  });
});
