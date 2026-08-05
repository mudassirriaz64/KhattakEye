import axios from './axios';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  type: 'category' | 'style' | 'collection';
  badges?: string[];
  discountLabel?: string;
  featured: boolean;
}

export const getCategories = async (type?: string): Promise<Category[]> => {
  const params = type ? { type } : {};
  const response = await axios.get('/categories', { params });
  return response.data;
};
