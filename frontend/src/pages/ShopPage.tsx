import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { ProductToolbar } from "@/components/shop/ProductToolbar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { QuickViewModal } from "@/components/quickview/QuickViewModal";
import { useShopStore } from "@/lib/stores/shop-store";

export function ShopPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchParams] = useSearchParams();
  
  const selectedFilters = useShopStore((s) => s.selectedFilters);
  const priceRange = useShopStore((s) => s.priceRange);
  const sortBy = useShopStore((s) => s.sortBy);
  const currentPage = useShopStore((s) => s.currentPage);
  
  const products = useShopStore((s) => s.products);
  const totalProducts = useShopStore((s) => s.totalProducts);
  const isLoading = useShopStore((s) => s.isLoading);
  const fetchProducts = useShopStore((s) => s.fetchProducts);

  useEffect(() => {
    const category = searchParams.get("category");
    fetchProducts(category);
  }, [selectedFilters, priceRange, sortBy, currentPage, searchParams, fetchProducts]);

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
          <ProductToolbar totalProducts={totalProducts} onFilterToggle={() => setFilterOpen(true)} />
          <div className="mt-5 relative">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[color:var(--color-primary)] border-t-transparent"></div>
              </div>
            )}
            <ProductGrid products={products} />
            {totalProducts === 0 && !isLoading && (
              <div className="py-20 text-center text-[color:var(--color-text-secondary)]">
                No products found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>

      <QuickViewModal />
    </div>
  );
}

