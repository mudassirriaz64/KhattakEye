import { useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useCheckoutStore } from "@/lib/stores/checkout-store";
import { useCartStore } from "@/lib/stores/cart-store";

export function OrderReviewContent() {
  const customer = useCheckoutStore((s) => s.customer);
  const address = useCheckoutStore((s) => s.address);
  const payment = useCheckoutStore((s) => s.payment);
  const agreedToTerms = useCheckoutStore((s) => s.agreedToTerms);
  const setAgreedToTerms = useCheckoutStore((s) => s.setAgreedToTerms);
  const placeOrder = useCheckoutStore((s) => s.placeOrder);
  const orderError = useCheckoutStore((s) => s.orderError);
  const setStep = useCheckoutStore((s) => s.setStep);
  const [submitting, setSubmitting] = useState(false);

  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getDiscount = useCartStore((s) => s.getDiscount);
  const getShipping = useCartStore((s) => s.getShipping);
  const getTotal = useCartStore((s) => s.getTotal);
  const couponCode = useCartStore((s) => s.couponCode);

  const methodLabels: Record<string, string> = {
    "bank-transfer": "Bank Transfer",
    jazzcash: "JazzCash",
    easypaisa: "EasyPaisa",
    cod: "Cash on Delivery",
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 md:p-8">
        <h2 className="font-display text-2xl text-[color:var(--color-text-primary)]">Review Your Order</h2>
        <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">Please review your order before placing it.</p>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">Contact</p>
            <p className="mt-2 text-sm font-medium text-[color:var(--color-text-primary)]">{customer.fullName}</p>
            <p className="text-xs text-[color:var(--color-text-secondary)]">{customer.phone}</p>
            <p className="text-xs text-[color:var(--color-text-secondary)]">{customer.email}</p>
          </div>

          <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">Shipping</p>
            <p className="mt-2 text-sm font-medium text-[color:var(--color-text-primary)]">{address.street}</p>
            <p className="text-xs text-[color:var(--color-text-secondary)]">{address.area}, {address.city}</p>
            <p className="text-xs text-[color:var(--color-text-secondary)]">{address.province} - {address.postalCode}</p>
          </div>

          <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">Payment</p>
            <p className="mt-2 text-sm font-medium text-[color:var(--color-text-primary)]">{payment.method ? methodLabels[payment.method] : "Not selected"}</p>
            {payment.transactionId && <p className="text-xs text-[color:var(--color-text-secondary)]">Txn: {payment.transactionId}</p>}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 md:p-8">
        <h3 className="font-display text-xl text-[color:var(--color-text-primary)]">Items ({items.length})</h3>
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={`${item.productId}-${item.color}`} className="flex items-center gap-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] p-3">
              <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[color:var(--color-text-primary)]">{item.name}</p>
                <p className="text-xs text-[color:var(--color-text-tertiary)]">Qty: {item.quantity} × Rs. {item.price.toLocaleString()}</p>
                {item.customization && (
                  <p className="text-[10px] text-[color:var(--color-brand-primary)] font-bold mt-0.5">
                    Customized Lens: {item.customization.lensType}
                    {item.customization.lensCoating ? ` • ${item.customization.lensCoating}` : ""}
                    {item.customization.usageType ? ` • ${item.customization.usageType}` : ""}
                    {item.customization.tintColor ? ` (${item.customization.tintColor})` : ""}
                  </p>
                )}
              </div>
              <p className="text-sm font-semibold">Rs. {(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-2 border-t border-[color:var(--color-border)] pt-5 text-sm">
          <div className="flex justify-between">
            <span className="text-[color:var(--color-text-secondary)]">Subtotal</span>
            <span className="font-medium">Rs. {getSubtotal().toLocaleString()}</span>
          </div>
          {getDiscount() > 0 && (
            <div className="flex justify-between text-[color:var(--color-accent-teal)]">
              <span>Discount {couponCode && `(${couponCode})`}</span>
              <span>-Rs. {getDiscount().toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-[color:var(--color-text-secondary)]">Shipping</span>
            <span>{getShipping() === 0 ? "Free" : `Rs. ${getShipping()}`}</span>
          </div>
          <div className="flex justify-between border-t border-[color:var(--color-border)] pt-2 text-base font-semibold">
            <span>Total</span>
            <span>Rs. {getTotal().toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[color:var(--color-border-strong)] text-[color:var(--color-brand-primary)] focus:ring-[color:var(--color-accent-teal)]"
          />
          <span className="text-sm text-[color:var(--color-text-secondary)]">
            I agree to the <span className="text-[color:var(--color-accent-teal)]">Terms & Conditions</span> and <span className="text-[color:var(--color-accent-teal)]">Privacy Policy</span>. I confirm that the provided information is accurate.
          </span>
        </label>
      </div>

      {orderError && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{orderError}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button type="button" onClick={() => setStep(3)} disabled={submitting} className="rounded-xl border border-[color:var(--color-border)] px-6 py-3.5 text-sm font-medium text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]">
          Back
        </button>
        <button
          type="button"
          disabled={!agreedToTerms || items.length === 0 || submitting}
          onClick={async () => {
            setSubmitting(true);
            try {
              await placeOrder();
            } catch {
              // error message is stored in the checkout store
            } finally {
              setSubmitting(false);
            }
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[color:var(--color-brand-primary)] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-black disabled:bg-[color:var(--color-disabled-bg)] disabled:text-[color:var(--color-disabled-text)]"
        >
          <CheckCircle2 className="h-4 w-4" />
          {submitting ? "Placing Order…" : `Place Order — Rs. ${getTotal().toLocaleString()}`}
        </button>
      </div>
    </div>
  );
}
