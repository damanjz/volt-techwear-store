"use client";

import { createCoupon } from "@/lib/admin-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";

export default function CouponForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createCoupon(formData);
      setOpen(false);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create coupon");
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-volt text-black font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-volt/80 transition-colors font-bold"
      >
        <Plus size={14} />
        New Coupon
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
      <h2 className="font-display font-bold text-lg uppercase tracking-tight mb-4">
        Create Coupon
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1">Code</label>
          <input name="code" required placeholder="VOLT20" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-mono text-sm text-white focus:border-volt focus:outline-none" />
        </div>
        <div>
          <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1">Discount Type</label>
          <select name="discountType" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-mono text-sm text-white focus:border-volt focus:outline-none">
            <option value="PERCENT">Percent (%)</option>
            <option value="FLAT">Flat ($)</option>
          </select>
        </div>
        <div>
          <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1">Value</label>
          <input name="value" type="number" step="0.01" required placeholder="20" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-mono text-sm text-white focus:border-volt focus:outline-none" />
        </div>
        <div>
          <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1">Scope</label>
          <select name="scope" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-mono text-sm text-white focus:border-volt focus:outline-none">
            <option value="SITE">Site-wide</option>
            <option value="CATEGORY">Category</option>
          </select>
        </div>
        <div>
          <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1">Usage Limit (0=Unlimited)</label>
          <input name="usageLimit" type="number" defaultValue="0" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-mono text-sm text-white focus:border-volt focus:outline-none" />
        </div>
        <div>
          <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1">Expires At</label>
          <input name="expiresAt" type="datetime-local" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-mono text-sm text-white focus:border-volt focus:outline-none" />
        </div>
      </div>
      <div>
        <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1">Description</label>
        <input name="description" placeholder="20% off everything" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-mono text-sm text-white focus:border-volt focus:outline-none" />
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="bg-volt text-black font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-volt/80 font-bold disabled:opacity-50">
          {saving ? "Creating..." : "Create Coupon"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="font-mono text-xs text-white/40 hover:text-white uppercase tracking-widest px-4 py-2">
          Cancel
        </button>
      </div>
    </form>
  );
}
