import { User, Phone, Mail } from "lucide-react";
import { useCheckoutStore } from "@/lib/stores/checkout-store";

export function CustomerInfoForm() {
  const customer = useCheckoutStore((s) => s.customer);
  const setCustomer = useCheckoutStore((s) => s.setCustomer);
  const setStep = useCheckoutStore((s) => s.setStep);

  const isComplete = customer.fullName && customer.phone && customer.email;

  return (
    <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 md:p-8">
      <h2 className="font-display text-2xl text-[color:var(--color-text-primary)]">Customer Information</h2>
      <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">Enter your contact details for order updates.</p>

      <div className="mt-6 space-y-5">
        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">Full Name</span>
          <div className="relative">
            <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
            <input
              value={customer.fullName}
              onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
              placeholder="Ayesha Khan"
              className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] py-3.5 pl-11 pr-4 text-sm text-[color:var(--color-text-primary)] outline-none transition-all placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-blue)] focus:ring-4 focus:ring-[color:var(--color-focus-ring)]"
            />
          </div>
        </label>

        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">Phone Number</span>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
            <input
              value={customer.phone}
              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
              placeholder="+92 300 1234567"
              className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] py-3.5 pl-11 pr-4 text-sm text-[color:var(--color-text-primary)] outline-none transition-all placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-blue)] focus:ring-4 focus:ring-[color:var(--color-focus-ring)]"
            />
          </div>
        </label>

        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">Email Address</span>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
            <input
              value={customer.email}
              onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              placeholder="ayesha@example.com"
              type="email"
              className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] py-3.5 pl-11 pr-4 text-sm text-[color:var(--color-text-primary)] outline-none transition-all placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-blue)] focus:ring-4 focus:ring-[color:var(--color-focus-ring)]"
            />
          </div>
        </label>
      </div>

      <button
        type="button"
        disabled={!isComplete}
        onClick={() => isComplete && setStep(2)}
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[color:var(--color-brand-primary)] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-black disabled:bg-[color:var(--color-disabled-bg)] disabled:text-[color:var(--color-disabled-text)]"
      >
        Continue to Shipping
      </button>
    </div>
  );
}
