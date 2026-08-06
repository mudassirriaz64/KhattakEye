import { Clock, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useShopStore } from "@/lib/stores/shop-store";
import { getProducts, mapProductCard, type ProductCard } from "@/lib/api/products";
import { Button } from "@/components/primitives/Button";

export function RecentlyViewedPage() {
  const recentlyViewed = useShopStore((s) => s.recentlyViewed);
  const [catalog, setCatalog] = useState<ProductCard[]>([]);

  useEffect(() => {
    getProducts({ limit: 100 }).then((data) => {
      if (data && data.items) setCatalog(data.items.map(mapProductCard));
    }).catch(() => setCatalog([]));
  }, []);

  const products = useMemo(
    () => catalog.filter((p) => recentlyViewed.includes(p.id)),
    [catalog, recentlyViewed],
  );

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-20 text-center md:px-8">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[color:var(--color-surface-muted)]">
          <Clock className="h-10 w-10 text-[color:var(--color-text-tertiary)]" />
        </div>
        <h1 className="mt-6 font-display text-3xl text-[color:var(--color-text-primary)] md:text-4xl">No recently viewed items</h1>
        <p className="mt-3 text-sm text-[color:var(--color-text-secondary)]">
          Products you view will appear here for easy access.
        </p>
        <Link to="/shop">
          <Button variant="primary" className="mt-8">Start Browsing</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8">
      <div className="flex items-center gap-3">
        <Clock className="h-6 w-6 text-[color:var(--color-accent-teal)]" />
        <div>
          <h1 className="font-display text-3xl text-[color:var(--color-text-primary)] md:text-4xl">Recently Viewed</h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">{products.length} Items</p>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.slug}`}
            className="flex items-center gap-4 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
          >
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[color:var(--color-surface-muted)]">
              <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)]">{product.brand}</p>
              <h3 className="mt-0.5 font-display text-lg text-[color:var(--color-text-primary)]">{product.name}</h3>
              <p className="text-sm font-semibold">{product.currency} {product.price.toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link to="/shop">
          <Button variant="primary" iconLeft={<ShoppingBag className="h-4 w-4" />}>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
