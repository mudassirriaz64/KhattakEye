import { create } from "zustand";

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

  setStep: (step: number) => void;
  setCustomer: (customer: CustomerInfo) => void;
  setAddress: (address: ShippingAddress) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setTransactionId: (id: string) => void;
  setPaymentScreenshot: (url: string | null) => void;
  setPaymentNotes: (notes: string) => void;
  setAgreedToTerms: (agreed: boolean) => void;
  placeOrder: () => void;
  reset: () => void;
};

export const useCheckoutStore = create<CheckoutState>((set) => ({
  step: 1,
  customer: { fullName: "", phone: "", email: "" },
  address: { province: "", city: "", area: "", street: "", postalCode: "" },
  payment: { method: null, transactionId: "", paymentScreenshot: null, paymentNotes: "" },
  agreedToTerms: false,
  orderPlaced: false,
  orderNumber: null,

  setStep: (step) => set({ step }),
  setCustomer: (customer) => set({ customer }),
  setAddress: (address) => set({ address }),
  setPaymentMethod: (method) => set({ payment: { method, transactionId: "", paymentScreenshot: null, paymentNotes: "" } }),
  setTransactionId: (id) => set((s) => ({ payment: { ...s.payment, transactionId: id } })),
  setPaymentScreenshot: (url) => set((s) => ({ payment: { ...s.payment, paymentScreenshot: url } })),
  setPaymentNotes: (notes) => set((s) => ({ payment: { ...s.payment, paymentNotes: notes } })),
  setAgreedToTerms: (agreed) => set({ agreedToTerms: agreed }),

  placeOrder: () => {
    const num = `KT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    set({ orderPlaced: true, orderNumber: num, step: 4 });
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
    }),
}));
