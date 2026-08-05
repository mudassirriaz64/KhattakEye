import { X, Star, Check, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useShopStore } from "@/lib/stores/shop-store";
import { getProducts, mapProductCard } from "@/lib/api/products";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";

const compareFields = [
  { label: "Price", key: "price" as const },
  { label: "Frame Material", key: "frameMaterial" as const },
  { label: "Lens Type", key: "lensType" as const },
  { label: "Frame Size", key: "frameSize" as const },
  { label: "Frame Shape", key: "frameShape" as const },
  { label: "Weight", key: "weight" as const },
  { label: "UV Protection", key: "uvProtection" as const },
  { label: "Warranty", key: "warranty" as const },
  { label: "Rating", key: "rating" as const },
  { label: "Availability", key: "availability" as const },
];

export function ComparePage() {
  const compareList = useShopStore((s) => s.compareList);
  const removeFromCompare = useShopStore((s) => s.removeFromCompare);
  const clearCompare = useShopStore((s) => s.clearCompare);

  const [catalog, setCatalog] = useState<any[]>([]);

  useEffect(() => {
    getProducts({ limit: 100 }).then((data) => {
      if (data && data.items) setCatalog(data.items.map(mapProductCard));
    }).catch(() => setCatalog([]));
  }, []);

  const products = useMemo(
    () => catalog.filter((p) => compareList.includes(p.id)),
    [catalog, compareList],
  );

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-20 text-center md:px-8">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[color:var(--color-surface-muted)]">
          <Minus className="h-10 w-10 text-[color:var(--color-text-tertiary)]" />
        </div>
        <h1 className="mt-6 font-display text-3xl text-[color:var(--color-text-primary)] md:text-4xl">No products to compare</h1>
        <p className="mt-3 text-sm text-[color:var(--color-text-secondary)]">
          Add products to compare by clicking the compare icon on any product.
        </p>
        <Link to="/shop">
          <Button variant="primary" className="mt-8">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-[color:var(--color-text-primary)] md:text-4xl">Compare Products</h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">{products.length} Products</p>
        </div>
        <Button variant="outline" onClick={clearCompare}>Clear All</Button>
      </div>

      <div className="mt-8 overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-[160px_repeat(auto-fill,minmax(200px,1fr))] gap-4">
            <div className="sticky top-0" />

            {products.map((product) => (
              <div key={product.id} className="relative">
                <button
                  type="button"
                  onClick={() => removeFromCompare(product.id)}
                  className="absolute -right-2 -top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] text-[color:var(--color-text-tertiary)] transition-colors hover:text-[color:var(--color-danger)]"
                >
                  <X className="h-3 w-3" />
                </button>
                <Link to={`/product/${product.slug}`} className="block">
                  <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[color:var(--color-surface-muted)]">
                    <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition-all hover:scale-105" />
                  </div>
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)]">{product.brand}</p>
                  <p className="font-display text-base text-[color:var(--color-text-primary)]">{product.name}</p>
                </Link>
              </div>
            ))}
          </div>

          {compareFields.map((field) => (
            <div key={field.key} className="mt-4 grid grid-cols-[160px_repeat(auto-fill,minmax(200px,1fr))] gap-4">
              <div className="flex items-center text-sm font-medium text-[color:var(--color-text-primary)]">{field.label}</div>
              {products.map((product) => {
                const value = product[field.key];
                return (
                  <div key={product.id} className="flex items-center text-sm text-[color:var(--color-text-secondary)]">
                    {field.key === "rating" ? (
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {value}
                      </div>
                    ) : field.key === "price" ? (
                      <span className="font-semibold text-[color:var(--color-text-primary)]">
                        {product.currency} {product.price.toLocaleString()}
                        {product.oldPrice && (
                          <span className="ml-1 text-xs text-[color:var(--color-text-tertiary)] line-through">
                            {product.currency} {product.oldPrice.toLocaleString()}
                          </span>
                        )}
                      </span>
                    ) : field.key === "availability" ? (
                      <span className={cn(
                        value === "in-stock" ? "text-green-600" : value === "limited" ? "text-amber-600" : "text-[color:var(--color-danger)]",
                      )}>
                        {value === "in-stock" ? "In Stock" : value === "limited" ? "Limited" : "New Arrival"}
                      </span>
                    ) : (
                      <span className="capitalize">{String(value).replace(/-/g, " ")}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
