import { useEffect } from "react";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { useCartStore } from "@/lib/stores/cart-store";
import { Button } from "@/components/primitives/Button";

export function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);
  const addItemToCart = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-20 text-center md:px-8">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[color:var(--color-surface-muted)]">
          <Heart className="h-10 w-10 text-[color:var(--color-text-tertiary)]" />
        </div>
        <h1 className="mt-6 font-display text-3xl text-[color:var(--color-text-primary)] md:text-4xl">Your wishlist is empty</h1>
        <p className="mt-3 text-sm text-[color:var(--color-text-secondary)]">
          Save your favorite items here and come back to them anytime.
        </p>
        <Link to="/shop">
          <Button variant="primary" className="mt-8">Explore Collection</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-[color:var(--color-text-primary)] md:text-4xl">My Wishlist</h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">{items.length} Saved Items</p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((product) => (
          <div key={product.id || product._id} className="group overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]">
            <Link to={`/product/${product.slug}`} className="block aspect-[4/3] overflow-hidden bg-white">
              <img src={product.images?.[0]} alt={product.name} className="h-full w-full object-contain transition-all duration-300 group-hover:scale-105" />
            </Link>
            <div className="p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)]">{product.brand}</p>
              <Link to={`/product/${product.slug}`}>
                <h3 className="mt-0.5 font-display text-lg text-[color:var(--color-text-primary)] line-clamp-1">{product.name}</h3>
              </Link>
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
                <button
                  type="button"
                  onClick={() => removeFromWishlist(product.id || product._id)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--color-border)] text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-danger)]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
