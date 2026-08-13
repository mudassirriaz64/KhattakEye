import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { ProductToolbar } from "@/components/shop/ProductToolbar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { QuickViewModal } from "@/components/quickview/QuickViewModal";
import { useShopStore } from "@/lib/stores/shop-store";
import axios from "@/lib/api/axios";
import { ArrowRight, Tag } from "lucide-react";

type OfferBanner = {
  _id?: string;
  title?: string;
  subtitle?: string;
  image?: string;
  link?: string;
};

export function ShopPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [promoBanner, setPromoBanner] = useState<OfferBanner | null>(null);
  
  const selectedFilters = useShopStore((s) => s.selectedFilters);
  const priceRange = useShopStore((s) => s.priceRange);
  const sortBy = useShopStore((s) => s.sortBy);
  const currentPage = useShopStore((s) => s.currentPage);
  
  const products = useShopStore((s) => s.products);
  const totalProducts = useShopStore((s) => s.totalProducts);
  const isLoading = useShopStore((s) => s.isLoading);
  const fetchProducts = useShopStore((s) => s.fetchProducts);
  const setFilter = useShopStore((s) => s.setFilter);

  useEffect(() => {
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");

    if (brand && (!selectedFilters['brand'] || !selectedFilters['brand'].includes(brand))) {
      setFilter("brand", [brand]);
    } else {
      fetchProducts(category);
    }
  }, [selectedFilters, priceRange, sortBy, currentPage, searchParams, fetchProducts, setFilter]);

  useEffect(() => {
    axios.get("/banners?type=promotional&placement=shop-page")
      .then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setPromoBanner(res.data[0]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8">
      <Breadcrumb items={[{ label: "Shop" }]} />

      {/* Dynamic Offer / Promo Banner */}
      {promoBanner && (
        <div className="mt-4 relative overflow-hidden rounded-3xl border border-[color:var(--color-border)] shadow-md">
          <div className="relative h-48 sm:h-64 md:h-72 w-full overflow-hidden">
            {promoBanner.image ? (
              <img src={promoBanner.image} alt={promoBanner.title || "Special Offer"} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-amber-600 to-amber-900" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 max-w-xl text-white">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 px-3 py-1 text-xs font-semibold text-amber-300 w-fit mb-3 backdrop-blur-md">
                <Tag className="h-3.5 w-3.5" />
                <span>Exclusive Offer</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-bold leading-tight text-white">
                {promoBanner.title}
              </h2>
              {promoBanner.subtitle && (
                <p className="mt-2 text-xs sm:text-sm text-white/80 line-clamp-2">
                  {promoBanner.subtitle}
                </p>
              )}
              {promoBanner.link && promoBanner.link !== "/shop" && (
                <Link to={promoBanner.link} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-neutral-100 transition-colors w-fit">
                  <span>Claim Offer</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <h1 className="font-display text-4xl text-[color:var(--color-text-primary)] md:text-5xl">All Eyewear</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[color:var(--color-text-secondary)]">
          Discover our complete collection of premium eyewear. Each frame is crafted with precision and designed for those who appreciate exceptional quality.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        <FilterSidebar open={filterOpen} onClose={() => setFilterOpen(false)} />

        <div>
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

