"use client";

import {
  updateUserRole,
  updateUserPoints,
  updateUserClearance,
  toggleUserBan,
} from "@/lib/admin-actions";
import { Shield, Ban, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToastStore } from "@/components/TerminalToast";

interface UserActionsUser {
  id: string;
  email: string | null;
  role: string;
  isBanned: boolean;
  clearanceLevel: number;
  voltPoints: number;
}

export default function UserActions({ user }: { user: UserActionsUser }) {
  const router = useRouter();
  const { addToast } = useToastStore();

  const handleRoleToggle = async () => {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    if (!confirm(`Set ${user.email} to ${newRole}?`)) return;
    try {
      await updateUserRole(user.id, newRole);
      router.refresh();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to update role";
      addToast(`[ADMIN_ERR]: ${msg}`, "alert");
    }
  };

  const handleBanToggle = async () => {
    const action = user.isBanned ? "unban" : "ban";
    if (!confirm(`${action} ${user.email}?`)) return;
    try {
      await toggleUserBan(user.id);
      router.refresh();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to toggle ban";
      addToast(`[ADMIN_ERR]: ${msg}`, "alert");
    }
  };

  const handleClearanceChange = async () => {
    const level = prompt("Set clearance level (1-3):", String(user.clearanceLevel));
    if (!level) return;
    const num = parseInt(level);
    if (num < 1 || num > 3) {
      addToast("[ADMIN_ERR]: Clearance must be 1-3", "alert");
      return;
    }
    try {
      await updateUserClearance(user.id, num);
      router.refresh();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to update clearance";
      addToast(`[ADMIN_ERR]: ${msg}`, "alert");
    }
  };

  const handlePointsChange = async () => {
    const points = prompt("Set Volt Points:", String(user.voltPoints));
    if (!points) return;
    const parsed = parseInt(points);
    if (isNaN(parsed) || parsed < 0) {
      addToast("[ADMIN_ERR]: Points must be a non-negative number", "alert");
      return;
    }
    try {
      await updateUserPoints(user.id, parsed);
      router.refresh();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to update points";
      addToast(`[ADMIN_ERR]: ${msg}`, "alert");
    }
  };

  return (
    <div className="flex items-center gap-1 justify-end">
      <button
        onClick={handleRoleToggle}
        className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${
          user.role === "ADMIN" ? "text-volt" : "text-white/30 hover:text-volt"
        }`}
        title={user.role === "ADMIN" ? "Demote to USER" : "Promote to ADMIN"}
      >
        <Crown size={14} />
      </button>
      <button
        onClick={handleClearanceChange}
        className="p-2 rounded-lg hover:bg-white/10 text-white/30 hover:text-blue-400 transition-colors"
        title="Change Clearance"
      >
        <Shield size={14} />
      </button>
      <button
        onClick={handlePointsChange}
        className="p-2 rounded-lg hover:bg-white/10 text-white/30 hover:text-volt transition-colors font-mono text-[10px] font-bold"
        title="Edit Points"
      >
        VP
      </button>
      <button
        onClick={handleBanToggle}
        className={`p-2 rounded-lg hover:bg-cyber-red/10 transition-colors ${
          user.isBanned ? "text-cyber-red" : "text-white/30 hover:text-cyber-red"
        }`}
        title={user.isBanned ? "Unban" : "Ban"}
      >
        <Ban size={14} />
      </button>
    </div>
  );
}
