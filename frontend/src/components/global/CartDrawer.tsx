import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useUiStore } from "@/lib/stores/ui-store";
import { useCartStore } from "@/lib/stores/cart-store";
import { CartItem } from "@/components/cart/CartItem";
import { Button } from "@/components/primitives/Button";

export function CartDrawer() {
  const cartOpen = useUiStore((state) => state.cartOpen);
  const setCartOpen = useUiStore((state) => state.setCartOpen);
  const items = useCartStore((s) => s.items);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const getSubtotal = useCartStore((s) => s.getSubtotal);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
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
                  <ShoppingBag className="h-4 w-4" />
                </span>
                <span className="font-display text-xl">Cart</span>
                {getItemCount() > 0 && (
                  <span className="rounded-full bg-[color:var(--color-surface-muted)] px-2 py-0.5 text-xs font-semibold text-[color:var(--color-text-secondary)]">
                    {getItemCount()}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-border)] transition-colors hover:bg-[color:var(--color-surface-muted)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 items-center justify-center p-6">
                <div className="text-center">
                  <ShoppingBag className="mx-auto h-12 w-12 text-[color:var(--color-text-tertiary)]" />
                  <p className="mt-4 font-display text-2xl text-[color:var(--color-text-primary)]">
                    Your cart is empty
                  </p>
                  <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
                    Add items to your cart to get started.
                  </p>
                  <Button
                    variant="primary"
                    className="mt-6"
                    onClick={() => setCartOpen(false)}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <CartItem key={`${item.productId}-${item.color}`} item={item} />
                    ))}
                  </AnimatePresence>
                </div>
                <div className="space-y-4 border-t border-[color:var(--color-border)] px-6 py-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[color:var(--color-text-secondary)]">Subtotal</span>
                    <span className="font-display text-lg text-[color:var(--color-text-primary)]">
                      Rs. {getSubtotal().toLocaleString()}
                    </span>
                  </div>
                  {items.some((i) => i.customization?.priceOnRequest === true) && (
                    <p className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-[11px] font-medium text-amber-700">
                      One or more lenses are on request — price confirmed by our team before payment.
                    </p>
                  )}
                  <div className="grid gap-2">
                    <Link to="/cart" onClick={() => setCartOpen(false)} className="block">
                      <Button variant="primary" className="w-full">
                        View Cart
                      </Button>
                    </Link>
                    <Link to="/checkout" onClick={() => setCartOpen(false)} className="block">
                      <Button variant="outline" className="w-full" iconRight={<ArrowRight className="h-4 w-4" />}>
                        Checkout
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
