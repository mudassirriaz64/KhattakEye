import api from "./axios";
import { type LensTypeOption } from "@/components/product/configurator/LensTypeStep";

export type LensOptionAppliesTo = "sunglasses" | "eyeglasses";

export interface ApiLensOption {
  _id: string;
  slug: string;
  appliesTo: LensOptionAppliesTo;
  name: string;
  price: number;
  description?: string;
  info?: string;
  icon?: string;
  hasStrengthOptions: boolean;
  strengths?: { label: string; value: string }[];
  hasColorOptions: boolean;
  colors?: { label: string; value: string; hex?: string }[];
  hasTiers?: boolean;
  tiers?: { slug: string; name: string; price: number; description?: string; info?: string }[];
  delegatesToAppliesTo?: LensOptionAppliesTo;
  isActive: boolean;
  order: number;
}

const toLensTypeOption = (opt: ApiLensOption): LensTypeOption => ({
  id: opt.slug,
  name: opt.name,
  price: opt.price,
  description: opt.description || "",
  info: opt.info || "",
  delegatesToAppliesTo: opt.delegatesToAppliesTo,
  hasTiers: opt.hasTiers,
  tiers: opt.tiers,
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
