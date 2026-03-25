"use client";

import { X, Tag, Check } from "lucide-react";

interface CartSummaryProps {
  readonly subtotal: number;
  readonly couponCode: string;
  readonly couponStatus: "idle" | "valid" | "invalid";
  readonly isCheckingOut: boolean;
  readonly isLoggedIn: boolean;
  readonly onCouponCodeChange: (code: string) => void;
  readonly onApplyCoupon: () => void;
  readonly onRemoveCoupon: () => void;
  readonly onCheckout: () => void;
}

export default function CartSummary({
  subtotal,
  couponCode,
  couponStatus,
  isCheckingOut,
  isLoggedIn,
  onCouponCodeChange,
  onApplyCoupon,
  onRemoveCoupon,
  onCheckout,
}: CartSummaryProps) {
  return (
    <div className="p-6 border-t border-foreground/10 bg-background flex flex-col gap-4">
      {/* Coupon Input */}
      <div className="flex gap-2">
        {couponStatus === "valid" ? (
          <div className="flex-1 flex items-center gap-2 bg-volt/10 border border-volt/30 px-4 py-3 font-mono text-xs uppercase tracking-wider text-volt">
            <Check size={14} />
            <span>{couponCode.toUpperCase()}</span>
            <button
              onClick={onRemoveCoupon}
              className="ml-auto text-foreground/40 hover:text-cyber-red"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 relative">
              <Tag
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30"
              />
              <input
                type="text"
                value={couponCode}
                onChange={(e) => onCouponCodeChange(e.target.value)}
                placeholder="Coupon code"
                className="w-full bg-foreground/5 border border-foreground/10 pl-9 pr-4 py-3 font-mono text-xs text-foreground placeholder:text-foreground/30 focus:border-volt focus:outline-none transition-colors uppercase tracking-wider"
              />
            </div>
            <button
              onClick={onApplyCoupon}
              disabled={!couponCode.trim()}
              className="px-4 py-3 border border-foreground/20 font-mono text-xs uppercase tracking-wider hover:border-volt hover:text-volt transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </>
        )}
      </div>

      <div className="flex justify-between items-center font-mono">
        <span className="text-foreground/60 uppercase tracking-widest text-sm">
          Subtotal
        </span>
        <span className="text-xl font-bold text-volt">
          ${subtotal.toFixed(2)}
        </span>
      </div>

      <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest text-center">
        Shipping and taxes calculated at secure checkout.
      </p>

      <button
        className="w-full py-4 bg-foreground text-background font-mono font-bold uppercase tracking-widest hover:bg-volt transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isCheckingOut}
        onClick={onCheckout}
      >
        {isCheckingOut
          ? "[PROCESSING_SECURE_PAYMENT...]"
          : !isLoggedIn
            ? "Sign In to Checkout"
            : "Confirm Requisition"}
      </button>
    </div>
  );
}
