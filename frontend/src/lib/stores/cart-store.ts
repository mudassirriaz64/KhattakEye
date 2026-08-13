import { create } from "zustand";
import { persist } from "zustand/middleware";
import { validateCouponApi } from "../api/coupons";
import { getActivePromotionsApi, type Promotion } from "../api/promotions";
import { useAuthStore } from "./auth-store";

export type CartItem = {
  productId: string;
  name: string;
  brand: string;
  category?: string;
  subcategory?: string;
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
    lensOptionSlug?: string;
    lensOptionCollectionSlug?: string;
    lensOptionBrandSlug?: string;
    lensOptionTypeSlug?: string;
    lensType: string;
    usageType?: string;
    lensCoating?: string;
    tintColor?: string;
    tintStrength?: string;
    priceAdded: number | null;
    priceOnRequest?: boolean;
  };
};

export const prescriptionFilesCache = new Map<string, File>();

export type CouponInfo = {
  code: string;
  discountPercent: number;
  minOrderValue: number;
};

type ApplyCouponResult = {
  success: boolean;
  message?: string;
  discountPercent?: number;
};

type CartState = {
  items: CartItem[];
  savedForLater: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
  couponDiscountPercent: number;
  couponInfo: CouponInfo | null;
  activePromotions: Promotion[];
  fetchPromotions: () => Promise<void>;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, color: string, customization?: any) => void;
  updateQuantity: (productId: string, color: string, quantity: number, customization?: any) => void;
  saveForLater: (productId: string, color: string) => void;
  moveToCart: (productId: string, color: string) => void;
  removeSaved: (productId: string, color: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<ApplyCouponResult>;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getPromoDiscount: () => number;
  getCouponDiscount: () => number;
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
      couponDiscountPercent: 0,
      couponInfo: null,
      activePromotions: [],

      fetchPromotions: async () => {
        try {
          const promos = await getActivePromotionsApi();
          set({ activePromotions: promos });
        } catch {
          /* optional */
        }
      },

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
              i === existing ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },

      removeItem: (productId, color, customization) => {
        const { items } = get();
        set({
          items: items.filter(
            (i) =>
              !(
                i.productId === productId &&
                i.color === color &&
                (!customization || JSON.stringify(i.customization) === JSON.stringify(customization))
              )
          ),
        });
      },

      updateQuantity: (productId, color, quantity, customization) => {
        const { items } = get();
        if (quantity <= 0) {
          get().removeItem(productId, color, customization);
          return;
        }
        set({
          items: items.map((i) =>
            i.productId === productId &&
            i.color === color &&
            (!customization || JSON.stringify(i.customization) === JSON.stringify(customization))
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

      clearCart: () => set({ items: [], couponCode: null, couponDiscount: 0, couponDiscountPercent: 0, couponInfo: null }),

      applyCoupon: async (code) => {
        const subtotal = get().getSubtotal();
        const promoDiscount = get().getPromoDiscount();
        const subtotalAfterPromo = Math.max(0, subtotal - promoDiscount);
        const email = useAuthStore.getState().user?.email;
        try {
          const result = await validateCouponApi(code, subtotalAfterPromo, email);
          if (result.valid && result.coupon) {
            const c = result.coupon;
            set({
              couponCode: c.code,
              couponDiscount: c.discountPercent / 100,
              couponDiscountPercent: c.discountPercent,
              couponInfo: c,
            });
            return { success: true, discountPercent: c.discountPercent };
          }
          return { success: false, message: result.message || "Invalid coupon code." };
        } catch (error) {
          const apiError = error as { response?: { data?: { message?: string } } };
          return { success: false, message: apiError?.response?.data?.message || "Invalid coupon code." };
        }
      },

      removeCoupon: () => set({ couponCode: null, couponDiscount: 0, couponDiscountPercent: 0, couponInfo: null }),

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getPromoDiscount: () => {
        const { items, activePromotions } = get();
        if (!items || items.length === 0 || !activePromotions || activePromotions.length === 0) return 0;
        let totalPromoDiscount = 0;
        const bogoCoveredIndices = new Set<number>();

        const bogoPromos = activePromotions.filter((p) => p.type === "bogo");
        for (const promo of bogoPromos) {
          const matchingIndices: number[] = [];
          let totalMatchingQty = 0;

          items.forEach((item, idx) => {
            const targetProdId = typeof promo.targetProduct === "object" && promo.targetProduct ? promo.targetProduct._id : promo.targetProduct;
            const matchesProd = targetProdId && String(item.productId) === String(targetProdId);
            const matchesCat = promo.targetCategory && String(item.category || "").toLowerCase() === String(promo.targetCategory).toLowerCase();
            const matchesSubCat = !promo.targetSubCategory || String(item.subcategory || "").toLowerCase() === String(promo.targetSubCategory).toLowerCase();
            if (matchesProd || (matchesCat && matchesSubCat)) {
              matchingIndices.push(idx);
              totalMatchingQty += item.quantity;
            }
          });

          if (totalMatchingQty >= 2 && matchingIndices.length > 0) {
            let lowestPrice = Infinity;
            matchingIndices.forEach((idx) => {
              bogoCoveredIndices.add(idx);
              if (items[idx].price < lowestPrice) {
                lowestPrice = items[idx].price;
              }
            });
            if (Number.isFinite(lowestPrice) && lowestPrice > 0) {
              totalPromoDiscount += lowestPrice;
            }
          }
        }

        const catPromos = activePromotions.filter((p) => p.type === "category-percent-off");
        for (const promo of catPromos) {
          if (!promo.targetCategory || !promo.discountPercent) continue;
          let catDiscount = 0;
          items.forEach((item, idx) => {
            if (bogoCoveredIndices.has(idx)) return;
            const matchesCat = String(item.category || "").toLowerCase() === String(promo.targetCategory).toLowerCase();
            const matchesSubCat = !promo.targetSubCategory || String(item.subcategory || "").toLowerCase() === String(promo.targetSubCategory).toLowerCase();
            if (matchesCat && matchesSubCat) {
              catDiscount += Math.round((item.price * item.quantity * promo.discountPercent!) / 100);
            }
          });
          totalPromoDiscount += catDiscount;
        }

        return totalPromoDiscount;
      },

      getCouponDiscount: () => {
        const { couponDiscountPercent, getSubtotal, getPromoDiscount } = get();
        if (!couponDiscountPercent || couponDiscountPercent <= 0) return 0;
        const subtotal = getSubtotal();
        const promoDiscount = getPromoDiscount();
        const subtotalAfterPromo = Math.max(0, subtotal - promoDiscount);
        return Math.round((subtotalAfterPromo * couponDiscountPercent) / 100);
      },

      getDiscount: () => {
        return get().getPromoDiscount() + get().getCouponDiscount();
      },

      getShipping: () => {
        const subtotal = get().getSubtotal();
        return subtotal >= 3000 ? 0 : 350;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const shipping = get().getShipping();
        return Math.max(0, subtotal - discount + shipping);
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
