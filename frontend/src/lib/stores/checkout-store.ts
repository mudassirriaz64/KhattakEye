import { create } from "zustand";
import { useCartStore } from "./cart-store";
import { createOrderApi } from "@/lib/api/orders";

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

export type PaymentMethod = "bank-transfer" | "jazzcash" | "easypaisa" | "cod" | null;

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
  agreedToTerms: boolean;
  orderPlaced: boolean;
  orderNumber: string | null;
  orderError: string | null;

  setStep: (step: number) => void;
  setCustomer: (customer: CustomerInfo) => void;
  setAddress: (address: ShippingAddress) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
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
  agreedToTerms: false,
  orderPlaced: false,
  orderNumber: null,
  orderError: null,

  setStep: (step) => set({ step }),
  setCustomer: (customer) => set({ customer }),
  setAddress: (address) => set({ address }),
  setPaymentMethod: (method) => set({ payment: { method, transactionId: "", paymentScreenshot: null, paymentNotes: "" } }),
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

      const orderData = await createOrderApi({
        customerName: state.customer.fullName || "Valued Customer",
        customerPhone: state.customer.phone || "03001234567",
        customerEmail: state.customer.email || "customer@khattakeye.com",
        shippingAddress: {
          fullName: state.customer.fullName || "Valued Customer",
          phone: state.customer.phone || "03001234567",
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
          color: i.colorName || i.color
        })),
        paymentMethod: (state.payment.method as any) || "cod",
        couponCode: cartStore.couponCode || undefined
      });

      cartStore.clearCart();
      set({ orderPlaced: true, orderNumber: orderData.orderNumber, step: 4 });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
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
