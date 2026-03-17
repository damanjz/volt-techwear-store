"use client";

import { toggleCouponActive, deleteCoupon } from "@/lib/admin-actions";
import { Power, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CouponActions({ coupon }: { coupon: any }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2 justify-end">
      <button
        onClick={async () => { await toggleCouponActive(coupon.id); router.refresh(); }}
        className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${
          coupon.isActive ? "text-green-400 hover:text-yellow-400" : "text-white/30 hover:text-green-400"
        }`}
        title={coupon.isActive ? "Deactivate" : "Activate"}
      >
        <Power size={14} />
      </button>
      <button
        onClick={async () => {
          if (!confirm(`Delete coupon "${coupon.code}"?`)) return;
          await deleteCoupon(coupon.id);
          router.refresh();
        }}
        className="p-2 rounded-lg hover:bg-cyber-red/10 text-white/30 hover:text-cyber-red transition-colors"
        title="Delete"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
