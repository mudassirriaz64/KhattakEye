import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { ProductToolbar } from "@/components/shop/ProductToolbar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ShopBanner } from "@/components/shop/ShopBanner";
import { QuickViewModal } from "@/components/quickview/QuickViewModal";
import { categories, sortOptions } from "@/lib/shop-data";
import { useShopStore } from "@/lib/stores/shop-store";
import { getProducts, mapProductCard } from "@/lib/api/products";
import { type Product } from "@/lib/shop-data";

export function CategoryPage() {
  const { category, subcategory } = useParams<{ category: string; subcategory?: string }>();
  const [filterOpen, setFilterOpen] = useState(false);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);

  const selectedFilters = useShopStore((s) => s.selectedFilters);
  const priceRange = useShopStore((s) => s.priceRange);
  const sortBy = useShopStore((s) => s.sortBy);

  const navigate = useNavigate();

  const resetFilters = useShopStore((s) => s.resetFilters);

  useEffect(() => {
    resetFilters();
  }, [category, subcategory, resetFilters]);

  useEffect(() => {
    const cat = category?.toLowerCase();
    const sub = subcategory?.toLowerCase();
    if (cat === "lenses" && (sub === "computer" || sub === "computer-lenses")) {
      navigate("/shop/lenses/computer", { replace: true });
      return;
    }
    if (cat === "lenses" && (sub === "anti-reflective" || sub === "anti-glare" || sub === "antiglare")) {
      navigate("/shop/lenses/anti-reflective", { replace: true });
      return;
    }
    if (cat === "lenses" && (sub === "photochromic" || sub === "transition" || sub === "photochromic-lenses")) {
      navigate("/shop/lenses/photochromic", { replace: true });
      return;
    }

    getProducts({ limit: 100 }).then((data) => {
      if (data && data.items) {
        setDbProducts(data.items.map(mapProductCard) as unknown as Product[]);
      } else {
        setDbProducts([]);
      }
    }).catch(() => setDbProducts([]));
  }, [category, subcategory, navigate]);

  const catInfo = categories.find((c) => c.id === category);

  const filtered = useMemo(() => {
    let result = [...dbProducts];

    if (category) {
      const target = category.toLowerCase();
      const targetSub = subcategory?.toLowerCase();
      result = result.filter((p) => {
        const pCat = p.category?.toLowerCase();
        const pSub = p.subcategory?.toLowerCase();
        const pKind = (p as any).kind?.toLowerCase();
        
        // Match parent category
        const parentMatches =
          pCat === target ||
          (pCat || "").replace(/\s+/g, "-") === target ||
          (target === "lenses" && (pCat === "lenses" || pCat === "contact-lenses" || pKind === "lenses" || pKind === "lens")) ||
          (target === "contact-lenses" && (pCat === "contact-lenses" || pCat === "contact lenses" || pSub === "contact-lenses" || pKind === "lenses")) ||
          (target === "sunglasses" && (pCat === "sunglasses" || pKind === "glasses")) ||
          (target === "eyeglasses" && (pCat === "eyeglasses" || pKind === "glasses"));
        
        if (!parentMatches) return false;
        
        // Match subcategory if path param is present
        if (targetSub) {
          return pSub === targetSub || (pSub || "").replace(/\s+/g, "-") === targetSub;
        }
        return true;
      });
    }

    Object.entries(selectedFilters).forEach(([groupId, values]) => {
      if (values.length === 0) return;
      if (groupId === "category") {
        result = result.filter((p) => values.includes(p.subcategory?.toLowerCase()) || values.includes(p.category?.toLowerCase()));
      }
      else if (groupId === "brand") result = result.filter((p) => values.includes(p.brand.toLowerCase().replace(/\s+/g, "-")));
      else if (groupId === "gender") result = result.filter((p) => p.gender && p.gender.some((g: string) => values.includes(g)));
      else if (groupId === "frame-shape") result = result.filter((p) => values.includes(p.frameShape?.toLowerCase()));
      else if (groupId === "frame-material") result = result.filter((p) => values.includes(p.frameMaterial?.toLowerCase()));
      else if (groupId === "lens-type") result = result.filter((p) => values.includes(p.lensType?.toLowerCase()));
      else if (groupId === "frame-size") result = result.filter((p) => values.includes(p.frameSize?.toLowerCase()));
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
  }, [category, subcategory, dbProducts, selectedFilters, priceRange, sortBy]);

  const categoryName = catInfo?.name || category?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Category";
  const subcategoryName = subcategory?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const breadcrumbItems = [
    { label: "Shop", path: "/shop" },
    { label: categoryName, path: `/shop/${category}` }
  ];
  if (subcategoryName) {
    breadcrumbItems.push({ label: subcategoryName, path: `/shop/${category}/${subcategory}` });
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mt-6">
        {catInfo ? (
          <ShopBanner title={subcategoryName ? `${catInfo.name} - ${subcategoryName}` : catInfo.name} description={catInfo.description} image={catInfo.image} count={filtered.length} />
        ) : (
          <h1 className="font-display text-4xl text-[color:var(--color-text-primary)] md:text-5xl">
            {subcategoryName ? `${categoryName} - ${subcategoryName}` : categoryName}
          </h1>
        )}
      </div>

      <div className="mt-6 space-y-6">
        <FilterSidebar open={filterOpen} onClose={() => setFilterOpen(false)} />
        <div>
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
