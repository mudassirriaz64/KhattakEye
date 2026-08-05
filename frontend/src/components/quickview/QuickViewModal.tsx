import { useState } from "react";
import { X, Heart, ShoppingBag, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useShopStore } from "@/lib/stores/shop-store";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";

export function QuickViewModal() {
  const quickViewProduct = useShopStore((s) => s.quickViewProduct);
  const setQuickViewProduct = useShopStore((s) => s.setQuickViewProduct);
  const addToRecentlyViewed = useShopStore((s) => s.addToRecentlyViewed);
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  const product = quickViewProduct;

  if (!product) return null;

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQuickViewProduct(null)}
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 z-[81] mx-auto my-auto flex max-h-[90vh] max-w-4xl flex-col overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] shadow-[var(--shadow-strong)] md:inset-8 md:flex-row"
          >
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--color-app-bg)]/80 text-[color:var(--color-text-primary)] shadow-sm backdrop-blur-sm transition-colors hover:bg-[color:var(--color-surface-muted)]"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative flex-1 bg-[color:var(--color-surface-muted)]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={product.images[selectedImage]}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(i)}
                    className={cn("h-1.5 rounded-full transition-all", selectedImage === i ? "w-6 bg-white" : "w-1.5 bg-white/50")}
                  />
                ))}
              </div>
              {product.images.length > 1 && (
                <>
                  <button type="button" onClick={() => setSelectedImage((s) => (s - 1 + product.images.length) % product.images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[color:var(--color-text-primary)] shadow-sm backdrop-blur-sm">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button type="button" onClick={() => setSelectedImage((s) => (s + 1) % product.images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[color:var(--color-text-primary)] shadow-sm backdrop-blur-sm">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            <div className="flex w-full flex-col overflow-y-auto p-6 md:w-[400px]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)]">{product.brand}</p>
              <h2 className="mt-1 font-display text-2xl text-[color:var(--color-text-primary)]">{product.name}</h2>

              <div className="mt-2 flex items-center gap-2 text-xs text-[color:var(--color-text-tertiary)]">
                <div className="flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-[color:var(--color-text-primary)]">{product.rating}</span>
                </div>
                <span>({product.reviewCount} reviews)</span>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <span className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
                  {product.currency} {product.price.toLocaleString()}
                </span>
                {product.oldPrice && (
                  <span className="text-sm text-[color:var(--color-text-tertiary)] line-through">
                    {product.currency} {product.oldPrice.toLocaleString()}
                  </span>
                )}
                {product.discount && (
                  <span className="rounded-full bg-[color:var(--color-danger)]/10 px-2 py-0.5 text-xs font-semibold text-[color:var(--color-danger)]">
                    -{product.discount}%
                  </span>
                )}
              </div>

              <p className="mt-4 text-sm leading-6 text-[color:var(--color-text-secondary)]">{product.shortDescription}</p>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">Colors</p>
                <div className="mt-2 flex gap-2">
                  {product.variants.slice(0, 5).map((v) => (
                    <button
                      key={v.color}
                      type="button"
                      className="h-7 w-7 rounded-full border-2 border-transparent ring-1 ring-black/10 transition-all hover:scale-110"
                      style={{ backgroundColor: v.color }}
                      title={v.colorName}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="primary" iconLeft={<ShoppingBag className="h-4 w-4" />} className="flex-1">
                  Add to Cart
                </Button>
                <button
                  type="button"
                  onClick={() => setWishlisted(!wishlisted)}
                  className={cn("flex h-12 w-12 items-center justify-center rounded-2xl border transition-all", wishlisted ? "border-[color:var(--color-danger)] text-[color:var(--color-danger)]" : "border-[color:var(--color-border)] text-[color:var(--color-text-tertiary)] hover:border-[color:var(--color-text-primary)] hover:text-[color:var(--color-text-primary)]")}
                >
                  <Heart className={cn("h-5 w-5", wishlisted && "fill-current")} />
                </button>
              </div>

              <Link
                to={`/product/${product.slug}`}
                onClick={() => { setQuickViewProduct(null); addToRecentlyViewed(product.id); }}
                className="mt-4 block text-center text-sm text-[color:var(--color-accent-teal)] transition-colors hover:text-[color:var(--color-text-primary)]"
              >
                View Full Details
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
