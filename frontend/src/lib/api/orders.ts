import api from './axios';

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
  }>;
  paymentMethod: 'cod' | 'bank-transfer' | 'jazzcash' | 'easypaisa';
  couponCode?: string;
  notes?: string;
};

export const createOrderApi = async (payload: CreateOrderPayload) => {
  const response = await api.post('/orders', payload);
  return response.data;
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
