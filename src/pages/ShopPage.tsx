import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { ProductToolbar } from "@/components/shop/ProductToolbar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { QuickViewModal } from "@/components/quickview/QuickViewModal";
import { allProducts, sortOptions } from "@/lib/shop-data";
import { useShopStore } from "@/lib/stores/shop-store";

export function ShopPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const selectedFilters = useShopStore((s) => s.selectedFilters);
  const priceRange = useShopStore((s) => s.priceRange);
  const sortBy = useShopStore((s) => s.sortBy);

  const filtered = useMemo(() => {
    let result = [...allProducts];

    const catParam = searchParams.get("category");
    if (catParam) {
      result = result.filter((p) => p.category === catParam);
    }

    Object.entries(selectedFilters).forEach(([groupId, values]) => {
      if (values.length === 0) return;
      if (groupId === "category") result = result.filter((p) => values.includes(p.category));
      else if (groupId === "brand") result = result.filter((p) => values.includes(p.brand.toLowerCase().replace(/\s+/g, "-")));
      else if (groupId === "gender") result = result.filter((p) => p.gender.some((g) => values.includes(g)));
      else if (groupId === "frame-shape") result = result.filter((p) => values.includes(p.frameShape));
      else if (groupId === "frame-material") result = result.filter((p) => values.includes(p.frameMaterial));
      else if (groupId === "lens-type") result = result.filter((p) => values.includes(p.lensType));
      else if (groupId === "lens-color") result = result.filter((p) => values.includes(p.lensColor));
      else if (groupId === "frame-color") result = result.filter((p) => values.includes(p.frameColor));
      else if (groupId === "frame-size") result = result.filter((p) => values.includes(p.frameSize));
      else if (groupId === "availability") result = result.filter((p) => values.includes(p.availability));
      else if (groupId === "discount") {
        const minDiscount = Math.min(...values.map(Number));
        result = result.filter((p) => p.discount && p.discount >= minDiscount);
      }
    });

    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    const sort = sortOptions.find((s) => s.value === sortBy);
    if (sort) {
      result.sort((a, b) => {
        switch (sortBy) {
          case "price-asc": return a.price - b.price;
          case "price-desc": return b.price - a.price;
          case "rating": return b.rating - a.rating;
          case "newest": return (b.discount || 0) - (a.discount || 0);
          case "popular": return b.reviewCount - a.reviewCount;
          default: return 0;
        }
      });
    }

    return result;
  }, [selectedFilters, priceRange, sortBy, searchParams]);

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8">
      <Breadcrumb items={[{ label: "Shop" }]} />

      <div className="mt-4">
        <h1 className="font-display text-4xl text-[color:var(--color-text-primary)] md:text-5xl">All Eyewear</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[color:var(--color-text-secondary)]">
          Discover our complete collection of premium eyewear. Each frame is crafted with precision and designed for those who appreciate exceptional quality.
        </p>
      </div>

      <div className="mt-8 flex gap-6">
        <FilterSidebar open={filterOpen} onClose={() => setFilterOpen(false)} />

        <div className="min-w-0 flex-1">
          <ProductToolbar totalProducts={filtered.length} onFilterToggle={() => setFilterOpen(true)} />
          <div className="mt-5">
            <ProductGrid products={filtered} />
          </div>
        </div>
      </div>

      <QuickViewModal />
    </div>
  );
}
