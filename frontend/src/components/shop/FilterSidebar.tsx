import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { filterGroups } from "@/lib/shop-data";
import { useShopStore } from "@/lib/stores/shop-store";
import { Button } from "@/components/primitives/Button";
import { FilterGroup, FilterCheckbox } from "./FilterGroup";
import { PriceSlider } from "./PriceSlider";
import { getProducts } from "@/lib/api/products";

type FilterSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function FilterSidebar({ open, onClose }: FilterSidebarProps) {
  const selectedFilters = useShopStore((s) => s.selectedFilters);
  const priceRange = useShopStore((s) => s.priceRange);
  const setFilter = useShopStore((s) => s.setFilter);
  const setPriceRange = useShopStore((s) => s.setPriceRange);
  const resetFilters = useShopStore((s) => s.resetFilters);

  const [dbProducts, setDbProducts] = useState<any[]>([]);

  useEffect(() => {
    getProducts({ limit: 100 }).then((data) => {
      if (data && data.items) {
        setDbProducts(data.items);
      }
    }).catch(() => {});
  }, []);

  const activeProductsList = dbProducts;

  const hasFilters = Object.values(selectedFilters).some((v) => v.length > 0) || priceRange[0] > 0 || priceRange[1] < 50000;

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-[color:var(--color-border)] px-5 py-4 lg:hidden">
        <span className="font-display text-xl">Filters</span>
        <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-border)]">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-2">
        {filterGroups.map((group) => {
          if (group.type === "price") {
            return (
              <FilterGroup key={group.id} label="Price Range">
                <PriceSlider min={0} max={100000} value={priceRange} onChange={setPriceRange} />
              </FilterGroup>
            );
          }
          const currentValues = selectedFilters[group.id] || [];

          let displayOptions = group.options;
          if (group.id === "category") {
            const isEyeglasses = window.location.pathname.includes("eyeglasses");
            const isSunglasses = window.location.pathname.includes("sunglasses");

            if (isSunglasses) {
              displayOptions = group.options.filter((opt) =>
                ["polarized-shades", "driving-sunglasses", "fashion-luxury", "sports-performance"].includes(opt.value)
              );
            } else if (isEyeglasses) {
              displayOptions = group.options.filter((opt) =>
                ["prescription-glasses", "blue-light", "reading-glasses", "rimless-frames"].includes(opt.value)
              );
            }
          }

          return (
            <FilterGroup key={group.id} label={group.label}>
              {displayOptions.map((opt) => {
                const optVal = opt.value.toLowerCase();
                const optLabel = opt.label.toLowerCase();

                const dynamicCount = activeProductsList.filter((p: any) => {
                  const pCat = (p.category || "").toLowerCase();
                  const pSub = (p.subcategory || "").toLowerCase();
                  const pBrand = (p.brand || "").toLowerCase().replace(/\s+/g, "-");
                  const pBrandRaw = (p.brand || "").toLowerCase();

                  if (group.id === "category") {
                    const normSub = pSub.replace(/\s+/g, "-").replace(/&/g, "").replace(/--+/g, "-");
                    return pCat === optVal || pSub === optVal || normSub.includes(optVal) || optVal.includes(normSub) || pSub.includes(optLabel);
                  }
                  if (group.id === "brand") {
                    return pBrand === optVal || pBrandRaw === optLabel || pBrandRaw.includes(optLabel);
                  }
                  if (group.id === "gender") {
                    const genders = Array.isArray(p.gender) 
                      ? p.gender.map((g: string) => g.toLowerCase()) 
                      : [String(p.gender || "").toLowerCase()];
                    return genders.includes(optVal) || genders.includes("unisex");
                  }
                  if (group.id === "frame-shape") {
                    return (p.frameShape || "").toLowerCase() === optVal;
                  }
                  if (group.id === "frame-material") {
                    return (p.frameMaterial || "").toLowerCase().includes(optVal);
                  }
                  if (group.id === "lens-type") {
                    return (p.lensType || "").toLowerCase().includes(optVal);
                  }
                  return false;
                }).length;

                return (
                  <FilterCheckbox
                    key={opt.value}
                    label={opt.label}
                    count={dynamicCount}
                    checked={currentValues.includes(opt.value)}
                    onChange={() => {
                      const next = currentValues.includes(opt.value)
                        ? currentValues.filter((v) => v !== opt.value)
                        : [...currentValues, opt.value];
                      setFilter(group.id, next);
                    }}
                  />
                );
              })}
            </FilterGroup>
          );
        })}
      </div>
      {hasFilters && (
        <div className="border-t border-[color:var(--color-border)] p-5">
          <Button variant="outline" className="w-full" onClick={resetFilters}>Reset All Filters</Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <aside className="hidden w-[280px] shrink-0 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] lg:block">
        {content}
      </aside>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed left-0 top-0 z-50 h-full w-[85%] max-w-sm bg-[color:var(--color-app-bg)] shadow-[var(--shadow-strong)] lg:hidden"
            >
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
