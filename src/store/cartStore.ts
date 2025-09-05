import { create } from "zustand";

export type Product = {
  id: number;
  name: string;
  price?: number;
};

export type CartItem = {
  cartId: string;
  id: number;
  name: string;
  price?: number;
  qty: number;
};

type CartState = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  increaseQty: (id: number) => void;
  decreaseQty: (id: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  totalCount: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addToCart: (product) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...product, qty: 1, cartId: `${product.id}-${Date.now()}` }] };
    }),

  increaseQty: (id) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, qty: i.qty + 1 } : i
      ),
    })),

  decreaseQty: (id) =>
    set((state) => {
      const item = state.items.find((i) => i.id === id);
      if (item && item.qty > 1) {
        return {
          items: state.items.map((i) =>
            i.id === id ? { ...i, qty: i.qty - 1 } : i
          ),
        };
      }
      return { items: state.items.filter((i) => i.id !== id) };
    }),

  removeFromCart: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  clearCart: () => set({ items: [] }),

  totalCount: () => get().items.reduce((acc, item) => acc + item.qty, 0),
}));
