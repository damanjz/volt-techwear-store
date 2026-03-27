import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  quantity: number;
  size?: string;
}

interface StoreState {
  // Cart State
  cart: CartItem[];
  isCartOpen: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string) => void;
  toggleCart: () => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // Theme State
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // --- Cart Initial State ---
      cart: [],
      isCartOpen: false,

      addToCart: (item) => set((state) => {
        const existingItemIndex = state.cart.findIndex(
          (cartItem) => cartItem.id === item.id && cartItem.size === item.size
        );

        if (existingItemIndex !== -1) {
          // Immutable update — create new object for the updated item
          const updatedCart = state.cart.map((cartItem, i) =>
            i === existingItemIndex
              ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
              : cartItem
          );
          return { cart: updatedCart, isCartOpen: true };
        }
        return { cart: [...state.cart, item], isCartOpen: true };
      }),

      removeFromCart: (id, size) => set((state) => ({
        cart: state.cart.filter((item) => !(item.id === id && item.size === size))
      })),

      updateQuantity: (id, quantity, size) => set((state) => ({
        cart: state.cart.map((item) =>
          item.id === id && item.size === size
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        )
      })),

      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      // --- Theme State ---
      theme: 'dark',
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'dark' ? 'light' : 'dark',
      })),
    }),
    {
      name: 'volt-store-storage',
      partialize: (state) => ({ cart: state.cart, theme: state.theme }),
    }
  )
);
