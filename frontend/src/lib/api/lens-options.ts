import api from "./axios";
import { type LensTypeOption } from "@/components/product/configurator/LensTypeStep";

export type LensOptionAppliesTo = "sunglasses" | "eyeglasses" | "common";

export interface ApiLensTypeEntry {
  slug: string;
  name: string;
  price?: number;
  priceOnRequest?: boolean;
  description?: string;
  info?: string;
}

export interface ApiLensBrand {
  slug: string;
  name: string;
  info?: string;
  lensTypes: ApiLensTypeEntry[];
}

export interface ApiLensCollection {
  slug: string;
  name: string;
  info?: string;
  brands?: ApiLensBrand[];
  lensTypes?: ApiLensTypeEntry[];
}

export interface ApiLensOption {
  _id: string;
  slug: string;
  appliesTo: LensOptionAppliesTo;
  name: string;
  price?: number;
  description?: string;
  info?: string;
  icon?: string;
  hasStrengthOptions: boolean;
  strengths?: { label: string; value: string }[];
  hasColorOptions: boolean;
  colors?: { label: string; value: string; hex?: string }[];
  collections?: ApiLensCollection[];
  delegatesToAppliesTo?: LensOptionAppliesTo;
  isActive: boolean;
  order: number;
}

const toLensTypeEntry = (lt: ApiLensTypeEntry): LensTypeOption => ({
  kind: "type",
  id: lt.slug,
  name: lt.name,
  price: lt.price ?? null,
  priceOnRequest: !!lt.priceOnRequest,
  description: lt.description || "",
  info: lt.info || "",
});

const toLensBrand = (b: ApiLensBrand): LensTypeOption => ({
  kind: "brand",
  id: b.slug,
  name: b.name,
  price: null,
  description: "",
  info: b.info || "",
  collections: b.lensTypes.map(toLensTypeEntry),
});

const toLensCollection = (c: ApiLensCollection): LensTypeOption => ({
  kind: "collection",
  id: c.slug,
  name: c.name,
  price: null,
  description: "",
  info: c.info || "",
  collections: c.brands
    ? c.brands.map(toLensBrand)
    : (c.lensTypes || []).map(toLensTypeEntry),
});

const toLensTypeOption = (opt: ApiLensOption): LensTypeOption => ({
  kind: "category",
  id: opt.slug,
  name: opt.name,
  price: opt.price ?? null,
  priceOnRequest: false,
  description: opt.description || "",
  info: opt.info || "",
  delegatesToAppliesTo:
    opt.delegatesToAppliesTo === "common" ? undefined : opt.delegatesToAppliesTo,
  collections: opt.collections && opt.collections.length > 0
    ? opt.collections.map(toLensCollection)
    : undefined,
  strengths: opt.hasStrengthOptions && opt.strengths
    ? opt.strengths.map((s) => s.label)
    : undefined,
  colors: opt.hasColorOptions && opt.colors
    ? opt.colors.map((c) => ({ name: c.label, hex: c.hex || c.value }))
    : undefined,
});

export const getLensOptionsApi = async (
  appliesTo: LensOptionAppliesTo
): Promise<LensTypeOption[]> => {
  const response = await api.get("/lens-options", { params: { appliesTo } });
  const list = response.data as ApiLensOption[];
  return list.map(toLensTypeOption);
};

export const getAdminLensOptionsApi = async (
  appliesTo?: LensOptionAppliesTo
): Promise<ApiLensOption[]> => {
  const response = await api.get("/admin/lens-options", {
    params: appliesTo ? { appliesTo } : {},
  });
  return response.data;
};

export const createLensOptionApi = async (
  data: Partial<ApiLensOption>
): Promise<ApiLensOption> => {
  const response = await api.post("/admin/lens-options", data);
  return response.data;
};

export const updateLensOptionApi = async (
  id: string,
  data: Partial<ApiLensOption>
): Promise<ApiLensOption> => {
  const response = await api.put(`/admin/lens-options/${id}`, data);
  return response.data;
};

export const deleteLensOptionApi = async (
  id: string
): Promise<{ message: string }> => {
  const response = await api.delete(`/admin/lens-options/${id}`);
  return response.data;
};
