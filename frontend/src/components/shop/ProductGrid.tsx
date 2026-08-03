import { AnimatePresence } from "framer-motion";
import { type Product } from "@/lib/shop-data";
import { useShopStore } from "@/lib/stores/shop-store";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  const viewMode = useShopStore((s) => s.viewMode);

  if (products.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <div className="text-center">
          <p className="font-display text-2xl text-[color:var(--color-text-primary)]">No products found</p>
          <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">Try adjusting your filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        viewMode === "grid"
          ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
          : "space-y-4"
      }
    >
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} viewMode={viewMode} />
        ))}
      </AnimatePresence>
    </div>
  );
}
