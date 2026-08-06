import { useState } from "react";
import { CheckCircle2, XCircle, Tag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/stores/cart-store";

export function CouponInput() {
  const couponCode = useCartStore((s) => s.couponCode);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleApply = () => {
    if (!code.trim()) return;
    const valid = applyCoupon(code.trim());
    setStatus(valid ? "success" : "error");
    if (valid) setCode("");
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <div>
      {couponCode ? (
        <div className="flex items-center justify-between rounded-xl border border-[color:var(--color-accent-teal)]/30 bg-[color:var(--color-accent-teal)]/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-[color:var(--color-accent-teal)]" />
            <span className="text-sm font-medium text-[color:var(--color-accent-teal)]">{couponCode}</span>
            <span className="text-xs text-[color:var(--color-text-secondary)]">10% OFF applied</span>
          </div>
          <button type="button" onClick={removeCoupon} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-[color:var(--color-surface-muted)]">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApply()}
              placeholder="Enter coupon code"
              className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] py-3 pl-10 pr-3 text-sm text-[color:var(--color-text-primary)] outline-none placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-teal)]"
            />
          </div>
          <button
            type="button"
            onClick={handleApply}
            className="rounded-xl border border-[color:var(--color-border)] px-4 text-sm font-medium text-[color:var(--color-text-primary)] transition-colors hover:bg-[color:var(--color-surface-muted)]"
          >
            Apply
          </button>
        </div>
      )}

      <AnimatePresence>
        {status === "success" && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 flex items-center gap-1.5 text-xs text-[color:var(--color-accent-teal)]">
            <CheckCircle2 className="h-3 w-3" /> Coupon applied! You saved 10%.
          </motion.div>
        )}
        {status === "error" && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 flex items-center gap-1.5 text-xs text-[color:var(--color-danger)]">
            <XCircle className="h-3 w-3" /> Invalid coupon code.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
