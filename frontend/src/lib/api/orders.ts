import api from './axios';
import { prescriptionFilesCache } from '../stores/cart-store';

export type CreateOrderPayload = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    area: string;
    city: string;
    province: string;
    postalCode: string;
  };
  items: Array<{
    product: string;
    name: string;
    brand: string;
    image: string;
    price: number;
    quantity: number;
    color: string;
    customization?: any;
  }>;
  paymentMethod: 'cod' | 'bank-transfer' | 'jazzcash' | 'easypaisa';
  couponCode?: string;
  notes?: string;
};

export const createOrderApi = async (payload: CreateOrderPayload) => {
  let fileToUpload: File | null = null;
  let hasFilePrescription = false;

  if (payload.items && Array.isArray(payload.items)) {
    for (const item of payload.items) {
      if (item.customization?.prescriptionType === "file") {
        hasFilePrescription = true;
        const key = item.customization.prescriptionFileCacheKey;
        const file = key ? prescriptionFilesCache.get(key) : undefined;
        if (file) {
          fileToUpload = file;
          break;
        }
      }
    }
  }

  if (fileToUpload) {
    const formData = new FormData();
    formData.append("customerName", payload.customerName);
    formData.append("customerPhone", payload.customerPhone);
    formData.append("customerEmail", payload.customerEmail);
    formData.append("shippingAddress", JSON.stringify(payload.shippingAddress));
    formData.append("paymentMethod", payload.paymentMethod);
    if (payload.couponCode) {
      formData.append("couponCode", payload.couponCode);
    }
    if (payload.notes) {
      formData.append("notes", payload.notes);
    }

    // Strip binary file details from customized items JSON to keep payload clean
    const serializedItems = payload.items.map((item: any) => {
      if (item.customization) {
        const { prescriptionFile, ...rest } = item.customization;
        return {
          ...item,
          customization: rest
        };
      }
      return item;
    });

    formData.append("items", JSON.stringify(serializedItems));
    formData.append("prescriptionFile", fileToUpload);

    const response = await api.post('/orders', formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    
    // Clear files from memory cache after successful upload
    prescriptionFilesCache.clear();
    return response.data;
  } else {
    // Reload-safety guard (Rules.md §6b): a "file" prescription whose photo is
    // missing from the in-memory cache must not be submitted silently — the
    // customer needs to reselect the prescription photo.
    if (hasFilePrescription) {
      const error: Error & { code?: string } = new Error(
        "Your prescription photo could not be found after reload. Please remove the item from your cart and re-select your prescription photo."
      );
      error.code = "PRESCRIPTION_FILE_MISSING";
      throw error;
    }
    const response = await api.post('/orders', payload);
    return response.data;
  }
};

export const getOrderByIdApi = async (id: string) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const getMyOrdersApi = async (email?: string) => {
  const query = email ? `?email=${encodeURIComponent(email)}` : '';
  const response = await api.get(`/orders/user/my-orders${query}`);
  return response.data;
};
