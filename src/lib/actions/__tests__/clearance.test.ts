import { describe, it, expect, vi, beforeEach } from "vitest";
import { upgradeClearance } from "../clearance";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { prisma } from "../../prisma";
import type { User } from "@prisma/client";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("../../prisma", () => ({
  prisma: {
    user: {
      updateMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

describe("Actions - Clearance", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("upgradeClearance", () => {
    it("throws if user is not authenticated", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce(null);
      await expect(upgradeClearance(2)).rejects.toThrow("Authentication required.");
    });

    it("throws if tier is invalid", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({ user: { id: "user1" } } as Session);
      await expect(upgradeClearance(99)).rejects.toThrow("Invalid clearance tier.");
    });

    it("successfully upgrades clearance", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({ user: { id: "user1" } } as Session);
      vi.mocked(prisma.user.updateMany).mockResolvedValueOnce({ count: 1 });
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ clearanceLevel: 2, voltPoints: 500 } as User);

      const result = await upgradeClearance(2);

      expect(prisma.user.updateMany).toHaveBeenCalledWith({
        where: {
          id: "user1",
          voltPoints: { gte: 500 },
          clearanceLevel: 1,
        },
        data: {
          voltPoints: { decrement: 500 },
          clearanceLevel: 2,
        },
      });

      expect(result.success).toBe(true);
      expect(result.newClearanceLevel).toBe(2);
      expect(result.remainingPoints).toBe(500);
    });

    it("throws specific error if updateMany fails (insufficient points)", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({ user: { id: "user1" } } as Session);
      vi.mocked(prisma.user.updateMany).mockResolvedValueOnce({ count: 0 });

      // simulate user having not enough points
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ clearanceLevel: 1, voltPoints: 100 } as User);

      await expect(upgradeClearance(2)).rejects.toThrow("Insufficient Volt Points. Need 500, have 100.");
    });

    it("throws specific error if updateMany fails (already have clearance)", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({ user: { id: "user1" } } as Session);
      vi.mocked(prisma.user.updateMany).mockResolvedValueOnce({ count: 0 });

      // simulate user already having clearance level 2
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ clearanceLevel: 2, voltPoints: 2000 } as User);

      await expect(upgradeClearance(2)).rejects.toThrow("You already have this clearance level.");
    });

    it("throws specific error if updateMany fails (needs previous tier)", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({ user: { id: "user1" } } as Session);
      vi.mocked(prisma.user.updateMany).mockResolvedValueOnce({ count: 0 });

      // simulate user having level 0 trying to go to level 2
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ clearanceLevel: 0, voltPoints: 2000 } as User);

      await expect(upgradeClearance(2)).rejects.toThrow("You must upgrade to the previous tier first.");
    });
  });
});
