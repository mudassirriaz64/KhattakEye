import { X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUiStore } from "@/lib/stores/ui-store";
import { Button } from "@/components/primitives/Button";

export function CartDrawer() {
  const cartOpen = useUiStore((state) => state.cartOpen);
  const setCartOpen = useUiStore((state) => state.setCartOpen);

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
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-border)] transition-colors hover:bg-[color:var(--color-surface-muted)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
