import { Minus, Plus, Trash2, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { type CartItem as CartItemType, useCartStore } from "@/lib/stores/cart-store";

type CartItemProps = {
  item: CartItemType;
};

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const productSlug = item.productId;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-5 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4"
    >
      <Link to={`/product/${productSlug}`} className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-[color:var(--color-surface-muted)] md:h-32 md:w-32">
        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)]">{item.brand}</p>
              <Link to={`/product/${productSlug}`}>
                <h3 className="mt-0.5 font-display text-lg text-[color:var(--color-text-primary)] transition-colors hover:text-[color:var(--color-accent-teal)]">{item.name}</h3>
              </Link>
            </div>
            <p className="shrink-0 text-base font-semibold text-[color:var(--color-text-primary)]">
              Rs. {(item.price * item.quantity).toLocaleString()}
            </p>
          </div>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[color:var(--color-text-tertiary)]">
            <span>SKU: {item.sku}</span>
            <span>Color: {item.colorName}</span>
            <span>Size: {item.size}</span>
            <span>Lens: {item.lensType}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-[color:var(--color-border)]">
              <button type="button" onClick={() => updateQuantity(item.productId, item.color, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text-primary)]">
                <Minus className="h-3 w-3" />
              </button>
              <span className="flex h-8 w-10 items-center justify-center text-xs font-medium text-[color:var(--color-text-primary)]">{item.quantity}</span>
              <button type="button" onClick={() => updateQuantity(item.productId, item.color, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text-primary)]">
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <button type="button" onClick={() => removeItem(item.productId, item.color)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] transition-colors hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-danger)]">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <button type="button" className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] transition-colors hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-accent-teal)]" aria-label="Save for later">
              <Heart className="h-3.5 w-3.5" />
            </button>
          </div>
          {item.oldPrice && (
            <p className="text-xs text-[color:var(--color-text-tertiary)] line-through">
              Rs. {(item.oldPrice * item.quantity).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
