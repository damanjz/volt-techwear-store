"use client";

import { useStore } from "@/lib/store";
import { X, ShoppingBag, Plus, Minus, Trash2, Tag, Check } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createOrder } from "@/lib/actions";
import { useToastStore } from "./TerminalToast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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
          ? `[REQUISITION_CONFIRMED]: Order ${result.orderId}. Saved $${result.discount.toFixed(2)}!`
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
    // Visual feedback - actual validation happens server-side during checkout
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

  if (!isMounted) return null;

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
                  {cart.reduce((total, item) => total + item.quantity, 0)} Items
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
                  <div
                    key={`${item.id}-${item.size}`}
                    className="flex gap-4 p-4 border border-foreground/5 bg-foreground/5"
                  >
                    <div className="relative w-24 h-32 bg-foreground/10 border border-foreground/10 overflow-hidden flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-col flex-1 justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-sans font-medium text-lg leading-tight pr-4">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="text-foreground/30 hover:text-cyber-red transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="font-mono text-[10px] text-foreground/50 uppercase tracking-widest mt-1">
                          {item.category}{" "}
                          {item.size ? `// Size: ${item.size}` : ""}
                        </p>
                      </div>

                      <div className="flex items-end justify-between mt-4">
                        <div className="font-mono font-bold text-volt">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center border border-foreground/20 bg-foreground/5">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity - 1,
                                item.size
                              )
                            }
                            className="p-2 text-foreground/70 hover:text-volt hover:bg-foreground/5 transition-colors disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-mono text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity + 1,
                                item.size
                              )
                            }
                            className="p-2 text-foreground/70 hover:text-volt hover:bg-foreground/5 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-foreground/10 bg-background flex flex-col gap-4">
                {/* Coupon Input */}
                <div className="flex gap-2">
                  {couponStatus === "valid" ? (
                    <div className="flex-1 flex items-center gap-2 bg-volt/10 border border-volt/30 px-4 py-3 font-mono text-xs uppercase tracking-wider text-volt">
                      <Check size={14} />
                      <span>{couponCode.toUpperCase()}</span>
                      <button
                        onClick={handleRemoveCoupon}
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
                          onChange={(e) => {
                            setCouponCode(e.target.value);
                            setCouponStatus("idle");
                          }}
                          placeholder="Coupon code"
                          className="w-full bg-foreground/5 border border-foreground/10 pl-9 pr-4 py-3 font-mono text-xs text-foreground placeholder:text-foreground/30 focus:border-volt focus:outline-none transition-colors uppercase tracking-wider"
                        />
                      </div>
                      <button
                        onClick={handleApplyCoupon}
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
                    ${getCartTotal().toFixed(2)}
                  </span>
                </div>

                <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest text-center">
                  Shipping and taxes calculated at secure checkout.
                </p>

                <button
                  className="w-full py-4 bg-foreground text-background font-mono font-bold uppercase tracking-widest hover:bg-volt transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isCheckingOut}
                  onClick={handleCheckout}
                >
                  {isCheckingOut
                    ? "[PROCESSING_SECURE_PAYMENT...]"
                    : !isLoggedIn
                      ? "Sign In to Checkout"
                      : "Confirm Requisition"}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
