import axios from './axios';

export interface ApiProductVariant {
  color?: string;
  hexCode?: string;
  colorName?: string;
  image?: string;
  stock?: number;
}

export interface ApiProduct {
  _id?: string;
  id?: string;
  sku?: string;
  name: string;
  slug?: string;
  brand?: string;
  price?: number;
  oldPrice?: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  description?: string;
  shortDescription?: string;
  images?: (string | { url?: string })[];
  variants?: ApiProductVariant[];
  category?: string;
  subcategory?: string;
  stock?: number;
  badges?: string[];
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  gender?: string | string[];
  frameShape?: string;
  frameMaterial?: string;
  lensType?: string;
  frameSize?: string;
  discount?: number;
  weight?: string;
  uvProtection?: boolean;
  warranty?: string;
  availability?: string;
  eyeWidth?: number;
  bridgeWidth?: number;
  templeLength?: number;
}

export interface ProductCard {
  id: string;
  name: string;
  brand: string;
  slug: string;
  category: string;
  subcategory: string;
  price: number;
  oldPrice?: number;
  currency: string;
  description: string;
  shortDescription: string;
  images: string[];
  rating: number;
  reviewCount: number;
  badges: string[];
  variants: { color: string; colorName: string; image: string; stock: number }[];
  colors: { name: string; hex: string }[];
  stock: number;
  sku: string;
  gender: string[];
  frameShape: string;
  frameMaterial: string;
  lensType: string;
  frameSize: string;
  size: string;
  availability: string;
  discount: number;
  weight: string;
  uvProtection: boolean;
  warranty: string;
}

export interface PublicCategory {
  _id?: string;
  name: string;
  slug?: string;
  image?: string;
  description?: string;
  productKind?: string;
  type?: string;
  featured?: boolean;
  badges?: string[];
  discountLabel?: string;
  productCount?: number;
  subcategories?: { name?: string; slug?: string; image?: string; productCount?: number }[];
}

export interface ProductsResponse {
  items: ApiProduct[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ProductFilters {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  frameShape?: string;
  colour?: string;
  sort?: string;
  page?: number;
  limit?: number;
  featured?: boolean | string;
  isBestSeller?: boolean | string;
  isNewArrival?: boolean | string;
  gender?: string;
}

export const getProducts = async (filters: ProductFilters): Promise<ProductsResponse> => {
  const response = await axios.get('/products', { params: filters });
  return response.data;
};

export const getProductBySlug = async (slug: string): Promise<ApiProduct> => {
  const response = await axios.get(`/products/${slug}`);
  return response.data;
};

export const getBrands = async (): Promise<{ name: string; logo?: string }[]> => {
  const response = await axios.get('/brands');
  return response.data;
};

export const getCategories = async (params?: { featured?: boolean | string; type?: string; productKind?: string }): Promise<PublicCategory[]> => {
  const response = await axios.get('/public/categories', { params });
  return response.data;
};

// Map a backend Product document into the card shape used by storefront
// components (ProductGrid, ProductCard, ProductRecommendations, etc.).
// Returns the original object when it already looks like a card.
const fallbackOpticsImages = [
  "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop&q=80"
];

const getFallbackImage = (idStr: string) => {
  let hash = 0;
  for (let i = 0; i < idStr.length; i++) hash = (hash << 5) - hash + idStr.charCodeAt(i);
  return fallbackOpticsImages[Math.abs(hash) % fallbackOpticsImages.length];
};

export const sanitizeProductImages = (images: (string | { url?: string })[] | undefined): string[] => {
  const raw = images && images.length > 0 ? images : [];
  return raw
    .map((img) => (typeof img === "string" ? img : img?.url))
    .filter((url): url is string => typeof url === "string" && url.trim().length > 0 && !url.includes("trae.ai"));
};

export const productImageFallback = (idStr: string) => getFallbackImage(idStr);

export const mapProductCard = (p: ApiProduct): ProductCard => {
  if (!p) return p as unknown as ProductCard;
  if (p.id && p.images && p.images.length > 0 && p.price !== undefined && p.slug !== undefined && !p._id) return p as unknown as ProductCard;

  const validImages = sanitizeProductImages(p.images);

  const images = validImages.length > 0 ? validImages : [getFallbackImage(p.name || p.slug || "eyewear")];
  const variants = Array.isArray(p.variants) ? p.variants : [];
  const stock = p.stock !== undefined ? p.stock : 0;

  return {
    id: p._id || p.id || "",
    name: p.name || "",
    brand: p.brand || "Khattak Atelier",
    slug: p.slug || "",
    category: p.category || "Sunglasses",
    subcategory: p.subcategory || "",
    price: p.price || 0,
    oldPrice: p.oldPrice || p.originalPrice || undefined,
    currency: "Rs.",
    description: p.description || "",
    shortDescription: p.shortDescription || p.description || "",
    images,
    rating: p.rating || 0,
    reviewCount: p.reviewCount || 0,
    badges: p.badges?.length
      ? p.badges
      : [...(p.isBestSeller ? ["best-seller"] : []), ...(p.isNewArrival ? ["new-arrival"] : [])],
    variants: variants.map((v) => ({
      color: v.color || v.hexCode || "#000",
      colorName: v.colorName || "Standard",
      image: v.image || images[0] || "",
      stock: v.stock ?? stock,
    })),
    colors: variants.map((v) => ({ name: v.colorName || "Standard", hex: v.color || v.hexCode || "#000" })),
    stock,
    sku: p.sku || "",
    gender: Array.isArray(p.gender) ? p.gender : p.gender ? [p.gender] : ["unisex"],
    frameShape: p.frameShape || "aviator",
    frameMaterial: p.frameMaterial || "acetate",
    lensType: p.lensType || "polarized",
    frameSize: p.frameSize || "medium",
    size: p.frameSize || "Medium",
    availability: p.availability || (stock > 0 ? "in-stock" : "out-of-stock"),
    discount: p.discount || 0,
    weight: p.weight || "",
    uvProtection: p.uvProtection ?? false,
    warranty: p.warranty || "",
  };
};
