import axios from './axios';
import { mapProductCard, type ProductCard } from './products';

export const getWishlistApi = async (): Promise<ProductCard[]> => {
  const res = await axios.get('/wishlist');
  return (res.data.items || []).map(mapProductCard);
};

export const addToWishlistApi = async (productId: string): Promise<ProductCard[]> => {
  const res = await axios.post(`/wishlist/${productId}`);
  return (res.data.items || []).map(mapProductCard);
};

export const removeFromWishlistApi = async (productId: string): Promise<ProductCard[]> => {
  const res = await axios.delete(`/wishlist/${productId}`);
  return (res.data.items || []).map(mapProductCard);
};
