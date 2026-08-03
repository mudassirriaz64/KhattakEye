import { Building2, Smartphone, Wallet, Banknote } from "lucide-react";
import { motion } from "framer-motion";
import { useCheckoutStore, type PaymentMethod } from "@/lib/stores/checkout-store";
import { cn } from "@/lib/utils";

const methods: { id: PaymentMethod; label: string; description: string; icon: React.ElementType }[] = [
  { id: "bank-transfer", label: "Bank Transfer", description: "Direct bank transfer via IBAN", icon: Building2 },
  { id: "jazzcash", label: "JazzCash", description: "Send payment via JazzCash", icon: Smartphone },
  { id: "easypaisa", label: "EasyPaisa", description: "Send payment via EasyPaisa", icon: Wallet },
  { id: "cod", label: "Cash on Delivery", description: "Pay when you receive your order", icon: Banknote },
];

export function PaymentMethodSelector() {
  const payment = useCheckoutStore((s) => s.payment);
  const setPaymentMethod = useCheckoutStore((s) => s.setPaymentMethod);
  const setStep = useCheckoutStore((s) => s.setStep);

  return (
    <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 md:p-8">
      <h2 className="font-display text-2xl text-[color:var(--color-text-primary)]">Payment Method</h2>
      <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">Choose your preferred payment method.</p>

      <div className="mt-6 grid gap-3">
        {methods.map((method) => {
          const Icon = method.icon;
          const selected = payment.method === method.id;
          return (
            <motion.button
              key={method.id}
              type="button"
              onClick={() => setPaymentMethod(method.id)}
              whileTap={{ scale: 0.99 }}
              className={cn(
                "flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all",
                selected
                  ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-surface-muted)]"
                  : "border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)]",
              )}
            >
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                selected ? "bg-[color:var(--color-brand-primary)] text-white" : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-tertiary)]",
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[color:var(--color-text-primary)]">{method.label}</p>
                <p className="text-xs text-[color:var(--color-text-tertiary)]">{method.description}</p>
              </div>
              <div className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
                selected ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)]" : "border-[color:var(--color-border)]",
              )}>
                {selected && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-8 flex gap-3">
        <button type="button" onClick={() => setStep(2)} className="rounded-xl border border-[color:var(--color-border)] px-6 py-3.5 text-sm font-medium text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]">
          Back
        </button>
        <button
          type="button"
          disabled={!payment.method}
          onClick={() => payment.method && setStep(4)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[color:var(--color-brand-primary)] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-black disabled:bg-[color:var(--color-disabled-bg)] disabled:text-[color:var(--color-disabled-text)]"
        >
          Review Order
        </button>
      </div>
    </div>
  );
}
