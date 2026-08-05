import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  savedForLater: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, color: string) => void;
  updateQuantity: (productId: string, color: string, quantity: number) => void;
  saveForLater: (productId: string, color: string) => void;
  moveToCart: (productId: string, color: string) => void;
  removeSaved: (productId: string, color: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getShipping: () => number;
  getTotal: () => number;
  getItemCount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      savedForLater: [],
      couponCode: null,
      couponDiscount: 0,

      addItem: (item) => {
        const { items } = get();
        const existing = items.find((i) => i.productId === item.productId && i.color === item.color);
        if (existing) {
          set({
            items: items.map((i) =>
              i.productId === item.productId && i.color === item.color
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },

      removeItem: (productId, color) => {
        set({ items: get().items.filter((i) => !(i.productId === productId && i.color === color)) });
      },

      updateQuantity: (productId, color, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, color);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId && i.color === color ? { ...i, quantity } : i
          ),
        });
      },

      saveForLater: (productId, color) => {
        const { items, savedForLater } = get();
        const target = items.find((i) => i.productId === productId && i.color === color);
        if (!target) return;
        set({
          items: items.filter((i) => !(i.productId === productId && i.color === color)),
          savedForLater: [...savedForLater, target],
        });
      },

      moveToCart: (productId, color) => {
        const { items, savedForLater } = get();
        const target = savedForLater.find((i) => i.productId === productId && i.color === color);
        if (!target) return;
        set({
          savedForLater: savedForLater.filter((i) => !(i.productId === productId && i.color === color)),
          items: [...items, target],
        });
      },

      removeSaved: (productId, color) => {
        set({ savedForLater: get().savedForLater.filter((i) => !(i.productId === productId && i.color === color)) });
      },

      clearCart: () => set({ items: [], couponCode: null, couponDiscount: 0 }),

      applyCoupon: (code) => {
        if (code.toUpperCase() === "KHATTAK10") {
          set({ couponCode: "KHATTAK10", couponDiscount: 0.1 });
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
    }),
    {
      name: "khattak_cart_storage",
    }
  )
);
