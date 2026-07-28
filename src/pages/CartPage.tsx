import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/stores/cart-store";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { CouponInput } from "@/components/cart/CouponInput";
import { Button } from "@/components/primitives/Button";

export function CartPage() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const getItemCount = useCartStore((s) => s.getItemCount);

  if (items.length === 0) return <EmptyCart />;

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-[color:var(--color-text-primary)] md:text-4xl">Shopping Cart</h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">{getItemCount()} {getItemCount() === 1 ? "Item" : "Items"}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/shop">
            <Button variant="ghost" iconLeft={<ArrowLeft className="h-4 w-4" />}>Continue Shopping</Button>
          </Link>
          <button type="button" onClick={clearCart} className="rounded-xl border border-[color:var(--color-border)] px-4 py-2.5 text-xs font-medium text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-danger)]">
            Clear Cart
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <CartItem key={`${item.productId}-${item.color}`} item={item} />
            ))}
          </AnimatePresence>

          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
            <CouponInput />
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
