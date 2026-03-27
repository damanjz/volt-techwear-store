import { prisma } from "@/lib/prisma";
import type { Coupon } from "@prisma/client";
import CouponActions from "./CouponActions";
import CouponForm from "./CouponForm";

export const dynamic = "force-dynamic";

export default async function AdminCoupons() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-black text-3xl uppercase tracking-tight">
          Coupons <span className="text-volt">.</span>
        </h1>
        <p className="font-mono text-xs text-white/40 uppercase tracking-widest mt-1">
          // Discount Engine
        </p>
      </div>

      {/* Create Coupon */}
      <CouponForm />

      {/* Coupon List */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-left p-4">Code</th>
              <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-left p-4">Type</th>
              <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-left p-4">Value</th>
              <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-left p-4">Scope</th>
              <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-left p-4">Usage</th>
              <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-left p-4">Status</th>
              <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center font-mono text-sm text-white/30">
                  No coupons yet
                </td>
              </tr>
            ) : (
              coupons.map((coupon: Coupon) => (
                <tr key={coupon.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-sm text-volt font-bold">{coupon.code}</td>
                  <td className="p-4 font-mono text-xs text-white/50">{coupon.discountType}</td>
                  <td className="p-4 font-mono text-xs text-green-400">
                    {coupon.discountType === "PERCENT" ? `${coupon.value}%` : `$${(coupon.value / 100).toFixed(2)}`}
                  </td>
                  <td className="p-4 font-mono text-xs text-white/50">{coupon.scope}</td>
                  <td className="p-4 font-mono text-xs text-white/50">
                    {coupon.usedCount}/{coupon.usageLimit || "∞"}
                  </td>
                  <td className="p-4">
                    <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded ${
                      coupon.isActive ? "bg-green-400/10 text-green-400" : "bg-white/10 text-white/30"
                    }`}>
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <CouponActions coupon={coupon} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
