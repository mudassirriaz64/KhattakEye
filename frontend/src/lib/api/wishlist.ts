import axios from './axios';
import { mapProductCard } from './products';

export const getWishlistApi = async (): Promise<any[]> => {
  const res = await axios.get('/wishlist');
  return (res.data.items || []).map(mapProductCard);
};

export const addToWishlistApi = async (productId: string): Promise<any[]> => {
  const res = await axios.post(`/wishlist/${productId}`);
  return (res.data.items || []).map(mapProductCard);
};

export const removeFromWishlistApi = async (productId: string): Promise<any[]> => {
  const res = await axios.delete(`/wishlist/${productId}`);
  return (res.data.items || []).map(mapProductCard);
};
