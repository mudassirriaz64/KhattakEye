import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star, Eye, GitCompare } from "lucide-react";
import { motion } from "framer-motion";
import { type Product } from "@/lib/shop-data";
import { useShopStore } from "@/lib/stores/shop-store";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  viewMode?: "grid" | "list";
};

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const toggleCompare = useShopStore((s) => s.toggleCompare);
  const compareList = useShopStore((s) => s.compareList);
  const setQuickViewProduct = useShopStore((s) => s.setQuickViewProduct);
  const addToRecentlyViewed = useShopStore((s) => s.addToRecentlyViewed);
  const inCompare = compareList.includes(product.id);

  const isList = viewMode === "list";

  const handleClick = () => addToRecentlyViewed(product.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]",
        isList ? "flex" : "",
      )}
    >
      <Link to={`/product/${product.slug}`} onClick={handleClick} className={cn("relative overflow-hidden", isList ? "w-56 shrink-0" : "aspect-[4/5]")}>
        <div className={cn("h-full w-full", isList ? "" : "aspect-[4/5]")}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-0"
          />
          {product.hoverImage && (
            <img
              src={product.hoverImage}
              alt={`${product.name} view`}
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
            />
          )}
        </div>
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.badges.map((badge) => (
            <span
              key={badge}
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em]",
                badge === "best-seller" && "bg-[color:var(--color-brand-primary)] text-white",
                badge === "new-arrival" && "bg-[color:var(--color-accent-teal)] text-white",
                badge === "trending" && "bg-[color:var(--color-accent-blue)] text-white",
                badge === "premium" && "bg-[#7C2D12] text-[#FFF7ED]",
              )}
            >
              {badge === "best-seller" ? "Best Seller" : badge === "new-arrival" ? "New" : badge}
            </span>
          ))}
        </div>
        {product.discount && (
          <div className="absolute right-3 top-3 rounded-full bg-[color:var(--color-danger)] px-2.5 py-0.5 text-[9px] font-bold text-white">
            -{product.discount}%
          </div>
        )}
      </Link>

      <div className={cn("flex flex-1 flex-col p-4", isList ? "justify-center" : "")}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)]">
              {product.brand}
            </p>
            <Link to={`/product/${product.slug}`} onClick={handleClick}>
              <h3 className="mt-0.5 font-display text-lg leading-tight text-[color:var(--color-text-primary)] transition-colors hover:text-[color:var(--color-accent-teal)]">
                {product.name}
              </h3>
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setWishlisted(!wishlisted)}
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all hover:scale-110",
              wishlisted ? "text-[color:var(--color-danger)]" : "text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]",
            )}
            aria-label="Toggle wishlist"
          >
            <Heart className={cn("h-4 w-4", wishlisted && "fill-current")} />
          </button>
        </div>

        <div className="mt-1.5 flex items-center gap-2 text-xs text-[color:var(--color-text-tertiary)]">
          <div className="flex items-center gap-0.5">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-medium text-[color:var(--color-text-primary)]">{product.rating}</span>
          </div>
          <span>({product.reviewCount})</span>
        </div>

        {isList && (
          <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-secondary)] line-clamp-2">
            {product.shortDescription}
          </p>
        )}

        <div className="mt-2 flex items-center gap-3">
          <span className="text-base font-semibold text-[color:var(--color-text-primary)]">
            {product.currency} {product.price.toLocaleString()}
          </span>
          {product.oldPrice && (
            <span className="text-sm text-[color:var(--color-text-tertiary)] line-through">
              {product.currency} {product.oldPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center gap-1.5">
          {product.variants.slice(0, 4).map((v) => (
            <span
              key={v.color}
              className="h-4 w-4 rounded-full border border-white/80 shadow-sm ring-1 ring-black/5"
              style={{ backgroundColor: v.color }}
              title={v.colorName}
            />
          ))}
          {product.variants.length > 4 && (
            <span className="text-[10px] text-[color:var(--color-text-tertiary)]">+{product.variants.length - 4}</span>
          )}
        </div>

        <div className="mt-2 flex items-center gap-3 text-xs text-[color:var(--color-text-secondary)]">
          <span className={cn(
            "flex items-center gap-1",
            product.stock > 10 ? "text-green-600" : product.stock > 0 ? "text-amber-600" : "text-[color:var(--color-danger)]",
          )}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        <div className={cn("mt-auto flex gap-2", isList ? "mt-4" : "")}>
          <Link to={`/product/${product.slug}`} onClick={handleClick} className="flex-1">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[color:var(--color-brand-primary)] px-3 py-2.5 text-xs font-semibold text-white transition-all hover:bg-black"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Add to Cart
            </button>
          </Link>
          <button
            type="button"
            onClick={() => setQuickViewProduct(product.id)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--color-border)] text-[color:var(--color-text-tertiary)] transition-colors hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]"
            aria-label="Quick view"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => toggleCompare(product.id)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl border transition-colors",
              inCompare
                ? "border-[color:var(--color-accent-teal)] text-[color:var(--color-accent-teal)]"
                : "border-[color:var(--color-border)] text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]",
            )}
            aria-label="Compare"
          >
            <GitCompare className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
