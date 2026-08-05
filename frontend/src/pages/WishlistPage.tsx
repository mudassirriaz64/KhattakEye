import { Heart, ShoppingBag, Trash2, GitCompare } from "lucide-react";
import { Link } from "react-router-dom";
import { useShopStore } from "@/lib/stores/shop-store";
import { Button } from "@/components/primitives/Button";

export function WishlistPage() {
  const wishlistItems: any[] = [];

  if (wishlistItems.length === 0) {
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
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">{wishlistItems.length} Items</p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wishlistItems.map((product) => (
          <div key={product.id} className="group overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]">
            <Link to={`/product/${product.slug}`} className="block aspect-[4/5] overflow-hidden bg-[color:var(--color-surface-muted)]">
              <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105" />
            </Link>
            <div className="p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)]">{product.brand}</p>
              <Link to={`/product/${product.slug}`}>
                <h3 className="mt-0.5 font-display text-lg text-[color:var(--color-text-primary)]">{product.name}</h3>
              </Link>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm font-semibold">{product.currency} {product.price.toLocaleString()}</span>
                {product.oldPrice && <span className="text-xs line-through text-[color:var(--color-text-tertiary)]">{product.currency} {product.oldPrice.toLocaleString()}</span>}
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="primary" iconLeft={<ShoppingBag className="h-3.5 w-3.5" />} className="flex-1 text-xs">Move to Cart</Button>
                <button type="button" className="flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--color-border)] text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-danger)]">
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
