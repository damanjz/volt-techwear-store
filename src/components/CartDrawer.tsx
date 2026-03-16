"use client";

import { useStore } from "@/lib/store";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createOrder } from "@/lib/actions";
import { useToastStore } from "./TerminalToast";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { isCartOpen, toggleCart, cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useStore();
  const { addToast } = useToastStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Prevent hydration errors by only rendering cart contents client-side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const result = await createOrder(cart, getCartTotal());
      
      if (result.success) {
        addToast(`[REQUISITION_CONFIRMED]: Order ${result.orderId} initialized.`, "success");
        clearCart();
        toggleCart();
        router.push("/profile");
      }
    } catch (error: any) {
      addToast(`[CHECKOUT_ERR]: ${error.message || "Unknown error"}`, "alert");
    } finally {
      setIsCheckingOut(false);
    }
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
                <h2 className="font-display font-bold text-xl uppercase tracking-widest">Loadout</h2>
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
                  <p className="font-mono uppercase tracking-widest text-sm text-center">Your loadout is currently empty.<br/>Head to the archive to gear up.</p>
                  <button 
                    onClick={toggleCart}
                    className="mt-4 border border-white/20 px-6 py-2 font-mono text-sm uppercase hover:border-volt hover:text-volt transition-colors"
                  >
                    Return to Store
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4 p-4 border border-foreground/5 bg-foreground/5">
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
                          <h3 className="font-sans font-medium text-lg leading-tight pr-4">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="text-foreground/30 hover:text-cyber-red transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="font-mono text-[10px] text-foreground/50 uppercase tracking-widest mt-1">
                          {item.category} {item.size ? `// Size: ${item.size}` : ''}
                        </p>
                      </div>
                      
                      <div className="flex items-end justify-between mt-4">
                        <div className="font-mono font-bold text-volt">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-foreground/20 bg-foreground/5">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                            className="p-2 text-foreground/70 hover:text-volt hover:bg-foreground/5 transition-colors disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-mono text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
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
                <div className="flex justify-between items-center font-mono">
                  <span className="text-foreground/60 uppercase tracking-widest text-sm">Subtotal</span>
                  <span className="text-xl font-bold text-volt">${getCartTotal().toFixed(2)}</span>
                </div>
                
                <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest text-center">
                  Shipping and taxes calculated at secure checkout.
                </p>

                <button 
                  className="w-full py-4 bg-foreground text-background font-mono font-bold uppercase tracking-widest hover:bg-volt transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isCheckingOut}
                  onClick={handleCheckout}
                >
                  {isCheckingOut ? '[PROCESSING_SECURE_PAYMENT...]' : 'Confirm Requisition'}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
