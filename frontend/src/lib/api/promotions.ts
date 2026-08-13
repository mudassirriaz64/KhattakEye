import axios from "./axios";

export interface Promotion {
  _id: string;
  name: string;
  type: "bogo" | "category-percent-off";
  targetProduct?: {
    _id: string;
    name: string;
    brand: string;
    slug: string;
    price: number;
    images: string[];
  } | string | null;
  targetCategory?: string | null;
  targetSubCategory?: string | null;
  discountPercent?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  badgeText?: string;
  createdAt?: string;
}

export async function getActivePromotionsApi(): Promise<Promotion[]> {
  try {
    const res = await axios.get("/promotions/active");
    return res.data || [];
  } catch (err) {
    console.error("Failed to fetch active promotions:", err);
    return [];
  }
}

export async function getAdminPromotionsApi(): Promise<Promotion[]> {
  const res = await axios.get("/admin/promotions");
  return res.data.items || [];
}

export async function createAdminPromotionApi(payload: Partial<Promotion>): Promise<Promotion> {
  const res = await axios.post("/admin/promotions", payload);
  return res.data;
}

export async function updateAdminPromotionApi(id: string, payload: Partial<Promotion>): Promise<Promotion> {
  const res = await axios.put(`/admin/promotions/${id}`, payload);
  return res.data;
}

export async function deleteAdminPromotionApi(id: string): Promise<void> {
  await axios.delete(`/admin/promotions/${id}`);
}
