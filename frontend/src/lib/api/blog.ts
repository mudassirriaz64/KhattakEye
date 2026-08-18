import api from './axios';

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  tags: string[];
  author: string;
  status: string;
  featured: boolean;
  views: number;
  publishedAt: string;
  createdAt: string;
}

export const getBlogs = async (page = 1, limit = 12, tag?: string) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (tag) params.set('tag', tag);
  const response = await api.get(`/blogs?${params.toString()}`);
  return response.data as { blogs: BlogPost[]; total: number; page: number; pages: number };
};

export const getBlogBySlug = async (slug: string) => {
  const response = await api.get(`/blogs/${slug}`);
  return response.data as BlogPost;
};
