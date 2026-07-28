import { X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUiStore } from "@/lib/stores/ui-store";
import { cn } from "@/lib/utils";

export function WishlistDrawer() {
  const wishlistOpen = useUiStore((state) => state.wishlistOpen);
  const setWishlistOpen = useUiStore((state) => state.setWishlistOpen);

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
            <div className="flex items-center justify-between border-b border-[color:var(--color-border)] px-6 py-5">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                <span className="font-display text-xl">Wishlist</span>
              </div>
              <button
                type="button"
                onClick={() => setWishlistOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-border)] transition-colors hover:bg-[color:var(--color-surface-muted)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
