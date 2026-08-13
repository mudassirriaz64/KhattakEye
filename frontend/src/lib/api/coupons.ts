import api from './axios';

export type CouponValidationResult = {
  valid: boolean;
  message?: string;
  coupon?: {
    code: string;
    discountPercent: number;
    minOrderValue: number;
  };
};

export const validateCouponApi = async (code: string, subtotal: number, email?: string): Promise<CouponValidationResult> => {
  const response = await api.post('/coupons/validate', { code, subtotal, email });
  return response.data;
};
