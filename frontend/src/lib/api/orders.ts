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
  
  if (payload.items && Array.isArray(payload.items)) {
    for (const item of payload.items) {
      if (item.customization?.prescriptionFileCacheKey) {
        const file = prescriptionFilesCache.get(item.customization.prescriptionFileCacheKey);
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
