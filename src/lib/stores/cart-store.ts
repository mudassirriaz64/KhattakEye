import { create } from "zustand";

export type CartItem = {
  productId: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  oldPrice?: number;
  quantity: number;
  color: string;
  colorName: string;
  size: string;
  lensType: string;
  sku: string;
  stock: number;
};

type CartState = {
  items: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, color: string) => void;
  updateQuantity: (productId: string, color: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getShipping: () => number;
  getTotal: () => number;
  getItemCount: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  couponCode: null,
  couponDiscount: 0,

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find(
        (i) => i.productId === item.productId && i.color === item.color,
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId && i.color === item.color
              ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
              : i,
          ),
        };
      }
      return { items: [...state.items, item] };
    }),

  removeItem: (productId, color) =>
    set((state) => ({
      items: state.items.filter(
        (i) => !(i.productId === productId && i.color === color),
      ),
    })),

  updateQuantity: (productId, color, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId && i.color === color
          ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
          : i,
      ),
    })),

  clearCart: () => set({ items: [], couponCode: null, couponDiscount: 0 }),

  applyCoupon: (code) => {
    const valid = code.toUpperCase() === "KHATTAK10";
    if (valid) {
      set({ couponCode: code, couponDiscount: 0.1 });
      return true;
    }
    return false;
  },

  removeCoupon: () => set({ couponCode: null, couponDiscount: 0 }),

  getSubtotal: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getDiscount: () => {
    const { couponDiscount, getSubtotal } = get();
    return getSubtotal() * couponDiscount;
  },

  getShipping: () => {
    const subtotal = get().getSubtotal();
    return subtotal >= 3000 ? 0 : 350;
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const discount = get().getDiscount();
    const shipping = get().getShipping();
    return subtotal - discount + shipping;
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
