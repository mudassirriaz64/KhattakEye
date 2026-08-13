import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { filterGroups } from "@/lib/shop-data";
import { useShopStore } from "@/lib/stores/shop-store";
import { Button } from "@/components/primitives/Button";
import { FilterGroup, FilterCheckbox } from "./FilterGroup";
import { PriceSlider } from "./PriceSlider";
import { FilterDropdownPopover } from "./FilterDropdownPopover";
import { ActiveFilterChips } from "./ActiveFilterChips";
import { getProducts, getBrands, type ApiProduct } from "@/lib/api/products";
import { getCategories, type Category } from "@/lib/api/categories";

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

  const [dbProducts, setDbProducts] = useState<ApiProduct[]>([]);
  const [dbBrands, setDbBrands] = useState<{ name: string; logo?: string }[]>([]);
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  useEffect(() => {
    getProducts({ limit: 100 }).then((data) => {
      if (data && data.items) {
        setDbProducts(data.items);
      }
    }).catch(() => {});

    getBrands().then((brands) => {
      if (Array.isArray(brands) && brands.length > 0) {
        setDbBrands(brands);
      }
    }).catch(() => {});

    getCategories().then((cats) => {
      if (Array.isArray(cats) && cats.length > 0) {
        setDbCategories(cats);
      }
    }).catch(() => {});
  }, []);

  const activeProductsList = dbProducts;
  const hasFilters = Object.values(selectedFilters).some((v) => v.length > 0) || priceRange[0] > 0 || priceRange[1] < 100000;

  const handleRemoveSingleFilter = (groupId: string, val: string) => {
    const current = selectedFilters[groupId] || [];
    setFilter(groupId, current.filter((v) => v !== val));
  };

  // Helper to compute option counts & path-based category filtering
  const processGroupOptions = (group: typeof filterGroups[0]) => {
    let displayOptions = group.options;

    if (group.id === "brand" && dbBrands.length > 0) {
      displayOptions = dbBrands.map((b) => ({
        label: b.name,
        value: b.name,
        count: 0
      }));
    }

    if (group.id === "category") {
      const path = window.location.pathname.toLowerCase();
      const isSunglasses = path.includes("sunglasses");
      const isEyeglasses = path.includes("eyeglasses");
      const isContactLenses = path.includes("contact-lenses");
      const isLenses = path.includes("lenses") && !isContactLenses;

      let targetCat: Category | undefined;
      if (isSunglasses) targetCat = dbCategories.find((c) => c.slug === "sunglasses" || c.name.toLowerCase().includes("sun"));
      else if (isEyeglasses) targetCat = dbCategories.find((c) => c.slug === "eyeglasses" || c.name.toLowerCase().includes("eye"));
      else if (isContactLenses) targetCat = dbCategories.find((c) => c.slug === "contact-lenses" || c.name.toLowerCase().includes("contact"));
      else if (isLenses) targetCat = dbCategories.find((c) => c.slug === "lenses");

      if (targetCat && Array.isArray(targetCat.subcategories) && targetCat.subcategories.length > 0) {
        displayOptions = targetCat.subcategories.map((sub) => ({
          label: sub.name,
          value: sub.slug || sub.name.toLowerCase().replace(/\s+/g, "-"),
          count: 0
        }));
      } else if (dbCategories.length > 0) {
        const dynamicSubs: { label: string; value: string; count: number }[] = [];
        dbCategories.forEach((cat) => {
          if (Array.isArray(cat.subcategories)) {
            cat.subcategories.forEach((sub) => {
              const val = sub.slug || sub.name.toLowerCase().replace(/\s+/g, "-");
              if (!dynamicSubs.some((s) => s.value === val)) {
                dynamicSubs.push({ label: sub.name, value: val, count: 0 });
              }
            });
          }
        });
        if (dynamicSubs.length > 0) {
          displayOptions = dynamicSubs;
        }
      }
    }

    const computedOptions = displayOptions.map((opt) => {
      const optVal = opt.value.toLowerCase();
      const optLabel = opt.label.toLowerCase();

      const dynamicCount = activeProductsList.filter((p: ApiProduct) => {
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

      return {
        ...opt,
        count: dynamicCount
      };
    });

    return computedOptions;
  };

  {/* Mobile Drawer Content */}
  const mobileDrawerContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-[color:var(--color-border)] px-5 py-4">
        <span className="font-display text-xl">Filters</span>
        <button type="button" onClick={onClose} className="rounded-full p-2 text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)]">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {filterGroups.map((group) => {
          if (group.type === "price") {
            return (
              <FilterGroup key={group.id} label={group.label}>
                <PriceSlider min={0} max={100000} value={priceRange} onChange={setPriceRange} />
              </FilterGroup>
            );
          }
          const currentValues = selectedFilters[group.id] || [];
          const options = processGroupOptions(group);

          return (
            <FilterGroup key={group.id} label={group.label}>
              {options.map((opt) => {
                const isChecked = currentValues.some((v) => v.toLowerCase() === opt.value.toLowerCase() || v.toLowerCase() === opt.label.toLowerCase());
                return (
                  <FilterCheckbox
                    key={opt.value}
                    label={opt.label}
                    count={opt.count}
                    checked={isChecked}
                    onChange={() => {
                      const isMatch = (v: string) => v.toLowerCase() === opt.value.toLowerCase() || v.toLowerCase() === opt.label.toLowerCase();
                      const next = isChecked
                        ? currentValues.filter((v) => !isMatch(v))
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
      {/* Desktop Horizontal Filter Bar (≥1024px) */}
      <div className="hidden lg:block w-full mb-6">
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4 shadow-[var(--shadow-soft)] space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {filterGroups.map((group) => {
              const options = processGroupOptions(group);
              const selectedValues = selectedFilters[group.id] || [];
              const isOpen = openPopoverId === group.id;

              return (
                <FilterDropdownPopover
                  key={group.id}
                  id={group.id}
                  label={group.label}
                  type={group.type as "checkbox" | "price"}
                  options={options}
                  selectedValues={selectedValues}
                  priceRange={priceRange}
                  isOpen={isOpen}
                  onToggle={() => setOpenPopoverId(isOpen ? null : group.id)}
                  onClose={() => setOpenPopoverId(null)}
                  onChange={(groupId, values) => setFilter(groupId, values)}
                  onPriceChange={setPriceRange}
                />
              );
            })}
          </div>

          <ActiveFilterChips
            selectedFilters={selectedFilters}
            priceRange={priceRange}
            onRemoveFilter={handleRemoveSingleFilter}
            onResetPrice={() => setPriceRange([0, 100000])}
            onClearAll={resetFilters}
          />
        </div>
      </div>

      {/* Mobile Off-Canvas Drawer (<1024px) */}
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
              {mobileDrawerContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
