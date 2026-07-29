import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeftRight, Trash2 } from "lucide-react";
import { useUiStore } from "@/lib/stores/ui-store";
import { useShopStore } from "@/lib/stores/shop-store";
import { Button } from "@/components/primitives/Button";

export function CompareDrawer() {
  const open = useUiStore((s) => s.compareOpen);
  const setOpen = useUiStore((s) => s.setCompareOpen);
  const compareList = useShopStore((s) => s.compareList);
  const removeFromCompare = useShopStore((s) => s.removeFromCompare);
  const clearCompare = useShopStore((s) => s.clearCompare);
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 z-[110] flex h-full w-full max-w-md flex-col border-l border-[color:var(--color-border)] bg-[color:var(--color-panel)] shadow-[var(--shadow-strong)] backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-[color:var(--color-border)] px-6 py-4">
              <div className="flex items-center gap-3">
                <ArrowLeftRight className="h-5 w-5 text-[color:var(--color-text-primary)]" />
                <h2 className="font-display text-lg text-[color:var(--color-text-primary)]">Compare ({compareList.length})</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]"
                aria-label="Close compare drawer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {compareList.length === 0 ? (
                <p className="py-12 text-center text-sm text-[color:var(--color-text-tertiary)]">No products to compare</p>
              ) : (
                <div className="space-y-3">
                  {compareList.map((id) => (
                    <motion.div
                      key={id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center justify-between rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] p-4"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[color:var(--color-text-primary)] truncate">Product {id}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCompare(id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-danger)]"
                        aria-label={`Remove product ${id} from compare`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {compareList.length >= 2 && (
              <div className="flex items-center gap-3 border-t border-[color:var(--color-border)] p-4">
                <Button
                  className="flex-1"
                  onClick={() => { navigate("/compare"); setOpen(false); }}
                  iconLeft={<ArrowLeftRight className="h-4 w-4" />}
                >
                  View Comparison
                </Button>
                <button
                  type="button"
                  onClick={clearCompare}
                  className="px-4 py-3 text-xs text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-danger)]"
                >
                  Clear all
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
