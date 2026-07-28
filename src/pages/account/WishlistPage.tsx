import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Trash2, GitCompare, Share2 } from "lucide-react";
import { allProducts } from "@/lib/shop-data";
import { AccountLayout } from "@/components/account/AccountLayout";
import { Button } from "@/components/primitives/Button";

const initialWishlist = allProducts.slice(0, 4);

export function AccountWishlistPage() {
  const [items, setItems] = useState(initialWishlist);

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

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
              key={product.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]"
            >
              <Link to={`/product/${product.slug}`} className="block aspect-[4/5] overflow-hidden bg-[color:var(--color-surface-muted)]">
                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105" />
              </Link>
              <div className="p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)]">{product.brand}</p>
                <Link to={`/product/${product.slug}`}><h3 className="mt-0.5 font-display text-lg text-[color:var(--color-text-primary)]">{product.name}</h3></Link>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm font-semibold">Rs. {product.price.toLocaleString()}</span>
                  {product.oldPrice && <span className="text-xs line-through text-[color:var(--color-text-tertiary)]">Rs. {product.oldPrice.toLocaleString()}</span>}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button variant="primary" iconLeft={<ShoppingBag className="h-3.5 w-3.5" />} className="flex-1 text-xs">Move to Cart</Button>
                  <button type="button" onClick={() => removeItem(product.id)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--color-border)] text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-danger)]">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 flex gap-3">
                  <button type="button" className="flex items-center gap-1 text-[10px] text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-accent-blue)]"><GitCompare className="h-3 w-3" /> Compare</button>
                  <button type="button" className="flex items-center gap-1 text-[10px] text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-accent-teal)]"><Share2 className="h-3 w-3" /> Share</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AccountLayout>
  );
}
