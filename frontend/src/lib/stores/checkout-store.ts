import { create } from "zustand";
import { useCartStore, prescriptionFilesCache } from "./cart-store";
import { createOrderApi } from "@/lib/api/orders";
import axios from "@/lib/api/axios";

export type CustomerInfo = {
  fullName: string;
  phone: string;
  email: string;
};

export type ShippingAddress = {
  province: string;
  city: string;
  area: string;
  street: string;
  postalCode: string;
};

export type PaymentMethod = "bank-transfer" | "jazzcash" | "easypaisa" | "cod" | (string & {}) | null;

export type PaymentDetails = {
  method: PaymentMethod;
  transactionId: string;
  paymentScreenshot: string | null;
  paymentNotes: string;
};

type CheckoutState = {
  step: number;
  customer: CustomerInfo;
  address: ShippingAddress;
  payment: PaymentDetails;
  shippingMethod: "standard" | "express";
  shippingConfig: { freeThreshold: number; standardRate: number; expressRate: number; estimatedDays: string };
  agreedToTerms: boolean;
  orderPlaced: boolean;
  orderNumber: string | null;
  orderError: string | null;

  setStep: (step: number) => void;
  setCustomer: (customer: CustomerInfo) => void;
  setAddress: (address: ShippingAddress) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setShippingMethod: (method: "standard" | "express") => void;
  fetchShippingConfig: () => Promise<void>;
  getShippingFee: (subtotal: number) => number;
  setTransactionId: (id: string) => void;
  setPaymentScreenshot: (url: string | null) => void;
  setPaymentNotes: (notes: string) => void;
  setAgreedToTerms: (agreed: boolean) => void;
  placeOrder: () => Promise<void>;
  reset: () => void;
};

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  step: 1,
  customer: { fullName: "", phone: "", email: "" },
  address: { province: "", city: "", area: "", street: "", postalCode: "" },
  payment: { method: null, transactionId: "", paymentScreenshot: null, paymentNotes: "" },
  shippingMethod: "standard",
  shippingConfig: { freeThreshold: 15000, standardRate: 350, expressRate: 750, estimatedDays: "3-5 business days" },
  agreedToTerms: false,
  orderPlaced: false,
  orderNumber: null,
  orderError: null,

  setStep: (step) => set({ step }),
  setCustomer: (customer) => set({ customer }),
  setAddress: (address) => set({ address }),
  setPaymentMethod: (method) => set({ payment: { method, transactionId: "", paymentScreenshot: null, paymentNotes: "" } }),
  setShippingMethod: (method) => set({ shippingMethod: method }),
  
  fetchShippingConfig: async () => {
    try {
      const res = await axios.get("/settings");
      if (res.data?.shipping) {
        const s = res.data.shipping;
        set({
          shippingConfig: {
            freeThreshold: Number(s.freeThreshold ?? s.freeDeliveryThreshold ?? 15000),
            standardRate: Number(s.standardRate ?? s.flatRate ?? 350),
            expressRate: Number(s.expressRate ?? 750),
            estimatedDays: String(s.estimatedDays || "3-5 business days")
          }
        });
      }
    } catch (e) {}
  },

  getShippingFee: (subtotal: number) => {
    const { shippingMethod, shippingConfig } = get();
    if (shippingMethod === "express") {
      return shippingConfig.expressRate;
    }
    return subtotal >= shippingConfig.freeThreshold ? 0 : shippingConfig.standardRate;
  },
  setTransactionId: (id) => set((s) => ({ payment: { ...s.payment, transactionId: id } })),
  setPaymentScreenshot: (url) => set((s) => ({ payment: { ...s.payment, paymentScreenshot: url } })),
  setPaymentNotes: (notes) => set((s) => ({ payment: { ...s.payment, paymentNotes: notes } })),
  setAgreedToTerms: (agreed) => set({ agreedToTerms: agreed }),

  placeOrder: async () => {
    set({ orderError: null });
    try {
      const state = get();
      const cartStore = useCartStore.getState();
      const items = cartStore.items;

      // Reload guard: a "file" prescription keeps its File in an in-memory cache
      // (not persisted to LocalStorage). If the page was reloaded after adding the
      // item, the file is gone — the order would silently submit without it. Block.
      const missingFileItem = items.find((i) => {
        const cust = i.customization;
        return (
          cust?.prescriptionType === "file" &&
          !!cust.prescriptionFileCacheKey &&
          !prescriptionFilesCache.get(cust.prescriptionFileCacheKey)
        );
      });
      if (missingFileItem) {
        const message =
          `The prescription photo for "${missingFileItem.name}" is no longer available. ` +
          `Please remove the item from your cart and re-select your prescription photo.`;
        set({ orderError: message });
        return;
      }

      if (!state.customer.phone || !state.customer.phone.trim()) {
        set({ orderError: "Please provide a valid contact phone number." });
        return;
      }

      const orderData = await createOrderApi({
        customerName: state.customer.fullName || "Valued Customer",
        customerPhone: state.customer.phone.trim(),
        customerEmail: state.customer.email || "customer@khattakeye.com",
        shippingAddress: {
          fullName: state.customer.fullName || "Valued Customer",
          phone: state.customer.phone.trim(),
          street: state.address.street || "Main Boulevard",
          area: state.address.area || "Gulberg III",
          city: state.address.city || "Lahore",
          province: state.address.province || "Punjab",
          postalCode: state.address.postalCode || "54000"
        },
        items: items.map((i) => ({
          product: i.productId,
          name: i.name,
          brand: i.brand,
          image: i.image,
          price: i.price,
          quantity: i.quantity,
          color: i.colorName || i.color,
          customization: i.customization
        })),
        paymentMethod: state.payment.method || "cod",
        shippingMethod: state.shippingMethod,
        transactionId: state.payment.transactionId || undefined,
        paymentScreenshot: state.payment.paymentScreenshot || undefined,
        paymentNotes: state.payment.paymentNotes || undefined,
        couponCode: cartStore.couponCode || undefined
      });

      cartStore.clearCart();
      set({ orderPlaced: true, orderNumber: orderData.orderNumber, step: 4 });
    } catch (err) {
      const apiErr = err as { response?: { data?: { message?: string } }; message?: string };
      const message =
        apiErr?.response?.data?.message ||
        apiErr?.message ||
        "We couldn't place your order. Please try again.";
      set({ orderError: message });
      throw err;
    }
  },

  reset: () =>
    set({
      step: 1,
      customer: { fullName: "", phone: "", email: "" },
      address: { province: "", city: "", area: "", street: "", postalCode: "" },
      payment: { method: null, transactionId: "", paymentScreenshot: null, paymentNotes: "" },
      agreedToTerms: false,
      orderPlaced: false,
      orderNumber: null,
      orderError: null,
    }),
}));
