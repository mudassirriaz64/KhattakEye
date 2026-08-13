import axios from './axios';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  productKind?: 'glasses' | 'lenses';
  type?: 'category' | 'style' | 'collection';
  badges?: string[];
  discountLabel?: string;
  subcategories?: { name: string; slug?: string; image?: string }[];
  featured: boolean;
}

export const getCategories = async (productKind?: string, type?: string): Promise<Category[]> => {
  const params: Record<string, string> = {};
  if (productKind) params.productKind = productKind;
  if (type) params.type = type;
  const response = await axios.get('/categories', { params });
  return response.data;
};
