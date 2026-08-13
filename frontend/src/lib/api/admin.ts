import api from './axios';
import type { ApiCategory } from '@/lib/admin-data';

export const adminLoginApi = async (email: string, password: string, rememberMe: boolean) => {
  const response = await api.post('/admin/auth/login', { email, password, rememberMe });
  return response.data;
};

export const adminLogoutApi = async () => {
  const response = await api.post('/admin/auth/logout');
  return response.data;
};

export const adminGetProfileApi = async () => {
  const response = await api.get('/admin/auth/me');
  return response.data;
};

export interface AdminProductFilters {
  kind?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  stock?: string;
  featured?: string;
  search?: string;
  trashed?: string;
}

export const adminGetProductsApi = async (page = 1, limit = 50, filters: AdminProductFilters = {}) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const response = await api.get(`/admin/products?${params.toString()}`);
  return response.data;
};

export const adminDeleteProductApi = async (id: string) => {
  const response = await api.delete(`/admin/products/${id}`);
  return response.data;
};

export const adminRestoreProductApi = async (id: string) => {
  const response = await api.post(`/admin/products/${id}/restore`);
  return response.data;
};

export const adminPermanentDeleteProductApi = async (id: string) => {
  const response = await api.delete(`/admin/products/${id}/permanent`);
  return response.data;
};

export const adminGetProductByIdApi = async (id: string) => {
  const response = await api.get(`/admin/products/${id}`);
  return response.data;
};

export const createProductApi = async (formData: FormData) => {
  const response = await api.post('/admin/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateProductApi = async (id: string, formData: FormData) => {
  const response = await api.put(`/admin/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getCategoriesApi = async (productKind?: string, type?: string): Promise<ApiCategory[]> => {
  const params = new URLSearchParams();
  if (productKind) params.append('productKind', productKind);
  if (type) params.append('type', type);
  const queryString = params.toString() ? `?${params.toString()}` : '';
  const response = await api.get(`/categories${queryString}`);
  return response.data;
};

export const getPublicProductsApi = async (page = 1, limit = 100, kind?: string) => {
  try {
    const query = kind ? `&kind=${kind}` : '';
    const response = await api.get(`/products?page=${page}&limit=${limit}${query}`);
    return response.data;
  } catch {
    const query = kind ? `&kind=${kind}` : '';
    const response = await api.get(`/admin/products?page=${page}&limit=${limit}${query}`);
    return response.data;
  }
};

export const adminGetOrdersApi = async (page = 1, limit = 50, status?: string) => {
  const query = status ? `&status=${status}` : '';
  const response = await api.get(`/admin/orders?page=${page}&limit=${limit}${query}`);
  return response.data;
};

export const adminUpdateOrderStatusApi = async (id: string, status: string) => {
  const response = await api.patch(`/admin/orders/${id}/status`, { status });
  return response.data;
};

export const adminVerifyPaymentApi = async (id: string, action: 'approve' | 'reject', rejectionReason?: string) => {
  const response = await api.patch(`/admin/orders/${id}/verify-payment`, { action, rejectionReason });
  return response.data;
};

export const adminGetDashboardStatsApi = async () => {
  const response = await api.get('/admin/dashboard-stats');
  return response.data;
};

export const adminCreateCategoryApi = async (data: { name: string; description?: string; productKind?: string; type?: string }) => {
  const response = await api.post('/admin/categories', data);
  return response.data;
};

export const adminDeleteCategoryApi = async (id: string) => {
  const response = await api.delete(`/admin/categories/${id}`);
  return response.data;
};

export interface CategoryUpdateData {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  productKind?: string;
  type?: string;
  featured?: boolean;
  status?: string;
  subcategories?: {
    _id?: string;
    name: string;
    slug: string;
    description?: string;
    group?: string;
    productCount?: number;
  }[];
}

export const adminUpdateCategoryApi = async (id: string, data: CategoryUpdateData) => {
  const response = await api.put(`/admin/categories/${id}`, data);
  return response.data;
};

export const adminGetBrandsApi = async () => {
  const response = await api.get('/admin/brands');
  return response.data;
};

export interface BrandDataPayload {
  name?: string;
  logo?: string;
  tagline?: string;
  description?: string;
  website?: string;
  featured?: boolean;
  status?: string;
}

export const adminCreateBrandApi = async (data: BrandDataPayload) => {
  const response = await api.post('/admin/brands', data);
  return response.data;
};

export const adminUpdateBrandApi = async (id: string, data: BrandDataPayload) => {
  const response = await api.put(`/admin/brands/${id}`, data);
  return response.data;
};

export const adminDeleteBrandApi = async (id: string) => {
  const response = await api.delete(`/admin/brands/${id}`);
  return response.data;
};

export const adminUpdateProductApi = async (id: string, data: { stock?: number }) => {
  const response = await api.put(`/admin/products/${id}`, data);
  return response.data;
};

export const adminSetOrderItemPriceApi = async (id: string, itemIndex: number, price: number) => {
  const response = await api.patch(`/admin/orders/${id}/items/${itemIndex}/set-price`, { price });
  return response.data;
};

export const adminGetUsersApi = async (page = 1, limit = 50) => {
  const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
  return response.data;
};
