import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { ProductToolbar } from "@/components/shop/ProductToolbar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ShopBanner } from "@/components/shop/ShopBanner";
import { QuickViewModal } from "@/components/quickview/QuickViewModal";
import { allProducts, categories, sortOptions } from "@/lib/shop-data";
import { useShopStore } from "@/lib/stores/shop-store";

export function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [filterOpen, setFilterOpen] = useState(false);
  const selectedFilters = useShopStore((s) => s.selectedFilters);
  const priceRange = useShopStore((s) => s.priceRange);
  const sortBy = useShopStore((s) => s.sortBy);

  const catInfo = categories.find((c) => c.id === category);

  const filtered = useMemo(() => {
    let result = [...allProducts];

    if (category) {
      result = result.filter((p) => p.category === category);
    }

    Object.entries(selectedFilters).forEach(([groupId, values]) => {
      if (values.length === 0) return;
      if (groupId === "brand") result = result.filter((p) => values.includes(p.brand.toLowerCase().replace(/\s+/g, "-")));
      else if (groupId === "gender") result = result.filter((p) => p.gender.some((g) => values.includes(g)));
      else if (groupId === "frame-shape") result = result.filter((p) => values.includes(p.frameShape));
      else if (groupId === "frame-material") result = result.filter((p) => values.includes(p.frameMaterial));
      else if (groupId === "lens-type") result = result.filter((p) => values.includes(p.lensType));
      else if (groupId === "frame-size") result = result.filter((p) => values.includes(p.frameSize));
      else if (groupId === "availability") result = result.filter((p) => values.includes(p.availability));
    });

    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    const sort = sortOptions.find((s) => s.value === sortBy);
    if (sort) {
      result.sort((a, b) => {
        switch (sortBy) {
          case "price-asc": return a.price - b.price;
          case "price-desc": return b.price - a.price;
          case "rating": return b.rating - a.rating;
          default: return 0;
        }
      });
    }

    return result;
  }, [category, selectedFilters, priceRange, sortBy]);

  const categoryName = catInfo?.name || category?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Category";

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8">
      <Breadcrumb items={[
        { label: "Shop", path: "/shop" },
        { label: categoryName },
      ]} />

      <div className="mt-6">
        {catInfo ? (
          <ShopBanner title={catInfo.name} description={catInfo.description} image={catInfo.image} count={catInfo.productCount} />
        ) : (
          <h1 className="font-display text-4xl text-[color:var(--color-text-primary)] md:text-5xl">{categoryName}</h1>
        )}
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
