import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { AccountLayout } from "@/components/account/AccountLayout";
import { Button } from "@/components/primitives/Button";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { useCartStore } from "@/lib/stores/cart-store";

export function AccountWishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);
  const addItemToCart = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return (
    <AccountLayout title="My Wishlist" subtitle={`${items.length} saved items`}>
      {items.length === 0 ? (
        <div className="mt-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--color-surface-muted)]"><Heart className="h-8 w-8 text-[color:var(--color-text-tertiary)]" /></div>
          <h3 className="mt-4 font-display text-xl text-[color:var(--color-text-primary)]">Your wishlist is empty</h3>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">Save your favorite items here.</p>
          <Link to="/shop"><Button variant="primary" className="mt-4">Explore Collection</Button></Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((product, i) => (
            <motion.div
              key={product.id || product._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]"
            >
              <Link to={`/product/${product.slug}`} className="block aspect-[4/3] overflow-hidden bg-white">
                <img src={product.images?.[0]} alt={product.name} className="h-full w-full object-contain transition-all duration-300 group-hover:scale-105" />
              </Link>
              <div className="p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)]">{product.brand}</p>
                <Link to={`/product/${product.slug}`}><h3 className="mt-0.5 font-display text-lg text-[color:var(--color-text-primary)] line-clamp-1">{product.name}</h3></Link>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm font-semibold">Rs. {product.price?.toLocaleString()}</span>
                  {product.oldPrice && <span className="text-xs line-through text-[color:var(--color-text-tertiary)]">Rs. {product.oldPrice.toLocaleString()}</span>}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="primary"
                    iconLeft={<ShoppingBag className="h-3.5 w-3.5" />}
                    className="flex-1 text-xs"
                    onClick={() => addItemToCart({
                      productId: product.id || product._id,
                      name: product.name,
                      brand: product.brand,
                      image: product.images?.[0] || "",
                      price: product.price,
                      quantity: 1,
                      color: product.colors?.[0]?.hex || "#000",
                      colorName: product.colors?.[0]?.name || "Standard",
                      size: product.size || "Medium",
                      lensType: product.lensType || "Standard",
                      sku: product.sku || product.id,
                      stock: product.stock || 10
                    })}
                  >
                    Add to Cart
                  </Button>
                  <button type="button" onClick={() => removeFromWishlist(product.id || product._id)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--color-border)] text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-danger)]">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AccountLayout>
  );
}
