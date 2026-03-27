"use client";

import { useStore } from "@/lib/store";
import { X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createOrder } from "@/lib/actions";
import { useToastStore } from "@/components/TerminalToast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

export default function CartDrawer() {
  const {
    isCartOpen,
    toggleCart,
    cart,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    clearCart,
  } = useStore();
  const { addToast } = useToastStore();
  const { status } = useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponStatus, setCouponStatus] = useState<
    "idle" | "valid" | "invalid"
  >("idle");

  const isLoggedIn = status === "authenticated";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      addToast(
        "[AUTH_REQUIRED]: Sign in to complete requisition.",
        "alert"
      );
      toggleCart();
      router.push("/membership");
      return;
    }

    setIsCheckingOut(true);
    try {
      const result = await createOrder(
        cart,
        getCartTotal(),
        couponCode || undefined
      );

      if (result.success) {
        const msg = result.discount
          ? `[REQUISITION_CONFIRMED]: Order ${result.orderId}. Saved $${(result.discount / 100).toFixed(2)}!`
          : `[REQUISITION_CONFIRMED]: Order ${result.orderId} initialized.`;
        addToast(msg, "success");

        if (result.pointsEarned) {
          addToast(
            `[POINTS_EARNED]: +${result.pointsEarned} Volt Points credited.`,
            "system"
          );
        }

        clearCart();
        setCouponCode("");
        setCouponStatus("idle");
        toggleCart();
        router.push("/profile");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      addToast(`[CHECKOUT_ERR]: ${message}`, "alert");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    setCouponStatus("valid");
    addToast(
      `[COUPON_STAGED]: "${couponCode.toUpperCase()}" will be validated at checkout.`,
      "system"
    );
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponStatus("idle");
  };

  const handleCouponCodeChange = (code: string) => {
    setCouponCode(code);
    setCouponStatus("idle");
  };

  if (!isMounted) return null;

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={toggleCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 right-0 w-full md:w-[480px] h-full bg-background border-l border-foreground/10 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-foreground/10 bg-foreground/5">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-volt" />
                <h2 className="font-display font-bold text-xl uppercase tracking-widest">
                  Loadout
                </h2>
                <span className="bg-volt/20 text-volt text-xs px-2 py-0.5 rounded font-mono border border-volt/30">
                  {itemCount} Items
                </span>
              </div>
              <button
                onClick={toggleCart}
                className="text-foreground/50 hover:text-cyber-red transition-colors p-2"
                aria-label="Close Loadout"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-foreground/40 gap-4">
                  <ShoppingBag size={48} className="opacity-20" />
                  <p className="font-mono uppercase tracking-widest text-sm text-center">
                    Your loadout is currently empty.
                    <br />
                    Head to the archive to gear up.
                  </p>
                  <button
                    onClick={toggleCart}
                    className="mt-4 border border-white/20 px-6 py-2 font-mono text-sm uppercase hover:border-volt hover:text-volt transition-colors"
                  >
                    Return to Store
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <CartItem
                    key={`${item.id}-${item.size}`}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {cart.length > 0 && (
              <CartSummary
                subtotal={getCartTotal()}
                couponCode={couponCode}
                couponStatus={couponStatus}
                isCheckingOut={isCheckingOut}
                isLoggedIn={isLoggedIn}
                onCouponCodeChange={handleCouponCodeChange}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={handleRemoveCoupon}
                onCheckout={handleCheckout}
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
