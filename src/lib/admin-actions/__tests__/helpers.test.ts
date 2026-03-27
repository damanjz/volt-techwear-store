import { describe, it, expect, vi, beforeEach } from "vitest";
import { requireAdmin, logActivity } from "../helpers";
import { getServerSession } from "next-auth";
import { prisma } from "../../prisma";
import type { ActivityLog } from "@prisma/client";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("../../prisma", () => ({
  prisma: {
    activityLog: {
      create: vi.fn(),
    },
  },
}));

describe("Admin Helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("requireAdmin", () => {
    it("throws if no session is found", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce(null);
      await expect(requireAdmin()).rejects.toThrow("Authentication required");
    });

    it("throws if user is not ADMIN", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { role: "USER" },
        expires: "123",
      });
      await expect(requireAdmin()).rejects.toThrow("Admin access required");
    });

    it("returns user object if user is ADMIN", async () => {
      const mockAdmin = { id: "1", role: "ADMIN", name: "Admin User", email: "admin@test.com" };
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: mockAdmin,
        expires: "123",
      });
      const user = await requireAdmin();
      expect(user).toEqual(mockAdmin);
    });
  });

  describe("logActivity", () => {
    it("creates an activity log entry via prisma", async () => {
      vi.mocked(prisma.activityLog.create).mockResolvedValueOnce({} as ActivityLog);
      
      await logActivity("user1", "TEST_ACTION", "target1", "detail info");
      
      expect(prisma.activityLog.create).toHaveBeenCalledWith({
        data: {
          userId: "user1",
          action: "TEST_ACTION",
          target: "target1",
          details: "detail info",
        },
      });
    });

    it("uses default empty strings for target and details", async () => {
      vi.mocked(prisma.activityLog.create).mockResolvedValueOnce({} as ActivityLog);
      
      await logActivity("user1", "TEST_ACTION");
      
      expect(prisma.activityLog.create).toHaveBeenCalledWith({
        data: {
          userId: "user1",
          action: "TEST_ACTION",
          target: "",
          details: "",
        },
      });
    });
  });
});
