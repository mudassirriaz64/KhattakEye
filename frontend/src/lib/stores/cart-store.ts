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
  customization?: {
    prescriptionType: "none" | "manual" | "file" | "written";
    prescriptionData?: {
      od: { sph: string; cyl: string; axis: string; add: string };
      os: { sph: string; cyl: string; axis: string; add: string };
      pd: string;
      pdTwo?: { od: string; os: string };
    };
    prescriptionFileCacheKey?: string;
    prescriptionText?: string;
    lensType: string;
    tintColor?: string;
    tintStrength?: string;
    priceAdded: number;
  };
};

// Memory cache for uploaded files (since File objects cannot be persisted in LocalStorage)
export const prescriptionFilesCache = new Map<string, File>();

type CartState = {
  items: CartItem[];
  savedForLater: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, color: string, customization?: any) => void;
  updateQuantity: (productId: string, color: string, quantity: number, customization?: any) => void;
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
        const existing = items.find(
          (i) =>
            i.productId === item.productId &&
            i.color === item.color &&
            JSON.stringify(i.customization) === JSON.stringify(item.customization)
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i.productId === item.productId &&
              i.color === item.color &&
              JSON.stringify(i.customization) === JSON.stringify(item.customization)
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },

      removeItem: (productId, color, customization) => {
        set({
          items: get().items.filter(
            (i) =>
              !(
                i.productId === productId &&
                i.color === color &&
                (customization === undefined ||
                  JSON.stringify(i.customization) === JSON.stringify(customization))
              )
          ),
        });
      },

      updateQuantity: (productId, color, quantity, customization) => {
        if (quantity <= 0) {
          get().removeItem(productId, color, customization);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId &&
            i.color === color &&
            (customization === undefined ||
              JSON.stringify(i.customization) === JSON.stringify(customization))
              ? { ...i, quantity }
              : i
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
