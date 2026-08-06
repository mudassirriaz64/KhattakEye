import { X, Heart, Trash2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUiStore } from "@/lib/stores/ui-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { useCartStore } from "@/lib/stores/cart-store";
import { Link } from "react-router-dom";

export function WishlistDrawer() {
  const wishlistOpen = useUiStore((state) => state.wishlistOpen);
  const setWishlistOpen = useUiStore((state) => state.setWishlistOpen);
  const items = useWishlistStore((state) => state.items);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: any) => {
    addItem({
      productId: product.id || product._id,
      name: product.name,
      brand: product.brand || "Khattak Eyewear",
      image: product.images?.[0] || product.image || "",
      price: product.price,
      quantity: 1,
      color: product.colors?.[0]?.hex || "#000",
      colorName: product.colors?.[0]?.name || "Standard",
      size: "Medium",
      lensType: "Standard",
      sku: product.sku || product.id || product._id,
      stock: product.stock || 10
    });
  };

  return (
    <AnimatePresence>
      {wishlistOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setWishlistOpen(false)}
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[71] flex h-full w-full max-w-md flex-col border-l border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] shadow-[var(--shadow-strong)]"
          >
            <div className="relative flex items-center justify-between border-b border-[color:var(--color-border)] px-6 py-5">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px brand-gradient" />
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl brand-gradient text-white shadow-[var(--glow-brand)]">
                  <Heart className="h-4 w-4" />
                </span>
                <span className="font-display text-xl">Wishlist</span>
                {items.length > 0 && (
                  <span className="rounded-full bg-[color:var(--color-surface-muted)] px-2 py-0.5 text-xs font-semibold text-[color:var(--color-text-secondary)]">
                    {items.length}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setWishlistOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-border)] transition-colors hover:bg-[color:var(--color-surface-muted)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 items-center justify-center p-6">
                <div className="text-center">
                  <Heart className="mx-auto h-12 w-12 text-[color:var(--color-text-tertiary)]" />
                  <p className="mt-4 font-display text-2xl text-[color:var(--color-text-primary)]">
                    Your wishlist is empty
                  </p>
                  <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
                    Save your favorite items here for later.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.map((item) => {
                  const itemId = item.id || item._id;
                  const itemImage = item.images?.[0] || (item as any).image || "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop";
                  return (
                    <motion.div
                      layout
                      key={itemId}
                      className="flex gap-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 shadow-sm"
                    >
                      <Link
                        to={`/product/${item.slug}`}
                        onClick={() => setWishlistOpen(false)}
                        className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[color:var(--color-surface-muted)]"
                      >
                        <img src={itemImage} alt={item.name} className="h-full w-full object-contain" />
                      </Link>

                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <Link
                              to={`/product/${item.slug}`}
                              onClick={() => setWishlistOpen(false)}
                              className="font-semibold text-xs text-[color:var(--color-text-primary)] hover:text-[color:var(--color-brand-primary)] truncate block"
                            >
                              {item.name}
                            </Link>
                            <button
                              type="button"
                              onClick={() => removeFromWishlist(itemId)}
                              className="text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-danger)]"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="text-[10px] text-[color:var(--color-text-secondary)] font-semibold uppercase tracking-wider mt-0.5">
                            {item.brand || "Khattak Eyewear"}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-bold text-[color:var(--color-text-primary)]">
                            Rs. {item.price.toLocaleString()}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAddToCart(item)}
                            className="flex items-center gap-1 rounded-lg bg-[color:var(--color-brand-primary)] px-2.5 py-1 text-[10px] font-bold text-white hover:bg-black transition-colors"
                          >
                            <ShoppingBag className="h-3 w-3" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
