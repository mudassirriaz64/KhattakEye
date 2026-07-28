import { Shield, Truck, RefreshCw, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/lib/stores/cart-store";
import { Button } from "@/components/primitives/Button";

export function CartSummary() {
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getDiscount = useCartStore((s) => s.getDiscount);
  const getShipping = useCartStore((s) => s.getShipping);
  const getTotal = useCartStore((s) => s.getTotal);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShipping();
  const total = getTotal();

  const trustItems = [
    { icon: Shield, text: "Secure Checkout" },
    { icon: Truck, text: "Free Shipping over Rs. 3,000" },
    { icon: RefreshCw, text: "14-Day Easy Returns" },
    { icon: BadgeCheck, text: "2 Year Warranty" },
  ];

  return (
    <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
      <h3 className="font-display text-xl text-[color:var(--color-text-primary)]">Order Summary</h3>

      <div className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-[color:var(--color-text-secondary)]">Subtotal</span>
          <span className="font-medium text-[color:var(--color-text-primary)]">Rs. {subtotal.toLocaleString()}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-[color:var(--color-accent-teal)]">
            <span>Discount (10%)</span>
            <span>-Rs. {discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-[color:var(--color-text-secondary)]">Shipping</span>
          <span className={shipping === 0 ? "text-[color:var(--color-accent-teal)]" : "text-[color:var(--color-text-primary)]"}>
            {shipping === 0 ? "Free" : `Rs. ${shipping}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[color:var(--color-text-tertiary)]">Estimated Tax</span>
          <span className="text-[color:var(--color-text-tertiary)]">—</span>
        </div>
      </div>

      <div className="mt-5 border-t border-[color:var(--color-border)] pt-5">
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-[color:var(--color-text-primary)]">Total</span>
          <span className="text-xl font-bold text-[color:var(--color-text-primary)]">Rs. {total.toLocaleString()}</span>
        </div>
      </div>

      <Link to="/checkout" className="mt-5 block">
        <Button variant="cta-lg" className="w-full">Proceed to Checkout</Button>
      </Link>

      <div className="mt-5 space-y-3">
        {trustItems.map((item) => (
          <div key={item.text} className="flex items-center gap-3 text-xs text-[color:var(--color-text-tertiary)]">
            <item.icon className="h-3.5 w-3.5 shrink-0 text-[color:var(--color-accent-teal)]" />
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}
