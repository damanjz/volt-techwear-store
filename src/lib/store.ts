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

  // User State
  isLoggedIn: boolean;
  voltPoints: number;
  clearanceLevel: number;
  login: () => void;
  logout: () => void;
  addPoints: (points: number) => void;
  usePoints: (points: number) => boolean;

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
          // If item exists with same ID and size, increment quantity
          const updatedCart = [...state.cart];
          updatedCart[existingItemIndex].quantity += item.quantity;
          return { cart: updatedCart, isCartOpen: true };
        } else {
          // If new item, push to array
          return { cart: [...state.cart, item], isCartOpen: true };
        }
      }),

      removeFromCart: (id, size) => set((state) => ({
        cart: state.cart.filter((item) => !(item.id === id && item.size === size))
      })),

      updateQuantity: (id, quantity, size) => set((state) => ({
        cart: state.cart.map((item) => {
          if (item.id === id && item.size === size) {
            return { ...item, quantity: Math.max(1, quantity) };
          }
          return item;
        })
      })),

      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      
      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      // --- User Initial State ---
      isLoggedIn: false,
      voltPoints: 0,
      clearanceLevel: 1,

      login: () => set({ isLoggedIn: true, voltPoints: 150, clearanceLevel: 2 }), // Give mock data on login
      logout: () => set({ isLoggedIn: false, voltPoints: 0, clearanceLevel: 1 }),
      
      addPoints: (points) => set((state) => {
        const newPoints = state.voltPoints + points;
        // Simple logic: 500 points = Level 2, 2000 points = Level 3
        let newLevel = state.clearanceLevel;
        if (newPoints >= 2000) newLevel = 3;
        else if (newPoints >= 500) newLevel = 2;
        
        return { voltPoints: newPoints, clearanceLevel: newLevel };
      }),

      usePoints: (amount) => {
        const currentPoints = get().voltPoints;
        if (currentPoints >= amount) {
          set({ voltPoints: currentPoints - amount });
          // Recalculate level if they drop below thresholds
          const newPoints = currentPoints - amount;
          let newLevel = 1;
          if (newPoints >= 2000) newLevel = 3;
          else if (newPoints >= 500) newLevel = 2;
          
          set({ clearanceLevel: newLevel });
          return true; // Purchase successful
        }
        return false; // Not enough points
      },

      // --- Theme Initial State ---
      theme: 'dark', // Default to cyberpunk dark mode
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        if (typeof document !== 'undefined') {
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        return { theme: newTheme };
      }),
    }),
    {
      name: 'volt-store-storage', // Key in local storage
      partialize: (state) => ({ cart: state.cart, isLoggedIn: state.isLoggedIn, voltPoints: state.voltPoints, clearanceLevel: state.clearanceLevel, theme: state.theme }), // Persist these fields
    }
  )
);
